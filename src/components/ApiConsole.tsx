import React, { useState } from 'react';
import { Send, Play, Check, AlertCircle, Lock, Globe } from 'lucide-react';

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  authRequired: boolean;
  description: string;
  defaultPayload?: string;
  sampleResponse?: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    method: 'POST',
    path: '/api/v1/auth/register',
    authRequired: false,
    description: 'Registers a new user account with email, password, and full name.',
    defaultPayload: JSON.stringify(
      {
        email: 'creator@example.com',
        password: 'Password123!',
        fullName: 'Ameen Creator'
      },
      null,
      2
    ),
    sampleResponse: JSON.stringify(
      {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: '4d8f8a12-87a3-4567-b891-123456789abc',
        tokenType: 'Bearer',
        expiresIn: 900,
        userId: 1,
        email: 'creator@example.com',
        fullName: 'Ameen Creator',
        role: 'ROLE_USER'
      },
      null,
      2
    )
  },
  {
    method: 'POST',
    path: '/api/v1/auth/login',
    authRequired: false,
    description: 'Authenticates with email & password, returns JWT Access & Refresh tokens.',
    defaultPayload: JSON.stringify(
      {
        email: 'creator@example.com',
        password: 'Password123!'
      },
      null,
      2
    ),
    sampleResponse: JSON.stringify(
      {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: '4d8f8a12-87a3-4567-b891-123456789abc',
        tokenType: 'Bearer',
        expiresIn: 900,
        userId: 1,
        email: 'creator@example.com',
        fullName: 'Ameen Creator',
        role: 'ROLE_USER'
      },
      null,
      2
    )
  },
  {
    method: 'POST',
    path: '/api/v1/auth/refresh',
    authRequired: false,
    description: 'Rotates expired JWT access token using a valid database-stored refresh token.',
    defaultPayload: JSON.stringify(
      {
        refreshToken: '4d8f8a12-87a3-4567-b891-123456789abc'
      },
      null,
      2
    ),
    sampleResponse: JSON.stringify(
      {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new...',
        refreshToken: '4d8f8a12-87a3-4567-b891-123456789abc',
        tokenType: 'Bearer',
        expiresIn: 900,
        userId: 1,
        email: 'creator@example.com',
        fullName: 'Ameen Creator',
        role: 'ROLE_USER'
      },
      null,
      2
    )
  },
  {
    method: 'GET',
    path: '/api/v1/auth/me',
    authRequired: true,
    description: 'Fetches the authenticated user profile with password field omitted.',
    sampleResponse: JSON.stringify(
      {
        id: 1,
        email: 'creator@example.com',
        fullName: 'Ameen Creator',
        avatarUrl: null,
        role: 'ROLE_USER',
        provider: 'LOCAL',
        createdAt: '2026-09-20T08:30:00Z',
        updatedAt: '2026-09-20T08:30:00Z'
      },
      null,
      2
    )
  },
  {
    method: 'POST',
    path: '/api/v1/channels',
    authRequired: true,
    description: 'Creates a creator channel with unique handle and profile details.',
    defaultPayload: JSON.stringify(
      {
        handle: 'techwithameen',
        name: 'Tech With Ameen',
        description: 'Software engineering, system design, and coding tutorials.',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200'
      },
      null,
      2
    ),
    sampleResponse: JSON.stringify(
      {
        id: 1,
        userId: 1,
        handle: 'techwithameen',
        name: 'Tech With Ameen',
        description: 'Software engineering, system design, and coding tutorials.',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
        subscriberCount: 0,
        videoCount: 0,
        createdAt: '2026-09-20T08:32:00Z',
        updatedAt: '2026-09-20T08:32:00Z'
      },
      null,
      2
    )
  },
  {
    method: 'GET',
    path: '/api/v1/channels/my',
    authRequired: true,
    description: 'Retrieves current user channel details.',
    sampleResponse: JSON.stringify(
      {
        id: 1,
        userId: 1,
        handle: 'techwithameen',
        name: 'Tech With Ameen',
        description: 'Software engineering, system design, and coding tutorials.',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
        subscriberCount: 1420,
        videoCount: 24,
        createdAt: '2026-09-20T08:32:00Z',
        updatedAt: '2026-09-20T08:32:00Z'
      },
      null,
      2
    )
  },
  {
    method: 'GET',
    path: '/api/v1/channels/handle/techwithameen',
    authRequired: false,
    description: 'Public query to fetch any channel by its unique handle.',
    sampleResponse: JSON.stringify(
      {
        id: 1,
        userId: 1,
        handle: 'techwithameen',
        name: 'Tech With Ameen',
        description: 'Software engineering, system design, and coding tutorials.',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
        subscriberCount: 1420,
        videoCount: 24,
        createdAt: '2026-09-20T08:32:00Z',
        updatedAt: '2026-09-20T08:32:00Z'
      },
      null,
      2
    )
  }
];

export const ApiConsole: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState(selectedEndpoint.defaultPayload || '');
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectEndpoint = (ep: Endpoint) => {
    setSelectedEndpoint(ep);
    setRequestBody(ep.defaultPayload || '');
    setResponseOutput(null);
    setStatus(null);
  };

  const handleSendRequest = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus(selectedEndpoint.method === 'POST' ? 201 : 200);
      setResponseOutput(selectedEndpoint.sampleResponse || '{"status": "ok"}');
      setLoading(false);
    }, 400);
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'POST':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'GET':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PUT':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'DELETE':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-slate-50">
      {/* Endpoints Sidebar */}
      <div className="w-full md:w-80 border-r border-slate-200 bg-white overflow-y-auto p-3 shrink-0">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 py-1.5 mb-1">
          Backend API Endpoints
        </div>
        <div className="space-y-1">
          {ENDPOINTS.map((ep, idx) => {
            const isSelected = selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method;
            return (
              <button
                key={idx}
                id={`ep-${ep.method}-${idx}`}
                onClick={() => handleSelectEndpoint(ep)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-blue-50 border-blue-200 shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${getMethodBadge(
                      ep.method
                    )}`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-700 truncate">
                    {ep.path}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">{ep.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Runner Console */}
      <div className="flex-1 flex flex-col p-5 overflow-y-auto space-y-4">
        {/* Endpoint Heading */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded border uppercase ${getMethodBadge(
                  selectedEndpoint.method
                )}`}
              >
                {selectedEndpoint.method}
              </span>
              <span className="font-mono text-sm font-bold text-slate-800">
                {selectedEndpoint.path}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {selectedEndpoint.authRequired ? (
                <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <Lock className="w-3 h-3" />
                  <span>Bearer JWT Required</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <Globe className="w-3 h-3" />
                  <span>Public Endpoint</span>
                </span>
              )}

              <button
                id="send-request-btn"
                onClick={handleSendRequest}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                {loading ? <Play className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Send Request</span>
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-2">{selectedEndpoint.description}</p>
        </div>

        {/* Request & Response Panes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
          {/* Request Payload */}
          <div className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
              Request Payload (JSON)
            </div>
            <div className="flex-1 p-3 bg-[#0d1117]">
              <textarea
                value={requestBody}
                onChange={e => setRequestBody(e.target.value)}
                placeholder="No request body required for this method"
                className="w-full h-full min-h-[220px] bg-transparent text-slate-200 font-mono text-xs focus:outline-hidden resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Response Pane */}
          <div className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Response</span>
              {status && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    status >= 200 && status < 300
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  Status: {status} OK
                </span>
              )}
            </div>
            <div className="flex-1 p-3 bg-[#0d1117] text-slate-200 font-mono text-xs overflow-auto">
              {responseOutput ? (
                <pre className="whitespace-pre-wrap">{responseOutput}</pre>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 italic text-xs min-h-[220px]">
                  Click "Send Request" to test this Spring Boot endpoint
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
