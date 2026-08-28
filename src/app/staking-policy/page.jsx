'use client';

import Link from 'next/link';
import { ArrowLeft, Coins, Mail, Building, Globe, ShieldCheck, CheckCircle } from 'lucide-react';

export default function StakingPolicyPage() {
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
              <Coins className="w-4 h-4" /> Protocol Policy
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-righteous tracking-wide">
              Staking Policy
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
              This Staking Policy establishes the general framework governing participation in staking services provided through EverStake (“EverStake,” “we,” “our,” or “us”).
            </p>
            <p className="text-xs text-slate-400 italic">
              This Policy should be read together with the EverStake Terms of Service, Privacy Policy, applicable staking-plan information, and any transaction-specific terms presented to you before participation.
            </p>

            {/* Section: What Is Staking? */}
            <div className="space-y-3 pt-2 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">What Is Staking?</h2>
              <p className="text-xs text-slate-300">
                Staking generally involves committing eligible digital assets to support the operation and security of a Proof-of-Stake (“PoS”) blockchain network.
              </p>
              <p className="text-xs text-slate-300">
                Depending on the applicable blockchain protocol, staking may contribute to transaction validation, network security, governance, or other protocol functions.
              </p>
              <p className="text-xs text-slate-300">
                Staking mechanisms and reward structures differ between blockchain networks.
              </p>
            </div>

            {/* Section: Staking Plans */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Staking Plans</h2>
              <p className="text-xs text-slate-300">EverStake may make different staking plans available from time to time.</p>
              <p className="text-xs text-slate-300">Each plan may have its own:</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 pl-2 sm:pl-4">
                <li>Supported digital asset;</li>
                <li>Staking period;</li>
                <li>Reward structure;</li>
                <li>Minimum participation amount;</li>
                <li>Maximum participation amount;</li>
                <li>Processing requirements;</li>
                <li>Withdrawal conditions;</li>
                <li>Fees;</li>
                <li>Eligibility requirements; and</li>
                <li>Other applicable conditions.</li>
              </ul>
              <p className="text-xs text-slate-400">
                Users must review the specific plan information displayed at the time of participation.
              </p>
            </div>

            {/* Section: Plans Are Not Fixed */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Plans Are Not Fixed</h2>
              <p className="text-xs text-slate-300">
                EverStake staking plans are variable and are not guaranteed to remain unchanged.
              </p>
              <p className="text-xs text-slate-300">
                EverStake may modify, suspend, restrict, replace, or discontinue available plans when circumstances reasonably require it.
              </p>
              <p className="text-xs text-slate-300">
                Changes may occur because of market conditions, cryptocurrency volatility, blockchain network conditions, protocol changes, validator conditions, liquidity, security considerations, regulatory requirements, or other operational factors.
              </p>
              <p className="text-xs text-slate-400 italic">
                A plan displayed today may therefore have different terms or availability in the future.
              </p>
            </div>

            {/* Section: No Plan Switching */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">No Plan Switching</h2>
              <p className="text-xs text-slate-300 font-semibold text-amber-300">
                A successfully activated staking position cannot be changed, converted, transferred, or switched to another EverStake staking plan.
              </p>
              <p className="text-xs text-slate-300">
                Users should carefully review the plan terms before confirming participation.
              </p>
              <p className="text-xs text-slate-300">
                Once participation has been successfully confirmed, the selected plan remains subject to the conditions applicable to that position.
              </p>
            </div>

            {/* Section: Rewards */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Rewards</h2>
              <p className="text-xs text-slate-300">
                Staking rewards are dependent upon the applicable plan and the underlying blockchain or staking mechanism.
              </p>
              <p className="text-xs text-slate-300">Rewards may be affected by factors including:</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 pl-2 sm:pl-4">
                <li>Network participation;</li>
                <li>Validator performance;</li>
                <li>Protocol rules;</li>
                <li>Network activity;</li>
                <li>Slashing or penalties;</li>
                <li>Market conditions;</li>
                <li>Blockchain upgrades;</li>
                <li>Technical interruptions; and</li>
                <li>Other factors outside EverStake’s direct control.</li>
              </ul>
            </div>

            {/* Section: Market Stability and Guaranteed Returns */}
            <div className="space-y-3 border-b border-[#182848] pb-5 bg-[#060f22] p-4 rounded-2xl border border-[#182848]">
              <h2 className="text-lg font-bold text-white font-righteous flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" /> Market Stability and Guaranteed Returns
              </h2>
              <p className="text-xs text-slate-300">
                Digital asset values and staking conditions may vary; however, the staking return applicable to a successfully activated Fixed Staking Plan remains fixed for the duration specified by the plan.
              </p>
              <p className="text-xs text-slate-300 font-medium text-emerald-400">
                Where a staking plan expressly states a guaranteed return, the specified return shall be provided in accordance with the plan’s terms and conditions.
              </p>
              <p className="text-xs text-slate-300">
                Market fluctuations in the underlying digital asset do not alter the fixed staking return applicable to an activated Fixed Staking Plan.
              </p>
            </div>

            {/* Section: Processing of Assets */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Processing of Assets</h2>
              <p className="text-xs text-slate-300">
                EverStake may process digital assets through designated infrastructure, wallets, validators, blockchain networks, or third-party service providers depending on the applicable Service.
              </p>
              <p className="text-xs text-slate-300">
                Once an asset has been successfully processed and released to the destination specified by the user, it is no longer under EverStake’s controlled security or custody.
              </p>
              <p className="text-xs text-slate-300">
                Users are responsible for securing assets after successful release or delivery, including maintaining control of private keys, seed phrases, wallet credentials, devices, and authentication methods.
              </p>
              <p className="text-xs text-slate-300 font-semibold text-amber-300">
                EverStake is not responsible for losses caused by a user’s subsequent loss of access, compromised credentials, incorrect destination information, or unauthorized activity occurring after successful release, except where applicable law provides otherwise.
              </p>
            </div>

            {/* Section: Transaction Finality */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Transaction Finality</h2>
              <p className="text-xs text-slate-300 font-semibold text-amber-400">Blockchain transactions may be irreversible.</p>
              <p className="text-xs text-slate-300">Users are responsible for checking:</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 pl-2 sm:pl-4">
                <li>The receiving wallet address;</li>
                <li>The blockchain network;</li>
                <li>The digital asset;</li>
                <li>The transaction amount; and</li>
                <li>Any other transaction details before confirming a transaction.</li>
              </ul>
              <p className="text-xs text-slate-400">
                EverStake may not be able to recover assets sent to an incorrect address or incompatible blockchain network.
              </p>
            </div>

            {/* Section: Network and Protocol Stability */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Network and Protocol Stability</h2>
              <p className="text-xs text-slate-300">
                EverStake’s staking infrastructure is designed to provide reliable, secure, and continuous staking operations across supported blockchain networks.
              </p>
              <p className="text-xs text-slate-300">
                EverStake maintains systems and operational procedures designed to minimize disruptions arising from:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 pl-2 sm:pl-4">
                <li>Blockchain outages;</li>
                <li>Network congestion;</li>
                <li>Validator downtime;</li>
                <li>Slashing events;</li>
                <li>Smart-contract vulnerabilities;</li>
                <li>Blockchain reorganizations;</li>
                <li>Network upgrades;</li>
                <li>Hard forks;</li>
                <li>Consensus issues;</li>
                <li>Cybersecurity incidents;</li>
                <li>Protocol changes; and</li>
                <li>Temporary interruptions or loss of functionality.</li>
              </ul>
              <p className="text-xs text-slate-300 font-medium">
                EverStake is committed to maintaining the availability, security, and operational continuity of its staking infrastructure and to providing uninterrupted staking services to the maximum extent reasonably possible.
              </p>
            </div>

            {/* Section: Suspension of Staking */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Suspension of Staking</h2>
              <p className="text-xs text-slate-300">
                EverStake may temporarily suspend staking activity where reasonably necessary due to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 pl-2 sm:pl-4">
                <li>Security concerns;</li>
                <li>Blockchain instability;</li>
                <li>Network upgrades;</li>
                <li>Extreme market conditions;</li>
                <li>Technical maintenance;</li>
                <li>Regulatory requirements;</li>
                <li>Liquidity concerns;</li>
                <li>Validator issues; or</li>
                <li>Other circumstances affecting safe or practical operation.</li>
              </ul>
              <p className="text-xs text-slate-400">
                Where reasonably practicable, affected users will receive appropriate notification.
              </p>
            </div>

            {/* Section: User Responsibilities */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">User Responsibilities</h2>
              <p className="text-xs text-slate-300">Users are responsible for:</p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300 pl-2 sm:pl-4">
                <li>Reviewing staking-plan terms before participation.</li>
                <li>Using accurate account and transaction information.</li>
                <li>Maintaining account and wallet security.</li>
                <li>Understanding the risks associated with digital assets.</li>
                <li>Complying with applicable laws and regulations.</li>
                <li>Monitoring their staking positions and applicable notifications.</li>
                <li>Providing accurate wallet addresses and network information.</li>
              </ul>
            </div>

            {/* Section: 1. Risk Disclosure */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">1. Risk Disclosure</h2>
              <p className="text-xs text-slate-300">
                By participating in staking through EverStake, you acknowledge that digital-asset staking involves risk and that:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 pl-2 sm:pl-4">
                <li>Your digital assets may lose value.</li>
                <li>Staking rewards are not a guarantee against market losses.</li>
                <li>Staking plans may change or become unavailable.</li>
                <li>A selected staking plan cannot be switched after successful activation.</li>
                <li>Blockchain transactions may be irreversible.</li>
                <li>Blockchain networks may experience technical, economic, or security failures.</li>
                <li>Once assets have been successfully processed and released from EverStake’s controlled environment, they are no longer under EverStake’s security or custody.</li>
              </ul>
            </div>

            {/* Section: Guarantee of Profit */}
            <div className="space-y-3 border-b border-[#182848] pb-5 bg-[#060f22] p-4 rounded-2xl border border-[#182848]">
              <h2 className="text-lg font-bold text-white font-righteous flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" /> Guarantee of Profit
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                EverStake guarantees that participation in eligible Fixed/Flexible Staking Plans will provide the return specified by the applicable plan for the stated duration, subject to the plan’s terms and conditions.
              </p>
              <p className="text-xs text-slate-300">
                The stated reward rate and applicable return for a successfully activated Fixed/Flexible Staking Plan shall remain fixed/flexible throughout the specified staking period.
              </p>
              <p className="text-xs text-slate-300">
                Where applicable, EverStake’s stated staking rates and projected returns represent the terms of the selected staking plan and will be provided in accordance with those terms.
              </p>
              <p className="text-xs text-slate-400">
                Users are responsible for reviewing the applicable plan details, including the staking rate, duration, and conditions, before confirming participation.
              </p>
            </div>

            {/* Section: Policy Updates & Acceptance */}
            <div className="space-y-3 border-b border-[#182848] pb-5">
              <h2 className="text-lg font-bold text-white font-righteous">Policy Updates & Acceptance</h2>
              <p className="text-xs text-slate-300">
                EverStake may update this Staking Policy when necessary to reflect changes in staking services, blockchain technology, market conditions, security practices, regulatory requirements, or operational procedures. The latest version will be made available through the EverStake platform.
              </p>
              <p className="text-xs text-slate-300 font-semibold text-emerald-400 pt-1">
                By activating or participating in an EverStake staking plan, you acknowledge that you have reviewed and accepted the applicable staking terms and understand the risks associated with digital-asset staking.
              </p>
            </div>

            {/* Contact Section */}
            <div className="space-y-4 pt-2">
              <h2 className="text-lg font-bold text-white font-righteous">Contact Information</h2>

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
                      <p>support@everstake.cx</p>
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
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
