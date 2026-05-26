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
    if (existingMCQCount < 120) {
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
    if (existingReadingCount < 10) {
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
    if (existingListeningCount < 10) {
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
    if (existingSpeakingCount < 12) {
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
    if (existingWritingCount < 12) {
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
    // ═══════════ A1 GRAMMAR (10 questions) ═══════════
    { text: 'Choose the correct answer: "She ___ a student."', options: ['am', 'is', 'are', 'be'], correctIndex: 1, level: 'A1', category: 'grammar', explanation: '"She" is a third-person singular subject, so it takes "is".' },
    { text: 'Choose the correct form: "I ___ happy."', options: ['am', 'is', 'are', 'be'], correctIndex: 0, level: 'A1', category: 'grammar', explanation: '"I" takes "am" in the simple present.' },
    { text: 'Which is correct? "They ___ from Brazil."', options: ['am', 'is', 'are', 'be'], correctIndex: 2, level: 'A1', category: 'grammar', explanation: '"They" is plural, so it takes "are".' },
    { text: '"___ you like coffee?" Choose the correct question word.', options: ['Do', 'Does', 'Are', 'Is'], correctIndex: 0, level: 'A1', category: 'grammar', explanation: 'With "you", we use "Do" to form questions in the present simple.' },
    { text: 'Choose the correct answer: "He ___ to school every day."', options: ['go', 'goes', 'going', 'gone'], correctIndex: 1, level: 'A1', category: 'grammar', explanation: 'Third-person singular "he" requires the -s form "goes" in present simple.' },
    { text: 'Which is correct? "We ___ got a car."', options: ['has', 'have', 'are', 'is'], correctIndex: 1, level: 'A1', category: 'grammar', explanation: '"We" is plural, so we use "have" with "got".' },
    { text: '"There ___ a book on the table." Choose the correct word.', options: ['are', 'is', 'am', 'be'], correctIndex: 1, level: 'A1', category: 'grammar', explanation: '"A book" is singular, so we use "there is".' },
    { text: 'Choose the correct answer: "___ she play tennis?"', options: ['Do', 'Does', 'Is', 'Are'], correctIndex: 1, level: 'A1', category: 'grammar', explanation: 'Third-person singular "she" uses "Does" for present simple questions.' },
    { text: 'Which sentence is correct?', options: ['I can swimming.', 'I can swim.', 'I can to swim.', 'I can swims.'], correctIndex: 1, level: 'A1', category: 'grammar', explanation: 'After "can", we use the base form of the verb without "to".' },
    { text: '"This is ___ apple." Choose the correct article.', options: ['a', 'an', 'the', 'no article'], correctIndex: 1, level: 'A1', category: 'grammar', explanation: 'We use "an" before words that start with a vowel sound.' },

    // ═══════════ A1 VOCABULARY (10 questions) ═══════════
    { text: 'What is the opposite of "big"?', options: ['tall', 'small', 'wide', 'long'], correctIndex: 1, level: 'A1', category: 'vocabulary', explanation: '"Small" is the opposite of "big".' },
    { text: 'Which word means "a place where you live"?', options: ['school', 'home', 'office', 'park'], correctIndex: 1, level: 'A1', category: 'vocabulary' },
    { text: 'What do you use to write?', options: ['A pen', 'A cup', 'A chair', 'A door'], correctIndex: 0, level: 'A1', category: 'vocabulary' },
    { text: 'Choose the correct word: "I eat ___ in the morning."', options: ['breakfast', 'lunch', 'dinner', 'supper'], correctIndex: 0, level: 'A1', category: 'vocabulary' },
    { text: 'Which word is a fruit?', options: ['Carrot', 'Potato', 'Apple', 'Onion'], correctIndex: 2, level: 'A1', category: 'vocabulary' },
    { text: 'What is the opposite of "hot"?', options: ['warm', 'cool', 'cold', 'wet'], correctIndex: 2, level: 'A1', category: 'vocabulary' },
    { text: 'Which word means "the day after today"?', options: ['Yesterday', 'Today', 'Tomorrow', 'Tonight'], correctIndex: 2, level: 'A1', category: 'vocabulary' },
    { text: 'Choose the correct word: "A ___ teaches students in a school."', options: ['doctor', 'teacher', 'driver', 'cook'], correctIndex: 1, level: 'A1', category: 'vocabulary' },
    { text: 'What do you wear on your feet?', options: ['A hat', 'Gloves', 'Shoes', 'A scarf'], correctIndex: 2, level: 'A1', category: 'vocabulary' },
    { text: 'Which word means "not expensive"?', options: ['cheap', 'rich', 'heavy', 'slow'], correctIndex: 0, level: 'A1', category: 'vocabulary' },

    // ═══════════ A2 GRAMMAR (10 questions) ═══════════
    { text: 'Choose the correct form: "I ___ to the store yesterday."', options: ['go', 'going', 'went', 'gone'], correctIndex: 2, level: 'A2', category: 'grammar', explanation: '"Yesterday" indicates past tense, so we use "went".' },
    { text: 'Which sentence is correct?', options: ['He can plays guitar.', 'He can play guitar.', 'He can playing guitar.', 'He can played guitar.'], correctIndex: 1, level: 'A2', category: 'grammar', explanation: 'After "can", we use the base form of the verb.' },
    { text: 'Choose the correct answer: "There ___ many people at the party."', options: ['is', 'are', 'was', 'be'], correctIndex: 1, level: 'A2', category: 'grammar', explanation: '"People" is plural, so we use "are" with "there".' },
    { text: '"She has ___ eaten lunch." Choose the correct word.', options: ['yet', 'already', 'never', 'soon'], correctIndex: 1, level: 'A2', category: 'grammar' },
    { text: 'Choose the correct form: "I ___ TV when the phone rang."', options: ['watch', 'watched', 'was watching', 'have watched'], correctIndex: 2, level: 'A2', category: 'grammar', explanation: 'The past continuous "was watching" describes an action in progress when another event happened.' },
    { text: 'Which sentence uses the comparative correctly?', options: ['She is more tall than her brother.', 'She is taller than her brother.', 'She is tallest than her brother.', 'She is tall than her brother.'], correctIndex: 1, level: 'A2', category: 'grammar', explanation: 'Short adjectives like "tall" use "-er" for the comparative form.' },
    { text: '"I have lived here ___ 2018." Choose the correct word.', options: ['for', 'since', 'from', 'at'], correctIndex: 1, level: 'A2', category: 'grammar', explanation: '"Since" is used with a specific point in time (2018).' },
    { text: 'Choose the correct answer: "___ did you go on holiday?"', options: ['What', 'Where', 'Which', 'Who'], correctIndex: 1, level: 'A2', category: 'grammar', explanation: '"Where" asks about place or location.' },
    { text: 'Which sentence is correct?', options: ['She don\'t like coffee.', 'She doesn\'t likes coffee.', 'She doesn\'t like coffee.', 'She not like coffee.'], correctIndex: 2, level: 'A2', category: 'grammar', explanation: 'Third-person singular negative uses "doesn\'t" + base form.' },
    { text: '"We ___ to the cinema last night." Choose the correct form.', options: ['go', 'goes', 'went', 'have gone'], correctIndex: 2, level: 'A2', category: 'grammar', explanation: '"Last night" indicates past simple, so we use "went".' },

    // ═══════════ A2 VOCABULARY (10 questions) ═══════════
    { text: 'Choose the word that means "the weather is very hot":', options: ['freezing', 'boiling', 'chilly', 'breezy'], correctIndex: 1, level: 'A2', category: 'vocabulary' },
    { text: 'What does "rely on" mean?', options: ['To depend on', 'To look at', 'To forget about', 'To argue with'], correctIndex: 0, level: 'A2', category: 'vocabulary' },
    { text: 'Which word means "to look for something"?', options: ['find', 'search', 'discover', 'notice'], correctIndex: 1, level: 'A2', category: 'vocabulary' },
    { text: 'Choose the correct word: "I need to ___ an appointment with the doctor."', options: ['do', 'make', 'take', 'have'], correctIndex: 1, level: 'A2', category: 'vocabulary', explanation: 'The collocation is "make an appointment".' },
    { text: 'What does "give up" mean?', options: ['To start something', 'To stop trying', 'To hand something to someone', 'To wake up'], correctIndex: 1, level: 'A2', category: 'vocabulary' },
    { text: 'Which word means "the same as another word for happy"?', options: ['sad', 'glad', 'mad', 'bad'], correctIndex: 1, level: 'A2', category: 'vocabulary' },
    { text: 'Choose the word that fits: "The train ___ at 9 AM every morning."', options: ['leaves', 'goes away', 'runs away', 'departs from'], correctIndex: 0, level: 'A2', category: 'vocabulary' },
    { text: 'What does "look forward to" mean?', options: ['To watch something', 'To be excited about something in the future', 'To face forward', 'To return something'], correctIndex: 1, level: 'A2', category: 'vocabulary' },
    { text: 'Which word means "a person who travels on a bus or train"?', options: ['driver', 'passenger', 'conductor', 'pedestrian'], correctIndex: 1, level: 'A2', category: 'vocabulary' },
    { text: 'Choose the word that means "not safe":', options: ['dangerous', 'delicious', 'different', 'difficult'], correctIndex: 0, level: 'A2', category: 'vocabulary' },

    // ═══════════ B1 GRAMMAR (10 questions) ═══════════
    { text: 'Choose the correct answer: "If I ___ rich, I would travel the world."', options: ['am', 'was', 'were', 'be'], correctIndex: 2, level: 'B1', category: 'grammar', explanation: 'In second conditional, we use "were" for all subjects.' },
    { text: '"She was late ___ the heavy traffic." Choose the correct preposition.', options: ['because', 'due to', 'since', 'for'], correctIndex: 1, level: 'B1', category: 'grammar', explanation: '"Due to" is used before a noun phrase to express cause.' },
    { text: 'Choose the correct form: "By the time we arrived, the movie ___."', options: ['started', 'has started', 'had started', 'would start'], correctIndex: 2, level: 'B1', category: 'grammar', explanation: 'Past perfect "had started" is used for an action completed before another past action.' },
    { text: 'Which sentence uses the present perfect correctly?', options: ['I have went to Paris twice.', 'I have been to Paris twice.', 'I have go to Paris twice.', 'I had been to Paris twice.'], correctIndex: 1, level: 'B1', category: 'grammar' },
    { text: 'Choose the correct form: "She told me she ___ the exam the next day."', options: ['will take', 'would take', 'takes', 'has taken'], correctIndex: 1, level: 'B1', category: 'grammar', explanation: 'Reported speech shifts "will" to "would" for future reference.' },
    { text: '"I wish I ___ speak French." Choose the correct form.', options: ['can', 'could', 'will', 'would'], correctIndex: 1, level: 'B1', category: 'grammar', explanation: '"Wish" is followed by the past form "could" for present unreal situations.' },
    { text: 'Which sentence is correct?', options: ['He is used to get up early.', 'He is used to getting up early.', 'He used to getting up early.', 'He is used to got up early.'], correctIndex: 1, level: 'B1', category: 'grammar', explanation: '"Be used to" is followed by the gerund (-ing) form.' },
    { text: 'Choose the correct answer: "The book ___ by millions of people worldwide."', options: ['reads', 'has read', 'has been read', 'is reading'], correctIndex: 2, level: 'B1', category: 'grammar', explanation: 'Passive voice with present perfect: "has been read".' },
    { text: '"___ I borrow your pen, please?" Choose the correct word.', options: ['Will', 'May', 'Do', 'Am'], correctIndex: 1, level: 'B1', category: 'grammar', explanation: '"May" is a polite way to ask for permission.' },
    { text: 'Which sentence uses "used to" correctly?', options: ['I used to playing football every day.', 'I used to play football every day.', 'I use to play football every day.', 'I am used to play football every day.'], correctIndex: 1, level: 'B1', category: 'grammar', explanation: '"Used to" is followed by the base form of the verb to describe past habits.' },

    // ═══════════ B1 VOCABULARY (10 questions) ═══════════
    { text: 'Choose the word closest in meaning to "enormous":', options: ['tiny', 'huge', 'average', 'narrow'], correctIndex: 1, level: 'B1', category: 'vocabulary' },
    { text: 'What does "to put off" mean?', options: ['To wear', 'To delay', 'To turn off', 'To place outside'], correctIndex: 1, level: 'B1', category: 'vocabulary' },
    { text: 'Choose the word that best fits: "The company decided to ___ the project due to lack of funding."', options: ['abandon', 'accomplish', 'accelerate', 'accumulate'], correctIndex: 0, level: 'B1', category: 'vocabulary' },
    { text: 'What does "turn out" mean in: "The party turned out to be a great success"?', options: ['To switch off', 'To result in', 'To reject', 'To return'], correctIndex: 1, level: 'B1', category: 'vocabulary' },
    { text: 'Choose the correct collocation: "She ___ a decision to change jobs."', options: ['did', 'made', 'took', 'had'], correctIndex: 1, level: 'B1', category: 'vocabulary', explanation: 'The correct collocation is "make a decision".' },
    { text: 'Which word means "the ability to stay calm in difficult situations"?', options: ['patience', 'passion', 'pressure', 'pattern'], correctIndex: 0, level: 'B1', category: 'vocabulary' },
    { text: 'What does "come across" mean?', options: ['To cross a road', 'To find by chance', 'To disagree', 'To recover'], correctIndex: 1, level: 'B1', category: 'vocabulary' },
    { text: 'Choose the word that fits: "The hotel was ___, with beautiful rooms and excellent service."', options: ['disappointing', 'impressive', 'ordinary', 'basic'], correctIndex: 1, level: 'B1', category: 'vocabulary' },
    { text: 'What is the meaning of "look after"?', options: ['To stare at', 'To take care of', 'To search for', 'To resemble'], correctIndex: 1, level: 'B1', category: 'vocabulary' },
    { text: 'Choose the word closest in meaning to "reluctant":', options: ['eager', 'unwilling', 'cheerful', 'generous'], correctIndex: 1, level: 'B1', category: 'vocabulary' },

    // ═══════════ B2 GRAMMAR (10 questions) ═══════════
    { text: 'Which sentence uses the passive voice correctly?', options: ['The book was wrote by the author.', 'The book was written by the author.', 'The book is wrote by the author.', 'The book has wrote by the author.'], correctIndex: 1, level: 'B2', category: 'grammar', explanation: '"Written" is the correct past participle of "write".' },
    { text: '"___ hard she tried, she couldn\'t solve the problem." Choose the correct conjunction.', options: ['However', 'No matter how', 'Although', 'Despite'], correctIndex: 1, level: 'B2', category: 'grammar' },
    { text: 'Choose the correct sentence:', options: ['He suggested to go home.', 'He suggested going home.', 'He suggested go home.', 'He suggested went home.'], correctIndex: 1, level: 'B2', category: 'grammar', explanation: 'After "suggest", we use the gerund (-ing) form.' },
    { text: 'Choose the correct form: "If I had known you were coming, I ___ a cake."', options: ['would bake', 'would have baked', 'will bake', 'baked'], correctIndex: 1, level: 'B2', category: 'grammar', explanation: 'Third conditional: "would have baked" for unreal past situations.' },
    { text: 'Which sentence correctly uses a relative clause?', options: ['The man which lives next door is a doctor.', 'The man who lives next door is a doctor.', 'The man what lives next door is a doctor.', 'The man where lives next door is a doctor.'], correctIndex: 1, level: 'B2', category: 'grammar', explanation: '"Who" is the correct relative pronoun for people.' },
    { text: '"She speaks English ___ than her brother." Choose the correct form.', options: ['more fluent', 'more fluently', 'fluenter', 'most fluently'], correctIndex: 1, level: 'B2', category: 'grammar', explanation: 'Adverbs (fluently) are used to modify verbs, and the comparative form is "more fluently".' },
    { text: 'Choose the correct sentence:', options: ['Neither John nor his friends was there.', 'Neither John nor his friends were there.', 'Neither John nor his friends has been there.', 'Neither John nor his friends is there.'], correctIndex: 1, level: 'B2', category: 'grammar', explanation: 'With "neither...nor", the verb agrees with the subject closest to it ("friends" = plural → "were").' },
    { text: '"I\'d rather you ___ smoke in here." Choose the correct form.', options: ['don\'t', 'didn\'t', 'won\'t', 'wouldn\'t'], correctIndex: 1, level: 'B2', category: 'grammar', explanation: '"I\'d rather" is followed by the past tense for present/future preferences about others.' },
    { text: 'Which sentence uses the future perfect correctly?', options: ['By next year, I will graduate.', 'By next year, I will have graduated.', 'By next year, I will be graduating.', 'By next year, I graduate.'], correctIndex: 1, level: 'B2', category: 'grammar', explanation: 'The future perfect "will have graduated" describes an action completed before a future time.' },
    { text: '"The report, ___ was submitted yesterday, contains several errors." Choose the correct relative pronoun.', options: ['that', 'which', 'what', 'who'], correctIndex: 1, level: 'B2', category: 'grammar', explanation: '"Which" is used in non-defining relative clauses (with commas) for things.' },

    // ═══════════ B2 VOCABULARY (10 questions) ═══════════
    { text: 'Choose the word that best completes: "The politician\'s speech was deliberately ___, designed to appeal to everyone without committing to anything."', options: ['ambiguous', 'amusing', 'ambitious', 'amateur'], correctIndex: 0, level: 'B2', category: 'vocabulary' },
    { text: 'What does "to look into" mean in: "The police are looking into the incident"?', options: ['To watch carefully', 'To investigate', 'To ignore', 'To understand'], correctIndex: 1, level: 'B2', category: 'vocabulary' },
    { text: 'Choose the word that best fits: "The new policy has ___ a lot of controversy among employees."', options: ['sparked', 'silenced', 'resolved', 'ignored'], correctIndex: 0, level: 'B2', category: 'vocabulary' },
    { text: 'What does "bring about" mean?', options: ['To carry something', 'To cause to happen', 'To remember', 'To return'], correctIndex: 1, level: 'B2', category: 'vocabulary' },
    { text: 'Choose the correct word: "The scientist\'s ___ was published in a leading journal."', options: ['research', 'search', 'rescue', 'resource'], correctIndex: 0, level: 'B2', category: 'vocabulary' },
    { text: 'What does "to stand for" mean?', options: ['To represent or symbolize', 'To tolerate', 'To rise up', 'To wait'], correctIndex: 0, level: 'B2', category: 'vocabulary' },
    { text: 'Choose the word closest in meaning to "meticulous":', options: ['careless', 'very careful and precise', 'fast', 'angry'], correctIndex: 1, level: 'B2', category: 'vocabulary' },
    { text: 'What does the idiom "to hit the nail on the head" mean?', options: ['To injure oneself', 'To be exactly right', 'To start a project', 'To cause damage'], correctIndex: 1, level: 'B2', category: 'vocabulary' },
    { text: 'Choose the word that best completes: "The government needs to ___ measures to reduce air pollution."', options: ['implement', 'implicate', 'imply', 'import'], correctIndex: 0, level: 'B2', category: 'vocabulary' },
    { text: 'What does "run out of" mean?', options: ['To escape from', 'To have none left', 'To chase someone', 'To exercise'], correctIndex: 1, level: 'B2', category: 'vocabulary' },

    // ═══════════ C1 GRAMMAR (10 questions) ═══════════
    { text: '"Not until the meeting ended ___ the gravity of the situation." Choose the correct inversion.', options: ['did she realize', 'she realized', 'she did realize', 'realized she'], correctIndex: 0, level: 'C1', category: 'grammar', explanation: 'After "Not until", we use inversion: auxiliary + subject + verb.' },
    { text: 'Choose the correct form: "Had I known about the delay, I ___ earlier."', options: ['would leave', 'would have left', 'will leave', 'left'], correctIndex: 1, level: 'C1', category: 'grammar', explanation: 'Third conditional: Had + past participle, would have + past participle.' },
    { text: '"Only then ___ how serious the situation was." Choose the correct form.', options: ['I understood', 'did I understand', 'I did understand', 'understood I'], correctIndex: 1, level: 'C1', category: 'grammar', explanation: 'After "Only then", inversion is required: auxiliary + subject + verb.' },
    { text: 'Which sentence uses the mixed conditional correctly?', options: ['If I had studied medicine, I would be a doctor now.', 'If I studied medicine, I would be a doctor now.', 'If I had studied medicine, I would have been a doctor now.', 'If I would have studied medicine, I am a doctor now.'], correctIndex: 0, level: 'C1', category: 'grammar', explanation: 'Mixed conditional: past condition (had studied) + present result (would be).' },
    { text: 'Choose the correct form: "She insisted that he ___ the truth."', options: ['tells', 'tell', 'told', 'would tell'], correctIndex: 1, level: 'C1', category: 'grammar', explanation: 'After "insisted that", the subjunctive uses the base form "tell".' },
    { text: '"So impressive ___ that the audience gave a standing ovation." Choose the correct form.', options: ['was the performance', 'the performance was', 'did the performance', 'the performance did'], correctIndex: 0, level: 'C1', category: 'grammar', explanation: 'After "So + adjective" at the start of a sentence, inversion is required.' },
    { text: 'Which sentence is grammatically correct?', options: ['He is one of the students who has passed the exam.', 'He is one of the students who have passed the exam.', 'He is one of the students who has pass the exam.', 'He is one of the students who have been passing the exam.'], correctIndex: 1, level: 'C1', category: 'grammar', explanation: '"Who" refers to "the students" (plural), so the verb must be "have passed".' },
    { text: '"Little ___ know what was about to happen." Choose the correct form.', options: ['did they', 'they did', 'they', 'do they'], correctIndex: 0, level: 'C1', category: 'grammar', explanation: 'After negative adverb "Little", inversion is required.' },
    { text: 'Choose the correct form: "Were she ___ the truth, the consequences would be severe."', options: ['to reveal', 'revealing', 'revealed', 'reveal'], correctIndex: 0, level: 'C1', category: 'grammar', explanation: 'In formal conditional inversion with "were", we use "were + to + infinitive".' },
    { text: 'Which sentence correctly uses a cleft structure for emphasis?', options: ['It was the manager who made the decision.', 'It is the manager which made the decision.', 'It was the manager what made the decision.', 'The manager it was who made decision.'], correctIndex: 0, level: 'C1', category: 'grammar', explanation: 'Cleft sentence: "It was + emphasized element + who/that + rest of sentence".' },

    // ═══════════ C1 VOCABULARY (10 questions) ═══════════
    { text: 'Choose the word that best completes: "The professor\'s explanation was so ___ that even the most complex concepts seemed straightforward."', options: ['lucid', 'lurid', 'lucidly', 'lucidity'], correctIndex: 0, level: 'C1', category: 'vocabulary' },
    { text: 'What does "to take something for granted" mean?', options: ['To appreciate something', 'To assume something is true without questioning', 'To deny something', 'To forget something'], correctIndex: 1, level: 'C1', category: 'vocabulary' },
    { text: 'Choose the word that best fits: "The diplomat gave an ___ response, carefully avoiding any commitment."', options: ['evocative', 'evasive', 'evident', 'even'], correctIndex: 1, level: 'C1', category: 'vocabulary' },
    { text: 'What does "to bear the brunt of" mean?', options: ['To carry something heavy', 'To suffer the worst part of something', 'To support someone', 'To give birth'], correctIndex: 1, level: 'C1', category: 'vocabulary' },
    { text: 'Choose the word closest in meaning to "pragmatic":', options: ['idealistic', 'practical and realistic', 'theoretical', 'emotional'], correctIndex: 1, level: 'C1', category: 'vocabulary' },
    { text: 'What does "to toe the line" mean?', options: ['To walk straight', 'To conform to rules or standards', 'To cross a boundary', 'To hesitate'], correctIndex: 1, level: 'C1', category: 'vocabulary' },
    { text: 'Choose the word that best completes: "The discovery was entirely ___, not the result of careful planning."', options: ['serendipitous', 'seditious', 'sedentary', 'seminal'], correctIndex: 0, level: 'C1', category: 'vocabulary' },
    { text: 'What does "to pave the way for" mean?', options: ['To build a road', 'To make something possible or easier', 'To block progress', 'To repair something'], correctIndex: 1, level: 'C1', category: 'vocabulary' },
    { text: 'Choose the word closest in meaning to "ubiquitous":', options: ['rare', 'present everywhere', 'unique', 'invisible'], correctIndex: 1, level: 'C1', category: 'vocabulary' },
    { text: 'What does "to pull strings" mean?', options: ['To play an instrument', 'To use influence to get something done', 'To create something', 'To argue'], correctIndex: 1, level: 'C1', category: 'vocabulary' },

    // ═══════════ C2 GRAMMAR (10 questions) ═══════════
    { text: 'Which sentence demonstrates correct use of the subjunctive mood?', options: ['It is essential that he is present at the meeting.', 'It is essential that he be present at the meeting.', 'It is essential that he was present at the meeting.', 'It is essential that he will be present at the meeting.'], correctIndex: 1, level: 'C2', category: 'grammar', explanation: 'After expressions of necessity, the subjunctive uses the base form "be".' },
    { text: 'Choose the correct form: "Rarely ___ such a comprehensive analysis of the issue."', options: ['has there been', 'there has been', 'has been there', 'been there has'], correctIndex: 0, level: 'C2', category: 'grammar', explanation: 'After negative adverbs like "rarely", we use inversion.' },
    { text: '"At no time ___ the seriousness of the allegations." Choose the correct form.', options: ['did he acknowledge', 'he acknowledged', 'he did acknowledge', 'acknowledged he'], correctIndex: 0, level: 'C2', category: 'grammar', explanation: '"At no time" triggers negative inversion: auxiliary + subject + verb.' },
    { text: 'Which sentence uses the future-in-the-past correctly?', options: ['She said she will finish by Friday.', 'She said she would finish by Friday.', 'She said she would have finish by Friday.', 'She said she will have finished by Friday.'], correctIndex: 1, level: 'C2', category: 'grammar', explanation: '"Would" is used in reported speech to express future from a past perspective.' },
    { text: 'Choose the correct form: "Not only ___ the deadline, but she also exceeded all expectations."', options: ['she met', 'did she meet', 'she did meet', 'met she'], correctIndex: 1, level: 'C2', category: 'grammar', explanation: '"Not only" at the start of a sentence triggers inversion.' },
    { text: '"Had it not been for the intervention, the crisis ___ far worse." Choose the correct form.', options: ['would be', 'would have been', 'will be', 'was'], correctIndex: 1, level: 'C2', category: 'grammar', explanation: 'Third conditional with inverted "if": "Had it not been for... would have been".' },
    { text: 'Which sentence correctly uses an absolute phrase?', options: ['The weather being fine, we went for a walk.', 'The weather was fine, we went for a walk.', 'Being fine weather, went for a walk.', 'The weather, being fine we went for a walk.'], correctIndex: 0, level: 'C2', category: 'grammar', explanation: 'An absolute phrase consists of a noun + participle, modifying the whole sentence.' },
    { text: 'Choose the correct form: "Under no circumstances ___ the terms of the agreement."', options: ['should you accept', 'you should accept', 'you accept should', 'accept you should'], correctIndex: 0, level: 'C2', category: 'grammar', explanation: '"Under no circumstances" triggers negative inversion.' },
    { text: '"The more he explained, ___ confused the students became." Choose the correct form.', options: ['the more', 'the most', 'more', 'most'], correctIndex: 0, level: 'C2', category: 'grammar', explanation: 'Correlative comparative: "The more... the more" shows proportional relationship.' },
    { text: 'Which sentence uses the nominative absolute correctly?', options: ['The meeting having concluded, the delegates dispersed.', 'The meeting having concluded the delegates dispersed.', 'Having concluded the meeting, the delegates dispersed.', 'The meeting, having concluded, the delegates dispersed.'], correctIndex: 0, level: 'C2', category: 'grammar', explanation: 'A nominative absolute modifies the entire main clause and is set off by a comma.' },

    // ═══════════ C2 VOCABULARY (10 questions) ═══════════
    { text: '"The policy, ___ intended to help, actually created more problems." Choose the correct word.', options: ['albeit', 'however', 'notwithstanding', 'despite of'], correctIndex: 0, level: 'C2', category: 'vocabulary' },
    { text: 'What does "obfuscate" mean?', options: ['To clarify', 'To make unclear or confusing', 'To observe carefully', 'To object strongly'], correctIndex: 1, level: 'C2', category: 'vocabulary' },
    { text: 'Choose the word that best completes: "The author\'s prose is characterized by its ___; every word is carefully chosen for maximum effect."', options: ['verbosity', 'economy', 'redundancy', 'prolixity'], correctIndex: 1, level: 'C2', category: 'vocabulary' },
    { text: 'What does "to give short shrift" mean?', options: ['To explain briefly', 'To pay little attention to or dismiss quickly', 'To be polite', 'To shorten something'], correctIndex: 1, level: 'C2', category: 'vocabulary' },
    { text: 'Choose the word closest in meaning to "pusillanimous":', options: ['brave', 'cowardly', 'generous', 'stubborn'], correctIndex: 1, level: 'C2', category: 'vocabulary' },
    { text: 'What does "to be at loggerheads" mean?', options: ['To be in a state of disagreement or conflict', 'To work together', 'To be at the beginning', 'To sleep deeply'], correctIndex: 0, level: 'C2', category: 'vocabulary' },
    { text: 'Choose the word that best completes: "The scholar\'s argument was undermined by several ___ in her reasoning."', options: ['lacunae', 'bona fide', 'carte blanche', 'sine qua non'], correctIndex: 0, level: 'C2', category: 'vocabulary', explanation: '"Lacunae" means gaps or missing parts, which fits the context of flaws in reasoning.' },
    { text: 'What does "to rest on one\'s laurels" mean?', options: ['To take a break', 'To be satisfied with past achievements and stop trying', 'To sleep well', 'To receive an award'], correctIndex: 1, level: 'C2', category: 'vocabulary' },
    { text: 'Choose the word that best fits: "The negotiations reached an ___ when neither side was willing to compromise."', options: ['impasse', 'impression', 'impulse', 'improvement'], correctIndex: 0, level: 'C2', category: 'vocabulary' },
    { text: 'What does "prevaricate" mean?', options: ['To speak evasively or avoid telling the truth', 'To predict the future', 'To prepare in advance', 'To prefer one thing over another'], correctIndex: 0, level: 'C2', category: 'vocabulary' },
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
    // ─── Existing passages ───
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
    // ─── NEW passages ───
    {
      title: 'My Daily Routine',
      passageText: 'My name is Tom. I get up at seven o\'clock every morning. I have breakfast at half past seven. I usually eat toast and drink orange juice. Then I go to school by bus. School starts at nine o\'clock. I have lunch at school at twelve o\'clock. After school, I go home and do my homework. In the evening, I watch TV or play games with my sister. I go to bed at nine thirty.',
      level: 'A1',
      questions: [
        { questionText: 'What time does Tom get up?', options: ['At six o\'clock', 'At seven o\'clock', 'At eight o\'clock', 'At nine o\'clock'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'How does Tom go to school?', options: ['He walks', 'He rides a bike', 'He takes the bus', 'His parents drive him'], correctIndex: 2, sortOrder: 2 },
        { questionText: 'What does Tom do in the evening?', options: ['He studies', 'He watches TV or plays games', 'He goes to the park', 'He reads books'], correctIndex: 1, sortOrder: 3 },
      ],
    },
    {
      title: 'Sustainable Fashion',
      passageText: 'The fast fashion industry has come under increasing scrutiny for its environmental impact. It is estimated that the fashion industry accounts for approximately 10% of global carbon emissions and is the second-largest consumer of water worldwide. In response, a growing number of consumers are turning to sustainable alternatives, including second-hand shopping, clothing rental services, and brands that prioritize eco-friendly materials and ethical labor practices. While sustainable fashion often comes at a higher price point, advocates argue that the long-term environmental and social benefits justify the additional cost. Critics, however, point out that sustainable options remain inaccessible to many consumers due to affordability concerns.',
      level: 'B1',
      questions: [
        { questionText: 'What percentage of global carbon emissions does the fashion industry account for?', options: ['5%', '10%', '15%', '20%'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'What is one reason critics raise against sustainable fashion?', options: ['It uses too much water', 'It is not truly eco-friendly', 'It remains inaccessible due to affordability concerns', 'It produces more waste'], correctIndex: 2, sortOrder: 2 },
        { questionText: 'Which of the following is NOT mentioned as a sustainable alternative?', options: ['Second-hand shopping', 'Clothing rental services', 'Buying from discount stores', 'Eco-friendly brands'], correctIndex: 2, sortOrder: 3 },
      ],
    },
    {
      title: 'The Psychology of Decision-Making',
      passageText: 'Research in behavioral economics has revealed that human decision-making is far less rational than traditional economic models assume. Daniel Kahneman\'s work on cognitive biases demonstrates that people rely heavily on mental shortcuts, or heuristics, which often lead to systematic errors in judgment. The anchoring effect, for instance, causes individuals to rely too heavily on the first piece of information they encounter when making decisions. Similarly, loss aversion—the tendency to prefer avoiding losses over acquiring equivalent gains—can lead people to make unnecessarily conservative choices. Understanding these biases is crucial not only for individuals seeking to make better decisions but also for policymakers designing systems that account for human irrationality.',
      level: 'B2',
      questions: [
        { questionText: 'What does the anchoring effect cause people to do?', options: ['Avoid all risks', 'Rely too heavily on the first information they encounter', 'Make decisions based on emotions', 'Prefer gains over losses'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'What is loss aversion according to the text?', options: ['The fear of losing money', 'The tendency to prefer avoiding losses over acquiring equivalent gains', 'The habit of making risky investments', 'The inability to make decisions'], correctIndex: 1, sortOrder: 2 },
        { questionText: 'Why is understanding cognitive biases important for policymakers?', options: ['To eliminate all biases', 'To design systems that account for human irrationality', 'To make people more rational', 'To reduce the number of decisions people make'], correctIndex: 1, sortOrder: 3 },
      ],
    },
    {
      title: 'The Paradox of Choice in Modern Society',
      passageText: 'Psychologist Barry Schwartz coined the term "the paradox of choice" to describe the phenomenon whereby an abundance of options, rather than enhancing wellbeing, often leads to anxiety, decision paralysis, and diminished satisfaction. In an era of unprecedented consumer choice, individuals frequently find themselves overwhelmed by the sheer volume of alternatives available, from career paths to breakfast cereals. Research suggests that when faced with too many options, people tend to either defer decisions entirely or experience post-decision regret, wondering whether a different choice would have been superior. Moreover, the opportunity cost of every unselected option weighs heavily on the psyche. Schwartz distinguishes between "maximizers," who exhaustively search for the best possible option, and "satisficers," who settle for an option that meets their minimum criteria. Studies consistently show that satisficers tend to be happier and less prone to regret, suggesting that knowing when good enough is sufficient may be a more adaptive strategy than perpetually seeking the optimal.',
      level: 'C1',
      questions: [
        { questionText: 'What does "the paradox of choice" refer to?', options: ['Having no choices makes people unhappy', 'More choices can lead to anxiety and diminished satisfaction', 'People always prefer fewer choices', 'Making choices is becoming easier'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'According to the text, who tends to be happier?', options: ['Maximizers', 'Satisficers', 'People with the most choices', 'People who avoid making decisions'], correctIndex: 1, sortOrder: 2 },
        { questionText: 'What is the difference between maximizers and satisficers?', options: ['Maximizers make decisions faster', 'Maximizers seek the best possible option while satisficers settle for one that meets minimum criteria', 'Satisficers are more educated', 'There is no meaningful difference'], correctIndex: 1, sortOrder: 3 },
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
    // ─── Existing items ───
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
    // ─── NEW items ───
    {
      scriptText: 'Hello, I\'d like to buy a ticket to London, please. Single or return? Return, please. That\'s £45. Would you like to pay by card or cash? Card, please. Here you go. Thank you. Your train leaves from platform 3 at 10:15.',
      context: 'Buying a train ticket at the station',
      level: 'A2',
      questions: [
        { questionText: 'What type of ticket does the person buy?', options: ['A single ticket', 'A return ticket', 'A season ticket', 'A group ticket'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'What time does the train leave?', options: ['9:15', '10:15', '10:50', '11:15'], correctIndex: 1, sortOrder: 2 },
      ],
    },
    {
      scriptText: 'Welcome to the museum. On the ground floor, you\'ll find our collection of ancient Egyptian artifacts. The first floor houses our modern art exhibition, which changes every three months. The café is on the second floor, and the gift shop is right next to the entrance. Photography is allowed in all areas except the Egyptian gallery. We ask that you please do not touch the exhibits.',
      context: 'Museum guide giving an introduction',
      level: 'B1',
      questions: [
        { questionText: 'Where can visitors find the modern art exhibition?', options: ['Ground floor', 'First floor', 'Second floor', 'Near the entrance'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'In which area is photography NOT allowed?', options: ['The modern art exhibition', 'The café', 'The Egyptian gallery', 'The gift shop'], correctIndex: 2, sortOrder: 2 },
      ],
    },
    {
      scriptText: 'Good afternoon. I\'m calling regarding the job advertisement for the marketing position I saw on your website. Could you tell me a bit more about the role? Certainly. The position involves managing our social media accounts, creating content for our blog, and coordinating with the design team on promotional materials. We\'re looking for someone with at least three years of experience in digital marketing. Is it a full-time position? Yes, it\'s full-time, Monday to Friday, with occasional evening events that you\'d need to attend.',
      context: 'Phone inquiry about a job opening',
      level: 'B2',
      questions: [
        { questionText: 'What is one of the responsibilities of the marketing position?', options: ['Managing the company finances', 'Creating content for the blog', 'Hiring new employees', 'Organizing company events'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'How much experience is required for the position?', options: ['One year', 'Two years', 'Three years', 'Five years'], correctIndex: 2, sortOrder: 2 },
      ],
    },
    {
      scriptText: 'The latest census data reveals a significant demographic shift that has profound implications for public policy. The proportion of citizens over the age of 65 has increased from 16% to 22% over the past decade, while the birth rate has declined by 12% during the same period. This aging population trajectory, if it continues unchecked, will place unprecedented strain on healthcare systems and pension funds. Some economists advocate for raising the retirement age and increasing immigration to offset the shrinking workforce. Others argue that technological automation could compensate for labor shortages, provided the transition is managed equitably.',
      context: 'News report on demographic changes',
      level: 'C1',
      questions: [
        { questionText: 'By how much has the proportion of citizens over 65 increased?', options: ['From 12% to 16%', 'From 16% to 22%', 'From 22% to 28%', 'From 10% to 22%'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'What do some economists suggest to address the shrinking workforce?', options: ['Reducing healthcare spending', 'Raising the retirement age and increasing immigration', 'Encouraging earlier retirement', 'Limiting technological development'], correctIndex: 1, sortOrder: 2 },
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
    // ─── Existing prompts ───
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
    // ─── NEW prompts ───
    // A1 Level
    {
      promptText: 'Talk about your family. How many people are in your family? What are their names? What do they do? Describe one person in your family.',
      level: 'A1',
      preparationTime: 20,
      responseTime: 45,
      difficultyTier: 1,
    },
    // B1 Level (additional)
    {
      promptText: 'Imagine you could travel anywhere in the world. Where would you go and why? Describe the place, what activities you would do there, and who you would like to travel with.',
      level: 'B1',
      preparationTime: 30,
      responseTime: 90,
      difficultyTier: 4,
    },
    // B2 Level (additional)
    {
      promptText: 'Some people think that success in life depends mainly on hard work, while others believe that luck plays a more important role. What is your opinion? Give examples to support your view.',
      level: 'B2',
      preparationTime: 45,
      responseTime: 120,
      difficultyTier: 6,
    },
    // C2 Level
    {
      promptText: 'Consider the following proposition: "Freedom of expression should have no limits." Articulate a nuanced position on this issue, examining the philosophical foundations of free speech, the practical implications of unrestricted expression, and the potential consequences of imposing limitations. Support your argument with historical and contemporary examples.',
      level: 'C2',
      preparationTime: 90,
      responseTime: 180,
      difficultyTier: 10,
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
    // ─── Existing prompts ───
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
    // ─── NEW prompts ───
    // A1 Level
    {
      promptText: 'Write a short message about yourself. Include your name, your age, where you live, and what you like to do in your free time.',
      level: 'A1',
      minWords: 30,
      maxWords: 80,
      difficultyTier: 1,
    },
    // B1 Level (additional)
    {
      promptText: 'Write a formal email applying for a part-time job. Include information about your qualifications, your availability, and why you are interested in the position.',
      level: 'B1',
      minWords: 100,
      maxWords: 200,
      difficultyTier: 4,
    },
    // B2 Level (additional)
    {
      promptText: 'Some people believe that working from home is more productive than working in an office, while others disagree. Write an essay discussing both sides of the argument and give your own opinion, supported by reasons and examples.',
      level: 'B2',
      minWords: 150,
      maxWords: 300,
      difficultyTier: 6,
    },
    // C2 Level
    {
      promptText: 'Write a well-structured essay critically evaluating the following statement: "The greatest threat to democracy is not tyranny from above, but apathy from within." Examine this proposition from multiple angles, drawing on historical and contemporary examples, and articulate a well-reasoned position.',
      level: 'C2',
      minWords: 250,
      maxWords: 500,
      difficultyTier: 10,
    },
  ];
}
