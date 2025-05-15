'use client';
import { useEffect, useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

export default function Page() {
  const [form, setForm] = useState({
    Codigo: '',
    Nombre: '',
    Descripcion: '',
    Precio: '',
    Stock: '',
    IdCategoria: '',
  });
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchCategorias();
    fetchProductos();
  }, []);

  const fetchCategorias = async () => {
    const res = await fetch('/api/categorias');
    const data = await res.json();
    setCategorias(data);
  };

  const fetchProductos = async () => {
    const res = await fetch('/api/productos');
    const data = await res.json();
    setProductos(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const metodo = editId ? 'PUT' : 'POST';
    const endpoint = editId
      ? `/api/productos?id=${editId}`
      : '/api/productos';

    const res = await fetch(endpoint, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        IdCategoria: parseInt(form.IdCategoria),
        Precio: parseFloat(form.Precio),
        Stock: parseInt(form.Stock),
        Estado: true,
      }),
    });

    if (res.ok) {
      setForm({
        Codigo: '',
        Nombre: '',
        Descripcion: '',
        Precio: '',
        Stock: '',
        IdCategoria: '',
      });
      setEditId(null);
      fetchProductos();
      alert(editId ? 'Producto actualizado' : 'Producto guardado');
    } else {
      const error = await res.json();
      alert(error.mensaje || 'Error al guardar el producto');
    }
  };

  const handleEditar = (prod) => {
    setForm({
      Codigo: prod.Codigo,
      Nombre: prod.Nombre,
      Descripcion: prod.Descripcion,
      Precio: prod.Precio.toString(),
      Stock: prod.Stock.toString(),
      IdCategoria: prod.IdCategoria.toString(),
    });
    setEditId(prod.IdProducto);
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Deseas eliminar este producto?')) return;
    await fetch(`/api/productos?id=${id}`, { method: 'DELETE' });
    fetchProductos();
  };

  return (
    <main className="contenedor">
      <h1>Registrar Producto</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        <input name="Codigo" value={form.Codigo} onChange={handleChange} placeholder="Código" required />
        <input name="Nombre" value={form.Nombre} onChange={handleChange} placeholder="Nombre" required />
        <input name="Descripcion" value={form.Descripcion} onChange={handleChange} placeholder="Descripción" style={{ gridColumn: '1 / -1' }} required />
        <input name="Precio" value={form.Precio} onChange={handleChange} placeholder="Precio" required />
        <input name="Stock" value={form.Stock} onChange={handleChange} placeholder="Stock" required />

        <select
          name="IdCategoria"
          value={form.IdCategoria}
          onChange={handleChange}
          required
          style={{ gridColumn: '1 / -1' }}
        >
          <option value="">Seleccione una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.IdCategoria} value={cat.IdCategoria.toString()}>
              {cat.Descripcion}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar producto por nombre o código..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '10px',
            border: '1px solid #ccc',
            fontSize: '14px',
            gridColumn: '1 / -1',
          }}
        />

        <button type="submit" style={{ gridColumn: '1 / -1', background: '#1976d2', color: '#fff', padding: '10px', border: 'none', borderRadius: '8px' }}>
          {editId ? 'Actualizar' : 'Guardar'}
        </button>
      </form>

      <div style={{ gridColumn: '2 / 3', display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => window.location.href = '/productos/listado'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#6a1b9a',
            color: '#fff',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          📝 Ver Listado
        </button>
      </div>

      <h2 style={{ marginBottom: '20px' }}>Productos Registrados</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {productos
          .filter((p) =>
            p.Nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.Codigo.toLowerCase().includes(busqueda.toLowerCase())
          )
          .map((p) => (
            <div key={p.IdProducto} className="tarjeta" style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>
              <h3>{p.Nombre}</h3>
              <p><strong>Código:</strong> {p.Codigo}</p>
              <p><strong>Descripción:</strong> {p.Descripcion}</p>
              <p><strong>Precio:</strong> Q{p.Precio}</p>
              <p><strong>Stock:</strong> {p.Stock}</p>
              <p><strong>Categoría:</strong> {p.Categoria?.Descripcion}</p>
              <div className="acciones" style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button onClick={() => handleEditar(p)} title="Editar" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6a1b9a' }}>
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button onClick={() => handleEliminar(p.IdProducto)} title="Eliminar" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#d32f2f' }}>
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}
