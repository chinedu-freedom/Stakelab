'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Mail, Building, Globe } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#061127] text-slate-100 font-sans selection:bg-[#ff0044] selection:text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        {/* Navigation Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0a1835] border border-[#182848] text-slate-300 hover:text-white text-xs font-bold transition-all shadow-md group"
          >
            <ArrowLeft className="w-4 h-4 text-[#ff0044] group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
          <span className="text-xs font-semibold text-slate-400 font-mono">EverStake Legal</span>
        </div>

        {/* Main Document Card */}
        <div className="bg-[#0a1835] border border-[#182848] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
          {/* Subtle Glow Header Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ff0044] via-[#fe780b] to-[#ff0044]" />

          {/* Title Header */}
          <div className="border-b border-[#182848] pb-6 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff0044]/10 border border-[#ff0044]/30 text-[#ff0044] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Legal Documentation
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-righteous tracking-wide">
              Privacy Policy
            </h1>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400 pt-1">
              <span>Effective Date: 28-08-2018</span>
              <span>•</span>
              <span>Last Updated: 28-08-2020</span>
            </div>
          </div>

          {/* Document Content */}
          <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
            <p className="text-base text-slate-200 font-medium">
              EverStake respects your privacy and is committed to protecting the personal information entrusted to us. This Privacy Policy explains how we collect, use, store, protect, and disclose information when you access or use EverStake websites, platforms, applications, staking services, and related products (collectively, the “Services”).
            </p>
            <p className="text-xs text-slate-400 italic">
              By accessing or using our Services, you acknowledge that you have read and understood this Privacy Policy.
            </p>

            {/* Section 1 */}
            <div className="space-y-3 pt-2">
              <h2 className="text-lg font-bold text-white font-righteous flex items-center gap-2 border-b border-[#182848] pb-2">
                <span className="text-[#ff0044]">1.</span> Information We Collect
              </h2>
              <p>Depending on how you use our Services, we may collect:</p>
              
              <div className="space-y-3 pl-2 sm:pl-4">
                <h3 className="font-bold text-slate-100 text-sm">Account Information</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Telephone number</li>
                  <li>Username and account credentials</li>
                  <li>Country or jurisdiction</li>
                  <li>Account preferences</li>
                </ul>

                <h3 className="font-bold text-slate-100 text-sm pt-2">Verification Information</h3>
                <p className="text-xs text-slate-300">
                  Where required for security, compliance, or regulatory purposes, we may request information necessary to verify your identity, including identification documents, proof of address, or other verification information.
                </p>

                <h3 className="font-bold text-slate-100 text-sm pt-2">Transaction Information</h3>
                <p className="text-xs text-slate-300">
                  We may collect information relating to deposits, withdrawals, staking transactions, rewards, wallet addresses, blockchain transactions, transaction identifiers, and related activity.
                </p>

                <h3 className="font-bold text-slate-100 text-sm pt-2">Technical Information</h3>
                <p className="text-xs text-slate-300">
                  When you access our Services, we may automatically collect information such as IP address, device type, browser type, operating system, approximate location, access times, pages viewed, and security or diagnostic information.
                </p>

                <h3 className="font-bold text-slate-100 text-sm pt-2">Communications</h3>
                <p className="text-xs text-slate-300">
                  We may retain communications between you and EverStake, including support requests, correspondence, feedback, and other communications submitted through our Services.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-3 pt-4">
              <h2 className="text-lg font-bold text-white font-righteous flex items-center gap-2 border-b border-[#182848] pb-2">
                <span className="text-[#ff0044]">2.</span> How We Use Your Information
              </h2>
              <p>We may use collected information to:</p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300 pl-2 sm:pl-4">
                <li>Create and manage your EverStake account.</li>
                <li>Provide and maintain our Services.</li>
                <li>Process staking-related requests and transactions.</li>
                <li>Verify account ownership and protect against unauthorized activity.</li>
                <li>Detect, investigate, and prevent fraud, abuse, security incidents, and unlawful activity.</li>
                <li>Communicate with you regarding your account and Services.</li>
                <li>Provide customer support.</li>
                <li>Improve our platform, systems, security, and user experience.</li>
                <li>Comply with applicable legal, regulatory, tax, and law-enforcement requirements.</li>
                <li>Enforce our Terms of Service and other applicable policies.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-3 pt-4">
              <h2 className="text-lg font-bold text-white font-righteous flex items-center gap-2 border-b border-[#182848] pb-2">
                <span className="text-[#ff0044]">3.</span> Blockchain and Public Information
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Blockchain networks are generally decentralized and may record transaction information publicly and permanently.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Where you use blockchain-based Services, certain information, including wallet addresses, transaction hashes, transaction amounts, timestamps, and other blockchain data, may be visible on the relevant blockchain network.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                EverStake does not control the operation, privacy characteristics, or permanence of third-party blockchain networks.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-3 pt-4">
              <h2 className="text-lg font-bold text-white font-righteous flex items-center gap-2 border-b border-[#182848] pb-2">
                <span className="text-[#ff0044]">4.</span> Information Sharing
              </h2>
              <p className="text-xs text-slate-300 font-semibold">We do not sell your personal information as a commercial product.</p>
              <p className="text-xs text-slate-300">We may share information where reasonably necessary with:</p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300 pl-2 sm:pl-4">
                <li>Service providers supporting our infrastructure and operations.</li>
                <li>Identity verification, compliance, fraud prevention, and security providers.</li>
                <li>Blockchain infrastructure providers and technical partners.</li>
                <li>Professional advisers, auditors, insurers, or legal representatives.</li>
                <li>Regulators, courts, law-enforcement authorities, or other governmental bodies where legally required.</li>
                <li>Successors or counterparties in connection with a merger, acquisition, restructuring, financing, or sale of assets.</li>
              </ul>
              <p className="text-xs text-slate-400 italic">We seek to limit disclosures to information reasonably necessary for the applicable purpose.</p>
            </div>

            {/* Section 5 */}
            <div className="space-y-3 pt-4">
              <h2 className="text-lg font-bold text-white font-righteous flex items-center gap-2 border-b border-[#182848] pb-2">
                <span className="text-[#ff0044]">5.</span> Data Security
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                We maintain reasonable administrative, technical, and organizational safeguards designed to protect information against unauthorized access, alteration, disclosure, destruction, or misuse.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                However, no internet-based system, digital platform, or method of electronic transmission can be guaranteed to be completely secure.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-medium text-amber-300">
                You are responsible for maintaining the confidentiality of your account credentials and for taking reasonable precautions to secure your devices, email accounts, passwords, and wallet information.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-3 pt-4">
              <h2 className="text-lg font-bold text-white font-righteous flex items-center gap-2 border-b border-[#182848] pb-2">
                <span className="text-[#ff0044]">6.</span> Data Retention
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                We retain information for as long as reasonably necessary to provide our Services, maintain business and security records, comply with legal and regulatory obligations, resolve disputes, enforce agreements, and protect our legitimate interests.
              </p>
              <p className="text-xs text-slate-300">Retention periods may vary depending on the type and purpose of the information.</p>
            </div>

            {/* Section 7 */}
            <div className="space-y-3 pt-4">
              <h2 className="text-lg font-bold text-white font-righteous flex items-center gap-2 border-b border-[#182848] pb-2">
                <span className="text-[#ff0044]">7.</span> Third-Party Services
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our Services may contain integrations, links, or connections to third-party services, websites, wallets, blockchain networks, or applications.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                EverStake is not responsible for the privacy practices or security of third parties. You should review the privacy policies applicable to those services before providing information to them.
              </p>
            </div>

            {/* Section 8 */}
            <div className="space-y-3 pt-4">
              <h2 className="text-lg font-bold text-white font-righteous flex items-center gap-2 border-b border-[#182848] pb-2">
                <span className="text-[#ff0044]">8.</span> International Data Transfers
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Depending on our service providers and operational infrastructure, your information may be processed or stored in jurisdictions different from your country of residence.
              </p>
              <p className="text-xs text-slate-300">Where required by applicable law, appropriate safeguards will be applied to international transfers.</p>
            </div>

            {/* Section 9 */}
            <div className="space-y-3 pt-4">
              <h2 className="text-lg font-bold text-white font-righteous flex items-center gap-2 border-b border-[#182848] pb-2">
                <span className="text-[#ff0044]">9.</span> Your Rights
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Depending on your jurisdiction, you may have rights relating to your personal information, including rights to access, correct, delete, restrict, object to, or obtain a copy of certain information.
              </p>
              <p className="text-xs text-slate-300">
                Requests may be submitted through our official support channels. We may need to verify your identity before processing certain requests.
              </p>
            </div>

            {/* Section 10 */}
            <div className="space-y-3 pt-4">
              <h2 className="text-lg font-bold text-white font-righteous flex items-center gap-2 border-b border-[#182848] pb-2">
                <span className="text-[#ff0044]">10.</span> Children’s Privacy
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our Services are not intended for individuals who are not legally permitted to use financial or cryptocurrency-related services in their jurisdiction.
              </p>
              <p className="text-xs text-slate-300">We do not knowingly collect personal information from children in violation of applicable law.</p>
            </div>

            {/* Section 11 */}
            <div className="space-y-3 pt-4">
              <h2 className="text-lg font-bold text-white font-righteous flex items-center gap-2 border-b border-[#182848] pb-2">
                <span className="text-[#ff0044]">11.</span> Policy Updates
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our Services, technology, legal obligations, or business practices.
              </p>
              <p className="text-xs text-slate-300">
                Updated versions will be published through our Services and will become effective from the stated effective date.
              </p>
            </div>

            {/* Section 12: Contact Us & Address */}
            <div className="space-y-4 pt-6">
              <h2 className="text-lg font-bold text-white font-righteous flex items-center gap-2 border-b border-[#182848] pb-2">
                <span className="text-[#ff0044]">12.</span> Contact Us
              </h2>
              <p className="text-xs text-slate-300">
                For questions, privacy requests, or concerns regarding this Privacy Policy, please contact EverStake through the official support channels provided on our platform.
              </p>

              <div className="bg-[#060f22] border border-[#182848] rounded-2xl p-5 space-y-3 text-xs">
                <div className="flex items-center gap-2.5 text-slate-200">
                  <Globe className="w-4 h-4 text-[#ff0044] shrink-0" />
                  <span className="text-slate-400">Official Website:</span>
                  <a href="https://everstake.cx" target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:text-[#ff0044] transition-colors">
                    EverStake.cx
                  </a>
                </div>

                <div className="flex items-start gap-2.5 text-slate-200">
                  <Mail className="w-4 h-4 text-[#ff0044] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block mb-1">Official Support Email:</span>
                    <div className="font-mono text-xs font-bold text-white space-y-0.5">
                      <p>Info@everstake.cx</p>
                      <p>admin@everstake.cx</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-slate-200 pt-2 border-t border-[#182848]">
                  <Building className="w-4 h-4 text-[#ff0044] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block mb-1">Registered Company Address:</span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      c/o Hermes Corporate Services Ltd., Fifth Floor, Zephyr House, 122 Mary Street, George Town, P.O. Box 31493, Grand Cayman KY1-1206, Cayman Islands.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Quick Legal Switcher */}
          <div className="pt-6 border-t border-[#182848] flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-400">
            <span>© {new Date().getFullYear()} EverStake Platform. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
              <span>•</span>
              <Link href="/staking-policy" className="hover:text-white transition-colors">Staking Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
