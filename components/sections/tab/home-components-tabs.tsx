"use client";
import Image from "next/image";
import Link from "next/link";

const tabs = ["buttons", "cards", "tabs", "dialogs", "extra"] as const;

const ComponentsPage = () => {

  return (
    <div className="mb-12 flex w-full flex-col max-w-screen-lg mx-auto items-center justify-start xl:px-0 px-4">
      <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 sm:gap-6 gap-4">
        {tabs.map((tab) => (
          <Link
            key={tab}
            href={`/${tab}`}
            className="block overflow-hidden hover:shadow-lg border p-[6px] rounded-[14px] bg-muted-foreground/5 hover:bg-muted-foreground/10 transition-all"
          >
            <Image
              src={`/images/${tab}.png`}
              alt={`${tab} icon`}
              width={50}
              height={50}
              className="bg-background h-48 w-full rounded-lg"
            />
            <div className="flex flex-col items-start p-2 justify-start text-center">
              <span className="font-medium text-lg">{tab.charAt(0).toUpperCase() + tab.slice(1).toLowerCase()}</span>
              <p className="text-muted-foreground text-sm">
                12 components
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ComponentsPage;