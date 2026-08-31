export const configs = {
  API_BASE: process.env.NEXT_PUBLIC_API_BASE as string,
  API_KEY: process.env.NEXT_PUBLIC_API_KEY as string,
  DOMAIN: process.env.NEXT_PUBLIC_DOMAIN as string,
  AUTH_SECRET: process.env.NEXTAUTH_SECRET as string,
  AUTH_URL: process.env.NEXTAUTH_URL as string,
  TOKEN: process.env.NEXT_PUBLIC_API_TOKEN as string,
  BASE_IMAGE: process.env.NEXT_PUBLIC_API_IMAGE as string,
  WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_TO as string,
  WA_NUMBER: process.env.NEXT_PUBLIC_WA_NUMBER as string,
};

export const K = {
  BANNER: "BANNER",
  USER: "USER",
  ABOUT: "ABOUT",
  VISION_MISSION: "VISION_MISSION",
  HEADMASTER: "HEADMASTER",
  ACHIEVEMENT: "ACHIEVEMENT",
  GALLERY_ACTIVITY: "GALLERY_ACTIVITY",
  PROGRAM: "PROGRAM",
  SCHEDULE: "SCHEDULE",
  EXTRACURRICULAR: "EXTRACURRICULAR",
  FACILITY: "FACILITY",
  REGISTRATION_REQUIREMENT: "REGISTRATION_REQUIREMENT",
  REGISTRATION_COST: "REGISTRATION_COST",
  CONTACT: "CONTACT",
  GALLERY_DETAIL: "GALLERY_DETAIL",
  FOOTER: "FOOTER",
  FOOTER_SUB_MENU: "FOOTER_SUB_MENU",
  CATEGORY: "CATEGORY",
  NEWS: "NEWS",
  FAQ: "FAQ",
};

export const OV = {
  CONFIRMATION: "CONFIRMATION",
  FORM: "FORM",
  EXCUL: "EXCUL",
  MENU: "MENU",
  GALLERY: "GALLERY",
  PROGRAM: "PROGRAM",
  SCHEDULE: "SCHEDULE",
  FACILITY: "FACILITY",
};

export const DUMMY_GROUP = [
  {
    label: "Fruits",
    items: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "orange", label: "Orange" },
    ],
  },
  {
    label: "Vegetables",
    items: [
      { value: "carrot", label: "Carrot" },
      { value: "broccoli", label: "Broccoli" },
      { value: "spinach", label: "Spinach" },
    ],
  },
];

// defined route like this
export const RTR = {
  gallery: () => `/gallery`,
  galleryID: (id: string) => `/gallery/${id}`,
  home: () => `/`,
  news: () => `/news`,
  newsID: (id: string) => `/news/${id}`,
};

export const MONTH_MAP: Record<string, string> = {
  Januari: "01",
  Februari: "02",
  Maret: "03",
  April: "04",
  Mei: "05",
  Juni: "06",
  Juli: "07",
  Agustus: "08",
  September: "09",
  Oktober: "10",
  November: "11",
  Desember: "12",
};
