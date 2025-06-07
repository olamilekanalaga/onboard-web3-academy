import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Users, MessageCircle, Twitter, CheckCircle, Lock } from "lucide-react";

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
    telegram_channel: false,
    twitter_follow: false
  });

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
    },
    {
      id: 'telegram_channel',
      title: 'Join Telegram Channel',
      description: 'Get exclusive updates, announcements, and learning resources',
      icon: MessageCircle,
      url: 'https://t.me/+0_OkfTcRVb0zMmQ0',
      color: 'bg-blue-600 hover:bg-blue-700',
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

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
            Join Our Community First!
          </CardTitle>
          <p className="text-slate-600">
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
                    
                    <div className="flex items-center justify-between">
                      <Button
                        onClick={() => handleOpenLink(link.url)}
                        className={`${link.color} ${link.textColor}`}
                        size="sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Link
                      </Button>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={link.id}
                          checked={verifications[link.id as keyof typeof verifications]}
                          onCheckedChange={(checked) => 
                            handleVerificationChange(link.id, checked as boolean)
                          }
                        />
                        <label 
                          htmlFor={link.id} 
                          className="text-sm text-slate-700 cursor-pointer"
                        >
                          I've completed this step
                        </label>
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
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={onComplete}
              disabled={!allVerified}
              className={`flex-1 ${
                allVerified 
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
                  Complete All Steps
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
