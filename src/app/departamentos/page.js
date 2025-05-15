'use client';
import { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export default function DepartamentosPage() {
  const [nombre, setNombre] = useState('');
  const [departamentos, setDepartamentos] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarDepartamentos();
  }, []);

  const cargarDepartamentos = async () => {
    try {
      const res = await fetch('/api/departamentos');
      if (!res.ok) throw new Error('Error al cargar');
      const data = await res.json();
      setDepartamentos(data);
    } catch (error) {
      console.error(error);
      alert('Error al cargar departamentos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return alert('Ingrese un nombre');

    const metodo = editId ? 'PUT' : 'POST';
    const endpoint = editId
      ? `/api/departamentos?id=${editId}`
      : '/api/departamentos';

    try {
      const res = await fetch(endpoint, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ NombreArea: nombre }),
      });

      if (res.ok) {
        alert(editId ? 'Departamento actualizado' : 'Departamento guardado');
        setNombre('');
        setEditId(null);
        cargarDepartamentos();
      } else {
        const error = await res.json();
        alert(error.mensaje || 'Error al guardar');
      }
    } catch (error) {
      alert('Error al guardar');
      console.error(error);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este departamento?')) return;

    try {
      const res = await fetch(`/api/departamentos?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Departamento eliminado');
        cargarDepartamentos();
      } else {
        alert('Error al eliminar');
      }
    } catch (error) {
      alert('Error de red al eliminar');
    }
  };

  const handleEditar = (dep) => {
    setNombre(dep.NombreArea || '');
    setEditId(dep.IdArea);
  };

  return (
    <div style={{
      maxWidth: 600, margin: '30px auto', padding: 20,
      background: '#1a1a1a', borderRadius: 20, color: '#fff',
      boxShadow: '0 0 20px #00000050'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Registrar Departamento</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          placeholder="Nombre del departamento"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 8,
            border: 'none',
            outline: 'none',
            fontSize: 16,
            background: '#fff',
            color: '#000'
          }}
        />
        <button
          type="submit"
          style={{
            padding: 12,
            background: '#00cfff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 'bold',
            fontSize: 16,
            cursor: 'pointer',
            color: '#000'
          }}
        >
          {editId ? 'Actualizar' : 'Guardar'}
        </button>
      </form>

      <hr style={{ margin: '20px 0', borderColor: '#999' }} />

<h3 style={{ marginBottom: 10 }}>Departamentos Registrados:</h3>
<ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
  {departamentos.map((dep) => (
    <li key={dep.IdArea} style={{
      background: '#3e5c4d',
      color: '#fff',
      padding: 14,
      borderRadius: 10,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>{dep.NombreArea}</span>
      <div style={{ display: 'flex', gap: 15 }}>
        <Pencil size={18} onClick={() => handleEditar(dep)} style={{ cursor: 'pointer' }} />
        <Trash2 size={18} onClick={() => handleEliminar(dep.IdArea)} style={{ cursor: 'pointer' }} />
      </div>
    </li>
  ))}
</ul>


    </div>
  );
}

