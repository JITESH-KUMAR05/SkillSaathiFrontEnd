'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  CameraIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  LanguageIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface ScannedDocument {
  id: string;
  name: string;
  type: 'image' | 'pdf';
  url: string;
  extractedText?: string;
  summary?: string;
  language: string;
  scanDate: string;
}

export function DocumentScanner() {
  const [scannedDocs, setScannedDocs] = useState<ScannedDocument[]>([
    {
      id: '1',
      name: 'Mathematics Notes',
      type: 'image',
      url: '/placeholder-doc.jpg',
      extractedText: 'Quadratic equations: ax² + bx + c = 0\nSolutions: x = (-b ± √(b²-4ac)) / 2a',
      summary: 'Notes about quadratic equations and their solutions',
      language: 'English',
      scanDate: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Hindi Literature',
      type: 'pdf',
      url: '/placeholder-pdf.pdf',
      extractedText: 'हिंदी साहित्य का इतिहास...',
      summary: 'Overview of Hindi literature history',
      language: 'Hindi',
      scanDate: '2024-01-14T15:20:00Z'
    }
  ]);
  
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<ScannedDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      setIsScanning(true);
      
      // Simulate OCR processing
      setTimeout(() => {
        const newDoc: ScannedDocument = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type.includes('pdf') ? 'pdf' : 'image',
          url: URL.createObjectURL(file),
          extractedText: 'Extracted text will appear here after OCR processing...',
          summary: 'AI-generated summary will be available after processing',
          language: 'Auto-detected',
          scanDate: new Date().toISOString()
        };
        
        setScannedDocs(prev => [newDoc, ...prev]);
        setIsScanning(false);
      }, 3000);
    });
  };

  const handleCameraCapture = () => {
    setIsScanning(true);
    // Simulate camera capture and OCR
    setTimeout(() => {
      const newDoc: ScannedDocument = {
        id: Date.now().toString(),
        name: 'Camera Capture',
        type: 'image',
        url: '/placeholder-capture.jpg',
        extractedText: 'Camera captured text will appear here...',
        summary: 'Summary of captured document',
        language: 'Auto-detected',
        scanDate: new Date().toISOString()
      };
      
      setScannedDocs(prev => [newDoc, ...prev]);
      setIsScanning(false);
    }, 3000);
  };

  const deleteDocument = (id: string) => {
    setScannedDocs(prev => prev.filter(doc => doc.id !== id));
    if (selectedDoc?.id === id) {
      setSelectedDoc(null);
    }
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Documents List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Upload Area */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Scan & Upload</h2>
          
          <div className="space-y-3">
            <button
              onClick={handleCameraCapture}
              disabled={isScanning}
              className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-teal-300 rounded-xl hover:border-teal-400 hover:bg-teal-50 transition-colors"
            >
              <CameraIcon className="w-6 h-6 text-teal-600" />
              <span className="text-teal-700 font-medium">
                {isScanning ? 'Scanning...' : 'Scan with Camera'}
              </span>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              <ArrowUpTrayIcon className="w-6 h-6 text-gray-600" />
              <span className="text-gray-700 font-medium">Upload Files</span>
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          
          {isScanning && (
            <div className="mt-4 p-3 bg-teal-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                <span className="text-sm text-teal-700">Processing with OCR...</span>
              </div>
            </div>
          )}
        </div>

        {/* Documents List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Recent Documents ({scannedDocs.length})
          </h3>
          
          <div className="space-y-3">
            {scannedDocs.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedDoc?.id === doc.id
                    ? 'border-teal-300 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedDoc(doc)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <DocumentTextIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{doc.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{doc.language}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(doc.scanDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDoc(doc);
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <EyeIcon className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDocument(doc.id);
                      }}
                      className="p-1 hover:bg-red-100 rounded"
                    >
                      <TrashIcon className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {scannedDocs.length === 0 && !isScanning && (
              <div className="text-center py-8">
                <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No documents scanned yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Upload or scan your first document to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Viewer */}
      <div className="flex-1 flex flex-col">
        {selectedDoc ? (
          <>
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedDoc.name}</h2>
                  <p className="text-sm text-gray-600">
                    Scanned on {new Date(selectedDoc.scanDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors">
                    <SparklesIcon className="w-4 h-4" />
                    <span>AI Summary</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <LanguageIcon className="w-4 h-4" />
                    <span>Translate</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* AI Summary */}
              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <SparklesIcon className="w-5 h-5 text-teal-500" />
                  <span>AI-Generated Summary</span>
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedDoc.summary}
                </p>
              </div>

              {/* Extracted Text */}
              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <MagnifyingGlassIcon className="w-5 h-5 text-teal-500" />
                  <span>Extracted Text</span>
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-gray-700 text-sm whitespace-pre-wrap font-mono">
                    {selectedDoc.extractedText}
                  </pre>
                </div>
              </div>

              {/* Document Preview */}
              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Original Document</h3>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  {selectedDoc.type === 'image' ? (
                    <div className="text-center">
                      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">Image Preview</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">PDF Preview</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Document Selected</h3>
              <p className="text-gray-600">
                Select a document from the sidebar or scan a new one to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
