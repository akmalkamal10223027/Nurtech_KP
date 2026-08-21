// // NOTE this for global or some endpoint that just 1 or 2 version

// import { K } from "@/lib/constants";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { ENDP } from "../endpoint";
// import { IParams } from "@/types/global";

// // example with params
// export function useAllUser(p?: IParams) {
//   const { data, isLoading } = useQuery({
//     queryKey: [K.USER, p],
//     queryFn: () => ENDP.global.user(p),
//   });

//   return {
//     respAllUser: data,
//     isLoadUser: isLoading,
//   };
// }

// // example without params
// export function useAllBanner() {
//   const { data } = useQuery({
//     queryKey: [K.BANNER],
//     queryFn: () => ENDP.global.banner(),
//   });

//   return {
//     respAllBanner: data,
//   };
// }

// // example based id
// export function useGetBanner(id?: string) {
//   const { data } = useQuery({
//     queryKey: [K.BANNER, id],
//     queryFn: () => ENDP.global.banner(),
//     enabled: !!id,
//   });

//   return {
//     respGetBanner: data,
//   };
// }

// // example mutate
// export function usePostReview() {
//   const { mutate } = useMutation({
//     // NOTE dont put any, use a real body types later on
//     mutationFn: (b: any) => ENDP.global.review_post(b),
//     meta: {
//       // NOTE: meta are optional but i suggest u should using it
//       invalidatesQuery: [[K.BANNER]], // NOTE: put query key api that u need to inavalidates query (refetching after success)
//       errorMsg: "Failed Posting",
//       successMsg: "Success Posting",
//     },
//   });
//   return {
//     postReview: mutate,
//   };
// }
