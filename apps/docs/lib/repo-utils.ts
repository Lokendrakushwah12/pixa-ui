// lib/repo-utils.ts

export interface RepoLastUpdateOptions {
  owner: string;
  repo: string;
  token?: string;
}

export interface RepoLastUpdateResponse {
  lastUpdated: Date | null;
  lastCommit?: {
    message: string;
    author: string;
    sha: string;
    url: string;
  };
}

/**
 * Get the last updated time for a GitHub repository
 * Uses the latest commit to the default branch
 */
export async function getRepoLastUpdate({
  owner,
  repo,
  token,
}: RepoLastUpdateOptions): Promise<RepoLastUpdateResponse> {
  try {
    // Get repository info first to get the default branch
    const repoUrl = `https://api.github.com/repos/${owner}/${repo}`;

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Portfolio-Website",
    };

    if (token) {
      headers["Authorization"] = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }

    // Get repo info to find default branch
    const repoResponse = await fetch(repoUrl, { headers });

    if (!repoResponse.ok) {
      throw new Error(
        `GitHub API error: ${repoResponse.status} ${repoResponse.statusText}`
      );
    }

    const repoData = await repoResponse.json();
    const defaultBranch = repoData.default_branch || "main";

    // Get the latest commit from the default branch
    const commitsUrl = `https://api.github.com/repos/${owner}/${repo}/commits/${defaultBranch}`;
    const commitResponse = await fetch(commitsUrl, { headers });

    if (!commitResponse.ok) {
      throw new Error(
        `GitHub API error: ${commitResponse.status} ${commitResponse.statusText}`
      );
    }

    const commitData = await commitResponse.json();

    return {
      lastUpdated: new Date(commitData.commit.committer.date),
      lastCommit: {
        message: commitData.commit.message,
        author: commitData.commit.author.name,
        sha: commitData.sha,
        url: commitData.html_url,
      },
    };
  } catch (error) {
    console.error("Error fetching repository last update:", error);
    return { lastUpdated: null };
  }
}

/**
 * Utility to format the last updated date
 */
export function formatLastUpdated(date: Date | null): string {
  if (!date) return "Unknown";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Utility to get relative time (e.g., "2 days ago")
 */
export function getRelativeTime(date: Date | null): string {
  if (!date) return "Unknown";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const timeUnits = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
  ];

  for (const { unit, seconds } of timeUnits) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
}
