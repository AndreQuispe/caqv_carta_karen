# Carta digital

Página de una sola pieza, pensada para abrirse desde un código QR en el celular.
HTML, CSS y JavaScript puros — sin frameworks, sin build, sin dependencias.

## Cómo verla

Abre `index.html` en el navegador. Para probar el audio conviene servirla:

    python3 -m http.server 8000

y entrar a http://localhost:8000

## Qué reemplazar

| Archivo | Qué poner |
|---|---|
| `index.html` | Todos los textos: nombres, párrafos de la carta, la frase, la firma |
| `assets/img/foto01.jpg` | La fotografía. Vertical, proporción 4:5, mínimo 1200 px de ancho |
| `assets/audio/cancion.mp3` | La canción. Ideal por debajo de 4 MB para que cargue rápido en datos móviles |

La foto se muestra en monocromo teñido al tono del papel; es deliberado, así
cualquier fotografía se integra sin romper la paleta. Para verla a color, quita
la línea `filter:` de `.photo img` en `css/style.css`.

## Ajustes rápidos

Todo el sistema visual vive en las variables del principio de `css/style.css`:

    --paper   fondo de papel
    --ink     color de texto
    --night   fondo de las secciones oscuras
    --accent  único color de acento

Cambia `--accent` y cambia toda la pieza. Alternativas que funcionan bien con
esta paleta: `#8A7B5F` (oliva), `#7C6A78` (ciruela), `#3F4A45` (verde profundo).

El volumen final de la música se ajusta en `js/script.js` (`VOLUME`).

## Estructura

    ├── index.html
    ├── css/style.css
    ├── js/script.js
    ├── assets/
    │   ├── audio/cancion.mp3
    │   └── img/foto01.jpg
    └── README.md

## Notas técnicas

- **El audio nunca arranca solo.** Los navegadores móviles lo prohíben; por eso
  la música empieza con el botón "Abrir la carta", que es un gesto del usuario.
  Entra con un fundido de volumen, no de golpe.
- **Las apariciones** usan IntersectionObserver, con una red de seguridad a los
  6 segundos: ningún texto puede quedarse invisible aunque algo falle.
- **Sin JavaScript** la carta se lee entera igualmente (clase `no-js`).
- Respeta `prefers-reduced-motion`.
- Contempla `env(safe-area-inset-bottom)` para el notch de iPhone.

## Publicar

Cualquier hosting estático sirve: GitHub Pages, Netlify, Vercel o Cloudflare
Pages.

Con GitHub Pages: sube este repo, ve a **Settings → Pages** y selecciona
**Deploy from a branch → main → / (root)**. La URL quedará como
`https://<usuario>.github.io/<repo>/`. Genera el QR apuntando a esa URL.
