import { K } from "@/lib/constants";

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { ENDP } from "@/services/endpoint";
import HomePage from "./_module";

export default async function Page() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  // NOTE if the endpoint didint need any params
  // u should fetch ssr way like this
  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: [K.ABOUT],
      queryFn: () => ENDP.global.about({}),
    }),
    queryClient.prefetchQuery({
      queryKey: [K.VISION_MISSION],
      queryFn: () => ENDP.global.vision_mission(),
    }),
    queryClient.prefetchQuery({
      queryKey: [K.HEADMASTER],
      queryFn: () => ENDP.global.profile(),
    }),
    // NOTE if need other api just put below
    queryClient.prefetchQuery({
      queryKey: [K.BANNER],
      queryFn: () => ENDP.global.banner(),
    }),
    queryClient.prefetchQuery({
      queryKey: [K.ACHIEVEMENT],
      queryFn: () => ENDP.global.achievement(),
    }),
    queryClient.prefetchQuery({
      queryKey: [K.GALLERY_ACTIVITY],
      queryFn: () => ENDP.global.gallery_activity(),
    }),
    queryClient.prefetchQuery({
      queryKey: [K.PROGRAM],
      queryFn: () => ENDP.global.featured_program(),
    }),
    queryClient.prefetchQuery({
      queryKey: [K.SCHEDULE],
      queryFn: () => ENDP.global.activity_schedule(),
    }),
    queryClient.prefetchQuery({
      queryKey: [K.EXTRACURRICULAR],
      queryFn: () => ENDP.global.ekskul(),
    }),
    queryClient.prefetchQuery({
      queryKey: [K.REGISTRATION_REQUIREMENT],
      queryFn: () => ENDP.global.registration_requirement(),
    }),
    queryClient.prefetchQuery({
      queryKey: [K.REGISTRATION_COST],
      queryFn: () => ENDP.global.registration_cost(),
    }),
    queryClient.prefetchQuery({
      queryKey: [K.CONTACT],
      queryFn: () => ENDP.global.contact_us(),
    }),
    queryClient.prefetchQuery({
      queryKey: [K.FACILITY],
      queryFn: () => ENDP.global.facility(),
    }),
    queryClient.prefetchQuery({
      queryKey: [K.FOOTER],
      queryFn: () => ENDP.global.footer(),
    }),
    queryClient.prefetchQuery({
      queryKey: [K.CATEGORY],
      queryFn: () => ENDP.global.category(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePage />
    </HydrationBoundary>
  );
}
