"use client";
import {
  useAchievement,
  useAllAbout,
  useHeadmaster,
  useVisionMission,
} from "@/services/queries/landing";
import Feature from "./feature";
import Header from "./header";
import PrincipalSection from "./principal";
import VisionMission from "./vision-mission";

const params = {
  populate: {
    blocks: {
      on: {
        "shared.media": {
          populate: "file",
        },
        "shared.quote": {
          populate: "*",
        },
      },
    },
  },
};

export default function About() {
  const { respAllAbout } = useAllAbout(params);
  const { respVisionMission } = useVisionMission();
  const { respHeadmaster } = useHeadmaster();
  const { respAchievement, isLoadingAchievement } = useAchievement();
  const respQuote = respAllAbout?.data?.blocks?.find(
    (item) => item.__component === "shared.quote",
  ) as IQuoteBlock;

  return (
    <div
      className="flex flex-col items-center justify-center gap-16"
    >
      <Header
        title={respQuote?.title || respAllAbout?.data?.title}
        subtitle={respQuote?.body}
      />
      <VisionMission respVisionMission={respVisionMission} />
      <PrincipalSection respHeadmaster={respHeadmaster} />
      <Feature
        respAchievement={respAchievement}
        isLoading={isLoadingAchievement}
      />
    </div>
  );
}
