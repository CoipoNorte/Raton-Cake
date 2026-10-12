<div align="center">

<img src="public/icon.svg" alt="Ratón · Pastelería Kawaii" width="140" />

# Ratón · Pastelería Kawaii

**ねずみのケーキやさん — hornea, glasea y decora pasteles contra el reloj.**

Un homenaje moderno, relajante y adictivo al mítico minijuego de pasteles de
*Purble Place*, reimaginado con estética kawaii japonesa, gestos táctiles
precisos y una ratoncita repostera que te anima en cada hornada.

![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)
![Deploy](https://img.shields.io/badge/GitHub%20Pages-%2FRaton--Cake%2F-222?logo=github)

**[➜ Jugar en línea · coiponorte.github.io/Raton-Cake](https://coiponorte.github.io/Raton-Cake/)**

</div>

---

## El juego

Eres la ayudante estrella de la pastelería más tierna del barrio. Llegan
pedidos sin parar y tu misión es montar cada pastel **idéntico al ticket**:
capas de bizcocho, crema entre pisos, glaseado que gotea y los toppings
exactos. Cada pastel perfecto suma puntos, encadena combos y regala **+3
segunditos** de horno. ¿Cuántos pasteles saldrán de tus manos en 90 segundos?

### Cómo se juega

| Paso | Acción |
| --- | --- |
| 1 | Arrastra capas de **bizcocho** al stand (máx. 3 pisos). |
| 2 | Añade la **crema** del pedido entre capas. |
| 3 | Baña el pastel con el **glaseado** correcto. |
| 4 | Decora con los **toppings** exactos (ojito con los ×2). |
| 5 | Pulsa **SERVIR** y cruza los bigotes. |

- **Responsive total**: móvil en vertical, tablet y escritorio. La mesa se
  reorganiza sola (en vertical: ticket arriba, stand al centro, bandeja
  abajo), así que se juega en cualquier dispositivo sin girar nada.
- ¿Te equivocaste? **Deshacer** y **limpiar** siempre están a un toque.
- Servir mal rompe el combo… pero el pastel se queda para que lo arregles.
- El **récord histórico** se guarda en tu dispositivo: supérate en cada visita.

## Características

- Drag & drop táctil con físicas suaves (Framer Motion) y *squash & stretch*.
- Pasteles 100 % procedurales en SVG: capas, goteo de glaseado, dollops de
  crema y toppings dibujados al vuelo — el ticket y tu pastel usan el mismo
  motor de dibujo, así que la referencia siempre es fiel.
- Dificultad progresiva: los pedidos crecen en pisos, cremas y toppings.
- Sistema de puntuación con **combos ×2.5**, bonificaciones de tiempo y
  confetti de celebración.
- Mascota reactiva que celebra, se preocupa y parpadea.
- Soniditos kawaii sintetizados con **WebAudio** (cero archivos externos),
  con botón de silencio persistente.
- Persistencia del récord y ajustes con `localStorage`
  (módulo `src/game/storage.ts`, listo para migrar a IndexedDB).
- Layout adaptativo con el hook `useIsPortrait`: girar el dispositivo en
  mitad de la partida reorganiza la mesa sin perder el pastel.
- **Interfaz que no estorba**: el HUD flota sobre la escena (barra de tiempo
  pegada al borde y contadores en pastillas mínimas), de modo que el pastel
  y la bandeja se quedan con casi toda la pantalla.

## Stack técnico

| Pieza | Tecnología |
| --- | --- |
| Framework | React 19 + TypeScript |
| Bundler | Vite 7 (`base: "/Raton-Cake/"`, build single-file) |
| Estilos | Tailwind CSS 4 |
| Animación | Framer Motion |
| Iconos | Lucide |
| Audio | WebAudio API (sintetizador propio) |
| Datos | localStorage (récord, silencio, partidas) |

## Estructura del proyecto

```
Raton-Cake/
├─ .gitignore            # node_modules, dist, logs…
├─ index.html            # Título, metas móviles, fuentes y favicon
├─ vite.config.ts        # base: "/Raton-Cake/"  (GitHub Pages)
├─ deploy.bat            # Configura, compila y publica en gh-pages
├─ public/
│  └─ icon.svg           # Icono del proyecto
└─ src/
   ├─ App.tsx            # Orquestador de pantallas
   ├─ game/              # Tipos, datos, lógica, sonido y persistencia
   │  ├─ types.ts        # CakeSpec, Order, constantes de equilibrio
   │  ├─ data.ts         # Paletas pastel y metadatos de ingredientes
   │  ├─ logic.ts        # Generación de pedidos, matching y puntuación
   │  ├─ sound.ts        # Mini sintetizador WebAudio
   │  └─ storage.ts      # Récord y ajustes persistentes
   ├─ components/        # CakeSVG, mascota, HUD, ticket, bandeja…
   ├─ hooks/             # useIsPortrait (layout responsive)
   └─ screens/           # Inicio, partida y fin
```

## Desarrollo local

```bash
npm install     # instala dependencias
npm run dev     # servidor de desarrollo con hot-reload
npm run build   # compila a dist/ (usa base /Raton-Cake/)
npm run preview # previsualiza la build de producción
```

> Consejo: en las DevTools del navegador activa el modo dispositivo y prueba
> el juego en vertical, horizontal, tablet y escritorio — la mesa se adapta
> en directo.

## Despliegue en GitHub Pages

El repositorio vive en
[github.com/CoipoNorte/Raton-Cake](https://github.com/CoipoNorte/Raton-Cake)
y el `base` de Vite ya apunta a `/Raton-Cake/`.

1. Ejecuta el script incluido en la raíz del proyecto:

   ```bat
   deploy.bat
   ```

   El `.bat` es auto-suficiente y ejecuta 5 pasos:
   1. Añade a `package.json` los scripts `predeploy` / `deploy`.
   2. Verifica que `vite.config.ts` tenga `base: "/Raton-Cake/"`.
   3. `npm i` — instala dependencias.
   4. `npm run build` — compila a `dist/`.
   5. `npm run deploy` — publica `dist/` en la rama **`gh-pages`**.

2. En GitHub: **Settings → Pages → Source: rama `gh-pages` / (root)**.
3. Espera un minuto y abre **https://coiponorte.github.io/Raton-Cake/**

En macOS/Linux los pasos equivalentes son:

```bash
npm install && npm run build && npx gh-pages -d dist
```

### Solución: “me sale la página en blanco”

Casi siempre es una de estas tres causas:

| Síntoma | Causa | Solución |
| --- | --- | --- |
| En blanco total | **Pages apunta a `main`** en vez de `gh-pages` (GitHub sirve el `index.html` de desarrollo, que pide `/src/main.tsx` y da 404) | Settings → Pages → Source: rama **`gh-pages`** / **(root)** |
| En blanco o 404 de assets | El `base` no coincide con el nombre del repo (p. ej. `/Raton/` vs `Raton-Cake`) | Deja `base: "/Raton-Cake/"` y vuelve a ejecutar `deploy.bat` |
| Sigue en blanco tras arreglarlo | Caché agresiva de Pages/navegador | Espera 1–2 min y recarga forzada con **Ctrl+F5** |

Nota: esta build usa `vite-plugin-singlefile`, así que todo el juego (JS +
CSS) viaja **dentro** de un único `index.html`: en cuanto Pages sirva la
rama correcta, funcionará incluso sin tocar rutas.

## Persistencia de datos

| Clave | Contenido |
| --- | --- |
| `raton.best.v1` | Récord histórico de puntos |
| `raton.muted.v1` | Preferencia de sonido |
| `raton.plays.v1` | Partidas jugadas (tutorial) |

El módulo `src/game/storage.ts` encapsula el acceso con protección ante
modos de navegación privada, de modo que migrar a **IndexedDB** en el futuro
no toca ni una línea del juego.

## Créditos

Hecho con cariño, palitos de medir y mucho glaseado de fresa.
Inspirado con cariño en el minijuego de pasteles de *Purble Place*.

**Licencia MIT** — hornea, comparte y remezcla libremente.
