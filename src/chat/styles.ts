// Estilos propios del widget (keyframes y efectos que Tailwind no cubre).
// Se inyectan con un <style> para no tocar index.css ni tailwind.config.js.
export const CHAT_CSS = `
@keyframes cb-spin { to { transform: rotate(360deg); } }
@keyframes cb-breathe {
  0%, 100% { opacity: .4; }
  50% { opacity: .9; }
}
@keyframes cb-launcher-glow {
  0%, 100% { box-shadow: 0 12px 40px -12px rgba(240,60,255,.55), 0 0 0 0 rgba(139,92,246,0), inset 0 1px 0 rgba(255,255,255,.08); }
  50% { box-shadow: 0 16px 56px -10px rgba(139,92,246,.75), 0 0 0 6px rgba(139,92,246,.06), inset 0 1px 0 rgba(255,255,255,.1); }
}
@keyframes cb-aurora { from { background-position: 0% 50%; } to { background-position: 200% 50%; } }
@keyframes cb-dot {
  0%, 80%, 100% { transform: translateY(0) scale(.7); opacity: .45; }
  40% { transform: translateY(-3px) scale(1); opacity: 1; }
}
@keyframes cb-ping {
  0% { transform: scale(1); opacity: .7; }
  80%, 100% { transform: scale(2.4); opacity: 0; }
}
@keyframes cb-caret { 0%, 100% { opacity: 1; } 50% { opacity: .15; } }

.cb-launcher { animation: cb-launcher-glow 4.2s ease-in-out infinite; }

.cb-orb { display: block; position: relative; isolation: isolate; border-radius: 9999px; flex: none; }
.cb-orb__glow, .cb-orb__ring {
  position: absolute; border-radius: inherit;
  background: conic-gradient(from 0deg, #F03CFF, #8B5CF6, #3B82F6, #3DD9FF, #8B5CF6, #F03CFF);
  animation: cb-spin 5.5s linear infinite;
}
.cb-orb__glow { inset: -7px; filter: blur(12px); opacity: .6; z-index: -1; animation: cb-spin 5.5s linear infinite, cb-breathe 3.6s ease-in-out infinite; }
.cb-orb__ring { inset: 0; }
.cb-orb__core {
  position: absolute; inset: 2px; border-radius: inherit; overflow: hidden;
  display: grid; place-items: center;
  background: radial-gradient(circle at 32% 26%, #2b1860 0%, #0d0622 62%, #05010d 100%);
  box-shadow: inset 0 0 14px rgba(139,92,246,.55), inset 0 1px 0 rgba(255,255,255,.12);
}
.cb-orb__core::after {
  content: ''; position: absolute; inset: 0; border-radius: inherit;
  background: radial-gradient(circle at 30% 20%, rgba(255,255,255,.22), transparent 45%);
  pointer-events: none;
}
.cb-orb__core img { width: 74%; height: 74%; object-fit: contain; filter: drop-shadow(0 0 6px rgba(240,60,255,.55)); }

.cb-panel {
  background:
    radial-gradient(120% 60% at 100% 0%, rgba(240,60,255,.10), transparent 60%),
    radial-gradient(90% 50% at 0% 100%, rgba(61,217,255,.08), transparent 60%),
    linear-gradient(180deg, rgba(20,11,44,.94), rgba(7,3,18,.97));
  backdrop-filter: blur(26px) saturate(150%);
  -webkit-backdrop-filter: blur(26px) saturate(150%);
}
.cb-aurora {
  background: linear-gradient(90deg, #F03CFF, #8B5CF6, #3B82F6, #3DD9FF, #8B5CF6, #F03CFF);
  background-size: 200% 100%;
  animation: cb-aurora 6s linear infinite;
}
.cb-dot { animation: cb-dot 1.25s ease-in-out infinite; }
.cb-ping { animation: cb-ping 1.8s cubic-bezier(0,0,.2,1) infinite; }
.cb-caret {
  display: inline-block; width: 2px; height: 1.05em; margin-left: 2px; vertical-align: -0.16em; border-radius: 2px;
  background: linear-gradient(180deg, #F03CFF, #3DD9FF);
  animation: cb-caret .9s ease-in-out infinite;
}
.cb-scroll { scrollbar-width: thin; scrollbar-color: rgba(139,92,246,.45) transparent; }
.cb-scroll::-webkit-scrollbar { width: 5px; }
.cb-scroll::-webkit-scrollbar-track { background: transparent; }
.cb-scroll::-webkit-scrollbar-thumb { background: linear-gradient(180deg, rgba(240,60,255,.6), rgba(59,130,246,.6)); border-radius: 8px; }
.cb-fade-top { -webkit-mask-image: linear-gradient(180deg, transparent 0, #000 18px); mask-image: linear-gradient(180deg, transparent 0, #000 18px); }
.cb-textarea::placeholder { color: rgba(232,228,255,.38); }
/* El contenedor del composer ya muestra el foco; se anula el outline global. */
#cerebro-chat-panel:focus-visible, #cerebro-chat-input:focus-visible { outline: none; }

@media (prefers-reduced-motion: reduce) {
  .cb-launcher, .cb-orb__glow, .cb-orb__ring, .cb-aurora, .cb-dot, .cb-ping, .cb-caret { animation: none !important; }
}
`
