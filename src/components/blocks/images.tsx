import Image from "next/image";
import { useState } from "react";

interface ImagePreviewProps {
  images: string[];
}

export default function ImagePreview({ images }: ImagePreviewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  const imageCount = Math.min(images.length, 4);

  // Layout configurations based on number of images
  const getGridLayout = () => {
    switch (imageCount) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-2";
      case 4:
        return "grid-cols-2";
      default:
        return "grid-cols-2";
    }
  };

  const getImageHeight = (index: number) => {
    if (imageCount === 1) return "h-96";
    if (imageCount === 3 && index === 0) return "h-96";
    return "h-48";
  };

  const getImageSpan = (index: number) => {
    if (imageCount === 3 && index === 0) return "col-span-2";
    return "";
  };

  return (
    <>
      <div
        className={`grid ${getGridLayout()} gap-2 mt-3 rounded-sm overflow-hidden`}
      >
        {images.slice(0, 4).map((image, index) => (
          <div
            key={index}
            className={`relative ${getImageHeight(index)} ${getImageSpan(
              index
            )} bg-gray-100 cursor-pointer overflow-hidden group`}
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image}
              alt={`Post image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay for 4+ images */}
            {index === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  +{images.length - 4}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for full-size image */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full max-w-5xl max-h-[90vh]">
            <Image
              src={selectedImage}
              alt="Full size preview"
              fill
              className="object-contain"
              sizes="100vw"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
