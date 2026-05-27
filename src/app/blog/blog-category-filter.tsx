'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/lib/blog-data';

export function BlogCategoryFilter({
  posts,
  categories,
}: {
  posts: BlogPost[];
  categories: string[];
}) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              activeCategory === cat
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-white/[0.04] text-white/40 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block h-full">
            <article className="glass-card p-5 h-full flex flex-col group cursor-pointer">
              {/* Category + Read Time */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-blue-500/15 text-blue-400">
                  {post.category}
                </span>
                <span className="text-[10px] text-white/30 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTime} min
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors leading-snug line-clamp-2">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-sm text-white/40 leading-relaxed mb-4 flex-1 line-clamp-3">
                {post.excerpt}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-400 text-white text-[9px] font-bold">
                    {post.author[0]}
                  </div>
                  <p className="text-[11px] text-white/50">{post.author}</p>
                </div>
                <span className="text-[11px] text-white/30">{post.publishedAt}</span>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/40 text-sm">No articles found in this category yet.</p>
        </div>
      )}
    </>
  );
}
