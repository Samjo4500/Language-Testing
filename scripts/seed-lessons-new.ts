import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ═══════════════════════════════════════════════════════════════
//  COMPLETE LESSON DATA — 150 lessons (50 per level)
//  First 10 per level have full content, exercises, and quizzes
//  Lessons 11-50 have template content
// ═══════════════════════════════════════════════════════════════

interface LessonDef {
  title: string;
  contentType: string;
  estimatedMinutes: number;
  content: string;
  vocabulary?: string;
  quizData?: string;
  audioScript?: string;
  videoUrl?: string | null;
}

interface ModuleDef {
  title: string;
  icon: string;
  description: string;
  lessons: LessonDef[];
}

// ─── Helper: template content for outlined lessons ────────────
function templateContent(level: string, moduleTitle: string, lessonTitle: string, contentType: string): string {
  const levelLabel = level === 'A1-A2' ? 'Beginner' : level === 'B1-B2' ? 'Intermediate' : 'Advanced';
  if (contentType === 'grammar') {
    return `<h2>${lessonTitle}</h2>
<p>In this grammar lesson, we will explore <strong>${lessonTitle}</strong>, an important grammatical concept for ${levelLabel} learners. Understanding this structure will help you communicate more accurately and confidently in English.</p>
<h3>Key Rules</h3>
<p>This grammar point follows specific patterns and rules. Pay close attention to the formation, as small changes can alter the meaning of your sentences entirely. Study the examples carefully and practise forming your own sentences using the patterns demonstrated.</p>
<h3>Common Mistakes</h3>
<p>Many learners make predictable errors with ${lessonTitle.toLowerCase()}. Being aware of these common mistakes will help you avoid them in your own writing and speaking. Always double-check your work against the rules, and remember that consistent practice leads to mastery.</p>
<h3>Practice</h3>
<p>Complete the quiz at the end of this lesson to test your understanding. Try to answer without looking at the explanations first, then review any answers you got wrong. Active recall and spaced repetition are the most effective study techniques for grammar mastery.</p>`;
  }
  if (contentType === 'vocabulary') {
    return `<h2>${lessonTitle}</h2>
<p>Welcome to this vocabulary lesson on <strong>${lessonTitle}</strong>. Building a rich vocabulary is essential for expressing yourself precisely and understanding others at the ${levelLabel} level.</p>
<h3>Key Vocabulary</h3>
<p>In this lesson, you will learn important words and expressions related to ${lessonTitle.toLowerCase()}. Each word includes its definition, an example sentence, and pronunciation. Try to use these new words in your own sentences to reinforce your learning.</p>
<h3>Usage in Context</h3>
<p>Understanding vocabulary in context is far more effective than memorising lists. Pay attention to how the words are used in the example sentences, and try to create your own contexts where these words would naturally appear.</p>
<h3>Practice</h3>
<p>Review the vocabulary items and complete the exercises. Using new words in speaking and writing will help you remember them long-term.</p>`;
  }
  if (contentType === 'reading') {
    return `<h2>${lessonTitle}</h2>
<p>In this reading lesson, we will explore the topic of <strong>${lessonTitle}</strong>. Reading is one of the most effective ways to expand your vocabulary, improve your grammar, and develop your understanding of English-speaking cultures.</p>
<h3>Understanding the Topic</h3>
<p>${lessonTitle} is an important topic for ${levelLabel} learners. Through this lesson, you will develop your reading comprehension skills while learning about key concepts and vocabulary related to this area. Read the passages carefully and try to identify the main ideas and supporting details.</p>
<h3>Key Points</h3>
<p>As you read, pay attention to how the writer organises information and uses language to convey meaning. Notice any new vocabulary or grammatical structures, and try to infer their meaning from context before checking a dictionary.</p>
<h3>Reflection</h3>
<p>After reading, think about how this topic relates to your own experience. Discussing what you have read with others is an excellent way to deepen your understanding and practise using the new language in conversation.</p>`;
  }
  // quiz
  return `<h2>${lessonTitle}</h2>
<p>This quiz tests your understanding of the concepts covered in this module. Answer each question carefully, and review the explanations for any answers you get wrong.</p>
<h3>Instructions</h3>
<p>Read each question and select the best answer from the options provided. You need to score at least 70% to pass. Good luck!</p>`;
}

function templateVocab(lessonTitle: string, level: string): string {
  return JSON.stringify([
    { word: 'Concept', definition: `A key idea related to ${lessonTitle}`, example: `Understanding this concept is essential for mastering ${lessonTitle}.`, pronunciation: '/ˈkɒnsept/' },
    { word: 'Apply', definition: 'To put into practice or action', example: `You should apply what you learn about ${lessonTitle} in real conversations.`, pronunciation: '/əˈplaɪ/' },
    { word: 'Context', definition: 'The situation or circumstances in which something exists', example: `Understanding context helps you use language appropriately.`, pronunciation: '/ˈkɒntekst/' },
    { word: 'Fluency', definition: 'The ability to speak smoothly and easily', example: `Practising ${lessonTitle} will improve your fluency.`, pronunciation: '/ˈfluːənsi/' },
    { word: 'Accuracy', definition: 'The quality of being correct and precise', example: `Grammar accuracy is important for clear communication.`, pronunciation: '/ˈækjərəsi/' },
  ]);
}

function templateQuiz(lessonTitle: string): string {
  return JSON.stringify([
    { question: `Which statement best describes the main idea of "${lessonTitle}"?`, options: ['It is unrelated to English learning', 'It is a key concept for improving your English skills', 'It is only important for advanced learners', 'It is not useful in everyday communication'], correctIndex: 1, explanation: `Understanding ${lessonTitle} is essential for developing your English proficiency.` },
    { question: `Why is "${lessonTitle}" important for English learners?`, options: ['It is only tested in exams', 'It helps you communicate more effectively and accurately', 'It is not important at all', 'It is only for native speakers'], correctIndex: 1, explanation: `Mastering ${lessonTitle} improves both your understanding and production of English.` },
    { question: `What is the best way to practise "${lessonTitle}"?`, options: ['Only read about it', 'Use it actively in speaking and writing', 'Memorise rules without understanding', 'Ignore it and hope for the best'], correctIndex: 1, explanation: 'Active practice through speaking and writing leads to the best learning outcomes.' },
  ]);
}


// ═══════════════════════════════════════════════════════════════
//  BEGINNER A1-A2 — 50 Lessons
// ═══════════════════════════════════════════════════════════════

const BEGINNER_MODULES: ModuleDef[] = [
  {
    title: 'Foundations',
    icon: 'HandMetal',
    description: 'Master the essential building blocks of English: present tenses, articles, prepositions, and basic conversation skills.',
    lessons: [
      {
        title: 'Present Simple — Daily Routines',
        contentType: 'reading',
        estimatedMinutes: 10,
        videoUrl: 'https://www.youtube.com/watch?v=nvVdIJ0las0',
        content: `<h2>Present Simple — Daily Routines</h2>
<p>The present simple describes <strong>habits, routines, and facts</strong>. It is the most common tense in English, and mastering it is essential for communicating about your everyday life.</p>

<h3>Structure</h3>
<ul>
<li><strong>I / You / We / They</strong> + base verb → "I <strong>work</strong> at 9 AM."</li>
<li><strong>He / She / It</strong> + base verb + <strong>-s/-es</strong> → "She <strong>works</strong> at 9 AM."</li>
</ul>

<h3>Spelling Rules for -s</h3>
<ul>
<li>Most verbs: add <strong>-s</strong> → works, eats, reads</li>
<li>Verbs ending in <strong>-ch, -sh, -ss, -x, -o, -z</strong>: add <strong>-es</strong> → watches, washes, goes</li>
<li>Verbs ending in <strong>consonant + y</strong>: change y to i, add <strong>-es</strong> → studies, flies</li>
<li>Verbs ending in <strong>vowel + y</strong>: add <strong>-s</strong> → plays, stays</li>
</ul>

<h3>Example Sentences</h3>
<ul>
<li>"I <strong>wake up</strong> at 7 o'clock."</li>
<li>"He <strong>drinks</strong> coffee every morning."</li>
<li>"They <strong>live</strong> in Madrid."</li>
<li>"The train <strong>leaves</strong> at 6 PM."</li>
</ul>

<h3>Common Time Expressions</h3>
<ul>
<li>every day / every week / every month</li>
<li>always / usually / often / sometimes / rarely / never</li>
<li>in the morning / in the afternoon / in the evening</li>
<li>at night / at the weekend (UK) / on weekends (US)</li>
</ul>

<h3>Common Mistakes</h3>
<p>Remember: third person singular (he/she/it) always needs the -s ending! ❌ "He work" → ✅ "He <strong>works</strong>". Also, don't forget the auxiliary "does" in questions and negatives: "Does she work?" not "Works she?"</p>`,
        quizData: JSON.stringify([
          { question: "She ___ in a hospital.", options: ["work","works","working","is work"], correctIndex: 1, explanation: "Third person singular adds -s to the base verb." },
          { question: "They ___ in the city centre.", options: ["don't live","doesn't live","not live","aren't live"], correctIndex: 0, explanation: "Negative with 'don't' for I/you/we/they." },
          { question: "___ he ___ French?", options: ["Does/speak","Do/speaks","Is/speak","Does/speaks"], correctIndex: 0, explanation: "Questions with 'Does' for he/she/it use the base verb." },
          { question: "We ___ dinner at 7 PM.", options: ["usually eat","eat usually","usually eats","eats usually"], correctIndex: 0, explanation: "Adverbs of frequency go before the main verb." },
          { question: "The shop ___ at 9 AM.", options: ["open","opens","opening","is open"], correctIndex: 1, explanation: "Third person singular: add -s to 'open'." },
        ]),
      },
      {
        title: 'Present Continuous — Right Now',
        contentType: 'grammar',
        estimatedMinutes: 10,
        videoUrl: 'https://www.youtube.com/watch?v=HrG3WXJheyQ',
        content: `<h2>Present Continuous — Right Now</h2>
<p>The present continuous describes <strong>actions happening now</strong> or <strong>temporary situations</strong>. It is formed differently from the present simple and serves a distinct purpose in communication.</p>

<h3>Structure</h3>
<p><strong>Subject + am/is/are + verb-ing</strong></p>

<h3>Forming -ing</h3>
<ul>
<li>Most verbs: add <strong>-ing</strong> → working, reading, eating</li>
<li>Verbs ending in <strong>-e</strong>: remove -e, add <strong>-ing</strong> → making, taking, writing</li>
<li>Short verbs (CVC): double final letter, add <strong>-ing</strong> → running, sitting, swimming</li>
</ul>

<h3>Present Simple vs Present Continuous</h3>
<ul>
<li>"I <strong>drink</strong> coffee every day." (habit → present simple)</li>
<li>"I <strong>am drinking</strong> coffee right now." (happening now → present continuous)</li>
<li>"I <strong>live</strong> in Paris." (permanent → present simple)</li>
<li>"I <strong>am living</strong> with my parents this month." (temporary → present continuous)</li>
</ul>

<h3>Common Mistakes</h3>
<p>Stative verbs (know, like, want, understand, believe) are NOT normally used in the continuous form. ❌ "I am knowing the answer" → ✅ "I <strong>know</strong> the answer."</p>`,
        quizData: JSON.stringify([
          { question: "She usually ___ to work, but today she ___ the bus.", options: ["drives/is taking","is driving/takes","drives/takes","is driving/is taking"], correctIndex: 0, explanation: "Habit = present simple; temporary = present continuous." },
          { question: "Listen! The baby ___.", options: ["cries","is crying","cry","crying"], correctIndex: 1, explanation: "'Listen!' signals present continuous — happening now." },
          { question: "I ___ this word.", options: ["am not understanding","don't understand","not understand","doesn't understand"], correctIndex: 1, explanation: "'Understand' is a stative verb — use present simple." },
          { question: "Where is Tom? He ___ a shower.", options: ["has","is having","have","having"], correctIndex: 1, explanation: "Happening right now — present continuous." },
          { question: "Every summer, we ___ to the beach.", options: ["are going","go","goes","going"], correctIndex: 1, explanation: "'Every summer' = habit → present simple." },
        ]),
      },
      {
        title: 'Articles — A, An, The',
        contentType: 'vocabulary',
        estimatedMinutes: 10,
        videoUrl: 'https://www.youtube.com/watch?v=RDkx4J__-QY',
        content: `<h2>Articles — A, An, The</h2>
<p>Articles are small words that come before nouns, and using them correctly is one of the most challenging aspects of English for learners. Let's master the rules step by step.</p>

<h3>A / An = One of Many, Not Specific</h3>
<ul>
<li>"I have <strong>a</strong> car." (one car, not a specific one)</li>
<li>"She is <strong>an</strong> engineer." (one engineer, her job)</li>
<li>Use <strong>an</strong> before vowel sounds: an apple, an hour (silent h), an umbrella</li>
<li>Use <strong>a</strong> before consonant sounds: a book, a university (sounds like "y"), a horse</li>
</ul>

<h3>The = Specific, Known, Unique</h3>
<ul>
<li>"<strong>The</strong> car in the garage is mine." (specific car)</li>
<li>"<strong>The</strong> sun is hot." (unique — only one sun)</li>
<li>"I saw <strong>the</strong> film you recommended." (specific film)</li>
</ul>

<h3>No Article (∅)</h3>
<ul>
<li>Plural general nouns: "I like <strong>∅</strong> cats." (cats in general)</li>
<li>Uncountable general nouns: "I drink <strong>∅</strong> water."</li>
<li>Proper nouns: "She lives in <strong>∅</strong> Paris."</li>
<li>Meals: "I have <strong>∅</strong> breakfast at 8."</li>
</ul>`,
        vocabulary: JSON.stringify([
          { word: 'Article', definition: 'A word (a, an, the) that comes before a noun', example: 'Articles are one of the hardest parts of English grammar.', pronunciation: '/ˈɑːrtɪkəl/' },
          { word: 'Specific', definition: 'Clearly identified or particular', example: 'The specific book I want is on the table.', pronunciation: '/spəˈsɪfɪk/' },
          { word: 'Unique', definition: 'Being the only one of its kind', example: 'The sun is unique in our solar system.', pronunciation: '/juːˈniːk/' },
          { word: 'General', definition: 'Relating to all or most, not specific', example: 'I like music in general.', pronunciation: '/ˈdʒenərəl/' },
          { word: 'Vowel sound', definition: 'A speech sound made with an open vocal tract', example: '"Apple" starts with a vowel sound.', pronunciation: '/ˈvaʊəl/' },
        ]),
        quizData: JSON.stringify([
          { question: "I am ___ student.", options: ["a","an","the","∅"], correctIndex: 0, explanation: "'Student' starts with consonant sound → use 'a'." },
          { question: "She is ___ honest person.", options: ["a","an","the","∅"], correctIndex: 1, explanation: "'Honest' starts with vowel sound (silent h) → 'an'." },
          { question: "___ book on the table is mine.", options: ["A","An","The","∅"], correctIndex: 2, explanation: "Specific book (on the table) → 'the'." },
          { question: "I like ___ music.", options: ["a","an","the","∅"], correctIndex: 3, explanation: "Music in general → no article." },
          { question: "___ elephants are large animals.", options: ["A","An","The","∅"], correctIndex: 3, explanation: "Elephants in general (plural) → no article." },
        ]),
      },
      {
        title: 'Prepositions of Place — In, On, At',
        contentType: 'grammar',
        estimatedMinutes: 10,
        videoUrl: 'https://www.youtube.com/watch?v=RQ0Qqarel-U',
        content: `<h2>Prepositions of Place — In, On, At</h2>
<p>Prepositions of place tell us where something is. The three most common — <strong>in, on, at</strong> — follow specific patterns that you can learn and practise.</p>

<h3>In = Inside a Space or Large Area</h3>
<ul>
<li>in a room, in a building, in a city, in a country</li>
<li>in the kitchen, in the garden, in the world</li>
</ul>

<h3>On = Surface Contact</h3>
<ul>
<li>on the table, on the wall, on the floor</li>
<li>on Monday, on Christmas Day</li>
</ul>

<h3>At = Specific Point or General Location</h3>
<ul>
<li>at the bus stop, at the door, at the top</li>
<li>at home, at work, at school</li>
</ul>

<h3>Common Phrases to Memorise</h3>
<ul>
<li><strong>at</strong> home / work / school / university</li>
<li><strong>in</strong> the morning / afternoon / evening</li>
<li><strong>on</strong> Monday / Tuesday morning / the weekend (US)</li>
<li><strong>at</strong> night / the weekend (UK) / Christmas</li>
<li><strong>in</strong> summer / winter / March</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "She lives ___ London.", options: ["in","on","at","to"], correctIndex: 0, explanation: "Cities use 'in'." },
          { question: "The book is ___ the table.", options: ["in","on","at","by"], correctIndex: 1, explanation: "Surface contact → 'on'." },
          { question: "I am ___ home.", options: ["in","on","at","to"], correctIndex: 2, explanation: "'At home' is a fixed expression." },
          { question: "My birthday is ___ July.", options: ["in","on","at","by"], correctIndex: 0, explanation: "Months use 'in'." },
          { question: "See you ___ the bus stop.", options: ["in","on","at","by"], correctIndex: 2, explanation: "Specific point → 'at'." },
        ]),
      },
      {
        title: 'Past Simple — Regular Verbs',
        contentType: 'reading',
        estimatedMinutes: 10,
        videoUrl: 'https://www.youtube.com/watch?v=AKXDr2uoYfg',
        content: `<h2>Past Simple — Regular Verbs</h2>
<p>The past simple describes <strong>completed actions</strong> at a specific time in the past. For regular verbs, forming the past simple is straightforward once you know the spelling rules.</p>

<h3>Regular Verbs: Add -ed</h3>
<ul>
<li>Most verbs: play → <strong>played</strong>, work → <strong>worked</strong></li>
<li>Verbs ending in -e: dance → <strong>danced</strong>, like → <strong>liked</strong></li>
<li>Verbs ending in consonant + y: study → <strong>studied</strong>, carry → <strong>carried</strong></li>
<li>Short verbs (CVC): stop → <strong>stopped</strong>, plan → <strong>planned</strong></li>
</ul>

<h3>Time Expressions for Past Simple</h3>
<ul>
<li>yesterday / last week / last month / last year</li>
<li>ago: two days ago, three weeks ago</li>
<li>in 2019 / on Monday / at 5 o'clock</li>
</ul>

<h3>Common Mistakes</h3>
<ul>
<li>❌ "I have visited Paris last year." (no present perfect with specific past time)</li>
<li>✅ "I <strong>visited</strong> Paris last year."</li>
<li>❌ "Did you went?" → ✅ "<strong>Did</strong> you <strong>go</strong>?" (auxiliary takes the past tense, main verb is base form)</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "She ___ to school yesterday.", options: ["walk","walks","walked","walking"], correctIndex: 2, explanation: "Past simple regular verb: walk → walked." },
          { question: "They ___ the project on time.", options: ["didn't finish","not finished","don't finish","doesn't finish"], correctIndex: 0, explanation: "Past simple negative: didn't + base verb." },
          { question: "___ he ___ you last night?", options: ["Did/call","Does/call","Was/call","Did/called"], correctIndex: 0, explanation: "Past simple question: Did + subject + base verb." },
          { question: "We ___ to stay home.", options: ["decide","decides","decided","deciding"], correctIndex: 2, explanation: "Past simple regular: decide → decided." },
          { question: "I ___ English for two hours.", options: ["study","studies","studied","studying"], correctIndex: 2, explanation: "Past simple: study → studied (consonant + y → ied)." },
        ]),
      },
      {
        title: 'Past Simple — Irregular Verbs Part 1',
        contentType: 'grammar',
        estimatedMinutes: 10,
        videoUrl: 'https://www.youtube.com/watch?v=24GWC1dDyUM',
        content: `<h2>Past Simple — Irregular Verbs Part 1</h2>
<p>Irregular verbs do NOT add -ed. You must memorise the past form. This lesson introduces the most common groups and patterns to make memorisation easier.</p>

<h3>Group 1: Same Form (base = past = past participle)</h3>
<ul>
<li>cut → cut → cut</li>
<li>put → put → put</li>
<li>read → read → read (spelling same, pronunciation changes)</li>
</ul>

<h3>Group 2: Vowel Change (i → a → u)</h3>
<ul>
<li>begin → began → begun</li>
<li>drink → drank → drunk</li>
<li>sing → sang → sung</li>
<li>swim → swam → swum</li>
</ul>

<h3>Group 3: Other Common Patterns</h3>
<ul>
<li>go → went → gone</li>
<li>come → came → come</li>
<li>know → knew → known</li>
<li>think → thought → thought</li>
<li>bring → brought → brought</li>
<li>buy → bought → bought</li>
<li>teach → taught → taught</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "I ___ to the cinema last night.", options: ["go","goes","went","gone"], correctIndex: 2, explanation: "go → went (irregular past simple)." },
          { question: "She ___ an old friend yesterday.", options: ["see","sees","saw","seen"], correctIndex: 2, explanation: "see → saw (irregular past simple)." },
          { question: "We ___ at a new restaurant.", options: ["eat","eats","ate","eaten"], correctIndex: 2, explanation: "eat → ate (irregular past simple)." },
          { question: "He ___ the bus to work.", options: ["take","takes","took","taken"], correctIndex: 2, explanation: "take → took (irregular past simple)." },
          { question: "They ___ me a beautiful gift.", options: ["give","gives","gave","given"], correctIndex: 2, explanation: "give → gave (irregular past simple)." },
        ]),
      },
      {
        title: 'Can / Can\'t — Ability and Possibility',
        contentType: 'grammar',
        estimatedMinutes: 10,
        content: `<h2>Can / Can't — Ability and Possibility</h2>
<p><strong>Can</strong> is a modal verb — it does NOT change for he/she/it. It is used to express ability, possibility, requests, and offers in English.</p>

<h3>Ability</h3>
<ul>
<li>"I <strong>can</strong> swim." (I know how to swim)</li>
<li>"She <strong>can</strong> speak three languages."</li>
<li>"He <strong>can't</strong> drive." (He doesn't know how)</li>
</ul>

<h3>Possibility</h3>
<ul>
<li>"You <strong>can</strong> take the bus. It's faster."</li>
<li>"We <strong>can't</strong> go to the beach. It's raining."</li>
</ul>

<h3>Requests and Offers</h3>
<ul>
<li>"<strong>Can</strong> you help me?" (request)</li>
<li>"<strong>Can</strong> I use your phone?" (request)</li>
<li>"I <strong>can</strong> help you with that." (offer)</li>
</ul>

<h3>Pronunciation Note</h3>
<p>"Can't" in British English sounds like /kɑːnt/. In American English, it sounds like /kænt/. Listen carefully — the vowel sound is different!</p>`,
        quizData: JSON.stringify([
          { question: "I ___ swim very well.", options: ["can","cans","can't","am can"], correctIndex: 0, explanation: "Can + base verb for ability." },
          { question: "She ___ play the piano. She never learned.", options: ["can","can't","cans","doesn't can"], correctIndex: 1, explanation: "Negative ability: can't + base verb." },
          { question: "___ you speak more slowly, please?", options: ["Can","Do","Are","Is"], correctIndex: 0, explanation: "Polite request: Can + subject + base verb?" },
          { question: "We ___ meet tomorrow. I'm busy.", options: ["can","can't","cans","will can"], correctIndex: 1, explanation: "Negative possibility: can't." },
          { question: "He ___ cook Italian food. He's a chef!", options: ["can","can't","cans","is can"], correctIndex: 0, explanation: "Ability: can + base verb." },
        ]),
      },
      {
        title: 'Question Formation',
        contentType: 'grammar',
        estimatedMinutes: 10,
        content: `<h2>Question Formation</h2>
<p>Forming questions correctly is fundamental to communication in English. There are three main types: yes/no questions, WH-questions, and subject questions.</p>

<h3>Yes/No Questions (with Auxiliary)</h3>
<ul>
<li>Present simple: <strong>Do/Does</strong> + subject + verb? → "Do you like pizza?"</li>
<li>Past simple: <strong>Did</strong> + subject + verb? → "Did she go to school?"</li>
<li>Present continuous: <strong>Am/Is/Are</strong> + subject + verb-ing? → "Are they coming?"</li>
</ul>

<h3>WH-Questions</h3>
<ul>
<li><strong>What</strong> — thing/action: "What do you do?"</li>
<li><strong>Where</strong> — place: "Where do you live?"</li>
<li><strong>When</strong> — time: "When did you arrive?"</li>
<li><strong>Who</strong> — person: "Who is your teacher?"</li>
<li><strong>Why</strong> — reason: "Why are you late?"</li>
<li><strong>How</strong> — manner: "How do you get to work?"</li>
</ul>

<h3>Subject Questions (No Auxiliary!)</h3>
<ul>
<li>"<strong>Who</strong> broke the window?" (NOT "Who did break...")</li>
<li>"<strong>What</strong> happened?" (NOT "What did happen?")</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "___ do you live?", options: ["Where","What","Who","When"], correctIndex: 0, explanation: "Asking about place → Where." },
          { question: "___ she work yesterday?", options: ["Did","Does","Was","Is"], correctIndex: 0, explanation: "Past simple question: Did + subject + base verb?" },
          { question: "___ they coming to the party?", options: ["Are","Do","Did","Will"], correctIndex: 0, explanation: "Present continuous question: Are + subject + verb-ing?" },
          { question: "___ did he leave early?", options: ["Why","Where","What","Who"], correctIndex: 0, explanation: "Asking about reason → Why." },
          { question: "___ broke the window?", options: ["Who","Who did","Whom","Whose"], correctIndex: 0, explanation: "Subject question — no auxiliary needed." },
        ]),
      },
      {
        title: 'Countable & Uncountable Nouns',
        contentType: 'grammar',
        estimatedMinutes: 10,
        content: `<h2>Countable & Uncountable Nouns</h2>
<p>Understanding the difference between countable and uncountable nouns is crucial for using articles and quantifiers correctly in English.</p>

<h3>Countable Nouns</h3>
<p>Things you can count. Have singular and plural forms.</p>
<ul>
<li>one book, two books, three books</li>
<li>a car, an apple, some students</li>
<li><strong>How many</strong> books? (countable)</li>
</ul>

<h3>Uncountable Nouns</h3>
<p>Things you cannot count. No plural form.</p>
<ul>
<li>water, rice, advice, information, money, luggage</li>
<li>some water, a lot of rice, a piece of advice</li>
<li><strong>How much</strong> water? (uncountable)</li>
</ul>

<h3>Common Confusing Uncountable Nouns</h3>
<ul>
<li>❌ "an information" → ✅ "some information"</li>
<li>❌ "two advices" → ✅ "two pieces of advice"</li>
<li>❌ "many money" → ✅ "much money / a lot of money"</li>
<li>❌ "furnitures" → ✅ "some furniture"</li>
</ul>

<h3>Quantifiers</h3>
<ul>
<li>Countable: many, a few, several, any (negative/question)</li>
<li>Uncountable: much, a little, a bit of, any (negative/question)</li>
<li>Both: some, a lot of, plenty of</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "'Rice' is:", options: ["countable","uncountable","both","neither"], correctIndex: 1, explanation: "Rice cannot be counted individually — it's uncountable." },
          { question: "I need ___ advice.", options: ["a","an","some","many"], correctIndex: 2, explanation: "'Advice' is uncountable → use 'some', not 'a/an'." },
          { question: "How ___ money do you have?", options: ["many","much","few","a few"], correctIndex: 1, explanation: "'Money' is uncountable → 'How much'." },
          { question: "I don't have ___ time.", options: ["many","much","a few","few"], correctIndex: 1, explanation: "'Time' (uncountable) in negative → 'much'." },
          { question: "'Chair' is:", options: ["countable","uncountable","both","neither"], correctIndex: 0, explanation: "You can count chairs: one chair, two chairs." },
        ]),
      },
      {
        title: 'Basic Conversation — Introducing Yourself',
        contentType: 'quiz',
        estimatedMinutes: 10,
        content: `<h2>Basic Conversation — Introducing Yourself</h2>
<p>Being able to introduce yourself confidently is one of the most important skills for any English learner. This lesson brings together vocabulary, grammar, and social skills for successful introductions.</p>

<h3>Introducing Yourself</h3>
<ul>
<li>"Hello, my name is [Name]. Nice to meet you."</li>
<li>"Hi, I'm [Name]. I'm from [Country/City]."</li>
<li>"Good morning. I'm [Name]. I work as a [Job]."</li>
</ul>

<h3>Asking About Someone</h3>
<ul>
<li>"What's your name?"</li>
<li>"Where are you from?"</li>
<li>"What do you do?" (= What is your job?)</li>
<li>"Do you speak [language]?"</li>
</ul>

<h3>Polite Phrases</h3>
<ul>
<li>"Nice to meet you too."</li>
<li>"Pardon? / Sorry?" (when you don't understand)</li>
<li>"Could you repeat that, please?"</li>
<li>"I don't understand."</li>
<li>"How do you say [word] in English?"</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "What is the most common first-time greeting in English?", options: ["What's up?","Nice to meet you","How's it going?","Hey!"], correctIndex: 1, explanation: "'Nice to meet you' is the standard first-time greeting." },
          { question: "'What do you do?' asks about your:", options: ["hobbies","job","age","name"], correctIndex: 1, explanation: "'What do you do?' = What is your job?" },
          { question: "When you don't understand, you should say:", options: ["Whatever","Pardon? / Sorry?","I don't care","Speak up!"], correctIndex: 1, explanation: "'Pardon?' or 'Sorry?' are polite ways to ask for repetition." },
          { question: "'Could you repeat that, please?' is used to:", options: ["say goodbye","ask someone to speak again","introduce yourself","give directions"], correctIndex: 1, explanation: "This is a polite request for repetition." },
          { question: "After 'Nice to meet you', you can reply:", options: ["So what?","Nice to meet you too","I don't care","Whatever"], correctIndex: 1, explanation: "The polite response reciprocates the greeting." },
        ]),
      },
    ],
  },
  {
    title: 'Building Confidence',
    icon: 'Sun',
    description: 'Build on your foundation with past tenses, future plans, and more complex grammar structures.',
    lessons: [
      { title: 'Past Simple — Irregular Verbs Part 2', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Going to — Future Plans', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Would Like — Polite Requests and Offers', contentType: 'vocabulary', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Have Got — Possession', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Adjectives and Adverbs', contentType: 'reading', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Comparatives and Superlatives', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Present Perfect — Experience (Have you ever...?)', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Giving Directions', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Making Appointments', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Shopping and Restaurants', contentType: 'quiz', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
    ],
  },
  {
    title: 'Expanding Skills',
    icon: 'Users',
    description: 'Expand your English skills with perfect tenses, pronouns, and everyday communication.',
    lessons: [
      { title: 'Present Perfect — For and Since', contentType: 'reading', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Too and Enough', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Somebody, Anybody, Nobody, Everybody', contentType: 'vocabulary', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Reflexive Pronouns', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Gerunds (-ing as noun)', contentType: 'reading', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Used to — Past Habits', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Will — Spontaneous Decisions', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Describing People and Places', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Making Suggestions', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Talking About Weather and Seasons', contentType: 'quiz', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
    ],
  },
  {
    title: 'Practical Communication',
    icon: 'MessageCircle',
    description: 'Apply your English skills to real-world situations: phone calls, travel, health, and social media.',
    lessons: [
      { title: 'Telephone English', contentType: 'reading', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Booking Hotels and Flights', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'At the Doctor', contentType: 'vocabulary', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Talking About Movies and Books', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Giving Opinions', contentType: 'reading', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Talking About Future Plans', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Describing a Process', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Talking About Health and Fitness', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Social Media Vocabulary', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Travel and Tourism', contentType: 'quiz', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
    ],
  },
  {
    title: 'Consolidation',
    icon: 'Award',
    description: 'Review and consolidate everything you have learned, from tenses to pronunciation, and prepare for the A2 level.',
    lessons: [
      { title: 'Review: Present Tenses', contentType: 'reading', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Review: Past Tenses', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Review: Future Forms', contentType: 'vocabulary', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Review: Modal Verbs', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Review: Prepositions', contentType: 'reading', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Review: Articles', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Common Mistakes at A2 Level', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Pronunciation Focus: Word Stress', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Connected Speech and Weak Forms', contentType: 'grammar', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Final Review: A1→A2 Progress Check', contentType: 'quiz', estimatedMinutes: 10, content: '', quizData: '', vocabulary: '', videoUrl: null },
    ],
  },
];


// ═══════════════════════════════════════════════════════════════
//  INTERMEDIATE B1-B2 — 50 Lessons
// ═══════════════════════════════════════════════════════════════

const INTERMEDIATE_MODULES: ModuleDef[] = [
  {
    title: 'Tense Mastery',
    icon: 'BookOpen',
    description: 'Master all the tenses and conditional structures needed for confident intermediate English.',
    lessons: [
      {
        title: 'Present Perfect Continuous',
        contentType: 'reading',
        estimatedMinutes: 15,
        videoUrl: 'https://www.youtube.com/watch?v=6hNWFy_ujAg',
        content: `<h2>Present Perfect Continuous</h2>
<p>The present perfect continuous connects the past with the present. It emphasizes <strong>duration</strong> and <strong>ongoing activity</strong>.</p>

<h3>Structure</h3>
<p><strong>Subject + has/have + been + verb-ing</strong></p>

<h3>When to Use It</h3>
<ol>
<li><strong>Actions that started in the past and continue to now</strong> (with for/since): "I have been working here for three years."</li>
<li><strong>Recently completed actions with visible results</strong>: "It has been raining all morning." (the ground is wet)</li>
<li><strong>Temporary situations that may change</strong>: "She has been living with her parents this month."</li>
</ol>

<h3>Common Mistakes</h3>
<ul>
<li>❌ "I am working here for 3 years." → ✅ "I <strong>have been working</strong> here for 3 years."</li>
<li>❌ "She has been knowing him for years." → ✅ "She <strong>has known</strong> him for years." (stative verbs don't use continuous)</li>
</ul>

<h3>For vs Since</h3>
<ul>
<li><strong>For</strong> + period of time: for three years, for six months</li>
<li><strong>Since</strong> + point in time: since 2020, since she was a child</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "Which sentence is correct?", options: ["I am working here for 3 years.","I have been working here for 3 years.","I work here since 3 years.","I have worked here since 3 years."], correctIndex: 1, explanation: "'For 3 years' (duration) requires present perfect continuous." },
          { question: "Which verb CANNOT be used in present perfect continuous?", options: ["work","study","know","wait"], correctIndex: 2, explanation: "'Know' is a stative verb — use present perfect simple." },
          { question: "Complete: She ___ English since 2019.", options: ["learns","is learning","has been learning","learned"], correctIndex: 2, explanation: "'Since 2019' requires present perfect continuous." },
          { question: "I have been knowing her for 5 years. This sentence is:", options: ["correct","incorrect — use have known","incorrect — use knew","incorrect — use am knowing"], correctIndex: 1, explanation: "'Know' is stative — use present perfect simple: have known." },
          { question: "They ___ tennis for 2 hours.", options: ["are playing","play","have been playing","played"], correctIndex: 2, explanation: "'For 2 hours' (duration to now) → present perfect continuous." },
        ]),
      },
      {
        title: 'Comparative & Superlative Adjectives',
        contentType: 'grammar',
        estimatedMinutes: 15,
        content: `<h2>Comparative & Superlative Adjectives</h2>
<p>Comparing people, places, and things accurately is essential at the intermediate level. This lesson covers all the rules, including irregular forms.</p>

<h3>Comparatives (Comparing Two Things)</h3>
<ul>
<li>Short adjectives (1-2 syllables): add <strong>-er</strong> → "taller," "faster," "bigger"</li>
<li>Long adjectives (2+ syllables): use <strong>more</strong> → "more expensive," "more beautiful"</li>
<li><strong>Irregulars:</strong> good → better, bad → worse, far → farther/further</li>
</ul>

<h3>Superlatives (Comparing 3+ Things)</h3>
<ul>
<li>Short adjectives: add <strong>-est</strong> → "tallest," "fastest," "biggest"</li>
<li>Long adjectives: use <strong>most</strong> → "most expensive," "most beautiful"</li>
<li><strong>Irregulars:</strong> good → best, bad → worst, far → farthest/furthest</li>
</ul>

<h3>Important Spelling Rules</h3>
<ul>
<li>Big → <strong>bigg</strong>er (double final consonant)</li>
<li>Easy → <strong>eas</strong>ier (y → i)</li>
<li>Expensive → <strong>more expensive</strong> (no change)</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "Tokyo is ___ than Bangkok.", options: ["more expensive","expensiver","most expensive","much expensive"], correctIndex: 0, explanation: "Long adjective (3+ syllables) → 'more + adjective'." },
          { question: "That was the ___ meal I have ever had.", options: ["bad","worse","worst","more bad"], correctIndex: 2, explanation: "Irregular: bad → worst (superlative)." },
          { question: "My English is getting ___ every day.", options: ["good","more good","better","best"], correctIndex: 2, explanation: "Irregular: good → better (comparative)." },
          { question: "She speaks ___ than her brother.", options: ["more fluently","fluentlyer","most fluently","fluenter"], correctIndex: 0, explanation: "Adverbs: 'more + adverb' for comparatives." },
          { question: "Japan is the ___ beautiful country I have visited.", options: ["more","most","much","very"], correctIndex: 1, explanation: "Superlative of long adjectives: 'most + adjective'." },
        ]),
      },
      {
        title: 'First Conditional (Real Future)',
        contentType: 'grammar',
        estimatedMinutes: 15,
        content: `<h2>First Conditional (Real Future)</h2>
<p>The first conditional talks about <strong>real, possible future situations</strong> and their consequences. It is the most commonly used conditional in everyday English.</p>

<h3>Structure</h3>
<p><strong>If + present simple, will + base verb</strong></p>

<h3>Example Sentences</h3>
<ul>
<li>"If it rains tomorrow, I will stay home."</li>
<li>"If you study hard, you will pass the exam."</li>
<li>"If she calls me, I will tell her the news."</li>
</ul>

<h3>Variations</h3>
<p>Instead of "will," you can use <strong>can, may, might, should</strong> for different meanings:</p>
<ul>
<li>"If you finish early, <strong>you can leave</strong>." (permission)</li>
<li>"If the weather is good, <strong>we might go</strong> hiking." (possibility)</li>
<li>"If you feel sick, <strong>you should see</strong> a doctor." (advice)</li>
</ul>

<h3>Common Mistakes</h3>
<ul>
<li>❌ "If it will rain, I stay home." → ✅ "If it <strong>rains</strong>, I <strong>will stay</strong> home." (No "will" after "if")</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "If I ___ time tomorrow, I ___ you.", options: ["will have/help","have/will help","had/would help","have/help"], correctIndex: 1, explanation: "First conditional: If + present simple, will + base verb." },
          { question: "If it ___ raining, we ___ the picnic.", options: ["doesn't stop/will cancel","won't stop/cancel","doesn't stops/will cancel","not stop/will cancel"], correctIndex: 0, explanation: "First conditional: If + present simple (negative), will + base verb." },
          { question: "If you eat too much, you ___ sick.", options: ["will feel","would feel","feel","felt"], correctIndex: 0, explanation: "First conditional: real possibility → will + base verb." },
          { question: "Which sentence is correct?", options: ["If it will rain, I stay home.","If it rains, I will stay home.","If it rain, I will stay home.","If it raining, I stay home."], correctIndex: 1, explanation: "No 'will' after 'if' in first conditional." },
          { question: "If she ___ understand, I ___ again.", options: ["doesn't/will explain","won't/explain","don't/will explain","doesn't/would explain"], correctIndex: 0, explanation: "First conditional: If + doesn't + base verb, will + base verb." },
        ]),
      },
      {
        title: 'Second Conditional (Unreal Present/Future)',
        contentType: 'grammar',
        estimatedMinutes: 15,
        content: `<h2>Second Conditional (Unreal Present/Future)</h2>
<p>The second conditional talks about <strong>unreal, hypothetical, or unlikely situations</strong>. We use it to imagine things that are not true now or probably won't happen.</p>

<h3>Structure</h3>
<p><strong>If + past simple, would + base verb</strong></p>

<h3>Example Sentences</h3>
<ul>
<li>"If I had a million dollars, I would travel the world." (I don't have a million dollars)</li>
<li>"If I lived in Paris, I would eat croissants every day." (I don't live in Paris)</li>
<li>"If she were here, she would know what to do." (She's not here)</li>
</ul>

<h3>Important: "Were" for All Subjects</h3>
<p>In formal English, use <strong>were</strong> for all subjects in second conditional:</p>
<ul>
<li>"If I <strong>were</strong> you" (not "If I was you")</li>
<li>"If she <strong>were</strong> here" (not "If she was here")</li>
</ul>

<h3>Common Mistakes</h3>
<ul>
<li>❌ "If I would have money, I would buy a car." → ✅ "If I <strong>had</strong> money, I <strong>would buy</strong> a car."</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "If I ___ you, I ___ the job.", options: ["were/would take","am/will take","was/would took","were/will take"], correctIndex: 0, explanation: "Second conditional: If + past (were), would + base verb." },
          { question: "If she ___ more time, she ___ Japanese.", options: ["has/will learn","had/would learn","have/would learn","had/will learn"], correctIndex: 1, explanation: "Second conditional: hypothetical → If + past, would + base." },
          { question: "'If I saw him, I would tell him.' This is:", options: ["first conditional","second conditional","third conditional","zero conditional"], correctIndex: 1, explanation: "Past form in if-clause + would = second conditional." },
          { question: "If I ___ a million dollars, I would travel the world.", options: ["have","had","will have","has"], correctIndex: 1, explanation: "Second conditional: If + past simple." },
          { question: "Which is the correct formal form?", options: ["If I was you","If I were you","If I am you","If I will be you"], correctIndex: 1, explanation: "Formal English uses 'were' for all subjects in second conditional." },
        ]),
      },
      {
        title: 'Third Conditional (Unreal Past)',
        contentType: 'grammar',
        estimatedMinutes: 20,
        content: `<h2>Third Conditional (Unreal Past)</h2>
<p>The third conditional is about <strong>regrets, missed opportunities, and hypothetical past</strong>. We use it to imagine how things could have been different.</p>

<h3>Structure</h3>
<p><strong>If + past perfect, would have + past participle</strong></p>

<h3>Example Sentences</h3>
<ul>
<li>"If I had studied harder, I would have passed the exam." (I didn't study harder → I failed)</li>
<li>"If she had left earlier, she wouldn't have missed the train." (She didn't leave earlier → she missed it)</li>
<li>"If we had known about the problem, we would have fixed it." (We didn't know → we didn't fix it)</li>
</ul>

<h3>Contractions</h3>
<ul>
<li>"I would have" → "I'd have" or "I'd've"</li>
<li>"If I had" → "If I'd"</li>
</ul>

<h3>Using "Could Have" and "Might Have"</h3>
<ul>
<li>"If I had taken the job, I <strong>could have moved</strong> to New York." (past possibility)</li>
<li>"If he had been more careful, he <strong>might not have broken</strong> it." (uncertainty)</li>
</ul>

<h3>Common Mistakes</h3>
<ul>
<li>❌ "If I would have studied, I would have passed." → ✅ "If I <strong>had studied</strong>, I <strong>would have passed</strong>."</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "If I ___ earlier, I ___ a better seat.", options: ["arrived/would get","had arrived/would have gotten","arrive/will get","had arrived/would get"], correctIndex: 1, explanation: "Third conditional: If + past perfect, would have + past participle." },
          { question: "If she ___ to me, she ___ that mistake.", options: ["listened/wouldn't make","had listened/wouldn't have made","listens/won't make","had listened/won't make"], correctIndex: 1, explanation: "Past hypothetical → third conditional." },
          { question: "If we ___ a taxi, we ___ the flight.", options: ["took/wouldn't miss","had taken/wouldn't have missed","take/won't miss","had taken/don't miss"], correctIndex: 1, explanation: "Past regret → third conditional." },
          { question: "Which sentence is correct?", options: ["If I would have studied, I would have passed.","If I had studied, I would have passed.","If I studied, I would have passed.","If I had studied, I will have passed."], correctIndex: 1, explanation: "No 'would' in the if-clause of third conditional." },
          { question: "If he ___ his umbrella, he ___ wet.", options: ["forgot/would get","hadn't forgotten/wouldn't have gotten","forgets/won't get","had forgotten/wouldn't get"], correctIndex: 1, explanation: "Third conditional: If + past perfect (negative), would have + past participle." },
        ]),
      },
      {
        title: 'Mixed Conditionals (Past → Present)',
        contentType: 'grammar',
        estimatedMinutes: 20,
        content: `<h2>Mixed Conditionals (Past → Present)</h2>
<p>Mixed conditionals combine <strong>different time frames</strong>. The most common type connects a past hypothetical cause with a present consequence.</p>

<h3>Structure</h3>
<p><strong>If + past perfect (hypothetical past), would + base verb (present consequence)</strong></p>

<h3>Example Sentences</h3>
<ul>
<li>"If I had studied medicine, I would be a doctor now." (I didn't study medicine → I'm not a doctor now)</li>
<li>"If she had taken that job, she would be living in London." (She didn't take the job → she's not in London now)</li>
<li>"If we had invested in that company, we would be rich." (We didn't invest → we're not rich now)</li>
</ul>

<h3>Other Combinations</h3>
<ul>
<li>Past cause → present result: "If I <strong>had studied</strong> more, I <strong>would know</strong> the answer."</li>
<li>Present cause → past result: "If I <strong>spoke</strong> better English, I <strong>would have gotten</strong> that job." (less common)</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "If I had gone to bed earlier, I ___ so tired now.", options: ["won't be","wouldn't be","am not","wasn't"], correctIndex: 1, explanation: "Mixed conditional: past hypothetical → present consequence (would + base verb)." },
          { question: "If she had saved more money, she ___ afford the trip.", options: ["will be able to","would be able to","can","could"], correctIndex: 1, explanation: "Past cause → present result: would + base verb." },
          { question: "If I had studied medicine, I ___ a doctor now.", options: ["will be","am","would be","was"], correctIndex: 2, explanation: "Past hypothetical → present consequence: would be." },
          { question: "If he had learned to drive, he ___ to take the bus.", options: ["won't need","wouldn't need","doesn't need","didn't need"], correctIndex: 1, explanation: "Past unreal → present consequence: wouldn't + base verb." },
          { question: "If we had bought that house, we ___ a garden now.", options: ["will have","would have","have","had"], correctIndex: 1, explanation: "Mixed: past unreal → present result = would have." },
        ]),
      },
      {
        title: 'Passive Voice (All Tenses)',
        contentType: 'grammar',
        estimatedMinutes: 15,
        content: `<h2>Passive Voice (All Tenses)</h2>
<p>The passive voice shifts focus from <strong>who did the action</strong> to <strong>what happened</strong>.</p>

<h3>Structure</h3>
<p><strong>Subject + be (in correct tense) + past participle</strong></p>

<h3>All Tenses in Passive</h3>
<ul>
<li>Present simple: "The report <strong>is written</strong>."</li>
<li>Present continuous: "The report <strong>is being written</strong>."</li>
<li>Past simple: "The report <strong>was written</strong>."</li>
<li>Present perfect: "The report <strong>has been written</strong>."</li>
<li>Future: "The report <strong>will be written</strong>."</li>
<li>Modal: "The report <strong>must be written</strong>."</li>
</ul>

<h3>When to Use Passive</h3>
<ol>
<li>The agent is unknown: "My car <strong>was stolen</strong>."</li>
<li>The agent is obvious: "He <strong>was arrested</strong>."</li>
<li>Focus on the action: "The new policy <strong>has been implemented</strong>."</li>
<li>Formal/academic writing: "It <strong>has been suggested</strong> that..."</li>
</ol>`,
        quizData: JSON.stringify([
          { question: "Active: Someone has stolen my bicycle. Passive:", options: ["My bicycle is stolen.","My bicycle has been stolen.","My bicycle was stolen.","My bicycle had been stolen."], correctIndex: 1, explanation: "Present perfect passive: has/have been + past participle." },
          { question: "The results ___ tomorrow.", options: ["will announce","will be announced","are announcing","announce"], correctIndex: 1, explanation: "Future passive: will be + past participle." },
          { question: "A new hospital ___ right now.", options: ["is building","is being built","built","builds"], correctIndex: 1, explanation: "Present continuous passive: is being + past participle." },
          { question: "This room ___ immediately.", options: ["must clean","must be cleaned","must cleaning","must cleaned"], correctIndex: 1, explanation: "Modal passive: must be + past participle." },
          { question: "Passive is used when:", options: ["the actor is important","the action is more important than the actor","you want to be informal","you are telling a story"], correctIndex: 1, explanation: "Passive shifts focus to the action/recipient, not who did it." },
        ]),
      },
      {
        title: 'Reported Speech',
        contentType: 'grammar',
        estimatedMinutes: 20,
        content: `<h2>Reported Speech</h2>
<p>When we report what someone said, we usually move the verb <strong>one step back in time</strong>.</p>

<h3>Tense Changes</h3>
<ul>
<li>Present simple → <strong>Past simple</strong>: "I am tired" → She said she <strong>was tired</strong></li>
<li>Present continuous → <strong>Past continuous</strong></li>
<li>Past simple → <strong>Past perfect</strong></li>
<li>Present perfect → <strong>Past perfect</strong></li>
<li>Will → <strong>Would</strong></li>
<li>Can → <strong>Could</strong></li>
</ul>

<h3>Time/Place Changes</h3>
<ul>
<li>today → <strong>that day</strong></li>
<li>yesterday → <strong>the day before</strong></li>
<li>tomorrow → <strong>the next day</strong></li>
<li>now → <strong>then</strong></li>
<li>here → <strong>there</strong></li>
</ul>

<h3>Question Reporting</h3>
<ul>
<li>"Where are you going?" → He asked where I <strong>was</strong> going.</li>
<li>"Did you see him?" → He asked if I <strong>had seen</strong> him.</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "'I am busy,' she said. → She said she ___ busy.", options: ["is","was","has been","were"], correctIndex: 1, explanation: "Present simple → past simple in reported speech." },
          { question: "'I will help you,' he promised. → He promised he ___ me.", options: ["will help","would help","helps","helped"], correctIndex: 1, explanation: "Will → would in reported speech." },
          { question: "'Did you see the movie?' → She asked if I ___ the movie.", options: ["see","saw","had seen","have seen"], correctIndex: 2, explanation: "Past simple → past perfect in reported speech." },
          { question: "'I have finished my work,' he said. → He said he ___ his work.", options: ["finishes","finished","had finished","has finished"], correctIndex: 2, explanation: "Present perfect → past perfect in reported speech." },
          { question: "In reported speech, 'tomorrow' becomes:", options: ["tomorrow","the next day","today","next week"], correctIndex: 1, explanation: "Time shift: tomorrow → the next day." },
        ]),
      },
      {
        title: 'Modal Verbs of Deduction',
        contentType: 'grammar',
        estimatedMinutes: 15,
        content: `<h2>Modal Verbs of Deduction</h2>
<p>We use modal verbs to express how <strong>certain</strong> we are about something — from near certainty to impossibility.</p>

<h3>Present Deductions</h3>
<ul>
<li><strong>Must</strong> (95% certainty): "She must be tired. She worked 12 hours."</li>
<li><strong>Might/May/Could</strong> (50% possibility): "He might be at home. I'm not sure."</li>
<li><strong>Can't</strong> (0% impossible): "That can't be true. She never lies."</li>
</ul>

<h3>Past Deductions</h3>
<ul>
<li><strong>Must have</strong>: "She must have forgotten. She never misses meetings."</li>
<li><strong>Might/May/Could have</strong>: "He might have left already."</li>
<li><strong>Can't have</strong>: "He can't have stolen it. He was with me."</li>
</ul>

<h3>Deduction vs Obligation</h3>
<ul>
<li>"He <strong>must</strong> be rich." (deduction: I'm sure he's rich)</li>
<li>"You <strong>must</strong> wear a seatbelt." (obligation: rule/requirement)</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "She ___ be at work. Her car is not here.", options: ["must","might","can't","could"], correctIndex: 0, explanation: "'Must' = very sure (95% certainty) based on evidence." },
          { question: "They ___ have finished already. It's too early.", options: ["can't","might","must","could"], correctIndex: 0, explanation: "'Can't have' = impossible (0% certainty) about the past." },
          { question: "He ___ have forgotten. It's not like him.", options: ["must","might","can't","should"], correctIndex: 1, explanation: "'Might have' = possible but not certain." },
          { question: "'You must wear a seatbelt' is:", options: ["deduction","obligation","possibility","request"], correctIndex: 1, explanation: "'Must' for obligation = rule/requirement, not deduction." },
          { question: "That ___ be the right answer. It doesn't make sense.", options: ["must","might","can't","may"], correctIndex: 2, explanation: "'Can't' = impossible (0% certainty) — deduction." },
        ]),
      },
      {
        title: 'Hedging Language & Softening',
        contentType: 'quiz',
        estimatedMinutes: 15,
        content: `<h2>Hedging Language & Softening</h2>
<p><strong>Hedging</strong> means softening what you say so you don't sound too direct or rude. It's essential for professional and academic English.</p>

<h3>Why Hedge?</h3>
<ul>
<li>❌ "This is the best solution." (too absolute)</li>
<li>✅ "This <strong>appears to be</strong> one of the <strong>most viable</strong> solutions <strong>available at present</strong>." (more diplomatic)</li>
</ul>

<h3>Hedging Phrases</h3>
<ul>
<li><strong>Tentative opinions:</strong> I think / I believe / It seems to me that</li>
<li><strong>Uncertainty:</strong> perhaps, maybe, possibly, probably</li>
<li><strong>Limited commitment:</strong> as far as I know, to the best of my knowledge</li>
<li><strong>Generalization:</strong> tends to, generally, in most cases</li>
<li><strong>Softening disagreement:</strong> I see your point, but... / That's a valid perspective, however...</li>
</ul>

<h3>Academic Hedging</h3>
<ul>
<li>"The evidence <strong>suggests</strong> that..." (not "proves")</li>
<li>"The results <strong>indicate</strong> that..." (not "show definitely")</li>
<li>"There is <strong>growing evidence</strong> to suggest..."</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "Which is the most diplomatic way to disagree?", options: ["You are wrong.","I see your point, but...","That's stupid.","No way."], correctIndex: 1, explanation: "Hedging softens disagreement while still expressing a different view." },
          { question: "In academic writing, 'This proves that...' should be:", options: ["kept as is","changed to 'This suggests that...'","changed to 'This might maybe kind of...'","deleted entirely"], correctIndex: 1, explanation: "'Suggests' is a hedge — it's less absolute than 'proves'." },
          { question: "Which phrase is a hedge?", options: ["This is definitely true.","It appears to be the case that...","Everyone knows that...","This is 100% certain."], correctIndex: 1, explanation: "'It appears to be' introduces uncertainty/softening." },
          { question: "'The data may need to be reviewed' is hedged because:", options: ["it uses 'may'","it uses 'need'","it uses 'data'","it uses 'reviewed'"], correctIndex: 0, explanation: "'May' expresses possibility rather than certainty." },
          { question: "Why is hedging important in professional English?", options: ["It makes you sound uncertain.","It sounds more diplomatic and less absolute.","It makes writing longer.","It hides the truth."], correctIndex: 1, explanation: "Hedging makes language more diplomatic and nuanced." },
        ]),
      },
    ],
  },
  {
    title: 'Complex Grammar',
    icon: 'BookMarked',
    description: 'Master relative clauses, question tags, phrasal verbs, and other intermediate grammar structures.',
    lessons: [
      { title: 'Relative Clauses (who, which, that, whose)', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Question Tags (isn\'t it?, haven\'t you?)', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Gerunds vs Infinitives', contentType: 'vocabulary', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Phrasal Verbs (separable vs inseparable)', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Articles Review (a/an, the, zero article)', contentType: 'reading', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Past Perfect Simple', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Past Perfect Continuous', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Future Forms (will, going to, present continuous)', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Expressing Wishes (I wish, If only)', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Linking Words and Discourse Markers', contentType: 'quiz', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
    ],
  },
  {
    title: 'Advanced Structures',
    icon: 'GraduationCap',
    description: 'Explore cleft sentences, inversion, causative structures, and other advanced patterns.',
    lessons: [
      { title: 'Cleft Sentences (What I need is...)', contentType: 'reading', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Inversion for Emphasis (Never have I...)', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'So / Such / Too / Enough', contentType: 'vocabulary', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Used to / Be used to / Get used to', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Have Something Done (causative)', contentType: 'reading', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Indirect Questions', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Quantifiers (few, little, many, much, some, any)', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Word Order in Questions', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Prepositions of Time and Place (advanced)', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Confusing Words (affect/effect, advice/advise)', contentType: 'quiz', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
    ],
  },
  {
    title: 'Professional & Academic',
    icon: 'Briefcase',
    description: 'Develop professional and academic English skills for writing, presentations, and communication.',
    lessons: [
      { title: 'Describing Trends', contentType: 'reading', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Formal Email Writing', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Essay Structure and Thesis Statements', contentType: 'vocabulary', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Writing Conclusions', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Presentation Language', contentType: 'reading', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Negotiating and Persuading', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Giving and Responding to Feedback', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Academic Vocabulary Expansion', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Collocations and Fixed Expressions', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Register: Formal vs Informal English', contentType: 'quiz', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
    ],
  },
  {
    title: 'Fluency & Exam Prep',
    icon: 'Award',
    description: 'Prepare for B2 level with complex structures, critical thinking, and exam strategies.',
    lessons: [
      { title: 'Complex Sentence Structures', contentType: 'reading', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Subjunctive Mood', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Advanced Conditional Patterns', contentType: 'vocabulary', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Nominalisation', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Cohesion and Coherence in Writing', contentType: 'reading', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Critical Thinking Language', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Paraphrasing and Summarising', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Exam Strategy: Time Management', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Common B2 Exam Mistakes to Avoid', contentType: 'grammar', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Final Review: B1→B2 Progress Check', contentType: 'quiz', estimatedMinutes: 15, content: '', quizData: '', vocabulary: '', videoUrl: null },
    ],
  },
];


// ═══════════════════════════════════════════════════════════════
//  ADVANCED C1-C2 — 50 Lessons
// ═══════════════════════════════════════════════════════════════

const ADVANCED_MODULES: ModuleDef[] = [
  {
    title: 'Sophisticated Grammar',
    icon: 'Scale',
    description: 'Master the subjunctive, cleft sentences, inversion, and other structures that distinguish C1-C2 speakers.',
    lessons: [
      {
        title: 'Subjunctive Mood',
        contentType: 'grammar',
        estimatedMinutes: 20,
        content: `<h2>Subjunctive Mood</h2>
<p>The subjunctive mood is used in <strong>formal English</strong> to express wishes, demands, suggestions, and hypothetical scenarios. At C1-C2 level, mastering the subjunctive distinguishes you from B2 speakers.</p>

<h3>Type 1: Bare Infinitive Subjunctive (Formal)</h3>
<p>After verbs like demand, insist, suggest, recommend, propose, require:</p>
<ul>
<li>"I <strong>suggest that he go</strong> early." (NOT "he goes")</li>
<li>"The manager <strong>demanded that she finish</strong> the report by Friday."</li>
<li>"It is <strong>essential that every applicant submit</strong> two references."</li>
</ul>

<h3>Type 2: "Were" for All Subjects (Unreal)</h3>
<ul>
<li>"If I <strong>were</strong> you, I would accept."</li>
<li>"If she <strong>were</strong> here, she would agree."</li>
<li>"I wish I <strong>were</strong> taller."</li>
</ul>

<h3>Type 3: Fixed Expressions</h3>
<ul>
<li>"God <strong>bless</strong> you." / "Long <strong>live</strong> the Queen."</li>
<li>"Come what <strong>may</strong>, I will finish this."</li>
<li>"Be that as it <strong>may</strong>, we must proceed."</li>
</ul>

<h3>Common Verbs Triggering the Subjunctive</h3>
<p>advise, ask, command, demand, desire, insist, order, prefer, propose, recommend, request, require, suggest, urge</p>`,
        quizData: JSON.stringify([
          { question: "I suggest that he ___ early.", options: ["leaves","leave","leaving","left"], correctIndex: 1, explanation: "Subjunctive: bare infinitive after 'suggest that'." },
          { question: "It is important that she ___ on time.", options: ["is","be","was","being"], correctIndex: 1, explanation: "Subjunctive: 'be' (not 'is' or 'was') after formal expressions." },
          { question: "If I ___ in charge, things would be different.", options: ["am","was","were","be"], correctIndex: 2, explanation: "Formal second conditional uses 'were' for all subjects." },
          { question: "The doctor recommended that I ___ a break.", options: ["takes","take","took","taking"], correctIndex: 1, explanation: "Subjunctive: bare infinitive after 'recommended that'." },
          { question: "Which uses the subjunctive?", options: ["He goes to school.","She suggested that he go early.","They are leaving.","We will study."], correctIndex: 1, explanation: "'Suggested that he go' uses the bare infinitive subjunctive." },
        ]),
      },
      {
        title: 'Cleft Sentences and Emphasis',
        contentType: 'grammar',
        estimatedMinutes: 15,
        content: `<h2>Cleft Sentences and Emphasis</h2>
<p>Cleft sentences allow you to <strong>emphasise specific information</strong> by splitting a simple sentence into two clauses.</p>

<h3>It-Clefts</h3>
<ul>
<li>Subject: "<strong>It was John</strong> who broke the window."</li>
<li>Object: "<strong>It was the window</strong> that John broke."</li>
<li>Time: "<strong>It was yesterday</strong> that he arrived."</li>
<li>Place: "<strong>It was in Paris</strong> that they met."</li>
</ul>

<h3>Wh-Clefts (Pseudo-Clefts)</h3>
<ul>
<li>"<strong>What I need</strong> is more time."</li>
<li>"<strong>What surprised me</strong> was his reaction."</li>
</ul>

<h3>Reversed Wh-Clefts</h3>
<ul>
<li>"More time is <strong>what I need</strong>."</li>
<li>"His reaction is <strong>what surprised me</strong>."</li>
</ul>

<h3>All-Clefts</h3>
<ul>
<li>"<strong>All I want</strong> is a fair chance."</li>
<li>"<strong>All she did</strong> was complain."</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "'It was John who broke the window' is a:", options: ["wh-cleft","it-cleft","negative cleft","reversed cleft"], correctIndex: 1, explanation: "'It was X who/that...' is an it-cleft sentence." },
          { question: "Emphasise 'a new laptop' in 'I need a new laptop':", options: ["It was a new laptop that I need.","What I need is a new laptop.","A new laptop needs me.","I need it a new laptop."], correctIndex: 1, explanation: "Wh-cleft: 'What I need is...' emphasises the object." },
          { question: "'All I want is a fair chance' is a:", options: ["it-cleft","wh-cleft","all-cleft","negative cleft"], correctIndex: 2, explanation: "'All I want is...' is an all-cleft structure." },
          { question: "Which cleft emphasises the time?", options: ["It was yesterday that he arrived.","It was John who arrived.","What he did was arrive.","He arrived yesterday."], correctIndex: 0, explanation: "'It was yesterday that...' emphasises the time element." },
          { question: "In 'What surprised me was his reaction', the emphasised part is:", options: ["what","surprised","me","his reaction"], correctIndex: 3, explanation: "Wh-clefts emphasise the part after 'is/was'." },
        ]),
      },
      {
        title: 'Hedging and Tentative Language',
        contentType: 'vocabulary',
        estimatedMinutes: 20,
        content: `<h2>Hedging and Tentative Language</h2>
<p>At C1-C2, direct statements sound immature. <strong>Hedging</strong> shows intellectual humility and precision.</p>

<h3>Modal Hedges</h3>
<ul>
<li>"The data <strong>would appear to suggest</strong> that..."</li>
<li>"One <strong>might reasonably argue</strong> that..."</li>
<li>"This <strong>could potentially indicate</strong> that..."</li>
</ul>

<h3>Probability Adverbs</h3>
<ul>
<li>"The results <strong>arguably/presumably/ostensibly</strong> support this theory."</li>
<li>"It is <strong>conceivably/potentially/plausibly</strong> the case that..."</li>
</ul>

<h3>Verbal Hedges</h3>
<ul>
<li>"It <strong>tends to be the case</strong> that..."</li>
<li>"The evidence <strong>seems to point toward</strong>..."</li>
<li>"This <strong>appears to corroborate</strong> the hypothesis that..."</li>
</ul>

<h3>Shield Hedges (Distancing from Claim)</h3>
<ul>
<li>"<strong>According to recent studies</strong>, climate change is accelerating."</li>
<li>"<strong>It is widely held that</strong> free markets drive innovation."</li>
</ul>`,
        vocabulary: JSON.stringify([
          { word: 'Corroborate', definition: 'To confirm or support a statement, theory, or finding', example: 'The new evidence corroborates the initial findings.', pronunciation: '/kəˈrɒbəreɪt/' },
          { word: 'Ostensibly', definition: 'Apparently or seemingly, but perhaps not actually', example: 'The policy is ostensibly designed to help, but its effects are unclear.', pronunciation: '/ɒˈstensɪbli/' },
          { word: 'Plausibly', definition: 'In a way that seems reasonable or probable', example: 'The argument could plausibly be made that education reduces crime.', pronunciation: '/ˈplɔːzɪbli/' },
          { word: 'Postulate', definition: 'To suggest or assume the existence of something as a basis for reasoning', example: 'The researchers postulate a connection between diet and cognitive function.', pronunciation: '/ˈpɒstjʊleɪt/' },
          { word: 'Conceivably', definition: 'In a way that can be imagined or believed', example: 'The project could conceivably be completed by December.', pronunciation: '/kənˈsiːvəbli/' },
        ]),
        quizData: JSON.stringify([
          { question: "Which is the most hedged version of 'This method is the best'?", options: ["This method is probably the best.","This method would appear to be among the most effective currently available.","This method is definitely the best.","This method is okay."], correctIndex: 1, explanation: "Triple hedge: 'would appear to be' + 'among' + 'currently available'." },
          { question: "A 'shield hedge' is:", options: ["using uncertain words","attributing a claim to a source to distance yourself","using numbers","being vague on purpose"], correctIndex: 1, explanation: "Shield hedges attribute claims to sources: 'According to...'." },
          { question: "'The results arguably support this theory' uses:", options: ["modal hedge","probability adverb","verbal hedge","noun phrase hedge"], correctIndex: 1, explanation: "'Arguably' is a probability adverb hedge." },
          { question: "Which is an academic hedge?", options: ["This proves...","It is widely held that...","Everyone knows...","This is definitely..."], correctIndex: 1, explanation: "'It is widely held that...' is a shield hedge used in academic writing." },
          { question: "Why is 'the best' considered unhedged?", options: ["It's too informal.","It's an absolute claim with no concession to uncertainty.","It's too short.","It uses a superlative."], correctIndex: 1, explanation: "'The best' is absolute — hedging adds nuance and caution." },
        ]),
      },
      {
        title: 'Nominalisation',
        contentType: 'grammar',
        estimatedMinutes: 20,
        content: `<h2>Nominalisation</h2>
<p><strong>Nominalisation</strong> turns actions and qualities into noun phrases. It makes writing more formal, concise, and abstract — essential for C1-C2 academic English.</p>

<h3>Verb → Noun Transformations</h3>
<ul>
<li>decide → <strong>the decision</strong> to</li>
<li>investigate → <strong>an investigation</strong> into</li>
<li>argue → <strong>the argument</strong> that</li>
<li>analyse → <strong>an analysis</strong> of</li>
<li>improve → <strong>an improvement</strong> in</li>
<li>fail → <strong>the failure</strong> to</li>
</ul>

<h3>Adjective → Noun Transformations</h3>
<ul>
<li>important → <strong>the importance</strong> of</li>
<li>possible → <strong>the possibility</strong> of</li>
<li>likely → <strong>the likelihood</strong> of</li>
<li>difficult → <strong>the difficulty</strong> of</li>
</ul>

<h3>Example Transformations</h3>
<ul>
<li>❌ "The government decided to increase taxes, and this caused protests."</li>
<li>✅ "<strong>The decision</strong> to increase taxes <strong>led to</strong> widespread protests."</li>
</ul>

<h3>Warning</h3>
<p>Don't overuse nominalisation. Mix nominalised and verbal sentences for rhythm and readability.</p>`,
        quizData: JSON.stringify([
          { question: "Nominalise: 'The government decided to increase taxes, and this caused protests.'", options: ["The decision to increase taxes led to widespread protests.","The government decided and people protested.","Taxes went up and people were angry.","Protests happened because of the government."], correctIndex: 0, explanation: "'Decided' → 'the decision to' is nominalisation." },
          { question: "Which is the nominalised form of 'possible'?", options: ["possibility","possibly","possibleness","possibilise"], correctIndex: 0, explanation: "Possible → possibility (adjective → noun)." },
          { question: "Nominalisation makes writing:", options: ["more informal","more formal and concise","more personal","more emotional"], correctIndex: 1, explanation: "Nominalisation creates formal, abstract, concise academic writing." },
          { question: "Find the nominalisation: 'The implementation of the new software led to an increase in productivity.'", options: ["software","productivity","implementation","increase"], correctIndex: 2, explanation: "'Implementation' is the noun form of 'implement' — a nominalisation." },
          { question: "Overusing nominalisation can:", options: ["make writing clearer","make writing too dense and hard to read","make writing more interesting","make writing more personal"], correctIndex: 1, explanation: "Mix nominalised and verbal sentences for rhythm and readability." },
        ]),
      },
      {
        title: 'Discourse Markers for Sophisticated Writing',
        contentType: 'reading',
        estimatedMinutes: 15,
        content: `<h2>Discourse Markers for Sophisticated Writing</h2>
<p><strong>Discourse markers</strong> connect ideas and show relationships between sentences. At C1-C2, you need sophisticated ones — not just "but" and "so."</p>

<h3>Adding Information</h3>
<ul>
<li>B1: "Also," "And," "Besides"</li>
<li>C1: "<strong>Furthermore</strong>," "<strong>Moreover</strong>," "<strong>In addition</strong>," "<strong>What is more</strong>," "<strong>Not only... but also</strong>"</li>
</ul>

<h3>Contrasting</h3>
<ul>
<li>B1: "But," "However"</li>
<li>C1: "<strong>Nevertheless</strong>," "<strong>Nonetheless</strong>," "<strong>Conversely</strong>," "<strong>By contrast</strong>," "<strong>On the other hand</strong>"</li>
</ul>

<h3>Cause and Effect</h3>
<ul>
<li>B1: "So," "Because"</li>
<li>C1: "<strong>Consequently</strong>," "<strong>As a result</strong>," "<strong>Hence</strong>," "<strong>Therefore</strong>," "<strong>This means that</strong>"</li>
</ul>

<h3>Giving Examples</h3>
<ul>
<li>B1: "For example"</li>
<li>C1: "<strong>To illustrate</strong>," "<strong>A case in point is</strong>," "<strong>By way of illustration</strong>"</li>
</ul>

<h3>Concluding</h3>
<ul>
<li>B1: "In conclusion"</li>
<li>C1: "<strong>To sum up</strong>," "<strong>All in all</strong>," "<strong>Taking everything into account</strong>," "<strong>On balance</strong>"</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "Which is the most sophisticated contrast marker?", options: ["But","However","Nevertheless","Even so"], correctIndex: 2, explanation: "'Nevertheless' is formal and sophisticated for academic writing." },
          { question: "'Furthermore' is used to:", options: ["contrast ideas","add information","give examples","conclude"], correctIndex: 1, explanation: "'Furthermore' adds another point supporting the same argument." },
          { question: "Which reformulation marker means 'in simpler terms'?", options: ["In other words","However","Therefore","Furthermore"], correctIndex: 0, explanation: "'In other words' restates an idea in different terms." },
          { question: "'Consequently' signals:", options: ["addition","contrast","cause and effect","example"], correctIndex: 2, explanation: "'Consequently' = as a result, therefore — cause and effect." },
          { question: "Which is a sophisticated example marker?", options: ["For example","To illustrate","Like","Such as"], correctIndex: 1, explanation: "'To illustrate' is more formal than 'for example'." },
        ]),
      },
      {
        title: 'Inversion for Emphasis',
        contentType: 'grammar',
        estimatedMinutes: 15,
        content: `<h2>Inversion for Emphasis</h2>
<p>Inversion (reversing subject-verb order) adds <strong>dramatic emphasis</strong> and is expected at C1-C2.</p>

<h3>Negative Adverbials at the Beginning</h3>
<ul>
<li>"<strong>Never before</strong> have I witnessed such behaviour."</li>
<li>"<strong>Rarely</strong> does a film live up to its hype."</li>
<li>"<strong>Hardly had</strong> the meeting started when the alarm went off."</li>
<li>"<strong>No sooner had</strong> I arrived than it began to rain."</li>
</ul>

<h3>After "Only"</h3>
<ul>
<li>"<strong>Only later</strong> did I realise my mistake."</li>
<li>"<strong>Only when</strong> the report was published did the government respond."</li>
<li>"<strong>Only by</strong> working together can we solve this."</li>
</ul>

<h3>After "So/Such...That"</h3>
<ul>
<li>"<strong>So beautiful</strong> was the sunset that we stopped to watch."</li>
<li>"<strong>Such was</strong> the confusion that nobody knew what to do."</li>
</ul>

<h3>Conditional Inversion (Without "If")</h3>
<ul>
<li>"<strong>Had I known</strong>, I would have acted differently." (= If I had known)</li>
<li>"<strong>Were she to agree</strong>, we could proceed." (= If she were to agree)</li>
<li>"<strong>Should you need</strong> assistance, please contact us." (= If you should need)</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "Invert: 'I have never seen such a beautiful city.'", options: ["Never have I seen such a beautiful city.","Never I have seen such a beautiful city.","Have I never seen such a beautiful city.","Such a beautiful city never I have seen."], correctIndex: 0, explanation: "Negative adverbial + auxiliary + subject + verb." },
          { question: "'Had I known' is an inverted form of:", options: ["If I knew","If I had known","If I would know","If I was knowing"], correctIndex: 1, explanation: "Conditional inversion: 'If I had known' → 'Had I known'." },
          { question: "___ had the meeting started when the alarm went off.", options: ["Hardly","Only","Such","So"], correctIndex: 0, explanation: "'Hardly had...when' is a negative inversion pattern." },
          { question: "'Only later did I realise my mistake' uses inversion after:", options: ["never","only","hardly","so"], correctIndex: 1, explanation: "'Only + adverb' triggers subject-auxiliary inversion." },
          { question: "'So beautiful was the sunset that we stopped.' emphasises:", options: ["the stopping","the sunset","the beauty","that we stopped"], correctIndex: 2, explanation: "'So beautiful' is fronted for emphasis on the degree of beauty." },
        ]),
      },
      {
        title: 'Advanced Reporting Verbs',
        contentType: 'vocabulary',
        estimatedMinutes: 15,
        content: `<h2>Advanced Reporting Verbs</h2>
<p>At B1-B2, you use "He said that..." At C1-C2, you choose verbs that show <strong>attitude</strong>.</p>

<h3>Categories of Reporting Verbs</h3>
<ul>
<li><strong>Neutral:</strong> state, report, mention, note, observe, point out, acknowledge</li>
<li><strong>Agreement:</strong> agree, confirm, support, affirm, endorse, corroborate</li>
<li><strong>Disagreement:</strong> argue, claim, contend, challenge, dispute, reject, refute, dismiss</li>
<li><strong>Tentativeness:</strong> suggest, imply, indicate, speculate, hypothesise, postulate</li>
<li><strong>Emphasis:</strong> assert, insist, maintain, emphasise, stress, underscore</li>
<li><strong>Criticism:</strong> criticise, condemn, denounce, disparage, question</li>
</ul>

<h3>Structure Patterns</h3>
<ul>
<li>verb + <strong>that</strong>: "She <strong>argued that</strong> the policy was flawed."</li>
<li>verb + <strong>noun</strong>: "He <strong>rejected</strong> the proposal."</li>
<li>verb + <strong>-ing</strong>: "She <strong>admitted</strong> making a mistake."</li>
<li>verb + <strong>to + infinitive</strong>: "He <strong>claimed to have</strong> discovered the solution."</li>
<li>verb + <strong>object + to + infinitive</strong>: "They <strong>persuaded him to</strong> reconsider."</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "Which reporting verb shows DISAGREEMENT?", options: ["confirm","dispute","acknowledge","state"], correctIndex: 1, explanation: "'Dispute' means to argue against or challenge a claim." },
          { question: "'She admitted making a mistake' uses which pattern?", options: ["verb + that","verb + noun","verb + -ing","verb + to + infinitive"], correctIndex: 2, explanation: "'Admit' + -ing form is the correct complementation pattern." },
          { question: "Which verb shows TENTATIVENESS?", options: ["assert","insist","hypothesise","demand"], correctIndex: 2, explanation: "'Hypothesise' suggests uncertainty — it's a tentative reporting verb." },
          { question: "'He claimed to have discovered the solution' uses:", options: ["verb + that","verb + noun","verb + -ing","verb + to + infinitive"], correctIndex: 3, explanation: "'Claim' + to + infinitive is the correct structure." },
          { question: "Which verb shows STRONG AGREEMENT?", options: ["suggest","imply","endorse","speculate"], correctIndex: 2, explanation: "'Endorse' means to strongly support or confirm." },
        ]),
      },
      {
        title: 'Academic Writing — Cohesion and Coherence',
        contentType: 'reading',
        estimatedMinutes: 20,
        content: `<h2>Academic Writing — Cohesion and Coherence</h2>
<p><strong>Cohesion</strong> (how sentences connect) + <strong>Coherence</strong> (how ideas flow logically) = excellent academic writing.</p>

<h3>1. Reference (Pronouns, Articles, Demonstratives)</h3>
<p>"The experiment <strong>was conducted</strong> over three weeks. <strong>It</strong> yielded significant results. <strong>These findings</strong> suggest that..."</p>

<h3>2. Substitution (Replace a Word/Phrase)</h3>
<p>"The first proposal was rejected. <strong>A revised one</strong> was submitted."</p>

<h3>3. Ellipsis (Omit Repeated Words)</h3>
<p>"Some people prefer tea; others [prefer] coffee."</p>

<h3>4. Lexical Chains (Related Vocabulary)</h3>
<p>"<strong>Education</strong> policy... <strong>curriculum</strong> reform... <strong>student</strong> outcomes... <strong>learning</strong> objectives... <strong>teaching</strong> methods"</p>

<h3>5. Conjunction (Logical Connectors)</h3>
<ul>
<li>Addition: furthermore, moreover</li>
<li>Contrast: however, conversely</li>
<li>Cause: consequently, therefore</li>
</ul>

<h3>6. Semantic Patterns</h3>
<ul>
<li>Problem → Solution → Evaluation</li>
<li>General → Specific → Example</li>
<li>Claim → Evidence → Conclusion</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "Using 'these findings' to refer back to previous results is an example of:", options: ["substitution","reference","ellipsis","lexical chain"], correctIndex: 1, explanation: "Reference uses pronouns/demonstratives to connect ideas." },
          { question: "'Some prefer tea; others coffee' uses:", options: ["reference","substitution","ellipsis","conjunction"], correctIndex: 2, explanation: "Ellipsis omits 'prefer' before 'coffee' — understood from context." },
          { question: "A lexical chain uses:", options: ["pronouns to connect ideas","related vocabulary across sentences","omitted words","logical connectors"], correctIndex: 1, explanation: "Lexical chains use semantically related words: education → curriculum → student." },
          { question: "'A revised one was submitted' uses:", options: ["reference","substitution","ellipsis","lexical chain"], correctIndex: 1, explanation: "'One' substitutes for 'proposal' — avoiding repetition." },
          { question: "Which is a semantic pattern for academic paragraphs?", options: ["Random → Confusing → Long","Problem → Solution → Evaluation","Big → Small → Medium","First → Last → Middle"], correctIndex: 1, explanation: "Problem → Solution → Evaluation is a standard academic pattern." },
        ]),
      },
      {
        title: 'Metaphorical and Idiomatic Language',
        contentType: 'vocabulary',
        estimatedMinutes: 15,
        content: `<h2>Metaphorical and Idiomatic Language</h2>
<p>Native speakers use <strong>metaphor</strong> constantly. At C1-C2, you need to understand and produce it naturally.</p>

<h3>Business Metaphors</h3>
<ul>
<li>"We need to <strong>get the ball rolling</strong>." (start)</li>
<li>"Let's <strong>touch base</strong> next week." (meet briefly)</li>
<li>"We <strong>hit a roadblock</strong>." (encountered a problem)</li>
<li>"The project is <strong>on track</strong>." (progressing well)</li>
<li>"We <strong>moved the goalposts</strong>." (changed the criteria)</li>
</ul>

<h3>Academic Metaphors</h3>
<ul>
<li>"This research <strong>sheds light on</strong> the problem."</li>
<li>"The study <strong>builds on</strong> previous work."</li>
<li>"The theory <strong>falls apart</strong> under scrutiny."</li>
</ul>

<h3>Nature Metaphors</h3>
<ul>
<li>"The economy is <strong>blooming</strong>."</li>
<li>"A <strong>wave</strong> of protests swept the country."</li>
<li>"The idea <strong>took root</strong> quickly."</li>
</ul>

<h3>Important Note</h3>
<p>Academic writing prefers <strong>dead metaphors</strong> (so common they're literal: "field of study") over <strong>creative metaphors</strong>.</p>`,
        quizData: JSON.stringify([
          { question: "'We need to get the ball rolling' means:", options: ["play a sport","start something","stop something","find a ball"], correctIndex: 1, explanation: "'Get the ball rolling' = start a process." },
          { question: "'This research sheds light on the problem' uses a:", options: ["war metaphor","nature metaphor","light metaphor","sports metaphor"], correctIndex: 2, explanation: "'Sheds light on' = illuminates/clarifies — a light metaphor." },
          { question: "In academic writing, which type of metaphor is preferred?", options: ["creative metaphors","dead metaphors (field of study)","sports metaphors","war metaphors"], correctIndex: 1, explanation: "Dead metaphors are so common they're accepted as literal: 'field of study'." },
          { question: "'The project is on track' means:", options: ["it's near a railway","it's progressing well","it's delayed","it's finished"], correctIndex: 1, explanation: "'On track' = progressing as planned." },
          { question: "Which is a nature metaphor?", options: ["Hit a roadblock","A wave of protests","Move the goalposts","Touch base"], correctIndex: 1, explanation: "'A wave of protests' uses a water/nature metaphor." },
        ]),
      },
      {
        title: 'Critical Thinking and Evaluation Language',
        contentType: 'quiz',
        estimatedMinutes: 20,
        content: `<h2>Critical Thinking and Evaluation Language</h2>
<p>At C1-C2, you don't just describe — you <strong>evaluate, critique, and synthesise</strong>.</p>

<h3>Evaluating Strengths</h3>
<ul>
<li>"The principal strength of this approach lies in..."</li>
<li>"A notable advantage is..."</li>
<li>"The methodology is robust in that..."</li>
</ul>

<h3>Evaluating Weaknesses</h3>
<ul>
<li>"A potential limitation is..."</li>
<li>"The study is not without its shortcomings..."</li>
<li>"This raises questions about..."</li>
</ul>

<h3>Evaluating Evidence</h3>
<ul>
<li>"The evidence <strong>overwhelmingly supports</strong>..."</li>
<li>"There is <strong>insufficient evidence</strong> to conclude that..."</li>
<li>"These findings <strong>should be interpreted with caution</strong> due to..."</li>
</ul>

<h3>Synthesising Multiple Sources</h3>
<ul>
<li>"While Smith (2020) argues that..., Jones (2021) contends that..."</li>
<li>"Both studies converge on the point that..."</li>
</ul>

<h3>Drawing Measured Conclusions</h3>
<ul>
<li>"On balance, the evidence suggests that..."</li>
<li>"It would be premature to conclude that..."</li>
<li>"Future research would benefit from investigating..."</li>
</ul>`,
        quizData: JSON.stringify([
          { question: "'The study is not without its shortcomings' is a way to:", options: ["praise the study","criticise the study diplomatically","ignore the study","summarise the study"], correctIndex: 1, explanation: "'Not without shortcomings' = hedged criticism." },
          { question: "'These findings should be interpreted with caution' means:", options: ["the findings are wrong","the findings are perfect","there may be limitations affecting the findings","the findings are irrelevant"], correctIndex: 2, explanation: "This hedged phrase signals potential limitations." },
          { question: "Which phrase synthesises two sources?", options: ["Smith says X. Jones says Y.","While Smith argues X, Jones contends Y.","X is true. Y is also true.","Smith and Jones wrote papers."], correctIndex: 1, explanation: "'While X, Y' shows the relationship between two sources' views." },
          { question: "'On balance, the evidence suggests that...' is:", options: ["a rejection","a measured conclusion","a hypothesis","a question"], correctIndex: 1, explanation: "'On balance' + 'suggests' = measured, not absolute, conclusion." },
          { question: "'It would be premature to conclude that...' means:", options: ["the conclusion is correct","we don't have enough evidence yet","the conclusion is wrong","we should conclude immediately"], correctIndex: 1, explanation: "'Premature' = too early — more evidence is needed." },
        ]),
      },
    ],
  },
  {
    title: 'Advanced Grammar Mastery',
    icon: 'Library',
    description: 'Master participle clauses, ellipsis, advanced relative clauses, and other high-level grammar.',
    lessons: [
      { title: 'Complex Conditionals and Alternatives', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Participle Clauses (Having finished, Walking down...)', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Ellipsis and Substitution in Formal Contexts', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Advanced Relative Clauses', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Future in the Past', contentType: 'reading', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Emphatic Structures (do/did, What I did was...)', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Complementation Patterns (verb + wh-clause)', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Verbs of Perception + Object + Bare Infinitive', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Transitivity and Verb Patterns', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Coordination and Subordination Mastery', contentType: 'quiz', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
    ],
  },
  {
    title: 'Academic and Professional Mastery',
    icon: 'GraduationCap',
    description: 'Develop the language skills needed for academic publishing, conference presentations, and leadership.',
    lessons: [
      { title: 'Writing Abstracts and Executive Summaries', contentType: 'reading', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Literature Review Language', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Methodology Descriptions', contentType: 'vocabulary', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Results and Discussion Sections', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Research Proposals', contentType: 'reading', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Conference Presentations', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Negotiating and Mediating Conflicts', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Cross-Cultural Communication', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Crisis Communication', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Leadership Language', contentType: 'quiz', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
    ],
  },
  {
    title: 'Nuanced Communication',
    icon: 'Brain',
    description: 'Master irony, humour, persuasion, and emotional intelligence in English communication.',
    lessons: [
      { title: 'Irony, Sarcasm, and Subtext', contentType: 'reading', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Humour in Professional Contexts', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Storytelling and Narrative Techniques', contentType: 'vocabulary', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Persuasion and Rhetoric', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Impromptu Speaking', contentType: 'reading', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Debating and Counter-Arguments', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Reframing and Perspective-Shifting', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Emotional Intelligence Language', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Diplomatic English for Sensitive Topics', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Public Speaking and Voice Control', contentType: 'quiz', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
    ],
  },
  {
    title: 'Native-Like Fluency',
    icon: 'Award',
    description: 'Achieve near-native fluency with phrasal verbs, regional variations, and language play.',
    lessons: [
      { title: 'Phrasal Verbs at C2 Level', contentType: 'reading', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Regional Variations (UK vs US vs AUS)', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Archaic and Literary Expressions', contentType: 'vocabulary', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Professional Register Variations', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Imprecision and Vagueness (deliberate)', contentType: 'reading', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Repair Strategies in Speech', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Coherence in Extended Discourse', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Intertextuality and Allusion', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Language Play and Wordplay', contentType: 'grammar', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
      { title: 'Final Review: C1→C2 Progress Check', contentType: 'quiz', estimatedMinutes: 20, content: '', quizData: '', vocabulary: '', videoUrl: null },
    ],
  },
];


// ═══════════════════════════════════════════════════════════════
//  MAIN SEED FUNCTION
// ═══════════════════════════════════════════════════════════════

const COURSES = [
  {
    slug: 'beginner',
    title: 'Beginner English',
    subtitle: 'From A1 to A2 — Build your foundation',
    level: 'A1-A2',
    price: 49,
    compareAtPrice: 79,
    description: 'Build a solid English foundation from scratch. This comprehensive course takes you from complete beginner to A2 level, covering essential vocabulary, basic grammar, and everyday communication skills. Perfect for those starting their English learning journey.',
    features: JSON.stringify(['5 comprehensive modules','50 interactive lessons','Grammar fundamentals with exercises','Vocabulary building (500+ words)','Quizzes after every module','Progress tracking dashboard','Completion certificate']),
    modulesCount: 5,
    lessonsCount: 50,
    estimatedHours: 30,
    order: 1,
    moduleDefs: BEGINNER_MODULES,
  },
  {
    slug: 'intermediate',
    title: 'Intermediate English',
    subtitle: 'From B1 to B2 — Communicate with confidence',
    level: 'B1-B2',
    price: 79,
    compareAtPrice: 129,
    description: 'Elevate your English to professional and academic levels. Master complex grammar, professional communication, and academic writing. This course bridges the gap between basic English and confident, fluent communication in any context.',
    features: JSON.stringify(['5 comprehensive modules','50 interactive lessons','Complex grammar mastery','Professional communication skills','Academic English foundations','Quizzes after every module','Progress tracking dashboard','Completion certificate']),
    modulesCount: 5,
    lessonsCount: 50,
    estimatedHours: 50,
    order: 2,
    moduleDefs: INTERMEDIATE_MODULES,
  },
  {
    slug: 'advanced',
    title: 'Advanced English',
    subtitle: 'From C1 to C2 — Master the language',
    level: 'C1-C2',
    price: 99,
    compareAtPrice: 169,
    description: 'Achieve true English mastery at the highest level. Explore rhetoric, academic publishing, linguistic precision, and cultural intelligence. This course prepares you for C2 proficiency certification and professional excellence in any English-speaking environment.',
    features: JSON.stringify(['5 comprehensive modules','50 interactive lessons','Academic & professional mastery','Rhetoric & persuasion techniques','Nuanced communication skills','Quizzes after every module','Progress tracking dashboard','Completion certificate']),
    modulesCount: 5,
    lessonsCount: 50,
    estimatedHours: 60,
    order: 3,
    moduleDefs: ADVANCED_MODULES,
  },
];

async function main() {
  console.log('🌱 Seeding new lesson structure (150 lessons)...\n');

  let totalLessons = 0;
  let totalModules = 0;

  for (const courseData of COURSES) {
    console.log(`📚 Creating course: ${courseData.title}`);
    
    // Delete existing course data (cascade will handle modules/lessons/enrollments)
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

    for (let m = 0; m < courseData.moduleDefs.length; m++) {
      const mod = courseData.moduleDefs[m];
      console.log(`  📂 Module ${m + 1}: ${mod.title}`);
      
      const moduleRecord = await prisma.courseModule.create({
        data: {
          courseId: course.id,
          moduleNumber: m + 1,
          title: mod.title,
          description: mod.description,
          icon: mod.icon,
          order: m,
          isPublished: true,
        },
      });

      for (let l = 0; l < mod.lessons.length; l++) {
        const lesson = mod.lessons[l];
        const levelLabel = courseData.level;
        
        // Fill in template content for outlined lessons (empty content)
        let content = lesson.content;
        let vocabulary = lesson.vocabulary;
        let quizData = lesson.quizData;
        let audioScript = lesson.audioScript;

        if (!content || content === '') {
          content = templateContent(levelLabel, mod.title, lesson.title, lesson.contentType);
        }
        if (lesson.contentType === 'vocabulary' && (!vocabulary || vocabulary === '')) {
          vocabulary = templateVocab(lesson.title, levelLabel);
        }
        if (lesson.contentType === 'quiz' && (!quizData || quizData === '')) {
          quizData = templateQuiz(lesson.title);
        }
        // For non-quiz lessons that have quizData from the detailed lessons, keep it
        // For quiz lessons without quizData, generate template
        
        const lessonData: any = {
          moduleId: moduleRecord.id,
          lessonNumber: l + 1,
          title: lesson.title,
          contentType: lesson.contentType,
          content,
          estimatedMinutes: lesson.estimatedMinutes,
          order: l,
          isPublished: true,
        };

        if (vocabulary && vocabulary !== '') {
          lessonData.vocabulary = vocabulary;
        }
        if (quizData && quizData !== '') {
          lessonData.quizData = quizData;
        }
        if (audioScript && audioScript !== '') {
          lessonData.audioScript = audioScript;
        }
        if (lesson.videoUrl) {
          lessonData.videoUrl = lesson.videoUrl;
        }

        await prisma.courseLesson.create({ data: lessonData });
        totalLessons++;
      }
      totalModules++;
    }
    
    console.log(`  ✅ ${courseData.title}: ${courseData.moduleDefs.length} modules, ${courseData.moduleDefs.length * 10} lessons\n`);
  }

  console.log('🎉 Lesson seeding complete!');
  console.log(`\nSummary:`);
  console.log(`  - Total modules: ${totalModules}`);
  console.log(`  - Total lessons: ${totalLessons}`);
  console.log(`  - Beginner: 5 modules, 50 lessons (10 detailed + 40 outlined)`);
  console.log(`  - Intermediate: 5 modules, 50 lessons (10 detailed + 40 outlined)`);
  console.log(`  - Advanced: 5 modules, 50 lessons (10 detailed + 40 outlined)`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
