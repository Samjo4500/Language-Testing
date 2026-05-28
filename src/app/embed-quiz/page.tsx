import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/home/animated-section';
import { Code, Copy, Check, Globe, BarChart3, Zap } from 'lucide-react';
import { EmbedCodeBlock } from './embed-code-block';

export default function EmbedQuizPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-16 md:py-24 overflow-hidden hero-pattern noise-overlay">
          <div className="absolute inset-0 pointer-events-none">
            <div className="orb orb-blue w-[400px] h-[400px] top-0 right-0 animate-float-slow" />
          </div>

          <div className="container relative mx-auto px-4">
            <AnimatedSection>
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 px-4 py-1.5 mb-4">
                  <Code className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Widget</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Free English Quiz <span className="text-blue-400">Widget</span>
                </h1>
                <p className="text-lg text-white/50 leading-relaxed">
                  Add an interactive English proficiency quiz to your site in 60 seconds. Engages visitors, adds value, and creates a natural backlink to TestCEFR.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 bg-[#0F0A1E]">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
              {[
                { icon: <Zap className="h-5 w-5 text-blue-400" />, title: '60-Second Setup', desc: 'Copy and paste one line of code. No signup, no API key, no configuration needed.' },
                { icon: <Globe className="h-5 w-5 text-violet-400" />, title: 'Mobile Responsive', desc: 'Automatically adapts to any screen size. Works on blogs, LMS platforms, and static sites.' },
                { icon: <BarChart3 className="h-5 w-5 text-amber-400" />, title: 'CEFR-Aligned', desc: 'Questions calibrated to CEFR levels A2 through C1 across grammar, vocabulary, and reading skills.' },
              ].map((item, i) => (
                <AnimatedSection key={item.title} delay={i * 100}>
                  <div className="glass-card p-5 h-full">
                    <div className="flex items-center gap-2 mb-3">
                      {item.icon}
                      <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Embed Code */}
        <section className="py-12 md:py-16 dark-section-alt hero-pattern noise-overlay">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-2">Copy the Embed Code</h2>
                <p className="text-sm text-white/40 mb-6">Paste this into your HTML where you want the quiz to appear.</p>
                <EmbedCodeBlock />
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Customization */}
        <section className="py-12 bg-[#0F0A1E]">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Customization Options</h2>
                <div className="glass-card p-6">
                  <p className="text-sm text-white/50 mb-4 leading-relaxed">
                    The widget accepts URL parameters to customize the quiz experience:
                  </p>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <code className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-300 font-mono whitespace-nowrap">?count=N</code>
                      <p className="text-sm text-white/50">Number of questions (1-10, default: 5)</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <code className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-300 font-mono whitespace-nowrap">?level=X</code>
                      <p className="text-sm text-white/50">Filter by CEFR level: a1, a2, b1, b2, c1, c2</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/[0.06]">
                    <p className="text-xs text-white/30">Example with custom options:</p>
                    <code className="block mt-2 text-xs px-4 py-3 rounded-lg bg-black/30 text-blue-300 font-mono overflow-x-auto">
                      {'<div id="testcefr-quiz" data-count="3" data-level="b2"></div>\n<script src="https://testcefr.com/quiz-widget.js"></script>'}
                    </code>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 bg-[#0F0A1E] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="orb orb-blue w-[500px] h-[500px] top-1/4 left-1/4 animate-float-slow" />
          </div>
          <div className="container relative mx-auto px-4">
            <AnimatedSection>
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                  Ready to Add <span className="text-blue-400">Value</span> to Your Site?
                </h2>
                <p className="text-white/50 mb-8 leading-relaxed">
                  Join the growing list of language learning blogs and education sites using the TestCEFR quiz widget.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/blog">
                    <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-medium transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer">
                      Browse Our Blog
                    </button>
                  </Link>
                  <Link href="/contact">
                    <button className="px-6 py-3 rounded-xl glass-button text-white text-sm font-medium cursor-pointer">
                      Partner With Us
                    </button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
