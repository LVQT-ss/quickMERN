import React from "react";
export default function HomePage() {
  const blogPosts = [
    {
      id: 1,
      title: "Getting Started with Web Development",
      excerpt:
        "Learn the fundamentals of web development and start your journey into creating amazing websites and applications.",
      author: "Sarah Johnson",
      date: "Oct 28, 2025",
      category: "Development",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
    },
    {
      id: 2,
      title: "10 Tips for Better Design",
      excerpt:
        "Discover essential design principles that will help you create more beautiful and user-friendly interfaces.",
      author: "Mike Chen",
      date: "Oct 25, 2025",
      category: "Design",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    },
    {
      id: 3,
      title: "The Future of Technology",
      excerpt:
        "Exploring emerging technologies and their potential impact on our daily lives and business operations.",
      author: "Emma Davis",
      date: "Oct 22, 2025",
      category: "Technology",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    },
    {
      id: 4,
      title: "Productivity Hacks for Developers",
      excerpt:
        "Boost your coding efficiency with these proven productivity techniques and workflow optimizations.",
      author: "Alex Martinez",
      date: "Oct 20, 2025",
      category: "Productivity",
      image:
        "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop",
    },
    {
      id: 5,
      title: "Understanding Modern JavaScript",
      excerpt:
        "A comprehensive guide to ES6+ features and modern JavaScript development practices.",
      author: "Sarah Johnson",
      date: "Oct 18, 2025",
      category: "Development",
      image:
        "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=600&fit=crop",
    },
    {
      id: 6,
      title: "Building Responsive Layouts",
      excerpt:
        "Master the art of creating layouts that look great on any device using modern CSS techniques.",
      author: "Mike Chen",
      date: "Oct 15, 2025",
      category: "Design",
      image:
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=600&fit=crop",
    },
  ];

  const recentPosts = [
    { title: "Getting Started with Web Development", date: "Oct 28, 2025" },
    { title: "10 Tips for Better Design", date: "Oct 25, 2025" },
    { title: "The Future of Technology", date: "Oct 22, 2025" },
    { title: "Productivity Hacks for Developers", date: "Oct 20, 2025" },
  ];

  const categories = [
    { name: "Development", count: 24 },
    { name: "Design", count: 18 },
    { name: "Technology", count: 15 },
    { name: "Productivity", count: 12 },
    { name: "Lifestyle", count: 8 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full mb-4">
                Featured Post
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Mastering React Hooks: A Complete Guide
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Dive deep into React Hooks and learn how to build powerful,
                efficient components using modern React patterns. This
                comprehensive guide covers everything from basics to advanced
                techniques.
              </p>
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <span>By Sarah Johnson</span>
                <span className="mx-2">•</span>
                <span>Nov 1, 2025</span>
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Read More
              </button>
            </div>
            <div className="order-first md:order-last">
              <img
                src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop"
                alt="Featured post"
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Blog Posts Grid */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Latest Posts
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded mb-3">
                      {post.category}
                    </span>
                    <h4 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      <a href="#">{post.title}</a>
                    </h4>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>{post.author}</span>
                      <span className="mx-2">•</span>
                      <span>{post.date}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <a
                      href="#"
                      className="text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center"
                    >
                      Read More
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Search</h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">About</h4>
              <p className="text-gray-600 leading-relaxed">
                Welcome to TechBlog! We share insights, tutorials, and thoughts
                on web development, design, and technology. Join our community
                of learners and creators.
              </p>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                Recent Posts
              </h4>
              <ul className="space-y-3">
                {recentPosts.map((post, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm text-gray-500">{post.date}</div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                Categories
              </h4>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="flex justify-between items-center text-gray-700 hover:text-blue-600 transition-colors py-1"
                    >
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500">
                        ({category.count})
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
