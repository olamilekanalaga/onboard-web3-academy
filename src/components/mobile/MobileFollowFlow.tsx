
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { 
  MessageCircle, 
  Twitter, 
  ExternalLink, 
  CheckCircle, 
  ArrowRight,
  Users,
  HelpCircle,
  Sparkles
} from "lucide-react";

interface MobileFollowFlowProps {
  onComplete: () => void;
}

const MobileFollowFlow: React.FC<MobileFollowFlowProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [telegramFollowed, setTelegramFollowed] = useState(false);
  const [twitterFollowed, setTwitterFollowed] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Updated with correct social links
  const telegramUrl = "https://t.me/+Kft2cP_KReQ5ZWU0";
  const twitterUrl = "https://x.com/Ola_crrypt";

  const handleTelegramFollow = () => {
    window.open(telegramUrl, '_blank');
    setTelegramFollowed(true);
  };

  const handleTwitterFollow = () => {
    window.open(twitterUrl, '_blank');
    setTwitterFollowed(true);
  };

  const canContinue = telegramFollowed && twitterFollowed;

  const handleComplete = async () => {
    if (!user || !canContinue) return;

    setIsCompleting(true);
    try {
      console.log('Completing follow flow for user:', user.id);
      onComplete();
    } catch (error) {
      console.error('Error completing follow flow:', error);
      // Continue anyway to not block user
      onComplete();
    } finally {
      setIsCompleting(false);
    }
  };

  // Skip button for users who have already joined (debug purposes)
  const handleSkip = () => {
    console.log('Skipping follow flow (debug)');
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-16 h-16 bg-purple-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-yellow-500/20 rounded-full blur-xl animate-bounce"></div>
        
        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col p-4">
        {/* Header */}
        <div className="text-center pt-12 pb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Join Our Community First! 🎉
          </h1>
          <p className="text-blue-200 text-lg px-4">
            Before starting this course, join our community for support and updates!
          </p>
        </div>

        {/* Follow Cards */}
        <div className="flex-1 space-y-4">
          {/* Telegram Follow */}
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Join Telegram Group
                  </h3>
                  <p className="text-blue-200 text-sm">
                    Get instant support and connect with learners
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Users className="w-3 h-3 text-blue-300" />
                    <span className="text-blue-300 text-xs">Active community</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {telegramFollowed ? (
                    <div className="flex items-center space-x-1 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Done!</span>
                    </div>
                  ) : (
                    <Button
                      onClick={handleTelegramFollow}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Join
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Twitter/X Follow */}
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <Twitter className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Follow on X
                  </h3>
                  <p className="text-blue-200 text-sm">
                    Stay updated with Web3 news and tips
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <HelpCircle className="w-3 h-3 text-blue-300" />
                    <span className="text-blue-300 text-xs">Latest insights</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {twitterFollowed ? (
                    <div className="flex items-center space-x-1 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Done!</span>
                    </div>
                  ) : (
                    <Button
                      onClick={handleTwitterFollow}
                      size="sm"
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Follow
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-400/20">
            <CardContent className="p-4">
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-emerald-400" />
                What you'll get:
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-blue-200 text-sm">24/7 support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-blue-200 text-sm">Web3 updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-blue-200 text-sm">Expert Q&A</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-blue-200 text-sm">Resources</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Button */}
        <div className="pt-6 pb-8 space-y-3">
          <Button
            onClick={handleComplete}
            disabled={!canContinue || isCompleting}
            className={`w-full py-4 text-lg font-semibold transition-all duration-300 ${
              canContinue && !isCompleting
                ? 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isCompleting ? (
              <span>Completing...</span>
            ) : canContinue ? (
              <>
                <span>Continue to Course</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                <span>Follow both accounts to continue</span>
              </>
            )}
          </Button>
          
          {/* Debug skip button */}
          <Button
            onClick={handleSkip}
            variant="outline"
            className="w-full text-white border-white/20 hover:bg-white/10"
          >
            Skip (Already Joined)
          </Button>
          
          {!canContinue && (
            <p className="text-blue-300 text-sm mt-2 text-center">
              Please follow both Telegram and X accounts to access the course
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileFollowFlow;
