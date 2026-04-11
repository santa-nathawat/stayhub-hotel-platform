import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import api from '../api/client';

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.put('/users/profile', {
        name,
        phone: phone || null,
        ...(newPassword ? { currentPassword, newPassword } : {}),
      });
      setMessage('Profile updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-apple-text mb-6">Profile</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-apple-border rounded-2xl p-6 space-y-5">
        {message && (
          <div className={`text-sm px-4 py-3 rounded-xl ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-apple-error'}`}>
            {message}
          </div>
        )}

        <Input id="email" type="email" label="Email" value={user?.email || ''} disabled />
        <Input id="name" label="Full Name" value={name} onChange={e => setName(e.target.value)} required />
        <Input id="phone" type="tel" label="Phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Optional" />

        <hr className="border-apple-border-light" />

        <h3 className="text-sm font-semibold text-apple-text">Change Password</h3>
        <Input
          id="currentPassword"
          type="password"
          label="Current Password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
        />
        <Input
          id="newPassword"
          type="password"
          label="New Password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder="At least 6 characters"
        />

        <Button type="submit" size="lg" className="w-full" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}
