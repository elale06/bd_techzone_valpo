import React, { useState } from 'react';

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !precio || !categoria || !descripcion.trim() || !stock || !imagen) {
      setError('Error: Todos los campos del formulario son estrictamente obligatorios.');
      return;
    }

    if (Number(precio) <= 0 || !Number.isInteger(Number(precio))) {
      setError('Error: El precio debe ser un número entero mayor a cero.');
      return;
    }

    if (Number(stock) < 0 || !Number.isInteger(Number(stock))) {
      setError('Error: El stock disponible debe ser un número entero mayor o igual a cero.');
      return;
    }

    setError('');

    const nuevoProducto = {
      id: Date.now(),
      nombre,
      precio,
      categoria,
      descripcion,
      stock,
      preview
    };

    setProductos([...productos, nuevoProducto]);

    setNombre('');
    setPrecio('');
    setCategoria('');
    setDescripcion('');
    setStock('');
    setImagen(null);
    setPreview(null);
  };

  const handleEliminar = (id) => {
    setProductoAEliminar(id);
  };

// 2. Si el usuario confirma, borramos el producto y mostramos notificación con fade out
  const confirmarEliminacion = () => {
    const productosFiltrados = productos.filter(prod => prod.id !== productoAEliminar);
    setProductos(productosFiltrados);
    setProductoAEliminar(null); 
    setNotificacion('✅ Producto eliminado con éxito');
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
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Notebook Gamer Pro"
          />
        </div>

        <div className="form-row">
          <div>
            <label>Precio ($):</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              onKeyDown={(e) => {
                if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="2699990"
              step="1"
              min="1"
            />
          </div>

          <div>
            <label>Stock Inicial:</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              onKeyDown={(e) => {
                if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="5"
              step="1"
              min="0"
            />
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
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="3"
            placeholder="Escribe los detalles y especificaciones del producto..."
          />
        </div>

        <div>
          <label>Imagen (Máx. 2MB):</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {preview && (
          <div className="preview-container">
            <p>Vista previa de selección:</p>
            <img src={preview} alt="Vista previa" width="120" />
          </div>
        )}

        <button type="submit">Guardar Producto</button>
      </form>

      <hr />

      <h3>Productos Registrados (Total: {productos.length})</h3>

      {productos.length === 0 ? (
        <div className="empty-state">
          Aún no hay productos registrados. Agrega el primero usando el formulario superior.
        </div>
      ) : (
        <div className="productos-list">
          {productos.map((prod) => (
            <div key={prod.id} className="producto-card">
              <span className="categoria-tag">{prod.categoria}</span>
              <h4>{prod.nombre}</h4>
              <p className="descripcion-text">{prod.descripcion}</p>
              <div className="card-meta">
                <p><strong>Precio:</strong> ${prod.precio}</p>
                <p><strong>Stock:</strong> {prod.stock} uds.</p>
              </div>
              <img src={prod.preview} alt={prod.nombre} />
              <button
                onClick={() => handleEliminar(prod.id)}
                className="btn-eliminar"
              >
                Eliminar Producto
              </button>
            </div>
          ))}
        </div>
      )}

      {productoAEliminar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Confirmar Eliminación</h4>
            <p>¿Estás seguro de que deseas eliminar este producto de la tienda? Esta acción no se puede deshacer.</p>
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
