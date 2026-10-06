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
import { LangProvider } from "@/components/I18n";
import { getT } from "@/lib/i18n";

export const metadata: Metadata = {
  title: { default: "FINDLESS", template: "%s · FINDLESS" },
  description: "couldn't find clothes we liked, so we made them.",
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000",
  ),
  openGraph: { siteName: "FINDLESS", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { lang, t } = await getT();
  return (
    <html lang={lang} dir={lang === "he" ? "rtl" : "ltr"}>
      <body>
        <LangProvider lang={lang}>
        <a href="#main" className="skip">
          {t.skip}
        </a>
        <div id="site">
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </div>
        <A11yWidget />
        </LangProvider>
      </body>
    </html>
  );
}
