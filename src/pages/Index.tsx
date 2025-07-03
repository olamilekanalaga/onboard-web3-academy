
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Users, Award, Target, Brain, Shield, TrendingUp, Globe, Zap, CheckCircle, Play, Clock, Star, Trophy, Calculator, Gamepad2, BarChart3, Flame, Coins } from "lucide-react";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();

  const learningPaths = [
    {
      id: "foundation",
      title: "Crypto Foundation: What is Money?",
      description: "Start your crypto journey by understanding the fundamentals of money and digital currency",
      icon: BookOpen,
      color: "bg-emerald-600",
      gradient: "from-emerald-500 to-emerald-600",
      level: "Foundation",
      lessons: 8,
      duration: "2 weeks",
      rating: 4.9,
      students: "25.3k",
      xpReward: 500,
      difficulty: 1
    },
    {
      id: "beginner",
      title: "Cryptocurrency Fundamentals",
      description: "Explore different types of cryptocurrencies, exchanges, and basic trading concepts",
      icon: Target,
      color: "bg-blue-600",
      gradient: "from-blue-500 to-blue-600",
      level: "Beginner",
      lessons: 12,
      duration: "2 weeks",
      rating: 4.8,
      students: "18.7k",
      xpReward: 750,
      difficulty: 2
    },
    {
      id: "intermediate",
      title: "DeFi Fundamentals",
      description: "Master decentralized finance protocols, yield farming, and advanced trading",
      icon: Zap,
      color: "bg-purple-600",
      gradient: "from-purple-500 to-purple-600",
      level: "Intermediate",
      lessons: 16,
      duration: "4 weeks",
      rating: 4.9,
      students: "12.4k",
      xpReward: 1200,
      difficulty: 3
    },
    {
      id: "advanced",
      title: "Smart Contract Development",
      description: "Build decentralized applications and smart contracts from scratch",
      icon: Brain,
      color: "bg-indigo-600",
      gradient: "from-indigo-500 to-indigo-600",
      level: "Advanced",
      lessons: 20,
      duration: "4 weeks",
      rating: 4.7,
      students: "8.9k",
      xpReward: 1500,
      difficulty: 4
    },
    {
      id: "expert",
      title: "Advanced Trading & Security",
      description: "Master advanced trading strategies, security practices, and emerging trends",
      icon: Shield,
      color: "bg-red-600",
      gradient: "from-red-500 to-red-600",
      level: "Expert",
      lessons: 24,
      duration: "4 weeks",
      rating: 4.8,
      students: "5.2k",
      xpReward: 2000,
      difficulty: 5
    }
  ];

  const outcomes = [
    {
      percentage: "87%",
      description: "of learners advanced their Web3 career within 6 months"
    },
    {
      percentage: "92%",
      description: "report feeling confident about DeFi and crypto investing"
    },
    {
      percentage: "78%",
      description: "built their first dApp or smart contract"
    }
  ];

  const ecosystemPartners = [
    { name: "Ethereum Foundation", logo: "🔷" },
    { name: "Polygon", logo: "💜" },
    { name: "Coinbase", logo: "🔵" },
    { name: "Uniswap", logo: "🦄" },
    { name: "Chainlink", logo: "🔗" },
    { name: "Aave", logo: "👻" }
  ];

  const platformFeatures = [
    {
      icon: Trophy,
      title: "Gamified Learning",
      description: "Earn XP, unlock achievements, and climb leaderboards as you master crypto concepts",
      color: "bg-yellow-500",
      features: ["XP & Level System", "Achievement Badges", "Learning Streaks", "Global Leaderboards"]
    },
    {
      icon: Calculator,
      title: "Interactive Tools",
      description: "Practice with real-world calculators and simulators in a risk-free environment",
      color: "bg-blue-500",
      features: ["Yield Calculator", "Portfolio Analyzer", "DeFi Simulator", "Gas Tracker"]
    },
    {
      icon: Target,
      title: "Skill Trees",
      description: "Follow structured learning paths that unlock progressively as you advance",
      color: "bg-purple-500",
      features: ["Progressive Unlocking", "Prerequisite System", "Visual Progress", "Skill Mastery"]
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Connect with fellow learners, join study groups, and get mentorship",
      color: "bg-emerald-500",
      features: ["Discussion Forums", "Study Groups", "Peer Reviews", "Expert Mentorship"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager → Web3 Developer",
      location: "🇺🇸 San Francisco",
      quote: "Within 3 months, I went from knowing nothing about blockchain to landing my dream job at a DeFi protocol. The structured learning path was exactly what I needed.",
      avatar: "SC"
    },
    {
      name: "Ahmed Hassan",
      role: "Traditional Finance → DeFi Analyst",
      location: "🇦🇪 Dubai",
      quote: "Coming from traditional finance, I was skeptical about DeFi. This platform not only taught me the technical aspects but also helped me understand the real-world applications.",
      avatar: "AH"
    },
    {
      name: "Maria Rodriguez",
      role: "Student → Smart Contract Auditor",
      location: "🇪🇸 Barcelona",
      quote: "The security course was incredible. I'm now working as a smart contract auditor and earning more than I ever imagined. The practical examples were game-changing.",
      avatar: "MR"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Coursera Style */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  {t('hero.title')}
                  <br />
                  <span className="text-blue-200">{t('hero.build_future') || 'Build Your Future.'}</span>
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed max-w-lg">
                  {t('hero.subtitle')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-10 py-4 text-lg font-semibold">
                    {t('hero.cta')}
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-700 px-10 py-4 text-lg">
                  <Play className="mr-2 h-5 w-5" />
                  {t('hero.learn_more')}
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">25,000+</div>
                  <div className="text-blue-200 text-sm">Active Learners</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-blue-200 text-sm">Expert Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">4.8★</div>
                  <div className="text-blue-200 text-sm">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Hero Card */}
            <div className="lg:pl-8">
              <Card className="bg-white shadow-2xl border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-6">
                  <div className="flex items-center space-x-3 text-white">
                    <BookOpen className="h-8 w-8" />
                    <div>
                      <h3 className="text-xl font-bold">Most Popular Course</h3>
                      <p className="text-blue-100">Web3 Foundations</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-100 text-green-700">Beginner Friendly</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">4.8</span>
                      <span className="text-slate-500">(2,847 reviews)</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>8 weeks</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>12.5k students</span>
                    </div>
                  </div>
                  <Link to="/auth">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Start Free Course
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-12 px-4 md:px-6 bg-slate-50 border-b">
        <div className="container mx-auto max-w-6xl">
          <p className="text-center text-slate-600 mb-8 font-medium">Trusted by teams at leading Web3 companies</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
            {ecosystemPartners.map((partner, index) => (
              <div key={index} className="text-center space-y-2 opacity-70 hover:opacity-100 transition-opacity">
                <div className="text-3xl">{partner.logo}</div>
                <div className="text-sm font-medium text-slate-700">{partner.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Outcomes */}
      <section className="py-16 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Real Results from Real Learners</h2>
            <p className="text-xl text-slate-600">Based on data from 15,000+ course completions</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {outcomes.map((outcome, index) => (
              <div key={index} className="text-center space-y-4 p-6">
                <div className="text-5xl font-bold text-blue-600">{outcome.percentage}</div>
                <p className="text-lg text-slate-700 leading-relaxed">{outcome.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 px-4 md:px-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Learn Crypto Like Never Before</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Bite-sized lessons (5-10 min), real-time market examples, and progressive unlocking designed for today's learners.
            </p>

            {/* Content Quality Highlights */}
            <div className="grid md:grid-cols-3 gap-6 mt-12 mb-16">
              <Card className="bg-white border-emerald-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="font-bold text-lg mb-2">5-10 Min Lessons</h3>
                  <p className="text-gray-600 text-sm">Perfect for busy schedules and short attention spans</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">📈</div>
                  <h3 className="font-bold text-lg mb-2">Real-Time Examples</h3>
                  <p className="text-gray-600 text-sm">Current market data and 2024 case studies</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-purple-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="font-bold text-lg mb-2">Instant Application</h3>
                  <p className="text-gray-600 text-sm">Every lesson has a "do it now" action step</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center space-x-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Highlights */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-6 text-center">
                <Flame className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                <h3 className="text-xl font-bold mb-2">Learning Streaks</h3>
                <p className="text-slate-600 mb-4">Build momentum with daily learning streaks and earn bonus XP for consistency.</p>
                <div className="text-3xl font-bold text-orange-500">30+ Day Streaks</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                <h3 className="text-xl font-bold mb-2">Practice Simulators</h3>
                <p className="text-slate-600 mb-4">Practice DeFi interactions and trading strategies with virtual funds.</p>
                <div className="text-3xl font-bold text-purple-500">Risk-Free</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
                <h3 className="text-xl font-bold mb-2">Real-Time Tools</h3>
                <p className="text-slate-600 mb-4">Access live market data and professional-grade analysis tools.</p>
                <div className="text-3xl font-bold text-emerald-500">15+ Tools</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Catalog */}
      <section className="py-20 px-4 md:px-6 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Choose Your Learning Path</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From complete beginner to advanced developer, we have structured learning paths for every stage of your Web3 journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {learningPaths.map((path) => (
              <Link key={path.id} to="/auth">
                <Card className="group cursor-pointer h-full bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`h-2 bg-gradient-to-r ${path.gradient}`} />

                  <CardHeader className="space-y-4 pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl ${path.color} shadow-lg`}>
                        <path.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge
                          variant="secondary"
                          className={`
                            ${path.level === 'Foundation' ? 'bg-emerald-100 text-emerald-700' :
                              path.level === 'Beginner' ? 'bg-blue-100 text-blue-700' :
                                path.level === 'Intermediate' ? 'bg-purple-100 text-purple-700' :
                                  path.level === 'Advanced' ? 'bg-indigo-100 text-indigo-700' :
                                    'bg-red-100 text-red-700'}
                          `}
                        >
                          {path.level}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${i < path.difficulty ? 'bg-orange-400' : 'bg-gray-200'
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors mb-3">
                        {path.title}
                      </CardTitle>
                      <CardDescription className="text-slate-600 text-base leading-relaxed">
                        {path.description}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <BookOpen className="h-4 w-4" />
                        <span>{path.lessons} lessons</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Clock className="h-4 w-4" />
                        <span>{path.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{path.rating} rating</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Users className="h-4 w-4" />
                        <span>{path.students} students</span>
                      </div>
                    </div>

                    {/* XP Reward */}
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Earn XP</span>
                      </div>
                      <span className="text-lg font-bold text-yellow-600">+{path.xpReward}</span>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:bg-blue-700 transition-colors">
                      {t('hero.cta')}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Success Stories</h2>
            <p className="text-xl text-slate-600">See how our learners transformed their careers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white">
                <CardContent className="pt-8 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="font-bold text-white text-lg">
                        {testimonial.avatar}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-blue-600 font-medium">{testimonial.role}</div>
                      <div className="text-sm text-slate-500">{testimonial.location}</div>
                    </div>
                  </div>

                  <div className="flex space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>

                  <p className="text-slate-700 italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">Ready to Start Your Web3 Journey?</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join over 25,000 learners who are already building the future of the internet. Start with any course, cancel anytime.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-10 py-4 text-lg font-semibold">
                Browse All Courses
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-700 px-10 py-4 text-lg">
              Talk to an Advisor
            </Button>
          </div>

          <div className="pt-8 text-blue-200">
            <p className="text-sm">✓ 7-day free trial • ✓ Cancel anytime • ✓ Certificate upon completion</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Onboard</h3>
                  <p className="text-slate-400 text-sm">Web3 Learning Platform</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                Empowering the next generation of Web3 builders through comprehensive, hands-on education.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Learn</h4>
              <div className="space-y-2 text-slate-400 text-sm">
                <div>Web3 Foundations</div>
                <div>DeFi Mastery</div>
                <div>Smart Contracts</div>
                <div>Trading & Analysis</div>
                <div>DAO Governance</div>
                <div>Security</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-slate-400 text-sm">
                <div>About Us</div>
                <div>Our Mission</div>
                <div>Careers</div>
                <div>Press</div>
                <div>Contact</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-slate-400 text-sm">
                <div>Help Center</div>
                <div>Community</div>
                <div>Discord</div>
                <div>Twitter</div>
                <div>Terms</div>
                <div>Privacy</div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2024 Onboard. All rights reserved. Empowering Web3 education worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
