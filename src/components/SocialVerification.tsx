
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Users, MessageCircle, Twitter, CheckCircle, Lock, X, AlertCircle } from "lucide-react";

interface SocialVerificationProps {
  onComplete: () => void;
  onCancel: () => void;
  courseName: string;
}

const SocialVerification: React.FC<SocialVerificationProps> = ({
  onComplete,
  onCancel,
  courseName
}) => {
  const [verifications, setVerifications] = useState({
    telegram_group: false,
    twitter_follow: false
  });

  const [linkClicks, setLinkClicks] = useState({
    telegram_group: false,
    twitter_follow: false
  });

  const [timeSpent, setTimeSpent] = useState({
    telegram_group: 0,
    twitter_follow: 0
  });

  // Track time spent on each platform
  useEffect(() => {
    const intervals: { [key: string]: NodeJS.Timeout } = {};

    Object.keys(linkClicks).forEach(platform => {
      if (linkClicks[platform as keyof typeof linkClicks]) {
        intervals[platform] = setInterval(() => {
          setTimeSpent(prev => ({
            ...prev,
            [platform]: prev[platform as keyof typeof prev] + 1
          }));
        }, 1000);
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [linkClicks]);

  const socialLinks = [
    {
      id: 'twitter_follow',
      title: 'Follow on X (Twitter)',
      description: 'Follow @Ola_crrypt for the latest Web3 insights and updates',
      icon: Twitter,
      url: 'https://x.com/Ola_crrypt',
      color: 'bg-black hover:bg-gray-800',
      textColor: 'text-white'
    },
    {
      id: 'telegram_group',
      title: 'Join Telegram Group',
      description: 'Connect with fellow learners and get support from the community',
      icon: Users,
      url: 'https://t.me/+Kft2cP_KReQ5ZWU0',
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white'
    }
  ];

  const handleVerificationChange = (id: string, checked: boolean) => {
    setVerifications(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const allVerified = Object.values(verifications).every(Boolean);

  const handleOpenLink = (url: string, platform: string) => {
    // Track that user clicked the link
    setLinkClicks(prev => ({
      ...prev,
      [platform]: true
    }));

    window.open(url, '_blank', 'noopener,noreferrer');

    // Show a toast or notification encouraging them to actually follow/join
    setTimeout(() => {
      if (!verifications[platform as keyof typeof verifications]) {
        // Could show a reminder here
      }
    }, 10000); // After 10 seconds
  };

  const canVerify = (platform: string) => {
    const clicked = linkClicks[platform as keyof typeof linkClicks];
    const timeOnPlatform = timeSpent[platform as keyof typeof timeSpent];

    // Require at least 5 seconds on the platform before allowing verification
    return clicked && timeOnPlatform >= 5;
  };

  const getVerificationStatus = (platform: string) => {
    const clicked = linkClicks[platform as keyof typeof linkClicks];
    const timeOnPlatform = timeSpent[platform as keyof typeof timeSpent];
    const verified = verifications[platform as keyof typeof verifications];

    if (verified) return 'verified';
    if (clicked && timeOnPlatform >= 5) return 'ready';
    if (clicked) return 'waiting';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center">
      <Card className="w-full md:max-w-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-2xl border-0 md:border">
        {/* Mobile handle */}
        <div className="md:hidden flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-slate-300 rounded-full"></div>
        </div>

        <CardHeader className="text-center pb-4 relative px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 md:top-4 md:right-4"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
            Join Our Community First!
          </CardTitle>
          <p className="text-slate-600 text-sm md:text-base">
            Before starting <strong>{courseName}</strong>, please join our community channels for the best learning experience.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Why join our community?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Get help from experienced traders</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Access exclusive learning resources</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Stay updated with market insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Connect with fellow learners</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Complete these steps:</h3>

            {socialLinks.map((link) => (
              <div key={link.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 ${link.color} rounded-lg flex items-center justify-center`}>
                    <link.icon className={`w-5 h-5 ${link.textColor}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{link.title}</h4>
                    <p className="text-sm text-slate-600 mb-3">{link.description}</p>

                    <div className="space-y-3">
                      <Button
                        onClick={() => handleOpenLink(link.url, link.id)}
                        className={`${link.color} ${link.textColor} w-full md:w-auto`}
                        size="sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {linkClicks[link.id as keyof typeof linkClicks] ? 'Visit Again' : 'Open Link'}
                      </Button>

                      {/* Verification Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getVerificationStatus(link.id) === 'verified' && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                          {getVerificationStatus(link.id) === 'ready' && (
                            <AlertCircle className="w-4 h-4 text-blue-600" />
                          )}
                          {getVerificationStatus(link.id) === 'waiting' && (
                            <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                          )}
                          <span className="text-xs text-slate-600">
                            {getVerificationStatus(link.id) === 'verified' && 'Verified!'}
                            {getVerificationStatus(link.id) === 'ready' && 'Ready to verify'}
                            {getVerificationStatus(link.id) === 'waiting' && `Wait ${Math.max(0, 5 - timeSpent[link.id as keyof typeof timeSpent])}s`}
                            {getVerificationStatus(link.id) === 'pending' && 'Click link first'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={link.id}
                            checked={verifications[link.id as keyof typeof verifications]}
                            disabled={!canVerify(link.id)}
                            onCheckedChange={(checked) =>
                              handleVerificationChange(link.id, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={link.id}
                            className={`text-sm cursor-pointer ${canVerify(link.id) ? 'text-slate-700' : 'text-slate-400'
                              }`}
                          >
                            Completed
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Progress</span>
              <Badge variant={allVerified ? "default" : "secondary"}>
                {Object.values(verifications).filter(Boolean).length} / {socialLinks.length}
              </Badge>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(Object.values(verifications).filter(Boolean).length / socialLinks.length) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="w-full md:flex-1 order-2 md:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={onComplete}
              disabled={!allVerified}
              className={`w-full md:flex-1 order-1 md:order-2 ${allVerified
                ? 'bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
                }`}
            >
              {allVerified ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Start Learning
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Complete All Steps ({Object.values(verifications).filter(Boolean).length}/{socialLinks.length})
                </>
              )}
            </Button>
          </div>

          {/* Note */}
          <div className="text-xs text-slate-500 text-center bg-slate-50 rounded-lg p-3">
            <strong>Note:</strong> This is a one-time verification. Once completed, you'll have access to all courses.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialVerification;
