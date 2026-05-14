# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # desarrollo en http://localhost:3000
npm run build    # build de producción
npm run lint     # ESLint
```

## Stack

- **Next.js 16** (App Router, `src/` dir)
- **TypeScript** strict
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **@react-pdf/renderer v4** — genera PDF en el cliente

## Arquitectura

```
src/
  app/
    page.tsx          # página principal (Client Component): estado, formulario, PDFDownloadLink, PDFViewer
    layout.tsx        # root layout
    globals.css       # @import "tailwindcss"
  components/
    FormularioCuentaCobro.tsx  # formulario controlado, grid de secciones
    CuentaCobroPDF.tsx         # plantilla PDF con @react-pdf/renderer (StyleSheet + componentes de react-pdf)
  types/
    cuenta-cobro.ts   # interface CuentaCobro + valor inicial vacío
```

### Flujo principal

1. `page.tsx` mantiene el estado `CuentaCobro` y lo pasa al formulario y al PDF.
2. `FormularioCuentaCobro` emite cambios via `onChange`.
3. `CuentaCobroPDF` recibe `data` y renderiza el `<Document>` de react-pdf.
4. `PDFDownloadLink` envuelve un botón para descargar. `PDFViewer` (cargado con `dynamic(..., { ssr: false })`) ofrece vista previa opcional.

### Notas importantes

- `@react-pdf/renderer` no funciona en SSR — usar `dynamic` con `{ ssr: false }` para `PDFViewer`.
- `PDFDownloadLink` sí puede estar en el render normal porque react-pdf maneja su propio worker.
- El PDF se genera completamente en el cliente; no hay backend ni base de datos.
- `formatCOP` usa `Intl.NumberFormat` con locale `es-CO` para formato de moneda colombiana.
