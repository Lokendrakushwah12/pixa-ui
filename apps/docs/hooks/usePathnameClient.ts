"use client";

import { usePathname as useNextPathname } from "next/navigation";
import { useEffect, useState } from "react";

export function usePathnameClient() {
  const pathname = useNextPathname();
  const [clientPathname, setClientPathname] = useState<string | null>(null);

  useEffect(() => {
    setClientPathname(pathname);
  }, [pathname]);

  return clientPathname;
}