import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { adminLimiter } from '@/lib/rate-limit';

/**
 * POST /api/admin/seed
 * Seed the database with comprehensive CEFR questions, reading passages, listening items,
 * speaking prompts, and writing prompts. Ensures admin has proper access.
 */
export async function POST(request: NextRequest) {
  // Rate limit: 60 requests per minute per IP
  const limitError = adminLimiter(request);
  if (limitError) return limitError;

  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    let questionsAdded = 0;
    let readingAdded = 0;
    let listeningAdded = 0;
    let speakingAdded = 0;
    let writingAdded = 0;
    let adminUpdated = false;

    // Ensure admin has premium plan and test credits
    const adminUser = await db.user.findFirst({ where: { role: 'admin' } });
    if (adminUser) {
      await db.user.update({
        where: { id: adminUser.id },
        data: {
          plan: 'premium',
          testCredits: 999,
          emailVerified: true,
        },
      });
      adminUpdated = true;
    }

    // ── SEED MCQ QUESTIONS ──
    const existingMCQCount = await db.question.count();
    if (existingMCQCount < 48) {
      const questions = generateSeedQuestions();
      for (const q of questions) {
        const exists = await db.question.findFirst({
          where: { text: q.text, level: q.level, category: q.category },
        });
        if (!exists) {
          await db.question.create({
            data: {
              text: q.text,
              options: JSON.stringify(q.options),
              correctIndex: q.correctIndex,
              level: q.level,
              category: q.category,
              explanation: q.explanation || null,
            },
          });
          questionsAdded++;
        }
      }
    }

    // ── SEED READING PASSAGES ──
    const existingReadingCount = await db.readingPassage.count();
    if (existingReadingCount < 6) {
      const passages = generateSeedReadingPassages();
      for (const passage of passages) {
        const exists = await db.readingPassage.findFirst({
          where: { title: passage.title, level: passage.level },
        });
        if (!exists) {
          const created = await db.readingPassage.create({
            data: {
              title: passage.title,
              passageText: passage.passageText,
              level: passage.level,
              isActive: true,
            },
          });
          for (const q of passage.questions) {
            await db.readingQuestion.create({
              data: {
                passageId: created.id,
                questionText: q.questionText,
                options: JSON.stringify(q.options),
                correctIndex: q.correctIndex,
                sortOrder: q.sortOrder,
              },
            });
          }
          readingAdded++;
        }
      }
    }

    // ── SEED LISTENING ITEMS ──
    const existingListeningCount = await db.listeningItem.count();
    if (existingListeningCount < 6) {
      const items = generateSeedListeningItems();
      for (const item of items) {
        const exists = await db.listeningItem.findFirst({
          where: { scriptText: item.scriptText, level: item.level },
        });
        if (!exists) {
          const created = await db.listeningItem.create({
            data: {
              scriptText: item.scriptText,
              context: item.context,
              level: item.level,
              isActive: true,
            },
          });
          for (const q of item.questions) {
            await db.listeningQuestion.create({
              data: {
                itemId: created.id,
                questionText: q.questionText,
                options: JSON.stringify(q.options),
                correctIndex: q.correctIndex,
                sortOrder: q.sortOrder,
              },
            });
          }
          listeningAdded++;
        }
      }
    }

    // ── SEED SPEAKING PROMPTS ──
    const existingSpeakingCount = await db.speakingPrompt.count();
    if (existingSpeakingCount < 8) {
      const prompts = generateSeedSpeakingPrompts();
      for (const prompt of prompts) {
        const exists = await db.speakingPrompt.findFirst({
          where: { promptText: prompt.promptText, level: prompt.level },
        });
        if (!exists) {
          await db.speakingPrompt.create({
            data: {
              promptText: prompt.promptText,
              level: prompt.level,
              preparationTime: prompt.preparationTime,
              responseTime: prompt.responseTime,
              difficultyTier: prompt.difficultyTier,
              isActive: true,
            },
          });
          speakingAdded++;
        }
      }
    }

    // ── SEED WRITING PROMPTS ──
    const existingWritingCount = await db.writingPrompt.count();
    if (existingWritingCount < 8) {
      const prompts = generateSeedWritingPrompts();
      for (const prompt of prompts) {
        const exists = await db.writingPrompt.findFirst({
          where: { promptText: prompt.promptText, level: prompt.level },
        });
        if (!exists) {
          await db.writingPrompt.create({
            data: {
              promptText: prompt.promptText,
              level: prompt.level,
              minWords: prompt.minWords,
              maxWords: prompt.maxWords,
              difficultyTier: prompt.difficultyTier,
              isActive: true,
            },
          });
          writingAdded++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      questionsAdded,
      readingAdded,
      listeningAdded,
      speakingAdded,
      writingAdded,
      adminUpdated,
      totalMCQ: await db.question.count(),
      totalReading: await db.readingPassage.count(),
      totalListening: await db.listeningItem.count(),
      totalSpeaking: await db.speakingPrompt.count(),
      totalWriting: await db.writingPrompt.count(),
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database.' }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════
//  MCQ SEED DATA
// ═══════════════════════════════════════════════════════════

interface SeedQuestion {
  text: string;
  options: string[];
  correctIndex: number;
  level: string;
  category: string;
  explanation?: string;
}

function generateSeedQuestions(): SeedQuestion[] {
  return [
    // ─── A1 Grammar ───
    { text: 'Choose the correct answer: "She ___ a student."', options: ['am', 'is', 'are', 'be'], correctIndex: 1, level: 'A1', category: 'grammar', explanation: '"She" is a third-person singular subject, so it takes "is".' },
    { text: 'Choose the correct form: "I ___ happy."', options: ['am', 'is', 'are', 'be'], correctIndex: 0, level: 'A1', category: 'grammar', explanation: '"I" takes "am" in the simple present.' },
    { text: 'Which is correct? "They ___ from Brazil."', options: ['am', 'is', 'are', 'be'], correctIndex: 2, level: 'A1', category: 'grammar', explanation: '"They" is plural, so it takes "are".' },
    { text: '"___ you like coffee?" Choose the correct question word.', options: ['Do', 'Does', 'Are', 'Is'], correctIndex: 0, level: 'A1', category: 'grammar', explanation: 'With "you", we use "Do" to form questions in the present simple.' },
    // ─── A1 Vocabulary ───
    { text: 'What is the opposite of "big"?', options: ['tall', 'small', 'wide', 'long'], correctIndex: 1, level: 'A1', category: 'vocabulary', explanation: '"Small" is the opposite of "big".' },
    { text: 'Which word means "a place where you live"?', options: ['school', 'home', 'office', 'park'], correctIndex: 1, level: 'A1', category: 'vocabulary' },
    { text: 'What do you use to write?', options: ['A pen', 'A cup', 'A chair', 'A door'], correctIndex: 0, level: 'A1', category: 'vocabulary' },
    { text: 'Choose the correct word: "I eat ___ in the morning."', options: ['breakfast', 'lunch', 'dinner', 'supper'], correctIndex: 0, level: 'A1', category: 'vocabulary' },
    // ─── A2 Grammar ───
    { text: 'Choose the correct form: "I ___ to the store yesterday."', options: ['go', 'going', 'went', 'gone'], correctIndex: 2, level: 'A2', category: 'grammar', explanation: '"Yesterday" indicates past tense, so we use "went".' },
    { text: 'Which sentence is correct?', options: ['He can plays guitar.', 'He can play guitar.', 'He can playing guitar.', 'He can played guitar.'], correctIndex: 1, level: 'A2', category: 'grammar', explanation: 'After "can", we use the base form of the verb.' },
    { text: 'Choose the correct answer: "There ___ many people at the party."', options: ['is', 'are', 'was', 'be'], correctIndex: 1, level: 'A2', category: 'grammar', explanation: '"People" is plural, so we use "are" with "there".' },
    { text: '"She has ___ eaten lunch." Choose the correct word.', options: ['yet', 'already', 'never', 'soon'], correctIndex: 1, level: 'A2', category: 'grammar' },
    // ─── A2 Vocabulary ───
    { text: 'Choose the word that means "the weather is very hot":', options: ['freezing', 'boiling', 'chilly', 'breezy'], correctIndex: 1, level: 'A2', category: 'vocabulary' },
    { text: 'What does "rely on" mean?', options: ['To depend on', 'To look at', 'To forget about', 'To argue with'], correctIndex: 0, level: 'A2', category: 'vocabulary' },
    // ─── B1 Grammar ───
    { text: 'Choose the correct answer: "If I ___ rich, I would travel the world."', options: ['am', 'was', 'were', 'be'], correctIndex: 2, level: 'B1', category: 'grammar', explanation: 'In second conditional, we use "were" for all subjects.' },
    { text: '"She was late ___ the heavy traffic." Choose the correct preposition.', options: ['because', 'due to', 'since', 'for'], correctIndex: 1, level: 'B1', category: 'grammar', explanation: '"Due to" is used before a noun phrase to express cause.' },
    { text: 'Choose the correct form: "By the time we arrived, the movie ___."', options: ['started', 'has started', 'had started', 'would start'], correctIndex: 2, level: 'B1', category: 'grammar', explanation: 'Past perfect "had started" is used for an action completed before another past action.' },
    { text: 'Which sentence uses the present perfect correctly?', options: ['I have went to Paris twice.', 'I have been to Paris twice.', 'I have go to Paris twice.', 'I had been to Paris twice.'], correctIndex: 1, level: 'B1', category: 'grammar' },
    // ─── B1 Vocabulary ───
    { text: 'Choose the word closest in meaning to "enormous":', options: ['tiny', 'huge', 'average', 'narrow'], correctIndex: 1, level: 'B1', category: 'vocabulary' },
    { text: 'What does "to put off" mean?', options: ['To wear', 'To delay', 'To turn off', 'To place outside'], correctIndex: 1, level: 'B1', category: 'vocabulary' },
    // ─── B2 Grammar ───
    { text: 'Which sentence uses the passive voice correctly?', options: ['The book was wrote by the author.', 'The book was written by the author.', 'The book is wrote by the author.', 'The book has wrote by the author.'], correctIndex: 1, level: 'B2', category: 'grammar', explanation: '"Written" is the correct past participle of "write".' },
    { text: '"___ hard she tried, she couldn\'t solve the problem." Choose the correct conjunction.', options: ['However', 'No matter how', 'Although', 'Despite'], correctIndex: 1, level: 'B2', category: 'grammar' },
    { text: 'Choose the correct sentence:', options: ['He suggested to go home.', 'He suggested going home.', 'He suggested go home.', 'He suggested went home.'], correctIndex: 1, level: 'B2', category: 'grammar', explanation: 'After "suggest", we use the gerund (-ing) form.' },
    // ─── B2 Vocabulary ───
    { text: 'Choose the word that best completes: "The politician\'s speech was deliberately ___, designed to appeal to everyone without committing to anything."', options: ['ambiguous', 'amusing', 'ambitious', 'amateur'], correctIndex: 0, level: 'B2', category: 'vocabulary' },
    { text: 'What does "to look into" mean in: "The police are looking into the incident"?', options: ['To watch carefully', 'To investigate', 'To ignore', 'To understand'], correctIndex: 1, level: 'B2', category: 'vocabulary' },
    // ─── C1 Grammar ───
    { text: '"Not until the meeting ended ___ the gravity of the situation." Choose the correct inversion.', options: ['did she realize', 'she realized', 'she did realize', 'realized she'], correctIndex: 0, level: 'C1', category: 'grammar', explanation: 'After "Not until", we use inversion: auxiliary + subject + verb.' },
    { text: 'Choose the correct form: "Had I known about the delay, I ___ earlier."', options: ['would leave', 'would have left', 'will leave', 'left'], correctIndex: 1, level: 'C1', category: 'grammar', explanation: 'Third conditional: Had + past participle, would have + past participle.' },
    // ─── C1 Vocabulary ───
    { text: 'Choose the word that best completes: "The professor\'s explanation was so ___ that even the most complex concepts seemed straightforward."', options: ['lucid', 'lurid', 'lucidly', 'lucidity'], correctIndex: 0, level: 'C1', category: 'vocabulary' },
    { text: 'What does "to take something for granted" mean?', options: ['To appreciate something', 'To assume something is true without questioning', 'To deny something', 'To forget something'], correctIndex: 1, level: 'C1', category: 'vocabulary' },
    // ─── C2 Grammar ───
    { text: 'Which sentence demonstrates correct use of the subjunctive mood?', options: ['It is essential that he is present at the meeting.', 'It is essential that he be present at the meeting.', 'It is essential that he was present at the meeting.', 'It is essential that he will be present at the meeting.'], correctIndex: 1, level: 'C2', category: 'grammar', explanation: 'After expressions of necessity, the subjunctive uses the base form "be".' },
    { text: 'Choose the correct form: "Rarely ___ such a comprehensive analysis of the issue."', options: ['has there been', 'there has been', 'has been there', 'been there has'], correctIndex: 0, level: 'C2', category: 'grammar', explanation: 'After negative adverbs like "rarely", we use inversion.' },
    // ─── C2 Vocabulary ───
    { text: '"The policy, ___ intended to help, actually created more problems." Choose the correct word.', options: ['albeit', 'however', 'notwithstanding', 'despite of'], correctIndex: 0, level: 'C2', category: 'vocabulary' },
    { text: 'What does "obfuscate" mean?', options: ['To clarify', 'To make unclear or confusing', 'To observe carefully', 'To object strongly'], correctIndex: 1, level: 'C2', category: 'vocabulary' },
  ];
}

// ═══════════════════════════════════════════════════════════
//  READING PASSAGE SEED DATA
// ═══════════════════════════════════════════════════════════

interface SeedReadingPassage {
  title: string;
  passageText: string;
  level: string;
  questions: Array<{
    questionText: string;
    options: string[];
    correctIndex: number;
    sortOrder: number;
  }>;
}

function generateSeedReadingPassages(): SeedReadingPassage[] {
  return [
    {
      title: 'The New Library',
      passageText: 'The new library will open next Monday. It will have over 10,000 books and free WiFi. Members can borrow up to 5 books at a time. Membership is free for city residents. The library will also offer reading groups for children every Saturday morning and computer classes for adults on Wednesday evenings.',
      level: 'B1',
      questions: [
        { questionText: 'How many books can members borrow at a time?', options: ['1 book', '3 books', '5 books', '10 books'], correctIndex: 2, sortOrder: 1 },
        { questionText: 'When are the children\'s reading groups?', options: ['Monday morning', 'Saturday morning', 'Wednesday evening', 'Sunday afternoon'], correctIndex: 1, sortOrder: 2 },
        { questionText: 'Who gets free membership?', options: ['Everyone', 'Children only', 'City residents', 'Senior citizens'], correctIndex: 2, sortOrder: 3 },
      ],
    },
    {
      title: 'Jane\'s New Job',
      passageText: 'Jane started a new job last week. She works from 9 to 5, Monday through Friday. She takes the bus to work, which takes about 30 minutes. Her office is on the 12th floor of a tall building downtown. She really enjoys her new colleagues and finds the work challenging but rewarding. The company offers flexible hours after the first three months.',
      level: 'B1',
      questions: [
        { questionText: 'How does Jane get to work?', options: ['She walks', 'She drives', 'She takes the bus', 'She rides a bike'], correctIndex: 2, sortOrder: 1 },
        { questionText: 'What does Jane think about her new job?', options: ['It\'s boring', 'It\'s too easy', 'It\'s challenging but rewarding', 'She doesn\'t like it'], correctIndex: 2, sortOrder: 2 },
      ],
    },
    {
      title: 'Breakfast and Cognitive Performance',
      passageText: 'A recent study found that people who eat breakfast regularly tend to have better concentration and memory throughout the morning. However, the same study noted that the type of breakfast matters: those who ate protein-rich breakfasts performed better on cognitive tests than those who ate sugary cereals. The researchers suggest that a balanced breakfast including eggs, yogurt, or nuts provides sustained energy and supports brain function more effectively than high-sugar alternatives.',
      level: 'B2',
      questions: [
        { questionText: 'What factor influenced cognitive performance according to the study?', options: ['The time of breakfast', 'The type of breakfast', 'Skipping breakfast entirely', 'Eating breakfast at work'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'What do the researchers recommend for breakfast?', options: ['Only sugary cereals', 'No breakfast at all', 'A balanced breakfast with protein', 'Coffee and toast'], correctIndex: 2, sortOrder: 2 },
        { questionText: 'What was the main finding about breakfast eaters?', options: ['They are always healthier', 'They have better concentration and memory', 'They prefer sugary cereals', 'They eat less throughout the day'], correctIndex: 1, sortOrder: 3 },
      ],
    },
    {
      title: 'Remote Work Revolution',
      passageText: 'The shift to remote work, accelerated by the global pandemic, has fundamentally changed how companies think about productivity. While some employers initially feared that employees would be less productive at home, studies have shown the opposite: remote workers are, on average, 13% more productive than their office-based counterparts. However, the lack of in-person interaction has led to concerns about employee isolation and the erosion of company culture. Many organizations are now adopting hybrid models that combine the flexibility of remote work with the collaborative benefits of in-office days.',
      level: 'B2',
      questions: [
        { questionText: 'What did studies reveal about remote worker productivity?', options: ['It decreased by 13%', 'It increased by 13%', 'It stayed the same', 'It varied widely by industry'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'What is a concern about remote work mentioned in the text?', options: ['Higher costs for companies', 'Employee isolation and culture erosion', 'Workers prefer the office', 'Technology limitations'], correctIndex: 1, sortOrder: 2 },
        { questionText: 'What solution are many organizations adopting?', options: ['Full-time office return', 'Full-time remote work', 'Hybrid models', 'Rotating schedules'], correctIndex: 2, sortOrder: 3 },
      ],
    },
    {
      title: 'The Ethics of Artificial Intelligence',
      passageText: 'As artificial intelligence systems become increasingly sophisticated, the ethical questions surrounding their deployment grow more pressing. The use of AI in hiring processes, for instance, has raised concerns about algorithmic bias, where machine learning models trained on historical data may perpetuate existing discrimination patterns. Critics argue that without proper oversight, AI could reinforce societal inequalities rather than eliminate them. Proponents, however, contend that well-designed AI systems can actually reduce human bias by making decisions based on data rather than intuition. The key challenge lies in ensuring transparency, accountability, and fairness in AI decision-making processes.',
      level: 'C1',
      questions: [
        { questionText: 'What concern does the text raise about AI in hiring?', options: ['It is too expensive', 'It may perpetuate discrimination through algorithmic bias', 'It makes hiring too fast', 'It eliminates human judgment entirely'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'What do proponents argue about well-designed AI?', options: ['It should replace all human decisions', 'It can reduce human bias', 'It is infallible', 'It eliminates the need for oversight'], correctIndex: 1, sortOrder: 2 },
        { questionText: 'According to the text, what is the key challenge for AI?', options: ['Making it faster', 'Reducing costs', 'Ensuring transparency, accountability, and fairness', 'Training on more data'], correctIndex: 2, sortOrder: 3 },
      ],
    },
    {
      title: 'Digital Healthcare and Privacy',
      passageText: 'The rapid digitization of healthcare records has improved efficiency but raised significant privacy concerns. While electronic health records enable faster diagnosis and better coordination between providers, they also create vulnerabilities. Data breaches in healthcare have increased by 55% over the past five years, exposing sensitive patient information. Some experts argue that the benefits of digitization outweigh the risks, provided that robust cybersecurity measures are implemented. Others contend that no system can be truly secure and that the potential for misuse of deeply personal medical data demands a more cautious approach to digital transformation in healthcare.',
      level: 'C1',
      questions: [
        { questionText: 'What condition do some experts set for digitization benefits to outweigh risks?', options: ['Slower digitization', 'Robust cybersecurity measures', 'Eliminating electronic records', 'More government regulation'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'By how much have healthcare data breaches increased?', options: ['25%', '35%', '45%', '55%'], correctIndex: 3, sortOrder: 2 },
      ],
    },
  ];
}

// ═══════════════════════════════════════════════════════════
//  LISTENING ITEM SEED DATA
// ═══════════════════════════════════════════════════════════

interface SeedListeningItem {
  scriptText: string;
  context: string;
  level: string;
  questions: Array<{
    questionText: string;
    options: string[];
    correctIndex: number;
    sortOrder: number;
  }>;
}

function generateSeedListeningItems(): SeedListeningItem[] {
  return [
    {
      scriptText: 'Excuse me, could you tell me where the nearest post office is? Sure, go straight for two blocks and turn right. It\'s next to the bank. Thank you very much. You\'re welcome!',
      context: 'Asking for directions in a city',
      level: 'B1',
      questions: [
        { questionText: 'Where is the post office?', options: ['Two blocks left', 'Next to the bank', 'Behind the bank', 'On the same street'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'How many blocks should the person walk straight?', options: ['One block', 'Two blocks', 'Three blocks', 'Four blocks'], correctIndex: 1, sortOrder: 2 },
      ],
    },
    {
      scriptText: 'Hi, I\'d like to make a reservation for two at 7 PM tonight. Certainly, may I have your name? It\'s Johnson. And could you confirm a phone number? Yes, it\'s 555-0192. Perfect, Mr. Johnson, your table for two at 7 PM is confirmed. We look forward to seeing you.',
      context: 'Making a restaurant reservation',
      level: 'B1',
      questions: [
        { questionText: 'What is the person doing?', options: ['Ordering food', 'Making a restaurant reservation', 'Booking a hotel', 'Buying tickets'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'What time is the reservation for?', options: ['6 PM', '7 PM', '8 PM', '9 PM'], correctIndex: 1, sortOrder: 2 },
      ],
    },
    {
      scriptText: 'The meeting has been postponed until further notice due to the CEO\'s unexpected travel. We\'ll send out a new invitation once the date is confirmed. In the meantime, please continue working on your individual tasks and report any urgent matters to the department head.',
      context: 'Office announcement about a meeting',
      level: 'B2',
      questions: [
        { questionText: 'What happened to the meeting?', options: ['It was canceled', 'It was postponed', 'It was shortened', 'It was moved online'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'What are employees asked to do in the meantime?', options: ['Go home early', 'Continue working on individual tasks', 'Contact the CEO', 'Prepare for the meeting'], correctIndex: 1, sortOrder: 2 },
      ],
    },
    {
      scriptText: 'Good morning, everyone. Today I\'d like to present our quarterly results. Revenue increased by 12% compared to the same period last year, primarily driven by strong performance in our Asian markets. However, operating costs also rose by 8%, mainly due to increased raw material prices and higher shipping fees. Despite these challenges, our net profit margin improved from 15% to 17%, which we attribute to our ongoing efficiency programs.',
      context: 'Business presentation on quarterly results',
      level: 'B2',
      questions: [
        { questionText: 'By how much did revenue increase?', options: ['8%', '10%', '12%', '15%'], correctIndex: 2, sortOrder: 1 },
        { questionText: 'What caused the increase in operating costs?', options: ['Higher salaries', 'Raw material prices and shipping fees', 'New office space', 'Marketing expenses'], correctIndex: 1, sortOrder: 2 },
        { questionText: 'What was the net profit margin improvement?', options: ['From 8% to 12%', 'From 12% to 15%', 'From 15% to 17%', 'From 17% to 20%'], correctIndex: 2, sortOrder: 3 },
      ],
    },
    {
      scriptText: 'While the initial findings appear promising, we should exercise caution before drawing definitive conclusions. The sample size was relatively small, and the control group wasn\'t perfectly matched. Further research with a larger, more diverse cohort is warranted before we can recommend this as a standard treatment protocol.',
      context: 'Scientific research discussion',
      level: 'C1',
      questions: [
        { questionText: 'What is the speaker\'s main point?', options: ['The findings are conclusive', 'More research is needed before confirming the results', 'The research was poorly designed', 'The control group performed better'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'Why does the speaker recommend caution?', options: ['The treatment is dangerous', 'The sample size was small and the control group wasn\'t perfectly matched', 'The findings contradict previous studies', 'The funding was insufficient'], correctIndex: 1, sortOrder: 2 },
      ],
    },
    {
      scriptText: 'The committee\'s recommendations, while not legally binding, carry considerable weight in shaping policy. That said, the implementation gap between recommendation and regulation remains a persistent challenge. Historical precedent suggests that without enforcement mechanisms, even well-intentioned guidelines tend to be selectively adopted. Therefore, we propose the establishment of an independent oversight body with the authority to monitor compliance and impose meaningful sanctions for non-adherence.',
      context: 'Policy committee discussion',
      level: 'C1',
      questions: [
        { questionText: 'What does the speaker imply about the recommendations?', options: ['They will immediately become law', 'They are likely to be selectively implemented without enforcement', 'They are not useful', 'They have never influenced policy'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'What does the speaker propose to address the challenge?', options: ['More recommendations', 'An independent oversight body with enforcement authority', 'Voluntary compliance programs', 'Government intervention'], correctIndex: 1, sortOrder: 2 },
      ],
    },
  ];
}

// ═══════════════════════════════════════════════════════════
//  SPEAKING PROMPT SEED DATA
// ═══════════════════════════════════════════════════════════

interface SeedSpeakingPrompt {
  promptText: string;
  level: string;
  preparationTime: number;
  responseTime: number;
  difficultyTier: number;
}

function generateSeedSpeakingPrompts(): SeedSpeakingPrompt[] {
  return [
    // A2 Level
    {
      promptText: 'Introduce yourself. Talk about your name, where you live, what you do, and one hobby you enjoy.',
      level: 'A2',
      preparationTime: 30,
      responseTime: 60,
      difficultyTier: 2,
    },
    {
      promptText: 'Describe your typical weekend. What do you usually do? Who do you spend time with? What do you enjoy most about weekends?',
      level: 'A2',
      preparationTime: 30,
      responseTime: 60,
      difficultyTier: 2,
    },
    // B1 Level
    {
      promptText: 'Talk about a memorable trip you have taken. Where did you go? What did you do there? Would you recommend this place to others and why?',
      level: 'B1',
      preparationTime: 30,
      responseTime: 90,
      difficultyTier: 4,
    },
    {
      promptText: 'Describe a skill you would like to learn in the future. Why is this skill important to you? How do you plan to learn it? What challenges might you face?',
      level: 'B1',
      preparationTime: 30,
      responseTime: 90,
      difficultyTier: 4,
    },
    // B2 Level
    {
      promptText: 'Some cities have banned cars from their city centers to reduce pollution and congestion. Do you think this is a good idea? Give reasons for your opinion and address potential counterarguments.',
      level: 'B2',
      preparationTime: 45,
      responseTime: 120,
      difficultyTier: 6,
    },
    {
      promptText: 'Describe a memorable experience from your life and explain why it shaped who you are today. What happened, how did it affect you, and what did you learn from it?',
      level: 'B2',
      preparationTime: 45,
      responseTime: 120,
      difficultyTier: 6,
    },
    // C1 Level
    {
      promptText: 'Discuss the following statement: "The measure of a civilization is how it treats its most vulnerable members." Explore different interpretations of this idea, provide concrete examples, and explain whether you agree or disagree.',
      level: 'C1',
      preparationTime: 60,
      responseTime: 150,
      difficultyTier: 8,
    },
    {
      promptText: 'Some people believe that technology is making us more connected, while others argue it is making us more isolated. Discuss both perspectives and share your own viewpoint, supporting it with specific examples and reasoning.',
      level: 'C1',
      preparationTime: 60,
      responseTime: 150,
      difficultyTier: 8,
    },
  ];
}

// ═══════════════════════════════════════════════════════════
//  WRITING PROMPT SEED DATA
// ═══════════════════════════════════════════════════════════

interface SeedWritingPrompt {
  promptText: string;
  level: string;
  minWords: number;
  maxWords: number;
  difficultyTier: number;
}

function generateSeedWritingPrompts(): SeedWritingPrompt[] {
  return [
    // A2 Level
    {
      promptText: 'Write an email to a friend telling them about your new job. Include information about what you do, what you like about it, and what you find challenging.',
      level: 'A2',
      minWords: 50,
      maxWords: 120,
      difficultyTier: 2,
    },
    {
      promptText: 'Write a short paragraph about your favorite season. Explain why you like it and describe what activities you enjoy during this season.',
      level: 'A2',
      minWords: 50,
      maxWords: 120,
      difficultyTier: 2,
    },
    // B1 Level
    {
      promptText: 'Write a review of a restaurant you recently visited. Describe the food, service, and atmosphere. Would you recommend it to others? Why or why not?',
      level: 'B1',
      minWords: 100,
      maxWords: 200,
      difficultyTier: 4,
    },
    {
      promptText: 'Write a letter to your local newspaper expressing your opinion about a public issue in your community. Explain the problem and suggest possible solutions.',
      level: 'B1',
      minWords: 100,
      maxWords: 200,
      difficultyTier: 4,
    },
    // B2 Level
    {
      promptText: 'Some people believe that university education should be free for all students, while others think students should pay for their education. Discuss both views and give your own opinion.',
      level: 'B2',
      minWords: 150,
      maxWords: 300,
      difficultyTier: 6,
    },
    {
      promptText: 'Write an essay discussing the impact of social media on interpersonal relationships. Consider both positive and negative effects, and provide specific examples to support your arguments.',
      level: 'B2',
      minWords: 150,
      maxWords: 300,
      difficultyTier: 6,
    },
    // C1 Level
    {
      promptText: 'Write a critical analysis of the following quotation: "In a time of deceit, telling the truth is a revolutionary act." Discuss the implications of this statement in the context of modern society, media, and politics.',
      level: 'C1',
      minWords: 200,
      maxWords: 400,
      difficultyTier: 8,
    },
    {
      promptText: 'Write an argumentative essay examining whether economic growth should be prioritized over environmental protection. Analyze the trade-offs involved and propose a balanced approach, supporting your arguments with evidence and reasoning.',
      level: 'C1',
      minWords: 200,
      maxWords: 400,
      difficultyTier: 8,
    },
  ];
}
