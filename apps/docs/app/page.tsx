import Footer from "@/components/sections/footer";
import Hero from "@/components/sections/hero";
import HomeComponentsTabs from "@/components/sections/tab/home-components-tabs";
import PixaBackground from "@/components/ui/pixa-background";

export default function Page() {
  return (
    <div className="flex flex-col h-full lg:max-w-screen-2xl overflow-clip mx-auto">
      <PixaBackground />
      <Hero />
      <HomeComponentsTabs />
      <Footer />
    </div>
  );
}
