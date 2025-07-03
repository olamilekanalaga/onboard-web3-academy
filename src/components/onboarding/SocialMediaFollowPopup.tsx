import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  X, 
  Twitter, 
  MessageCircle, 
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Users,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SocialMediaRequirement {
  id: string;
  platform: string;
  username: string;
  url: string;
  description: string;
  is_required: boolean;
}

interface UserSocialFollow {
  platform: string;
  username: string;
  followed_at: string;
}

const SocialMediaFollowPopup: React.FC = () => {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState<SocialMediaRequirement[]>([]);
  const [userFollows, setUserFollows] = useState<UserSocialFollow[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dismissCount, setDismissCount] = useState(0);

  useEffect(() => {
    if (user) {
      checkSocialFollowStatus();
    }
  }, [user]);

  const checkSocialFollowStatus = async () => {
    if (!user) return;

    try {
      // Load social media requirements
      const { data: requirementsData } = await supabase
        .from('social_media_requirements')
        .select('*')
        .eq('is_active', true)
        .eq('is_required', true)
        .order('order_index');

      // Load user's follow status
      const { data: followsData } = await supabase
        .from('user_social_follows')
        .select('*')
        .eq('user_id', user.id);

      // Load onboarding status
      const { data: onboardingData } = await supabase
        .from('user_onboarding_status')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Use fallback data if database fails
      const socialRequirements = requirementsData || [
        {
          id: '1',
          platform: 'twitter',
          username: 'Ola_crrypt',
          url: 'https://x.com/Ola_crrypt',
          description: 'Follow @Ola_crrypt for the latest Web3 insights and updates',
          is_required: true
        },
        {
          id: '2',
          platform: 'telegram',
          username: 'Academia_Group',
          url: 'https://t.me/+Kft2cP_KReQ5ZWU0',
          description: 'Connect with fellow learners and get support from the community',
          is_required: true
        }
      ];

      setRequirements(socialRequirements);
      setUserFollows(followsData || []);

      // Show popup if not all requirements are met
      const requiredPlatforms = socialRequirements.map(r => r.platform);
      const followedPlatforms = followsData?.map(f => f.platform) || [];
      const allFollowed = requiredPlatforms.every(platform => 
        followedPlatforms.includes(platform)
      );

      // Show popup if:
      // 1. Not all required platforms are followed
      // 2. User hasn't dismissed it too many times (max 3)
      // 3. At least 1 hour has passed since last popup
      const dismissedTooManyTimes = (onboardingData?.social_popup_dismissed_count || 0) >= 3;
      const lastShown = onboardingData?.last_social_popup_shown;
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const canShowAgain = !lastShown || new Date(lastShown) < oneHourAgo;

      if (!allFollowed && !dismissedTooManyTimes && canShowAgain) {
        setShowPopup(true);
        setDismissCount(onboardingData?.social_popup_dismissed_count || 0);
      }

    } catch (error) {
      console.error('Error checking social follow status:', error);
    }
  };

  const handleFollowClick = async (requirement: SocialMediaRequirement) => {
    // Open social media link in new tab
    window.open(requirement.url, '_blank');

    // Mark as followed (user confirmation)
    try {
      await supabase
        .from('user_social_follows')
        .upsert({
          user_id: user?.id,
          platform: requirement.platform,
          username: requirement.username,
          followed_at: new Date().toISOString(),
          is_verified: false,
          verification_method: 'user_claimed'
        });

      // Update local state
      setUserFollows(prev => [
        ...prev.filter(f => f.platform !== requirement.platform),
        {
          platform: requirement.platform,
          username: requirement.username,
          followed_at: new Date().toISOString()
        }
      ]);

    } catch (error) {
      console.error('Error recording social follow:', error);
    }
  };

  const handleDismiss = async () => {
    try {
      // Update dismiss count and last shown time
      await supabase
        .from('user_onboarding_status')
        .upsert({
          user_id: user?.id,
          social_popup_dismissed_count: dismissCount + 1,
          last_social_popup_shown: new Date().toISOString()
        });

      setShowPopup(false);
    } catch (error) {
      console.error('Error updating onboarding status:', error);
      setShowPopup(false);
    }
  };

  const handleComplete = async () => {
    try {
      // Mark social follows as completed
      await supabase
        .from('user_onboarding_status')
        .upsert({
          user_id: user?.id,
          social_follows_completed: true
        });

      setShowPopup(false);
    } catch (error) {
      console.error('Error completing social follows:', error);
      setShowPopup(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      case 'telegram':
        return <MessageCircle className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  const isFollowed = (platform: string) => {
    return userFollows.some(f => f.platform === platform);
  };

  const allRequiredFollowed = requirements.every(req => isFollowed(req.platform));

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg mx-auto shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-yellow-500" />
              <CardTitle className="text-lg">Join Our Community</CardTitle>
            </div>
            {dismissCount < 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              Follow us to get started! 🚀
            </h3>
            <p className="text-gray-600 text-sm">
              Stay updated with the latest Web3 news, tips, and exclusive content. 
              Following our social media is required to access all course features.
            </p>
          </div>

          {dismissCount >= 2 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">
                  Required to Continue
                </span>
              </div>
              <p className="text-xs text-orange-700 mt-1">
                You must follow our social media accounts to access course content.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {requirements.map((requirement) => {
              const followed = isFollowed(requirement.platform);
              
              return (
                <div
                  key={requirement.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    followed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        followed ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {getPlatformIcon(requirement.platform)}
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm capitalize">
                          {requirement.platform}
                        </h4>
                        <p className="text-xs text-gray-600">
                          @{requirement.username}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {requirement.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {followed ? (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Followed
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleFollowClick(requirement)}
                          className="text-xs"
                        >
                          Follow
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex space-x-2 mt-6">
            {allRequiredFollowed ? (
              <Button onClick={handleComplete} className="flex-1">
                <CheckCircle className="w-4 h-4 mr-2" />
                Continue to Courses
              </Button>
            ) : (
              <>
                {dismissCount < 2 && (
                  <Button
                    variant="outline"
                    onClick={handleDismiss}
                    className="flex-1"
                  >
                    Remind Me Later
                  </Button>
                )}
                <Button disabled className="flex-1">
                  Follow All Required ({userFollows.length}/{requirements.length})
                </Button>
              </>
            )}
          </div>

          {dismissCount >= 1 && (
            <p className="text-xs text-center text-gray-500 mt-2">
              {dismissCount >= 2 
                ? "This is required to continue using Academia"
                : `You can dismiss this ${2 - dismissCount} more time${2 - dismissCount !== 1 ? 's' : ''}`
              }
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaFollowPopup;
