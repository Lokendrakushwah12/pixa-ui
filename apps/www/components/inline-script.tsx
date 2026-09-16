"use client";

/**
 * Renders an inline script that runs during HTML parsing (before paint) on hard
 * loads, without tripping React 19's dev warning about `<script>` tags.
 *
 * On the server the tag is `text/javascript` so the browser executes it; on the
 * client React re-renders it as `text/plain`, which it won't warn about and the
 * browser ignores (it already ran during the initial parse). Must be a Client
 * Component so the client-side `type` swap actually happens.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted inline bootstrap script
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
    />
  );
}
