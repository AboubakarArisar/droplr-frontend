import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { config } from "../config";
import toast, { Toaster } from "react-hot-toast";

const API_URL = config.apiUrl;
const EXPIRY_TIME = config.expiryTime;

export const Zone = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [nearbyFiles, setNearbyFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const location = useLocation();
  const { latitude, longitude, accuracy, method } = location.state || {};

  useEffect(() => {
    if (latitude && longitude) {
      fetchNearbyFiles();
    }
  }, [latitude, longitude]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNearbyFiles((prevFiles) =>
        prevFiles.map((file) => ({
          ...file,
          remainingTime: Math.max(
            0,
            EXPIRY_TIME - (Date.now() - new Date(file.createdAt).getTime())
          ),
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatRemainingTime = (remainingTime) => {
    if (remainingTime <= 0) return "Expired";

    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const fetchNearbyFiles = async () => {
    setLoadingFiles(true);
    try {
      const url = new URL(`${API_URL}/files/nearby`);
      url.searchParams.append("latitude", latitude);
      url.searchParams.append("longitude", longitude);
      if (accuracy) {
        url.searchParams.append("accuracy", accuracy);
      }

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        // Add remaining time to each file
        const filesWithTime = data.data.map((file) => ({
          ...file,
          remainingTime: Math.max(
            0,
            EXPIRY_TIME - (Date.now() - new Date(file.createdAt).getTime())
          ),
        }));
        setNearbyFiles(filesWithTime);
      } else {
        setError("Failed to fetch nearby files");
      }
    } catch (err) {
      setError("Error fetching nearby files");
      console.error(err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !latitude || !longitude) return;

    if (file.size > 104857600) {
      toast.error("File size exceeds upload smaller than 100MB");
      return;
    }
    setUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    try {
      const response = await fetch(`${API_URL}/files/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setProgress(100);
        setFile(null);
        fetchNearbyFiles();
      } else {
        setError(data.message || "Upload failed");
      }
    } catch (err) {
      setError("Error uploading file");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (fileUrl, filename) => {
    try {
      setDownloadingFile(filename);
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError("Error downloading file");
      console.error(err);
    } finally {
      setDownloadingFile(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const getFileIcon = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();

    const iconMap = {
      jpg: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      jpeg: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      png: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      gif: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",

      pdf: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",
      doc: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",
      docx: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",
      txt: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",

      mp3: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
      wav: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",

      mp4: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
      mov: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",

      zip: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
      rar: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",

      js: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
      html: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
      css: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",

      default:
        "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    };

    return iconMap[extension] || iconMap.default;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white px-6 py-10'>
      <Toaster />
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='bg-[#1e293b] border border-gray-700 rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold tracking-wide'>Drop a File</h2>
              <div className='text-blue-400 text-sm'>
                <div className='text-right'>
                  <div className='font-medium'>
                    Location: {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                isDragging
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-600 hover:border-blue-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type='file'
                onChange={(e) => setFile(e.target.files[0])}
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
              />
              <div className='text-center'>
                <svg
                  className={`mx-auto h-12 w-12 mb-4 transition-colors duration-300 ${
                    isDragging ? "text-blue-400" : "text-gray-400"
                  }`}
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                  />
                </svg>
                <p
                  className={`text-lg font-medium mb-2 transition-colors duration-300 ${
                    isDragging ? "text-blue-400" : "text-gray-300"
                  }`}
                >
                  {file ? file.name : "Drag and drop your file here"}
                </p>
                <p className='text-sm text-gray-400'>or click to browse</p>
              </div>
            </div>

            {uploading && (
              <div className='mt-6 space-y-3'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-blue-400 mb-2'>
                    {progress}%
                  </div>
                  <div className='text-sm text-gray-400'>
                    Uploading your file...
                  </div>
                </div>
                <div className='h-3 w-full bg-gray-700 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out rounded-full'
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className='flex justify-between text-xs text-gray-400'>
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            )}

            {error && (
              <div className='mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg'>
                <p className='text-red-400 text-sm text-center'>{error}</p>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`mt-6 w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                uploading
                  ? "bg-gray-600 cursor-wait"
                  : !file
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              }`}
            >
              {uploading ? (
                <>
                  <svg
                    className='animate-spin h-5 w-5'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  <span>Uploading... {progress}%</span>
                </>
              ) : (
                <>
                  <svg
                    className='h-5 w-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
                    />
                  </svg>
                  <span>Upload File</span>
                </>
              )}
            </button>
          </div>

          <div className='bg-[#1e293b] border border-gray-700 rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold tracking-wide'>Nearby Files</h2>
              <div className='flex items-center space-x-2'>
                <span className='text-sm text-gray-400'>
                  within{" "}
                  {accuracy && accuracy > 100
                    ? Math.min(500, 200 + accuracy)
                    : 200}
                  m
                </span>
                <button
                  onClick={fetchNearbyFiles}
                  disabled={loadingFiles}
                  className={`p-2 rounded-lg transition-colors ${
                    loadingFiles
                      ? "text-gray-500 cursor-wait"
                      : "text-blue-400 hover:text-blue-300 cursor-pointer"
                  }`}
                >
                  {loadingFiles ? (
                    <svg
                      className='animate-spin h-5 w-5'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className='h-5 w-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {loadingFiles ? (
              <div className='flex justify-center items-center py-12'>
                <svg
                  className='animate-spin h-8 w-8 text-blue-400'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
              </div>
            ) : nearbyFiles.length === 0 ? (
              <div className='text-center py-12'>
                <svg
                  className='mx-auto h-12 w-12 text-gray-400 mb-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
                  />
                </svg>
                <p className='text-gray-400'>No files found nearby.</p>
              </div>
            ) : (
              <div className='space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar'>
                {nearbyFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className='group bg-[#0f172a] rounded-xl border border-gray-700 p-4 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <div className='p-2 bg-blue-500/10 rounded-lg'>
                          <svg
                            className='h-6 w-6 text-blue-400'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d={getFileIcon(file.filename)}
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className='font-medium text-white group-hover:text-blue-400 transition-colors'>
                            {file.filename}
                          </h3>
                          <div className='flex items-center gap-3 space-x-3 text-sm'>
                            <p
                              className={`${
                                file.remainingTime <= 0
                                  ? "text-red-400"
                                  : "text-blue-400"
                              }`}
                            >
                              {formatRemainingTime(file.remainingTime)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleDownload(file.fileUrl, file.filename)
                        }
                        disabled={
                          downloadingFile === file.filename ||
                          file.remainingTime <= 0
                        }
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          downloadingFile === file.filename
                            ? "bg-gray-600 cursor-wait"
                            : file.remainingTime <= 0
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        }`}
                      >
                        {downloadingFile === file.filename ? (
                          <svg
                            className='animate-spin h-5 w-5'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                          >
                            <circle
                              className='opacity-25'
                              cx='12'
                              cy='12'
                              r='10'
                              stroke='currentColor'
                              strokeWidth='4'
                            ></circle>
                            <path
                              className='opacity-75'
                              fill='currentColor'
                              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            ></path>
                          </svg>
                        ) : file.remainingTime <= 0 ? (
                          <svg
                            className='h-5 w-5'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M6 18L18 6M6 6l12 12'
                            />
                          </svg>
                        ) : (
                          <svg
                            className='h-5 w-5'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
};
