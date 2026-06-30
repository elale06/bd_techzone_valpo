import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductForm() {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const [productos, setProductos] = useState([]);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [notificacion, setNotificacion] = useState('');
  const [ocultandoNotificacion, setOcultandoNotificacion] = useState(false);

  // ==========================================
  // NUEVO: Cargar productos desde MongoDB (Python)
  // ==========================================
  const cargarProductos = async () => {
    try {
      const respuesta = await axios.get('http://localhost:5000/api/productos');
      setProductos(respuesta.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setError("No se pudo conectar con la base de datos.");
    }
  };

  // Se ejecuta una sola vez al cargar la página
  useEffect(() => {
    cargarProductos();
  }, []);

  const handleImageChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const tamanoMaximo = 2 * 1024 * 1024;
      if (archivo.size > tamanoMaximo) {
        setError('Error: La imagen supera el tamaño máximo permitido de 2MB.');
        setImagen(null);
        setPreview(null);
        return;
      }
      setError('');
      setImagen(archivo);
      setPreview(URL.createObjectURL(archivo));
    }
  };

  const convertirABase64 = (archivo) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(archivo);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !precio || !categoria || !descripcion.trim() || !stock) {
      setError('Error: Todos los campos de texto son obligatorios.');
      return;
    }

    try {
      // Convertir la imagen a texto Base64 si existe
      let imagenBase64 = null;
      if (imagen) {
        imagenBase64 = await convertirABase64(imagen);
      }

      const payload = {
        nombre: nombre,
        precio: Number(precio),
        stock: Number(stock),
        categoria: categoria,
        descripcion: descripcion,
        imagen: imagenBase64 // Se envía la imagen como texto
      };

      await axios.post('http://localhost:5000/api/productos', payload);

      setNombre(''); setPrecio(''); setCategoria('');
      setDescripcion(''); setStock(''); setImagen(null); setPreview(null);

      setNotificacion('✅ Producto guardado con categoría e imagen');
      setOcultandoNotificacion(false);
      setTimeout(() => {
        setOcultandoNotificacion(true);
        setTimeout(() => setNotificacion(''), 400);
      }, 3000);

      cargarProductos();

    } catch (error) {
      console.error("Error al guardar:", error);
      setError("Hubo un error al guardar el producto.");
    }
  };

  const handleEliminar = (id) => {
    setProductoAEliminar(id);
  };

  // Por ahora la eliminación sigue siendo local (para borrar de MongoDB necesitas agregar la ruta DELETE en Python)
  const confirmarEliminacion = () => {
    const productosFiltrados = productos.filter(prod => prod._id !== productoAEliminar);
    setProductos(productosFiltrados);
    setProductoAEliminar(null); 
    setNotificacion('✅ Producto ocultado (falta ruta DELETE en API)');
    setOcultandoNotificacion(false);
    setTimeout(() => {
      setOcultandoNotificacion(true);
      setTimeout(() => {
        setNotificacion('');
        setOcultandoNotificacion(false);
      }, 400); 
    }, 3000);
  };

  const cancelarEliminacion = () => {
    setProductoAEliminar(null);
  };

  return (
    <div className="form-container">
      <h2>TechZone Store - Registro de Productos</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del Producto:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Notebook Gamer Pro" />
        </div>
        <div className="form-row">
          <div>
            <label>Precio ($):</label>
            <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="2699990" />
          </div>
          <div>
            <label>Stock Inicial:</label>
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="5" />
          </div>
        </div>
        <div>
          <label>Categoría:</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="">Seleccione una categoría</option>
            <option value="Computación">Computación</option>
            <option value="Smartphones">Smartphones</option>
            <option value="Accesorios">Accesorios</option>
          </select>
        </div>
        <div>
          <label>Descripción del Producto:</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="3" placeholder="Detalles..." />
        </div>
        <div>
          <label>Imagen (Máx. 2MB):</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        {preview && (
          <div className="preview-container">
            <p>Vista previa:</p>
            <img src={preview} alt="Vista previa" width="120" />
          </div>
        )}
        <button type="submit">Guardar Producto</button>
      </form>

      <hr />
      <h3>Productos en Base de Datos (Total: {productos.length})</h3>

      {productos.length === 0 ? (
        <div className="empty-state">No hay productos en MongoDB.</div>
      ) : (
        <div className="productos-list">
          {productos.map((prod) => (
            <div key={prod._id} className="producto-card">
              <span className="categoria-tag">{prod.categoria || 'Sin categoría'}</span>
              <h4>{prod.nombre}</h4>
              <p className="descripcion-text">{prod.descripcion}</p>
              <div className="card-meta">
                <p><strong>Precio:</strong> ${prod.precio}</p>
                <p><strong>Stock:</strong> {prod.stock} uds.</p>
              </div>
              <button onClick={() => handleEliminar(prod._id)} className="btn-eliminar">Eliminar Producto</button>
            </div>
          ))}
        </div>
      )}

      {productoAEliminar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Confirmar Eliminación</h4>
            <p>¿Estás seguro de que deseas eliminar este producto?</p>
            <div className="modal-botones">
              <button onClick={cancelarEliminacion} className="btn-cancelar">Cancelar</button>
              <button onClick={confirmarEliminacion} className="btn-confirmar">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
      {notificacion && (
        <div className={`toast-notificacion ${ocultandoNotificacion ? 'fade-out' : ''}`}>
          {notificacion}
        </div>
      )}
    </div>
  );
}

export default ProductForm;