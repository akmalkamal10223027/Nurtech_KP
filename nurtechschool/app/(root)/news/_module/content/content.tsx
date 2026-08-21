"use client";
import { useState } from "react";
import { useCategory, useNews } from "@/services/queries/landing";
import { Mapper } from "@/components/mapper";
import CTabs from "@/components/custom/c-tabs";
import NewsCard from "@/app/(root)/(homepage)/_module/news/news-card";

export default function Content() {
  const { respCategory: category } = useCategory();
  const [activeTab, setActiveTab] = useState(category?.[0]?.slug || "berita");

  const params = {
    filters: {
      category: {
        slug: {
          $eq: activeTab,
        },
      },
    },
    populate: {
      cover: true,
      category: true,
      author: {
        populate: ["avatar"],
      },
    },
  };

  const { respNews, isLoadingNews } = useNews(params);

  const tabs = category?.map((item) => ({
    label: item?.name,
    value: item?.slug,
  }));

  return (
    <div className="flex flex-col gap-6 sm:gap-10 w-full px-2 sm:px-0">
      {/* Premium Tabs */}
      <CTabs
        tabs={tabs || []}
        activeTab={activeTab}
        onTabChange={(value) => setActiveTab(value)}
        variant="pills"
      />

      <Mapper
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        data={respNews?.data}
        isLoading={isLoadingNews}
        skeletonCount={3}
        skeletonClassName="h-full w-full"
        render={(item) => (
          <div
            key={`${activeTab}-${item.id}`}
            className="transition-all duration-500 animate-in fade-in slide-in-from-bottom-5 h-full"
          >
            <NewsCard item={item} />
          </div>
        )}
      />
    </div>
  );
}
