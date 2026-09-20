import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, ExternalLink } from 'lucide-react';
import { BackendFile } from '../data/backendFiles';

interface CodeViewerProps {
  file: BackendFile | null;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ file }) => {
  const [copied, setCopied] = useState(false);

  if (!file) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 border border-slate-200 rounded-xl">
        <FileCode className="w-12 h-12 text-slate-300 mb-3" />
        <h3 className="text-sm font-semibold text-slate-700">No file selected</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Select any Java class, SQL migration, or configuration file from the directory tree to inspect the extracted implementation.
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const lines = file.content.split('\n');

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* File Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="font-mono text-xs font-semibold text-slate-800 truncate">
            {file.path}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-medium shrink-0">
            {lines.length} lines • {formatFileSize(file.size)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="copy-file-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            id="download-file-btn"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="flex-1 overflow-auto bg-[#0d1117] text-slate-200 font-mono text-xs leading-relaxed p-4">
        <div className="grid grid-cols-[auto_1fr] gap-x-4 min-w-max">
          {/* Line Numbers */}
          <div className="select-none text-right text-slate-600 pr-2 border-r border-slate-800">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          {/* Code Lines */}
          <div className="whitespace-pre">
            {lines.map((line, i) => (
              <div key={i} className="hover:bg-slate-800/40 px-1 rounded transition-colors">
                {line || ' '}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
