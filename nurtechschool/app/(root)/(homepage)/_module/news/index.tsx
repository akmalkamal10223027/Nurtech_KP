import ListNews from "./list-news";
import { Link } from "next-view-transitions";
import { RTR } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Header from "../about/header";

export default function News() {
  return (
    <div className="container flex flex-col gap-7">
      <Header title="Berita dan Artikel" />
      <ListNews />

      <div className="flex justify-center relative">
        <hr className="border-secondary-600 w-full absolute top-1/2 left-0 -z-10" />
        <Link href={RTR.news()}>
          <Button
            size={"sm"}
            className="bg-secondary-600 font-semibold text-background px-6 py-2 rounded-3xl hover:bg-secondary-500 active:bg-orange-400 active:scale-95 transition-all duration-300"
          >
            Lainnya
          </Button>
        </Link>
      </div>
    </div>
  );
}
