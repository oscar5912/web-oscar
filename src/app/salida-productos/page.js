// ✅ Archivo: src/app/salida-productos/page.js
'use client';

import { useEffect, useState } from 'react';
import { Trash2, FileText } from 'lucide-react';

export default function SalidaProductosPage() {
  const [colaboradores, setColaboradores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [despachos, setDespachos] = useState([]);

  const [busquedaDoc, setBusquedaDoc] = useState('');
  const [colaboradorSeleccionado, setColaboradorSeleccionado] = useState(null);

  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);
    
    useEffect(() => {
    fetch('/api/colaboradores')
        .then(res => res.json())
        .then(setColaboradores);

    fetch('/api/productos')
        .then(res => res.json())
        .then(setProductos);

    fetch('/api/salidas')
        .then(res => res.json())
        .then(data => {
        if (Array.isArray(data)) {
            setDespachos(data);
        } else {
            setDespachos([]);
            console.error('❌ Los despachos no son un arreglo:', data);
        }
        });
    }, []);

  const buscarPorDocumento = () => {
    const encontrado = colaboradores.find(c => c.Documento === busquedaDoc);
    if (encontrado) {
      setColaboradorSeleccionado(encontrado);
      setBusquedaDoc('');
    } else alert('Colaborador no encontrado');
  };

  const agregarProducto = () => {
    const prod = productos.find(p => p.IdProducto == productoId);
    if (!prod) return alert('Seleccione un producto válido');
    if (cantidad <= 0 || cantidad > prod.Stock) return alert('Cantidad inválida');

    const subtotal = prod.Precio * cantidad;
    setCarrito([...carrito, { ...prod, cantidad, subtotal }]);
    setCantidad(1);
    setProductoId('');
  };

  const eliminarProducto = (index) => {
    const copia = [...carrito];
    copia.splice(index, 1);
    setCarrito(copia);
  };

  const despachar = async () => {
    if (!colaboradorSeleccionado || carrito.length === 0) {
      alert('Debe seleccionar colaborador y productos.');
      return;
    }

    const body = {
      IdUsuario: 1, // Temporal fijo
      NumeroBoleta: `BOLETA-${Date.now()}`,
      DocumentoColaborador: colaboradorSeleccionado.Documento,
      NombreColaborador: colaboradorSeleccionado.NombreCompleto,
      DepartamentoColaborador: colaboradorSeleccionado.Area?.NombreArea,
      CargoColaborador: colaboradorSeleccionado.Cargo,
      Productos: carrito.map(p => ({
        IdProducto: p.IdProducto,
        CodigoProducto: p.Codigo,
        NombreProducto: p.Nombre,
        Precio: p.Precio,
        Cantidad: p.cantidad
      }))
    };

    const res = await fetch('/api/salidas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      alert('✅ Despacho registrado correctamente.');
      setCarrito([]);
      setColaboradorSeleccionado(null);
      fetch('/api/salidas')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setDespachos(data);
          else setDespachos([]);
        });
    } else {
      alert('❌ Error al despachar');
    }
  };

  const total = carrito.reduce((acc, item) => acc + item.subtotal, 0);

  return (
    <div style={{ maxWidth: 800, margin: '30px auto', padding: 20, background: '#1a1a1a', borderRadius: 10, color: '#fff' }}>
      <h2 style={{
  textAlign: 'center',
  marginBottom: 20,
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#ffffff', // blanco brillante
  textShadow: '1px 1px 2px #00000050' // leve sombra para que resalte
}}>
  Salida de Productos
</h2>


      <div style={{ marginBottom: 20 }}>
        <label>Buscar por documento:</label>
        <div style={{ display: 'flex', gap: 10 }}>
          <input value={busquedaDoc} onChange={e => setBusquedaDoc(e.target.value)} placeholder="Documento" />
          <button onClick={buscarPorDocumento}>Buscar</button>
        </div>

        <label style={{ marginTop: 10 }}>O seleccionar colaborador:</label>
        <select value={colaboradorSeleccionado?.IdColaborador || ''} onChange={e => {
          const id = e.target.value;
          const colab = colaboradores.find(c => c.IdColaborador == id);
          setColaboradorSeleccionado(colab);
          setBusquedaDoc('');
        }}>
          <option value=''>Seleccione</option>
          {colaboradores.map(c => (
            <option key={c.IdColaborador} value={c.IdColaborador}>
              {c.NombreCompleto} - {c.Documento}
            </option>
          ))}
        </select>
      </div>

      {colaboradorSeleccionado && (
        <div style={{ marginBottom: 20, background: '#334e3b', padding: 10, borderRadius: 8 }}>
          <strong>{colaboradorSeleccionado.NombreCompleto}</strong><br />
          📄 Documento: {colaboradorSeleccionado.Documento}<br />
          🏢 Departamento: {colaboradorSeleccionado.Area?.NombreArea}<br />
          💼 Cargo: {colaboradorSeleccionado.Cargo}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <label>Producto:</label>
        <select value={productoId} onChange={e => setProductoId(e.target.value)}>
          <option value=''>Seleccione producto</option>
          {productos.map(p => (
            <option key={p.IdProducto} value={p.IdProducto}>
              {p.Nombre} - Stock: {p.Stock}
            </option>
          ))}
        </select>

        <label>Cantidad:</label>
        <input type='number' value={cantidad} onChange={e => setCantidad(Number(e.target.value))} />
        <button onClick={agregarProducto}>Agregar</button>
      </div>

      <h3>Productos Agregados:</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {carrito.map((item, i) => (
          <li key={i} style={{ background: '#3e5c4d', padding: 10, marginBottom: 8, borderRadius: 8 }}>
            <div><strong>{item.Nombre}</strong></div>
            <div>💲 Precio: {item.Precio} x {item.cantidad} = {item.subtotal}</div>
            <Trash2 style={{ cursor: 'pointer', marginTop: 5 }} onClick={() => eliminarProducto(i)} />
          </li>
        ))}
      </ul>

      <h3>Total: 💰 {total}</h3>
      <button onClick={despachar} style={{ padding: 10, background: '#00cfff', color: '#000', fontWeight: 'bold' }}>
        Despachar
      </button>

      <hr style={{ margin: '30px 0' }} />
      <h3>📄 Registros de Despacho</h3>
      {Array.isArray(despachos) && despachos.map(d => (
        <div key={d.IdDespacho} style={{ background: '#334e3b', padding: 10, borderRadius: 8, marginBottom: 10 }}>
          <strong>No. {d.IdDespacho}</strong> - {d.NombreColaborador} - 📅 {d.FechaRegistro?.substring(0, 10)}
          <br />💰 Total: Q{d.MontoTotal}
          <br />
          <a href={`/api/salidas/pdf?id=${d.IdDespacho}`} target="_blank" title="Ver PDF">
            <FileText style={{ cursor: 'pointer', marginTop: 5 }} />
          </a>
        </div>
      ))}
    </div>
  );
}
