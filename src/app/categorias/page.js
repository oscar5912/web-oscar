'use client';
import { useEffect, useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

export default function Page() {
  const [descripcion, setDescripcion] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    const res = await fetch('/api/categorias');
    const data = await res.json();
    setCategorias(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!descripcion.trim()) return;

    const metodo = editId ? 'PUT' : 'POST';
    const endpoint = editId
      ? `/api/categorias?id=${editId}`
      : '/api/categorias';

    const res = await fetch(endpoint, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Descripcion: descripcion }),
    });

    if (res.ok) {
      alert(editId ? 'Categoría actualizada' : 'Categoría guardada');
      setDescripcion('');
      setEditId(null);
      cargarCategorias();
    } else {
      const error = await res.json();
      alert(error.mensaje || 'Error al guardar');
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return;
    await fetch(`/api/categorias?id=${id}`, { method: 'DELETE' });
    cargarCategorias();
  };

  const handleEditar = (cat) => {
    setDescripcion(cat.Descripcion);
    setEditId(cat.IdCategoria);
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(to right, #ffe6f0, #fce4ec)',
      display: 'flex',
      justifyContent: 'center',
      padding: '40px'
    }}>
      <div style={{
        background: '#1c1c1c',
        borderRadius: '18px',
        padding: '30px',
        maxWidth: '600px',
        width: '100%',
        color: '#f0f0f0',
        boxShadow: '0 0 25px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ textAlign: 'center', fontSize: '26px', marginBottom: '20px' }}>
          Registrar Categoría
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="text"
            placeholder="Ingrese descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            style={{
              padding: '12px',
              fontSize: '16px',
              borderRadius: '10px',
              border: 'none',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#00CFFF',
              color: '#000',
              fontWeight: 'bold',
              padding: '14px',
              fontSize: '16px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {editId ? 'Actualizar' : 'Guardar'}
          </button>
        </form>

        <hr style={{ margin: '30px 0', borderColor: '#666' }} />

        <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Categorías registradas:</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {categorias.map((cat) => (
            <div key={cat.IdCategoria} style={{
              backgroundColor: '#556b2f',
              color: 'white',
              padding: '16px 20px',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '16px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}>
              <span>{cat.Descripcion}</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <PencilIcon
                  onClick={() => handleEditar(cat)}
                  style={{ width: '24px', height: '24px', cursor: 'pointer', color: 'white' }}
                  title="Editar"
                />
                <TrashIcon
                  onClick={() => handleEliminar(cat.IdCategoria)}
                  style={{ width: '24px', height: '24px', cursor: 'pointer', color: 'white' }}
                  title="Eliminar"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
