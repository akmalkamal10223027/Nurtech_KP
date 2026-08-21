/* eslint-disable @typescript-eslint/no-explicit-any */
export type GTMEvent = {
  event: string;
  action: string;
  label?: string;
  [key: string]: any;
};

declare global {
  interface Window {
    dataLayer: GTMEvent[];
  }
}

declare interface IParams {
  page?: number;
  limit?: number;
  search?: string;
  populate?: string[] | string | object;
  pagination?: {
    page?: number;
    limit?: number;
  };
  filters?: object;
}

declare interface IOverlay {
  open?: boolean;
  data?: Record<string, unknown>; // accept any obj
  id?: string;
  isPadding?: boolean;
  disableOutsideInteraction?: boolean;
  children?: React.ReactNode;
}

declare interface ControlledOverlay extends IOverlay {
  open: boolean;
  onClose: () => void;
  trigger?: never;
}

declare interface UncontrolledOverlay extends IOverlay {
  open?: undefined;
  onClose?: () => void;
  trigger: React.ReactNode;
}

declare type IDialogDrawer = ControlledOverlay | UncontrolledOverlay;
declare interface IOpt {
  value: string;
  label: string;
  disabled?: boolean;
}
declare interface IGroups {
  label: string;
  items: IOpt[];
}

declare interface ICImage {
  src: any;
  fallbackSrc?: any;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: any;
  fill?: boolean;
  rounded?: string;
  additional?: string;
  contentClassName?: string;
  unoptimized?: boolean;
  animationHover?: boolean;
}
