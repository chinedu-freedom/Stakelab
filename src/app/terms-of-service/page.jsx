'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, Mail, Building, Globe, AlertTriangle } from 'lucide-react';

export default function TermsOfServicePage() {
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
              <FileText className="w-4 h-4" /> Legal Agreement
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-righteous tracking-wide">
              Terms of Service
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
              These Terms of Service (“Terms”) govern your access to and use of EverStake (“EverStake,” “we,” “our,” or “us”), including our websites, applications, staking platform, accounts, and related services (collectively, the “Services”).
            </p>
            <p className="text-xs text-slate-400 italic">
              By creating an account, accessing, or using the Services, you agree to be legally bound by these Terms. If you do not agree with these Terms, you must not use the Services.
            </p>

            {/* Section: Eligibility */}
            <div className="space-y-3 pt-2 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Eligibility</h2>
              <p className="text-xs text-slate-300">
                You may use EverStake only if you are legally permitted to access and use cryptocurrency and staking-related services under the laws applicable to you.
              </p>
              <p className="text-xs text-slate-300">
                You are responsible for determining whether your use of EverStake is lawful in your jurisdiction.
              </p>
              <p className="text-xs text-slate-300">
                EverStake may restrict or refuse access to users, jurisdictions, assets, or transactions where required by law, regulation, risk-management considerations, or internal policies.
              </p>
            </div>

            {/* Section: Account Registration */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Account Registration</h2>
              <p className="text-xs text-slate-300">Certain Services may require you to create an account.</p>
              <p className="text-xs text-slate-300">
                You agree to provide accurate, current, and complete information and to maintain the accuracy of that information.
              </p>
              <p className="text-xs text-slate-300">
                You are responsible for safeguarding your login credentials and for all activity conducted through your account unless caused by EverStake’s proven failure to maintain reasonable security controls.
              </p>
              <p className="text-xs text-slate-300">
                You must notify EverStake promptly if you suspect unauthorized access to your account.
              </p>
            </div>

            {/* Section: Staking Services */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Staking Services</h2>
              <p className="text-xs text-slate-300">
                EverStake provides infrastructure and services relating to cryptocurrency staking and Proof-of-Stake blockchain networks.
              </p>
              <p className="text-xs text-slate-300 font-semibold text-amber-300">
                Staking involves blockchain, technical, market, liquidity, validator, protocol, and other risks.
              </p>
            </div>

            {/* Section: Staking Plan Types */}
            <div className="space-y-4 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Staking Plan Types</h2>
              <p className="text-xs text-slate-300">
                EverStake may offer two principal categories of staking plans: Fixed Staking Plans and Flexible Staking Plans. The applicable terms, reward structure, duration, and conditions are displayed before participation.
              </p>

              <div className="bg-[#060f22] p-4 rounded-2xl border border-[#182848] space-y-3">
                <h3 className="font-bold text-white text-sm">Fixed Staking Plans</h3>
                <p className="text-xs text-slate-300">
                  A Fixed Staking Plan provides a predetermined staking rate and defined staking period.
                </p>
                <p className="text-xs text-slate-300">
                  Once a Fixed Staking Plan has been successfully activated, the applicable staking rate and scheduled return are fixed for the duration specified by that plan, subject to the plan’s terms and applicable conditions.
                </p>
                <p className="text-xs text-slate-300 font-semibold text-amber-400">
                  A Fixed Staking Plan cannot be converted, transferred, or switched to another staking plan after successful activation.
                </p>
              </div>

              <div className="bg-[#060f22] p-4 rounded-2xl border border-[#182848] space-y-3">
                <h3 className="font-bold text-white text-sm">Flexible Staking Plans</h3>
                <p className="text-xs text-slate-300">
                  A Flexible Staking Plan is designed to allow staking terms, rates, or reward conditions to adjust according to prevailing market conditions, blockchain network conditions, liquidity, protocol changes, and other factors.
                </p>
                <p className="text-xs text-slate-300">
                  Unlike Fixed Staking Plans, the applicable rate or reward under a Flexible Staking Plan may change during the staking period.
                </p>
                <p className="text-xs text-slate-300">
                  Any applicable changes will be reflected or communicated through the EverStake platform where reasonably practicable.
                </p>
                <p className="text-xs text-slate-300 font-medium">
                  Participation in a Flexible Staking Plan therefore means that the user accepts that its applicable rate, reward structure, or other conditions may change during the period of participation.
                </p>
              </div>

              <div className="bg-[#180a0a] border border-[#521818] p-4 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#ff0044] shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-[#ff0044]">Important Notice!</h4>
                  <p className="text-slate-300">
                    Fixed and Flexible Staking Plans operate under different conditions. Users are responsible for reviewing the applicable plan details before activation. Once a staking plan has been successfully activated, it cannot be changed to another plan.
                  </p>
                </div>
              </div>
            </div>

            {/* Section: Staking Plans Are Variable */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Staking Plans Are Variable</h2>
              <p className="text-xs text-slate-300">EverStake staking plans are not stable or permanently fixed.</p>
              <p className="text-xs text-slate-300">
                Staking rates, durations, reward structures, supported assets, minimum or maximum amounts, availability, fees, and other plan characteristics may be changed, suspended, restricted, or discontinued at any time where reasonably necessary due to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 pl-2 sm:pl-4">
                <li>Market conditions;</li>
                <li>Cryptocurrency price volatility;</li>
                <li>Blockchain network conditions;</li>
                <li>Validator performance;</li>
                <li>Protocol changes;</li>
                <li>Liquidity conditions;</li>
                <li>Security considerations;</li>
                <li>Regulatory requirements;</li>
                <li>Operational requirements; or</li>
                <li>Other circumstances affecting the provision of the Services.</li>
              </ul>
              <p className="text-xs text-slate-400">
                Any applicable changes will be communicated through the platform or other appropriate channels where reasonably practicable.
              </p>
            </div>

            {/* Section: Staking Plan Selection */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Staking Plan Selection</h2>
              <p className="text-xs text-slate-300">
                Users are responsible for reviewing the terms and characteristics of a staking plan before participating.
              </p>
              <p className="text-xs text-slate-300">
                Once a staking plan has been successfully activated, it cannot be transferred, converted, or changed into another staking plan.
              </p>
              <p className="text-xs text-slate-300 font-medium text-amber-300">
                A user should therefore select a plan carefully before confirming participation. Where a plan has specific maturity, withdrawal, lock-up, or processing conditions, those conditions apply to the relevant staking position.
              </p>
            </div>

            {/* Section: Cryptocurrency and Market Risk */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Cryptocurrency and Market Risk</h2>
              <p className="text-xs text-slate-300">Cryptocurrency markets are highly volatile.</p>
              <p className="text-xs text-slate-300">
                The value of digital assets may increase or decrease substantially and may become significantly less valuable or, in extreme circumstances, have little or no market value.
              </p>
              <p className="text-xs text-slate-300">
                Staking rewards may also vary depending on blockchain conditions, network participation, validator performance, protocol rules, and other factors.
              </p>
              <p className="text-xs text-slate-300 font-semibold text-red-400">
                EverStake does not guarantee that you will recover the original market value of any digital asset.
              </p>
            </div>

            {/* Section: Transaction Processing and Asset Responsibility */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Transaction Processing and Asset Responsibility</h2>
              <p className="text-xs text-slate-300">
                You are responsible for ensuring that wallet addresses, networks, blockchain assets, amounts, and transaction details supplied by you are accurate before submitting a transaction.
              </p>
              <p className="text-xs text-slate-300">
                Where EverStake has successfully completed the applicable processing of an asset or transaction and the asset has been released, transferred, or otherwise delivered to the wallet or destination specified by the user, EverStake’s responsibility for the asset ends to the extent permitted by applicable law.
              </p>
              <p className="text-xs text-slate-300">
                Once an asset has been successfully processed and released from EverStake’s controlled processing environment, it is no longer held under EverStake’s security or custody.
              </p>
              <p className="text-xs text-slate-300">
                The user is thereafter responsible for the security of the receiving wallet, private keys, seed phrases, passwords, devices, and any subsequent transaction.
              </p>
              <p className="text-xs text-slate-300 font-semibold text-amber-300">
                EverStake cannot recover assets sent to an incorrect address or unsupported network where recovery is technically impossible or not reasonably available.
              </p>
            </div>

            {/* Section: Blockchain Transactions */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Blockchain Transactions</h2>
              <p className="text-xs text-slate-300 font-semibold text-amber-400">Blockchain transactions may be irreversible.</p>
              <p className="text-xs text-slate-300">
                EverStake cannot guarantee that a blockchain transaction can be cancelled, reversed, recovered, or modified after it has been submitted to a blockchain network.
              </p>
              <p className="text-xs text-slate-300">
                Network congestion, blockchain failures, protocol changes, validator issues, forks, attacks, and other blockchain events may affect transaction processing.
              </p>
            </div>

            {/* Section: Fees */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Fees</h2>
              <p className="text-xs text-slate-300">
                Applicable fees, commissions, network charges, or other costs may apply to certain Services.
              </p>
              <p className="text-xs text-slate-300">
                Where reasonably practicable, applicable charges will be presented before a transaction or service is confirmed.
              </p>
              <p className="text-xs text-slate-300">
                Blockchain network fees may be determined by the relevant blockchain network and may change independently of EverStake.
              </p>
            </div>

            {/* Section: Prohibited Activities */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Prohibited Activities</h2>
              <p className="text-xs text-slate-300">You must not use EverStake to:</p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300 pl-2 sm:pl-4">
                <li>Violate applicable laws or regulations.</li>
                <li>Commit fraud or financial crime.</li>
                <li>Facilitate money laundering or terrorist financing.</li>
                <li>Circumvent sanctions or other legal restrictions.</li>
                <li>Gain unauthorized access to accounts, systems, or networks.</li>
                <li>Interfere with the security or operation of the Services.</li>
                <li>Manipulate or exploit the platform.</li>
                <li>Provide false, misleading, or fraudulent information.</li>
                <li>Use the Services for any unlawful purpose.</li>
              </ul>
              <p className="text-xs text-slate-400">
                EverStake may suspend or restrict accounts or transactions where it reasonably believes such action is necessary for security, compliance, investigation, or risk-management purposes.
              </p>
            </div>

            {/* Section: Suspension and Termination */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Suspension and Termination</h2>
              <p className="text-xs text-slate-300">
                EverStake may suspend, restrict, or terminate access to an account or Service where permitted by law and reasonably necessary due to security concerns, suspected abuse, legal requirements, violation of these Terms, operational considerations, or other legitimate reasons.
              </p>
              <p className="text-xs text-slate-300">
                Where appropriate, users will be given notice and an opportunity to resolve the relevant issue.
              </p>
            </div>

            {/* Section: Third-Party Networks and Services */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Third-Party Networks and Services</h2>
              <p className="text-xs text-slate-300">
                EverStake may depend on third-party blockchain networks, infrastructure providers, wallets, custodians, technology providers, or other external services.
              </p>
              <p className="text-xs text-slate-300">
                EverStake does not control third-party networks and cannot guarantee their availability, security, performance, or continued operation.
              </p>
            </div>

            {/* Section: Investment Guarantee */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Investment Guarantee</h2>
              <p className="text-xs text-slate-300">
                Information presented by EverStake regarding applicable staking plans represents the expected performance and returns of those plans. Where expressly stated, EverStake guarantees the specified return for the stated duration, subject to the applicable terms and conditions.
              </p>
            </div>

            {/* Section: Limitation of Liability */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Limitation of Liability</h2>
              <p className="text-xs text-slate-300">
                To the maximum extent permitted by applicable law, EverStake will not be liable for losses resulting from circumstances outside its reasonable control, including blockchain failures, network congestion, market volatility, asset price movements, protocol changes, cyber incidents affecting third parties, incorrect wallet addresses supplied by users, loss of private keys, or actions taken by users.
              </p>
              <p className="text-xs text-slate-300">
                Nothing in these Terms excludes liability that cannot legally be excluded or limited.
              </p>
            </div>

            {/* Section: Intellectual Property */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Intellectual Property</h2>
              <p className="text-xs text-slate-300">
                The EverStake platform, branding, software, content, designs, trademarks, logos, and other intellectual property are owned by or licensed to EverStake unless otherwise stated.
              </p>
              <p className="text-xs text-slate-300">
                You may not reproduce, modify, distribute, reverse engineer, or commercially exploit EverStake intellectual property without appropriate authorization.
              </p>
            </div>

            {/* Section: Changes to These Terms */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Changes to These Terms</h2>
              <p className="text-xs text-slate-300">EverStake may update these Terms from time to time.</p>
              <p className="text-xs text-slate-300">
                The latest version will be made available through the Services. Continued use of EverStake following the effective date of an updated version constitutes acceptance of the revised Terms to the extent permitted by applicable law.
              </p>
            </div>

            {/* Section: Governing Law */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Governing Law</h2>
              <p className="text-xs text-slate-300">
                These Terms shall be governed by and construed in accordance with the laws of the Cayman Islands, without prejudice to any mandatory consumer, statutory, or other legal protections that may apply to you in your jurisdiction.
              </p>
              <p className="text-xs text-slate-300">
                Any dispute shall be handled in accordance with the dispute-resolution procedures applicable under the laws of the relevant jurisdiction.
              </p>
            </div>

            {/* Section: Contact */}
            <div className="space-y-4 pt-2">
              <h2 className="text-lg font-bold text-white font-righteous">Contact</h2>
              <p className="text-xs text-slate-300">
                Questions regarding these Terms may be directed to EverStake through the official support channels available on the platform.
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
                      <p>Support@everstake.cx</p>
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
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span>•</span>
              <Link href="/staking-policy" className="hover:text-white transition-colors">Staking Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
