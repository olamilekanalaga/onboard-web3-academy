import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  Video, 
  CheckCircle, 
  ArrowLeft,
  Sparkles,
  Globe
} from "lucide-react";
import { useAvailableSessions, useSessionTypes, useCreateBooking } from "@/hooks/useBookings";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";

const bookingSchema = z.object({
  sessionId: z.string().min(1, "Please select a session"),
  bookingNotes: z.string().optional(),
});

const BookSession = () => {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const { data: sessions, isLoading: sessionsLoading } = useAvailableSessions();
  const { data: sessionTypes } = useSessionTypes();
  const createBooking = useCreateBooking();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: { sessionId: "", bookingNotes: "" }
  });

  const handleBooking = async (values: z.infer<typeof bookingSchema>) => {
    try {
      await createBooking.mutateAsync({
        sessionId: values.sessionId,
        bookingNotes: values.bookingNotes,
        userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      
      toast({
        title: "Session Booked!",
        description: "Your session has been booked successfully. You'll receive a confirmation email shortly.",
      });
      
      navigate("/my-sessions");
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getSessionTypeInfo = (sessionTypeId: number) => {
    return sessionTypes?.find(type => type.id === sessionTypeId);
  };

  if (sessionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Sparkles className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-700 mb-2">Loading Sessions...</h2>
              <p className="text-slate-500">Finding available time slots for you</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Book a Session</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get personalized guidance from our Web3 experts. Choose from available time slots and book your session.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Available Sessions */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>Available Sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!sessions || sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No Sessions Available</h3>
                    <p className="text-slate-500">Check back later for new time slots.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session) => {
                      const sessionType = getSessionTypeInfo(session.session_type_id);
                      const isSelected = selectedSession === session.id;
                      
                      return (
                        <Card 
                          key={session.id}
                          className={`cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'ring-2 ring-blue-500 bg-blue-50' 
                              : 'hover:shadow-md hover:bg-slate-50'
                          }`}
                          onClick={() => {
                            setSelectedSession(session.id);
                            form.setValue('sessionId', session.id);
                          }}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                  <h3 className="text-lg font-semibold text-slate-900">
                                    {session.title || sessionType?.name}
                                  </h3>
                                  {isSelected && (
                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                  )}
                                </div>
                                
                                <p className="text-slate-600 mb-4">
                                  {session.description || sessionType?.description}
                                </p>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4 text-slate-500" />
                                    <span className="text-slate-700">
                                      {formatDateTime(session.start_time)}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-slate-500" />
                                    <span className="text-slate-700">
                                      {sessionType?.duration_minutes} minutes
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <DollarSign className="w-4 h-4 text-slate-500" />
                                    <span className="text-slate-700">
                                      ${sessionType?.price_usd}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <Video className="w-4 h-4 text-slate-500" />
                                    <span className="text-slate-700">Online Meeting</span>
                                  </div>
                                </div>
                              </div>
                              
                              <Badge 
                                variant={isSelected ? "default" : "secondary"}
                                className={isSelected ? "bg-blue-600" : ""}
                              >
                                {isSelected ? "Selected" : "Available"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <Card className="shadow-lg border-0 sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  <span>Book Your Session</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleBooking)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="bookingNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Tell us about your goals, specific topics you'd like to discuss, or any questions you have..."
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedSession && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <h4 className="font-semibold text-emerald-800 mb-2">Session Summary</h4>
                        {(() => {
                          const session = sessions?.find(s => s.id === selectedSession);
                          const sessionType = session ? getSessionTypeInfo(session.session_type_id) : null;
                          
                          return (
                            <div className="space-y-2 text-sm text-emerald-700">
                              <div className="flex justify-between">
                                <span>Type:</span>
                                <span className="font-medium">{sessionType?.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Duration:</span>
                                <span className="font-medium">{sessionType?.duration_minutes} min</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Price:</span>
                                <span className="font-medium">${sessionType?.price_usd}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Date:</span>
                                <span className="font-medium">
                                  {session ? formatDateTime(session.start_time) : ''}
                                </span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3"
                      disabled={!selectedSession || createBooking.isPending}
                    >
                      {createBooking.isPending ? (
                        <>
                          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                          Booking Session...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Book Session
                        </>
                      )}
                    </Button>

                    <div className="text-xs text-slate-500 text-center">
                      <p>
                        By booking, you agree to our{" "}
                        <button className="text-emerald-600 hover:underline">
                          Terms of Service
                        </button>{" "}
                        and{" "}
                        <button className="text-emerald-600 hover:underline">
                          Cancellation Policy
                        </button>
                      </p>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSession;
