import Nav from "@/components/pixa-ui/Nav";
import HomeSection from "@/components/pixa-ui/Home";
import ComponentsTabs from "@/components/pixa-ui/ComponentsTabs";

export default function Home() {
  return (
    <>
      <div className="flex h-screen w-full flex-col items-center justify-between text-center">
        <Nav />
        <HomeSection />
        <ComponentsTabs />
      </div>
    </>
  );
}
