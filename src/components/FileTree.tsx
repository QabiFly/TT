import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileCode, 
  FileText, 
  Settings, 
  Database, 
  ChevronRight, 
  ChevronDown,
  Server,
  Layers
} from 'lucide-react';
import { BackendFile } from '../data/backendFiles';

interface TreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  file?: BackendFile;
  children: { [key: string]: TreeNode };
}

interface FileTreeProps {
  files: BackendFile[];
  selectedFile: BackendFile | null;
  onSelectFile: (file: BackendFile) => void;
  searchQuery: string;
}

function buildTree(files: BackendFile[]): TreeNode {
  const root: TreeNode = {
    name: 'yt-platform-backend',
    path: 'yt-platform-backend',
    isFolder: true,
    children: {}
  };

  files.forEach(file => {
    const parts = file.path.split('/');
    // skip the top-level 'yt-platform-backend' if we want root as wrapper
    let current = root;
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;
      const currentPath = parts.slice(0, i + 1).join('/');

      if (!current.children[part]) {
        current.children[part] = {
          name: part,
          path: currentPath,
          isFolder: !isFile,
          file: isFile ? file : undefined,
          children: {}
        };
      }
      current = current.children[part];
    }
  });

  return root;
}

function getFileIcon(filename: string, ext: string) {
  if (filename === 'pom.xml') return <Settings className="w-4 h-4 text-orange-500" />;
  if (filename.includes('docker') || filename.includes('Dockerfile')) return <Server className="w-4 h-4 text-blue-500" />;
  if (filename.endsWith('.sql')) return <Database className="w-4 h-4 text-emerald-500" />;
  if (filename.endsWith('.yml') || filename.endsWith('.yaml')) return <Settings className="w-4 h-4 text-amber-500" />;
  if (filename.endsWith('.md')) return <FileText className="w-4 h-4 text-slate-400" />;
  if (ext === 'java') return <FileCode className="w-4 h-4 text-indigo-500" />;
  return <FileText className="w-4 h-4 text-slate-400" />;
}

export const FileTree: React.FC<FileTreeProps> = ({
  files,
  selectedFile,
  onSelectFile,
  searchQuery
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'yt-platform-backend': true,
    'yt-platform-backend/src': true,
    'yt-platform-backend/src/main': true,
    'yt-platform-backend/src/main/java': true,
    'yt-platform-backend/src/main/java/com': true,
    'yt-platform-backend/src/main/java/com/zikreameen': true,
    'yt-platform-backend/src/main/java/com/zikreameen/platform': true,
    'yt-platform-backend/src/main/java/com/zikreameen/platform/channel': true,
    'yt-platform-backend/src/main/java/com/zikreameen/platform/user': true,
    'yt-platform-backend/src/main/java/com/zikreameen/platform/security': true,
    'yt-platform-backend/src/main/resources': true,
    'yt-platform-backend/src/main/resources/db': true,
    'yt-platform-backend/src/main/resources/db/migration': true,
  });

  const toggleFolder = (path: string) => {
    setExpanded(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const filteredFiles = searchQuery.trim()
    ? files.filter(f => f.path.toLowerCase().includes(searchQuery.toLowerCase()))
    : null;

  if (filteredFiles) {
    return (
      <div className="py-2 text-sm">
        <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Search Results ({filteredFiles.length})
        </div>
        {filteredFiles.map(file => {
          const isSelected = selectedFile?.path === file.path;
          return (
            <button
              key={file.path}
              id={`file-search-${file.name}`}
              onClick={() => onSelectFile(file)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors rounded-md ${
                isSelected
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {getFileIcon(file.name, file.ext)}
              <span className="truncate">{file.path.replace('yt-platform-backend/', '')}</span>
            </button>
          );
        })}
      </div>
    );
  }

  const root = buildTree(files);

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = !!expanded[node.path];

    if (node.isFolder) {
      const childKeys = Object.keys(node.children).sort((a, b) => {
        const nodeA = node.children[a];
        const nodeB = node.children[b];
        if (nodeA.isFolder && !nodeB.isFolder) return -1;
        if (!nodeA.isFolder && nodeB.isFolder) return 1;
        return a.localeCompare(b);
      });

      return (
        <div key={node.path} className="select-none">
          <button
            id={`folder-btn-${node.name}`}
            onClick={() => toggleFolder(node.path)}
            className="w-full flex items-center gap-1.5 py-1 px-2 text-xs text-slate-700 hover:bg-slate-100 rounded transition-colors text-left"
            style={{ paddingLeft: `${Math.max(depth * 14 + 6, 6)}px` }}
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-amber-500 shrink-0" />
            )}
            <span className="truncate font-medium">{node.name}</span>
          </button>
          {isExpanded && (
            <div>
              {childKeys.map(childKey => renderNode(node.children[childKey], depth + 1))}
            </div>
          )}
        </div>
      );
    }

    const isSelected = selectedFile?.path === node.path;
    return (
      <button
        key={node.path}
        id={`file-btn-${node.name}`}
        onClick={() => node.file && onSelectFile(node.file)}
        className={`w-full flex items-center gap-2 py-1 px-2 text-xs rounded transition-colors text-left ${
          isSelected
            ? 'bg-blue-50 text-blue-700 font-medium'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
        style={{ paddingLeft: `${depth * 14 + 20}px` }}
      >
        {getFileIcon(node.name, node.file?.ext || '')}
        <span className="truncate">{node.name}</span>
      </button>
    );
  };

  return (
    <div className="py-2 overflow-y-auto max-h-[calc(100vh-140px)]">
      <div className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        <Layers className="w-3.5 h-3.5" />
        Backend Architecture Tree
      </div>
      {renderNode(root, 0)}
    </div>
  );
};
