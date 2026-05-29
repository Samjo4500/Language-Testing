import type { Metadata } from 'next';

const COURSE_SEO: Record<string, { title: string; description: string; keywords: string[] }> = {
  beginner: {
    title: 'Beginner English Course (A1-A2) | TestCEFR',
    description:
      'Build your English foundation with our Beginner course (A1-A2). Master basic conversations, 500+ core words, grammar fundamentals, and listening comprehension with AI-powered exercises.',
    keywords: [
      'beginner English course',
      'A1 English course',
      'A2 English course',
      'basic English',
      'English for beginners',
      'learn English from scratch',
      'CEFR A1 A2',
    ],
  },
  intermediate: {
    title: 'Intermediate English Course (B1-B2) | TestCEFR',
    description:
      'Advance your English with our Intermediate course (B1-B2). Master professional communication, complex grammar, academic writing, and native-speed listening with interactive lessons.',
    keywords: [
      'intermediate English course',
      'B1 English course',
      'B2 English course',
      'business English',
      'academic English',
      'English grammar mastery',
      'CEFR B1 B2',
    ],
  },
  advanced: {
    title: 'Advanced English Course (C1-C2) | TestCEFR',
    description:
      'Master English with our Advanced course (C1-C2). Develop rhetoric & persuasion, literary analysis, scientific writing, phonological precision, and diplomatic communication skills.',
    keywords: [
      'advanced English course',
      'C1 English course',
      'C2 English course',
      'proficient English',
      'English mastery',
      'academic English writing',
      'CEFR C1 C2',
    ],
  },
  bundle: {
    title: 'Complete English Course Bundle | TestCEFR',
    description:
      'Get all three English courses (A1-C2) in one bundle and save $198. 28 modules, 150 lessons, 125+ hours of content with AI-powered exercises and completion certificates.',
    keywords: [
      'English course bundle',
      'complete English course',
      'A1 to C2 English',
      'English course discount',
      'all English courses',
      'CEFR full course',
    ],
  },
};

type CourseSlugLayoutProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CourseSlugLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const seo = COURSE_SEO[slug];

  if (!seo) {
    return {
      title: 'Course Not Found | TestCEFR',
    };
  }

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `https://testcefr.com/courses/${slug}`,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: ['https://testcefr.com/og-image.png'],
    },
  };
}

export default function CourseSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
