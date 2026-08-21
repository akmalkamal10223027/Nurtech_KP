import Header from "../about/header";
import ListFacility from "./list-facility";

export default function Facility() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-6 sm:gap-8"
      id="facility"
    >
      <Header
        title="Fasilitas"
        subtitle="Lingkungan belajar yang nyaman dengan fasilitas lengkap"
      />
      <ListFacility />
    </div>
  );
}
