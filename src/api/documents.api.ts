import { api } from './client';
import type { DocumentCategory, HealthDocument } from '@/types';

export type ListDocumentsQuery = {
  category?: DocumentCategory;
  limit?: number;
  offset?: number;
};

export type UploadDocumentInput = {
  file: File;
  title: string;
  category: DocumentCategory;
  notes?: string;
  takenAt?: string;
};

export const documentsApi = {
  list(query: ListDocumentsQuery = {}) {
    return api
      .get<{ items: HealthDocument[]; total: number }>('/documents', { params: query })
      .then((r) => r.data);
  },
  get(id: string) {
    return api.get<HealthDocument>(`/documents/${id}`).then((r) => r.data);
  },
  upload(input: UploadDocumentInput) {
    const fd = new FormData();
    fd.append('file', input.file);
    fd.append('title', input.title);
    fd.append('category', input.category);
    if (input.notes) fd.append('notes', input.notes);
    if (input.takenAt) fd.append('takenAt', input.takenAt);
    return api
      .post<HealthDocument>('/documents', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
  download(id: string) {
    return api
      .get<Blob>(`/documents/${id}/download`, { responseType: 'blob' })
      .then((r) => r.data);
  },
  remove(id: string) {
    return api.delete(`/documents/${id}`).then(() => undefined);
  },
};
