"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, AlertCircle, CheckCircle, FileSpreadsheet, X } from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const allowedFileTypes = [
    "text/csv", 
    "application/vnd.ms-excel", 
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ];

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!allowedFileTypes.includes(file.type)) {
      setErrorMessage("Invalid file type. Please upload CSV or Excel files.");
      setUploadStatus("error");
      return false;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File is too large. Maximum size is 10MB.");
      setUploadStatus("error");
      return false;
    }

    return true;
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setErrorMessage("");
    setUploadStatus("idle");
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    // Validate all files
    const validFiles = droppedFiles.filter(validateFile);
    if (validFiles.length > 0) {
      setFiles(validFiles);
    }
  }, []);

  const onFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("");
    setUploadStatus("idle");
    
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      
      // Validate all files
      const validFiles = selectedFiles.filter(validateFile);
      if (validFiles.length > 0) {
        setFiles(validFiles);
      }
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setUploadStatus("idle");
    setErrorMessage("");
  }, []);

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus("idle");
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      // Define custom response type
      interface CustomResponse {
        ok: boolean;
        text: () => Promise<string>;
        json: () => Promise<any>;
      }
      
      // Use XMLHttpRequest to track upload progress
      const response = await new Promise<CustomResponse>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(progress);
          }
        });
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              ok: true,
              text: () => Promise.resolve(xhr.responseText),
              json: () => Promise.resolve(JSON.parse(xhr.responseText))
            });
          } else {
            reject(new Error(xhr.statusText || "Request failed"));
          }
        };
        
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.open('POST', "/api/upload");
        xhr.send(formData);
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to upload files");
      }

      const data = await response.json();
      setUploadStatus("success");
      
      // Reset form after successful upload
      setTimeout(() => {
        router.push(`/models`);
      }, 2000);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mt-5 mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload Dataset</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Upload your dataset to begin preprocessing and model training
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div 
          className={`border-2 border-dashed rounded-lg p-10 text-center ${
            isDragging 
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
              : "border-gray-300 dark:border-gray-600"
          }`}
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={onFileInputChange}
            className="hidden"
            accept=".csv,.xls,.xlsx"
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <UploadCloud className="h-16 w-16 text-blue-500 dark:text-blue-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Drag and drop your files here
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
              Supported file types: CSV, Excel (.xls, .xlsx) up to 10MB
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Select Files
            </button>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Selected Files:</h4>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li 
                  key={`${file.name}-${index}`} 
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    <FileSpreadsheet className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024).toFixed(0)} KB
                    </span>
                  </div>
                  <button 
                    onClick={() => removeFile(index)}
                    className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading...</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Success/Error Messages */}
        {uploadStatus === "success" && (
          <div className="mt-6 flex items-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
            <CheckCircle className="h-5 w-5" />
            <span>Files uploaded successfully! Redirecting to dataset view...</span>
          </div>
        )}

        {uploadStatus === "error" && (
          <div className="mt-6 flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
            <AlertCircle className="h-5 w-5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex justify-end space-x-4">
          <Link
            href="/"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </Link>
          <button
            onClick={uploadFiles}
            disabled={files.length === 0 || uploading}
            className={`px-4 py-2 rounded-md text-white ${
              files.length === 0 || uploading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading ? "Uploading..." : "Upload Files"}
          </button>
        </div>
      </div>
    </div>
  );
}