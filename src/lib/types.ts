export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
}

export interface ProcessedImage {
  id: string;
  originalUrl: string;
  fixedUrl: string;
  fixedBlob: Blob;
  fileName: string;
}

export type AppPhase = "upload" | "processing" | "result";
