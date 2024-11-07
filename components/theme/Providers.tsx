"use client";
// import posthog from "posthog-js";
// import { PostHogProvider } from "posthog-js/react";
import { ThemeProvider } from "./ThemeProvider";

// if (typeof window !== "undefined") {
//   posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "", {
//     api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "",
//   });
// }

// const CSPostHogProvider = ({ children }: { children: React.ReactNode }) => {
//   return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
// };

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <CSPostHogProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    // </CSPostHogProvider>
  );
}
