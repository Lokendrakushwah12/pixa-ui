"use client";
import userData from "@/data/siteData";
import Link from "next/link";

const Footer = () => {
  const { twitter } = userData.personalInfo;
  const { date, time } = userData.lastUpdated;

  return (
    <div className="p-4 max-w-screen-xl w-full mx-auto space-y-4 py-8 md:py-16">
      <div className="flex flex-col md:flex-row w-full justify-between gap-2 md:gap-1 items-start md:items-center">
        <div className="md:flex-grow hidden border-b border-dashed border-border" />
        <p className="text-sm font-normal text-background text-right">
          Designed and built by <Link href={twitter} target="_blank" className="font-medium">
            Lokendra
          </Link>
        </p>
        <div className="flex justify-center items-center">
          <p className="text-sm font-normal text-background">
            Last updated on {date}, {time}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;