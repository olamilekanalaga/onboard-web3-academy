
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
  const [currentImageUrl, setCurrentImageUrl] = useState(currentAvatarUrl);
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
      // Create file path with timestamp to ensure uniqueness: user_id/avatar_timestamp.extension
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${user.id}/avatar_${timestamp}.${fileExt}`;

      // Remove old avatar if it exists
      if (currentImageUrl) {
        try {
          // Extract the file path from the URL
          const oldFilePath = currentImageUrl.split('/').pop();
          if (oldFilePath && oldFilePath.includes('avatar_')) {
            await supabase.storage
              .from('avatars')
              .remove([`${user.id}/${oldFilePath}`]);
          }
        } catch (error) {
          console.warn('Failed to remove old avatar:', error);
          // Continue with upload even if removal fails
        }
      }

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: false, // Don't overwrite, use unique filename
          cacheControl: '3600',
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Add cache busting parameter to ensure fresh image load
      const cacheBustedUrl = `${publicUrl}?t=${timestamp}`;

      // Update profile with new avatar URL
      await updateProfileMutation.mutateAsync({
        avatar_url: cacheBustedUrl
      });

      // Update local state immediately
      setCurrentImageUrl(cacheBustedUrl);

      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload profile picture. Please try again.');
    } finally {
      setUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Use local state if available, fallback to prop
  const displayAvatarUrl = currentImageUrl || currentAvatarUrl;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative mb-2">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage 
            src={displayAvatarUrl || undefined} 
            alt="Profile picture"
            onError={() => {
              console.warn('Avatar image failed to load:', displayAvatarUrl);
              // Don't update state here to avoid infinite loops
            }}
          />
          <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-emerald-500 to-blue-600 text-white">
            {userInitials}
          </AvatarFallback>
        </Avatar>

        {showUploadButton && (
          <Button
            size="sm"
            variant="outline"
            className="absolute -bottom-4 -right-4 rounded-full p-2 h-8 w-8 bg-white shadow-lg border-2 border-gray-200"
            onClick={handleFileSelect}
            disabled={uploading}
          >
            <Camera className="h-4 w-4 text-gray-700" />
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
