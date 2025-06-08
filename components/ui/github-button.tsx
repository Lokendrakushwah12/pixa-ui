import { octokit } from '@/lib/octokit';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { Button } from './Button';

const getGitHubData = unstable_cache(
    async () => {
        try {
            const { data } = await octokit.rest.repos.get({
                owner: 'lokendrakushwah12',
                repo: 'pixa-ui',
            });
            return {
                stars: data.stargazers_count,
                url: data.html_url,
            };
        } catch (error) {
            console.error(error);
            return {
                stars: 0,
                url: '',
            };
        }
    },
    ['github-stats'],
    {
        revalidate: 3600,
    }
);

export const GitHubButton = async (): Promise<ReactElement> => {
    const { stars, url } = await getGitHubData();

    return (
        <Button
            asChild
      className="relative h-8 px-2"
      variant="ghost"
        >
            <Link target="_blank" rel="noreferrer" href={url}>
                <div className="flex h-full gap-2 items-center">
                    <GitHubLogoIcon />
                    <p className='text-muted-foreground'>
                        {stars}
                    </p>
                </div>
            </Link>
        </Button>
    );
};