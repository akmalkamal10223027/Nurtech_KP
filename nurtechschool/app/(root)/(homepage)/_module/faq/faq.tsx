"use client";

import { useState } from "react";
import { Star } from "@/lib/image";
import Image from "next/image";
import { useFAQ } from "@/services/queries/landing";

export default function FAQ() {
  const { respFAQ, isLoadingFAQ } = useFAQ();
  const [openId, setOpenId] = useState<number | null>(null);

  const faqs = respFAQ?.data || [];

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  if (isLoadingFAQ) {
    return (
      <section
        id="faq"
        className="py-16 sm:py-20 flex justify-center px-3 sm:px-0"
      >
        <div className="container relative flex flex-col items-center justify-center">
          <Image
            src="/images/icon/card-top.svg"
            alt="FAQ Card Top"
            width={532}
            height={209}
            className="absolute -top-10 w-[78%] max-w-[360px] sm:-top-20 sm:max-w-[532px]"
          />
          <div className="z-20 w-full rounded-2xl bg-[#004937] bg-[url('/images/icon/registration-card.svg')] bg-[length:100%_auto] bg-top bg-no-repeat px-4 py-10 text-white shadow-xl sm:px-8 md:px-12 lg:px-16 flex flex-col items-center">
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-5 mb-10 sm:mb-12 w-full">
              <div className="size-12 sm:size-[75px] rounded-full bg-white/10 animate-pulse" />
              <div className="h-8 w-64 rounded-lg bg-white/10 animate-pulse" />
              <div className="h-4 w-80 rounded-lg bg-white/10 animate-pulse" />
            </div>
            <div className="flex flex-col gap-4 w-full">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-16 w-full rounded-2xl bg-white/10 animate-pulse"
                />
              ))}
            </div>
          </div>
          <Image
            src="/images/icon/card-bottom.svg"
            alt="FAQ Card Bottom"
            width={310}
            height={209}
            className="absolute -bottom-9 w-[46%] max-w-[190px] sm:-bottom-15 sm:max-w-[310px]"
          />
        </div>
      </section>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section
      id="faq"
      className="py-16 sm:py-20 flex justify-center px-3 sm:px-0"
    >
      <div className="container relative flex flex-col items-center justify-center">
        <Image
          src="/images/icon/card-top.svg"
          alt="FAQ Card Top"
          width={532}
          height={209}
          className="absolute -top-10 w-[78%] max-w-[360px] sm:-top-20 sm:max-w-[532px]"
        />
        <div className="z-20 w-full rounded-2xl bg-[#004937] bg-[url('/images/icon/registration-card.svg')] bg-[length:100%_auto] bg-top bg-no-repeat px-4 py-10 text-white shadow-xl sm:px-8 md:px-12 lg:px-16 flex flex-col items-center">
          {/* Header */}
          <div className="flex flex-col items-center justify-center gap-3 sm:gap-5 mb-10 sm:mb-12">
            <Image
              src={Star}
              alt="Star"
              width={75}
              height={75}
              className="z-20 size-12 sm:size-[75px]"
            />
            <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold font-serif z-20 leading-tight">
              Pertanyaan Umum (FAQ)
            </h2>
            <p className="max-w-2xl px-4 text-center text-sm sm:text-base md:text-lg font-medium leading-relaxed text-white/80">
              Jawaban cepat untuk keraguan yang mungkin Anda miliki sebelum
              mendaftar.
            </p>
          </div>

          {/* FAQ Items - Accordion */}
          <div className="flex flex-col gap-4 w-full">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`bg-white/10 backdrop-blur-sm rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-[#E9D167] bg-white/15 shadow-lg"
                      : "border-white/10 hover:border-[#E9D167]/40 hover:bg-white/15"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    className="w-full px-6 py-5 flex items-center justify-between text-left group cursor-pointer"
                  >
                    <span
                      className={`font-semibold text-base md:text-lg transition-colors duration-300 ${
                        isOpen
                          ? "text-[#E9D167]"
                          : "text-white group-hover:text-[#E9D167]"
                      }`}
                    >
                      {faq.question}
                    </span>

                    <div
                      className={`shrink-0 ml-4 size-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isOpen
                          ? "bg-[#E9D167] text-[#004937] rotate-180"
                          : "bg-white/10 text-white group-hover:bg-[#E9D167] group-hover:text-[#004937]"
                      }`}
                    >
                      <svg
                        className="size-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  <div
                    id={`faq-answer-${faq.id}`}
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-5 pt-0">
                        <div className="border-t border-white/15 pt-4">
                          <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Image
          src="/images/icon/card-bottom.svg"
          alt="FAQ Card Bottom"
          width={310}
          height={209}
          className="absolute -bottom-9 w-[46%] max-w-[190px] sm:-bottom-15 sm:max-w-[310px]"
        />
      </div>
    </section>
  );
}
