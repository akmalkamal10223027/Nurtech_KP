"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import { IDialogDrawer } from "@/types/global";

export default function CDialog({
  children,
  trigger,
  isPadding = true,
  open,
  onClose,
  disableOutsideInteraction = false,
}: IDialogDrawer) {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 size-full bg-black/10 backdrop-blur-sm z-999" />

        <Dialog.Content
          onPointerDownOutside={
            disableOutsideInteraction ? (e) => e.preventDefault() : undefined
          }
          onInteractOutside={
            disableOutsideInteraction ? (e) => e.preventDefault() : undefined
          }
          className={cn(
            "fixed left-1/2 top-1/2 z-999",
            "-translate-x-1/2 -translate-y-1/2",
          )}
        >
          <VisuallyHidden asChild>
            <Dialog.Title />
          </VisuallyHidden>

          <div
            className={cn(
              "max-h-[80vh] w-full min-w-xl rounded-xl overflow-hidden bg-background",
              isPadding && "p-[16px]",
            )}
          >
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
