import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Bot, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useCourseProgression } from '@/hooks/useCourseProgression';
import AIOptimumSearch from './AIOptimumSearch';

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchPopup: React.FC<SearchPopupProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showAISearch, setShowAISearch] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { courseProgression } = useCourseProgression();

  // Convert course progression data to searchable format
  const courseList = Object.values(courseProgression).map(course => ({
    id: course.id,
    title: course.title || course.id,
    description: `Learn ${course.title} and earn ${course.xpReward} XP. Master essential skills for Web3 success.`,
    level: course.level || 'Beginner',
    category: course.category || 'fundamentals',
  }));

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = courseList
        .filter(course => {
          const searchLower = searchQuery.toLowerCase();
          return (
            course.title.toLowerCase().includes(searchLower) ||
            course.description.toLowerCase().includes(searchLower) ||
            course.level.toLowerCase().includes(searchLower) ||
            course.category.toLowerCase().includes(searchLower)
          );
        })
        .slice(0, 6); // Show max 6 suggestions
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleCourseSelect = (courseId: string) => {
    navigate(`/course/${courseId}`);
    onClose();
    setSearchQuery('');
  };

  const handleViewAllResults = () => {
    navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    onClose();
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && searchQuery.trim()) {
      handleViewAllResults();
    }
  };

  const handleAISearch = () => {
    setShowAISearch(true);
  };

  const handleCloseAISearch = () => {
    setShowAISearch(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <Card className="w-full max-w-2xl mx-4 shadow-2xl">
        <CardContent className="p-0">
          {/* Search Input */}
          <div className="relative p-4 border-b">
            <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search courses, topics, or levels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-12 pr-12 py-3 text-lg border-0 focus:ring-0 focus:outline-none"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {searchQuery.trim() && suggestions.length > 0 && (
              <div className="p-2">
                <div className="text-sm text-slate-600 px-3 py-2 font-medium">
                  Course Suggestions
                </div>
                {suggestions.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => handleCourseSelect(course.id)}
                    className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 mb-1">
                          {course.title}
                        </h4>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {course.level}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {course.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
                
                {suggestions.length >= 6 && (
                  <button
                    onClick={handleViewAllResults}
                    className="w-full p-3 text-center text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-medium"
                  >
                    View all results for "{searchQuery}"
                  </button>
                )}
              </div>
            )}

            {searchQuery.trim() && suggestions.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                <Search className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p className="text-lg font-medium mb-1">No courses found</p>
                <p className="text-sm mb-4">Try searching for different keywords</p>

                {/* AI Search Option */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-center mb-2">
                    <Bot className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="font-medium text-purple-900">Can't find what you're looking for?</span>
                  </div>
                  <p className="text-sm text-purple-700 mb-3">
                    Try our AI Optimum Search for intelligent answers to any Web3 question
                  </p>
                  <Button
                    onClick={handleAISearch}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    size="sm"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Use AI Search
                  </Button>
                </div>
              </div>
            )}

            {!searchQuery.trim() && (
              <div className="p-8 text-center text-slate-500">
                <Search className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p className="text-lg font-medium mb-1">Search for courses</p>
                <p className="text-sm mb-6">Find courses by title, topic, or difficulty level</p>

                {/* AI Search Promotion */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200 max-w-md mx-auto">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-2 bg-purple-600 rounded-lg mr-3">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-purple-900">AI Optimum Search</h3>
                      <p className="text-sm text-purple-700">Get smart answers to any question</p>
                    </div>
                  </div>
                  <p className="text-sm text-purple-600 mb-4">
                    Ask about DeFi, NFTs, trading, blockchain, or any Web3 topic not covered in our courses
                  </p>
                  <Button
                    onClick={handleAISearch}
                    className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                    size="sm"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Try AI Search
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Optimum Search Modal */}
      <AIOptimumSearch
        isOpen={showAISearch}
        onClose={handleCloseAISearch}
        initialQuery={searchQuery}
      />
    </div>
  );
};

export default SearchPopup;
