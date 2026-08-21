import Header from "../about/header";
import ListProgram from "./list-program";

export default function Program() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-16"
      id="program"
    >
      <Header
        title="Program Unggulan"
        subtitle="Kombinasi sempurna antara nilai-nilai islami dan keterampilan teknologi modern "
      />
      <ListProgram />
    </div>
  );
}
