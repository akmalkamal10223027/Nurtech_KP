import { X } from "lucide-react";
import { useAppContext } from "../layout/context-provider";

export default function Close() {
  const { closeOverlay } = useAppContext();
  return (
    <button onClick={closeOverlay} type="button">
      <X />
    </button>
  );
}
