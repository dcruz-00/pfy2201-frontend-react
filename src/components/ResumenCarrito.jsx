import { formatearPrecio } from '../utils/precios.js'
import { textoArticulos } from '../utils/carrito.js'

function ResumenCarrito({ resumen, onVaciar }) {
  return (
    <div className="resumen-carrito">
      <p className="resumen-total">
        Total ({textoArticulos(resumen.articulos)}): <strong>{formatearPrecio(resumen.total)}</strong>
      </p>
      <button type="button" className="btn btn-secundario" onClick={onVaciar}>Vaciar carrito</button>
    </div>
  )
}

export default ResumenCarrito
