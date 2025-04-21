"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BarChart,
  Upload,
  ChevronRight,
  LineChart,
  PieChart,
  Network,
  Layers,
  BrainCircuit,
  UploadCloud,
  CheckCircle,
  FileSpreadsheet,
  X,
  RefreshCw,
} from "lucide-react";

export default function Models() {
  const [loading, setLoading] = useState(true);
  const [hasDatasets, setHasDatasets] = useState(false);
  const [step, setStep] = useState<"questionnaire" | "models">("questionnaire");
  const [isLabeled, setIsLabeled] = useState<boolean | null>(null);
  const [targetType, setTargetType] = useState<
    "categorical" | "continuous" | null
  >(null);
  const router = useRouter();

  // File upload states
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedFileTypes = [
    "text/csv", 
    "application/vnd.ms-excel", 
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ];

  // Reset function to clear selections
  const resetSelections = () => {
    setIsLabeled(null);
    setTargetType(null);
    setStep("questionnaire");
  };

  // File upload handlers
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
      
      // After successful upload, refresh the page to check for datasets again
      setTimeout(() => {
        setHasDatasets(true);
      }, 2000);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    async function checkForDatasets() {
      try {
        // Call your API to check if datasets exist
        const response = await fetch('/api/datasets/check');
        const data = await response.json();
        
        setHasDatasets(data.hasDatasets);
        setLoading(false);
      } catch (error) {
        console.error("Error checking datasets:", error);
        setHasDatasets(false);
        setLoading(false);
      }
    }
    
    checkForDatasets();
  }, []);

  const modelsByType = {
    unsupervised: [
      {
        name: "K-Means Clustering",
        icon: (
          <PieChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        ),
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
        textColor: "text-purple-600 dark:text-purple-400",
        bgTagColor: "bg-purple-50 dark:bg-purple-900/20",
        description:
          "Unsupervised algorithm for grouping data into clusters. Perfect for customer segmentation, anomaly detection, and pattern discovery.",
        tag: "Clustering",
        path: "/models/configure/kmeans",
      },
      {
        name: "PCA",
        icon: <Network className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />,
        bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
        textColor: "text-cyan-600 dark:text-cyan-400",
        bgTagColor: "bg-cyan-50 dark:bg-cyan-900/20",
        description:
          "Principal Component Analysis reduces dimensionality while preserving variance. Ideal for visualization and preprocessing of high-dimensional data.",
        tag: "Dimensionality Reduction",
        path: "/models/configure/pca",
      },
      {
        name: "Autoencoder",
        icon: (
          <BrainCircuit className="h-6 w-6 text-amber-600 dark:text-amber-400" />
        ),
        bgColor: "bg-amber-100 dark:bg-amber-900/30",
        textColor: "text-amber-600 dark:text-amber-400",
        bgTagColor: "bg-amber-50 dark:bg-amber-900/20",
        description:
          "Neural network used for feature learning and noise reduction. Useful for anomaly detection and generating compressed data representations.",
        tag: "Deep Learning",
        path: "/models/configure/autoencoder",
      },
    ],
    classification: [
      {
        name: "Random Forest",
        icon: (
          <Network className="h-6 w-6 text-green-600 dark:text-green-400" />
        ),
        bgColor: "bg-green-100 dark:bg-green-900/30",
        textColor: "text-green-600 dark:text-green-400",
        bgTagColor: "bg-green-50 dark:bg-green-900/20",
        description:
          "Versatile ensemble algorithm that builds multiple decision trees. Excellent for classification with high accuracy and feature importance.",
        tag: "Classification",
        path: "/models/configure/random-forest",
      },
      {
        name: "SVM",
        icon: (
          <Layers className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        ),
        bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
        textColor: "text-indigo-600 dark:text-indigo-400",
        bgTagColor: "bg-indigo-50 dark:bg-indigo-900/20",
        description:
          "Support Vector Machines excel at classification tasks with clear margins of separation. Powerful for high-dimensional spaces and text categorization.",
        tag: "Classification",
        path: "/models/configure/svm",
      },
      {
        name: "Neural Network",
        icon: (
          <BrainCircuit className="h-6 w-6 text-amber-600 dark:text-amber-400" />
        ),
        bgColor: "bg-amber-100 dark:bg-amber-900/30",
        textColor: "text-amber-600 dark:text-amber-400",
        bgTagColor: "bg-amber-50 dark:bg-amber-900/20",
        description:
          "Deep learning model for complex classification problems. Suited for image classification, sentiment analysis, and multi-class problems.",
        tag: "Deep Learning",
        path: "/models/configure/neural-network-classifier",
      },
    ],
    regression: [
      {
        name: "Linear Regression",
        icon: (
          <LineChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        ),
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        textColor: "text-blue-600 dark:text-blue-400",
        bgTagColor: "bg-blue-50 dark:bg-blue-900/20",
        description:
          "Predicts continuous values with linear relationships between features. Ideal for sales forecasting, trend analysis and simple predictions.",
        tag: "Regression",
        path: "/models/configure/linear-regression",
      },
      {
        name: "Gradient Boosting",
        icon: <BarChart className="h-6 w-6 text-rose-600 dark:text-rose-400" />,
        bgColor: "bg-rose-100 dark:bg-rose-900/30",
        textColor: "text-rose-600 dark:text-rose-400",
        bgTagColor: "bg-rose-50 dark:bg-rose-900/20",
        description:
          "Advanced ensemble technique that builds models sequentially. Provides state-of-the-art accuracy for structured data problems.",
        tag: "Regression",
        path: "/models/configure/gradient-boosting",
      },
      {
        name: "Neural Network",
        icon: (
          <BrainCircuit className="h-6 w-6 text-amber-600 dark:text-amber-400" />
        ),
        bgColor: "bg-amber-100 dark:bg-amber-900/30",
        textColor: "text-amber-600 dark:text-amber-400",
        bgTagColor: "bg-amber-50 dark:bg-amber-900/20",
        description:
          "Deep learning model for complex regression tasks. Well-suited for datasets with non-linear relationships and multiple features.",
        tag: "Deep Learning",
        path: "/models/configure/neural-network-regressor",
      },
    ],
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-[70vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-full w-12 mb-6"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 h-64"
              >
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 mb-8"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!hasDatasets) {
    return (
      <div className="container mt-20 mx-auto p-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-6 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-6">
              <AlertCircle className="h-12 w-12 text-amber-600 dark:text-amber-500" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              No Datasets Available
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 max-w-lg mx-auto leading-relaxed">
              You need to upload a dataset before you can train models. Please upload your data below to continue.
            </p>
          </div>
          
          {/* Embedded Upload UI */}
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 ${
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
              <UploadCloud className="h-14 w-14 text-blue-500 dark:text-blue-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Drag and drop your dataset here
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                Supported file types: CSV, Excel (.xls, .xlsx) up to 10MB
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Select Files
              </button>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mb-6">
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
            <div className="mb-6">
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
            <div className="mb-6 flex items-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
              <CheckCircle className="h-5 w-5" />
              <span>Files uploaded successfully! Continuing to model selection...</span>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="mb-6 flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Link 
              href="/"
              className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Return to Home
            </Link>
            <button
              onClick={uploadFiles}
              disabled={files.length === 0 || uploading}
              className={`px-5 py-2.5 rounded-lg text-white ${
                files.length === 0 || uploading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 transition-colors"
              }`}
            >
              {uploading ? "Uploading..." : "Upload Files"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determine which models to display based on user's answers
  const getModelsToDisplay = () => {
    if (!isLabeled) {
      return modelsByType.unsupervised;
    } else {
      if (targetType === "categorical") {
        return modelsByType.classification;
      } else if (targetType === "continuous") {
        return modelsByType.regression;
      }
    }
    return [];
  };

  // Questionnaire form
  if (step === "questionnaire") {
    return (
      <div className="container mx-auto p-8 max-w-3xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Help Us Recommend the Right Models
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-100 dark:border-gray-700">
          <div className="space-y-8">
            {/* Question 1: Is the dataset labeled? */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Is your dataset labeled?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Labeled data has a target column that you want to predict.
                Unlabeled data is used for finding patterns without a specific
                target.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <button
                  onClick={() => setIsLabeled(true)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all flex items-center ${
                    isLabeled === true
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {isLabeled === true && (
                    <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
                  )}
                  <span
                    className={
                      isLabeled === true
                        ? "text-blue-700 dark:text-blue-300 font-medium"
                        : ""
                    }
                  >
                    Yes, it's labeled
                  </span>
                </button>

                <button
                  onClick={() => setIsLabeled(false)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all flex items-center ${
                    isLabeled === false
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {isLabeled === false && (
                    <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
                  )}
                  <span
                    className={
                      isLabeled === false
                        ? "text-blue-700 dark:text-blue-300 font-medium"
                        : ""
                    }
                  >
                    No, it's unlabeled
                  </span>
                </button>
              </div>
            </div>

            {/* Question 2: Target type (only if labeled) */}
            {isLabeled && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  What type of target variable do you have?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  This determines whether you need a classification or
                  regression model.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                  <button
                    onClick={() => setTargetType("categorical")}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all flex items-center ${
                      targetType === "categorical"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {targetType === "categorical" && (
                      <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
                    )}
                    <div>
                      <span
                        className={`block ${
                          targetType === "categorical"
                            ? "text-blue-700 dark:text-blue-300 font-medium"
                            : ""
                        }`}
                      >
                        Categorical
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        E.g., yes/no, categories, classes
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => setTargetType("continuous")}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all flex items-center ${
                      targetType === "continuous"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {targetType === "continuous" && (
                      <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
                    )}
                    <div>
                      <span
                        className={`block ${
                          targetType === "continuous"
                            ? "text-blue-700 dark:text-blue-300 font-medium"
                            : ""
                        }`}
                      >
                        Continuous
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        E.g., price, temperature, age
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Continue button and Reset button */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setStep("models")}
                disabled={
                  isLabeled === null || (isLabeled && targetType === null)
                }
                className={`w-full sm:flex-1 py-3 px-4 text-white rounded-lg font-medium text-lg flex items-center justify-center ${
                  isLabeled === null || (isLabeled && targetType === null)
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                }`}
              >
                View Recommended Models
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Models display (after questionnaire)
  const modelsToDisplay = getModelsToDisplay();

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <button
              onClick={() => setStep("questionnaire")}
              className="text-sm hover:underline flex items-center"
            >
              <ArrowRight className="h-3 w-3 rotate-180 mr-1" />
              Change dataset type
            </button>
          </div>
          
          {/* Add the reset button here */}
          <button
            onClick={resetSelections}
            className="flex items-center text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reset all choices
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-2 tracking-tight">
          {!isLabeled
            ? "Unsupervised Learning Models"
            : targetType === "categorical"
            ? "Classification Models"
            : "Regression Models"}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
          {!isLabeled
            ? "These models help you discover patterns and structure in unlabeled data"
            : targetType === "categorical"
            ? "These models predict categorical outcomes or class labels from your features"
            : "These models predict continuous values based on your input features"}
        </p>
      </div>

      {/* Model category filters */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium text-sm whitespace-nowrap">
          {!isLabeled
            ? "Unsupervised Learning"
            : targetType === "categorical"
            ? "Classification"
            : "Regression"}
        </span>
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm whitespace-nowrap">
          {modelsToDisplay.length} models available
        </span>
      </div>

      {/* Model cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modelsToDisplay.map((model, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700 group"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`${model.bgColor} p-2.5 rounded-lg mr-3`}>
                  {model.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {model.name}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                {model.description}
              </p>
              <div className="flex justify-between items-center">
                <span
                  className={`px-3 py-1 ${model.bgTagColor} ${model.textColor} rounded-full text-sm font-medium`}
                >
                  {model.tag}
                </span>
                <Link
                  href={model.path}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:underline transition-all"
                >
                  Configure{" "}
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reset button after models display */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={resetSelections}
          className="flex items-center justify-center py-3 px-6 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Start Over with Different Choices
        </button>
      </div>
    </div>
  );
}
