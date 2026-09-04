import { Navbar } from "@/components/layout/navbar";
import { ThemeSync } from "@/components/layout/theme-sync";
import { Footer } from "@/components/layout/footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeSync />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
