"use client";

import { useState, useEffect } from "react";

interface FeatureItem {
  id: number;
  featureTitle: string;
  featureDescription: string;
}

interface Stakeholder {
  id: number;
  stakeholderName: string;
  icon: string | null;
  featureitem?: FeatureItem[];
}

interface Image {
  id: number;
  url: string;
  alternativeText?: string;
}

interface AppSectionData {
  id: number;
  documentId: string;
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  images: Image[] | null;
  Stakeholder: Stakeholder[] | null;
  appStoreLink: string;
  googlePlayLink: string;
}

const getStrapiMediaUrl = (url: string | null | undefined, apiUrl: string) => {
  if (!url) return "/placeholder.jpg";
  if (url.startsWith("http")) return url;
  return `${apiUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function AppSection() {
  const [data, setData] = useState<AppSectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

  useEffect(() => {
    const query =
      "populate[images][populate]=*" +
      "&populate[Stakeholder][populate][featureitem][populate]=*";

    fetch(`${apiUrl}/api/app-sections?${query}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.data && result.data.length > 0) {
          setData(result.data[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching app section:", err);
        setLoading(false);
      });
  }, [apiUrl]);

  useEffect(() => {
    if (!data?.images || data.images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.images!.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [data?.images]);

  if (loading) {
    return (
      <section className="py-10 bg-secondary-500 flex justify-center items-center min-h-[200px] rounded-2xl sm:rounded-3xl">
        <div className="text-white font-primary font-semibold animate-pulse">
          Memuat konten...
        </div>
      </section>
    );
  }

  if (!data) return null;

  const stakeholders = data.Stakeholder || [];
  const parentStakeholder =
    stakeholders.find((s) =>
      s.stakeholderName?.toLowerCase().includes("orang tua"),
    ) || stakeholders[0];

  const features = parentStakeholder?.featureitem || [];
  const currentFeature =
    features.length > 0 ? features[currentSlide % features.length] : null;

  const renderFeatureCard = () => {
    if (currentFeature) {
      return (
        <div
          key={currentFeature.id}
          className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 animate-fadeIn w-full shadow-sm"
        >
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-primary-400 text-xs uppercase tracking-wide mb-1">
              Fitur {parentStakeholder?.stakeholderName || "Orang Tua"}
            </h4>
            <h5 className="font-semibold text-white text-sm sm:text-base mb-1 leading-snug">
              {currentFeature.featureTitle}
            </h5>
            <p className="text-xs text-background/80 leading-relaxed">
              {currentFeature.featureDescription}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 animate-fadeIn w-full">
        <p className="text-xs text-background/80 text-center font-primary">
          Belum ada fitur untuk{" "}
          {parentStakeholder?.stakeholderName || "Orang Tua"}
        </p>
      </div>
    );
  };

  const formatExternalLink = (rawUrl?: string, defaultUrl = "#") => {
    if (!rawUrl) return defaultUrl;
    let cleaned = rawUrl.trim().replace(/^#+/, "");
    if (!cleaned || cleaned === "#") return defaultUrl;
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
      return cleaned;
    }
    return `https://${cleaned}`;
  };

  const renderDownloadButtons = () => {
    const appStoreUrl = formatExternalLink(data.appStoreLink, "#");
    const playStoreUrl = formatExternalLink(
      data.googlePlayLink,
      "https://play.google.com/store/apps/details?id=id.oxinos.nurtech"
    );

    return (
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2 w-full">
        <a
          href={appStoreUrl}
          target={appStoreUrl !== "#" ? "_blank" : undefined}
          rel="noopener noreferrer"
          onClick={(e) => {
            if (appStoreUrl === "#") {
              e.preventDefault();
            }
          }}
          className="flex-1 flex items-center justify-center gap-2.5 bg-white text-gray-900 px-3.5 py-2.5 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform active:scale-95 min-w-0"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          <div className="text-left min-w-0">
            <div className="text-[10px] font-medium leading-tight text-gray-600">Download di</div>
            <div className="text-xs sm:text-sm font-bold font-primary leading-none text-gray-900">
              APP STORE
            </div>
          </div>
        </a>

        <a
          href={playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2.5 bg-white text-gray-900 px-3.5 py-2.5 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform active:scale-95 min-w-0"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
          </svg>
          <div className="text-left min-w-0">
            <div className="text-[10px] font-medium leading-tight text-gray-600">Download di</div>
            <div className="text-xs sm:text-sm font-bold font-primary leading-none text-gray-900">
              GOOGLE PLAY
            </div>
          </div>
        </a>
      </div>
    );
  };

  return (
    <section
      className="py-8 sm:py-14 bg-secondary-500 relative overflow-hidden w-full rounded-2xl sm:rounded-3xl"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          <div className="text-white space-y-4 sm:space-y-6 text-left">
            <div>
              <span className="inline-block bg-primary-500 text-white px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold font-primary shadow-sm">
                {data.badge}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-primary leading-tight tracking-tight">
              <span className="block sm:inline">{data.title}</span>{" "}
              <span className="text-primary-400 block sm:inline">
                {data.titleHighlight}
              </span>
            </h2>

            <p className="text-xs sm:text-base text-background/85 leading-relaxed">
              {data.description}
            </p>

            <div className="hidden md:block">{renderFeatureCard()}</div>

            <div className="hidden md:block">{renderDownloadButtons()}</div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6 my-2 sm:my-0">
            <div className="relative w-44 sm:w-48 md:w-56">
              {data.images && data.images.length > 0 ? (
                <>
                  <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
                    {data.images.map((image, index) => (
                      <div
                        key={image.id}
                        className={`transition-all duration-500 ease-in-out ${
                          index === currentSlide
                            ? "opacity-100 translate-x-0"
                            : index < currentSlide
                              ? "opacity-0 -translate-x-full"
                              : "opacity-0 translate-x-full"
                        }`}
                        style={{
                          position:
                            index === currentSlide ? "relative" : "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                        }}
                      >
                        <img
                          src={getStrapiMediaUrl(image.url, apiUrl)}
                          alt={image.alternativeText || "App Mockup"}
                          className="w-full h-auto drop-shadow-xl"
                        />
                      </div>
                    ))}
                  </div>

                  {data.images.length > 1 && (
                    <div className="flex justify-center gap-1.5 mt-3">
                      {data.images.map((_, index) => (
                        <button
                          key={`slide-${index}`}
                          onClick={() => setCurrentSlide(index)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === currentSlide
                              ? "bg-primary-500 w-4"
                              : "bg-white/30 hover:bg-white/50 w-1.5"
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full -z-10 scale-75"></div>
                </>
              ) : (
                <div className="bg-white/10 rounded-2xl p-4 text-center text-white w-full">
                  <p className="text-xs font-primary">
                    Upload gambar di Strapi
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden space-y-4 w-full pt-2">
            {renderFeatureCard()}
            {renderDownloadButtons()}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </section>
  );
}
