"use client";

import { Drawer } from "vaul";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import { IDialogDrawer } from "@/types/global";

export default function CDrawer({
  children,
  trigger,
  isPadding = true,
  open,
  onClose,
  disableOutsideInteraction = false,
}: IDialogDrawer) {
  return (
    <Drawer.Root
      open={open}
      onOpenChange={onClose}
      dismissible={!disableOutsideInteraction}
    >
      {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 size-full bg-black/10 backdrop-blur-sm z-999" />
        <Drawer.Content className="bg-background h-fit fixed bottom-0 left-0 rounded-t-[20px] overflow-hidden right-0 outline-none z-999">
          <VisuallyHidden asChild>
            <Drawer.Title />
          </VisuallyHidden>
          <div
            className={cn(
              "max-h-[80vh] w-full  mx-auto ",
              isPadding && "p-[16px]",
            )}
          >
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
