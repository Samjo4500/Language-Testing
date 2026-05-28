import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/home/animated-section';
import { getBlogPost, getAllBlogSlugs, BLOG_POSTS } from '@/lib/blog-data';
import { BookOpen, Clock, ArrowLeft, ArrowRight, Calendar, Share2 } from 'lucide-react';
import { BlogShareButtons } from './blog-share-buttons';
import { sanitizeHtml } from '@/lib/sanitize';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Find prev/next posts for navigation
  const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
  const nextPost = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

  // Related posts (same category, excluding current)
  const relatedPosts = BLOG_POSTS.filter(
    (p) => p.category === post.category && p.slug !== post.slug
  ).slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      <main className="flex-1">
        {/* ===== ARTICLE HEADER ===== */}
        <section className="relative py-12 md:py-20 overflow-hidden hero-pattern noise-overlay">
          <div className="absolute inset-0 pointer-events-none">
            <div className="orb orb-blue w-[400px] h-[400px] top-0 right-0 animate-float-slow" />
            <div className="orb orb-violet w-[300px] h-[300px] bottom-0 left-0 animate-float-reverse" />
          </div>

          <div className="container relative mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <AnimatedSection>
                {/* Back Link */}
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Blog
                </Link>

                {/* Category + Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-blue-500/15 text-blue-400">
                    {post.category}
                  </span>
                  <span className="text-xs text-white/30 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime} min read
                  </span>
                  <span className="text-xs text-white/30 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                  {post.title}
                </h1>

                {/* Excerpt */}
                <p className="text-lg text-white/50 leading-relaxed mb-6">
                  {post.excerpt}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-6 border-t border-white/[0.06]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-bold text-sm shadow-lg">
                    {post.author[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{post.author}</p>
                    <p className="text-xs text-white/40">{post.authorRole}</p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ===== ARTICLE CONTENT ===== */}
        <section className="relative py-10 md:py-16 bg-[#0F0A1E]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <AnimatedSection>
                <article
                  className="lesson-content prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
                />
              </AnimatedSection>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-white/[0.06]">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.1] transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Buttons */}
              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <Share2 className="h-4 w-4 text-white/30" />
                  <span className="text-sm text-white/40">Share this article:</span>
                  <BlogShareButtons title={post.title} slug={post.slug} />
                </div>
              </div>

              {/* Post Navigation */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {prevPost ? (
                  <Link
                    href={`/blog/${prevPost.slug}`}
                    className="glass-card p-4 group cursor-pointer"
                  >
                    <div className="flex items-center gap-1 text-xs text-white/30 mb-2">
                      <ArrowLeft className="h-3 w-3" />
                      Previous
                    </div>
                    <p className="text-sm font-medium text-white/70 group-hover:text-blue-300 transition-colors line-clamp-2">
                      {prevPost.title}
                    </p>
                  </Link>
                ) : (
                  <div />
                )}
                {nextPost ? (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="glass-card p-4 group cursor-pointer text-right"
                  >
                    <div className="flex items-center justify-end gap-1 text-xs text-white/30 mb-2">
                      Next
                      <ArrowRight className="h-3 w-3" />
                    </div>
                    <p className="text-sm font-medium text-white/70 group-hover:text-blue-300 transition-colors line-clamp-2">
                      {nextPost.title}
                    </p>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===== RELATED POSTS ===== */}
        {relatedPosts.length > 0 && (
          <section className="relative py-12 md:py-16 dark-section-alt hero-pattern noise-overlay">
            <div className="container mx-auto px-4">
              <AnimatedSection>
                <div className="flex items-center gap-2 mb-8">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                    <BookOpen className="h-4 w-4 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Related Articles</h2>
                </div>
              </AnimatedSection>

              <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
                {relatedPosts.map((relPost, index) => (
                  <AnimatedSection key={relPost.slug} delay={index * 100}>
                    <Link href={`/blog/${relPost.slug}`} className="block h-full">
                      <article className="glass-card p-5 h-full flex flex-col group cursor-pointer">
                        <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 mb-2 self-start">
                          {relPost.category}
                        </span>
                        <h3 className="text-base font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors leading-snug">
                          {relPost.title}
                        </h3>
                        <p className="text-sm text-white/40 leading-relaxed flex-1 line-clamp-2">
                          {relPost.excerpt}
                        </p>
                      </article>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== CTA ===== */}
        <section className="relative py-16 md:py-20 bg-[#0F0A1E] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="orb orb-blue w-[500px] h-[500px] top-1/4 right-1/4 animate-float-slow" />
          </div>
          <div className="container relative mx-auto px-4">
            <AnimatedSection>
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                  Ready to Test Your <span className="text-blue-400">English Level?</span>
                </h2>
                <p className="text-white/50 mb-8 leading-relaxed">
                  Get your accurate CEFR score with our AI-powered assessment. Free to start, with detailed feedback on all 6 core skills.
                </p>
                <Link href="/register">
                  <button className="group flex items-center gap-2 mx-auto rounded-xl px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer">
                    Take Free Test
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
