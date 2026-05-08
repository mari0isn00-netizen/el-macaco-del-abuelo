export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative inline-grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[9px] border border-[#1f5c8a]/25 bg-[#f8f1df] shadow-sm ${className}`}
      aria-hidden="true"
    >
      <span className="absolute inset-0 bg-[linear-gradient(45deg,transparent_42%,#1f5c8a_42%,#1f5c8a_50%,transparent_50%),linear-gradient(-45deg,transparent_42%,#c47b3a_42%,#c47b3a_50%,transparent_50%)] bg-[length:14px_14px]" />
      <span className="absolute inset-[5px] rounded-[6px] border border-[#1f5c8a]/35 bg-[#fff8ea]/90" />
      <span className="relative font-serif text-[13px] font-black tracking-[-0.04em] text-[#704624]">MA</span>
    </span>
  )
}
