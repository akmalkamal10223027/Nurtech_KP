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
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const query = {
    populate: ["gallery", "thumbnail"],

    filters: {
      ...(debouncedSearchValue && {
        title: {
          $containsi: debouncedSearchValue,
        },
      }),

      ...(selectedMonth !== "all" &&
        selectedMonth && {
          createdAt: {
            $between: [
              `${new Date().getFullYear()}-${selectedMonth}-01`,
              `${new Date().getFullYear()}-${selectedMonth}-31`,
            ],
          },
        }),
    },

    pagination: {
      page: currentPage,
      pageSize: itemsPerPage,
    },
  };
  const { respGalleryActivity, metaGalleryActivity, isLoadingGalleryActivity } =
    useGalleryActivity(query);

  const totalPages = metaGalleryActivity?.pagination?.pageCount || 0;
  const baseImage = configs.BASE_IMAGE || "";

  return (
    <section className="container px-3 py-6 sm:px-4 sm:py-10 lg:px-6 lg:py-12">
      <CSearchWrapper
        // Search props
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari"
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
          data={respGalleryActivity?.data}
          skeletonCount={itemsPerPage}
          skeletonClassName="h-[300px] w-full sm:h-[350px]"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
          render={(item) => {
            const thumbnailUrl =
              typeof item?.thumbnail === "string"
                ? item.thumbnail
                : item?.thumbnail?.url;
            const imageUrl = getImageUrl(thumbnailUrl);
            return (
              <CardActivity
                key={item?.id}
                title={item?.title}
                description={item?.description}
                image={imageUrl}
                createdAt={item?.createdAt}
                id={item?.documentId}
              />
            );
          }}
        />

        {/* Debug Info (optional - remove in production) */}
        {/* <div className="mt-6 p-4 bg-secondary-500/5 rounded-lg text-sm space-y-1">
          <p>
            <strong>Search:</strong> {searchValue || "(kosong)"}
          </p>
          <p>
            <strong>Bulan:</strong> {selectedMonth}
          </p>
          <p>
            <strong>Items per page:</strong> {itemsPerPage}
          </p>
          <p>
            <strong>Current page:</strong> {currentPage} / {totalPages}
          </p>
        </div> */}
      </CSearchWrapper>
    </section>
  );
}
