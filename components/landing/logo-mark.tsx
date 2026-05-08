import Image from "next/image"

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative inline-block h-12 w-12 shrink-0 overflow-hidden rounded-[10px] bg-[#f2e2c7] shadow-sm ring-1 ring-[#704624]/15 ${className}`}
      aria-hidden="true"
    >
      <Image src="/images/emda-logo.png" alt="" fill sizes="48px" className="object-cover" priority />
    </span>
  )
}
