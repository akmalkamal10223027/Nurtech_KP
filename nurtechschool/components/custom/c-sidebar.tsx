"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import { IDialogDrawer } from "@/types/global";
import { motion, AnimatePresence } from "motion/react";

export default function CSidebar({
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

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 size-full bg-black/40 backdrop-blur-sm z-100000"
              />
            </Dialog.Overlay>

            <Dialog.Content
              onPointerDownOutside={
                disableOutsideInteraction
                  ? (e) => e.preventDefault()
                  : undefined
              }
              asChild
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={cn(
                  "fixed right-0 top-0 bottom-0 z-100000 w-full max-w-[300px] bg-background shadow-2xl outline-none",
                )}
              >
                <VisuallyHidden asChild>
                  <Dialog.Title>Sidebar Menu</Dialog.Title>
                </VisuallyHidden>
                <VisuallyHidden asChild>
                  <Dialog.Description>
                    Navigation menu for mobile
                  </Dialog.Description>
                </VisuallyHidden>

                <div
                  className={cn("h-full overflow-y-auto", isPadding && "p-6")}
                >
                  {children}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
