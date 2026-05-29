import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/home/animated-section';
import { BLOG_POSTS, BLOG_CATEGORIES, getFeaturedPosts } from '@/lib/blog-data';
import { BookOpen, Clock, ArrowRight, Tag } from 'lucide-react';
import { BlogCategoryFilter } from './blog-category-filter';
import { NewsletterForm } from './newsletter-form';

export const metadata: Metadata = {
  title: 'Blog - English Learning Tips, CEFR Guides & More',
  description:
    'Expert guides on CEFR levels, English test preparation, learning strategies, career advancement, and AI-powered language assessment. Stay informed with TestCEFR.',
  alternates: {
    canonical: 'https://testcefr.com/blog',
  },
  openGraph: {
    title: 'TestCEFR Blog — English Learning Tips & CEFR Guides',
    description:
      'Expert guides on CEFR levels, English test preparation, learning strategies, and career advancement.',
    url: 'https://testcefr.com/blog',
  },
};

export default function BlogPage() {
  const featuredPosts = getFeaturedPosts();

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      <main className="flex-1">
        {/* ===== HERO ===== */}
        <section className="relative py-16 md:py-24 overflow-hidden hero-pattern noise-overlay">
          <div className="absolute inset-0 pointer-events-none">
            <div className="orb orb-blue w-[400px] h-[400px] top-0 right-0 animate-float-slow" />
            <div className="orb orb-violet w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
          </div>

          <div className="container relative mx-auto px-4">
            <AnimatedSection>
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 px-4 py-1.5 mb-4">
                  <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Blog</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Learn, Grow, <span className="text-blue-400">Succeed</span>
                </h1>
                <p className="text-lg text-white/50 leading-relaxed">
                  Expert guides on CEFR levels, test preparation, learning strategies, and career advancement — everything you need to master English.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ===== FEATURED POSTS ===== */}
        {featuredPosts.length > 0 && (
          <section className="relative py-12 md:py-16 bg-[#0F0A1E]">
            <div className="container mx-auto px-4">
              <AnimatedSection>
                <div className="flex items-center gap-2 mb-8">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                    <BookOpen className="h-4 w-4 text-blue-400" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Featured Articles</h2>
                </div>
              </AnimatedSection>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredPosts.map((post, index) => (
                  <AnimatedSection key={post.slug} delay={index * 100}>
                    <Link href={`/blog/${post.slug}`} className="block h-full">
                      <article className="glass-card p-6 h-full flex flex-col group cursor-pointer">
                        {/* Category Badge */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-blue-500/15 text-blue-400">
                            {post.category}
                          </span>
                          <span className="text-[10px] text-white/30 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime} min read
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors leading-snug">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-white/50 leading-relaxed mb-4 flex-1">
                          {post.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-[10px] font-bold">
                              {post.author[0]}
                            </div>
                            <div>
                              <p className="text-xs text-white/60">{post.author}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-blue-400 text-xs font-medium group-hover:text-blue-300 transition-colors">
                            Read more
                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </article>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== ALL POSTS WITH CATEGORY FILTER ===== */}
        <section className="relative py-12 md:py-16 dark-section-alt hero-pattern noise-overlay">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="flex items-center gap-2 mb-8">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20">
                  <Tag className="h-4 w-4 text-violet-400" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">All Articles</h2>
              </div>
            </AnimatedSection>

            {/* Category Filter - Client Component */}
            <BlogCategoryFilter posts={BLOG_POSTS} categories={[...BLOG_CATEGORIES]} />
          </div>
        </section>

        {/* ===== NEWSLETTER CTA ===== */}
        <section className="relative py-16 md:py-20 bg-[#0F0A1E] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="orb orb-blue w-[500px] h-[500px] top-1/4 left-1/4 animate-float-slow" />
          </div>
          <div className="container relative mx-auto px-4">
            <AnimatedSection>
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                  Never Miss a <span className="text-blue-400">New Article</span>
                </h2>
                <p className="text-white/50 mb-8 leading-relaxed">
                  Get weekly tips, guides, and strategies delivered to your inbox. Join thousands of English learners improving their skills.
                </p>
                <NewsletterForm />
                <p className="text-xs text-white/30 mt-3">No spam. Unsubscribe anytime.</p>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
