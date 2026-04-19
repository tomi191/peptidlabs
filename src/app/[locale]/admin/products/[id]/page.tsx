"use client";

import { useEffect, useState, use, useRef } from "react";
import { useAdmin } from "@/lib/store/admin";
import { useRouter, Link } from "@/i18n/navigation";
import { ArrowLeft, Save, Trash2, CheckCircle, Upload, X, ImagePlus } from "lucide-react";
import type { Product } from "@/lib/types";

const FORM_OPTIONS = [
  { value: "lyophilized", label: "Лиофилизиран" },
  { value: "solution", label: "Разтвор" },
  { value: "nasal_spray", label: "Назален спрей" },
  { value: "capsule", label: "Капсула" },
  { value: "accessory", label: "Аксесоар" },
] as const;

const STATUS_OPTIONS = [
  { value: "draft", label: "Чернова" },
  { value: "published", label: "Публикуван" },
  { value: "out_of_stock", label: "Изчерпан" },
  { value: "archived", label: "Архивиран" },
] as const;

const inputClass =
  "w-full rounded-lg border border-border px-4 py-3 text-sm text-navy placeholder:text-muted focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy";
const labelClass = "block text-sm font-medium text-navy mb-1.5";
const sectionClass = "bg-white border border-border rounded-lg p-6 mb-5";
const sectionTitleClass = "text-base font-semibold text-navy mb-4";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { token, isAuthenticated } = useAdmin();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Галерия
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Полета на формата
  const [name, setName] = useState("");
  const [nameBg, setNameBg] = useState("");
  const [sku, setSku] = useState("");
  const [slug, setSlug] = useState("");
  const [priceBgn, setPriceBgn] = useState("");
  const [priceEur, setPriceEur] = useState("");
  const [vialSizeMg, setVialSizeMg] = useState("");
  const [form, setForm] = useState("lyophilized");
  const [purityPercent, setPurityPercent] = useState("");
  const [molecularWeight, setMolecularWeight] = useState("");
  const [descriptionBg, setDescriptionBg] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [status, setStatus] = useState("draft");
  const [stock, setStock] = useState("");
  const [isBestseller, setIsBestseller] = useState(false);
  const [isBlend, setIsBlend] = useState(false);
  const [scientificDataJson, setScientificDataJson] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin");
      return;
    }
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchProduct() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (!json?.success) return;
        const data: Product = json.data;
        setProduct(data);
        setName(data.name);
        setNameBg(data.name_bg ?? "");
        setSku(data.sku);
        setSlug(data.slug);
        setPriceBgn(String(data.price_bgn));
        setPriceEur(String(data.price_eur));
        setVialSizeMg(data.vial_size_mg ? String(data.vial_size_mg) : "");
        setForm(data.form);
        setPurityPercent(String(data.purity_percent));
        setMolecularWeight(
          data.molecular_weight ? String(data.molecular_weight) : ""
        );
        setDescriptionBg(data.description_bg ?? "");
        setDescriptionEn(data.description_en ?? "");
        setStatus(data.status);
        setStock(String(data.stock));
        setIsBestseller(data.is_bestseller);
        setIsBlend(data.is_blend);
        setScientificDataJson(
          Object.keys(data.scientific_data).length > 0
            ? JSON.stringify(data.scientific_data, null, 2)
            : ""
        );
        setImages(Array.isArray(data.images) ? data.images : []);
      }
    } catch {
      // мрежова грешка
    } finally {
      setLoading(false);
    }
  }

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.success) {
          const newImages = [...images, json.data.url];
          setImages(newImages);
          await saveImages(newImages);
        }
      }
    } catch {
      // грешка при качване
    } finally {
      setUploading(false);
    }
  }

  async function saveImages(imageUrls: string[]) {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ images: imageUrls }),
    });
  }

  async function removeImage(url: string) {
    const newImages = images.filter((img) => img !== url);
    setImages(newImages);
    await saveImages(newImages);
  }

  function handleFileInput(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => uploadFile(file));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFileInput(e.dataTransfer.files);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    let scientificData = {};
    if (scientificDataJson.trim()) {
      try {
        scientificData = JSON.parse(scientificDataJson);
      } catch {
        setSaving(false);
        alert("Невалиден JSON в полето за научни данни");
        return;
      }
    }

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          name_bg: nameBg || null,
          sku,
          slug: slug || slugify(name),
          price_bgn: Number(priceBgn),
          price_eur: Number(priceEur),
          vial_size_mg: vialSizeMg ? Number(vialSizeMg) : null,
          form,
          purity_percent: Number(purityPercent),
          molecular_weight: molecularWeight ? Number(molecularWeight) : null,
          description_bg: descriptionBg || null,
          description_en: descriptionEn || null,
          status,
          stock: Number(stock),
          is_bestseller: isBestseller,
          is_blend: isBlend,
          scientific_data: scientificData,
          images,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.success) {
          setProduct(json.data);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }
      }
    } catch {
      // грешка
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        router.push("/admin/products");
      }
    } catch {
      // грешка
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  if (!isAuthenticated()) return null;

  if (loading) {
    return (
      <div className="py-12 text-center text-muted text-sm">Зареждане...</div>
    );
  }

  if (!product) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-muted text-sm">Продуктът не е намерен</p>
        <Link href="/admin/products" className="text-sm text-accent hover:text-accent/80">
          Назад към продуктите
        </Link>
      </div>
    );
  }

  const slugPreview = slug || slugify(name);

  return (
    <div className="max-w-3xl">
      {/* Заглавие */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-secondary hover:text-navy transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-navy">Редактиране на продукт</h1>
          <p className="text-sm text-muted mt-0.5 font-mono">{product.id}</p>
        </div>
      </div>

      {/* Галерия со снимки */}
      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Снимки</h2>

        {/* Качени снимки */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
            {images.map((url, i) => (
              <div key={url} className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Снимка ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(url)}
                  className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 bg-navy/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                    Главна
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Зона за качване */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-navy bg-navy/5"
              : "border-border hover:border-navy/40 hover:bg-surface"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => handleFileInput(e.target.files)}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-navy animate-bounce" />
              <p className="text-sm text-navy font-medium">Качване...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImagePlus className="h-8 w-8 text-muted" />
              <p className="text-sm text-navy font-medium">
                Плъзнете снимки тук или кликнете за избор
              </p>
              <p className="text-xs text-muted">JPG, PNG, WebP — макс. 5MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Основна информация */}
      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Основна информация</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Наименование</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slug || slug === slugify(product.name)) {
                  setSlug(slugify(e.target.value));
                }
              }}
              className={inputClass}
              placeholder="Наименование на продукта"
            />
          </div>
          <div>
            <label className={labelClass}>Наименование (BG)</label>
            <input
              type="text"
              value={nameBg}
              onChange={(e) => setNameBg(e.target.value)}
              className={inputClass}
              placeholder="Наименование на български"
            />
          </div>
          <div>
            <label className={labelClass}>SKU</label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className={`${inputClass} font-mono`}
              placeholder="PLB-XXX-XXX"
            />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={`${inputClass} font-mono`}
              placeholder="авто-генериран"
            />
            {slugPreview && (
              <p className="mt-1 text-xs text-muted font-mono">
                /shop/{slugPreview}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Цени */}
      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Цени</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Цена EUR (€)</label>
            <input
              type="number"
              step="0.01"
              value={priceEur}
              onChange={(e) => setPriceEur(e.target.value)}
              className={`${inputClass} font-mono`}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className={labelClass}>Цена BGN (лв.)</label>
            <input
              type="number"
              step="0.01"
              value={priceBgn}
              onChange={(e) => setPriceBgn(e.target.value)}
              className={`${inputClass} font-mono`}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Технически параметри */}
      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Технически параметри</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Размер на флакон (mg)</label>
            <input
              type="number"
              value={vialSizeMg}
              onChange={(e) => setVialSizeMg(e.target.value)}
              className={inputClass}
              placeholder="напр. 5"
            />
          </div>
          <div>
            <label className={labelClass}>Форма</label>
            <select
              value={form}
              onChange={(e) => setForm(e.target.value)}
              className={inputClass}
            >
              {FORM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Чистота %</label>
            <input
              type="number"
              step="0.1"
              value={purityPercent}
              onChange={(e) => setPurityPercent(e.target.value)}
              className={inputClass}
              placeholder="98"
            />
          </div>
          <div>
            <label className={labelClass}>Молекулно тегло</label>
            <input
              type="number"
              step="0.01"
              value={molecularWeight}
              onChange={(e) => setMolecularWeight(e.target.value)}
              className={inputClass}
              placeholder="По желание"
            />
          </div>
        </div>
      </div>

      {/* Описание */}
      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Описание</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Описание (BG)</label>
            <textarea
              rows={4}
              value={descriptionBg}
              onChange={(e) => setDescriptionBg(e.target.value)}
              className={inputClass}
              placeholder="Описание на продукта на български"
            />
          </div>
          <div>
            <label className={labelClass}>Описание (EN)</label>
            <textarea
              rows={4}
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              className={inputClass}
              placeholder="Product description in English"
            />
          </div>
        </div>
      </div>

      {/* Статус и наличност */}
      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Статус и наличност</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Статус</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Наличност (бр.)</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className={inputClass}
              placeholder="0"
            />
          </div>
        </div>
        <div className="flex gap-6 mt-4">
          <label className="flex items-center gap-2 text-sm text-navy cursor-pointer">
            <input
              type="checkbox"
              checked={isBestseller}
              onChange={(e) => setIsBestseller(e.target.checked)}
              className="rounded border-border text-navy focus:ring-navy"
            />
            Топ продукт
          </label>
          <label className="flex items-center gap-2 text-sm text-navy cursor-pointer">
            <input
              type="checkbox"
              checked={isBlend}
              onChange={(e) => setIsBlend(e.target.checked)}
              className="rounded border-border text-navy focus:ring-navy"
            />
            Смес (blend)
          </label>
        </div>
      </div>

      {/* Научни данни */}
      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Научни данни (JSON)</h2>
        <div>
          <textarea
            rows={6}
            value={scientificDataJson}
            onChange={(e) => setScientificDataJson(e.target.value)}
            className={`${inputClass} font-mono text-xs`}
            placeholder='{"mechanism": "...", "half_life": "...", "storage": "...", "pubmed_links": []}'
          />
          <p className="mt-1 text-xs text-muted">
            По желание. Трябва да е валиден JSON.
          </p>
        </div>
      </div>

      {/* Действия */}
      <div className="flex items-center justify-between pt-2 pb-8">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className={`inline-flex items-center gap-1.5 text-sm font-medium border rounded-lg px-4 py-2.5 transition-colors ${
            confirmDelete
              ? "text-white bg-red-500 border-red-500 hover:bg-red-600"
              : "text-red-500 border-red-200 hover:bg-red-50"
          }`}
        >
          <Trash2 className="h-4 w-4" />
          {deleting
            ? "Архивиране..."
            : confirmDelete
              ? "Потвърди архивиране"
              : "Архивирай"}
        </button>

        <button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="inline-flex items-center gap-1.5 bg-navy text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saved ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Запазено
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {saving ? "Запазване..." : "Запази промените"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
