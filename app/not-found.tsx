import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import PixaBackground from "@/components/ui/pixa-background";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex relative flex-col overflow-hidden h-screen lg:max-w-screen-2xl mx-auto">
      <Header />
      <PixaBackground />
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl text-center font-medium">404 - Page Not Found</h1>
        <p className="mt-4 text-lg text-center text-muted-foreground">The page you are looking for does not exist.</p>
        <Link href="/" className="mt-6 text-muted-foreground hover:underline">
          Go back to Home
        </Link>
      </div>
      <Footer />
    </div>
  );
}
