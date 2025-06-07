
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

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
  const [mode, setMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, resetPassword, loading } = useAuth();
  const { toast } = useToast();

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
    const { error } = await signIn(values.email, values.password);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
        title: "Success",
        description: "Check your email to confirm your account",
      });
    }
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
        description: "Password reset email sent",
      });
      setMode('signin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl backdrop-blur-sm bg-white/95">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-slate-900">
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'reset' && 'Reset Password'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mode === 'signin' && (
            <Form {...signInForm}>
              <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                <FormField
                  control={signInForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  Sign In
                </Button>
                <div className="text-center space-y-2">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode('reset')}
                    className="text-sm text-blue-600"
                  >
                    Forgot Password?
                  </Button>
                  <div className="text-sm text-slate-600">
                    Don't have an account?{' '}
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setMode('signup')}
                      className="text-blue-600 p-0 h-auto"
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          )}

          {mode === 'signup' && (
            <Form {...signUpForm}>
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                <FormField
                  control={signUpForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
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
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Choose a username" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  Create Account
                </Button>
                <div className="text-center">
                  <div className="text-sm text-slate-600">
                    Already have an account?{' '}
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setMode('signin')}
                      className="text-blue-600 p-0 h-auto"
                    >
                      Sign In
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          )}

          {mode === 'reset' && (
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(handleReset)} className="space-y-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setMode('signin')}
                  className="mb-4 p-0 h-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Button>
                <FormField
                  control={resetForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  Send Reset Email
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileAuth;
