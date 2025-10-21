import "./style/custom.scss";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" />
<link href="https://fonts.googleapis.com/css2?family=Chivo+Mono:ital,wght@0,100..900;1,100..900&family=Chivo:ital,wght@0,100..900;1,100..900&family=Macondo&family=Noto+Sans+JP:wght@100..900&family=Stick&family=Texturina:ital,opsz,wght@0,12..72,100..900;1,12..72,100..900&display=swap" rel="stylesheet"/>
      </head>
      <body>{children}</body>
    </html>
  );
}
