import { useEffect, useRef } from 'react'
import { Carousel } from 'bootstrap'
import { usarImagenFallback } from '../utils/imagenes.js'

const IMAGENES_HERO = [
  'assets/img/hero-1.png',
  'assets/img/hero-2.png',
  'assets/img/hero-3.png',
]

function Hero() {
  const carruselRef = useRef(null)

  // Bootstrap solo inicializa los carruseles con data-bs-ride en el evento
  // "load" de la ventana; React puede montar este después, así que se
  // inicializa aquí.
  useEffect(() => {
    const carrusel = Carousel.getOrCreateInstance(carruselRef.current)

    // La transición instantánea para prefers-reduced-motion está en styles.css;
    // aquí se detiene el autoplay.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      carrusel.pause()
    }

    return () => carrusel.dispose()
  }, [])

  return (
    <div id="heroCarousel" className="carousel slide hero-carousel" ref={carruselRef}
      data-bs-ride="carousel" data-bs-interval="3000" data-bs-pause="hover">

      <div className="carousel-indicators">
        {IMAGENES_HERO.map((imagen, indice) => (
          <button key={imagen} type="button" data-bs-target="#heroCarousel" data-bs-slide-to={indice}
            className={indice === 0 ? 'active' : undefined}
            aria-current={indice === 0 ? 'true' : undefined}
            aria-label={`Slide ${indice + 1}`}></button>
        ))}
      </div>

      <div className="carousel-inner">
        {IMAGENES_HERO.map((imagen, indice) => (
          <div key={imagen} className={indice === 0 ? 'carousel-item active' : 'carousel-item'}>
            {/* Imágenes decorativas: alt vacío para que los lectores de pantalla las omitan. */}
            <img src={imagen} className="d-block w-100" alt="" onError={usarImagenFallback} />
          </div>
        ))}
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>

    </div>
  )
}

export default Hero
