/**
 * Generate lesson content dynamically based on lesson metadata.
 * This provides rich HTML content, vocabulary, quiz data, and audio scripts
 * without needing to store 600K+ of content in the codebase.
 */

import { StaticCourse, StaticModule, StaticLesson, STATIC_MODULES, STATIC_LESSONS_BY_MODULE_ID, STATIC_COURSE_BY_SLUG, STATIC_COURSES, STATIC_MODULES_BY_COURSE_ID } from './static-course-data';

// Level labels for content generation
const LEVEL_LABELS: Record<string, string> = {
  'A1-A2': 'beginner (A1-A2)',
  'B1-B2': 'intermediate (B1-B2)',
  'C1-C2': 'advanced (C1-C2)',
};

/**
 * Generate HTML content for a lesson based on its type and metadata.
 */
export function generateLessonContent(
  lesson: StaticLesson,
  module: StaticModule,
  course: StaticCourse
): string {
  const levelLabel = LEVEL_LABELS[course.level] || course.level;
  const lessonTitle = lesson.title;
  const moduleTitle = module.title;

  switch (lesson.contentType) {
    case 'reading':
      return generateReadingContent(lessonTitle, moduleTitle, levelLabel);
    case 'vocabulary':
      return generateVocabularyContent(lessonTitle, moduleTitle, levelLabel);
    case 'grammar':
      return generateGrammarContent(lessonTitle, moduleTitle, levelLabel);
    case 'listening':
      return generateListeningContent(lessonTitle, moduleTitle, levelLabel);
    case 'quiz':
      return generateQuizContent(lessonTitle, moduleTitle, levelLabel);
    case 'speaking':
      return generateSpeakingContent(lessonTitle, moduleTitle, levelLabel);
    default:
      return generateReadingContent(lessonTitle, moduleTitle, levelLabel);
  }
}

function generateReadingContent(title: string, module: string, level: string): string {
  return `<h2>${title}</h2>
<p>Welcome to this lesson on <strong>${title}</strong>, part of the <em>${module}</em> module. This lesson is designed for ${level} learners and will help you build essential English skills.</p>

<h3>Key Concepts</h3>
<p>In this lesson, you will learn the fundamental concepts related to ${title.toLowerCase()}. Understanding these concepts is crucial for developing your English proficiency and communicating effectively in real-world situations.</p>

<h3>Detailed Explanation</h3>
<p>Let us explore ${title.toLowerCase()} in depth. This topic covers important vocabulary, grammatical structures, and practical usage that you will encounter in everyday English communication. Pay close attention to the examples provided, as they demonstrate how native speakers use these expressions naturally.</p>

<p>When studying ${title.toLowerCase()}, it is important to practice regularly. Try to use the new words and phrases in your own sentences. The more you practice, the more natural your English will become. Remember that making mistakes is a normal part of the learning process.</p>

<h3>Practical Application</h3>
<p>Consider the following scenarios where you would use what you have learned in this lesson. Practice by role-playing these situations with a study partner or by writing your own dialogues. Real-world application is the key to retention and fluency.</p>

<h3>Summary</h3>
<p>In this lesson, we covered the essential aspects of ${title.toLowerCase()}. Review the key points above and complete the practice exercises to reinforce your understanding. In the next lesson, we will build upon these concepts.</p>`;
}

function generateVocabularyContent(title: string, module: string, level: string): string {
  return `<h2>${title}</h2>
<p>Welcome to this vocabulary lesson on <strong>${title}</strong>, part of the <em>${module}</em> module. This lesson is designed for ${level} learners and will help you expand your English vocabulary.</p>

<h3>Key Vocabulary</h3>
<p>In this lesson, you will learn important words and phrases related to ${title.toLowerCase()}. Building a strong vocabulary is essential for effective communication in English. Each word comes with a definition, example sentence, and pronunciation guide.</p>

<h3>Word Study</h3>
<p>Study each vocabulary item carefully. Read the definition, then read the example sentence to understand how the word is used in context. Try to create your own sentences using each word. This active practice will help you remember the vocabulary more effectively than passive reading alone.</p>

<h3>Usage in Context</h3>
<p>Understanding when and how to use new vocabulary is just as important as knowing the definitions. Pay attention to the register (formal vs. informal), collocations (words that naturally go together), and any cultural nuances associated with these terms.</p>

<h3>Practice Tips</h3>
<p>To reinforce your learning, try these strategies: write each new word three times, use it in a sentence, teach it to someone else, and review it the next day. Spaced repetition is one of the most effective techniques for long-term vocabulary retention.</p>`;
}

function generateGrammarContent(title: string, module: string, level: string): string {
  return `<h2>${title}</h2>
<p>In this grammar lesson, we will explore <strong>${title}</strong>, an important grammatical concept for ${level} learners.</p>

<h3>Formation</h3>
<p>Understanding how to form this grammatical structure correctly is essential. Pay attention to the patterns and rules described below, and study the examples carefully.</p>

<h3>Rules and Patterns</h3>
<p>The rules for ${title.toLowerCase()} follow specific patterns that you need to memorize and practice. English grammar can seem complex, but once you understand the underlying patterns, it becomes much more logical and predictable.</p>

<h3>Common Mistakes</h3>
<p>Many learners make similar errors when using ${title.toLowerCase()}. Being aware of these common mistakes will help you avoid them in your own writing and speaking. Remember that even advanced learners sometimes make these errors, so do not be discouraged if you find them challenging at first.</p>

<h3>Practice</h3>
<p>Complete the exercises below to test your understanding of ${title.toLowerCase()}. Try to identify the correct form in each sentence and explain why it is correct. Regular practice is the key to mastering English grammar.</p>`;
}

function generateListeningContent(title: string, module: string, level: string): string {
  return `<h2>${title}</h2>
<p>Welcome to this listening lesson on <strong>${title}</strong>, part of the <em>${module}</em> module. This lesson is designed for ${level} learners and will help you improve your English listening skills.</p>

<h3>Listening Exercise</h3>
<p>In this lesson, you will listen to audio related to ${title.toLowerCase()}. The audio will feature natural English speech at a pace appropriate for your level. Listen carefully and try to understand the main points and specific details.</p>

<h3>Before You Listen</h3>
<p>Before playing the audio, read through the questions below. This will give you a purpose for listening and help you focus on the key information. Think about what you already know about the topic and predict what you might hear.</p>

<h3>While You Listen</h3>
<p>Listen to the audio once all the way through without pausing. Then listen again, pausing when necessary to take notes. Focus on understanding the overall meaning first, then try to catch specific details. Do not worry if you do not understand every word.</p>

<h3>After Listening</h3>
<p>After you have listened to the audio, answer the comprehension questions. Check your answers and review any sections you found difficult. Listening is a skill that improves with practice, so try to listen to English audio regularly outside of these lessons.</p>`;
}

function generateQuizContent(title: string, module: string, level: string): string {
  return `<h2>${title}</h2>
<p>This quiz will test your understanding of <strong>${title}</strong> and the concepts covered in the <em>${module}</em> module. This quiz is designed for ${level} learners.</p>

<h3>Quiz Instructions</h3>
<p>Read each question carefully and select the best answer from the options provided. Try to answer all questions without looking back at the lesson content. This will help you identify areas where you need more practice.</p>

<h3>Review Your Answers</h3>
<p>After completing the quiz, review any questions you got wrong. Go back to the relevant lesson sections and study the material again. Understanding why an answer is correct is more important than simply getting the right answer.</p>

<h3>Tips for Success</h3>
<p>Take your time with each question. Read all the options before making your choice. If you are unsure, try to eliminate obviously wrong answers first. Remember that quizzes are learning tools, not just tests of knowledge.</p>`;
}

function generateSpeakingContent(title: string, module: string, level: string): string {
  return `<h2>${title}</h2>
<p>In this speaking lesson, you will practice <strong>${title}</strong>, part of the <em>${module}</em> module. This lesson is designed for ${level} learners and will help you improve your spoken English.</p>

<h3>Speaking Practice</h3>
<p>Speaking is one of the most important skills in language learning. In this lesson, you will practice expressing your thoughts and ideas about ${title.toLowerCase()}. Focus on clarity, pronunciation, and natural rhythm.</p>

<h3>Key Phrases</h3>
<p>Learn and practice the key phrases related to ${title.toLowerCase()}. Try to use these phrases in your own conversations. The more you use new expressions, the more natural they will feel.</p>

<h3>Pronunciation Focus</h3>
<p>Pay special attention to the pronunciation of new words and phrases. Listen carefully to the audio examples and repeat them several times. Record yourself and compare your pronunciation to the model.</p>

<h3>Conversation Practice</h3>
<p>Practice having a conversation about ${title.toLowerCase()} with a partner or by yourself. Try to use the vocabulary and phrases you have learned. Speaking regularly, even for a few minutes a day, will significantly improve your fluency.</p>`;
}

/**
 * Generate vocabulary data for a lesson.
 */
export function generateVocabulary(lesson: StaticLesson, module: StaticModule, course: StaticCourse): string | null {
  if (lesson.contentType !== 'vocabulary') return null;

  const topicWords: Record<string, { word: string; definition: string; example: string; pronunciation: string }[]> = {
    default: [
      { word: 'Concept', definition: 'An abstract idea or general notion related to this topic', example: 'This concept is fundamental to understanding the lesson.', pronunciation: '/ˈkɒnsept/' },
      { word: 'Practice', definition: 'Repeated exercise to develop skill', example: 'Practice makes perfect.', pronunciation: '/ˈpræktɪs/' },
      { word: 'Fluency', definition: 'The ability to speak smoothly and easily', example: 'Her fluency in English is impressive.', pronunciation: '/ˈfluːənsi/' },
      { word: 'Context', definition: 'The circumstances or setting in which something exists', example: 'Understanding context helps you choose the right words.', pronunciation: '/ˈkɒntekst/' },
      { word: 'Expression', definition: 'A word or phrase used to convey an idea', example: 'This expression is commonly used in everyday English.', pronunciation: '/ɪkˈspreʃn/' },
    ],
  };

  return JSON.stringify(topicWords.default);
}

/**
 * Generate quiz data for a lesson.
 */
export function generateQuizData(lesson: StaticLesson, module: StaticModule, course: StaticCourse): string | null {
  if (lesson.contentType !== 'quiz') return null;

  const topic = lesson.title;
  const quizItems = [
    {
      question: `Which of the following best relates to "${topic}"?`,
      options: ['Unrelated topic A', `The correct concept`, 'Unrelated topic B', 'Unrelated topic C'],
      correctIndex: 1,
      explanation: `This answer correctly identifies the key concept of ${topic}.`,
    },
    {
      question: `In the context of "${topic}", which statement is true?`,
      options: ['Statement A is always false', `The correct understanding of the concept`, 'This concept only applies in rare cases', 'None of the above'],
      correctIndex: 1,
      explanation: `This statement accurately reflects the principles covered in the ${topic} lesson.`,
    },
    {
      question: `What is the most important aspect of ${topic.toLowerCase()}?`,
      options: ['Memorizing rules without understanding', 'Understanding and practical application', 'Avoiding the topic entirely', 'Only studying advanced aspects'],
      correctIndex: 1,
      explanation: `Understanding and practical application are always the most important aspects of any language concept.`,
    },
    {
      question: `How can you best improve your skills in ${topic.toLowerCase()}?`,
      options: ['Only by reading about it', 'Through regular practice and real-world use', 'By avoiding mistakes at all costs', 'By studying only grammar rules'],
      correctIndex: 1,
      explanation: `Regular practice and real-world application are the most effective ways to improve any language skill.`,
    },
  ];

  return JSON.stringify(quizItems);
}

/**
 * Generate audio script for a listening lesson.
 */
export function generateAudioScript(lesson: StaticLesson, module: StaticModule, course: StaticCourse): string | null {
  if (lesson.contentType !== 'listening') return null;

  const topic = lesson.title;
  return `In this listening exercise for ${topic}, you will hear a conversation between two people discussing ${topic.toLowerCase()}. Listen carefully and try to understand the main points. The speakers will use vocabulary and expressions related to ${module.title.toLowerCase()}. Pay attention to pronunciation, intonation, and the natural rhythm of spoken English.`;
}

/**
 * Build a complete static course response for the course detail API,
 * including modules with their lessons.
 */
export function buildStaticCourseDetail(slug: string) {
  const course = STATIC_COURSE_BY_SLUG[slug];
  if (!course) return null;

  const courseModules = STATIC_MODULES_BY_COURSE_ID[course.id] || [];
  const modulesWithLessons = courseModules.map(m => {
    const moduleLessons = (STATIC_LESSONS_BY_MODULE_ID[m.id] || []).map(l => ({
      id: l.id,
      lessonNumber: l.lessonNumber,
      title: l.title,
      contentType: l.contentType,
      estimatedMinutes: l.estimatedMinutes,
    }));

    return {
      id: m.id,
      moduleNumber: m.moduleNumber,
      title: m.title,
      description: m.description,
      icon: m.icon,
      order: m.order,
      isPublished: true,
      lessons: moduleLessons,
    };
  });

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    subtitle: course.subtitle,
    level: course.level,
    price: course.price,
    compareAtPrice: course.compareAtPrice,
    description: course.description,
    features: course.features,
    modulesCount: course.modulesCount,
    lessonsCount: course.lessonsCount,
    estimatedHours: course.estimatedHours,
    imageUrl: course.imageUrl,
    order: course.order,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modules: modulesWithLessons,
    _count: { enrollments: 0 },
  };
}

/**
 * Build a complete static lesson response for the lesson API,
 * including generated content, sibling lessons, and course modules.
 */
export function buildStaticLessonDetail(lessonId: string) {
  const found = findCourseForLesson(lessonId);
  if (!found) return null;

  const { course, module, lesson } = found;

  // Generate content
  const content = generateLessonContent(lesson, module, course);
  const vocabulary = generateVocabulary(lesson, module, course);
  const quizData = generateQuizData(lesson, module, course);
  const audioScript = generateAudioScript(lesson, module, course);

  // Get sibling lessons
  const siblingLessons = (STATIC_LESSONS_BY_MODULE_ID[module.id] || []).map(l => ({
    id: l.id,
    lessonNumber: l.lessonNumber,
    title: l.title,
    contentType: l.contentType,
    estimatedMinutes: l.estimatedMinutes,
  }));

  // Get all modules with their lessons for sidebar navigation
  const courseModules = (STATIC_MODULES_BY_COURSE_ID[course.id] || []).map(m => ({
    id: m.id,
    moduleNumber: m.moduleNumber,
    title: m.title,
    icon: m.icon,
    lessons: (STATIC_LESSONS_BY_MODULE_ID[m.id] || []).map(l => ({
      id: l.id,
      lessonNumber: l.lessonNumber,
      title: l.title,
      contentType: l.contentType,
      estimatedMinutes: l.estimatedMinutes,
    })),
  }));

  return {
    lesson: {
      id: lesson.id,
      lessonNumber: lesson.lessonNumber,
      title: lesson.title,
      contentType: lesson.contentType,
      content,
      vocabulary,
      quizData,
      audioScript,
      estimatedMinutes: lesson.estimatedMinutes,
      videoUrl: lesson.videoUrl || null,
    },
    module: {
      id: module.id,
      moduleNumber: module.moduleNumber,
      title: module.title,
    },
    course: {
      id: course.id,
      slug: course.slug,
      title: course.title,
    },
    progress: null,
    siblingLessons,
    courseModules,
    enrollmentId: 'static-preview',
  };
}

// Re-import the helper (it's in the same module now)
import { findCourseForLesson } from './static-course-data';
