import { IParams } from "@/types/global";
import { Http } from "../config/method";

export const ENDP = {
  auth: {
    sign_up: (b: IBSignUp) => Http.post("/auth/sign-up/user", b),
    send_otp: (b: IBSendOTP) => Http.post("/auth/send-otp", b),
    verify_otp: (b: IBVerifyOTP) => Http.post("/auth/check-otp", b),
  },
  global: {
    about: (params: IParams) => Http.get<IAboutResponse>("/about", params),
    achievement: () =>
      Http.get<IAchievementResponse>("/achievements?populate=icon"),
    activity_schedule: () => Http.get<IScheduleResponse>("/activity-schedules"),
    article: () => Http.get("/articles"),
    author: () => Http.get("/authors"),
    banner: () =>
      Http.get<IBannerResponse>(
        "/banners?populate[thumbnail]=true&populate[button][populate]=icon",
      ),
    category: () => Http.get("/categories"),
    contact_us: () =>
      Http.get<IContactResponse>("/contact-us?populate=contact"),
    review: () => Http.get("/reviews"),
    ekskul: () =>
      Http.get<IExtracurricularResponse>(
        "/extracurricular-activities?populate=icon",
      ),
    facility: () => Http.get<IFacilityResponse>("/facilities?populate=*"),
    featured_program: () =>
      Http.get<IProgramResponse>("/featured-programs?populate=icon"),
    footer: (params?: IParams) => Http.get<IFooterResponse>("/footers", params),
    footer_sub_menu: (params?: IParams) =>
      Http.get<IFooterSubMenuResponse>("/footer-sub-menus", params),
    gallery_activity: (params?: IParams) =>
      Http.get<IGalleryActivityResponse>("/gallery-activities", params),
    gallery_detail: (slug: string, params?: IParams) =>
      Http.get<IGalleryDetailResponse>(`/gallery-activities/${slug}`, params),
    global: () =>
      Http.get<IGlobalResponse>(
        "/global?populate[favicon]=true&populate[defaultSeo][populate]=shareImage",
      ),
    profile: () => Http.get<HeadmasterResponse>("/profile?populate=avatar"),
    registration_cost: () =>
      Http.get<IRegistrationCostResponse>("/registration-cost?populate=cost"),
    registration_requirement: () =>
      Http.get<IRegistrationRequirementResponse>("/registration-requirements"),
    vision_mission: () => Http.get<IVisionMissionResponse>("/vision-mision"),
    news: (params?: IParams) => Http.get<INewsResponse>("/articles", params),
    news_detail: (slug: string, params?: IParams) =>
      Http.get<INewsDetailResponse>(`/articles/${slug}`, params),
    news_categories: (params?: IParams) =>
      Http.get<ICategoryResponse>("/categories", params),
    faq: () => Http.get<IFAQResponse>("/faqs?populate=*&sort=order:asc"),
  },
};
