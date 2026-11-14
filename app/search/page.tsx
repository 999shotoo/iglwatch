import { Suspense } from "react";
import SearchContent from "./search-content";
import { playableEpisodes } from "@/lib/data";

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent episodes={playableEpisodes} />
    </Suspense>
  );
}
