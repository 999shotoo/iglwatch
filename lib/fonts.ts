import { Poppins, Unbounded } from "next/font/google";

export const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const unbounded = Unbounded({
  weight: ["700", "900"],
  subsets: ["latin"],
});
