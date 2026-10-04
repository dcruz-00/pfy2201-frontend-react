# 16bit — Tienda retro en React

Sitio web de una tienda online de consolas, videojuegos y accesorios retro. Muestra el catálogo en tarjetas, permite filtrar por categoría y buscar por nombre, administrar un carrito de compras y escribir a la tienda mediante un formulario de contacto con validación.

- **Sitio publicado:** https://dcruz-00.github.io/pfy2201-frontend-react/
- **Versión anterior (HTML, CSS, Bootstrap y JavaScript sin framework):** https://github.com/dcruz-00/pfy2201-frontend-tienda — contiene el historial de desarrollo previo a la migración a React.

## Funcionalidades

- Catálogo cargado desde un archivo JSON, con mensajes de carga, error y botón para reintentar.
- Tarjetas de producto con imagen, nombre, descripción, precio normal y precio oferta.
- Filtro por categoría (Consolas, Juegos, Accesorios) desde el menú de navegación.
- Buscador por nombre, sin distinguir mayúsculas ni tildes.
- Carrito: agregar y quitar productos, cambiar cantidades, vaciar (con opción de deshacer) y ver el total. El contenido se guarda en el navegador y se sincroniza entre pestañas.
- Formulario de contacto (nombre, email y mensaje) que valida los datos antes de enviarlos y explica cada error.
- Opiniones de ejemplo cargadas desde una API externa ([FakeStore API](https://fakestoreapi.com)).
- Diseño responsivo para escritorio, tablet y móvil.

## Tecnologías

| Tecnología | Uso en el proyecto |
|---|---|
| React 19 | Componentes, estado (`useState`), efectos (`useEffect`) y props |
| Vite 8 | Servidor de desarrollo y build de producción |
| Bootstrap 5.3 | Navbar, dropdown, carrusel, grilla, tarjetas y formularios |
| CSS3 | Estilos propios con variables, Flexbox y `clamp()` |
| Fetch API | Carga del catálogo y de las opiniones |
| gh-pages | Publicación en GitHub Pages |

## Requisitos

- [Node.js](https://nodejs.org) 20.19 o superior (o 22.12 o superior), que incluye npm.
- [Git](https://git-scm.com).

Para comprobar la versión instalada:

```bash
node --version
```

## Instalación

```bash
git clone https://github.com/dcruz-00/pfy2201-frontend-react.git
cd pfy2201-frontend-react
npm install
```

## Ejecutar en local

```bash
npm run dev
```

Vite muestra en la terminal la dirección local (normalmente http://localhost:5173). Ábrela en el navegador.

### Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con recarga automática |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente la versión de `dist/` para revisarla antes de publicar |
| `npm run lint` | Revisa el código con oxlint |
| `npm run deploy` | Genera el build y lo publica en la rama `gh-pages` |

## Uso del sitio

1. **Navegar:** el menú superior lleva a Inicio, Productos, Contacto y Carrito. En pantallas pequeñas se abre con el botón de menú.
2. **Filtrar por categoría:** en *Categorías*, elige Consolas, Juegos o Accesorios. *Todas* o el enlace *Productos* quitan el filtro de categoría.
3. **Buscar:** escribe en el buscador de la sección Productos; la lista se filtra mientras escribes. Si no hay resultados, el botón *Limpiar filtros* restablece la búsqueda y la categoría.
4. **Comprar:** *Agregar al carrito* suma el producto. En la sección Carrito puedes cambiar cantidades con **+** y **−**, quitar productos o vaciar el carrito (y deshacerlo).
5. **Contactar:** completa nombre, email y mensaje (mínimo 10 caracteres) y pulsa *Enviar mensaje*. Si falta información o el email no es válido, cada campo indica qué corregir. El sitio no tiene servidor, así que el envío se simula y muestra una confirmación.
6. **Opiniones:** *Cargar opiniones* obtiene reseñas desde FakeStore API. Si la conexión falla, se reintenta automáticamente y luego aparece un botón para reintentar.

## Estructura del proyecto

```
pfy2201-frontend-react/
├── index.html                  Punto de entrada HTML
├── package.json                Dependencias y scripts
├── vite.config.js              Configuración de Vite (rutas relativas para GitHub Pages)
├── public/
│   ├── favicon.svg
│   └── assets/
│       ├── data/productos.json Catálogo de productos
│       └── img/                Imágenes del carrusel y de los productos
└── src/
    ├── main.jsx                Monta la aplicación y carga Bootstrap y los estilos
    ├── App.jsx                 Componente raíz: estado global y conexión entre componentes
    ├── styles.css              Estilos propios
    ├── components/             Componentes de la interfaz
    └── utils/                  Lógica sin interfaz: datos, validación, carrito y red
```

### Componentes

| Componente | Responsabilidad |
|---|---|
| `App` | Guarda el estado compartido (productos, categoría, búsqueda, carrito) y lo reparte por props |
| `Navbar` | Menú de navegación, filtro por categoría y contador del carrito |
| `Hero` | Carrusel de banners |
| `Catalogo` | Sección de productos: aplica filtros y muestra estados de carga o sin resultados |
| `Buscador` | Campo de búsqueda por nombre |
| `TarjetaProducto` | Tarjeta de un producto con su botón para agregar |
| `Carrito` | Lista del carrito y mensajes cuando está vacío |
| `ItemCarrito` | Una línea del carrito con sus controles de cantidad |
| `ResumenCarrito` | Total y botón para vaciar |
| `Opiniones` | Carga y muestra las opiniones de la API externa |
| `FormularioContacto` | Formulario de contacto con validación |
| `Estado` | Mensaje reutilizable de carga, error, información o éxito |
| `Footer` | Pie de página con los datos de la tienda |

### Flujo de datos

El estado compartido vive en `App` y baja a los componentes como props. Los componentes hijos no modifican ese estado directamente: reciben funciones (por ejemplo, `onCambiarCategoria` u `onAgregar`) y las llaman cuando la persona usuaria actúa. Así, al elegir una categoría en `Navbar`, `App` actualiza su estado y `Catalogo` vuelve a dibujarse con la lista filtrada.

## Agregar o modificar productos

El catálogo está en `public/assets/data/productos.json`. Cada producto sigue este formato:

```json
{
  "id": 1,
  "nombre": "Sega Dreamcast",
  "descripcion": "Consola retro Sega Dreamcast, incluye control original.",
  "precio": 110000,
  "precioOferta": 82500,
  "categoria": "consolas",
  "imagen": "assets/img/dreamcast.png",
  "alt": "Consola Sega Dreamcast"
}
```

- `id`: número entero único.
- `categoria`: `consolas`, `juegos` o `accesorios`.
- `precioOferta` y `alt` son opcionales.
- La imagen va en `public/assets/img/`.

Los productos con datos inválidos se omiten y se informa el motivo en la consola del navegador, sin detener la carga del resto.

## Publicar en GitHub Pages

```bash
npm run deploy
```

El comando genera el build y lo sube a la rama `gh-pages`. En GitHub, *Settings → Pages* debe estar configurado para publicar desde esa rama (carpeta raíz).