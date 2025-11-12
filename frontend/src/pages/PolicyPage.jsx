import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function PolicyPage() {
  const [activeTab, setActiveTab] = useState("privacy");

  const tabs = [
    { id: "privacy", label: "Privacy Policy", icon: "🔒" },
    { id: "cookies", label: "Cookie Policy", icon: "🍪" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Legal & Privacy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Your privacy and security are our top priorities. Read our policies
            to understand how we protect your data.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Last Updated: November 12, 2025
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white dark:bg-gray-900 p-2 rounded-xl shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[150px] px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 md:p-12">
          {activeTab === "privacy" && <PrivacyPolicy />}
          {activeTab === "terms" && <TermsOfService />}
          {activeTab === "cookies" && <CookiePolicy />}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Have Questions?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              If you have any questions about our policies, please don't
              hesitate to contact us.
            </p>
            <Link
              to="/about"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Privacy Policy Component
function PrivacyPolicy() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Privacy Policy
      </h2>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          1. Introduction
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Welcome to TechBlog ("we," "our," or "us"). We respect your privacy
          and are committed to protecting your personal data. This privacy
          policy explains how we collect, use, and safeguard your information
          when you use our website and services.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          2. Information We Collect
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              2.1 Information from Google Authentication
            </h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              When you sign in with Google, we collect:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 ml-4 mt-2 space-y-1">
              <li>Your email address</li>
              <li>Your name</li>
              <li>Your Google profile picture (if available)</li>
              <li>Your unique Google user ID</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              2.2 Usage Data
            </h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We automatically collect certain information when you visit our
              website:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 ml-4 mt-2 space-y-1">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Pages you visit and time spent</li>
              <li>Device information</li>
              <li>Referring website</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              2.3 Content You Create
            </h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              If you're an admin user, we store:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 ml-4 mt-2 space-y-1">
              <li>Blog posts you create</li>
              <li>Comments you make</li>
              <li>Categories you manage</li>
              <li>Images you upload</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          3. How We Use Your Information
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
          We use your information for the following purposes:
        </p>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 ml-4 space-y-2">
          <li>To provide and maintain our services</li>
          <li>To authenticate your identity when you log in</li>
          <li>To display your profile information</li>
          <li>To send you notifications about your account</li>
          <li>To improve our website and user experience</li>
          <li>To analyze website traffic and usage patterns</li>
          <li>To prevent fraud and abuse</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          4. Data Storage and Security
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
          We take data security seriously and implement appropriate measures to
          protect your information:
        </p>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 ml-4 space-y-2">
          <li>
            Passwords are hashed using industry-standard bcrypt encryption
          </li>
          <li>All data transmission uses HTTPS encryption</li>
          <li>
            Access to user data is restricted to authorized personnel only
          </li>
          <li>We regularly update our security measures</li>
          <li>JWT tokens are used for secure authentication</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          5. Third-Party Services
        </h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Google OAuth 2.0
            </h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We use Google OAuth 2.0 for authentication. Your login is
              processed by Google, and we only receive the information you
              authorize. Please review{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Google's Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          6. Your Rights
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
          You have the following rights regarding your personal data:
        </p>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 ml-4 space-y-2">
          <li>
            <strong>Access:</strong> Request a copy of your personal data
          </li>
          <li>
            <strong>Correction:</strong> Update or correct inaccurate data
          </li>
          <li>
            <strong>Deletion:</strong> Request deletion of your account and data
          </li>
          <li>
            <strong>Portability:</strong> Receive your data in a portable format
          </li>
          <li>
            <strong>Withdrawal:</strong> Withdraw consent at any time
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          7. Data Retention
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          We retain your personal data only for as long as necessary to fulfill
          the purposes outlined in this policy. When you delete your account, we
          will remove your personal information from our active databases within
          30 days.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          8. Children's Privacy
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Our services are not intended for users under 13 years of age. We do
          not knowingly collect information from children under 13. If you
          believe we have collected data from a child, please contact us
          immediately.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          9. Changes to This Policy
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          We may update this privacy policy from time to time. We will notify
          you of any changes by posting the new policy on this page and updating
          the "Last Updated" date.
        </p>
      </section>
    </div>
  );
}

// Terms of Service Component
function TermsOfService() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Terms of Service
      </h2>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          1. Acceptance of Terms
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          By accessing and using TechBlog, you accept and agree to be bound by
          these Terms of Service. If you do not agree to these terms, please do
          not use our website.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          2. User Accounts
        </h3>
        <div className="space-y-3 text-gray-600 dark:text-gray-400">
          <p className="leading-relaxed">
            When you create an account on TechBlog:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>You must provide accurate and complete information</li>
            <li>You are responsible for maintaining account security</li>
            <li>You must notify us immediately of any unauthorized access</li>
            <li>You are responsible for all activities under your account</li>
            <li>One person may not maintain multiple accounts</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          3. User Conduct
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
          You agree NOT to:
        </p>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 ml-4 space-y-2">
          <li>Post illegal, harmful, or offensive content</li>
          <li>Harass, threaten, or abuse other users</li>
          <li>Spam or send unsolicited messages</li>
          <li>Impersonate others or misrepresent your identity</li>
          <li>Violate intellectual property rights</li>
          <li>Attempt to hack or disrupt the website</li>
          <li>Use automated scripts or bots</li>
          <li>Collect user data without permission</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          4. Content Ownership
        </h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              4.1 Your Content
            </h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              You retain ownership of content you create. By posting content,
              you grant us a worldwide, non-exclusive, royalty-free license to
              use, display, and distribute your content on our platform.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              4.2 Our Content
            </h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              All website design, code, graphics, and original content are owned
              by TechBlog and protected by copyright laws. You may not copy,
              reproduce, or distribute our content without permission.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          5. Intellectual Property
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          If you believe your intellectual property has been infringed, please
          contact us with:
        </p>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 ml-4 mt-2 space-y-1">
          <li>Description of the copyrighted work</li>
          <li>URL where the material is located</li>
          <li>Your contact information</li>
          <li>A statement of good faith belief</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          6. Disclaimer of Warranties
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          TechBlog is provided "AS IS" without warranties of any kind. We do not
          guarantee that the website will be error-free, uninterrupted, or free
          from harmful components. Use at your own risk.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          7. Limitation of Liability
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          To the maximum extent permitted by law, TechBlog shall not be liable
          for any indirect, incidental, special, consequential, or punitive
          damages arising from your use of the website.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          8. Termination
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          We reserve the right to suspend or terminate your account at any time
          for violations of these terms, without prior notice. You may also
          delete your account at any time through your profile settings.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          9. Governing Law
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          These terms shall be governed by and construed in accordance with the
          laws of your jurisdiction, without regard to its conflict of law
          provisions.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          10. Changes to Terms
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          We may modify these terms at any time. Continued use of the website
          after changes constitutes acceptance of the new terms. We will notify
          users of significant changes.
        </p>
      </section>
    </div>
  );
}

// Cookie Policy Component
function CookiePolicy() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Cookie Policy
      </h2>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          1. What Are Cookies?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Cookies are small text files that are placed on your device when you
          visit our website. They help us provide you with a better experience
          by remembering your preferences and understanding how you use our
          site.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          2. Types of Cookies We Use
        </h3>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              2.1 Essential Cookies
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Required for the website to function properly. These include:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-sm ml-4 mt-2 space-y-1">
              <li>
                <strong>Authentication tokens:</strong> Keep you logged in
              </li>
              <li>
                <strong>Session data:</strong> Maintain your session state
              </li>
              <li>
                <strong>Security cookies:</strong> Protect against CSRF attacks
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              2.2 Preference Cookies
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Remember your preferences and settings:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-sm ml-4 mt-2 space-y-1">
              <li>
                <strong>Theme preference:</strong> Dark mode or light mode
              </li>
              <li>
                <strong>Language settings:</strong> Your preferred language
              </li>
              <li>
                <strong>Layout preferences:</strong> Customized view settings
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              2.3 Analytics Cookies
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Help us understand how visitors use our website:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-sm ml-4 mt-2 space-y-1">
              <li>Page views and visit duration</li>
              <li>Popular content and features</li>
              <li>User journey and navigation patterns</li>
              <li>Device and browser information</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          3. Local Storage
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
          In addition to cookies, we use browser local storage to store:
        </p>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 ml-4 space-y-2">
          <li>
            <strong>JWT Authentication Token:</strong> Keeps you logged in
            between sessions
          </li>
          <li>
            <strong>User Profile Data:</strong> Your username, email, and role
          </li>
          <li>
            <strong>Theme Preference:</strong> Dark/light mode selection
          </li>
        </ul>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-3">
          This data is stored locally on your device and is not transmitted to
          our servers except when necessary for authentication.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          4. Third-Party Cookies
        </h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Google OAuth
            </h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              When you sign in with Google, Google may set cookies on your
              device. These cookies are governed by{" "}
              <a
                href="https://policies.google.com/technologies/cookies"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Google's Cookie Policy
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          5. Managing Cookies
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
          You have several options to manage cookies:
        </p>

        <div className="space-y-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Browser Settings
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Most browsers allow you to:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-sm ml-4 mt-2 space-y-1">
              <li>View and delete cookies</li>
              <li>Block all cookies</li>
              <li>Block third-party cookies only</li>
              <li>Clear cookies when you close your browser</li>
            </ul>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              ⚠️ Important Note
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Blocking essential cookies may prevent you from using certain
              features of our website, including the ability to log in and
              access your account.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          6. Cookie Lifespan
        </h3>
        <div className="space-y-3 text-gray-600 dark:text-gray-400">
          <p className="leading-relaxed">
            Different cookies have different lifespans:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>
              <strong>Session Cookies:</strong> Deleted when you close your
              browser
            </li>
            <li>
              <strong>Authentication Token:</strong> Valid for 24 hours or until
              logout
            </li>
            <li>
              <strong>Preference Cookies:</strong> Stored until you clear them
              or change settings
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Typically expire after 2 years
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          7. Do Not Track Signals
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Our website respects Do Not Track (DNT) browser settings. When DNT is
          enabled, we limit the collection of analytics data and do not track
          your browsing behavior across other websites.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          8. Updates to This Policy
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          We may update this Cookie Policy from time to time. Any changes will
          be posted on this page with an updated revision date. We encourage you
          to review this policy periodically.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          9. Contact Us About Cookies
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          If you have questions about our use of cookies or other tracking
          technologies, please contact us through our About page or email us
          directly.
        </p>
      </section>
    </div>
  );
}
