import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/types";

export function BlogPreview({
  posts,
  locale,
}: {
  posts: BlogPost[];
  locale: string;
}) {
  const t = useTranslations("blogPreview");

  if (posts.length === 0) return null;

  const displayed = posts.slice(0, 3);
  const [featured, ...rest] = displayed;

  const featuredTitle = locale === "bg" ? featured.title_bg : featured.title_en;
  const featuredContent = locale === "bg" ? featured.content_bg : featured.content_en;
  const featuredExcerpt = featuredContent
    ? featuredContent.replace(/[#*_\[\]]/g, "").slice(0, 200).trim() + "..."
    : "";
  const featuredDate = featured.published_at
    ? new Date(featured.published_at).toLocaleDateString(
        locale === "bg" ? "bg-BG" : "en-GB",
        { year: "numeric", month: "long", day: "numeric" }
      )
    : "";

  return (
    <section className="w-full px-6 py-16">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="mb-10 text-center text-2xl font-bold text-navy md:text-3xl">
          {t("title")}
        </h2>

        {/* Staggered: large featured card + smaller cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {/* Featured post — large card */}
          <Link
            href={`/blog/${featured.slug}`}
            className="group flex flex-col justify-between rounded-2xl border border-border p-8 transition-colors hover:border-navy/20 md:col-span-3"
          >
            {featuredDate && (
              <p className="mb-3 text-xs text-muted">{featuredDate}</p>
            )}
            <h3 className="text-lg font-bold text-navy group-hover:text-navy/80">
              {featuredTitle}
            </h3>
            {featuredExcerpt && (
              <p className="mt-3 flex-1 text-sm leading-relaxed text-secondary">
                {featuredExcerpt}
              </p>
            )}
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
              {t("readMore")}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          </Link>

          {/* Smaller posts stacked on right */}
          <div className="flex flex-col gap-4 md:col-span-2">
            {rest.map((post) => {
              const title = locale === "bg" ? post.title_bg : post.title_en;
              const content = locale === "bg" ? post.content_bg : post.content_en;
              const excerpt = content
                ? content.replace(/[#*_\[\]]/g, "").slice(0, 100).trim() + "..."
                : "";
              const date = post.published_at
                ? new Date(post.published_at).toLocaleDateString(
                    locale === "bg" ? "bg-BG" : "en-GB",
                    { year: "numeric", month: "long", day: "numeric" }
                  )
                : "";

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-1 flex-col rounded-2xl border border-border p-6 transition-colors hover:border-navy/20"
                >
                  {date && (
                    <p className="mb-2 text-xs text-muted">{date}</p>
                  )}
                  <h3 className="text-base font-semibold text-navy group-hover:text-navy/80">
                    {title}
                  </h3>
                  {excerpt && (
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-secondary">
                      {excerpt}
                    </p>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
                    {t("readMore")}
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-navy transition-colors hover:text-navy/70"
          >
            {t("viewAll")}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
