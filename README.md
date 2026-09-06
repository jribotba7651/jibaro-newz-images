# Tarot Boricua — Motor de astrología

Motor de astrología a nivel de signo para el newsletter **Tarot Boricua**. Calcula
posiciones planetarias, fase lunar y nodos lunares para una fecha dada, genera
contenido de horóscopo en la voz del proyecto, lo persiste y lo publica al
newsletter (Beehiiv) con imágenes OG nativas.

El plan completo, las reglas de trabajo y las seis etapas están en
[`CLAUDE.md`](./CLAUDE.md).

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- `astronomy-engine` + fórmula de nodo medio (Etapa 1)
- Vitest
- Supabase (Etapa 3), Beehiiv (Etapa 4), Vercel + `next/og` (Etapa 5)

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produccion
npm test        # tests con Vitest
```

## Credenciales

Copiar `.env.example` a `.env` y llenar. El `.env` está en `.gitignore` y nunca
se commitea. Las etapas 0 a 2 no necesitan credenciales; de la Etapa 3 en
adelante sí.

## Estado

- [x] Etapa 0: scaffold
- [x] Etapa 1: motor puro (`/lib/astro`)
- [x] Etapa 2: interpretación / contenido (`/lib/content`, registro en borrador)
- [ ] Etapa 3: Supabase (pendiente de credenciales)
- [ ] Etapa 4: Beehiiv (pendiente de credenciales)
- [~] Etapa 5: OG nativas + rutas API hechas; deploy a preview pendiente de Vercel
