import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";

export default function Page() {
  return (
    <div className="flex flex-col h-full lg:max-w-screen-2xl mx-auto">
      <Header />
      <div className="flex flex-col min-h-[70vh] items-center justify-center h-full">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="mt-4 text-lg">The page you are looking for does not exist.</p>
        <a href="/" className="mt-6 text-blue-500 hover:underline">
          Go back to Home
        </a>
      </div>
      <Footer />
    </div>
  );
}
