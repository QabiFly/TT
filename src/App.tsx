/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileCode, 
  Search, 
  Layers, 
  Terminal, 
  CheckCircle, 
  FolderCheck, 
  ExternalLink,
  BookOpen,
  Server
} from 'lucide-react';
import { BACKEND_FILES, BackendFile } from './data/backendFiles';
import { FileTree } from './components/FileTree';
import { CodeViewer } from './components/CodeViewer';
import { ArchitectureView } from './components/ArchitectureView';
import { ApiConsole } from './components/ApiConsole';

export default function App() {
  const [activeTab, setActiveTab] = useState<'code' | 'architecture' | 'api'>('code');
  const [selectedFile, setSelectedFile] = useState<BackendFile | null>(
    BACKEND_FILES.find(f => f.name === 'YtPlatformApplication.java') || BACKEND_FILES[0]
  );
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-900 antialiased font-sans">
      {/* Top Navbar */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 shadow-xs z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            YT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 leading-none">
                yt-platform-backend
              </h1>
              <span className="flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
                <FolderCheck className="w-3 h-3" />
                37 Files Extracted
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-none mt-1">
              Spring Boot 3 • PostgreSQL • Spring Security 6 • Docker & Flyway
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            id="tab-code-btn"
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'code'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Codebase Explorer</span>
          </button>
          <button
            id="tab-arch-btn"
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'architecture'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture & Schema</span>
          </button>
          <button
            id="tab-api-btn"
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'api'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>API Sandbox</span>
          </button>
        </div>

        {/* Status indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono text-[11px]">Consistent Directory Tree</span>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'code' && (
          <div className="flex-1 flex overflow-hidden p-3 gap-3">
            {/* Sidebar File Tree */}
            <aside className="w-72 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col shrink-0">
              {/* Search Bar */}
              <div className="p-2.5 border-b border-slate-200">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Tree View */}
              <div className="flex-1 overflow-hidden">
                <FileTree
                  files={BACKEND_FILES}
                  selectedFile={selectedFile}
                  onSelectFile={setSelectedFile}
                  searchQuery={searchQuery}
                />
              </div>

              {/* Bottom Quick Stats */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span>{BACKEND_FILES.length} Files on disk</span>
                <span className="font-mono text-[10px] text-slate-400">/yt-platform-backend</span>
              </div>
            </aside>

            {/* Code Viewer */}
            <CodeViewer file={selectedFile} />
          </div>
        )}

        {activeTab === 'architecture' && <ArchitectureView />}

        {activeTab === 'api' && <ApiConsole />}
      </main>
    </div>
  );
}
