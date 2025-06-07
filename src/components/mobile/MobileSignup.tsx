
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  Zap,
  Github,
  Chrome,
  Apple
} from "lucide-react";

interface MobileSignupProps {
  onComplete: () => void;
}

const MobileSignup = ({ onComplete }: MobileSignupProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the signup logic
    console.log("Signup data:", formData);
    onComplete();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-blue-500/20 rounded-full blur-lg animate-bounce"></div>
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

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="px-6 pt-16 pb-8 text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-3xl">🚀</span>
              </div>
            </div>

            {/* Orbiting elements */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Join Onboard
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-2">Start your Web3 journey</p>
          <p className="text-sm text-slate-400">Join 50,000+ learners mastering blockchain</p>
        </div>

        {/* Benefits */}
        <div className="px-6 mb-8">
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-300">Free Courses</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-xs text-slate-300">Certificates</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-xs text-slate-300">Job Ready</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 px-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl max-w-sm mx-auto">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-medium text-sm">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-12 py-4 text-white placeholder-slate-400 bg-white/10 border-white/20 rounded-xl backdrop-blur-sm focus:border-purple-400 focus:ring-purple-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium text-sm">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-12 py-4 text-white placeholder-slate-400 bg-white/10 border-white/20 rounded-xl backdrop-blur-sm focus:border-purple-400 focus:ring-purple-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium text-sm">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-12 pr-12 py-4 text-white placeholder-slate-400 bg-white/10 border-white/20 rounded-xl backdrop-blur-sm focus:border-purple-400 focus:ring-purple-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  size="lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create Account
                </Button>
              </div>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-slate-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl py-3"
                >
                  <Github className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl py-3"
                >
                  <Chrome className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl py-3"
                >
                  <Apple className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-slate-300 text-sm">
                Already have an account?{" "}
                <button className="text-purple-400 font-medium hover:text-purple-300 transition-colors">
                  Sign In
                </button>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400 max-w-sm mx-auto">
            <p>
              By signing up, you agree to our{" "}
              <button className="text-purple-400 hover:text-purple-300 transition-colors">Terms of Service</button> and{" "}
              <button className="text-purple-400 hover:text-purple-300 transition-colors">Privacy Policy</button>
            </p>
          </div>
        </div>

        <div className="pb-8"></div>
      </div>
    </div>
  );
};

export default MobileSignup;
