export function fileFingerprint(file: File): string {
  return `${file.name}\0${String(file.size)}\0${String(file.lastModified)}`
}

export interface DuplicateCheckResult {
  newFiles: File[]
  duplicateFileNames: string[]
}

export function filterDuplicateFiles(incomingFiles: File[], existingFingerprints: Set<string>): DuplicateCheckResult {
  const newFiles: File[] = []
  const duplicateFileNames: string[] = []

  for (const file of incomingFiles) {
    const fp = fileFingerprint(file)
    if (existingFingerprints.has(fp)) {
      duplicateFileNames.push(file.name)
    } else {
      newFiles.push(file)
    }
  }

  return { newFiles, duplicateFileNames }
}
