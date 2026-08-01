"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { resetOnSignOut, syncOnSignIn } from "@/lib/storage/store";

export default function SyncProvider() {
  const { status, data } = useSession();

  useEffect(() => {
    if (status === "authenticated" && data?.user?.id) {
      void syncOnSignIn(data.user.id);
    } else if (status === "unauthenticated") {
      resetOnSignOut();
    }
  }, [status, data]);

  return null;
}
