
import React, { useState, useRef } from 'react';
import Button from './Button';

interface FileUploadInputProps {
  id: string;
  label: string;
  onFileChange: (file: File | null) => void;
  accept?: string;
  currentFileUrl?: string; // For displaying existing files/previews
  error?: string;
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({
  id,
  label,
  onFileChange,
  accept = 'image/*',
  currentFileUrl,
  error,
}) => {
  const [fileName, setFileName] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentFileUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setPreviewUrl(currentFileUrl || null);
  }, [currentFileUrl]);


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setFileName(file.name);
      onFileChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFileName('');
      setPreviewUrl(currentFileUrl || null);
      onFileChange(null);
    }
  };

  const clearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the input
    }
    setFileName('');
    setPreviewUrl(null);
    onFileChange(null);
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="mt-1 flex items-center space-x-2">
        <input
          id={id}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          ref={fileInputRef}
          className="hidden" // Hide the default input
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          size="sm"
          className="flex-shrink-0"
        >
          Choose File
        </Button>
        <span className="text-sm text-gray-500 truncate flex-grow">
          {fileName || (currentFileUrl ? 'Existing File' : 'No file chosen')}
        </span>
        {(fileName || previewUrl) && (
          <Button
            type="button"
            onClick={clearFile}
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-800"
            title="Clear file"
          >
            <i className="fa-solid fa-xmark"></i>
          </Button>
        )}
      </div>
      {previewUrl && (
        <div className="mt-2 w-32 h-32 overflow-hidden rounded-md border border-gray-300 flex items-center justify-center bg-gray-50">
          {accept.startsWith('image/') ? (
            <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
          ) : (
            <span className="text-gray-500 text-xs">File selected</span>
          )}
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FileUploadInput;
