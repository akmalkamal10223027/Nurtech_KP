"use client";

import { useState } from "react";
import NewsCard from "./news-card";
import { useCategory, useNews } from "@/services/queries/landing";
import { Mapper } from "@/components/mapper";
import CTabs from "@/components/custom/c-tabs";

export default function ListNews() {
  const { respCategory: category } = useCategory();

  const [activeTab, setActiveTab] = useState("berita");

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
    pagination: {
      limit: 3,
    },
  };

  const { respNews, isLoadingNews } = useNews(params);

  const tabs =
    category?.map((item) => ({
      label: item.name,
      value: item.slug,
    })) || [];

  return (
    <div className="flex flex-col gap-10">
      <CTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="pills"
      />

      <Mapper
        className="
          flex overflow-x-auto gap-4 px-4 pb-3 snap-x snap-mandatory no-scrollbar
          [&>li]:w-[78%] [&>li]:shrink-0 [&>li]:snap-start
          sm:[&>li]:w-[58%]
          md:[&>li]:w-[44%]
          lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-0
          lg:[&>li]:w-full lg:[&>li]:shrink
        "
        data={respNews?.data}
        keyBy={(item) => `${activeTab}-${item.id}`}
        isLoading={isLoadingNews}
        skeletonCount={3}
        skeletonClassName="h-72 w-[78%] shrink-0 sm:w-[58%] md:w-[44%] lg:h-80 lg:w-full"
        render={(item) => <NewsCard item={item} />}
      />
    </div>
  );
}
