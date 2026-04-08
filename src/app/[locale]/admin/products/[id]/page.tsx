"use client";

import { useEffect, useState, use } from "react";
import { useAdmin } from "@/lib/store/admin";
import { useRouter, Link } from "@/i18n/navigation";
import { ArrowLeft, Save, Trash2, CheckCircle } from "lucide-react";
import type { Product } from "@/lib/types";

const FORM_OPTIONS = [
  { value: "lyophilized", label: "Lyophilized" },
  { value: "solution", label: "Solution" },
  { value: "nasal_spray", label: "Nasal Spray" },
  { value: "capsule", label: "Capsule" },
  { value: "accessory", label: "Accessory" },
] as const;

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "archived", label: "Archived" },
] as const;

const inputClass =
  "w-full rounded-lg border border-border px-4 py-3 text-sm text-navy placeholder:text-muted focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy";
const labelClass = "block text-sm font-medium text-navy mb-1.5";
const sectionClass = "border border-border rounded-lg p-6 mb-6";
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

  // Form fields
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
        const data: Product = await res.json();
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
      }
    } catch {
      // Network error
    } finally {
      setLoading(false);
    }
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
        alert("Invalid JSON in scientific data field");
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
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProduct(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // Error silently
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
      // Error silently
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  if (!isAuthenticated()) return null;

  if (loading) {
    return (
      <div className="py-12 text-center text-muted text-sm">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-muted text-sm">Product not found</p>
        <Link
          href="/admin/products"
          className="text-sm text-accent hover:text-accent/80"
        >
          Back to products
        </Link>
      </div>
    );
  }

  const slugPreview = slug || slugify(name);

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="text-secondary hover:text-navy transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-navy">Edit Product</h1>
          <p className="text-sm text-muted mt-0.5 font-mono">{product.id}</p>
        </div>
      </div>

      {/* Section 1: Basic Info */}
      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Basic Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Name</label>
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
              placeholder="Product name"
            />
          </div>
          <div>
            <label className={labelClass}>Name BG</label>
            <input
              type="text"
              value={nameBg}
              onChange={(e) => setNameBg(e.target.value)}
              className={inputClass}
              placeholder="Product name in Bulgarian"
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
              placeholder="auto-generated"
            />
            {slugPreview && (
              <p className="mt-1 text-xs text-muted font-mono">
                /shop/{slugPreview}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Pricing */}
      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Price BGN</label>
            <input
              type="number"
              step="0.01"
              value={priceBgn}
              onChange={(e) => setPriceBgn(e.target.value)}
              className={`${inputClass} font-mono`}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className={labelClass}>Price EUR</label>
            <input
              type="number"
              step="0.01"
              value={priceEur}
              onChange={(e) => setPriceEur(e.target.value)}
              className={`${inputClass} font-mono`}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Details */}
      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Vial Size (mg)</label>
            <input
              type="number"
              value={vialSizeMg}
              onChange={(e) => setVialSizeMg(e.target.value)}
              className={inputClass}
              placeholder="e.g. 5"
            />
          </div>
          <div>
            <label className={labelClass}>Form</label>
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
            <label className={labelClass}>Purity %</label>
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
            <label className={labelClass}>Molecular Weight</label>
            <input
              type="number"
              step="0.01"
              value={molecularWeight}
              onChange={(e) => setMolecularWeight(e.target.value)}
              className={inputClass}
              placeholder="Optional"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Description */}
      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Description</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Description BG</label>
            <textarea
              rows={4}
              value={descriptionBg}
              onChange={(e) => setDescriptionBg(e.target.value)}
              className={inputClass}
              placeholder="Product description in Bulgarian"
            />
          </div>
          <div>
            <label className={labelClass}>Description EN</label>
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

      {/* Section 5: Status & Stock */}
      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Status & Stock</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Status</label>
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
            <label className={labelClass}>Stock</label>
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
            Is Bestseller
          </label>
          <label className="flex items-center gap-2 text-sm text-navy cursor-pointer">
            <input
              type="checkbox"
              checked={isBlend}
              onChange={(e) => setIsBlend(e.target.checked)}
              className="rounded border-border text-navy focus:ring-navy"
            />
            Is Blend
          </label>
        </div>
      </div>

      {/* Section 6: Scientific Data */}
      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Scientific Data</h2>
        <div>
          <label className={labelClass}>Raw JSON</label>
          <textarea
            rows={6}
            value={scientificDataJson}
            onChange={(e) => setScientificDataJson(e.target.value)}
            className={`${inputClass} font-mono text-xs`}
            placeholder='{"mechanism": "...", "half_life": "...", "storage": "...", "pubmed_links": []}'
          />
          <p className="mt-1 text-xs text-muted">
            Optional. Must be valid JSON if provided.
          </p>
        </div>
      </div>

      {/* Actions */}
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
            ? "Archiving..."
            : confirmDelete
              ? "Confirm Archive"
              : "Archive Product"}
        </button>

        <button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="inline-flex items-center gap-1.5 bg-navy text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saved ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
