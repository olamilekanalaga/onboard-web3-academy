import React, { useState } from 'react';
import { Bot, Sparkles, Send, Loader2, AlertCircle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { searchWithAI, getSuggestedQuestions, logAISearch, AISearchResponse } from '@/services/aiSearchService';
import { useAuth } from '@/contexts/AuthContext';

interface AIOptimumSearchProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

// Remove the local interface since we're using the one from the service

const AIOptimumSearch: React.FC<AIOptimumSearchProps> = ({
  isOpen,
  onClose,
  initialQuery = ''
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AISearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Get suggested questions for the empty state
  const suggestedQuestions = getSuggestedQuestions();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Call the AI search service
      const aiResponse = await searchWithAI({
        query,
        userId: user?.id
      });

      setResponse(aiResponse);

      // Log the search for analytics
      await logAISearch(query, aiResponse, user?.id);

    } catch (err) {
      console.error('AI Search Error:', err);
      setError('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">AI Optimum Search</CardTitle>
                <p className="text-purple-100 text-sm">
                  Get intelligent answers to your Web3 questions
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto flex-1 min-h-0">
          {/* Search Input */}
          <div className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Ask me anything about Web3, DeFi, NFTs, blockchain, trading, or any crypto-related topic..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[100px] pr-12 resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleSearch}
                disabled={!query.trim() || isLoading}
                className="absolute bottom-3 right-3 bg-purple-600 hover:bg-purple-700"
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* AI Features Badge */}
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="outline">
                <Lightbulb className="h-3 w-3 mr-1" />
                Smart Suggestions
              </Badge>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="mt-6 p-6 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">AI is thinking...</p>
                  <p className="text-sm text-purple-600">
                    Analyzing your question and searching for the best answer
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert className="mt-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* AI Response */}
          {response && (
            <div className="mt-6 space-y-4">
              {/* Main Answer */}
              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-purple-900">AI Answer</h3>
                        <Badge 
                          variant={response.confidence > 90 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {response.confidence}% confident
                        </Badge>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {response.answer}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sources */}
              {response.sources.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      📚 Related Courses
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {response.sources.map((source, index) => (
                        <Badge key={index} variant="outline" className="cursor-pointer hover:bg-gray-100">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Related Topics */}
              {response.relatedTopics.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      🔗 Related Topics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {response.relatedTopics.map((topic, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="cursor-pointer hover:bg-blue-100"
                          onClick={() => setQuery(topic)}
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Sample Questions */}
          {!response && !isLoading && !query && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                💡 Try asking about:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedQuestions.slice(0, 6).map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left justify-start h-auto p-3 text-sm"
                    onClick={() => setQuery(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIOptimumSearch;
