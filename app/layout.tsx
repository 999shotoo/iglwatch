import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { karla } from "@/lib/fonts";
import { Footer } from "@/components/footer";
import { siteConfig } from "@/lib/config";
import { show } from "@/lib/catalog";
import { featuredSpotlight, playableEpisodes } from "@/lib/data";
import { Analytics } from "@vercel/analytics/next";

const socialImage = show.backdropUrl || show.posterUrl;
const siteIcon = show.posterUrl || show.backdropUrl;

const watchHref = featuredSpotlight[0]
  ? `/w/${featuredSpotlight[0].id}`
  : playableEpisodes[0]
    ? `/w/${playableEpisodes[0].id}`
    : "/";

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
    images: socialImage
      ? [
          {
            url: socialImage,
            width: 1280,
            height: 720,
            alt: "India's Got Latent Archive",
          },
        ]
      : [],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | India's Got Latent Full Archive`,
    description: siteConfig.description,
    images: socialImage ? [socialImage] : [],
  },
  icons: siteIcon
    ? {
        icon: siteIcon,
        shortcut: siteIcon,
        apple: siteIcon,
      }
    : undefined,
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${karla.variable} ${karla.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar watchHref={watchHref} />
          <div className="flex min-h-dvh flex-col pt-14 min-[900px]:pl-16">
            <div className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col px-3 sm:px-4 lg:px-6">
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
