import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import SigninCard from "./SigninCard";

export default async function SigninPage() {
  const session = await auth();
  if (session?.user) redirect("/app");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 font-mono text-sm font-semibold tracking-tight text-ink">
        <span className="text-accent">&gt;</span>_ SyntaxDrill
      </div>
      <SigninCard />
    </div>
  );
}
