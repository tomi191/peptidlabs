import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail, MessageCircle } from "lucide-react";

const shopLinks = [
  { label: "healing", href: "/shop/healing" },
  { label: "weightLoss", href: "/shop/weight-loss" },
  { label: "ghMuscle", href: "/shop/gh-muscle" },
  { label: "nootropic", href: "/shop/nootropic" },
  { label: "antiAging", href: "/shop/anti-aging" },
  { label: "accessories", href: "/shop/accessories" },
] as const;

const infoLinks = [
  { label: "delivery", href: "/delivery" },
  { label: "returns", href: "/returns" },
  { label: "faq", href: "/faq" },
  { label: "contactUs", href: "/contact" },
] as const;

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-surface border-t border-border">
      {/* Main section */}
      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 — Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-navy rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-semibold leading-none">
                  P
                </span>
              </div>
              <span className="font-semibold tracking-widest text-navy text-sm">
                PEPTIDELAB
              </span>
            </Link>
            <p className="text-secondary text-sm">{t("description")}</p>
          </div>

          {/* Column 2 — Shop */}
          <div>
            <h3 className="text-navy font-semibold text-sm mb-3">
              {t("shop")}
            </h3>
            <ul className="flex flex-col gap-2">
              {shopLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-secondary text-sm hover:text-navy transition-colors"
                  >
                    {t(label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Information */}
          <div>
            <h3 className="text-navy font-semibold text-sm mb-3">
              {t("information")}
            </h3>
            <ul className="flex flex-col gap-2">
              {infoLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-secondary text-sm hover:text-navy transition-colors"
                  >
                    {t(label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h3 className="text-navy font-semibold text-sm mb-3">
              {t("contact")}
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="mailto:info@peptidelab.bg"
                  className="text-secondary text-sm hover:text-navy transition-colors inline-flex items-center gap-2"
                >
                  <Mail size={16} strokeWidth={1.5} />
                  info@peptidelab.bg
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/message/peptidelab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary text-sm hover:text-navy transition-colors inline-flex items-center gap-2"
                >
                  <MessageCircle size={16} strokeWidth={1.5} />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer bar */}
      <div className="border-t border-border py-4 px-6 text-center">
        <p className="text-muted text-xs">{t("disclaimer")}</p>
        <p className="text-muted text-xs mt-1">{t("copyright")}</p>
      </div>
    </footer>
  );
}
