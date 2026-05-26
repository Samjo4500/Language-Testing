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
    if (existingMCQCount < 200) {
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
    if (existingReadingCount < 16) {
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
    if (existingListeningCount < 14) {
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

    // ═══════════ A1 READING (10 questions) ═══════════
    { text: 'Sign: "CLOSED ON SUNDAYS". On which day is this place not open?', options: ['Monday', 'Saturday', 'Sunday', 'Friday'], correctIndex: 2, level: 'A1', category: 'reading', explanation: 'The sign says "Closed on Sundays", meaning it is not open on Sunday.' },
    { text: 'Notice: "Please do not feed the animals." What should you do?', options: ['Give food to the animals', 'Not give food to the animals', 'Play with the animals', 'Take the animals home'], correctIndex: 1, level: 'A1', category: 'reading', explanation: '"Do not feed" means you should not give food to the animals.' },
    { text: 'Message: "Hi Sara, I will be 10 minutes late. See you at the café." When will the person arrive?', options: ['Early', 'On time', '10 minutes after the expected time', 'Tomorrow'], correctIndex: 2, level: 'A1', category: 'reading', explanation: '"10 minutes late" means arriving 10 minutes after the expected time.' },
    { text: 'Sign at a park: "NO SWIMMING". What does this sign tell you?', options: ['You can swim here', 'You must not swim here', 'Swimming is fun', 'The pool is open'], correctIndex: 1, level: 'A1', category: 'reading', explanation: '"No swimming" means swimming is not allowed.' },
    { text: 'Email: "Dear Tom, Happy Birthday! I hope you have a great day. Love, Anna." What is this message about?', options: ['A wedding', 'A birthday', 'A holiday', 'A meeting'], correctIndex: 1, level: 'A1', category: 'reading', explanation: 'The message says "Happy Birthday", so it is about a birthday.' },
    { text: 'Timetable: "Bus to airport: 8:00, 10:00, 12:00, 14:00." How many buses go to the airport each day?', options: ['Two', 'Three', 'Four', 'Five'], correctIndex: 2, level: 'A1', category: 'reading', explanation: 'There are four departure times listed: 8:00, 10:00, 12:00, and 14:00.' },
    { text: 'Label: "Keep refrigerated after opening." What should you do after opening this product?', options: ['Leave it outside', 'Put it in the fridge', 'Throw it away', 'Heat it up'], correctIndex: 1, level: 'A1', category: 'reading', explanation: '"Keep refrigerated" means you should store it in the fridge.' },
    { text: 'Sign: "SALE — 50% OFF EVERYTHING." What does this sign mean?', options: ['Everything costs 50% more', 'Everything costs half the original price', 'The shop is closed', 'Items are free'], correctIndex: 1, level: 'A1', category: 'reading', explanation: '"50% off" means the price is reduced by half.' },
    { text: 'Note: "Gone to lunch. Back at 1:30." Where has the person gone?', options: ['Home', 'To lunch', 'On holiday', 'To a meeting'], correctIndex: 1, level: 'A1', category: 'reading', explanation: 'The note says "Gone to lunch", so the person has gone to have lunch.' },
    { text: 'Instructions: "Take one tablet with water after each meal." How often should you take the tablet?', options: ['Once a day', 'Twice a day', 'After every meal', 'Only at breakfast'], correctIndex: 2, level: 'A1', category: 'reading', explanation: '"After each meal" means you take it after every meal you eat.' },

    // ═══════════ A2 READING (10 questions) ═══════════
    { text: 'Passage: "Maria gets up at 7 a.m. every day. She has breakfast at 7:30 and then walks to work. She starts work at 9 a.m. and finishes at 5 p.m. After work, she usually goes to the gym." How does Maria travel to work?', options: ['By bus', 'By car', 'On foot', 'By bike'], correctIndex: 2, level: 'A2', category: 'reading', explanation: 'The passage says she "walks to work", which means she goes on foot.' },
    { text: 'Passage: "Last weekend, we went to the beach. The weather was sunny and warm. We swam in the sea and built sandcastles. In the evening, we had fish and chips at a restaurant near the beach." What did they do first at the beach?', options: ['Had fish and chips', 'Built sandcastles', 'Swam in the sea', 'Went to a restaurant'], correctIndex: 2, level: 'A2', category: 'reading', explanation: 'The order in the passage is: swam in the sea, then built sandcastles, then had dinner. Swimming came first.' },
    { text: 'Passage: "Tom\'s favourite subject at school is science. He especially likes doing experiments in the laboratory. He wants to be a scientist when he grows up." What does Tom want to be?', options: ['A teacher', 'A doctor', 'A scientist', 'An engineer'], correctIndex: 2, level: 'A2', category: 'reading', explanation: 'The passage states "He wants to be a scientist when he grows up."' },
    { text: 'Email: "Hi Peter, I\'m having a barbecue at my house this Saturday at 6 p.m. Can you come? Please bring something to drink. — Lisa." What does Lisa ask Peter to bring?', options: ['Food', 'Something to drink', 'A present', 'Nothing'], correctIndex: 1, level: 'A2', category: 'reading', explanation: 'Lisa says "Please bring something to drink."' },
    { text: 'Passage: "The school trip to the museum has been moved from Tuesday to Thursday because of the weather forecast." Why was the trip moved?', options: ['The museum was closed', 'Because of the weather forecast', 'Not enough students signed up', 'The bus broke down'], correctIndex: 1, level: 'A2', category: 'reading', explanation: 'The passage says the trip was moved "because of the weather forecast."' },
    { text: 'Passage: "Emma loves cooking. She makes dinner for her family every evening. Her speciality is Italian food — she makes great pasta and pizza. Last week, she tried making sushi for the first time, but it didn\'t turn out very well." What is Emma best at cooking?', options: ['Japanese food', 'Italian food', 'Chinese food', 'Indian food'], correctIndex: 1, level: 'A2', category: 'reading', explanation: 'The passage says "Her speciality is Italian food."' },
    { text: 'Notice: "The swimming pool will be closed for repairs from March 1st to March 15th. We apologise for any inconvenience." How long will the pool be closed?', options: ['One week', 'Two weeks', 'One month', 'Three days'], correctIndex: 1, level: 'A2', category: 'reading', explanation: 'From March 1st to March 15th is approximately two weeks.' },
    { text: 'Passage: "David moved to London two years ago. At first, he found the city very big and noisy, but now he loves living there. He has made lots of friends and enjoys the many parks and museums." How did David feel about London at first?', options: ['He loved it immediately', 'He found it big and noisy', 'He thought it was too small', 'He felt bored'], correctIndex: 1, level: 'A2', category: 'reading', explanation: 'The passage says "At first, he found the city very big and noisy."' },
    { text: 'Review: "I bought these shoes online last month. They look nice, but they\'re not very comfortable for walking long distances. I\'d recommend them for short outings only." What is the reviewer\'s opinion of the shoes?', options: ['They are perfect for hiking', 'They look nice but aren\'t very comfortable for long walks', 'They are ugly but comfortable', 'They are terrible quality'], correctIndex: 1, level: 'A2', category: 'reading', explanation: 'The reviewer says they look nice but aren\'t comfortable for long distances.' },
    { text: 'Passage: "Every morning, Mr. Brown takes his dog for a walk in the park. The dog, called Max, loves to chase balls. One day, Max ran after a cat instead and didn\'t come back for an hour!" What usually happens during the walk?', options: ['Max chases cats', 'Max chases balls', 'Max runs away', 'Max sleeps in the park'], correctIndex: 1, level: 'A2', category: 'reading', explanation: 'The passage says Max "loves to chase balls" — this is what usually happens. Chasing the cat was unusual.' },

    // ═══════════ B1 READING (10 questions) ═══════════
    { text: 'Passage: "When Sarah arrived at the hotel, she discovered that her room wasn\'t ready yet. The receptionist apologised and offered her a complimentary drink at the bar while she waited. Sarah was tired after her long journey, so she gladly accepted." Why did Sarah go to the bar?', options: ['She was thirsty', 'Her room wasn\'t ready and she was offered a free drink', 'She wanted to meet people', 'The receptionist told her she had to'], correctIndex: 1, level: 'B1', category: 'reading', explanation: 'Sarah went to the bar because her room was not ready and the receptionist offered her a complimentary (free) drink while she waited.' },
    { text: 'Passage: "The number of people working from home has increased dramatically over the past decade. Improved technology and faster internet connections have made remote work possible for many professions. However, some managers still prefer having their teams in the office, arguing that face-to-face communication leads to better collaboration." According to the passage, what is one reason some managers prefer office work?', options: ['It is cheaper', 'Face-to-face communication leads to better collaboration', 'Employees work faster in the office', 'Technology is unreliable at home'], correctIndex: 1, level: 'B1', category: 'reading', explanation: 'The passage states that managers argue "face-to-face communication leads to better collaboration."' },
    { text: 'Passage: "Last summer, I volunteered at an animal shelter. Most of the work involved feeding the animals and cleaning their cages. It was hard work, especially on hot days, but seeing the animals find new homes made it all worthwhile. By the end of the summer, over 30 animals had been adopted." What can you infer about the author\'s experience?', options: ['It was easy and fun', 'It was difficult but rewarding', 'It was boring and pointless', 'It was too tiring to continue'], correctIndex: 1, level: 'B1', category: 'reading', explanation: 'The author says it was hard work but "made it all worthwhile", suggesting it was difficult but rewarding.' },
    { text: 'Passage: "The city\'s new bicycle-sharing programme has been a great success. In its first month, over 5,000 people signed up, and the bikes were used more than 20,000 times. The programme currently has 50 stations across the city centre, with plans to expand to the suburbs next year." What is planned for the bicycle programme?', options: ['Reducing the number of bikes', 'Closing some stations', 'Expanding to the suburbs', 'Increasing the rental price'], correctIndex: 2, level: 'B1', category: 'reading', explanation: 'The passage mentions "plans to expand to the suburbs next year."' },
    { text: 'Passage: "Unlike her sister, who enjoys team sports like basketball and volleyball, Julia prefers individual activities. She swims every morning and goes hiking on weekends. She says the quiet time alone helps her think clearly and reduce stress." What can you infer about Julia\'s sister?', options: ['She also likes swimming', 'She enjoys being part of a group in sports', 'She doesn\'t like any sports', 'She prefers individual activities too'], correctIndex: 1, level: 'B1', category: 'reading', explanation: '"Unlike her sister" implies contrast. Julia\'s sister enjoys team sports, meaning she likes being part of a group.' },
    { text: 'Passage: "A recent survey found that 67% of young adults prefer reading news online rather than in print. The most common reason given was convenience — they can check the news anytime, anywhere. However, 25% of respondents said they still enjoy the experience of holding a physical newspaper." What percentage of young adults prefer print newspapers?', options: ['67%', '25%', '33%', '8%'], correctIndex: 1, level: 'B1', category: 'reading', explanation: 'The passage states that 25% of respondents said they still enjoy physical newspapers.' },
    { text: 'Passage: "The restaurant was nearly empty when we arrived at 6 p.m., but by 7:30, there was a long queue outside. The food was delicious and reasonably priced, though the service was a bit slow because of the crowd." What was the main drawback of the restaurant according to the reviewer?', options: ['The food quality', 'The prices', 'The slow service', 'The location'], correctIndex: 2, level: 'B1', category: 'reading', explanation: 'The reviewer mentions "the service was a bit slow because of the crowd" as the drawback.' },
    { text: 'Passage: "Before travelling to Japan, I read several guidebooks and learned a few basic Japanese phrases. This preparation turned out to be extremely helpful, as English was not widely spoken outside the major cities. I was able to order food, ask for directions, and even make small talk with locals." Why was the author\'s preparation helpful?', options: ['It helped them find cheap hotels', 'English was not widely spoken outside major cities', 'Japanese people don\'t like tourists', 'Guidebooks are always useful'], correctIndex: 1, level: 'B1', category: 'reading', explanation: 'The passage says the preparation was helpful "as English was not widely spoken outside the major cities."' },
    { text: 'Passage: "The company has announced it will close three of its factories, resulting in the loss of approximately 500 jobs. A spokesperson said the decision was made due to declining sales and increasing production costs. Affected employees will receive redundancy packages and help finding new work." What reason did the company give for the closures?', options: ['The factories were too old', 'Employees wanted to leave', 'Declining sales and increasing production costs', 'The company is moving abroad'], correctIndex: 2, level: 'B1', category: 'reading', explanation: 'The spokesperson said "the decision was made due to declining sales and increasing production costs."' },
    { text: 'Passage: "Although the film received mixed reviews from critics, audiences loved it. It earned over $200 million in its first weekend, making it one of the highest-grossing openings of all time. Many viewers said they planned to see it again." What contrast does the passage highlight?', options: ['High earnings vs. low budget', 'Critical reviews vs. audience reaction', 'Young viewers vs. older viewers', 'Domestic vs. international sales'], correctIndex: 1, level: 'B1', category: 'reading', explanation: 'The passage contrasts "mixed reviews from critics" with "audiences loved it."' },

    // ═══════════ B2 READING (10 questions) ═══════════
    { text: 'Passage: "The widespread adoption of smartphones has fundamentally altered how people consume information. Whereas previous generations relied on newspapers and television broadcasts at set times, today\'s users access news constantly through social media feeds. This shift has raised concerns about the quality of information, as social media platforms often prioritise engagement over accuracy, leading to the spread of misinformation." What is the author\'s main concern about social media as a news source?', options: ['It is too expensive', 'It prioritises engagement over accuracy, spreading misinformation', 'It is difficult to use', 'It has replaced television completely'], correctIndex: 1, level: 'B2', category: 'reading', explanation: 'The author is concerned that social media "prioritise(s) engagement over accuracy, leading to the spread of misinformation."' },
    { text: 'Passage: "Dr. Chen\'s research challenges conventional wisdom about sleep. While most experts recommend eight hours, her findings suggest that sleep quality matters more than duration. Participants who slept six hours of uninterrupted, deep sleep performed better on cognitive tests than those who slept eight hours but woke frequently." What does Dr. Chen\'s research suggest?', options: ['Everyone needs exactly eight hours of sleep', 'Sleep quality is more important than how long you sleep', 'Six hours is the maximum anyone should sleep', 'Waking frequently improves cognition'], correctIndex: 1, level: 'B2', category: 'reading', explanation: 'The research suggests "sleep quality matters more than duration," as shown by better cognitive test performance with shorter but deeper sleep.' },
    { text: 'Passage: "The historic town centre has been a tourist attraction for decades, but locals have growing concerns. Rising property prices, driven by investors buying homes to convert into holiday rentals, have pushed out long-term residents. Several shops have been replaced by souvenir stores, changing the character of the neighbourhood." According to the passage, what is the root cause of the changes in the town centre?', options: ['Poor city management', 'Too many tourists visiting', 'Investors buying properties for holiday rentals', 'Locals moving to the suburbs by choice'], correctIndex: 2, level: 'B2', category: 'reading', explanation: 'The passage identifies "investors buying homes to convert into holiday rentals" as the driver of rising property prices and neighbourhood change.' },
    { text: 'Passage: "Despite its reputation as a luxury destination, Monaco has one of the highest population densities in the world. The majority of its residents are not wealthy locals but foreign workers who commute from nearby France and Italy. The glamorous image portrayed in media represents only a fraction of the principality\'s reality." What point is the author making about Monaco?', options: ['It is not as wealthy as people think', 'Its glamorous image does not reflect the reality for most residents', 'Foreign workers should not live there', 'The media accurately portrays Monaco'], correctIndex: 1, level: 'B2', category: 'reading', explanation: 'The author argues that "the glamorous image portrayed in media represents only a fraction of the principality\'s reality," meaning most residents are ordinary foreign workers.' },
    { text: 'Passage: "In the early 20th century, the introduction of the assembly line revolutionised manufacturing. Before this innovation, products were made individually by skilled craftspeople — a slow and expensive process. Henry Ford\'s implementation of the moving assembly line in 1913 reduced the time to build a car from 12 hours to about 90 minutes, dramatically lowering costs and making automobiles accessible to the middle class." What was the most significant effect of Ford\'s assembly line?', options: ['It eliminated the need for workers', 'It made cars available to a broader population by reducing costs', 'It improved the quality of automobiles', 'It put craftspeople out of business'], correctIndex: 1, level: 'B2', category: 'reading', explanation: 'The passage emphasises that the assembly line "dramatically lowering costs and making automobiles accessible to the middle class."' },
    { text: 'Passage: "The debate over genetic modification of crops remains heated. Proponents argue that GM crops can increase yields, reduce pesticide use, and help feed a growing global population. Opponents counter that the long-term health and environmental effects are unknown and that GM technology benefits large corporations more than small farmers." Why do opponents of GM crops argue it mainly helps corporations?', options: ['Corporations sell more pesticides', 'Small farmers cannot afford the technology', 'GM crops taste worse', 'Corporations own all the farmland'], correctIndex: 1, level: 'B2', category: 'reading', explanation: 'Opponents argue GM technology "benefits large corporations more than small farmers," implying small farmers cannot access or afford it equally.' },
    { text: 'Passage: "Urban green spaces are more than just aesthetic additions to a city. Research shows that access to parks and gardens reduces stress, improves mental health, and encourages physical activity. Moreover, green spaces help mitigate the urban heat island effect, where cities experience significantly higher temperatures than surrounding rural areas." What does the passage imply about cities without adequate green spaces?', options: ['They are more beautiful', 'They likely experience higher temperatures and more stressed residents', 'They have better infrastructure', 'They are safer'], correctIndex: 1, level: 'B2', category: 'reading', explanation: 'If green spaces reduce stress and mitigate heat, cities without them would likely have higher stress levels and higher temperatures.' },
    { text: 'Passage: "The artist\'s early works were characterised by bright colours and optimistic themes, reflecting the prosperity of the 1920s. However, after the economic crash of 1929, her palette darkened considerably, and her subjects became more sombre, depicting hardship and uncertainty." What can be inferred about the relationship between the artist\'s work and historical events?', options: ['She was unaware of world events', 'Her art was directly influenced by the social and economic conditions of her time', 'She only painted what she was commissioned to paint', 'Her style changes were purely artistic choices'], correctIndex: 1, level: 'B2', category: 'reading', explanation: 'The passage shows a direct correlation: prosperous 1920s → bright art; economic crash → dark art, implying her work was influenced by conditions of her time.' },
    { text: 'Passage: "While e-books offer convenience and portability, studies suggest that readers of physical books retain more information. Researchers believe this may be because the tactile experience of holding a book and turning pages creates spatial memory cues that aid recall. Furthermore, the absence of digital distractions such as notifications allows for deeper focus." According to the passage, what is one possible reason physical books improve retention?', options: ['They are cheaper than e-books', 'The tactile experience creates spatial memory cues that aid recall', 'They have better content', 'People read them faster'], correctIndex: 1, level: 'B2', category: 'reading', explanation: 'The passage says "the tactile experience of holding a book and turning pages creates spatial memory cues that aid recall."' },
    { text: 'Passage: "The company\'s decision to replace its customer service team with an AI chatbot initially seemed cost-effective. Within months, however, customer satisfaction scores dropped by 40%, and the company lost several key accounts. The chatbot frequently misunderstood complex queries and frustrated customers with repetitive, unhelpful responses." What was the primary flaw in the company\'s decision?', options: ['The chatbot was too expensive', 'They didn\'t train their human staff properly', 'They underestimated the complexity of customer queries that require human understanding', 'They implemented the chatbot too slowly'], correctIndex: 2, level: 'B2', category: 'reading', explanation: 'The chatbot "frequently misunderstood complex queries," showing the company underestimated the need for human understanding in customer service.' },

    // ═══════════ C1 READING (10 questions) ═══════════
    { text: 'Passage: "The notion that technological progress inevitably leads to social progress is a pervasive but flawed assumption. While innovations in medicine and agriculture have undoubtedly improved living standards, technology has also been instrumental in enabling surveillance, widening inequality, and eroding privacy. The critical question is not whether technology advances, but who controls its direction and for what ends." What is the author\'s central argument?', options: ['Technology always improves society', 'The relationship between technology and social progress depends on who controls it and to what purpose', 'Technology should be stopped', 'Social progress is impossible without technology'], correctIndex: 1, level: 'C1', category: 'reading', explanation: 'The author argues the key question is "who controls its direction and for what ends," suggesting the impact of technology depends on its governance and purpose.' },
    { text: 'Passage: "Historians have long debated whether the fall of the Roman Empire was primarily caused by internal decay or external pressures. Recently, scholars have argued that this binary framing is itself problematic — the empire\'s decline was a complex interplay of economic instability, military overextension, administrative fragmentation, and migration patterns, none of which can be understood in isolation." What does the author criticise about the traditional debate?', options: ['It focuses too much on military history', 'It oversimplifies the causes by framing them as either/or', 'It ignores the role of economic factors', 'It relies too heavily on archaeological evidence'], correctIndex: 1, level: 'C1', category: 'reading', explanation: 'The author says the "binary framing is itself problematic," criticising the either/or approach to explaining Rome\'s fall.' },
    { text: 'Passage: "In her seminal work on organisational behaviour, Dr. Torres distinguishes between \'compliant\' and \'committed\' employees. Compliant workers follow rules and meet minimum requirements but rarely innovate. Committed workers, by contrast, identify with the organisation\'s mission and are willing to expend discretionary effort. Torres argues that most management practices, designed to enforce compliance, inadvertently undermine commitment." According to Torres, what paradox exists in management practices?', options: ['Managers are never committed themselves', 'Practices designed to ensure compliance actually reduce the commitment they should be fostering', 'Compliant employees are more productive than committed ones', 'Commitment and compliance are the same thing'], correctIndex: 1, level: 'C1', category: 'reading', explanation: 'Torres argues that management practices "designed to enforce compliance, inadvertently undermine commitment" — a paradox where the tools for control reduce the deeper engagement needed.' },
    { text: 'Passage: "The philosopher contended that freedom is not merely the absence of external constraints — what she termed \'negative liberty\' — but also the presence of genuine capacity to pursue one\'s goals — \'positive liberty.\' She warned that societies which focus exclusively on negative liberty risk creating conditions where individuals are technically free yet practically powerless." What does the philosopher mean by "technically free yet practically powerless"?', options: ['People are free but choose not to act', 'People face no legal barriers but lack the real capacity or resources to exercise their freedom', 'Freedom is an illusion', 'Governments always restrict liberty'], correctIndex: 1, level: 'C1', category: 'reading', explanation: '"Technically free" means no legal barriers (negative liberty), but "practically powerless" means lacking the real capacity (positive liberty) to act on that freedom.' },
    { text: 'Passage: "The resurgence of artisanal crafts in urban centres might appear to be a rejection of mass production, but a closer examination reveals a more nuanced reality. Many artisanal products rely on industrially produced raw materials and are marketed through sophisticated digital platforms. Rather than opposing industrialisation, the artisanal movement repurposes its infrastructure while projecting an image of authenticity that consumers find appealing." What does the passage suggest about the artisanal movement?', options: ['It is a genuine return to pre-industrial methods', 'It is entirely dependent on mass production', 'It selectively uses industrial infrastructure while presenting itself as anti-industrial', 'It will soon replace mass production entirely'], correctIndex: 2, level: 'C1', category: 'reading', explanation: 'The passage says the movement "repurposes its infrastructure while projecting an image of authenticity" — it uses industrial tools while presenting an anti-industrial image.' },
    { text: 'Passage: "Climate models are often criticised for their uncertainty, but this criticism misunderstands the nature of scientific modelling. All models are simplifications of reality; their value lies not in precise prediction but in identifying trends and informing decision-making under uncertainty. Dismissing models because they are uncertain is akin to refusing to use a map because it does not show every individual tree." What does the analogy of the map illustrate?', options: ['Maps are not useful for navigation', 'Models, like maps, are useful despite not capturing every detail', 'Climate models are as accurate as maps', 'We should not rely on either maps or models'], correctIndex: 1, level: 'C1', category: 'reading', explanation: 'The analogy shows that just as maps are useful without showing every tree, models are useful for identifying trends even without precise predictions.' },
    { text: 'Passage: "The essayist observes that modern democracies increasingly govern through crisis management rather than long-term planning. Each emergency — real or perceived — justifies extraordinary measures that would otherwise face public resistance. Over time, citizens become accustomed to executive overreach, and the boundary between emergency powers and normal governance blurs." What concern does the essayist raise?', options: ['Emergencies are not real', 'Crisis management can gradually erode democratic norms and expand executive power', 'Citizens do not care about democracy', 'Long-term planning is always better'], correctIndex: 1, level: 'C1', category: 'reading', explanation: 'The essayist warns that governing through crisis normalises executive overreach and blurs "the boundary between emergency powers and normal governance," eroding democratic norms.' },
    { text: 'Passage: "Narratives of meritocracy — the idea that success results solely from talent and effort — serve a dual function. On one hand, they motivate individuals to strive for achievement. On the other, they obscure structural advantages and disadvantages, leading successful individuals to attribute their position entirely to personal merit while attributing others\' failure to personal deficiency." According to the passage, what is a harmful consequence of meritocratic narratives?', options: ['They discourage hard work', 'They make people too confident', 'They hide the role of structural factors, leading to unjust attributions of success and failure', 'They are only believed by wealthy people'], correctIndex: 2, level: 'C1', category: 'reading', explanation: 'Meritocratic narratives "obscure structural advantages and disadvantages," leading people to wrongly attribute success/failure solely to personal merit rather than structural factors.' },
    { text: 'Passage: "The translation of literary works is often described as an act of interpretation rather than reproduction. Every linguistic choice — from word selection to sentence structure — carries cultural connotations that may not have direct equivalents in the target language. Thus, translators must constantly negotiate between fidelity to the source text and accessibility for the new audience, making every translation simultaneously a new work." What does the author mean by "every translation simultaneously a new work"?', options: ['Translators always write original fiction', 'Translation involves creative choices that transform the text, making it a distinct literary work', 'Translated works are always better than originals', 'Only famous translations count as new works'], correctIndex: 1, level: 'C1', category: 'reading', explanation: 'Because translators must "negotiate between fidelity and accessibility" through creative choices, each translation becomes a distinct literary work, not merely a copy.' },
    { text: 'Passage: "Economic indicators such as GDP growth and unemployment rates, while useful for macroeconomic analysis, can be misleading when used as proxies for societal wellbeing. A country may experience robust GDP growth while income inequality widens, or report low unemployment while a significant portion of the workforce is underemployed. The conflation of economic output with social progress risks policy decisions that prioritise aggregate numbers over lived experience." What is the author\'s primary critique?', options: ['GDP is not a real economic measure', 'Economic indicators do not capture the full picture of how people actually live and can lead to misguided policy', 'Unemployment rates are always inaccurate', 'Economic growth is bad for society'], correctIndex: 1, level: 'C1', category: 'reading', explanation: 'The author argues that using economic indicators as proxies for wellbeing is misleading because they don\'t reflect inequality and underemployment, risking "policy decisions that prioritise aggregate numbers over lived experience."' },

    // ═══════════ C2 READING (10 questions) ═══════════
    { text: 'Passage: "The epistemological tension between positivism and interpretivism is not merely an academic quarrel but reflects fundamentally divergent conceptions of what constitutes knowledge. Positivists, following the natural science model, seek objective, verifiable facts; interpretivists argue that human behaviour is inherently meaningful and can only be understood through the subjective interpretations of actors themselves. Any attempt to reconcile these paradigms must first acknowledge that their disagreement is not about method but about the very nature of reality." What does the author identify as the root of the disagreement between positivism and interpretivism?', options: ['Different research methods', 'Fundamentally different conceptions of the nature of knowledge and reality', 'Personal animosity between researchers', 'Disagreement about which is more popular'], correctIndex: 1, level: 'C2', category: 'reading', explanation: 'The author states the disagreement is "not about method but about the very nature of reality," stemming from "fundamentally divergent conceptions of what constitutes knowledge."' },
    { text: 'Passage: "The paradox of tolerance, as articulated by the philosopher Karl Popper, posits that unlimited tolerance must lead to the disappearance of tolerance. If a society extends tolerance to those who are intolerant, the intolerant will eventually destroy the tolerant society. Popper concluded that we should therefore claim the right not to tolerate the intolerant — a proposition that has generated considerable debate about where the line should be drawn and who has the authority to draw it." What is the central tension in Popper\'s paradox?', options: ['Tolerance is always good', 'A tolerant society must sometimes be intolerant to preserve tolerance itself', 'Intolerant people should be imprisoned', 'There is no paradox'], correctIndex: 1, level: 'C2', category: 'reading', explanation: 'The paradox is that "unlimited tolerance must lead to the disappearance of tolerance," meaning a tolerant society must sometimes be intolerant of intolerance to survive.' },
    { text: 'Passage: "In his analysis of colonial discourse, the theorist demonstrates how language does not merely describe colonial relationships but actively constructs them. The use of terms such as \'civilising mission\' and \'backward peoples\' did not simply reflect existing power dynamics but legitimised and perpetuated them, creating a self-reinforcing ideological framework in which domination appeared as benevolence and resistance as ingratitude." What does the theorist mean by saying language "actively constructs" colonial relationships?', options: ['Language invents fictional events', 'Language does not just describe reality but shapes and sustains power dynamics by framing domination as benevolence', 'Colonial people could not speak', 'Language is irrelevant to politics'], correctIndex: 1, level: 'C2', category: 'reading', explanation: 'Language "actively constructs" means it doesn\'t merely describe — it "legitimised and perpetuated" power dynamics, framing "domination as benevolence and resistance as ingratitude."' },
    { text: 'Passage: "The concept of \'authenticity\' in cultural production is inherently paradoxical. Once an artistic tradition is identified as authentic, it becomes a commodity — packaged, marketed, and consumed by audiences who value it precisely because of its perceived purity. This process of commodification invariably transforms the tradition, often freezing it in a particular form and stripping it of the dynamism that characterised it before it was labelled \'authentic.\'" What irony does the passage highlight about cultural authenticity?', options: ['Authentic traditions are always modern inventions', 'The label of authenticity commodifies and freezes traditions, destroying the very dynamism that made them authentic', 'Consumers do not care about authenticity', 'No tradition is truly authentic'], correctIndex: 1, level: 'C2', category: 'reading', explanation: 'The irony is that identifying something as authentic leads to commodification, which "freezes it" and strips away the dynamism that made it authentic in the first place.' },
    { text: 'Passage: "The distinction between \'explanation\' and \'understanding\' — Erklären versus Verstehen — that Dilthey drew between the natural and human sciences has been both influential and contested. While it usefully highlights that understanding human action requires grasping meaning, not just causation, critics argue that the binary is overstated: natural sciences also involve interpretation, and human sciences also seek causal patterns. The debate remains unresolved, suggesting that the relationship between these modes of inquiry is complementary rather than contradictory." What does the author suggest about the relationship between explanation and understanding?', options: ['They are completely incompatible', 'Explanation is superior to understanding', 'The distinction is useful but the two modes are likely complementary rather than mutually exclusive', 'Only natural sciences require explanation'], correctIndex: 2, level: 'C2', category: 'reading', explanation: 'The author suggests the relationship is "complementary rather than contradictory," acknowledging the distinction is useful but the binary is overstated.' },
    { text: 'Passage: "Memory, as neuroscientists have demonstrated, is not a faithful recording of past events but a reconstructive process. Each act of recall involves reassembling fragments of information, filling gaps with assumptions, and integrating new knowledge. This means that memories are inherently malleable — they can be distorted by suggestion, emotion, and the passage of time. The legal system\'s reliance on eyewitness testimony, then, rests on a fundamentally flawed model of how memory works." What implication does the passage draw about the legal system?', options: ['The legal system should abandon all witness testimony', 'Eyewitness testimony is based on an incorrect assumption that memory records events faithfully', 'Neuroscientists should replace judges', 'Memory is completely unreliable in all cases'], correctIndex: 1, level: 'C2', category: 'reading', explanation: 'The passage says the legal system\'s reliance on eyewitness testimony "rests on a fundamentally flawed model of how memory works" — the assumption that memory records faithfully.' },
    { text: 'Passage: "The rational choice model in economics assumes that individuals maximise utility based on complete, consistent preferences. However, behavioural economists have documented systematic deviations from this model: people display loss aversion, discount future rewards inconsistently, and are influenced by framing effects. These findings have prompted some to call for a \'post-rational\' economics, though critics warn that abandoning the rational agent model without a comparably parsimonious alternative risks producing an unscientific patchwork of ad hoc explanations." What concern do critics of \'post-rational\' economics raise?', options: ['Behavioural economics is too mathematical', 'Without a simple, unified alternative to the rational model, we risk creating an incoherent collection of ad hoc explanations', 'People are actually fully rational', 'Economics should not study behaviour at all'], correctIndex: 1, level: 'C2', category: 'reading', explanation: 'Critics warn that "abandoning the rational agent model without a comparably parsimonious alternative risks producing an unscientific patchwork of ad hoc explanations."' },
    { text: 'Passage: "The notion of the \'author\' as the sole originator of a text\'s meaning has been thoroughly deconstructed. Barthes declared the \'death of the author,\' arguing that a text\'s meaning is produced in the encounter between reader and text, not determined by the author\'s intentions. While this insight usefully empowers readers, it also raises the question of whether any reading is as valid as any other, and whether the author\'s historical context and stated intentions should carry no interpretive weight whatsoever." What dilemma does the passage present?', options: ['Authors should not write', 'Empowering readers risks making all interpretations equally valid, potentially disregarding the author\'s context and intentions', 'Barthes was wrong about everything', 'Only the author can determine meaning'], correctIndex: 1, level: 'C2', category: 'reading', explanation: 'The dilemma is that while the "death of the author" empowers readers, it raises the question of whether "any reading is as valid as any other" and whether authorial intentions should carry no weight.' },
    { text: 'Passage: "Globalisation, far from creating a homogeneous world culture, has generated what anthropologists call \'glocalisation\' — the adaptation of global forms to local contexts. McDonald\'s serves McAloo Tikki in India and Teriyaki Burgers in Japan; Korean pop music incorporates Western production techniques while maintaining distinctly Korean performance aesthetics. These hybrid forms challenge the narrative of cultural imperialism as a one-way process, suggesting instead a more complex dialectic between global flows and local agency." What does the concept of \'glocalisation\' challenge?', options: ['That local cultures are disappearing', 'The idea that globalisation simply imposes Western culture on the rest of the world in a one-way process', 'That globalisation exists at all', 'That hybrid cultures are inferior'], correctIndex: 1, level: 'C2', category: 'reading', explanation: 'Glocalisation "challenges the narrative of cultural imperialism as a one-way process," showing that global forms are actively adapted locally rather than simply imposed.' },
    { text: 'Passage: "The ethical framework of utilitarianism — judging actions by their consequences for overall wellbeing — appears intuitive but encounters formidable objections. It seems to permit sacrificing an innocent person to save many, conflicts with widely held notions of justice and rights, and requires calculating outcomes that are often impossible to predict. Defenders respond that no ethical system avoids hard cases, and that utilitarianism at least provides a clear, impartial decision procedure. The persistence of these objections, however, suggests that consequentialist reasoning alone cannot capture the full complexity of moral life." What does the author conclude about utilitarianism?', options: ['It is the only valid ethical theory', 'It is completely wrong', 'While it offers a clear framework, consequentialist reasoning alone is insufficient to capture the full complexity of morality', 'It should be abandoned entirely'], correctIndex: 2, level: 'C2', category: 'reading', explanation: 'The author concludes that "consequentialist reasoning alone cannot capture the full complexity of moral life," acknowledging utilitarianism\'s clarity but its insufficiency as a sole framework.' },

    // ═══════════ A2 LISTENING (5 questions) ═══════════
    { text: 'You hear: "Excuse me, where is the nearest post office?" "Go straight ahead and turn left at the traffic lights. It\'s next to the supermarket." Where is the post office?', options: ['Next to the bank', 'Next to the supermarket', 'Across from the park', 'Behind the school'], correctIndex: 1, level: 'A2', category: 'listening', explanation: 'The speaker says the post office is "next to the supermarket."' },
    { text: 'You hear: "Can I have a coffee, please?" "Sure. Small or large?" "Large, please. And a chocolate muffin." What does the person order?', options: ['A small coffee and a muffin', 'A large coffee and a chocolate muffin', 'A large tea and a muffin', 'Only a large coffee'], correctIndex: 1, level: 'A2', category: 'listening', explanation: 'The person orders a large coffee and a chocolate muffin.' },
    { text: 'You hear: "What time does the train to Bristol leave?" "At half past ten, from platform 3." When does the train leave?', options: ['At 10:00', 'At 10:30', 'At 11:00', 'At 3:00'], correctIndex: 1, level: 'A2', category: 'listening', explanation: '"Half past ten" means 10:30.' },
    { text: 'You hear: "I\'m going to the supermarket. Do we need anything?" "Yes, please get some milk and a loaf of bread." What does the second person want?', options: ['Milk and eggs', 'Bread and butter', 'Milk and bread', 'Cheese and milk'], correctIndex: 2, level: 'A2', category: 'listening', explanation: 'The second person asks for "some milk and a loaf of bread."' },
    { text: 'You hear: "What does your sister look like?" "She\'s tall with long brown hair and green eyes." Which description matches the sister?', options: ['Short with blonde hair', 'Tall with long brown hair and green eyes', 'Tall with short black hair', 'Medium height with red hair'], correctIndex: 1, level: 'A2', category: 'listening', explanation: 'The speaker describes her as "tall with long brown hair and green eyes."' },

    // ═══════════ B1 LISTENING (5 questions) ═══════════
    { text: 'You hear: "Did you enjoy the concert last night?" "It was okay, but the sound quality was poor and the lead singer seemed to have a sore throat. I expected more, to be honest." What is the person\'s opinion of the concert?', options: ['It was excellent', 'It was disappointing because of sound issues and the singer\'s performance', 'It was the best concert ever', 'They didn\'t attend the concert'], correctIndex: 1, level: 'B1', category: 'listening', explanation: 'The person says "I expected more" and mentions poor sound quality and the singer\'s sore throat, indicating disappointment.' },
    { text: 'You hear: "I\'ve been calling the doctor\'s surgery all morning but the line is always busy." "Why don\'t you try booking online? Their website has an appointment system." What does the second speaker suggest?', options: ['Going to the surgery in person', 'Calling again later', 'Booking an appointment online', 'Finding a different doctor'], correctIndex: 2, level: 'B1', category: 'listening', explanation: 'The second speaker suggests "try booking online" through the website.' },
    { text: 'You hear: "Sarah, I need the report by Friday, not next Monday. The client moved the meeting forward." "Friday? That\'s quite tight, but I\'ll do my best." Why does the deadline change?', options: ['Sarah was late', 'The client moved the meeting to an earlier date', 'The report was too long', 'The client cancelled the meeting'], correctIndex: 1, level: 'B1', category: 'listening', explanation: 'The first speaker says "The client moved the meeting forward," meaning the meeting was rescheduled to an earlier date, bringing the deadline forward too.' },
    { text: 'You hear: "Are you coming to the team dinner on Thursday?" "I\'d love to, but I\'ve already promised to help my daughter with her school project that evening." What does the second speaker mean?', options: ['She will come to the dinner', 'She cannot come because she has a prior commitment', 'She doesn\'t like team dinners', 'She will come but leave early'], correctIndex: 1, level: 'B1', category: 'listening', explanation: '"I\'d love to, but" signals a polite refusal. She has already promised to help her daughter, so she cannot attend.' },
    { text: 'You hear: "I tried that new Italian restaurant on Main Street yesterday." "Oh, how was it?" "The pasta was delicious, but we waited over an hour for our food." What was the problem at the restaurant?', options: ['The food was bad', 'The service was very slow', 'The restaurant was closed', 'It was too expensive'], correctIndex: 1, level: 'B1', category: 'listening', explanation: 'The speaker says they "waited over an hour for our food," indicating very slow service.' },

    // ═══════════ B2 LISTENING (5 questions) ═══════════
    { text: 'You hear: "The new software is supposed to streamline our workflow, but honestly, I find it more complicated than the old system. The interface is confusing, and it takes twice as long to complete basic tasks. I\'ve heard others complaining too." What is the speaker\'s attitude toward the new software?', options: ['Enthusiastic and optimistic', 'Frustrated and sceptical of its benefits', 'Neutral and indifferent', 'Confused but willing to learn'], correctIndex: 1, level: 'B2', category: 'listening', explanation: 'The speaker finds it "more complicated," the interface "confusing," and tasks take "twice as long" — indicating frustration and scepticism.' },
    { text: 'You hear: "Attention passengers. Due to severe weather conditions, all flights to Northern Europe have been cancelled until further notice. Passengers are advised to contact their airlines for rebooking options. We apologise for the inconvenience." What should affected passengers do?', options: ['Wait at the airport for updates', 'Contact their airlines to rebook', 'Book tickets with a different airport', 'Travel to Northern Europe by train'], correctIndex: 1, level: 'B2', category: 'listening', explanation: 'The announcement advises passengers to "contact their airlines for rebooking options."' },
    { text: 'You hear: "I thought the presentation went well, especially the Q&A session. But looking back, I should have prepared more data to support our proposal. The board seemed interested but not fully convinced." What does the speaker think was missing from the presentation?', options: ['Better visual aids', 'More data to support the proposal', 'A longer Q&A session', 'More humour'], correctIndex: 1, level: 'B2', category: 'listening', explanation: 'The speaker says "I should have prepared more data to support our proposal" — they believe more data would have convinced the board.' },
    { text: 'You hear: "So, we\'re extending the deadline for the research project by two weeks. Several team members raised concerns about the original timeline, and management agreed it was unrealistic given the scope of the work." Why was the deadline extended?', options: ['The team was on holiday', 'Team members felt the original timeline was unrealistic for the amount of work', 'Management changed the project requirements', 'The funding was delayed'], correctIndex: 1, level: 'B2', category: 'listening', explanation: 'The speaker says team members "raised concerns about the original timeline" and management "agreed it was unrealistic given the scope of the work."' },
    { text: 'You hear: "Welcome to the museum. Audio guides are available at the desk for £3. Photography is permitted in all rooms except the special exhibition on the second floor. Please note the museum closes at 5 p.m. today, not the usual 6 p.m." What is different about today\'s closing time?', options: ['It closes at 3 p.m.', 'It closes one hour earlier than usual', 'It closes one hour later than usual', 'The museum is closed all day'], correctIndex: 1, level: 'B2', category: 'listening', explanation: 'The announcement says "the museum closes at 5 p.m. today, not the usual 6 p.m." — one hour earlier than normal.' },

    // ═══════════ C1 LISTENING (5 questions) ═══════════
    { text: 'You hear: "The findings are preliminary, and I wouldn\'t want to overstate their significance. That said, the correlation between screen time and anxiety levels in adolescents is striking enough to warrant further investigation, particularly given the consistency with previous longitudinal studies." What is the speaker\'s position?', options: ['The findings are conclusive and demand immediate policy changes', 'The findings are preliminary but significant enough to justify further research', 'The findings are irrelevant and should be ignored', 'Previous studies contradict these findings'], correctIndex: 1, level: 'C1', category: 'listening', explanation: 'The speaker says they "wouldn\'t want to overstate" the findings but the correlation is "striking enough to warrant further investigation" — acknowledging preliminary status while supporting more research.' },
    { text: 'You hear: "While I appreciate the minister\'s commitment to transparency, the fact remains that the report was released only after it was leaked to the press. One might reasonably question whether transparency would have been demonstrated had the leak not occurred." What is the speaker implying about the minister?', options: ['The minister is genuinely committed to transparency', 'The minister only released the report because it was leaked, not out of genuine commitment to transparency', 'The leak was caused by the press', 'The report was not important'], correctIndex: 1, level: 'C1', category: 'listening', explanation: 'The speaker implies that the report was released "only after it was leaked," questioning whether the minister would have been transparent without the leak.' },
    { text: 'You hear: "The restructuring plan makes financial sense on paper — the numbers are compelling. But we\'ve seen this pattern before: efficiency gains that translate into job losses, followed by declining morale, followed by declining productivity. The question is whether short-term financial optimisation is worth the long-term cultural cost." What concern does the speaker raise?', options: ['The financial analysis is incorrect', 'Short-term financial gains from restructuring may cause long-term damage to company culture and productivity', 'Employees are always against change', 'The restructuring plan is perfect'], correctIndex: 1, level: 'C1', category: 'listening', explanation: 'The speaker questions "whether short-term financial optimisation is worth the long-term cultural cost," pointing out a pattern where efficiency gains lead to job losses, declining morale, and lower productivity.' },
    { text: 'You hear: "It\'s not that I disagree with the principle of the legislation. My concern is the lack of clarity around implementation. Without clear guidelines, local authorities will interpret the law inconsistently, which could lead to unequal outcomes — the very thing the legislation aims to prevent." What is the speaker\'s main objection?', options: ['The legislation is unnecessary', 'The legislation\'s principle is wrong', 'Without clear implementation guidelines, the law may produce inconsistent and unequal results, contradicting its own purpose', 'Local authorities should not have any power'], correctIndex: 2, level: 'C1', category: 'listening', explanation: 'The speaker\'s concern is "the lack of clarity around implementation" which could cause "inconsistent" interpretation and "unequal outcomes — the very thing the legislation aims to prevent."' },
    { text: 'You hear: "The data clearly supports the hypothesis, but I think we need to be cautious about generalising from a sample of only 200 participants. There\'s also the question of selection bias — the respondents were all volunteers, which may not represent the broader population." What limitation of the study does the speaker identify?', options: ['The hypothesis was wrong', 'The sample size was too small and potentially biased due to volunteer participation', 'The data does not support the hypothesis', 'There were too many participants'], correctIndex: 1, level: 'C1', category: 'listening', explanation: 'The speaker mentions the small sample ("only 200 participants") and selection bias from volunteer respondents as limitations.' },
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
    // ─── Additional passages ───
    {
      title: 'Community Summer Fair',
      passageText: 'Dear Neighbours, We are excited to announce that the annual Summer Community Fair will take place on Saturday, July 15th, from 10 AM to 4 PM in Riverside Park. This year\'s event will include a food market with dishes from around the world, live music performed by local bands, and fun activities for children such as face painting and a treasure hunt. Entry is free, but we ask everyone to bring a small donation of non-perishable food for the local food bank. If you would like to volunteer to help on the day, please contact Sarah at communityfair@email.com by July 1st. We look forward to seeing you there!',
      level: 'A2',
      questions: [
        { questionText: 'When will the Summer Community Fair take place?', options: ['Sunday, July 15th', 'Saturday, July 15th', 'Saturday, July 1st', 'Sunday, July 1st'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'What are visitors asked to bring?', options: ['Money for tickets', 'Musical instruments', 'Non-perishable food for the food bank', 'Games for children'], correctIndex: 2, sortOrder: 2 },
        { questionText: 'How can someone volunteer for the event?', options: ['Show up on the day', 'Call the park office', 'Email Sarah by July 1st', 'Register at the food market'], correctIndex: 2, sortOrder: 3 },
      ],
    },
    {
      title: 'The Rise of Remote Work',
      passageText: 'Over the past decade, remote work has evolved from a rare perk into a mainstream employment model. Advances in cloud computing, video conferencing, and project management software have made it possible for millions of professionals to perform their duties from virtually anywhere. A 2023 survey found that 58% of workers now have the option to work remotely at least part of the time. While employees often cite improved work-life balance and the elimination of commuting as key benefits, employers have noted advantages too, including access to a broader talent pool and reduced office overhead costs. Nevertheless, remote work is not without its challenges. Some workers report feelings of isolation, difficulty separating work from personal life, and fewer opportunities for spontaneous collaboration. As a result, many companies are experimenting with hybrid arrangements that allow employees to split their time between home and the office.',
      level: 'B1',
      questions: [
        { questionText: 'According to the 2023 survey, what percentage of workers have the option to work remotely?', options: ['38%', '48%', '58%', '68%'], correctIndex: 2, sortOrder: 1 },
        { questionText: 'What is one challenge of remote work mentioned in the passage?', options: ['Higher office costs', 'Feelings of isolation', 'Longer commutes', 'Fewer job opportunities'], correctIndex: 1, sortOrder: 2 },
        { questionText: 'What are many companies experimenting with to address remote work challenges?', options: ['Returning fully to offices', 'Hybrid arrangements', 'Shorter work weeks', 'Mandatory office days only'], correctIndex: 1, sortOrder: 3 },
      ],
    },
    {
      title: 'Cognitive Biases in Everyday Judgement',
      passageText: 'Every day, people make hundreds of decisions, from what to eat for breakfast to which career path to pursue. While we like to believe our choices are rational, decades of research in cognitive psychology have shown that our thinking is riddled with systematic biases. The confirmation bias, for example, leads us to seek out information that supports our existing beliefs while ignoring evidence that contradicts them. The availability heuristic causes us to overestimate the likelihood of events that are easy to recall, such as plane crashes after seeing one on the news. Another pervasive bias is the sunk cost fallacy, whereby people continue investing time or money into a failing endeavour simply because they have already committed resources to it. Perhaps most troubling is the Dunning-Kruger effect, which describes how individuals with limited knowledge in a domain tend to overestimate their competence, while true experts often underestimate theirs. Awareness of these biases does not eliminate them, but it can help individuals pause and reflect before making important decisions.',
      level: 'B2',
      questions: [
        { questionText: 'What does the confirmation bias cause people to do?', options: ['Change their beliefs frequently', 'Seek information that supports existing beliefs and ignore contradicting evidence', 'Avoid making decisions altogether', 'Rely solely on statistical data'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'What is the sunk cost fallacy?', options: ['Investing in low-cost projects', 'Continuing to invest in something because resources have already been committed', 'Avoiding all financial risks', 'Calculating the exact cost before deciding'], correctIndex: 1, sortOrder: 2 },
        { questionText: 'What does the Dunning-Kruger effect describe?', options: ['Experts overestimate their competence', 'People with limited knowledge overestimate their competence while experts underestimate theirs', 'Everyone accurately judges their own abilities', 'Only beginners make poor decisions'], correctIndex: 1, sortOrder: 3 },
        { questionText: 'According to the text, what can awareness of cognitive biases help with?', options: ['Completely eliminating biases', 'Pausing and reflecting before making important decisions', 'Making faster decisions', 'Avoiding all mistakes'], correctIndex: 1, sortOrder: 4 },
      ],
    },
    {
      title: 'The Sharing Economy',
      passageText: 'The sharing economy, sometimes called the collaborative economy, refers to a socio-economic model built around the sharing of resources, often facilitated by digital platforms. Companies like Airbnb and Uber have become household names by enabling individuals to rent out spare rooms or offer rides using their personal vehicles. Proponents argue that the sharing economy promotes more efficient use of underutilised assets, reduces waste, and provides flexible income opportunities for participants. However, critics raise several concerns. The regulatory grey area in which many sharing-economy platforms operate has led to questions about consumer protection, workers\' rights, and fair competition with traditional businesses. Gig workers, in particular, often lack the benefits and job security afforded to full-time employees, such as health insurance and paid leave. Furthermore, in major cities, short-term rental platforms have been linked to rising housing costs, as landlords convert long-term rentals into more profitable tourist accommodations. As the sharing economy continues to expand, governments around the world are grappling with how to regulate these platforms without stifling innovation.',
      level: 'B2',
      questions: [
        { questionText: 'What is the sharing economy according to the passage?', options: ['A system where people share only food', 'A socio-economic model built around sharing resources, often via digital platforms', 'A government programme for distributing wealth', 'A type of cooperative banking'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'What concern do critics raise about gig workers?', options: ['They earn too much money', 'They lack benefits and job security compared to full-time employees', 'They have too many regulations', 'They compete unfairly with large corporations'], correctIndex: 1, sortOrder: 2 },
        { questionText: 'What effect have short-term rental platforms had in major cities?', options: ['Lower housing costs', 'No noticeable impact', 'Rising housing costs due to conversion of long-term rentals', 'Increased availability of long-term housing'], correctIndex: 2, sortOrder: 3 },
      ],
    },
    {
      title: 'The Moral Landscape of Artificial Intelligence',
      passageText: 'The rapid advancement of artificial intelligence presents society with a complex web of ethical dilemmas that existing regulatory frameworks are ill-equipped to address. One of the most pressing concerns is the issue of algorithmic accountability: when an AI system causes harm, whether through a misdiagnosis in healthcare or a biased sentencing recommendation in criminal justice, determining responsibility is far from straightforward. Should the developer, the deployer, or the algorithm itself bear the blame? Moreover, the opacity of deep learning models—their so-called "black box" nature—makes it difficult even to understand how a particular decision was reached, let alone to challenge it. Beyond accountability, there are profound questions about autonomy and consent. Facial recognition technology, for instance, can identify individuals in public spaces without their knowledge or permission, raising serious concerns about surveillance and the erosion of privacy. Meanwhile, the increasing deployment of autonomous weapons systems in military contexts has sparked fierce debate about whether machines should ever be permitted to make life-and-death decisions. Advocates for AI regulation argue that a precautionary approach is essential, insisting that developers must demonstrate safety before deployment rather than after harm occurs. Others warn that excessive regulation could stifle innovation and slow the development of AI systems that could deliver enormous social benefits, from early disease detection to climate modelling. Striking the right balance between innovation and protection remains one of the defining challenges of the twenty-first century.',
      level: 'C1',
      questions: [
        { questionText: 'What does the text identify as one of the most pressing concerns about AI?', options: ['The high cost of development', 'Algorithmic accountability', 'Lack of computing power', 'Competition between companies'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'Why is it difficult to challenge AI decisions according to the text?', options: ['AI decisions are always correct', 'Deep learning models operate as "black boxes" making it hard to understand how decisions are reached', 'There are no laws permitting challenges', 'AI systems are too fast to monitor'], correctIndex: 1, sortOrder: 2 },
        { questionText: 'What concern does facial recognition technology raise?', options: ['It is too expensive to deploy', 'It can identify individuals without their knowledge or consent, threatening privacy', 'It does not work accurately', 'It is only used in private buildings'], correctIndex: 1, sortOrder: 3 },
        { questionText: 'What do advocates for AI regulation argue?', options: ['Regulation should come after harm occurs', 'Developers must demonstrate safety before deployment', 'AI should not be regulated at all', 'Only military AI needs regulation'], correctIndex: 1, sortOrder: 4 },
      ],
    },
    {
      title: 'Globalization and Cultural Identity',
      passageText: 'Globalization has undeniably brought the world closer together, facilitating the exchange of goods, ideas, and people across borders at an unprecedented pace. However, this interconnectedness has also sparked intense debate about its impact on cultural identity. Critics argue that the homogenising force of global consumer culture—propagated by multinational corporations and dominant media industries—is eroding local traditions, languages, and ways of life. Indigenous languages, in particular, are disappearing at an alarming rate; UNESCO estimates that nearly half of the world\'s 7,000 languages are at risk of extinction by the end of this century. On the other hand, proponents of globalization contend that cultural exchange enriches rather than diminishes individual cultures. They point to the growing popularity of world music, international cuisine, and cross-border artistic collaborations as evidence that globalization can serve as a platform for minority cultures to reach global audiences. The concept of "glocalisation"—the adaptation of global products and ideas to fit local contexts—suggests that cultures are not simply passive recipients of global forces but active participants in reshaping them. Nevertheless, the power dynamics underlying cultural exchange remain uneven, with Western cultural products dominating global markets. Whether globalization ultimately strengthens or weakens cultural diversity may depend less on the phenomenon itself and more on the policies and choices that societies make in response to it.',
      level: 'C1',
      questions: [
        { questionText: 'What does UNESCO estimate about the world\'s languages?', options: ['All languages will survive this century', 'Nearly half are at risk of extinction by the end of this century', 'Only 100 languages remain', 'Language extinction has slowed down'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'What does the concept of "glocalisation" suggest?', options: ['Local cultures are destroyed by global forces', 'Cultures are passive recipients of global influences', 'Cultures actively adapt global products and ideas to fit local contexts', 'Global and local cultures cannot coexist'], correctIndex: 2, sortOrder: 2 },
        { questionText: 'What does the passage suggest ultimately determines whether globalization strengthens or weakens cultural diversity?', options: ['The speed of internet connectivity', 'The policies and choices societies make in response', 'The number of multinational corporations', 'The amount of foreign investment'], correctIndex: 1, sortOrder: 3 },
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
    // ─── Additional listening items ───
    {
      scriptText: 'Excuse me, do you know when the next bus to the city centre is? Let me check... The number 42 goes every fifteen minutes. The last one left at ten past two, so the next one should be at twenty-five past two. Oh, that\'s in about ten minutes then. Yes, that\'s right. And does it stop near the train station? Yes, it stops right outside the station. The journey takes about twenty minutes. Great, thank you so much for your help. No problem, happy to help!',
      context: 'You hear a conversation at a bus stop.',
      level: 'A2',
      questions: [
        { questionText: 'How often does the number 42 bus run?', options: ['Every 10 minutes', 'Every 15 minutes', 'Every 20 minutes', 'Every 30 minutes'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'Where does the bus stop in the city centre?', options: ['Near the shopping centre', 'Right outside the train station', 'Next to the park', 'By the bus depot'], correctIndex: 1, sortOrder: 2 },
      ],
    },
    {
      scriptText: 'Hi, this is a message for David from Karen in the project office. I\'m calling to let you know that tomorrow\'s project meeting has been moved. It was originally scheduled for 10 AM in Room 3B, but it\'s been changed to 2 PM in the large conference room on the fifth floor. The agenda remains the same, so please bring the budget reports you\'ve been working on. If you have any questions or if the new time doesn\'t work for you, please give me a call back before the end of the day. Thanks, and see you tomorrow!',
      context: 'You hear a voicemail message about a meeting change.',
      level: 'B1',
      questions: [
        { questionText: 'What time has the meeting been changed to?', options: ['10 AM', '12 PM', '2 PM', '4 PM'], correctIndex: 2, sortOrder: 1 },
        { questionText: 'What does David need to bring to the meeting?', options: ['His laptop', 'The budget reports', 'Meeting minutes', 'A presentation'], correctIndex: 1, sortOrder: 2 },
      ],
    },
    {
      scriptText: 'Good morning, everyone. Today we\'re going to examine the fundamental mechanisms driving climate change, with a particular focus on feedback loops. As you know, rising greenhouse gas concentrations trap more heat in the atmosphere, but what\'s often overlooked is how this initial warming triggers secondary effects that amplify the original change. For instance, as Arctic sea ice melts, it exposes darker ocean water, which absorbs more solar radiation rather than reflecting it, leading to further warming and more ice loss. This is known as a positive feedback loop. Another critical example is the thawing of permafrost in northern latitudes. As the ground thaws, it releases methane—a greenhouse gas roughly eighty times more potent than carbon dioxide over a twenty-year period—into the atmosphere, which in turn accelerates warming. Understanding these feedback mechanisms is essential because they mean that even modest initial temperature increases can produce disproportionately large long-term consequences. Current climate models suggest that feedback loops could account for up to forty percent of total projected warming by the end of the century.',
      context: 'You hear a university lecture about climate science.',
      level: 'B2',
      questions: [
        { questionText: 'What is a positive feedback loop according to the lecture?', options: ['A process that reduces warming over time', 'A process where initial warming triggers effects that amplify further warming', 'A natural cycle that stabilises the climate', 'A method for measuring temperature changes'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'Why is methane from thawing permafrost significant?', options: ['It is less harmful than carbon dioxide', 'It cools the atmosphere', 'It is approximately eighty times more potent than carbon dioxide over a twenty-year period', 'It only affects northern latitudes'], correctIndex: 2, sortOrder: 2 },
        { questionText: 'What percentage of projected warming could feedback loops account for by the end of the century?', options: ['Up to 20%', 'Up to 30%', 'Up to 40%', 'Up to 50%'], correctIndex: 2, sortOrder: 3 },
      ],
    },
    {
      scriptText: 'Welcome to today\'s panel on the future of work. I\'m joined by Dr. Amara Osei, a labour economist, and Marcus Chen, a technology policy analyst. Dr. Osei, let\'s start with you. How do you see automation reshaping employment over the next two decades? Well, the evidence suggests that while automation will displace certain categories of routine work, it will simultaneously create entirely new occupations that we can\'t yet fully anticipate. Historical precedent is instructive here: the industrial revolution destroyed many traditional crafts but ultimately generated far more jobs than it eliminated. The critical question is not whether jobs will exist, but whether workers will have the skills and support to transition into them. Marcus, do you agree? I agree with the broad trajectory, but I think Dr. Osei\'s framing perhaps understates the scale and speed of the current disruption. Unlike previous technological revolutions, artificial intelligence can now perform tasks that were thought to require human judgement—legal research, medical diagnosis, even creative writing. This means the transition will be far more abrupt, and without robust retraining programmes and social safety nets, we risk creating a large cohort of permanently displaced workers. What about the argument that universal basic income could address this? Universal basic income is one possible response, but it\'s not a silver bullet. It provides financial security but doesn\'t address the loss of purpose and social connection that meaningful work provides. I believe a more comprehensive approach is needed, combining income support with lifelong learning initiatives and community-building programmes.',
      context: 'You hear a panel discussion about the future of work.',
      level: 'C1',
      questions: [
        { questionText: 'What does Dr. Osei argue about automation and employment?', options: ['Automation will eliminate most jobs permanently', 'Automation will displace some work but create new occupations we cannot yet fully anticipate', 'Automation will have minimal impact on employment', 'Automation will only affect manual labour'], correctIndex: 1, sortOrder: 1 },
        { questionText: 'How does Marcus Chen\'s view differ from Dr. Osei\'s?', options: ['He believes automation is not a concern', 'He thinks the current disruption is more abrupt and understated in Dr. Osei\'s framing', 'He disagrees that any new jobs will be created', 'He believes universal basic income will solve everything'], correctIndex: 1, sortOrder: 2 },
        { questionText: 'What is Marcus Chen\'s view on universal basic income?', options: ['It is a silver bullet that solves all problems', 'It provides financial security but doesn\'t address the loss of purpose from meaningful work', 'It should be the only policy response', 'It is unnecessary if retraining programmes exist'], correctIndex: 1, sortOrder: 3 },
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
