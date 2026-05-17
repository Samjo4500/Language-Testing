import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';

/**
 * POST /api/admin/seed
 * Seed the database with comprehensive CEFR questions and ensure admin has proper access.
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    let questionsAdded = 0;
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

    // Check existing question count
    const existingCount = await db.question.count();
    if (existingCount >= 48) {
      return NextResponse.json({
        message: 'Database already has sufficient questions.',
        existingCount,
        adminUpdated,
        questionsAdded: 0,
      });
    }

    // Seed comprehensive questions
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

    return NextResponse.json({
      success: true,
      questionsAdded,
      adminUpdated,
      totalQuestions: await db.question.count(),
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database.' }, { status: 500 });
  }
}

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
    // ─── B1 Reading ───
    { text: 'Read the text: "The new library will open next Monday. It will have over 10,000 books and free WiFi. Members can borrow up to 5 books at a time. Membership is free for city residents." How many books can members borrow?', options: ['1 book', '3 books', '5 books', '10 books'], correctIndex: 2, level: 'B1', category: 'reading' },
    { text: 'Read the text: "Jane started a new job last week. She works from 9 to 5, Monday through Friday. She takes the bus to work, which takes about 30 minutes. Her office is on the 12th floor of a tall building downtown." How does Jane get to work?', options: ['She walks', 'She drives', 'She takes the bus', 'She rides a bike'], correctIndex: 2, level: 'B1', category: 'reading' },
    // ─── B1 Listening ───
    { text: 'You hear: "Excuse me, could you tell me where the nearest post office is? Sure, go straight for two blocks and turn right. It\'s next to the bank." Where is the post office?', options: ['Two blocks left', 'Next to the bank', 'Behind the bank', 'On the same street'], correctIndex: 1, level: 'B1', category: 'listening' },
    { text: 'You hear: "Hi, I\'d like to make a reservation for two at 7 PM tonight. Certainly, may I have your name? It\'s Johnson." What is the person doing?', options: ['Ordering food', 'Making a restaurant reservation', 'Booking a hotel', 'Buying tickets'], correctIndex: 1, level: 'B1', category: 'listening' },
    // ─── B2 Grammar ───
    { text: 'Which sentence uses the passive voice correctly?', options: ['The book was wrote by the author.', 'The book was written by the author.', 'The book is wrote by the author.', 'The book has wrote by the author.'], correctIndex: 1, level: 'B2', category: 'grammar', explanation: '"Written" is the correct past participle of "write".' },
    { text: '"___ hard she tried, she couldn\'t solve the problem." Choose the correct conjunction.', options: ['However', 'No matter how', 'Although', 'Despite'], correctIndex: 1, level: 'B2', category: 'grammar' },
    { text: 'Choose the correct sentence:', options: ['He suggested to go home.', 'He suggested going home.', 'He suggested go home.', 'He suggested went home.'], correctIndex: 1, level: 'B2', category: 'grammar', explanation: 'After "suggest", we use the gerund (-ing) form.' },
    // ─── B2 Vocabulary ───
    { text: 'Choose the word that best completes: "The politician\'s speech was deliberately ___, designed to appeal to everyone without committing to anything."', options: ['ambiguous', 'amusing', 'ambitious', 'amateur'], correctIndex: 0, level: 'B2', category: 'vocabulary' },
    { text: 'What does "to look into" mean in: "The police are looking into the incident"?', options: ['To watch carefully', 'To investigate', 'To ignore', 'To understand'], correctIndex: 1, level: 'B2', category: 'vocabulary' },
    // ─── B2 Reading ───
    { text: 'Read: "A recent study found that people who eat breakfast regularly tend to have better concentration and memory throughout the morning. However, the same study noted that the type of breakfast matters: those who ate protein-rich breakfasts performed better on cognitive tests than those who ate sugary cereals." What factor influenced cognitive performance?', options: ['The time of breakfast', 'The type of breakfast', 'Skipping breakfast entirely', 'Eating breakfast at work'], correctIndex: 1, level: 'B2', category: 'reading' },
    // ─── B2 Listening ───
    { text: 'You hear: "The meeting has been postponed until further notice due to the CEO\'s unexpected travel. We\'ll send out a new invitation once the date is confirmed." What happened to the meeting?', options: ['It was canceled', 'It was moved to a different time', 'It was shortened', 'It was moved online'], correctIndex: 1, level: 'B2', category: 'listening' },
    // ─── C1 Grammar ───
    { text: '"Not until the meeting ended ___ the gravity of the situation." Choose the correct inversion.', options: ['did she realize', 'she realized', 'she did realize', 'realized she'], correctIndex: 0, level: 'C1', category: 'grammar', explanation: 'After "Not until", we use inversion: auxiliary + subject + verb.' },
    { text: 'Choose the correct form: "Had I known about the delay, I ___ earlier."', options: ['would leave', 'would have left', 'will leave', 'left'], correctIndex: 1, level: 'C1', category: 'grammar', explanation: 'Third conditional: Had + past participle, would have + past participle.' },
    // ─── C1 Vocabulary ───
    { text: 'Choose the word that best completes: "The professor\'s explanation was so ___ that even the most complex concepts seemed straightforward."', options: ['lucid', 'lurid', 'lucidly', 'lucidity'], correctIndex: 0, level: 'C1', category: 'vocabulary' },
    { text: 'What does "to take something for granted" mean?', options: ['To appreciate something', 'To assume something is true without questioning', 'To deny something', 'To forget something'], correctIndex: 1, level: 'C1', category: 'vocabulary' },
    // ─── C1 Reading ───
    { text: 'Read: "The rapid digitization of healthcare records has improved efficiency but raised significant privacy concerns. While electronic health records enable faster diagnosis and better coordination between providers, they also create vulnerabilities. Data breaches in healthcare have increased by 55% over the past five years, exposing sensitive patient information. Some experts argue that the benefits of digitization outweigh the risks, provided that robust cybersecurity measures are implemented." What condition do experts set for the benefits to outweigh the risks?', options: ['Slower digitization', 'Robust cybersecurity measures', 'Eliminating electronic records', 'More government regulation'], correctIndex: 1, level: 'C1', category: 'reading' },
    // ─── C1 Listening ───
    { text: 'You hear: "While the initial findings appear promising, we should exercise caution before drawing definitive conclusions. The sample size was relatively small, and the control group wasn\'t perfectly matched. Further research with a larger, more diverse cohort is warranted." What is the speaker\'s main point?', options: ['The findings are conclusive', 'More research is needed before confirming the results', 'The research was poorly designed', 'The control group performed better'], correctIndex: 1, level: 'C1', category: 'listening' },
    // ─── C2 Grammar ───
    { text: 'Which sentence demonstrates correct use of the subjunctive mood?', options: ['It is essential that he is present at the meeting.', 'It is essential that he be present at the meeting.', 'It is essential that he was present at the meeting.', 'It is essential that he will be present at the meeting.'], correctIndex: 1, level: 'C2', category: 'grammar', explanation: 'After expressions of necessity, the subjunctive uses the base form "be".' },
    { text: 'Choose the correct form: "Rarely ___ such a comprehensive analysis of the issue."', options: ['has there been', 'there has been', 'has been there', 'been there has'], correctIndex: 0, level: 'C2', category: 'grammar', explanation: 'After negative adverbs like "rarely", we use inversion.' },
    // ─── C2 Vocabulary ───
    { text: '"The policy, ___ intended to help, actually created more problems." Choose the correct word.', options: ['albeit', 'however', 'notwithstanding', 'despite of'], correctIndex: 0, level: 'C2', category: 'vocabulary' },
    { text: 'What does "obfuscate" mean?', options: ['To clarify', 'To make unclear or confusing', 'To observe carefully', 'To object strongly'], correctIndex: 1, level: 'C2', category: 'vocabulary' },
    // ─── C2 Reading ───
    { text: 'Read: "The paradox of tolerance, as articulated by philosopher Karl Popper, posits that a tolerant society must be intolerant of intolerance, lest the intolerant exploit the very tolerance that protects them and ultimately destroy the tolerant society from within. This creates a philosophical tension: the principle of tolerance, when applied universally and without exception, becomes self-defeating. The resolution, Popper suggests, lies not in abandoning tolerance but in recognizing its limits as a form of self-preservation." What is the paradox described?', options: ['Tolerance and intolerance are the same thing', 'Universal tolerance can lead to the destruction of tolerance itself', 'Philosophers cannot agree on the definition of tolerance', 'Intolerance is always justified in society'], correctIndex: 1, level: 'C2', category: 'reading' },
    // ─── C2 Listening ───
    { text: 'You hear: "The committee\'s recommendations, while not legally binding, carry considerable weight in shaping policy. That said, the implementation gap between recommendation and regulation remains a persistent challenge. Historical precedent suggests that without enforcement mechanisms, even well-intentioned guidelines tend to be selectively adopted." What does the speaker imply about the recommendations?', options: ['They will immediately become law', 'They are likely to be selectively implemented without enforcement', 'They are not useful', 'They have never influenced policy'], correctIndex: 1, level: 'C2', category: 'listening' },
  ];
}
