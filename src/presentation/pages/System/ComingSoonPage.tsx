import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/presentation/components/layout/AdminLayout';
import { Button } from '@/presentation/components/ui/Button';
import { Construction, ArrowLeft } from 'lucide-react';

export const ComingSoonPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const normalized = (location.pathname || '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');

  return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-4 border border-amber-200 shadow-sm">
          <Construction size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Halaman Sedang Dalam Pengembangan</h2>
        <p className="text-gray-500 max-w-md mb-6 text-body-sm">
          Menu ini mengarah ke rute{' '}
          <code className="bg-gray-100 text-primary-600 px-2 py-0.5 rounded font-mono text-caption font-semibold">
            /{normalized}
          </code>
          , namun komponen halaman untuk rute ini belum dibuat.
        </p>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/')}
          leftIcon={<ArrowLeft size={16} />}
        >
          Kembali ke Dashboard
        </Button>
      </div>
    </AdminLayout>
  );
};

export default ComingSoonPage;
