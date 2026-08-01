import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Providers from "@/components/Providers";
import SyncProvider from "@/components/SyncProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SyntaxDrill | Learn syntax by typing it",
    template: "%s · SyntaxDrill",
  },
  description:
    "A coding typing-practice platform that teaches real programming syntax and concepts. Type real code, learn loops, OOP, async, databases and more. Free forever.",
};

// Legacy theme ids map onto the Drillbook variants, dark to night and
// light to paper, so returning users keep their mode without a flash.
const LEGACY_THEMES = `{"tokyo-night":"night","rose-pine":"night","dracula":"night","sunset":"night","tokyo-night-light":"paper-light","rose-pine-light":"paper-light","dracula-light":"paper-light","sunset-light":"paper-light"}`;

function themeScript() {
  return `try{var map=${LEGACY_THEMES},t=localStorage.getItem("sd.theme"),s;if(t){s=map[t]||t}else{try{s=matchMedia("(prefers-color-scheme: light)").matches?"paper-light":"paper"}catch(e){s="paper"}}document.documentElement.dataset.theme=s}catch(e){document.documentElement.dataset.theme="paper"}`;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themeScript(),
          }}
        />
      </head>
      <body className="min-h-full">
        <ThemeProvider>
          <Providers>
            {children}
            <SyncProvider />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
