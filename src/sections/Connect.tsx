import { SplitText, Reveal } from '../components/fx'
import { TOOLS } from '../config/site'

/**
 * Constelación: la escena 3D reúne las partículas en 8 nodos + núcleo.
 * Las etiquetas [data-node] son posicionadas cada frame por NeuralScene
 * proyectando la posición 3D real de cada nodo.
 */
export function Connect() {
  return (
    <section data-scene="2" className="relative flex min-h-[150svh] flex-col justify-between py-24 sm:py-32">
      <div className="container-x relative z-10 text-center">
        <p className="eyebrow justify-center">La solución</p>
        <SplitText
          className="h-section mx-auto mt-6 max-w-[900px]"
          lines={[{ text: 'Un solo cerebro.', className: 'text-chrome' }, { text: 'Todo conectado.', className: 'text-grad' }]}
        />
      </div>

      {/* Etiquetas proyectadas desde la escena 3D */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[5]">
        {TOOLS.map((t, i) => (
          <span
            key={t}
            data-node={i}
            className="chip glass absolute left-0 top-0 !border-white/15 !text-white opacity-0 will-change-transform max-sm:!px-2.5 max-sm:!py-1 max-sm:!text-[10.5px]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-glow-c" />
            {t}
          </span>
        ))}
        <span
          data-node="core"
          className="absolute left-0 top-0 font-brand text-[11px] tracking-[0.3em] text-white opacity-0 will-change-transform sm:text-[13px]"
        >
          CEREBRO
        </span>
      </div>

      <Reveal className="container-x relative z-10">
        <div data-r className="glass mx-auto max-w-[620px] rounded-3xl p-6 text-center sm:p-8">
          <p className="text-[15px] leading-relaxed text-white/75 sm:text-base">
            El Cerebro Digital conecta sus herramientas en <span className="text-white">un solo contexto</span> para analizar, proponer y
            coordinar. Sin cambiar lo que su equipo ya usa.
          </p>
        </div>
      </Reveal>
    </section>
  )
}
