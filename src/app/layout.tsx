export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
 <head>
       <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'); /* Added more weights */
          *{
padding:0;
margin: 0;
}
              body {
          font-family: "Inter", sans-serif;
          background-color: var(--background-light);
          color: var(--medium-text);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: start;
          font-size: 15px; /* Slightly reduced base font size */
        }`}
      </style>
 </head>
      <body>{children}</body>
    </html>
  );
}
