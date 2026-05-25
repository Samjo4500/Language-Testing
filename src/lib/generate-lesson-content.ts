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
 * Every lesson gets topic-specific vocabulary with pronunciation.
 */
export function generateVocabulary(lesson: StaticLesson, module: StaticModule, course: StaticCourse): string | null {
  // All lessons get vocabulary — the key is the lesson title for lookup
  const topicWords: Record<string, { word: string; definition: string; example: string; pronunciation: string }[]> = {
    // ===== BEGINNER: Module 1 - Getting Started =====
    'Greetings & Introductions': [
      { word: 'Greet', definition: 'To welcome someone with a friendly word or action', example: 'She greeted me with a warm smile.', pronunciation: '/ɡriːt/' },
      { word: 'Introduce', definition: 'To tell someone your name or present someone to another person', example: 'Let me introduce myself — I am Maria.', pronunciation: '/ˌɪntrəˈdjuːs/' },
      { word: 'Pleasure', definition: 'A feeling of happiness or satisfaction', example: 'It is a pleasure to meet you.', pronunciation: '/ˈpleʒər/' },
      { word: 'Acquaintance', definition: 'A person you know but who is not a close friend', example: 'He is an acquaintance from work.', pronunciation: '/əˈkweɪntəns/' },
      { word: 'Handshake', definition: 'A greeting by clasping hands', example: 'A firm handshake shows confidence.', pronunciation: '/ˈhændʃeɪk/' },
    ],
    'The Alphabet & Numbers': [
      { word: 'Alphabet', definition: 'The set of letters used in writing a language', example: 'The English alphabet has 26 letters.', pronunciation: '/ˈælfəbet/' },
      { word: 'Vowel', definition: 'A speech sound made with an open vocal tract (A, E, I, O, U)', example: 'The word "apple" starts with a vowel.', pronunciation: '/ˈvaʊəl/' },
      { word: 'Consonant', definition: 'A speech sound made by partly blocking the breath', example: 'B, C, and D are consonants.', pronunciation: '/ˈkɒnsənənt/' },
      { word: 'Dozen', definition: 'A group of twelve', example: 'I bought a dozen eggs.', pronunciation: '/ˈdʌzən/' },
      { word: 'Digit', definition: 'Any of the numerals from 0 to 9', example: 'The number 42 has two digits.', pronunciation: '/ˈdɪdʒɪt/' },
    ],
    'Basic Pronunciation': [
      { word: 'Syllable', definition: 'A unit of pronunciation having one vowel sound', example: 'The word "water" has two syllables.', pronunciation: '/ˈsɪləbl/' },
      { word: 'Stress', definition: 'Extra emphasis given to a syllable or word when speaking', example: 'The stress in "record" changes depending on whether it is a noun or verb.', pronunciation: '/stres/' },
      { word: 'Intonation', definition: 'The rise and fall of the voice when speaking', example: 'Questions often have rising intonation.', pronunciation: '/ˌɪntəˈneɪʃn/' },
      { word: 'Schwa', definition: 'The most common vowel sound in English, written as /ə/', example: 'The "a" in "about" is a schwa sound.', pronunciation: '/ʃwɑː/' },
      { word: 'Articulate', definition: 'To pronounce words clearly and distinctly', example: 'Try to articulate each word carefully.', pronunciation: '/ɑːˈtɪkjuleɪt/' },
    ],
    'Common Phrases': [
      { word: 'How do you do', definition: 'A formal greeting used when meeting someone for the first time', example: 'How do you do? I am Dr. Smith.', pronunciation: '/haʊ duː juː duː/' },
      { word: 'Nice to meet you', definition: 'A polite expression used when meeting someone new', example: 'Nice to meet you! I have heard a lot about you.', pronunciation: '/naɪs tuː miːt juː/' },
      { word: 'Excuse me', definition: 'A polite way to get attention or apologize', example: 'Excuse me, could you help me find the station?', pronunciation: '/ɪkˈskjuːz miː/' },
      { word: 'You are welcome', definition: 'A polite response to "thank you"', example: 'Thank you for the gift! — You are welcome.', pronunciation: '/juː ɑːr ˈwelkəm/' },
      { word: 'I beg your pardon', definition: 'A formal way to ask someone to repeat or to apologize', example: 'I beg your pardon, I did not hear what you said.', pronunciation: '/aɪ beɡ jɔːr ˈpɑːrdn/' },
    ],
    // ===== BEGINNER: Module 2 - Everyday Life =====
    'Daily Routines': [
      { word: 'Routine', definition: 'A regular sequence of actions that you do repeatedly', example: 'My morning routine includes exercise and breakfast.', pronunciation: '/ruːˈtiːn/' },
      { word: 'Chore', definition: 'A routine task, especially a household one', example: 'Doing the dishes is my least favorite chore.', pronunciation: '/tʃɔːr/' },
      { word: 'Commute', definition: 'To travel regularly between home and work', example: 'I commute to the office by train every day.', pronunciation: '/kəˈmjuːt/' },
      { word: 'Schedule', definition: 'A plan that lists events and the times they will happen', example: 'My schedule is very busy this week.', pronunciation: '/ˈʃedjuːl/' },
      { word: 'Errand', definition: 'A short trip to do something specific', example: 'I need to run some errands after work.', pronunciation: '/ˈerənd/' },
    ],
    'Telling Time': [
      { word: 'O\'clock', definition: 'Used to specify the hour exactly', example: 'The meeting starts at nine o\'clock.', pronunciation: '/əˈklɒk/' },
      { word: 'Quarter', definition: 'Fifteen minutes before or after the hour', example: 'It is a quarter past three.', pronunciation: '/ˈkwɔːrtər/' },
      { word: 'Half past', definition: 'Thirty minutes after the hour', example: 'The train leaves at half past six.', pronunciation: '/hæf pæst/' },
      { word: 'Noon', definition: 'Twelve o\'clock in the middle of the day', example: 'We usually have lunch at noon.', pronunciation: '/nuːn/' },
      { word: 'Midnight', definition: 'Twelve o\'clock at night', example: 'The store closes at midnight.', pronunciation: '/ˈmɪdnaɪt/' },
    ],
    'Days, Months & Seasons': [
      { word: 'Weekday', definition: 'Any day from Monday to Friday', example: 'I work on weekdays and rest on weekends.', pronunciation: '/ˈwiːkdeɪ/' },
      { word: 'Fortnight', definition: 'A period of two weeks', example: 'We go camping every fortnight in summer.', pronunciation: '/ˈfɔːrtnaɪt/' },
      { word: 'Season', definition: 'One of the four divisions of the year (spring, summer, autumn, winter)', example: 'Autumn is my favorite season.', pronunciation: '/ˈsiːzn/' },
      { word: 'Calendar', definition: 'A chart showing the days, weeks, and months of a year', example: 'Mark the date on your calendar.', pronunciation: '/ˈkælɪndər/' },
      { word: 'Annually', definition: 'Once a year; every year', example: 'The festival is held annually in July.', pronunciation: '/ˈænjuəli/' },
    ],
    'Weather Vocabulary': [
      { word: 'Forecast', definition: 'A prediction of future weather conditions', example: 'The forecast says it will rain tomorrow.', pronunciation: '/ˈfɔːrkæst/' },
      { word: 'Breeze', definition: 'A gentle wind', example: 'A cool breeze blew across the lake.', pronunciation: '/briːz/' },
      { word: 'Humid', definition: 'Containing a lot of moisture in the air', example: 'The weather is very humid today.', pronunciation: '/ˈhjuːmɪd/' },
      { word: 'Overcast', definition: 'Covered with clouds; not sunny', example: 'The sky was overcast all morning.', pronunciation: '/ˌoʊvərˈkæst/' },
      { word: 'Drizzle', definition: 'Very light rain', example: 'It is just drizzling, you do not need an umbrella.', pronunciation: '/ˈdrɪzl/' },
    ],
    // ===== BEGINNER: Module 3 - People & Places =====
    'Describing People': [
      { word: 'Appearance', definition: 'The way someone looks on the outside', example: 'She has a friendly appearance.', pronunciation: '/əˈpɪərəns/' },
      { word: 'Curly', definition: 'Having hair that forms curves or waves', example: 'He has curly brown hair.', pronunciation: '/ˈkɜːrli/' },
      { word: 'Tall', definition: 'Of greater than average height', example: 'My brother is very tall.', pronunciation: '/tɔːl/' },
      { word: 'Freckles', definition: 'Small brown spots on the skin caused by the sun', example: 'She has freckles across her nose.', pronunciation: '/ˈfreklz/' },
      { word: 'Elderly', definition: 'Old or aging; a polite way to describe older people', example: 'An elderly gentleman helped me.', pronunciation: '/ˈeldərli/' },
    ],
    'Family Members': [
      { word: 'Sibling', definition: 'A brother or sister', example: 'I have three siblings — two brothers and a sister.', pronunciation: '/ˈsɪblɪŋ/' },
      { word: 'Relatives', definition: 'Members of your extended family', example: 'All my relatives came to the wedding.', pronunciation: '/ˈrelətɪvz/' },
      { word: 'Nephew', definition: 'The son of your brother or sister', example: 'My nephew just started school.', pronunciation: '/ˈnefjuː/' },
      { word: 'Niece', definition: 'The daughter of your brother or sister', example: 'My niece is learning to play piano.', pronunciation: '/niːs/' },
      { word: 'Ancestor', definition: 'A person from whom you are descended', example: 'My ancestors came from Italy.', pronunciation: '/ˈænsestər/' },
    ],
    'Rooms & Furniture': [
      { word: 'Furnish', definition: 'To provide a room with furniture', example: 'We need to furnish the living room.', pronunciation: '/ˈfɜːrnɪʃ/' },
      { word: 'Wardrobe', definition: 'A large cupboard for storing clothes', example: 'Hang your coat in the wardrobe.', pronunciation: '/ˈwɔːrdroʊb/' },
      { word: 'Appliance', definition: 'A machine used in the home, such as a washing machine', example: 'Kitchen appliances can be expensive.', pronunciation: '/əˈplaɪəns/' },
      { word: 'Attic', definition: 'The space inside the roof of a house', example: 'We store old boxes in the attic.', pronunciation: '/ˈætɪk/' },
      { word: 'Cushion', definition: 'A soft bag used for sitting or leaning on', example: 'She added colorful cushions to the sofa.', pronunciation: '/ˈkʊʃn/' },
    ],
    'Asking for Directions': [
      { word: 'Intersection', definition: 'A place where two or more roads meet', example: 'Turn left at the intersection.', pronunciation: '/ˌɪntərˈsekʃn/' },
      { word: 'Landmark', definition: 'A recognizable feature used for navigation', example: 'The museum is a well-known landmark.', pronunciation: '/ˈlændmɑːrk/' },
      { word: 'Pedestrian', definition: 'A person walking rather than driving', example: 'Watch out for pedestrians at the crossing.', pronunciation: '/pəˈdestriən/' },
      { word: 'Roundabout', definition: 'A circular intersection where traffic flows in one direction', example: 'Take the second exit at the roundabout.', pronunciation: '/ˈraʊndəbaʊt/' },
      { word: 'Block', definition: 'The area surrounded by four streets', example: 'The shop is two blocks away.', pronunciation: '/blɒk/' },
    ],
    // ===== BEGINNER: Module 4 - Food & Drink =====
    'At the Restaurant': [
      { word: 'Appetizer', definition: 'A small dish served before the main course', example: 'We ordered bruschetta as an appetizer.', pronunciation: '/ˈæpɪtaɪzər/' },
      { word: 'Waiter', definition: 'A person who serves food in a restaurant', example: 'The waiter brought the menu.', pronunciation: '/ˈweɪtər/' },
      { word: 'Tip', definition: 'Extra money given for good service', example: 'We left a 15% tip for the waiter.', pronunciation: '/tɪp/' },
      { word: 'Reservation', definition: 'An arrangement to have a table held for you', example: 'I made a reservation for 7 pm.', pronunciation: '/ˌrezərˈveɪʃn/' },
      { word: 'Bill', definition: 'The statement of money owed for a meal', example: 'Could we have the bill, please?', pronunciation: '/bɪl/' },
    ],
    'Cooking Vocabulary': [
      { word: 'Simmer', definition: 'To cook gently just below boiling point', example: 'Simmer the sauce for ten minutes.', pronunciation: '/ˈsɪmər/' },
      { word: 'Chop', definition: 'To cut into small pieces with a knife', example: 'Chop the onions finely.', pronunciation: '/tʃɒp/' },
      { word: 'Stir', definition: 'To move a spoon around in a liquid to mix it', example: 'Stir the soup before serving.', pronunciation: '/stɜːr/' },
      { word: 'Recipe', definition: 'A set of instructions for preparing a dish', example: 'I followed a recipe from a cookbook.', pronunciation: '/ˈresəpi/' },
      { word: 'Season', definition: 'To add salt, pepper, or spices to food', example: 'Season the chicken with herbs and garlic.', pronunciation: '/ˈsiːzn/' },
    ],
    'Food Shopping': [
      { word: 'Aisle', definition: 'A passage between shelves in a shop', example: 'The pasta is in aisle three.', pronunciation: '/aɪl/' },
      { word: 'Expired', definition: 'No longer safe to eat or use because the date has passed', example: 'Check if the milk has expired.', pronunciation: '/ɪkˈspaɪərd/' },
      { word: 'Bulk', definition: 'In large quantities', example: 'Buying in bulk is usually cheaper.', pronunciation: '/bʌlk/' },
      { word: 'Barcode', definition: 'A pattern of lines on a product read by a scanner', example: 'The barcode would not scan.', pronunciation: '/ˈbɑːrkoʊd/' },
      { word: 'Organic', definition: 'Produced without artificial chemicals', example: 'I prefer to buy organic vegetables.', pronunciation: '/ɔːrˈɡænɪk/' },
    ],
    'Likes & Dislikes': [
      { word: 'Prefer', definition: 'To like one thing more than another', example: 'I prefer tea to coffee.', pronunciation: '/prɪˈfɜːr/' },
      { word: 'Disgusting', definition: 'Extremely unpleasant', example: 'The spoiled food smelled disgusting.', pronunciation: '/dɪsˈɡʌstɪŋ/' },
      { word: 'Delicious', definition: 'Very pleasant to taste', example: 'This cake is absolutely delicious!', pronunciation: '/dɪˈlɪʃəs/' },
      { word: 'Crave', definition: 'To have a strong desire for something', example: 'I am craving chocolate right now.', pronunciation: '/kreɪv/' },
      { word: 'Acquired taste', definition: 'Something you learn to like over time', example: 'Olives are an acquired taste.', pronunciation: '/əˈkwaɪərd teɪst/' },
    ],
    // ===== BEGINNER: Module 5 - Basic Grammar =====
    'Present Simple Tense': [
      { word: 'Habitual', definition: 'Done regularly or repeatedly', example: 'The present simple is used for habitual actions.', pronunciation: '/həˈbɪtʃuəl/' },
      { word: 'Subject', definition: 'The person or thing that performs the action in a sentence', example: '"She" is the subject in "She runs every day."', pronunciation: '/ˈsʌbdʒɪkt/' },
      { word: 'Verb', definition: 'A word that describes an action or state', example: '"Eat" and "sleep" are verbs.', pronunciation: '/vɜːrb/' },
      { word: 'Third person', definition: 'Referring to he, she, or it', example: 'In the third person singular, we add -s to the verb.', pronunciation: '/θɜːrd ˈpɜːrsn/' },
      { word: 'Affirmative', definition: 'A statement that says something is true (not negative)', example: '"I like coffee" is an affirmative sentence.', pronunciation: '/əˈfɜːrmətɪv/' },
    ],
    'Articles: A, An, The': [
      { word: 'Definite article', definition: '"The" — used to refer to a specific noun', example: 'The book on the table is mine.', pronunciation: '/ˈdefɪnət ˈɑːrtɪkl/' },
      { word: 'Indefinite article', definition: '"A" or "an" — used for non-specific nouns', example: 'I saw a cat in the garden.', pronunciation: '/ɪnˈdefɪnət ˈɑːrtɪkl/' },
      { word: 'Consonant sound', definition: 'A sound made by partly blocking the breath — use "a" before it', example: 'A dog, a house, a university.', pronunciation: '/ˈkɒnsənənt saʊnd/' },
      { word: 'Vowel sound', definition: 'An open vocal tract sound — use "an" before it', example: 'An apple, an hour, an umbrella.', pronunciation: '/ˈvaʊəl saʊnd/' },
      { word: 'Generic', definition: 'Referring to a whole class or group, not one specific item', example: 'The tiger is an endangered species.', pronunciation: '/dʒəˈnerɪk/' },
    ],
    'Subject & Object Pronouns': [
      { word: 'Pronoun', definition: 'A word used instead of a noun to avoid repetition', example: 'Instead of "Mary," we say "she."', pronunciation: '/ˈproʊnaʊn/' },
      { word: 'Subject pronoun', definition: 'A pronoun that performs the action: I, you, he, she, it, we, they', example: 'She is my teacher.', pronunciation: '/ˈsʌbdʒɪkt ˈproʊnaʊn/' },
      { word: 'Object pronoun', definition: 'A pronoun that receives the action: me, you, him, her, it, us, them', example: 'The teacher helped me.', pronunciation: '/ˈɒbdʒɪkt ˈproʊnaʊn/' },
      { word: 'Reflexive pronoun', definition: 'A pronoun referring back to the subject: myself, yourself, etc.', example: 'I made it myself.', pronunciation: '/rɪˈfleksɪv ˈproʊnaʊn/' },
      { word: 'Antecedent', definition: 'The noun that a pronoun refers to', example: 'In "John lost his keys," John is the antecedent of his.', pronunciation: '/ˌæntɪˈsiːdnt/' },
    ],
    'Questions & Negatives': [
      { word: 'Interrogative', definition: 'A word used to ask a question (who, what, where, when, why, how)', example: 'What is your name?', pronunciation: '/ˌɪntəˈrɒɡətɪv/' },
      { word: 'Auxiliary', definition: 'A helping verb used to form questions and negatives (do, does, did)', example: 'Do you like tea?', pronunciation: '/ɔːɡˈzɪliəri/' },
      { word: 'Negation', definition: 'Making a statement negative by adding "not"', example: 'I do not (don\'t) like spicy food.', pronunciation: '/nɪˈɡeɪʃn/' },
      { word: 'Contract', definition: 'To shorten a word or words using an apostrophe', example: 'Do not → Don\'t. She is → She\'s.', pronunciation: '/kənˈtrækt/' },
      { word: 'Tag question', definition: 'A short question added to the end of a statement', example: 'You like coffee, don\'t you?', pronunciation: '/tæɡ ˈkwestʃən/' },
    ],
    // ===== BEGINNER: Module 6 - Shopping & Money =====
    'At the Store': [
      { word: 'Receipt', definition: 'A written record of a purchase', example: 'Keep your receipt in case you need a refund.', pronunciation: '/rɪˈsiːt/' },
      { word: 'Refund', definition: 'Money returned for a returned product', example: 'I returned the shirt and got a refund.', pronunciation: '/ˈriːfʌnd/' },
      { word: 'Discount', definition: 'A reduction in the usual price', example: 'There is a 20% discount on all jackets.', pronunciation: '/ˈdɪskaʊnt/' },
      { word: 'Bargain', definition: 'Something sold for less than its usual price', example: 'This dress was a real bargain!', pronunciation: '/ˈbɑːrɡɪn/' },
      { word: 'Browse', definition: 'To look at items without a specific intention to buy', example: 'I like to browse in bookshops.', pronunciation: '/braʊz/' },
    ],
    'Prices & Counting': [
      { word: 'Currency', definition: 'The money used in a particular country', example: 'The currency in Japan is the yen.', pronunciation: '/ˈkʌrənsi/' },
      { word: 'Change', definition: 'The money returned after paying more than the cost', example: 'Here is your change: two dollars.', pronunciation: '/tʃeɪndʒ/' },
      { word: 'Cent', definition: 'One hundredth of a dollar', example: 'This costs ninety-nine cents.', pronunciation: '/sent/' },
      { word: 'Budget', definition: 'A plan for how to spend money', example: 'I need to stick to my budget this month.', pronunciation: '/ˈbʌdʒɪt/' },
      { word: 'Afford', definition: 'To have enough money to buy something', example: 'I cannot afford a new car.', pronunciation: '/əˈfɔːrd/' },
    ],
    'Clothes Vocabulary': [
      { word: 'Fabric', definition: 'Material used to make clothes', example: 'This fabric is very soft and comfortable.', pronunciation: '/ˈfæbrɪk/' },
      { word: 'Sleeve', definition: 'The part of a garment that covers the arm', example: 'This shirt has long sleeves.', pronunciation: '/sliːv/' },
      { word: 'Collar', definition: 'The part of a shirt that goes around the neck', example: 'He wears a shirt with a stiff collar.', pronunciation: '/ˈkɒlər/' },
      { word: 'Fit', definition: 'The way clothes conform to your body', example: 'These jeans fit perfectly.', pronunciation: '/fɪt/' },
      { word: 'Pattern', definition: 'A repeated decorative design on fabric', example: 'She wore a dress with a floral pattern.', pronunciation: '/ˈpætn/' },
    ],
    'Asking for Help': [
      { word: 'Assist', definition: 'To help someone', example: 'Can you assist me with this box?', pronunciation: '/əˈsɪst/' },
      { word: 'Direction', definition: 'The way something is pointing or the path to follow', example: 'Can you give me directions to the station?', pronunciation: '/dəˈrekʃn/' },
      { word: 'Struggle', definition: 'To have difficulty doing something', example: 'I am struggling with this exercise.', pronunciation: '/ˈstrʌɡl/' },
      { word: 'Favor', definition: 'A kind act done to help someone', example: 'Could you do me a favor and close the window?', pronunciation: '/ˈfeɪvər/' },
      { word: 'Clarify', definition: 'To make something easier to understand', example: 'Could you clarify what you mean?', pronunciation: '/ˈklærɪfaɪ/' },
    ],
    // ===== BEGINNER: Module 7 - Health & Body =====
    'Body Parts': [
      { word: 'Elbow', definition: 'The joint between the upper and lower arm', example: 'I bumped my elbow on the door.', pronunciation: '/ˈelboʊ/' },
      { word: 'Ankle', definition: 'The joint connecting the foot and leg', example: 'She twisted her ankle playing tennis.', pronunciation: '/ˈæŋkl/' },
      { word: 'Wrist', definition: 'The joint connecting the hand and forearm', example: 'He wears a watch on his wrist.', pronunciation: '/rɪst/' },
      { word: 'Shoulder', definition: 'The joint connecting the arm to the body', example: 'She carried the bag on her shoulder.', pronunciation: '/ˈʃoʊldər/' },
      { word: 'Chest', definition: 'The front part of the body from the neck to the stomach', example: 'He felt a pain in his chest.', pronunciation: '/tʃest/' },
    ],
    'At the Doctor': [
      { word: 'Symptom', definition: 'A sign of illness or disease', example: 'A fever is a common symptom of infection.', pronunciation: '/ˈsɪmptəm/' },
      { word: 'Prescription', definition: 'A doctor\'s written order for medicine', example: 'The doctor gave me a prescription for antibiotics.', pronunciation: '/prɪˈskrɪpʃn/' },
      { word: 'Diagnosis', definition: 'The identification of an illness by examination', example: 'The diagnosis confirmed it was just a cold.', pronunciation: '/ˌdaɪəɡˈnoʊsɪs/' },
      { word: 'Appointment', definition: 'An arranged time to see a doctor', example: 'I have an appointment with the doctor at 3 pm.', pronunciation: '/əˈpɔɪntmənt/' },
      { word: 'Pharmacy', definition: 'A shop where medicines are sold', example: 'You can pick up your medicine at the pharmacy.', pronunciation: '/ˈfɑːrməsi/' },
    ],
    'Common Illnesses': [
      { word: 'Flu', definition: 'A contagious viral illness causing fever and aches', example: 'She is in bed with the flu.', pronunciation: '/fluː/' },
      { word: 'Allergy', definition: 'A reaction of the immune system to something harmless', example: 'I have an allergy to peanuts.', pronunciation: '/ˈælərdʒi/' },
      { word: 'Headache', definition: 'A pain in the head', example: 'I have a terrible headache.', pronunciation: '/ˈhedeɪk/' },
      { word: 'Sore throat', definition: 'Pain or irritation in the throat', example: 'I cannot talk much — I have a sore throat.', pronunciation: '/sɔːr θroʊt/' },
      { word: 'Nausea', definition: 'A feeling of wanting to vomit', example: 'The medicine may cause nausea.', pronunciation: '/ˈnɔːziə/' },
    ],
    'Healthy Habits': [
      { word: 'Hydration', definition: 'The process of absorbing water', example: 'Proper hydration is essential for health.', pronunciation: '/haɪˈdreɪʃn/' },
      { word: 'Nutrition', definition: 'The process of providing food for health and growth', example: 'Good nutrition helps you stay healthy.', pronunciation: '/njuːˈtrɪʃn/' },
      { word: 'Posture', definition: 'The position of the body when sitting or standing', example: 'Good posture prevents back pain.', pronunciation: '/ˈpɒstʃər/' },
      { word: 'Hygiene', definition: 'Practices that maintain health and prevent disease', example: 'Hand hygiene is important for preventing illness.', pronunciation: '/ˈhaɪdʒiːn/' },
      { word: 'Stamina', definition: 'The ability to sustain physical or mental effort', example: 'Running builds stamina over time.', pronunciation: '/ˈstæmɪnə/' },
    ],
    // ===== BEGINNER: Module 8 - Travel Basics =====
    'At the Airport': [
      { word: 'Boarding pass', definition: 'A document permitting you to board a plane', example: 'Please have your boarding pass ready.', pronunciation: '/ˈbɔːrdɪŋ pæs/' },
      { word: 'Departure', definition: 'The act of leaving, especially by plane', example: 'Departures are on the second floor.', pronunciation: '/dɪˈpɑːrtʃər/' },
      { word: 'Baggage', definition: 'Suitcases and bags carried when traveling', example: 'Each passenger can check two pieces of baggage.', pronunciation: '/ˈbæɡɪdʒ/' },
      { word: 'Customs', definition: 'The place where officials check goods entering a country', example: 'We had to go through customs at the airport.', pronunciation: '/ˈkʌstəmz/' },
      { word: 'Layover', definition: 'A stop between flights before continuing', example: 'We have a three-hour layover in Dubai.', pronunciation: '/ˈleɪoʊvər/' },
    ],
    'Hotel Check-in': [
      { word: 'Reservation', definition: 'An arrangement to hold a room', example: 'I have a reservation under the name Smith.', pronunciation: '/ˌrezərˈveɪʃn/' },
      { word: 'Reception', definition: 'The front desk area of a hotel', example: 'Please leave your key at reception.', pronunciation: '/rɪˈsepʃn/' },
      { word: 'Amenities', definition: 'Features that make a stay comfortable', example: 'The hotel amenities include a pool and gym.', pronunciation: '/əˈmenɪtiz/' },
      { word: 'Check out', definition: 'To leave a hotel and settle the bill', example: 'Check-out time is 11 am.', pronunciation: '/tʃek aʊt/' },
      { word: 'Suite', definition: 'A set of connected rooms in a hotel', example: 'We booked the honeymoon suite.', pronunciation: '/swiːt/' },
    ],
    'Getting Around Town': [
      { word: 'Commute', definition: 'To travel regularly between home and work', example: 'I commute by bus every day.', pronunciation: '/kəˈmjuːt/' },
      { word: 'Fare', definition: 'The money you pay for a journey', example: 'The bus fare is two dollars.', pronunciation: '/fer/' },
      { word: 'Transfer', definition: 'To change from one bus or train to another', example: 'You need to transfer at the next stop.', pronunciation: '/trænsˈfɜːr/' },
      { word: 'Subway', definition: 'An underground railway system', example: 'Take the subway to downtown.', pronunciation: '/ˈsʌbweɪ/' },
      { word: 'Avenue', definition: 'A wide street, often with trees', example: 'The hotel is on Fifth Avenue.', pronunciation: '/ˈævənjuː/' },
    ],
    'Emergency Phrases': [
      { word: 'Ambulance', definition: 'A vehicle for taking sick or injured people to hospital', example: 'Please call an ambulance!', pronunciation: '/ˈæmbjələns/' },
      { word: 'Urgent', definition: 'Requiring immediate attention', example: 'This is an urgent situation — please help!', pronunciation: '/ˈɜːrdʒənt/' },
      { word: 'Allergy', definition: 'A medical condition causing a reaction', example: 'I have a severe allergy to penicillin.', pronunciation: '/ˈælərdʒi/' },
      { word: 'Pharmacy', definition: 'A shop that sells medicines', example: 'Where is the nearest pharmacy?', pronunciation: '/ˈfɑːrməsi/' },
      { word: 'First aid', definition: 'Basic medical treatment given immediately', example: 'Does anyone know first aid?', pronunciation: '/fɜːrst eɪd/' },
    ],
  };

  // Look up topic-specific vocabulary
  const words = topicWords[lesson.title];

  if (words) {
    return JSON.stringify(words);
  }

  // Fallback: generate vocabulary based on module topic
  const moduleTopic = module.title;
  const fallbackWords = [
    { word: 'Topic', definition: `A subject related to ${moduleTopic.toLowerCase()}`, example: `The topic of ${moduleTopic.toLowerCase()} is covered in this lesson.`, pronunciation: '/ˈtɒpɪk/' },
    { word: 'Comprehend', definition: 'To understand something fully', example: 'It is important to comprehend the main ideas.', pronunciation: '/ˌkɒmprɪˈhend/' },
    { word: 'Illustrate', definition: 'To explain or make something clear with examples', example: 'The teacher illustrated the point with an example.', pronunciation: '/ˈɪləstreɪt/' },
    { word: 'Emphasize', definition: 'To give special importance to something', example: 'The lesson emphasizes practical usage.', pronunciation: '/ˈemfəsaɪz/' },
    { word: 'Acquire', definition: 'To gain or learn something new', example: 'Students acquire new skills through practice.', pronunciation: '/əˈkwaɪər/' },
  ];

  return JSON.stringify(fallbackWords);
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
