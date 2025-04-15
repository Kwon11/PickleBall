import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "react-day-picker/style.css";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/lib/supabase";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pickleball",
  description: "Manage your pickleball events and clubs",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {session?.user && <Navigation user={session.user} onSignOut={() => supabase.auth.signOut()} />}
        <div className={session?.user ? "ml-64" : ""}>
          {children}
        </div>
      </body>
    </html>
  );
}
