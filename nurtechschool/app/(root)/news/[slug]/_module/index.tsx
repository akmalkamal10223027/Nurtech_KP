"use client";
import CImage from "@/components/custom/c-image";
import { configs } from "@/lib/constants";
import { useNewsDetail } from "@/services/queries/landing";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import CSkeleton from "@/components/custom/c-skeleton";

import { getImageUrl } from "@/lib/utils";

export default function DetailNews({ slug }: { slug: string }) {
  const { respNewsDetail, isLoadingNewsDetail } = useNewsDetail(slug, {
    populate: ["cover", "category", "author", "blocks"],
  });

  if (isLoadingNewsDetail) {
    return (
      <div className="mx-auto max-w-5xl px-4 lg:px-0">
        <div className="flex flex-col items-center gap-6 mb-12">
          <CSkeleton length={1} className="h-6 w-24 rounded-full" />
          <CSkeleton length={1} className="h-12 w-3/4" />
          <CSkeleton length={1} className="h-6 w-48" />
        </div>
        <CSkeleton
          length={1}
          className="aspect-video w-full mb-16 rounded-2xl"
        />
        <div className="flex flex-col gap-4">
          <CSkeleton length={5} className="h-4 w-full" />
        </div>
      </div>
    );
  }

  const coverUrl = getImageUrl(respNewsDetail?.data?.cover?.url);
  const avatarUrl = getImageUrl(respNewsDetail?.data?.author?.avatar?.url);
  const dateObj = respNewsDetail?.data?.createdAt ? new Date(respNewsDetail.data.createdAt) : null;
  const dateFormatted = dateObj && !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "-";

  const articleContent =
    respNewsDetail?.data?.content ||
    respNewsDetail?.data?.description ||
    respNewsDetail?.data?.blocks?.[0]?.body ||
    "";

  return (
    <article className="mx-auto max-w-4xl px-4 lg:px-0">
      {/* Category and Title Header */}
      <header className="flex flex-col items-center gap-6 mb-12">
        {respNewsDetail?.data?.category?.name && (
          <span className="px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold tracking-wide uppercase">
            {respNewsDetail?.data?.category?.name}
          </span>
        )}

        <h1 className="text-3xl lg:text-5xl font-extrabold text-center text-secondary-950 leading-tight">
          {respNewsDetail?.data?.title}
        </h1>

        {/* Author and Post Metadata */}
        <div className="flex items-center gap-4 text-gray-600 mt-2">
          {respNewsDetail?.data?.author && (
            <div className="flex items-center gap-3">
              {avatarUrl && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary-100">
                  <CImage
                    src={avatarUrl}
                    alt={respNewsDetail.data.author.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              )}
              <span className="font-bold text-gray-900">
                {respNewsDetail.data.author.name}
              </span>
            </div>
          )}
          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
          <time className="text-sm font-medium">{dateFormatted}</time>
        </div>
      </header>

      {/* Featured Image */}
      {coverUrl && (
        <div className="relative aspect-video w-full mb-16 rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-200">
          <CImage
            src={coverUrl}
            alt={respNewsDetail?.data?.title || "Featured Image"}
            className="object-cover"
            fill
            unoptimized
            priority
          />
        </div>
      )}

      {/* Article Content */}
      <div className="flex justify-center">
        <div className="w-full max-w-3xl text-[17px] lg:text-[19px] leading-[1.8] text-gray-700 space-y-8 text-justify blog-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {articleContent}
          </ReactMarkdown>
        </div>
      </div>

      {/* Styling for rich text content if not using Tailwind Typography */}
      <style jsx global>{`
        .blog-content h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #004937;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #004937;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .blog-content p {
          margin-bottom: 1.5rem;
        }
        .blog-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .blog-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
        }
        .blog-content blockquote {
          border-left: 4px solid #db9e30;
          padding-left: 1.25rem;
          font-style: italic;
          color: #4b5563;
          margin: 2rem 0;
        }
        .blog-content img {
          border-radius: 0.75rem;
          margin: 2rem 0;
          width: 100%;
        }
        .blog-content strong {
          color: #111827;
          font-weight: 700;
        }
        .blog-content a {
          color: #db9e30;
          text-decoration: underline;
          font-weight: 500;
        }
        .blog-content a:hover {
          color: #bd8624;
        }
      `}</style>
    </article>
  );
}
