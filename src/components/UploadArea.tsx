"use client";

import { useCallback, useRef, useState } from "react";
import type { Translations } from "@/lib/i18n";

interface UploadAreaProps {
  t: Translations;
  onFilesSelected: (files: File[]) => void;
  imageCount: number;
}

export function UploadArea({ t, onFilesSelected, imageCount }: UploadAreaProps): React.JSX.Element {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (fileList === null) return;
      const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
        isDragging
          ? "border-primary bg-primary/10"
          : "border-border hover:border-primary/50 hover:bg-surface"
      }`}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
        }}
      />
      <div className="flex flex-col items-center gap-3">
        <svg
          className="w-12 h-12 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
          />
        </svg>
        <p className="text-lg font-medium">{t.uploadTitle}</p>
        <p className="text-sm text-muted">{t.uploadDescription}</p>
        <button
          type="button"
          className="mt-2 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          {t.uploadButton}
        </button>
        {imageCount > 0 && <p className="text-sm text-muted mt-1">{t.imageCount(imageCount)}</p>}
      </div>
    </div>
  );
}
