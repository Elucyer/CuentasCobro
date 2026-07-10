# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Generador de cuentas de cobro en PDF para trabajadores independientes en Colombia. Todo ocurre en el navegador: formulario → PDF en tiempo real → descarga. Desplegado en Vercel sin configuración ni variables de entorno.

## Commands

```bash
npm run dev      # desarrollo en http://localhost:3000
npm run build    # build de producción
npm run lint     # ESLint
```

No hay tests configurados.

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
    PDFSection.tsx             # Client Component: botón de descarga + toggle de PDFViewer inline
  types/
    cuenta-cobro.ts   # interface CuentaCobro, cuentaCobroVacia, calcularTotales()
```

### Flujo principal

1. `page.tsx` mantiene el estado `CuentaCobro` y lo pasa al formulario y al PDF.
2. `FormularioCuentaCobro` emite cambios via `onChange`.
3. `CuentaCobroPDF` recibe `data` y renderiza el `<Document>` de react-pdf.
4. `PDFSection` (Client Component) contiene `PDFDownloadLink` para descarga y toggle de `PDFViewer` para vista previa inline — ambos sin `dynamic` porque `PDFSection` ya es `"use client"` y se importa en `page.tsx` con `dynamic(..., { ssr: false })`.

### Notas importantes

- `@react-pdf/renderer` no funciona en SSR — usar `dynamic` con `{ ssr: false }` para `PDFViewer`.
- `calcularTotales(data)` en `types/cuenta-cobro.ts` centraliza la lógica financiera (abonos, retención, saldo pendiente) — usarla en lugar de recalcular en componentes.
- Regla de retención no obvia: la base de la retención es `valorContrato` cuando es > 0; si no, es `valor` (el de esta cuenta). El saldo pendiente también cambia de fórmula según haya contrato o no.
- El PDF se genera completamente en el cliente; no hay backend ni base de datos.
- `formatCOP` usa `Intl.NumberFormat` con locale `es-CO` para formato de moneda colombiana.
