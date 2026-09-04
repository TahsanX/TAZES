import type { Metadata } from "next";

// The register page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Register as Alumni",
  description:
    "Add yourself to the alumni directory. Submissions are reviewed by an admin before they appear publicly, and your phone and Facebook stay private unless you are asked and agree.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
