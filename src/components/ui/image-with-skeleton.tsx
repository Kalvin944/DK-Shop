import { useState, useRef, useEffect } from "react";
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

interface ImageWithSkeletonProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  skeletonClassName?: string;
}

export function ImageWithSkeleton({
  src,
  alt,
  className,
  skeletonClassName,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [skeletonHeight, setSkeletonHeight] = useState<number | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const hiddenImgRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  // Précharger l'image pour détecter si elle est déjà en cache et obtenir ses dimensions
  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;

    const handleLoad = () => {
      // Obtenir les dimensions de l'image pour le skeleton
      if (hiddenImgRef.current) {
        const rect = hiddenImgRef.current.getBoundingClientRect();
        setSkeletonHeight(rect.height);
      }
      setIsLoaded(true);
    };

    const handleError = () => {
      setIsLoaded(true); // Afficher quand même l'image même en cas d'erreur
    };

    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);

    // Si l'image est déjà en cache, elle peut être chargée immédiatement
    if (img.complete) {
      handleLoad();
    }

    return () => {
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
    };
  }, [src]);

  // Déterminer si l'image utilise h-auto (hauteur automatique)
  const hasAutoHeight = className?.includes("h-auto");
  
  // Pour les images avec h-auto, on utilise inline-block pour que le conteneur s'adapte à la taille de l'image
  // Pour les autres, on utilise le conteneur parent
  const containerClasses = hasAutoHeight 
    ? "relative inline-block w-full" 
    : "relative w-full h-full";

  return (
    <div className={containerClasses}>
      {/* Image cachée pour obtenir les dimensions réelles (pour h-auto) */}
      {!isLoaded && hasAutoHeight && (
        <img
          ref={hiddenImgRef}
          src={src}
          alt=""
          className={cn(className, "invisible absolute w-full h-auto pointer-events-none")}
          aria-hidden="true"
          onLoad={(e) => {
            const target = e.currentTarget;
            const rect = target.getBoundingClientRect();
            setSkeletonHeight(rect.height);
          }}
        />
      )}
      {/* Skeleton - affiché tant que l'image n'est pas chargée */}
      {!isLoaded && (
        <Skeleton
          className={cn(
            "absolute inset-0 w-full",
            hasAutoHeight ? "" : "h-full",
            skeletonClassName
          )}
          style={
            hasAutoHeight && skeletonHeight
              ? { height: `${skeletonHeight}px` }
              : undefined
          }
        />
      )}
      {/* Image principale */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={cn(
          className,
          isLoaded ? "opacity-100 relative" : "opacity-0 relative",
          "transition-opacity duration-300"
        )}
        onLoad={handleImageLoad}
        {...props}
      />
    </div>
  );
}

