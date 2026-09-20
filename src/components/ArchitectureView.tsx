import React from 'react';
import { Database, ShieldCheck, HardDrive, Key, User, Video, Layers, CheckCircle2 } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
      {/* Overview Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600 font-bold text-lg">
            YT
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              YouTube Platform Backend Architecture
            </h2>
            <p className="text-xs text-slate-500">
              Spring Boot 3 REST API microservice with stateless JWT security, PostgreSQL persistence, and dual storage.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-slate-600">Spring Boot 3.2.4 (Java 17)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-slate-600">PostgreSQL + Flyway</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-slate-600">Spring Security + JWT & OAuth2</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-slate-600">Cloudinary & Local Storage</span>
          </div>
        </div>
      </div>

      {/* Architecture Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Module 1: Auth & Security */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Authentication & RBAC
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Stateless authentication with HMAC-SHA256 JWTs and database-backed refresh tokens.
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 flex-1">
            <li className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              <span><code>/api/v1/auth/register</code> - BCrypt salted hash</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              <span><code>/api/v1/auth/login</code> - Generates Access/Refresh</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              <span><code>/api/v1/auth/refresh</code> - Token rotation</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              <span>Google OAuth2 Login integration</span>
            </li>
          </ul>
        </div>

        {/* Module 2: Channels */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
            <Video className="w-4 h-4 text-rose-600" />
            Channel Management
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Creator channels with unique handles, metadata, subscriber counters, and media banners.
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 flex-1">
            <li className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>1-to-1 User Account to Channel relation</span>
            </li>
            <li className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Unique handles (e.g. <code>@techwithameen</code>)</span>
            </li>
            <li className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Avatar & Banner upload endpoints</span>
            </li>
            <li className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Public query by ID or Handle</span>
            </li>
          </ul>
        </div>

        {/* Module 3: Storage Service */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
            <HardDrive className="w-4 h-4 text-amber-600" />
            Storage Abstraction
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Pluggable storage engine selected dynamically via <code>app.storage.type</code>.
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 flex-1">
            <li className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span><code>StorageService</code> unified interface</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span><code>LocalStorageService</code> for local/dev</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span><code>CloudinaryStorageService</code> for CDN</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Multipart file streaming up to 50MB</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Database Schema Visualizer */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-3">
          <Database className="w-4 h-4 text-blue-600" />
          PostgreSQL Database Schema (`V1__init.sql`)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Table: user_accounts */}
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
            <div className="font-mono text-xs font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">
              user_accounts
            </div>
            <div className="font-mono text-[11px] space-y-1 text-slate-600">
              <div><span className="text-amber-600 font-semibold">PK</span> id: BIGSERIAL</div>
              <div><span className="text-blue-600 font-semibold">UQ</span> email: VARCHAR(255)</div>
              <div>password: VARCHAR(255)</div>
              <div>full_name: VARCHAR(255)</div>
              <div>avatar_url: VARCHAR(512)</div>
              <div>role: VARCHAR(50)</div>
              <div>provider: VARCHAR(50)</div>
              <div>provider_id: VARCHAR(255)</div>
              <div>created_at: TIMESTAMP</div>
              <div>updated_at: TIMESTAMP</div>
            </div>
          </div>

          {/* Table: refresh_tokens */}
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
            <div className="font-mono text-xs font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">
              refresh_tokens
            </div>
            <div className="font-mono text-[11px] space-y-1 text-slate-600">
              <div><span className="text-amber-600 font-semibold">PK</span> id: BIGSERIAL</div>
              <div><span className="text-blue-600 font-semibold">UQ</span> token: VARCHAR(512)</div>
              <div><span className="text-purple-600 font-semibold">FK</span> user_id: BIGINT</div>
              <div>expiry_date: TIMESTAMP</div>
              <div>revoked: BOOLEAN</div>
              <div>created_at: TIMESTAMP</div>
            </div>
          </div>

          {/* Table: channels */}
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
            <div className="font-mono text-xs font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">
              channels
            </div>
            <div className="font-mono text-[11px] space-y-1 text-slate-600">
              <div><span className="text-amber-600 font-semibold">PK</span> id: BIGSERIAL</div>
              <div><span className="text-purple-600 font-semibold">FK</span> user_id: BIGINT (UQ)</div>
              <div><span className="text-blue-600 font-semibold">UQ</span> handle: VARCHAR(100)</div>
              <div>name: VARCHAR(150)</div>
              <div>description: TEXT</div>
              <div>avatar_url: VARCHAR(512)</div>
              <div>banner_url: VARCHAR(512)</div>
              <div>subscriber_count: BIGINT</div>
              <div>video_count: INT</div>
              <div>created_at: TIMESTAMP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
