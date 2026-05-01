import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Чекаут · PeptidLabs",
  description: "Завършете поръчката си безопасно с криптирано плащане.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
