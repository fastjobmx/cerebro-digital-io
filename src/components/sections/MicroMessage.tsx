export function MicroMessage() {
  const phrases = [
    { text: 'NO ES OTRO CHATBOT.', color: 'text-electric-cyan' },
    { text: 'NO ES OTRO CRM.', color: 'text-neon-magenta' },
    { text: 'NO ES OTRA AUTOMATIZACIÓN.', color: 'text-ultra-violet' },
    { text: 'ES UNA CAPA DE INTELIGENCIA PARA SU NEGOCIO.', color: 'text-gradient' },
  ]

  return (
    <section className="relative py-24 overflow-hidden bg-deep-space border-y border-electric-purple/10">
      <div className="absolute inset-0 bg-grid-fine opacity-40" />
      <div className="container-x relative z-10">
        <div className="space-y-5 text-center">
          {phrases.map((p, i) => (
            <div
              key={i}
              className="overflow-hidden"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <h2
                className={`font-display font-bold text-2xl sm:text-3xl md:text-5xl tracking-tight ${p.color} micro-reveal`}
                style={{
                  transform: 'translateY(100%)',
                  animation: `microSlideUp 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) ${i * 0.15}s forwards`,
                  opacity: 0,
                }}
              >
                {p.text}
              </h2>
            </div>
          ))}
        </div>

        {/* Decorative lines */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="h-px w-16 md:w-32 bg-gradient-to-r from-transparent to-neon-magenta/50" />
          <div className="w-2 h-2 rounded-full bg-electric-cyan shadow-glow-cyan" />
          <div className="h-px w-24 md:w-48 bg-gradient-brand" />
          <div className="w-2 h-2 rounded-full bg-neon-magenta shadow-glow-magenta" />
          <div className="h-px w-16 md:w-32 bg-gradient-to-l from-transparent to-ultra-violet/50" />
        </div>
      </div>

      <style>{`
        @keyframes microSlideUp {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </section>
  )
}
