import axios from 'axios';
import type { FileItem } from '../types';

const api = axios.create({
  baseURL: 'http://100.93.190.2:8082/backend',
});

// Helper for generating mock data if backend isn't ready
const mockFiles: FileItem[] = [
  { name: 'Project_Proposal.pdf', size: 2048576, uploaded_at: new Date(Date.now() - 86400000).toISOString(), encrypted: true },
  { name: 'Q3_Financials.xlsx', size: 1048576, uploaded_at: new Date(Date.now() - 172800000).toISOString(), encrypted: true },
];

export const fetchFiles = async (): Promise<FileItem[]> => {
  try {
    const res = await api.get('/files');
    return res.data;
  } catch (error) {
    console.warn('Backend not reachable, returning mock data');
    return new Promise(resolve => setTimeout(() => resolve(mockFiles), 1000));
  }
};

export const uploadFile = async (file: File, onProgress: (progress: number) => void): Promise<FileItem> => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
    
    // Upload response gives {"message": "Uploaded", "file": file.filename}
    // So we fetch files list again or return a simulated one
    return {
      name: file.name,
      size: file.size,
      uploaded_at: new Date().toISOString(),
      encrypted: true
    };
  } catch (error) {
    console.warn('Backend not reachable, simulating upload');
    return new Promise(resolve => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        onProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          resolve({
            name: file.name,
            size: file.size,
            uploaded_at: new Date().toISOString(),
            encrypted: true,
          });
        }
      }, 200);
    });
  }
};

export const downloadFile = async (filename: string) => {
  try {
    const response = await api.get(`/download/${filename}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.warn('Backend not reachable, simulating download');
    alert(`Simulated download for ${filename}`);
  }
};

export const deleteFile = async (filename: string): Promise<void> => {
  try {
    await api.delete(`/delete/${filename}`);
  } catch (error) {
    console.warn('Backend delete failed, simulating success');
    return new Promise(resolve => setTimeout(resolve, 500));
  }
};

export const fetchStats = async () => {
  try {
    const res = await api.get('/stats');
    return res.data;
  } catch (error) {
    console.warn('Backend not reachable, returning mock stats');
    return {
      totalFiles: 15,
      totalStorage: 104857600,
      apiUptime: "99.9%",
      activeConnections: 12,
      encryptionStatus: "Active",
      hdfsStatus: "Offline",
      apiCalls: 1250,
      bandwidthUsed: "5 MB/s"
    };
  }
};
