/**
 * Seed Question Bank — TestCEFR Database
 *
 * Seeds the following into the database:
 *   1. ReadingPassage + ReadingQuestion — 6 passages (A1–C2), each with 2 sub-questions
 *   2. ListeningItem + ListeningQuestion — 6 items (A1–C2), each with 1 question
 *   3. SpeakingPrompt — 6 prompts (A1–C2)
 *   4. WritingPrompt — 6 prompts (A1–C2)
 *   5. Extra MCQ Questions (Question model) — grammar + vocabulary per level (A1–C2)
 *      A1: 10 grammar + 10 vocabulary | A2: 9 grammar + 9 vocabulary
 *      B1: 9 grammar + 9 vocabulary  | B2: 9 grammar + 9 vocabulary
 *      C1: 9 grammar + 9 vocabulary  | C2: 10 grammar + 10 vocabulary
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

  // ─── A1 Grammar ────────────────────────────────
  {
    variantGroup: 'mcq-a1-grammar-1',
    level: 'A1',
    category: 'grammar',
    text: 'She ___ a student.',
    options: ['am', 'is', 'are', 'be'],
    correctIndex: 1,
    explanation: 'With third-person singular subjects (he/she/it), we use "is".',
  },
  {
    variantGroup: 'mcq-a1-grammar-2',
    level: 'A1',
    category: 'grammar',
    text: 'I have ___ apple in my bag.',
    options: ['a', 'the', 'an', 'some'],
    correctIndex: 2,
    explanation: '"Apple" starts with a vowel sound, so we use "an" instead of "a".',
  },
  {
    variantGroup: 'mcq-a1-grammar-3',
    level: 'A1',
    category: 'grammar',
    text: '___ is my brother. He is a doctor.',
    options: ['He', 'She', 'It', 'They'],
    correctIndex: 0,
    explanation: '"He" is the subject pronoun used for a male person.',
  },
  {
    variantGroup: 'mcq-a1-grammar-4',
    level: 'A1',
    category: 'grammar',
    text: 'This is ___ book. It has my name on it.',
    options: ['you', 'his', 'her', 'my'],
    correctIndex: 3,
    explanation: '"My" is the possessive adjective that shows the book belongs to the speaker.',
  },
  {
    variantGroup: 'mcq-a1-grammar-5',
    level: 'A1',
    category: 'grammar',
    text: 'They ___ like cold weather.',
    options: ['doesn\'t', 'isn\'t', 'don\'t', 'aren\'t'],
    correctIndex: 2,
    explanation: 'With plural subjects (they), we use "don\'t" to form the negative present simple.',
  },
  {
    variantGroup: 'mcq-a1-grammar-6',
    level: 'A1',
    category: 'grammar',
    text: 'Which sentence has the correct word order?',
    options: ['I like coffee.', 'Like I coffee.', 'Coffee I like.', 'I coffee like.'],
    correctIndex: 0,
    explanation: 'English follows Subject–Verb–Object (SVO) word order: "I like coffee."',
  },
  {
    variantGroup: 'mcq-a1-grammar-7',
    level: 'A1',
    category: 'grammar',
    text: '___ are my shoes over there.',
    options: ['That', 'This', 'These', 'Those'],
    correctIndex: 3,
    explanation: '"Those" is the plural demonstrative used for things far from the speaker.',
  },
  {
    variantGroup: 'mcq-a1-grammar-8',
    level: 'A1',
    category: 'grammar',
    text: 'There ___ a cat on the table.',
    options: ['are', 'were', 'have', 'is'],
    correctIndex: 3,
    explanation: '"There is" is used with singular nouns; "a cat" is singular.',
  },
  {
    variantGroup: 'mcq-a1-grammar-9',
    level: 'A1',
    category: 'grammar',
    text: 'I have two ___. They are very nice.',
    options: ['child', 'childs', 'children', 'childrens'],
    correctIndex: 2,
    explanation: '"Children" is the irregular plural form of "child".',
  },
  {
    variantGroup: 'mcq-a1-grammar-10',
    level: 'A1',
    category: 'grammar',
    text: 'The keys are ___ the table.',
    options: ['on', 'at', 'by', 'with'],
    correctIndex: 0,
    explanation: '"On" is the preposition used to indicate position on a surface.',
  },

  // ─── A1 Vocabulary ─────────────────────────────
  {
    variantGroup: 'mcq-a1-vocab-1',
    level: 'A1',
    category: 'vocabulary',
    text: 'What color is the sky on a sunny day?',
    options: ['red', 'blue', 'green', 'yellow'],
    correctIndex: 1,
    explanation: 'The sky is blue on a clear, sunny day.',
  },
  {
    variantGroup: 'mcq-a1-vocab-2',
    level: 'A1',
    category: 'vocabulary',
    text: 'Which number comes after twelve?',
    options: ['eleven', 'twenty', 'thirteen', 'fourteen'],
    correctIndex: 2,
    explanation: 'Thirteen (13) comes immediately after twelve (12).',
  },
  {
    variantGroup: 'mcq-a1-vocab-3',
    level: 'A1',
    category: 'vocabulary',
    text: 'Your mother\'s brother is your ___.',
    options: ['cousin', 'nephew', 'grandfather', 'uncle'],
    correctIndex: 3,
    explanation: 'Your uncle is the brother of your mother or father.',
  },
  {
    variantGroup: 'mcq-a1-vocab-4',
    level: 'A1',
    category: 'vocabulary',
    text: 'Which of these is a fruit?',
    options: ['apple', 'carrot', 'bread', 'cheese'],
    correctIndex: 0,
    explanation: 'An apple is a fruit. Carrot is a vegetable; bread and cheese are not fruits.',
  },
  {
    variantGroup: 'mcq-a1-vocab-5',
    level: 'A1',
    category: 'vocabulary',
    text: 'You see with your ___.',
    options: ['ears', 'eyes', 'hands', 'feet'],
    correctIndex: 1,
    explanation: 'You see (look) with your eyes.',
  },
  {
    variantGroup: 'mcq-a1-vocab-6',
    level: 'A1',
    category: 'vocabulary',
    text: 'You wear ___ on your feet.',
    options: ['hats', 'gloves', 'shoes', 'scarves'],
    correctIndex: 2,
    explanation: 'Shoes are worn on your feet.',
  },
  {
    variantGroup: 'mcq-a1-vocab-7',
    level: 'A1',
    category: 'vocabulary',
    text: 'You cook food in the ___.',
    options: ['kitchen', 'bedroom', 'bathroom', 'garden'],
    correctIndex: 0,
    explanation: 'The kitchen is the room in a house where you cook food.',
  },
  {
    variantGroup: 'mcq-a1-vocab-8',
    level: 'A1',
    category: 'vocabulary',
    text: 'The opposite of "big" is ___.',
    options: ['tall', 'long', 'fast', 'small'],
    correctIndex: 3,
    explanation: 'The opposite of big (large in size) is small.',
  },
  {
    variantGroup: 'mcq-a1-vocab-9',
    level: 'A1',
    category: 'vocabulary',
    text: 'When it rains, you need an ___.',
    options: ['umbrella', 'ice cream', 'sunglasses', 'blanket'],
    correctIndex: 0,
    explanation: 'An umbrella keeps you dry when it rains.',
  },
  {
    variantGroup: 'mcq-a1-vocab-10',
    level: 'A1',
    category: 'vocabulary',
    text: 'A ___ is an animal that says "moo".',
    options: ['dog', 'cat', 'cow', 'horse'],
    correctIndex: 2,
    explanation: 'A cow is the farm animal that makes the sound "moo".',
  },

  // ─── C2 Grammar ────────────────────────────────
  {
    variantGroup: 'mcq-c2-grammar-1',
    level: 'C2',
    category: 'grammar',
    text: 'Not only ___ the exam, but she also achieved the highest score in her cohort.',
    options: ['did she pass', 'she passed', 'she did pass', 'passed she'],
    correctIndex: 0,
    explanation: 'Negative fronting with "Not only" triggers subject-auxiliary inversion: "Not only did she pass".',
  },
  {
    variantGroup: 'mcq-c2-grammar-2',
    level: 'C2',
    category: 'grammar',
    text: 'It ___ John who broke the window, not his sister.',
    options: ['has been', 'had been', 'was', 'were'],
    correctIndex: 2,
    explanation: 'Cleft sentences use "It was/is + emphasized element + that/who": "It was John who broke the window."',
  },
  {
    variantGroup: 'mcq-c2-grammar-3',
    level: 'C2',
    category: 'grammar',
    text: 'If I had studied medicine, I ___ a doctor now.',
    options: ['would have been', 'would be', 'will be', 'am'],
    correctIndex: 1,
    explanation: 'This is a mixed conditional: past unreal condition (had studied) + present unreal result (would be).',
  },
  {
    variantGroup: 'mcq-c2-grammar-4',
    level: 'C2',
    category: 'grammar',
    text: 'The professor insisted that every student ___ the exam on time.',
    options: ['takes', 'took', 'taking', 'take'],
    correctIndex: 3,
    explanation: 'After verbs of demand or insistence, the subjunctive uses the base form "take" (not "takes" or "took").',
  },
  {
    variantGroup: 'mcq-c2-grammar-5',
    level: 'C2',
    category: 'grammar',
    text: 'The building is believed ___ in the 18th century.',
    options: ['to have been constructed', 'to be constructed', 'to construct', 'having been constructed'],
    correctIndex: 0,
    explanation: 'The passive infinitive perfect "to have been constructed" refers to a past event in a reporting structure.',
  },
  {
    variantGroup: 'mcq-c2-grammar-6',
    level: 'C2',
    category: 'grammar',
    text: '___ he said at the meeting surprised everyone in the room.',
    options: ['That', 'Which', 'What', 'How'],
    correctIndex: 2,
    explanation: '"What" functions as a nominal relative pronoun meaning "the thing that", introducing a noun clause as the subject.',
  },
  {
    variantGroup: 'mcq-c2-grammar-7',
    level: 'C2',
    category: 'grammar',
    text: 'She can play the piano beautifully, and so ___ her brother.',
    options: ['does', 'can', 'is', 'has'],
    correctIndex: 1,
    explanation: 'After "so" in agreement, we use the same auxiliary/modal as in the first clause: "can".',
  },
  {
    variantGroup: 'mcq-c2-grammar-8',
    level: 'C2',
    category: 'grammar',
    text: 'The results were disappointing; ___, the team decided to proceed with the project.',
    options: ['therefore', 'furthermore', 'likewise', 'nevertheless'],
    correctIndex: 3,
    explanation: '"Nevertheless" is a concessive discourse marker indicating contrast: despite the disappointment, they continued.',
  },
  {
    variantGroup: 'mcq-c2-grammar-9',
    level: 'C2',
    category: 'grammar',
    text: 'The proposal was turned ___ by the committee after lengthy deliberation.',
    options: ['down', 'up', 'into', 'about'],
    correctIndex: 0,
    explanation: '"Turn down" is a phrasal verb meaning to reject; the passive form is "was turned down".',
  },
  {
    variantGroup: 'mcq-c2-grammar-10',
    level: 'C2',
    category: 'grammar',
    text: 'She ___ have left already — her coat is still hanging on the chair.',
    options: ['must', 'can\'t', 'should', 'might'],
    correctIndex: 1,
    explanation: '"Can\'t have" expresses a logical deduction that something is impossible based on evidence (the coat is still there).',
  },

  // ─── C2 Vocabulary ─────────────────────────────
  {
    variantGroup: 'mcq-c2-vocab-1',
    level: 'C2',
    category: 'vocabulary',
    text: 'To "mitigate" a punishment differs from "alleviating" suffering in that "mitigate" specifically implies ___.',
    options: ['reducing severity, especially in a formal or legal context', 'providing emotional comfort', 'eliminating entirely', 'postponing to a later date'],
    correctIndex: 0,
    explanation: '"Mitigate" means to make less severe, typically used in formal/legal contexts, whereas "alleviate" relates to easing pain or suffering.',
  },
  {
    variantGroup: 'mcq-c2-vocab-2',
    level: 'C2',
    category: 'vocabulary',
    text: 'Which is the most natural and established collocation?',
    options: ['blunt contrast', 'stark contrast', 'heavy contrast', 'thick contrast'],
    correctIndex: 1,
    explanation: '"Stark contrast" is a well-established collocation meaning a very clear and noticeable difference.',
  },
  {
    variantGroup: 'mcq-c2-vocab-3',
    level: 'C2',
    category: 'vocabulary',
    text: 'To be "at the end of your tether" means ___.',
    options: ['to have completed a journey', 'to be extremely frustrated and unable to endure more', 'to be about to achieve success', 'to have reached a final decision'],
    correctIndex: 1,
    explanation: 'This idiom means to have exhausted one\'s patience or endurance; to be at the limit of what one can tolerate.',
  },
  {
    variantGroup: 'mcq-c2-vocab-4',
    level: 'C2',
    category: 'vocabulary',
    text: 'Which sentence uses the most formal register?',
    options: ['We need to look into the problem.', 'We gotta figure this out.', 'It is imperative that the matter be investigated forthwith.', 'Let\'s check out what\'s going on.'],
    correctIndex: 2,
    explanation: 'The third option uses formal vocabulary ("imperative", "matter", "investigated", "forthwith") appropriate for official or academic contexts.',
  },
  {
    variantGroup: 'mcq-c2-vocab-5',
    level: 'C2',
    category: 'vocabulary',
    text: 'The word "notorious" differs from "famous" primarily because it carries a ___ connotation.',
    options: ['negative', 'positive', 'neutral', 'humorous'],
    correctIndex: 0,
    explanation: '"Notorious" means famous for something bad, carrying a negative connotation, whereas "famous" is neutral or positive.',
  },
  {
    variantGroup: 'mcq-c2-vocab-6',
    level: 'C2',
    category: 'vocabulary',
    text: 'In legal terminology, a "tort" refers to ___.',
    options: ['a criminal offence', 'a type of contract', 'a civil wrong causing harm or loss', 'a legal document'],
    correctIndex: 2,
    explanation: 'A tort is a civil wrong (not a crime) that causes someone to suffer loss or harm, resulting in legal liability.',
  },
  {
    variantGroup: 'mcq-c2-vocab-7',
    level: 'C2',
    category: 'vocabulary',
    text: 'The prefix "ante-" in "antecedent" means ___.',
    options: ['against', 'before', 'after', 'beside'],
    correctIndex: 1,
    explanation: 'The Latin prefix "ante-" means "before" or "preceding". "Antecedent" means something that came before.',
  },
  {
    variantGroup: 'mcq-c2-vocab-8',
    level: 'C2',
    category: 'vocabulary',
    text: 'The phrasal verb "bring up" can mean all of the following EXCEPT ___.',
    options: ['to raise a child', 'to mention a topic', 'to vomit', 'to dismantle completely'],
    correctIndex: 3,
    explanation: '"Bring up" means to raise a child, to introduce a topic, or (informally) to vomit — but not to dismantle.',
  },
  {
    variantGroup: 'mcq-c2-vocab-9',
    level: 'C2',
    category: 'vocabulary',
    text: 'Which phrase is an example of hedging in academic writing?',
    options: ['It could be argued that', 'It is absolutely certain that', 'There is no doubt whatsoever that', 'Everyone knows that'],
    correctIndex: 0,
    explanation: 'Hedging uses cautious language to soften claims. "It could be argued that" is a classic hedging phrase.',
  },
  {
    variantGroup: 'mcq-c2-vocab-10',
    level: 'C2',
    category: 'vocabulary',
    text: 'The word "cause" has a negative semantic prosody, meaning it tends to collocate with ___.',
    options: ['positive outcomes', 'neutral events', 'negative consequences', 'abstract concepts only'],
    correctIndex: 2,
    explanation: 'Semantic prosody refers to the tendency of a word to co-occur with words of a particular tone. "Cause" typically collocates with negative outcomes (cause trouble, cause damage, cause concern).',
  },

  // ─── A2 Grammar (additional) ───────────────────
  {
    variantGroup: 'mcq-a2-grammar-5',
    level: 'A2',
    category: 'grammar',
    text: '___ you go to the cinema last night?',
    options: ['Do', 'Are', 'Did', 'Were'],
    correctIndex: 2,
    explanation: 'Past simple questions use "Did" + base form: "Did you go?"',
  },
  {
    variantGroup: 'mcq-a2-grammar-6',
    level: 'A2',
    category: 'grammar',
    text: 'My house is ___ than yours.',
    options: ['more big', 'bigger', 'biggest', 'most big'],
    correctIndex: 1,
    explanation: 'Short adjectives form the comparative with "-er": "bigger than".',
  },
  {
    variantGroup: 'mcq-a2-grammar-7',
    level: 'A2',
    category: 'grammar',
    text: 'She ___ visit her grandmother tomorrow.',
    options: ['is going to', 'go to', 'will going to', 'shall going to'],
    correctIndex: 0,
    explanation: '"Is going to" is used for plans and intentions about the future.',
  },
  {
    variantGroup: 'mcq-a2-grammar-8',
    level: 'A2',
    category: 'grammar',
    text: 'How ___ water do you drink every day?',
    options: ['many', 'few', 'lots', 'much'],
    correctIndex: 3,
    explanation: '"Much" is used with uncountable nouns like "water". "Many" is for countable nouns.',
  },
  {
    variantGroup: 'mcq-a2-grammar-9',
    level: 'A2',
    category: 'grammar',
    text: 'I was born ___ 1995.',
    options: ['at', 'in', 'on', 'by'],
    correctIndex: 1,
    explanation: '"In" is used with years: "in 1995", "in 2020".',
  },

  // ─── A2 Vocabulary (additional) ────────────────
  {
    variantGroup: 'mcq-a2-vocab-5',
    level: 'A2',
    category: 'vocabulary',
    text: 'It\'s very cold outside. It might ___.',
    options: ['shine', 'melt', 'snow', 'boil'],
    correctIndex: 2,
    explanation: 'When it is very cold, it might snow.',
  },
  {
    variantGroup: 'mcq-a2-vocab-6',
    level: 'A2',
    category: 'vocabulary',
    text: 'A person who works in a hospital and helps doctors is a ___.',
    options: ['nurse', 'chef', 'mechanic', 'architect'],
    correctIndex: 0,
    explanation: 'A nurse works in a hospital and assists doctors in caring for patients.',
  },
  {
    variantGroup: 'mcq-a2-vocab-7',
    level: 'A2',
    category: 'vocabulary',
    text: 'You take a train from the ___.',
    options: ['airport', 'harbour', 'station', 'museum'],
    correctIndex: 2,
    explanation: 'Trains depart from and arrive at a station.',
  },
  {
    variantGroup: 'mcq-a2-vocab-8',
    level: 'A2',
    category: 'vocabulary',
    text: 'When you are pleased about something, you feel ___.',
    options: ['angry', 'happy', 'afraid', 'tired'],
    correctIndex: 1,
    explanation: 'Being pleased about something means you feel happy.',
  },
  {
    variantGroup: 'mcq-a2-vocab-9',
    level: 'A2',
    category: 'vocabulary',
    text: 'You use a ___ to cut paper.',
    options: ['brush', 'hammer', 'scissors', 'pencil'],
    correctIndex: 2,
    explanation: 'Scissors are the tool used for cutting paper.',
  },

  // ─── B1 Grammar (additional) ───────────────────
  {
    variantGroup: 'mcq-b1-grammar-5',
    level: 'B1',
    category: 'grammar',
    text: 'I ___ never ___ to Japan, but I hope to go one day.',
    options: ['have ... been', 'had ... been', 'was ... going', 'am ... being'],
    correctIndex: 0,
    explanation: 'Present perfect "have been" connects past experience to the present. "I have never been" means up to now.',
  },
  {
    variantGroup: 'mcq-b1-grammar-6',
    level: 'B1',
    category: 'grammar',
    text: 'English ___ in many countries around the world.',
    options: ['speaks', 'spoke', 'is spoken', 'is speaking'],
    correctIndex: 2,
    explanation: 'Passive voice present: "is spoken" because English is the object (it is spoken by people).',
  },
  {
    variantGroup: 'mcq-b1-grammar-7',
    level: 'B1',
    category: 'grammar',
    text: 'She enjoys ___ in the park every morning.',
    options: ['run', 'to running', 'ran', 'running'],
    correctIndex: 3,
    explanation: 'The verb "enjoy" is followed by a gerund (-ing form): "enjoys running".',
  },
  {
    variantGroup: 'mcq-b1-grammar-8',
    level: 'B1',
    category: 'grammar',
    text: 'The woman ___ lives next door is a teacher.',
    options: ['which', 'who', 'whom', 'whose'],
    correctIndex: 1,
    explanation: '"Who" is the relative pronoun used for people as the subject of a relative clause.',
  },
  {
    variantGroup: 'mcq-b1-grammar-9',
    level: 'B1',
    category: 'grammar',
    text: 'He ___ play football every weekend when he was young.',
    options: ['used to', 'use to', 'is used to', 'was used to'],
    correctIndex: 0,
    explanation: '"Used to" + infinitive describes past habits that are no longer true.',
  },

  // ─── B1 Vocabulary (additional) ────────────────
  {
    variantGroup: 'mcq-b1-vocab-5',
    level: 'B1',
    category: 'vocabulary',
    text: 'The ___ is the natural world around us, including land, water, and air.',
    options: ['atmosphere', 'neighbourhood', 'environment', 'landscape'],
    correctIndex: 2,
    explanation: '"Environment" refers to the natural world and surroundings in which we live.',
  },
  {
    variantGroup: 'mcq-b1-vocab-6',
    level: 'B1',
    category: 'vocabulary',
    text: 'To "accomplish" a goal means to ___.',
    options: ['achieve it successfully', 'forget about it', 'explain it to others', 'delay it until later'],
    correctIndex: 0,
    explanation: '"Accomplish" means to achieve or complete something successfully.',
  },
  {
    variantGroup: 'mcq-b1-vocab-7',
    level: 'B1',
    category: 'vocabulary',
    text: 'When you feel "anxious", you feel ___.',
    options: ['excited', 'worried and nervous', 'bored', 'confident'],
    correctIndex: 1,
    explanation: '"Anxious" means feeling worried, nervous, or uneasy about something.',
  },
  {
    variantGroup: 'mcq-b1-vocab-8',
    level: 'B1',
    category: 'vocabulary',
    text: 'Your "destination" is ___.',
    options: ['where you started from', 'how you travel', 'the place you are travelling to', 'the reason for your trip'],
    correctIndex: 2,
    explanation: '"Destination" is the place to which someone is travelling.',
  },
  {
    variantGroup: 'mcq-b1-vocab-9',
    level: 'B1',
    category: 'vocabulary',
    text: 'A "symptom" of an illness is ___.',
    options: ['a type of medicine', 'a doctor\'s diagnosis', 'a sign indicating a condition', 'a method of prevention'],
    correctIndex: 2,
    explanation: 'A symptom is a physical or mental sign that indicates a condition or disease.',
  },

  // ─── B2 Grammar (additional) ───────────────────
  {
    variantGroup: 'mcq-b2-grammar-5',
    level: 'B2',
    category: 'grammar',
    text: 'I wish I ___ speak French fluently.',
    options: ['can', 'could', 'would', 'should'],
    correctIndex: 1,
    explanation: '"Wish" + past simple expresses a present unreal desire: "I wish I could".',
  },
  {
    variantGroup: 'mcq-b2-grammar-6',
    level: 'B2',
    category: 'grammar',
    text: 'If she had accepted the job, she ___ in Paris right now.',
    options: ['would live', 'had lived', 'would have lived', 'would be living'],
    correctIndex: 3,
    explanation: 'Mixed conditional: past unreal condition (had accepted) + present unreal continuous result (would be living).',
  },
  {
    variantGroup: 'mcq-b2-grammar-7',
    level: 'B2',
    category: 'grammar',
    text: 'I had my car ___ at the garage yesterday.',
    options: ['repair', 'repairing', 'repaired', 'to repair'],
    correctIndex: 2,
    explanation: 'Causative "have something done": have + object + past participle means someone else did it for you.',
  },
  {
    variantGroup: 'mcq-b2-grammar-8',
    level: 'B2',
    category: 'grammar',
    text: 'He denied ___ the window.',
    options: ['to break', 'break', 'having broken', 'to have broken'],
    correctIndex: 2,
    explanation: '"Deny" is followed by a gerund. The perfect gerund "having broken" refers to a past action.',
  },
  {
    variantGroup: 'mcq-b2-grammar-9',
    level: 'B2',
    category: 'grammar',
    text: '___ from the top of the tower, the whole city looked magnificent.',
    options: ['Seeing', 'Seen', 'Having seen', 'To see'],
    correctIndex: 1,
    explanation: 'Past participle "Seen" is used because the city is passive (it is seen by someone).',
  },

  // ─── B2 Vocabulary (additional) ────────────────
  {
    variantGroup: 'mcq-b2-vocab-5',
    level: 'B2',
    category: 'vocabulary',
    text: 'To "deter" someone from doing something means to ___.',
    options: ['discourage them by making it seem unwise or risky', 'encourage them to proceed', 'physically stop them by force', 'help them understand the benefits'],
    correctIndex: 0,
    explanation: '"Deter" means to discourage or prevent someone from acting, usually by instilling doubt or fear of consequences.',
  },
  {
    variantGroup: 'mcq-b2-vocab-6',
    level: 'B2',
    category: 'vocabulary',
    text: 'The correct collocation is "___ attention to a problem."',
    options: ['pull', 'pay', 'draw', 'give'],
    correctIndex: 2,
    explanation: '"Draw attention to" is the correct collocation meaning to cause people to notice something.',
  },
  {
    variantGroup: 'mcq-b2-vocab-7',
    level: 'B2',
    category: 'vocabulary',
    text: '"Commence" is a more formal way of saying ___.',
    options: ['finish', 'continue', 'delay', 'begin'],
    correctIndex: 3,
    explanation: '"Commence" is a formal synonym for "begin" or "start".',
  },
  {
    variantGroup: 'mcq-b2-vocab-8',
    level: 'B2',
    category: 'vocabulary',
    text: '"Resilience" refers to the ability to ___.',
    options: ['remember things clearly', 'recover quickly from difficulties', 'remain calm in social situations', 'think in a logical way'],
    correctIndex: 1,
    explanation: '"Resilience" is the capacity to recover quickly from difficulties; toughness.',
  },
  {
    variantGroup: 'mcq-b2-vocab-9',
    level: 'B2',
    category: 'vocabulary',
    text: 'The prefix "anti-" in "antisocial" means ___.',
    options: ['against or opposed to', 'before', 'after', 'together with'],
    correctIndex: 0,
    explanation: 'The prefix "anti-" means against, opposed to, or the opposite of.',
  },

  // ─── C1 Grammar (additional) ───────────────────
  {
    variantGroup: 'mcq-c1-grammar-5',
    level: 'C1',
    category: 'grammar',
    text: 'She ___ insist on coming along, despite our objections.',
    options: ['has', 'was', 'did', 'had'],
    correctIndex: 2,
    explanation: 'The emphatic "did" is used to add emphasis to a past tense verb: "did insist".',
  },
  {
    variantGroup: 'mcq-c1-grammar-6',
    level: 'C1',
    category: 'grammar',
    text: 'He is rumored ___ the company at the end of the month.',
    options: ['that he leaves', 'to be leaving', 'to leaving', 'that he is leaving'],
    correctIndex: 1,
    explanation: 'Personal passive with reporting verb: "is rumored to be leaving" uses the infinitive construction.',
  },
  {
    variantGroup: 'mcq-c1-grammar-7',
    level: 'C1',
    category: 'grammar',
    text: 'It is essential that the report ___ by Friday.',
    options: ['be submitted', 'is submitted', 'will be submitted', 'submitted'],
    correctIndex: 0,
    explanation: 'After "It is essential that", the subjunctive uses the base form: "be submitted" (not "is submitted").',
  },
  {
    variantGroup: 'mcq-c1-grammar-8',
    level: 'C1',
    category: 'grammar',
    text: 'Only then ___ the full extent of the damage.',
    options: ['they realized', 'they did realize', 'realized they', 'did they realize'],
    correctIndex: 3,
    explanation: '"Only then" at the start of a sentence triggers inversion: "did they realize".',
  },
  {
    variantGroup: 'mcq-c1-grammar-9',
    level: 'C1',
    category: 'grammar',
    text: 'She can speak French fluently, and German ___.',
    options: ['either', 'neither', 'as well', 'also not'],
    correctIndex: 2,
    explanation: '"As well" is used at the end of a positive sentence to add information, meaning "also".',
  },

  // ─── C1 Vocabulary (additional) ────────────────
  {
    variantGroup: 'mcq-c1-vocab-5',
    level: 'C1',
    category: 'vocabulary',
    text: '"Invariably" most closely means ___.',
    options: ['occasionally', 'always or without exception', 'rarely', 'increasingly'],
    correctIndex: 1,
    explanation: '"Invariably" means in every case or always; without exception.',
  },
  {
    variantGroup: 'mcq-c1-vocab-6',
    level: 'C1',
    category: 'vocabulary',
    text: 'A "vicarious" experience means experiencing something ___.',
    options: ['through the feelings or actions of another person', 'in a violent and uncontrolled way', 'that is completely imaginary', 'repeated many times over'],
    correctIndex: 0,
    explanation: '"Vicarious" means experienced in the imagination through the feelings or actions of another person.',
  },
  {
    variantGroup: 'mcq-c1-vocab-7',
    level: 'C1',
    category: 'vocabulary',
    text: '"Notwithstanding" is closest in meaning to ___.',
    options: ['because of', 'in addition to', 'with reference to', 'despite or in spite of'],
    correctIndex: 3,
    explanation: '"Notwithstanding" means despite; in spite of. It is a formal preposition indicating contrast.',
  },
  {
    variantGroup: 'mcq-c1-vocab-8',
    level: 'C1',
    category: 'vocabulary',
    text: 'To "extrapolate" from data means to ___.',
    options: ['remove irrelevant information', 'extend inferences beyond the observed range', 'summarize the key findings', 'challenge the methodology'],
    correctIndex: 1,
    explanation: '"Extrapolate" means to extend the application of findings beyond the area of observation to infer unknowns.',
  },
  {
    variantGroup: 'mcq-c1-vocab-9',
    level: 'C1',
    category: 'vocabulary',
    text: 'To "toe the line" means to ___.',
    options: ['cross a boundary', 'conform to rules or expectations', 'resist authority', 'compete aggressively'],
    correctIndex: 1,
    explanation: '"Toe the line" is an idiom meaning to conform to a rule or standard; to do what is expected.',
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
