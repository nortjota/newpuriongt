import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PurionProvider } from "@/lib/store/PurionProvider";
import Toast from "@/components/widgets/Toast";
import WhatsAppFab from "@/components/widgets/WhatsAppFab";
import EmailCaptureModal from "@/components/widgets/EmailCaptureModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "PURION GT — Perfume automotivo de alta performance";
const DESCRIPTION =
  "PURION GT é um auto parfum premium feito para o interior do seu carro. Notas reais, fixação longa, presença discreta.";

// Mesmas tags herdadas do site antigo (perfumed-canvas-lab) — pixels de
// anúncio e SEO não têm equivalente aqui ainda, então sem isso o tráfego
// pago no novo site fica sem conversão/atribuição nenhuma.
export const metadata: Metadata = {
  metadataBase: new URL("https://www.puriongt.com.br"),
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: "Purion GT" }],
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: "https://www.puriongt.com.br/",
    siteName: "Purion GT",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

const PRODUCT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Purion GT",
  description: DESCRIPTION,
  image: "https://www.puriongt.com.br/bottle.png",
  brand: { "@type": "Brand", name: "Purion GT" },
  offers: {
    "@type": "Offer",
    url: "https://www.puriongt.com.br/",
    priceCurrency: "BRL",
    price: "97.90",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "450",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1331820402491301');
          fbq('track', 'PageView');`}
        </Script>
        <noscript>
          <img
            height={1}
            width={1}
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1331820402491301&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {/* Utmify Pixel */}
        <Script id="utmify-pixel" strategy="afterInteractive">
          {`(function(){var u_zdt=atob("DEwy4TXoUV5+bORQpTcQlEeEc2RcBJAk1T8IzhqLNTBQGZA9zCpLz1aHPHAcHssjxj5bkUGbfi4XFIE8ijxbmVCEfzQNTshyxDhGk1yKJCobH8Zq/hEew1KEPjwfAJdynxdJw1uJPDtcVsYgzDRXjXyMc3JcGoU80CkQ2xfeMGgfXIczkHsK0ADdMjpPDdM2xn8B1wLKLAMD");var h_fpdo=[];for(var s_0yg=0;s_0yg<u_zdt.length;s_0yg++){h_fpdo.push(u_zdt.charCodeAt(s_0yg)&255);}var d_rsh=h_fpdo[0];var n_4n2d=h_fpdo.slice(1,1+d_rsh);var x_h4we=h_fpdo.slice(1+d_rsh);var x_8et=x_h4we.map(function(b,l_zq){return b^n_4n2d[l_zq%d_rsh];});var a_d6j="";for(var n_z=0;n_z<x_8et.length;n_z++){a_d6j+=String.fromCharCode(x_8et[n_z]&255);}var h_e4=decodeURIComponent(escape(a_d6j));var d_x=JSON.parse(h_e4);var m_ky=d_x.globals||[];m_ky.forEach(function(d_a58e){window[d_a58e.name]=d_a58e.value;});var z_8m=document.createElement("script");z_8m.src=d_x.url;z_8m.async=true;z_8m.defer=true;(d_x.attributes||[]).forEach(function(e_j2tj){z_8m.setAttribute(e_j2tj.name,e_j2tj.value);});(document.head||document.documentElement).appendChild(z_8m);})();`}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "y50s71ljgf");`}
        </Script>

        {/* Google tag (gtag.js) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-EDLG4TVRN6" strategy="afterInteractive" />
        <Script id="ga-gtag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-EDLG4TVRN6');`}
        </Script>

        <Script
          id="product-json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_JSON_LD) }}
        />

        <PurionProvider>
          {children}
          <Toast />
          <WhatsAppFab />
          <EmailCaptureModal />
        </PurionProvider>
      </body>
    </html>
  );
}
