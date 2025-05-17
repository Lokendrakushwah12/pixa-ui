import About from "@/components/sections/about";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import ComponentsTabs from "@/components/sections/tab/ComponentsTabs";

export default function Page() {
  return (
    <div className="flex flex-col h-full lg:max-w-screen-2xl mx-auto">
      <Header />
      <About />
      <ComponentsTabs />
      <Footer />
    </div>
  );
}
