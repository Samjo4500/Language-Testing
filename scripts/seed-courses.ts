import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Course Structure Definitions ──────────────────────────────────────────────

const BEGINNER_MODULES = [
  { title: 'Getting Started', icon: 'HandMetal', lessons: ['Greetings & Introductions', 'The Alphabet & Numbers', 'Basic Pronunciation', 'Common Phrases'] },
  { title: 'Everyday Life', icon: 'Sun', lessons: ['Daily Routines', 'Telling Time', 'Days, Months & Seasons', 'Weather Vocabulary'] },
  { title: 'People & Places', icon: 'Users', lessons: ['Describing People', 'Family Members', 'Rooms & Furniture', 'Asking for Directions'] },
  { title: 'Food & Drink', icon: 'UtensilsCrossed', lessons: ['At the Restaurant', 'Cooking Vocabulary', 'Food Shopping', 'Likes & Dislikes'] },
  { title: 'Basic Grammar', icon: 'BookOpen', lessons: ['Present Simple Tense', 'Articles: A, An, The', 'Subject & Object Pronouns', 'Questions & Negatives'] },
  { title: 'Shopping & Money', icon: 'ShoppingCart', lessons: ['At the Store', 'Prices & Counting', 'Clothes Vocabulary', 'Asking for Help'] },
  { title: 'Health & Body', icon: 'Heart', lessons: ['Body Parts', 'At the Doctor', 'Common Illnesses', 'Healthy Habits'] },
  { title: 'Travel Basics', icon: 'Plane', lessons: ['At the Airport', 'Hotel Check-in', 'Getting Around Town', 'Emergency Phrases'] },
];

const INTERMEDIATE_MODULES = [
  { title: 'Professional Communication', icon: 'Briefcase', lessons: ['Email Writing', 'Meeting Vocabulary', 'Phone Etiquette', 'Presentation Skills', 'Networking'] },
  { title: 'Academic English', icon: 'GraduationCap', lessons: ['Essay Structure', 'Research Vocabulary', 'Citation & Referencing', 'Academic Discussions', 'Critical Thinking'] },
  { title: 'Advanced Grammar', icon: 'BookMarked', lessons: ['Present Perfect', 'Conditionals', 'Passive Voice', 'Reported Speech', 'Relative Clauses'] },
  { title: 'Culture & Society', icon: 'Globe', lessons: ['Cultural Differences', 'Social Issues', 'Media Literacy', 'Idioms & Expressions', 'British vs American English'] },
  { title: 'Technology & Innovation', icon: 'Cpu', lessons: ['Tech Vocabulary', 'Digital Literacy', 'AI & the Future', 'Social Media English', 'Cybersecurity Basics'] },
  { title: 'Business English', icon: 'Building2', lessons: ['Negotiations', 'Business Plans', 'Marketing Terms', 'Financial Vocabulary', 'Leadership Language'] },
  { title: 'Environment & Science', icon: 'Leaf', lessons: ['Climate Change', 'The Scientific Method', 'Environmental Issues', 'Renewable Energy', 'Space Exploration'] },
  { title: 'Arts & Literature', icon: 'Palette', lessons: ['Literary Terms', 'Poetry Basics', 'Film Criticism', 'Art Movements', 'Creative Writing'] },
  { title: 'Health & Wellbeing', icon: 'HeartPulse', lessons: ['Mental Health Vocabulary', 'Nutrition Science', 'Exercise & Fitness', 'Medical Ethics', 'Work-Life Balance'] },
  { title: 'Advanced Communication', icon: 'MessageCircle', lessons: ['Debating Skills', 'Persuasion Techniques', 'Public Speaking', 'Conflict Resolution', 'Cross-Cultural Communication'] },
];

const ADVANCED_MODULES = [
  { title: 'Rhetoric & Persuasion', icon: 'Scale', lessons: ['Classical Rhetoric', 'Logical Fallacies', 'Argumentation Theory', 'Persuasive Writing', 'Debate Mastery'] },
  { title: 'Academic Mastery', icon: 'Library', lessons: ['Research Methodology', 'Dissertation Writing', 'Peer Review Process', 'Academic Publishing', 'Interdisciplinary Research'] },
  { title: 'Literary Analysis', icon: 'BookOpen', lessons: ['Narrative Techniques', 'Postmodern Literature', 'Comparative Literature', 'Literary Criticism', 'Creative Non-Fiction'] },
  { title: 'Scientific English', icon: 'FlaskConical', lessons: ['Research Paper Writing', 'Statistical Language', 'Scientific Ethics', 'Grant Writing', 'Lab Report Writing'] },
  { title: 'Professional Mastery', icon: 'Crown', lessons: ['Executive Communication', 'Board Presentations', 'Legal English', 'Diplomatic Language', 'Crisis Communication'] },
  { title: 'Linguistic Precision', icon: 'Languages', lessons: ['Pragmatics', 'Discourse Analysis', 'Corpus Linguistics', 'Sociolinguistics', 'Phonological Precision'] },
  { title: 'Cultural Intelligence', icon: 'Globe', lessons: ['Global Business Culture', 'Translation Theory', 'Localization Strategies', 'Intercultural Mediation', 'Cultural Diplomacy'] },
  { title: 'Media & Journalism', icon: 'Newspaper', lessons: ['Investigative Reporting', 'Editorial Writing', 'Broadcast English', 'Media Ethics', 'Data Journalism'] },
  { title: 'Philosophy & Ethics', icon: 'Brain', lessons: ['Ethical Frameworks', 'Moral Reasoning', 'Political Philosophy', 'Philosophy of Language', 'Applied Ethics'] },
  { title: 'Mastery & Certification', icon: 'Award', lessons: ['CEFR C2 Preparation', 'Proficiency Test Strategies', 'Academic Publishing Skills', 'Professional Certification', 'Comprehensive Review'] },
];

// ─── Content Generators ────────────────────────────────────────────────────────

function generateReadingContent(courseLevel: string, moduleTitle: string, lessonTitle: string): string {
  return `<h2>${lessonTitle}</h2>
<p>Welcome to this lesson on <strong>${lessonTitle}</strong>, part of the <em>${moduleTitle}</em> module. This lesson is designed for ${courseLevel} learners and will help you build essential English skills.</p>

<h3>Key Concepts</h3>
<p>In this lesson, you will learn the fundamental concepts related to ${lessonTitle.toLowerCase()}. Understanding these concepts is crucial for developing your English proficiency and communicating effectively in real-world situations.</p>

<h3>Detailed Explanation</h3>
<p>Let us explore ${lessonTitle.toLowerCase()} in depth. This topic covers important vocabulary, grammatical structures, and practical usage that you will encounter in everyday English communication. Pay close attention to the examples provided, as they demonstrate how native speakers use these expressions naturally.</p>

<p>When studying ${lessonTitle.toLowerCase()}, it is important to practice regularly. Try to use the new words and phrases in your own sentences. The more you practice, the more natural your English will become. Remember that making mistakes is a normal part of the learning process.</p>

<h3>Practical Application</h3>
<p>Consider the following scenarios where you would use what you have learned in this lesson. Practice by role-playing these situations with a study partner or by writing your own dialogues. Real-world application is the key to retention and fluency.</p>

<h3>Summary</h3>
<p>In this lesson, we covered the essential aspects of ${lessonTitle.toLowerCase()}. Review the key points above and complete the practice exercises to reinforce your understanding. In the next lesson, we will build upon these concepts.</p>`;
}

function generateGrammarContent(courseLevel: string, moduleTitle: string, lessonTitle: string): string {
  return `<h2>${lessonTitle}</h2>
<p>In this grammar lesson, we will explore <strong>${lessonTitle}</strong>, an important grammatical concept for ${courseLevel} learners.</p>

<h3>Formation</h3>
<p>Understanding how to form this grammatical structure correctly is essential. Pay attention to the patterns and rules described below, and study the examples carefully.</p>

<h3>Rules and Patterns</h3>
<p>The rules for ${lessonTitle.toLowerCase()} follow specific patterns that you need to memorize and practice. Here are the key rules to remember. Note any exceptions to the rules, as these are often tested in proficiency exams.</p>

<h3>Common Mistakes</h3>
<p>Many learners make predictable errors when using ${lessonTitle.toLowerCase()}. Being aware of these common mistakes will help you avoid them in your own writing and speaking. Watch out for the pitfalls highlighted in this section.</p>

<h3>Practice Exercises</h3>
<p>Complete the following exercises to test your understanding. Try to answer without looking at the rules first, then check your answers. Repetition and active recall are the most effective study techniques for grammar mastery.</p>

<h3>Summary</h3>
<p>${lessonTitle} is a fundamental grammar topic at the ${courseLevel} level. Master it through consistent practice and application in your daily English use.</p>`;
}

function generateVocabularyData(lessonTitle: string): string {
  const wordSets: Record<string, Array<{word: string; definition: string; example: string; pronunciation: string}>> = {
    'Greetings & Introductions': [
      { word: 'Hello', definition: 'A common greeting used when meeting someone', example: 'Hello! How are you today?', pronunciation: '/həˈloʊ/' },
      { word: 'Goodbye', definition: 'A farewell expression used when leaving', example: 'Goodbye! See you tomorrow.', pronunciation: '/ɡʊdˈbaɪ/' },
      { word: 'Introduce', definition: 'To present someone by name to another person', example: 'Let me introduce my friend Sarah.', pronunciation: '/ˌɪntrəˈdjuːs/' },
      { word: 'Pleased', definition: 'Feeling happy or satisfied', example: 'Pleased to meet you!', pronunciation: '/pliːzd/' },
      { word: 'Acquaintance', definition: 'A person one knows slightly', example: 'She is an acquaintance from work.', pronunciation: '/əˈkweɪntəns/' },
    ],
    'At the Restaurant': [
      { word: 'Appetizer', definition: 'A small dish served before the main course', example: 'Would you like to order an appetizer?', pronunciation: '/ˈæpɪtaɪzər/' },
      { word: 'Main course', definition: 'The primary dish of a meal', example: 'The main course is grilled salmon.', pronunciation: '/meɪn kɔːrs/' },
      { word: 'Bill', definition: 'A statement of money owed for food and drink', example: 'Could we have the bill, please?', pronunciation: '/bɪl/' },
      { word: 'Tip', definition: 'Extra money given for good service', example: 'I left a 15% tip.', pronunciation: '/tɪp/' },
      { word: 'Reservation', definition: 'An arrangement to hold a table', example: 'I have a reservation for two at 7pm.', pronunciation: '/ˌrezərˈveɪʃən/' },
    ],
  };
  
  const defaultWords = [
    { word: 'Concept', definition: 'An abstract idea or general notion related to this topic', example: 'This concept is fundamental to understanding the lesson.', pronunciation: '/ˈkɒnsept/' },
    { word: 'Practice', definition: 'Repeated exercise to develop skill', example: 'Practice makes perfect.', pronunciation: '/ˈpræktɪs/' },
    { word: 'Fluency', definition: 'The ability to speak smoothly and easily', example: 'Her fluency in English is impressive.', pronunciation: '/ˈfluːənsi/' },
    { word: 'Comprehension', definition: 'The ability to understand something', example: 'Reading improves comprehension.', pronunciation: '/ˌkɒmprɪˈhenʃən/' },
    { word: 'Proficiency', definition: 'A high degree of skill or competence', example: 'He demonstrated proficiency in all four skills.', pronunciation: '/prəˈfɪʃənsi/' },
  ];
  
  return JSON.stringify(wordSets[lessonTitle] || defaultWords);
}

function generateQuizData(lessonTitle: string): string {
  const quizzes: Record<string, Array<{question: string; options: string[]; correctIndex: number; explanation: string}>> = {
    'Greetings & Introductions': [
      { question: 'Which greeting is appropriate for a formal business meeting?', options: ['Hey there!', 'Good morning, how do you do?', "What's up?", 'Yo!'], correctIndex: 1, explanation: '"Good morning, how do you do?" is the most formal and appropriate greeting for a business meeting.' },
      { question: 'When someone says "Pleased to meet you," the correct response is:', options: ['Same here', 'Pleased to meet you too', 'Yeah', 'Whatever'], correctIndex: 1, explanation: 'The polite response is to reciprocate: "Pleased to meet you too."' },
      { question: 'What does "How do you do?" mean?', options: ['How are you feeling?', 'A formal greeting', 'What is your job?', 'Where are you from?'], correctIndex: 1, explanation: '"How do you do?" is a formal greeting, not a question about health. The response is also "How do you do?"' },
    ],
  };
  
  const defaultQuiz = [
    { question: `Which of the following best relates to "${lessonTitle}"?`, options: ['Unrelated topic A', 'The correct concept', 'Unrelated topic B', 'Unrelated topic C'], correctIndex: 1, explanation: `This answer correctly identifies the key concept of ${lessonTitle}.` },
    { question: `In the context of "${lessonTitle}", which statement is true?`, options: ['Statement A is always false', 'The correct understanding of the concept', 'This concept only applies in rare cases', 'None of the above'], correctIndex: 1, explanation: `This statement accurately reflects the principles covered in the ${lessonTitle} lesson.` },
    { question: `What is the most important takeaway from "${lessonTitle}"?`, options: ['Memorization without understanding', 'Practical application and understanding', 'Skipping the fundamentals', 'Learning only advanced concepts'], correctIndex: 1, explanation: 'Practical application and deep understanding are always more valuable than rote memorization.' },
  ];
  
  return JSON.stringify(quizzes[lessonTitle] || defaultQuiz);
}

function getContentType(lessonIndex: number, totalLessons: number): string {
  // Pattern: reading, vocabulary, grammar, listening, and quiz for last lesson of module
  if (lessonIndex === totalLessons - 1) return 'quiz';
  const types = ['reading', 'vocabulary', 'grammar', 'listening'];
  return types[lessonIndex % types.length];
}

// ─── Main Seed Function ────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding courses...\n');

  const courses = [
    {
      slug: 'beginner',
      title: 'Beginner English',
      subtitle: 'From A1 to A2 — Build your foundation',
      level: 'A1-A2',
      price: 49,
      compareAtPrice: 79,
      description: 'Build a solid English foundation from scratch. This comprehensive course takes you from complete beginner to A2 level, covering essential vocabulary, basic grammar, and everyday communication skills. Perfect for those starting their English learning journey.',
      features: JSON.stringify(['8 comprehensive modules', '36 interactive lessons', 'Vocabulary building (500+ words)', 'Grammar fundamentals', 'Listening exercises with AI voice', 'Quizzes after every module', 'Progress tracking dashboard', 'Completion certificate']),
      modulesCount: 8,
      lessonsCount: 36,
      estimatedHours: 25,
      order: 1,
      modules: BEGINNER_MODULES,
    },
    {
      slug: 'intermediate',
      title: 'Intermediate English',
      subtitle: 'From B1 to B2 — Communicate with confidence',
      level: 'B1-B2',
      price: 79,
      compareAtPrice: 129,
      description: 'Elevate your English to professional and academic levels. Master complex grammar, professional communication, and academic writing. This course bridges the gap between basic English and confident, fluent communication in any context.',
      features: JSON.stringify(['10 comprehensive modules', '55 interactive lessons', 'Professional communication skills', 'Complex grammar mastery', 'Academic English introduction', 'Listening exercises with AI voice', 'Quizzes after every module', 'Progress tracking dashboard', 'Completion certificate']),
      modulesCount: 10,
      lessonsCount: 55,
      estimatedHours: 45,
      order: 2,
      modules: INTERMEDIATE_MODULES,
    },
    {
      slug: 'advanced',
      title: 'Advanced English',
      subtitle: 'From C1 to C2 — Master the language',
      level: 'C1-C2',
      price: 99,
      compareAtPrice: 169,
      description: 'Achieve true English mastery at the highest level. Explore rhetoric, academic publishing, linguistic precision, and cultural intelligence. This course prepares you for C2 proficiency certification and professional excellence in any English-speaking environment.',
      features: JSON.stringify(['10 comprehensive modules', '55 interactive lessons', 'Academic & professional mastery', 'Rhetoric & persuasion techniques', 'Literary & scientific English', 'Phonological precision', 'Quizzes after every module', 'Progress tracking dashboard', 'Completion certificate']),
      modulesCount: 10,
      lessonsCount: 55,
      estimatedHours: 55,
      order: 3,
      modules: ADVANCED_MODULES,
    },
  ];

  for (const courseData of courses) {
    console.log(`📚 Creating course: ${courseData.title}`);
    
    // Delete existing course data (cascade will handle modules/lessons)
    await prisma.course.deleteMany({ where: { slug: courseData.slug } });
    
    const course = await prisma.course.create({
      data: {
        slug: courseData.slug,
        title: courseData.title,
        subtitle: courseData.subtitle,
        level: courseData.level,
        price: courseData.price,
        compareAtPrice: courseData.compareAtPrice,
        description: courseData.description,
        features: courseData.features,
        modulesCount: courseData.modulesCount,
        lessonsCount: courseData.lessonsCount,
        estimatedHours: courseData.estimatedHours,
        order: courseData.order,
        isPublished: true,
      },
    });

    for (let m = 0; m < courseData.modules.length; m++) {
      const mod = courseData.modules[m];
      console.log(`  📂 Module ${m + 1}: ${mod.title}`);
      
      const moduleRecord = await prisma.courseModule.create({
        data: {
          courseId: course.id,
          moduleNumber: m + 1,
          title: mod.title,
          description: `Explore ${mod.title.toLowerCase()} in this comprehensive module of the ${courseData.title} course.`,
          icon: mod.icon,
          order: m,
          isPublished: true,
        },
      });

      for (let l = 0; l < mod.lessons.length; l++) {
        const lessonTitle = mod.lessons[l];
        const contentType = getContentType(l, mod.lessons.length);
        const levelLabel = courseData.level.includes('A1') ? 'beginner (A1-A2)' : courseData.level.includes('B1') ? 'intermediate (B1-B2)' : 'advanced (C1-C2)';
        
        let content = '';
        if (contentType === 'grammar') {
          content = generateGrammarContent(levelLabel, mod.title, lessonTitle);
        } else {
          content = generateReadingContent(levelLabel, mod.title, lessonTitle);
        }

        const lessonData: any = {
          moduleId: moduleRecord.id,
          lessonNumber: l + 1,
          title: lessonTitle,
          contentType,
          content,
          estimatedMinutes: contentType === 'quiz' ? 15 : (contentType === 'listening' ? 12 : 15),
          order: l,
          isPublished: true,
        };

        // Add vocabulary for vocabulary lessons
        if (contentType === 'vocabulary') {
          lessonData.vocabulary = generateVocabularyData(lessonTitle);
        }

        // Add quiz for quiz lessons
        if (contentType === 'quiz') {
          lessonData.quizData = generateQuizData(lessonTitle);
        }

        // Add audio script for listening lessons
        if (contentType === 'listening') {
          lessonData.audioScript = `In this listening exercise for ${lessonTitle}, you will hear a conversation between two people discussing ${lessonTitle.toLowerCase()}. Listen carefully and try to understand the main points. The speakers will use vocabulary and expressions related to ${mod.title.toLowerCase()}. Pay attention to pronunciation, intonation, and the natural rhythm of spoken English.`;
        }

        await prisma.courseLesson.create({ data: lessonData });
      }
    }
    
    console.log(`  ✅ ${courseData.title}: ${courseData.modulesCount} modules, ${courseData.lessonsCount} lessons\n`);
  }

  console.log('🎉 Course seeding complete!');
  console.log('\nSummary:');
  console.log('  - Beginner English: 8 modules, 36 lessons');
  console.log('  - Intermediate English: 10 modules, 55 lessons');
  console.log('  - Advanced English: 10 modules, 55 lessons');
  console.log('  - Total: 28 modules, 146 lessons');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
