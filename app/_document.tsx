import { Html, Head, Main, NextScript } from 'next/document';

function getInitialTheme() {
  const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
  if (savedTheme) {
    return savedTheme === 'dark' ? 'dark' : 'light';
  }
  // Check system preference if no saved theme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function Document() {
  const initialTheme = getInitialTheme();
  
  return (
    <Html className={initialTheme}>
      <Head />
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                if (theme) {
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                } else {
                  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  document.documentElement.classList.toggle('dark', systemPrefersDark);
                }
              })();
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
