import { useRef } from 'react'
import { Collapse } from 'bootstrap'
import { CATEGORIAS } from '../utils/catalogo.js'

const OPCIONES_CATEGORIA = [['todas', 'Todas'], ...Object.entries(CATEGORIAS)]

function Navbar({ categoria, onCambiarCategoria, cantidadArticulos }) {
  const menuRef = useRef(null)

  // En móvil, Bootstrap no cierra el menú al navegar a un ancla. Se cierra
  // con cualquier enlace salvo el toggle de "Categorías", que solo abre su submenú.
  function cerrarMenuMovil(event) {
    const enlace = event.target.closest('a[href^="#"]')
    const menu = menuRef.current
    if (!enlace || enlace.classList.contains('dropdown-toggle') || !menu.classList.contains('show')) return

    Collapse.getOrCreateInstance(menu, { toggle: false }).hide()
  }

  return (
    <nav className="navbar navbar-expand-md header" id="inicio">
      <div className="container-fluid">

        <a className="navbar-brand marca" href="#inicio">
          <h1 className="titulo-marca">16bit</h1>
          <span className="subtitulo">Tienda de consolas, videojuegos y accesorios retro.</span>
        </a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal"
          aria-controls="menuPrincipal" aria-expanded="false" aria-label="Abrir menú de navegación">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menuPrincipal" ref={menuRef}>
          <ul className="navbar-nav ms-md-auto" onClick={cerrarMenuMovil}>
            <li className="nav-item"><a className="nav-link" href="#inicio">Inicio</a></li>
            {/* "Productos" muestra el catálogo completo, así que quita el filtro de categoría. */}
            <li className="nav-item">
              <a className="nav-link" href="#productos" onClick={() => onCambiarCategoria('todas')}>Productos</a>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">Categorías</a>
              <ul className="dropdown-menu dropdown-menu-md-end">
                {OPCIONES_CATEGORIA.map(([clave, nombre]) => (
                  <li key={clave}>
                    <a href="#productos"
                      className={clave === categoria ? 'dropdown-item active' : 'dropdown-item'}
                      aria-current={clave === categoria ? 'true' : undefined}
                      onClick={() => onCambiarCategoria(clave)}>
                      {nombre}
                    </a>
                  </li>
                ))}
              </ul>
            </li>

            <li className="nav-item"><a className="nav-link" href="#contacto">Contacto</a></li>

            <li className="nav-item">
              <a className="nav-link" href="#carrito">Carrito
                <span className="badge rounded-pill badge-carrito">{cantidadArticulos}</span>
                <span className="visually-hidden">artículos en el carrito</span>
              </a>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  )
}

export default Navbar
