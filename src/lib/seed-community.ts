import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

// ─── Tutor definitions ─────────────────────────────────────
const TUTOR_DEFINITIONS = [
  {
    name: 'Sarah Mitchell',
    email: 'tutor.sarah@testcefr.com',
    country: 'USA',
    nativeLanguage: 'en',
    targetLanguages: ['es', 'fr'],
    proficiencyLevel: 'advanced',
    englishLevel: 'C2',
    occupation: 'Certified English Teacher',
    bio: 'Passionate about helping others learn English! I\'ve been teaching for 8 years and love cultural exchange. Let\'s practice together! 🌎',
    avatarColor: '3b82f6',
  },
  {
    name: 'Marco Rossi',
    email: 'tutor.marco@testcefr.com',
    country: 'Italy',
    nativeLanguage: 'it',
    targetLanguages: ['en'],
    proficiencyLevel: 'intermediate',
    englishLevel: 'B2',
    occupation: 'Language Enthusiast',
    bio: 'Ciao! I\'m Marco from Rome. I love learning English and meeting new people. I can help you with Italian too!',
    avatarColor: 'ef4444',
  },
  {
    name: 'Yuki Tanaka',
    email: 'tutor.yuki@testcefr.com',
    country: 'Japan',
    nativeLanguage: 'ja',
    targetLanguages: ['en', 'ko'],
    proficiencyLevel: 'intermediate',
    englishLevel: 'B1',
    occupation: 'University Student',
    bio: 'こんにちは! I study linguistics in Tokyo. I want to improve my English and Korean. Happy to help with Japanese!',
    avatarColor: 'f472b6',
  },
  {
    name: 'Emma Larsson',
    email: 'tutor.emma@testcefr.com',
    country: 'Sweden',
    nativeLanguage: 'sv',
    targetLanguages: ['en', 'de'],
    proficiencyLevel: 'advanced',
    englishLevel: 'C1',
    occupation: 'Translator',
    bio: 'Hej! I\'m a professional translator working with Swedish, English, and German. Languages are my life! Let\'s learn together.',
    avatarColor: '8b5cf6',
  },
  {
    name: 'Carlos Mendoza',
    email: 'tutor.carlos@testcefr.com',
    country: 'Mexico',
    nativeLanguage: 'es',
    targetLanguages: ['en'],
    proficiencyLevel: 'intermediate',
    englishLevel: 'B2',
    occupation: 'Business Professional',
    bio: '¡Hola! I work in international business and use English every day. I can help with Spanish and share business English tips!',
    avatarColor: 'f59e0b',
  },
  {
    name: 'Aisha Khan',
    email: 'tutor.aisha@testcefr.com',
    country: 'UAE',
    nativeLanguage: 'ar',
    targetLanguages: ['en', 'fr'],
    proficiencyLevel: 'intermediate',
    englishLevel: 'B2',
    occupation: 'Language Coach',
    bio: 'مرحبا! I\'m a language coach from Dubai. I specialize in helping Arabic speakers improve their English pronunciation and fluency.',
    avatarColor: '10b981',
  },
  {
    name: 'Lukas Müller',
    email: 'tutor.lukas@testcefr.com',
    country: 'Germany',
    nativeLanguage: 'de',
    targetLanguages: ['en'],
    proficiencyLevel: 'advanced',
    englishLevel: 'C2',
    occupation: 'English Professor',
    bio: 'Guten Tag! I teach English literature at a university in Berlin. I love discussing books, culture, and the nuances of the English language.',
    avatarColor: '06b6d4',
  },
  {
    name: 'Priya Sharma',
    email: 'tutor.priya@testcefr.com',
    country: 'India',
    nativeLanguage: 'hi',
    targetLanguages: ['en'],
    proficiencyLevel: 'intermediate',
    englishLevel: 'B2',
    occupation: 'Software Engineer',
    bio: 'नमस्ते! I\'m a software engineer from Bangalore. English is essential in tech, and I love helping fellow learners. Let\'s code and chat!',
    avatarColor: 'ec4899',
  },
  {
    name: 'Sophie Dubois',
    email: 'tutor.sophie@testcefr.com',
    country: 'France',
    nativeLanguage: 'fr',
    targetLanguages: ['en', 'es'],
    proficiencyLevel: 'advanced',
    englishLevel: 'C1',
    occupation: 'Language Teacher',
    bio: 'Bonjour! I teach French and English in Paris. I believe the best way to learn is through conversation and cultural exchange.',
    avatarColor: '6366f1',
  },
  {
    name: 'Jin Park',
    email: 'tutor.jin@testcefr.com',
    country: 'South Korea',
    nativeLanguage: 'ko',
    targetLanguages: ['en', 'ja'],
    proficiencyLevel: 'intermediate',
    englishLevel: 'B1',
    occupation: 'Graduate Student',
    bio: '안녕하세요! I\'m studying applied linguistics in Seoul. I want to become an English teacher. Happy to help with Korean!',
    avatarColor: '14b8a6',
  },
  {
    name: 'Olga Petrov',
    email: 'tutor.olga@testcefr.com',
    country: 'Russia',
    nativeLanguage: 'ru',
    targetLanguages: ['en', 'de'],
    proficiencyLevel: 'advanced',
    englishLevel: 'C1',
    occupation: 'Linguist',
    bio: 'Привет! I\'m a linguist from Moscow specializing in Slavic and Germanic languages. I love exploring the connections between languages!',
    avatarColor: 'a855f7',
  },
  {
    name: 'Ahmed Hassan',
    email: 'tutor.ahmed@testcefr.com',
    country: 'Egypt',
    nativeLanguage: 'ar',
    targetLanguages: ['en'],
    proficiencyLevel: 'intermediate',
    englishLevel: 'B1',
    occupation: 'Medical Student',
    bio: 'مرحبا! I\'m a medical student in Cairo. Medical English is important for my career. I enjoy discussing health topics and everyday life!',
    avatarColor: 'f97316',
  },
];

// ─── Chat message templates per room ───────────────────────
const GLOBAL_MESSAGES = [
  { tutorIdx: 0, content: 'Good morning everyone! ☀️ How\'s your English practice going today?' },
  { tutorIdx: 1, content: 'Buongiorno! I just finished my morning English podcast. Highly recommend "6 Minute English" by BBC!' },
  { tutorIdx: 3, content: 'Hej all! I just translated a really interesting article about language learning techniques.' },
  { tutorIdx: 4, content: '¡Hola amigos! Can someone help me understand when to use "have been" vs "had been"?' },
  { tutorIdx: 6, content: 'Great question Carlos! "Have been" is present perfect - for things that started in the past and continue. "Had been" is past perfect - for things that were true before another past event.' },
  { tutorIdx: 4, content: 'Ahh, so "I have been learning English for 3 years" vs "I had been studying before I got the job"?' },
  { tutorIdx: 6, content: 'Exactly! You\'ve got it! 👏' },
  { tutorIdx: 2, content: 'Konnichiwa! Does anyone have tips for improving pronunciation? My biggest challenge is the "th" sound.' },
  { tutorIdx: 0, content: 'Yuki, try placing your tongue between your teeth and blowing gently. Practice with words like "think" and "this" slowly at first.' },
  { tutorIdx: 5, content: 'I agree with Sarah! Also, recording yourself and comparing with native speakers really helps. I do this with my students.' },
  { tutorIdx: 8, content: 'Bonjour tout le monde! I just joined. What\'s the topic today?' },
  { tutorIdx: 7, content: 'Welcome Sophie! We were discussing pronunciation tips and grammar. By the way, has anyone tried using ChatGPT for English practice?' },
  { tutorIdx: 10, content: 'I have! It\'s surprisingly good for conversation practice. Though nothing beats real human interaction like this 😊' },
  { tutorIdx: 9, content: '안녕! I\'m new here. Is this room okay for intermediate learners?' },
  { tutorIdx: 0, content: 'Absolutely Jin! The global room is for all levels. Welcome!' },
  { tutorIdx: 11, content: 'Hello everyone! I\'m a medical student and I need to learn English for my research papers. Any tips for academic English?' },
  { tutorIdx: 6, content: 'Ahmed, for academic English I recommend reading research papers in your field regularly. The structure becomes familiar over time.' },
  { tutorIdx: 3, content: 'Also, the academic phrasebank from Manchester University is a fantastic resource for academic writing!' },
  { tutorIdx: 1, content: 'Does anyone want to do a language exchange? I can help with Italian and you can help me with English!' },
  { tutorIdx: 8, content: 'Marco, I\'d love that! I teach French and want to practice my Italian. Let\'s connect!' },
  { tutorIdx: 7, content: 'I find that watching English movies with English subtitles helps a lot. You pick up natural expressions that textbooks don\'t teach.' },
  { tutorIdx: 5, content: 'That\'s so true! Also, try to think in English instead of translating from your native language. It takes time but it really works.' },
  { tutorIdx: 2, content: 'I started keeping an English diary. Writing every day, even just a few sentences, has helped me so much!' },
  { tutorIdx: 10, content: 'What a great idea Yuki! I might start doing that too. What do you write about?' },
  { tutorIdx: 2, content: 'Just about my day - what I ate, what I did, how I felt. Simple things! It builds vocabulary naturally.' },
];

const BEGINNERS_MESSAGES = [
  { tutorIdx: 0, type: 'system' as const, content: 'Sarah joined the room' },
  { tutorIdx: 0, content: 'Welcome to the Beginners Corner! 🌱 Don\'t be shy, everyone here is learning!' },
  { tutorIdx: 2, content: 'Hello! I am Yuki. I am from Japan. Nice to meet you!' },
  { tutorIdx: 9, content: 'Hi Yuki! I am Jin. I am from Korea. How are you?' },
  { tutorIdx: 2, content: 'I am fine, thank you! And you?' },
  { tutorIdx: 11, content: 'Hello everyone! My name is Ahmed. I am learning English for 6 months.' },
  { tutorIdx: 0, content: 'Welcome Ahmed! 6 months is great progress. What have you been studying?' },
  { tutorIdx: 11, content: 'I study basic grammar and vocabulary. Present tense is easy but past tense is difficult.' },
  { tutorIdx: 5, content: 'Don\'t worry Ahmed! Past tense takes time. Let me share a simple trick: regular verbs just add "-ed"!' },
  { tutorIdx: 11, content: 'Yes, but irregular verbs are confusing 😅 go-went, see-saw, take-took...' },
  { tutorIdx: 0, content: 'Haha, yes! Irregular verbs need memorization. Try learning 5 new ones each week. Small steps!' },
  { tutorIdx: 4, content: 'Hola! Can someone explain "a" and "an"? I don\'t understand when to use each one.' },
  { tutorIdx: 0, content: 'Great question Carlos! Use "a" before words starting with consonant sounds (a book, a cat) and "an" before vowel sounds (an apple, an egg).' },
  { tutorIdx: 4, content: 'Oh! So it\'s "a university" not "an university"? Because of the "y" sound?' },
  { tutorIdx: 5, content: 'Exactly! You\'re very smart Carlos! The sound matters, not the spelling. "An hour" because h is silent.' },
  { tutorIdx: 9, content: 'I have question. What difference between "much" and "many"?' },
  { tutorIdx: 0, content: 'Use "many" with countable nouns (many books, many people) and "much" with uncountable nouns (much water, much time).' },
  { tutorIdx: 2, content: 'Thank you Sarah! Your explanations are always so clear! 🌟' },
  { tutorIdx: 11, content: 'Can we practice simple sentences? Like introducing ourselves?' },
  { tutorIdx: 0, content: 'Of course! Let\'s go: "My name is ___. I am from ___. I like ___." Fill in the blanks!' },
  { tutorIdx: 9, content: 'My name is Jin. I am from South Korea. I like learning languages!' },
  { tutorIdx: 4, content: 'My name is Carlos. I am from Mexico. I like cooking and football!' },
  { tutorIdx: 2, content: 'My name is Yuki. I am from Japan. I like reading books and anime!' },
  { tutorIdx: 11, content: 'My name is Ahmed. I am from Egypt. I like medicine and coffee! ☕' },
  { tutorIdx: 0, content: 'Wonderful! You all did great! See, English isn\'t so scary! 💪' },
];

const INTERMEDIATE_MESSAGES = [
  { tutorIdx: 6, type: 'system' as const, content: 'Lukas joined the room' },
  { tutorIdx: 6, content: 'Good afternoon! Today let\'s discuss the difference between "used to" and "would" for past habits.' },
  { tutorIdx: 1, content: 'I think "used to" is for past states and habits, but "would" is only for past habits, not states?' },
  { tutorIdx: 6, content: 'Spot on Marco! "I used to live in Rome" ✅ but "I would live in Rome" ❌. States don\'t work with "would".' },
  { tutorIdx: 4, content: 'That\'s helpful! So "I used to be shy" is correct, but "I would be shy" sounds wrong?' },
  { tutorIdx: 8, content: 'Exactly! "Would" needs an action verb. "I would play soccer every day after school" works perfectly.' },
  { tutorIdx: 7, content: 'Can we also talk about phrasal verbs? They\'re everywhere in English and so confusing!' },
  { tutorIdx: 6, content: 'Great topic! Let\'s start with "get" phrasal verbs. Who can use "get up", "get over", and "get along" in sentences?' },
  { tutorIdx: 1, content: 'I get up at 7 AM every day. I need to get over my fear of speaking English. I get along well with my classmates.' },
  { tutorIdx: 8, content: 'Bravo Marco! Those are all correct. Let me add: "get by" means to manage or survive with difficulty.' },
  { tutorIdx: 7, content: 'Like "I can get by with basic English when traveling"? Is that right?' },
  { tutorIdx: 8, content: 'Perfect usage Priya! 👏' },
  { tutorIdx: 4, content: 'What about "get away with"? I hear that a lot in movies.' },
  { tutorIdx: 6, content: '"Get away with" means to do something wrong without being punished. "He cheated on the test and got away with it."' },
  { tutorIdx: 5, content: 'I find conditional sentences tricky. "If I had studied harder, I would have passed" - is this the third conditional?' },
  { tutorIdx: 8, content: 'Yes Aisha! Third conditional: past situation that didn\'t happen + imagined result. If + past perfect, would have + past participle.' },
  { tutorIdx: 10, content: 'In Russian, we don\'t have this structure. It\'s very different! "If I would know, I would tell you" - is this wrong?' },
  { tutorIdx: 6, content: 'Yes Olga, that\'s a common mistake! In English, we don\'t put "would" in the if-clause. "If I knew, I would tell you" is correct.' },
  { tutorIdx: 1, content: 'What about "I wish"? "I wish I were richer" - why "were" not "was"?' },
  { tutorIdx: 8, content: 'That\'s the subjunctive mood! After "wish", we use "were" for all subjects in formal English. "I wish I were" is technically correct, though "I wish I was" is becoming common in casual speech.' },
  { tutorIdx: 7, content: 'English has so many rules... and then exceptions to the rules! 😂' },
  { tutorIdx: 6, content: 'That\'s what makes it interesting! The best approach is exposure - read, listen, and practice regularly.' },
  { tutorIdx: 10, content: 'I recommend keeping a list of new phrases you encounter. Context makes them stick better than memorizing alone.' },
  { tutorIdx: 5, content: 'I agree! I tell my students: don\'t learn words in isolation. Learn them in sentences and contexts.' },
  { tutorIdx: 4, content: 'Thanks everyone! This conversation helped me understand so much. You\'re all great teachers! 🙏' },
];

const ADVANCED_MESSAGES = [
  { tutorIdx: 6, type: 'system' as const, content: 'Lukas joined the room' },
  { tutorIdx: 6, content: 'Welcome to Advanced Speakers! Let\'s discuss nuanced vocabulary today. What\'s the difference between "compliment" and "complement"?' },
  { tutorIdx: 3, content: '"Compliment" is praise (with an "i" - I like it), "complement" means to complete or enhance (with an "e" - enhance).' },
  { tutorIdx: 0, content: 'Emma\'s mnemonic is perfect! Another tricky pair: "affect" vs "effect". Most of the time, affect is the verb, effect is the noun.' },
  { tutorIdx: 10, content: 'But "effect" can also be a verb meaning "to bring about" - "to effect change". That trips up even native speakers!' },
  { tutorIdx: 0, content: 'Great point Olga! And "affect" can be a noun in psychology - referring to emotional expression.' },
  { tutorIdx: 6, content: 'This is why context is everything. Let\'s talk about register - formal vs informal English. When is it appropriate to use contractions?' },
  { tutorIdx: 3, content: 'In academic writing, avoid contractions. In business emails, they\'re increasingly acceptable. In speech and informal writing, they\'re natural.' },
  { tutorIdx: 0, content: 'I\'d add that in presentations, contractions can make you sound more approachable, but in legal documents, they\'re a big no.' },
  { tutorIdx: 8, content: 'The prescriptivist vs descriptivist debate is fascinating. Language evolves, and what was "wrong" 50 years ago might be standard now.' },
  { tutorIdx: 10, content: 'As a linguist, I lean descriptivist. But I also think knowing the "rules" before breaking them is important for learners.' },
  { tutorIdx: 6, content: 'Absolutely. Picasso could paint realistically before he went abstract. The same principle applies to language.' },
  { tutorIdx: 3, content: 'Beautiful analogy Lukas! Speaking of which, does anyone have thoughts on how English is evolving with internet culture?' },
  { tutorIdx: 0, content: 'The normalization of "because + noun" (like "because internet") is fascinating. Also, "literally" now means both literally AND figuratively!' },
  { tutorIdx: 8, content: 'And "they" as a singular pronoun is now widely accepted. Merriam-Webster added it as word of the year in 2019.' },
  { tutorIdx: 10, content: 'The influence of global English is also interesting. Indian English, Singapore English, Nigerian English - they all contribute unique expressions.' },
  { tutorIdx: 0, content: 'I love "prepone" from Indian English - the opposite of postpone. It\'s so logical! Why don\'t we use it everywhere?' },
  { tutorIdx: 7, content: 'Haha, as an Indian English speaker, I didn\'t even know "prepone" was uniquely Indian until recently! It just makes sense!' },
  { tutorIdx: 6, content: 'That\'s the beauty of World Englishes. The language belongs to everyone who speaks it.' },
  { tutorIdx: 3, content: 'On a practical note, for those doing academic writing: the passive voice isn\'t always wrong. It\'s about choosing the right voice for emphasis.' },
  { tutorIdx: 0, content: 'Yes! "The experiment was conducted" (passive) puts focus on the experiment. "We conducted the experiment" (active) puts focus on the researchers.' },
  { tutorIdx: 8, content: 'Many journals now prefer active voice though. The APA style guide explicitly recommends it for clarity.' },
  { tutorIdx: 10, content: 'Clarity should always be the goal. Whether active or passive, the reader needs to understand your meaning effortlessly.' },
  { tutorIdx: 6, content: 'Well said Olga! That\'s the mark of truly advanced English - not using complex words, but using simple ones effectively.' },
];

const STUDY_PARTNERS_MESSAGES = [
  { tutorIdx: 5, type: 'system' as const, content: 'Aisha joined the room' },
  { tutorIdx: 5, content: 'Hi everyone! This is the perfect place to find a study buddy. What are your learning goals?' },
  { tutorIdx: 2, content: 'I want to pass the TOEFL next year. I need a score of 80+ for my university application.' },
  { tutorIdx: 9, content: 'I\'m also preparing for TOEFL! Maybe we can study together, Yuki?' },
  { tutorIdx: 2, content: 'That would be great Jin! We can practice speaking and writing together. 📚' },
  { tutorIdx: 1, content: 'I\'m looking for someone to practice English conversation. I can offer Italian in exchange!' },
  { tutorIdx: 8, content: 'Marco, I\'d love to practice Italian! I can help you with French or English conversation. Shall we schedule something?' },
  { tutorIdx: 1, content: 'Perfect Sophie! How about weekends? We can do 30 min English, 30 min Italian?' },
  { tutorIdx: 8, content: 'Sounds like a plan! Let\'s connect and set up a schedule. 🤝' },
  { tutorIdx: 7, content: 'I\'m looking for a study partner for IELTS Speaking practice. My target is Band 7.' },
  { tutorIdx: 5, content: 'Priya, I coach students for IELTS! I can help you with Speaking strategies. Band 7 is definitely achievable.' },
  { tutorIdx: 7, content: 'That would be amazing Aisha! Thank you so much! 💪' },
  { tutorIdx: 11, content: 'I need help with medical English vocabulary. Is there anyone here from the medical field?' },
  { tutorIdx: 0, content: 'Ahmed, while I\'m not in medicine, I can help you with general English for academic purposes. Medical terminology often has Latin roots which makes it easier to learn systematically.' },
  { tutorIdx: 11, content: 'That would be helpful! I struggle with writing patient reports in English.' },
  { tutorIdx: 4, content: 'Does anyone want to do a daily vocabulary challenge? We could share 5 new words every day!' },
  { tutorIdx: 10, content: 'I\'m in Carlos! I\'ll start: 1) Ephemeral (short-lived), 2) Ubiquitous (everywhere), 3) Pragmatic (practical), 4) Eloquent (fluent speaker), 5) Tenacious (persistent).' },
  { tutorIdx: 3, content: 'Great words Olga! My 5: 1) Resilient (recovering quickly), 2) Meticulous (very careful), 3) Candid (honest), 4) Prolific (producing a lot), 5) Versatile (adaptable).' },
  { tutorIdx: 9, content: 'These are excellent! I\'m saving them all. My 5 for today: 1) Diligent (hardworking), 2) Gregarious (sociable), 3) Scrutinize (examine closely), 4) Amiable (friendly), 5) Persevere (keep going).' },
  { tutorIdx: 6, content: 'Wonderful initiative! Let me add: when you learn new words, write example sentences using your own life context. It makes them stick!' },
  { tutorIdx: 0, content: 'Pro tip: use each new word in 3 different sentences within 24 hours. The repetition builds neural pathways! 🧠' },
  { tutorIdx: 5, content: 'I love the energy here! If anyone wants structured practice, I\'m available for coaching sessions. Just send me a message!' },
  { tutorIdx: 4, content: 'Thank you all! This community is so supportive. Let\'s keep each other motivated! 🎯' },
];

// Map room slug to messages
const ROOM_MESSAGES: Record<string, Array<{ tutorIdx: number; content: string; type?: 'system' }>> = {
  global: GLOBAL_MESSAGES,
  beginners: BEGINNERS_MESSAGES,
  intermediate: INTERMEDIATE_MESSAGES,
  advanced: ADVANCED_MESSAGES,
  'study-partners': STUDY_PARTNERS_MESSAGES,
};

// ─── Helper for random interests ────────────────────────────
const ALL_INTERESTS = ['Travel', 'Photography', 'Cooking', 'Sports', 'Music', 'Movies', 'Technology', 'Art', 'Reading', 'Gaming', 'Fashion', 'Nature', 'Fitness', 'Business', 'Science', 'History', 'Literature', 'Dance'];

function getRandomInterests(): string[] {
  const count = 3 + Math.floor(Math.random() * 4); // 3-6 interests
  const shuffled = [...ALL_INTERESTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ─── Seed function ─────────────────────────────────────────
export interface SeedResult {
  tutorsCreated: number;
  tutorsSkipped: number;
  messagesCreated: number;
  messagesSkipped: number;
  roomsEnsured: number;
  momentsCreated: number;
}

export async function seedCommunity(): Promise<SeedResult> {
  const result: SeedResult = {
    tutorsCreated: 0,
    tutorsSkipped: 0,
    messagesCreated: 0,
    messagesSkipped: 0,
    roomsEnsured: 0,
    momentsCreated: 0,
  };

  // 1. Ensure default rooms exist
  const DEFAULT_ROOMS = [
    { name: 'Global English Chat', slug: 'global', description: 'Chat with English learners from around the world. All levels welcome!', language: 'multilingual', levelRange: 'all', isPublic: true },
    { name: 'Beginners Corner', slug: 'beginners', description: 'A safe space for A1-A2 learners to practice basic English.', language: 'en', levelRange: 'A1-A2', isPublic: true },
    { name: 'Intermediate Lounge', slug: 'intermediate', description: 'Practice conversational English at B1-B2 level.', language: 'en', levelRange: 'B1-B2', isPublic: true },
    { name: 'Advanced Speakers', slug: 'advanced', description: 'For C1-C2 learners to discuss complex topics in English.', language: 'en', levelRange: 'C1-C2', isPublic: true },
    { name: 'Study Partners', slug: 'study-partners', description: 'Find study buddies and organize group study sessions.', language: 'multilingual', levelRange: 'all', isPublic: true },
  ];

  for (const room of DEFAULT_ROOMS) {
    const existing = await db.chatRoom.findUnique({ where: { slug: room.slug } });
    if (!existing) {
      await db.chatRoom.create({ data: room });
      result.roomsEnsured++;
    }
  }

  // 2. Create tutor users (idempotent - check by email)
  const passwordHash = await hashPassword('Tutor123!');
  const tutorUsers: Array<{ id: string; name: string; avatarUrl: string | null }> = [];

  for (const tutor of TUTOR_DEFINITIONS) {
    const existing = await db.user.findUnique({ where: { email: tutor.email } });
    if (existing) {
      tutorUsers.push({ id: existing.id, name: existing.name || tutor.name, avatarUrl: existing.avatarUrl });
      result.tutorsSkipped++;
      continue;
    }

    const nameParts = tutor.name.split(' ');
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}&background=${tutor.avatarColor}&color=fff&size=128`;

    const user = await db.user.create({
      data: {
        email: tutor.email,
        name: tutor.name,
        passwordHash,
        country: tutor.country,
        avatarUrl,
        bio: tutor.bio,
        englishLevel: tutor.englishLevel,
        occupation: tutor.occupation,
        isDemo: true,
        isProfileComplete: true,
        emailVerified: true,
        isVerified: true,
        trustScore: Math.floor(Math.random() * 40) + 20,
        interests: JSON.stringify(getRandomInterests()),
        plan: 'free',
        role: 'user',
      },
    });

    // Create language profile for the tutor
    await db.languageProfile.create({
      data: {
        userId: user.id,
        nativeLanguage: tutor.nativeLanguage,
        targetLanguages: JSON.stringify(tutor.targetLanguages),
        proficiencyLevel: tutor.proficiencyLevel,
        isDiscoverable: true,
        isOnline: true,
        lastSeenAt: new Date(),
      },
    });

    tutorUsers.push({ id: user.id, name: tutor.name, avatarUrl });
    result.tutorsCreated++;
  }

  // 3. Seed moments (even if messages exist)
  const existingMoments = await db.moment.findFirst({
    where: { userId: { in: tutorUsers.map((t) => t.id) } },
  });

  if (!existingMoments && tutorUsers.length > 0) {
    const SAMPLE_MOMENTS = [
      { tutorIdx: 0, content: 'Just finished a great lesson on conditional sentences! Remember: "If I had more time, I would read more books" is the second conditional (hypothetical). What conditionals do you find trickiest? 🤔', language: 'en', tags: ['grammar', 'tips'] },
      { tutorIdx: 6, content: 'The word "literally" has become one of the most misused words in English. It originally meant "exactly as stated" but now is often used for emphasis. Language evolves, but understanding the original meaning helps!', language: 'en', tags: ['vocabulary', 'culture'] },
      { tutorIdx: 2, content: '日本語では「頑張って」(ganbatte) is hard to translate directly to English. "Good luck" or "Do your best" don\'t quite capture it. What untranslatable words exist in your language?', language: 'en', tags: ['culture', 'vocabulary'] },
      { tutorIdx: 8, content: 'Les faux amis (false friends) are words that look similar in French and English but have different meanings. "Actuellement" means "currently" in French, NOT "actually"! What false friends trip you up?', language: 'en', tags: ['vocabulary', 'tips'] },
      { tutorIdx: 4, content: '¡Descubrí que "embarrassed" y "embarazada" son muy diferentes! "Embarrassed" = avergonzado, but "embarazada" = pregnant 😅 False friends can be dangerous in Spanish-English!', language: 'en', tags: ['vocabulary', 'culture'] },
      { tutorIdx: 10, content: 'In Russian, we don\'t have articles like "a" or "the". This makes it one of the hardest concepts for Russian speakers learning English. How do you explain articles to learners?', language: 'en', tags: ['grammar', 'question'] },
      { tutorIdx: 5, content: 'Pro tip for pronunciation: The English "th" sound doesn\'t exist in Arabic. Practice by placing your tongue between your teeth and gently blowing. Start with "think" and "this" — one is voiceless, one is voiced! 👄', language: 'en', tags: ['pronunciation', 'tips'] },
      { tutorIdx: 3, content: 'Hej! As a translator, I notice how idioms rarely translate directly. "It\'s raining cats and dogs" in Swedish would be "Det regnar spik" (It\'s raining nails). What\'s your favorite untranslatable idiom?', language: 'en', tags: ['idioms', 'culture'] },
      { tutorIdx: 1, content: 'Ho imparato che "library" in inglese NON significa "libreria" in italiano! Library = biblioteca, while libreria = bookstore. These false friends can cause funny misunderstandings! 📚', language: 'en', tags: ['vocabulary', 'tips'] },
      { tutorIdx: 7, content: 'Tech English tip: "Deploy" in software doesn\'t mean the same as in military context. In tech, it means to release or push code to production. Context is everything in English! 💻', language: 'en', tags: ['vocabulary', 'tips'] },
      { tutorIdx: 9, content: '안녕! I just realized Korean has no "f" sound, so "coffee" becomes "keopi" (커피). Do you have sounds in your language that don\'t exist in English, or vice versa?', language: 'en', tags: ['pronunciation', 'culture'] },
      { tutorIdx: 11, content: 'Medical English is a whole different language! "Presentation" in medicine means how a patient shows symptoms, not a slideshow. I\'m learning that context really is everything in specialized English. 🏥', language: 'en', tags: ['vocabulary', 'tips'] },
      { tutorIdx: 0, content: 'One of my students asked: "Why is it \"I have been to Paris\" but not \"I have gone to Paris\"?" Great question! "Been to" = visited and returned. "Gone to" = went and still there. Small words, big difference! 🗼', language: 'en', tags: ['grammar', 'question'] },
      { tutorIdx: 8, content: 'I love how English borrows words from everywhere! "Café" from French, "kindergarten" from German, "tsunami" from Japanese. English is truly a global language built from many cultures. 🌍', language: 'en', tags: ['culture', 'vocabulary'] },
      { tutorIdx: 6, content: 'Today\'s tip: "However" at the beginning of a sentence is formal. In conversation, try "But", "Though", or "Still" instead. Matching register to context is a sign of advanced English! 🎯', language: 'en', tags: ['grammar', 'tips', 'progress'] },
    ];

    const momentsNow = Date.now();
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;

    for (let i = 0; i < SAMPLE_MOMENTS.length; i++) {
      const m = SAMPLE_MOMENTS[i];
      const tutor = tutorUsers[m.tutorIdx];
      if (!tutor) continue;

      const progress = i / SAMPLE_MOMENTS.length;
      const baseTimestamp = momentsNow - threeDaysMs + progress * threeDaysMs;
      const randomOffset = Math.floor(Math.random() * 4 * 60 * 60 * 1000);
      const momentTimestamp = new Date(baseTimestamp + randomOffset);

      const moment = await db.moment.create({
        data: {
          userId: tutor.id,
          content: m.content,
          language: m.language,
          tags: JSON.stringify(m.tags),
          likesCount: Math.floor(Math.random() * 8),
          commentsCount: Math.floor(Math.random() * 3),
          createdAt: momentTimestamp,
        },
      });

      result.momentsCreated++;
    }
  }

  // 4. Check if seed messages already exist
  const existingSeedMessages = await db.chatRoomMessage.findFirst({
    where: { userId: { in: tutorUsers.map((t) => t.id) } },
  });

  if (existingSeedMessages) {
    result.messagesSkipped = 1; // Indicate messages already exist
    return result;
  }

  // 5. Create chat messages for each room
  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  for (const [roomSlug, messages] of Object.entries(ROOM_MESSAGES)) {
    const room = await db.chatRoom.findUnique({ where: { slug: roomSlug } });
    if (!room) continue;

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const tutor = tutorUsers[msg.tutorIdx];
      if (!tutor) continue;

      // Spread messages over the last 7 days, with some randomness
      // Earlier messages are older, later messages are newer
      const progress = i / messages.length;
      const baseTimestamp = now - sevenDaysMs + progress * sevenDaysMs;
      const randomOffset = Math.floor(Math.random() * 60 * 60 * 1000); // up to 1 hour random offset
      const messageTimestamp = new Date(baseTimestamp + randomOffset);

      const isSystem = msg.type === 'system';

      await db.chatRoomMessage.create({
        data: {
          roomId: room.id,
          userId: tutor.id,
          userName: isSystem ? '' : tutor.name,
          userAvatar: tutor.avatarUrl,
          content: msg.content,
          type: isSystem ? 'system' : 'text',
          createdAt: messageTimestamp,
        },
      });

      result.messagesCreated++;
    }
  }

  return result;
}
