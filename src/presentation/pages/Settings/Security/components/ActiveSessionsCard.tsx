import React from 'react';
import { ActiveSession } from '../types';
import { 
  Laptop, 
  Smartphone, 
  Globe, 
  LogOut, 
  Loader2, 
  RotateCw, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface ActiveSessionsCardProps {
  sessions: ActiveSession[];
  loading: boolean;
  revokingSessionId: string | null;
  revokingAll: boolean;
  onRefresh: () => void;
  onRevokeSession: (sessionId: string) => Promise<boolean>;
  onRevokeAllSessions: () => Promise<boolean>;
}

export const ActiveSessionsCard: React.FC<ActiveSessionsCardProps> = ({
  sessions,
  loading,
  revokingSessionId,
  revokingAll,
  onRefresh,
  onRevokeSession,
  onRevokeAllSessions,
}) => {
  // Parser user-agent sederhana
  const parseDevice = (userAgent?: string | null) => {
    if (!userAgent) return { label: 'Perangkat Tidak Diketahui', icon: Globe };

    const ua = userAgent.toLowerCase();
    const isMobile = ua.includes('mobile') || ua.includes('android') || ua.includes('iphone');
    const icon = isMobile ? Smartphone : Laptop;

    let browser = 'Browser Web';
    if (ua.includes('edg')) browser = 'Microsoft Edge';
    else if (ua.includes('chrome')) browser = 'Google Chrome';
    else if (ua.includes('safari')) browser = 'Apple Safari';
    else if (ua.includes('firefox')) browser = 'Mozilla Firefox';

    let os = 'Sistem';
    if (ua.includes('mac') || ua.includes('darwin')) os = 'macOS';
    else if (ua.includes('win')) os = 'Windows';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('iphone') || ua.includes('ios')) os = 'iOS';
    else if (ua.includes('linux')) os = 'Linux';

    return { label: `${browser} di ${os}`, icon };
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const otherSessions = sessions.filter((s) => !s.isCurrent);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Globe size={18} className="text-primary-600" />
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Sesi & Perangkat yang Sedang Masuk
          </h3>
          <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
            {sessions.length} Sesi
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition"
            title="Segarkan Sesi"
          >
            <RotateCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>

          {otherSessions.length > 0 && (
            <button
              type="button"
              onClick={onRevokeAllSessions}
              disabled={revokingAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition disabled:opacity-50"
            >
              {revokingAll ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <AlertTriangle size={13} />
              )}
              <span>Cabut Semua Sesi Lain</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {loading && sessions.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-slate-500">
            <Loader2 size={24} className="animate-spin mb-2 text-primary-600" />
            <p className="text-xs">Memeriksa daftar sesi aktif...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-sm">
            Tidak ada sesi aktif yang tercatat.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sessions.map((session) => {
              const { label, icon: DeviceIcon } = parseDevice(session.userAgent);
              const isRevoking = revokingSessionId === session.id;

              return (
                <div
                  key={session.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        session.isCurrent
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      <DeviceIcon size={20} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {label}
                        </span>
                        {session.isCurrent && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 size={11} className="text-emerald-600" />
                            Sesi Perangkat Ini
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-0.5">
                        <span className="font-mono">
                          IP: {session.ipAddress || '127.0.0.1'}
                        </span>
                        <span>•</span>
                        <span>Aktif sejak: {formatDate(session.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <button
                      type="button"
                      onClick={() => onRevokeSession(session.id)}
                      disabled={isRevoking}
                      className="self-end sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition disabled:opacity-50"
                    >
                      {isRevoking ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <LogOut size={13} />
                      )}
                      <span>Cabut Sesi</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
