/**
 * Client-side image optimisation, run before anything is uploaded.
 *
 * Doing this in the browser rather than on the server means the large original
 * never crosses the network at all — the partner logos already in /public were
 * up to 226 KB of mostly transparent padding, and a phone photo dropped into
 * the cover-image field would be several megabytes.
 */

export type OptimizePreset = "cover" | "logo";

type Preset = {
  maxWidth: number;
  maxHeight: number;
  /** WebP quality. Logos need a higher setting: flat colour shows artefacts. */
  quality: number;
};

const PRESETS: Record<OptimizePreset, Preset> = {
  // Rendered at most 1200px wide as a social card or hero image.
  cover: { maxWidth: 1600, maxHeight: 1600, quality: 0.82 },
  // Rendered in a 112x40 box, so 600px is already 2x for retina at any size
  // we use.
  logo: { maxWidth: 600, maxHeight: 600, quality: 0.92 },
};

export type OptimizedImage = {
  file: File;
  width: number;
  height: number;
  originalBytes: number;
  bytes: number;
  /** False when the original was kept — see the notes in optimizeImage. */
  optimized: boolean;
};

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file couldn't be read as an image"));
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Resizes to fit the preset and re-encodes as WebP.
 *
 * Returns the original untouched when:
 *  - it's an SVG, which is already vector and would be rasterised by a canvas
 *  - the browser can't produce WebP
 *  - the re-encode came out larger, which happens with small flat-colour PNGs
 */
export async function optimizeImage(
  file: File,
  preset: OptimizePreset = "cover",
): Promise<OptimizedImage> {
  const { maxWidth, maxHeight, quality } = PRESETS[preset];
  const originalBytes = file.size;

  const keepOriginal = async (): Promise<OptimizedImage> => {
    let width = 0;
    let height = 0;
    try {
      const img = await loadImage(file);
      width = img.naturalWidth;
      height = img.naturalHeight;
    } catch {
      // Dimensions are metadata only; failing to read them isn't fatal.
    }
    return { file, width, height, originalBytes, bytes: originalBytes, optimized: false };
  };

  if (file.type === "image/svg+xml") return keepOriginal();

  const img = await loadImage(file);
  const scale = Math.min(1, maxWidth / img.naturalWidth, maxHeight / img.naturalHeight);
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return keepOriginal();

  // Left transparent rather than filled white: logos rely on the alpha channel,
  // and WebP preserves it.
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, "image/webp", quality);
  if (!blob || blob.size >= originalBytes) return keepOriginal();

  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return {
    file: new File([blob], name, { type: "image/webp" }),
    width,
    height,
    originalBytes,
    bytes: blob.size,
    optimized: true,
  };
}

/** "226 KB → 18 KB (92% smaller)" for the upload confirmation. */
export function describeSaving(result: OptimizedImage): string {
  const kb = (bytes: number) => `${Math.max(1, Math.round(bytes / 1024))} KB`;
  if (!result.optimized) return kb(result.bytes);

  const saved = Math.round(
    ((result.originalBytes - result.bytes) / result.originalBytes) * 100,
  );
  return `${kb(result.originalBytes)} → ${kb(result.bytes)} (${saved}% smaller)`;
}
