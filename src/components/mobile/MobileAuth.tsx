
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, ArrowLeft, Sparkles, Shield, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import FollowFlow from "@/components/FollowFlow";
import { useNavigate } from "react-router-dom";

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const resetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type AuthMode = 'signin' | 'signup' | 'reset';

const MobileAuth = () => {
  const [activeTab, setActiveTab] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, resetPassword, loading, showFollowFlow, setShowFollowFlow } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const signInForm = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" }
  });

  const signUpForm = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", fullName: "", username: "" }
  });

  const resetForm = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "" }
  });

  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    console.log('Mobile sign in attempt:', values.email);
    const { error } = await signIn(values.email, values.password);
    if (error) {
      console.error('Mobile sign in error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      console.log('Mobile sign in success');
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate('/mobile/home', { replace: true });
    }
  };

  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    const { error } = await signUp(values.email, values.password, {
      full_name: values.fullName,
      username: values.username,
    });
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created!",
        description: "Welcome to Web3 Academy! Let's get you connected.",
      });
      setShowFollowFlow(true);
    }
  };

  const handleFollowFlowComplete = () => {
    setShowFollowFlow(false);
    navigate('/mobile/home', { replace: true });
  };

  const handleReset = async (values: z.infer<typeof resetSchema>) => {
    const { error } = await resetPassword(values.email);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Password reset email sent! Check your inbox.",
      });
      setActiveTab('signin');
    }
  };

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

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Welcome to Onboard
              </CardTitle>
              <p className="text-blue-200">Your Web3 learning journey starts here</p>
            </CardHeader>
            <CardContent>
              {activeTab !== 'reset' ? (
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AuthMode)} className="w-full">
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
                        <div className="text-center">
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => setActiveTab('reset')}
                            className="text-purple-400 hover:text-purple-300"
                          >
                            Forgot Password?
                          </Button>
                        </div>
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
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Username</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Choose a username"
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
              ) : (
                <div className="mt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setActiveTab('signin')}
                    className="mb-4 text-white hover:bg-white/10"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Sign In
                  </Button>
                  <Form {...resetForm}>
                    <form onSubmit={resetForm.handleSubmit(handleReset)} className="space-y-4">
                      <FormField
                        control={resetForm.control}
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
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                            Sending Reset Email...
                          </>
                        ) : (
                          'Send Reset Email'
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              )}

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
  );
};

export default MobileAuth;
