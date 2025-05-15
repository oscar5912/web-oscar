'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash } from 'lucide-react';

export default function ColaboradoresPage() {
  const [documento, setDocumento] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cargo, setCargo] = useState('');
  const [idArea, setIdArea] = useState('');
  const [departamentos, setDepartamentos] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [editId, setEditId] = useState(null);

  const router = useRouter();

  useEffect(() => {
    cargarDepartamentos();
    cargarColaboradores();
  }, []);

  const cargarDepartamentos = async () => {
    const res = await fetch('/api/departamentos');
    const data = await res.json();
    setDepartamentos(data);
  };

  const cargarColaboradores = async () => {
    const res = await fetch('/api/colaboradores');
    const data = await res.json();
    setColaboradores(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documento || !nombre || !correo || !telefono || !cargo || !idArea) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const metodo = editId ? 'PUT' : 'POST';
    const endpoint = editId ? `/api/colaboradores?id=${editId}` : `/api/colaboradores`;

    const res = await fetch(endpoint, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Documento: documento,
        NombreCompleto: nombre,
        Correo: correo,
        Telefono: telefono,
        Cargo: cargo,
        IdArea: parseInt(idArea),
        Estado: true
      }),
    });

    if (res.ok) {
      alert(editId ? 'Colaborador actualizado' : 'Colaborador guardado');
      limpiarFormulario();
      cargarColaboradores();
    } else {
      alert('Error al guardar colaborador');
    }
  };

  const limpiarFormulario = () => {
    setDocumento('');
    setNombre('');
    setCorreo('');
    setTelefono('');
    setCargo('');
    setIdArea('');
    setEditId(null);
  };

  const handleEditar = (colab) => {
    setDocumento(colab.Documento);
    setNombre(colab.NombreCompleto);
    setCorreo(colab.Correo);
    setTelefono(colab.Telefono);
    setCargo(colab.Cargo);
    setIdArea(colab.IdArea);
    setEditId(colab.IdColaborador);
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este colaborador?')) return;
    await fetch(`/api/colaboradores?id=${id}`, { method: 'DELETE' });
    cargarColaboradores();
  };

  return (
    <div style={{ maxWidth: 600, margin: '30px auto', padding: 20, background: '#202020', borderRadius: 10, color: '#fff' }}>
      <h2 style={{ textAlign: 'center' }}>Registrar Colaborador</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input value={documento} onChange={(e) => setDocumento(e.target.value)} placeholder="Documento" />
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre completo" />
        <input value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Correo" />
        <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" />
        <select value={idArea} onChange={(e) => setIdArea(e.target.value)}>
          <option value="">Seleccione un departamento</option>
          {departamentos.map(dep => (
            <option key={dep.IdArea} value={dep.IdArea}>
              {dep.NombreArea}
            </option>
          ))}
        </select>
        <input value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="Cargo" />

        <button type="submit" style={{ padding: 10, background: '#00cfff', color: '#000', fontWeight: 'bold' }}>
          {editId ? 'Actualizar' : 'Guardar'}
        </button>

              {/* ✅ BOTÓN PARA IR A LA LISTA */}
      <button
        onClick={() => router.push('/colaboradores/lista')}
        style={{
          padding: 10,
          background: '#00cfff',
          color: '#000',
          fontWeight: 'bold',
          marginBottom: 15,
          borderRadius: 8
        }}
      >
        Ver Lista Completa
      </button>
    
      </form>

      <hr style={{ margin: '20px 0' }} />
      <h3>Colaboradores Registrados:</h3>

      <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {colaboradores.map((colab) => (
          <li key={colab.IdColaborador} style={{
            background: '#3e5c4d',
            color: '#fff',
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 6 }}>
              <Pencil size={18} onClick={() => handleEditar(colab)} style={{ cursor: 'pointer' }} />
              <Trash size={18} onClick={() => handleEliminar(colab.IdColaborador)} style={{ cursor: 'pointer' }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
