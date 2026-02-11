"use client";

import { useState, useCallback } from "react";
import { useI18n } from "@/lib/useI18n";
import { applyFovFix, imageToCanvas } from "@/lib/fovfix";
import type { UploadedImage, ProcessedImage, AppPhase } from "@/lib/types";
import { UploadArea } from "@/components/UploadArea";
import { ImageGrid } from "@/components/ImageGrid";
import { ComparisonView } from "@/components/ComparisonView";
import JSZip from "jszip";

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function Home(): React.JSX.Element {
  const { t } = useI18n();
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [fov, setFov] = useState(50);
  const [phase, setPhase] = useState<AppPhase>("upload");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFilesSelected = useCallback((files: File[]) => {
    const newImages: UploadedImage[] = files.map((file) => ({
      id: generateId(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setUploadedImages((prev) => [...prev, ...newImages]);
    setPhase("upload");
    setProcessedImages([]);
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setUploadedImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img !== undefined) {
        URL.revokeObjectURL(img.previewUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const handleClear = useCallback(() => {
    for (const img of uploadedImages) {
      URL.revokeObjectURL(img.previewUrl);
    }
    for (const img of processedImages) {
      URL.revokeObjectURL(img.originalUrl);
      URL.revokeObjectURL(img.fixedUrl);
    }
    setUploadedImages([]);
    setProcessedImages([]);
    setPhase("upload");
  }, [uploadedImages, processedImages]);

  const handleFix = useCallback(async () => {
    if (uploadedImages.length === 0) return;

    setPhase("processing");
    setProgress({ current: 0, total: uploadedImages.length });

    const results: ProcessedImage[] = [];

    for (let i = 0; i < uploadedImages.length; i++) {
      const uploaded = uploadedImages[i];
      if (uploaded === undefined) continue;
      setProgress({ current: i + 1, total: uploadedImages.length });

      const result = await new Promise<ProcessedImage>((resolve, reject) => {
        const img = new Image();
        img.onload = (): void => {
          try {
            const sourceCanvas = imageToCanvas(img);
            const fixedCanvas = applyFovFix(sourceCanvas, fov);

            fixedCanvas.toBlob((blob) => {
              if (blob === null) {
                reject(new Error("Failed to create blob"));
                return;
              }

              const fixedUrl = URL.createObjectURL(blob);
              resolve({
                id: uploaded.id,
                originalUrl: uploaded.previewUrl,
                fixedUrl,
                fixedBlob: blob,
                fileName: uploaded.file.name,
              });
            }, "image/png");
          } catch (err) {
            reject(err instanceof Error ? err : new Error(String(err)));
          }
        };
        img.onerror = (): void => {
          reject(new Error(`Failed to load image: ${uploaded.file.name}`));
        };
        img.src = uploaded.previewUrl;
      });

      results.push(result);
    }

    setProcessedImages(results);
    setPhase("result");
  }, [uploadedImages, fov]);

  const handleDownload = useCallback(async () => {
    if (processedImages.length === 0) return;

    setIsDownloading(true);

    try {
      if (processedImages.length === 1) {
        const img = processedImages[0];
        if (img === undefined) return;
        const a = document.createElement("a");
        a.href = img.fixedUrl;
        const baseName =
          img.fileName.lastIndexOf(".") >= 0
            ? img.fileName.slice(0, img.fileName.lastIndexOf("."))
            : img.fileName;
        a.download = `${baseName}_fov${String(fov)}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const zip = new JSZip();
        for (const img of processedImages) {
          const baseName =
            img.fileName.lastIndexOf(".") >= 0
              ? img.fileName.slice(0, img.fileName.lastIndexOf("."))
              : img.fileName;
          zip.file(`${baseName}_fov${String(fov)}.png`, img.fixedBlob);
        }
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(zipBlob);
        a.download = `vrchat_fovfix_${String(fov)}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
      }
    } finally {
      setIsDownloading(false);
    }
  }, [processedImages, fov]);

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold">{t.siteTitle}</h1>
          <p className="text-muted mt-1">{t.siteDescription}</p>
        </header>

        <UploadArea
          t={t}
          onFilesSelected={handleFilesSelected}
          imageCount={uploadedImages.length}
        />

        <ImageGrid images={uploadedImages} onRemove={handleRemoveImage} />

        {uploadedImages.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <label htmlFor="fov-input" className="text-sm font-medium whitespace-nowrap">
                {t.fovLabel}
              </label>
              <input
                id="fov-input"
                type="number"
                min={1}
                max={179}
                value={fov}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v)) {
                    setFov(v);
                  }
                }}
                className="w-20 px-2 py-1 rounded-md border border-border bg-background text-foreground text-center"
              />
              <span className="text-sm text-muted">°</span>
            </div>
            <p className="text-xs text-muted flex-1">{t.fovDescription}</p>
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-border/30 transition-colors"
              >
                {t.clearButton}
              </button>
              <button
                type="button"
                onClick={() => void handleFix()}
                disabled={phase === "processing"}
                className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {phase === "processing" ? t.fixingButton : t.fixButton}
              </button>
            </div>
          </div>
        )}

        {phase === "processing" && progress.total > 0 && (
          <div className="text-center">
            <p className="text-sm text-muted">
              {t.processingProgress(progress.current, progress.total)}
            </p>
            <div className="mt-2 w-full bg-border rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${String((progress.current / progress.total) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {phase === "result" && (
          <>
            <ComparisonView images={processedImages} t={t} />

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => void handleDownload()}
                disabled={isDownloading}
                className="px-8 py-3 rounded-lg bg-primary text-white font-medium text-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? t.downloadingButton : t.downloadButton}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
