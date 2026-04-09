import { motion, AnimatePresence } from 'framer-motion';
import { FileCard } from './FileCard';
import type { FileItem } from '../types';
import { FolderOpen } from 'lucide-react';

interface FileListProps {
  files: FileItem[];
  isLoading: boolean;
  onDownload: (filename: string) => void;
  onDelete: (filename: string) => void;
}

export const FileList = ({ files, isLoading, onDownload, onDelete }: FileListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass-card h-40 rounded-2xl animate-pulse bg-white/5" />
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="p-6 bg-white/5 rounded-full mb-4">
          <FolderOpen className="w-16 h-16 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No files yet</h3>
        <p className="text-muted-foreground w-64 mx-auto">
          Upload some files to get started. They will appear here safely stored in the cloud.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <AnimatePresence>
        {files.map((file) => (
          <FileCard key={file.name} file={file} onDownload={onDownload} onDelete={onDelete} />
        ))}
      </AnimatePresence>
    </div>
  );
};
