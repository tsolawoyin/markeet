"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader, ZoomIn, ZoomOut } from "lucide-react";
import { cropImage } from "@/utils/crop-image";

interface ImageCropperModalProps {
  imageSrc: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCropComplete: (blob: Blob) => void;
}

export function ImageCropperModal({
  imageSrc,
  open,
  onOpenChange,
  onCropComplete,
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsCropping(true);
    try {
      const blob = await cropImage(imageSrc, croppedAreaPixels);
      onCropComplete(blob);
      onOpenChange(false);
    } catch (error) {
      console.error("Crop failed:", error);
    } finally {
      setIsCropping(false);
    }
  };

  const handleClose = (value: boolean) => {
    if (!isCropping) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      onOpenChange(value);
    }
  };

  if (!imageSrc) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md dark:bg-stone-900 dark:border-stone-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Crop Photo</DialogTitle>
          <DialogDescription className="dark:text-stone-400">
            Drag to reposition, pinch or use the slider to zoom.
          </DialogDescription>
        </DialogHeader>

        {/* Crop area */}
        <div className="relative w-full aspect-square bg-stone-950 rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-3 px-1">
          <ZoomOut className="w-4 h-4 text-stone-400 dark:text-stone-500 shrink-0" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full appearance-none cursor-pointer accent-orange-500"
          />
          <ZoomIn className="w-4 h-4 text-stone-400 dark:text-stone-500 shrink-0" />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isCropping}
            className="dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isCropping}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isCropping ? (
              <>
                <Loader className="w-4 h-4 animate-spin mr-2" />
                Cropping...
              </>
            ) : (
              "Crop"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
