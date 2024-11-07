import HomeSection from "@/components/sections/Home";
import ComponentsTabs from "@/components/tab/ComponentsTabs";
import Nav from "@/components/sections/Nav";

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col items-center justify-between text-center">
        <Nav />
        <HomeSection />
        <ComponentsTabs />
      </div>
    </>
  );
}
