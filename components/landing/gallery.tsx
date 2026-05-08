"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

const images = [
  { src: "/images/emda-piscina-atardecer.webp", alt: "Piscina al atardecer", category: "Piscina" },
  { src: "/images/emda-piscina-jardin.webp", alt: "Piscina y jardín", category: "Exterior" },
  { src: "/images/emda-piscina-jacuzzi.webp", alt: "Jacuzzi junto a la piscina", category: "Piscina" },
  { src: "/images/emda-tumbonas-piscina.webp", alt: "Tumbonas junto al agua", category: "Descanso" },
  { src: "/images/emda-rincon-jardin.webp", alt: "Zona de descanso junto a la piscina", category: "Piscina" },
  { src: "/images/emda-entrada-apartamento.webp", alt: "Entrada del apartamento bajo la pérgola", category: "Alojamiento" },
  { src: "/images/emda-cocina.webp", alt: "Cocina del apartamento", category: "Interior" },
  { src: "/images/emda-salon-dormitorio.webp", alt: "Salón dormitorio luminoso", category: "Interior" },
  { src: "/images/emda-bano.webp", alt: "Baño con ducha", category: "Interior" },
  { src: "/images/emda-detalle-mesa.webp", alt: "Detalle exterior con mesa preparada", category: "Detalles" },
]

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const openLightbox = (index: number) => setSelectedImage(index)
  const closeLightbox = () => setSelectedImage(null)

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length)
    }
  }

  return (
    <section id="galeria" className="bg-card py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-secondary">
            Galería
          </span>
          <h2 className="mt-4 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Descubre cada rincón
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Todas las fotos reales del jardín, la piscina y el apartamento independiente.
          </p>
        </div>

        <div className="grid auto-rows-[190px] grid-cols-2 gap-4 md:auto-rows-[245px] md:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={image.src}
              className={[
                "group relative cursor-pointer overflow-hidden rounded-xl",
                index === 0 ? "col-span-2 row-span-2" : "",
                index === 2 || index === 5 || index === 8 ? "col-span-2" : "",
              ].join(" ")}
              onClick={() => openLightbox(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={index === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
              <div className="absolute bottom-4 left-4 pr-4 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <p className="text-sm font-medium">{image.category}</p>
                <p className="text-lg font-serif">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 p-2 text-white/80 transition-colors hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-8 w-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 p-2 text-white/80 transition-colors hover:text-white"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>

          <div className="relative mx-4 aspect-video w-full max-w-6xl">
            <Image
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 p-2 text-white/80 transition-colors hover:text-white"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-10 w-10" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  )
}


