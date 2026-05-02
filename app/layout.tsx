import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { poppins } from "@/lib/fonts";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | India's Got Latent Episodes & Specials`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: [
    "India's Got Latent", "Samay Raina", "Balraj", "Standup Comedy", "Indian Comedy", "Talent Show", 
    "Latent Talent", "Comedy Show", "Tanmay Bhat", "Raghu Ram", "Kunal Kamra", "Aashish Solanki", 
    "Gaurav Kapoor", "India's Got Latent Episodes", "Watch India's Got Latent"
  ],
  authors: [{ name: `${siteConfig.name} Archive` }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    title: `${siteConfig.name} | India's Got Latent Archive`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "India's Got Latent Archive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | India's Got Latent Full Archive`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="max-w-screen-2xl mx-auto px-2 lg:px-8 flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1">
              <PageTransition>
                {children}
              </PageTransition>
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
