import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Video, 
  Star,
  MessageSquare,
  X,
  CheckCircle,
  AlertCircle,
  Plus,
  Sparkles
} from "lucide-react";
import { useUserBookings, useCancelBooking, useUpdateBooking } from "@/hooks/useBookings";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";

const MySessions = () => {
  const { data: bookings, isLoading } = useUserBookings();
  const cancelBooking = useCancelBooking();
  const updateBooking = useUpdateBooking();
  const { toast } = useToast();
  const [feedbackRating, setFeedbackRating] = useState<{ [key: string]: number }>({});

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this session? This action cannot be undone.')) {
      try {
        await cancelBooking.mutateAsync(bookingId);
        toast({
          title: "Session Cancelled",
          description: "Your session has been cancelled successfully.",
        });
      } catch (error: any) {
        toast({
          title: "Cancellation Failed",
          description: error.message || "Failed to cancel session. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFeedback = async (bookingId: string, rating: number) => {
    try {
      await updateBooking.mutateAsync({
        bookingId,
        feedbackRating: rating,
      });
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error: any) {
      toast({
        title: "Feedback Failed",
        description: error.message || "Failed to submit feedback. Please try again.",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filterBookings = (status: string) => {
    if (!bookings) return [];
    if (status === 'all') return bookings;
    return bookings.filter(booking => booking.status === status);
  };

  const pendingBookings = filterBookings('pending');
  const confirmedBookings = filterBookings('confirmed');
  const completedBookings = filterBookings('completed');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Sparkles className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-700 mb-2">Loading Your Sessions...</h2>
              <p className="text-slate-500">Getting your booking information</p>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Sessions</h1>
            <p className="text-xl text-slate-600">
              Manage your booked sessions and view your learning history
            </p>
          </div>
          
          <Link to="/book-session">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Book New Session
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{pendingBookings.length}</div>
              <div className="text-sm text-slate-600">Pending</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{confirmedBookings.length}</div>
              <div className="text-sm text-slate-600">Confirmed</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{completedBookings.length}</div>
              <div className="text-sm text-slate-600">Completed</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">
                ${bookings?.reduce((sum, booking) => sum + (booking.payment_amount || 0), 0) || 0}
              </div>
              <div className="text-sm text-slate-600">Total Spent</div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions Tabs */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Sessions</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <SessionsList 
                  bookings={bookings || []} 
                  onCancel={handleCancelBooking}
                  onFeedback={handleFeedback}
                  formatDateTime={formatDateTime}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              </TabsContent>

              <TabsContent value="pending" className="mt-6">
                <SessionsList 
                  bookings={pendingBookings} 
                  onCancel={handleCancelBooking}
                  onFeedback={handleFeedback}
                  formatDateTime={formatDateTime}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              </TabsContent>

              <TabsContent value="confirmed" className="mt-6">
                <SessionsList 
                  bookings={confirmedBookings} 
                  onCancel={handleCancelBooking}
                  onFeedback={handleFeedback}
                  formatDateTime={formatDateTime}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                <SessionsList 
                  bookings={completedBookings} 
                  onCancel={handleCancelBooking}
                  onFeedback={handleFeedback}
                  formatDateTime={formatDateTime}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Sessions List Component
const SessionsList = ({ 
  bookings, 
  onCancel, 
  onFeedback, 
  formatDateTime, 
  getStatusColor, 
  getStatusIcon 
}: any) => {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 mb-2">No Sessions Found</h3>
        <p className="text-slate-500 mb-6">You haven't booked any sessions yet.</p>
        <Link to="/book-session">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Book Your First Session
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking: any) => (
        <Card key={booking.id} className="border border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {booking.sessions?.title || booking.sessions?.session_types?.name}
                  </h3>
                  <Badge className={`${getStatusColor(booking.status)} border-0`}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(booking.status)}
                      <span className="capitalize">{booking.status}</span>
                    </div>
                  </Badge>
                </div>
                
                <p className="text-slate-600 mb-4">
                  {booking.sessions?.description || booking.sessions?.session_types?.description}
                </p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-700">
                      {formatDateTime(booking.sessions?.start_time)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-700">
                      {booking.sessions?.session_types?.duration_minutes} minutes
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-700">
                      ${booking.payment_amount}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Video className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-700">Online Meeting</span>
                  </div>
                </div>

                {booking.booking_notes && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-700">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      {booking.booking_notes}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col space-y-2 ml-6">
                {booking.status === 'pending' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onCancel(booking.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                )}
                
                {booking.status === 'confirmed' && booking.sessions?.meeting_link && (
                  <Button 
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => window.open(booking.sessions.meeting_link, '_blank')}
                  >
                    <Video className="w-4 h-4 mr-1" />
                    Join Meeting
                  </Button>
                )}
                
                {booking.status === 'completed' && !booking.feedback_rating && (
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => onFeedback(booking.id, star)}
                        className="text-yellow-400 hover:text-yellow-500"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                )}
                
                {booking.feedback_rating && (
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`w-4 h-4 ${
                          star <= booking.feedback_rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MySessions;
