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
    'Greetings & Introductions': [
      { word: 'Greet', definition: 'To welcome someone with a friendly word or action', example: 'She greeted me with a warm smile.', pronunciation: '/ɡriːt/' },
      { word: 'Introduce', definition: 'To tell someone your name or present someone to another person', example: 'Let me introduce myself — I am Maria.', pronunciation: '/ˌɪntrəˈdjuːs/' },
      { word: 'Pleasure', definition: 'A feeling of happiness or satisfaction', example: 'It is a pleasure to meet you.', pronunciation: '/ˈpleʒər/' },
      { word: 'Acquaintance', definition: 'A person you know but who is not a close friend', example: 'He is an acquaintance from work.', pronunciation: '/əˈkweɪntəns/' },
      { word: 'Handshake', definition: 'A greeting by clasping hands', example: 'A firm handshake shows confidence.', pronunciation: '/ˈhændʃeɪk/' },
      { word: 'Farewell', definition: 'A formal way of saying goodbye', example: 'We bid them farewell at the airport.', pronunciation: '/ˌferˈwel/' },
      { word: 'Colleague', definition: 'A person you work with', example: 'Let me introduce my colleague, Sarah.', pronunciation: '/ˈkɒliːɡ/' },
      { word: 'Casual', definition: 'Relaxed and not formal', example: 'A casual greeting like "hi" is fine with friends.', pronunciation: '/ˈkæʒuəl/' },
      { word: 'Formal', definition: 'Following established customs or rules; official', example: 'Use formal language in job interviews.', pronunciation: '/ˈfɔːrməl/' },
      { word: 'Courtesy', definition: 'Polite behavior that shows respect', example: 'It is common courtesy to greet people.', pronunciation: '/ˈkɜːrtəsi/' }
    ],
    'The Alphabet & Numbers': [
      { word: 'Alphabet', definition: 'The set of letters used in writing a language', example: 'The English alphabet has 26 letters.', pronunciation: '/ˈælfəbet/' },
      { word: 'Vowel', definition: 'A speech sound made with an open vocal tract (A, E, I, O, U)', example: 'The word "apple" starts with a vowel.', pronunciation: '/ˈvaʊəl/' },
      { word: 'Consonant', definition: 'A speech sound made by partly blocking the breath', example: 'B, C, and D are consonants.', pronunciation: '/ˈkɒnsənənt/' },
      { word: 'Dozen', definition: 'A group of twelve', example: 'I bought a dozen eggs.', pronunciation: '/ˈdʌzən/' },
      { word: 'Digit', definition: 'Any of the numerals from 0 to 9', example: 'The number 42 has two digits.', pronunciation: '/ˈdɪdʒɪt/' },
      { word: 'Spell', definition: 'To say or write the letters of a word in order', example: 'Can you spell your name, please?', pronunciation: '/spel/' },
      { word: 'Capital', definition: 'An uppercase letter', example: 'Always use a capital letter at the start of a sentence.', pronunciation: '/ˈkæpɪtl/' },
      { word: 'Lowercase', definition: 'A small letter (not capital)', example: 'Write the rest of the word in lowercase.', pronunciation: '/ˈloʊərkeɪs/' },
      { word: 'Hundred', definition: 'The number 100', example: 'There are a hundred students in the hall.', pronunciation: '/ˈhʌndrəd/' },
      { word: 'Thousand', definition: 'The number 1,000', example: 'The city has a thousand residents.', pronunciation: '/ˈθaʊzənd/' }
    ],
    'Basic Pronunciation': [
      { word: 'Syllable', definition: 'A unit of pronunciation having one vowel sound', example: 'The word "water" has two syllables.', pronunciation: '/ˈsɪləbl/' },
      { word: 'Stress', definition: 'Extra emphasis given to a syllable or word when speaking', example: 'The stress in "record" changes depending on whether it is a noun or verb.', pronunciation: '/stres/' },
      { word: 'Intonation', definition: 'The rise and fall of the voice when speaking', example: 'Questions often have rising intonation.', pronunciation: '/ˌɪntəˈneɪʃn/' },
      { word: 'Schwa', definition: 'The most common vowel sound in English, written as /ə/', example: 'The "a" in "about" is a schwa sound.', pronunciation: '/ʃwɑː/' },
      { word: 'Articulate', definition: 'To pronounce words clearly and distinctly', example: 'Try to articulate each word carefully.', pronunciation: '/ɑːˈtɪkjuleɪt/' },
      { word: 'Fluent', definition: 'Able to speak a language easily and smoothly', example: 'She is fluent in both English and French.', pronunciation: '/ˈfluːənt/' },
      { word: 'Accent', definition: 'A distinctive way of pronouncing a language', example: 'He speaks English with a slight accent.', pronunciation: '/ˈæksent/' },
      { word: 'Enunciate', definition: 'To say or pronounce words clearly', example: 'Please enunciate so everyone can hear you.', pronunciation: '/ɪˈnʌnsieɪt/' },
      { word: 'Rhythm', definition: 'The pattern of sounds and stresses in speech', example: 'English has a stress-timed rhythm.', pronunciation: '/ˈrɪðəm/' },
      { word: 'Pronounce', definition: 'To make the sound of a word', example: 'How do you pronounce this word?', pronunciation: '/prəˈnaʊns/' }
    ],
    'Common Phrases': [
      { word: 'How do you do', definition: 'A formal greeting used when meeting someone for the first time', example: 'How do you do? I am Dr. Smith.', pronunciation: '/haʊ duː juː duː/' },
      { word: 'Nice to meet you', definition: 'A polite expression used when meeting someone new', example: 'Nice to meet you! I have heard a lot about you.', pronunciation: '/naɪs tuː miːt juː/' },
      { word: 'Excuse me', definition: 'A polite way to get attention or apologize', example: 'Excuse me, could you help me find the station?', pronunciation: '/ɪkˈskjuːz miː/' },
      { word: 'You are welcome', definition: 'A polite response to "thank you"', example: 'Thank you for the gift! — You are welcome.', pronunciation: '/juː ɑːr ˈwelkəm/' },
      { word: 'I beg your pardon', definition: 'A formal way to ask someone to repeat or to apologize', example: 'I beg your pardon, I did not hear what you said.', pronunciation: '/aɪ beɡ jɔːr ˈpɑːrdn/' },
      { word: 'Bless you', definition: 'A polite expression said when someone sneezes', example: 'Ah-choo! — Bless you!', pronunciation: '/bles juː/' },
      { word: 'Cheers', definition: 'An informal way to say thank you or goodbye', example: 'Cheers for helping me out!', pronunciation: '/tʃɪrz/' },
      { word: 'My pleasure', definition: 'A polite response meaning "I was happy to do it"', example: 'Thank you for your help. — My pleasure!', pronunciation: '/maɪ ˈpleʒər/' },
      { word: 'Take care', definition: 'A friendly way to say goodbye and wish someone well', example: 'Take care! See you next week.', pronunciation: '/teɪk ker/' },
      { word: 'No worries', definition: 'An informal way to say "it is okay" or "do not worry"', example: 'Sorry I am late! — No worries at all.', pronunciation: '/noʊ ˈwʌriz/' }
    ],
    'Daily Routines': [
      { word: 'Routine', definition: 'A regular sequence of actions that you do repeatedly', example: 'My morning routine includes exercise and breakfast.', pronunciation: '/ruːˈtiːn/' },
      { word: 'Chore', definition: 'A routine task, especially a household one', example: 'Doing the dishes is my least favorite chore.', pronunciation: '/tʃɔːr/' },
      { word: 'Commute', definition: 'To travel regularly between home and work', example: 'I commute to the office by train every day.', pronunciation: '/kəˈmjuːt/' },
      { word: 'Schedule', definition: 'A plan that lists events and the times they will happen', example: 'My schedule is very busy this week.', pronunciation: '/ˈʃedjuːl/' },
      { word: 'Errand', definition: 'A short trip to do something specific', example: 'I need to run some errands after work.', pronunciation: '/ˈerənd/' },
      { word: 'Breakfast', definition: 'The first meal of the day', example: 'I usually have toast and coffee for breakfast.', pronunciation: '/ˈbrekfəst/' },
      { word: 'Alarm', definition: 'A signal that wakes you up at a set time', example: 'My alarm goes off at six every morning.', pronunciation: '/əˈlɑːrm/' },
      { word: 'Shower', definition: 'A device that sprays water for bathing', example: 'I take a quick shower before work.', pronunciation: '/ˈʃaʊər/' },
      { word: 'Habit', definition: 'Something you do regularly, often without thinking', example: 'Reading before bed is a good habit.', pronunciation: '/ˈhæbɪt/' },
      { word: 'Leisure', definition: 'Free time when you are not working', example: 'I enjoy reading in my leisure time.', pronunciation: '/ˈleʒər/' }
    ],
    'Telling Time': [
      { word: 'O\'clock', definition: 'Used to specify the hour exactly', example: 'The meeting starts at nine o\'clock.', pronunciation: '/əˈklɒk/' },
      { word: 'Quarter', definition: 'Fifteen minutes before or after the hour', example: 'It is a quarter past three.', pronunciation: '/ˈkwɔːrtər/' },
      { word: 'Half past', definition: 'Thirty minutes after the hour', example: 'The train leaves at half past six.', pronunciation: '/hæf pæst/' },
      { word: 'Noon', definition: 'Twelve o\'clock in the middle of the day', example: 'We usually have lunch at noon.', pronunciation: '/nuːn/' },
      { word: 'Midnight', definition: 'Twelve o\'clock at night', example: 'The store closes at midnight.', pronunciation: '/ˈmɪdnaɪt/' },
      { word: 'AM', definition: 'Before noon (ante meridiem)', example: 'The appointment is at 9 AM.', pronunciation: '/ˌeɪˈem/' },
      { word: 'PM', definition: 'After noon (post meridiem)', example: 'The class ends at 3 PM.', pronunciation: '/ˌpiːˈem/' },
      { word: 'Sharp', definition: 'Exactly at the stated time', example: 'Be here at 8 o\'clock sharp.', pronunciation: '/ʃɑːrp/' },
      { word: 'Dawn', definition: 'The first light of day', example: 'We woke at dawn to watch the sunrise.', pronunciation: '/dɔːn/' },
      { word: 'Dusk', definition: 'The darker part of twilight', example: 'The street lights come on at dusk.', pronunciation: '/dʌsk/' }
    ],
    'Days, Months & Seasons': [
      { word: 'Weekday', definition: 'Any day from Monday to Friday', example: 'I work on weekdays and rest on weekends.', pronunciation: '/ˈwiːkdeɪ/' },
      { word: 'Fortnight', definition: 'A period of two weeks', example: 'We go camping every fortnight in summer.', pronunciation: '/ˈfɔːrtnaɪt/' },
      { word: 'Season', definition: 'One of the four divisions of the year (spring, summer, autumn, winter)', example: 'Autumn is my favorite season.', pronunciation: '/ˈsiːzn/' },
      { word: 'Calendar', definition: 'A chart showing the days, weeks, and months of a year', example: 'Mark the date on your calendar.', pronunciation: '/ˈkælɪndər/' },
      { word: 'Annually', definition: 'Once a year; every year', example: 'The festival is held annually in July.', pronunciation: '/ˈænjuəli/' },
      { word: 'Leap year', definition: 'A year with 366 days, occurring every four years', example: '2024 is a leap year, so February has 29 days.', pronunciation: '/liːp jɪr/' },
      { word: 'Month', definition: 'One of the twelve divisions of a year', example: 'There are twelve months in a year.', pronunciation: '/mʌnθ/' },
      { word: 'Decade', definition: 'A period of ten years', example: 'The company celebrated its third decade.', pronunciation: '/ˈdekeɪd/' },
      { word: 'Solstice', definition: 'The longest or shortest day of the year', example: 'The summer solstice is in June.', pronunciation: '/ˈsɒlstɪs/' },
      { word: 'Equinox', definition: 'When day and night are of equal length', example: 'The spring equinox marks the start of the season.', pronunciation: '/ˈiːkwɪnɒks/' }
    ],
    'Weather Vocabulary': [
      { word: 'Forecast', definition: 'A prediction of future weather conditions', example: 'The forecast says it will rain tomorrow.', pronunciation: '/ˈfɔːrkæst/' },
      { word: 'Breeze', definition: 'A gentle wind', example: 'A cool breeze blew across the lake.', pronunciation: '/briːz/' },
      { word: 'Humid', definition: 'Containing a lot of moisture in the air', example: 'The weather is very humid today.', pronunciation: '/ˈhjuːmɪd/' },
      { word: 'Overcast', definition: 'Covered with clouds; not sunny', example: 'The sky was overcast all morning.', pronunciation: '/ˌoʊvərˈkæst/' },
      { word: 'Drizzle', definition: 'Very light rain', example: 'It is just drizzling, you do not need an umbrella.', pronunciation: '/ˈdrɪzl/' },
      { word: 'Thunderstorm', definition: 'A storm with lightning and heavy rain', example: 'A thunderstorm is expected this evening.', pronunciation: '/ˈθʌndərstɔːrm/' },
      { word: 'Frost', definition: 'A thin layer of ice crystals on surfaces', example: 'There was frost on the car windows this morning.', pronunciation: '/frɒst/' },
      { word: 'Heatwave', definition: 'A period of unusually hot weather', example: 'The heatwave lasted for two weeks.', pronunciation: '/ˈhiːtweɪv/' },
      { word: 'Downpour', definition: 'A heavy, sudden fall of rain', example: 'We got caught in a downpour on the way home.', pronunciation: '/ˈdaʊnpɔːr/' },
      { word: 'Haze', definition: 'A slight obscuration of the atmosphere', example: 'The morning haze cleared by midday.', pronunciation: '/heɪz/' }
    ],
    'Describing People': [
      { word: 'Appearance', definition: 'The way someone looks on the outside', example: 'She has a friendly appearance.', pronunciation: '/əˈpɪərəns/' },
      { word: 'Curly', definition: 'Having hair that forms curves or waves', example: 'He has curly brown hair.', pronunciation: '/ˈkɜːrli/' },
      { word: 'Tall', definition: 'Of greater than average height', example: 'My brother is very tall.', pronunciation: '/tɔːl/' },
      { word: 'Freckles', definition: 'Small brown spots on the skin caused by the sun', example: 'She has freckles across her nose.', pronunciation: '/ˈfreklz/' },
      { word: 'Elderly', definition: 'Old or aging; a polite way to describe older people', example: 'An elderly gentleman helped me.', pronunciation: '/ˈeldərli/' },
      { word: 'Plump', definition: 'Slightly fat in a pleasant way', example: 'The baby has plump cheeks.', pronunciation: '/plʌmp/' },
      { word: 'Slim', definition: 'Attractively thin', example: 'She is tall and slim.', pronunciation: '/slɪm/' },
      { word: 'Beard', definition: 'Hair growing on the chin and cheeks', example: 'He grew a beard over the winter.', pronunciation: '/bɪrd/' },
      { word: 'Gaze', definition: 'A steady intent look', example: 'She had a gentle gaze that put people at ease.', pronunciation: '/ɡeɪz/' },
      { word: 'Complexion', definition: 'The natural color and appearance of the skin', example: 'She has a fair complexion.', pronunciation: '/kəmˈplekʃn/' }
    ],
    'Family Members': [
      { word: 'Sibling', definition: 'A brother or sister', example: 'I have three siblings — two brothers and a sister.', pronunciation: '/ˈsɪblɪŋ/' },
      { word: 'Relatives', definition: 'Members of your extended family', example: 'All my relatives came to the wedding.', pronunciation: '/ˈrelətɪvz/' },
      { word: 'Nephew', definition: 'The son of your brother or sister', example: 'My nephew just started school.', pronunciation: '/ˈnefjuː/' },
      { word: 'Niece', definition: 'The daughter of your brother or sister', example: 'My niece is learning to play piano.', pronunciation: '/niːs/' },
      { word: 'Ancestor', definition: 'A person from whom you are descended', example: 'My ancestors came from Italy.', pronunciation: '/ˈænsestər/' },
      { word: 'In-law', definition: 'A relative by marriage', example: 'My sister-in-law is a doctor.', pronunciation: '/ˈɪn lɔː/' },
      { word: 'Stepfather', definition: 'The husband of your mother but not your biological father', example: 'Her stepfather has been very supportive.', pronunciation: '/ˈstepfɑːðər/' },
      { word: 'Grandchild', definition: 'The child of your son or daughter', example: 'They have five grandchildren.', pronunciation: '/ˈɡrændtʃaɪld/' },
      { word: 'Twin', definition: 'One of two children born at the same time', example: 'She has a twin brother.', pronunciation: '/twɪn/' },
      { word: 'Guardian', definition: 'A person who is legally responsible for a child', example: 'Her aunt became her legal guardian.', pronunciation: '/ˈɡɑːrdiən/' }
    ],
    'Rooms & Furniture': [
      { word: 'Furnish', definition: 'To provide a room with furniture', example: 'We need to furnish the living room.', pronunciation: '/ˈfɜːrnɪʃ/' },
      { word: 'Wardrobe', definition: 'A large cupboard for storing clothes', example: 'Hang your coat in the wardrobe.', pronunciation: '/ˈwɔːrdroʊb/' },
      { word: 'Appliance', definition: 'A machine used in the home, such as a washing machine', example: 'Kitchen appliances can be expensive.', pronunciation: '/əˈplaɪəns/' },
      { word: 'Attic', definition: 'The space inside the roof of a house', example: 'We store old boxes in the attic.', pronunciation: '/ˈætɪk/' },
      { word: 'Cushion', definition: 'A soft bag used for sitting or leaning on', example: 'She added colorful cushions to the sofa.', pronunciation: '/ˈkʊʃn/' },
      { word: 'Basement', definition: 'The floor of a building partly or entirely below ground', example: 'The laundry room is in the basement.', pronunciation: '/ˈbeɪsmənt/' },
      { word: 'Bookshelf', definition: 'A shelf for holding books', example: 'The bookshelf in the study is full.', pronunciation: '/ˈbʊkʃelf/' },
      { word: 'Countertop', definition: 'A flat surface in a kitchen for preparing food', example: 'Wipe the countertop after cooking.', pronunciation: '/ˈkaʊntərtɒp/' },
      { word: 'Curtain', definition: 'A piece of fabric hung to cover a window', example: 'She drew the curtains to block the sunlight.', pronunciation: '/ˈkɜːrtn/' },
      { word: 'Fireplace', definition: 'An opening in a wall for a fire', example: 'We gathered around the fireplace to stay warm.', pronunciation: '/ˈfaɪərpleɪs/' }
    ],
    'Asking for Directions': [
      { word: 'Intersection', definition: 'A place where two or more roads meet', example: 'Turn left at the intersection.', pronunciation: '/ˌɪntərˈsekʃn/' },
      { word: 'Landmark', definition: 'A recognizable feature used for navigation', example: 'The museum is a well-known landmark.', pronunciation: '/ˈlændmɑːrk/' },
      { word: 'Pedestrian', definition: 'A person walking rather than driving', example: 'Watch out for pedestrians at the crossing.', pronunciation: '/pəˈdestriən/' },
      { word: 'Roundabout', definition: 'A circular intersection where traffic flows in one direction', example: 'Take the second exit at the roundabout.', pronunciation: '/ˈraʊndəbaʊt/' },
      { word: 'Block', definition: 'The area surrounded by four streets', example: 'The shop is two blocks away.', pronunciation: '/blɒk/' },
      { word: 'Highway', definition: 'A main road connecting cities', example: 'Take the highway north for ten miles.', pronunciation: '/ˈhaɪweɪ/' },
      { word: 'Shortcut', definition: 'A quicker or more direct route', example: 'I know a shortcut through the park.', pronunciation: '/ˈʃɔːrtkʌt/' },
      { word: 'Crosswalk', definition: 'A marked path for pedestrians to cross a road', example: 'Always use the crosswalk to cross the street.', pronunciation: '/ˈkrɒswɔːk/' },
      { word: 'Opposite', definition: 'On the other side; facing', example: 'The bank is opposite the post office.', pronunciation: '/ˈɒpəzɪt/' },
      { word: 'Dead end', definition: 'A road with no way out at the end', example: 'We reached a dead end and had to turn around.', pronunciation: '/ded end/' }
    ],
    'At the Restaurant': [
      { word: 'Appetizer', definition: 'A small dish served before the main course', example: 'We ordered bruschetta as an appetizer.', pronunciation: '/ˈæpɪtaɪzər/' },
      { word: 'Waiter', definition: 'A person who serves food in a restaurant', example: 'The waiter brought the menu.', pronunciation: '/ˈweɪtər/' },
      { word: 'Tip', definition: 'Extra money given for good service', example: 'We left a 15% tip for the waiter.', pronunciation: '/tɪp/' },
      { word: 'Reservation', definition: 'An arrangement to have a table held for you', example: 'I made a reservation for 7 pm.', pronunciation: '/ˌrezərˈveɪʃn/' },
      { word: 'Bill', definition: 'The statement of money owed for a meal', example: 'Could we have the bill, please?', pronunciation: '/bɪl/' },
      { word: 'Main course', definition: 'The primary dish of a meal', example: 'For the main course, I had grilled salmon.', pronunciation: '/meɪn kɔːrs/' },
      { word: 'Dessert', definition: 'A sweet dish served at the end of a meal', example: 'Would you like to see the dessert menu?', pronunciation: '/dɪˈzɜːrt/' },
      { word: 'Beverage', definition: 'A drink of any type', example: 'Hot and cold beverages are available.', pronunciation: '/ˈbevərɪdʒ/' },
      { word: 'Specialty', definition: 'A dish that a restaurant is known for', example: 'The seafood paella is our specialty.', pronunciation: '/ˈspeʃəlti/' },
      { word: 'Takeaway', definition: 'Food prepared to be eaten off the premises', example: 'Let us get a takeaway for dinner.', pronunciation: '/ˈteɪkəweɪ/' }
    ],
    'Cooking Vocabulary': [
      { word: 'Simmer', definition: 'To cook gently just below boiling point', example: 'Simmer the sauce for ten minutes.', pronunciation: '/ˈsɪmər/' },
      { word: 'Chop', definition: 'To cut into small pieces with a knife', example: 'Chop the onions finely.', pronunciation: '/tʃɒp/' },
      { word: 'Stir', definition: 'To move a spoon around in a liquid to mix it', example: 'Stir the soup before serving.', pronunciation: '/stɜːr/' },
      { word: 'Recipe', definition: 'A set of instructions for preparing a dish', example: 'I followed a recipe from a cookbook.', pronunciation: '/ˈresəpi/' },
      { word: 'Season', definition: 'To add salt, pepper, or spices to food', example: 'Season the chicken with herbs and garlic.', pronunciation: '/ˈsiːzn/' },
      { word: 'Grill', definition: 'To cook food over direct heat', example: 'Grill the vegetables until they are tender.', pronunciation: '/ɡrɪl/' },
      { word: 'Bake', definition: 'To cook food in an oven', example: 'Bake the cake at 180 degrees for 30 minutes.', pronunciation: '/beɪk/' },
      { word: 'Boil', definition: 'To heat a liquid until bubbles form', example: 'Boil the water before adding pasta.', pronunciation: '/bɔɪl/' },
      { word: 'Marinate', definition: 'To soak food in a seasoned liquid', example: 'Marinate the beef overnight for best flavor.', pronunciation: '/ˈmærɪneɪt/' },
      { word: 'Garnish', definition: 'To decorate food for presentation', example: 'Garnish the dish with fresh parsley.', pronunciation: '/ˈɡɑːrnɪʃ/' }
    ],
    'Food Shopping': [
      { word: 'Aisle', definition: 'A passage between shelves in a shop', example: 'The pasta is in aisle three.', pronunciation: '/aɪl/' },
      { word: 'Expired', definition: 'No longer safe to eat or use because the date has passed', example: 'Check if the milk has expired.', pronunciation: '/ɪkˈspaɪərd/' },
      { word: 'Bulk', definition: 'In large quantities', example: 'Buying in bulk is usually cheaper.', pronunciation: '/bʌlk/' },
      { word: 'Barcode', definition: 'A pattern of lines on a product read by a scanner', example: 'The barcode would not scan.', pronunciation: '/ˈbɑːrkoʊd/' },
      { word: 'Organic', definition: 'Produced without artificial chemicals', example: 'I prefer to buy organic vegetables.', pronunciation: '/ɔːrˈɡænɪk/' },
      { word: 'Cart', definition: 'A vehicle with wheels used to carry shopping', example: 'Push the cart to the checkout.', pronunciation: '/kɑːrt/' },
      { word: 'Checkout', definition: 'The place where you pay for goods', example: 'There is a long line at the checkout.', pronunciation: '/ˈtʃekaʊt/' },
      { word: 'Shelf', definition: 'A flat surface for displaying products', example: 'The cereal is on the top shelf.', pronunciation: '/ʃelf/' },
      { word: 'Brand', definition: 'A particular make of product', example: 'This brand of coffee is my favorite.', pronunciation: '/brænd/' },
      { word: 'Special offer', definition: 'A discount or deal on a product', example: 'There is a special offer on bread today.', pronunciation: '/ˈspeʃl ˈɒfər/' }
    ],
    'Likes & Dislikes': [
      { word: 'Prefer', definition: 'To like one thing more than another', example: 'I prefer tea to coffee.', pronunciation: '/prɪˈfɜːr/' },
      { word: 'Disgusting', definition: 'Extremely unpleasant', example: 'The spoiled food smelled disgusting.', pronunciation: '/dɪsˈɡʌstɪŋ/' },
      { word: 'Delicious', definition: 'Very pleasant to taste', example: 'This cake is absolutely delicious!', pronunciation: '/dɪˈlɪʃəs/' },
      { word: 'Crave', definition: 'To have a strong desire for something', example: 'I am craving chocolate right now.', pronunciation: '/kreɪv/' },
      { word: 'Acquired taste', definition: 'Something you learn to like over time', example: 'Olives are an acquired taste.', pronunciation: '/əˈkwaɪərd teɪst/' },
      { word: 'Fond of', definition: 'Having a liking or affection for', example: 'I am quite fond of Italian food.', pronunciation: '/fɒnd ɒv/' },
      { word: 'Can\'t stand', definition: 'To strongly dislike', example: 'I can\'t stand the smell of cigarette smoke.', pronunciation: '/kænt stænd/' },
      { word: 'Enjoy', definition: 'To take pleasure in something', example: 'I really enjoy reading mystery novels.', pronunciation: '/ɪnˈdʒɔɪ/' },
      { word: 'Appetizing', definition: 'Looking or smelling good enough to eat', example: 'The buffet looked very appetizing.', pronunciation: '/ˈæpɪtaɪzɪŋ/' },
      { word: 'Tolerate', definition: 'To accept something unpleasant without complaining', example: 'I tolerate spicy food but do not enjoy it.', pronunciation: '/ˈtɒləreɪt/' }
    ],
    'Present Simple Tense': [
      { word: 'Habitual', definition: 'Done regularly or repeatedly', example: 'The present simple is used for habitual actions.', pronunciation: '/həˈbɪtʃuəl/' },
      { word: 'Subject', definition: 'The person or thing that performs the action in a sentence', example: '"She" is the subject in "She runs every day."', pronunciation: '/ˈsʌbdʒɪkt/' },
      { word: 'Verb', definition: 'A word that describes an action or state', example: '"Eat" and "sleep" are verbs.', pronunciation: '/vɜːrb/' },
      { word: 'Third person', definition: 'Referring to he, she, or it', example: 'In the third person singular, we add -s to the verb.', pronunciation: '/θɜːrd ˈpɜːrsn/' },
      { word: 'Affirmative', definition: 'A statement that says something is true (not negative)', example: '"I like coffee" is an affirmative sentence.', pronunciation: '/əˈfɜːrmətɪv/' },
      { word: 'Tense', definition: 'A grammatical category that locates a situation in time', example: 'The present simple tense describes regular actions.', pronunciation: '/tens/' },
      { word: 'Infinitive', definition: 'The base form of a verb, usually with "to"', example: 'The infinitive form of "runs" is "to run."', pronunciation: '/ɪnˈfɪnɪtɪv/' },
      { word: 'Conjugate', definition: 'To change the form of a verb to match its subject', example: 'Conjugate the verb for each person: I go, she goes.', pronunciation: '/ˈkɒndʒuɡeɪt/' },
      { word: 'Adverb', definition: 'A word that modifies a verb, adjective, or another adverb', example: '"Always" and "usually" are frequency adverbs.', pronunciation: '/ˈædvɜːrb/' },
      { word: 'Frequency', definition: 'How often something happens', example: 'Adverbs of frequency include always, often, and never.', pronunciation: '/ˈfriːkwənsi/' }
    ],
    'Articles: A, An, The': [
      { word: 'Definite article', definition: '"The" — used to refer to a specific noun', example: 'The book on the table is mine.', pronunciation: '/ˈdefɪnət ˈɑːrtɪkl/' },
      { word: 'Indefinite article', definition: '"A" or "an" — used for non-specific nouns', example: 'I saw a cat in the garden.', pronunciation: '/ɪnˈdefɪnət ˈɑːrtɪkl/' },
      { word: 'Consonant sound', definition: 'A sound made by partly blocking the breath — use "a" before it', example: 'A dog, a house, a university.', pronunciation: '/ˈkɒnsənənt saʊnd/' },
      { word: 'Vowel sound', definition: 'An open vocal tract sound — use "an" before it', example: 'An apple, an hour, an umbrella.', pronunciation: '/ˈvaʊəl saʊnd/' },
      { word: 'Generic', definition: 'Referring to a whole class or group, not one specific item', example: 'The tiger is an endangered species.', pronunciation: '/dʒəˈnerɪk/' },
      { word: 'Specific', definition: 'Clearly identified or particular', example: 'Use "the" when referring to a specific noun.', pronunciation: '/spəˈsɪfɪk/' },
      { word: 'Non-specific', definition: 'Not clearly identified; any one of a group', example: 'Use "a" for non-specific, general references.', pronunciation: '/nɒn spəˈsɪfɪk/' },
      { word: 'Zero article', definition: 'No article used before a noun', example: 'We use the zero article with uncountable nouns in general statements.', pronunciation: '/ˈzɪroʊ ˈɑːrtɪkl/' },
      { word: 'Countable', definition: 'A noun that can be counted (one apple, two apples)', example: '"Book" is a countable noun.', pronunciation: '/ˈkaʊntəbl/' },
      { word: 'Uncountable', definition: 'A noun that cannot be counted (water, rice, information)', example: '"Water" is an uncountable noun.', pronunciation: '/ʌnˈkaʊntəbl/' }
    ],
    'Subject & Object Pronouns': [
      { word: 'Pronoun', definition: 'A word used instead of a noun to avoid repetition', example: 'Instead of "Mary," we say "she."', pronunciation: '/ˈproʊnaʊn/' },
      { word: 'Subject pronoun', definition: 'A pronoun that performs the action: I, you, he, she, it, we, they', example: 'She is my teacher.', pronunciation: '/ˈsʌbdʒɪkt ˈproʊnaʊn/' },
      { word: 'Object pronoun', definition: 'A pronoun that receives the action: me, you, him, her, it, us, them', example: 'The teacher helped me.', pronunciation: '/ˈɒbdʒɪkt ˈproʊnaʊn/' },
      { word: 'Reflexive pronoun', definition: 'A pronoun referring back to the subject: myself, yourself, etc.', example: 'I made it myself.', pronunciation: '/rɪˈfleksɪv ˈproʊnaʊn/' },
      { word: 'Antecedent', definition: 'The noun that a pronoun refers to', example: 'In "John lost his keys," John is the antecedent of his.', pronunciation: '/ˌæntɪˈsiːdnt/' },
      { word: 'Possessive pronoun', definition: 'A pronoun showing ownership: mine, yours, his, hers, ours, theirs', example: 'This book is mine, not yours.', pronunciation: '/pəˈzesɪv ˈproʊnaʊn/' },
      { word: 'Demonstrative', definition: 'Words that point to specific things: this, that, these, those', example: 'This is my favorite book.', pronunciation: '/dɪˈmɒnstrətɪv/' },
      { word: 'Relative pronoun', definition: 'A pronoun that connects a clause to a noun: who, which, that', example: 'The person who called left a message.', pronunciation: '/ˈrelətɪv ˈproʊnaʊn/' },
      { word: 'Indefinite pronoun', definition: 'A pronoun that does not refer to a specific person or thing', example: 'Someone left their umbrella here.', pronunciation: '/ɪnˈdefɪnət ˈproʊnaʊn/' },
      { word: 'Agreement', definition: 'Matching the pronoun to its antecedent in number and gender', example: 'Pronoun agreement means using "she" for a female antecedent.', pronunciation: '/əˈɡriːmənt/' }
    ],
    'Questions & Negatives': [
      { word: 'Interrogative', definition: 'A word used to ask a question (who, what, where, when, why, how)', example: 'What is your name?', pronunciation: '/ˌɪntəˈrɒɡətɪv/' },
      { word: 'Auxiliary', definition: 'A helping verb used to form questions and negatives (do, does, did)', example: 'Do you like tea?', pronunciation: '/ɔːɡˈzɪliəri/' },
      { word: 'Negation', definition: 'Making a statement negative by adding "not"', example: 'I do not (don\'t) like spicy food.', pronunciation: '/nɪˈɡeɪʃn/' },
      { word: 'Contract', definition: 'To shorten a word or words using an apostrophe', example: 'Do not → Don\'t. She is → She\'s.', pronunciation: '/kənˈtrækt/' },
      { word: 'Tag question', definition: 'A short question added to the end of a statement', example: 'You like coffee, don\'t you?', pronunciation: '/tæɡ ˈkwestʃən/' },
      { word: 'Open question', definition: 'A question that cannot be answered with yes or no', example: 'Where do you live? is an open question.', pronunciation: '/ˈoʊpən ˈkwestʃən/' },
      { word: 'Closed question', definition: 'A question that can be answered with yes or no', example: 'Do you like coffee? is a closed question.', pronunciation: '/kloʊzd ˈkwestʃən/' },
      { word: 'Invert', definition: 'To reverse the order of subject and verb to form a question', example: 'Invert "you are" to form "are you?"', pronunciation: '/ɪnˈvɜːrt/' },
      { word: 'Double negative', definition: 'Using two negative words in the same clause, which is incorrect in English', example: 'I don\'t know nothing is a double negative — say I don\'t know anything.', pronunciation: '/ˈdʌbl ˈneɡətɪv/' },
      { word: 'Rhetorical question', definition: 'A question asked for effect, not to get an answer', example: 'Who would not want to be happy?', pronunciation: '/rɪˈtɒrɪkl ˈkwestʃən/' }
    ],
    'At the Store': [
      { word: 'Receipt', definition: 'A written record of a purchase', example: 'Keep your receipt in case you need a refund.', pronunciation: '/rɪˈsiːt/' },
      { word: 'Refund', definition: 'Money returned for a returned product', example: 'I returned the shirt and got a refund.', pronunciation: '/ˈriːfʌnd/' },
      { word: 'Discount', definition: 'A reduction in the usual price', example: 'There is a 20% discount on all jackets.', pronunciation: '/ˈdɪskaʊnt/' },
      { word: 'Bargain', definition: 'Something sold for less than its usual price', example: 'This dress was a real bargain!', pronunciation: '/ˈbɑːrɡɪn/' },
      { word: 'Browse', definition: 'To look at items without a specific intention to buy', example: 'I like to browse in bookshops.', pronunciation: '/braʊz/' },
      { word: 'Return', definition: 'To take a product back to the store', example: 'You can return items within 30 days.', pronunciation: '/rɪˈtɜːrn/' },
      { word: 'Exchange', definition: 'To swap a product for a different one', example: 'Can I exchange this for a larger size?', pronunciation: '/ɪksˈtʃeɪndʒ/' },
      { word: 'Cashier', definition: 'A person who handles payments in a store', example: 'Please pay the cashier at the front.', pronunciation: '/kæˈʃɪr/' },
      { word: 'Clearance', definition: 'A sale to get rid of remaining stock', example: 'All clearance items are 50% off.', pronunciation: '/ˈklɪrəns/' },
      { word: 'Loyalty card', definition: 'A card that gives you points or discounts at a store', example: 'Do you have a loyalty card?', pronunciation: '/ˈlɔɪəlti kɑːrd/' }
    ],
    'Prices & Counting': [
      { word: 'Currency', definition: 'The money used in a particular country', example: 'The currency in Japan is the yen.', pronunciation: '/ˈkʌrənsi/' },
      { word: 'Change', definition: 'The money returned after paying more than the cost', example: 'Here is your change: two dollars.', pronunciation: '/tʃeɪndʒ/' },
      { word: 'Cent', definition: 'One hundredth of a dollar', example: 'This costs ninety-nine cents.', pronunciation: '/sent/' },
      { word: 'Budget', definition: 'A plan for how to spend money', example: 'I need to stick to my budget this month.', pronunciation: '/ˈbʌdʒɪt/' },
      { word: 'Afford', definition: 'To have enough money to buy something', example: 'I cannot afford a new car.', pronunciation: '/əˈfɔːrd/' },
      { word: 'Installment', definition: 'One of several regular payments for something', example: 'You can pay in monthly installments.', pronunciation: '/ɪnˈstɔːlmənt/' },
      { word: 'Expensive', definition: 'Costing a lot of money', example: 'The restaurant was too expensive for us.', pronunciation: '/ɪkˈspensɪv/' },
      { word: 'Affordable', definition: 'Reasonably priced; not too expensive', example: 'These shoes are quite affordable.', pronunciation: '/əˈfɔːrdəbl/' },
      { word: 'Savings', definition: 'Money that you have saved over time', example: 'She used her savings to buy a laptop.', pronunciation: '/ˈseɪvɪŋz/' },
      { word: 'Debt', definition: 'Money that you owe to someone', example: 'He is working to pay off his student debt.', pronunciation: '/det/' }
    ],
    'Clothes Vocabulary': [
      { word: 'Fabric', definition: 'Material used to make clothes', example: 'This fabric is very soft and comfortable.', pronunciation: '/ˈfæbrɪk/' },
      { word: 'Sleeve', definition: 'The part of a garment that covers the arm', example: 'This shirt has long sleeves.', pronunciation: '/sliːv/' },
      { word: 'Collar', definition: 'The part of a shirt that goes around the neck', example: 'He wears a shirt with a stiff collar.', pronunciation: '/ˈkɒlər/' },
      { word: 'Fit', definition: 'The way clothes conform to your body', example: 'These jeans fit perfectly.', pronunciation: '/fɪt/' },
      { word: 'Pattern', definition: 'A repeated decorative design on fabric', example: 'She wore a dress with a floral pattern.', pronunciation: '/ˈpætn/' },
      { word: 'Hem', definition: 'The folded and sewn edge of a piece of cloth', example: 'The hem of the dress needs to be shortened.', pronunciation: '/hem/' },
      { word: 'Button', definition: 'A small disc used to fasten clothing', example: 'A button fell off my shirt.', pronunciation: '/ˈbʌtn/' },
      { word: 'Zipper', definition: 'A device for fastening clothing with interlocking teeth', example: 'The zipper on my jacket is broken.', pronunciation: '/ˈzɪpər/' },
      { word: 'Outfit', definition: 'A set of clothes worn together', example: 'That is a nice outfit for the party.', pronunciation: '/ˈaʊtfɪt/' },
      { word: 'Wardrobe', definition: 'All the clothes a person owns', example: 'She needs to update her wardrobe for the new season.', pronunciation: '/ˈwɔːrdroʊb/' }
    ],
    'Asking for Help': [
      { word: 'Assist', definition: 'To help someone', example: 'Can you assist me with this box?', pronunciation: '/əˈsɪst/' },
      { word: 'Direction', definition: 'The way something is pointing or the path to follow', example: 'Can you give me directions to the station?', pronunciation: '/dəˈrekʃn/' },
      { word: 'Struggle', definition: 'To have difficulty doing something', example: 'I am struggling with this exercise.', pronunciation: '/ˈstrʌɡl/' },
      { word: 'Favor', definition: 'A kind act done to help someone', example: 'Could you do me a favor and close the window?', pronunciation: '/ˈfeɪvər/' },
      { word: 'Clarify', definition: 'To make something easier to understand', example: 'Could you clarify what you mean?', pronunciation: '/ˈklærɪfaɪ/' },
      { word: 'Oblige', definition: 'To do something to help or please someone', example: 'I would be happy to oblige.', pronunciation: '/əˈblaɪdʒ/' },
      { word: 'Volunteer', definition: 'To offer to do something without being asked', example: 'She volunteered to help with the event.', pronunciation: '/ˌvɒlənˈtɪr/' },
      { word: 'Recommend', definition: 'To suggest something as being good or suitable', example: 'Can you recommend a good restaurant?', pronunciation: '/ˌrekəˈmend/' },
      { word: 'Inquire', definition: 'To ask for information', example: 'I would like to inquire about the course schedule.', pronunciation: '/ɪnˈkwaɪər/' },
      { word: 'Request', definition: 'A polite way of asking for something', example: 'I have a special request regarding my order.', pronunciation: '/rɪˈkwest/' }
    ],
    'Body Parts': [
      { word: 'Elbow', definition: 'The joint between the upper and lower arm', example: 'I bumped my elbow on the door.', pronunciation: '/ˈelboʊ/' },
      { word: 'Ankle', definition: 'The joint connecting the foot and leg', example: 'She twisted her ankle playing tennis.', pronunciation: '/ˈæŋkl/' },
      { word: 'Wrist', definition: 'The joint connecting the hand and forearm', example: 'He wears a watch on his wrist.', pronunciation: '/rɪst/' },
      { word: 'Shoulder', definition: 'The joint connecting the arm to the body', example: 'She carried the bag on her shoulder.', pronunciation: '/ˈʃoʊldər/' },
      { word: 'Chest', definition: 'The front part of the body from the neck to the stomach', example: 'He felt a pain in his chest.', pronunciation: '/tʃest/' },
      { word: 'Thigh', definition: 'The part of the leg above the knee', example: 'My thighs are sore from running.', pronunciation: '/θaɪ/' },
      { word: 'Spine', definition: 'The column of bones down the center of the back', example: 'Good posture protects your spine.', pronunciation: '/spaɪn/' },
      { word: 'Palm', definition: 'The inner surface of the hand', example: 'She held the coin in her palm.', pronunciation: '/pɑːm/' },
      { word: 'Kneecap', definition: 'The bone at the front of the knee', example: 'She scraped her kneecap when she fell.', pronunciation: '/ˈniːkæp/' },
      { word: 'Forehead', definition: 'The part of the face above the eyebrows', example: 'She felt her forehead to check for a fever.', pronunciation: '/ˈfɔːrhed/' }
    ],
    'At the Doctor': [
      { word: 'Symptom', definition: 'A sign of illness or disease', example: 'A fever is a common symptom of infection.', pronunciation: '/ˈsɪmptəm/' },
      { word: 'Prescription', definition: 'A doctor\'s written order for medicine', example: 'The doctor gave me a prescription for antibiotics.', pronunciation: '/prɪˈskrɪpʃn/' },
      { word: 'Diagnosis', definition: 'The identification of an illness by examination', example: 'The diagnosis confirmed it was just a cold.', pronunciation: '/ˌdaɪəɡˈnoʊsɪs/' },
      { word: 'Appointment', definition: 'An arranged time to see a doctor', example: 'I have an appointment with the doctor at 3 pm.', pronunciation: '/əˈpɔɪntmənt/' },
      { word: 'Pharmacy', definition: 'A shop where medicines are sold', example: 'You can pick up your medicine at the pharmacy.', pronunciation: '/ˈfɑːrməsi/' },
      { word: 'Receptionist', definition: 'A person who greets patients and manages appointments', example: 'The receptionist scheduled my follow-up visit.', pronunciation: '/rɪˈsepʃənɪst/' },
      { word: 'Vaccination', definition: 'An injection that protects against disease', example: 'Have you had your flu vaccination this year?', pronunciation: '/ˌvæksɪˈneɪʃn/' },
      { word: 'Referral', definition: 'A recommendation to see a specialist', example: 'My doctor gave me a referral to a dermatologist.', pronunciation: '/rɪˈfɜːrəl/' },
      { word: 'Dosage', definition: 'The amount of medicine to take', example: 'Follow the dosage instructions on the label.', pronunciation: '/ˈdoʊsɪdʒ/' },
      { word: 'Recovery', definition: 'The process of getting better after illness', example: 'Her recovery took about two weeks.', pronunciation: '/rɪˈkʌvəri/' }
    ],
    'Common Illnesses': [
      { word: 'Flu', definition: 'A contagious viral illness causing fever and aches', example: 'She is in bed with the flu.', pronunciation: '/fluː/' },
      { word: 'Allergy', definition: 'A reaction of the immune system to something harmless', example: 'I have an allergy to peanuts.', pronunciation: '/ˈælərdʒi/' },
      { word: 'Headache', definition: 'A pain in the head', example: 'I have a terrible headache.', pronunciation: '/ˈhedeɪk/' },
      { word: 'Sore throat', definition: 'Pain or irritation in the throat', example: 'I cannot talk much — I have a sore throat.', pronunciation: '/sɔːr θroʊt/' },
      { word: 'Nausea', definition: 'A feeling of wanting to vomit', example: 'The medicine may cause nausea.', pronunciation: '/ˈnɔːziə/' },
      { word: 'Fever', definition: 'An abnormally high body temperature', example: 'The child has a high fever.', pronunciation: '/ˈfiːvər/' },
      { word: 'Cough', definition: 'A sudden expulsion of air from the lungs', example: 'She has had a dry cough for a week.', pronunciation: '/kɒf/' },
      { word: 'Rash', definition: 'A change in skin color or texture', example: 'The rash appeared after she took the medicine.', pronunciation: '/ræʃ/' },
      { word: 'Contagious', definition: 'Able to be spread from person to person', example: 'The flu is highly contagious.', pronunciation: '/kənˈteɪdʒəs/' },
      { word: 'Chronic', definition: 'Lasting for a long time or recurring', example: 'She has chronic back pain.', pronunciation: '/ˈkrɒnɪk/' }
    ],
    'Healthy Habits': [
      { word: 'Hydration', definition: 'The process of absorbing water', example: 'Proper hydration is essential for health.', pronunciation: '/haɪˈdreɪʃn/' },
      { word: 'Nutrition', definition: 'The process of providing food for health and growth', example: 'Good nutrition helps you stay healthy.', pronunciation: '/njuːˈtrɪʃn/' },
      { word: 'Posture', definition: 'The position of the body when sitting or standing', example: 'Good posture prevents back pain.', pronunciation: '/ˈpɒstʃər/' },
      { word: 'Hygiene', definition: 'Practices that maintain health and prevent disease', example: 'Hand hygiene is important for preventing illness.', pronunciation: '/ˈhaɪdʒiːn/' },
      { word: 'Stamina', definition: 'The ability to sustain physical or mental effort', example: 'Running builds stamina over time.', pronunciation: '/ˈstæmɪnə/' },
      { word: 'Wellness', definition: 'The state of being in good health', example: 'The company offers a wellness program for employees.', pronunciation: '/ˈwelnəs/' },
      { word: 'Metabolism', definition: 'The chemical processes that keep the body functioning', example: 'Exercise can boost your metabolism.', pronunciation: '/məˈtæbəlɪzəm/' },
      { word: 'Immune', definition: 'Protected against a particular disease', example: 'A healthy diet keeps your immune system strong.', pronunciation: '/ɪˈmjuːn/' },
      { word: 'Stretch', definition: 'To extend your muscles to make them more flexible', example: 'Always stretch before exercising.', pronunciation: '/stretʃ/' },
      { word: 'Moderation', definition: 'Avoiding extremes; not too much of anything', example: 'Eat sweets in moderation for better health.', pronunciation: '/ˌmɒdəˈreɪʃn/' }
    ],
    'At the Airport': [
      { word: 'Boarding pass', definition: 'A document permitting you to board a plane', example: 'Please have your boarding pass ready.', pronunciation: '/ˈbɔːrdɪŋ pæs/' },
      { word: 'Departure', definition: 'The act of leaving, especially by plane', example: 'Departures are on the second floor.', pronunciation: '/dɪˈpɑːrtʃər/' },
      { word: 'Baggage', definition: 'Suitcases and bags carried when traveling', example: 'Each passenger can check two pieces of baggage.', pronunciation: '/ˈbæɡɪdʒ/' },
      { word: 'Customs', definition: 'The place where officials check goods entering a country', example: 'We had to go through customs at the airport.', pronunciation: '/ˈkʌstəmz/' },
      { word: 'Layover', definition: 'A stop between flights before continuing', example: 'We have a three-hour layover in Dubai.', pronunciation: '/ˈleɪoʊvər/' },
      { word: 'Terminal', definition: 'A building at an airport where passengers board and exit planes', example: 'Our flight departs from Terminal 2.', pronunciation: '/ˈtɜːrmɪnl/' },
      { word: 'Gate', definition: 'The area where passengers board the aircraft', example: 'Proceed to gate B7 for boarding.', pronunciation: '/ɡeɪt/' },
      { word: 'Carry-on', definition: 'Luggage that you take onto the plane with you', example: 'Your carry-on must fit under the seat.', pronunciation: '/ˈkæri ɒn/' },
      { word: 'Runway', definition: 'The strip of land where planes take off and land', example: 'The plane is waiting on the runway.', pronunciation: '/ˈrʌnweɪ/' },
      { word: 'Connecting flight', definition: 'A flight that requires changing planes to reach the destination', example: 'We missed our connecting flight to London.', pronunciation: '/kəˈnektɪŋ flaɪt/' }
    ],
    'Hotel Check-in': [
      { word: 'Reservation', definition: 'An arrangement to hold a room', example: 'I have a reservation under the name Smith.', pronunciation: '/ˌrezərˈveɪʃn/' },
      { word: 'Reception', definition: 'The front desk area of a hotel', example: 'Please leave your key at reception.', pronunciation: '/rɪˈsepʃn/' },
      { word: 'Amenities', definition: 'Features that make a stay comfortable', example: 'The hotel amenities include a pool and gym.', pronunciation: '/əˈmenɪtiz/' },
      { word: 'Check out', definition: 'To leave a hotel and settle the bill', example: 'Check-out time is 11 am.', pronunciation: '/tʃek aʊt/' },
      { word: 'Suite', definition: 'A set of connected rooms in a hotel', example: 'We booked the honeymoon suite.', pronunciation: '/swiːt/' },
      { word: 'Deposit', definition: 'A sum of money paid as security', example: 'A deposit is required at check-in.', pronunciation: '/dɪˈpɒzɪt/' },
      { word: 'Housekeeping', definition: 'The department responsible for cleaning rooms', example: 'Housekeeping will bring extra towels.', pronunciation: '/ˈhaʊskiːpɪŋ/' },
      { word: 'Concierge', definition: 'A hotel staff member who assists guests', example: 'The concierge recommended an excellent restaurant.', pronunciation: '/ˌkɒnsiˈerʒ/' },
      { word: 'Room service', definition: 'Food or drinks delivered to a hotel room', example: 'We ordered breakfast through room service.', pronunciation: '/ruːm ˈsɜːrvɪs/' },
      { word: 'Complimentary', definition: 'Provided free of charge', example: 'Wi-Fi is complimentary for all guests.', pronunciation: '/ˌkɒmplɪˈmentri/' }
    ],
    'Getting Around Town': [
      { word: 'Commute', definition: 'To travel regularly between home and work', example: 'I commute by bus every day.', pronunciation: '/kəˈmjuːt/' },
      { word: 'Fare', definition: 'The money you pay for a journey', example: 'The bus fare is two dollars.', pronunciation: '/fer/' },
      { word: 'Transfer', definition: 'To change from one bus or train to another', example: 'You need to transfer at the next stop.', pronunciation: '/trænsˈfɜːr/' },
      { word: 'Subway', definition: 'An underground railway system', example: 'Take the subway to downtown.', pronunciation: '/ˈsʌbweɪ/' },
      { word: 'Avenue', definition: 'A wide street, often with trees', example: 'The hotel is on Fifth Avenue.', pronunciation: '/ˈævənjuː/' },
      { word: 'Platform', definition: 'The raised area where passengers wait for a train', example: 'The train arrives at platform 4.', pronunciation: '/ˈplætfɔːrm/' },
      { word: 'Timetable', definition: 'A schedule of departure and arrival times', example: 'Check the timetable for the next bus.', pronunciation: '/ˈtaɪmteɪbl/' },
      { word: 'Traffic', definition: 'Vehicles moving on a road', example: 'There is heavy traffic during rush hour.', pronunciation: '/ˈtræfɪk/' },
      { word: 'Rush hour', definition: 'The time of day when traffic is heaviest', example: 'Avoid traveling during rush hour.', pronunciation: '/rʌʃ aʊər/' },
      { word: 'Boulevard', definition: 'A wide city street, often lined with trees', example: 'They walked along the boulevard.', pronunciation: '/ˈbʊləvɑːrd/' }
    ],
    'Emergency Phrases': [
      { word: 'Ambulance', definition: 'A vehicle for taking sick or injured people to hospital', example: 'Please call an ambulance!', pronunciation: '/ˈæmbjələns/' },
      { word: 'Urgent', definition: 'Requiring immediate attention', example: 'This is an urgent situation — please help!', pronunciation: '/ˈɜːrdʒənt/' },
      { word: 'Allergy', definition: 'A medical condition causing a reaction', example: 'I have a severe allergy to penicillin.', pronunciation: '/ˈælərdʒi/' },
      { word: 'Pharmacy', definition: 'A shop that sells medicines', example: 'Where is the nearest pharmacy?', pronunciation: '/ˈfɑːrməsi/' },
      { word: 'First aid', definition: 'Basic medical treatment given immediately', example: 'Does anyone know first aid?', pronunciation: '/fɜːrst eɪd/' },
      { word: 'Fire extinguisher', definition: 'A device used to put out small fires', example: 'The fire extinguisher is by the exit.', pronunciation: '/faɪər ɪkˈstɪŋɡwɪʃər/' },
      { word: 'Evacuate', definition: 'To move people from a dangerous place to safety', example: 'Please evacuate the building immediately.', pronunciation: '/ɪˈvækjueɪt/' },
      { word: 'Bleeding', definition: 'Losing blood from the body', example: 'Apply pressure to stop the bleeding.', pronunciation: '/ˈbliːdɪŋ/' },
      { word: 'Unconscious', definition: 'Not awake or aware', example: 'The patient was unconscious when the ambulance arrived.', pronunciation: '/ʌnˈkɒnʃəs/' },
      { word: 'Rescue', definition: 'To save someone from danger', example: 'The rescue team arrived within minutes.', pronunciation: '/ˈreskjuː/' }
    ],
    'Email Writing': [
      { word: 'Subject line', definition: 'A brief description of the email content', example: 'Keep the subject line clear and concise.', pronunciation: '/ˈsʌbdʒɪkt laɪn/' },
      { word: 'Compose', definition: 'To write or create a message', example: 'She composed a professional email to the client.', pronunciation: '/kəmˈpoʊz/' },
      { word: 'Attachment', definition: 'A file sent along with an email', example: 'Please find the report attached to this email.', pronunciation: '/əˈtætʃmənt/' },
      { word: 'CC', definition: 'Carbon copy — sending a copy to additional recipients', example: 'CC your manager on important client emails.', pronunciation: '/siː siː/' },
      { word: 'BCC', definition: 'Blind carbon copy — recipients cannot see each other', example: 'Use BCC when emailing a large group.', pronunciation: '/biː siː siː/' },
      { word: 'Recipient', definition: 'The person who receives the email', example: 'Double-check the recipient before sending.', pronunciation: '/rɪˈsɪpiənt/' },
      { word: 'Salutation', definition: 'The greeting at the beginning of an email', example: 'A formal salutation like "Dear Mr. Smith" is appropriate.', pronunciation: '/ˌsæljuˈteɪʃn/' },
      { word: 'Sign off', definition: 'The closing remark at the end of an email', example: 'End with a professional sign off like "Best regards."', pronunciation: '/saɪn ɒf/' },
      { word: 'Forward', definition: 'To send an email you received to another person', example: 'I will forward you the email from the client.', pronunciation: '/ˈfɔːrwərd/' },
      { word: 'Draft', definition: 'A preliminary version of an email not yet sent', example: 'Save your email as a draft to review later.', pronunciation: '/dræft/' }
    ],
    'Meeting Vocabulary': [
      { word: 'Agenda', definition: 'A list of topics to be discussed at a meeting', example: 'Please review the agenda before the meeting.', pronunciation: '/əˈdʒendə/' },
      { word: 'Minutes', definition: 'A written record of what was discussed in a meeting', example: 'Sarah will take the minutes of today\'s meeting.', pronunciation: '/ˈmɪnɪts/' },
      { word: 'Chairperson', definition: 'The person who leads a meeting', example: 'The chairperson called the meeting to order.', pronunciation: '/ˈtʃerpɜːrsn/' },
      { word: 'Consensus', definition: 'General agreement among a group', example: 'We reached a consensus on the new policy.', pronunciation: '/kənˈsensəs/' },
      { word: 'Adjourn', definition: 'To end a meeting', example: 'The meeting was adjourned until next Tuesday.', pronunciation: '/əˈdʒɜːrn/' },
      { word: 'Facilitate', definition: 'To make a process easier or help it happen', example: 'The manager facilitated the discussion between teams.', pronunciation: '/fəˈsɪlɪteɪt/' },
      { word: 'Brainstorm', definition: 'To generate ideas through group discussion', example: 'Let us brainstorm solutions to this problem.', pronunciation: '/ˈbreɪnstɔːrm/' },
      { word: 'Delegate', definition: 'To assign a task to someone else', example: 'She delegated the research task to her assistant.', pronunciation: '/ˈdelɪɡeɪt/' },
      { word: 'Quorum', definition: 'The minimum number of members needed to hold a meeting', example: 'We do not have a quorum, so we cannot vote.', pronunciation: '/ˈkwɔːrəm/' },
      { word: 'Follow-up', definition: 'A subsequent action taken after a meeting', example: 'I will send a follow-up email with the action items.', pronunciation: '/ˈfɒloʊ ʌp/' }
    ],
    'Phone Etiquette': [
      { word: 'Greeting', definition: 'A polite opening when answering a call', example: 'A professional greeting includes your name and company.', pronunciation: '/ˈɡriːtɪŋ/' },
      { word: 'Hold', definition: 'To wait on the phone while being transferred', example: 'Please hold while I connect you to the right department.', pronunciation: '/hoʊld/' },
      { word: 'Transfer', definition: 'To redirect a call to another person or department', example: 'I will transfer you to customer service.', pronunciation: '/trænsˈfɜːr/' },
      { word: 'Voicemail', definition: 'A recorded message when someone cannot answer', example: 'I left a voicemail explaining the situation.', pronunciation: '/ˈvɔɪsmeɪl/' },
      { word: 'Callback', definition: 'A return phone call to someone who contacted you', example: 'I will request a callback from the manager.', pronunciation: '/ˈkɔːlbæk/' },
      { word: 'Mute', definition: 'To temporarily turn off the microphone on a call', example: 'Please mute your phone during the presentation.', pronunciation: '/mjuːt/' },
      { word: 'Dial', definition: 'To enter a phone number to make a call', example: 'Dial extension 205 to reach the sales team.', pronunciation: '/daɪəl/' },
      { word: 'Speakerphone', definition: 'A phone feature that allows hands-free conversation', example: 'Please do not use speakerphone in shared spaces.', pronunciation: '/ˈspiːkərfoʊn/' },
      { word: 'Conference call', definition: 'A phone call with more than two participants', example: 'The conference call includes team members from three offices.', pronunciation: '/ˈkɒnfərəns kɔːl/' },
      { word: 'Etiquette', definition: 'The customary rules of polite behavior', example: 'Good phone etiquette means identifying yourself when calling.', pronunciation: '/ˈetɪket/' }
    ],
    'Presentation Skills': [
      { word: 'Slide', definition: 'A single page in a presentation', example: 'Keep each slide focused on one main idea.', pronunciation: '/slaɪd/' },
      { word: 'Visual aid', definition: 'A tool like a chart or image that supports a presentation', example: 'Use visual aids to make your points clearer.', pronunciation: '/ˈvɪʒuəl eɪd/' },
      { word: 'Engage', definition: 'To capture and hold the audience\'s attention', example: 'Ask questions to engage your audience.', pronunciation: '/ɪnˈɡeɪdʒ/' },
      { word: 'Body language', definition: 'Nonverbal signals through posture and gestures', example: 'Positive body language makes you appear confident.', pronunciation: '/ˈbɒdi ˈlæŋɡwɪdʒ/' },
      { word: 'Keynote', definition: 'The main speech at an event', example: 'She delivered the keynote address at the conference.', pronunciation: '/ˈkiːnoʊt/' },
      { word: 'Q&A', definition: 'Question and answer session', example: 'We will have a ten-minute Q&A at the end.', pronunciation: '/kjuː ænd eɪ/' },
      { word: 'Outline', definition: 'A brief summary of the main points', example: 'Start your presentation with a clear outline.', pronunciation: '/ˈaʊtlaɪn/' },
      { word: 'Transition', definition: 'A smooth movement from one topic to the next', example: 'Use clear transitions between sections of your talk.', pronunciation: '/trænˈzɪʃn/' },
      { word: 'Audience', definition: 'The people watching or listening to a presentation', example: 'Know your audience before planning the presentation.', pronunciation: '/ˈɔːdiəns/' },
      { word: 'Rehearse', definition: 'To practice a presentation before delivering it', example: 'Rehearse your speech at least three times.', pronunciation: '/rɪˈhɜːrs/' }
    ],
    'Networking': [
      { word: 'Connection', definition: 'A professional relationship or contact', example: 'She made valuable connections at the conference.', pronunciation: '/kəˈnekʃn/' },
      { word: 'Icebreaker', definition: 'An activity or remark that starts a conversation', example: 'A good icebreaker makes people feel comfortable.', pronunciation: '/ˈaɪsbreɪkər/' },
      { word: 'Contact', definition: 'A person you know who may be professionally useful', example: 'He is an important contact in the industry.', pronunciation: '/ˈkɒntækt/' },
      { word: 'Referral', definition: 'A recommendation of a person or business', example: 'I got this job through a referral from a colleague.', pronunciation: '/rɪˈfɜːrəl/' },
      { word: 'Rapport', definition: 'A harmonious and trusting relationship', example: 'Building rapport is essential for successful networking.', pronunciation: '/ræˈpɔːr/' },
      { word: 'Mentor', definition: 'An experienced person who advises a less experienced one', example: 'My mentor helped me navigate my career path.', pronunciation: '/ˈmentɔːr/' },
      { word: 'Elevator pitch', definition: 'A brief, persuasive summary of yourself or your idea', example: 'Prepare a 30-second elevator pitch for networking events.', pronunciation: '/ˈelɪveɪtər pɪtʃ/' },
      { word: 'Follow up', definition: 'To contact someone after an initial meeting', example: 'Always follow up within 24 hours of meeting someone.', pronunciation: '/ˈfɒloʊ ʌp/' },
      { word: 'Business card', definition: 'A card with your professional contact information', example: 'Bring plenty of business cards to the event.', pronunciation: '/ˈbɪznəs kɑːrd/' },
      { word: 'Alumni', definition: 'Graduates of a school or university', example: 'The alumni network is a great resource for job seekers.', pronunciation: '/əˈlʌmnaɪ/' }
    ],
    'Essay Structure': [
      { word: 'Introduction', definition: 'The opening paragraph that presents the topic', example: 'The introduction should capture the reader\'s attention.', pronunciation: '/ˌɪntrəˈdʌkʃn/' },
      { word: 'Thesis statement', definition: 'A sentence that states the main argument of an essay', example: 'Your thesis statement should be clear and specific.', pronunciation: '/ˈθiːsɪs ˈsteɪtmənt/' },
      { word: 'Body paragraph', definition: 'A paragraph that develops a main point with evidence', example: 'Each body paragraph should focus on one idea.', pronunciation: '/ˈbɒdi ˈpærəɡræf/' },
      { word: 'Conclusion', definition: 'The final paragraph that summarizes the argument', example: 'The conclusion should not introduce new information.', pronunciation: '/kənˈkluːʒn/' },
      { word: 'Transition', definition: 'A word or phrase connecting ideas between paragraphs', example: 'Use transitions like "furthermore" to link paragraphs.', pronunciation: '/trænˈzɪʃn/' },
      { word: 'Outline', definition: 'A structured plan of an essay before writing', example: 'Creating an outline saves time when writing.', pronunciation: '/ˈaʊtlaɪn/' },
      { word: 'Draft', definition: 'A preliminary version of an essay', example: 'Write a first draft and then revise it.', pronunciation: '/dræft/' },
      { word: 'Evidence', definition: 'Facts or information supporting a claim', example: 'Back up your arguments with strong evidence.', pronunciation: '/ˈevɪdəns/' },
      { word: 'Counterargument', definition: 'An opposing viewpoint addressed in an essay', example: 'Acknowledging a counterargument strengthens your position.', pronunciation: '/ˌkaʊntərˈɑːrɡjumənt/' },
      { word: 'Cohesion', definition: 'The logical flow and connection of ideas in writing', example: 'Good cohesion makes an essay easy to follow.', pronunciation: '/koʊˈhiːʒn/' }
    ],
    'Research Vocabulary': [
      { word: 'Hypothesis', definition: 'A proposed explanation to be tested', example: 'The hypothesis was supported by the experimental data.', pronunciation: '/haɪˈpɒθəsɪs/' },
      { word: 'Methodology', definition: 'The system of methods used in research', example: 'The methodology section explains how the study was conducted.', pronunciation: '/ˌmeθəˈdɒlədʒi/' },
      { word: 'Data', definition: 'Facts and statistics collected for analysis', example: 'The data was collected through surveys and interviews.', pronunciation: '/ˈdeɪtə/' },
      { word: 'Variable', definition: 'A factor that can change in an experiment', example: 'Temperature was the independent variable in the study.', pronunciation: '/ˈveriəbl/' },
      { word: 'Literature review', definition: 'A survey of existing research on a topic', example: 'The literature review covers studies from the past decade.', pronunciation: '/ˈlɪtrətʃər rɪˈvjuː/' },
      { word: 'Qualitative', definition: 'Relating to qualities that cannot be measured numerically', example: 'Qualitative research uses interviews and observations.', pronunciation: '/ˈkwɒlɪteɪtɪv/' },
      { word: 'Quantitative', definition: 'Relating to measurable numerical data', example: 'Quantitative analysis revealed a significant trend.', pronunciation: '/ˈkwɒntɪteɪtɪv/' },
      { word: 'Sample', definition: 'A group selected from a larger population for study', example: 'The sample included 500 participants from three cities.', pronunciation: '/ˈsæmpl/' },
      { word: 'Peer-reviewed', definition: 'Evaluated by experts in the same field before publication', example: 'Always cite peer-reviewed sources in academic writing.', pronunciation: '/pɪr rɪˈvjuːd/' },
      { word: 'Findings', definition: 'The results or conclusions of a study', example: 'The findings suggest a link between diet and health.', pronunciation: '/ˈfaɪndɪŋz/' }
    ],
    'Citation & Referencing': [
      { word: 'Cite', definition: 'To refer to a source of information in academic writing', example: 'You must cite all sources used in your essay.', pronunciation: '/saɪt/' },
      { word: 'Bibliography', definition: 'A list of all sources referenced in a document', example: 'The bibliography appears at the end of the paper.', pronunciation: '/ˌbɪbliˈɒɡrəfi/' },
      { word: 'Plagiarism', definition: 'Using someone else\'s work without giving them credit', example: 'Plagiarism is a serious academic offense.', pronunciation: '/ˈpleɪdʒərɪzəm/' },
      { word: 'Paraphrase', definition: 'To express someone else\'s ideas in your own words', example: 'Paraphrase the source material and cite it correctly.', pronunciation: '/ˈpærəfreɪz/' },
      { word: 'Reference', definition: 'A mention of a source of information', example: 'Include a full reference for every citation.', pronunciation: '/ˈrefərəns/' },
      { word: 'In-text citation', definition: 'A brief reference within the body of a text', example: 'Use in-text citations to show where ideas come from.', pronunciation: '/ɪn tekst saɪˈteɪʃn/' },
      { word: 'Footnote', definition: 'A note at the bottom of a page providing additional information', example: 'Add a footnote to explain the technical term.', pronunciation: '/ˈfʊtnoʊt/' },
      { word: 'Quotation', definition: 'A group of words taken directly from a text or speech', example: 'Use quotation marks when including a direct quotation.', pronunciation: '/kwoʊˈteɪʃn/' },
      { word: 'APA', definition: 'American Psychological Association — a common citation style', example: 'The professor requires APA format for all papers.', pronunciation: '/ˌeɪ piː eɪ/' },
      { word: 'Attribution', definition: 'The act of crediting a source for information used', example: 'Proper attribution ensures academic integrity.', pronunciation: '/ˌætrɪˈbjuːʃn/' }
    ],
    'Academic Discussions': [
      { word: 'Debate', definition: 'A formal discussion with opposing viewpoints', example: 'The debate covered both sides of the environmental issue.', pronunciation: '/dɪˈbeɪt/' },
      { word: 'Argument', definition: 'A reasoned case for or against something', example: 'She presented a strong argument in favor of the proposal.', pronunciation: '/ˈɑːrɡjumənt/' },
      { word: 'Perspective', definition: 'A particular point of view', example: 'The article offers a fresh perspective on the topic.', pronunciation: '/pərˈspektɪv/' },
      { word: 'Substantiate', definition: 'To provide evidence to support a claim', example: 'You need to substantiate your claims with data.', pronunciation: '/səbˈstænʃieɪt/' },
      { word: 'Concede', definition: 'To admit that something is true', example: 'I concede that there are valid concerns on both sides.', pronunciation: '/kənˈsiːd/' },
      { word: 'Counterpoint', definition: 'An opposing point in a discussion', example: 'The counterpoint to this argument is the cost involved.', pronunciation: '/ˈkaʊntərpɔɪnt/' },
      { word: 'Nuance', definition: 'A subtle difference in meaning or opinion', example: 'There are important nuances in the way different cultures view this.', pronunciation: '/ˈnjuːɑːns/' },
      { word: 'Synthesize', definition: 'To combine ideas from different sources', example: 'The essay synthesizes research from multiple disciplines.', pronunciation: '/ˈsɪnθəsaɪz/' },
      { word: 'Dialectic', definition: 'The art of investigating through discussion and reasoning', example: 'The dialectic method encourages questioning assumptions.', pronunciation: '/ˌdaɪəˈlektɪk/' },
      { word: 'Discourse', definition: 'Formal discussion or written communication on a subject', example: 'Academic discourse requires precise language.', pronunciation: '/ˈdɪskɔːrs/' }
    ],
    'Critical Thinking': [
      { word: 'Analyze', definition: 'To examine something in detail to understand it', example: 'Analyze the argument to identify its strengths and weaknesses.', pronunciation: '/ˈænəlaɪz/' },
      { word: 'Evaluate', definition: 'To judge the quality or importance of something', example: 'Evaluate the evidence before reaching a conclusion.', pronunciation: '/ɪˈvæljueɪt/' },
      { word: 'Inference', definition: 'A conclusion drawn from evidence and reasoning', example: 'What inference can you draw from these results?', pronunciation: '/ˈɪnfərəns/' },
      { word: 'Assumption', definition: 'Something accepted as true without proof', example: 'Identify the assumptions underlying the argument.', pronunciation: '/əˈsʌmpʃn/' },
      { word: 'Bias', definition: 'A preference or prejudice that affects judgment', example: 'Be aware of bias in media reporting.', pronunciation: '/ˈbaɪəs/' },
      { word: 'Logic', definition: 'Reasoning conducted according to strict principles', example: 'The argument lacks sound logic.', pronunciation: '/ˈlɒdʒɪk/' },
      { word: 'Skepticism', definition: 'A questioning attitude toward claims', example: 'Healthy skepticism helps you avoid accepting false information.', pronunciation: '/ˈskeptɪsɪzəm/' },
      { word: 'Scrutinize', definition: 'To examine something very carefully', example: 'Scrutinize the data for any inconsistencies.', pronunciation: '/ˈskruːtɪnaɪz/' },
      { word: 'Corroboration', definition: 'Evidence that supports or confirms something', example: 'The witness provided corroboration of the event.', pronunciation: '/kəˌrɒbəˈreɪʃn/' },
      { word: 'Fallacy', definition: 'A mistaken belief based on unsound argument', example: 'The ad hominem fallacy attacks the person, not the argument.', pronunciation: '/ˈfæləsi/' }
    ],
    'Present Perfect': [
      { word: 'Past participle', definition: 'The form of a verb used with have/has/had', example: 'The past participle of "go" is "gone."', pronunciation: '/pæst ˈpɑːrtɪsɪpl/' },
      { word: 'Experience', definition: 'Knowledge gained from doing something', example: 'I have visited Paris three times. (life experience)', pronunciation: '/ɪkˈspɪriəns/' },
      { word: 'Duration', definition: 'The length of time something lasts', example: 'I have lived here for ten years. (duration)', pronunciation: '/djʊˈreɪʃn/' },
      { word: 'Recent', definition: 'Happening a short time ago', example: 'She has just finished her homework. (recent action)', pronunciation: '/ˈriːsnt/' },
      { word: 'Unfinished', definition: 'Not yet completed', example: 'The present perfect connects past to present for unfinished time.', pronunciation: '/ʌnˈfɪnɪʃt/' },
      { word: 'Since', definition: 'From a particular time in the past until now', example: 'I have worked here since 2018.', pronunciation: '/sɪns/' },
      { word: 'For', definition: 'During a period of time', example: 'She has studied English for five years.', pronunciation: '/fɔːr/' },
      { word: 'Already', definition: 'Before the expected time', example: 'They have already left the building.', pronunciation: '/ɔːlˈredi/' },
      { word: 'Yet', definition: 'Up to the present moment (in negatives and questions)', example: 'Have you finished the report yet?', pronunciation: '/jet/' },
      { word: 'Ever', definition: 'At any time (used in questions)', example: 'Have you ever been to Japan?', pronunciation: '/ˈevər/' }
    ],
    'Conditionals': [
      { word: 'If clause', definition: 'The part of a conditional sentence containing "if"', example: 'The if clause states the condition.', pronunciation: '/ɪf klɔːz/' },
      { word: 'Result clause', definition: 'The part expressing what happens if the condition is met', example: 'The result clause states the consequence.', pronunciation: '/rɪˈzʌlt klɔːz/' },
      { word: 'Hypothetical', definition: 'Based on an imagined situation', example: 'Second conditionals describe hypothetical situations.', pronunciation: '/ˌhaɪpəˈθetɪkl/' },
      { word: 'Real condition', definition: 'A possible or likely situation', example: 'First conditionals deal with real conditions.', pronunciation: '/riːl kənˈdɪʃn/' },
      { word: 'Unreal condition', definition: 'An imaginary or impossible situation', example: 'Third conditionals describe unreal conditions in the past.', pronunciation: '/ʌnˈriːl kənˈdɪʃn/' },
      { word: 'Unless', definition: 'If not; except if', example: 'I will not go unless you come with me.', pronunciation: '/ənˈles/' },
      { word: 'Provided', definition: 'On the condition that', example: 'You can borrow the car provided you drive carefully.', pronunciation: '/prəˈvaɪdɪd/' },
      { word: 'Otherwise', definition: 'In different circumstances; or else', example: 'Hurry up, otherwise we will miss the train.', pronunciation: '/ˈʌðərwaɪz/' },
      { word: 'Suppose', definition: 'To assume or imagine', example: 'Suppose you won the lottery — what would you do?', pronunciation: '/səˈpoʊz/' },
      { word: 'Consequence', definition: 'A result or effect of an action', example: 'Every conditional has a condition and a consequence.', pronunciation: '/ˈkɒnsɪkwens/' }
    ],
    'Passive Voice': [
      { word: 'Agent', definition: 'The person or thing performing the action in a passive sentence', example: 'In "The cake was eaten by John," John is the agent.', pronunciation: '/ˈeɪdʒənt/' },
      { word: 'Recipient', definition: 'The entity receiving the action', example: 'In passive voice, the recipient becomes the subject.', pronunciation: '/rɪˈsɪpiənt/' },
      { word: 'Impersonal', definition: 'Not referring to a specific person', example: 'The passive is often used for an impersonal tone.', pronunciation: '/ɪmˈpɜːrsənl/' },
      { word: 'Formal tone', definition: 'A serious and professional style of communication', example: 'The passive voice creates a more formal tone.', pronunciation: '/ˈfɔːrməl toʊn/' },
      { word: 'By phrase', definition: 'The phrase starting with "by" that identifies the agent', example: 'The report was written by the research team.', pronunciation: '/baɪ freɪz/' },
      { word: 'Transform', definition: 'To change the structure of a sentence', example: 'You can transform active sentences into passive ones.', pronunciation: '/trænsˈfɔːrm/' },
      { word: 'Omit', definition: 'To leave out or not include', example: 'The agent is often omitted in passive sentences.', pronunciation: '/oʊˈmɪt/' },
      { word: 'Emphasis', definition: 'Special importance given to something', example: 'Use the passive to shift emphasis to the action.', pronunciation: '/ˈemfəsɪs/' },
      { word: 'Construction', definition: 'The way in which something is built or formed', example: 'The passive construction uses a form of "be" plus the past participle.', pronunciation: '/kənˈstrʌkʃn/' },
      { word: 'Objective', definition: 'Not influenced by personal feelings', example: 'Passive voice sounds more objective and scientific.', pronunciation: '/əbˈdʒektɪv/' }
    ],
    'Reported Speech': [
      { word: 'Reporting verb', definition: 'A verb used to introduce reported speech (said, told, asked)', example: '"She said that" uses "said" as the reporting verb.', pronunciation: '/rɪˈpɔːrtɪŋ vɜːrb/' },
      { word: 'Backshift', definition: 'Moving a tense one step back in reported speech', example: 'In reported speech, "I am happy" becomes "She said she was happy."', pronunciation: '/ˈbækʃɪft/' },
      { word: 'Indirect question', definition: 'A question reported without the exact words', example: 'He asked where the station was.', pronunciation: '/ˌɪndɪˈrekt ˈkwestʃən/' },
      { word: 'Direct speech', definition: 'The exact words spoken, enclosed in quotation marks', example: '"I am tired" is direct speech.', pronunciation: '/dɪˈrekt spiːtʃ/' },
      { word: 'Indirect speech', definition: 'Speech reported without using the exact words', example: 'She said she was tired is indirect speech.', pronunciation: '/ˌɪndɪˈrekt spiːtʃ/' },
      { word: 'Pronoun shift', definition: 'Changing pronouns to match the perspective of the reporter', example: '"I" becomes "she" in reported speech when reporting someone else.', pronunciation: '/ˈproʊnaʊn ʃɪft/' },
      { word: 'Statement', definition: 'A definite expression of something', example: 'Report the statement: "I like coffee" → He said he liked coffee.', pronunciation: '/ˈsteɪtmənt/' },
      { word: 'Command', definition: 'An order given to someone', example: '"Close the door" reported: She told me to close the door.', pronunciation: '/kəˈmænd/' },
      { word: 'Time reference', definition: 'Words indicating when something happens', example: '"Today" becomes "that day" in reported speech.', pronunciation: '/taɪm ˈrefərəns/' },
      { word: 'Conjunction', definition: 'A word connecting clauses (that, if, whether)', example: 'Use "that" to connect the reporting clause to reported speech.', pronunciation: '/kənˈdʒʌŋkʃn/' }
    ],
    'Relative Clauses': [
      { word: 'Relative pronoun', definition: 'A pronoun introducing a relative clause (who, which, that)', example: '"Who" is a relative pronoun for people.', pronunciation: '/ˈrelətɪv ˈproʊnaʊn/' },
      { word: 'Defining clause', definition: 'A clause essential to the meaning of the sentence', example: 'The man who called is my uncle. (defining)', pronunciation: '/dɪˈfaɪnɪŋ klɔːz/' },
      { word: 'Non-defining clause', definition: 'A clause adding extra information, set off by commas', example: 'My brother, who lives in Paris, is a chef. (non-defining)', pronunciation: '/nɒn dɪˈfaɪnɪŋ klɔːz/' },
      { word: 'Antecedent', definition: 'The noun that a relative clause describes', example: 'In "The book that I read," "book" is the antecedent.', pronunciation: '/ˌæntɪˈsiːdnt/' },
      { word: 'Modify', definition: 'To describe or limit the meaning of a noun', example: 'Relative clauses modify nouns by adding information.', pronunciation: '/ˈmɒdɪfaɪ/' },
      { word: 'Whom', definition: 'A relative pronoun used as the object of a verb or preposition', example: 'The person whom I met was very kind.', pronunciation: '/huːm/' },
      { word: 'Whose', definition: 'A relative pronoun showing possession', example: 'The student whose essay won the prize is very talented.', pronunciation: '/huːz/' },
      { word: 'Omit', definition: 'To leave out a relative pronoun when it is the object', example: 'You can omit "that" when it is the object of the clause.', pronunciation: '/oʊˈmɪt/' },
      { word: 'Embedded', definition: 'Contained within another clause', example: 'Relative clauses are embedded within main clauses.', pronunciation: '/ɪmˈbedɪd/' },
      { word: 'Restrictive', definition: 'Limiting the meaning of the noun it modifies', example: 'A restrictive clause cannot be removed without changing the meaning.', pronunciation: '/rɪˈstrɪktɪv/' }
    ],
    'Cultural Differences': [
      { word: 'Diversity', definition: 'The range of different cultures and backgrounds', example: 'Cultural diversity enriches our community.', pronunciation: '/daɪˈvɜːrsəti/' },
      { word: 'Norm', definition: 'A standard of behavior typical of a society', example: 'Social norms vary from country to country.', pronunciation: '/nɔːrm/' },
      { word: 'Etiquette', definition: 'Customary rules of polite behavior in society', example: 'Business etiquette differs across cultures.', pronunciation: '/ˈetɪket/' },
      { word: 'Taboo', definition: 'A social or cultural prohibition', example: 'Discussing salary is a taboo in some cultures.', pronunciation: '/təˈbuː/' },
      { word: 'Assimilation', definition: 'The process of adopting the culture of a new group', example: 'Immigration often involves some degree of assimilation.', pronunciation: '/əˌsɪməˈleɪʃn/' },
      { word: 'Stereotype', definition: 'A fixed general image of a particular type of person', example: 'It is important to challenge cultural stereotypes.', pronunciation: '/ˈsteriətaɪp/' },
      { word: 'Custom', definition: 'A traditional practice of a society', example: 'Removing shoes before entering a home is a custom in Japan.', pronunciation: '/ˈkʌstəm/' },
      { word: 'Heritage', definition: 'Traditions and monuments passed down through generations', example: 'The building is part of our cultural heritage.', pronunciation: '/ˈherɪtɪdʒ/' },
      { word: 'Multicultural', definition: 'Including several different cultures', example: 'London is a multicultural city.', pronunciation: '/ˌmʌltiˈkʌltʃərəl/' },
      { word: 'Sensitivity', definition: 'Awareness and understanding of others\' feelings and cultures', example: 'Cultural sensitivity is essential in international business.', pronunciation: '/ˌsensəˈtɪvəti/' }
    ],
    'Social Issues': [
      { word: 'Inequality', definition: 'An unfair situation where some have more opportunities than others', example: 'Income inequality has increased in recent decades.', pronunciation: '/ˌɪnɪˈkwɒləti/' },
      { word: 'Discrimination', definition: 'Unfair treatment based on race, gender, or other factors', example: 'Laws exist to prevent discrimination in the workplace.', pronunciation: '/dɪˌskrɪmɪˈneɪʃn/' },
      { word: 'Poverty', definition: 'The state of being extremely poor', example: 'Efforts to reduce poverty are a global priority.', pronunciation: '/ˈpɒvərti/' },
      { word: 'Activism', definition: 'The use of direct action to achieve political or social change', example: 'Environmental activism has grown among young people.', pronunciation: '/ˈæktɪvɪzəm/' },
      { word: 'Refugee', definition: 'A person who has been forced to leave their country', example: 'The charity provides support for refugees.', pronunciation: '/ˌrefjʊˈdʒiː/' },
      { word: 'Advocacy', definition: 'Public support for a cause or policy', example: 'Her advocacy for education reform inspired many.', pronunciation: '/ˈædvəkəsi/' },
      { word: 'Prejudice', definition: 'A preconceived opinion not based on reason or experience', example: 'Education is key to reducing prejudice.', pronunciation: '/ˈpredʒʊdɪs/' },
      { word: 'Welfare', definition: 'Government support for people in need', example: 'The welfare system provides assistance to low-income families.', pronunciation: '/ˈwelfer/' },
      { word: 'Empowerment', definition: 'The process of becoming stronger and more confident', example: 'Education is a tool for empowerment.', pronunciation: '/ɪmˈpaʊərmənt/' },
      { word: 'Justice', definition: 'Fairness in the way people are treated', example: 'Social justice requires equal opportunities for all.', pronunciation: '/ˈdʒʌstɪs/' }
    ],
    'Media Literacy': [
      { word: 'Credibility', definition: 'The quality of being trusted and believed', example: 'Check the credibility of the source before sharing news.', pronunciation: '/ˌkredəˈbɪləti/' },
      { word: 'Propaganda', definition: 'Information used to promote a political cause, often biased', example: 'Learn to identify propaganda in media messages.', pronunciation: '/ˌprɒpəˈɡændə/' },
      { word: 'Fact-check', definition: 'To verify the accuracy of information', example: 'Always fact-check claims before believing them.', pronunciation: '/fækt tʃek/' },
      { word: 'Bias', definition: 'A tendency to favor one side over another', example: 'Media bias can influence public opinion.', pronunciation: '/ˈbaɪəs/' },
      { word: 'Headline', definition: 'A heading at the top of an article', example: 'Headlines are designed to grab attention.', pronunciation: '/ˈhedlaɪn/' },
      { word: 'Editorial', definition: 'An article expressing the opinion of the publisher', example: 'The editorial criticized the government\'s new policy.', pronunciation: '/ˌedɪˈtɔːriəl/' },
      { word: 'Misinformation', definition: 'False or inaccurate information spread unintentionally', example: 'Misinformation spreads quickly on social media.', pronunciation: '/ˌmɪsɪnfərˈmeɪʃn/' },
      { word: 'Disinformation', definition: 'False information spread deliberately to deceive', example: 'Disinformation campaigns aim to manipulate public opinion.', pronunciation: '/ˌdɪsɪnfərˈmeɪʃn/' },
      { word: 'Source', definition: 'The origin of information', example: 'Evaluate the source before accepting a claim.', pronunciation: '/sɔːrs/' },
      { word: 'Clickbait', definition: 'Content designed to attract clicks, often misleading', example: 'The headline was clickbait — the article was unrelated.', pronunciation: '/ˈklɪkbeɪt/' }
    ],
    'Idioms & Expressions': [
      { word: 'Break the ice', definition: 'To start a conversation in a social situation', example: 'He told a joke to break the ice at the party.', pronunciation: '/breɪk ðə aɪs/' },
      { word: 'Piece of cake', definition: 'Something very easy to do', example: 'The exam was a piece of cake.', pronunciation: '/piːs ɒv keɪk/' },
      { word: 'Under the weather', definition: 'Feeling ill', example: 'I am feeling a bit under the weather today.', pronunciation: '/ˈʌndər ðə ˈweðər/' },
      { word: 'Hit the nail on the head', definition: 'To describe exactly what is causing a situation', example: 'You hit the nail on the head with that analysis.', pronunciation: '/hɪt ðə neɪl ɒn ðə hed/' },
      { word: 'Cost an arm and a leg', definition: 'To be very expensive', example: 'That luxury car must have cost an arm and a leg.', pronunciation: '/kɒst ən ɑːrm ænd ə leɡ/' },
      { word: 'Bite the bullet', definition: 'To endure a painful situation that is unavoidable', example: 'I decided to bite the bullet and pay for the repairs.', pronunciation: '/baɪt ðə ˈbʊlɪt/' },
      { word: 'Spill the beans', definition: 'To reveal a secret', example: 'She spilled the beans about the surprise party.', pronunciation: '/spɪl ðə biːnz/' },
      { word: 'Once in a blue moon', definition: 'Very rarely', example: 'I eat fast food once in a blue moon.', pronunciation: '/wʌns ɪn ə bluː muːn/' },
      { word: 'The ball is in your court', definition: 'It is your decision or responsibility now', example: 'I have made my offer — the ball is in your court.', pronunciation: '/ðə bɔːl ɪz ɪn jɔːr kɔːrt/' },
      { word: 'On thin ice', definition: 'In a risky or precarious situation', example: 'You are on thin ice if you arrive late again.', pronunciation: '/ɒn θɪn aɪs/' }
    ],
    'British vs American English': [
      { word: 'Lorry', definition: 'British English for "truck"', example: 'A lorry overturned on the motorway.', pronunciation: '/ˈlɒri/' },
      { word: 'Flat', definition: 'British English for "apartment"', example: 'They live in a small flat in London.', pronunciation: '/flæt/' },
      { word: 'Elevator', definition: 'American English for "lift"', example: 'Take the elevator to the fifth floor.', pronunciation: '/ˈelɪveɪtər/' },
      { word: 'Biscuit', definition: 'British English for "cookie"', example: 'Would you like a biscuit with your tea?', pronunciation: '/ˈbɪskɪt/' },
      { word: 'Sneakers', definition: 'American English for "trainers"', example: 'I bought a new pair of sneakers for the gym.', pronunciation: '/ˈsniːkərz/' },
      { word: 'Vacation', definition: 'American English for "holiday"', example: 'We are going on vacation to Florida.', pronunciation: '/veɪˈkeɪʃn/' },
      { word: 'Chips', definition: 'British English for "french fries"', example: 'Fish and chips is a classic British meal.', pronunciation: '/tʃɪps/' },
      { word: 'Pants', definition: 'American English for "trousers" (British: underwear)', example: 'In American English, pants means trousers.', pronunciation: '/pænts/' },
      { word: 'Diaper', definition: 'American English for "nappy"', example: 'The baby needs a fresh diaper.', pronunciation: '/ˈdaɪpər/' },
      { word: 'Spelling difference', definition: 'Variations in how words are spelled between the two varieties', example: 'Colour (British) vs. Color (American) is a spelling difference.', pronunciation: '/ˈspelɪŋ ˈdɪfrəns/' }
    ],
    'Tech Vocabulary': [
      { word: 'Algorithm', definition: 'A set of rules for solving a problem in computing', example: 'The search algorithm determines which results appear first.', pronunciation: '/ˈælɡərɪðəm/' },
      { word: 'Bandwidth', definition: 'The capacity of a network to transfer data', example: 'High bandwidth allows faster streaming.', pronunciation: '/ˈbændwɪdθ/' },
      { word: 'Cloud computing', definition: 'Using remote servers on the internet to store data', example: 'Many companies now use cloud computing for data storage.', pronunciation: '/klaʊd kəmˈpjuːtɪŋ/' },
      { word: 'Encryption', definition: 'Converting data into a code to prevent unauthorized access', example: 'End-to-end encryption protects your messages.', pronunciation: '/ɪnˈkrɪpʃn/' },
      { word: 'Interface', definition: 'A point where a user interacts with a system', example: 'The app has a user-friendly interface.', pronunciation: '/ˈɪntərfeɪs/' },
      { word: 'Firewall', definition: 'A security system that controls network traffic', example: 'The firewall blocked the unauthorized access attempt.', pronunciation: '/ˈfaɪərwɔːl/' },
      { word: 'Debug', definition: 'To find and fix errors in software', example: 'The developers need to debug the application before release.', pronunciation: '/diːˈbʌɡ/' },
      { word: 'Open source', definition: 'Software with code that anyone can view and modify', example: 'Linux is a popular open source operating system.', pronunciation: '/ˈoʊpən sɔːrs/' },
      { word: 'Prototype', definition: 'An early version of a product for testing', example: 'The team built a prototype to test the concept.', pronunciation: '/ˈproʊtətaɪp/' },
      { word: 'Compatible', definition: 'Able to work together with other systems', example: 'Is this software compatible with your operating system?', pronunciation: '/kəmˈpætəbl/' }
    ],
    'Digital Literacy': [
      { word: 'Digital footprint', definition: 'The trail of data you leave when using the internet', example: 'Be mindful of your digital footprint on social media.', pronunciation: '/ˈdɪdʒɪtl ˈfʊtprɪnt/' },
      { word: 'Phishing', definition: 'Fraudulent attempts to obtain sensitive information online', example: 'The email was a phishing scam trying to steal passwords.', pronunciation: '/ˈfɪʃɪŋ/' },
      { word: 'Cookie', definition: 'A small data file stored by a website on your device', example: 'Websites use cookies to remember your preferences.', pronunciation: '/ˈkʊki/' },
      { word: 'Browser', definition: 'A program for accessing websites', example: 'Chrome and Firefox are popular web browsers.', pronunciation: '/ˈbraʊzər/' },
      { word: 'Download', definition: 'To transfer data from the internet to your device', example: 'You can download the app from the official website.', pronunciation: '/ˈdaʊnloʊd/' },
      { word: 'Upload', definition: 'To transfer data from your device to the internet', example: 'Upload your assignment through the learning portal.', pronunciation: '/ˈʌploʊd/' },
      { word: 'Malware', definition: 'Software designed to damage or gain access to a computer', example: 'Install antivirus software to protect against malware.', pronunciation: '/ˈmælwer/' },
      { word: 'VPN', definition: 'Virtual Private Network — a secure connection over the internet', example: 'Use a VPN when connecting to public Wi-Fi.', pronunciation: '/viː piː en/' },
      { word: 'Two-factor authentication', definition: 'An extra layer of security requiring two forms of verification', example: 'Enable two-factor authentication for your email account.', pronunciation: '/tuː ˈfæktər ɔːˌθentɪˈkeɪʃn/' },
      { word: 'Cache', definition: 'Temporary storage of data for faster access', example: 'Clear your browser cache to fix loading issues.', pronunciation: '/kæʃ/' }
    ],
    'AI & the Future': [
      { word: 'Artificial intelligence', definition: 'Computer systems that simulate human intelligence', example: 'AI is transforming many industries around the world.', pronunciation: '/ˌɑːrtɪfɪʃl ɪnˈtelɪdʒəns/' },
      { word: 'Machine learning', definition: 'AI systems that improve through experience', example: 'Machine learning algorithms get better with more data.', pronunciation: '/məˈʃiːn ˈlɜːrnɪŋ/' },
      { word: 'Automation', definition: 'Using technology to perform tasks without human help', example: 'Automation has changed manufacturing significantly.', pronunciation: '/ˌɔːtəˈmeɪʃn/' },
      { word: 'Robotics', definition: 'The design and use of robots', example: 'Robotics is advancing rapidly in healthcare.', pronunciation: '/roʊˈbɒtɪks/' },
      { word: 'Innovation', definition: 'A new method, idea, or product', example: 'Innovation drives economic growth.', pronunciation: '/ˌɪnəˈveɪʃn/' },
      { word: 'Disruption', definition: 'A radical change in an industry caused by new technology', example: 'Streaming caused major disruption in the entertainment industry.', pronunciation: '/dɪsˈrʌpʃn/' },
      { word: 'Ethics', definition: 'Moral principles governing behavior', example: 'AI ethics is an important area of debate.', pronunciation: '/ˈeθɪks/' },
      { word: 'Bias in AI', definition: 'Systematic prejudice in AI systems from training data', example: 'Addressing bias in AI is crucial for fairness.', pronunciation: '/ˈbaɪəs ɪn eɪ aɪ/' },
      { word: 'Neural network', definition: 'A computing system inspired by the human brain', example: 'Neural networks are used for image and speech recognition.', pronunciation: '/ˈnʊrəl ˈnetwɜːrk/' },
      { word: 'Sustainability', definition: 'Using resources without depleting them for future generations', example: 'Sustainable development is key to our future.', pronunciation: '/səˌsteɪnəˈbɪləti/' }
    ],
    'Social Media English': [
      { word: 'Hashtag', definition: 'A word preceded by # used to categorize content', example: 'Use the hashtag #EnglishLearning to find related posts.', pronunciation: '/ˈhæʃtæɡ/' },
      { word: 'Viral', definition: 'Spreading rapidly on the internet', example: 'The video went viral and received millions of views.', pronunciation: '/ˈvaɪrəl/' },
      { word: 'Influencer', definition: 'A person with a large social media following', example: 'The influencer promoted the brand to her followers.', pronunciation: '/ˈɪnfluənsər/' },
      { word: 'Trending', definition: 'Currently popular or widely discussed', example: 'The topic is trending on Twitter today.', pronunciation: '/ˈtrendɪŋ/' },
      { word: 'Meme', definition: 'A humorous image or idea spread online', example: 'That meme made me laugh out loud.', pronunciation: '/miːm/' },
      { word: 'Follower', definition: 'A person who subscribes to your social media account', example: 'She gained ten thousand followers in a month.', pronunciation: '/ˈfɒloʊər/' },
      { word: 'Post', definition: 'A piece of content shared on social media', example: 'She posted a photo of her vacation.', pronunciation: '/poʊst/' },
      { word: 'Feed', definition: 'The stream of content displayed on a social media platform', example: 'Scroll through your feed to see recent posts.', pronunciation: '/fiːd/' },
      { word: 'Engagement', definition: 'The level of interaction with social media content', example: 'Posts with questions get higher engagement.', pronunciation: '/ɪnˈɡeɪdʒmənt/' },
      { word: 'Direct message', definition: 'A private message sent on social media', example: 'I will send you the details by direct message.', pronunciation: '/dɪˈrekt ˈmesɪdʒ/' }
    ],
    'Cybersecurity Basics': [
      { word: 'Firewall', definition: 'A system that monitors and controls network traffic', example: 'The firewall blocked the suspicious connection.', pronunciation: '/ˈfaɪərwɔːl/' },
      { word: 'Malware', definition: 'Software designed to harm or access a computer system', example: 'Run a scan to check for malware on your device.', pronunciation: '/ˈmælwer/' },
      { word: 'Password', definition: 'A secret word used to gain access to an account', example: 'Use a strong, unique password for each account.', pronunciation: '/ˈpæswɜːrd/' },
      { word: 'Encryption', definition: 'Converting information into a code for security', example: 'End-to-end encryption keeps your messages private.', pronunciation: '/ɪnˈkrɪpʃn/' },
      { word: 'Hacker', definition: 'A person who gains unauthorized access to computer systems', example: 'The hacker exploited a weakness in the system.', pronunciation: '/ˈhækər/' },
      { word: 'Ransomware', definition: 'Malware that locks data until a payment is made', example: 'The company was hit by a ransomware attack.', pronunciation: '/ˈrænsəmwer/' },
      { word: 'Vulnerability', definition: 'A weakness in a system that can be exploited', example: 'The software update patches a known vulnerability.', pronunciation: '/ˌvʌlnərəˈbɪləti/' },
      { word: 'Breaches', definition: 'Incidents where data is accessed without authorization', example: 'Data breaches can expose millions of records.', pronunciation: '/briːtʃɪz/' },
      { word: 'Authentication', definition: 'The process of verifying identity', example: 'Multi-factor authentication adds extra security.', pronunciation: '/ɔːˌθentɪˈkeɪʃn/' },
      { word: 'Patch', definition: 'A software update that fixes a security issue', example: 'Install security patches as soon as they are released.', pronunciation: '/pætʃ/' }
    ],
    'Negotiations': [
      { word: 'Compromise', definition: 'An agreement reached by each side giving up something', example: 'Both parties reached a compromise after long discussions.', pronunciation: '/ˈkɒmprəmaɪz/' },
      { word: 'Leverage', definition: 'The power to influence someone in a negotiation', example: 'Having multiple offers gives you more leverage.', pronunciation: '/ˈlevərɪdʒ/' },
      { word: 'Concession', definition: 'Something given up during negotiations', example: 'The company made a concession on the delivery date.', pronunciation: '/kənˈseʃn/' },
      { word: 'Propose', definition: 'To put forward an idea for consideration', example: 'I would like to propose a different approach.', pronunciation: '/prəˈpoʊz/' },
      { word: 'Counteroffer', definition: 'An offer made in response to another offer', example: 'The seller rejected the counteroffer.', pronunciation: '/ˈkaʊntərɒfər/' },
      { word: 'Deadline', definition: 'The latest time by which something must be completed', example: 'We need to reach an agreement before the deadline.', pronunciation: '/ˈdedlaɪn/' },
      { word: 'Stalemate', definition: 'A situation where no progress can be made', example: 'The negotiations reached a stalemate.', pronunciation: '/ˈsteɪlmeɪt/' },
      { word: 'Terms', definition: 'The conditions of an agreement', example: 'The terms of the contract were negotiated carefully.', pronunciation: '/tɜːrmz/' },
      { word: 'Mutual', definition: 'Shared by both parties', example: 'We reached a mutual agreement on the pricing.', pronunciation: '/ˈmjuːtʃuəl/' },
      { word: 'Deal', definition: 'An agreement between two or more parties', example: 'They closed the deal after three rounds of negotiation.', pronunciation: '/diːl/' }
    ],
    'Business Plans': [
      { word: 'Revenue', definition: 'The income generated by a business', example: 'The company reported a 15% increase in revenue.', pronunciation: '/ˈrevənjuː/' },
      { word: 'Profit margin', definition: 'The percentage of revenue that is profit', example: 'We need to improve our profit margin this quarter.', pronunciation: '/ˈprɒfɪt ˈmɑːrdʒɪn/' },
      { word: 'Target market', definition: 'The specific group of consumers a business aims to reach', example: 'Our target market is young professionals aged 25-35.', pronunciation: '/ˈtɑːrɡɪt ˈmɑːrkɪt/' },
      { word: 'Startup', definition: 'A newly established business', example: 'The startup received funding from several investors.', pronunciation: '/ˈstɑːrtʌp/' },
      { word: 'Scalable', definition: 'Able to be expanded without major changes', example: 'A scalable business model can grow efficiently.', pronunciation: '/ˈskeɪləbl/' },
      { word: 'Milestone', definition: 'A significant stage or event in development', example: 'Reaching one million users was a major milestone.', pronunciation: '/ˈmaɪlstoʊn/' },
      { word: 'Pitch', definition: 'A presentation to persuade investors', example: 'She delivered a compelling pitch to the investors.', pronunciation: '/pɪtʃ/' },
      { word: 'ROI', definition: 'Return on investment — the profit gained relative to cost', example: 'The ROI on this project exceeded our expectations.', pronunciation: '/ɑːr oʊ aɪ/' },
      { word: 'Competitor', definition: 'A business that offers similar products or services', example: 'We analyzed our competitors before launching the product.', pronunciation: '/kəmˈpetɪtər/' },
      { word: 'Strategy', definition: 'A plan of action designed to achieve a goal', example: 'The business strategy focuses on customer retention.', pronunciation: '/ˈstrætədʒi/' }
    ],
    'Marketing Terms': [
      { word: 'Brand', definition: 'A distinctive identity for a product or company', example: 'The brand is recognized worldwide.', pronunciation: '/brænd/' },
      { word: 'Campaign', definition: 'An organized effort to promote a product or cause', example: 'The marketing campaign reached millions of people.', pronunciation: '/kæmˈpeɪn/' },
      { word: 'Demographic', definition: 'A specific segment of the population', example: 'The product targets the 18-24 demographic.', pronunciation: '/ˌdeməˈɡræfɪk/' },
      { word: 'Engagement', definition: 'The level of interaction between customers and a brand', example: 'Social media engagement increased after the redesign.', pronunciation: '/ɪnˈɡeɪdʒmənt/' },
      { word: 'SEO', definition: 'Search Engine Optimization — improving visibility in search results', example: 'Good SEO helps your website appear higher in search results.', pronunciation: '/ˌes iː oʊ/' },
      { word: 'Conversion', definition: 'When a visitor takes a desired action (e.g., makes a purchase)', example: 'The landing page improved conversion rates by 20%.', pronunciation: '/kənˈvɜːrʒn/' },
      { word: 'Slogan', definition: 'A memorable phrase used in advertising', example: 'The company slogan became iconic.', pronunciation: '/ˈsloʊɡən/' },
      { word: 'Endorsement', definition: 'A public statement of support', example: 'The celebrity endorsement boosted sales significantly.', pronunciation: '/ɪnˈdɔːrsmənt/' },
      { word: 'Niche', definition: 'A specialized segment of a market', example: 'The company found a niche in organic pet food.', pronunciation: '/niːʃ/' },
      { word: 'Viral marketing', definition: 'A strategy that encourages people to share content widely', example: 'The video was part of a viral marketing campaign.', pronunciation: '/ˈvaɪrəl ˈmɑːrkɪtɪŋ/' }
    ],
    'Financial Vocabulary': [
      { word: 'Investment', definition: 'Money put into something to gain a return', example: 'She made a wise investment in technology stocks.', pronunciation: '/ɪnˈvestmənt/' },
      { word: 'Portfolio', definition: 'A collection of investments owned by a person or organization', example: 'A diversified portfolio reduces risk.', pronunciation: '/pɔːrtˈfoʊlioʊ/' },
      { word: 'Interest rate', definition: 'The percentage charged for borrowing money', example: 'The central bank raised the interest rate.', pronunciation: '/ˈɪntrəst reɪt/' },
      { word: 'Inflation', definition: 'A general increase in prices over time', example: 'Inflation has reduced the purchasing power of consumers.', pronunciation: '/ɪnˈfleɪʃn/' },
      { word: 'Dividend', definition: 'A payment from a company to its shareholders', example: 'The company pays a quarterly dividend.', pronunciation: '/ˈdɪvɪdend/' },
      { word: 'Capital', definition: 'Wealth or assets used to start or grow a business', example: 'They raised capital from venture investors.', pronunciation: '/ˈkæpɪtl/' },
      { word: 'Equity', definition: 'Ownership interest in a company', example: 'She holds 20% equity in the startup.', pronunciation: '/ˈekwəti/' },
      { word: 'Asset', definition: 'Something of value owned by a person or company', example: 'Real estate is a valuable asset.', pronunciation: '/ˈæset/' },
      { word: 'Liability', definition: 'A financial obligation or debt', example: 'The company\'s liabilities exceeded its assets.', pronunciation: '/ˌlaɪəˈbɪləti/' },
      { word: 'Recession', definition: 'A period of economic decline', example: 'The country entered a recession after the financial crisis.', pronunciation: '/rɪˈseʃn/' }
    ],
    'Leadership Language': [
      { word: 'Vision', definition: 'A clear idea of what you want to achieve', example: 'A great leader has a compelling vision for the future.', pronunciation: '/ˈvɪʒn/' },
      { word: 'Empower', definition: 'To give someone the authority or confidence to do something', example: 'Good leaders empower their teams to make decisions.', pronunciation: '/ɪmˈpaʊər/' },
      { word: 'Delegate', definition: 'To assign responsibility to another person', example: 'Effective leaders delegate tasks to the right people.', pronunciation: '/ˈdelɪɡeɪt/' },
      { word: 'Accountability', definition: 'Being responsible for your actions and decisions', example: 'Accountability is a key principle of good leadership.', pronunciation: '/əˌkaʊntəˈbɪləti/' },
      { word: 'Mentorship', definition: 'Guidance provided by an experienced leader', example: 'She credits her success to strong mentorship.', pronunciation: '/ˈmentɔːrʃɪp/' },
      { word: 'Initiative', definition: 'The ability to act without being told', example: 'Taking initiative is valued in any workplace.', pronunciation: '/ɪˈnɪʃətɪv/' },
      { word: 'Consensus', definition: 'General agreement among a group', example: 'The leader built consensus before implementing changes.', pronunciation: '/kənˈsensəs/' },
      { word: 'Strategic', definition: 'Relating to long-term planning', example: 'Strategic thinking is essential for leadership roles.', pronunciation: '/strəˈtiːdʒɪk/' },
      { word: 'Resilience', definition: 'The ability to recover from difficulties', example: 'Resilience helps leaders navigate challenges.', pronunciation: '/rɪˈzɪliəns/' },
      { word: 'Integrity', definition: 'Honesty and strong moral principles', example: 'Leaders with integrity earn the trust of their teams.', pronunciation: '/ɪnˈteɡrəti/' }
    ],
    'Climate Change': [
      { word: 'Greenhouse effect', definition: 'The trapping of heat in the Earth\'s atmosphere', example: 'The greenhouse effect causes global temperatures to rise.', pronunciation: '/ˈɡriːnhaʊs ɪˈfekt/' },
      { word: 'Emissions', definition: 'Gases released into the atmosphere', example: 'Carbon emissions from factories contribute to climate change.', pronunciation: '/ɪˈmɪʃnz/' },
      { word: 'Carbon footprint', definition: 'The amount of greenhouse gases produced by a person or activity', example: 'Reducing your carbon footprint helps the environment.', pronunciation: '/ˈkɑːrbən ˈfʊtprɪnt/' },
      { word: 'Sustainability', definition: 'Using resources at a rate that does not deplete them', example: 'Sustainability should be at the core of business practices.', pronunciation: '/səˌsteɪnəˈbɪləti/' },
      { word: 'Deforestation', definition: 'The clearing of forests on a large scale', example: 'Deforestation is a major cause of habitat loss.', pronunciation: '/diːˌfɒrɪˈsteɪʃn/' },
      { word: 'Biodiversity', definition: 'The variety of plant and animal life in an area', example: 'Climate change threatens global biodiversity.', pronunciation: '/ˌbaɪoʊdaɪˈvɜːrsəti/' },
      { word: 'Fossil fuel', definition: 'A natural fuel formed from the remains of living organisms', example: 'Burning fossil fuels releases carbon dioxide.', pronunciation: '/ˈfɒsl fjuːl/' },
      { word: 'Mitigation', definition: 'Actions to reduce the severity of climate change', example: 'Mitigation strategies include reducing emissions.', pronunciation: '/ˌmɪtɪˈɡeɪʃn/' },
      { word: 'Adaptation', definition: 'Adjusting to the effects of climate change', example: 'Coastal cities are investing in adaptation measures.', pronunciation: '/ˌædæpˈteɪʃn/' },
      { word: 'Global warming', definition: 'The long-term increase in Earth\'s average temperature', example: 'Global warming is accelerating due to human activities.', pronunciation: '/ˈɡloʊbl ˈwɔːrmɪŋ/' }
    ],
    'The Scientific Method': [
      { word: 'Observation', definition: 'The act of watching something carefully to learn about it', example: 'The experiment began with a simple observation.', pronunciation: '/ˌɒbzərˈveɪʃn/' },
      { word: 'Experiment', definition: 'A test done to discover or confirm something', example: 'The experiment confirmed the initial hypothesis.', pronunciation: '/ɪkˈsperɪmənt/' },
      { word: 'Control group', definition: 'A group that does not receive the experimental treatment', example: 'The control group received a placebo instead of the drug.', pronunciation: '/kənˈtroʊl ɡruːp/' },
      { word: 'Replicate', definition: 'To repeat an experiment to verify results', example: 'Scientists must be able to replicate each other\'s findings.', pronunciation: '/ˈreplɪkeɪt/' },
      { word: 'Theory', definition: 'A well-supported explanation of a natural phenomenon', example: 'The theory of evolution explains the diversity of life.', pronunciation: '/ˈθɪəri/' },
      { word: 'Variable', definition: 'A factor that can change in an experiment', example: 'Control all variables except the one you are testing.', pronunciation: '/ˈveriəbl/' },
      { word: 'Hypothesis', definition: 'A proposed explanation that can be tested', example: 'The hypothesis was that sunlight affects plant growth.', pronunciation: '/haɪˈpɒθəsɪs/' },
      { word: 'Analysis', definition: 'The detailed examination of data', example: 'Statistical analysis revealed a significant difference.', pronunciation: '/əˈnæləsɪs/' },
      { word: 'Correlation', definition: 'A relationship between two variables', example: 'The study found a strong correlation between exercise and health.', pronunciation: '/ˌkɒrəˈleɪʃn/' },
      { word: 'Objective', definition: 'Based on facts, not opinions', example: 'Scientific research must be objective and unbiased.', pronunciation: '/əbˈdʒektɪv/' }
    ],
    'Environmental Issues': [
      { word: 'Pollution', definition: 'Contamination of the environment with harmful substances', example: 'Air pollution is a serious problem in many cities.', pronunciation: '/pəˈluːʃn/' },
      { word: 'Conservation', definition: 'The protection and preservation of natural resources', example: 'Conservation efforts have helped restore the wildlife population.', pronunciation: '/ˌkɒnsərˈveɪʃn/' },
      { word: 'Endangered', definition: 'At risk of becoming extinct', example: 'The giant panda was once an endangered species.', pronunciation: '/ɪnˈdeɪndʒərd/' },
      { word: 'Ecosystem', definition: 'A community of living organisms and their environment', example: 'The coral reef is a fragile ecosystem.', pronunciation: '/ˈiːkoʊsɪstəm/' },
      { word: 'Recycling', definition: 'Processing used materials into new products', example: 'Recycling reduces waste and conserves resources.', pronunciation: '/riːˈsaɪklɪŋ/' },
      { word: 'Drought', definition: 'A long period of abnormally low rainfall', example: 'The drought has devastated crops across the region.', pronunciation: '/draʊt/' },
      { word: 'Contamination', definition: 'The presence of harmful substances in the environment', example: 'Soil contamination can affect food safety.', pronunciation: '/kənˌtæmɪˈneɪʃn/' },
      { word: 'Habitat', definition: 'The natural home of a plant or animal', example: 'Urban development is destroying natural habitats.', pronunciation: '/ˈhæbɪtæt/' },
      { word: 'Acid rain', definition: 'Rain containing harmful chemicals from pollution', example: 'Acid rain damages forests and buildings.', pronunciation: '/ˈæsɪd reɪn/' },
      { word: 'Overpopulation', definition: 'When an area has too many people for its resources', example: 'Overpopulation puts pressure on the environment.', pronunciation: '/ˌoʊvərˌpɒpjuˈleɪʃn/' }
    ],
    'Renewable Energy': [
      { word: 'Solar power', definition: 'Energy generated from sunlight', example: 'Solar power is becoming increasingly affordable.', pronunciation: '/ˈsoʊlər ˈpaʊər/' },
      { word: 'Wind turbine', definition: 'A device that converts wind energy into electricity', example: 'Wind turbines generate clean energy.', pronunciation: '/wɪnd ˈtɜːrbaɪn/' },
      { word: 'Hydroelectric', definition: 'Generating electricity using flowing water', example: 'The hydroelectric dam powers the entire region.', pronunciation: '/ˌhaɪdroʊɪˈlektrɪk/' },
      { word: 'Geothermal', definition: 'Energy from heat within the Earth', example: 'Iceland uses geothermal energy for heating.', pronunciation: '/ˌdʒiːoʊˈθɜːrml/' },
      { word: 'Biomass', definition: 'Organic material used as fuel', example: 'Biomass energy comes from plant and animal matter.', pronunciation: '/ˈbaɪoʊmæs/' },
      { word: 'Grid', definition: 'The network that distributes electricity', example: 'The solar panels feed energy back into the grid.', pronunciation: '/ɡrɪd/' },
      { word: 'Efficiency', definition: 'Using resources without waste', example: 'Energy efficiency reduces costs and emissions.', pronunciation: '/ɪˈfɪʃnsi/' },
      { word: 'Carbon-neutral', definition: 'Producing no net carbon emissions', example: 'The company aims to be carbon-neutral by 2030.', pronunciation: '/ˈkɑːrbən ˈnjuːtrəl/' },
      { word: 'Sustainable', definition: 'Able to be maintained without depleting resources', example: 'Sustainable energy sources are the future.', pronunciation: '/səˈsteɪnəbl/' },
      { word: 'Photovoltaic', definition: 'Relating to converting light into electricity', example: 'Photovoltaic cells are used in solar panels.', pronunciation: '/ˌfoʊtoʊvɒlˈteɪɪk/' }
    ],
    'Space Exploration': [
      { word: 'Orbit', definition: 'The curved path of an object around a star or planet', example: 'The satellite orbits the Earth every 90 minutes.', pronunciation: '/ˈɔːrbɪt/' },
      { word: 'Astronaut', definition: 'A person trained to travel in space', example: 'The astronaut spent six months on the space station.', pronunciation: '/ˈæstrənɔːt/' },
      { word: 'Launch', definition: 'To send a spacecraft into space', example: 'The rocket launch was broadcast live on television.', pronunciation: '/lɔːntʃ/' },
      { word: 'Gravity', definition: 'The force that attracts objects toward the Earth', example: 'Astronauts experience microgravity in orbit.', pronunciation: '/ˈɡrævəti/' },
      { word: 'Probe', definition: 'An unmanned spacecraft used for exploration', example: 'The space probe sent back images of Mars.', pronunciation: '/proʊb/' },
      { word: 'Nebula', definition: 'A cloud of gas and dust in space', example: 'The Orion Nebula is visible with a telescope.', pronunciation: '/ˈnebjələ/' },
      { word: 'Telescope', definition: 'An instrument for observing distant objects', example: 'The Hubble Telescope has captured stunning images.', pronunciation: '/ˈtelɪskoʊp/' },
      { word: 'Satellite', definition: 'An object that orbits a planet', example: 'Communication satellites enable global broadcasting.', pronunciation: '/ˈsætəlaɪt/' },
      { word: 'Galaxy', definition: 'A large system of stars, gas, and dust', example: 'The Milky Way is the galaxy that contains our solar system.', pronunciation: '/ˈɡæləksi/' },
      { word: 'Cosmos', definition: 'The universe as an ordered whole', example: 'Exploring the cosmos is one of humanity\'s greatest ambitions.', pronunciation: '/ˈkɒzmoʊs/' }
    ],
    'Literary Terms': [
      { word: 'Metaphor', definition: 'A comparison between two unlike things without using "like" or "as"', example: 'Time is a thief is a metaphor.', pronunciation: '/ˈmetəfər/' },
      { word: 'Simile', definition: 'A comparison using "like" or "as"', example: 'As brave as a lion is a simile.', pronunciation: '/ˈsɪməli/' },
      { word: 'Irony', definition: 'A contrast between expectation and reality', example: 'It is ironic that the fire station burned down.', pronunciation: '/ˈaɪrəni/' },
      { word: 'Protagonist', definition: 'The main character in a story', example: 'The protagonist overcomes many obstacles in the novel.', pronunciation: '/prəˈtæɡənɪst/' },
      { word: 'Antagonist', definition: 'A character who opposes the protagonist', example: 'The antagonist creates conflict in the story.', pronunciation: '/ænˈtæɡənɪst/' },
      { word: 'Foreshadowing', definition: 'Hints about what will happen later in a story', example: 'The dark clouds were a foreshadowing of the tragedy.', pronunciation: '/fɔːrˈʃædoʊɪŋ/' },
      { word: 'Allegory', definition: 'A story with a hidden meaning or moral', example: 'Animal Farm is an allegory of the Russian Revolution.', pronunciation: '/ˈæləɡɔːri/' },
      { word: 'Symbolism', definition: 'Using symbols to represent ideas or qualities', example: 'The dove is a symbol of peace — this is symbolism.', pronunciation: '/ˈsɪmbəlɪzəm/' },
      { word: 'Narrator', definition: 'The person telling the story', example: 'The narrator provides the reader with important context.', pronunciation: '/ˈnæreɪtər/' },
      { word: 'Theme', definition: 'The central idea or message of a work', example: 'The theme of the novel is the struggle for identity.', pronunciation: '/θiːm/' }
    ],
    'Poetry Basics': [
      { word: 'Rhyme', definition: 'Correspondence of sounds at the ends of words', example: 'Cat and hat rhyme.', pronunciation: '/raɪm/' },
      { word: 'Stanza', definition: 'A group of lines in a poem', example: 'The poem has four stanzas of four lines each.', pronunciation: '/ˈstænzə/' },
      { word: 'Meter', definition: 'The rhythmic structure of a line of poetry', example: 'Shakespeare often wrote in iambic pentameter meter.', pronunciation: '/ˈmiːtər/' },
      { word: 'Verse', definition: 'A line of poetry or a section of a poem', example: 'The first verse sets the tone of the poem.', pronunciation: '/vɜːrs/' },
      { word: 'Alliteration', definition: 'Repetition of consonant sounds at the beginning of words', example: 'Peter Piper picked a peck of pickled peppers uses alliteration.', pronunciation: '/əˌlɪtəˈreɪʃn/' },
      { word: 'Haiku', definition: 'A Japanese poem of three lines with 5, 7, and 5 syllables', example: 'The haiku captures a moment in nature.', pronunciation: '/ˈhaɪkuː/' },
      { word: 'Sonnet', definition: 'A 14-line poem with a specific rhyme scheme', example: 'Shakespeare wrote 154 sonnets.', pronunciation: '/ˈsɒnɪt/' },
      { word: 'Imagery', definition: 'Descriptive language that creates vivid mental pictures', example: 'The poet uses imagery of golden sunsets.', pronunciation: '/ˈɪmɪdʒəri/' },
      { word: 'Couplet', definition: 'Two lines of poetry that rhyme', example: 'The poem ends with a rhyming couplet.', pronunciation: '/ˈkʌplɪt/' },
      { word: 'Free verse', definition: 'Poetry without regular meter or rhyme', example: 'Modern poets often write in free verse.', pronunciation: '/friː vɜːrs/' }
    ],
    'Film Criticism': [
      { word: 'Cinematography', definition: 'The art of making motion pictures', example: 'The cinematography in the film was breathtaking.', pronunciation: '/ˌsɪnəməˈtɒɡrəfi/' },
      { word: 'Screenplay', definition: 'The script of a film', example: 'The screenplay won an Academy Award.', pronunciation: '/ˈskriːnpleɪ/' },
      { word: 'Soundtrack', definition: 'The recorded music from a film', example: 'The soundtrack became more popular than the film itself.', pronunciation: '/ˈsaʊndtræk/' },
      { word: 'Plot twist', definition: 'An unexpected change in the direction of a story', example: 'The plot twist at the end surprised everyone.', pronunciation: '/plɒt twɪst/' },
      { word: 'Character arc', definition: 'The transformation a character undergoes', example: 'The protagonist\'s character arc is compelling.', pronunciation: '/ˈkærɪktər ɑːrk/' },
      { word: 'Genre', definition: 'A category of artistic composition', example: 'Science fiction is her favorite film genre.', pronunciation: '/ˈʒɒnrə/' },
      { word: 'Montage', definition: 'A sequence of short shots edited together', example: 'The training montage shows the hero preparing for battle.', pronunciation: '/mɒnˈtɑːʒ/' },
      { word: 'Dialogue', definition: 'The spoken conversation between characters', example: 'The film\'s dialogue was sharp and witty.', pronunciation: '/ˈdaɪəlɒɡ/' },
      { word: 'Review', definition: 'A critical assessment of a film', example: 'The review praised the acting but criticized the pacing.', pronunciation: '/rɪˈvjuː/' },
      { word: 'Cliché', definition: 'An overused expression or predictable element', example: 'The romantic comedy was full of clichés.', pronunciation: '/kliːˈʃeɪ/' }
    ],
    'Art Movements': [
      { word: 'Impressionism', definition: 'An art movement focusing on light and color', example: 'Monet was a leading figure in Impressionism.', pronunciation: '/ɪmˈpreʃənɪzəm/' },
      { word: 'Abstract', definition: 'Art that does not represent reality accurately', example: 'Abstract art uses shapes and colors instead of realistic images.', pronunciation: '/ˈæbstrækt/' },
      { word: 'Renaissance', definition: 'The revival of art and learning in 14th-17th century Europe', example: 'Leonardo da Vinci was a Renaissance artist.', pronunciation: '/ˌrenəˈsɑːns/' },
      { word: 'Surrealism', definition: 'An art movement featuring dreamlike, illogical scenes', example: 'Salvador Dalí is famous for his Surrealism.', pronunciation: '/səˈriːəlɪzəm/' },
      { word: 'Realism', definition: 'Art that depicts subjects as they appear in real life', example: 'Realism emerged as a reaction against Romanticism.', pronunciation: '/ˈriːəlɪzəm/' },
      { word: 'Minimalism', definition: 'Art using the simplest elements to create effect', example: 'Minimalism focuses on simplicity and space.', pronunciation: '/ˈmɪnɪməlɪzəm/' },
      { word: 'Baroque', definition: 'A highly ornate and elaborate art style', example: 'Baroque architecture is known for its grandeur.', pronunciation: '/bəˈrɒk/' },
      { word: 'Cubism', definition: 'An art style showing subjects from multiple viewpoints', example: 'Picasso co-founded the Cubism movement.', pronunciation: '/ˈkjuːbɪzəm/' },
      { word: 'Avant-garde', definition: 'New and experimental ideas in art', example: 'The avant-garde pushed the boundaries of traditional art.', pronunciation: '/ˌævɒ̃ˈɡɑːrd/' },
      { word: 'Expressionism', definition: 'Art that distorts reality to express emotion', example: 'Expressionism conveys inner feelings rather than outward appearance.', pronunciation: '/ɪkˈspreʃənɪzəm/' }
    ],
    'Creative Writing': [
      { word: 'Plot', definition: 'The sequence of events in a story', example: 'The plot thickens as the mystery deepens.', pronunciation: '/plɒt/' },
      { word: 'Character', definition: 'A person in a story', example: 'The characters in the novel feel very real.', pronunciation: '/ˈkærɪktər/' },
      { word: 'Setting', definition: 'The time and place where a story occurs', example: 'The setting of the novel is Victorian London.', pronunciation: '/ˈsetɪŋ/' },
      { word: 'Conflict', definition: 'The problem or struggle in a story', example: 'Every good story needs conflict to drive the plot.', pronunciation: '/ˈkɒnflɪkt/' },
      { word: 'Climax', definition: 'The most exciting or important part of a story', example: 'The climax occurs when the hero confronts the villain.', pronunciation: '/ˈklaɪmæks/' },
      { word: 'Dialogue', definition: 'Conversation between characters', example: 'Effective dialogue reveals character personality.', pronunciation: '/ˈdaɪəlɒɡ/' },
      { word: 'Flashback', definition: 'A scene set in an earlier time than the main story', example: 'The author uses flashbacks to reveal the character\'s past.', pronunciation: '/ˈflæʃbæk/' },
      { word: 'Resolution', definition: 'The conclusion of a story\'s conflict', example: 'The resolution ties up loose ends in the plot.', pronunciation: '/ˌrezəˈluːʃn/' },
      { word: 'Draft', definition: 'A preliminary version of a written work', example: 'The first draft is never perfect — revise it.', pronunciation: '/dræft/' },
      { word: 'Voice', definition: 'The distinctive style of a writer', example: 'Finding your unique voice takes practice.', pronunciation: '/vɔɪs/' }
    ],
    'Mental Health Vocabulary': [
      { word: 'Anxiety', definition: 'A feeling of worry or fear', example: 'Managing anxiety is important for overall well-being.', pronunciation: '/æŋˈzaɪəti/' },
      { word: 'Resilience', definition: 'The ability to recover from difficult experiences', example: 'Building resilience helps you cope with stress.', pronunciation: '/rɪˈzɪliəns/' },
      { word: 'Mindfulness', definition: 'Being fully present and aware of the current moment', example: 'Mindfulness meditation can reduce stress.', pronunciation: '/ˈmaɪndfʊlnəs/' },
      { word: 'Therapy', definition: 'Treatment intended to heal or relieve a condition', example: 'Cognitive behavioral therapy is effective for anxiety.', pronunciation: '/ˈθerəpi/' },
      { word: 'Well-being', definition: 'The state of being comfortable and healthy', example: 'Regular exercise contributes to mental well-being.', pronunciation: '/ˈwel biːɪŋ/' },
      { word: 'Depression', definition: 'A mental health condition causing persistent sadness', example: 'Seeking help for depression is a sign of strength.', pronunciation: '/dɪˈpreʃn/' },
      { word: 'Self-care', definition: 'The practice of taking care of your own health', example: 'Self-care includes getting enough sleep and exercise.', pronunciation: '/self ker/' },
      { word: 'Burnout', definition: 'Physical or emotional exhaustion from prolonged stress', example: 'Burnout is common in high-pressure jobs.', pronunciation: '/ˈbɜːrnaʊt/' },
      { word: 'Stigma', definition: 'A mark of disgrace associated with a particular circumstance', example: 'Reducing the stigma around mental health is important.', pronunciation: '/ˈstɪɡmə/' },
      { word: 'Coping mechanism', definition: 'A strategy used to deal with stress or difficulty', example: 'Exercise is a healthy coping mechanism for stress.', pronunciation: '/ˈkoʊpɪŋ ˈmekənɪzəm/' }
    ],
    'Nutrition Science': [
      { word: 'Macronutrient', definition: 'A nutrient needed in large amounts (protein, fat, carbohydrate)', example: 'Protein is a macronutrient essential for muscle repair.', pronunciation: '/ˌmækroʊˈnjuːtriənt/' },
      { word: 'Vitamin', definition: 'An organic compound needed in small amounts for health', example: 'Vitamin C boosts the immune system.', pronunciation: '/ˈvaɪtəmɪn/' },
      { word: 'Mineral', definition: 'An inorganic element essential for health', example: 'Iron is a mineral that carries oxygen in the blood.', pronunciation: '/ˈmɪnərəl/' },
      { word: 'Calorie', definition: 'A unit of energy in food', example: 'Knowing the calorie content helps you manage your diet.', pronunciation: '/ˈkæləri/' },
      { word: 'Fiber', definition: 'A type of carbohydrate the body cannot digest', example: 'Dietary fiber aids digestion.', pronunciation: '/ˈfaɪbər/' },
      { word: 'Protein', definition: 'A nutrient that builds and repairs body tissues', example: 'Lean protein sources include chicken and fish.', pronunciation: '/ˈproʊtiːn/' },
      { word: 'Antioxidant', definition: 'A substance that protects cells from damage', example: 'Berries are rich in antioxidants.', pronunciation: '/ˌæntiˈɒksɪdənt/' },
      { word: 'Metabolism', definition: 'The chemical processes that maintain the body', example: 'A faster metabolism burns more calories at rest.', pronunciation: '/məˈtæbəlɪzəm/' },
      { word: 'Deficiency', definition: 'A lack of a necessary nutrient', example: 'Iron deficiency can cause fatigue.', pronunciation: '/dɪˈfɪʃnsi/' },
      { word: 'Balanced diet', definition: 'A diet containing all nutrients in the right proportions', example: 'A balanced diet includes fruits, vegetables, and whole grains.', pronunciation: '/ˈbælənst ˈdaɪət/' }
    ],
    'Exercise & Fitness': [
      { word: 'Cardio', definition: 'Exercise that raises the heart rate', example: 'Running and swimming are great forms of cardio.', pronunciation: '/ˈkɑːrdioʊ/' },
      { word: 'Strength training', definition: 'Exercise that builds muscle through resistance', example: 'Strength training includes weightlifting and bodyweight exercises.', pronunciation: '/streŋθ ˈtreɪnɪŋ/' },
      { word: 'Flexibility', definition: 'The ability of joints to move through their full range', example: 'Yoga improves flexibility and balance.', pronunciation: '/ˌfleksəˈbɪləti/' },
      { word: 'Endurance', definition: 'The ability to sustain physical activity over time', example: 'Long-distance running builds endurance.', pronunciation: '/ɪnˈdjʊrəns/' },
      { word: 'Repetition', definition: 'One complete movement of an exercise', example: 'Do three sets of ten repetitions.', pronunciation: '/ˌrepəˈtɪʃn/' },
      { word: 'Warm-up', definition: 'Light exercise to prepare the body for activity', example: 'Always do a warm-up before intense exercise.', pronunciation: '/wɔːrm ʌp/' },
      { word: 'Cool down', definition: 'Gentle exercise after a workout to help recovery', example: 'A cool down helps prevent muscle soreness.', pronunciation: '/kuːl daʊn/' },
      { word: 'Intensity', definition: 'The level of effort in an exercise', example: 'High-intensity interval training burns calories quickly.', pronunciation: '/ɪnˈtensəti/' },
      { word: 'Core', definition: 'The muscles of the abdomen and lower back', example: 'A strong core supports good posture.', pronunciation: '/kɔːr/' },
      { word: 'Recovery', definition: 'The period of rest after exercise', example: 'Adequate recovery is essential for muscle growth.', pronunciation: '/rɪˈkʌvəri/' }
    ],
    'Medical Ethics': [
      { word: 'Consent', definition: 'Permission given after understanding the facts', example: 'Informed consent is required before any medical procedure.', pronunciation: '/kənˈsent/' },
      { word: 'Confidentiality', definition: 'The obligation to keep patient information private', example: 'Doctors must maintain patient confidentiality.', pronunciation: '/ˌkɒnfɪˌdenʃiˈæləti/' },
      { word: 'Beneficence', definition: 'The duty to act in the best interest of the patient', example: 'Beneficence means doctors should always seek to help patients.', pronunciation: '/bɪˈnefɪsəns/' },
      { word: 'Non-maleficence', definition: 'The principle of doing no harm', example: 'Non-maleficence is a core principle of medical ethics.', pronunciation: '/nɒn məˈlefɪsəns/' },
      { word: 'Autonomy', definition: 'The right of patients to make their own decisions', example: 'Patient autonomy means respecting their choices.', pronunciation: '/ɔːˈtɒnəmi/' },
      { word: 'Justice', definition: 'Fairness in the distribution of healthcare resources', example: 'Justice in healthcare means equal access for all.', pronunciation: '/ˈdʒʌstɪs/' },
      { word: 'Dilemma', definition: 'A situation with a difficult choice between options', example: 'The doctor faced an ethical dilemma about treatment.', pronunciation: '/dɪˈlemə/' },
      { word: 'Palliative', definition: 'Relieving pain without curing the disease', example: 'Palliative care focuses on quality of life.', pronunciation: '/ˈpæliətɪv/' },
      { word: 'Euthanasia', definition: 'The practice of intentionally ending a life to relieve suffering', example: 'Euthanasia is a controversial ethical topic.', pronunciation: '/ˌjuːθəˈneɪʒə/' },
      { word: 'Clinical trial', definition: 'A research study testing new medical treatments', example: 'The new drug is being tested in a clinical trial.', pronunciation: '/ˈklɪnɪkl traɪəl/' }
    ],
    'Work-Life Balance': [
      { word: 'Boundary', definition: 'A limit that separates work from personal life', example: 'Setting boundaries between work and home is essential.', pronunciation: '/ˈbaʊndəri/' },
      { word: 'Flexible', definition: 'Able to change or adapt easily', example: 'Flexible working hours help employees balance their lives.', pronunciation: '/ˈfleksəbl/' },
      { word: 'Prioritize', definition: 'To decide the order of importance of tasks', example: 'Learn to prioritize your tasks each day.', pronunciation: '/praɪˈɒrɪtaɪz/' },
      { word: 'Downtime', definition: 'Time when you are not working', example: 'Everyone needs downtime to recharge.', pronunciation: '/ˈdaʊntaɪm/' },
      { word: 'Overwork', definition: 'To work too much or too hard', example: 'Overwork can lead to burnout and health problems.', pronunciation: '/ˌoʊvərˈwɜːrk/' },
      { word: 'Productivity', definition: 'The efficiency of getting things done', example: 'Taking breaks actually improves productivity.', pronunciation: '/ˌprɒdʌkˈtɪvəti/' },
      { word: 'Remote work', definition: 'Working from a location other than the office', example: 'Remote work has become more common since the pandemic.', pronunciation: '/rɪˈmoʊt wɜːrk/' },
      { word: 'Unplug', definition: 'To disconnect from technology or work', example: 'Try to unplug from devices for an hour before bed.', pronunciation: '/ʌnˈplʌɡ/' },
      { word: 'Delegate', definition: 'To assign tasks to others', example: 'Learn to delegate tasks to avoid overwork.', pronunciation: '/ˈdelɪɡeɪt/' },
      { word: 'Wellness', definition: 'The state of being in good physical and mental health', example: 'Companies are investing in employee wellness programs.', pronunciation: '/ˈwelnəs/' }
    ],
    'Debating Skills': [
      { word: 'Proposition', definition: 'A statement or idea that is the subject of a debate', example: 'The proposition for today\'s debate is that social media does more harm than good.', pronunciation: '/ˌprɒpəˈzɪʃn/' },
      { word: 'Rebuttal', definition: 'A counterargument that refutes an opposing point', example: 'Her rebuttal was logical and well-supported.', pronunciation: '/rɪˈbʌtl/' },
      { word: 'Stance', definition: 'A position taken on an issue', example: 'What is your stance on the topic?', pronunciation: '/stæns/' },
      { word: 'Refute', definition: 'To prove a statement or argument wrong', example: 'He refuted the claim with strong evidence.', pronunciation: '/rɪˈfjuːt/' },
      { word: 'Moderator', definition: 'A person who oversees a debate and ensures fairness', example: 'The moderator ensured both sides had equal speaking time.', pronunciation: '/ˈmɒdəreɪtər/' },
      { word: 'Opening statement', definition: 'The first speech in a debate', example: 'The opening statement sets the tone for the debate.', pronunciation: '/ˈoʊpənɪŋ ˈsteɪtmənt/' },
      { word: 'Closing argument', definition: 'The final speech summarizing the position', example: 'The closing argument reinforced the key points.', pronunciation: '/ˈkloʊzɪŋ ˈɑːrɡjumənt/' },
      { word: 'Cross-examination', definition: 'Questioning an opponent\'s argument', example: 'Cross-examination revealed weaknesses in the argument.', pronunciation: '/krɒs ɪɡˌzæmɪˈneɪʃn/' },
      { word: 'Rhetoric', definition: 'The art of effective persuasive speaking', example: 'Strong rhetoric can sway an audience.', pronunciation: '/ˈretərɪk/' },
      { word: 'Burden of proof', definition: 'The obligation to prove one\'s argument', example: 'The burden of proof lies with the team proposing the motion.', pronunciation: '/ˈbɜːrdn ɒv pruːf/' }
    ],
    'Persuasion Techniques': [
      { word: 'Ethos', definition: 'Persuasion through credibility and trustworthiness', example: 'The speaker used ethos by mentioning her years of experience.', pronunciation: '/ˈiːθɒs/' },
      { word: 'Pathos', definition: 'Persuasion through emotional appeal', example: 'The advertisement uses pathos by showing images of suffering children.', pronunciation: '/ˈpeɪθɒs/' },
      { word: 'Logos', definition: 'Persuasion through logic and reason', example: 'The argument relies on logos — facts, statistics, and logical reasoning.', pronunciation: '/ˈloʊɡɒs/' },
      { word: 'Call to action', definition: 'An instruction to the audience to do something', example: 'End your speech with a clear call to action.', pronunciation: '/kɔːl tuː ˈækʃn/' },
      { word: 'Anecdote', definition: 'A short personal story used to illustrate a point', example: 'She opened with an anecdote about her own experience.', pronunciation: '/ˈænɪkdoʊt/' },
      { word: 'Rhetorical question', definition: 'A question asked for effect, not requiring an answer', example: 'Who would not want to live in a safer world?', pronunciation: '/rɪˈtɒrɪkl ˈkwestʃən/' },
      { word: 'Repetition', definition: 'Repeating words or phrases for emphasis', example: 'Repetition of key phrases makes arguments memorable.', pronunciation: '/ˌrepəˈtɪʃn/' },
      { word: 'Social proof', definition: 'Using others\' behavior as evidence for your point', example: 'Millions of people trust this brand — that is social proof.', pronunciation: '/ˈsoʊʃl pruːf/' },
      { word: 'Scarcity', definition: 'Creating urgency by suggesting limited availability', example: 'Scarcity makes people act quickly: "Only 3 left!"', pronunciation: '/ˈskersəti/' },
      { word: 'Authority', definition: 'Citing an expert to support your argument', example: 'The report cites authority from leading researchers.', pronunciation: '/ɔːˈθɒrəti/' }
    ],
    'Public Speaking': [
      { word: 'Audience engagement', definition: 'Keeping the listeners involved and interested', example: 'Ask questions to improve audience engagement.', pronunciation: '/ˈɔːdiəns ɪnˈɡeɪdʒmənt/' },
      { word: 'Pacing', definition: 'The speed at which you deliver a speech', example: 'Good pacing keeps the audience interested.', pronunciation: '/ˈpeɪsɪŋ/' },
      { word: 'Tone', definition: 'The attitude or emotion conveyed in your voice', example: 'Adjust your tone to match the content of your speech.', pronunciation: '/toʊn/' },
      { word: 'Gesture', definition: 'A movement of the hands or body to emphasize a point', example: 'Use natural gestures to support your message.', pronunciation: '/ˈdʒestʃər/' },
      { word: 'Eye contact', definition: 'Looking directly at members of the audience', example: 'Maintain eye contact to build trust with the audience.', pronunciation: '/aɪ ˈkɒntækt/' },
      { word: 'Stage fright', definition: 'Nervousness before or during a performance', example: 'Deep breathing can help reduce stage fright.', pronunciation: '/steɪdʒ fraɪt/' },
      { word: 'Impromptu', definition: 'Done without preparation', example: 'She gave an excellent impromptu speech.', pronunciation: '/ɪmˈprɒmptuː/' },
      { word: 'Articulate', definition: 'To express ideas clearly and effectively', example: 'A good speaker can articulate complex ideas simply.', pronunciation: '/ɑːrˈtɪkjuleɪt/' },
      { word: 'Delivery', definition: 'The manner in which a speech is presented', example: 'Confident delivery is as important as good content.', pronunciation: '/dɪˈlɪvəri/' },
      { word: 'Cue', definition: 'A signal to begin or change direction in a presentation', example: 'Use note cards as cues, not a full script.', pronunciation: '/kjuː/' }
    ],
    'Conflict Resolution': [
      { word: 'Mediation', definition: 'A process where a neutral person helps resolve a dispute', example: 'Mediation helped the two parties reach an agreement.', pronunciation: '/ˌmiːdiˈeɪʃn/' },
      { word: 'Compromise', definition: 'An agreement where both sides make concessions', example: 'Finding a compromise is key to resolving conflicts.', pronunciation: '/ˈkɒmprəmaɪz/' },
      { word: 'Empathy', definition: 'The ability to understand another person\'s feelings', example: 'Showing empathy can de-escalate tense situations.', pronunciation: '/ˈempəθi/' },
      { word: 'De-escalate', definition: 'To reduce the intensity of a conflict', example: 'Calm language helps de-escalate arguments.', pronunciation: '/diːˈeskəleɪt/' },
      { word: 'Grievance', definition: 'A formal complaint about unfair treatment', example: 'She filed a grievance with the human resources department.', pronunciation: '/ˈɡriːvəns/' },
      { word: 'Reconciliation', definition: 'Restoring friendly relations after a conflict', example: 'Reconciliation requires both sides to forgive.', pronunciation: '/ˌrekənˈsɪliˈeɪʃn/' },
      { word: 'Arbitration', definition: 'A process where a third party makes a binding decision', example: 'The dispute was settled through arbitration.', pronunciation: '/ˌɑːrbɪˈtreɪʃn/' },
      { word: 'Assertive', definition: 'Expressing your views confidently without aggression', example: 'Being assertive means standing up for yourself respectfully.', pronunciation: '/əˈsɜːrtɪv/' },
      { word: 'Collaborate', definition: 'To work together toward a shared goal', example: 'Collaborating helps find solutions that benefit everyone.', pronunciation: '/kəˈlæbəreɪt/' },
      { word: 'Common ground', definition: 'Shared interests or opinions between opposing sides', example: 'Finding common ground is the first step to resolving conflict.', pronunciation: '/ˈkɒmən ɡraʊnd/' }
    ],
    'Cross-Cultural Communication': [
      { word: 'Cultural awareness', definition: 'Understanding and respecting different cultural practices', example: 'Cultural awareness is essential in international business.', pronunciation: '/ˈkʌltʃərəl əˈwernəs/' },
      { word: 'Nonverbal', definition: 'Communication without words (gestures, facial expressions)', example: 'Nonverbal cues vary across cultures.', pronunciation: '/nɒnˈvɜːrbəl/' },
      { word: 'High-context', definition: 'Communication where meaning depends heavily on context', example: 'Japanese culture is high-context — meaning comes from relationships.', pronunciation: '/haɪ ˈkɒntekst/' },
      { word: 'Low-context', definition: 'Communication where meaning is explicitly stated', example: 'American culture is low-context — messages are direct.', pronunciation: '/loʊ ˈkɒntekst/' },
      { word: 'Protocol', definition: 'The formal rules of behavior in diplomatic settings', example: 'Follow the protocol when meeting international partners.', pronunciation: '/ˈproʊtəkɒl/' },
      { word: 'Misinterpretation', definition: 'Understanding something incorrectly', example: 'Misinterpretation can lead to cultural misunderstandings.', pronunciation: '/mɪsɪnˌtɜːrprɪˈteɪʃn/' },
      { word: 'Adapt', definition: 'To adjust your behavior to suit a different culture', example: 'Successful professionals adapt to local customs.', pronunciation: '/əˈdæpt/' },
      { word: 'Respect', definition: 'Showing consideration and appreciation for others', example: 'Show respect for local traditions when visiting a new country.', pronunciation: '/rɪˈspekt/' },
      { word: 'Inclusive', definition: 'Including people from all backgrounds', example: 'An inclusive workplace values diversity.', pronunciation: '/ɪnˈkluːsɪv/' },
      { word: 'Cultural competence', definition: 'The ability to interact effectively with people from different cultures', example: 'Cultural competence improves international collaboration.', pronunciation: '/ˈkʌltʃərəl ˈkɒmpɪtəns/' }
    ],
    'Classical Rhetoric': [
      { word: 'Ethos', definition: 'An appeal to credibility or character', example: 'The speaker established ethos by citing her decades of research.', pronunciation: '/ˈiːθɒs/' },
      { word: 'Pathos', definition: 'An appeal to emotion', example: 'The orator used pathos to move the audience to tears.', pronunciation: '/ˈpeɪθɒs/' },
      { word: 'Logos', definition: 'An appeal to logic and reason', example: 'The argument relied on logos through statistical evidence.', pronunciation: '/ˈloʊɡɒs/' },
      { word: 'Orator', definition: 'A skilled public speaker', example: 'Cicero was one of the greatest orators in history.', pronunciation: '/ˈɒrətər/' },
      { word: 'Canons of rhetoric', definition: 'The five principles: invention, arrangement, style, memory, delivery', example: 'The canons of rhetoric provide a framework for persuasive speech.', pronunciation: '/ˈkænənz ɒv ˈretərɪk/' },
      { word: 'Enthymeme', definition: 'A syllogism with an unstated premise', example: 'An enthymeme assumes the audience will fill in the missing premise.', pronunciation: '/ˈenθɪmiːm/' },
      { word: 'Kairos', definition: 'The opportune moment for persuasion', example: 'Understanding kairos means knowing when to deliver your message.', pronunciation: '/ˈkaɪrɒs/' },
      { word: 'Stasis', definition: 'The core point of contention in an argument', example: 'Identifying the stasis helps focus the debate.', pronunciation: '/ˈsteɪsɪs/' },
      { word: 'Topos', definition: 'A common topic or line of argument in rhetoric', example: 'The topos of comparison is frequently used in legal arguments.', pronunciation: '/ˈtɒpɒs/' },
      { word: 'Dispositio', definition: 'The arrangement of arguments in a rhetorical work', example: 'Dispositio determines the order and structure of your argument.', pronunciation: '/ˌdɪspəˈzɪʃioʊ/' }
    ],
    'Logical Fallacies': [
      { word: 'Ad hominem', definition: 'Attacking the person instead of their argument', example: 'That is an ad hominem fallacy — address the argument, not the person.', pronunciation: '/æd ˈhɒmɪnem/' },
      { word: 'Straw man', definition: 'Misrepresenting someone\'s argument to make it easier to attack', example: 'He created a straw man by exaggerating her position.', pronunciation: '/strɔː mæn/' },
      { word: 'Slippery slope', definition: 'Suggesting one action will lead to extreme consequences', example: 'The slippery slope fallacy assumes unlikely chains of events.', pronunciation: '/ˈslɪpəri sloʊp/' },
      { word: 'False dichotomy', definition: 'Presenting only two options when more exist', example: 'The argument is a false dichotomy — there are other possibilities.', pronunciation: '/fɔːls daɪˈkɒtəmi/' },
      { word: 'Circular reasoning', definition: 'Using the conclusion as a premise', example: 'Circular reasoning assumes what it is trying to prove.', pronunciation: '/ˈsɜːrkjələr ˈriːzənɪŋ/' },
      { word: 'Hasty generalization', definition: 'Drawing a conclusion from insufficient evidence', example: 'Concluding all dogs are aggressive from one incident is a hasty generalization.', pronunciation: '/ˈheɪsti ˌdʒenərəlaɪˈzeɪʃn/' },
      { word: 'Red herring', definition: 'Introducing irrelevant information to distract', example: 'The politician used a red herring to avoid the question.', pronunciation: '/red ˈherɪŋ/' },
      { word: 'Appeal to authority', definition: 'Using an authority figure as evidence when they are not qualified', example: 'An appeal to authority is fallacious if the expert is not relevant.', pronunciation: '/əˈpiːl tuː ɔːˈθɒrəti/' },
      { word: 'Post hoc', definition: 'Assuming cause and effect from mere sequence', example: 'Post hoc reasoning assumes causation from mere sequence.', pronunciation: '/poʊst hɒk/' },
      { word: 'Bandwagon', definition: 'Claiming something is true because many people believe it', example: 'The bandwagon fallacy confuses popularity with truth.', pronunciation: '/ˈbændˌwæɡən/' }
    ],
    'Argumentation Theory': [
      { word: 'Premise', definition: 'A statement that supports a conclusion', example: 'Every argument requires at least one premise.', pronunciation: '/ˈpremɪs/' },
      { word: 'Deductive', definition: 'Reasoning from general principles to specific conclusions', example: 'Deductive reasoning guarantees the conclusion if the premises are true.', pronunciation: '/dɪˈdʌktɪv/' },
      { word: 'Inductive', definition: 'Reasoning from specific observations to general principles', example: 'Inductive reasoning produces probable but not certain conclusions.', pronunciation: '/ɪnˈdʌktɪv/' },
      { word: 'Validity', definition: 'The logical correctness of an argument\'s structure', example: 'A valid argument follows logically from its premises.', pronunciation: '/vəˈlɪdəti/' },
      { word: 'Soundness', definition: 'An argument that is both valid and has true premises', example: 'Soundness requires both valid logic and factual premises.', pronunciation: '/ˈsaʊndnəs/' },
      { word: 'Warrant', definition: 'The logical connection between a claim and its evidence', example: 'The warrant explains why the evidence supports the claim.', pronunciation: '/ˈwɒrənt/' },
      { word: 'Rebuttal', definition: 'A counterargument that challenges an opposing claim', example: 'A strong rebuttal addresses the specific points of the argument.', pronunciation: '/rɪˈbʌtl/' },
      { word: 'Qualifier', definition: 'A word or phrase that limits the scope of a claim', example: 'Adding a qualifier like "usually" makes a claim more defensible.', pronunciation: '/ˈkwɒlɪfaɪər/' },
      { word: 'Toulmin model', definition: 'A framework for analyzing arguments with six components', example: 'The Toulmin model breaks arguments into claim, data, warrant, backing, qualifier, and rebuttal.', pronunciation: '/ˈtuːlmɪn ˈmɒdl/' },
      { word: 'Syllogism', definition: 'A form of deductive reasoning with major premise, minor premise, and conclusion', example: 'All men are mortal; Socrates is a man; therefore Socrates is mortal.', pronunciation: '/ˈsɪlədʒɪzəm/' }
    ],
    'Persuasive Writing': [
      { word: 'Thesis', definition: 'The central claim of a persuasive piece', example: 'A strong thesis is specific, arguable, and well-supported.', pronunciation: '/ˈθiːsɪs/' },
      { word: 'Call to action', definition: 'A statement urging the reader to take a specific step', example: 'End your persuasive essay with a compelling call to action.', pronunciation: '/kɔːl tuː ˈækʃn/' },
      { word: 'Concession', definition: 'Acknowledging an opposing viewpoint', example: 'Making a concession shows you understand the other side.', pronunciation: '/kənˈseʃn/' },
      { word: 'Rebuttal', definition: 'A response that refutes an opposing argument', example: 'After the concession, present your rebuttal.', pronunciation: '/rɪˈbʌtl/' },
      { word: 'Persuade', definition: 'To convince someone to adopt a viewpoint or take action', example: 'The goal of persuasive writing is to persuade the reader.', pronunciation: '/pərˈsweɪd/' },
      { word: 'Rhetorical strategy', definition: 'A deliberate technique used to influence the audience', example: 'Choosing the right rhetorical strategy depends on your audience.', pronunciation: '/rɪˈtɒrɪkl ˈstrætədʒi/' },
      { word: 'Proposition', definition: 'A statement or claim put forward for consideration', example: 'The proposition must be clear and debatable.', pronunciation: '/ˌprɒpəˈzɪʃn/' },
      { word: 'Evidence', definition: 'Facts, statistics, or examples supporting a claim', example: 'Credible evidence strengthens your persuasive argument.', pronunciation: '/ˈevɪdəns/' },
      { word: 'Persuasive appeal', definition: 'A method of influencing the audience (ethos, pathos, logos)', example: 'Effective persuasive writing uses all three appeals.', pronunciation: '/pərˈsweɪsɪv əˈpiːl/' },
      { word: 'Counterargument', definition: 'An argument opposing your thesis', example: 'Addressing a counterargument makes your writing more convincing.', pronunciation: '/ˌkaʊntərˈɑːrɡjumənt/' }
    ],
    'Debate Mastery': [
      { word: 'Motion', definition: 'The topic or statement being debated', example: 'The motion for today\'s debate is: education should be free.', pronunciation: '/ˈmoʊʃn/' },
      { word: 'Affirmative', definition: 'The side supporting the motion', example: 'The affirmative team presented the first argument.', pronunciation: '/əˈfɜːrmətɪv/' },
      { word: 'Negative', definition: 'The side opposing the motion', example: 'The negative team argued against the proposal.', pronunciation: '/ˈneɡətɪv/' },
      { word: 'Point of information', definition: 'A question or comment offered during a debate speech', example: 'May I offer a point of information?', pronunciation: '/pɔɪnt ɒv ˌɪnfərˈmeɪʃn/' },
      { word: 'Clash', definition: 'Direct disagreement between opposing arguments', example: 'Good debates feature strong clash between viewpoints.', pronunciation: '/klæʃ/' },
      { word: 'Impact', definition: 'The significance or consequence of an argument', example: 'Always explain the impact of your arguments.', pronunciation: '/ˈɪmpækt/' },
      { word: 'Extension', definition: 'New arguments or analysis added by the second speaker', example: 'The extension must bring something new to the debate.', pronunciation: '/ɪkˈstenʃn/' },
      { word: 'Weighing', definition: 'Comparing the importance of different arguments', example: 'Weighing the arguments means showing why yours matter most.', pronunciation: '/ˈweɪɪŋ/' },
      { word: 'Framing', definition: 'The way an issue is presented or defined', example: 'Framing the debate correctly gives you an advantage.', pronunciation: '/ˈfreɪmɪŋ/' },
      { word: 'Adjudicate', definition: 'To judge and decide the outcome of a debate', example: 'The panel will adjudicate based on argument strength.', pronunciation: '/əˈdʒuːdɪkeɪt/' }
    ],
    'Narrative Techniques': [
      { word: 'Stream of consciousness', definition: 'A narrative style presenting a character\'s flowing thoughts', example: 'Virginia Woolf used stream of consciousness in her novels.', pronunciation: '/striːm ɒv ˈkɒnʃəsnəs/' },
      { word: 'Unreliable narrator', definition: 'A narrator whose credibility is questionable', example: 'Poe uses an unreliable narrator in "The Tell-Tale Heart."', pronunciation: '/ʌnriˈlaɪəbl ˈnæreɪtər/' },
      { word: 'Foreshadowing', definition: 'Hints about events that will occur later', example: 'Foreshadowing creates suspense and anticipation.', pronunciation: '/fɔːrˈʃædoʊɪŋ/' },
      { word: 'Non-linear', definition: 'A narrative that does not follow chronological order', example: 'The film uses a non-linear narrative.', pronunciation: '/nɒn ˈlɪniər/' },
      { word: 'Epistolary', definition: 'A novel told through letters or documents', example: 'Dracula is an epistolary novel.', pronunciation: '/ɪˈpɪstələri/' },
      { word: 'Point of view', definition: 'The perspective from which a story is told', example: 'First-person point of view uses "I" throughout.', pronunciation: '/pɔɪnt ɒv vjuː/' },
      { word: 'Motif', definition: 'A recurring element with symbolic significance', example: 'Water is a motif representing rebirth in the novel.', pronunciation: '/moʊˈtiːf/' },
      { word: 'Juxtaposition', definition: 'Placing two elements side by side for contrast', example: 'The juxtaposition of wealth and poverty highlights inequality.', pronunciation: '/ˌdʒʌkstəpəˈzɪʃn/' },
      { word: 'Subtext', definition: 'The underlying meaning beneath the surface text', example: 'The dialogue\'s subtext reveals the characters\' true feelings.', pronunciation: '/ˈsʌbtekst/' },
      { word: 'Pacing', definition: 'The speed at which a story unfolds', example: 'Effective pacing keeps readers engaged.', pronunciation: '/ˈpeɪsɪŋ/' }
    ],
    'Postmodern Literature': [
      { word: 'Metafiction', definition: 'Fiction that draws attention to its own artificiality', example: 'Metafiction reminds readers they are reading a constructed story.', pronunciation: '/ˌmetəˈfɪkʃn/' },
      { word: 'Intertextuality', definition: 'The relationship between texts that reference each other', example: 'The novel\'s intertextuality includes references to mythology.', pronunciation: '/ˌɪntərˌtekstʃuˈæləti/' },
      { word: 'Deconstruction', definition: 'Analyzing texts to reveal hidden contradictions', example: 'Derrida\'s deconstruction challenges the stability of meaning.', pronunciation: '/ˌdiːkənˈstrʌkʃn/' },
      { word: 'Pastiche', definition: 'A work that imitates the style of other works', example: 'The novel is a pastiche of Victorian detective fiction.', pronunciation: '/pæˈstiːʃ/' },
      { word: 'Fragmentation', definition: 'Breaking narrative or identity into disconnected pieces', example: 'Fragmentation reflects the postmodern experience.', pronunciation: '/ˌfræɡmenˈteɪʃn/' },
      { word: 'Irony', definition: 'A contrast between expectation and reality, often humorous', example: 'Postmodern literature uses deep irony to question truth.', pronunciation: '/ˈaɪrəni/' },
      { word: 'Hyperreality', definition: 'When the distinction between reality and simulation blurs', example: 'Baudrillard\'s hyperreality describes a world of signs.', pronunciation: '/ˌhaɪpəriˈæləti/' },
      { word: 'Parody', definition: 'An imitation designed to ridicule or comment on the original', example: 'The novel is a parody of romantic fiction conventions.', pronunciation: '/ˈpærədi/' },
      { word: 'Multiplicity', definition: 'The existence of many meanings or perspectives', example: 'Postmodern texts embrace multiplicity over single interpretations.', pronunciation: '/ˌmʌltɪˈplɪsəti/' },
      { word: 'Simulacrum', definition: 'A copy without an original', example: 'The theme park is a simulacrum of reality.', pronunciation: '/ˌsɪmjuˈleɪkrəm/' }
    ],
    'Comparative Literature': [
      { word: 'Comparative', definition: 'Involving the comparison of different literary traditions', example: 'Comparative literature explores connections between national literatures.', pronunciation: '/kəmˈpærətɪv/' },
      { word: 'Translation studies', definition: 'The academic study of translation theory and practice', example: 'Translation studies examines how meaning transfers across languages.', pronunciation: '/trænsˈleɪʃn ˈstʌdiz/' },
      { word: 'Canon', definition: 'A collection of works considered essential', example: 'The Western canon has been expanded to include diverse voices.', pronunciation: '/ˈkænən/' },
      { word: 'World literature', definition: 'Literary works from all cultures considered as a whole', example: 'World literature encourages reading beyond national boundaries.', pronunciation: '/wɜːrld ˈlɪtrətʃər/' },
      { word: 'Reception theory', definition: 'The study of how readers interpret texts', example: 'Reception theory emphasizes the role of the reader.', pronunciation: '/rɪˈsepʃn ˈθɪəri/' },
      { word: 'Influence', definition: 'The effect of one writer or tradition on another', example: 'Shakespeare\'s influence on world literature is immeasurable.', pronunciation: '/ˈɪnfluəns/' },
      { word: 'Cross-cultural', definition: 'Involving or comparing different cultures', example: 'Cross-cultural analysis reveals shared themes.', pronunciation: '/krɒs ˈkʌltʃərəl/' },
      { word: 'Orientalism', definition: 'The Western representation of Eastern cultures, often stereotyped', example: 'Said\'s Orientalism critiques how the West perceives the East.', pronunciation: '/ˌɔːriˈentəlɪzəm/' },
      { word: 'Diaspora', definition: 'The dispersion of a people from their original homeland', example: 'Diaspora literature explores identity and belonging.', pronunciation: '/daɪˈæspərə/' },
      { word: 'Periodization', definition: 'The division of literary history into periods', example: 'Periodization helps organize literary history but can oversimplify.', pronunciation: '/ˌpɪriədaɪˈzeɪʃn/' }
    ],
    'Literary Criticism': [
      { word: 'Feminist criticism', definition: 'Analyzing literature through the lens of gender and power', example: 'Feminist criticism examines how literature represents women.', pronunciation: '/ˈfemɪnɪst ˈkrɪtɪsɪzəm/' },
      { word: 'Marxist criticism', definition: 'Analyzing literature in terms of class and economics', example: 'Marxist criticism explores how literature reflects social class.', pronunciation: '/ˈmɑːrksɪst ˈkrɪtɪsɪzəm/' },
      { word: 'Psychoanalytic', definition: 'Interpreting literature through psychological theories', example: 'Psychoanalytic criticism explores characters\' unconscious motivations.', pronunciation: '/ˌsaɪkoʊˌænəˈlɪtɪk/' },
      { word: 'Structuralism', definition: 'Analyzing the underlying structures of narratives', example: 'Structuralism seeks universal patterns in storytelling.', pronunciation: '/ˈstrʌktʃərəlɪzəm/' },
      { word: 'Postcolonialism', definition: 'Examining the cultural legacy of colonialism in literature', example: 'Postcolonial criticism addresses the effects of imperialism.', pronunciation: '/poʊst kəˈloʊniəlɪzəm/' },
      { word: 'Reader-response', definition: 'A theory focusing on the reader\'s experience', example: 'Reader-response criticism values the reader\'s interpretation.', pronunciation: '/ˈriːdər rɪˈspɒns/' },
      { word: 'New Historicism', definition: 'Reading literary texts alongside historical documents', example: 'New Historicism considers the cultural context of literary works.', pronunciation: '/njuː hɪˈstɒrɪsɪzəm/' },
      { word: 'Ecocriticism', definition: 'The study of literature and the environment', example: 'Ecocriticism examines how nature is represented in texts.', pronunciation: '/ˈiːkoʊˌkrɪtɪsɪzəm/' },
      { word: 'Hermeneutics', definition: 'The theory and methodology of interpretation', example: 'Hermeneutics provides a framework for understanding texts.', pronunciation: '/ˌhɜːrməˈnjuːtɪks/' },
      { word: 'Close reading', definition: 'A detailed analysis of a text\'s language and structure', example: 'Close reading reveals layers of meaning in a poem.', pronunciation: '/kloʊs ˈriːdɪŋ/' }
    ],
    'Creative Non-Fiction': [
      { word: 'Memoir', definition: 'A personal account of a specific period in the author\'s life', example: 'Her memoir about growing up in wartime is deeply moving.', pronunciation: '/ˈmemwɑːr/' },
      { word: 'Narrative journalism', definition: 'Reporting that uses storytelling techniques', example: 'Narrative journalism brings real events to life.', pronunciation: '/ˈnærətɪv ˈdʒɜːrnəlɪzəm/' },
      { word: 'Personal essay', definition: 'An essay exploring the author\'s personal experience', example: 'The personal essay blends reflection with storytelling.', pronunciation: '/ˈpɜːrsənl ˈeseɪ/' },
      { word: 'Literary journalism', definition: 'Journalism that employs literary devices', example: 'Literary journalism combines factual reporting with narrative art.', pronunciation: '/ˈlɪtərəri ˈdʒɜːrnəlɪzəm/' },
      { word: 'Travel writing', definition: 'Writing about journeys and destinations', example: 'Travel writing blends description with cultural observation.', pronunciation: '/ˈtrævl ˈraɪtɪŋ/' },
      { word: 'Vignette', definition: 'A brief, evocative description or scene', example: 'Each chapter is a vignette capturing a moment in time.', pronunciation: '/vɪnˈjet/' },
      { word: 'Autobiography', definition: 'An account of a person\'s entire life by themselves', example: 'The autobiography covers her childhood through her career.', pronunciation: '/ˌɔːtəbaɪˈɒɡrəfi/' },
      { word: 'Reflection', definition: 'Careful thought about an experience', example: 'Good creative non-fiction includes deep reflection.', pronunciation: '/rɪˈflekʃn/' },
      { word: 'Observation', definition: 'A detailed description of what is seen', example: 'Keen observation makes non-fiction writing vivid.', pronunciation: '/ˌɒbzərˈveɪʃn/' },
      { word: 'Authenticity', definition: 'Being genuine and true to the experience', example: 'Authenticity is the foundation of compelling creative non-fiction.', pronunciation: '/ˌɔːθenˈtɪsəti/' }
    ],
    'Research Paper Writing': [
      { word: 'Abstract', definition: 'A concise summary of the research paper', example: 'The abstract should be no more than 250 words.', pronunciation: '/ˈæbstrækt/' },
      { word: 'Introduction', definition: 'The opening section that presents the research question', example: 'The introduction establishes the context and significance.', pronunciation: '/ˌɪntrəˈdʌkʃn/' },
      { word: 'Methodology', definition: 'The section describing the research methods', example: 'The methodology must be detailed enough to replicate.', pronunciation: '/ˌmeθəˈdɒlədʒi/' },
      { word: 'Results', definition: 'The section presenting the research findings', example: 'The results section reports data without interpretation.', pronunciation: '/rɪˈzʌlts/' },
      { word: 'Discussion', definition: 'The section interpreting the results', example: 'The discussion connects findings to the research question.', pronunciation: '/dɪˈskʌʃn/' },
      { word: 'Limitation', definition: 'A weakness or constraint of the study', example: 'Acknowledging limitations demonstrates academic honesty.', pronunciation: '/ˌlɪmɪˈteɪʃn/' },
      { word: 'Implication', definition: 'A possible effect or outcome of the research', example: 'The implications affect public health policy.', pronunciation: '/ˌɪmplɪˈkeɪʃn/' },
      { word: 'Keywords', definition: 'Terms that describe the main topics of a paper', example: 'Choose keywords that help researchers find your paper.', pronunciation: '/ˈkiːwɜːrdz/' },
      { word: 'Reference list', definition: 'A complete list of sources cited in the paper', example: 'The reference list must follow the required citation style.', pronunciation: '/ˈrefərəns lɪst/' },
      { word: 'Formatting', definition: 'The layout and style of the document', example: 'Follow the journal\'s formatting guidelines precisely.', pronunciation: '/ˈfɔːrmætɪŋ/' }
    ],
    'Statistical Language': [
      { word: 'Correlation', definition: 'A statistical relationship between two variables', example: 'There is a strong correlation between education and income.', pronunciation: '/ˌkɒrəˈleɪʃn/' },
      { word: 'Significance', definition: 'The probability that a result is not due to chance', example: 'The results reached statistical significance.', pronunciation: '/sɪɡˈnɪfɪkəns/' },
      { word: 'Variance', definition: 'The spread of data points around the mean', example: 'High variance indicates the data is widely spread.', pronunciation: '/ˈveriəns/' },
      { word: 'Distribution', definition: 'How data is spread across different values', example: 'A normal distribution forms a bell curve.', pronunciation: '/ˌdɪstrɪˈbjuːʃn/' },
      { word: 'Regression', definition: 'A method for modeling relationships between variables', example: 'Linear regression predicts outcomes based on one variable.', pronunciation: '/rɪˈɡreʃn/' },
      { word: 'Hypothesis testing', definition: 'A procedure for determining statistical significance', example: 'Hypothesis testing helps researchers draw conclusions.', pronunciation: '/haɪˈpɒθəsɪs ˈtestɪŋ/' },
      { word: 'Standard deviation', definition: 'A measure of how much data varies from the average', example: 'A low standard deviation means data clusters around the mean.', pronunciation: '/ˈstændərd ˌdiːviˈeɪʃn/' },
      { word: 'Probability', definition: 'The likelihood of an event occurring', example: 'The probability is expressed as a decimal.', pronunciation: '/ˌprɒbəˈbɪləti/' },
      { word: 'Sample size', definition: 'The number of participants in a study', example: 'A larger sample size increases reliability.', pronunciation: '/ˈsæmpl saɪz/' },
      { word: 'Confidence interval', definition: 'A range of values likely to contain the true value', example: 'The 95% confidence interval ranges from 2.1 to 3.5.', pronunciation: '/ˈkɒnfɪdəns ˈɪntərvl/' }
    ],
    'Scientific Ethics': [
      { word: 'Integrity', definition: 'Adherence to moral and ethical principles', example: 'Scientific integrity requires honest reporting of results.', pronunciation: '/ɪnˈteɡrəti/' },
      { word: 'Fabrication', definition: 'Inventing data or results', example: 'Data fabrication is a serious violation of scientific ethics.', pronunciation: '/ˌfæbrɪˈkeɪʃn/' },
      { word: 'Falsification', definition: 'Manipulating data to support a desired conclusion', example: 'Falsification undermines the credibility of research.', pronunciation: '/ˌfɔːlsɪfɪˈkeɪʃn/' },
      { word: 'Plagiarism', definition: 'Using someone else\'s work without attribution', example: 'Plagiarism is considered academic misconduct.', pronunciation: '/ˈpleɪdʒərɪzəm/' },
      { word: 'Informed consent', definition: 'Permission obtained after explaining all relevant facts', example: 'Informed consent is required for human participant research.', pronunciation: '/ɪnˈfɔːrmd kənˈsent/' },
      { word: 'Conflict of interest', definition: 'A situation where personal interests could affect judgment', example: 'Researchers must disclose any conflict of interest.', pronunciation: '/ˈkɒnflɪkt ɒv ˈɪntərəst/' },
      { word: 'Anonymity', definition: 'The state of being unidentified', example: 'Anonymity protects participants\' identities in research.', pronunciation: '/ˌænəˈnɪməti/' },
      { word: 'Whistleblower', definition: 'A person who reports unethical behavior', example: 'The whistleblower exposed the data manipulation.', pronunciation: '/ˈwɪslˌbloʊər/' },
      { word: 'Reproducibility', definition: 'The ability of a study to be repeated with the same results', example: 'Reproducibility is a cornerstone of scientific credibility.', pronunciation: '/rɪˌproʊdjuːsəˈbɪləti/' },
      { word: 'Institutional review', definition: 'Oversight by a committee ensuring ethical research', example: 'The study was approved by the institutional review board.', pronunciation: '/ˌɪnstɪˈtjuːʃənl rɪˈvjuː/' }
    ],
    'Grant Writing': [
      { word: 'Grant', definition: 'A sum of money given for a specific purpose', example: 'The university received a grant for cancer research.', pronunciation: '/ɡrænt/' },
      { word: 'Proposal', definition: 'A formal application for funding', example: 'The grant proposal outlines the research plan and budget.', pronunciation: '/prəˈpoʊzl/' },
      { word: 'Funding agency', definition: 'An organization that provides financial support', example: 'The funding agency reviews all proposals annually.', pronunciation: '/ˈfʌndɪŋ ˈeɪdʒənsi/' },
      { word: 'Budget', definition: 'A detailed plan of how funds will be spent', example: 'The budget must align with the project objectives.', pronunciation: '/ˈbʌdʒɪt/' },
      { word: 'Deliverable', definition: 'A tangible outcome required by the grant', example: 'The final report is a key deliverable.', pronunciation: '/dɪˈlɪvərəbl/' },
      { word: 'Timeline', definition: 'A schedule of project milestones and deadlines', example: 'The timeline shows when each phase will be completed.', pronunciation: '/ˈtaɪmlaɪn/' },
      { word: 'Evaluation', definition: 'An assessment of the project\'s effectiveness', example: 'The evaluation plan measures outcomes against objectives.', pronunciation: '/ɪˌvæljuˈeɪʃn/' },
      { word: 'Sustainability plan', definition: 'A strategy for continuing after funding ends', example: 'The sustainability plan ensures long-term impact.', pronunciation: '/səˌsteɪnəˈbɪləti plæn/' },
      { word: 'Matching funds', definition: 'Money that the applicant contributes alongside the grant', example: 'Some grants require matching funds from the institution.', pronunciation: '/ˈmætʃɪŋ fʌndz/' },
      { word: 'Letter of intent', definition: 'A preliminary document expressing interest in applying', example: 'Submit a letter of intent before the full proposal.', pronunciation: '/ˈletər ɒv ɪnˈtent/' }
    ],
    'Lab Report Writing': [
      { word: 'Hypothesis', definition: 'A testable prediction made before the experiment', example: 'The hypothesis was that temperature would speed up the reaction.', pronunciation: '/haɪˈpɒθəsɪs/' },
      { word: 'Procedure', definition: 'The step-by-step method followed in the experiment', example: 'The procedure must be detailed enough for others to replicate.', pronunciation: '/prəˈsiːdʒər/' },
      { word: 'Observation', definition: 'A factual description of what occurred', example: 'Record all observations during the experiment.', pronunciation: '/ˌɒbzərˈveɪʃn/' },
      { word: 'Data analysis', definition: 'The process of interpreting experimental results', example: 'Data analysis revealed a significant trend.', pronunciation: '/ˈdeɪtə əˈnæləsɪs/' },
      { word: 'Error analysis', definition: 'An evaluation of uncertainties in the experiment', example: 'The error analysis identifies sources of measurement uncertainty.', pronunciation: '/ˈerər əˈnæləsɪs/' },
      { word: 'Control', definition: 'A standard of comparison in an experiment', example: 'The control group received no treatment.', pronunciation: '/kənˈtroʊl/' },
      { word: 'Variable', definition: 'A factor that can change in the experiment', example: 'The independent variable was the temperature.', pronunciation: '/ˈveriəbl/' },
      { word: 'Conclusion', definition: 'A summary of findings and their significance', example: 'The conclusion states whether the hypothesis was supported.', pronunciation: '/kənˈkluːʒn/' },
      { word: 'Apparatus', definition: 'The equipment used in an experiment', example: 'List all apparatus at the beginning of the lab report.', pronunciation: '/ˌæpəˈreɪtəs/' },
      { word: 'Replicate', definition: 'To repeat an experiment to verify results', example: 'The experiment was replicated three times for accuracy.', pronunciation: '/ˈreplɪkeɪt/' }
    ],
    'Executive Communication': [
      { word: 'Briefing', definition: 'A concise presentation of key information', example: 'The executive briefing covered quarterly performance.', pronunciation: '/ˈbriːfɪŋ/' },
      { word: 'Memo', definition: 'A brief written message within an organization', example: 'The CEO sent a memo outlining the new strategy.', pronunciation: '/ˈmemoʊ/' },
      { word: 'Stakeholder', definition: 'A person with an interest in the organization', example: 'Communicate changes clearly to all stakeholders.', pronunciation: '/ˈsteɪkhoʊldər/' },
      { word: 'Executive summary', definition: 'A condensed version of a longer document', example: 'The executive summary highlights key findings.', pronunciation: '/ɪɡˈzekjətɪv ˈsʌməri/' },
      { word: 'Corporate', definition: 'Relating to a large company or group', example: 'Corporate communication must be clear and professional.', pronunciation: '/ˈkɔːrpərət/' },
      { word: 'Transparency', definition: 'Openness and honesty in communication', example: 'Transparency builds trust with employees and investors.', pronunciation: '/trænsˈpærənsi/' },
      { word: 'Directive', definition: 'An official instruction from leadership', example: 'The new directive requires quarterly reporting.', pronunciation: '/dɪˈrektɪv/' },
      { word: 'C-suite', definition: 'The highest-level executives (CEO, CFO, COO, etc.)', example: 'The presentation was tailored for the C-suite audience.', pronunciation: '/siː swiːt/' },
      { word: 'Delegation', definition: 'Assigning responsibility to others', example: 'Effective delegation empowers team members.', pronunciation: '/ˌdelɪˈɡeɪʃn/' },
      { word: 'Alignment', definition: 'Ensuring all parts work toward the same goal', example: 'Strategic alignment ensures departments work cohesively.', pronunciation: '/əˈlaɪnmənt/' }
    ],
    'Board Presentations': [
      { word: 'Board of directors', definition: 'A group that oversees the management of a company', example: 'The board of directors meets quarterly to review performance.', pronunciation: '/bɔːrd ɒv dɪˈrektərz/' },
      { word: 'Governance', definition: 'The system of rules by which a company is directed', example: 'Good governance ensures accountability and transparency.', pronunciation: '/ˈɡʌvərnəns/' },
      { word: 'Fiduciary', definition: 'Relating to a duty to act in someone else\'s best interests', example: 'Board members have a fiduciary duty to shareholders.', pronunciation: '/fɪˈdjuːʃiəri/' },
      { word: 'Resolution', definition: 'A formal decision made by a board', example: 'The board passed a resolution to approve the merger.', pronunciation: '/ˌrezəˈluːʃn/' },
      { word: 'Quarterly report', definition: 'A financial update issued every three months', example: 'The quarterly report shows revenue growth of 12%.', pronunciation: '/ˈkwɔːrtərli rɪˈpɔːrt/' },
      { word: 'Key performance indicator', definition: 'A measurable value that demonstrates effectiveness', example: 'The presentation highlights key performance indicators.', pronunciation: '/kiː pərˈfɔːrməns ˈɪndɪkeɪtər/' },
      { word: 'Risk assessment', definition: 'An evaluation of potential threats', example: 'The risk assessment identifies major strategic risks.', pronunciation: '/rɪsk əˈsesmənt/' },
      { word: 'Fiscal year', definition: 'A one-year period used for financial reporting', example: 'The fiscal year ends in December for most US companies.', pronunciation: '/ˈfɪskl jɪr/' },
      { word: 'Oversight', definition: 'Supervision and monitoring of activities', example: 'The board provides oversight of executive decisions.', pronunciation: '/ˈoʊvərsaɪt/' },
      { word: 'Proxy', definition: 'Authorization for someone to vote on your behalf', example: 'Shareholders can vote by proxy if they cannot attend.', pronunciation: '/ˈprɒksi/' }
    ],
    'Legal English': [
      { word: 'Statute', definition: 'A written law passed by a legislative body', example: 'The new statute regulates data privacy.', pronunciation: '/ˈstætʃuːt/' },
      { word: 'Precedent', definition: 'A previous legal decision used as a guide', example: 'The judge cited a precedent from the Supreme Court.', pronunciation: '/ˈpresɪdənt/' },
      { word: 'Liability', definition: 'Legal responsibility for something', example: 'The company accepted liability for the accident.', pronunciation: '/ˌlaɪəˈbɪləti/' },
      { word: 'Clause', definition: 'A specific provision in a legal document', example: 'The termination clause defines how the contract can be ended.', pronunciation: '/klɔːz/' },
      { word: 'Jurisdiction', definition: 'The official power to make legal decisions', example: 'The court has jurisdiction over cases in this district.', pronunciation: '/ˌdʒʊrɪsˈdɪkʃn/' },
      { word: 'Litigation', definition: 'The process of taking legal action', example: 'The dispute was resolved without litigation.', pronunciation: '/ˌlɪtɪˈɡeɪʃn/' },
      { word: 'Compliance', definition: 'Acting in accordance with laws and regulations', example: 'The company must ensure compliance with environmental laws.', pronunciation: '/kəmˈplaɪəns/' },
      { word: 'Indemnify', definition: 'To compensate for loss or damage', example: 'The contract requires the supplier to indemnify the buyer.', pronunciation: '/ɪnˈdemnɪfaɪ/' },
      { word: 'Arbitration', definition: 'Resolving a dispute through a neutral third party', example: 'The contract includes an arbitration clause.', pronunciation: '/ˌɑːrbɪˈtreɪʃn/' },
      { word: 'Breach', definition: 'A violation of a law or contract', example: 'Failing to deliver on time constitutes a breach of contract.', pronunciation: '/briːtʃ/' }
    ],
    'Diplomatic Language': [
      { word: 'Diplomacy', definition: 'The practice of managing international relations', example: 'Effective diplomacy requires tact and cultural understanding.', pronunciation: '/dɪˈploʊməsi/' },
      { word: 'Ambassador', definition: 'The highest-ranking diplomat representing a country', example: 'The ambassador presented her credentials to the president.', pronunciation: '/æmˈbæsədər/' },
      { word: 'Treaty', definition: 'A formal agreement between nations', example: 'The peace treaty was signed by both countries.', pronunciation: '/ˈtriːti/' },
      { word: 'Sanction', definition: 'A penalty imposed by one country on another', example: 'Economic sanctions were imposed on the violating nation.', pronunciation: '/ˈsæŋkʃn/' },
      { word: 'Protocol', definition: 'The formal rules of diplomatic interaction', example: 'Diplomatic protocol dictates the order of precedence.', pronunciation: '/ˈproʊtəkɒl/' },
      { word: 'Bilateral', definition: 'Involving two parties or countries', example: 'The bilateral agreement strengthened trade relations.', pronunciation: '/baɪˈlætərəl/' },
      { word: 'Multilateral', definition: 'Involving multiple parties or countries', example: 'Multilateral negotiations involve many nations.', pronunciation: '/ˌmʌltiˈlætərəl/' },
      { word: 'Demarche', definition: 'A formal diplomatic statement of protest', example: 'The government issued a demarche over the border incident.', pronunciation: '/deɪˈmɑːrʃ/' },
      { word: 'Communique', definition: 'An official announcement or statement', example: 'The joint communique outlined the agreed terms.', pronunciation: '/kəˈmjuːnɪkeɪ/' },
      { word: 'Deterrence', definition: 'The strategy of discouraging action through fear of consequences', example: 'Nuclear deterrence is a key element of defense policy.', pronunciation: '/dɪˈterəns/' }
    ],
    'Crisis Communication': [
      { word: 'Crisis', definition: 'A time of intense difficulty or danger', example: 'Effective crisis communication can protect a company\'s reputation.', pronunciation: '/ˈkraɪsɪs/' },
      { word: 'Response plan', definition: 'A predetermined strategy for handling emergencies', example: 'Every organization should have a crisis response plan.', pronunciation: '/rɪˈspɒns plæn/' },
      { word: 'Transparency', definition: 'Open and honest communication during a crisis', example: 'Transparency is essential for maintaining public trust.', pronunciation: '/trænsˈpærənsi/' },
      { word: 'Spokesperson', definition: 'A person authorized to speak on behalf of an organization', example: 'The spokesperson addressed the media during the crisis.', pronunciation: '/ˈspoʊkspɜːrsn/' },
      { word: 'Damage control', definition: 'Actions taken to minimize negative effects', example: 'The PR team initiated damage control after the data breach.', pronunciation: '/ˈdæmɪdʒ kənˈtroʊl/' },
      { word: 'Stakeholder', definition: 'Any person or group affected by the crisis', example: 'Communicate promptly with all stakeholders.', pronunciation: '/ˈsteɪkhoʊldər/' },
      { word: 'Press release', definition: 'An official statement issued to the media', example: 'The company issued a press release addressing the incident.', pronunciation: '/pres rɪˈliːs/' },
      { word: 'Reputation', definition: 'The general perception of an organization', example: 'A crisis can damage years of built reputation.', pronunciation: '/ˌrepjuˈteɪʃn/' },
      { word: 'Mitigate', definition: 'To reduce the severity of something', example: 'Swift action can mitigate the impact of a crisis.', pronunciation: '/ˈmɪtɪɡeɪt/' },
      { word: 'After-action review', definition: 'An evaluation of what happened and improvements needed', example: 'The after-action review identified lessons for future crises.', pronunciation: '/ˈæftər ˈækʃn rɪˈvjuː/' }
    ],
    'Pragmatics': [
      { word: 'Speech act', definition: 'An utterance that performs an action', example: 'Saying "I promise" is a speech act that creates an obligation.', pronunciation: '/spiːtʃ ækt/' },
      { word: 'Implicature', definition: 'An implied meaning beyond the literal words', example: 'The implicature of "It is cold" might be a request to close the window.', pronunciation: '/ˈɪmplɪkətʃər/' },
      { word: 'Deixis', definition: 'Words whose meaning depends on context (here, there, now)', example: '"I will meet you here tomorrow" uses deixis for person, place, and time.', pronunciation: '/ˈdaɪksɪs/' },
      { word: 'Presupposition', definition: 'An assumption that underlies a statement', example: '"Have you stopped smoking?" presupposes you once smoked.', pronunciation: '/ˌpriːsʌpəˈzɪʃn/' },
      { word: 'Gricean maxims', definition: 'Principles of cooperative communication', example: 'The Gricean maxims guide effective conversation.', pronunciation: '/ˈɡriːsiən ˈmæksɪmz/' },
      { word: 'Politeness theory', definition: 'A framework for understanding social harmony in language', example: 'Politeness theory explains why we use indirect requests.', pronunciation: '/pəˈlaɪtnəs ˈθɪəri/' },
      { word: 'Face', definition: 'A person\'s public self-image', example: 'Face-saving strategies help avoid embarrassing others.', pronunciation: '/feɪs/' },
      { word: 'Relevance', definition: 'The principle that communication should be informative and relevant', example: 'Relevance theory explains how listeners interpret meaning efficiently.', pronunciation: '/ˈreləvəns/' },
      { word: 'Felicitous', definition: 'A speech act that successfully achieves its intended effect', example: 'A felicitous promise is one where the speaker genuinely intends to act.', pronunciation: '/fɪˈlɪsɪtəs/' },
      { word: 'Performative', definition: 'An utterance that itself performs an action', example: '"I now pronounce you married" is a performative utterance.', pronunciation: '/pərˈfɔːrmətɪv/' }
    ],
    'Discourse Analysis': [
      { word: 'Discourse', definition: 'Written or spoken communication in context', example: 'Discourse analysis examines how language creates meaning socially.', pronunciation: '/ˈdɪskɔːrs/' },
      { word: 'Cohesion', definition: 'Linguistic devices that connect parts of a text', example: 'Cohesion is achieved through pronouns, conjunctions, and lexical links.', pronunciation: '/koʊˈhiːʒn/' },
      { word: 'Coherence', definition: 'The logical consistency of a text', example: 'Coherence means the text makes sense as a whole.', pronunciation: '/koʊˈhɪrəns/' },
      { word: 'Genre', definition: 'A category of discourse with shared conventions', example: 'Academic articles and news reports are different genres.', pronunciation: '/ˈʒɒnrə/' },
      { word: 'Register', definition: 'A variety of language used for a particular purpose', example: 'Legal register differs significantly from casual register.', pronunciation: '/ˈredʒɪstər/' },
      { word: 'Turn-taking', definition: 'The system governing how speakers alternate in conversation', example: 'Turn-taking rules ensure orderly conversation.', pronunciation: '/tɜːrn ˈteɪkɪŋ/' },
      { word: 'Intertextuality', definition: 'The relationship between different texts', example: 'Intertextuality is a key concept in discourse analysis.', pronunciation: '/ˌɪntərˌtekstʃuˈæləti/' },
      { word: 'Critical discourse analysis', definition: 'Analyzing how language reflects and reinforces power', example: 'Critical discourse analysis reveals hidden ideologies.', pronunciation: '/ˈkrɪtɪkl ˈdɪskɔːrs əˈnæləsɪs/' },
      { word: 'Adjacency pair', definition: 'A pair of related utterances (question-answer, greeting-response)', example: 'A greeting and its response form an adjacency pair.', pronunciation: '/əˈdʒeɪsənsi per/' },
      { word: 'Frame', definition: 'A mental structure that organizes knowledge and expectations', example: 'A restaurant frame includes expectations about ordering and paying.', pronunciation: '/freɪm/' }
    ],
    'Corpus Linguistics': [
      { word: 'Corpus', definition: 'A large collection of texts used for linguistic analysis', example: 'The British National Corpus contains 100 million words.', pronunciation: '/ˈkɔːrpəs/' },
      { word: 'Concordance', definition: 'A list showing every occurrence of a word in context', example: 'A concordance reveals the typical collocations of a word.', pronunciation: '/kənˈkɔːrdəns/' },
      { word: 'Collocation', definition: 'A combination of words that frequently occur together', example: '"Make a decision" is a common collocation.', pronunciation: '/ˌkɒləˈkeɪʃn/' },
      { word: 'Frequency', definition: 'How often a word or structure appears in a corpus', example: 'Frequency data shows the most commonly used words.', pronunciation: '/ˈfriːkwənsi/' },
      { word: 'N-gram', definition: 'A sequence of n consecutive words in a text', example: 'Bigrams are 2-word n-grams; trigrams are 3-word n-grams.', pronunciation: '/ˈen ɡræm/' },
      { word: 'Token', definition: 'An individual occurrence of a word in a corpus', example: 'The sentence "the cat sat" contains four tokens.', pronunciation: '/ˈtoʊkən/' },
      { word: 'Type', definition: 'A unique word form in a corpus', example: 'In "the cat sat," there are three types.', pronunciation: '/taɪp/' },
      { word: 'Lemma', definition: 'The base form of a word (run = runs, running, ran)', example: 'The lemma "run" includes all its inflected forms.', pronunciation: '/ˈlemə/' },
      { word: 'Annotation', definition: 'Adding linguistic information to corpus data', example: 'Part-of-speech annotation tags each word with its category.', pronunciation: '/ˌænəˈteɪʃn/' },
      { word: 'KWIC', definition: 'Key Word In Context — a display format for concordance lines', example: 'KWIC format shows the search word centered with context.', pronunciation: '/keɪ wɜːrd ɪn ˈkɒntekst/' }
    ],
    'Sociolinguistics': [
      { word: 'Dialect', definition: 'A regional or social variety of a language', example: 'The dialect in Boston differs from that in Atlanta.', pronunciation: '/ˈdaɪəlekt/' },
      { word: 'Sociolect', definition: 'A variety of language associated with a social group', example: 'Professional jargon is a type of sociolect.', pronunciation: '/ˈsoʊʃioʊlekt/' },
      { word: 'Code-switching', definition: 'Alternating between two or more languages or dialects', example: 'Bilingual speakers often code-switch within conversations.', pronunciation: '/koʊd ˈswɪtʃɪŋ/' },
      { word: 'Prestige', definition: 'The social value associated with a language variety', example: 'Standard English carries more prestige in formal settings.', pronunciation: '/ˈprestiːʒ/' },
      { word: 'Language variation', definition: 'Differences in language use across social groups', example: 'Language variation studies examine how class affects speech.', pronunciation: '/ˈlæŋɡwɪdʒ ˌveriˈeɪʃn/' },
      { word: 'Pidgin', definition: 'A simplified language developed for communication between groups', example: 'A pidgin develops when speakers of different languages need to communicate.', pronunciation: '/ˈpɪdʒɪn/' },
      { word: 'Creole', definition: 'A pidgin that has developed into a native language', example: 'Haitian Creole evolved from a French-based pidgin.', pronunciation: '/ˈkriːoʊl/' },
      { word: 'Linguistic relativity', definition: 'The idea that language influences thought', example: 'Linguistic relativity suggests that language shapes perception.', pronunciation: '/lɪŋˈɡwɪstɪk ˌreləˈtɪvəti/' },
      { word: 'Diglossia', definition: 'A situation where two language varieties serve different purposes', example: 'In diglossia, one variety is formal and another is everyday speech.', pronunciation: '/daɪˈɡlɒsiə/' },
      { word: 'Register', definition: 'Language adapted to a specific social context', example: 'The register of a courtroom differs from that of a living room.', pronunciation: '/ˈredʒɪstər/' }
    ],
    'Phonological Precision': [
      { word: 'Phoneme', definition: 'The smallest unit of sound that distinguishes meaning', example: '/p/ and /b/ are separate phonemes — "pat" vs. "bat."', pronunciation: '/ˈfoʊniːm/' },
      { word: 'Allophone', definition: 'A variant pronunciation of a phoneme', example: 'The aspirated and unaspirated /p/ are allophones.', pronunciation: '/ˈæləfoʊn/' },
      { word: 'Minimal pair', definition: 'Two words differing by only one phoneme', example: '"Ship" and "sheep" form a minimal pair.', pronunciation: '/ˈmɪnɪml per/' },
      { word: 'Assimilation', definition: 'A sound changing to become more like a neighboring sound', example: 'In "input," the /n/ assimilates to /m/ before /p/.', pronunciation: '/əˌsɪməˈleɪʃn/' },
      { word: 'Elision', definition: 'The omission of a sound in speech', example: 'The elision of /t/ in "next week" is common.', pronunciation: '/ɪˈlɪʒn/' },
      { word: 'Liaison', definition: 'The linking of words in connected speech', example: 'French liaison connects the final consonant to the next vowel.', pronunciation: '/liˈeɪzɒn/' },
      { word: 'Prosody', definition: 'The rhythm, stress, and intonation patterns of speech', example: 'Prosody conveys meaning beyond individual words.', pronunciation: '/ˈprɒsədi/' },
      { word: 'Suprasegmental', definition: 'Features of speech extending beyond individual sounds', example: 'Stress and intonation are suprasegmental features.', pronunciation: '/ˌsuːprəˈseɡməntəl/' },
      { word: 'Coarticulation', definition: 'The overlapping of articulatory gestures', example: 'Coarticulation explains why the same phoneme sounds different in different contexts.', pronunciation: '/koʊɑːrˌtɪkjuˈleɪʃn/' },
      { word: 'Syllable structure', definition: 'The pattern of consonants and vowels in a syllable', example: 'English allows complex syllable structures like CCCVCCCC.', pronunciation: '/ˈsɪləbl ˈstrʌktʃər/' }
    ],
    'Global Business Culture': [
      { word: 'Cultural intelligence', definition: 'The ability to work effectively across cultures', example: 'Cultural intelligence is essential for international leaders.', pronunciation: '/ˈkʌltʃərəl ɪnˈtelɪdʒəns/' },
      { word: 'Glocalization', definition: 'Adapting global products to local markets', example: 'Glocalization means thinking globally but acting locally.', pronunciation: '/ˌɡloʊkəlaɪˈzeɪʃn/' },
      { word: 'Power distance', definition: 'The extent to which less powerful members accept inequality', example: 'High power distance cultures have more hierarchical organizations.', pronunciation: '/ˈpaʊər ˈdɪstəns/' },
      { word: 'Individualism', definition: 'A cultural emphasis on personal independence', example: 'Western business cultures tend to value individualism.', pronunciation: '/ˌɪndɪˈvɪdʒuəlɪzəm/' },
      { word: 'Collectivism', definition: 'A cultural emphasis on group harmony', example: 'Collectivism prioritizes team success over individual achievement.', pronunciation: '/kəˈlektɪvɪzəm/' },
      { word: 'Uncertainty avoidance', definition: 'The degree to which a culture tolerates ambiguity', example: 'High uncertainty avoidance cultures prefer clear rules.', pronunciation: '/ʌnˈsɜːrtnti əˈvɔɪdəns/' },
      { word: 'Cross-cultural', definition: 'Involving or comparing different cultures', example: 'Cross-cultural training prepares employees for international assignments.', pronunciation: '/krɒs ˈkʌltʃərəl/' },
      { word: 'Expatriate', definition: 'A person living and working outside their own country', example: 'The expatriate manager adapted to local business customs.', pronunciation: '/ɪkˈspætriət/' },
      { word: 'Negotiation style', definition: 'The approach used in business negotiations across cultures', example: 'Understanding different negotiation styles prevents misunderstandings.', pronunciation: '/nɪˌɡoʊʃiˈeɪʃn staɪl/' },
      { word: 'Cultural due diligence', definition: 'Assessing cultural factors before a business merger', example: 'Cultural due diligence is as important as financial analysis.', pronunciation: '/ˈkʌltʃərəl duː ˈdɪlɪdʒəns/' }
    ],
    'Translation Theory': [
      { word: 'Equivalence', definition: 'The degree of similarity between source and target texts', example: 'Achieving equivalence is the central challenge of translation.', pronunciation: '/ɪˈkwɪvələns/' },
      { word: 'Source text', definition: 'The original text to be translated', example: 'The translator must fully understand the source text.', pronunciation: '/sɔːrs tekst/' },
      { word: 'Target text', definition: 'The translated version of the source text', example: 'The target text should read naturally in the target language.', pronunciation: '/ˈtɑːrɡɪt tekst/' },
      { word: 'Domestication', definition: 'A strategy that adapts the text to the target culture', example: 'Domestication makes a text feel familiar to the target reader.', pronunciation: '/dəˌmestɪˈkeɪʃn/' },
      { word: 'Foreignization', definition: 'A strategy that preserves the source culture\'s differences', example: 'Foreignization retains cultural specificities of the original.', pronunciation: '/ˌfɒrɪnaɪˈzeɪʃn/' },
      { word: 'Translatability', definition: 'The extent to which a text can be translated accurately', example: 'Poetry presents challenges to translatability.', pronunciation: '/trænsˈleɪtəbɪləti/' },
      { word: 'Untranslatable', definition: 'A word or concept with no equivalent in another language', example: '"Schadenfreude" was once considered untranslatable in English.', pronunciation: '/ʌntrænsˈleɪtəbl/' },
      { word: 'Localization', definition: 'Adapting a translation for a specific locale or market', example: 'Software localization includes adapting date formats and currency.', pronunciation: '/ˌloʊkəlaɪˈzeɪʃn/' },
      { word: 'Back-translation', definition: 'Translating a text back to the original language for quality check', example: 'Back-translation helps verify accuracy.', pronunciation: '/bæk trænsˈleɪʃn/' },
      { word: 'Skopos theory', definition: 'The theory that the purpose of a translation determines the method', example: 'Skopos theory argues that the translation\'s function guides its form.', pronunciation: '/ˈskoʊpoʊs ˈθɪəri/' }
    ],
    'Localization Strategies': [
      { word: 'Localization', definition: 'Adapting content for a specific language or region', example: 'Localization includes translating and adapting cultural references.', pronunciation: '/ˌloʊkəlaɪˈzeɪʃn/' },
      { word: 'Internationalization', definition: 'Designing products to be easily adapted for different markets', example: 'Internationalization should happen before localization.', pronunciation: '/ˌɪntərˌnæʃənəlaɪˈzeɪʃn/' },
      { word: 'Locale', definition: 'A specific combination of language and region', example: 'en-US and en-GB are different locales.', pronunciation: '/loʊˈkæl/' },
      { word: 'Cultural adaptation', definition: 'Modifying content to suit local customs', example: 'Cultural adaptation may involve changing images or symbols.', pronunciation: '/ˈkʌltʃərəl ˌædæpˈteɪʃn/' },
      { word: 'Unicode', definition: 'A computing standard for representing text in different scripts', example: 'Unicode supports characters from all writing systems.', pronunciation: '/ˈjuːnɪkoʊd/' },
      { word: 'Bidirectional', definition: 'Text that can be read right to left or left to right', example: 'Arabic and Hebrew require bidirectional text support.', pronunciation: '/ˌbaɪdɪˈrekʃənl/' },
      { word: 'Date format', definition: 'The arrangement of day, month, and year in different regions', example: 'The US date format is MM/DD/YYYY; the UK uses DD/MM/YYYY.', pronunciation: '/deɪt ˈfɔːrmæt/' },
      { word: 'Content management', definition: 'Organizing and maintaining multilingual content', example: 'A content management system streamlines the localization workflow.', pronunciation: '/ˈkɒntent ˈmænɪdʒmənt/' },
      { word: 'Style guide', definition: 'A document specifying language and formatting standards', example: 'A localization style guide ensures consistency across languages.', pronunciation: '/staɪl ɡaɪd/' },
      { word: 'Quality assurance', definition: 'Processes to verify the accuracy of localized content', example: 'Quality assurance includes linguistic review and functional testing.', pronunciation: '/ˈkwɒləti əˈʃʊrəns/' }
    ],
    'Intercultural Mediation': [
      { word: 'Mediation', definition: 'Facilitating understanding between parties from different cultures', example: 'Intercultural mediation requires deep cultural understanding.', pronunciation: '/ˌmiːdiˈeɪʃn/' },
      { word: 'Cultural bridge', definition: 'A person or mechanism that connects two cultures', example: 'She served as a cultural bridge between the organizations.', pronunciation: '/ˈkʌltʃərəl brɪdʒ/' },
      { word: 'Third culture', definition: 'A shared space created by people from different cultures', example: 'The team developed a third culture that blended their perspectives.', pronunciation: '/θɜːrd ˈkʌltʃər/' },
      { word: 'Cultural frame', definition: 'The perspective through which a culture interprets events', example: 'Understanding different cultural frames prevents misunderstandings.', pronunciation: '/ˈkʌltʃərəl freɪm/' },
      { word: 'Neutral ground', definition: 'A space where no single culture dominates', example: 'The conference was held on neutral ground.', pronunciation: '/ˈnuːtrəl ɡraʊnd/' },
      { word: 'Cultural broker', definition: 'A person who interprets between cultures', example: 'The cultural broker explained the negotiation customs to both sides.', pronunciation: '/ˈkʌltʃərəl ˈbroʊkər/' },
      { word: 'Perspective-taking', definition: 'Seeing a situation from another cultural viewpoint', example: 'Perspective-taking reduces ethnocentrism in intercultural dialogue.', pronunciation: '/pərˈspektɪv ˈteɪkɪŋ/' },
      { word: 'Common ground', definition: 'Shared understanding between different cultural groups', example: 'Finding common ground is the first step in mediation.', pronunciation: '/ˈkɒmən ɡraʊnd/' },
      { word: 'Cultural lens', definition: 'The filter through which culture shapes perception', example: 'Viewing through a different cultural lens reveals new insights.', pronunciation: '/ˈkʌltʃərəl lenz/' },
      { word: 'Accommodation', definition: 'Adjusting communication style to be understood by others', example: 'Communication accommodation helps bridge cultural differences.', pronunciation: '/əˌkɒməˈdeɪʃn/' }
    ],
    'Cultural Diplomacy': [
      { word: 'Soft power', definition: 'Influence through culture and values rather than military force', example: 'Cultural exchange programs are a form of soft power.', pronunciation: '/sɒft ˈpaʊər/' },
      { word: 'Cultural exchange', definition: 'The sharing of cultural practices between nations', example: 'Cultural exchange fosters mutual understanding.', pronunciation: '/ˈkʌltʃərəl ɪksˈtʃeɪndʒ/' },
      { word: 'Cultural ambassador', definition: 'A person who promotes their culture abroad', example: 'Artists often serve as cultural ambassadors.', pronunciation: '/ˈkʌltʃərəl æmˈbæsədər/' },
      { word: 'Heritage diplomacy', definition: 'Using cultural heritage to build international relationships', example: 'Heritage diplomacy preserves shared cultural sites.', pronunciation: '/ˈherɪtɪdʒ dɪˈploʊməsi/' },
      { word: 'Nation branding', definition: 'Managing a country\'s international image', example: 'Nation branding campaigns promote tourism and investment.', pronunciation: '/ˈneɪʃn ˈbrændɪŋ/' },
      { word: 'Cultural capital', definition: 'Knowledge and skills that confer social status', example: 'Speaking multiple languages is a form of cultural capital.', pronunciation: '/ˈkʌltʃərəl ˈkæpɪtl/' },
      { word: 'Public diplomacy', definition: 'Engaging foreign publics to influence their perceptions', example: 'Public diplomacy includes educational exchange programs.', pronunciation: '/ˈpʌblɪk dɪˈploʊməsi/' },
      { word: 'Cultural policy', definition: 'Government strategies for promoting culture', example: 'The cultural policy supports artists and preserves traditions.', pronunciation: '/ˈkʌltʃərəl ˈpɒləsi/' },
      { word: 'Intercultural dialogue', definition: 'Respectful conversation between different cultural groups', example: 'Intercultural dialogue promotes peace and cooperation.', pronunciation: '/ˌɪntərˈkʌltʃərəl ˈdaɪəlɒɡ/' },
      { word: 'Mutual understanding', definition: 'Shared comprehension between different groups', example: 'Cultural diplomacy aims to build mutual understanding.', pronunciation: '/ˈmjuːtʃuəl ˌʌndərˈstændɪŋ/' }
    ],
    'Investigative Reporting': [
      { word: 'Expose', definition: 'A report revealing hidden or controversial information', example: 'The journalist wrote an expose on corporate fraud.', pronunciation: '/ɪkˈspoʊzeɪ/' },
      { word: 'Whistleblower', definition: 'A person who reveals wrongdoing within an organization', example: 'The whistleblower provided documents proving the cover-up.', pronunciation: '/ˈwɪslbloʊər/' },
      { word: 'Source', definition: 'A person who provides information to a journalist', example: 'Protecting the identity of a source is a journalistic principle.', pronunciation: '/sɔːrs/' },
      { word: 'Off the record', definition: 'Information that cannot be published or attributed', example: 'The official spoke off the record to provide background.', pronunciation: '/ɒf ðə ˈrekərd/' },
      { word: 'Freedom of information', definition: 'The right to access government-held information', example: 'The reporter filed a freedom of information request.', pronunciation: '/ˈfriːdəm ɒv ˌɪnfərˈmeɪʃn/' },
      { word: 'Document', definition: 'To record evidence through official papers', example: 'The investigation documented years of financial irregularities.', pronunciation: '/ˈdɒkjument/' },
      { word: 'Undercover', definition: 'Working secretly to gather information', example: 'The undercover investigation revealed unsafe conditions.', pronunciation: '/ˈʌndərkʌvər/' },
      { word: 'Corroboration', definition: 'Confirmation from an independent source', example: 'The story required corroboration from at least two sources.', pronunciation: '/kəˌrɒbəˈreɪʃn/' },
      { word: 'Scoop', definition: 'An exclusive news story obtained before competitors', example: 'The newspaper landed a major scoop on the scandal.', pronunciation: '/skuːp/' },
      { word: 'Shield law', definition: 'Legal protection for journalists against revealing sources', example: 'The shield law protects journalists from naming sources.', pronunciation: '/ʃiːld lɔː/' }
    ],
    'Editorial Writing': [
      { word: 'Editorial', definition: 'An article expressing the opinion of the publication', example: 'The editorial called for stricter environmental regulations.', pronunciation: '/ˌedɪˈtɔːriəl/' },
      { word: 'Op-ed', definition: 'An opinion piece written by a guest writer', example: 'She wrote an op-ed about education reform.', pronunciation: '/ɒp ed/' },
      { word: 'Columnist', definition: 'A journalist who writes regular opinion pieces', example: 'The columnist writes about politics every Monday.', pronunciation: '/ˈkɒləmnɪst/' },
      { word: 'Persuasive', definition: 'Convincing and compelling in argument', example: 'Good editorial writing is persuasive and well-reasoned.', pronunciation: '/pərˈsweɪsɪv/' },
      { word: 'Position', definition: 'A stated viewpoint on an issue', example: 'The editorial board took a clear position on the issue.', pronunciation: '/pəˈzɪʃn/' },
      { word: 'Argumentation', definition: 'The process of developing a logical argument', example: 'Strong argumentation is the backbone of editorial writing.', pronunciation: '/ˌɑːrɡjumenˈteɪʃn/' },
      { word: 'Rhetorical device', definition: 'A technique used to persuade the reader', example: 'Editorial writers use rhetorical devices to strengthen their case.', pronunciation: '/rɪˈtɒrɪkl dɪˈvaɪs/' },
      { word: 'Editorial board', definition: 'The group that decides the publication\'s editorial stance', example: 'The editorial board met to discuss the upcoming endorsement.', pronunciation: '/ˌedɪˈtɔːriəl bɔːrd/' },
      { word: 'Endorsement', definition: 'A public declaration of support', example: 'The newspaper made an endorsement in the election.', pronunciation: '/ɪnˈdɔːrsmənt/' },
      { word: 'Retraction', definition: 'A withdrawal of a previously published statement', example: 'The newspaper issued a retraction after the error was discovered.', pronunciation: '/rɪˈtrækʃn/' }
    ],
    'Broadcast English': [
      { word: 'Anchor', definition: 'The main presenter of a news program', example: 'The anchor introduced the breaking news segment.', pronunciation: '/ˈæŋkər/' },
      { word: 'Correspondent', definition: 'A journalist who reports from a specific location', example: 'Our foreign correspondent reports from Paris.', pronunciation: '/ˌkɒrɪˈspɒndənt/' },
      { word: 'Live broadcast', definition: 'A program transmitted at the time of occurrence', example: 'The live broadcast covered the election results in real time.', pronunciation: '/lɪv ˈbrɔːdkæst/' },
      { word: 'Teleprompter', definition: 'A device that displays scrolling text for presenters', example: 'The anchor read from the teleprompter during the broadcast.', pronunciation: '/ˈtelɪprɒmptər/' },
      { word: 'Soundbite', definition: 'A short clip of speech from a longer interview', example: 'The politician\'s soundbite was replayed throughout the day.', pronunciation: '/ˈsaʊndbaɪt/' },
      { word: 'Voice-over', definition: 'A narration spoken over video footage', example: 'The documentary used a voice-over to explain the context.', pronunciation: '/vɔɪs ˈoʊvər/' },
      { word: 'Breaking news', definition: 'Important news that is currently happening', example: 'The program was interrupted with breaking news.', pronunciation: '/ˈbreɪkɪŋ njuːz/' },
      { word: 'Footage', definition: 'A section of film or video recording', example: 'The footage showed the rescue operation in detail.', pronunciation: '/ˈfʊtɪdʒ/' },
      { word: 'Cue', definition: 'A signal for a presenter to begin speaking', example: 'The director gave the cue to start the segment.', pronunciation: '/kjuː/' },
      { word: 'Broadcasting', definition: 'Transmitting programs to an audience', example: 'Public broadcasting serves the educational needs of the community.', pronunciation: '/ˈbrɔːdkæstɪŋ/' }
    ],
    'Media Ethics': [
      { word: 'Impartiality', definition: 'Fairness and lack of bias in reporting', example: 'Journalists must maintain impartiality in their coverage.', pronunciation: '/ɪmˌpɑːrʃiˈæləti/' },
      { word: 'Right to privacy', definition: 'The entitlement to keep personal matters private', example: 'Media ethics requires balancing public interest with privacy.', pronunciation: '/raɪt tuː ˈpraɪvəsi/' },
      { word: 'Public interest', definition: 'The welfare of the general public', example: 'Publishing the story was justified in the public interest.', pronunciation: '/ˈpʌblɪk ˈɪntərəst/' },
      { word: 'Sensationalism', definition: 'Presenting stories to provoke excitement at the expense of accuracy', example: 'Sensationalism undermines journalistic credibility.', pronunciation: '/senˈseɪʃənəlɪzəm/' },
      { word: 'Code of ethics', definition: 'A set of principles guiding professional conduct', example: 'The code of ethics prohibits accepting gifts from sources.', pronunciation: '/koʊd ɒv ˈeθɪks/' },
      { word: 'Defamation', definition: 'Damaging someone\'s reputation through false statements', example: 'The lawsuit alleged defamation by the newspaper.', pronunciation: '/ˌdefəˈmeɪʃn/' },
      { word: 'Libel', definition: 'Written defamation', example: 'The article was found to be libelous by the court.', pronunciation: '/ˈlaɪbl/' },
      { word: 'Informed consent', definition: 'Permission given with full understanding of the consequences', example: 'Obtain informed consent before interviewing vulnerable subjects.', pronunciation: '/ɪnˈfɔːrmd kənˈsent/' },
      { word: 'Objectivity', definition: 'Presenting facts without personal bias', example: 'Objectivity is a cornerstone of professional journalism.', pronunciation: '/ˌɒbdʒekˈtɪvəti/' },
      { word: 'Accountability', definition: 'Being responsible for one\'s actions and decisions', example: 'Media organizations must practice accountability for errors.', pronunciation: '/əˌkaʊntəˈbɪləti/' }
    ],
    'Data Journalism': [
      { word: 'Dataset', definition: 'A structured collection of data', example: 'The dataset contains population statistics for every county.', pronunciation: '/ˈdeɪtəset/' },
      { word: 'Visualization', definition: 'A graphical representation of data', example: 'The visualization makes the trend easy to understand.', pronunciation: '/ˌvɪʒuəlaɪˈzeɪʃn/' },
      { word: 'Scrape', definition: 'To extract data from websites automatically', example: 'The journalist scraped public records from the government website.', pronunciation: '/skreɪp/' },
      { word: 'Open data', definition: 'Data that is freely available for anyone to use', example: 'Open data initiatives promote transparency and accountability.', pronunciation: '/ˈoʊpən ˈdeɪtə/' },
      { word: 'Infographic', definition: 'A visual image presenting information clearly', example: 'The infographic summarizes the survey results.', pronunciation: '/ˌɪnfoʊˈɡræfɪk/' },
      { word: 'Data-driven', definition: 'Based on analysis of data rather than intuition', example: 'Data-driven journalism relies on statistical analysis.', pronunciation: '/ˈdeɪtə ˈdrɪvən/' },
      { word: 'Interrogate', definition: 'To examine data closely for patterns or anomalies', example: 'The data team interrogated the financial records for discrepancies.', pronunciation: '/ɪnˈterəɡeɪt/' },
      { word: 'Methodology', definition: 'The approach used to collect and analyze data', example: 'The methodology section explains how the data was obtained.', pronunciation: '/ˌmeθəˈdɒlədʒi/' },
      { word: 'Trend analysis', definition: 'Examining data over time to identify patterns', example: 'Trend analysis shows rising temperatures over the past century.', pronunciation: '/trend əˈnæləsɪs/' },
      { word: 'Statistical significance', definition: 'The likelihood that a result is not due to chance', example: 'The findings reached statistical significance at the 95% level.', pronunciation: '/stəˈtɪstɪkl sɪɡˈnɪfɪkəns/' }
    ],
    'Ethical Frameworks': [
      { word: 'Utilitarianism', definition: 'An ethical theory that maximizes overall happiness', example: 'Utilitarianism judges actions by their consequences.', pronunciation: '/ˌjuːtɪlɪˈteəriənɪzəm/' },
      { word: 'Deontology', definition: 'An ethical theory based on duty and rules', example: 'Deontology holds that certain actions are inherently right or wrong.', pronunciation: '/ˌdiːɒnˈtɒlədʒi/' },
      { word: 'Virtue ethics', definition: 'An ethical theory focusing on character and virtues', example: 'Virtue ethics asks, "What kind of person should I be?"', pronunciation: '/ˈvɜːrtʃuː ˈeθɪks/' },
      { word: 'Consequentialism', definition: 'The theory that the outcome determines morality', example: 'Consequentialism evaluates actions based on their results.', pronunciation: '/ˌkɒnsɪˈkwenʃəlɪzəm/' },
      { word: 'Moral absolutism', definition: 'The belief that certain actions are always right or wrong', example: 'Moral absolutism holds that lying is always wrong.', pronunciation: '/ˈmɒrəl ˌæbsəˈluːtɪzəm/' },
      { word: 'Relativism', definition: 'The idea that truth and morality are relative to culture', example: 'Cultural relativism suggests that ethical standards vary by society.', pronunciation: '/ˈrelətɪvɪzəm/' },
      { word: 'Categorical imperative', definition: 'Kant\'s principle to act only by rules that could be universal laws', example: 'The categorical imperative tests whether a rule could apply to everyone.', pronunciation: '/ˌkætəˈɡɔːrɪkl ɪmˈperətɪv/' },
      { word: 'Golden rule', definition: 'Treat others as you would like to be treated', example: 'The golden rule is found in many ethical traditions.', pronunciation: '/ˈɡoʊldən ruːl/' },
      { word: 'Trolley problem', definition: 'A thought experiment about sacrificing one to save many', example: 'The trolley problem illustrates the conflict between utilitarianism and deontology.', pronunciation: '/ˈtrɒli ˈprɒbləm/' },
      { word: 'Ethical dilemma', definition: 'A situation where moral principles conflict', example: 'The doctor faced an ethical dilemma about patient confidentiality.', pronunciation: '/ˈeθɪkl dɪˈlemə/' }
    ],
    'Moral Reasoning': [
      { word: 'Moral', definition: 'Relating to principles of right and wrong', example: 'Moral reasoning involves evaluating the rightness of actions.', pronunciation: '/ˈmɒrəl/' },
      { word: 'Obligation', definition: 'A duty or commitment to act in a certain way', example: 'We have a moral obligation to help those in need.', pronunciation: '/ˌɒblɪˈɡeɪʃn/' },
      { word: 'Conscience', definition: 'An inner sense of right and wrong', example: 'Her conscience would not allow her to remain silent.', pronunciation: '/ˈkɒnʃəns/' },
      { word: 'Integrity', definition: 'Consistency in adhering to moral principles', example: 'Acting with integrity means doing the right thing even when no one is watching.', pronunciation: '/ɪnˈteɡrəti/' },
      { word: 'Rationalization', definition: 'Creating excuses for behavior against one\'s values', example: 'Rationalization allows people to justify unethical actions.', pronunciation: '/ˌræʃnəlaɪˈzeɪʃn/' },
      { word: 'Altruism', definition: 'Selfless concern for the well-being of others', example: 'Altruism drives people to help strangers without expecting return.', pronunciation: '/ˈæltruɪzəm/' },
      { word: 'Moral distress', definition: 'Discomfort from knowing the right action but being unable to take it', example: 'Nurses often experience moral distress in end-of-life situations.', pronunciation: '/ˈmɒrəl dɪˈstres/' },
      { word: 'Empathy', definition: 'The ability to understand and share the feelings of others', example: 'Empathy is fundamental to moral reasoning.', pronunciation: '/ˈempəθi/' },
      { word: 'Justice', definition: 'Fairness in the treatment of all people', example: 'Distributive justice concerns the fair allocation of resources.', pronunciation: '/ˈdʒʌstɪs/' },
      { word: 'Moral courage', definition: 'The willingness to act on principles despite risk', example: 'Whistleblowers demonstrate moral courage.', pronunciation: '/ˈmɒrəl ˈkʌrɪdʒ/' }
    ],
    'Political Philosophy': [
      { word: 'Democracy', definition: 'A system of government by the people', example: 'Democracy depends on informed citizen participation.', pronunciation: '/dɪˈmɒkrəsi/' },
      { word: 'Liberty', definition: 'The state of being free within society', example: 'Liberty and security must be carefully balanced.', pronunciation: '/ˈlɪbərti/' },
      { word: 'Justice', definition: 'The principle of fair treatment', example: 'Social justice demands equal opportunity for all citizens.', pronunciation: '/ˈdʒʌstɪs/' },
      { word: 'Sovereignty', definition: 'Supreme authority within a territory', example: 'National sovereignty is a fundamental principle of international law.', pronunciation: '/ˈsɒvrənti/' },
      { word: 'Social contract', definition: 'An implicit agreement among members of a society', example: 'The social contract theory explains why citizens accept government authority.', pronunciation: '/ˈsoʊʃl ˈkɒntrækt/' },
      { word: 'Legitimacy', definition: 'Conformity to law or accepted standards', example: 'The legitimacy of the government depends on the consent of the governed.', pronunciation: '/lɪˈdʒɪtɪməsi/' },
      { word: 'Authoritarianism', definition: 'A system favoring strict obedience to authority', example: 'Authoritarianism restricts individual freedoms.', pronunciation: '/ɔːˌθɒrɪˈteəriənɪzəm/' },
      { word: 'Liberalism', definition: 'A political philosophy emphasizing individual rights', example: 'Classical liberalism advocates for limited government intervention.', pronunciation: '/ˈlɪbərəlɪzəm/' },
      { word: 'Egalitarianism', definition: 'The belief in equality for all people', example: 'Egalitarianism promotes equal rights and opportunities.', pronunciation: '/ɪˌɡælɪˈteəriənɪzəm/' },
      { word: 'Pluralism', definition: 'A system where multiple groups coexist and share power', example: 'Political pluralism allows diverse voices in governance.', pronunciation: '/ˈplʊrəlɪzəm/' }
    ],
    'Philosophy of Language': [
      { word: 'Meaning', definition: 'The significance or interpretation of a word', example: 'The philosophy of language explores how meaning is constructed.', pronunciation: '/ˈmiːnɪŋ/' },
      { word: 'Reference', definition: 'The relationship between words and the objects they denote', example: 'The reference of "the Eiffel Tower" is the actual structure in Paris.', pronunciation: '/ˈrefərəns/' },
      { word: 'Sense', definition: 'The way a word presents its referent', example: 'Frege distinguished between sense and reference.', pronunciation: '/sens/' },
      { word: 'Truth condition', definition: 'The circumstances under which a statement is true', example: 'Understanding truth conditions is central to the philosophy of language.', pronunciation: '/truːθ kənˈdɪʃn/' },
      { word: 'Speech act', definition: 'An utterance that performs an action', example: 'Austin\'s speech act theory transformed the philosophy of language.', pronunciation: '/spiːtʃ ækt/' },
      { word: 'Signifier', definition: 'The form of a sign (the word or symbol)', example: 'Saussure distinguished the signifier from the signified.', pronunciation: '/ˈsɪɡnɪfaɪər/' },
      { word: 'Signified', definition: 'The concept or meaning that a sign refers to', example: 'The relationship between signifier and signified is arbitrary.', pronunciation: '/ˈsɪɡnɪfaɪd/' },
      { word: 'Semantic', definition: 'Relating to meaning in language', example: 'Semantic analysis examines the meaning of words and sentences.', pronunciation: '/sɪˈmæntɪk/' },
      { word: 'Pragmatic', definition: 'Relating to the use of language in context', example: 'Pragmatic analysis considers how context affects meaning.', pronunciation: '/præɡˈmætɪk/' },
      { word: 'Analytic', definition: 'A statement true by virtue of its meaning alone', example: '"All bachelors are unmarried" is an analytic truth.', pronunciation: '/ˌænəˈlɪtɪk/' }
    ],
    'Applied Ethics': [
      { word: 'Bioethics', definition: 'Ethical issues arising from advances in biology and medicine', example: 'Bioethics addresses questions about genetic engineering.', pronunciation: '/baɪoʊˈeθɪks/' },
      { word: 'Environmental ethics', definition: 'Moral principles concerning the natural environment', example: 'Environmental ethics asks what we owe to future generations.', pronunciation: '/ɪnˌvaɪrənˈmentl ˈeθɪks/' },
      { word: 'Business ethics', definition: 'Moral principles guiding business conduct', example: 'Business ethics covers topics like fair trade and corporate responsibility.', pronunciation: '/ˈbɪznəs ˈeθɪks/' },
      { word: 'Technoethics', definition: 'Ethical issues related to technology', example: 'Technoethics examines the moral implications of AI and surveillance.', pronunciation: '/ˌteknəˈeθɪks/' },
      { word: 'Normative', definition: 'Relating to how things should be, not how they are', example: 'Normative ethics prescribes what actions are right or wrong.', pronunciation: '/ˈnɔːrmətɪv/' },
      { word: 'Descriptive', definition: 'Relating to how things actually are', example: 'Descriptive ethics studies what people believe about morality.', pronunciation: '/dɪˈskrɪptɪv/' },
      { word: 'Moral agent', definition: 'A being capable of making moral decisions', example: 'Humans are moral agents because they can reason about ethics.', pronunciation: '/ˈmɒrəl ˈeɪdʒənt/' },
      { word: 'Stakeholder', definition: 'Any person or group affected by a decision', example: 'Applied ethics considers the interests of all stakeholders.', pronunciation: '/ˈsteɪkhoʊldər/' },
      { word: 'Precautionary principle', definition: 'If an action might cause harm, the burden of proof falls on those taking it', example: 'The precautionary principle guides environmental policy.', pronunciation: '/prɪˈkɔːʃəneri ˈprɪnsəpl/' },
      { word: 'Informed consent', definition: 'Agreement given with full knowledge of the risks', example: 'Informed consent is a cornerstone of medical ethics.', pronunciation: '/ɪnˈfɔːrmd kənˈsent/' }
    ],
    'CEFR C2 Preparation': [
      { word: 'Proficiency', definition: 'A high degree of competence in a language', example: 'C2 proficiency indicates near-native mastery of English.', pronunciation: '/prəˈfɪʃnsi/' },
      { word: 'Fluency', definition: 'The ability to speak smoothly and effortlessly', example: 'At C2 level, fluency includes adapting language to any context.', pronunciation: '/ˈfluːənsi/' },
      { word: 'Accuracy', definition: 'Correctness in grammar and vocabulary use', example: 'C2 requires both fluency and accuracy in all situations.', pronunciation: '/ˈækjərəsi/' },
      { word: 'Register', definition: 'A variety of language appropriate to a social context', example: 'C2 speakers can shift register effortlessly.', pronunciation: '/ˈredʒɪstər/' },
      { word: 'Nuance', definition: 'A subtle difference in meaning or expression', example: 'Understanding nuance distinguishes C2 from lower levels.', pronunciation: '/ˈnjuːɑːns/' },
      { word: 'Collocation', definition: 'Words that naturally occur together', example: 'Mastery of collocation is essential at C2 level.', pronunciation: '/ˌkɒləˈkeɪʃn/' },
      { word: 'Inference', definition: 'Understanding implied meaning', example: 'C2 learners can draw inferences from subtle linguistic cues.', pronunciation: '/ˈɪnfərəns/' },
      { word: 'Pragmatic competence', definition: 'The ability to use language appropriately in context', example: 'Pragmatic competence includes understanding humor and irony.', pronunciation: '/præɡˈmætɪk ˈkɒmpɪtəns/' },
      { word: 'Discourse marker', definition: 'A word or phrase that organizes spoken or written text', example: 'C2 speakers use discourse markers like "nevertheless" naturally.', pronunciation: '/ˈdɪskɔːrs ˈmɑːrkər/' },
      { word: 'Idiomatic', definition: 'Using expressions natural to native speakers', example: 'Idiomatic language use is expected at the C2 level.', pronunciation: '/ˌɪdiəˈmætɪk/' }
    ],
    'Proficiency Test Strategies': [
      { word: 'Time management', definition: 'Using the available exam time efficiently', example: 'Good time management ensures you complete all sections.', pronunciation: '/taɪm ˈmænɪdʒmənt/' },
      { word: 'Skimming', definition: 'Quickly reading for the main idea', example: 'Skimming helps you understand the passage before detailed reading.', pronunciation: '/ˈskɪmɪŋ/' },
      { word: 'Scanning', definition: 'Searching a text for specific information', example: 'Scanning is useful for finding names and dates quickly.', pronunciation: '/ˈskænɪŋ/' },
      { word: 'Process of elimination', definition: 'Removing unlikely answers to find the correct one', example: 'Use the process of elimination on difficult questions.', pronunciation: '/ˈprɒses ɒv ɪˌlɪmɪˈneɪʃn/' },
      { word: 'Inference strategy', definition: 'Using clues in the text to deduce meaning', example: 'The inference strategy helps when the answer is not directly stated.', pronunciation: '/ˈɪnfərəns ˈstrætədʒi/' },
      { word: 'Note-taking', definition: 'Writing key points during a listening exercise', example: 'Effective note-taking captures main ideas without writing every word.', pronunciation: '/noʊt ˈteɪkɪŋ/' },
      { word: 'Paraphrasing', definition: 'Expressing the same idea in different words', example: 'Paraphrasing is essential for the writing and speaking sections.', pronunciation: '/ˈpærəfreɪzɪŋ/' },
      { word: 'Rubric', definition: 'The criteria used to evaluate test responses', example: 'Understanding the rubric helps you know what examiners are looking for.', pronunciation: '/ˈruːbrɪk/' },
      { word: 'Mock test', definition: 'A practice exam simulating real test conditions', example: 'Take at least three mock tests before the exam date.', pronunciation: '/mɒk test/' },
      { word: 'Stamina', definition: 'The endurance to maintain focus throughout a long exam', example: 'Building stamina through practice tests is crucial for proficiency exams.', pronunciation: '/ˈstæmɪnə/' }
    ],
    'Academic Publishing Skills': [
      { word: 'Peer review', definition: 'The evaluation of research by other scholars', example: 'Navigating the peer review process is a key academic skill.', pronunciation: '/pɪr rɪˈvjuː/' },
      { word: 'Submission', definition: 'The act of sending a manuscript for consideration', example: 'The submission process requires a cover letter and formatted manuscript.', pronunciation: '/səbˈmɪʃn/' },
      { word: 'Revision', definition: 'Improving a manuscript based on feedback', example: 'A revision requires carefully addressing each reviewer comment.', pronunciation: '/rɪˈvɪʒn/' },
      { word: 'Response letter', definition: 'A document explaining how reviewer comments were addressed', example: 'The response letter should be detailed and respectful.', pronunciation: '/rɪˈspɒns ˈletər/' },
      { word: 'Cover letter', definition: 'A letter introducing the manuscript to the editor', example: 'The cover letter explains the significance of the research.', pronunciation: '/ˈkʌvər ˈletər/' },
      { word: 'Supplementary material', definition: 'Additional data supporting the main article', example: 'Supplementary material includes raw data and extended methods.', pronunciation: '/ˌsʌplɪˈmentri məˈtɪriəl/' },
      { word: 'Author guidelines', definition: 'Instructions from a journal on manuscript preparation', example: 'Always read the author guidelines before submitting.', pronunciation: '/ˈɔːθər ˈɡaɪdlaɪnz/' },
      { word: 'Proofreading', definition: 'Reading a document carefully to find errors', example: 'Proofreading the final version prevents embarrassing typos.', pronunciation: '/ˈpruːfriːdɪŋ/' },
      { word: 'Galley proof', definition: 'A preliminary version of a published article for final checking', example: 'Check the galley proof carefully before publication.', pronunciation: '/ˈɡæli pruːf/' },
      { word: 'Indexing', definition: 'The process of including a journal in academic databases', example: 'Indexing in major databases increases a journal\'s visibility.', pronunciation: '/ˈɪndeksɪŋ/' }
    ],
    'Professional Certification': [
      { word: 'Certification', definition: 'An official recognition of professional competence', example: 'Professional certification demonstrates expertise to employers.', pronunciation: '/ˌsɜːrtɪfɪˈkeɪʃn/' },
      { word: 'Accreditation', definition: 'Official recognition that an institution meets standards', example: 'The program has accreditation from the national education board.', pronunciation: '/əˌkredɪˈteɪʃn/' },
      { word: 'Continuing education', definition: 'Ongoing learning to maintain professional credentials', example: 'Many certifications require continuing education credits.', pronunciation: '/kənˈtɪnjuɪŋ ˌedʒuˈkeɪʃn/' },
      { word: 'Competency', definition: 'The ability to do something successfully', example: 'The certification exam tests core competencies.', pronunciation: '/ˈkɒmpɪtənsi/' },
      { word: 'Credential', definition: 'A qualification or achievement proving ability', example: 'A university degree is an academic credential.', pronunciation: '/krɪˈdenʃl/' },
      { word: 'Licensure', definition: 'Official permission to practice a profession', example: 'Medical licensure is required to practice as a doctor.', pronunciation: '/ˈlaɪsənʃər/' },
      { word: 'Portfolio', definition: 'A collection of work demonstrating skills and experience', example: 'A professional portfolio showcases your best projects.', pronunciation: '/pɔːrtˈfoʊlioʊ/' },
      { word: 'Endorsement', definition: 'An official statement of approval', example: 'The endorsement from the professional body adds credibility.', pronunciation: '/ɪnˈdɔːrsmənt/' },
      { word: 'Recertification', definition: 'Renewing a certification after a period of time', example: 'Recertification ensures professionals maintain current knowledge.', pronunciation: '/riːˌsɜːrtɪfɪˈkeɪʃn/' },
      { word: 'Industry standard', definition: 'A widely accepted benchmark of quality or practice', example: 'The certification meets industry standards for English proficiency.', pronunciation: '/ˈɪndəstri ˈstændərd/' }
    ],
    'Comprehensive Review': [
      { word: 'Synthesize', definition: 'To combine ideas from different sources into a coherent whole', example: 'The comprehensive review requires you to synthesize all previous learning.', pronunciation: '/ˈsɪnθəsaɪz/' },
      { word: 'Consolidate', definition: 'To strengthen and reinforce knowledge', example: 'Review sessions help consolidate what you have learned.', pronunciation: '/kənˈsɒlɪdeɪt/' },
      { word: 'Mastery', definition: 'Complete knowledge and skill in a subject', example: 'Mastery of English requires years of practice and study.', pronunciation: '/ˈmæstəri/' },
      { word: 'Proficiency', definition: 'A high degree of skill or competence', example: 'The review assesses your proficiency across all language skills.', pronunciation: '/prəˈfɪʃnsi/' },
      { word: 'Reflection', definition: 'Careful thought about your learning process', example: 'Reflection helps identify areas for improvement.', pronunciation: '/rɪˈflekʃn/' },
      { word: 'Self-assessment', definition: 'Evaluating your own abilities and progress', example: 'Self-assessment is a valuable tool for independent learning.', pronunciation: '/self əˈsesmənt/' },
      { word: 'Gap analysis', definition: 'Identifying the difference between current and desired skills', example: 'A gap analysis reveals which areas need more practice.', pronunciation: '/ɡæp əˈnæləsɪs/' },
      { word: 'Integration', definition: 'Bringing together different skills and knowledge areas', example: 'Integration of reading, writing, listening, and speaking is the goal.', pronunciation: '/ˌɪntɪˈɡreɪʃn/' },
      { word: 'Competence', definition: 'The ability to do something effectively', example: 'Communicative competence includes grammar, vocabulary, and pragmatics.', pronunciation: '/ˈkɒmpɪtəns/' },
      { word: 'Benchmark', definition: 'A standard against which things may be compared', example: 'CEFR levels provide benchmarks for language proficiency.', pronunciation: '/ˈbentʃmɑːrk/' }
    ]
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
    { word: 'Context', definition: 'The circumstances that surround a word or event', example: 'Understanding context helps you use vocabulary correctly.', pronunciation: '/ˈkɒntekst/' },
    { word: 'Convey', definition: 'To communicate or express something', example: 'Words convey meaning through their usage.', pronunciation: '/kənˈveɪ/' },
    { word: 'Grasp', definition: 'To understand something completely', example: 'She grasped the concept after the explanation.', pronunciation: '/ɡræsp/' },
    { word: 'Apply', definition: 'To put knowledge to practical use', example: 'Apply what you have learned in real conversations.', pronunciation: '/əˈplaɪ/' },
    { word: 'Retain', definition: 'To keep knowledge in your memory', example: 'Regular review helps you retain new vocabulary.', pronunciation: '/rɪˈteɪn/' },
  ];

  return JSON.stringify(fallbackWords);
}

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
