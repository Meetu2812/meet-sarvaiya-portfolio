# 3D Portfolio (React Three Fiber)

A scroll-driven 3D portfolio: floating procedural blobs, a camera rig that
reorients per section, and HTML content overlaid via drei's `ScrollControls`.
No external 3D model files required — it runs as-is.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

Build for production:

```bash
npm run build
npm run preview
```

## Where to edit

| What | File |
| --- | --- |
| Text, sections, project list | `src/App.jsx` (the `PROJECTS` array + `<Overlay/>`) |
| 3D objects, colors, motion | `src/Experience.jsx` |
| Colors, fonts, layout, cards | `src/index.css` (`:root` variables at top) |
| Page title | `index.html` |

## Add your video edits

1. Drop a `.mp4` (and optional poster) into a `public/` folder.
2. In `src/App.jsx`, set `media: '/your-clip.mp4'` on a project.
   The card auto-plays it muted on loop.

## Swap blobs for a real 3D model

Export a `.glb`, put it in `public/`, then in `Experience.jsx`:

```jsx
import { useGLTF } from '@react-three/drei'
const { scene } = useGLTF('/model.glb')
return <primitive object={scene} />
```

## Deploy

Run `npm run build` and drop the `dist/` folder on Vercel, Netlify, or
GitHub Pages.
