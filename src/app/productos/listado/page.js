'use client';
import { useEffect, useState } from 'react';

export default function ProductosListado() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const res = await fetch('/api/productos');
    const data = await res.json();
    setProductos(data);
  };

  return (
    <main className="contenedor">
      <h1>Listado de Productos</h1>

      <input
        type="text"
        placeholder="Buscar por nombre o código..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '20px',
          borderRadius: '10px',
          border: '1px solid #ccc',
          fontSize: '14px',
        }}
      />

      {/* SOLO UN MAP AQUÍ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        {productos
          .filter((p) =>
            p.Nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.Codigo.toLowerCase().includes(busqueda.toLowerCase())
          )
          .map((p) => (
            <div
              key={p.IdProducto}
              style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                color: '#333',
              }}
            >
              <h3 style={{ fontWeight: 'bold', marginBottom: 8 }}>{p.Nombre}</h3>
              <p><strong>Código:</strong> {p.Codigo}</p>
              <p><strong>Descripción:</strong> {p.Descripcion}</p>
              <p><strong>Precio:</strong> Q{p.Precio}</p>
              <p><strong>Stock:</strong> {p.Stock}</p>
              <p><strong>Categoría:</strong> {p.Categoria?.Descripcion || 'Sin categoría'}</p>
            </div>
          ))}
      </div>

      <div style={{ marginTop: '30px' }}>
        <button
          onClick={() => window.location.href = '/productos'}
          style={{
            backgroundColor: '#00C2CB',
            color: '#fff',
            padding: '10px 16px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          🔙 Volver al Formulario
        </button>
      </div>
    </main>
  );
}
