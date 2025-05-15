import '../../public/styles.css'; // Ajusta el path si tu estructura es distinta

export const metadata = {
  title: 'Inventario Web',
  description: 'Sistema de gestión de productos',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
