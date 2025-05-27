export type FileType = 'json' | 'xml' | 'excel' | 'tsv';

export interface FileData {
  name: string;
  size: string;
  type: FileType;
  rawSize: number;
  content: string;
  previewData: string[][];
}