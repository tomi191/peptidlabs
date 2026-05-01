import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Проследяване на поръчка · PeptidLabs",
  description: "Проследете статуса на поръчката си с номер на поръчка.",
  robots: { index: false, follow: false },
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
