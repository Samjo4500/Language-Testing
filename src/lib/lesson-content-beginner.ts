export interface LessonExample {
  sentence: string;
  note: string;
}

export interface LessonMistake {
  mistake: string;
  correction: string;
}

export interface LessonQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
}

export interface LessonStructuredContent {
  explanation: string; // 2-4 paragraphs of HTML content
  examples: LessonExample[]; // 4-6 examples with notes
  commonMistakes: LessonMistake[]; // 3-4 common mistakes with corrections
  quiz: LessonQuizQuestion[]; // 5 quiz questions with 4 options each
}

export const BEGINNER_LESSON_CONTENT: Record<string, LessonStructuredContent> = {
  "Present Simple Tense": {
    explanation: `<h2>Understanding the Present Simple Tense</h2>
<p>The present simple tense is one of the most fundamental tenses in English. It describes things that are <strong>always true</strong>, happen <strong>regularly</strong>, or are <strong>general facts</strong>. We use it for habits, routines, and permanent situations that do not change. The basic structure is straightforward: <strong>Subject + base verb</strong>, with one important rule — when the subject is <em>he</em>, <em>she</em>, or <em>it</em> (third person singular), you must add <strong>-s</strong> or <strong>-es</strong> to the base verb. For example, "I work" becomes "She works", and "I go" becomes "He goes".</p>

<p>For negative statements, we use the auxiliary verb <strong>"don't"</strong> (for I, you, we, they) or <strong>"doesn't"</strong> (for he, she, it) before the base verb. Notice that when you use "doesn't", the main verb returns to its base form without the -s ending — so it's "She <em>doesn't like</em>" not "She doesn't likes". For questions, place <strong>"Do"</strong> or <strong>"Does"</strong> before the subject, followed by the base verb: "Do you live here?" and "Does she speak English?" are both correct question forms.</p>

<p>Adverbs of frequency are commonly used with the present simple to express how often something happens. These include: <strong>always</strong> (100%), <strong>usually</strong> (80%), <strong>often</strong> (60%), <strong>sometimes</strong> (40%), <strong>rarely</strong> (15%), and <strong>never</strong> (0%). They typically go <em>before</em> the main verb: "I always drink coffee in the morning." However, with the verb "to be", they go <em>after</em> it: "She is always happy." Understanding the present simple thoroughly is essential because it forms the foundation for many more complex grammar structures.</p>`,
    examples: [
      {
        sentence: "I work in an office.",
        note: "Routine — a regular, repeated action describing daily life."
      },
      {
        sentence: "She lives in Madrid.",
        note: "Fact — a permanent situation that is true for an extended period."
      },
      {
        sentence: "Water boils at 100°C.",
        note: "General truth — a scientific fact that is always true."
      },
      {
        sentence: "They play football every Saturday.",
        note: "Habit — a repeated activity that happens on a regular schedule."
      },
      {
        sentence: "He doesn't like spicy food.",
        note: "Negative with doesn't — use doesn't + base form for he/she/it negatives."
      }
    ],
    commonMistakes: [
      {
        mistake: "He don't like pizza.",
        correction: "He doesn't like pizza."
      },
      {
        mistake: "She can speaks French.",
        correction: "She can speak French."
      },
      {
        mistake: "I am work in a bank.",
        correction: "I work in a bank."
      },
      {
        mistake: "Does he plays guitar?",
        correction: "Does he play guitar?"
      }
    ],
    quiz: [
      {
        question: "Complete: She _____ (go) to school by bus.",
        options: ["go", "goes", "going", "gone"],
        correctAnswer: 1,
        explanation: "For he/she/it, add -es to verbs ending in -o."
      },
      {
        question: "Which sentence is correct?",
        options: [
          "He don't like coffee.",
          "He doesn't likes coffee.",
          "He doesn't like coffee.",
          "He not like coffee."
        ],
        correctAnswer: 2,
        explanation: "Use doesn't + base form (without -s)."
      },
      {
        question: "'The sun rises in the east' is an example of:",
        options: ["A habit", "A general truth", "A future plan", "A past event"],
        correctAnswer: 1,
        explanation: "The sun rising in the east is a universal truth."
      },
      {
        question: "Choose the correct question form:",
        options: [
          "Does she works here?",
          "Does she work here?",
          "Do she work here?",
          "Is she work here?"
        ],
        correctAnswer: 1,
        explanation: "Use Does + subject + base verb for he/she/it questions."
      },
      {
        question: "Which adverb of frequency means 'not often'?",
        options: ["Always", "Usually", "Rarely", "Never"],
        correctAnswer: 2,
        explanation: "'Rarely' means something does not happen often."
      }
    ]
  },

  "Present Continuous Tense": {
    explanation: `<h2>Understanding the Present Continuous Tense</h2>
<p>The present continuous tense describes actions that are happening <strong>right now</strong> or temporary situations that are in progress. The structure is: <strong>Subject + am/is/are + verb-ing</strong>. For example, "I am reading a book" means the action is happening at this very moment. This tense is also called the "present progressive" because it describes progressive, ongoing actions. The auxiliary verb changes depending on the subject: <em>am</em> for I, <em>is</em> for he/she/it, and <em>are</em> for you/we/they.</p>

<p>We use the present continuous for three main situations: <strong>actions in progress</strong> at the moment of speaking ("She is cooking dinner right now"), <strong>temporary situations</strong> that may change ("I am staying with my friend this week"), and <strong>fixed future arrangements</strong> ("We are meeting the client tomorrow"). It is important to contrast this with the present simple — while the present simple describes permanent or regular situations, the present continuous describes what is happening now or what is temporary. Signal words that often accompany the present continuous include: <em>now</em>, <em>at the moment</em>, <em>currently</em>, <em>this week</em>, and <em>today</em>.</p>

<p>One crucial rule to remember is that some verbs, called <strong>stative verbs</strong>, are normally NOT used in the continuous form. These include verbs of thinking (<em>know, believe, understand</em>), verbs of emotion (<em>love, hate, want</em>), verbs of possession (<em>have, own, belong</em>), and verbs of perception (<em>see, hear, smell</em>). We say "I know the answer", not "I am knowing the answer". However, some stative verbs can be used in the continuous form when their meaning changes — "I have a car" (possession) vs. "I am having lunch" (action). Mastering when to use the present continuous versus the present simple is a key milestone in English fluency.</p>`,
    examples: [
      {
        sentence: "She is reading a book right now.",
        note: "Action in progress — happening at the current moment."
      },
      {
        sentence: "I am working from home this week.",
        note: "Temporary situation — a change from the normal routine."
      },
      {
        sentence: "They are meeting the client tomorrow.",
        note: "Future arrangement — a planned event with a set time."
      },
      {
        sentence: "We aren't watching TV at the moment.",
        note: "Negative form — use isn't/aren't + verb-ing for negatives."
      },
      {
        sentence: "Is he coming to the party?",
        note: "Question form — use Is/Are + subject + verb-ing for questions."
      }
    ],
    commonMistakes: [
      {
        mistake: "I am go to school now.",
        correction: "I am going to school now."
      },
      {
        mistake: "She is work at home today.",
        correction: "She is working at home today."
      },
      {
        mistake: "They no are studying.",
        correction: "They aren't studying."
      },
      {
        mistake: "He is knowing the answer.",
        correction: "He knows the answer. (stative verb - no continuous)"
      }
    ],
    quiz: [
      {
        question: "Complete: I _____ (study) English right now.",
        options: ["study", "am studying", "studies", "studying"],
        correctAnswer: 1,
        explanation: "Use am + verb-ing for an action happening now."
      },
      {
        question: "Which verb is NOT normally used in the continuous form?",
        options: ["run", "eat", "know", "read"],
        correctAnswer: 2,
        explanation: "'Know' is a stative verb and is not normally used in continuous form."
      },
      {
        question: "'I'm staying with my aunt this month' expresses:",
        options: [
          "A permanent fact",
          "A temporary situation",
          "A past habit",
          "A general truth"
        ],
        correctAnswer: 1,
        explanation: "This describes a temporary arrangement, not a permanent one."
      },
      {
        question: "Choose the correct negative form:",
        options: [
          "She isn't working today.",
          "She doesn't working today.",
          "She not is working today.",
          "She isn't work today."
        ],
        correctAnswer: 0,
        explanation: "Use isn't + verb-ing for the negative present continuous."
      },
      {
        question: "Complete: _____ they _____ (wait) for us?",
        options: [
          "Do / wait",
          "Are / waiting",
          "Is / waiting",
          "Does / wait"
        ],
        correctAnswer: 1,
        explanation: "Use Are + subject + verb-ing for plural question forms."
      }
    ]
  },

  "Articles: A, An, The": {
    explanation: `<h2>Understanding English Articles</h2>
<p>Articles are small but essential words that come before nouns to show whether we are referring to something <strong>specific</strong> or <strong>general</strong>. English has two types of articles: <strong>indefinite articles</strong> ("a" and "an") and the <strong>definite article</strong> ("the"). Understanding when to use each one — or when to use no article at all — is a fundamental skill in English grammar. The choice of article depends on whether the noun is specific or general, singular or plural, countable or uncountable.</p>

<p><strong>"A"</strong> and <strong>"an"</strong> are indefinite articles. They refer to non-specific nouns — things that the listener or reader cannot identify specifically. Use <strong>"a"</strong> before words that begin with a <em>consonant sound</em> ("a dog", "a house", "a university") and <strong>"an"</strong> before words that begin with a <em>vowel sound</em> ("an apple", "an hour", "an honest person"). Notice that it is the <strong>sound</strong> that matters, not the spelling — "an hour" is correct because "hour" starts with a vowel sound, and "a university" is correct because "university" starts with a consonant /j/ sound. We use "a/an" only with singular countable nouns when mentioning something for the first time or when it does not matter which specific one we mean.</p>

<p><strong>"The"</strong> is the definite article. It refers to specific nouns that both the speaker and listener can identify. We use "the" when something is <em>unique</em> (the sun, the moon), has been <em>mentioned before</em> ("I saw a dog. The dog was friendly."), or is <em>clear from context</em> ("Please close the door" — you know which door). Some nouns don't need an article at all — this is called the <strong>zero article</strong>. General plural nouns ("I love dogs"), uncountable nouns used generally ("Water is essential"), and most proper nouns ("She lives in France") take no article. Learning article usage takes practice, but remembering the basic principle — <em>specific = the, general/non-specific = a/an or no article</em> — will guide you well.</p>`,
    examples: [
      {
        sentence: "I saw a dog in the park.",
        note: "Indefinite — any dog, not a specific one."
      },
      {
        sentence: "The dog was very friendly.",
        note: "Definite — the same dog mentioned before."
      },
      {
        sentence: "She is an engineer.",
        note: "'an' before vowel sound — refers to a profession generally."
      },
      {
        sentence: "I love music.",
        note: "Zero article — general reference to something uncountable."
      },
      {
        sentence: "The Amazon River is in South America.",
        note: "'the' with geographical names — rivers, oceans, and mountain ranges."
      }
    ],
    commonMistakes: [
      {
        mistake: "I have a idea.",
        correction: "I have an idea. (vowel sound needs 'an')"
      },
      {
        mistake: "She is the doctor.",
        correction: "She is a doctor. (not a specific doctor)"
      },
      {
        mistake: "I love the music.",
        correction: "I love music. (general reference — no article needed)"
      },
      {
        mistake: "He is an European.",
        correction: "He is a European. ('European' starts with a consonant sound /j/)"
      }
    ],
    quiz: [
      {
        question: "Choose the correct article: She is _____ honest person.",
        options: ["a", "an", "the", "no article"],
        correctAnswer: 1,
        explanation: "'Honest' starts with a vowel sound, so we use 'an'."
      },
      {
        question: "Which sentence uses 'the' correctly?",
        options: [
          "I want the coffee.",
          "The life is beautiful.",
          "The moon is bright tonight.",
          "She plays the piano and the tennis."
        ],
        correctAnswer: 2,
        explanation: "'The moon' is unique, so 'the' is correct."
      },
      {
        question: "'I saw ___ interesting movie last night.' Choose:",
        options: ["a", "an", "the", "no article"],
        correctAnswer: 1,
        explanation: "'Interesting' starts with a vowel sound, so 'an' is correct."
      },
      {
        question: "When do we use NO article?",
        options: [
          "Before specific identified nouns",
          "Before singular countable nouns",
          "Before general plural or uncountable nouns",
          "Before unique objects"
        ],
        correctAnswer: 2,
        explanation: "General plural and uncountable nouns use zero article."
      },
      {
        question: "'___ Eiffel Tower is in Paris.' Choose:",
        options: ["A", "An", "The", "No article"],
        correctAnswer: 2,
        explanation: "The Eiffel Tower is a unique building, so 'the' is required."
      }
    ]
  },

  "Prepositions of Place and Time": {
    explanation: `<h2>Understanding Prepositions of Place and Time</h2>
<p>Prepositions of place and time are essential small words that describe <strong>where</strong> and <strong>when</strong> things happen. The three most important prepositions for both place and time are <strong>in</strong>, <strong>on</strong>, and <strong>at</strong>, but they are used differently depending on whether you are talking about place or time. Learning these patterns will significantly improve your ability to communicate locations and times accurately in English.</p>

<p>For <strong>place</strong>: Use <strong>"in"</strong> for enclosed spaces, containers, and large areas — "in the room", "in the box", "in London", "in the country". Use <strong>"on"</strong> for surfaces and lines — "on the table", "on the wall", "on the floor", "on the street". Use <strong>"at"</strong> for specific points, addresses, and events — "at the door", "at the bus stop", "at 25 Baker Street", "at the concert". A helpful way to think about it: "in" means <em>inside</em>, "on" means <em>touching a surface</em>, and "at" means <em>a specific location point</em>. Some contexts allow more than one preposition with slightly different meanings — "in the hospital" (inside the building) versus "at the hospital" (at that location, possibly outside).</p>

<p>For <strong>time</strong>: Use <strong>"in"</strong> for longer periods — months ("in March"), years ("in 2024"), seasons ("in summer"), and parts of the day ("in the morning"). Use <strong>"on"</strong> for specific days and dates — days of the week ("on Monday"), dates ("on July 4th"), and specific days with modifiers ("on my birthday", "on Christmas Day"). Use <strong>"at"</strong> for specific times and holiday periods — clock times ("at 3 PM"), meal times ("at lunchtime"), and festival periods ("at Christmas", "at Easter"). There are also some fixed expressions to memorize: "at the weekend" (British English), "on the weekend" (American English), "at night", and "at the moment". Practice with these patterns is the key to mastering prepositions.</p>`,
    examples: [
      {
        sentence: "The book is on the table.",
        note: "Surface — 'on' is used for surfaces like tables, desks, and shelves."
      },
      {
        sentence: "She lives in London.",
        note: "Enclosed area — 'in' is used for cities, countries, and large areas."
      },
      {
        sentence: "I'll meet you at the bus stop.",
        note: "Specific point — 'at' is used for a precise location or meeting point."
      },
      {
        sentence: "The class starts at 9 AM.",
        note: "Specific time — 'at' is used for clock times."
      },
      {
        sentence: "We go on holiday in August.",
        note: "Month — 'in' is used for months, years, and seasons."
      }
    ],
    commonMistakes: [
      {
        mistake: "I will see you on 5 o'clock.",
        correction: "I will see you at 5 o'clock."
      },
      {
        mistake: "She is in the bus stop.",
        correction: "She is at the bus stop."
      },
      {
        mistake: "The meeting is in Monday.",
        correction: "The meeting is on Monday."
      },
      {
        mistake: "He lives at Paris.",
        correction: "He lives in Paris."
      }
    ],
    quiz: [
      {
        question: "Complete: The cat is sleeping _____ the sofa.",
        options: ["in", "on", "at", "by"],
        correctAnswer: 1,
        explanation: "'On' is used for surfaces like a sofa."
      },
      {
        question: "Which preposition is correct for time? 'I was born _____ 1995.'",
        options: ["on", "at", "in", "by"],
        correctAnswer: 2,
        explanation: "Use 'in' for years."
      },
      {
        question: "'The train arrives _____ platform 3.' Choose:",
        options: ["in", "on", "at", "to"],
        correctAnswer: 2,
        explanation: "Use 'at' for specific points like a platform number."
      },
      {
        question: "Choose the correct sentence:",
        options: [
          "The meeting is in Monday.",
          "The meeting is on Monday.",
          "The meeting is at Monday.",
          "The meeting is by Monday."
        ],
        correctAnswer: 1,
        explanation: "Use 'on' for days of the week."
      },
      {
        question: "'She works _____ the hospital.' Which preposition works best?",
        options: ["in", "on", "at", "both in and at"],
        correctAnswer: 3,
        explanation: "Both work: 'in the hospital' (inside the building) or 'at the hospital' (the location point)."
      }
    ]
  },

  "Past Simple Regular Verbs": {
    explanation: `<h2>Understanding the Past Simple with Regular Verbs</h2>
<p>The past simple tense is used for <strong>completed actions</strong> in the past — things that started and finished at a specific time before now. For regular verbs, forming the past simple is straightforward: simply add <strong>-ed</strong> to the base form of the verb. For example, "walk" becomes "walked", "play" becomes "played", and "clean" becomes "cleaned". This regular pattern makes it easy to form the past tense for thousands of English verbs. The past simple is the same for all subjects — there is no special third-person form like in the present simple.</p>

<p>However, there are important <strong>spelling rules</strong> to remember. First, for verbs already ending in "e", just add <strong>-d</strong>: "live" becomes "lived", "dance" becomes "danced". Second, for verbs ending in a <em>consonant + y</em>, change the "y" to "i" before adding "-ed": "study" becomes "studied", "carry" becomes "carried". But if the verb ends in a <em>vowel + y</em>, just add "-ed": "play" becomes "played", "enjoy" becomes "enjoyed". Third, for one-syllable verbs ending in a <em>single vowel + single consonant</em>, double the final consonant before adding "-ed": "stop" becomes "stopped", "plan" becomes "planned". The same doubling rule applies for two-syllable verbs when the stress is on the last syllable: "prefer" becomes "preferred".</p>

<p>For <strong>negative statements</strong>, use <strong>"didn't" + base verb</strong> — the main verb returns to its base form, so it's "I didn't play" (not "I didn't played"). For <strong>questions</strong>, use <strong>"Did" + subject + base verb</strong>: "Did you enjoy the party?" (not "Did you enjoyed"). The past simple is commonly used with time expressions that indicate a finished time, such as: <em>yesterday</em>, <em>last week</em>, <em>two years ago</em>, <em>in 2020</em>, <em>last month</em>, and <em>this morning</em> (if the morning is over). These time markers are important signals that tell the listener you are talking about the past.</p>`,
    examples: [
      {
        sentence: "I walked to work yesterday.",
        note: "Regular -ed ending — the most common past simple pattern."
      },
      {
        sentence: "She lived in Paris for three years.",
        note: "Verb ending in -e, just add -d — 'live' becomes 'lived'."
      },
      {
        sentence: "They stopped at the red light.",
        note: "Double consonant after short vowel — 'stop' becomes 'stopped'."
      },
      {
        sentence: "He studied engineering at university.",
        note: "Consonant + y → -ied — 'study' becomes 'studied'."
      },
      {
        sentence: "Did you enjoy the party?",
        note: "Question with Did + base form — not 'Did you enjoyed'."
      }
    ],
    commonMistakes: [
      {
        mistake: "He stoped the car.",
        correction: "He stopped the car. (double the consonant)"
      },
      {
        mistake: "She didn't came home.",
        correction: "She didn't come home. (didn't + base form)"
      },
      {
        mistake: "I studyed hard last night.",
        correction: "I studied hard last night. (consonant + y → -ied)"
      },
      {
        mistake: "Did he went to school?",
        correction: "Did he go to school? (Did + base form)"
      }
    ],
    quiz: [
      {
        question: "Complete: She _____ (dance) at the party last night.",
        options: ["danceed", "danced", "dancd", "dancing"],
        correctAnswer: 1,
        explanation: "Verbs ending in -e just add -d: dance → danced."
      },
      {
        question: "Choose the correct past form: 'He _____ (stop) the car.'",
        options: ["stoped", "stopped", "stopt", "stopid"],
        correctAnswer: 1,
        explanation: "Double the consonant after a short vowel sound: stop → stopped."
      },
      {
        question: "Which negative sentence is correct?",
        options: [
          "I didn't played football.",
          "I didn't play football.",
          "I don't played football.",
          "I not played football."
        ],
        correctAnswer: 1,
        explanation: "Use didn't + base form of the verb."
      },
      {
        question: "'She _____ (study) French last year.' Complete:",
        options: ["studyed", "studied", "studys", "studyied"],
        correctAnswer: 1,
        explanation: "Consonant + y changes to -ied: study → studied."
      },
      {
        question: "Which time expression goes with the past simple?",
        options: ["every day", "tomorrow", "yesterday", "usually"],
        correctAnswer: 2,
        explanation: "'Yesterday' refers to a completed time in the past."
      }
    ]
  },

  "Past Simple Irregular Verbs": {
    explanation: `<h2>Understanding the Past Simple with Irregular Verbs</h2>
<p>Irregular verbs do not follow the regular <strong>-ed</strong> pattern in the past simple — they change form in different ways that must be <strong>memorized</strong>. This is one of the most challenging aspects of English grammar for learners because there is no single rule to predict how an irregular verb will change. Some irregular verbs change their <em>vowel</em> (sing → sang, drive → drove, swim → swam), some change <em>completely</em> (go → went, buy → bought, teach → taught), and some stay <em>exactly the same</em> (put → put, cut → cut, read → read). There is no shortcut — regular practice and memorization are essential for mastering these forms.</p>

<p>The most commonly used irregular verbs in English include: <strong>be</strong> (was/were), <strong>have</strong> (had), <strong>do</strong> (did), <strong>go</strong> (went), <strong>see</strong> (saw), <strong>take</strong> (took), <strong>give</strong> (gave), <strong>make</strong> (made), <strong>say</strong> (said), <strong>know</strong> (knew), <strong>think</strong> (thought), <strong>come</strong> (came), <strong>find</strong> (found), <strong>write</strong> (wrote), and <strong>get</strong> (got). These verbs are extremely common in everyday English, so learning their past forms should be a top priority. A good strategy is to learn them in groups based on their vowel change patterns — for example, "sing/sang/sung", "ring/rang/rung", and "drink/drank/drunk" all follow a similar pattern.</p>

<p>The good news is that the <strong>negative</strong> and <strong>question</strong> forms work the same way as regular verbs — they use <strong>"didn't" + base form</strong> for negatives and <strong>"Did" + subject + base form</strong> for questions. This means that in negatives and questions, the irregular past form disappears and the base form returns. For example: "She went home" (positive) but "She didn't go home" (negative) and "Did she go home?" (question). Many learners make the mistake of using the irregular past form with "didn't" or "Did" — remember, after these auxiliary verbs, always use the base form regardless of whether the verb is regular or irregular.</p>`,
    examples: [
      {
        sentence: "She went to the store yesterday.",
        note: "go → went — a completely irregular past form."
      },
      {
        sentence: "I saw a great movie last weekend.",
        note: "see → saw — a vowel change pattern."
      },
      {
        sentence: "They had dinner at 7 PM.",
        note: "have → had — same form for base and past."
      },
      {
        sentence: "He didn't come to the meeting.",
        note: "Negative: didn't + base form 'come', not 'came'."
      },
      {
        sentence: "Did you write the report?",
        note: "Question: Did + base form 'write', not 'wrote'."
      }
    ],
    commonMistakes: [
      {
        mistake: "He didn't went home.",
        correction: "He didn't go home. (didn't + base form)"
      },
      {
        mistake: "She buyed a new phone.",
        correction: "She bought a new phone. (buy → bought)"
      },
      {
        mistake: "I seed the accident.",
        correction: "I saw the accident. (see → saw)"
      },
      {
        mistake: "Did you saw that?",
        correction: "Did you see that? (Did + base form)"
      }
    ],
    quiz: [
      {
        question: "What is the past form of 'go'?",
        options: ["goed", "gone", "went", "going"],
        correctAnswer: 2,
        explanation: "'Go' is irregular: go → went."
      },
      {
        question: "Complete: She _____ (buy) a new laptop last week.",
        options: ["buyed", "bought", "buied", "buyt"],
        correctAnswer: 1,
        explanation: "'Buy' is irregular: buy → bought."
      },
      {
        question: "Choose the correct negative form:",
        options: [
          "He didn't came home.",
          "He didn't come home.",
          "He doesn't came home.",
          "He not came home."
        ],
        correctAnswer: 1,
        explanation: "Use didn't + base form, even for irregular verbs."
      },
      {
        question: "'Did they _____ the test?' Complete:",
        options: ["passed", "pass", "passing", "passes"],
        correctAnswer: 1,
        explanation: "After 'Did', always use the base form."
      },
      {
        question: "Which past form is correct?",
        options: [
          "He writed a letter.",
          "He wrote a letter.",
          "He writted a letter.",
          "He writing a letter."
        ],
        correctAnswer: 1,
        explanation: "'Write' is irregular: write → wrote."
      }
    ]
  },

  "Can and Can't: Ability and Permission": {
    explanation: `<h2>Understanding Can and Can't</h2>
<p><strong>"Can"</strong> is a modal verb used to express three main concepts: <strong>ability</strong>, <strong>permission</strong>, and <strong>possibility</strong>. For ability, "can" means you have the skill or knowledge to do something: "I can swim" means you know how to swim. For permission, "can" is used to ask for or give permission in informal situations: "Can I leave early?" is a common way to ask if something is allowed. For possibility, "can" means something is generally possible: "It can rain in April" means that rain is a possibility during that month. The negative form <strong>"can't"</strong> (short for "cannot") expresses inability, refusal, or prohibition.</p>

<p>An essential grammar rule is that <strong>"can" is always followed by the base form of the verb without "to"</strong>. We say "I can swim", not "I can to swim" or "I can swimming". Also, "can" does not change form for different subjects — it is always "can", never "cans" or "canning". We say "She can speak English", not "She cans speak English". This is because modal verbs in English are defective — they do not have all the forms that regular verbs have. They have no infinitive, no participle, and no third-person singular form. For questions, simply invert the subject and "can": "Can you help me?"</p>

<p>In more formal contexts, <strong>"may"</strong> is preferred for permission ("May I leave early?" sounds more polite than "Can I leave early?"), but "can" is widely accepted and used in everyday English. For past ability, we use <strong>"could"</strong> instead of "can": "I could swim when I was five." However, for past permission and past possibility, "could" works differently than "can" and requires careful study. For now, focus on using "can" for present ability, informal permission, and general possibility. Remember: <em>can + base verb</em>, never "can to" or "can + -ing". This simple rule will prevent many common errors.</p>`,
    examples: [
      {
        sentence: "I can speak three languages.",
        note: "Ability — expressing a skill or capability."
      },
      {
        sentence: "Can I use your phone?",
        note: "Informal permission request — asking if something is allowed."
      },
      {
        sentence: "She can't drive a car.",
        note: "Inability — expressing that someone lacks a skill."
      },
      {
        sentence: "You can't park here.",
        note: "Prohibition — expressing that something is not allowed."
      },
      {
        sentence: "It can get very cold in winter.",
        note: "Possibility — expressing that something is generally possible."
      }
    ],
    commonMistakes: [
      {
        mistake: "I can swimming.",
        correction: "I can swim. (base form after can, no -ing)"
      },
      {
        mistake: "She cans speak English.",
        correction: "She can speak English. (no -s after can)"
      },
      {
        mistake: "I can to play guitar.",
        correction: "I can play guitar. (no 'to' after can)"
      },
      {
        mistake: "Can you to help me?",
        correction: "Can you help me? (no 'to' after can)"
      }
    ],
    quiz: [
      {
        question: "Complete: She _____ (swim) very well.",
        options: ["can swims", "can swim", "cans swim", "can swimming"],
        correctAnswer: 1,
        explanation: "'Can' is followed by the base form without -s or -ing."
      },
      {
        question: "'Can I borrow your pen?' is an example of:",
        options: ["Ability", "Permission", "Possibility", "Obligation"],
        correctAnswer: 1,
        explanation: "Asking to borrow something is requesting permission."
      },
      {
        question: "Choose the correct negative form:",
        options: [
          "I no can go.",
          "I can't go.",
          "I don't can go.",
          "I not can go."
        ],
        correctAnswer: 1,
        explanation: "'Can't' (cannot) is the correct negative form."
      },
      {
        question: "Which sentence shows inability?",
        options: [
          "I can help you.",
          "She can come tomorrow.",
          "He can't find his keys.",
          "We can see the mountains."
        ],
        correctAnswer: 2,
        explanation: "'Can't find' means he is unable to find his keys."
      },
      {
        question: "Complete: They _____ (not / come) to the party tonight.",
        options: ["can't come", "can't comes", "don't can come", "not can come"],
        correctAnswer: 0,
        explanation: "Use 'can't + base form' for inability."
      }
    ]
  },

  "Questions: Wh- and Yes/No": {
    explanation: `<h2>Understanding English Questions</h2>
<p>English questions come in two main types: <strong>Yes/No questions</strong> and <strong>Wh- questions</strong>. Yes/No questions begin with an auxiliary verb (do, does, did, is, are, can, will, etc.) and can be answered with a simple "yes" or "no". For example: "Do you like coffee?" → "Yes, I do" or "No, I don't." Wh- questions begin with question words — <em>who, what, where, when, why, which, how</em> — and ask for specific information that cannot be answered with just "yes" or "no". For example: "Where do you live?" → "I live in London." Understanding both types of questions is essential for everyday communication in English.</p>

<p>The word order in questions is different from statements. In a statement, the subject comes before the verb: "You live here." In a question, the auxiliary verb comes <strong>before the subject</strong>: "Do you live here?" This inversion is a fundamental rule of English question formation. For the present simple, use <strong>"Do/Does + subject + base verb"</strong>: "Do they work here?" and "Does she speak French?" For the past simple, use <strong>"Did + subject + base verb"</strong>: "Did you see the movie?" For the present continuous, use <strong>"Is/Are + subject + verb-ing"</strong>: "Are you studying?" The question word always goes at the very beginning of a Wh- question: "Where do you live?", "What does she want?", "When did they arrive?"</p>

<p>One special case to note is when the question word itself is the <strong>subject</strong> of the sentence. In this case, no auxiliary verb is needed, and the word order stays the same as a statement. Compare: "Who did you call?" (you is the subject, who is the object) versus "Who called you?" (who is the subject). Similarly: "What did happen?" is incorrect — the correct form is "What happened?" because "what" is the subject. Another common error is forgetting the auxiliary verb entirely: "Where you live?" should be "Where do you live?" Always remember that English questions (except subject questions) require an auxiliary verb before the subject.</p>`,
    examples: [
      {
        sentence: "Do you like coffee?",
        note: "Yes/No question — present simple, can be answered with yes or no."
      },
      {
        sentence: "Where does she live?",
        note: "Wh- question with 'does' — asks for specific information about place."
      },
      {
        sentence: "Did they finish the project?",
        note: "Yes/No question — past simple, asks about a completed action."
      },
      {
        sentence: "What time does the train leave?",
        note: "Wh- question asking for specific information about time."
      },
      {
        sentence: "Why are you crying?",
        note: "Wh- question with present continuous — asks about a current action."
      }
    ],
    commonMistakes: [
      {
        mistake: "Where you live?",
        correction: "Where do you live? (missing auxiliary verb)"
      },
      {
        mistake: "What means this word?",
        correction: "What does this word mean? (wrong word order)"
      },
      {
        mistake: "Did she came alone?",
        correction: "Did she come alone? (Did + base form)"
      },
      {
        mistake: "Who did write this?",
        correction: "Who wrote this? (when 'who' is the subject, no auxiliary needed)"
      }
    ],
    quiz: [
      {
        question: "Choose the correct question form:",
        options: [
          "Where you work?",
          "Where do you work?",
          "Where does you work?",
          "Where work you?"
        ],
        correctAnswer: 1,
        explanation: "Use 'do' + subject + base verb for 'you' questions."
      },
      {
        question: "'Does she like chocolate?' is a:",
        options: [
          "Wh- question",
          "Yes/No question",
          "Negative question",
          "Tag question"
        ],
        correctAnswer: 1,
        explanation: "It starts with an auxiliary verb and can be answered yes or no."
      },
      {
        question: "Complete: _____ did you go on holiday?",
        options: ["What", "Where", "Who", "Which"],
        correctAnswer: 1,
        explanation: "'Where' asks about place or destination."
      },
      {
        question: "Which question is correct?",
        options: [
          "What time the class starts?",
          "What time does the class start?",
          "What time start the class?",
          "What time does the class starts?"
        ],
        correctAnswer: 1,
        explanation: "Use 'does + subject + base form' for third person questions."
      },
      {
        question: "'Who wrote this book?' — Why is there no 'did'?",
        options: [
          "Because it's past tense",
          "Because 'who' is the subject",
          "Because it's formal",
          "It should have 'did'"
        ],
        correctAnswer: 1,
        explanation: "When the question word is the subject, no auxiliary verb is needed."
      }
    ]
  },

  "Countable and Uncountable Nouns": {
    explanation: `<h2>Understanding Countable and Uncountable Nouns</h2>
<p>English nouns are divided into two categories: <strong>countable</strong> (can be counted) and <strong>uncountable</strong> (cannot be counted individually). Countable nouns have both singular and plural forms: "a book" → "two books", "a cat" → "three cats". You can use numbers directly with countable nouns and they can take the indefinite articles "a" or "an". Uncountable nouns, on the other hand, have only one form and cannot be counted with numbers: we say "water", "rice", "information" — not "two waters" or "three rices". You cannot use "a" or "an" with uncountable nouns, and they always take a singular verb: "The water is cold" (not "The water are cold").</p>

<p>Different <strong>quantifiers</strong> are used with each type of noun, and using the wrong one is a common mistake. With <strong>countable</strong> nouns, use: <strong>many</strong> ("many books"), <strong>a few</strong> ("a few students"), <strong>few</strong> ("few people"), and <strong>several</strong> ("several options"). With <strong>uncountable</strong> nouns, use: <strong>much</strong> ("much time"), <strong>a little</strong> ("a little water"), and <strong>little</strong> ("little patience"). Some quantifiers work with <strong>both</strong> types: <strong>some</strong> ("some books" / "some water"), <strong>any</strong> ("any questions" / "any information"), and <strong>a lot of</strong> ("a lot of students" / "a lot of money"). When in doubt about whether a noun is countable or uncountable, consult a dictionary — it will always indicate the noun type.</p>

<p>Some common <strong>uncountable nouns</strong> that often cause confusion include: <em>advice</em> (not "advices"), <em>information</em> (not "informations"), <em>news</em> (not "newses"), <em>furniture</em> (not "furnitures"), <em>luggage/baggage</em> (not "luggages"), <em>homework</em> (not "homeworks"), <em>knowledge</em> (not "knowledges"), <em>weather</em> (not "weathers"), <em>money</em> (not "moneys" in general usage), <em>rice</em> (not "rices"), and <em>bread</em> (not "breads"). To count uncountable nouns, we use measure words or partitives: "a piece of advice", "two cups of coffee", "three slices of bread", "a bottle of water". This distinction between countable and uncountable nouns is one of the most important grammar concepts for English learners to master, as it affects article usage, verb agreement, and quantifier selection.</p>`,
    examples: [
      {
        sentence: "I have two cats.",
        note: "Countable — plural with number, can be individually counted."
      },
      {
        sentence: "Can I have some water?",
        note: "Uncountable — no plural form, use 'some' instead of a number."
      },
      {
        sentence: "There aren't many students in the class.",
        note: "many + countable — 'students' can be counted."
      },
      {
        sentence: "She doesn't have much time.",
        note: "much + uncountable — 'time' cannot be counted."
      },
      {
        sentence: "I need some advice.",
        note: "advice is uncountable — not 'advices'."
      }
    ],
    commonMistakes: [
      {
        mistake: "I need some advices.",
        correction: "I need some advice. (advice is uncountable)"
      },
      {
        mistake: "How many money do you have?",
        correction: "How much money do you have? (money is uncountable)"
      },
      {
        mistake: "She has a lot of furnitures.",
        correction: "She has a lot of furniture. (furniture is uncountable)"
      },
      {
        mistake: "I have few water.",
        correction: "I have a little water. (use 'a little' with uncountable)"
      }
    ],
    quiz: [
      {
        question: "Which noun is uncountable?",
        options: ["apple", "chair", "information", "student"],
        correctAnswer: 2,
        explanation: "'Information' cannot be counted — you can't say 'two informations'."
      },
      {
        question: "'How _____ sugar do you need?' Complete:",
        options: ["many", "much", "few", "a few"],
        correctAnswer: 1,
        explanation: "'Sugar' is uncountable, so we use 'much'."
      },
      {
        question: "Choose the correct sentence:",
        options: [
          "I have a few water.",
          "I have a little water.",
          "I have many water.",
          "I have a water."
        ],
        correctAnswer: 1,
        explanation: "Use 'a little' with uncountable nouns like water."
      },
      {
        question: "Which quantifier works with BOTH countable and uncountable nouns?",
        options: ["many", "much", "a lot of", "a few"],
        correctAnswer: 2,
        explanation: "'A lot of' works with both types: 'a lot of books' and 'a lot of water'."
      },
      {
        question: "'Can you give me some _____?' Which word fits?",
        options: ["informations", "homeworks", "advice", "furnitures"],
        correctAnswer: 2,
        explanation: "'Advice' is uncountable and always singular. The others are incorrect plural forms."
      }
    ]
  },

  "Self-Introduction and Daily Routines": {
    explanation: `<h2>Self-Introduction and Describing Daily Routines</h2>
<p>Being able to introduce yourself and describe your daily routine is one of the most <strong>practical</strong> English skills for beginners. A self-introduction typically follows a simple structure: <strong>greeting</strong> → <strong>name</strong> → <strong>origin</strong> → <strong>occupation</strong> → <strong>hobby or interest</strong>. Common phrases for introductions include: "My name is...", "I'm from...", "I work as...", "I'm a student at...", and "In my free time, I enjoy...". Keeping your introduction clear and well-structured helps the listener understand key information about you. A good introduction sounds natural and confident, so practice saying it until it flows smoothly.</p>

<p>For describing <strong>daily routines</strong>, we use the <strong>present simple tense</strong> because these are regular, repeated actions that happen on a schedule. Time expressions are essential for structuring a routine narrative. Start with the beginning of the day: "I wake up at 7 AM", "Then I have breakfast at 7:30", "After that, I go to work at 8 AM". <strong>Sequencing words</strong> help connect events logically: <em>first</em>, <em>then</em>, <em>after that</em>, <em>next</em>, <em>later</em>, and <em>finally</em>. These words make your routine description flow naturally and help the listener follow the order of events. Remember to add the third-person -s when talking about someone else's routine: "She <em>wakes</em> up at 7 AM" (not "She wake up").</p>

<p>When talking about <strong>hobbies and interests</strong>, use phrases like "In my free time, I enjoy...", "I like + verb-ing", "My hobby is + verb-ing", or "I'm interested in + noun/verb-ing". A common mistake is using the infinitive form after "is" for hobbies — say "My hobby is <em>playing</em> football" (not "My hobby is play football"). Another useful structure for routines is using prepositions of time correctly: "on weekdays" vs "on weekends", "in the morning" vs "at night". The key to fluency with self-introductions and routines is practice — try describing your own day from morning to night, and practice introducing yourself to different people in different contexts. With regular practice, these patterns will become automatic and natural.</p>`,
    examples: [
      {
        sentence: "Hi, I'm Maria. I'm from Spain and I work as a teacher.",
        note: "Basic introduction — greeting, name, origin, and occupation."
      },
      {
        sentence: "I usually wake up at 7 AM and have breakfast at 7:30.",
        note: "Routine with time expressions — using present simple for regular habits."
      },
      {
        sentence: "After work, I go to the gym.",
        note: "Using 'after' to sequence events — connects two activities in order."
      },
      {
        sentence: "In my free time, I enjoy reading and cooking.",
        note: "Hobbies and interests — natural phrase to introduce leisure activities."
      },
      {
        sentence: "On weekends, I usually visit my family.",
        note: "Weekend routine — 'on weekends' is the correct time expression."
      }
    ],
    commonMistakes: [
      {
        mistake: "I am come from Japan.",
        correction: "I come from Japan. (don't use 'am' with action verbs)"
      },
      {
        mistake: "She wake up at 6 AM.",
        correction: "She wakes up at 6 AM. (third person -s)"
      },
      {
        mistake: "I go to work and after I have lunch.",
        correction: "I go to work, and then I have lunch. (use 'then' for sequence)"
      },
      {
        mistake: "My hobby is play football.",
        correction: "My hobby is playing football. (use gerund after 'is')"
      }
    ],
    quiz: [
      {
        question: "Which self-introduction is correct?",
        options: [
          "I am come from Brazil.",
          "I come from Brazil.",
          "I coming from Brazil.",
          "I does come from Brazil."
        ],
        correctAnswer: 1,
        explanation: "Use present simple for origin: 'I come from...'"
      },
      {
        question: "Complete: She _____ (wake up) at 7 AM every day.",
        options: ["wake up", "wakes up", "waking up", "is waking up"],
        correctAnswer: 1,
        explanation: "Third person singular adds -s: 'wakes up'."
      },
      {
        question: "Which word helps sequence a routine?",
        options: ["usually", "then", "always", "often"],
        correctAnswer: 1,
        explanation: "'Then' connects events in a sequence."
      },
      {
        question: "'My hobby is _____ football.' Complete:",
        options: ["play", "playing", "plays", "played"],
        correctAnswer: 1,
        explanation: "After 'is', use the gerund (-ing) form for hobbies."
      },
      {
        question: "Which phrase is best for introducing hobbies?",
        options: [
          "I do like reading.",
          "In my free time, I enjoy reading.",
          "I am reading always.",
          "I does enjoy reading."
        ],
        correctAnswer: 1,
        explanation: "'In my free time, I enjoy...' is a natural way to introduce hobbies."
      }
    ]
  },

  "Ordering Food and Drinks": {
    explanation: `<h2>Ordering Food and Drinks in English</h2>
<p>Ordering food is one of the most common real-world English situations you will encounter. The key is being <strong>polite and clear</strong> when speaking to restaurant staff. There are several essential phrases for ordering: <em>"I'd like the ______, please"</em> is the most common and polite form. <em>"Could I have the ______?"</em> is very polite, while <em>"I'll have the ______"</em> is more casual and natural. In American and Canadian English, <em>"Can I get the ______?"</em> is very common in informal settings.</p>

<p>When you need to ask about the menu, use phrases like <em>"What's in the ______?"</em> to ask about ingredients, <em>"Does this have ______ in it?"</em> for allergies or dietary concerns, and <em>"What do you recommend?"</em> when you want the waiter's suggestion. For special requests, say <em>"Could I have that without ______?"</em> or <em>"Can I get extra ______, please?"</em>. At the end of the meal, ask for the bill with <em>"Could we have the bill, please?"</em> (British English) or <em>"Could we get the check, please?"</em> (American English).</p>

<p>Remember to be polite throughout your meal. If something is wrong with your order, say <em>"I'm sorry, I ordered ______, not ______"</em> rather than complaining aggressively. Saying <em>"This is delicious!"</em> when you enjoy the food is always appreciated. When paying, you can ask <em>"Is service included?"</em> to find out if a tip is already added to the bill. In the US, tipping 15-20% is expected; in the UK, tipping is optional at around 10%.</p>`,
    examples: [
      {
        sentence: "I'd like the grilled chicken, please.",
        note: "Polite ordering — the most common and natural way to order in a restaurant."
      },
      {
        sentence: "Could I have the soup of the day?",
        note: "Very polite request — using 'could' makes the request softer and more courteous."
      },
      {
        sentence: "Does this dish contain nuts?",
        note: "Allergy/dietary question — essential for safety when you have food allergies."
      },
      {
        sentence: "Could we have the bill, please?",
        note: "Asking for the bill (UK) — 'check' is used in American English instead."
      },
      {
        sentence: "I'm sorry, I ordered the salad, not the soup.",
        note: "Correcting a wrong order — polite but clear way to point out a mistake."
      }
    ],
    commonMistakes: [
      {
        mistake: "I want the chicken.",
        correction: "I'd like the chicken, please. ('Want' sounds too direct and impolite in restaurants.)"
      },
      {
        mistake: "Give me the menu.",
        correction: "Could I see the menu, please? (Use a polite request form instead of a command.)"
      },
      {
        mistake: "The bill, please. (without 'Could we have')",
        correction: "Could we have the bill, please? (Always include a polite request structure.)"
      },
      {
        mistake: "I want to pay.",
        correction: "Could we pay, please? (More natural and polite way to request payment.)"
      }
    ],
    quiz: [
      {
        question: "Which phrase is the most polite way to order food?",
        options: [
          "I want the steak.",
          "Give me the steak.",
          "I'd like the steak, please.",
          "The steak, now."
        ],
        correctAnswer: 2,
        explanation: "'I'd like... please' is the standard polite way to order. 'Want' and 'give me' sound too direct and rude."
      },
      {
        question: "What do you say in the UK when you want to pay?",
        options: [
          "Could we have the check, please?",
          "Could we have the bill, please?",
          "Give me the receipt.",
          "I want to pay now."
        ],
        correctAnswer: 1,
        explanation: "In British English, you ask for the 'bill'. 'Check' is American English. Always use a polite request form."
      },
      {
        question: "How do you ask if a dish contains something you're allergic to?",
        options: [
          "Is there nuts in this?",
          "Does this dish contain nuts?",
          "No nuts in this?",
          "You put nuts here?"
        ],
        correctAnswer: 1,
        explanation: "'Does this dish contain nuts?' is grammatically correct and clearly asks about allergens. Use 'contain' for ingredients."
      },
      {
        question: "What does 'Could I have that without onions?' mean?",
        options: [
          "I want extra onions.",
          "I don't want any onions in my dish.",
          "I want the onions on the side.",
          "I love onions."
        ],
        correctAnswer: 1,
        explanation: "'Without' means you do not want that ingredient in your dish. It is a way to make a special request."
      },
      {
        question: "A waiter asks 'Are you ready to order?' What is a natural response?",
        options: [
          "Yes, I'd like the fish, please.",
          "Food.",
          "Give me food.",
          "I hungry."
        ],
        correctAnswer: 0,
        explanation: "'Yes, I'd like the fish, please' is a complete, polite response that includes your order."
      }
    ]
  },

  "Asking for and Giving Directions": {
    explanation: `<h2>Asking for and Giving Directions</h2>
<p>Being able to ask for and give directions is an essential survival skill in English. There are two key groups of prepositions you need: prepositions of <strong>place</strong> (next to, between, behind, in front of, opposite, near, on the corner of) and prepositions of <strong>movement</strong> (straight ahead, turn left/right, go past, cross the road, walk along, take the first/second turning). When asking for directions, always start with a polite phrase such as <em>"Excuse me, how do I get to the station?"</em> or <em>"Sorry, could you tell me where the museum is?"</em></p>

<p>When giving directions, use clear and specific phrases. Common expressions include: <em>"Go straight ahead until you see the ______"</em>, <em>"Turn left/right at the traffic lights"</em>, <em>"It's on your left/right"</em>, and <em>"Go past the ______, then turn ______"</em>. You can also refer to landmarks to help the person: traffic lights, roundabouts, bridges, pedestrian crossings, bus stops, and petrol stations. The phrase <em>"You can't miss it!"</em> is commonly used to reassure someone that the place is easy to find.</p>

<p>Transportation phrases are also important when asking about distance and options. Use <em>"Is it walking distance?"</em> to ask if you can walk there, <em>"How far is it?"</em> for the distance, and <em>"Is there a bus that goes there?"</em> for public transport options. Remember to thank the person who gives you directions — a simple <em>"Thank you very much!"</em> or <em>"That's very helpful!"</em> is always appreciated.</p>`,
    examples: [
      {
        sentence: "Excuse me, how do I get to the train station?",
        note: "Polite way to ask for directions — always start with 'Excuse me'."
      },
      {
        sentence: "Go straight ahead and turn left at the traffic lights.",
        note: "Giving directions using movement prepositions and a landmark (traffic lights)."
      },
      {
        sentence: "It's opposite the bank, next to the post office.",
        note: "Using place prepositions to describe an exact location."
      },
      {
        sentence: "Walk along this street for about 200 metres.",
        note: "Giving distance and direction — 'along' means following the street."
      },
      {
        sentence: "You can't miss it! It's the big blue building on your right.",
        note: "Reassuring phrase — 'You can't miss it' means it's very easy to see."
      }
    ],
    commonMistakes: [
      {
        mistake: "Where is the station? (without 'Excuse me')",
        correction: "Excuse me, could you tell me where the station is? (Always use a polite opening.)"
      },
      {
        mistake: "Go to left at the traffic lights.",
        correction: "Turn left at the traffic lights. (Use 'turn left/right', not 'go to left'.)"
      },
      {
        mistake: "It's in front the bank.",
        correction: "It's in front of the bank. ('In front of' needs 'of' before the noun.)"
      },
      {
        mistake: "Walk straight to the end.",
        correction: "Go straight ahead until you reach the end. (Use 'straight ahead' for directions.)"
      }
    ],
    quiz: [
      {
        question: "Which is the most polite way to ask for directions?",
        options: [
          "Where is the museum?",
          "Tell me where the museum is.",
          "Excuse me, could you tell me how to get to the museum?",
          "Museum? Where?"
        ],
        correctAnswer: 2,
        explanation: "Starting with 'Excuse me' and using 'could you tell me' makes the question polite and respectful."
      },
      {
        question: "What does 'It's opposite the bank' mean?",
        options: [
          "It's inside the bank.",
          "It's next to the bank.",
          "It's directly across from the bank.",
          "It's behind the bank."
        ],
        correctAnswer: 2,
        explanation: "'Opposite' means directly across from — on the other side of the street or area."
      },
      {
        question: "Complete: 'Go ______ the supermarket and turn right.'",
        options: ["past", "opposite", "between", "along"],
        correctAnswer: 0,
        explanation: "'Go past' means to walk by or beyond something. You pass it and continue."
      },
      {
        question: "What does 'You can't miss it' mean?",
        options: [
          "You should avoid it.",
          "It's very easy to find and see.",
          "You will lose it.",
          "It's hidden."
        ],
        correctAnswer: 1,
        explanation: "'You can't miss it' is a reassuring expression meaning the place is very visible and easy to find."
      },
      {
        question: "Which phrase asks about distance?",
        options: [
          "How do I get there?",
          "How far is it?",
          "Where is it?",
          "Is it walking distance?"
        ],
        correctAnswer: 1,
        explanation: "'How far is it?' specifically asks about the distance. 'Is it walking distance?' is about whether you can walk there, not the exact distance."
      }
    ]
  },

  "Making Appointments and Reservations": {
    explanation: `<h2>Making Appointments and Reservations</h2>
<p>Making appointments and reservations is an important skill for both formal and informal situations. In formal contexts — such as calling a doctor's office, booking a restaurant, or scheduling a work meeting — use polite phrases like <em>"I'd like to make an appointment with Dr. Smith, please"</em>, <em>"Could I schedule a meeting for next Tuesday?"</em>, or <em>"I'd like to book a table for four people at 7 PM."</em> Always ask about availability with <em>"Is there any availability this week?"</em> or <em>"Do you have any openings on Friday afternoon?"</em></p>

<p>For informal situations with friends, the language is much more casual: <em>"Are you free on Saturday?"</em>, <em>"Do you want to meet up next week?"</em>, <em>"How about Tuesday at 3?"</em>, and <em>"What time works for you?"</em> When responding to proposals, you can accept with <em>"That works for me"</em> or <em>"Perfect!"</em>, decline politely with <em>"I'm afraid I'm busy then"</em>, or suggest alternatives with <em>"Would Thursday work instead?"</em></p>

<p>Date and time expressions are essential: use <em>"on Monday"</em>, <em>"on the 15th"</em>, <em>"in the morning/afternoon/evening"</em>, and <em>"at 9 o'clock"</em>. Remember the difference between <em>"next Monday"</em> (the coming Monday) and <em>"this Monday"</em> (which could mean earlier this week). If you need to change or cancel, say <em>"Could I reschedule my appointment to next week?"</em> or <em>"I need to cancel my reservation."</em> Always confirm with <em>"Just to confirm, we're meeting at 2 PM on Friday?"</em></p>`,
    examples: [
      {
        sentence: "I'd like to make an appointment with Dr. Lee, please.",
        note: "Formal appointment request — polite and specific about who you want to see."
      },
      {
        sentence: "Are you free on Saturday afternoon?",
        note: "Informal suggestion — asking a friend about their availability."
      },
      {
        sentence: "I'm afraid I'm busy then. How about Wednesday?",
        note: "Declining politely and suggesting an alternative — a very common pattern."
      },
      {
        sentence: "Could I reschedule my appointment to next week?",
        note: "Changing an appointment — 'reschedule' means to move it to a different time."
      },
      {
        sentence: "Just to confirm, we're meeting at 2 PM on Friday?",
        note: "Confirming details — always a good idea to double-check time and date."
      }
    ],
    commonMistakes: [
      {
        mistake: "I want appointment with doctor.",
        correction: "I'd like to make an appointment with the doctor, please. (Use polite request form and articles.)"
      },
      {
        mistake: "Are you free in Saturday?",
        correction: "Are you free on Saturday? (Use 'on' with days of the week.)"
      },
      {
        mistake: "I can't come Tuesday. Another day?",
        correction: "I'm afraid I'm busy on Tuesday. Would another day work for you? (More polite and complete.)"
      },
      {
        mistake: "I need cancel my reservation.",
        correction: "I need to cancel my reservation. (Don't forget 'to' after 'need'.)"
      }
    ],
    quiz: [
      {
        question: "Which is the most polite way to book a table at a restaurant?",
        options: [
          "I want a table for two tonight.",
          "Give me a table for two.",
          "I'd like to book a table for two at 7 PM, please.",
          "Table for two, now."
        ],
        correctAnswer: 2,
        explanation: "'I'd like to book... please' is polite, specific, and includes all the necessary information."
      },
      {
        question: "Complete: 'I'm afraid I'm busy then. ______ work instead?'",
        options: ["Is Wednesday", "Would Wednesday", "Wednesday", "Does Wednesday"],
        correctAnswer: 1,
        explanation: "'Would Wednesday work instead?' is the polite way to suggest an alternative day."
      },
      {
        question: "Which preposition is correct? 'The meeting is ______ Monday.'",
        options: ["in", "on", "at", "by"],
        correctAnswer: 1,
        explanation: "Use 'on' with days of the week: on Monday, on Tuesday, etc."
      },
      {
        question: "What does 'reschedule' mean?",
        options: [
          "To cancel completely",
          "To change to a different time",
          "To arrive early",
          "To confirm the time"
        ],
        correctAnswer: 1,
        explanation: "'Reschedule' means to move an appointment to a different time or date, not to cancel it."
      },
      {
        question: "How do you confirm an appointment politely?",
        options: [
          "We meet at 2, right?",
          "Just to confirm, we're meeting at 2 PM on Friday?",
          "Tell me again when we meet.",
          "So, 2 o'clock. Don't forget."
        ],
        correctAnswer: 1,
        explanation: "'Just to confirm...' is a polite way to check the details of an appointment without sounding doubtful."
      }
    ]
  },

  "Shopping and Negotiating Prices": {
    explanation: `<h2>Shopping and Negotiating Prices</h2>
<p>Shopping in English requires knowing how to ask about products, discuss sizes and colours, handle payments, and in some cases, negotiate prices. When you enter a shop, the assistant may ask <em>"Can I help you?"</em> or <em>"Are you looking for anything in particular?"</em> If you're just browsing, say <em>"I'm just looking, thank you."</em> If you need help, say <em>"Yes, I'm looking for a ______"</em> or <em>"Could you show me the ______?"</em></p>

<p>When asking about products, use phrases like <em>"How much is this?"</em>, <em>"Is this on sale?"</em>, <em>"Do you have this in a smaller/larger size?"</em>, and <em>"Can I try this on?"</em> At the checkout, you can say <em>"I'll take this, please"</em> and ask <em>"Do you take credit cards?"</em> or <em>"Can I pay by card?"</em> Understanding price expressions is important: £12.99 is read as <em>"twelve pounds ninety-nine"</em> and $45.00 is <em>"forty-five dollars"</em>.</p>

<p>In markets and some shops, bargaining is common. Use polite phrases like <em>"Can you give me a better price?"</em>, <em>"That's a bit expensive. Can you do it for ______?"</em>, or <em>"Is that your best price?"</em> A useful strategy is offering to buy more: <em>"I'll buy two if you give me a discount."</em> However, remember that bargaining is not appropriate in all shops — it is generally acceptable in markets and small independent shops, but not in large chain stores or supermarkets.</p>`,
    examples: [
      {
        sentence: "I'm just looking, thank you.",
        note: "Polite response when browsing — tells the assistant you don't need help yet."
      },
      {
        sentence: "Do you have this in a larger size?",
        note: "Asking about sizes — a very common question when clothes shopping."
      },
      {
        sentence: "How much is this jacket?",
        note: "Asking about price — the most basic and essential shopping question."
      },
      {
        sentence: "Can I pay by card?",
        note: "Payment question — important to ask before you reach the checkout."
      },
      {
        sentence: "Is that your best price?",
        note: "Bargaining phrase — politely asks if there's room for a discount."
      }
    ],
    commonMistakes: [
      {
        mistake: "How many is this?",
        correction: "How much is this? (Use 'how much' for price, not 'how many'.)"
      },
      {
        mistake: "I want pay by card.",
        correction: "Can I pay by card? (Use a polite question form, not a demand.)"
      },
      {
        mistake: "You have this in blue?",
        correction: "Do you have this in blue? (Always form proper questions with 'Do you have'.)"
      },
      {
        mistake: "Twelve pounds ninety-nine pence.",
        correction: "Twelve pounds ninety-nine. (Don't add 'pence' after the pennies figure.)"
      }
    ],
    quiz: [
      {
        question: "What do you say when a shop assistant asks if you need help, but you're just browsing?",
        options: [
          "No.",
          "I don't need you.",
          "I'm just looking, thank you.",
          "Go away."
        ],
        correctAnswer: 2,
        explanation: "'I'm just looking, thank you' is polite and tells the assistant you're browsing without being rude."
      },
      {
        question: "How do you read the price £24.50?",
        options: [
          "Twenty-four fifty pounds",
          "Twenty-four pounds fifty",
          "Twenty-four and fifty pounds",
          "Pounds twenty-four fifty"
        ],
        correctAnswer: 1,
        explanation: "In English, read the pounds first, then 'pounds', then the pence: 'twenty-four pounds fifty'."
      },
      {
        question: "Which phrase is used for bargaining in a market?",
        options: [
          "I want it cheaper.",
          "Give me a discount now.",
          "Can you give me a better price?",
          "Too much money."
        ],
        correctAnswer: 2,
        explanation: "'Can you give me a better price?' is a polite and natural way to ask for a discount when bargaining."
      },
      {
        question: "Complete: 'Can I ______ this on?' (trying clothes)",
        options: ["wear", "try", "put", "take"],
        correctAnswer: 1,
        explanation: "'Can I try this on?' is the standard phrase for asking to test clothes before buying."
      },
      {
        question: "What should you ask before paying in a small shop?",
        options: [
          "How much?",
          "Do you take credit cards?",
          "Money?",
          "Pay now?"
        ],
        correctAnswer: 1,
        explanation: "'Do you take credit cards?' is important to ask because some small shops only accept cash."
      }
    ]
  },

  "Describing People and Places": {
    explanation: `<h2>Describing People and Places</h2>
<p>Describing people and places requires a good range of adjectives and correct sentence structure. When describing physical appearance, use two main patterns: <strong>"He/She is + adjective"</strong> for general descriptions (<em>"She is tall and slim"</em>) and <strong>"He/She has + noun"</strong> for specific features (<em>"He has dark hair and brown eyes"</em>). Be careful with the verb choice: we say <em>"She is tall"</em> (not "She has tall") and <em>"She has blue eyes"</em> (not "She is blue eyes").</p>

<p>For personality, use adjectives that describe character traits. Positive traits include: <em>friendly, kind, funny, honest, hard-working, patient, generous, calm, creative, confident, polite,</em> and <em>helpful</em>. Negative traits include: <em>rude, lazy, impatient, mean, dishonest, shy, arrogant, nervous, boring,</em> and <em>selfish</em>. You can soften descriptions with adverbs: <em>"My brother is very funny"</em> or <em>"My boss can be impatient sometimes"</em>.</p>

<p>When describing places, use adjectives for size (<em>big, small, spacious, tiny</em>), appearance (<em>beautiful, modern, old, clean, colourful</em>), and atmosphere (<em>busy, quiet, lively, peaceful, dangerous, safe</em>). You can also describe location: <em>"It's a beautiful, quiet village in the mountains"</em> or <em>"The city centre is always busy and crowded"</em>. Use <em>"There is/are"</em> to describe what a place has: <em>"There are lots of nice cafés near my flat."</em></p>`,
    examples: [
      {
        sentence: "She is tall with curly brown hair and green eyes.",
        note: "Combining 'is + adjective' and 'with + features' to give a complete physical description."
      },
      {
        sentence: "He has a beard and wears glasses.",
        note: "Using 'has' for features — beard and glasses are possessions/features, not adjectives."
      },
      {
        sentence: "My best friend is very funny and always makes me laugh.",
        note: "Describing personality — 'funny' is a positive trait, and giving an example makes it more vivid."
      },
      {
        sentence: "It's a beautiful, peaceful village near the coast.",
        note: "Describing a place — combining appearance, atmosphere, and location adjectives."
      },
      {
        sentence: "The city centre is always busy and crowded on weekends.",
        note: "Describing a place's atmosphere — 'busy and crowded' paint a clear picture."
      }
    ],
    commonMistakes: [
      {
        mistake: "She has tall and slim.",
        correction: "She is tall and slim. (Use 'is' for adjectives, not 'has'.)"
      },
      {
        mistake: "He is dark hair.",
        correction: "He has dark hair. (Use 'has' for features like hair, eyes, beard.)"
      },
      {
        mistake: "She is a shy person. She has shy.",
        correction: "She is shy. (Don't repeat 'shy' — just use the adjective after 'is'.)"
      },
      {
        mistake: "The place is very beauty.",
        correction: "The place is very beautiful. ('Beautiful' is the adjective; 'beauty' is a noun.)"
      }
    ],
    quiz: [
      {
        question: "Which sentence correctly describes someone's physical appearance?",
        options: [
          "She has tall and slim.",
          "She is tall and slim.",
          "She is tall and has slim.",
          "She has tall and is slim."
        ],
        correctAnswer: 1,
        explanation: "Use 'is' for adjective descriptions like 'tall' and 'slim'. 'Has' is for features like hair and eyes."
      },
      {
        question: "Complete: 'He ______ brown eyes and short hair.'",
        options: ["is", "has", "have", "does"],
        correctAnswer: 1,
        explanation: "Use 'has' for physical features like eyes, hair, and beard. 'He has' (not 'he have')."
      },
      {
        question: "Which word describes a positive personality trait?",
        options: ["arrogant", "lazy", "generous", "rude"],
        correctAnswer: 2,
        explanation: "'Generous' means willing to give and share — it is a positive trait. The others are negative."
      },
      {
        question: "How do you describe a place that is full of people and activity?",
        options: ["peaceful", "crowded", "tiny", "ancient"],
        correctAnswer: 1,
        explanation: "'Crowded' means full of people. A place that is full of activity and people is 'busy and crowded'."
      },
      {
        question: "Which sentence describes a place's atmosphere?",
        options: [
          "The house is very old.",
          "The café is cosy and relaxing.",
          "The park is near the river.",
          "The hotel has 50 rooms."
        ],
        correctAnswer: 1,
        explanation: "'Cosy and relaxing' describe the atmosphere — how a place feels. 'Old' is appearance, 'near the river' is location, and '50 rooms' is a fact."
      }
    ]
  },

  "Talking About the Weather and Seasons": {
    explanation: `<h2>Talking About the Weather and Seasons</h2>
<p>Weather is one of the most common small talk topics in English-speaking cultures, especially in Britain. To describe temperature, use words like <em>hot, cold, warm,</em> and <em>cool</em>. For extreme temperatures, say <em>"It's boiling!"</em> (very hot) or <em>"It's freezing!"</em> (very cold). You can also use numbers: <em>"It's 25 degrees"</em> or <em>"It's minus 5"</em> (-5°C).</p>

<p>For weather conditions, use <em>"It's + adjective"</em> or <em>"It's + verb-ing"</em>: <em>"It's sunny"</em>, <em>"It's raining"</em>, <em>"It's cloudy"</em>, <em>"It's snowing"</em>, <em>"It's windy"</em>, <em>"It's foggy"</em>. For heavy rain, say <em>"It's pouring!"</em> and for light rain, say <em>"It's drizzling."</em> A completely grey sky is <em>"overcast"</em>. Weather small talk phrases include: <em>"Nice weather, isn't it?"</em>, <em>"Terrible weather today!"</em>, and <em>"It's supposed to rain later."</em></p>

<p>The four seasons each have their own characteristics. <strong>Spring</strong> (March-May): flowers bloom, temperatures rise, sometimes rainy. <strong>Summer</strong> (June-August): hot, sunny, holidays, beaches. <strong>Autumn/Fall</strong> (September-November): leaves fall, temperatures drop, windy. <strong>Winter</strong> (December-February): cold, snow in some places, dark evenings. Each season also has typical activities: walking and planting in spring, swimming and barbecues in summer, drinking hot chocolate in autumn, and skiing in winter.</p>`,
    examples: [
      {
        sentence: "It's pouring outside! You'll need an umbrella.",
        note: "'Pouring' means very heavy rain — stronger than just 'raining'."
      },
      {
        sentence: "Nice weather, isn't it?",
        note: "Classic British small talk — a friendly way to start a conversation about the weather."
      },
      {
        sentence: "It's supposed to rain later this afternoon.",
        note: "'Supposed to' means the forecast predicts it — very common weather expression."
      },
      {
        sentence: "In winter, it gets dark very early here.",
        note: "Describing a seasonal characteristic — short days are typical of winter."
      },
      {
        sentence: "It's a bit chilly today. You might want a jacket.",
        note: "'Chilly' means slightly cold — a softer way to say it's cold."
      }
    ],
    commonMistakes: [
      {
        mistake: "It has rain today.",
        correction: "It's raining today. / It's rainy today. (Use 'It's + verb-ing' or 'It's + adjective'.)"
      },
      {
        mistake: "The weather is rain.",
        correction: "The weather is rainy. / It's raining. (Don't use a noun after 'is' for weather.)"
      },
      {
        mistake: "It's very sun today.",
        correction: "It's very sunny today. ('Sunny' is the adjective; 'sun' is a noun.)"
      },
      {
        mistake: "In the summer, we go to beach.",
        correction: "In the summer, we go to the beach. (Don't forget the article 'the'.)"
      }
    ],
    quiz: [
      {
        question: "What does 'It's pouring' mean?",
        options: [
          "It's very sunny.",
          "It's raining very heavily.",
          "It's very windy.",
          "It's snowing lightly."
        ],
        correctAnswer: 1,
        explanation: "'Pouring' means it is raining very heavily — much stronger than just 'raining'."
      },
      {
        question: "Which word means 'slightly cold'?",
        options: ["boiling", "freezing", "chilly", "scorching"],
        correctAnswer: 2,
        explanation: "'Chilly' means slightly cold. 'Freezing' means very cold, and 'boiling/scorching' mean very hot."
      },
      {
        question: "Complete: 'It's ______ outside. The sky is completely grey.'",
        options: ["sunny", "overcast", "windy", "warm"],
        correctAnswer: 1,
        explanation: "'Overcast' means the sky is completely covered with grey clouds."
      },
      {
        question: "What is a common small talk phrase about weather?",
        options: [
          "What is the meteorological condition?",
          "Nice weather, isn't it?",
          "Tell me the temperature.",
          "How much rain fell?"
        ],
        correctAnswer: 1,
        explanation: "'Nice weather, isn't it?' is the classic English small talk opener about the weather."
      },
      {
        question: "In which season do leaves fall from the trees?",
        options: ["Spring", "Summer", "Autumn/Fall", "Winter"],
        correctAnswer: 2,
        explanation: "In Autumn/Fall, leaves change colour and fall from the trees. The season is called 'Fall' in American English precisely because leaves fall."
      }
    ]
  },

  "Expressing Likes, Dislikes, and Preferences": {
    explanation: `<h2>Expressing Likes, Dislikes, and Preferences</h2>
<p>English offers many ways to express your opinions about things you enjoy or dislike, ranging from weak to strong expressions. For likes, you can say: <em>"I like ______"</em> (general positive), <em>"I really like ______"</em> (stronger), <em>"I love ______"</em> or <em>"I'm really into ______"</em> (strong and enthusiastic), and <em>"I'm a big fan of ______"</em> (informal). The pattern <em>"I enjoy + verb-ing"</em> is used for activities: <em>"I enjoy cooking"</em> or <em>"I enjoy watching films"</em>.</p>

<p>For dislikes, the expressions go from soft to strong: <em>"I don't really like ______"</em> (soft), <em>"I dislike ______"</em> (formal), <em>"I hate ______"</em> or <em>"I can't stand ______"</em> (very strong). A polite British way to express dislike is <em>"I'm not keen on + noun/verb-ing"</em>, and a gentle informal way is <em>"______ is not really my thing."</em></p>

<p>When expressing preferences between two options, use: <em>"I prefer A to B"</em> (<em>"I prefer tea to coffee"</em>), <em>"I'd rather + verb + than + verb"</em> (<em>"I'd rather walk than drive"</em>), and <em>"I prefer verb-ing to verb-ing"</em> (<em>"I prefer swimming to running"</em>). When agreeing with someone's opinion, say <em>"Me too!"</em>, <em>"So do I!"</em>, or <em>"Exactly!"</em>. When disagreeing politely, say <em>"Really? I prefer ______"</em> or <em>"I see it differently."</em></p>`,
    examples: [
      {
        sentence: "I'm really into jazz music lately.",
        note: "Informal strong like — 'really into' shows enthusiasm and current interest."
      },
      {
        sentence: "I can't stand waking up early.",
        note: "Strong dislike — 'can't stand' is a very emphatic way to express dislike."
      },
      {
        sentence: "I prefer tea to coffee in the morning.",
        note: "Expressing a preference — 'prefer X to Y' compares two things directly."
      },
      {
        sentence: "I'd rather stay in tonight than go out.",
        note: "Preference with verbs — 'I'd rather + verb + than + verb' compares two actions."
      },
      {
        sentence: "Horror films aren't really my thing.",
        note: "Gentle dislike — a polite, indirect way to say you don't like something."
      }
    ],
    commonMistakes: [
      {
        mistake: "I enjoy to swim in the morning.",
        correction: "I enjoy swimming in the morning. ('Enjoy' is followed by verb-ing, not 'to + verb'.)"
      },
      {
        mistake: "I prefer cats than dogs.",
        correction: "I prefer cats to dogs. ('Prefer' uses 'to', not 'than', for comparisons.)"
      },
      {
        mistake: "I rather stay home tonight.",
        correction: "I'd rather stay home tonight. ('Rather' needs 'I'd' = 'I would' before it.)"
      },
      {
        mistake: "I am not keen in early mornings.",
        correction: "I am not keen on early mornings. ('Keen on' is the correct preposition.)"
      }
    ],
    quiz: [
      {
        question: "Which sentence correctly uses 'enjoy'?",
        options: [
          "I enjoy to read books.",
          "I enjoy reading books.",
          "I enjoy read books.",
          "I enjoy reads books."
        ],
        correctAnswer: 1,
        explanation: "'Enjoy' is always followed by verb-ing: 'enjoy reading', not 'enjoy to read'."
      },
      {
        question: "Complete: 'I prefer tea ______ coffee.'",
        options: ["than", "to", "over", "from"],
        correctAnswer: 1,
        explanation: "'Prefer X to Y' is the correct pattern for comparing two things. Don't use 'than'."
      },
      {
        question: "What does 'I can't stand spicy food' mean?",
        options: [
          "I really love spicy food.",
          "I strongly dislike spicy food.",
          "I can eat a little spicy food.",
          "I sometimes enjoy spicy food."
        ],
        correctAnswer: 1,
        explanation: "'Can't stand' is a strong expression meaning you really dislike something."
      },
      {
        question: "Complete: 'I'd ______ walk than take the bus.'",
        options: ["prefer", "rather", "like", "enjoy"],
        correctAnswer: 1,
        explanation: "'I'd rather + verb + than + verb' is the pattern for expressing preference between two actions."
      },
      {
        question: "Which phrase is a polite, gentle way to say you dislike something?",
        options: [
          "I hate it.",
          "It's terrible.",
          "It's not really my thing.",
          "I can't stand it."
        ],
        correctAnswer: 2,
        explanation: "'Not really my thing' is a soft, polite way to express dislike without being harsh."
      }
    ]
  },

  "Making Suggestions and Plans with Friends": {
    explanation: `<h2>Making Suggestions and Plans with Friends</h2>
<p>When making suggestions with friends, English has several natural structures. The most common are: <em>"Let's + verb"</em> (<em>"Let's go to the cinema!"</em>), <em>"How about + verb-ing?"</em> (<em>"How about going for a walk?"</em>), <em>"What about + noun/verb-ing?"</em> (<em>"What about pizza for dinner?"</em>), <em>"Shall we + verb?"</em> (<em>"Shall we meet at the station?"</em> — British and polite), <em>"Why don't we + verb?"</em> (<em>"Why don't we try that new restaurant?"</em>), and <em>"Do you fancy + verb-ing?"</em> (<em>"Do you fancy going out tonight?"</em> — British, informal).</p>

<p>When accepting suggestions, respond with enthusiasm: <em>"Yes, great idea!"</em>, <em>"Sounds good!"</em>, <em>"That sounds like fun!"</em>, <em>"Sure, why not?"</em>, or <em>"I'd love to!"</em> You can also accept and ask for details: <em>"Good idea. What time?"</em> When declining politely, never just say <em>"No"</em> — instead say <em>"I'd love to, but I can't. I have to ______"</em>, <em>"That sounds nice, but I'm busy on ______"</em>, or <em>"Maybe another time?"</em> which is a soft rejection that leaves the door open.</p>

<p>When making detailed plans, use phrases like <em>"When are you free?"</em>, <em>"What time suits you?"</em>, <em>"Where shall we meet?"</em>, and <em>"Should we book tickets in advance?"</em> To confirm plans enthusiastically, say <em>"See you there!"</em>, <em>"Can't wait!"</em>, or <em>"Looking forward to it!"</em> The key to natural social English is variety — don't just say <em>"Let's..."</em> every time. Mix your suggestion structures to sound more fluent.</p>`,
    examples: [
      {
        sentence: "How about going to the cinema this weekend?",
        note: "Suggestion with 'How about + verb-ing' — friendly and open-ended."
      },
      {
        sentence: "Shall we meet at the station at 6?",
        note: "'Shall we' is a polite suggestion form — common in British English."
      },
      {
        sentence: "I'd love to, but I'm busy on Saturday. How about Sunday?",
        note: "Declining politely + suggesting an alternative — keeps the conversation positive."
      },
      {
        sentence: "Sounds good! What time works for you?",
        note: "Accepting enthusiastically + asking for details to confirm the plan."
      },
      {
        sentence: "Why don't we try that new Italian restaurant?",
        note: "Making a specific suggestion — 'Why don't we' invites discussion rather than commanding."
      }
    ],
    commonMistakes: [
      {
        mistake: "How about to go to the cinema?",
        correction: "How about going to the cinema? ('How about' is followed by verb-ing, not 'to + verb'.)"
      },
      {
        mistake: "Let's going to the park.",
        correction: "Let's go to the park. ('Let's' is followed by the base form of the verb, not verb-ing.)"
      },
      {
        mistake: "I'd love to, but I can't. I must to work.",
        correction: "I'd love to, but I can't. I have to work. (Use 'have to', not 'must to'.)"
      },
      {
        mistake: "Do you fancy go out tonight?",
        correction: "Do you fancy going out tonight? ('Fancy' is followed by verb-ing.)"
      }
    ],
    quiz: [
      {
        question: "Which suggestion is grammatically correct?",
        options: [
          "How about to go for a walk?",
          "How about going for a walk?",
          "How about go for a walk?",
          "How about goes for a walk?"
        ],
        correctAnswer: 1,
        explanation: "'How about' is always followed by verb-ing: 'How about going?'"
      },
      {
        question: "Complete: '______ we meet at the café at 3?' (British, polite)",
        options: ["Do", "Will", "Shall", "Are"],
        correctAnswer: 2,
        explanation: "'Shall we...?' is a polite way to make suggestions, especially common in British English."
      },
      {
        question: "How do you decline a suggestion politely?",
        options: [
          "No.",
          "I don't want to.",
          "I'd love to, but I'm busy. Maybe another time?",
          "That's a bad idea."
        ],
        correctAnswer: 2,
        explanation: "Start with appreciation ('I'd love to'), give a reason ('but I'm busy'), and offer an alternative ('Maybe another time?')."
      },
      {
        question: "Complete: 'Let's ______ to the park.'",
        options: ["going", "goes", "go", "to go"],
        correctAnswer: 2,
        explanation: "'Let's' is always followed by the base form of the verb: 'Let's go', not 'Let's going'."
      },
      {
        question: "What does 'Do you fancy going out tonight?' mean?",
        options: [
          "Do you think going out is expensive?",
          "Would you like to go out tonight?",
          "Are you afraid of going out?",
          "Do you imagine going out?"
        ],
        correctAnswer: 1,
        explanation: "'Do you fancy + verb-ing?' is an informal British way of asking 'Would you like to...?'"
      }
    ]
  },

  "Travel and Transportation Essentials": {
    explanation: `<h2>Travel and Transportation Essentials</h2>
<p>Travelling in English-speaking countries requires knowing key phrases for airports, trains, buses, and taxis. At the airport, you need to know: <em>"Where is the check-in desk for [airline]?"</em>, <em>"I'd like to check in, please"</em>, <em>"Is this the right gate for flight BA247?"</em>, and <em>"Has the flight been delayed?"</em> Important airport vocabulary includes: departure, arrival, boarding pass, gate, terminal, delayed, cancelled, luggage, and customs.</p>

<p>When booking train or bus tickets, use: <em>"I'd like a single/return ticket to ______"</em> (UK: single/return; US: one-way/round-trip), <em>"What time does the next train to London leave?"</em>, <em>"Which platform does it go from?"</em>, and <em>"Is it a direct train, or do I need to change?"</em> On public transport, useful questions include <em>"Does this bus go to the city centre?"</em>, <em>"How many stops until ______?"</em>, and <em>"Is this seat taken?"</em></p>

<p>For taxis, essential phrases are: <em>"Could you take me to ______, please?"</em>, <em>"How much will it cost approximately?"</em>, <em>"Could you put the meter on?"</em>, and <em>"Keep the change"</em> (telling the driver to keep the remaining money as a tip). When travelling, it is always useful to know how to ask for help: <em>"Could you tell me when we get to ______?"</em> and <em>"Excuse me, where are the taxis?"</em> are practical phrases that can save you in unfamiliar places.</p>`,
    examples: [
      {
        sentence: "I'd like a return ticket to Edinburgh, please.",
        note: "Buying a train ticket — 'return' means a ticket for both going and coming back (UK English)."
      },
      {
        sentence: "Which platform does the train to Manchester leave from?",
        note: "Asking about the platform — essential information at any train station."
      },
      {
        sentence: "Is it a direct train, or do I need to change?",
        note: "'Direct' means no changes needed; 'change' means switching to another train."
      },
      {
        sentence: "Could you take me to the city centre, please?",
        note: "Taxi phrase — always polite and clear about your destination."
      },
      {
        sentence: "Keep the change.",
        note: "Telling the taxi driver to keep the extra money as a tip — a common courtesy."
      }
    ],
    commonMistakes: [
      {
        mistake: "I want one ticket to London going and returning.",
        correction: "I'd like a return ticket to London, please. (Use 'return ticket' for round-trip in UK English.)"
      },
      {
        mistake: "What platform the train leaves from?",
        correction: "Which platform does the train leave from? (Form a proper question with 'does'.)"
      },
      {
        mistake: "Take me to city centre.",
        correction: "Could you take me to the city centre, please? (Always use polite request forms with taxi drivers.)"
      },
      {
        mistake: "Is this seat take?",
        correction: "Is this seat taken? ('Taken' is the correct past participle, not 'take'.)"
      }
    ],
    quiz: [
      {
        question: "What is the American English word for a 'return ticket'?",
        options: [
          "Double ticket",
          "Round-trip ticket",
          "Come-back ticket",
          "Two-way ticket"
        ],
        correctAnswer: 1,
        explanation: "In American English, a 'return ticket' is called a 'round-trip ticket'. A single ticket is a 'one-way ticket'."
      },
      {
        question: "Complete: 'Has the flight been ______?' (it will leave late)",
        options: ["deleted", "delayed", "departed", "declined"],
        correctAnswer: 1,
        explanation: "'Delayed' means the flight will leave later than scheduled. 'Cancelled' would mean it won't leave at all."
      },
      {
        question: "What does 'Is it a direct train?' mean?",
        options: [
          "Is the train fast?",
          "Does the train go straight to the destination without changing?",
          "Is the train expensive?",
          "Is the train on time?"
        ],
        correctAnswer: 1,
        explanation: "A 'direct train' goes straight to your destination without requiring you to change to another train."
      },
      {
        question: "What does 'Keep the change' mean to a taxi driver?",
        options: [
          "Drive carefully.",
          "Return my money later.",
          "Keep the extra money as a tip.",
          "Wait here while I go inside."
        ],
        correctAnswer: 2,
        explanation: "'Keep the change' means the driver can keep the extra money as a tip — you don't need exact change back."
      },
      {
        question: "Complete: 'Could you tell me when we ______ to Oxford?'",
        options: ["arrive", "get", "reach", "come"],
        correctAnswer: 1,
        explanation: "'Get to' is the natural phrase for arriving at a destination: 'when we get to Oxford'."
      }
    ]
  },

  "Handling Problems and Emergencies": {
    explanation: `<h2>Handling Problems and Emergencies</h2>
<p>In difficult situations, it is crucial to communicate clearly and calmly in English. To report a problem politely but firmly, use phrases like <em>"Excuse me, there's a problem with my ______"</em>, <em>"I'm sorry, but ______ doesn't seem to be working"</em>, <em>"There's something wrong with the ______"</em>, or <em>"I think there's been a mistake with my ______"</em>. For formal complaints, say <em>"I'd like to make a complaint, please."</em></p>

<p>If you lose something, say <em>"I've lost my ______"</em> (passport, phone, wallet, keys). To ask if it has been found, say <em>"Has anyone handed in a ______?"</em> The lost property office is called <em>"lost property"</em> in British English and <em>"lost and found"</em> in American English. If something was stolen, report it: <em>"My ______ was stolen"</em> or <em>"I'd like to report a theft."</em> In medical situations, say <em>"I need a doctor"</em>, <em>"Where is the nearest hospital?"</em>, or <em>"I don't feel well / I feel sick / I feel dizzy."</em></p>

<p>For emergencies, know the emergency numbers: <strong>999</strong> (UK), <strong>911</strong> (US), <strong>112</strong> (Europe — works everywhere). Say <em>"It's an emergency!"</em>, <em>"There's been an accident"</em>, or <em>"Someone is injured."</em> When asking for help politely in non-emergency situations, use <em>"Excuse me, could you help me, please?"</em> or <em>"I'm sorry to bother you, but could you ______?"</em> Being polite but clear is the key to getting help quickly.</p>`,
    examples: [
      {
        sentence: "Excuse me, there's a problem with my room — there's no hot water.",
        note: "Reporting a hotel problem — polite but clear, with specific details about the issue."
      },
      {
        sentence: "I've lost my passport. Where is the nearest embassy?",
        note: "Lost item + asking for help — essential when travelling abroad."
      },
      {
        sentence: "I need to see a doctor. I feel very dizzy.",
        note: "Medical situation — stating your need and describing your symptoms clearly."
      },
      {
        sentence: "I'd like to report a theft. Someone stole my bag.",
        note: "Reporting a crime — clear and factual statement to the police."
      },
      {
        sentence: "Excuse me! Could someone call an ambulance, please? It's an emergency!",
        note: "Emergency situation — urgent but still using 'please' to get help quickly."
      }
    ],
    commonMistakes: [
      {
        mistake: "My bag stolen!",
        correction: "My bag was stolen. / Someone stole my bag. (Use a complete sentence with subject and verb.)"
      },
      {
        mistake: "I am not feeling good. Need doctor.",
        correction: "I don't feel well. I need to see a doctor. (Use complete, clear sentences in emergencies.)"
      },
      {
        mistake: "There is problem with my room.",
        correction: "There's a problem with my room. (Use 'a' before 'problem'.)"
      },
      {
        mistake: "Where is lost things?",
        correction: "Where is the lost property office? / Where is lost and found? (Use the correct term for the office.)"
      }
    ],
    quiz: [
      {
        question: "Which is the most polite way to report a problem at a hotel?",
        options: [
          "My room is bad. Fix it.",
          "Excuse me, there's a problem with my room.",
          "I hate this room.",
          "Room problem!"
        ],
        correctAnswer: 1,
        explanation: "'Excuse me, there's a problem with...' is polite but clear. Starting with 'excuse me' and using a complete sentence gets the best response."
      },
      {
        question: "What is the British English term for the office where lost items are kept?",
        options: [
          "Lost and found",
          "Lost property office",
          "Missing items centre",
          "Found things room"
        ],
        correctAnswer: 1,
        explanation: "In British English, it's called the 'lost property office'. 'Lost and found' is American English."
      },
      {
        question: "What emergency number works across all of Europe?",
        options: ["999", "911", "112", "111"],
        correctAnswer: 2,
        explanation: "112 is the European emergency number that works in all EU countries. 999 is UK, 911 is US."
      },
      {
        question: "Complete: 'I'd like to ______ a theft.'",
        options: ["say", "report", "tell", "speak"],
        correctAnswer: 1,
        explanation: "'Report a theft' is the correct phrase when telling the police about a crime."
      },
      {
        question: "Which sentence describes a medical emergency clearly?",
        options: [
          "I feel funny.",
          "Something is wrong.",
          "I need a doctor immediately. I'm having difficulty breathing.",
          "I don't feel good today."
        ],
        correctAnswer: 2,
        explanation: "Being specific about your need ('I need a doctor immediately') and your symptoms ('difficulty breathing') gets the fastest help."
      }
    ]
  }
};
