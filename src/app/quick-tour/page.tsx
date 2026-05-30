import QuickTourPage from "./QuickTourPage";

export const metadata = {
  title: "How It Works | Your Path to English Fluency",
  description:
    "Discover how TestCEFR works — from free CEFR assessment to AI-powered courses, voice practice with Lexi, and verified certificates.",
  keywords: [
    "how TestCEFR works",
    "CEFR test guide",
    "English learning path",
    "CEFR certification steps",
    "quick tour",
    "English proficiency journey",
  ],
  openGraph: {
    title: "How It Works | Your Path to English Fluency",
    description:
      "Discover how TestCEFR works — from free CEFR assessment to AI-powered courses, voice practice with Lexi, and verified certificates.",
  },
  alternates: {
    canonical: "https://testcefr.com/quick-tour",
  },
};

export default function QuickTourRoute() {
  return <QuickTourPage />;
}
