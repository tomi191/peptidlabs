import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Поръчката е приета · PeptidLabs",
  description: "Благодарим Ви за поръчката.",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
