import { useEffect, useState } from 'react'

export function BrandStatement() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    // 0: fade in line 1, 1: pause, 2: line 2, 3: slogan
    const timers = [
      setTimeout(() => setPhase(1), 100), // first word
      setTimeout(() => setPhase(2), 1800), // pause
      setTimeout(() => setPhase(3), 3400), // second line (Cerebro highlights)
      setTimeout(() => setPhase(4), 5200), // slogan
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <section className="relative py-40 md:py-56 overflow-hidden bg-[#040010]">
      {/* Ultra minimal background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-ultra-violet/15 blur-[160px] animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-neon-magenta/20 blur-[100px]" />
      </div>

      <div className="container-x relative z-10 text-center max-w-6xl mx-auto">
        {/* USTED DECIDE */}
        <div className="mb-8 md:mb-14">
          <h2
            className="font-display font-black text-[12vw] md:text-[9vw] lg:text-[8rem] leading-none tracking-tighter transition-all duration-[1.5s] ease-out"
            style={{
              opacity: phase >= 1 ? 1 : 0,
              transform: phase >= 1 ? 'translateY(0)' : 'translateY(40px)',
            }}
          >
            <span className="text-white">USTED</span>{' '}
            <span
              className="text-white"
              style={{
                textShadow: phase >= 1 ? '0 0 60px rgba(255,255,255,0.3)' : 'none',
              }}
            >
              DECIDE.
            </span>
          </h2>
        </div>

        {/* EL CEREBRO EJECUTA */}
        <div className="mb-16 md:mb-24">
          <h2
            className="font-display font-black text-[12vw] md:text-[9vw] lg:text-[8rem] leading-none tracking-tighter transition-all duration-[1.5s] ease-out"
            style={{
              opacity: phase >= 3 ? 1 : 0,
              transform: phase >= 3 ? 'translateY(0)' : 'translateY(40px)',
            }}
          >
            <span className="text-white/95">EL </span>
            <span
              className="relative inline-block transition-all duration-[2s] ease-out"
              style={{
                background:
                  phase >= 3
                    ? 'linear-gradient(135deg, #7B2CFF 0%, #E600FF 50%, #00E5FF 100%)'
                    : '#fff',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: phase >= 3 ? 'transparent' : '#fff',
                textShadow:
                  phase >= 3
                    ? '0 0 80px rgba(168,85,247,0.55)'
                    : '0 0 60px rgba(255,255,255,0.15)',
              }}
            >
              CEREBRO
            </span>{' '}
            <span className="text-white/95">EJECUTA.</span>
          </h2>
        </div>

        {/* Divider */}
        <div className="max-w-md mx-auto mb-10 flex items-center justify-center gap-4">
          <div
            className="h-px w-20 md:w-32 bg-gradient-to-r from-transparent to-ultra-violet/60 transition-all duration-1000"
            style={{ opacity: phase >= 4 ? 1 : 0 }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full bg-neon-magenta shadow-glow-magenta transition-all duration-1000"
            style={{
              opacity: phase >= 4 ? 1 : 0,
              transform: phase >= 4 ? 'scale(1)' : 'scale(0)',
            }}
          />
          <div
            className="h-px w-20 md:w-32 bg-gradient-to-l from-transparent to-electric-cyan/60 transition-all duration-1000"
            style={{ opacity: phase >= 4 ? 1 : 0 }}
          />
        </div>

        {/* Slogan */}
        <div
          className="transition-all duration-[1.4s] ease-out"
          style={{
            opacity: phase >= 4 ? 1 : 0,
            transform: phase >= 4 ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <p className="font-display font-bold text-xl md:text-3xl tracking-[0.25em] uppercase">
            <span className="text-gradient">
              INTELIGENCIA QUE AUTOMATIZA.
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
