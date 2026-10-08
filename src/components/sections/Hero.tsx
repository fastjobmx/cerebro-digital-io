import { NeuralBrainCanvas } from './NeuralBrainCanvas'
import { ArrowRight, Play } from 'lucide-react'

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Deep space background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space-2 to-deep-space" />

      {/* Radial glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-ultra-violet/30 blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-neon-magenta/20 blur-[140px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] rounded-full bg-electric-cyan/15 blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '3s' }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

      {/* Scanline */}
      <div className="absolute inset-0 scanline pointer-events-none opacity-40" />

      {/* Interactive Neural Brain Canvas */}
      <div className="absolute inset-0 z-10">
        <NeuralBrainCanvas />
      </div>

      {/* Dark vignette to boost readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-deep-space via-transparent to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space/60 via-transparent to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow opacity-60 pointer-events-none z-10" />

      {/* Content */}
      <div className="relative z-20 container-x text-center pt-32 pb-20">
        {/* Top chip */}
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-light border border-electric-purple/30 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-cyan"></span>
          </span>
          <span className="text-xs tracking-[0.2em] uppercase text-white/70 font-medium">
            Inteligencia Artificial Empresarial
          </span>
          <span className="text-electric-cyan text-xs font-mono">v1.0</span>
        </div>

        {/* Brand chip */}
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-light border border-electric-purple/30 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-cyan"></span>
          </span>
          <span className="text-xs tracking-[0.2em] uppercase text-white/70 font-medium">
            CEREBRO DIGITAL PARA SU NEGOCIO.
          </span>
        </div>

        {/* Headline - proposal clear within 10s */}
        <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-[88px] leading-[0.95] tracking-tight max-w-6xl mx-auto">
          <span className="block text-gradient mb-4 sm:mb-6">CEREBRO DIGITAL IO</span>
          <span className="block text-white/90">CEREBRO DIGITAL</span>
          <span className="block text-white/90">PARA SU NEGOCIO.</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-10 text-lg md:text-xl text-white/70 max-w-4xl mx-auto leading-relaxed">
          Una inteligencia artificial configurada para conocer su empresa,
          <span className="text-white"> conectar sus herramientas </span>
          y ayudarle a
          <span className="text-gradient font-semibold"> ejecutar.</span>
        </p>

        {/* Highlight quote */}
        <div className="mt-10 inline-block">
          <div className="px-6 py-3 rounded-full glass border border-gradient-brand relative">
            <p className="font-display text-lg md:text-xl tracking-wide">
              <span className="text-white/70">USTED DECIDE. </span>
              <span className="text-gradient font-bold">EL CEREBRO EJECUTA.</span>
            </p>
          </div>
        </div>

        {/* Secondary formula line: INPUT → INTELLIGENCE → OUTPUT */}
        <div className="mt-6 inline-flex items-center gap-3 text-xs sm:text-sm font-mono tracking-[0.18em] text-white/50">
          <span className="text-electric-cyan/80">INPUT</span>
          <span className="text-white/30">→</span>
          <span className="text-neon-magenta/80">INTELLIGENCE</span>
          <span className="text-white/30">→</span>
          <span className="text-white/80">OUTPUT</span>
        </div>

        {/* CTAs */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <a
            href="#contacto"
            data-magnetic
            className="btn-primary w-full sm:w-auto text-base sm:text-[15px] tracking-[0.08em] font-bold"
          >
            <span className="flex items-center gap-3">
              QUIERO CONOCER MI CEREBRO DIGITAL
              <ArrowRight size={18} />
            </span>
          </a>
          <a href="#cerebro" className="btn-secondary w-full sm:w-auto text-base sm:text-[15px] tracking-[0.08em] font-semibold">
            <span className="flex items-center gap-3">
              <Play size={16} fill="currentColor" />
              VER CÓMO FUNCIONA
            </span>
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { n: '24/7', l: 'Operación continua' },
            { n: '∞', l: 'Capacidades escalables' },
            { n: '1', l: 'Sistema conectado' },
            { n: '100%', l: 'Configurado a su negocio' },
          ].map((s, i) => (
            <div key={i} className="glass-light rounded-2xl py-5 px-6">
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient mb-1">{s.n}</div>
              <div className="text-xs md:text-sm text-white/60">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/40">
        <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-[1px] h-14 bg-gradient-to-b from-electric-cyan/80 via-neon-magenta/50 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
