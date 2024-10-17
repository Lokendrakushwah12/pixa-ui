import localFont from "next/font/local";

export const UncutSans = localFont({
  src: [
    {
      path: "./UncutSans/UncutSans-Book.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "./UncutSans/UncutSans-Medium.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./UncutSans/UncutSans-Regular.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./UncutSans/UncutSans-SemiBold.woff",
      weight: "600",
      style: "normal",
    },
  ],
});
