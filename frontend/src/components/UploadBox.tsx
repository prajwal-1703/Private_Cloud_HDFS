import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadBoxProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
  progress: number;
}

export const UploadBox = ({ onUpload, isUploading, progress }: UploadBoxProps) => {

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && !isUploading) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload, isUploading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    disabled: isUploading 
  });

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`glass-card relative overflow-hidden rounded-2xl border-2 border-dashed p-8 transition-all duration-300 ease-in-out cursor-pointer
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/50'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div
            animate={{ 
              y: isDragActive ? -10 : 0,
              scale: isDragActive ? 1.1 : 1
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="p-4 bg-primary/10 rounded-full"
          >
            <UploadCloud className="w-10 h-10 text-primary" />
          </motion.div>
          
          <div>
            <p className="text-lg font-medium text-foreground">
              {isDragActive ? "Drop the file here" : "Drag & drop to upload"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse files
            </p>
          </div>
        </div>

        <AnimatePresence>
          {isUploading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-8"
            >
              <div className="w-full max-w-sm space-y-4">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-2">
                    <FileIcon className="w-4 h-4 text-primary" />
                    Uploading...
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
