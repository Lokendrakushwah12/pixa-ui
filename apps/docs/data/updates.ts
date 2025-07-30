type Update = {
  href: string;
  title: string;
  description: string;
  author: string;
  banner: string;
  author_image: string;
  date: string;
};

export const UPDATES: Update[] = [
  {
    href: "v2.0",
    title: "Introducing Pixa 2.0",
    description:
      "One of Pixa's biggest launches yet is here. This new version introduces powerful components with variant props, a new CLI, and a complete redesign.",
    author: "Lokendra Kushwah",
    banner: "/open-graphs/updates/v2.0.webp",
    author_image: "https://github.com/lokendra.png",
    date: "June 2, 2025",
  },
];
