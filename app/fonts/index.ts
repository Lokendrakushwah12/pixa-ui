import localFont from "next/font/local";

export const UncutSans = localFont({
  src: [
    {
      path: "./uncutsans/UncutSans-Book.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "./uncutsans/UncutSans-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./uncutsans/UncutSans-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./uncutsans/UncutSans-SemiBold.woff",
      weight: "600",
      style: "normal",
    },
  ],
});
