"use client";

import React, { useState } from "react";
import CSearchWrapper from "@/components/custom/c-search-wrapper";
import { useGalleryActivity } from "@/services/queries/landing";
import { configs } from "@/lib/constants";
import { Mapper } from "@/components/mapper";
import CardActivity from "@/app/(root)/(homepage)/_module/activity/card-activity";
import { useDebounce } from "@/lib/hook";
import { getImageUrl } from "@/lib/utils";

export default function Content() {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 300);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  const { respGalleryActivity, isLoadingGalleryActivity } =
    useGalleryActivity();

  const allItems = React.useMemo(() => {
    return respGalleryActivity?.data || [];
  }, [respGalleryActivity?.data]);

  // Synchronized search & month filtering
  const filteredItems = React.useMemo(() => {
    return allItems.filter((item) => {
      // 1. Search Query Filter (Title & Description)
      if (debouncedSearchValue.trim()) {
        const query = debouncedSearchValue.toLowerCase().trim();
        const titleMatch = item?.title?.toLowerCase().includes(query);
        const descMatch = item?.description?.toLowerCase().includes(query);
        if (!titleMatch && !descMatch) return false;
      }

      // 2. Month Filter
      if (selectedMonth && selectedMonth !== "all") {
        if (!item?.createdAt) return false;
        const itemDate = new Date(item.createdAt);
        if (isNaN(itemDate.getTime())) return false;

        const itemMonth = (itemDate.getMonth() + 1).toString().padStart(2, "0");
        if (itemMonth !== selectedMonth) return false;
      }

      return true;
    });
  }, [allItems, debouncedSearchValue, selectedMonth]);

  // Client-side pagination
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Reset to page 1 whenever search query or month filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchValue, selectedMonth, itemsPerPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = React.useMemo(() => {
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, startIndex, itemsPerPage]);

  return (
    <section className="container max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <CSearchWrapper
        // Search props
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari kegiatan..."
        // Month dropdown props
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        // Number input props
        numberValue={itemsPerPage}
        onNumberChange={setItemsPerPage}
        numberMin={4}
        numberMax={24}
        numberLabel="Tampilkan"
        numberLabel2="Entry"
        // Pagination props
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      >
        {/* Your gallery content here */}
        <Mapper
          isLoading={isLoadingGalleryActivity}
          data={paginatedItems}
          skeletonCount={itemsPerPage}
          skeletonClassName="h-[220px] w-full sm:h-[300px] rounded-xl sm:rounded-3xl"
          className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-6 lg:grid-cols-3 xl:grid-cols-4"
          render={(item) => {
            const thumbnailUrl =
              typeof item?.thumbnail === "string"
                ? item.thumbnail
                : item?.thumbnail?.url;
            const imageUrl = getImageUrl(thumbnailUrl);
            return (
              <CardActivity
                key={item?.id || item?.documentId}
                title={item?.title}
                description={item?.description}
                image={imageUrl}
                createdAt={item?.createdAt}
                id={item?.documentId}
              />
            );
          }}
        />
      </CSearchWrapper>
    </section>
  );
}
