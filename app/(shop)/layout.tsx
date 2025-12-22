import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
