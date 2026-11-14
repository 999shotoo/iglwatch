import { Karla } from "next/font/google";

/**
 * Miruro uses the Karla variable typeface across its entire interface.
 * Keeping a single family (with the full weight range) matches that
 * restrained, content-first look.
 */
export const karla = Karla({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
