import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface FollowFlowProps {
  onComplete: () => void;
}

const FollowFlow: React.FC<FollowFlowProps> = ({ onComplete }) => {
  const [telegramFollowed, setTelegramFollowed] = useState(false);
  const [twitterFollowed, setTwitterFollowed] = useState(false);

  const telegramUrl = "https://t.me/onboardweb3academy"; // Update with your actual Telegram
  const twitterUrl = "https://x.com/onboardweb3"; // Update with your actual X/Twitter

  const handleTelegramFollow = () => {
    window.open(telegramUrl, '_blank');
    setTelegramFollowed(true);
  };

  const handleTwitterFollow = () => {
    window.open(twitterUrl, '_blank');
    setTwitterFollowed(true);
  };

  const canContinue = telegramFollowed && twitterFollowed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden flex items-center justify-center p-6">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-purple-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-yellow-500/20 rounded-full blur-xl animate-bounce"></div>

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
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

      <div className="relative z-10 w-full max-w-2xl">
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Welcome to Web3 Academy! 🎉
            </CardTitle>
            <p className="text-blue-200 text-lg">
              Join our community to get support, ask questions, and stay updated with the latest Web3 trends!
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Telegram Follow */}
            <Card className="bg-white/5 border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        Follow our Telegram
                      </h3>
                      <p className="text-blue-200 text-sm">
                        Get instant support, ask questions, and connect with other learners
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Users className="w-4 h-4 text-blue-300" />
                        <span className="text-blue-300 text-sm">Active community support</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center space-y-2">
                    {telegramFollowed ? (
                      <div className="flex items-center space-x-2 text-green-400">
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-medium">Followed!</span>
                      </div>
                    ) : (
                      <Button
                        onClick={handleTelegramFollow}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Follow Telegram
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Twitter/X Follow */}
            <Card className="bg-white/5 border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
                      <Twitter className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        Follow us on X (Twitter)
                      </h3>
                      <p className="text-blue-200 text-sm">
                        Stay updated with Web3 news, tips, and platform updates
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <HelpCircle className="w-4 h-4 text-blue-300" />
                        <span className="text-blue-300 text-sm">Latest Web3 insights</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center space-y-2">
                    {twitterFollowed ? (
                      <div className="flex items-center space-x-2 text-green-400">
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-medium">Followed!</span>
                      </div>
                    ) : (
                      <Button
                        onClick={handleTwitterFollow}
                        className="bg-black hover:bg-gray-800 text-white"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Follow on X
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-400/20">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-emerald-400" />
                  What you'll get:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-blue-200">24/7 community support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-blue-200">Latest Web3 updates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-blue-200">Expert Q&A sessions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-blue-200">Exclusive learning resources</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Continue Button */}
            <div className="text-center pt-4">
              <Button
                onClick={onComplete}
                disabled={!canContinue}
                className={`w-full py-4 text-lg font-semibold transition-all duration-300 ${canContinue
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {canContinue ? (
                  <>
                    <span>Continue to Academy</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  <>
                    <span>Follow both accounts to continue</span>
                  </>
                )}
              </Button>

              {!canContinue && (
                <p className="text-blue-300 text-sm mt-2">
                  Please follow both Telegram and X accounts to access the academy
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FollowFlow;
