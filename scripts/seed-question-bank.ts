/**
 * Seed Question Bank — TestCEFR Database
 *
 * Seeds the following into the database:
 *   1. ReadingPassage + ReadingQuestion — 6 passages (A1–C2), each with 2 sub-questions
 *   2. ListeningItem + ListeningQuestion — 6 items (A1–C2), each with 1 question
 *   3. SpeakingPrompt — 6 prompts (A1–C2)
 *   4. WritingPrompt — 6 prompts (A1–C2)
 *   5. Extra MCQ Questions (Question model) — 4 grammar + 4 vocabulary per level (A2, B1, B2, C1)
 *
 * Idempotent: uses variantGroup to check for existing records before inserting.
 *
 * Run with:
 *   npx tsx scripts/seed-question-bank.ts
 */

import { PrismaClient } from '@prisma/client';

// ─── Bootstrap ───────────────────────────────────────────────
// Same fallback logic as src/lib/db.ts:
// The shell may have a stale SQLite DATABASE_URL that overrides .env.
// If the runtime DATABASE_URL is not a PostgreSQL URL, fall back to DATABASE_URL_UNPOOLED.
const effectiveUrl = process.env.DATABASE_URL?.startsWith('postgresql://')
  ? process.env.DATABASE_URL
  : process.env.DATABASE_URL_UNPOOLED;

if (!effectiveUrl) {
  console.error('ERROR: Neither DATABASE_URL nor DATABASE_URL_UNPOOLED points to a PostgreSQL database.');
  process.exit(1);
}

console.log(`🔗 Using database: ${effectiveUrl.replace(/:[^:@]+@/, ':****@')}`);

const prisma = new PrismaClient({
  datasourceUrl: effectiveUrl,
});

// ─── Data Definitions ────────────────────────────────────────

interface ReadingPassageData {
  variantGroup: string;
  level: string;
  passageText: string;
  questions: {
    questionText: string;
    options: string[];
    correctIndex: number;
    sortOrder: number;
  }[];
}

const READING_PASSAGES: ReadingPassageData[] = [
  {
    variantGroup: 'r-a1',
    level: 'A1',
    passageText:
      'My name is Tom. I am 25 years old. I live in a small apartment in the city centre. Every morning, I wake up at 7 oclock and have breakfast. I usually eat toast and drink coffee. Then I take the bus to work. I work in a shop. I like my job because I meet many people. In the evening, I go home and cook dinner. After dinner, I watch TV or read a book. I go to bed at 10 oclock.',
    questions: [
      {
        questionText: 'Where does Tom live?',
        options: ['In a house', 'In an apartment', 'On a farm', 'With his parents'],
        correctIndex: 1,
        sortOrder: 0,
      },
      {
        questionText: 'How does Tom go to work?',
        options: ['By car', 'On foot', 'By bus', 'By bike'],
        correctIndex: 2,
        sortOrder: 1,
      },
    ],
  },
  {
    variantGroup: 'r-a2',
    level: 'A2',
    passageText:
      'Last weekend, Maria decided to try a new restaurant that had just opened near her office. The restaurant, called The Green Table, specializes in vegetarian food. Maria is not a vegetarian, but she wanted to eat something healthy. She ordered a mixed salad as a starter and a mushroom risotto for the main course. The food was delicious, and the service was friendly. The only problem was that the restaurant was quite busy, so she had to wait 20 minutes for a table. She said she would definitely go back, but next time she would make a reservation.',
    questions: [
      {
        questionText: 'Why did Maria choose The Green Table?',
        options: ['She is vegetarian', 'She wanted healthy food', 'Her friend recommended it', 'It was the cheapest option'],
        correctIndex: 1,
        sortOrder: 0,
      },
      {
        questionText: 'What was the problem with the restaurant?',
        options: ['The food was bad', 'The service was slow', 'It was too busy', 'It was too expensive'],
        correctIndex: 2,
        sortOrder: 1,
      },
    ],
  },
  {
    variantGroup: 'r-b1',
    level: 'B1',
    passageText:
      'Working from home has become increasingly common in recent years, and the trend accelerated dramatically during the global pandemic. While many employees appreciate the flexibility and time saved by not commuting, remote work also presents significant challenges. Studies have shown that remote workers often struggle to separate their professional and personal lives, leading to longer working hours and increased stress. Additionally, the lack of face-to-face interaction can make collaboration more difficult and reduce the sense of belonging within a team. Some companies have adopted hybrid models, allowing employees to split their time between home and office, as a compromise that aims to capture the benefits of both arrangements.',
    questions: [
      {
        questionText: 'According to the passage, what is one major challenge of remote work?',
        options: ['Higher transportation costs', 'Difficulty separating work and personal life', 'Reduced salary', 'Lack of technology'],
        correctIndex: 1,
        sortOrder: 0,
      },
      {
        questionText: 'What solution do some companies offer?',
        options: ['Fully remote work', 'Returning to the office', 'Hybrid models', 'Shorter working hours'],
        correctIndex: 2,
        sortOrder: 1,
      },
    ],
  },
  {
    variantGroup: 'r-b2',
    level: 'B2',
    passageText:
      'The concept of a circular economy has gained considerable traction among policymakers and business leaders seeking alternatives to the traditional linear model of take-make-dispose. In a circular economy, products and materials are designed for durability, reuse, and recyclability, thereby minimizing waste and reducing the extraction of virgin resources. Proponents argue that this approach not only addresses environmental concerns but also creates economic opportunities through new business models such as product-as-a-service, where consumers lease rather than own products. Critics, however, contend that the transition to a circular economy is hindered by entrenched consumer habits, inadequate infrastructure for recycling and remanufacturing, and the economic incentives that still favour linear production. Despite these obstacles, several multinational corporations have begun incorporating circular principles into their operations, suggesting that incremental progress is possible even without a complete systemic overhaul.',
    questions: [
      {
        questionText: 'What is the primary advantage of the product-as-a-service model according to the passage?',
        options: ['It eliminates the need for recycling', 'It reduces consumer costs significantly', 'It supports circular economy principles by changing ownership patterns', 'It is the only viable circular economy approach'],
        correctIndex: 2,
        sortOrder: 0,
      },
      {
        questionText: 'What do critics identify as barriers to the circular economy?',
        options: ['Lack of scientific evidence', 'Consumer habits, poor infrastructure, and existing economic incentives', 'Resistance from environmental groups', 'Technological limitations only'],
        correctIndex: 1,
        sortOrder: 1,
      },
    ],
  },
  {
    variantGroup: 'r-c1',
    level: 'C1',
    passageText:
      'The burgeoning field of neuroethics confronts a constellation of dilemmas arising from advances in neurotechnology. Brain-computer interfaces, once confined to science fiction, now enable individuals with severe motor disabilities to control prosthetic limbs and communication devices through neural signals alone. While these developments are laudable, they raise profound questions about cognitive liberty, the right to mental privacy, and the potential for coercion if such technologies become commodified. Moreover, the capacity for neural manipulation, whether for therapeutic or enhancement purposes, blurs the boundary between treatment and augmentation, compelling society to re-examine longstanding assumptions about identity, agency, and authenticity. As regulatory frameworks struggle to keep pace with technological innovation, neuroethicists advocate for a precautionary yet progressive approach that safeguards fundamental cognitive rights without stifling innovation that could alleviate suffering.',
    questions: [
      {
        questionText: 'What fundamental tension does the passage identify in the field of neuroethics?',
        options: ['The cost of neurotechnology versus its benefits', 'The conflict between treating medical conditions and enhancing human capabilities', 'The competition between different neurotechnology companies', 'The disagreement between scientists and ethicists about research methods'],
        correctIndex: 1,
        sortOrder: 0,
      },
      {
        questionText: 'What approach do neuroethicists recommend?',
        options: ['Complete prohibition of neural manipulation', 'Unrestricted development of neurotechnology', 'A balanced approach that protects rights while allowing beneficial innovation', 'Deferring all decisions to international regulatory bodies'],
        correctIndex: 2,
        sortOrder: 1,
      },
    ],
  },
  {
    variantGroup: 'r-c2',
    level: 'C2',
    passageText:
      "The epistemological implications of large language models extend far beyond their practical applications, challenging foundational assumptions about the nature of knowledge, understanding, and meaning. When a language model generates a coherent and seemingly insightful response, it raises the question of whether this output constitutes genuine understanding or merely sophisticated pattern matching. The philosopher John Searles Chinese Room argument, originally formulated to critique symbolic AI, finds renewed relevance: just as Searles hypothetical room occupant can manipulate Chinese symbols without understanding Chinese, a language model processes tokens without, by most philosophical accounts, apprehending their referential content. Yet critics of this analogy contend that it relies on an unduly individualistic conception of cognition, one that neglects the distributed and relational character of meaning-making. From a pragmatic standpoint, if a models outputs are indistinguishable from those of a competent language user, and if they reliably facilitate communication and problem-solving, the question of internal understanding may be moot. This position, however, risks conflating functional equivalence with ontological identity, a conflation that has historically underwritten pernicious simplifications in the philosophy of mind. The debate thus mirrors broader tensions between instrumentalist and realist approaches to knowledge, with significant implications for how we conceptualize artificial intelligence and its place in the epistemic landscape.",
    questions: [
      {
        questionText: 'How does the passage characterize the central philosophical debate regarding large language models?',
        options: ['Whether they will replace human intelligence entirely', 'Whether their outputs constitute genuine understanding or merely sophisticated pattern matching', 'Whether they should be regulated by governments', 'Whether they are more efficient than traditional computing methods'],
        correctIndex: 1,
        sortOrder: 0,
      },
      {
        questionText: 'What criticism does the passage level against the pragmatic position?',
        options: ['It overestimates the capabilities of language models', 'It conflates functional equivalence with ontological identity', 'It relies too heavily on Searles Chinese Room argument', 'It fails to consider the practical benefits of language models'],
        correctIndex: 1,
        sortOrder: 1,
      },
    ],
  },
];

interface ListeningItemData {
  variantGroup: string;
  level: string;
  scriptText: string;
  questions: {
    questionText: string;
    options: string[];
    correctIndex: number;
    sortOrder: number;
  }[];
}

const LISTENING_ITEMS: ListeningItemData[] = [
  {
    variantGroup: 'l-a1',
    level: 'A1',
    scriptText:
      'Hello, my name is Sarah. I am a student at the university. I study English every day because I want to travel to London next summer.',
    questions: [
      {
        questionText: 'Why does Sarah study English?',
        options: ['For her job', 'To travel to London', 'For an exam', 'To teach others'],
        correctIndex: 1,
        sortOrder: 0,
      },
    ],
  },
  {
    variantGroup: 'l-a2',
    level: 'A2',
    scriptText:
      'Excuse me, could you tell me how to get to the train station? Go straight down this road for two blocks, then turn left at the traffic light. You will see the station on your right.',
    questions: [
      {
        questionText: 'Where is the train station?',
        options: ['On the left after two blocks', 'On the right after turning left', 'Straight ahead', 'Behind the traffic light'],
        correctIndex: 1,
        sortOrder: 0,
      },
    ],
  },
  {
    variantGroup: 'l-b1',
    level: 'B1',
    scriptText:
      'I have been working at the company for three years now, and I really enjoy the collaborative atmosphere. However, the commute is getting quite long, so I am considering asking my manager if I could work from home two days a week.',
    questions: [
      {
        questionText: 'What is the speaker considering?',
        options: ['Finding a new job', 'Asking to work from home part-time', 'Moving closer to work', 'Reducing work hours'],
        correctIndex: 1,
        sortOrder: 0,
      },
    ],
  },
  {
    variantGroup: 'l-b2',
    level: 'B2',
    scriptText:
      'The recent study published in the Journal of Environmental Science suggests that urban green spaces not only improve air quality but also have a significant impact on residents mental health. Researchers found that people living within 300 metres of a park reported 25 percent lower stress levels compared to those without easy access to green areas.',
    questions: [
      {
        questionText: 'What does the study primarily suggest about urban green spaces?',
        options: ['They should be expanded to cover more area', 'They benefit both environmental and psychological well-being', 'They are more effective than medication for stress', 'They only help people who live very close to them'],
        correctIndex: 1,
        sortOrder: 0,
      },
    ],
  },
  {
    variantGroup: 'l-c1',
    level: 'C1',
    scriptText:
      'While the government touts the new infrastructure bill as a panacea for the nations crumbling bridges and roads, critics argue that the allocated funds are merely a drop in the ocean. The bipartisan compromise, they contend, sacrifices long-term sustainability for short-term political gains, leaving future generations to grapple with the consequences of deferred maintenance and inadequate investment in resilient design.',
    questions: [
      {
        questionText: "What is the critics main argument against the infrastructure bill?",
        options: ['It focuses too much on bridges and ignores other infrastructure', 'It is politically motivated and insufficient for long-term needs', 'It adequately addresses all infrastructure concerns', 'It should have been passed earlier to prevent current problems'],
        correctIndex: 1,
        sortOrder: 0,
      },
    ],
  },
  {
    variantGroup: 'l-c2',
    level: 'C2',
    scriptText:
      'The paradox of modern globalization lies in its simultaneous capacity to homogenize and fragment. As transnational corporations impose a veneer of cultural uniformity through ubiquitous branding and algorithmically curated content, local identities undergo a complex process of renegotiation rather than mere erasure. Scholars of cultural hybridity argue that this dialectic produces novel syncretic forms, which neither conform to the dominant global template nor replicate pre-globalization traditions, but instead inhabit an interstitial space that defies conventional categorization.',
    questions: [
      {
        questionText: 'According to the passage, what is the key insight about cultural globalization?',
        options: ['It inevitably destroys local cultures completely', 'It creates entirely new cultural forms that blend global and local elements', 'It has no meaningful impact on cultural identity', 'It strengthens traditional cultures against external influence'],
        correctIndex: 1,
        sortOrder: 0,
      },
    ],
  },
];

interface SpeakingPromptData {
  variantGroup: string;
  level: string;
  promptText: string;
  preparationTime: number;
  responseTime: number;
}

const SPEAKING_PROMPTS: SpeakingPromptData[] = [
  {
    variantGroup: 's-a1',
    level: 'A1',
    promptText: 'Introduce yourself. Tell me your name, where you are from, and what you like to do in your free time.',
    preparationTime: 15,
    responseTime: 60,
  },
  {
    variantGroup: 's-a2',
    level: 'A2',
    promptText: 'Describe your daily routine. What do you usually do from morning to night? Include at least three activities.',
    preparationTime: 20,
    responseTime: 90,
  },
  {
    variantGroup: 's-b1',
    level: 'B1',
    promptText: 'Talk about a memorable trip you have taken. Where did you go, what did you do, and why was it memorable?',
    preparationTime: 25,
    responseTime: 120,
  },
  {
    variantGroup: 's-b2',
    level: 'B2',
    promptText: 'Some people believe that technology has made our lives easier, while others argue it has created more problems than it has solved. What is your opinion? Provide specific examples to support your view.',
    preparationTime: 30,
    responseTime: 150,
  },
  {
    variantGroup: 's-c1',
    level: 'C1',
    promptText: 'Discuss the ethical implications of artificial intelligence in the workplace. Consider both the potential benefits and the concerns, and propose how society might balance innovation with worker protection.',
    preparationTime: 40,
    responseTime: 180,
  },
  {
    variantGroup: 's-c2',
    level: 'C2',
    promptText: 'Critically evaluate the assertion that economic growth should be the primary objective of national policy. In your response, address the tensions between growth, sustainability, and social equity, drawing on examples from different economic models.',
    preparationTime: 45,
    responseTime: 240,
  },
];

interface WritingPromptData {
  variantGroup: string;
  level: string;
  promptText: string;
  minWords: number;
  maxWords: number;
}

const WRITING_PROMPTS: WritingPromptData[] = [
  {
    variantGroup: 'w-a1',
    level: 'A1',
    promptText: 'Write a short email to a friend telling them about your weekend. What did you do? Did you enjoy it?',
    minWords: 30,
    maxWords: 80,
  },
  {
    variantGroup: 'w-a2',
    level: 'A2',
    promptText: 'Write about your favourite hobby. Explain what it is, how often you do it, and why you enjoy it. Give specific details.',
    minWords: 50,
    maxWords: 120,
  },
  {
    variantGroup: 'w-b1',
    level: 'B1',
    promptText: 'Some people prefer living in a city, while others prefer living in the countryside. Compare the advantages and disadvantages of each, and explain which you prefer and why.',
    minWords: 80,
    maxWords: 180,
  },
  {
    variantGroup: 'w-b2',
    level: 'B2',
    promptText: 'In many countries, the cost of higher education continues to rise. Discuss the arguments for and against free university education, and give your own opinion on how this issue should be addressed.',
    minWords: 120,
    maxWords: 250,
  },
  {
    variantGroup: 'w-c1',
    level: 'C1',
    promptText: 'The rapid development of social media has transformed how people access information and form opinions. Analyze the impact of this transformation on democratic discourse, considering both the democratization of information and the proliferation of misinformation. Propose measures that could mitigate the negative effects while preserving the benefits.',
    minWords: 180,
    maxWords: 350,
  },
  {
    variantGroup: 'w-c2',
    level: 'C2',
    promptText: 'Critically examine the proposition that universal basic income is the most viable solution to the economic disruption caused by automation and artificial intelligence. In your essay, evaluate the theoretical justifications, practical challenges of implementation, and alternative policy approaches, drawing on empirical evidence from pilot programs where available.',
    minWords: 250,
    maxWords: 500,
  },
];

interface ExtraMcqData {
  variantGroup: string;
  level: string;
  category: 'grammar' | 'vocabulary';
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

const EXTRA_MCQS: ExtraMcqData[] = [
  // ─── A2 Grammar ────────────────────────────────
  {
    variantGroup: 'mcq-a2-grammar-1',
    level: 'A2',
    category: 'grammar',
    text: 'She ___ to school every day.',
    options: ['go', 'goes', 'going', 'gone'],
    correctIndex: 1,
    explanation: 'Third-person singular present simple uses "goes".',
  },
  {
    variantGroup: 'mcq-a2-grammar-2',
    level: 'A2',
    category: 'grammar',
    text: 'I ___ my homework yesterday.',
    options: ['do', 'did', 'done', 'doing'],
    correctIndex: 1,
    explanation: 'Past simple of "do" is "did".',
  },
  {
    variantGroup: 'mcq-a2-grammar-3',
    level: 'A2',
    category: 'grammar',
    text: 'There ___ many books on the shelf.',
    options: ['is', 'are', 'was', 'be'],
    correctIndex: 1,
    explanation: '"Books" is plural, so we use "are".',
  },
  {
    variantGroup: 'mcq-a2-grammar-4',
    level: 'A2',
    category: 'grammar',
    text: "He ___ like pizza.",
    options: ["don't", "doesn't", "isn't", "wasn't"],
    correctIndex: 1,
    explanation: 'Third-person singular negative uses "doesn\'t".',
  },

  // ─── A2 Vocabulary ─────────────────────────────
  {
    variantGroup: 'mcq-a2-vocab-1',
    level: 'A2',
    category: 'vocabulary',
    text: "Which word means the opposite of 'cheap'?",
    options: ['expensive', 'beautiful', 'delicious', 'interesting'],
    correctIndex: 0,
    explanation: 'The opposite of cheap is expensive.',
  },
  {
    variantGroup: 'mcq-a2-vocab-2',
    level: 'A2',
    category: 'vocabulary',
    text: "If you are 'hungry', you want to ___.",
    options: ['sleep', 'eat', 'drink', 'run'],
    correctIndex: 1,
    explanation: 'Being hungry means you want to eat.',
  },
  {
    variantGroup: 'mcq-a2-vocab-3',
    level: 'A2',
    category: 'vocabulary',
    text: "A 'baker' is someone who ___.",
    options: ['teaches children', 'makes bread', 'drives a bus', 'sings songs'],
    correctIndex: 1,
    explanation: 'A baker is a person who makes bread and baked goods.',
  },
  {
    variantGroup: 'mcq-a2-vocab-4',
    level: 'A2',
    category: 'vocabulary',
    text: "Which word means 'very big'?",
    options: ['tiny', 'huge', 'narrow', 'shallow'],
    correctIndex: 1,
    explanation: '"Huge" means very big.',
  },

  // ─── B1 Grammar ────────────────────────────────
  {
    variantGroup: 'mcq-b1-grammar-1',
    level: 'B1',
    category: 'grammar',
    text: 'If I ___ you, I would apologize.',
    options: ['am', 'was', 'were', 'be'],
    correctIndex: 2,
    explanation: 'Second conditional uses "were" for all subjects.',
  },
  {
    variantGroup: 'mcq-b1-grammar-2',
    level: 'B1',
    category: 'grammar',
    text: 'She has been living here ___ five years.',
    options: ['since', 'for', 'from', 'during'],
    correctIndex: 1,
    explanation: '"For" is used with a period of time; "since" with a point in time.',
  },
  {
    variantGroup: 'mcq-b1-grammar-3',
    level: 'B1',
    category: 'grammar',
    text: 'The movie was ___ boring that I fell asleep.',
    options: ['so', 'such', 'very', 'too'],
    correctIndex: 0,
    explanation: '"So" is used before an adjective without a noun; "such" is used before a noun phrase.',
  },
  {
    variantGroup: 'mcq-b1-grammar-4',
    level: 'B1',
    category: 'grammar',
    text: 'He asked me where I ___.',
    options: ['live', 'lived', 'living', 'lives'],
    correctIndex: 1,
    explanation: 'Reported speech shifts the tense back: present to past.',
  },

  // ─── B1 Vocabulary ─────────────────────────────
  {
    variantGroup: 'mcq-b1-vocab-1',
    level: 'B1',
    category: 'vocabulary',
    text: "The word 'beneficial' most closely means ___.",
    options: ['harmful', 'helpful', 'beautiful', 'careful'],
    correctIndex: 1,
    explanation: '"Beneficial" means producing good results; helpful.',
  },
  {
    variantGroup: 'mcq-b1-vocab-2',
    level: 'B1',
    category: 'vocabulary',
    text: "To 'postpone' something means to ___.",
    options: ['cancel it', 'delay it', 'finish it', 'start it'],
    correctIndex: 1,
    explanation: '"Postpone" means to delay to a later time.',
  },
  {
    variantGroup: 'mcq-b1-vocab-3',
    level: 'B1',
    category: 'vocabulary',
    text: "A person who is 'reliable' can be ___.",
    options: ['trusted', 'funny', 'wealthy', 'famous'],
    correctIndex: 0,
    explanation: '"Reliable" means consistently good and worthy of trust.',
  },
  {
    variantGroup: 'mcq-b1-vocab-4',
    level: 'B1',
    category: 'vocabulary',
    text: "The opposite of 'generous' is ___.",
    options: ['kind', 'stingy', 'honest', 'polite'],
    correctIndex: 1,
    explanation: 'The opposite of generous is stingy or mean.',
  },

  // ─── B2 Grammar ────────────────────────────────
  {
    variantGroup: 'mcq-b2-grammar-1',
    level: 'B2',
    category: 'grammar',
    text: 'Not until he arrived ___ the truth.',
    options: ['did she realize', 'she realized', 'she did realize', 'realized she'],
    correctIndex: 0,
    explanation: 'Negative inversion: "Not until" triggers subject-auxiliary inversion.',
  },
  {
    variantGroup: 'mcq-b2-grammar-2',
    level: 'B2',
    category: 'grammar',
    text: 'Had I known about the delay, I ___ earlier.',
    options: ['would leave', 'would have left', 'will leave', 'left'],
    correctIndex: 1,
    explanation: 'Third conditional: "Had I known" (inverted if) + "would have left".',
  },
  {
    variantGroup: 'mcq-b2-grammar-3',
    level: 'B2',
    category: 'grammar',
    text: 'The report, ___ was submitted yesterday, contains several errors.',
    options: ['that', 'which', 'what', 'who'],
    correctIndex: 1,
    explanation: 'Non-defining relative clause uses "which" (with comma).',
  },
  {
    variantGroup: 'mcq-b2-grammar-4',
    level: 'B2',
    category: 'grammar',
    text: 'She insisted ___ paying for the meal.',
    options: ['on', 'in', 'at', 'for'],
    correctIndex: 0,
    explanation: 'The verb "insist" is followed by the preposition "on".',
  },

  // ─── B2 Vocabulary ─────────────────────────────
  {
    variantGroup: 'mcq-b2-vocab-1',
    level: 'B2',
    category: 'vocabulary',
    text: "The word 'ubiquitous' means ___.",
    options: ['rare', 'found everywhere', 'dangerous', 'invisible'],
    correctIndex: 1,
    explanation: '"Ubiquitous" means present, appearing, or found everywhere.',
  },
  {
    variantGroup: 'mcq-b2-vocab-2',
    level: 'B2',
    category: 'vocabulary',
    text: "To 'mitigate' means to ___.",
    options: ['eliminate', 'make less severe', 'increase', 'cause'],
    correctIndex: 1,
    explanation: '"Mitigate" means to make less severe, serious, or painful.',
  },
  {
    variantGroup: 'mcq-b2-vocab-3',
    level: 'B2',
    category: 'vocabulary',
    text: "Someone who is 'pragmatic' focuses on ___.",
    options: ['theories', 'practical results', 'emotions', 'traditions'],
    correctIndex: 1,
    explanation: '"Pragmatic" means dealing with things sensibly and realistically.',
  },
  {
    variantGroup: 'mcq-b2-vocab-4',
    level: 'B2',
    category: 'vocabulary',
    text: "The word 'contentious' most closely means ___.",
    options: ['peaceful', 'controversial', 'obvious', 'simple'],
    correctIndex: 1,
    explanation: '"Contentious" means causing or likely to cause disagreement; controversial.',
  },

  // ─── C1 Grammar ────────────────────────────────
  {
    variantGroup: 'mcq-c1-grammar-1',
    level: 'C1',
    category: 'grammar',
    text: 'Rarely ___ such a compelling argument.',
    options: ['have I heard', 'I have heard', 'I heard', 'heard I'],
    correctIndex: 0,
    explanation: 'Negative adverb fronting triggers inversion: "Rarely have I heard".',
  },
  {
    variantGroup: 'mcq-c1-grammar-2',
    level: 'C1',
    category: 'grammar',
    text: 'The committee, ___ divided on the issue, eventually reached a consensus.',
    options: ['while being', 'despite being', 'although', 'however being'],
    correctIndex: 1,
    explanation: '"Despite being" correctly introduces a concessive participle phrase.',
  },
  {
    variantGroup: 'mcq-c1-grammar-3',
    level: 'C1',
    category: 'grammar',
    text: 'So severe ___ that the entire project was abandoned.',
    options: ['were the problems', 'the problems were', 'the problems', 'problems were'],
    correctIndex: 0,
    explanation: '"So" fronting triggers inversion: "So severe were the problems".',
  },
  {
    variantGroup: 'mcq-c1-grammar-4',
    level: 'C1',
    category: 'grammar',
    text: 'Little ___ the impact this decision would have.',
    options: ['did they realize', 'they realized', 'they did realize', 'realized they'],
    correctIndex: 0,
    explanation: 'Negative fronting with "little" triggers inversion: "Little did they realize".',
  },

  // ─── C1 Vocabulary ─────────────────────────────
  {
    variantGroup: 'mcq-c1-vocab-1',
    level: 'C1',
    category: 'vocabulary',
    text: "The word 'ephemeral' means ___.",
    options: ['eternal', 'short-lived', 'beautiful', 'dangerous'],
    correctIndex: 1,
    explanation: '"Ephemeral" means lasting for a very short time.',
  },
  {
    variantGroup: 'mcq-c1-vocab-2',
    level: 'C1',
    category: 'vocabulary',
    text: "To 'corroborate' a statement means to ___.",
    options: ['contradict it', 'confirm it with evidence', 'explain it', 'ignore it'],
    correctIndex: 1,
    explanation: '"Corroborate" means to confirm or give support to a statement with evidence.',
  },
  {
    variantGroup: 'mcq-c1-vocab-3',
    level: 'C1',
    category: 'vocabulary',
    text: "A 'paradigm shift' refers to ___.",
    options: ['a minor adjustment', 'a fundamental change in approach', 'a temporary problem', 'a return to old methods'],
    correctIndex: 1,
    explanation: 'A paradigm shift is a fundamental change in approach or underlying assumptions.',
  },
  {
    variantGroup: 'mcq-c1-vocab-4',
    level: 'C1',
    category: 'vocabulary',
    text: "The word 'obfuscate' most closely means to ___.",
    options: ['clarify', 'confuse or obscure', 'simplify', 'emphasize'],
    correctIndex: 1,
    explanation: '"Obfuscate" means to render obscure, unclear, or unintelligible.',
  },
];

// ─── Helper: idempotent check by variantGroup ────────────────

async function existsByVariantGroup(model: 'readingPassage' | 'listeningItem' | 'speakingPrompt' | 'writingPrompt' | 'question', variantGroup: string): Promise<boolean> {
  switch (model) {
    case 'readingPassage': {
      const count = await prisma.readingPassage.count({ where: { variantGroup } });
      return count > 0;
    }
    case 'listeningItem': {
      const count = await prisma.listeningItem.count({ where: { variantGroup } });
      return count > 0;
    }
    case 'speakingPrompt': {
      const count = await prisma.speakingPrompt.count({ where: { variantGroup } });
      return count > 0;
    }
    case 'writingPrompt': {
      const count = await prisma.writingPrompt.count({ where: { variantGroup } });
      return count > 0;
    }
    case 'question': {
      const count = await prisma.question.count({ where: { variantGroup } });
      return count > 0;
    }
  }
}

// ─── Seed Functions ──────────────────────────────────────────

async function seedReadingPassages() {
  console.log('\n📖 Seeding Reading Passages...');
  let created = 0;
  let skipped = 0;

  for (const passage of READING_PASSAGES) {
    const exists = await existsByVariantGroup('readingPassage', passage.variantGroup);
    if (exists) {
      console.log(`  ⏭️  SKIP: ReadingPassage [${passage.variantGroup}] already exists`);
      skipped++;
      continue;
    }

    const createdPassage = await prisma.readingPassage.create({
      data: {
        level: passage.level,
        title: null,
        passageText: passage.passageText,
        variantGroup: passage.variantGroup,
        isActive: true,
        difficultyTier: 5,
        questions: {
          create: passage.questions.map((q) => ({
            questionText: q.questionText,
            options: JSON.stringify(q.options),
            correctIndex: q.correctIndex,
            sortOrder: q.sortOrder,
          })),
        },
      },
      include: { questions: true },
    });

    console.log(`  ✅ CREATED: ReadingPassage [${passage.variantGroup}] level=${passage.level} (${createdPassage.questions.length} questions)`);
    created++;
  }

  console.log(`  📊 Reading: ${created} created, ${skipped} skipped`);
  return { created, skipped };
}

async function seedListeningItems() {
  console.log('\n🎧 Seeding Listening Items...');
  let created = 0;
  let skipped = 0;

  for (const item of LISTENING_ITEMS) {
    const exists = await existsByVariantGroup('listeningItem', item.variantGroup);
    if (exists) {
      console.log(`  ⏭️  SKIP: ListeningItem [${item.variantGroup}] already exists`);
      skipped++;
      continue;
    }

    const createdItem = await prisma.listeningItem.create({
      data: {
        level: item.level,
        scriptText: item.scriptText,
        context: null,
        variantGroup: item.variantGroup,
        isActive: true,
        difficultyTier: 5,
        questions: {
          create: item.questions.map((q) => ({
            questionText: q.questionText,
            options: JSON.stringify(q.options),
            correctIndex: q.correctIndex,
            sortOrder: q.sortOrder,
          })),
        },
      },
      include: { questions: true },
    });

    console.log(`  ✅ CREATED: ListeningItem [${item.variantGroup}] level=${item.level} (${createdItem.questions.length} questions)`);
    created++;
  }

  console.log(`  📊 Listening: ${created} created, ${skipped} skipped`);
  return { created, skipped };
}

async function seedSpeakingPrompts() {
  console.log('\n🗣️  Seeding Speaking Prompts...');
  let created = 0;
  let skipped = 0;

  for (const prompt of SPEAKING_PROMPTS) {
    const exists = await existsByVariantGroup('speakingPrompt', prompt.variantGroup);
    if (exists) {
      console.log(`  ⏭️  SKIP: SpeakingPrompt [${prompt.variantGroup}] already exists`);
      skipped++;
      continue;
    }

    await prisma.speakingPrompt.create({
      data: {
        level: prompt.level,
        promptText: prompt.promptText,
        preparationTime: prompt.preparationTime,
        responseTime: prompt.responseTime,
        variantGroup: prompt.variantGroup,
        isActive: true,
        difficultyTier: 5,
      },
    });

    console.log(`  ✅ CREATED: SpeakingPrompt [${prompt.variantGroup}] level=${prompt.level}`);
    created++;
  }

  console.log(`  📊 Speaking: ${created} created, ${skipped} skipped`);
  return { created, skipped };
}

async function seedWritingPrompts() {
  console.log('\n✍️  Seeding Writing Prompts...');
  let created = 0;
  let skipped = 0;

  for (const prompt of WRITING_PROMPTS) {
    const exists = await existsByVariantGroup('writingPrompt', prompt.variantGroup);
    if (exists) {
      console.log(`  ⏭️  SKIP: WritingPrompt [${prompt.variantGroup}] already exists`);
      skipped++;
      continue;
    }

    await prisma.writingPrompt.create({
      data: {
        level: prompt.level,
        promptText: prompt.promptText,
        minWords: prompt.minWords,
        maxWords: prompt.maxWords,
        variantGroup: prompt.variantGroup,
        isActive: true,
        difficultyTier: 5,
      },
    });

    console.log(`  ✅ CREATED: WritingPrompt [${prompt.variantGroup}] level=${prompt.level}`);
    created++;
  }

  console.log(`  📊 Writing: ${created} created, ${skipped} skipped`);
  return { created, skipped };
}

async function seedExtraMcqs() {
  console.log('\n📝 Seeding Extra MCQ Questions (grammar + vocabulary)...');
  let created = 0;
  let skipped = 0;

  for (const mcq of EXTRA_MCQS) {
    const exists = await existsByVariantGroup('question', mcq.variantGroup);
    if (exists) {
      console.log(`  ⏭️  SKIP: Question [${mcq.variantGroup}] already exists`);
      skipped++;
      continue;
    }

    await prisma.question.create({
      data: {
        level: mcq.level,
        category: mcq.category,
        text: mcq.text,
        options: JSON.stringify(mcq.options),
        correctIndex: mcq.correctIndex,
        explanation: mcq.explanation || null,
        variantGroup: mcq.variantGroup,
        difficultyTier: 5,
        isActive: true,
      },
    });

    console.log(`  ✅ CREATED: Question [${mcq.variantGroup}] level=${mcq.level} cat=${mcq.category}`);
    created++;
  }

  console.log(`  📊 MCQs: ${created} created, ${skipped} skipped`);
  return { created, skipped };
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║       TestCEFR — Question Bank Seed Script              ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  const startTime = Date.now();

  // 1. Reading Passages
  const readingResult = await seedReadingPassages();

  // 2. Listening Items
  const listeningResult = await seedListeningItems();

  // 3. Speaking Prompts
  const speakingResult = await seedSpeakingPrompts();

  // 4. Writing Prompts
  const writingResult = await seedWritingPrompts();

  // 5. Extra MCQs
  const mcqResult = await seedExtraMcqs();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  // ─── Summary ────────────────────────────────────
  const totalCreated = readingResult.created + listeningResult.created + speakingResult.created + writingResult.created + mcqResult.created;
  const totalSkipped = readingResult.skipped + listeningResult.skipped + speakingResult.skipped + writingResult.skipped + mcqResult.skipped;

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                    Summary                               ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log(`║  Reading Passages:  ${String(readingResult.created).padStart(2)} created, ${String(readingResult.skipped).padStart(2)} skipped${' '.repeat(18)}║`);
  console.log(`║  Listening Items:   ${String(listeningResult.created).padStart(2)} created, ${String(listeningResult.skipped).padStart(2)} skipped${' '.repeat(18)}║`);
  console.log(`║  Speaking Prompts:  ${String(speakingResult.created).padStart(2)} created, ${String(speakingResult.skipped).padStart(2)} skipped${' '.repeat(18)}║`);
  console.log(`║  Writing Prompts:   ${String(writingResult.created).padStart(2)} created, ${String(writingResult.skipped).padStart(2)} skipped${' '.repeat(18)}║`);
  console.log(`║  Extra MCQs:        ${String(mcqResult.created).padStart(2)} created, ${String(mcqResult.skipped).padStart(2)} skipped${' '.repeat(18)}║`);
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log(`║  TOTAL:             ${String(totalCreated).padStart(2)} created, ${String(totalSkipped).padStart(2)} skipped${' '.repeat(18)}║`);
  console.log(`║  Elapsed: ${elapsed}s${' '.repeat(45)}║`);
  console.log('╚══════════════════════════════════════════════════════════╝');

  console.log('\n✅ Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('❌ Fatal error during seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
