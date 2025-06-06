
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-8 pt-16 pb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Join Onboard
        </h1>
        <p className="text-blue-100 text-center text-lg">
          Start your Web3 journey today
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="pl-12 py-4 text-lg border-slate-300"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-12 py-4 text-lg border-slate-300"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-12 pr-12 py-4 text-lg border-slate-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-medium"
              size="lg"
            >
              Create Account
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-600">
            Already have an account?{" "}
            <button className="text-blue-600 font-medium">Sign In</button>
          </p>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>
            By signing up, you agree to our{" "}
            <button className="text-blue-600">Terms of Service</button> and{" "}
            <button className="text-blue-600">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileSignup;
