import type { Metadata, Viewport } from "next";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";
import "@fontsource/rubik/hebrew-400.css";
import "@fontsource/rubik/hebrew-700.css";
import "@fontsource/opendyslexic/400.css";
import "./globals.css";
import "./a11y.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import A11yWidget from "@/components/A11yWidget";

export const metadata: Metadata = {
  title: { default: "FINDLESS", template: "%s · FINDLESS" },
  description: "couldn't find clothes we liked, so we made them.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        <div id="site">
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </div>
        <A11yWidget />
      </body>
    </html>
  );
}
