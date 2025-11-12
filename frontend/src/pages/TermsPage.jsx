import React from "react";
import { Link } from "react-router-dom";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using TechBlog. By
            accessing our website, you agree to be bound by these terms.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Last Updated: <strong>November 12, 2025</strong>
            </span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            📋 Quick Navigation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <a
              href="#acceptance"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              1. Acceptance of Terms
            </a>
            <a
              href="#accounts"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              2. User Accounts
            </a>
            <a
              href="#conduct"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              3. User Conduct
            </a>
            <a
              href="#content"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              4. Content & Ownership
            </a>
            <a
              href="#intellectual"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              5. Intellectual Property
            </a>
            <a
              href="#prohibited"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              6. Prohibited Activities
            </a>
            <a
              href="#disclaimers"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              7. Disclaimers
            </a>
            <a
              href="#liability"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              8. Limitation of Liability
            </a>
            <a
              href="#termination"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              9. Termination
            </a>
            <a
              href="#changes"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              10. Changes to Terms
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 md:p-12">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {/* Section 1 */}
            <section id="acceptance" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full mr-3 text-sm font-bold">
                  1
                </span>
                Acceptance of Terms
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  Welcome to TechBlog! These Terms of Service ("Terms")
                  constitute a legally binding agreement between you and
                  TechBlog ("we," "us," or "our") governing your use of our
                  website, services, and applications.
                </p>
                <p>
                  By accessing, browsing, or using TechBlog, you acknowledge
                  that you have read, understood, and agree to be bound by these
                  Terms. If you do not agree with any part of these Terms, you
                  must not use our services.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="accounts" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full mr-3 text-sm font-bold">
                  2
                </span>
                User Accounts
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  2.1 Account Creation
                </h3>
                <p>
                  To access certain features of TechBlog, you must create an
                  account using Google OAuth authentication. When creating an
                  account, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Not create an account for fraudulent purposes</li>
                  <li>Not create multiple accounts for the same person</li>
                  <li>
                    Not share your account credentials with any third party
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  2.2 Account Security
                </h3>
                <p>
                  You are responsible for maintaining the security of your
                  account. This includes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Keeping your Google account credentials secure</li>
                  <li>
                    Notifying us immediately of any unauthorized access or
                    security breach
                  </li>
                  <li>
                    Taking responsibility for all activities that occur under
                    your account
                  </li>
                  <li>Logging out from shared or public computers after use</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  2.3 Account Termination
                </h3>
                <p>
                  You may delete your account at any time through your profile
                  settings. We reserve the right to suspend or terminate
                  accounts that violate these Terms without prior notice.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="conduct" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full mr-3 text-sm font-bold">
                  3
                </span>
                User Conduct
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  You agree to use TechBlog in a respectful and lawful manner.
                  The following behaviors are strictly prohibited:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                      ❌ Content Violations
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>• Posting illegal content</li>
                      <li>• Sharing harmful or offensive material</li>
                      <li>• Distributing malware or viruses</li>
                      <li>• Posting spam or advertisements</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                      ❌ User Violations
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>• Harassment or bullying</li>
                      <li>• Impersonating others</li>
                      <li>• Sharing private information</li>
                      <li>• Creating fake accounts</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                      ❌ Technical Violations
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>• Attempting to hack the site</li>
                      <li>• Using automated bots</li>
                      <li>• Scraping content without permission</li>
                      <li>• Overloading servers (DDoS)</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                      ❌ Legal Violations
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>• Copyright infringement</li>
                      <li>• Trademark misuse</li>
                      <li>• Violating privacy laws</li>
                      <li>• Fraudulent activities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="content" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full mr-3 text-sm font-bold">
                  4
                </span>
                Content & Ownership
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  4.1 Your Content
                </h3>
                <p>
                  You retain all ownership rights to the content you create,
                  post, or submit on TechBlog ("User Content"). However, by
                  posting content, you grant us the following rights:
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    License Grant:
                  </p>
                  <p className="text-sm">
                    A worldwide, non-exclusive, royalty-free, transferable
                    license to use, reproduce, distribute, prepare derivative
                    works of, display, and perform your User Content in
                    connection with operating and providing TechBlog services.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  4.2 Content Responsibility
                </h3>
                <p>
                  You are solely responsible for your User Content. You
                  represent and warrant that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    You own or have the necessary rights to post your content
                  </li>
                  <li>Your content does not violate any third-party rights</li>
                  <li>
                    Your content complies with these Terms and applicable laws
                  </li>
                  <li>Your content is accurate and not misleading</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  4.3 Our Content
                </h3>
                <p>
                  All content on TechBlog, including but not limited to text,
                  graphics, logos, images, software, and design ("Our Content"),
                  is owned by or licensed to TechBlog and protected by
                  intellectual property laws.
                </p>
                <p>
                  You may not copy, modify, distribute, sell, or lease any part
                  of Our Content without our express written permission.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  4.4 Content Moderation
                </h3>
                <p>
                  We reserve the right, but are not obligated, to monitor,
                  review, edit, or remove any User Content at our sole
                  discretion, for any reason, including violation of these
                  Terms.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="intellectual" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full mr-3 text-sm font-bold">
                  5
                </span>
                Intellectual Property
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  5.1 Copyright Policy
                </h3>
                <p>
                  We respect intellectual property rights and expect our users
                  to do the same. If you believe your work has been copied in a
                  way that constitutes copyright infringement, please provide us
                  with the following information:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    A description of the copyrighted work you claim has been
                    infringed
                  </li>
                  <li>
                    The URL where the allegedly infringing material is located
                  </li>
                  <li>
                    Your contact information (email, phone number, address)
                  </li>
                  <li>
                    A statement that you have a good faith belief that the use
                    is not authorized
                  </li>
                  <li>
                    A statement that the information you provided is accurate
                  </li>
                  <li>Your physical or electronic signature</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  5.2 Trademark
                </h3>
                <p>
                  "TechBlog," our logo, and any other product or service names
                  are trademarks of TechBlog. You may not use these trademarks
                  without our prior written consent.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  5.3 Repeat Infringer Policy
                </h3>
                <p>
                  We will terminate the accounts of users who are repeat
                  copyright infringers in accordance with applicable law.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="prohibited" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full mr-3 text-sm font-bold">
                  6
                </span>
                Prohibited Activities
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  In addition to other prohibited conduct outlined in these
                  Terms, you specifically agree NOT to:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-xl mt-1">•</span>
                    <p>
                      Use TechBlog for any illegal purpose or in violation of
                      any local, state, national, or international law
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-xl mt-1">•</span>
                    <p>
                      Violate, or encourage others to violate, any right of a
                      third party, including intellectual property rights
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-xl mt-1">•</span>
                    <p>
                      Post or transmit any content that is unlawful, harmful,
                      threatening, abusive, harassing, defamatory, vulgar,
                      obscene, or otherwise objectionable
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-xl mt-1">•</span>
                    <p>
                      Attempt to gain unauthorized access to TechBlog's systems,
                      other user accounts, or networks
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-xl mt-1">•</span>
                    <p>
                      Interfere with or disrupt TechBlog or servers or networks
                      connected to TechBlog
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-xl mt-1">•</span>
                    <p>
                      Use any robot, spider, scraper, or other automated means
                      to access TechBlog without our express written permission
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-xl mt-1">•</span>
                    <p>
                      Collect or harvest any personally identifiable information
                      from TechBlog without consent
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-xl mt-1">•</span>
                    <p>
                      Reverse engineer, decompile, or disassemble any portion of
                      TechBlog
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="disclaimers" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full mr-3 text-sm font-bold">
                  7
                </span>
                Disclaimers & Warranties
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-300 mb-3">
                    ⚠️ IMPORTANT DISCLAIMER
                  </h3>
                  <p className="font-semibold uppercase">
                    TECHBLOG IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                    WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                  </p>
                </div>

                <p>
                  To the fullest extent permitted by law, TechBlog disclaims all
                  warranties, express or implied, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Warranties of merchantability and fitness for a particular
                    purpose
                  </li>
                  <li>
                    Warranties regarding accuracy, reliability, or completeness
                  </li>
                  <li>
                    Warranties that the service will be uninterrupted or
                    error-free
                  </li>
                  <li>Warranties that defects will be corrected</li>
                  <li>Warranties regarding security or freedom from viruses</li>
                </ul>

                <p>We do not warrant that:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>TechBlog will meet your specific requirements</li>
                  <li>
                    The results obtained from using TechBlog will be accurate or
                    reliable
                  </li>
                  <li>
                    The quality of any content or information will meet your
                    expectations
                  </li>
                  <li>Any errors in TechBlog will be corrected</li>
                </ul>

                <p className="text-sm italic">
                  Your use of TechBlog is at your sole risk. Any material
                  downloaded or obtained through TechBlog is done at your own
                  discretion and risk.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="liability" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full mr-3 text-sm font-bold">
                  8
                </span>
                Limitation of Liability
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 p-6 rounded-lg">
                  <p className="font-semibold uppercase text-red-900 dark:text-red-300">
                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO
                    EVENT SHALL TECHBLOG BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                    SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
                  </p>
                </div>

                <p>This includes, without limitation, damages for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Loss of profits, revenue, or business opportunities</li>
                  <li>Loss of data or information</li>
                  <li>Business interruption</li>
                  <li>Personal injury or property damage</li>
                  <li>Loss of privacy</li>
                  <li>
                    Failure of TechBlog to meet any duty, including good faith
                    or reasonable care
                  </li>
                </ul>

                <p>
                  These limitations apply even if TechBlog has been advised of
                  the possibility of such damages and regardless of the legal
                  theory (contract, tort, or otherwise) upon which the claim is
                  based.
                </p>

                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Maximum Liability:
                  </p>
                  <p className="text-sm">
                    Our total liability to you for all claims arising from or
                    related to TechBlog shall not exceed the greater of (a) $100
                    or (b) the amount you paid us in the 12 months before the
                    incident giving rise to liability.
                  </p>
                </div>

                <p className="text-sm italic">
                  Some jurisdictions do not allow the exclusion or limitation of
                  certain damages, so some of the above limitations may not
                  apply to you.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id="termination" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full mr-3 text-sm font-bold">
                  9
                </span>
                Termination
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  9.1 Termination by You
                </h3>
                <p>You may terminate your account at any time by:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Visiting your profile settings</li>
                  <li>Clicking "Delete Account"</li>
                  <li>Confirming your decision</li>
                </ul>
                <p>
                  Upon termination, your access to TechBlog will cease, and your
                  data will be deleted within 30 days in accordance with our
                  Privacy Policy.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  9.2 Termination by Us
                </h3>
                <p>
                  We reserve the right to suspend or terminate your account and
                  access to TechBlog at any time, with or without cause, with or
                  without notice. Reasons for termination may include:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Violation of these Terms of Service</li>
                  <li>Fraudulent, illegal, or harmful activity</li>
                  <li>Extended periods of inactivity</li>
                  <li>Requests by law enforcement or government agencies</li>
                  <li>Technical or security issues</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  9.3 Effect of Termination
                </h3>
                <p>Upon termination:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your right to use TechBlog immediately ceases</li>
                  <li>We may delete your account and User Content</li>
                  <li>
                    You remain liable for any obligations incurred before
                    termination
                  </li>
                  <li>
                    Provisions that should survive termination will remain in
                    effect
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 10 */}
            <section id="changes" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full mr-3 text-sm font-bold">
                  10
                </span>
                Changes to These Terms
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  We reserve the right to modify these Terms at any time. When
                  we make changes, we will:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Update the "Last Updated" date at the top of this page
                  </li>
                  <li>
                    Notify users of material changes via email or website
                    notification
                  </li>
                  <li>Give you an opportunity to review the new Terms</li>
                </ul>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    Your Acceptance:
                  </p>
                  <p className="text-sm">
                    Your continued use of TechBlog after changes to these Terms
                    constitutes your acceptance of the new Terms. If you do not
                    agree to the modified Terms, you must stop using TechBlog.
                  </p>
                </div>

                <p>
                  We encourage you to periodically review these Terms to stay
                  informed of any updates.
                </p>
              </div>
            </section>

            {/* Additional Sections */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Additional Terms
              </h2>
              <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Governing Law
                  </h3>
                  <p>
                    These Terms shall be governed by and construed in accordance
                    with the laws of your jurisdiction, without regard to its
                    conflict of law provisions.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Dispute Resolution
                  </h3>
                  <p>
                    Any disputes arising from these Terms or your use of
                    TechBlog shall be resolved through good faith negotiations.
                    If negotiations fail, disputes will be resolved through
                    binding arbitration or small claims court.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Severability
                  </h3>
                  <p>
                    If any provision of these Terms is found to be unenforceable
                    or invalid, that provision will be limited or eliminated to
                    the minimum extent necessary, and the remaining provisions
                    will remain in full force and effect.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Entire Agreement
                  </h3>
                  <p>
                    These Terms, together with our Privacy Policy and Cookie
                    Policy, constitute the entire agreement between you and
                    TechBlog regarding your use of our services.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Contact Information
                  </h3>
                  <p>
                    If you have any questions about these Terms, please contact
                    us through our{" "}
                    <Link
                      to="/about"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      About page
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              📖 Privacy Policy
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              Learn how we collect, use, and protect your personal information.
            </p>
            <Link
              to="/policy"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              Read Privacy Policy
            </Link>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              ❓ Questions?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              Have questions about our Terms? We're here to help.
            </p>
            <Link
              to="/about"
              className="inline-block px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
