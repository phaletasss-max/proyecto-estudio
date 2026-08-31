import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { LabFormData } from '@/types/ctf';

export function useUploadLab() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const uploadLab = async (formData: LabFormData) => {
    setUploading(true);
    setError(null);
    setSuccess(false);

    if (!isSupabaseConfigured()) {
      // Demo mode - simulate upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setUploading(false);
      return;
    }

    try {
      // 1. Upload ZIP if provided
      let zipUrl: string | null = null;
      if (formData.zipFile) {
        const fileName = `${formData.slug}_${Date.now()}.zip`;
        const { error: uploadError } = await supabase.storage
          .from('ctf-zips')
          .upload(fileName, formData.zipFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('ctf-zips')
          .getPublicUrl(fileName);

        zipUrl = urlData.publicUrl;
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
        p_zip_url: zipUrl,
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
