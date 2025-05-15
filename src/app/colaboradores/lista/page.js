'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ListaColaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  const [filtro, setFiltro] = useState('');
  const router = useRouter();

  useEffect(() => {
    cargarColaboradores();
  }, []);

  const cargarColaboradores = async () => {
    const res = await fetch('/api/colaboradores');
    const data = await res.json();
    setColaboradores(data);
  };

  const filtrados = colaboradores.filter(colab =>
    colab.NombreCompleto.toLowerCase().includes(filtro.toLowerCase()) ||
    colab.Cargo.toLowerCase().includes(filtro.toLowerCase()) ||
    colab.Area?.NombreArea.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div style={{
      maxWidth: 800, margin: '30px auto', padding: 20,
      background: '#1a1a1a', borderRadius: 20, color: '#fff',
      boxShadow: '0 0 20px #00000050'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Listado de Colaboradores</h2>

      {/* 🔙 BOTÓN DE REGRESO */}
      <button
        onClick={() => router.push('/colaboradores')}
        style={{
          padding: 10,
          background: '#00cfff',
          color: '#000',
          fontWeight: 'bold',
          marginBottom: 20,
          borderRadius: 8
        }}
      >
        ← Regresar al Formulario
      </button>

      {/* 🔎 CAMPO DE BÚSQUEDA */}
      <input
        type="text"
        placeholder="Buscar por nombre, cargo o área..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{
          padding: 10,
          borderRadius: 8,
          border: 'none',
          outline: 'none',
          fontSize: 15,
          marginBottom: 20,
          width: '100%',
          color: '#000'
        }}
      />

      {/* 🧾 LISTADO */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtrados.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No se encontraron resultados.</p>
        ) : (
          filtrados.map(colab => (
            <div key={colab.IdColaborador} style={{
              background: '#445e55',
              padding: 14,
              borderRadius: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
              <div style={{ fontWeight: 'bold', fontSize: 16 }}>{colab.NombreCompleto}</div>
              <div style={{ fontSize: 14 }}>📄 Documento: {colab.Documento}</div>
              <div style={{ fontSize: 14 }}>✉️ Correo: {colab.Correo}</div>
              <div style={{ fontSize: 14 }}>📞 Teléfono: {colab.Telefono}</div>
              <div style={{ fontSize: 14 }}>🏢 Departamento: {colab.Area?.NombreArea || 'Sin asignar'}</div>
              <div style={{ fontSize: 14 }}>💼 Cargo: {colab.Cargo}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
