import { LoginProvider } from "@/context/LoginProvider";
import "./globals.css";

import { Noto_Serif, Roboto, Lato, Play } from "next/font/google";

export const metadata = {
  title: "Forum",
  description: "A dynamicaly updating comments form | Forum",
};

export const noto = Noto_Serif({
  subsets: ["latin"],
  style: "normal",
  weight: "400",
  variable: "--font-noto",
});

export const roboto = Roboto({
  subsets: ["latin"],
  style: "normal",
  weight: "400",
  variable: "--font-roboto",
});

export const lato = Lato({
  subsets: ["latin"],
  style: "normal",
  weight: "400",
  variable: "--font-lato",
});

export const play = Play({
  subsets: ["latin"],
  style: "normal",
  weight: "400",
  variable: "--font-play",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <LoginProvider>
        <body
          className={`${noto.variable} ${roboto.variable} ${lato.variable} ${play.variable} antialiased`}
        >
          {children}
        </body>
      </LoginProvider>
    </html>
  );
}
