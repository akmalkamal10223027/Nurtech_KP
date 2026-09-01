import React, { useState, useEffect } from 'react';
import { PhoneCall, Save, MapPin, Plus, Trash2, Share2, Sparkles } from 'lucide-react';
import { api } from '../api';

export interface ContactPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ showToast }) => {
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState<{
    longitude: number;
    latitude: number;
    address: string;
    phones: string[];
    socialMedias: string[];
  }>({
    longitude: 106.827,
    latitude: -6.175,
    address: '',
    phones: [''],
    socialMedias: ['']
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const conRes = await api.getContact().catch(() => ({ data: {} }));
      if (conRes?.data) {
        const c0 = conRes.data.contact?.[0] || {};

        let parsedPhones: string[] = [];
        if (Array.isArray(c0.phones) && c0.phones.length > 0) {
          parsedPhones = c0.phones.map((p: any) => String(p));
        } else if (c0.phone) {
          parsedPhones = String(c0.phone).split('\n').map(s => s.trim()).filter(Boolean);
        }
        if (parsedPhones.length === 0) parsedPhones = [''];

        let parsedSocials: string[] = [];
        if (Array.isArray(c0.social_medias) && c0.social_medias.length > 0) {
          parsedSocials = c0.social_medias.map((s: any) => String(s));
        } else if (c0.social_media) {
          parsedSocials = String(c0.social_media).split('\n').map(s => s.trim()).filter(Boolean);
        }
        if (parsedSocials.length === 0) parsedSocials = [''];

        setContact({
          longitude: conRes.data.longitude || 106.827,
          latitude: conRes.data.Latitude || conRes.data.latitude || -6.175,
          address: c0.address || '',
          phones: parsedPhones,
          socialMedias: parsedSocials
        });
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat kontak & alamat', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (index: number, value: string) => {
    const updated = [...contact.phones];
    updated[index] = value;
    setContact({ ...contact, phones: updated });
  };

  const addPhoneInput = () => {
    setContact({ ...contact, phones: [...contact.phones, ''] });
  };

  const removePhoneInput = (index: number) => {
    if (contact.phones.length <= 1) {
      setContact({ ...contact, phones: [''] });
      return;
    }
    const updated = contact.phones.filter((_, i) => i !== index);
    setContact({ ...contact, phones: updated });
  };

  const handleSocialMediaChange = (index: number, value: string) => {
    const updated = [...contact.socialMedias];
    updated[index] = value;
    setContact({ ...contact, socialMedias: updated });
  };

  const addSocialMediaInput = () => {
    setContact({ ...contact, socialMedias: [...contact.socialMedias, ''] });
  };

  const removeSocialMediaInput = (index: number) => {
    if (contact.socialMedias.length <= 1) {
      setContact({ ...contact, socialMedias: [''] });
      return;
    }
    const updated = contact.socialMedias.filter((_, i) => i !== index);
    setContact({ ...contact, socialMedias: updated });
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validPhones = contact.phones.map(p => p.trim()).filter(Boolean);
      const validSocials = contact.socialMedias.map(s => s.trim()).filter(Boolean);

      await api.updateContact({
        longitude: parseFloat(String(contact.longitude)) || 0,
        latitude: parseFloat(String(contact.latitude)) || 0,
        contact: [
          {
            id: 1,
            address: contact.address,
            phone: validPhones.join('\n') || (contact.phones[0] || ''),
            phones: validPhones.length > 0 ? validPhones : [contact.phones[0] || ''],
            social_media: validSocials.join('\n') || (contact.socialMedias[0] || ''),
            social_medias: validSocials.length > 0 ? validSocials : [contact.socialMedias[0] || '']
          }
        ]
      });
      showToast('Kontak & Alamat berhasil disimpan!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan kontak', 'error');
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-slate-500">Memuat kontak & alamat...</div>;
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <form onSubmit={handleSaveContact} className="space-y-5">
        {/* 2-Column Side-by-Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* LEFT COLUMN: Alamat & Lokasi Map */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200/90 bg-white space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Alamat & Peta Lokasi</h4>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Alamat Lengkap Sekolah</label>
              <textarea
                rows={4}
                required
                value={contact.address}
                onChange={(e) => setContact({ ...contact, address: e.target.value })}
                placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Koordinat Peta (Google Maps)</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={contact.latitude}
                    onChange={(e) => setContact({ ...contact, latitude: parseFloat(e.target.value) || 0 })}
                    placeholder="-6.175"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={contact.longitude}
                    onChange={(e) => setContact({ ...contact, longitude: parseFloat(e.target.value) || 0 })}
                    placeholder="106.827"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Telepon & Sosial Media */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200/90 bg-white space-y-4 shadow-sm">
            {/* Telepon List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Telepon / WhatsApp
                  </label>
                </div>
                <button
                  type="button"
                  onClick={addPhoneInput}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition-colors px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Nomor</span>
                </button>
              </div>

              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {contact.phones.map((phoneItem, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      required={idx === 0}
                      value={phoneItem}
                      onChange={(e) => handlePhoneChange(idx, e.target.value)}
                      placeholder={`Nomor WA #${idx + 1} (cth: +62 812-3456-7890)`}
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                    {contact.phones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePhoneInput(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus nomor ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sosial Media List */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Sosial Media
                  </label>
                </div>
                <button
                  type="button"
                  onClick={addSocialMediaInput}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition-colors px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Akun</span>
                </button>
              </div>

              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {contact.socialMedias.map((socialItem, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={socialItem}
                      onChange={(e) => handleSocialMediaChange(idx, e.target.value)}
                      placeholder={`Medsos #${idx + 1} (cth: @nurtechschool)`}
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                    {contact.socialMedias.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSocialMediaInput(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus medsos ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/15 transition-all"
          >
            <Save className="w-4 h-4 text-white" />
            <span>Simpan Kontak & Alamat</span>
          </button>
        </div>
      </form>
    </div>
  );
};
