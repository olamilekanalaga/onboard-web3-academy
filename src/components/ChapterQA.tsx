
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Bot, User } from "lucide-react";

interface QAMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChapterQAProps {
  chapterTitle: string;
  courseId: string;
  moduleId: number;
  chapterId: number;
}

const ChapterQA = ({ chapterTitle, courseId, moduleId, chapterId }: ChapterQAProps) => {
  const [messages, setMessages] = useState<QAMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitQuestion = async () => {
    if (!question.trim()) return;

    const userMessage: QAMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestion("");
    setIsLoading(true);

    // Simulate AI response (in a real app, this would call an AI API)
    setTimeout(() => {
      const aiResponse: QAMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(question, chapterTitle),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userQuestion: string, chapter: string): string => {
    // This is a simple response generator - in production, you'd use a real AI API
    const responses = {
      blockchain: "Great question about blockchain! Blockchain technology creates an immutable ledger by linking blocks of data together using cryptographic hashes. Each block contains a reference to the previous block, creating a chain that cannot be altered without changing all subsequent blocks. This is what makes blockchain tamper-proof and trustworthy.",
      defi: "DeFi (Decentralized Finance) eliminates intermediaries by using smart contracts to automate financial services. Instead of trusting a bank, you trust code that's been audited and runs automatically on the blockchain. This enables 24/7 access, lower fees, and global accessibility.",
      wallet: "Crypto wallets don't actually store cryptocurrency - they store the private keys that prove you own assets on the blockchain. Think of it like having the key to a safety deposit box. The 'box' (your crypto) exists on the blockchain, but only your key can access it.",
      trading: "In degen trading, risk management is absolutely crucial. The '1% rule' means never risking more than 1% of your total portfolio on any single trade. This helps ensure that even a string of losses won't wipe out your account completely."
    };

    // Simple keyword matching for demo purposes
    const lowerQuestion = userQuestion.toLowerCase();
    if (lowerQuestion.includes('blockchain') || lowerQuestion.includes('block')) {
      return responses.blockchain;
    } else if (lowerQuestion.includes('defi') || lowerQuestion.includes('decentralized')) {
      return responses.defi;
    } else if (lowerQuestion.includes('wallet') || lowerQuestion.includes('keys')) {
      return responses.wallet;
    } else if (lowerQuestion.includes('trading') || lowerQuestion.includes('risk')) {
      return responses.trading;
    }

    return `That's an excellent question about "${chapter}"! Based on the chapter content, here are the key points to consider: The concepts we covered show how this technology is revolutionizing traditional systems. I'd recommend reviewing the key takeaways section and trying the practical task to solidify your understanding. Feel free to ask more specific questions about any particular aspect you'd like to explore further!`;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-emerald-600" />
          <span>Ask Questions About This Chapter</span>
        </CardTitle>
        <CardDescription>
          Get instant answers about "{chapterTitle}" from our AI tutor
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages Display */}
        {messages.length > 0 && (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'ai' && (
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <Bot className="h-4 w-4 text-emerald-600" />
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                {message.type === 'user' && (
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="bg-emerald-100 p-2 rounded-full">
                  <Bot className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="bg-slate-100 px-4 py-2 rounded-lg">
                  <p className="text-sm text-slate-600">AI is thinking...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Question Input */}
        <div className="space-y-3">
          <Textarea
            placeholder="Ask a question about this chapter..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmitQuestion();
              }
            }}
          />
          <Button
            onClick={handleSubmitQuestion}
            disabled={!question.trim() || isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Send className="h-4 w-4 mr-2" />
            Ask Question
          </Button>
        </div>

        {messages.length === 0 && (
          <div className="text-center py-6 text-slate-500">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">No questions yet. Ask anything about this chapter!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChapterQA;
