"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Updates", href: "/updates" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const page = () => {
  const [hover, setHover] = useState(false);
  return (
    <nav className="flex h-screen w-full flex-col items-center justify-start bg-[#fcfcfc]">
      <div className="h-[20px] w-full bg-[#09090B]" />
      <motion.div
        className="-mt-[1px] flex h-[40px] items-start justify-center"
        // initial={{ width: "auto" }}
        // animate={{ width: hover ? "auto" : "auto" }}
        // transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
      >
        <svg
          width="44"
          height="20"
          viewBox="0 0 90 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-[40px] w-[100%]"
        >
          <path d="M90 0H0C32.7966 0 55.1695 40 90 40V0Z" fill="#09090B" />
        </svg>
        <motion.div
          className="flex h-[40px] bg-[#09090b] px-4"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          initial={{ width: "100px" }}
          animate={{ width: hover ? "auto" : "100px" }}
          transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
        >
          {hover ? (
            navLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                className="px-4 text-white"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: [-5, 0], opacity: 1 }}
                transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
              >
                {link.name}
              </motion.a>
            ))
          ) : (
            <p className="text-white">Lokendra</p>
          )}
        </motion.div>
        <svg
          width="44"
          height="20"
          viewBox="0 0 90 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-[40px] w-[100%]"
        >
          <path d="M0 0H90C57.2034 0 34.8305 40 0 40V0Z" fill="#09090B" />
        </svg>
      </motion.div>
    </nav>
  );
};

export default page;
