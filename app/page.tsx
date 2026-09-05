export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm uppercase tracking-widest text-neutral-500">
        Jíbaro Newz
      </p>
      <h1 className="text-4xl font-semibold tracking-tight">
        Motor de astrología
      </h1>
      <p className="text-lg leading-relaxed text-neutral-600">
        Posiciones planetarias a nivel de signo, fase lunar y nodos lunares para
        una fecha dada. Cálculo local, determinista y sin API externa.
      </p>
      <p className="text-sm text-neutral-500">
        Etapa 0: scaffold. El motor llega en la Etapa 1.
      </p>
    </main>
  );
}
