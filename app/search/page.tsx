import { episodes } from "@/lib/data";
import { EpisodeCard } from "@/components/ui/episode-card";
import { Search } from "lucide-react";
import Link from "next/link";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams.q;
  const query = typeof q === 'string' ? q : '';
  const lowercaseQuery = query.toLowerCase();

  const searchResults = episodes.filter((ep) => {
    if (!query) return false;
    
    // Check title, description, tags, keywords, guests, hosts
    const inTitle = ep.title?.toLowerCase().includes(lowercaseQuery);
    const inDesc = ep.description?.toLowerCase().includes(lowercaseQuery);
    const inTags = ep.metadata?.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery));
    const inKeywords = ep.metadata?.keywords?.some(k => k.toLowerCase().includes(lowercaseQuery));
    const inGuests = ep.guests?.some(g => g.toLowerCase().includes(lowercaseQuery));
    const inHosts = ep.hosts?.some(h => h.toLowerCase().includes(lowercaseQuery));
    
    return inTitle || inDesc || inTags || inKeywords || inGuests || inHosts;
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-500 min-h-[60vh]">
      <div className="relative mb-12 rounded-3xl overflow-hidden bg-card border border-border/50 shadow-sm">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-[50%] -right-[10%] w-[70%] h-[150%] rounded-full bg-primary/5 blur-[120px]" />
              <div className="absolute top-[20%] -left-[20%] w-[60%] h-[120%] rounded-full bg-primary/5 blur-[100px]" />
          </div>
          
          <div className="relative z-10 px-6 py-12 md:px-12 md:py-16 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                  <Search className="w-3.5 h-3.5" /> Search Results
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-foreground mb-6">
                  {query ? (
                    <>Results for "<span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary/50">{query}</span>"</>
                  ) : (
                    "Search Episodes"
                  )}
              </h1>
              
              <p className="text-muted-foreground text-sm md:text-base lg:text-lg max-w-2xl font-medium leading-relaxed">
                  {query 
                    ? `Found ${searchResults.length} episode${searchResults.length === 1 ? '' : 's'} matching your search.`
                    : "Enter a search term to find episodes, guests, or special moments."}
              </p>
          </div>
      </div>

      {query && searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {searchResults.map((ep, i) => (
                  <EpisodeCard key={ep.id} episode={ep} index={i} />
              ))}
          </div>
      ) : query ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground max-w-md mb-8">
                  We couldn't find any episodes matching "{query}". Try checking for typos or using broader keywords like "Samay", "Bonus", or "Finale".
              </p>
              <Link 
                href="/"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Go back home
              </Link>
          </div>
      ) : null}
    </div>
  );
}
