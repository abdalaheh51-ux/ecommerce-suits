import type { Metadata } from "next";
import { Almarai, Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

// Body font — Almarai: modern geometric Arabic, highly legible and elegant
const almarai = Almarai({
  variable: "--font-body",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "700", "800"],
  display: "swap",
});

// Display font for headings — Tajawal: refined editorial feel with strong weights
const tajawal = Tajawal({
  variable: "--font-display",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "فيلورا | VELORA — أزياء رجالية رسمية فاخرة وبدل مفصّلة",
  description:
    "فيلورا وجهتك الأولى للأزياء الرجالية الرسمية الفاخرة. تشكيلة مختارة بعناية من البدل والقمصان والمعاطف والأحذية الرسمية والإكسسوارات. حرفة تفصيل إيطالية وخامات صوف استثنائية.",
  keywords: [
    "فيلورا",
    "VELORA",
    "بدل رجالي",
    "بدلة فاخرة",
    "أزياء رجالية",
    "لبس فورمال",
    "سموكن",
    "تكسييدو",
    "قمصان رجالي",
    "معاطف رجالي",
    "أحذية رسمية",
  ],
  authors: [{ name: "VELORA" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "فيلورا | VELORA — أزياء رجالية رسمية فاخرة",
    description: "بدل مفصّلة بحرفة إيطالية وخامات صوف استثنائية",
    siteName: "VELORA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${almarai.variable} ${tajawal.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
