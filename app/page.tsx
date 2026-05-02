import { ModeToggle } from "@/components/theme-toggle";
import HomeCarousel from "@/components/home/carousal";
import EpisodeList from "@/components/home/episode-list";

export default function Home() {
  return (
    <main className="flex flex-col gap-8 pb-8 pt-6">
      <HomeCarousel />
      <EpisodeList />
    </main>
  );
}
