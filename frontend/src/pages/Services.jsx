import React, { useState } from "react";
import {
  Code,
  Smartphone,
  Server,
  Package,
  CheckCircle2,
  Clock,
  DollarSign,
  Sparkles,
  Wrench,
  ArrowRight,
  Star,
} from "lucide-react";
import FadeUp from "../components/FadeUp";

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Services", icon: Package },
    { id: "web", name: "Web", icon: Code },
    { id: "mobile", name: "Mobile", icon: Smartphone },
    { id: "backend", name: "Backend", icon: Server },
    { id: "combo", name: "Packages", icon: Sparkles },
  ];

  const webPackages = [
    {
      tier: "basic",
      name: "Basic Web",
      price: "$200 - $400",
      duration: "2-3 weeks",
      features: [
        "Landing page or portfolio (5-7 pages)",
        "Fully responsive design",
        "React.js + Next.js",
        "Basic SEO setup",
        "Free domain (first year)",
        "Source code included",
      ],
      popular: false,
    },
    {
      tier: "standard",
      name: "Standard Web",
      price: "$600 - $800",
      duration: "1-1.5 months",
      features: [
        "Dynamic website + Admin panel",
        "React/Next.js + Backend API",
        "Database integration",
        "User authentication",
        "Contact forms + Email",
        "Docker deployment + VPS",
        "Domain + SSL",
        "1 month free support",
      ],
      popular: true,
    },
    {
      tier: "premium",
      name: "Premium Web",
      price: "$1000 - $2000",
      duration: "2-3 months",
      features: [
        "E-commerce or complex web app",
        "Full-stack with Node.js/Spring Boot",
        "Payment gateway + Real-time chat",
        "PostgreSQL + Redis caching",
        "Analytics dashboard",
        "CI/CD pipeline",
        "Custom domain + CDN",
        "3 months support",
      ],
      popular: false,
    },
  ];

  const mobilePackages = [
    {
      tier: "basic",
      name: "Basic Mobile",
      price: "$400 - $600",
      duration: "3-4 weeks",
      features: [
        "React Native (iOS + Android)",
        "3-4 main screens",
        "Login, profile, list views",
        "API integration",
        "App store help",
      ],
      popular: false,
    },
    {
      tier: "standard",
      name: "Standard Mobile",
      price: "$1500 - $1800",
      duration: "1.5-2 months",
      features: [
        "Full-featured app",
        "Complex UI/UX + animations",
        "Backend + Database",
        "Push notifications",
        "Docker backend",
        "Store submission support",
      ],
      popular: true,
    },
    {
      tier: "premium",
      name: "Premium Mobile",
      price: "$2000 - $3000",
      duration: "2-3 months",
      features: [
        "Enterprise-level app",
        "Real-time features (Socket.IO)",
        "Payment integration",
        "AI features (recognition, chatbot)",
        "Analytics + tracking",
        "Full infrastructure setup",
        "3 months support",
      ],
      popular: false,
    },
  ];

  const backendPackages = [
    {
      tier: "standard",
      name: "API Development",
      price: "$200 - $400",
      duration: "2-3 weeks",
      features: [
        "RESTful API + docs",
        "Node.js/Express or Spring Boot",
        "Database design",
        "Authentication system",
        "Docker deployment",
        "Domain + SSL",
      ],
      popular: false,
    },
    {
      tier: "standard",
      name: "Full Infrastructure",
      price: "$1000 - $2000",
      duration: "1-2 weeks",
      features: [
        "Complete Docker setup",
        "Database config (PostgreSQL/MongoDB/Redis)",
        "Domain + DNS setup",
        "SSL certificate",
        "Server monitoring",
      ],
      popular: true,
    },
  ];

  const comboPackages = [
    {
      tier: "standard",
      name: "Startup Package",
      price: "$1000 - $1500",
      duration: "2-3 months",
      features: [
        "Responsive website",
        "Web app with backend",
        "API + Database",
        "Docker deployment",
        "Domain + SSL (1 year)",
        "Basic admin panel",
        "1 month support",
      ],
      popular: true,
      badge: "Best for MVPs",
    },
    {
      tier: "premium",
      name: "Super Combo Package",
      price: "$2500 - $5000",
      duration: "3-6 months",
      features: [
        "Web + Mobile + Backend platform",
        "Advanced features + real-time",
        "Payment gateway",
        "AI-powered chatbot",
        "PostgreSQL + Redis",
        "Admin dashboard + analytics",
        "High-availability setup",
        "Security audit",
        "6-12 months support",
      ],
      popular: false,
      badge: "Most Complete",
    },
  ];

  const getPackagesByCategory = () => {
    switch (selectedCategory) {
      case "web":
        return { title: "Web Development", packages: webPackages };
      case "mobile":
        return { title: "Mobile Apps", packages: mobilePackages };
      case "backend":
        return { title: "Backend & Infrastructure", packages: backendPackages };
      case "combo":
        return { title: "Combo Packages", packages: comboPackages };
      default:
        return null;
    }
  };

  const PackageCard = ({ pkg }) => {
    const tierStyles = {
      basic: {
        border: "border-l-4 border-gray-400",
        accent: "bg-gray-100 dark:bg-gray-700",
      },
      standard: {
        border: "border-l-4 border-blue-500",
        accent: "bg-blue-50 dark:bg-blue-900/30",
      },
      premium: {
        border: "border-l-4 border-purple-500",
        accent: "bg-purple-50 dark:bg-purple-900/30",
      },
    };

    const style = tierStyles[pkg.tier] || tierStyles.basic;

    return (
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-md ${style.border} p-6 hover:shadow-xl transition-shadow duration-200 flex flex-col h-full`}
      >
        {pkg.popular && (
          <div className="absolute -top-3 right-4">
            <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
              <Star size={12} fill="currentColor" />
              Popular
            </span>
          </div>
        )}

        {pkg.badge && !pkg.popular && (
          <div className="absolute -top-3 right-4">
            <span className="bg-purple-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              {pkg.badge}
            </span>
          </div>
        )}

        <div className="mb-5">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {pkg.name}
          </h3>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {pkg.price}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
            <Clock size={14} />
            <span>{pkg.duration}</span>
          </div>
        </div>

        <div className={`${style.accent} rounded-md p-4 mb-5 flex-grow`}>
          <ul className="space-y-2.5">
            {pkg.features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm"
              >
                <CheckCircle2
                  size={16}
                  className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <button className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold py-2.5 px-4 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 mt-auto">
          Get Started
          <ArrowRight size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16">
        <FadeUp>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
              Services & Pricing
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Simple, transparent pricing for projects of all sizes
            </p>
          </div>
        </FadeUp>

        {/* Quick info badges */}
        <FadeUp delay={0.2}>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Free 30min consultation
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <DollarSign size={16} className="text-blue-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Flexible payments
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <Wrench size={16} className="text-purple-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Support included
              </span>
            </div>
          </div>
        </FadeUp>

        {/* Category tabs */}
        <FadeUp delay={0.3}>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all text-sm ${
                    selectedCategory === cat.id
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon size={16} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </FadeUp>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {selectedCategory === "all" ? (
          <div className="space-y-16">
            {/* Web */}
            <FadeUp delay={0.1}>
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Code className="text-blue-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Web Development
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {webPackages.map((pkg, idx) => (
                    <PackageCard key={idx} pkg={pkg} index={idx} />
                  ))}
                </div>
              </section>
            </FadeUp>

            {/* Mobile */}
            <FadeUp delay={0.2}>
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Smartphone className="text-purple-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Mobile Apps
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mobilePackages.map((pkg, idx) => (
                    <PackageCard key={idx} pkg={pkg} index={idx} />
                  ))}
                </div>
              </section>
            </FadeUp>

            {/* Backend */}
            <FadeUp delay={0.3}>
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Server className="text-green-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Backend & Infrastructure
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {backendPackages.map((pkg, idx) => (
                    <PackageCard key={idx} pkg={pkg} index={idx} />
                  ))}
                </div>
              </section>
            </FadeUp>

            {/* Combo - highlighted section */}
            <FadeUp delay={0.4}>
              <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 -mx-4">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="text-yellow-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Combo Packages
                    <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                      (Recommended)
                    </span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {comboPackages.map((pkg, idx) => (
                    <PackageCard key={idx} pkg={pkg} index={idx} />
                  ))}
                </div>
              </section>
            </FadeUp>
          </div>
        ) : (
          <FadeUp>
            <section>
              {getPackagesByCategory() && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {getPackagesByCategory().title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getPackagesByCategory().packages.map((pkg, idx) => (
                      <PackageCard key={idx} pkg={pkg} index={idx} />
                    ))}
                  </div>
                </>
              )}
            </section>
          </FadeUp>
        )}
      </div>

      {/* CTA */}
      <FadeUp delay={0.5}>
        <div className="max-w-3xl mx-auto mt-20 bg-gray-900 dark:bg-gray-800 rounded-xl p-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            Have a project in mind?
          </h2>
          <p className="text-gray-300 mb-6">
            Let's discuss your requirements and find the best solution
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Schedule a Call
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors">
              Email Me
            </button>
          </div>
        </div>
      </FadeUp>
    </div>
  );
};

export default ServicesPage;
