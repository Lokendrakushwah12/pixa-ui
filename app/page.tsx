import Hero from "@/components/sections/hero";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import HomeComponentsTabs from "@/components/sections/tab/home-components-tabs";
import PixaBackground from "@/components/ui/pixa-background";

export default function Page() {
  return (
    <div className="flex flex-col h-full lg:max-w-screen-2xl overflow-clip mx-auto">
      <PixaBackground />
      <Header />
      <Hero />
      <HomeComponentsTabs />
      <Footer />
    </div>
  );
}
