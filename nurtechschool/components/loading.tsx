export default function Loading() {
  return (
    <div className="fixed z-60 inset-0 size-full bg-black/10 backdrop-blur-sm flex items-center justify-center">
      <span className="loader size-[50px] rounded-full relative" />
    </div>
  );
}
