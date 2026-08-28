"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useCategory, useNews } from "@/services/queries/landing";
import { Mapper } from "@/components/mapper";
import CTabs from "@/components/custom/c-tabs";
import CSearchWrapper from "@/components/custom/c-search-wrapper";
import NewsCard from "@/app/(root)/(homepage)/_module/news/news-card";

export default function Content() {
  const { respCategory: category } = useCategory();
  const [activeTab, setActiveTab] = useState("berita");
  const [searchValue, setSearchValue] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

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

  const allNews = useMemo(() => {
    return respNews?.data || [];
  }, [respNews?.data]);

  const filteredNews = useMemo(() => {
    if (!searchValue.trim()) return allNews;
    const query = searchValue.toLowerCase().trim();
    return allNews.filter((item: any) => {
      const titleMatch = item?.title?.toLowerCase().includes(query);
      const descMatch = item?.description?.toLowerCase().includes(query);
      return titleMatch || descMatch;
    });
  }, [allNews, searchValue]);

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = useMemo(() => {
    return filteredNews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNews, startIndex, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchValue, itemsPerPage]);

  const tabs = category?.map((item) => ({
    label: item?.name,
    value: item?.slug,
  })) || [];

  return (
    <div className="flex flex-col gap-6 sm:gap-10 w-full px-2 sm:px-0">
      {/* Premium Tabs */}
      <CTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(value) => setActiveTab(value)}
        variant="pills"
      />

      <CSearchWrapper
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari berita & artikel..."
        numberValue={itemsPerPage}
        onNumberChange={setItemsPerPage}
        numberMin={3}
        numberMax={24}
        numberLabel="Tampilkan"
        numberLabel2="Konten"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={isLoadingNews}
      >
        <Mapper
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          data={paginatedNews}
          isLoading={isLoadingNews}
          skeletonCount={itemsPerPage}
          skeletonClassName="h-full w-full min-h-[300px]"
          render={(item: any) => (
            <div
              key={`${activeTab}-${item.id}`}
              className="transition-all duration-500 animate-in fade-in slide-in-from-bottom-5 h-full"
            >
              <NewsCard item={item} />
            </div>
          )}
        />
      </CSearchWrapper>
    </div>
  );
}
