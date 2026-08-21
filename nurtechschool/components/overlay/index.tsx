import CDrawer from "../custom/drawer";
import CDialog from "../custom/dialog";
import CSidebar from "../custom/c-sidebar";
import { useBreakpoint } from "@/lib/hook";
import { useAppContext } from "../layout/context-provider";
import { OV } from "@/lib/constants";
import OvConfirmation from "./ov-confirmation";
import OvForm from "./ov-form";
import OvExcul from "./ov-excul";
import OvMenu from "./ov-menu";
import OvGallery from "./ov-gallery";

export default function OverlayWrapper() {
  const { isTablet, isMobile } = useBreakpoint();
  const { overlay, closeOverlay } = useAppContext();
  const id = overlay?.id;
  const open = overlay?.open || false;
  const isPadding = overlay?.isPadding ?? true;
  const disableOutsideInteraction = overlay?.disableOutsideInteraction || false;

  const renderContent = () => {
    switch (id) {
      case OV.CONFIRMATION:
        return <OvConfirmation />;
      case OV.FORM:
        return <OvForm />;
      case OV.EXCUL:
        return <OvExcul />;
      case OV.MENU:
        return <OvMenu />;
      case OV.GALLERY:
        return <OvGallery />;
      default:
        return null;
    }
  };

  const sharedProps = {
    open,
    onClose: closeOverlay,
    isPadding: false,
    disableOutsideInteraction,
    children: renderContent(),
  };

  if (id === OV.MENU) {
    return <CSidebar {...sharedProps} />;
  }

  return isTablet || isMobile ? (
    <CDrawer {...sharedProps} />
  ) : (
    <CDialog {...sharedProps} />
  );
}
