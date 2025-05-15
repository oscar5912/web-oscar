'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const botones = [
    { nombre: '📦 Productos', ruta: '/productos' },
    { nombre: '🏷️ Categorías', ruta: '/categorias' },
    { nombre: '👤 Colaboradores', ruta: '/colaboradores' },
    { nombre: '🏢 Departamentos', ruta: '/departamentos' },
    { nombre: '📤 Salida de Productos', ruta: '/salida-productos' },
  ];

  return (
    <div style={{
      background: '#101010',
      minHeight: '100vh',
      padding: 40,
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#00cfff',
        textShadow: '1px 1px 3px #000'
      }}>
        Sistema Web Oscar
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 20,
        width: '100%',
        maxWidth: 800
      }}>
        {botones.map((btn, i) => (
          <button
            key={i}
            onClick={() => router.push(btn.ruta)}
            style={{
              background: '#00cfff',
              border: 'none',
              borderRadius: 10,
              padding: 20,
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#000',
              cursor: 'pointer',
              boxShadow: '2px 2px 5px #00000050'
            }}
          >
            {btn.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}
