// Root layout is a pass-through; <html> and <body> live in [locale]/layout.tsx
// so the lang attribute can be set from the locale param.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
