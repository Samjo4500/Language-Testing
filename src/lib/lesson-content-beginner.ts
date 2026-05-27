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
  }
};
