import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl text-center font-medium">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-center text-muted-foreground">The page you are looking for does not exist.</p>
      <Link href="/" className="mt-6 text-muted-foreground hover:underline">
        Go back to Home
      </Link>
    </div>
  );
}
