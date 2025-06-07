import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, BookOpen, Users, Award, TrendingUp, Sparkles, Shield, Zap, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useCountries } from "@/hooks/useCountries";
import FollowFlow from "@/components/FollowFlow";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  countryId: z.string().min(1, "Please select your country"),
  phone: z.string().optional(),
});

const Auth = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, user, loading, showFollowFlow, setShowFollowFlow } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: countries } = useCountries();

  const from = location.state?.from?.pathname || "/courses";

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  const signInForm = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" }
  });

  const signUpForm = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", fullName: "", countryId: "", phone: "" }
  });

  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    const { error } = await signIn(values.email, values.password);
    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate(from, { replace: true });
    }
  };

  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    const selectedCountry = countries?.find(c => c.id.toString() === values.countryId);

    const { error } = await signUp(values.email, values.password, {
      full_name: values.fullName,
      country_id: parseInt(values.countryId),
      timezone: selectedCountry?.timezone,
      phone: values.phone,
    });
    if (error) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created!",
        description: "Welcome to Web3 Academy! Let's get you connected.",
      });
      // Show follow flow instead of switching to signin
      setShowFollowFlow(true);
    }
  };

  const handleFollowFlowComplete = () => {
    setShowFollowFlow(false);
    navigate(from, { replace: true });
  };

  const features = [
    { icon: BookOpen, title: "Expert-Led Courses", description: "Learn from industry professionals" },
    { icon: Users, title: "Community Learning", description: "Connect with fellow Web3 enthusiasts" },
    { icon: Award, title: "Earn Certificates", description: "Get recognized for your achievements" },
    { icon: TrendingUp, title: "Track Progress", description: "Monitor your learning journey" },
  ];

  const stats = [
    { value: "50,000+", label: "Active Learners" },
    { value: "100+", label: "Expert Courses" },
    { value: "95%", label: "Success Rate" },
    { value: "24/7", label: "Support" },
  ];

  // Show follow flow if user just signed up
  if (showFollowFlow) {
    return <FollowFlow onComplete={handleFollowFlowComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-blue-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-yellow-500/20 rounded-full blur-xl animate-bounce"></div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
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

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding and Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12">
          <div className="max-w-lg">
            {/* Logo and Title */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-3xl">🚀</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">Onboard</h1>
                  <p className="text-blue-200">Web3 Learning Academy</p>
                </div>
              </div>
              <p className="text-xl text-slate-300 leading-relaxed">
                Master blockchain technology, DeFi protocols, and smart contract development with our comprehensive Web3 education platform.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{feature.title}</h3>
                    <p className="text-blue-200 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Authentication Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:hidden">
                  <span className="text-3xl">🚀</span>
                </div>
                <CardTitle className="text-2xl font-bold text-white">
                  Welcome to Onboard
                </CardTitle>
                <p className="text-blue-200">Your Web3 learning journey starts here</p>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border border-white/20">
                    <TabsTrigger
                      value="signin"
                      className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                      className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="mt-6">
                    <Form {...signInForm}>
                      <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                        <FormField
                          control={signInForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Email</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="Enter your email"
                                  className="bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signInForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 pr-12"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                                  >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                              Signing In...
                            </>
                          ) : (
                            <>
                              <Shield className="mr-2 h-4 w-4" />
                              Sign In
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>

                  <TabsContent value="signup" className="mt-6">
                    <Form {...signUpForm}>
                      <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                        <FormField
                          control={signUpForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter your full name"
                                  className="bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Email</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="Enter your email"
                                  className="bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="countryId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Country</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-purple-400">
                                    <SelectValue placeholder="Select your country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                  {countries?.map((country) => (
                                    <SelectItem
                                      key={country.id}
                                      value={country.id.toString()}
                                      className="text-white hover:bg-slate-700"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <span>{country.flag_emoji}</span>
                                        <span>{country.name}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Phone Number (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="tel"
                                  placeholder="Enter your phone number"
                                  className="bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    className="bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 pr-12"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                                  >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                              Creating Account...
                            </>
                          ) : (
                            <>
                              <Zap className="mr-2 h-4 w-4" />
                              Create Account
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 text-center text-sm text-slate-400">
                  <p>
                    By continuing, you agree to our{" "}
                    <button className="text-purple-400 hover:text-purple-300 underline">
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button className="text-purple-400 hover:text-purple-300 underline">
                      Privacy Policy
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
