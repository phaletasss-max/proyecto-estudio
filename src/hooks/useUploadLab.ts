import { useState } from 'react';
import { supabase, isDemoModeEnabled, isSupabaseConfigured } from '@/lib/supabase';
import type { LabFormData } from '@/types/ctf';

export function useUploadLab() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const uploadLab = async (formData: LabFormData) => {
    setUploading(true);
    setError(null);
    setSuccess(false);

    if (formData.zipFile) {
      const allowedTypes = new Set(['application/zip', 'application/x-zip-compressed', 'application/octet-stream']);
      if (!formData.zipFile.name.toLowerCase().endsWith('.zip') || !allowedTypes.has(formData.zipFile.type || 'application/octet-stream')) {
        setError('Solo se permiten archivos ZIP válidos.');
        setUploading(false);
        return;
      }
      if (formData.zipFile.size > 25 * 1024 * 1024) {
        setError('El archivo supera el límite de 25 MB.');
        setUploading(false);
        return;
      }
    }

    if (!isSupabaseConfigured() && isDemoModeEnabled()) {
      // Demo mode - simulate upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setUploading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      setError('Supabase no está configurado; no se puede publicar el reto.');
      setUploading(false);
      return;
    }

    try {
      // 1. Upload ZIP if provided
      let zipPath: string | null = null;
      if (formData.zipFile) {
        const fileName = `${formData.slug}/${crypto.randomUUID()}.zip`;
        const { error: uploadError } = await supabase.storage
          .from('ctf-zips')
          .upload(fileName, formData.zipFile, { contentType: 'application/zip', upsert: false });

        if (uploadError) throw uploadError;
        zipPath = fileName;
      }

      // 2. The RPC hashes the flag and saves the writeup in a private table.
      // Only accounts marked as admin in Supabase may create a challenge.
      const { error: insertError } = await supabase.rpc('create_challenge', {
        p_title: formData.title,
        p_slug: formData.slug,
        p_difficulty: formData.difficulty,
        p_category: formData.category,
        p_description: formData.description,
        p_flag: formData.flag,
        p_writeup_markdown: formData.writeup_markdown,
        p_zip_url: zipPath,
        p_is_admission_challenge: formData.isAdmissionChallenge || false,
        p_is_members_only: formData.isMembersOnly ?? true,
      });

      if (insertError) throw insertError;
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir el lab');
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return { uploadLab, uploading, error, success, reset };
}
