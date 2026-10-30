import { Plus } from 'lucide-react'
import { HOME_FAQS } from '../config/site'
import { SplitText, Reveal } from '../components/fx'

export function Faq() {
  return (
    <section id="preguntas" data-scene="4" className="section">
      <div className="container-x">
        <div className="text-center">
          <p className="eyebrow justify-center">Preguntas frecuentes</p>
          <SplitText
            className="h-section mx-auto mt-6 max-w-[900px]"
            lines={[{ text: 'Lo que suelen', className: 'text-chrome' }, { text: 'preguntarnos.', className: 'text-grad' }]}
          />
        </div>
        <Reveal className="mx-auto mt-14 grid max-w-[880px] gap-3" stagger={0.06}>
          {HOME_FAQS.map((f) => (
            <details data-r key={f.q} className="panel group p-6 sm:p-7">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h3 className="font-display text-lg font-semibold tracking-tight sm:text-xl">{f.q}</h3>
                <Plus size={18} className="shrink-0 text-cyan transition-transform duration-500 ease-expo group-open:rotate-45" />
              </summary>
              <p className="mt-4 text-[15px] leading-relaxed text-white/70">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
