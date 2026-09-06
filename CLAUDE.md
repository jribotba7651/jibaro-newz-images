# CLAUDE.md — Motor de astrología para Tarot Boricua

> **Estado del documento:** plan reconstruido a partir de la carta de diseño de Juan
> (no del plan original de seis etapas, que no llegó). La arquitectura y las decisiones
> técnicas vienen de esa carta. Los fixtures y las firmas de `astronomy-engine` están
> marcados para verificar, no para confiar a ciegas. Ver la sección **Procedencia** al final.
>
> **Antes de codear:** Juan revisa y aprueba este documento. No empieces la Etapa 0 hasta
> que lo confirme.

---

## 0. Qué es esto

Motor de astrología a nivel de signo para el newsletter **Tarot Boricua**. Calcula posiciones
planetarias, fase lunar y nodos lunares para una fecha dada, genera contenido de horóscopo
en la voz del proyecto, lo persiste, y lo publica al newsletter (Beehiiv) con imágenes OG
nativas para compartir en redes.

**Camino elegido:** repo real Next.js en Vercel. No Lovable. Un solo repo, rutas API
server-side, imágenes OG nativas.

**Nivel de precisión:** signo. No casas, no aspectos exactos por grado (todavía). Basta
`astronomy-engine` (JS puro) + fórmula del nodo medio. Cero API externa, cero costo
recurrente, cero rate limits, determinista y testeable.

---

## 1. Reglas de trabajo (invariantes, no negociables)

1. **Longitud eclíptica tropical de fecha, no J2000.** La diferencia por precesión (~0.36°
   en 2026) cambia un signo en cúspide. Esto es lo primero que se verifica en la Etapa 1.
   El eje del sistema es este: si el marco de coordenadas está mal, todo lo demás miente.
2. **No confíes en fixtures que no cuadren.** Si un cálculo no coincide con un fixture,
   **no "arregles" el motor** para que pase. Para, reporta la discrepancia con ambos valores
   (calculado vs. fixture), y pregunta. El fixture puede estar mal (puesto de memoria); el
   motor puede estar mal. No lo decidas solo.
3. **Verifica las firmas de `astronomy-engine` contra el paquete instalado**, no contra la
   memoria. Lee los `.d.ts` o la doc oficial antes de escribir el motor. Los nombres de
   función en este documento son pistas, no verdad.
4. **Determinista y testeable.** Mismo input (fecha UTC), mismo output. Nada de aleatoriedad
   ni de "hora actual" dentro del motor puro; la fecha entra como parámetro.
5. **No pases de la Etapa 3 sin credenciales.** Etapas 0 a 2 no tocan servicios externos.
   Etapa 3 en adelante necesita `.env` (Beehiiv, Supabase, Vercel). Si no están, para y pide.
6. **Nada de em-dashes en contenido en español.** Aplica a texto de horóscopo, copy, commits.
7. **Voz literaria diaspórica para el contenido**, no académica ni de horóscopo genérico de
   revista. Si existen `biblia-traduccion.md` y `glosario-de-consistencia.md` en el repo o
   los pasa Juan, respétalos. Si no, marca el contenido como borrador y pide la guía de voz
   antes de dar por bueno el registro.
8. **Cada etapa termina con su bloque `VERIFICAR` en verde** antes de pasar a la siguiente.
   Sin verde, no avanzas.

---

## 2. Stack y estructura

- **Next.js (App Router) + TypeScript + Tailwind.** Deploy en Vercel.
- **Motor:** `astronomy-engine` (npm) + fórmula de nodo medio propia.
- **Tests:** Vitest.
- **Persistencia:** Supabase (Postgres). Etapa 3.
- **Newsletter:** Beehiiv API. Etapa 4.
- **Imágenes OG:** `next/og` (ImageResponse), nativo. Etapa 5.

Estructura objetivo:

```
/app                 rutas y API
  /api/chart         GET ?date=... -> ChartSnapshot (JSON)
  /api/og            imagen OG dinámica
/lib
  /astro             motor puro (sin dependencias de Next ni de red)
    positions.ts     posiciones de signo por cuerpo
    node.ts          nodo lunar medio
    moon.ts          fase lunar
    snapshot.ts      arma el ChartSnapshot
    signs.ts         longitud -> signo + grado
    __tests__/       fixtures y tests
  /content           interpretación / generación de texto
  /supabase          cliente y esquema (Etapa 3)
  /beehiiv           cliente (Etapa 4)
CLAUDE.md
```

> **Decisión abierta (no bloqueante):** este repo (`jibaro-newz-images`) es hoy un depósito
> de imágenes de n8n. El proyecto Next.js va en la raíz. Las imágenes existentes en `/images`
> se pueden dejar donde están o mover a `/public/images` en la Etapa 5. Confirmar con Juan si
> prefiere separar en repo aparte; por ahora se procede en este.

---

## 3. Contratos de datos

Estos tipos son el contrato entre el motor y todo lo demás. No los cambies sin avisar.

```ts
type Sign =
  | "Aries" | "Tauro" | "Géminis" | "Cáncer" | "Leo" | "Virgo"
  | "Libra" | "Escorpio" | "Sagitario" | "Capricornio" | "Acuario" | "Piscis";

type Body =
  | "Sol" | "Luna" | "Mercurio" | "Venus" | "Marte"
  | "Júpiter" | "Saturno" | "Urano" | "Neptuno" | "Plutón"
  | "NodoNorte" | "NodoSur";

interface SignPosition {
  body: Body;
  sign: Sign;
  longitude: number;      // grados [0,360), eclíptica TROPICAL DE FECHA
  degreeInSign: number;   // [0,30)
  retrograde: boolean;    // false para Sol, Luna y nodos
}

interface MoonInfo {
  phaseAngle: number;     // [0,360): 0 nueva, 90 cuarto creciente, 180 llena, 270 menguante
  phaseName: string;      // "Luna nueva", "Cuarto creciente", ...
  illumination: number;   // [0,1]
}

interface ChartSnapshot {
  date: string;           // ISO 8601 UTC, el input normalizado
  positions: SignPosition[];
  moon: MoonInfo;
  engineVersion: string;  // version de astronomy-engine usada, para trazabilidad
}
```

---

## 4. Las seis etapas

Cada etapa: **objetivo -> entregables -> VERIFICAR**. No avanzas sin el verde.

### Etapa 0 — Scaffold (sin credenciales)
**Objetivo:** proyecto Next.js que arranca y buildea.
**Entregables:** `create-next-app` (App Router, TS, Tailwind), Vitest configurado, `.env.example`
con las llaves que se necesitarán (vacías), `.gitignore` correcto (`.env`, `node_modules`,
`.next`), README mínimo.
**VERIFICAR:**
- [ ] `npm run build` pasa.
- [ ] `npm run dev` levanta y sirve la home.
- [ ] `npm test` corre (aunque sea con un test trivial).

### Etapa 1 — Motor puro (sin credenciales) — LA ETAPA CRÍTICA
**Objetivo:** `ChartSnapshot` correcto para cualquier fecha UTC.
**Entregables:** todo `/lib/astro`.
**Orden obligatorio dentro de la etapa:**
1. **Primero:** confirmar cómo obtener del paquete la **longitud eclíptica geocéntrica,
   equinoccio verdadero de fecha** (tropical de fecha), leyendo los tipos/doc de
   `astronomy-engine`. Candidatos a verificar (pistas, no verdad): `SunPosition(date)` ya
   devuelve longitud de fecha para el Sol; para planetas, `GeoVector(body, date, true)` da
   vector ecuatorial J2000 que hay que **rotar al marco eclíptico de fecha** (buscar el marco
   `ECT` / rotación EQJ->ECT en la versión instalada) antes de sacar `.elon`; para la Luna,
   revisar `EclipticGeoMoon`. **Documenta en un comentario qué función/rotación resultó ser
   la correcta y por qué.**
2. `positions.ts`: los 10 cuerpos (Sol a Plutón). Retrógrado por diferencia finita
   (longitud en `date` vs `date ± Δ` pequeño).
3. `node.ts`: nodo lunar **medio**. Fórmula (Meeus, cap. 47), T = siglos julianos desde
   J2000.0:
   `Ω = 125.0445479 − 1934.1362891·T + 0.0020754·T² + T³/467441 − T⁴/60616000` (grados,
   normalizar a [0,360)). NodoNorte = Ω; NodoSur = Ω + 180. **Verificar las constantes contra
   Meeus antes de dar por bueno.** El nodo medio ya está en marco de fecha.
4. `moon.ts`: fase e iluminación (`MoonPhase`, iluminación asociada).
5. `signs.ts`: longitud -> `{sign, degreeInSign}`, sectores de 30° desde 0° Aries.
6. `snapshot.ts`: arma el `ChartSnapshot`, incluye `engineVersion`.
**VERIFICAR:**
- [ ] Tests contra los fixtures ancla de la sección 5 pasan **o** la discrepancia está
      reportada a Juan (no "arreglada").
- [ ] Un cambio de signo en cúspide sale bien con marco de fecha y saldría MAL con J2000
      (test explícito que demuestra que el marco importa).
- [ ] Motor no importa nada de Next ni de red.

### Etapa 2 — Interpretación / contenido (sin credenciales)
**Objetivo:** de `ChartSnapshot` a texto de horóscopo por signo, en la voz del proyecto.
**Entregables:** `/lib/content`: definiciones de signos y de tránsitos relevantes (ej. dónde
está Saturno), plantillas o generación determinista de texto. Sin llamadas de red.
**VERIFICAR:**
- [ ] Genera texto para los 12 signos sin fallar.
- [ ] Sin em-dashes. Registro marcado como borrador si falta la guía de voz.
- [ ] Salida estable (mismo snapshot -> mismo texto), salvo que se decida usar un LLM, lo cual
      **se pregunta antes**, no se asume.

### Etapa 3 — Supabase (necesita credenciales)
**Objetivo:** persistir snapshots y contenido generado.
**Entregables:** esquema (tablas para snapshots y ediciones de newsletter), cliente,
migraciones. Lee `SUPABASE_URL` / `SUPABASE_ANON_KEY` (o service role donde aplique) de `.env`.
**VERIFICAR:**
- [ ] Migración aplica limpia.
- [ ] Round-trip: escribir un snapshot y leerlo de vuelta idéntico.
- [ ] Sin credenciales -> para y pide, no inventa un stub silencioso.

### Etapa 4 — Beehiiv (necesita credenciales)
**Objetivo:** crear draft de edición del newsletter desde el contenido persistido.
**Entregables:** `/lib/beehiiv`, ruta API que arma la edición. Lee `BEEHIIV_API_KEY` /
`BEEHIIV_PUBLICATION_ID` de `.env`.
**VERIFICAR:**
- [ ] Crea un **draft** (no envía) contra la API real o un sandbox.
- [ ] Manejo de error de API explícito (no traga fallos).

### Etapa 5 — OG nativas + deploy a preview (necesita Vercel)
**Objetivo:** imagen OG dinámica por signo/fecha y deploy a preview.
**Entregables:** `/app/api/og` con `next/og`, meta tags OG en las páginas, deploy a Vercel
preview. Subdominio: se puede desplegar a preview sin la decisión del subdominio; producción
espera esa decisión.
**VERIFICAR:**
- [ ] OG renderiza para los 12 signos.
- [ ] Preview de Vercel levanta y las rutas API responden.
- [ ] Decisión de subdominio: pendiente de Juan (no bloquea preview).

---

## 5. Fixtures astrológicos ancla — CONFIRMAR CONTRA REFERENCIA

Estos son eventos que sirven de test para el motor. **Todos vienen de memoria y hay que
confirmarlos contra una efeméride pública (o el libro del proyecto para definiciones, no para
posiciones exactas) antes de usarlos como verdad.** Un error de ±1 día en cúspide hace fallar
el test sin que el motor esté mal.

| Evento (a confirmar)                         | Fecha aprox. (UTC, a confirmar) |
|----------------------------------------------|---------------------------------|
| Saturno ingresa a Piscis                     | 2023-03-07                      |
| Saturno ingresa a Aries (primer paso)        | 2025-05-25                      |
| Saturno retrograda de vuelta a Piscis        | 2025-09-01                      |
| Saturno reingresa a Aries (definitivo)       | 2026-02-14                      |

**Cómo confirmar:** antes de escribir los tests de la Etapa 1, verifica cada fecha contra una
efeméride pública. Si no coinciden con lo que calcula el motor, **para y reporta** con ambos
valores; no ajustes el motor ni el fixture por tu cuenta. Añade además al menos un fixture de
cúspide (un cuerpo a menos de 0.5° de un cambio de signo) para probar que el marco de fecha
importa.

---

## 6. Checklist de aceptación global

- [ ] Etapas 0 a 5 con su `VERIFICAR` en verde.
- [ ] Motor puro sin dependencias de Next ni de red; determinista.
- [ ] Longitud eclíptica confirmada como tropical de fecha (con test que lo demuestra).
- [ ] Fixtures ancla confirmados contra referencia (o discrepancias reportadas).
- [ ] Sin em-dashes en contenido en español.
- [ ] `.env` fuera de git; `.env.example` documentado.
- [ ] Deploy a preview de Vercel funcionando.

---

## 7. Cuándo PARAR y preguntar (no inventar)

- Un fixture no cuadra con el cálculo. Reporta ambos valores.
- Faltan credenciales para Etapa 3, 4 o 5.
- Duda sobre la voz literaria / registro del contenido (falta `biblia-traduccion.md` o
  `glosario-de-consistencia.md`).
- Decisión de subdominio (para producción).
- ¿Usar un LLM para generar el contenido de horóscopo, o mantenerlo determinista? Preguntar
  antes de meter una dependencia de modelo.
- Cualquier cambio a los contratos de datos de la sección 3.
- ¿Proyecto en este repo o en uno nuevo? (decisión abierta de la sección 2).

---

## 8. Lo que falta de Juan antes de la Etapa 3

- `.env` con credenciales de **Beehiiv**, **Supabase** y **Vercel**.
- Decisión del subdominio (puede esperar hasta después del preview).
- `biblia-traduccion.md` y `glosario-de-consistencia.md` si el contenido debe seguirlos.
- Confirmación: ¿este repo o uno nuevo para el proyecto Next.js?

---

## 9. Procedencia (honestidad sobre qué es qué)

- **Diseño sólido (de la carta):** arquitectura Next.js/Vercel, `astronomy-engine` sin API
  externa, marco tropical de fecha, estructura por etapas con `VERIFICAR`, regla de no confiar
  en fixtures.
- **Reconstruido por Claude (esta versión del plan):** el desglose exacto de las seis etapas,
  los contratos de datos, y la estructura de carpetas. Es diseño razonable pero es *mi* versión,
  no el plan original de Juan. Revisar antes de codear.
- **De memoria, a verificar (no confiar):** las fechas de los fixtures de Saturno, las
  constantes de la fórmula del nodo medio, y los nombres exactos de las funciones de
  `astronomy-engine`. Confirmar contra fuente antes de dar por bueno.
