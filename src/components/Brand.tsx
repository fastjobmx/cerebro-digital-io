import { SITE } from '../config/site'

/** Logotipo compacto: cerebro del logo + wordmark en Michroma con acabado cromado. */
export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5 sm:gap-3">
      <span className="relative grid h-10 w-[52px] place-items-center sm:h-11 sm:w-[58px]">
        <span className="absolute inset-1 rounded-full bg-violet/30 blur-xl" aria-hidden="true" />
        <img
          src={SITE.logo.mark}
          alt=""
          width={58}
          height={34}
          className="relative h-auto w-full drop-shadow-[0_0_14px_rgba(240,60,255,0.55)]"
          decoding="async"
        />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-brand text-[13px] tracking-[0.06em] text-chrome sm:text-[15px]">CEREBRO</span>
          <span className="mt-1 flex items-center gap-1.5 font-brand text-[7.5px] tracking-[0.42em] text-white/70 sm:text-[8.5px]">
            DIGITAL
            <span className="h-2.5 w-px bg-cyan/80" />
            <span className="text-grad tracking-[0.12em]">IO</span>
          </span>
        </span>
      )}
      <span className="sr-only">{SITE.name}</span>
    </span>
  )
}
