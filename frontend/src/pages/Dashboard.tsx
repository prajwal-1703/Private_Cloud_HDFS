import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { UploadBox } from '../components/UploadBox';
import { FileList } from '../components/FileList';
import type { FileItem } from '../types';
import { fetchFiles, uploadFile, downloadFile, deleteFile } from '../lib/api';

export function Dashboard() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const data = await fetchFiles();
      setFiles(data);
    } catch (error) {
      toast.error('Failed to parse files');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const newFile = await uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });
      setFiles(prev => [newFile, ...prev]);
      toast.success('File uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = async (filename: string) => {
    toast.promise(
      downloadFile(filename),
      {
        loading: `Downloading ${filename}...`,
        success: `${filename} downloaded`,
        error: 'Download failed',
      }
    );
  };

  const handleDelete = async (filename: string) => {
    toast.promise(
      deleteFile(filename).then(() => {
        setFiles(prev => prev.filter(f => f.name !== filename));
      }),
      {
        loading: `Deleting ${filename}...`,
        success: `${filename} deleted`,
        error: 'Delete failed',
      }
    );
  };

  return (
    <>
      <section>
        <div className="mb-6 mt-8">
          <h1 className="text-3xl font-bold tracking-tight">Features & Storage</h1>
          <p className="text-muted-foreground mt-2">Upload, manage, and share your files securely.</p>
        </div>
        <UploadBox 
          onUpload={handleUpload} 
          isUploading={isUploading} 
          progress={uploadProgress} 
        />
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Files</h2>
        </div>
        <FileList 
          files={files} 
          isLoading={isLoading} 
          onDownload={handleDownload} 
          onDelete={handleDelete}
        />
      </section>
    </>
  );
}