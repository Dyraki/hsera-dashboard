import React, { useState } from 'react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';
import { useAuth } from '@/presentation/context/AuthContext';
import { useToast } from '@/presentation/context/ToastContext';
import { validatePassword, generateStrongPassword } from '@/core/utils/passwordSecurity';
import { PasswordStrengthMeter } from '@/presentation/components/form/PasswordStrengthMeter';
import { ChangePasswordPayload } from '../types';

interface ChangePasswordCardProps {
  changing: boolean;
  onChangePassword: (payload: ChangePasswordPayload) => Promise<boolean>;
}

export const ChangePasswordCard: React.FC<ChangePasswordCardProps> = ({
  changing,
  onChangePassword,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Live validation
  const validationResult = validatePassword(newPassword, user?.username);

  const handleGenerate = () => {
    const generated = generateStrongPassword(14);
    setNewPassword(generated);
    setConfirmPassword(generated);
    setShowNew(true);
    setShowConfirm(true);
    showToast('success', 'Password kuat acak (14 karakter) telah dibuat otomatis.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      showToast('error', 'Silakan masukkan kata sandi Anda saat ini.');
      return;
    }

    if (!newPassword) {
      showToast('error', 'Silakan masukkan kata sandi baru.');
      return;
    }

    if (newPassword === currentPassword) {
      showToast('error', 'Kata sandi baru tidak boleh sama dengan kata sandi saat ini.');
      return;
    }

    if (!validationResult.isValid) {
      showToast(
        'error',
        validationResult.errors[0] || 'Kata sandi baru belum memenuhi standar keamanan internasional.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('error', 'Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    const success = await onChangePassword({
      currentPassword,
      newPassword,
    });

    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock size={18} className="text-primary-600" />
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Ganti Kata Sandi Mandiri
          </h3>
        </div>
        <span className="text-xs text-slate-500 hidden sm:inline">
          Standar NIST SP 800-63B & OWASP ASVS 4.0
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Password Saat Ini */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Kata Sandi Saat Ini <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={16} />
            </div>
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Masukkan kata sandi lama Anda"
              required
              className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 transition"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
              title={showCurrent ? 'Sembunyikan' : 'Tampilkan'}
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Password Baru */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Kata Sandi Baru <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800 transition"
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>Buat Sandi Acak Kuat</span>
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={16} />
            </div>
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 8 karakter (kombinasi huruf besar, kecil, angka, simbol)"
              required
              className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 transition"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
              title={showNew ? 'Sembunyikan' : 'Tampilkan'}
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Konfirmasi Password Baru */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Konfirmasi Kata Sandi Baru <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={16} />
            </div>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi baru persis sama"
              required
              className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
              title={showConfirm ? 'Sembunyikan' : 'Tampilkan'}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Live Password Strength Meter */}
        {newPassword.length > 0 && (
          <div className="pt-2">
            <PasswordStrengthMeter
              result={validationResult}
              password={newPassword}
              confirmPassword={confirmPassword}
              showChecklist={true}
              onGeneratePassword={handleGenerate}
            />
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Sandi akan dienkripsi dengan standar Bcrypt 12 salt rounds.
          </span>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={changing}
            disabled={changing || (newPassword.length > 0 && !validationResult.isValid)}
            leftIcon={<ShieldCheck size={16} />}
            className="shadow-xs hover:shadow"
          >
            {changing ? 'Memperbarui Sandi...' : 'Simpan Kata Sandi Baru'}
          </Button>
        </div>
      </form>
    </div>
  );
};
