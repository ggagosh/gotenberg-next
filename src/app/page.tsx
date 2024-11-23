'use client';

import { useState } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Conversion failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted-${file.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error converting file:', error);
      alert('Failed to convert file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-2xl font-bold">Office File Converter</h1>

        <div className="flex flex-col items-center gap-4">
          <label
            className={`
              relative cursor-pointer rounded-lg border-2 border-dashed border-gray-300 
              p-8 hover:border-gray-400 transition-colors
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx"
              disabled={isLoading}
            />
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isLoading ? 'Converting...' : 'Click to upload office file'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: DOC, DOCX, XLS, XLSX, PPT, PPTX
              </p>
            </div>
          </label>
        </div>
      </main>
    </div>
  );
}
