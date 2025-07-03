import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Video,
  Plus,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  Trash2,
  Users,
  CheckCircle,
  X
} from "lucide-react";
import { supabaseAdmin } from '@/lib/supabase';

const SessionManagement = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionTypes, setSessionTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    session_type_id: '',
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    max_participants: 1
  });

  // Load sessions
  const loadSessions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          session_types (
            name,
            description,
            duration_minutes,
            price_usd
          )
        `)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setSessions(data || []);
    } catch (error: any) {
      console.error('Error loading sessions:', error);
    }
    setLoading(false);
  };

  // Load session types
  const loadSessionTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('session_types')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setSessionTypes(data || []);
    } catch (error: any) {
      console.error('Error loading session types:', error);
    }
  };

  // Create session
  const createSession = async () => {
    try {
      const { error } = await supabase
        .from('sessions')
        .insert({
          ...formData,
          session_type_id: parseInt(formData.session_type_id),
          is_available: true
        });

      if (error) throw error;

      setShowCreateForm(false);
      setFormData({
        session_type_id: '',
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        max_participants: 1
      });
      loadSessions();
    } catch (error: any) {
      console.error('Error creating session:', error);
      alert('Error creating session: ' + error.message);
    }
  };

  // Delete session
  const deleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
      loadSessions();
    } catch (error: any) {
      console.error('Error deleting session:', error);
      alert('Error deleting session: ' + error.message);
    }
  };

  // Toggle session availability
  const toggleAvailability = async (sessionId: string, isAvailable: boolean) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ is_available: !isAvailable })
        .eq('id', sessionId);

      if (error) throw error;
      loadSessions();
    } catch (error: any) {
      console.error('Error updating session:', error);
      alert('Error updating session: ' + error.message);
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

  useEffect(() => {
    loadSessions();
    loadSessionTypes();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Video className="w-5 h-5 text-purple-600" />
              <span>Session Management</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button onClick={loadSessions} disabled={loading}>
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Session
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-800">
                {sessions.filter(s => s.is_available).length}
              </p>
              <p className="text-sm text-blue-600">Available</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-800">
                {sessions.filter(s => new Date(s.start_time) > new Date()).length}
              </p>
              <p className="text-sm text-green-600">Upcoming</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-800">
                {sessions.filter(s => new Date(s.start_time) < new Date()).length}
              </p>
              <p className="text-sm text-yellow-600">Past</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-800">
                {sessions.length}
              </p>
              <p className="text-sm text-purple-600">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Session Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Session Type
                </label>
                <select
                  value={formData.session_type_id}
                  onChange={(e) => setFormData({ ...formData, session_type_id: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-md"
                  required
                >
                  <option value="">Select session type</option>
                  {sessionTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} - ${type.price_usd} ({type.duration_minutes}min)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title (Optional)
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Custom session title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Custom session description"
                  className="w-full p-2 border border-slate-300 rounded-md"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Start Time
                </label>
                <Input
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  End Time
                </label>
                <Input
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Timezone
                </label>
                <Input
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  placeholder="e.g., America/New_York"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Max Participants
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex space-x-2 mt-6">
              <Button onClick={createSession}>
                Create Session
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p>Loading sessions...</p>
            </CardContent>
          </Card>
        ) : sessions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Video className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Sessions Created</h3>
              <p className="text-slate-500 mb-4">Create your first session to start accepting bookings.</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Session
              </Button>
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Session Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {session.title || session.session_types?.name}
                        </h3>
                        <p className="text-slate-600">
                          {session.description || session.session_types?.description}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={session.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {session.is_available ? 'Available' : 'Unavailable'}
                        </Badge>
                        {new Date(session.start_time) < new Date() && (
                          <Badge className="bg-gray-100 text-gray-800">Past</Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="font-medium">
                            {formatDateTime(session.start_time)}
                          </p>
                          <p className="text-slate-500">Start time</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="font-medium">
                            {session.session_types?.duration_minutes} minutes
                          </p>
                          <p className="text-slate-500">Duration</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="font-medium">${session.session_types?.price_usd}</p>
                          <p className="text-slate-500">Price</p>
                        </div>
                      </div>
                    </div>

                    {session.meeting_link && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <Video className="w-4 h-4 inline mr-1" />
                          Meeting link configured
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 lg:ml-6">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleAvailability(session.id, session.is_available)}
                      className={session.is_available ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}
                    >
                      {session.is_available ? (
                        <>
                          <X className="w-4 h-4 mr-1" />
                          Disable
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Enable
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteSession(session.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
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

export default SessionManagement;
