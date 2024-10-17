import Nav from "@/components/pixa-ui/Nav";
import HomeSection from "@/components/pixa-ui/Home";
import ComponentsSection from "@/components/pixa-ui/ComponentsSection";

export default function Home() {
  return (
    <>
      <div className="flex h-screen w-full flex-col items-center justify-between text-center">
        <Nav />
        <HomeSection />
        <ComponentsSection />
      </div>
    </>
  );
}
