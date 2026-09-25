import { formatearPrecio, precioFinal } from '../utils/precios.js'

function ItemCarrito({ producto, cantidad, onRestar, onSumar, onQuitar }) {
  return (
    <li className="item-carrito">
      <span className="item-nombre">{producto.nombre}</span>

      <span className="item-cantidad">
        <button type="button" className="btn btn-secundario btn-carrito" onClick={onRestar}
          aria-label={`Quitar una unidad de ${producto.nombre}`}>−</button>
        <span className="item-unidades">{cantidad}</span>
        <button type="button" className="btn btn-secundario btn-carrito" onClick={onSumar}
          aria-label={`Agregar una unidad de ${producto.nombre}`}>+</button>
      </span>

      <span className="item-subtotal">{formatearPrecio(precioFinal(producto) * cantidad)}</span>

      <button type="button" className="btn btn-secundario btn-carrito" onClick={onQuitar}
        aria-label={`Quitar ${producto.nombre} del carrito`}>Quitar</button>
    </li>
  )
}

export default ItemCarrito
