
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Users, Award, Target, Brain, Shield, TrendingUp, Globe, Zap, CheckCircle } from "lucide-react";
import Header from "@/components/Header";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const learningPaths = [
    {
      id: "foundations",
      title: "Learn Web3 Foundations",
      description: "Start from zero and understand blockchain, wallets, and crypto basics",
      icon: BookOpen,
      color: "bg-blue-500",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      id: "defi",
      title: "Dive into DeFi",
      description: "Master decentralized finance, lending, and yield strategies",
      icon: Target,
      color: "bg-emerald-500",
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      id: "development",
      title: "Become a dApp Builder",
      description: "Learn Solidity, deploy contracts, and build applications",
      icon: Brain,
      color: "bg-purple-500",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      id: "trading",
      title: "Explore Crypto Trading",
      description: "Understand markets, strategies, and risk management",
      icon: TrendingUp,
      color: "bg-orange-500",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      id: "daos",
      title: "Join DAOs & Contribute",
      description: "Participate in governance and decentralized organizations",
      icon: Users,
      color: "bg-pink-500",
      gradient: "from-pink-500 to-pink-600"
    },
    {
      id: "security",
      title: "Master Web3 Security",
      description: "Protect yourself from scams and secure your assets",
      icon: Shield,
      color: "bg-red-500",
      gradient: "from-red-500 to-red-600"
    }
  ];

  const benefits = [
    {
      icon: Globe,
      title: "Learn Blockchain at Your Pace",
      description: "Self-paced courses designed for busy schedules"
    },
    {
      icon: Zap,
      title: "No Wallet? No Problem",
      description: "Start learning immediately, set up wallets when ready"
    },
    {
      icon: Users,
      title: "Onboarded by the Best",
      description: "Curated content from industry experts and builders"
    },
    {
      icon: CheckCircle,
      title: "Understand Real Use-Cases",
      description: "Practical examples and hands-on projects"
    }
  ];

  const ecosystemPartners = [
    "Base", "Solana", "Optimism", "Arbitrum", "Polygon", "Superteam"
  ];

  const testimonials = [
    {
      name: "Sarah O.",
      location: "🇳🇬 Nigeria",
      quote: "Finally understood DeFi after years of confusion. The step-by-step approach is perfect."
    },
    {
      name: "David K.",
      location: "🇰🇪 Kenya", 
      quote: "From complete beginner to deploying my first smart contract in 6 weeks!"
    },
    {
      name: "Priya S.",
      location: "🇮🇳 India",
      quote: "The practical examples made everything click. Now I'm contributing to DAOs!"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 md:py-24 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                ✨ Master the Future of the Internet
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
                Master Crypto. Build Onchain.
                <span className="text-emerald-600"> From Zero to DeFi Pro.</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                The most comprehensive Web3 education platform. Learn blockchain, DeFi, smart contracts, and more through structured courses designed for real understanding.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
                    Start Learning Free
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="lg:pl-12">
              <Card className="bg-white shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-center">Join 15,000+ Learners</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-emerald-600">50+</div>
                      <div className="text-sm text-slate-600">Courses</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">200+</div>
                      <div className="text-sm text-slate-600">Lessons</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">95%</div>
                      <div className="text-sm text-slate-600">Complete</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Explore Section */}
      <section className="py-16 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">What do you want to learn?</h2>
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              placeholder="Search courses: Blockchain, DeFi, Trading, Smart Contracts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-4 text-lg border-2 border-slate-200 focus:border-emerald-500"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {["#Web3Basics", "#DeFi", "#Trading", "#SmartContracts", "#Security", "#DAOs"].map((tag) => (
              <Badge key={tag} variant="secondary" className="px-4 py-2 text-sm hover:bg-emerald-100 cursor-pointer">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Partners */}
      <section className="py-12 px-4 md:px-6 bg-slate-50">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-slate-600 mb-6">Trusted by learners building on</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {ecosystemPartners.map((partner) => (
              <div key={partner} className="text-lg font-semibold text-slate-700">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Choose Your Learning Path</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Structured courses that take you from complete beginner to blockchain expert
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {learningPaths.map((path) => (
              <Link key={path.id} to={`/courses/${path.id}`}>
                <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-slate-50">
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${path.gradient} flex items-center justify-center mb-4`}>
                      <path.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-emerald-600 transition-colors">
                      {path.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      {path.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full group-hover:bg-emerald-50 group-hover:text-emerald-700">
                      Start Learning →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 md:px-6 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose Onboard?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <benefit.icon className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Loved by Learners Worldwide</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <p className="text-slate-600 mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-emerald-700">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Email Signup */}
      <section className="py-20 px-4 md:px-6 bg-emerald-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Get Weekly Web3 Lessons in Your Inbox</h2>
          <p className="text-emerald-100 text-xl mb-8">Join 10,000+ learners getting the latest insights and tutorials</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="bg-white border-0 py-3"
            />
            <Button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-600 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Onboard</h3>
                  <p className="text-slate-400 text-sm">Web3 Learning</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Learn</h4>
              <div className="space-y-2 text-slate-400">
                <div>Web3 Foundations</div>
                <div>DeFi Mastery</div>
                <div>Smart Contracts</div>
                <div>Trading</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-slate-400">
                <div>About</div>
                <div>Contact</div>
                <div>Terms</div>
                <div>Privacy</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <div className="space-y-2 text-slate-400">
                <div>Twitter</div>
                <div>Discord</div>
                <div>Telegram</div>
                <div>GitHub</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
