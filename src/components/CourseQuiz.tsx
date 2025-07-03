
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  RotateCcw,
  ArrowRight,
  AlertTriangle,
  Star,
  Target,
  X
} from "lucide-react";
import { allCourseQuizzes } from "@/data/allCourseQuizzes";
import { courses } from "@/data/courses";

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'written' | 'short-answer';
  options?: string[]; // Only for multiple choice
  correctAnswer?: number; // Only for multiple choice
  sampleAnswer?: string; // For written questions
  keyPoints?: string[]; // Points that should be covered in written answers
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  category: string;
  timeLimit?: number; // In minutes, for written questions
}

interface CourseQuizProps {
  courseId: string;
  courseName?: string;
  questions?: QuizQuestion[];
  onQuizComplete: (passed: boolean, score: number, xpEarned: number) => void;
  onRetakeCourse?: () => void;
  onClose?: () => void;
  requiredScore?: number; // Minimum percentage to pass (70%)
}

const CourseQuiz: React.FC<CourseQuizProps> = ({
  courseId,
  courseName,
  questions: providedQuestions,
  onQuizComplete,
  onRetakeCourse,
  onClose,
  requiredScore = 70
}) => {
  // Get questions from courseId if not provided
  const questions = providedQuestions || allCourseQuizzes[courseId as keyof typeof allCourseQuizzes] || [];
  const courseTitle = courseName || courses[courseId as keyof typeof courses]?.title || 'Course';
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [writtenAnswers, setWrittenAnswers] = useState<string[]>(new Array(questions.length).fill(''));
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Early return if no questions available
  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardHeader className="text-center relative">
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Close Quiz"
              >
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            )}
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl text-yellow-900">
              Quiz Not Available
            </CardTitle>
            <p className="text-yellow-700 mt-2">
              No quiz questions are available for this course yet.
            </p>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={onClose || (() => {})}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Timer effect
  useEffect(() => {
    if (quizStarted && !showResults && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleQuizSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, showResults, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleWrittenAnswer = (answer: string) => {
    const newAnswers = [...writtenAnswers];
    newAnswers[currentQuestion] = answer;
    setWrittenAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleQuizSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleQuizSubmit = () => {
    // Calculate score
    let correct = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach((question, index) => {
      totalPoints += question.points;

      if (question.type === 'multiple-choice') {
        if (selectedAnswers[index] === question.correctAnswer) {
          correct++;
          earnedPoints += question.points;
        }
      } else if (question.type === 'written' || question.type === 'short-answer') {
        // For written questions, give full points if answered (manual grading would be ideal)
        const answer = writtenAnswers[index]?.trim();
        if (answer && answer.length > 20) { // Minimum effort check
          correct++;
          earnedPoints += question.points;
        }
      }
    });

    const percentage = (earnedPoints / totalPoints) * 100;
    const passed = percentage >= requiredScore;

    setCorrectAnswers(correct);
    setScore(percentage);
    setShowResults(true);

    // Calculate XP based on performance
    let xpEarned = 0;
    if (passed) {
      xpEarned = Math.floor(earnedPoints * 2); // 2 XP per point earned
      if (percentage >= 90) xpEarned += 100; // Bonus for excellence
      if (percentage === 100) xpEarned += 200; // Perfect score bonus
    }

    onQuizComplete(passed, percentage, xpEarned);
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(300); // Reset timer
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizStarted(false);
    setTimeLeft(300);
    setScore(0);
    setCorrectAnswers(0);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= requiredScore) return 'text-blue-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 95) return { text: 'Excellent!', color: 'bg-green-500', icon: '🏆' };
    if (score >= 85) return { text: 'Great!', color: 'bg-blue-500', icon: '⭐' };
    if (score >= requiredScore) return { text: 'Passed', color: 'bg-green-500', icon: '✅' };
    return { text: 'Failed', color: 'bg-red-500', icon: '❌' };
  };

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="text-center relative">
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Close Quiz"
              >
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            )}
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-blue-900">
              {courseTitle} Quiz
            </CardTitle>
            <p className="text-blue-700 mt-2">
              Test your knowledge and earn XP to unlock the next course!
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-green-600">5:00</div>
                <div className="text-sm text-gray-600">Time Limit</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Passing Requirements</h4>
                  <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                    <li>• Score at least {requiredScore}% to pass</li>
                    <li>• If you fail, you'll need to retake the entire course</li>
                    <li>• XP is only awarded upon passing</li>
                    <li>• You can retake the quiz after reviewing the course</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleStartQuiz}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              size="lg"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const badge = getScoreBadge(score);
    const passed = score >= requiredScore;

    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className={`border-2 ${passed ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' : 'border-red-200 bg-gradient-to-br from-red-50 to-pink-50'}`}>
          <CardHeader className="text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
              {passed ? (
                <CheckCircle className="w-10 h-10 text-green-600" />
              ) : (
                <XCircle className="w-10 h-10 text-red-600" />
              )}
            </div>
            <CardTitle className={`text-3xl ${passed ? 'text-green-900' : 'text-red-900'}`}>
              {passed ? 'Congratulations!' : 'Quiz Failed'}
            </CardTitle>
            <Badge className={`${badge.color} text-white text-lg px-4 py-2 mt-2`}>
              {badge.icon} {badge.text}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                  {Math.round(score)}%
                </div>
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-3xl font-bold text-blue-600">
                  {correctAnswers}/{questions.length}
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-3xl font-bold text-purple-600">
                  {passed ? Math.floor((score / 100) * questions.reduce((sum, q) => sum + q.points, 0) * 2) : 0}
                </div>
                <div className="text-sm text-gray-600">XP Earned</div>
              </div>
            </div>

            {!passed && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">Course Retake Required</h4>
                    <p className="text-sm text-red-700 mt-1">
                      You need to score at least {requiredScore}% to pass. Please review the course material and try again.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              {!passed ? (
                <>
                  {onRetakeCourse && (
                    <Button 
                      onClick={onRetakeCourse}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retake Course
                    </Button>
                  )}
                  <Button 
                    onClick={handleRetakeQuiz}
                    variant="outline"
                    className="flex-1"
                  >
                    Retake Quiz
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => onQuizComplete(true, score, Math.floor((score / 100) * questions.reduce((sum, q) => sum + q.points, 0) * 2))}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continue to Next Course
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Question {currentQuestion + 1} of {questions.length}
          </h2>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className={`font-mono ${timeLeft < 60 ? 'text-red-600' : 'text-gray-700'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <div className="transition-all duration-300 ease-in-out">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {currentQ.category}
                </Badge>
                <Badge 
                  className={`text-xs ${
                    currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    currentQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {currentQ.difficulty} • {currentQ.points} pts
                </Badge>
              </div>
              <CardTitle className="text-lg leading-relaxed">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQ.type === 'multiple-choice' && currentQ.options ? (
                // Multiple Choice Questions
                currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswers[currentQuestion] === index && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="flex-1">{option}</span>
                    </div>
                  </button>
                ))
              ) : (
                // Written Questions
                <div className="space-y-4">
                  {currentQ.timeLimit && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-yellow-800">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Recommended time: {currentQ.timeLimit} minutes
                        </span>
                      </div>
                    </div>
                  )}

                  <textarea
                    value={writtenAnswers[currentQuestion] || ''}
                    onChange={(e) => handleWrittenAnswer(e.target.value)}
                    placeholder="Write your detailed answer here... (minimum 20 characters)"
                    className="w-full h-40 p-4 border-2 border-gray-200 rounded-lg resize-none focus:border-blue-500 focus:outline-none"
                  />

                  <div className="text-sm text-gray-600">
                    Characters: {(writtenAnswers[currentQuestion] || '').length}
                    {(writtenAnswers[currentQuestion] || '').length < 20 && (
                      <span className="text-red-500 ml-2">
                        (Minimum 20 characters required)
                      </span>
                    )}
                  </div>

                  {currentQ.keyPoints && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Key points to consider:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                        {currentQ.keyPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          variant="outline"
        >
          Previous
        </Button>
        
        <Button
          onClick={handleNextQuestion}
          disabled={
            currentQ.type === 'multiple-choice' 
              ? selectedAnswers[currentQuestion] === undefined
              : !writtenAnswers[currentQuestion] || writtenAnswers[currentQuestion].length < 20
          }
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default CourseQuiz;
