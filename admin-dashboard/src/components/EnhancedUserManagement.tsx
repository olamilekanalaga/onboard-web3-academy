import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  Calendar,
  Award,
  TrendingUp,
  Globe,
  Activity,
  ChevronDown,
  ChevronUp,
  MoreHorizontal
} from "lucide-react";
// import { motion } from 'framer-motion'; // Temporarily disabled
import { useUserProgressAnalytics } from '@/hooks/useAdminData';
import UserProfileDetail from './UserProfileDetail';

interface UserData {
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  country_name: string;
  total_xp: number;
  current_level: number;
  completed_courses: string[];
  current_streak: number;
  longest_streak: number;
  total_study_time: number;
  last_activity_date: string;
  created_at: string;
  course_completion_rate: number;
  has_stats: boolean;
}

type SortField = 'total_xp' | 'current_level' | 'created_at' | 'last_activity_date' | 'course_completion_rate';
type SortDirection = 'asc' | 'desc';

const EnhancedUserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [sortField, setSortField] = useState<SortField>('total_xp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const { data: userProgress, isLoading } = useUserProgressAnalytics();

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    if (!userProgress) return [];

    let filtered = userProgress.filter(user => {
      const matchesSearch =
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.country_name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLevel = filterLevel === 'all' || 
        (filterLevel === 'beginner' && user.current_level <= 3) ||
        (filterLevel === 'intermediate' && user.current_level > 3 && user.current_level <= 7) ||
        (filterLevel === 'advanced' && user.current_level > 7);

      const matchesCountry = filterCountry === 'all' || user.country_name === filterCountry;

      return matchesSearch && matchesLevel && matchesCountry;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'created_at' || sortField === 'last_activity_date') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [userProgress, searchTerm, sortField, sortDirection, filterLevel, filterCountry]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const paginatedUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique countries for filter
  const countries = useMemo(() => {
    if (!userProgress) return [];
    const uniqueCountries = [...new Set(userProgress.map(user => user.country_name).filter(Boolean))];
    return uniqueCountries.sort();
  }, [userProgress]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getLevelBadge = (level: number) => {
    if (level <= 3) return { label: 'Beginner', color: 'bg-gray-500' };
    if (level <= 7) return { label: 'Intermediate', color: 'bg-blue-500' };
    return { label: 'Advanced', color: 'bg-purple-500' };
  };

  const getActivityStatus = (lastActivity: string) => {
    const daysSince = Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince <= 1) return { label: 'Active', color: 'bg-green-500' };
    if (daysSince <= 7) return { label: 'Recent', color: 'bg-yellow-500' };
    if (daysSince <= 30) return { label: 'Inactive', color: 'bg-orange-500' };
    return { label: 'Dormant', color: 'bg-red-500' };
  };

  if (selectedUser) {
    return (
      <UserProfileDetail
        user={selectedUser}
        onBack={() => setSelectedUser(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">
            Showing {filteredAndSortedUsers.length} of {userProgress?.length || 0} total users
          </p>
          <p className="text-sm text-blue-600">
            Live data from Supabase • {userProgress?.filter(u => u.has_stats).length || 0} users have learning progress
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner (1-3)</option>
              <option value="intermediate">Intermediate (4-7)</option>
              <option value="advanced">Advanced (8+)</option>
            </select>

            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">User</th>
                  <th 
                    className="text-left p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('current_level')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Level</span>
                      {sortField === 'current_level' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('total_xp')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>XP</span>
                      {sortField === 'total_xp' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="text-left p-3">Courses</th>
                  <th className="text-left p-3">Country</th>
                  <th 
                    className="text-left p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('last_activity_date')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Last Active</span>
                      {sortField === 'last_activity_date' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => {
                  const levelBadge = getLevelBadge(user.current_level);
                  const activityStatus = getActivityStatus(user.last_activity_date);
                  
                  return (
                    <tr key={user.user_id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{user.full_name || user.username || 'Anonymous'}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            {user.username && user.username !== user.full_name && (
                              <p className="text-xs text-gray-500">@{user.username}</p>
                            )}
                            {!user.has_stats && (
                              <p className="text-xs text-orange-500">No learning stats yet</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">{user.current_level}</span>
                          <Badge className={`${levelBadge.color} text-white text-xs`}>
                            {levelBadge.label}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-medium">{user.total_xp.toLocaleString()}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <span>{user.completed_courses.length}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${Math.min(user.course_completion_rate, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-sm">{user.country_name || 'Unknown'}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <Badge className={`${activityStatus.color} text-white text-xs`}>
                            {activityStatus.label}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(user.last_activity_date).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)} of{' '}
                {filteredAndSortedUsers.length} users
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedUserManagement;
