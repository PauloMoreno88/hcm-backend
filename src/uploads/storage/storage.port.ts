export type UploadInput = {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
};

export type UploadResult = {
  url: string;
  key: string;
};

export interface StoragePort {
  upload(input: UploadInput): Promise<UploadResult>;
}

export const STORAGE_PORT = Symbol('STORAGE_PORT');
