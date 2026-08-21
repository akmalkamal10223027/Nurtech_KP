import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CSkeleton from "./c-skeleton";
import useEmblaCarousel from "embla-carousel-react";

export const dotVariants = cva("absolute z-30", {
  variants: {
    dotPosition: {
      outside: "top-18 left-1/2 -translate-x-1/2",
      "outside-left": "top-18 left-0",
      "outside-right": "top-18 right-0",
      inside: "bottom-10 left-1/2 -translate-x-1/2",
      "inside-left": "bottom-0 left-1",
      "inside-right": "bottom-0 right-1",
    },
  },
  defaultVariants: {
    dotPosition: "outside",
  },
});

export const arrowVariants = cva("absolute z-30 pointer-events-none", {
  variants: {
    arrowPosition: {
      outside: "w-full h-fit -bottom-8 justify-between px-2",
      "outside-bottom": "-bottom-8",
      "outside-bottom-left": "-bottom-8 left-0",
      "outside-bottom-right": "-bottom-8 right-0",
      "outside-top-left": "-top-9 left-0",
      "outside-top-right": "-top-9 right-0",
      inside: "w-full h-fit top-1/2 -translate-y-1/2 justify-between px-2",
      "inside-bottom-left": "bottom-2 left-1",
      "inside-bottom-right": "bottom-2 right-1",
      "inside-top-left": "top-1 left-1",
      "inside-top-right": "top-1 right-1",
    },
  },
  defaultVariants: {
    arrowPosition: "inside",
  },
});

type ICarouselProps = CCarousel &
  VariantProps<typeof dotVariants> &
  VariantProps<typeof arrowVariants>;

export default function CCarousel({
  dotPosition,
  arrowPosition,
  showArrow = true,
  showDots = true,
  children,
  current = 0,
  setCurrent,
  item,
  render,
  isLoading,
  width,
}: ICarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
  });

  const [internalCurrent, setInternalCurrent] = React.useState(current);

  const actualCurrent = setCurrent ? current : internalCurrent;

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;

    const index = emblaApi.selectedScrollSnap();

    if (setCurrent) {
      setCurrent(index);
    } else {
      setInternalCurrent(index);
    }
  }, [emblaApi, setCurrent]);

  React.useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  React.useEffect(() => {
    if (!emblaApi) return;

    emblaApi.scrollTo(actualCurrent);
  }, [actualCurrent, emblaApi]);

  const handleNext = () => emblaApi?.scrollNext();
  const handlePrev = () => emblaApi?.scrollPrev();
  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  const totalItems = React.Children.count(children) || item?.length || 0;

  return (
    <div className="relative w-full h-full group">
      {/* Viewport */}
      <div className="overflow-hidden w-full h-full" ref={emblaRef}>
        <div className="flex w-full h-full">
          {isLoading ? (
            <div className={cn("flex-[0_0_100%] min-w-0", width)}>
              <CSkeleton length={1} className="w-full h-full *:rounded-md" />
            </div>
          ) : children ? (
            React.Children.map(children, (child, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 h-full">
                {child}
              </div>
            ))
          ) : (
            item?.map((itm, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 h-full">
                {render?.(itm, index)}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dots */}
      {showDots && totalItems > 1 && (
        <div
          className={cn(
            "py-2 flex justify-center gap-2",
            dotVariants({ dotPosition }),
          )}
        >
          {Array.from({ length: totalItems }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                idx === actualCurrent
                  ? "bg-primary w-8"
                  : "bg-white/40 hover:bg-white/70 w-2",
              )}
            />
          ))}
        </div>
      )}

      {/* Arrows */}
      {showArrow && totalItems > 1 && (
        <div
          className={cn(
            "flex pointer-events-none",
            arrowVariants({ arrowPosition }),
          )}
        >
          <Button
            variant="outline"
            size="icon"
            className="rounded-full pointer-events-auto"
            onClick={handlePrev}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full pointer-events-auto"
            onClick={handleNext}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
