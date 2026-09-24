import type { Metadata } from "next";
import { ThankYouContent } from "@/components/site/ThankYouContent";

export const revalidate = 0;
export const metadata: Metadata = { title: "Obrigado" };

export default function ObrigadoLpPage() {
  return <ThankYouContent message="Nossa equipe entrará em contato em breve!" />;
}
