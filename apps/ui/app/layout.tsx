import "./globals.css";



export const metadata = {
  title: "Chess",
  description: "Chess game",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}> 

      <body>
        <div id="app-root">

           {children}

        </div>
      </body>
    </html>
  );
}