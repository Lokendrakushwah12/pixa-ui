import About from "@/components/sections/about";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import ComponentsTabs from "@/components/sections/tab/ComponentsTabs";
import PixaBackground from "@/components/ui/pixa-background";

export default function Page() {
  return (
    <div className="flex flex-col h-full lg:max-w-screen-2xl overflow-clip mx-auto">
      {/* <SunBackdrop /> */}
      <PixaBackground />
      <Header />
      <About />
      <ComponentsTabs />
      <Footer />
    </div>
  );
}
