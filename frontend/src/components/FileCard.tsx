import { motion } from 'framer-motion';
import { Download, Trash2, FileText, Image as ImageIcon, File, Calendar, HardDrive, Lock } from 'lucide-react';
import type { FileItem } from '../types';

interface FileCardProps {
  file: FileItem;
  onDownload: (filename: string) => void;
  onDelete: (filename: string) => void;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
      return <FileText className="w-8 h-8 text-blue-400" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return <ImageIcon className="w-8 h-8 text-emerald-400" />;
    default:
      return <File className="w-8 h-8 text-indigo-400" />;
  }
};

export const FileCard = ({ file, onDownload, onDelete }: FileCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-card group relative p-5 rounded-2xl flex flex-col gap-4 overflow-hidden bg-card text-card-foreground"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex items-start justify-between z-10">
        <div className="p-3 bg-primary/10 rounded-xl">
          {getFileIcon(file.name)}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDownload(file.name)}
            className="p-2 rounded-full bg-primary/10 text-muted-foreground hover:text-primary hover:bg-primary/20 transition-colors"
          >
            <Download className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(file.name)}
            className="p-2 rounded-full bg-destructive/10 text-muted-foreground hover:text-destructive hover:bg-destructive/20 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="z-10 mt-auto space-y-1">
        <h3 className="font-semibold text-foreground truncate" title={file.name}>
          {file.name}
        </h3>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <HardDrive className="w-3 h-3" />
            {formatBytes(file.size)}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(file.uploaded_at).toLocaleDateString()}
          </span>
          {file.encrypted && (
            <span className="flex items-center gap-1 text-green-400" title="Encrypted with AES">
              <Lock className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity duration-300">
        <button
          onClick={() => onDownload(file.name)}
          className="p-3 bg-white/10 hover:bg-primary text-white rounded-full transition-colors backdrop-blur-sm"
        >
          <Download className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(file.name)}
          className="p-3 bg-white/10 hover:bg-destructive text-white rounded-full transition-colors backdrop-blur-sm"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>    </motion.div>
  );
};
