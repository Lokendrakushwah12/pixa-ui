import { Button } from "@/components/Button/Button";
import Nav from "@/components/pixa-ui/Nav";

export default function Home() {
  return (
    <>
      <div className="flex h-screen w-full flex-col items-center justify-between text-center">
        <Nav />
        <div className="my-[8rem] flex h-full flex-col items-center justify-center gap-4 px-3">
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <h1 className="max-w-lg text-3xl font-bold tracking-tight md:max-w-2xl md:text-5xl">
              Curated collection of versatile React/Next components
            </h1>
            <p className="font-[300] text-[#777] dark:text-[#777]">
              Crafted with Tailwind CSS to accelerate your development speed.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button>Get Started</Button>
            <Button variant="secondary">GitHub</Button>
          </div>
        </div>
      </div>
    </>
  );
}
