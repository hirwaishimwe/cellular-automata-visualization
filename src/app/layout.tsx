import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Wolfram's Game of Life | Cellular Automata Visualization",
  description: "A visualization of Wolfram's cellular automaton as an input to Conway's Game of Life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <header className="bg-black border-b border-zinc-800 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-primary font-bold text-xl">
              <span className="text-secondary">WOLFRAM</span> | GAME OF LIFE
            </div>
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li><a href="#" className="text-white hover:text-primary">ABOUT</a></li>
                <li><a href="#" className="text-white hover:text-primary">PRODUCTS</a></li>
                <li><a href="#" className="text-white hover:text-primary">COMMUNITY</a></li>
                <li><a href="#" className="text-white hover:text-primary">CONTACT</a></li>
              </ul>
            </nav>
          </div>
        </header>
        <div className="py-4 bg-black min-h-screen">
        {children}
        </div>
        <footer className="bg-black border-t border-zinc-800 p-4 text-zinc-500 text-sm">
          <div className="max-w-7xl mx-auto">
            <p>
              A visualization of Wolfram's cellular automaton as an input to Conway's Game of Life.
            </p>
            <p className="mt-2">
              <a href="https://mathworld.wolfram.com/CellularAutomaton.html"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more about cellular automata
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
