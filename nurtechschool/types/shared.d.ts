/* eslint-disable @typescript-eslint/no-explicit-any */
declare interface CarouselBase {
  showArrow?: boolean;
}

declare type CarouselWithItem = CarouselBase & {
  item: any[];
  isLoading: boolean;
  render: (item: any, id: number) => React.ReactNode;
  width?: string;
  children?: never;
};

declare type CarouselWithChildren = CarouselBase & {
  item?: never;
  width?: string;
  isLoading?: boolean;
  render?: (item: any, id: number) => React.ReactNode;
  children: React.ReactNode;
};

declare type CarouselUsage = CarouselWithItem | CarouselWithChildren;

declare type CCarousel = CarouselUsage & {
  showDots?: boolean;
  dotPosition?:
    | "outside"
    | "outside-left"
    | "outside-right"
    | "inside"
    | "inside-left"
    | "inside-right";
  arrowPosition?:
    | "outside"
    | "outside-bottom"
    | "outside-bottom-left"
    | "outside-bottom-right"
    | "outside-top-left"
    | "outside-top-right"
    | "inside"
    | "inside-bottom-left"
    | "inside-bottom-right"
    | "inside-top-left"
    | "inside-top-right";
  current?: number;
  setCurrent?: React.Dispatch<React.SetStateAction<number>>;
};

declare type StrapiImageFormat = {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
};

declare type StrapiImageFormats = {
  thumbnail?: StrapiImageFormat;
  small?: StrapiImageFormat;
  medium?: StrapiImageFormat;
  large?: StrapiImageFormat;
};

declare type StrapiMedia = {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: StrapiImageFormats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: unknown | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};
