import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import SigninCard from "./SigninCard";

export default async function SigninPage() {
  const session = await auth();
  if (session?.user) redirect("/app");
  return (
    <div className="signal-auth flex min-h-[100dvh] flex-col items-center justify-center px-5 py-12" data-theme="signal">
      <div className="signal-wordmark mb-8">
        syntax<span>drill</span>
      </div>
      <SigninCard />
    </div>
  );
}
