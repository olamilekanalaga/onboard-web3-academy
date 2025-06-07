import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Calendar,
  Clock,
  User,
  DollarSign,
  CheckCircle,
  X,
  Eye,
  Video,
  MessageSquare,
  Filter,
  Search,
  Download,
  Mail
} from "lucide-react";
import { supabase } from '@/lib/supabase';

const BookingManagement = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load bookings from database
  const loadBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          sessions (
            *,
            session_types (
              name,
              description,
              duration_minutes,
              price_usd
            )
          ),
          profiles (
            full_name,
            email,
            phone,
            countries (
              name,
              flag_emoji
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      console.error('Error loading bookings:', error);
    }
    setLoading(false);
  };

  // Update booking status
  const updateBookingStatus = async (bookingId: string, status: string, meetingLink?: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      // If confirming and meeting link provided, update session
      if (status === 'confirmed' && meetingLink) {
        const booking = bookings.find(b => b.id === bookingId);
        if (booking?.session_id) {
          await supabase
            .from('sessions')
            .update({ meeting_link: meetingLink })
            .eq('id', booking.session_id);
        }
      }

      // Reload bookings
      loadBookings();
    } catch (error: any) {
      console.error('Error updating booking:', error);
      alert('Error updating booking: ' + error.message);
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = !searchTerm ||
      booking.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.sessions?.session_types?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  React.useEffect(() => {
    loadBookings();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Session Bookings Management</span>
            </CardTitle>
            <Button onClick={loadBookings} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or session type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-800">
                {bookings.filter(b => b.status === 'pending').length}
              </p>
              <p className="text-sm text-yellow-600">Pending</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-800">
                {bookings.filter(b => b.status === 'confirmed').length}
              </p>
              <p className="text-sm text-blue-600">Confirmed</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-800">
                {bookings.filter(b => b.status === 'completed').length}
              </p>
              <p className="text-sm text-green-600">Completed</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-800">
                ${bookings.reduce((sum, b) => sum + (b.payment_amount || 0), 0).toFixed(2)}
              </p>
              <p className="text-sm text-purple-600">Total Revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p>Loading bookings...</p>
            </CardContent>
          </Card>
        ) : filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Bookings Found</h3>
              <p className="text-slate-500">
                {filter === 'all' ? 'No bookings have been made yet.' : `No ${filter} bookings found.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {booking.sessions?.session_types?.name || 'Session'}
                        </h3>
                        <p className="text-slate-600">
                          {booking.sessions?.title || booking.sessions?.description}
                        </p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {/* User Info */}
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="font-medium">{booking.profiles?.full_name || 'Unknown User'}</p>
                          <p className="text-slate-500">{booking.profiles?.email}</p>
                          {booking.profiles?.countries && (
                            <p className="text-slate-500">
                              {booking.profiles.countries.flag_emoji} {booking.profiles.countries.name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Session Details */}
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="font-medium">
                            {formatDateTime(booking.sessions?.start_time)}
                          </p>
                          <p className="text-slate-500">
                            {booking.sessions?.session_types?.duration_minutes} minutes
                          </p>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="font-medium">${booking.payment_amount}</p>
                          <p className="text-slate-500">{booking.payment_status}</p>
                        </div>
                      </div>
                    </div>

                    {/* Booking Notes */}
                    {booking.booking_notes && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <MessageSquare className="w-4 h-4 text-slate-500 mt-0.5" />
                          <p className="text-sm text-slate-700">{booking.booking_notes}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 lg:ml-6">
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => {
                            const meetingLink = prompt('Enter meeting link (optional):');
                            updateBookingStatus(booking.id, 'confirmed', meetingLink || undefined);
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}

                    {booking.status === 'confirmed' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Complete
                        </Button>
                        {booking.sessions?.meeting_link && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(booking.sessions.meeting_link, '_blank')}
                          >
                            <Video className="w-4 h-4 mr-1" />
                            Join Meeting
                          </Button>
                        )}
                      </>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`mailto:${booking.profiles?.email}`, '_blank')}
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Email User
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingManagement;
