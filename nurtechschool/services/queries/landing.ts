import { useQuery } from "@tanstack/react-query";
import { K } from "@/lib/constants";
import { ENDP } from "../endpoint";
import { IParams } from "@/types/global";
// ! about
export function useAllAbout(params: IParams) {
  const { data, isLoading } = useQuery<IAboutResponse>({
    queryKey: [K.ABOUT],
    queryFn: () => ENDP.global.about(params),
  });

  return {
    respAllAbout: data as IAboutResponse,
    isLoadingAllAbout: isLoading,
  };
}
// ! vision mission
export function useVisionMission() {
  const { data } = useQuery<IVisionMissionResponse>({
    queryKey: [K.VISION_MISSION],
    queryFn: () => ENDP.global.vision_mission(),
  });

  return {
    respVisionMission: data as IVisionMissionResponse,
  };
}
// ! headmaster
export function useHeadmaster() {
  const { data } = useQuery<HeadmasterResponse>({
    queryKey: [K.HEADMASTER],
    queryFn: () => ENDP.global.profile(),
  });

  return {
    respHeadmaster: data as HeadmasterResponse,
  };
}

// ! achievement
export function useAchievement() {
  const { data, isLoading } = useQuery<IAchievementResponse>({
    queryKey: [K.ACHIEVEMENT],
    queryFn: () => ENDP.global.achievement(),
  });

  return {
    respAchievement: data as IAchievementResponse,
    isLoadingAchievement: isLoading,
  };
}

// ! gallery activity
export function useGalleryActivity(params?: IParams) {
  const { data, isLoading } = useQuery<IGalleryActivityResponse>({
    queryKey: [K.GALLERY_ACTIVITY, params],
    queryFn: () => ENDP.global.gallery_activity(params),
  });

  return {
    respGalleryActivity: data as IGalleryActivityResponse,
    isLoadingGalleryActivity: isLoading,
    metaGalleryActivity: data?.meta,
  };
}

export function useGalleryDetail(slug: string, params?: IParams) {
  const { data, isLoading } = useQuery<IGalleryDetailResponse>({
    queryKey: [K.GALLERY_DETAIL, slug, params],
    queryFn: () => ENDP.global.gallery_detail(slug, params),
  });

  return {
    respGalleryDetail: data as IGalleryDetailResponse,
    isLoadingGalleryDetail: isLoading,
  };
}

// ! program
export function useProgram() {
  const { data, isLoading } = useQuery<IProgramResponse>({
    queryKey: [K.PROGRAM],
    queryFn: () => ENDP.global.featured_program(),
  });

  return {
    respProgram: data as IProgramResponse,
    isLoadingProgram: isLoading,
  };
}

// ! schedule
export function useSchedule() {
  const { data, isLoading } = useQuery<IScheduleResponse>({
    queryKey: [K.SCHEDULE],
    queryFn: () => ENDP.global.activity_schedule(),
  });

  return {
    respSchedule: data as IScheduleResponse,
    isLoadingSchedule: isLoading,
  };
}

// ! extracurricular
export function useExtracurricular() {
  const { data, isLoading } = useQuery<IExtracurricularResponse>({
    queryKey: [K.EXTRACURRICULAR],
    queryFn: () => ENDP.global.ekskul(),
  });

  return {
    respExtracurricular: data as IExtracurricularResponse,
    isLoadingExtracurricular: isLoading,
  };
}

// ! facility
export function useFacility() {
  const { data, isLoading } = useQuery<IFacilityResponse>({
    queryKey: [K.FACILITY],
    queryFn: () => ENDP.global.facility(),
  });

  return {
    respFacility: data as IFacilityResponse,
    isLoadingFacility: isLoading,
  };
}

// ! registration requirement
export function useRegistrationRequirement() {
  const { data, isLoading } = useQuery<IRegistrationRequirementResponse>({
    queryKey: [K.REGISTRATION_REQUIREMENT],
    queryFn: () => ENDP.global.registration_requirement(),
  });

  return {
    respRegistrationRequirement: data as IRegistrationRequirementResponse,
    isLoadingRegistrationRequirement: isLoading,
  };
}

// ! registration cost
export function useRegistrationCost() {
  const { data, isLoading } = useQuery<IRegistrationCostResponse>({
    queryKey: [K.REGISTRATION_COST],
    queryFn: () => ENDP.global.registration_cost(),
  });

  return {
    respRegistrationCost: data as IRegistrationCostResponse,
    isLoadingRegistrationCost: isLoading,
  };
}

// ! contact
export function useContact() {
  const { data, isLoading } = useQuery<IContactResponse>({
    queryKey: [K.CONTACT],
    queryFn: () => ENDP.global.contact_us(),
  });

  return {
    respContact: data as IContactResponse,
    isLoadingContact: isLoading,
  };
}

// ! banner
export function useBanner() {
  const { data, isLoading } = useQuery<IBannerResponse>({
    queryKey: [K.BANNER],
    queryFn: () => ENDP.global.banner(),
  });

  return {
    respBanner: data as IBannerResponse,
    isLoadingBanner: isLoading,
  };
}

export function useFooter(params?: IParams) {
  const { data, isLoading } = useQuery<IFooterResponse>({
    queryKey: [K.FOOTER, params],
    queryFn: () => ENDP.global.footer(params),
  });

  return {
    respFooter: data as IFooterResponse,
    isLoadingFooter: isLoading,
  };
}

export function useFooterSubMenu(params?: IParams) {
  const { data, isLoading } = useQuery<IFooterSubMenuResponse>({
    queryKey: [K.FOOTER_SUB_MENU, params],
    queryFn: () => ENDP.global.footer_sub_menu(params),
  });

  return {
    respFooterSubMenu: data as IFooterSubMenuResponse,
    isLoadingFooterSubMenu: isLoading,
  };
}

// ! news categories
export function useCategory(params?: IParams) {
  const { data, isLoading } = useQuery<ICategoryResponse>({
    queryKey: [K.CATEGORY, params],
    queryFn: () => ENDP.global.news_categories(params),
  });

  return {
    respCategory: data?.data as ICategoryData[],
    isLoadingCategory: isLoading,
  };
}

// ! news
export function useNews(params?: IParams) {
  const { data, isLoading } = useQuery<INewsResponse>({
    queryKey: [K.NEWS, params],
    queryFn: () => ENDP.global.news(params),
  });

  return {
    respNews: data as INewsResponse,
    isLoadingNews: isLoading,
  };
}

export function useNewsDetail(slug: string, params?: IParams) {
  const { data, isLoading } = useQuery<INewsDetailResponse>({
    queryKey: [K.NEWS, slug, params],
    queryFn: () => ENDP.global.news_detail(slug, params),
  });

  return {
    respNewsDetail: data as INewsDetailResponse,
    isLoadingNewsDetail: isLoading,
  };
}

// ! faq
export function useFAQ() {
  const { data, isLoading } = useQuery<IFAQResponse>({
    queryKey: [K.FAQ],
    queryFn: () => ENDP.global.faq(),
  });

  return {
    respFAQ: data as IFAQResponse,
    isLoadingFAQ: isLoading,
  };
}
