"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Admin-side boundary. Unlike the public one this does surface the message —
 * the only person who sees it is the operator, and knowing what actually broke
 * is worth more here than a tidy apology.
 */
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isAuth = error.message === "UNAUTHORIZED";

  return (
    <div className="mx-auto max-w-lg py-24 text-center">
      <h1 className="text-xl font-bold text-foreground">
        {isAuth ? "Your session has expired" : "Something went wrong"}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {isAuth ? "Sign in again to continue." : error.message || "An unexpected error occurred."}
      </p>
      <div className="mt-8 flex justify-center gap-3">
        {isAuth ? (
          <a href="/admin/login" className="inline-flex">
            <Button>Sign in</Button>
          </a>
        ) : (
          <Button onClick={reset}>Try again</Button>
        )}
      </div>
    </div>
  );
}
