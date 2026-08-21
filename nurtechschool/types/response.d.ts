declare interface IResponse<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

declare type IQuoteBlock = {
  __component: "shared.quote";
  id: number;
  title: string;
  body: string;
};
declare type ImageBlock = {
  __component: "shared.media";
  id: number;
  file: StrapiMedia;
};

declare type IAboutBlock = IQuoteBlock | ImageBlock;

declare type IAboutData = {
  id: number;
  documentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  blocks: IAboutBlock[];
};
//! about

declare type IAboutResponse = {
  data: IAboutData;
  meta: Record<string, never>;
};

declare type IVisionMissionData = {
  id: number;
  documentId: string;
  visi: string;
  misi: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

// ! vision mission
declare type IVisionMissionResponse = IResponse<IVisionMissionData>;

declare type HeadmasterData = {
  id: number;
  documentId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  avatar: StrapiMedia;
};

// ! headmaster
declare type HeadmasterResponse = IResponse<HeadmasterData>;

declare type IAchievementData = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  position: number;
  icon: StrapiMedia;
};

// ! achievement
declare type IAchievementResponse = IResponse<IAchievementData[]>;

declare type IGalleryActivityData = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  position: number;
  thumbnail: StrapiMedia;
  gallery: StrapiMedia[];
};

// ! gallery activity
declare type IGalleryActivityResponse = IResponse<IGalleryActivityData[]>;
declare type IGalleryDetailResponse = IResponse<IGalleryActivityData>;

declare type IProgramData = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  position: number;
  icon: StrapiMedia;
};

// ! program
declare type IProgramResponse = IResponse<IProgramData[]>;

declare type IScheduleData = {
  id: number;
  documentId: string;
  title: string;
  time: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

// ! schedule
declare type IScheduleResponse = IResponse<IScheduleData[]>;

declare type IExtracurricularData = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  position: number;
  locale: string;
  icon: StrapiMedia;
};

// ! extracurricular
declare type IExtracurricularResponse = IResponse<IExtracurricularData[]>;

declare type IFacilityData = {
  id: number;
  documentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  position: number;
  locale: string;
  icon: StrapiMedia;
  image?: StrapiMedia;
};

// ! facility
declare type IFacilityResponse = IResponse<IFacilityData[]>;

declare type IRegistrationRequirementData = {
  id: number;
  documentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  position: number;
  locale: string;
};

// ! registration requirement
declare type IRegistrationRequirementResponse = IResponse<
  IRegistrationRequirementData[]
>;

declare type IRegistrationCostData = {
  id: number;
  documentId: string;
  title: string;
  phone: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  cost: {
    id: number;
    label: string;
    cost: number;
  }[];
};

// ! registration cost
declare type IRegistrationCostResponse = IResponse<IRegistrationCostData>;

declare type IContactData = {
  id: number;
  documentId: string;
  longitude: number;
  Latitude: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  contact: {
    id: number;
    address: string;
    social_media: string;
    social_medias?: string[];
    phone: number | string;
    phones?: string[];
  }[];
};

//! contact
declare type IContactResponse = IResponse<IContactData>;

declare type IBannerData = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  thumbnail: StrapiMedia;
  button: {
    id: number;
    url: string;
    title: string;
    icon: StrapiMedia;
  }[];
};

//! banner
declare type IBannerResponse = IResponse<IBannerData[]>;

declare type IGlobalData = {
  id: number;
  documentId: string;
  siteName: string;
  siteDescription: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  favicon: StrapiMedia;
  defaultSeo: {
    id: number;
    documentId: string;
    metaTitle: string;
    metaDescription: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    shareImage: StrapiMedia;
  };
};

//! global
declare type IGlobalResponse = IResponse<IGlobalData>;

declare type IFooterData = {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  menu: string;
  type: "information" | "contact" | "link" | "about";
  data: string;
  position: number;
  icon: StrapiMedia;
  footer_sub_menus: IFooterSubMenuData[];
};

//! footer
declare type IFooterResponse = IResponse<IFooterData[]>;

declare type IFooterSubMenuData = {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  menu: string;
  type: string;
  data: string;
  isActive: boolean;
  position: number;
  icon: StrapiMedia;
  footer_ids: IFooterData[];
};

//! footer sub menu
declare type IFooterSubMenuResponse = IResponse<IFooterSubMenuData[]>;

declare type ICategoryData = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

//! category
declare type ICategoryResponse = IResponse<ICategoryData[]>;

declare type INewsData = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  cover: StrapiMedia;
  category: ICategoryData;
  author: {
    id: number;
    documentId: string;
    name: string;
    email: string;
    avatar: StrapiMedia;
  };
  blocks: {
    __component: "shared.rich-text";
    id: number;
    body: string;
  }[];
};

//! news
declare type INewsResponse = IResponse<INewsData[]>;
declare type INewsDetailResponse = IResponse<INewsData>;

//! faq
declare type IFAQData = {
  id: number;
  documentId?: string;
  question: string;
  answer: string;
  order?: number;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
};

declare type IFAQResponse = IResponse<IFAQData[]>;
