import localFont from "next/font/local";

export const UncutSans = localFont({
  src: [
    {
      path: "./UncutSans-Book.woff",
      weight: "300",
    },
    {
      path: "./UncutSans-Regular.woff",
      weight: "400",
    },
    {
      path: "./UncutSans-Medium.woff",
      weight: "500",
    },
    {
      path: "./UncutSans-SemiBold.woff",
      weight: "600",
    },
  ],
});
