import { formatLastUpdated, getRelativeTime, getRepoLastUpdate } from "@/lib/repo-utils";
import { unstable_cache } from 'next/cache';
import Link from "next/link";

// Cached version to avoid hitting GitHub API on every page load
const getCachedPortfolioUpdate = unstable_cache(
  async () => {
    try {
      const lastUpdate = await getRepoLastUpdate({
        owner: 'lokendrakushwah12',
        repo: 'pixa-ui',
        token: process.env.GITHUB_TOKEN
      });

      return {
        lastUpdated: lastUpdate.lastUpdated,
        formatted: formatLastUpdated(lastUpdate.lastUpdated),
        relative: getRelativeTime(lastUpdate.lastUpdated),
        lastCommit: lastUpdate.lastCommit
      };
    } catch (error) {
      console.error('Error fetching portfolio update:', error);
      return null;
    }
  },
  ['portfolio-last-update'],
  {
    revalidate: 3600,
    tags: ['portfolio-update']
  }
);

const Footer = async () => {
  let lastUpdatedText = 'Unable to fetch';

  if (process.env.NODE_ENV === 'development') {
    lastUpdatedText = 'Development mode';
  } else {
    const portfolioUpdate = await getCachedPortfolioUpdate();
    if (portfolioUpdate?.lastUpdated) {
      lastUpdatedText = portfolioUpdate.relative;
    }
  }

  return (
    <div className="p-4 max-w-screen-xl w-full mx-auto space-y-4 py-8 md:py-16">
      <div className="flex flex-col md:flex-row w-full justify-between gap-2 md:gap-1 items-start md:items-center">
        <div className="md:flex-grow hidden border-b border-dashed border-border" />
        <p className="text-xs font-normal text-foreground/60 text-right">
          Designed and built by <Link href="/about" className="font-medium hover:text-foreground/80">
            Lokendra
          </Link>
        </p>
        <div className="flex justify-center items-center">
          <p className="text-xs font-normal text-foreground/60">
            Last updated {lastUpdatedText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;