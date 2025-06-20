
import React, { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

interface ProfilePictureUploadProps {
  currentAvatarUrl?: string | null;
  userInitials: string;
  size?: 'sm' | 'md' | 'lg';
  showUploadButton?: boolean;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentAvatarUrl,
  userInitials,
  size = 'md',
  showUploadButton = true
}) => {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Create file path: user_id/avatar.extension
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true, // Replace existing file
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      await updateProfileMutation.mutateAsync({
        avatar_url: publicUrl
      });

      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={currentAvatarUrl || undefined} alt="Profile picture" />
          <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-emerald-500 to-blue-600 text-white">
            {userInitials}
          </AvatarFallback>
        </Avatar>

        {showUploadButton && (
          <Button
            size="sm"
            variant="outline"
            className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8"
            onClick={handleFileSelect}
            disabled={uploading}
          >
            <Camera className="h-3 w-3" />
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default ProfilePictureUpload;
