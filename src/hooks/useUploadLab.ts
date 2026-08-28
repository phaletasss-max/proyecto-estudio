import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { hashFlag } from '@/utils/crypto';
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
      // 1. Hash the flag
      const flagHash = await hashFlag(formData.flag);

      // 2. Upload ZIP if provided
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

      // 3. Insert lab record
      const { error: insertError } = await supabase.from('labs').insert({
        title: formData.title,
        slug: formData.slug,
        difficulty: formData.difficulty,
        category: formData.category,
        description: formData.description,
        zip_url: zipUrl,
        flag_hash: flagHash,
        writeup_markdown: formData.writeup_markdown,
        is_published: false, // Requires admin approval
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
