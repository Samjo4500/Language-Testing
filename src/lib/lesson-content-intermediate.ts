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

export const INTERMEDIATE_LESSON_CONTENT: Record<string, LessonStructuredContent> = {
  "Present Perfect Continuous": {
    explanation: `<h2>Understanding the Present Perfect Continuous</h2>
<p>The Present Perfect Continuous tense is formed using <strong>have/has been + verb-ing</strong>. It is used to describe actions that started in the past and are <em>still continuing</em> at the time of speaking, or actions that have recently stopped but whose results are still visible or relevant. For example, if you say "I have been working all morning," it means you started working in the past and you are either still working now or you have just finished, and the effect of that work is obvious. This tense emphasises the <strong>duration</strong> or <strong>process</strong> of an action rather than its completion.</p>
<p>Key time expressions associated with this tense include <strong>for</strong> (used with a period of time, e.g., for three hours) and <strong>since</strong> (used with a point in time, e.g., since Monday). Other common signal words are <em>all day</em>, <em>lately</em>, <em>recently</em>, and <em>how long</em>. These expressions help listeners understand that the speaker is focusing on the ongoing nature of the activity. It is important to remember that stative verbs (such as <em>know</em>, <em>believe</em>, <em>own</em>, <em>like</em>) are generally <strong>not</strong> used in the continuous form, even when describing a state that began in the past.</p>
<p>One of the most important distinctions at the intermediate level is the difference between the Present Perfect Continuous and the Present Perfect Simple. The continuous form focuses on the <strong>activity itself</strong> and how long it has been happening, while the simple form focuses on the <strong>result</strong> or <strong>quantity</strong>. Compare: "I have been reading that book" (focus on the activity, I am still reading it) versus "I have read three chapters" (focus on the result, the number of chapters completed). Both tenses connect the past to the present, but they highlight different aspects of the same situation.</p>
<p>Another common use is to describe a repeated activity over a period of time. For instance, "She has been taking piano lessons for two years" suggests a habitual, ongoing commitment. This is different from "She has taken piano lessons," which could imply she completed them at some point. Understanding these nuances is essential for communicating precisely about time and action in English, and it is a skill that distinguishes intermediate speakers from beginners.</p>`,
    examples: [
      {
        sentence: "I have been studying English for five years.",
        note: "The action started in the past and is still continuing. 'For' is used with a duration of time."
      },
      {
        sentence: "She has been working here since 2019.",
        note: "'Since' marks the starting point of the ongoing action. The focus is on the continuous nature of the employment."
      },
      {
        sentence: "Why are your clothes dirty? — I have been cleaning the garage all day.",
        note: "The action has recently stopped, but the visible result (dirty clothes) is evident. This is a typical 'recently stopped with visible result' usage."
      },
      {
        sentence: "They have been arguing a lot lately.",
        note: "'Lately' signals a repeated behaviour over a recent period. The emphasis is on the ongoing pattern of arguing."
      },
      {
        sentence: "He has been waiting for the bus for forty minutes.",
        note: "The continuous form highlights the duration of the waiting. He is still waiting at the moment of speaking."
      },
      {
        sentence: "I have been trying to call you all morning.",
        note: "A repeated action over a period of time. The speaker attempted the call multiple times, emphasising the process rather than a single event."
      }
    ],
    commonMistakes: [
      {
        mistake: "I have been knowing him for ten years.",
        correction: "I have known him for ten years.",
      },
      {
        mistake: "She has been cooking dinner since two hours.",
        correction: "She has been cooking dinner for two hours.",
      },
      {
        mistake: "I am living here for five years.",
        correction: "I have been living here for five years.",
      },
      {
        mistake: "They have been written the report all afternoon.",
        correction: "They have been writing the report all afternoon.",
      }
    ],
    quiz: [
      {
        question: "Which sentence correctly uses the Present Perfect Continuous?",
        options: [
          "She has been learning French since she was ten.",
          "She has been learning French for she was ten.",
          "She is learning French since ten years.",
          "She was learning French for ten years."
        ],
        correctAnswer: 0,
        explanation: "'Has been learning' is the correct Present Perfect Continuous form, and 'since' is correctly used with the starting point 'she was ten.' The other options either use the wrong preposition or the wrong tense."
      },
      {
        question: "Choose the correct sentence:",
        options: [
          "I have been knowing her for a long time.",
          "I have known her for a long time.",
          "I am knowing her for a long time.",
          "I was knowing her for a long time."
        ],
        correctAnswer: 1,
        explanation: "'Know' is a stative verb and is not normally used in the continuous form. The Present Perfect Simple 'have known' is the correct choice for describing a state that began in the past and continues."
      },
      {
        question: "What is the difference between 'I have read the book' and 'I have been reading the book'?",
        options: [
          "There is no difference in meaning.",
          "The first focuses on the result (completion); the second focuses on the process (still reading).",
          "The first is about the future; the second is about the past.",
          "The first is informal; the second is formal."
        ],
        correctAnswer: 1,
        explanation: "The Present Perfect Simple ('have read') focuses on the result — the book is finished. The Present Perfect Continuous ('have been reading') focuses on the activity — you are still in the process of reading it."
      },
      {
        question: "Complete the sentence: 'They _______ in the rain all afternoon.'",
        options: [
          "have been standing",
          "have standing",
          "are standing since",
          "had been standing for"
        ],
        correctAnswer: 0,
        explanation: "'Have been standing' is the correct Present Perfect Continuous form. 'All afternoon' indicates duration, which pairs naturally with this tense. The other options either lack the auxiliary 'been' or use the wrong tense."
      },
      {
        question: "Which time expression is NOT typically used with the Present Perfect Continuous?",
        options: [
          "for three hours",
          "since last week",
          "yesterday",
          "lately"
        ],
        correctAnswer: 2,
        explanation: "'Yesterday' refers to a finished time period and is used with the Past Simple, not the Present Perfect Continuous. The Present Perfect Continuous connects the past to the present, so it cannot be used with completed time expressions like 'yesterday.'"
      }
    ]
  },

  "Comparatives and Superlatives": {
    explanation: `<h2>Mastering Comparatives and Superlatives</h2>
<p>Comparatives and superlatives are essential grammatical structures used to compare two or more things. <strong>Comparatives</strong> compare two items, while <strong>superlatives</strong> identify the extreme or top quality among three or more items. For short adjectives (one syllable), we add <em>-er</em> for comparatives and <em>-est</em> for superlatives: <strong>tall → taller → tallest</strong>. For two-syllable adjectives ending in <em>-y</em>, we change the <em>-y</em> to <em>-i</em> and add <em>-er/-est</em>: <strong>happy → happier → happiest</strong>. For longer adjectives (two or more syllables that do not end in <em>-y</em>), we use <strong>more</strong> and <strong>most</strong>: <strong>expensive → more expensive → most expensive</strong>.</p>
<p>Spelling rules are important when forming comparatives and superlatives. For one-syllable adjectives ending in a single vowel + consonant, we double the final consonant: <strong>big → bigger → biggest</strong>, <strong>hot → hotter → hottest</strong>. For adjectives ending in <em>-e</em>, we simply add <em>-r</em> or <em>-st</em>: <strong>large → larger → largest</strong>. Understanding these patterns prevents common errors such as writing 'more big' instead of 'bigger' or 'beautifuller' instead of 'more beautiful.' The word <strong>than</strong> always follows a comparative, and <strong>the</strong> always precedes a superlative.</p>
<p>Irregular comparatives and superlatives must be memorised because they do not follow any standard pattern. The most common ones are: <strong>good → better → best</strong>, <strong>bad → worse → worst</strong>, <strong>far → farther/further → farthest/furthest</strong>, <strong>little → less → least</strong>, and <strong>much/many → more → most</strong>. Note that 'farther' and 'further' can often be used interchangeably for physical distance, but 'further' is also used in abstract senses meaning 'additional' or 'more advanced,' as in 'further information' or 'further discussion.' These irregular forms appear frequently in both spoken and written English, so mastering them is crucial for intermediate learners.</p>
<p>It is also worth noting that some adjectives are considered <em>absolute</em> or <em>non-gradable</em> and should not normally be used with comparatives or superlatives — words like <em>unique</em>, <em>perfect</em>, <em>impossible</em>, and <em>absolute</em> already express an extreme degree. While you may hear expressions like 'more perfect' or 'most unique' in everyday speech, they are generally considered incorrect in formal writing. Additionally, you can use modifiers such as <strong>much</strong>, <strong>a lot</strong>, <strong>far</strong>, <strong>a bit</strong>, and <strong>slightly</strong> before comparatives to indicate the degree of difference: 'much better,' 'a bit taller,' 'far more expensive.' These modifiers add precision to your comparisons and are a hallmark of fluent, nuanced English.</p>`,
    examples: [
      {
        sentence: "Mount Everest is the highest mountain in the world.",
        note: "Superlative with 'the' + '-est' for a one-syllable adjective. 'The' is required before superlatives."
      },
      {
        sentence: "This exam was more difficult than the last one.",
        note: "Comparative with 'more' for a long adjective. 'Than' introduces the second element of the comparison."
      },
      {
        sentence: "She is the most talented musician I have ever heard.",
        note: "Superlative with 'most' for a multi-syllable adjective. The structure 'the most + adjective' is used for the extreme quality."
      },
      {
        sentence: "My car is older than yours, but it runs better.",
        note: "Regular comparative 'older' (old → older) and irregular comparative 'better' (good → better) in the same sentence."
      },
      {
        sentence: "This is the worst movie I have ever seen.",
        note: "Irregular superlative: bad → worse → worst. 'The worst' indicates the most extreme negative quality."
      },
      {
        sentence: "The weather is getting colder and colder as winter approaches.",
        note: "Double comparatives ('-er and -er') express a progressive change — something is increasing or decreasing steadily."
      }
    ],
    commonMistakes: [
      {
        mistake: "She is more tall than her brother.",
        correction: "She is taller than her brother.",
      },
      {
        mistake: "This is the most small room in the house.",
        correction: "This is the smallest room in the house.",
      },
      {
        mistake: "He is the better student in the class.",
        correction: "He is the best student in the class.",
      },
      {
        mistake: "My phone is more expensiver than yours.",
        correction: "My phone is more expensive than yours.",
      }
    ],
    quiz: [
      {
        question: "Choose the correct comparative form: 'This route is ______ than the highway.'",
        options: [
          "more shorter",
          "shorter",
          "more short",
          "shortest"
        ],
        correctAnswer: 1,
        explanation: "'Short' is a one-syllable adjective, so we add '-er' to form the comparative: 'shorter.' We never combine 'more' with an '-er' form."
      },
      {
        question: "Which sentence is correct?",
        options: [
          "She is the most happiest person I know.",
          "She is the happiest person I know.",
          "She is the most happy person I know.",
          "She is more happier than anyone."
        ],
        correctAnswer: 1,
        explanation: "'Happy' is a two-syllable adjective ending in -y, so we change -y to -i and add -est: 'happiest.' We never use 'most' with an -est form, and we never combine 'more' with an -er form."
      },
      {
        question: "What is the superlative form of 'far'?",
        options: [
          "farthest",
          "farest",
          "most far",
          "more far"
        ],
        correctAnswer: 0,
        explanation: "'Far' has the irregular forms 'farther/further' (comparative) and 'farthest/furthest' (superlative). 'Farthest' is the correct superlative form."
      },
      {
        question: "Complete the sentence: 'This problem is ______ than I expected.'",
        options: [
          "much more complicated",
          "much complicater",
          "more much complicated",
          "complicateder"
        ],
        correctAnswer: 0,
        explanation: "'Complicated' is a long adjective, so we use 'more complicated.' The modifier 'much' can come before 'more' to emphasise the degree: 'much more complicated.'"
      },
      {
        question: "Which of the following uses a double comparative incorrectly?",
        options: [
          "It's getting colder and colder.",
          "She is more prettier than her sister.",
          "The situation is becoming worse and worse.",
          "He runs faster and faster every day."
        ],
        correctAnswer: 1,
        explanation: "'More prettier' is a double comparative — we should use either 'prettier' (adding -er) or 'more pretty,' but never both together. The correct form is 'prettier.'"
      }
    ]
  },

  "First, Second, Third Conditionals": {
    explanation: `<h2>First, Second, and Third Conditionals Explained</h2>
<p>Conditional sentences express that one thing depends on another. They always have two parts: the <strong>if-clause</strong> (the condition) and the <strong>main clause</strong> (the result). The <strong>First Conditional</strong> describes real or very possible situations in the future. Its structure is: <em>If + present simple, will + base verb</em>. For example, "If it rains tomorrow, we will stay at home." This conditional is used when the speaker believes the condition is likely to happen. You can also reverse the order: "We will stay at home if it rains tomorrow." Note that when the if-clause comes second, we do not use a comma.</p>
<p>The <strong>Second Conditional</strong> describes unreal or imaginary situations in the present or future — things that are unlikely or impossible. Its structure is: <em>If + past simple, would + base verb</em>. For example, "If I won the lottery, I would travel the world." This does not mean the speaker has won or is likely to win; it is a hypothetical scenario. An important exception is the verb 'to be,' where we use <strong>were</strong> for all subjects in formal English: "If I were rich, I would buy a castle" (not 'If I was rich'). This is sometimes called the 'subjunctive were.' While 'was' is increasingly common in informal speech, 'were' remains the preferred form in writing and exams.</p>
<p>The <strong>Third Conditional</strong> talks about unreal situations in the past — things that did <em>not</em> happen, and their imagined results. Its structure is: <em>If + past perfect, would have + past participle</em>. For example, "If she had studied harder, she would have passed the exam." This means she did not study hard enough, and she did not pass. The Third Conditional is often used to express regret, criticism, or reflection about past events. It is the most complex of the three because it requires understanding that we are talking about a completely hypothetical past with an impossible result.</p>
<p>The key to mastering these conditionals is recognising the relationship between the <strong>time</strong> and <strong>reality</strong> of each situation. The First Conditional deals with <em>real future possibilities</em>, the Second with <em>unreal present/future</em>, and the Third with <em>unreal past</em>. Confusion often arises when learners use 'would' in the if-clause (e.g., "If I would have money..."), which is incorrect in standard English. Another common error is mixing tenses within a single conditional, such as using the past simple in the if-clause with 'will' in the main clause. Consistency in the tense structure of each conditional type is essential for clear, grammatically correct communication.</p>`,
    examples: [
      {
        sentence: "If you call me, I will come immediately.",
        note: "First Conditional: a real future possibility. Present simple in the if-clause, will + base verb in the main clause."
      },
      {
        sentence: "If I had more free time, I would learn to play the guitar.",
        note: "Second Conditional: an unreal present/future situation. Past simple in the if-clause, would + base verb in the main clause."
      },
      {
        sentence: "If they had left earlier, they would have caught the train.",
        note: "Third Conditional: an unreal past situation. Past perfect in the if-clause, would have + past participle in the main clause."
      },
      {
        sentence: "If I were the manager, I would give everyone a bonus.",
        note: "Second Conditional using 'were' (subjunctive) instead of 'was' for all subjects. This is the preferred form in formal English."
      },
      {
        sentence: "If you heat water to 100 degrees, it boils.",
        note: "Zero Conditional (for reference): used for general truths and scientific facts. Both clauses use present simple."
      },
      {
        sentence: "If she hadn't forgotten her passport, she would have boarded the plane.",
        note: "Third Conditional expressing regret about a past event. The negative form 'hadn't forgotten' and 'wouldn't have boarded' are common in spoken English."
      }
    ],
    commonMistakes: [
      {
        mistake: "If I will have time, I will help you.",
        correction: "If I have time, I will help you.",
      },
      {
        mistake: "If I would be rich, I would buy a yacht.",
        correction: "If I were rich, I would buy a yacht.",
      },
      {
        mistake: "If she had worked harder, she would pass the exam.",
        correction: "If she had worked harder, she would have passed the exam.",
      },
      {
        mistake: "If I was you, I will accept the offer.",
        correction: "If I were you, I would accept the offer.",
      }
    ],
    quiz: [
      {
        question: "Which sentence is a correct First Conditional?",
        options: [
          "If she will call, I tell her.",
          "If she calls, I will tell her the news.",
          "If she called, I will tell her the news.",
          "If she would call, I tell her."
        ],
        correctAnswer: 1,
        explanation: "The First Conditional uses 'if + present simple, will + base verb.' Only option B follows this pattern correctly."
      },
      {
        question: "Complete the Second Conditional: 'If I ______ you, I ______ that job.'",
        options: [
          "am / will take",
          "were / would take",
          "was / will take",
          "would be / took"
        ],
        correctAnswer: 1,
        explanation: "The Second Conditional uses 'if + past simple (were for all subjects), would + base verb.' 'If I were you, I would take that job' is the correct and most natural form."
      },
      {
        question: "What does the Third Conditional express?",
        options: [
          "A real future possibility",
          "An unreal present situation",
          "An unreal past situation and its imagined result",
          "A general truth or scientific fact"
        ],
        correctAnswer: 2,
        explanation: "The Third Conditional (If + past perfect, would have + past participle) describes unreal past situations — things that did not happen — and their imagined results."
      },
      {
        question: "Choose the correct sentence:",
        options: [
          "If he had studied, he would pass the test.",
          "If he studied, he would have passed the test.",
          "If he had studied, he would have passed the test.",
          "If he has studied, he would pass the test."
        ],
        correctAnswer: 2,
        explanation: "The Third Conditional requires 'if + past perfect' in the if-clause and 'would have + past participle' in the main clause. Only option C uses both correctly."
      },
      {
        question: "Which conditional is used for a situation the speaker considers possible or likely?",
        options: [
          "Zero Conditional",
          "First Conditional",
          "Second Conditional",
          "Third Conditional"
        ],
        correctAnswer: 1,
        explanation: "The First Conditional (if + present simple, will + base verb) is used for real or very possible future situations. The Second and Third Conditionals deal with unreal or imaginary situations."
      }
    ]
  },

  "Mixed Conditionals": {
    explanation: `<h2>Understanding Mixed Conditionals</h2>
<p>Mixed Conditionals combine elements from different conditional types to express complex relationships between past conditions and present results, or present conditions and past results. They are used when the time reference in the if-clause and the main clause are <strong>different</strong>. There are two main patterns. The first and more common pattern is: <em>If + past perfect, would + base verb</em>. This describes an <strong>unreal past condition</strong> with an <strong>unreal present result</strong>. For example, "If I had studied medicine, I would be a doctor now." The condition (not studying medicine) is in the past, but the result (not being a doctor) is in the present. This pattern combines the if-clause of the Third Conditional with the main clause of the Second Conditional.</p>
<p>The second pattern is: <em>If + past simple, would have + past participle</em>. This describes an <strong>unreal present condition</strong> with an <strong>unreal past result</strong>. For example, "If she were more organised, she wouldn't have missed the deadline." The condition (not being organised) is a general, ongoing characteristic in the present, but the result (missing the deadline) happened in the past. This pattern combines the if-clause of the Second Conditional with the main clause of the Third Conditional. It is less common than the first pattern but equally important for expressing nuanced meanings.</p>
<p>Mixed Conditionals often arise in contexts where a person's general characteristics or long-term circumstances (present) have influenced specific past events, or where a single past decision has shaped the current situation. Consider: "If I hadn't moved to London, I wouldn't be working here now." The past action (moving to London) has a direct and ongoing consequence in the present (working here). Understanding these conditionals allows speakers to express regret, reflection, and hypothetical reasoning with far greater precision than standard conditionals alone.</p>
<p>A key challenge for learners is deciding when to use a Mixed Conditional versus a standard Third or Second Conditional. The question to ask is: <strong>"Is the result in the present or the past?"</strong> If the condition is past but the result is still true now, use a Mixed Conditional. If both condition and result are in the past, use the Third Conditional. For example, "If I had taken that job, I would have moved to Paris" (Third — both parts refer to the past) versus "If I had taken that job, I would be living in Paris now" (Mixed — the condition is past, but the result is present). Mastering this distinction significantly enhances your ability to communicate hypothetical scenarios accurately.</p>`,
    examples: [
      {
        sentence: "If I had saved more money, I would own a house now.",
        note: "Past unreal condition (hadn't saved) → present unreal result (don't own a house). Third Conditional if-clause + Second Conditional main clause."
      },
      {
        sentence: "If she weren't so shy, she would have applied for the promotion.",
        note: "Present unreal condition (is shy) → past unreal result (didn't apply). Second Conditional if-clause + Third Conditional main clause."
      },
      {
        sentence: "If they had invested in that company, they would be millionaires today.",
        note: "Past unreal condition (didn't invest) → present unreal result (aren't millionaires). The past decision directly affects the present situation."
      },
      {
        sentence: "If he spoke better French, he would have gotten that job in Paris.",
        note: "Present unreal condition (doesn't speak French well enough) → past unreal result (didn't get the job). His ongoing limitation affected a past event."
      },
      {
        sentence: "If I hadn't broken my leg, I would be running the marathon this weekend.",
        note: "Past unreal condition (broke the leg) → present/future unreal result (can't run the marathon). A single past event prevents a present/future action."
      }
    ],
    commonMistakes: [
      {
        mistake: "If I had studied harder, I would have a better job now. (Incorrect main clause tense)",
        correction: "If I had studied harder, I would have a better job now. (This is actually correct — it's a Mixed Conditional!)",
      },
      {
        mistake: "If I would have studied, I would be richer now.",
        correction: "If I had studied, I would be richer now.",
      },
      {
        mistake: "If she was more careful, she would have not made that mistake.",
        correction: "If she were more careful, she wouldn't have made that mistake.",
      },
      {
        mistake: "If they had arrived earlier, they would see the sunset.",
        correction: "If they had arrived earlier, they would have seen the sunset. (Use Third Conditional if the result is also past.)",
      }
    ],
    quiz: [
      {
        question: "Which sentence is a Mixed Conditional (past condition → present result)?",
        options: [
          "If it rains, I will stay home.",
          "If I had studied law, I would be a lawyer now.",
          "If I were taller, I would play basketball.",
          "If she had called, I would have answered."
        ],
        correctAnswer: 1,
        explanation: "This is a Mixed Conditional: the if-clause uses the past perfect (Third Conditional form) referring to a past unreal condition, while the main clause uses 'would + base verb' (Second Conditional form) referring to a present unreal result."
      },
      {
        question: "Complete the Mixed Conditional: 'If he ______ more careful, he ______ the accident last week.'",
        options: [
          "was / wouldn't have",
          "were / wouldn't have had",
          "had been / wouldn't have",
          "were / wouldn't have had"
        ],
        correctAnswer: 1,
        explanation: "This is a present condition → past result Mixed Conditional. 'If he were more careful' (present unreal condition, Second Conditional if-clause) + 'he wouldn't have had the accident' (past unreal result, Third Conditional main clause)."
      },
      {
        question: "What is the difference between: 'If I had taken the job, I would have moved to Tokyo' and 'If I had taken the job, I would be living in Tokyo now'?",
        options: [
          "There is no difference in meaning.",
          "The first is a Third Conditional (past result); the second is a Mixed Conditional (present result).",
          "The first is a Mixed Conditional; the second is a Third Conditional.",
          "Both are Mixed Conditionals with different time references."
        ],
        correctAnswer: 1,
        explanation: "The first sentence is a standard Third Conditional: both the condition and result are in the past. The second is a Mixed Conditional: the condition is past, but the result is present ('would be living now')."
      },
      {
        question: "Which Mixed Conditional pattern describes a present unreal condition with a past unreal result?",
        options: [
          "If + past perfect, would + base verb",
          "If + past simple, would have + past participle",
          "If + present simple, will + base verb",
          "If + past simple, would + base verb"
        ],
        correctAnswer: 1,
        explanation: "The pattern 'If + past simple, would have + past participle' describes an unreal present condition (past simple = Second Conditional if-clause) with an unreal past result (would have + PP = Third Conditional main clause)."
      },
      {
        question: "Choose the correct Mixed Conditional:",
        options: [
          "If I hadn't lost my keys, I wouldn't be standing outside right now.",
          "If I didn't lose my keys, I wouldn't be standing outside right now.",
          "If I haven't lost my keys, I won't be standing outside right now.",
          "If I wouldn't have lost my keys, I wouldn't stand outside right now."
        ],
        correctAnswer: 0,
        explanation: "'If I hadn't lost my keys' (past perfect = past unreal condition) + 'I wouldn't be standing outside right now' (would + be + verb-ing = present unreal result). This is the correct Mixed Conditional pattern."
      }
    ]
  },

  "Passive Voice: All Tenses": {
    explanation: `<h2>The Passive Voice Across All Tenses</h2>
<p>The Passive Voice is formed using the appropriate form of the verb <strong>be</strong> + the <strong>past participle</strong> of the main verb. In passive sentences, the focus shifts from <em>who</em> performs the action to <em>what</em> receives it, or to the action itself. For example, "Shakespeare wrote Hamlet" (active) becomes "Hamlet was written by Shakespeare" (passive). The subject of the passive sentence (Hamlet) is the object of the active sentence. The original subject can be included using <strong>by + agent</strong>, but this is optional and often omitted when the agent is unknown, obvious, or unimportant.</p>
<p>The passive can be constructed in virtually every tense. In the <strong>present simple</strong>: 'The room is cleaned every day.' In the <strong>past simple</strong>: 'The room was cleaned yesterday.' In the <strong>present continuous</strong>: 'The room is being cleaned right now.' In the <strong>past continuous</strong>: 'The room was being cleaned when I arrived.' In the <strong>present perfect</strong>: 'The room has been cleaned.' In the <strong>past perfect</strong>: 'The room had been cleaned before we arrived.' In the <strong>future simple</strong>: 'The room will be cleaned tomorrow.' And with <strong>modal verbs</strong>: 'The room can/must/should be cleaned.' Each tense uses the corresponding form of 'be' while the past participle remains constant.</p>
<p>There are several important contexts where the passive voice is preferred. In <strong>scientific and academic writing</strong>, the passive is used to emphasise the process or result rather than the researcher: "The solution was heated to 100°C." In <strong>news reporting</strong>, when the agent is unknown: "The painting was stolen from the gallery." In <strong>formal or official communication</strong>: "Your application has been received." And when the <strong>object is more important</strong> than the subject: "The new hospital was opened by the Mayor." However, overusing the passive can make writing vague and impersonal, so it should be balanced with active voice for clarity and directness.</p>
<p>A common area of difficulty is forming passive questions and negative sentences. For questions, the auxiliary 'be' is inverted with the subject: "Was the letter sent?" "Has the work been finished?" "Will the report be completed on time?" For negatives, 'not' is placed after the first auxiliary: "The letter was not sent." "The work has not been finished." Another challenge is the passive with two objects (ditransitive verbs). Verbs like 'give,' 'send,' 'offer,' and 'show' can form two different passive structures: "She was offered a job" (personal passive) or "A job was offered to her" (impersonal passive). The personal passive, where the indirect object becomes the subject, is more common and natural in English.</p>`,
    examples: [
      {
        sentence: "The bridge was built in 1885.",
        note: "Past simple passive: was/were + past participle. The focus is on the bridge, not on who built it."
      },
      {
        sentence: "A new shopping centre is being constructed in the city centre.",
        note: "Present continuous passive: is/are being + past participle. The action is happening right now."
      },
      {
        sentence: "The documents have been signed and returned.",
        note: "Present perfect passive: has/have been + past participle. The action is completed with present relevance."
      },
      {
        sentence: "The decision will be announced tomorrow morning.",
        note: "Future simple passive: will be + past participle. A future event where the focus is on the decision, not the announcer."
      },
      {
        sentence: "The problem must be solved before the deadline.",
        note: "Modal passive: modal + be + past participle. The obligation or necessity is expressed by the modal, and the passive keeps the focus on the problem."
      },
      {
        sentence: "She was offered a scholarship to study abroad.",
        note: "Personal passive with a ditransitive verb. The indirect object ('she') has become the subject of the passive sentence."
      }
    ],
    commonMistakes: [
      {
        mistake: "The cake was bake by my mother.",
        correction: "The cake was baked by my mother.",
      },
      {
        mistake: "The project is being work on.",
        correction: "The project is being worked on.",
      },
      {
        mistake: "The letter has been send already.",
        correction: "The letter has been sent already.",
      },
      {
        mistake: "The new law will implemented next year.",
        correction: "The new law will be implemented next year.",
      }
    ],
    quiz: [
      {
        question: "Convert to passive: 'Someone stole my bicycle yesterday.'",
        options: [
          "My bicycle is stolen yesterday.",
          "My bicycle was stolen yesterday.",
          "My bicycle has been stolen yesterday.",
          "My bicycle were stolen yesterday."
        ],
        correctAnswer: 1,
        explanation: "The past simple passive is formed with 'was/were + past participle.' Since 'my bicycle' is singular, we use 'was stolen.' 'Yesterday' confirms past simple tense."
      },
      {
        question: "Which sentence uses the present perfect passive correctly?",
        options: [
          "The report has wrote by the manager.",
          "The report has been written by the manager.",
          "The report has being written by the manager.",
          "The report was been written by the manager."
        ],
        correctAnswer: 1,
        explanation: "The present perfect passive is 'has/have been + past participle.' 'The report has been written' follows this pattern correctly."
      },
      {
        question: "Complete the passive sentence: 'The museum _______ at the moment.'",
        options: [
          "is renovating",
          "is being renovated",
          "has been renovated",
          "was being renovated"
        ],
        correctAnswer: 1,
        explanation: "'At the moment' indicates present continuous. The present continuous passive is 'is/are being + past participle,' so 'is being renovated' is correct."
      },
      {
        question: "Why is the passive voice commonly used in scientific writing?",
        options: [
          "Because scientists do not know who performed the experiment.",
          "Because the focus is on the process and results rather than the researcher.",
          "Because active voice is grammatically incorrect in science.",
          "Because it makes the writing longer and more impressive."
        ],
        correctAnswer: 1,
        explanation: "In scientific writing, the passive voice is used to emphasise the process, methods, and results of an experiment rather than who performed it. This creates an objective, impersonal tone that is standard in academic communication."
      },
      {
        question: "Which is the correct passive form of: 'They can solve this problem'?",
        options: [
          "This problem can solved.",
          "This problem can be solved.",
          "This problem can being solved.",
          "This problem can to be solved."
        ],
        correctAnswer: 1,
        explanation: "The modal passive is formed with 'modal + be + past participle.' Therefore, 'can solve' becomes 'can be solved.' No additional auxiliaries are needed."
      }
    ]
  },

  "Reported Speech": {
    explanation: `<h2>Mastering Reported Speech</h2>
<p>Reported Speech (also called Indirect Speech) is used to communicate what someone else said without quoting them directly. When we report speech, we typically need to make several changes. The most important change is <strong>tense backshift</strong>: when the reporting verb is in the past tense (e.g., 'said,' 'told'), the tenses in the reported clause generally shift one step back into the past. Present Simple becomes Past Simple ("I like coffee" → She said she liked coffee), Present Continuous becomes Past Continuous ("I am working" → He said he was working), Present Perfect becomes Past Perfect ("I have finished" → She said she had finished), and so on. The Past Simple can shift to Past Perfect ("I saw him" → She said she had seen him), though this shift is sometimes optional in informal speech.</p>
<p>Modal verbs also change in reported speech. <strong>Will</strong> becomes <strong>would</strong> ("I will come" → He said he would come), <strong>can</strong> becomes <strong>could</strong> ("I can swim" → She said she could swim), <strong>may</strong> becomes <strong>might</strong> ("It may rain" → He said it might rain), and <strong>shall</strong> becomes <strong>should</strong>. However, some modals do not change: <em>could</em>, <em>would</em>, <em>should</em>, <em>might</em>, and <em>ought to</em> remain the same in reported speech. Additionally, <strong>must</strong> for obligation can change to <strong>had to</strong> ("I must go" → She said she had to go), while <em>must</em> for deduction stays as <em>must</em>.</p>
<p>Beyond tense changes, several other adjustments are necessary. <strong>Pronouns</strong> change to reflect the perspective of the person reporting: "I have my book" → She said she had her book. <strong>Time and place references</strong> also shift: 'today' becomes 'that day,' 'yesterday' becomes 'the day before' or 'the previous day,' 'tomorrow' becomes 'the next day' or 'the following day,' 'here' becomes 'there,' and 'this' becomes 'that.' These changes ensure that the reported statement makes sense from the point of view of the current speaker and the current time and place. However, if the situation has not changed — for example, if you are reporting something said earlier the same day — some of these shifts may be unnecessary.</p>
<p>Reporting <strong>questions</strong> requires additional attention to word order. In reported questions, the word order changes from interrogative (verb before subject) to affirmative (subject before verb), and the question mark is removed. Yes/No questions are introduced by 'if' or 'whether': "Are you coming?" → He asked if I was coming. Wh-questions keep the question word: "Where do you live?" → She asked where I lived. The reporting verbs you choose also matter: <em>said</em> and <em>told</em> are the most common, but <em>explained</em>, <em>admitted</em>, <em>denied</em>, <em>suggested</em>, <em>promised</em>, and <em>warned</em> add precision and nuance to your reporting. Note that 'told' requires a direct object ("She told me that..."), while 'said' does not ("She said that...").</p>`,
    examples: [
      {
        sentence: '"I am studying for the exam," she said.',
        note: 'She said she was studying for the exam. Present Continuous backshifts to Past Continuous. The pronoun "I" changes to "she."'
      },
      {
        sentence: '"I have already eaten," he told me.',
        note: 'He told me he had already eaten. Present Perfect backshifts to Past Perfect. "Told" requires an object ("me").'
      },
      {
        sentence: '"We will finish tomorrow," the manager said.',
        note: 'The manager said they would finish the next day. "Will" changes to "would," and "tomorrow" shifts to "the next day."'
      },
      {
        sentence: '"Where do you work?" she asked him.',
        note: 'She asked him where he worked. The question word "where" is kept, but the word order changes to subject + verb, and the tense backshifts.'
      },
      {
        sentence: '"I must leave early," David said.',
        note: 'David said he had to leave early. "Must" for obligation changes to "had to" in reported speech.'
      },
      {
        sentence: '"Can you help me?" she asked.',
        note: 'She asked if I could help her. A yes/no question uses "if" or "whether," "can" changes to "could," and the word order becomes affirmative.'
      }
    ],
    commonMistakes: [
      {
        mistake: "She said that she will call me tomorrow.",
        correction: "She said that she would call me the next day.",
      },
      {
        mistake: "He asked me where was I going.",
        correction: "He asked me where I was going.",
      },
      {
        mistake: "She told that she was tired.",
        correction: "She said that she was tired. (Or: She told me that she was tired.)",
      },
      {
        mistake: "He said he can speak three languages.",
        correction: "He said he could speak three languages.",
      }
    ],
    quiz: [
      {
        question: "Convert to reported speech: 'I have lost my keys,' Tom said.",
        options: [
          "Tom said he lost his keys.",
          "Tom said he had lost his keys.",
          "Tom said he has lost his keys.",
          "Tom said he were losing his keys."
        ],
        correctAnswer: 1,
        explanation: "The Present Perfect ('have lost') backshifts to the Past Perfect ('had lost') in reported speech. The pronoun 'my' also changes to 'his' to match the speaker."
      },
      {
        question: "Which reported question is correct? Original: 'Where are you going?'",
        options: [
          "She asked where I am going.",
          "She asked where was I going.",
          "She asked where I was going.",
          "She asked where did I go."
        ],
        correctAnswer: 2,
        explanation: "In reported questions, the word order changes to subject + verb (no inversion), and the tense backshifts. 'Where I was going' follows both rules correctly."
      },
      {
        question: "What does 'yesterday' become in reported speech?",
        options: [
          "today",
          "tomorrow",
          "the day before / the previous day",
          "next day"
        ],
        correctAnswer: 2,
        explanation: "'Yesterday' backshifts to 'the day before' or 'the previous day' in reported speech because the reference point has moved forward in time."
      },
      {
        question: "Which sentence correctly reports: 'I must go now,' she said.",
        options: [
          "She said she must go now.",
          "She said she had to go then.",
          "She said she must went then.",
          "She said she has to go now."
        ],
        correctAnswer: 1,
        explanation: "'Must' for obligation changes to 'had to' in reported speech. 'Now' changes to 'then.' So: 'She said she had to go then.'"
      },
      {
        question: "Why is 'told' incorrect in: 'He told that he was happy'?",
        options: [
          "Because 'told' is not a reporting verb.",
          "Because 'told' requires a direct object (who was told).",
          "Because the tense is wrong.",
          "Because 'told' can only be used with questions."
        ],
        correctAnswer: 1,
        explanation: "'Told' is a reporting verb that must have a direct object — you must specify who was told. The correct forms are: 'He told me that he was happy' or 'He said that he was happy.'"
      }
    ]
  },

  "Modal Verbs of Deduction": {
    explanation: `<h2>Modal Verbs of Deduction</h2>
<p>Modal verbs of deduction are used to express how certain we are about something based on evidence, logic, or reasoning — <em>not</em> about obligation or permission. The three key modals for deduction are <strong>must</strong>, <strong>can't</strong>, and <strong>might/may/could</strong>. <strong>Must</strong> expresses strong certainty that something is true: "You've been travelling all day — you must be exhausted." This means the speaker is almost 100% certain. <strong>Can't</strong> expresses strong certainty that something is <em>not</em> true: "She can't be at home; I just saw her at the supermarket." Note that we use <em>can't</em> (not 'mustn't') for negative deduction. <strong>Might, may,</strong> and <strong>could</strong> express possibility — the speaker thinks something is possible but is not sure: "Take an umbrella — it might rain later."</p>
<p>It is crucial to distinguish deduction from other uses of these modal verbs. <strong>Must</strong> for deduction is different from <strong>must</strong> for obligation. Compare: "You must wear a seatbelt" (obligation — a rule) versus "You must be freezing in that thin jacket!" (deduction — a logical conclusion based on evidence). Similarly, <strong>can't</strong> for deduction is different from <strong>can't</strong> for ability or permission: "I can't swim" (ability) versus "He can't be serious about quitting his job" (deduction — strong belief that something is not true). Context always determines which meaning is intended, and understanding this distinction is essential at the intermediate level.</p>
<p>Modal verbs of deduction can also refer to the <strong>past</strong>. The structure for past deduction is: <strong>modal + have + past participle</strong>. <strong>Must have + PP</strong> means we are almost certain something happened: "The ground is wet — it must have rained during the night." <strong>Can't have + PP</strong> means we are almost certain something did <em>not</em> happen: "She can't have finished already; it's only been ten minutes." <strong>Might/may/could have + PP</strong> means it is possible something happened, but we are not sure: "I might have left my phone at the restaurant." These past deduction forms are extremely common in everyday conversation when we reason about events we did not witness directly.</p>
<p>A subtle but important point: <strong>should have + past participle</strong> can also express a type of expectation about the past, though it is not strictly a deduction modal. "The bus should have arrived by now" means the speaker expected it based on a schedule, but it has not — implying surprise or mild criticism. This is different from "The bus must have arrived by now," which means the speaker is logically certain it has arrived. Additionally, in spoken English, you will often hear <strong>'ve</strong> contracted forms: "must've," "can't've," "might've," "could've." Understanding both the full and contracted forms is important for listening comprehension as well as natural-sounding speech.</p>`,
    examples: [
      {
        sentence: "You must be Dr. Collins — I recognise you from your photo.",
        note: "Strong certainty (deduction): the speaker is almost 100% sure based on visual evidence. Not obligation."
      },
      {
        sentence: "She can't be at work; it's a national holiday today.",
        note: "Strong impossibility (deduction): the speaker is certain she is NOT at work because of logical evidence. We use 'can't,' not 'mustn't,' for negative deduction."
      },
      {
        sentence: "He might be stuck in traffic.",
        note: "Possibility: the speaker considers this a reasonable explanation but is not certain. 'Might,' 'may,' and 'could' are interchangeable here."
      },
      {
        sentence: "They must have forgotten about the meeting.",
        note: "Past deduction — strong certainty: the speaker is almost sure they forgot, based on the fact that they haven't shown up."
      },
      {
        sentence: "The wallet can't have been stolen; it was in my pocket the whole time.",
        note: "Past deduction — strong impossibility: the speaker is certain it was not stolen because it was secure in their pocket."
      },
      {
        sentence: "She could have taken the early train.",
        note: "Past possibility: it is possible she took the early train, but the speaker doesn't know for sure."
      }
    ],
    commonMistakes: [
      {
        mistake: "She mustn't be at home; the lights are off.",
        correction: "She can't be at home; the lights are off.",
      },
      {
        mistake: "He must to be tired after the marathon.",
        correction: "He must be tired after the marathon.",
      },
      {
        mistake: "They might have go to the party.",
        correction: "They might have gone to the party.",
      },
      {
        mistake: "She can't have saw the email yet.",
        correction: "She can't have seen the email yet.",
      }
    ],
    quiz: [
      {
        question: "Which modal expresses strong certainty that something IS true (deduction)?",
        options: [
          "might",
          "could",
          "must",
          "may"
        ],
        correctAnswer: 2,
        explanation: "'Must' is used for strong certainty in deduction. When you are almost 100% sure something is true based on evidence, you use 'must.'"
      },
      {
        question: "Complete the deduction: 'The door is locked. She ______ be at home.'",
        options: [
          "mustn't",
          "can't",
          "shouldn't",
          "won't"
        ],
        correctAnswer: 1,
        explanation: "For negative deduction (strong certainty that something is NOT true), we use 'can't,' not 'mustn't.' 'Mustn't' is used for prohibition, not deduction."
      },
      {
        question: "What does 'He must have left early' express?",
        options: [
          "Obligation to leave early",
          "Strong certainty that he left early (past deduction)",
          "Permission to leave early",
          "A request to leave early"
        ],
        correctAnswer: 1,
        explanation: "'Must have + past participle' expresses a strong deduction about the past — the speaker is almost certain that he left early based on available evidence."
      },
      {
        question: "Which sentence uses a modal of deduction (not obligation)?",
        options: [
          "You must submit your assignment by Friday.",
          "You must be exhausted after that long journey!",
          "You must not park here.",
          "You must apologise to her immediately."
        ],
        correctAnswer: 1,
        explanation: "'You must be exhausted' is a deduction — a logical conclusion based on evidence (the long journey). The other options use 'must' for obligation or prohibition."
      },
      {
        question: "Choose the correct past deduction: 'I ______ my keys at the office. I can't find them anywhere.'",
        options: [
          "might have left",
          "must to have left",
          "can't have left",
          "should have leave"
        ],
        correctAnswer: 0,
        explanation: "'Might have left' expresses past possibility — the speaker thinks it's possible they left the keys at the office but is not certain. 'Can't have left' would mean they are certain they did NOT leave them, which contradicts the context."
      }
    ]
  },

  "Hedging Language": {
    explanation: `<h2>Hedging Language in Academic and Professional English</h2>
<p>Hedging language is used to express uncertainty, caution, or politeness when making claims, and it is a fundamental feature of academic, professional, and scientific writing. Rather than stating facts absolutely, hedging allows writers to present their claims with appropriate caution, acknowledging the limits of evidence or the possibility of alternative interpretations. Common hedging phrases include: <strong>"It seems that..."</strong>, <strong>"It could be argued that..."</strong>, <strong>"The evidence suggests..."</strong>, <strong>"It is likely that..."</strong>, <strong>"This may indicate..."</strong>, <strong>"There is a tendency for..."</strong>, and <strong>"It appears that..."</strong>. These phrases soften assertions and make them more nuanced and defensible.</p>
<p>Hedging matters because absolute statements in academic and professional contexts can be misleading or inaccurate. Research is rarely conclusive, and data can be interpreted in multiple ways. By using hedging language, writers avoid overclaiming and maintain intellectual honesty. For instance, saying "This proves that the treatment is effective" is much stronger than "The results suggest that the treatment may be effective." The second version is more responsible because it acknowledges that further research might yield different conclusions. In peer-reviewed academic writing, articles that lack hedging are often criticised for being too bold or overgeneralising beyond what the data supports.</p>
<p>There are several categories of hedging devices. <strong>Modal verbs</strong> are among the most common: <em>may, might, could, would, can</em>. For example, "This could be due to a measurement error." <strong>Adverbs of frequency and degree</strong> also function as hedges: <em>generally, often, frequently, usually, possibly, probably, apparently, seemingly</em>. For example, "The results are generally consistent with previous findings." <strong>Lexical verbs</strong> such as <em>seem, appear, suggest, indicate, tend to, imply</em> are also powerful hedging tools: "The data appear to support the hypothesis." Finally, <strong>phrases and clauses</strong> like "to some extent," "in many cases," "it is worth noting that," and "it could be argued that" provide broader, sentence-level hedging that frames the entire claim with caution.</p>
<p>Striking the right balance is key. <strong>Over-hedging</strong> — using too many cautious phrases in a single sentence — can make writing seem weak, timid, or unclear: "It could perhaps possibly be suggested that this may somewhat indicate a trend." This is unnecessarily vague. <strong>Under-hedging</strong>, on the other hand, makes claims sound more definitive than the evidence warrants: "This proves that climate change causes extreme weather." The ideal approach is to match the strength of your language to the strength of your evidence. Strong evidence allows for more confident language with minimal hedging; weaker or more contested evidence requires more cautious phrasing. Learning to calibrate hedging appropriately is a skill that develops with practice and exposure to academic writing conventions.</p>`,
    examples: [
      {
        sentence: "The evidence suggests that regular exercise may reduce the risk of heart disease.",
        note: "'The evidence suggests' and 'may' are both hedging devices, softening the claim and acknowledging that the link is not absolute."
      },
      {
        sentence: "It could be argued that the government's policy has not been effective.",
        note: "'It could be argued that' introduces a claim while distancing the writer from full endorsement — someone could make this argument, but the writer is not asserting it as fact."
      },
      {
        sentence: "There appears to be a correlation between income levels and educational attainment.",
        note: "'Appears to be' is a cautious way to describe an observed relationship without claiming it is definitive or causal."
      },
      {
        sentence: "The results are generally consistent with previous studies, although some discrepancies were observed.",
        note: "'Generally consistent' hedges the agreement, and 'some discrepancies' acknowledges exceptions — a balanced, nuanced statement."
      },
      {
        sentence: "It seems likely that consumer behaviour will shift towards online shopping in the coming years.",
        note: "'It seems likely' combines two levels of hedging: 'seems' (appearance rather than certainty) and 'likely' (probable but not guaranteed)."
      },
      {
        sentence: "This may indicate that the drug has potential side effects that were not detected in earlier trials.",
        note: "'May indicate' hedges both the certainty of the observation and the strength of the conclusion drawn from it."
      }
    ],
    commonMistakes: [
      {
        mistake: "This proves that the new method is better.",
        correction: "The evidence suggests that the new method may be more effective in certain contexts.",
      },
      {
        mistake: "It could perhaps maybe possibly be the case that the theory is wrong.",
        correction: "It could be argued that the theory may be incorrect.",
      },
      {
        mistake: "Scientists know that this is true.",
        correction: "Scientists generally agree that this is likely to be the case.",
      },
      {
        mistake: "The data shows there is no doubt that the policy failed.",
        correction: "The data appears to indicate that the policy was largely ineffective.",
      }
    ],
    quiz: [
      {
        question: "Which sentence uses hedging language appropriately?",
        options: [
          "This absolutely proves the hypothesis.",
          "The findings suggest that the hypothesis may be correct.",
          "We know for sure that this is the only explanation.",
          "There is no question that the theory is right."
        ],
        correctAnswer: 1,
        explanation: "'The findings suggest' and 'may be correct' are hedging devices that present the claim with appropriate caution, acknowledging that the evidence supports but does not absolutely prove the hypothesis."
      },
      {
        question: "What is the problem with over-hedging?",
        options: [
          "It makes claims too strong.",
          "It makes writing too vague, weak, or unclear.",
          "It is grammatically incorrect.",
          "It makes the text too short."
        ],
        correctAnswer: 1,
        explanation: "Over-hedging — stacking multiple cautious phrases — makes writing vague and weak. A sentence like 'It could perhaps possibly maybe seem to suggest...' communicates almost nothing clearly."
      },
      {
        question: "Which of the following is a hedging adverb?",
        options: [
          "definitely",
          "undoubtedly",
          "apparently",
          "certainly"
        ],
        correctAnswer: 2,
        explanation: "'Apparently' is a hedging adverb that means 'it seems to be the case' — it expresses caution. The other options are emphasising adverbs that strengthen claims rather than soften them."
      },
      {
        question: "Rewrite with appropriate hedging: 'This proves that social media causes anxiety in teenagers.'",
        options: [
          "This may indicate that social media could contribute to anxiety in some teenagers.",
          "This definitely proves that social media causes anxiety in all teenagers.",
          "This has nothing to do with anxiety.",
          "Maybe social media might perhaps possibly cause anxiety."
        ],
        correctAnswer: 0,
        explanation: "'May indicate' and 'could contribute' provide appropriate hedging — acknowledging a possible link without claiming it as proven fact. 'In some teenagers' further narrows the scope responsibly."
      },
      {
        question: "Why is hedging important in academic writing?",
        options: [
          "It makes the writing sound more complicated.",
          "It allows writers to avoid doing proper research.",
          "It prevents overclaiming and acknowledges the limits of evidence.",
          "It is required to reach a minimum word count."
        ],
        correctAnswer: 2,
        explanation: "Hedging is important because research is rarely conclusive. It prevents writers from making claims that go beyond what the evidence supports, maintaining intellectual honesty and making arguments more defensible."
      }
    ]
  },

  "Future Forms: Will, Going to, Present Continuous": {
    explanation: `<h2>Navigating Future Forms in English</h2>
<p>English does not have a single future tense; instead, it uses several different forms to express future meaning, and choosing the correct one depends on the speaker's intention and the context. The three most common future forms are <strong>will</strong>, <strong>going to</strong>, and the <strong>present continuous</strong>. <strong>Will + base verb</strong> is used for spontaneous decisions made at the moment of speaking ("The phone's ringing — I'll answer it!"), predictions based on opinion or belief rather than evidence ("I think people will live on Mars one day"), and offers, promises, and threats ("I'll help you with that"). It is also used in formal announcements and decisions ("The meeting will commence at 10 a.m.").</p>
<p><strong>Be going to + base verb</strong> is used for plans and intentions that were made before the moment of speaking ("I'm going to visit my grandparents this weekend"), and for predictions based on present evidence — when you can see that something is about to happen ("Look at those dark clouds — it's going to rain"). The key distinction from 'will' is that 'going to' implies the decision or evidence existed before the current moment. If you decide something on the spot, use 'will'; if you decided earlier, use 'going to.' For predictions, if there is visible evidence now, use 'going to'; if you are expressing an opinion about the future, use 'will.'</p>
<p>The <strong>present continuous</strong> is used for fixed arrangements and appointments — events that have been confirmed with other people or organisations. For example, "I'm meeting Sarah for lunch tomorrow" implies that you and Sarah have already agreed on this. "We're flying to Paris on Friday" suggests the tickets have been booked. The present continuous is more definite than 'going to' because it implies that all the practical arrangements have been made. Compare: "I'm going to have dinner with Tom" (an intention, possibly not yet confirmed with Tom) versus "I'm having dinner with Tom" (a confirmed arrangement). In practice, the line between these can be blurred, but the distinction is useful for exam purposes and for understanding the subtle differences in meaning.</p>
<p>Two additional future forms are worth knowing at the intermediate level. The <strong>future continuous</strong> (will be + verb-ing) describes an action that will be in progress at a specific time in the future: "This time tomorrow, I'll be lying on the beach." It emphasises the duration or ongoing nature of a future activity. The <strong>future perfect</strong> (will have + past participle) describes an action that will be completed before a specific time in the future: "By the end of the year, I will have finished my degree." Both forms add precision to your future references. Finally, remember that time clauses with 'when,' 'before,' 'after,' 'until,' and 'as soon as' use present tenses to refer to the future: "I'll call you when I arrive" (not 'when I will arrive'). This is a common source of error for learners whose first languages use future tenses in these clauses.</p>`,
    examples: [
      {
        sentence: "I'll carry that bag for you.",
        note: "'Will' for a spontaneous offer — the decision is made at the moment of speaking, without prior planning."
      },
      {
        sentence: "She's going to study engineering at university next year.",
        note: "'Going to' for a prior plan or intention — the decision about what to study was made before this moment."
      },
      {
        sentence: "We're having dinner with the Smiths on Saturday.",
        note: "Present continuous for a fixed arrangement — the dinner has been confirmed with the Smiths."
      },
      {
        sentence: "Look out! That glass is going to fall!",
        note: "'Going to' for a prediction based on present, visible evidence — you can see the glass is about to fall."
      },
      {
        sentence: "I think robots will do most household chores in the future.",
        note: "'Will' for a prediction based on opinion or belief, not on immediate evidence."
      },
      {
        sentence: "By 2030, scientists will have developed a cure for the disease.",
        note: "Future perfect: an action that will be completed before a specific future time."
      }
    ],
    commonMistakes: [
      {
        mistake: "I will call you when I will arrive.",
        correction: "I will call you when I arrive.",
      },
      {
        mistake: "I'm going to answer the phone! (when it starts ringing unexpectedly)",
        correction: "I'll answer the phone!",
      },
      {
        mistake: "She will meet her doctor tomorrow at 3pm. (already booked)",
        correction: "She is meeting her doctor tomorrow at 3pm.",
      },
      {
        mistake: "Look at the sky. It will rain.",
        correction: "Look at the sky. It's going to rain.",
      }
    ],
    quiz: [
      {
        question: "Which future form is best for a spontaneous decision?",
        options: [
          "going to",
          "present continuous",
          "will",
          "future perfect"
        ],
        correctAnswer: 2,
        explanation: "'Will' is used for spontaneous decisions made at the moment of speaking. 'Going to' is for prior plans, and the present continuous is for fixed arrangements."
      },
      {
        question: "Choose the best future form: 'Look at that car! It ______ into the wall!'",
        options: [
          "will crash",
          "is going to crash",
          "is crashing",
          "will have crashed"
        ],
        correctAnswer: 1,
        explanation: "This is a prediction based on present, visible evidence (you can see the car heading towards the wall). 'Going to' is the correct form for evidence-based predictions."
      },
      {
        question: "Which sentence describes a fixed arrangement?",
        options: [
          "I'm going to visit Paris someday.",
          "I'll visit Paris if I have time.",
          "I'm visiting Paris next week — I've already booked the flight.",
          "I think I will visit Paris next year."
        ],
        correctAnswer: 2,
        explanation: "The present continuous ('I'm visiting Paris next week') with the confirmation 'I've already booked the flight' indicates a fixed arrangement — all practical details have been confirmed."
      },
      {
        question: "Complete the sentence: 'By the end of this month, I ______ all my exams.'",
        options: [
          "will finish",
          "will be finishing",
          "will have finished",
          "am finishing"
        ],
        correctAnswer: 2,
        explanation: "The future perfect ('will have finished') is used for actions that will be completed before a specific time in the future. 'By the end of this month' signals this future perfect meaning."
      },
      {
        question: "Why is 'when I will arrive' incorrect in 'I'll text you when I arrive'?",
        options: [
          "Because 'arrive' should be 'arrived.'",
          "Because time clauses with 'when' use present tenses to refer to the future.",
          "Because 'text' should be 'will text.'",
          "Because 'when' cannot be used with future events."
        ],
        correctAnswer: 1,
        explanation: "In English, time clauses introduced by 'when,' 'before,' 'after,' 'until,' and 'as soon as' use present tenses (simple or perfect) to refer to future events, even though the meaning is future. So 'when I arrive' (present simple) refers to a future arrival."
      }
    ]
  },

  "Phrasal Verbs in Context": {
    explanation: `<h2>Phrasal Verbs in Context</h2>
<p>Phrasal verbs are combinations of a verb with one or two particles (prepositions or adverbs) that create a meaning different from the original verb alone. For example, <strong>look up</strong> does not mean 'look in an upward direction' — it means 'to search for information.' Phrasal verbs are extremely common in spoken and informal English, and mastering them is essential for understanding natural, idiomatic language. There are three main types of phrasal verbs based on whether the verb and particle can be separated: <strong>inseparable</strong>, <strong>separable</strong>, and <strong>three-part</strong> phrasal verbs.</p>
<p><strong>Inseparable phrasal verbs</strong> cannot have the verb and particle split apart — the object must come after the entire phrasal verb. For example, <em>look after</em> ("She looks after the children" — NOT "She looks the children after"), <em>run into</em> ("I ran into an old friend" — NOT "I ran an old friend into"), and <em>come across</em> ("I came across an interesting article"). If you use a pronoun as the object, it still comes after the particle: "She looks after them" (not "She looks them after"). <strong>Separable phrasal verbs</strong> allow the object to go between the verb and the particle, or after the particle. For example, <em>pick up</em>: "Pick up the book" or "Pick the book up." However, when the object is a <strong>pronoun</strong>, it <em>must</em> go between the verb and the particle: "Pick it up" (NOT "Pick up it"). This rule is absolute and is one of the most commonly tested points in English exams.</p>
<p><strong>Three-part phrasal verbs</strong> consist of a verb + particle + preposition, and they are always inseparable. Common examples include <em>look forward to</em> ("I look forward to hearing from you"), <em>come up with</em> ("She came up with a brilliant idea"), <em>put up with</em> ("I can't put up with the noise"), <em>get along with</em> ("He gets along with everyone"), and <em>run out of</em> ("We've run out of milk"). The object always comes after the entire phrasal verb: "I look forward to the holiday" (not "I look the holiday forward to"). These multi-word verbs are particularly challenging because the individual words give little clue to the overall meaning, which is often entirely idiomatic.</p>
<p>Context is the key to understanding and using phrasal verbs correctly. Many phrasal verbs have <strong>multiple meanings</strong> depending on the context. For instance, <em>take off</em> can mean to remove clothing ("Take off your coat"), to become successful quickly ("Her business really took off"), or to leave the ground ("The plane is taking off"). Similarly, <em>make up</em> can mean to invent a story ("He made up an excuse"), to reconcile after a fight ("They made up"), or to constitute ("Women make up 60% of the workforce"). Only by paying attention to the surrounding context can you determine which meaning is intended. At the intermediate level, it is important to learn phrasal verbs not as isolated items but within example sentences that show their typical contexts and collocations. Keeping a notebook of phrasal verbs organised by topic (work, travel, relationships, etc.) can be an effective study strategy.</p>`,
    examples: [
      {
        sentence: "Could you look after my dog while I'm away?",
        note: "Inseparable phrasal verb: 'look after' means to take care of. The object always follows the entire phrasal verb."
      },
      {
        sentence: "Please pick up your clothes from the floor. / Please pick them up.",
        note: "Separable phrasal verb: 'pick up' can have the object between or after the verb and particle. With a pronoun, it MUST go between: 'pick them up.'"
      },
      {
        sentence: "I'm really looking forward to the concert.",
        note: "Three-part phrasal verb: 'look forward to' is always inseparable. The object ('the concert') comes after the entire phrase."
      },
      {
        sentence: "She came up with a creative solution to the problem.",
        note: "Three-part phrasal verb: 'come up with' means to think of or produce an idea. It is inseparable."
      },
      {
        sentence: "The meeting has been put off until next week.",
        note: "'Put off' means to postpone. This is a separable phrasal verb used here in the passive voice."
      },
      {
        sentence: "We've run out of sugar — I need to go to the shop.",
        note: "Three-part phrasal verb: 'run out of' means to have no more of something. It is always inseparable."
      }
    ],
    commonMistakes: [
      {
        mistake: "Pick up it from the table.",
        correction: "Pick it up from the table.",
      },
      {
        mistake: "I look forward to see you.",
        correction: "I look forward to seeing you.",
      },
      {
        mistake: "She ran an old friend into at the shop.",
        correction: "She ran into an old friend at the shop.",
      },
      {
        mistake: "He came up it with during the meeting.",
        correction: "He came up with it during the meeting.",
      }
    ],
    quiz: [
      {
        question: "Which phrasal verb is inseparable?",
        options: [
          "pick up",
          "look after",
          "take off (clothing)",
          "turn on"
        ],
        correctAnswer: 1,
        explanation: "'Look after' is inseparable — you must say 'look after the children,' not 'look the children after.' The other options are all separable phrasal verbs."
      },
      {
        question: "Choose the correct pronoun placement: 'The TV is too loud. Can you ______?'",
        options: [
          "turn down it",
          "turn it down",
          "turn down",
          "it turn down"
        ],
        correctAnswer: 1,
        explanation: "'Turn down' is a separable phrasal verb. When the object is a pronoun, it MUST go between the verb and the particle: 'turn it down,' never 'turn down it.'"
      },
      {
        question: "What does 'come up with' mean in: 'She came up with a great idea'?",
        options: [
          "To encounter unexpectedly",
          "To think of or produce an idea or plan",
          "To improve or increase",
          "To approach someone"
        ],
        correctAnswer: 1,
        explanation: "'Come up with' means to think of, produce, or suggest an idea, plan, or solution. It is a three-part inseparable phrasal verb."
      },
      {
        question: "Which sentence uses a three-part phrasal verb correctly?",
        options: [
          "I can't put up the noise with.",
          "I can't put up with the noise.",
          "I can't put the noise up with.",
          "I can't put with up the noise."
        ],
        correctAnswer: 1,
        explanation: "'Put up with' is a three-part phrasal verb that is always inseparable. The object must come after the complete phrasal verb: 'put up with the noise.'"
      },
      {
        question: "The phrasal verb 'take off' has multiple meanings. Which sentence uses it to mean 'become successful quickly'?",
        options: [
          "Take off your shoes before entering.",
          "The plane is about to take off.",
          "Her online business really took off during the pandemic.",
          "He took off his hat and bowed."
        ],
        correctAnswer: 2,
        explanation: "In 'Her online business really took off,' the phrasal verb means 'became successful quickly.' The other sentences use 'take off' to mean 'remove clothing' or 'leave the ground (of an aircraft).'"
      }
    ]
  },

  "Writing Professional Emails": {
    explanation: `<h2>Writing Professional Emails</h2>
<p>Professional emails require a clear structure and appropriate tone. A well-structured email has four essential components: a <strong>specific subject line</strong>, an <strong>appropriate opening</strong>, a <strong>clear body</strong>, and a <strong>professional closing</strong>. The subject line should be concise and informative — instead of <em>"Meeting"</em>, write <em>"Request to reschedule Tuesday's project review meeting"</em>. This helps the recipient immediately understand the purpose and priority of your email.</p>

<p>For openings, match the formality to the situation. For initial contact, use <em>"I am writing to enquire about…"</em> or <em>"I am contacting you regarding…"</em> When replying, use <em>"Thank you for your email of [date]"</em> or <em>"Further to our conversation earlier…"</em> For internal emails, a friendly <em>"I hope you're well"</em> is acceptable. The body should state the purpose in the first sentence, develop one idea per paragraph, and use bullet points for multiple items. Close with clear next steps: <em>"Please let me know if you need any further information"</em> or <em>"I look forward to hearing from you."</em></p>

<p>Key phrases for different purposes include: making requests (<em>"Would it be possible to…?"</em>, <em>"I would be grateful if you could…"</em>), giving updates (<em>"I wanted to update you on…"</em>, <em>"Just to let you know that…"</em>), apologising (<em>"Please accept my apologies for…"</em>, <em>"I'm sorry for the delay in getting back to you"</em>), and following up (<em>"I'm following up on my email of [date]"</em>). Sign-offs range from formal (<em>"Yours sincerely"</em> for known names, <em>"Yours faithfully"</em> for Dear Sir/Madam) to professional (<em>"Kind regards"</em>, <em>"Best regards"</em>) to internal (<em>"Best"</em>, <em>"Thanks"</em>).</p>`,
    examples: [
      {
        sentence: "I am writing to enquire about the availability of your conference facilities on 15 March.",
        note: "Formal opening for an initial enquiry — sets context and purpose immediately."
      },
      {
        sentence: "Would it be possible to extend the deadline by one week?",
        note: "Polite request using 'Would it be possible to…' — softens the ask compared to 'Please extend…'"
      },
      {
        sentence: "Please accept my apologies for the delay in submitting the quarterly report.",
        note: "Formal apology — 'Please accept my apologies' is more professional than 'Sorry I'm late'."
      },
      {
        sentence: "I look forward to hearing from you at your earliest convenience.",
        note: "Professional closing — indicates you expect a reply without being pushy."
      },
      {
        sentence: "Just to let you know that the client has approved the revised proposal.",
        note: "Internal update — 'Just to let you know' is informal but professional for colleagues."
      }
    ],
    commonMistakes: [
      {
        mistake: "Subject: Question",
        correction: "Subject: Question about Q3 budget allocation (Vague subject lines get overlooked; be specific.)"
      },
      {
        mistake: "Hey, can you send me that file?",
        correction: "Would you mind sending me the file at your earliest convenience? (Professional emails require polite request structures.)"
      },
      {
        mistake: "Sorry I'm late with this.",
        correction: "Please accept my apologies for the delay in submitting this. (Formal context requires formal language.)"
      },
      {
        mistake: "Yours sincerely, (after Dear Sir/Madam)",
        correction: "Yours faithfully, (Use 'faithfully' with Dear Sir/Madam; 'sincerely' with a known name.)"
      }
    ],
    quiz: [
      {
        question: "Which subject line is the most professional and specific?",
        options: [
          "Meeting",
          "Tomorrow",
          "Agenda for tomorrow's 2 PM team meeting (14 Nov)",
          "Important!!!"
        ],
        correctAnswer: 2,
        explanation: "A good subject line is specific, concise, and tells the reader exactly what the email is about. Vague or urgent-sounding subject lines are unprofessional."
      },
      {
        question: "Which opening is appropriate for a first-time business email?",
        options: [
          "Hey there!",
          "I am writing to enquire about your consulting services.",
          "What's up?",
          "So, I was thinking..."
        ],
        correctAnswer: 1,
        explanation: "'I am writing to enquire about…' is the standard formal opening for initial business contact. Casual greetings are inappropriate for first-time professional emails."
      },
      {
        question: "What is the correct sign-off after 'Dear Sir or Madam'?",
        options: [
          "Kind regards,",
          "Best,",
          "Yours faithfully,",
          "Yours sincerely,"
        ],
        correctAnswer: 2,
        explanation: "Use 'Yours faithfully' when you don't know the recipient's name (Dear Sir/Madam). Use 'Yours sincerely' when you know the name."
      },
      {
        question: "Which phrase is the most polite way to make a request in a professional email?",
        options: [
          "Send me the report.",
          "I need the report now.",
          "I would be grateful if you could send me the report.",
          "You should send the report."
        ],
        correctAnswer: 2,
        explanation: "'I would be grateful if you could…' is a polite, professional request. Direct commands are too abrupt for professional emails."
      },
      {
        question: "What should the first sentence of an email body do?",
        options: [
          "Ask about the weather",
          "State the purpose of the email",
          "Thank the reader for everything",
          "Tell a joke to break the ice"
        ],
        correctAnswer: 1,
        explanation: "The first sentence should clearly state the purpose of the email. This respects the reader's time and sets expectations immediately."
      }
    ]
  },

  "Participating in Meetings and Discussions": {
    explanation: `<h2>Participating in Meetings and Discussions</h2>
<p>Effective participation in meetings requires knowing how to express opinions, agree and disagree diplomatically, interrupt politely, and summarise discussions. To start a meeting, use <em>"Let's get started"</em> or <em>"Shall we begin?"</em> and state the purpose: <em>"The purpose of today's meeting is to…"</em> When giving your opinion, use phrases like <em>"In my opinion…"</em>, <em>"From my perspective…"</em>, or <em>"The way I see it…"</em></p>

<p>Agreeing diplomatically is straightforward: <em>"I completely agree"</em>, <em>"That's a good point"</em>, or <em>"I see it the same way."</em> However, partial agreement is often more realistic: <em>"I agree up to a point, but…"</em>, <em>"That's true, but we also need to consider…"</em>, or <em>"You have a point, but on the other hand…"</em> Disagreeing diplomatically is crucial — never say <em>"You're wrong"</em>. Instead, use <em>"I'm not sure I agree with that"</em>, <em>"I see it slightly differently"</em>, or <em>"I understand where you're coming from, but…"</em></p>

<p>Interrupting politely requires skill: use <em>"Sorry, could I just add something?"</em>, <em>"If I could just jump in here…"</em>, or <em>"Before we move on, I'd like to say…"</em> Clarifying is equally important: <em>"Could you clarify what you mean by…?"</em> or <em>"If I've understood correctly,…" </em> To summarise and conclude, use <em>"So, to summarise,…" </em>, <em>"Let's recap what we've agreed"</em>, or <em>"I'll send out the action points after the meeting."</em></p>`,
    examples: [
      {
        sentence: "In my opinion, we should focus more on social media this year.",
        note: "Expressing an opinion — 'In my opinion' is a clear, professional way to share your view."
      },
      {
        sentence: "I agree up to a point, but we also need to consider the budget.",
        note: "Partial agreement — acknowledges the other view while introducing a concern."
      },
      {
        sentence: "I see it slightly differently. I think we should prioritise customer retention.",
        note: "Diplomatic disagreement — 'I see it slightly differently' softens the opposition."
      },
      {
        sentence: "Sorry, could I just add something before we move on?",
        note: "Polite interruption — 'Sorry' + 'could I just' makes it respectful and non-aggressive."
      },
      {
        sentence: "So, to summarise, we've agreed to launch in March and review results in June.",
        note: "Summarising — recaps decisions clearly so everyone is aligned on next steps."
      }
    ],
    commonMistakes: [
      {
        mistake: "You're wrong. That won't work.",
        correction: "I'm not sure that approach would work in this situation. Perhaps we could consider… (Diplomatic disagreement preserves relationships.)"
      },
      {
        mistake: "I don't like your idea.",
        correction: "I see the merit in that idea, but I'm concerned about the timeline. (Express concerns constructively.)"
      },
      {
        mistake: "Let me talk now.",
        correction: "If I could just jump in here for a moment… (Polite interruption is more professional.)"
      },
      {
        mistake: "What do you mean? (aggressive tone)",
        correction: "Could you clarify what you mean by that? (Seeking understanding is more constructive.)"
      }
    ],
    quiz: [
      {
        question: "Which phrase is the most diplomatic way to disagree in a meeting?",
        options: [
          "That's completely wrong.",
          "I don't agree at all.",
          "I see it slightly differently.",
          "You don't know what you're talking about."
        ],
        correctAnswer: 2,
        explanation: "'I see it slightly differently' expresses disagreement without being confrontational. It preserves the relationship while still allowing you to state your view."
      },
      {
        question: "Complete: 'I agree up to a ______, but we also need to consider the budget.'",
        options: ["level", "point", "degree", "stage"],
        correctAnswer: 1,
        explanation: "'I agree up to a point, but…' is the standard phrase for partial agreement — you accept part of the idea while raising a concern."
      },
      {
        question: "Which phrase is a polite way to interrupt someone in a meeting?",
        options: [
          "Stop talking. I need to speak.",
          "Be quiet for a second.",
          "Sorry, could I just add something?",
          "Let me finish your sentence."
        ],
        correctAnswer: 2,
        explanation: "'Sorry, could I just add something?' is polite because it starts with an apology and uses a question form rather than a command."
      },
      {
        question: "What is the purpose of summarising at the end of a meeting?",
        options: [
          "To show you were listening",
          "To make the meeting longer",
          "To ensure everyone is aligned on decisions and action points",
          "To criticise what others said"
        ],
        correctAnswer: 2,
        explanation: "Summarising ensures everyone leaves with the same understanding of what was agreed and who is responsible for what."
      },
      {
        question: "Which phrase is best for asking someone to explain their point more clearly?",
        options: [
          "What are you talking about?",
          "Could you clarify what you mean by that?",
          "That doesn't make sense.",
          "Explain yourself."
        ],
        correctAnswer: 1,
        explanation: "'Could you clarify what you mean by that?' is a respectful way to seek understanding without implying the other person is unclear."
      }
    ]
  },

  "Giving Presentations in English": {
    explanation: `<h2>Giving Presentations in English</h2>
<p>A professional presentation follows a clear structure: <strong>opening</strong>, <strong>overview</strong>, <strong>main body</strong>, and <strong>conclusion</strong>. In the opening, grab attention with a question, surprising fact, or short anecdote: <em>"Did you know that…?"</em> or <em>"By the end of this talk, you'll understand…"</em> The overview tells the audience what you'll cover: <em>"I'll begin by… Then I'll move on to… After that,… Finally,…" </em></p>

<p>Signposting language is essential for guiding your audience through the presentation. Moving on: <em>"Let's move on to the next point"</em> or <em>"Turning now to…"</em> Adding information: <em>"In addition to this,…" </em> or <em>"Furthermore,…" </em> Giving examples: <em>"For example,…" </em> or <em>"To illustrate this,…" </em> Emphasising: <em>"It's worth noting that…" </em> or <em>"The key point here is…"</em> Referring to visuals: <em>"If you look at this chart,…" </em> or <em>"As you can see from the slide,…" </em></p>

<p>The conclusion should summarise and close: <em>"To sum up,…" </em>, <em>"In conclusion,…" </em>, or <em>"The main takeaway is…"</em> End with <em>"Thank you for your attention. I'd be happy to take any questions."</em> When handling Q&A, use phrases like <em>"That's a great question"</em>, <em>"I'm afraid I don't have that information to hand, but I can follow up with you after"</em>, and <em>"Does that answer your question?"</em> Good presentations are not just about content — they're about guiding your audience through that content clearly and confidently.</p>`,
    examples: [
      {
        sentence: "Good morning, everyone. Did you know that 80% of projects fail due to poor communication?",
        note: "Opening hook — a surprising statistic grabs attention and sets up the presentation topic."
      },
      {
        sentence: "I'll begin by outlining the problem, then move on to our proposed solutions, and finally discuss the timeline.",
        note: "Overview — tells the audience the structure so they can follow along."
      },
      {
        sentence: "Turning now to the financial implications of this decision.",
        note: "Signposting — 'Turning now to' signals a transition to a new section."
      },
      {
        sentence: "As you can see from the slide, revenue has increased by 23% over the last quarter.",
        note: "Referring to visuals — directs the audience's attention to supporting evidence."
      },
      {
        sentence: "To sum up, the three key benefits are cost reduction, faster delivery, and improved quality.",
        note: "Conclusion — summarises the main points clearly and concisely."
      }
    ],
    commonMistakes: [
      {
        mistake: "So, yeah, I'm going to talk about stuff.",
        correction: "Today I'd like to talk about the impact of remote working on team productivity. (Be specific and professional from the start.)"
      },
      {
        mistake: "Now I will talk about the next thing.",
        correction: "Let's move on to the next point: the financial implications. (Use signposting language to guide your audience.)"
      },
      {
        mistake: "That's it. Any questions?",
        correction: "Thank you for your attention. I'd be happy to take any questions. (A professional closing invites questions politely.)"
      },
      {
        mistake: "I don't know the answer. Next question.",
        correction: "That's a great question. I don't have the exact figures to hand, but I can follow up with you after the presentation. (Acknowledge the question and offer to follow up.)"
      }
    ],
    quiz: [
      {
        question: "Which opening is most effective for a professional presentation?",
        options: [
          "Um, hi everyone. So… yeah.",
          "Good morning. Today I'll talk about something.",
          "Good morning, everyone. Did you know that companies lose £5,000 per employee each year due to poor communication?",
          "Hello. Let me read my slides to you."
        ],
        correctAnswer: 2,
        explanation: "A strong opening includes a greeting, a hook (surprising statistic), and sets the topic. It grabs attention immediately."
      },
      {
        question: "What is the function of signposting language in a presentation?",
        options: [
          "To make the presentation longer",
          "To guide the audience through the structure and signal transitions",
          "To show off your vocabulary",
          "To replace visual aids"
        ],
        correctAnswer: 1,
        explanation: "Signposting language (like 'Turning now to…' or 'In addition…') helps the audience follow the structure and understand where they are in the presentation."
      },
      {
        question: "Complete: '______ now to the financial implications of this decision.'",
        options: ["Moving", "Turning", "Going", "Changing"],
        correctAnswer: 1,
        explanation: "'Turning now to…' is the standard signposting phrase for transitioning to a new topic or section."
      },
      {
        question: "How should you handle a question you don't know the answer to?",
        options: [
          "Just guess an answer.",
          "Say 'I don't know' and move on quickly.",
          "Acknowledge the question and offer to follow up afterwards.",
          "Ignore the question entirely."
        ],
        correctAnswer: 2,
        explanation: "'That's a great question. I don't have that information to hand, but I can follow up' is honest and professional. Never guess or ignore."
      },
      {
        question: "Which phrase is appropriate for concluding a presentation?",
        options: [
          "So, yeah, that's all.",
          "I'm done.",
          "To sum up, the main takeaway is that investing in training improves retention by 40%.",
          "Whatever, thanks."
        ],
        correctAnswer: 2,
        explanation: "'To sum up, the main takeaway is…' provides a clear summary and reinforces the key message the audience should remember."
      }
    ]
  },

  "Academic Writing \u2014 Essays and Reports": {
    explanation: `<h2>Academic Writing — Essays and Reports</h2>
<p>Academic writing follows a strict structure and uses formal vocabulary. An essay has three main parts: the <strong>introduction</strong> (10% of word count), the <strong>body paragraphs</strong> (80%), and the <strong>conclusion</strong> (10%). The introduction should include a hook, background context, a <strong>thesis statement</strong> (your main argument in one sentence), and a brief outline. A strong thesis statement might be: <em>"This essay argues that remote working increases productivity when properly managed."</em></p>

<p>Each body paragraph should follow the <strong>PEEL structure</strong>: <strong>Point</strong> (topic sentence stating the main idea), <strong>Evidence</strong> (facts, data, examples, or quotes), <strong>Explanation</strong> (why this evidence supports your point), and <strong>Link</strong> (connect back to the thesis or transition to the next paragraph). This structure ensures every paragraph is focused, supported, and connected to your overall argument.</p>

<p>Formal vocabulary is essential in academic writing. Replace informal words with formal alternatives: <em>"a lot of"</em> → <em>"a significant number of"</em>, <em>"big"</em> → <em>"substantial"</em>, <em>"get"</em> → <em>"obtain"</em>, <em>"show"</em> → <em>"demonstrate"</em>, <em>"say"</em> → <em>"argue"</em>, <em>"thing"</em> → <em>"factor"</em>, <em>"good/bad"</em> → <em>"beneficial/detrimental"</em>. Use linking words to connect ideas: <em>furthermore, moreover</em> (addition); <em>however, nevertheless</em> (contrast); <em>therefore, consequently</em> (cause/effect); <em>for instance, for example</em> (examples); <em>firstly, subsequently, finally, in conclusion</em> (sequence).</p>`,
    examples: [
      {
        sentence: "This essay argues that social media has a detrimental effect on young people's mental health.",
        note: "Thesis statement — a clear, single-sentence argument that guides the entire essay."
      },
      {
        sentence: "A recent study by Stanford University found that remote workers save an average of 72 minutes per day on commuting.",
        note: "Evidence — specific data from a credible source that supports a claim."
      },
      {
        sentence: "Consequently, promoting bilingual education may have important implications for public health policy.",
        note: "Link sentence — connects the paragraph's finding back to the broader argument and suggests implications."
      },
      {
        sentence: "A significant number of researchers argue that climate change poses the greatest threat to global stability.",
        note: "Formal vocabulary — 'significant number' replaces 'a lot of', 'argue' replaces 'say'."
      },
      {
        sentence: "The results demonstrate that the new methodology produces substantially better outcomes.",
        note: "Academic language — 'demonstrate' replaces 'show', 'substantially' replaces 'a lot'."
      }
    ],
    commonMistakes: [
      {
        mistake: "A lot of people think social media is bad for kids.",
        correction: "A significant number of researchers argue that social media has a detrimental effect on young people's mental health. (Use formal vocabulary and cite sources.)"
      },
      {
        mistake: "This essay will talk about why renewable energy is good.",
        correction: "This essay examines the advantages of renewable energy and argues for its expanded implementation. ('Talk about' and 'good' are too informal.)"
      },
      {
        mistake: "The results show that the new method works better.",
        correction: "The results demonstrate that the new methodology produces significantly better outcomes. (Use academic verbs and precise adverbs.)"
      },
      {
        mistake: "In conclusion, I think that we should do something about it.",
        correction: "In conclusion, the evidence strongly suggests that immediate policy intervention is necessary. (Be specific and evidence-based, not vague.)"
      }
    ],
    quiz: [
      {
        question: "What does PEEL stand for in academic paragraph structure?",
        options: [
          "Plan, Explain, Examine, List",
          "Point, Evidence, Explanation, Link",
          "Prepare, Evaluate, Edit, Learn",
          "Present, Explain, Explore, Locate"
        ],
        correctAnswer: 1,
        explanation: "PEEL stands for Point (topic sentence), Evidence (data/quotes), Explanation (how evidence supports the point), and Link (connection to thesis or next paragraph)."
      },
      {
        question: "Which sentence is a strong thesis statement?",
        options: [
          "This essay will talk about social media.",
          "I think social media is interesting.",
          "This essay argues that social media has a detrimental effect on young people's mental health.",
          "Social media is bad."
        ],
        correctAnswer: 2,
        explanation: "A strong thesis statement is specific, arguable, and presents a clear position in one sentence. It guides the entire essay."
      },
      {
        question: "Which is the formal alternative to 'a lot of'?",
        options: [
          "many much",
          "a significant number of",
          "heaps of",
          "tons of"
        ],
        correctAnswer: 1,
        explanation: "'A significant number of' is the formal academic alternative to 'a lot of'. Informal quantifiers like 'heaps' or 'tons' are never used in academic writing."
      },
      {
        question: "What should the conclusion of an essay do?",
        options: [
          "Introduce a completely new argument",
          "Restate the thesis, summarise main points, and offer a final thought",
          "Repeat the introduction word for word",
          "List all the evidence again in detail"
        ],
        correctAnswer: 1,
        explanation: "The conclusion restates the thesis in different words, summarises the main points, and offers a final thought or implication. It should NOT introduce new information."
      },
      {
        question: "Which linking word indicates contrast?",
        options: ["Furthermore", "Therefore", "Nevertheless", "Subsequently"],
        correctAnswer: 2,
        explanation: "'Nevertheless' is a contrast linker meaning 'despite that'. 'Furthermore' adds information, 'Therefore' shows cause/effect, and 'Subsequently' shows sequence."
      }
    ]
  },

  "Reading Academic and Professional Texts": {
    explanation: `<h2>Reading Academic and Professional Texts</h2>
<p>Effective reading of academic and professional texts involves three key skills: <strong>skimming</strong> for structure, <strong>identifying the main argument</strong>, and <strong>distinguishing main points from supporting evidence</strong>. Skimming means quickly reading the title, abstract/introduction, and conclusion, looking at headings and subheadings, and noticing bold text, bullet points, and charts — all within 2-3 minutes. This gives you the overall picture before you deep-read.</p>

<p>The main argument (thesis) is usually found in the introduction or abstract. Look for phrases like <em>"This paper argues…"</em>, <em>"The purpose of this study is…"</em>, or <em>"We demonstrate that…"</em> In news articles, the headline and first paragraph contain the main point; in reports, the executive summary gives key findings. Distinguishing main points from supporting evidence is crucial: main points directly support the thesis, while supporting points provide evidence, examples, and data. Signal words for main points include <em>"The key finding is…"</em> and <em>"Most importantly…"</em>, while signal words for evidence include <em>"For example,…" </em> and <em>"According to…"</em></p>

<p>Critical reading requires asking questions: What is the author's purpose? Who is the intended audience? What evidence is provided and is it reliable? Are there biases or assumptions? Does the conclusion follow from the evidence? For vocabulary, use context clues (the sentence around the unknown word), word parts (prefixes like un-, re-, dis- and suffixes like -tion, -ment, -ness), and note common collocations like <em>"conduct research"</em>, <em>"gather data"</em>, and <em>"draw conclusions"</em>.</p>`,
    examples: [
      {
        sentence: "This study investigates the impact of remote working on employee productivity in the technology sector.",
        note: "Thesis statement in an abstract — clearly states the research topic and scope."
      },
      {
        sentence: "Results indicate a 13% increase in output among fully remote workers compared to office-based employees.",
        note: "Key finding — specific numerical evidence that directly supports or challenges the thesis."
      },
      {
        sentence: "According to a 2022 McKinsey report, 58% of employed respondents now have the option to work from home.",
        note: "Supporting evidence — data from a credible source that backs up a main point."
      },
      {
        sentence: "The data also reveal challenges in collaboration and innovation.",
        note: "Limitation — an important qualification that shows the author has considered counter-evidence."
      },
      {
        sentence: "The findings suggest that hybrid models may offer the optimal balance.",
        note: "Conclusion/recommendation — the author's interpretation of what the evidence means for practice."
      }
    ],
    commonMistakes: [
      {
        mistake: "Reading every word from beginning to end without skimming first.",
        correction: "Skim the title, abstract, headings, and conclusion first to understand the structure, then deep-read relevant sections. (Save time and focus your reading.)"
      },
      {
        mistake: "Treating all information in a text as equally important.",
        correction: "Distinguish main points (which support the thesis) from supporting evidence (which backs up main points). Use signal words to guide you."
      },
      {
        mistake: "Accepting all claims without questioning the evidence.",
        correction: "Ask: What evidence is provided? Is it reliable? Are there biases? Critical reading means evaluating, not just absorbing."
      },
      {
        mistake: "Ignoring unknown words instead of using context clues.",
        correction: "Look at surrounding words for clues: definitions, examples, or contrast words like 'however' can hint at meaning."
      }
    ],
    quiz: [
      {
        question: "What is the purpose of skimming before deep reading?",
        options: [
          "To memorise the entire text",
          "To understand the overall structure and main ideas quickly",
          "To avoid reading the text at all",
          "To find spelling errors"
        ],
        correctAnswer: 1,
        explanation: "Skimming gives you the big picture — structure, main arguments, and key sections — so you can focus your deep reading on what matters most."
      },
      {
        question: "Where is the thesis usually found in an academic paper?",
        options: [
          "In the bibliography",
          "In the introduction or abstract",
          "In the acknowledgements",
          "In the methodology section"
        ],
        correctAnswer: 1,
        explanation: "The thesis statement is typically in the introduction or abstract, where the author states the main argument or purpose of the paper."
      },
      {
        question: "Which signal word indicates supporting evidence?",
        options: [
          "Most importantly",
          "The key finding is",
          "According to",
          "In conclusion"
        ],
        correctAnswer: 2,
        explanation: "'According to' signals that evidence from a source is being cited. 'Most importantly' and 'The key finding' signal main points, and 'In conclusion' signals the end."
      },
      {
        question: "What does 'the patient's condition was exacerbated — in other words, made worse — by the medication' demonstrate?",
        options: [
          "The author is confused",
          "A spelling error",
          "A context clue that defines 'exacerbated' as 'made worse'",
          "Informal language in academic writing"
        ],
        correctAnswer: 2,
        explanation: "The phrase 'in other words' is a context clue that provides the definition of the unknown word 'exacerbated' right after it appears."
      },
      {
        question: "Which is a question a critical reader should ask?",
        options: [
          "How many pages is this?",
          "What font was used?",
          "Are there biases or assumptions in the argument?",
          "When was the author born?"
        ],
        correctAnswer: 2,
        explanation: "Critical readers evaluate the quality of arguments by checking for biases, assumptions, evidence quality, and whether conclusions logically follow from the evidence."
      }
    ]
  },

  "Negotiating and Persuading": {
    explanation: `<h2>Negotiating and Persuading</h2>
<p>Negotiation and persuasion are essential professional skills that require specific language patterns. Making proposals uses phrases like <em>"What if we…?"</em>, <em>"Suppose we…"</em>, <em>"One option would be to…"</em>, and <em>"I'd like to propose that…"</em> Conditional proposals are particularly powerful: <em>"If you can lower the price by 10%, we could increase our order"</em> or <em>"Provided that you deliver by Friday, we'll sign the contract today."</em></p>

<p>Softening language makes demands sound like requests, which is crucial for maintaining relationships during negotiations. Use <em>"Would it be possible to…?"</em>, <em>"I was wondering if we might…"</em>, <em>"Do you think you could…?"</em>, and <em>"Ideally, we'd like to…"</em> Expressing priorities and limits shows where you stand: <em>"Our main priority is…"</em>, <em>"This is a dealbreaker for us"</em>, or <em>"We have some flexibility on price, but delivery time is non-negotiable."</em> Compromise language includes <em>"We could compromise on X if you can meet us halfway on Y."</em></p>

<p>Building consensus is the art of finding common ground: <em>"It seems we both agree on…"</em>, <em>"We have common ground on…"</em>, <em>"Can we find a middle ground?"</em>, and <em>"What would a win-win solution look like?"</em> The key to successful negotiation is maintaining a collaborative tone — you're not fighting against the other party; you're working together to find a solution that satisfies both sides. Avoid ultimatums and always leave room for creative solutions.</p>`,
    examples: [
      {
        sentence: "If you can lower the price by 10%, we could increase our order by 25%.",
        note: "Conditional proposal — links your concession to their benefit, creating a win-win opportunity."
      },
      {
        sentence: "Would it be possible to extend the deadline by a week?",
        note: "Softening language — 'Would it be possible' sounds like a question, not a demand."
      },
      {
        sentence: "Delivery time is non-negotiable for us, but we have some flexibility on price.",
        note: "Expressing a fixed limit while showing flexibility elsewhere — keeps the negotiation open."
      },
      {
        sentence: "It seems we both agree on the timeline. Can we find a middle ground on the budget?",
        note: "Building consensus — starts from agreement and moves toward resolving the remaining difference."
      },
      {
        sentence: "What if we split the difference and meet at £35,000?",
        note: "Suggesting compromise — 'split the difference' means each side moves equally from their position."
      }
    ],
    commonMistakes: [
      {
        mistake: "Lower the price or we walk away.",
        correction: "If you could lower the price by 15%, we'd be prepared to place a larger order. (Conditional proposals create opportunities; ultimatums destroy them.)"
      },
      {
        mistake: "I want free delivery included.",
        correction: "Would it be possible to include free delivery? It would help us finalise the agreement this week. (Softening language preserves the relationship.)"
      },
      {
        mistake: "That's our final offer. Take it or leave it.",
        correction: "This is the best we can offer at this stage, but we're open to discussing other aspects of the deal. (Always leave the door open.)"
      },
      {
        mistake: "We disagree on everything.",
        correction: "It seems we have some differences, but we both agree on the quality standards. Let's build from there. (Start from common ground.)"
      }
    ],
    quiz: [
      {
        question: "Which phrase is a conditional proposal?",
        options: [
          "You must lower the price.",
          "If you reduce the price by 8%, we'll sign today.",
          "We need a discount.",
          "Give us a better deal."
        ],
        correctAnswer: 1,
        explanation: "A conditional proposal links a condition ('If you reduce the price') to an outcome ('we'll sign today'). It creates a win-win incentive."
      },
      {
        question: "What is the function of softening language in negotiation?",
        options: [
          "To make your position weaker",
          "To make demands sound like requests, preserving the relationship",
          "To confuse the other party",
          "To avoid making any proposals"
        ],
        correctAnswer: 1,
        explanation: "Softening language ('Would it be possible to…?') makes requests sound less aggressive, keeping negotiations collaborative rather than confrontational."
      },
      {
        question: "What does 'This is a dealbreaker' mean?",
        options: [
          "We want to break the deal",
          "This is something we cannot accept under any circumstances",
          "This is a small problem",
          "We need a break from negotiating"
        ],
        correctAnswer: 1,
        explanation: "A 'dealbreaker' is a non-negotiable condition — if this term isn't met, the deal cannot proceed. It signals a firm limit."
      },
      {
        question: "Complete: 'It seems we both agree on the timeline. Can we find a ______ on the budget?'",
        options: ["difference", "middle ground", "problem", "disagreement"],
        correctAnswer: 1,
        explanation: "'Middle ground' means a compromise position between two sides. 'Can we find a middle ground?' proposes moving toward agreement."
      },
      {
        question: "Which approach is most effective for successful negotiation?",
        options: [
          "Make demands and refuse to compromise",
          "Listen only to your own priorities",
          "Find common ground and work toward a win-win solution",
          "Walk away at the first disagreement"
        ],
        correctAnswer: 2,
        explanation: "Successful negotiation is collaborative. Finding common ground and working toward win-win solutions leads to lasting agreements that both parties respect."
      }
    ]
  },

  "Telephone and Video Call English": {
    explanation: `<h2>Telephone and Video Call English</h2>
<p>Professional phone and video calls require specific language and etiquette. When answering the phone professionally, use <em>"Good morning, [Company Name], [Your Name] speaking. How can I help you?"</em> When making a call, say <em>"Hello, could I speak to [Name], please?"</em> or <em>"Hi, this is [Name] from [Company]. I'm calling about…"</em> If the person isn't available, ask <em>"Could I leave a message?"</em> or <em>"Could you ask [Name] to call me back?"</em></p>

<p>When leaving a voicemail, keep it concise: <em>"Hi, this is [Name] from [Company]. I'm calling about… Could you call me back on [number]? I'm available between [time] and [time]. Thanks, speak soon."</em> When the person you're calling isn't available, the receptionist may say <em>"I'm afraid [Name] is in a meeting"</em> or <em>"Would you like to leave a message?"</em> — respond with <em>"I'll leave a message, please"</em> or <em>"Can I take your number and ask them to call you back?"</em></p>

<p>Video call etiquette includes: <em>"Can everyone hear me?"</em>, <em>"Can you see my screen?"</em>, <em>"I'm going to share my screen"</em>, <em>"Sorry, you're on mute"</em>, and <em>"The connection is a bit unstable."</em> When dealing with technical problems, say <em>"I think we have a bad connection"</em>, <em>"Your screen is frozen"</em>, or <em>"Could you repeat that? The audio cut out."</em> Always end calls professionally: <em>"I'll follow up by email"</em> or <em>"Thank you for your time."</em></p>`,
    examples: [
      {
        sentence: "Good morning, Bright Solutions. How may I help you?",
        note: "Professional phone answering — includes company name, your name, and an offer to help."
      },
      {
        sentence: "Could I speak to Sarah Johnson in Marketing, please?",
        note: "Making a call — polite request to speak to a specific person using their full name."
      },
      {
        sentence: "I'm afraid Sarah's line is busy. Would you like to leave a message?",
        note: "Handling unavailability — explains the situation and offers alternatives."
      },
      {
        sentence: "Can everyone hear me? I'm going to share my screen now.",
        note: "Video call opening — checking audio and signalling the next action."
      },
      {
        sentence: "Could you repeat that? The audio cut out for a moment.",
        note: "Dealing with technical problems — polite request with an explanation of the issue."
      }
    ],
    commonMistakes: [
      {
        mistake: "Yeah? (answering a business call)",
        correction: "Good morning, [Company Name]. [Your Name] speaking. How can I help you? (Professional greeting is essential.)"
      },
      {
        mistake: "I want to talk to Sarah.",
        correction: "Could I speak to Sarah Johnson, please? (Use polite request forms on the phone.)"
      },
      {
        mistake: "She's not here. Call later.",
        correction: "I'm afraid she's in a meeting at the moment. Would you like to leave a message? (Be helpful and offer alternatives.)"
      },
      {
        mistake: "I can't hear you. Speak up!",
        correction: "I think we have a bad connection. Could you repeat that, please? (Be polite about technical issues.)"
      }
    ],
    quiz: [
      {
        question: "Which is the most professional way to answer a business phone call?",
        options: [
          "Hello?",
          "Yeah?",
          "Good morning, Smith Consulting. James speaking. How can I help you?",
          "What do you want?"
        ],
        correctAnswer: 2,
        explanation: "A professional greeting includes the company name, your name, and an offer to help. This immediately sets a businesslike tone."
      },
      {
        question: "Complete: 'I'm afraid Mr. Chen is in a meeting. Would you like to ______ a message?'",
        options: ["give", "leave", "take", "make"],
        correctAnswer: 1,
        explanation: "'Leave a message' is the correct phrase — the caller leaves a message for the person who is unavailable."
      },
      {
        question: "What should you include in a professional voicemail?",
        options: [
          "Just your first name",
          "Your name, company, reason for calling, and callback number",
          "A long explanation of the problem",
          "A joke to lighten the mood"
        ],
        correctAnswer: 1,
        explanation: "A professional voicemail should include: your name, company, brief reason for calling, callback number, and when you're available."
      },
      {
        question: "How do you politely tell someone on a video call that their microphone is off?",
        options: [
          "You're on mute! Turn it on!",
          "Why can't I hear you?",
          "Sorry, I think you're on mute.",
          "Your mic is broken."
        ],
        correctAnswer: 2,
        explanation: "'Sorry, I think you're on mute' is polite and doesn't blame the person. 'Sorry' softens the interruption."
      },
      {
        question: "What should you do if the video call connection is poor?",
        options: [
          "Continue talking as normal",
          "Hang up without explanation",
          "Suggest switching to audio only or reconnecting",
          "Shout so they can hear you"
        ],
        correctAnswer: 2,
        explanation: "Suggesting 'Let's switch to audio only — the video is lagging' or 'I'll try logging out and joining again' addresses the problem professionally."
      }
    ]
  },

  "Networking and Small Talk at Work": {
    explanation: `<h2>Networking and Small Talk at Work</h2>
<p>Networking and small talk are essential professional skills, especially in English-speaking business cultures. To start a conversation, use icebreakers like <em>"Hi, I'm [Name]. I work in [department]"</em>, <em>"Is this your first time at one of these events?"</em>, <em>"How long have you worked at [company]?"</em>, <em>"What brings you here today?"</em>, or <em>"The speaker was excellent, wasn't she?"</em></p>

<p>Maintaining the conversation requires good follow-up questions: <em>"That sounds interesting. How did you get into that?"</em>, <em>"What do you enjoy most about your work?"</em>, <em>"How do you find working in [city/industry]?"</em>, and <em>"Have you been working on anything exciting recently?"</em> Safe small talk topics include: the event itself, travel, work-related topics, hobbies, and positive current events. Topics to avoid include: personal finances, politics, religion, gossip, and anything too personal.</p>

<p>Active listening phrases show engagement: <em>"That's fascinating"</em>, <em>"Really? Tell me more"</em>, <em>"I hadn't thought of it that way"</em>, and <em>"That must have been challenging."</em> Making a polite exit is just as important as starting: <em>"It's been lovely talking to you. I'm going to grab another drink"</em>, <em>"I should probably mingle a bit more. Enjoy the rest of the evening!"</em>, or <em>"Let me give you my card. It was great meeting you."</em> Always end with a positive impression and a clear next step if you want to stay in touch.</p>`,
    examples: [
      {
        sentence: "Hi, I'm Priya. This is my first time at this conference. Is it yours?",
        note: "Icebreaker — a friendly, open-ended question that invites the other person to share."
      },
      {
        sentence: "That sounds interesting. How did you get into UX design?",
        note: "Follow-up question — shows genuine interest and keeps the conversation flowing."
      },
      {
        sentence: "No way — I'm in digital marketing too! We're practically neighbours in the industry.",
        note: "Finding common ground — discovering shared interests strengthens professional connections."
      },
      {
        sentence: "It's been lovely talking to you. Let me give you my card.",
        note: "Polite exit with contact exchange — professional way to end the conversation and stay connected."
      },
      {
        sentence: "Really? Tell me more about that project.",
        note: "Active listening — showing genuine curiosity encourages the other person to share more."
      }
    ],
    commonMistakes: [
      {
        mistake: "So, how much do you earn? (asking about salary)",
        correction: "What do you enjoy most about your work? (Personal finances are not appropriate small talk topics.)"
      },
      {
        mistake: "I need to go. Bye. (abrupt exit)",
        correction: "It's been lovely talking to you. I should probably mingle a bit more. Enjoy the rest of the evening! (Polite exits leave positive impressions.)"
      },
      {
        mistake: "So, who did you vote for? (politics)",
        correction: "Have you been working on anything exciting recently? (Politics is off-limits in professional small talk.)"
      },
      {
        mistake: "Uh-huh. Yeah. (not really listening)",
        correction: "That's fascinating. Tell me more about how that worked. (Active listening shows respect and builds rapport.)"
      }
    ],
    quiz: [
      {
        question: "Which is the best icebreaker at a professional networking event?",
        options: [
          "How much money do you make?",
          "Is this your first time at this conference?",
          "What's your religion?",
          "Who are you voting for?"
        ],
        correctAnswer: 1,
        explanation: "'Is this your first time at this conference?' is a safe, friendly opener that relates to the shared event. The other options are inappropriate professional topics."
      },
      {
        question: "What is a safe topic for professional small talk?",
        options: [
          "Personal health issues",
          "Office gossip",
          "The event venue and speakers",
          "Political opinions"
        ],
        correctAnswer: 2,
        explanation: "The event itself (venue, speakers, food) is a safe, neutral topic that both parties can discuss comfortably without controversy."
      },
      {
        question: "Which phrase shows active listening in a networking conversation?",
        options: [
          "Uh-huh. Right.",
          "Anyway, about me...",
          "That's fascinating. Tell me more about that.",
          "I need to go now."
        ],
        correctAnswer: 2,
        explanation: "'That's fascinating. Tell me more' shows genuine interest and encourages the speaker to continue — it's the opposite of passive listening."
      },
      {
        question: "How should you exit a networking conversation politely?",
        options: [
          "Walk away without saying anything",
          "I'm bored. Bye.",
          "It's been lovely talking to you. I should probably mingle a bit more.",
          "I don't want to talk anymore."
        ],
        correctAnswer: 2,
        explanation: "A polite exit acknowledges the conversation positively, gives a natural reason for leaving, and leaves a good impression."
      },
      {
        question: "What should you do when you find common ground with someone?",
        options: [
          "Ignore it and change the subject",
          "Argue about who knows more",
          "Acknowledge it and build on the connection",
          "Compete with them"
        ],
        correctAnswer: 2,
        explanation: "Finding common ground is the goal of networking — acknowledge it enthusiastically ('No way, me too!') and use it to deepen the professional connection."
      }
    ]
  },

  "Describing Data, Charts, and Trends": {
    explanation: `<h2>Describing Data, Charts, and Trends</h2>
<p>Describing data accurately is essential for presentations, reports, and meetings. Upward movement uses phrases like <em>"Sales increased/rose/grew by 20%"</em>, <em>"There was a steady increase in…"</em>, <em>"Profits surged"</em> (dramatic), and <em>"The figure reached a peak of…"</em> (highest point). Downward movement uses <em>"Revenue fell/dropped/declined by 15%"</em>, <em>"There was a sharp decrease in…"</em>, <em>"Numbers plummeted"</em> (dramatic), and <em>"The figure hit a low of…"</em></p>

<p>For stability and fluctuation, use <em>"The figure remained stable/constant at…"</em>, <em>"There was little change in…"</em>, and <em>"The number fluctuated between X and Y."</em> When comparing data, use modifiers: <em>"X is significantly/substantially higher than Y"</em>, <em>"X is slightly/marginally lower than Y"</em>, or <em>"X is approximately the same as Y."</em> Proportions and approximations include: <em>"Just over/under 50%"</em>, <em>"Roughly a third"</em>, <em>"The vast majority"</em> (~80-90%), and <em>"A significant minority"</em> (~20-30%).</p>

<p>Prepositions with numbers are a common source of errors. Use <em>"by"</em> for the amount of change (<em>"Sales rose by 10%"</em>), <em>"from…to"</em> for start and end points (<em>"Sales rose from £5m to £6m"</em>), <em>"to"</em> for the end point only (<em>"Sales rose to £6m"</em>), <em>"at"</em> for static figures (<em>"Profits stood at £2m"</em>), and <em>"of"</em> after a noun (<em>"an increase of 15%"</em>). Mastering these prepositions makes your data descriptions precise and professional.</p>`,
    examples: [
      {
        sentence: "Company revenue showed a strong upward trend between 2020 and 2023, climbing from £2.5 million to a peak of £5.1 million.",
        note: "Describing an upward trend — includes the direction, time period, start and end figures."
      },
      {
        sentence: "The most dramatic growth occurred in 2022, when revenue surged by 50%.",
        note: "Highlighting a dramatic change — 'surged' emphasises the significance of the increase."
      },
      {
        sentence: "Sales fluctuated between £3 million and £4 million throughout the year.",
        note: "Describing fluctuation — 'fluctuated between X and Y' shows irregular ups and downs."
      },
      {
        sentence: "The number levelled off at around 500 in the final quarter.",
        note: "Describing stability — 'levelled off' means the figure stopped changing and became stable."
      },
      {
        sentence: "X is significantly higher than Y, with a difference of approximately 30%.",
        note: "Comparing data — 'significantly higher' uses a modifier for emphasis, with specific numbers."
      }
    ],
    commonMistakes: [
      {
        mistake: "Prices increased to 15%.",
        correction: "Prices increased by 15%. ('By' indicates the amount of change; 'to' indicates the end point.)"
      },
      {
        mistake: "The number fell by 100 to 500.",
        correction: "The number fell from 600 to 500. (Use 'from…to' for start and end points; 'by' for the amount of change.)"
      },
      {
        mistake: "There was a decrease on 10%.",
        correction: "There was a decrease of 10%. (Use 'of' after a noun to indicate the amount.)"
      },
      {
        mistake: "The figure stands in 25%.",
        correction: "The figure stands at 25%. (Use 'at' for static figures.)"
      }
    ],
    quiz: [
      {
        question: "Complete: 'Sales rose ______ 10% last quarter.'",
        options: ["to", "by", "from", "of"],
        correctAnswer: 1,
        explanation: "'By' indicates the amount of change: 'rose by 10%' means the increase was 10 percentage points."
      },
      {
        question: "Complete: 'Revenue climbed ______ £2m ______ £5m.'",
        options: ["by / to", "from / to", "to / from", "of / at"],
        correctAnswer: 1,
        explanation: "'From…to' indicates the start and end points: 'climbed from £2m to £5m' shows the full range of change."
      },
      {
        question: "Which word describes a dramatic upward movement?",
        options: ["dipped", "surged", "levelled off", "fluctuated"],
        correctAnswer: 1,
        explanation: "'Surged' describes a dramatic, sudden upward movement. 'Dipped' is downward, 'levelled off' is stable, and 'fluctuated' is irregular."
      },
      {
        question: "What does 'the vast majority' approximately mean?",
        options: [
          "About 20-30%",
          "About 50%",
          "About 80-90%",
          "About 100%"
        ],
        correctAnswer: 2,
        explanation: "'The vast majority' refers to approximately 80-90% — a very large proportion, but not quite all."
      },
      {
        question: "Complete: 'The figure remained stable ______ £2 million throughout the year.'",
        options: ["by", "from", "at", "of"],
        correctAnswer: 2,
        explanation: "'At' is used for static figures: 'remained stable at £2 million' means the figure didn't change from that level."
      }
    ]
  },

  "Writing CVs, Cover Letters, and Applications": {
    explanation: `<h2>Writing CVs, Cover Letters, and Applications</h2>
<p>A strong CV has five key sections: <strong>personal details</strong>, <strong>professional summary</strong>, <strong>work experience</strong>, <strong>education</strong>, and <strong>skills</strong>. For personal details, include your name, phone, email, and LinkedIn — but NOT your age, marital status, religion, or photo (in UK/US). The professional summary should be 3-4 lines: <em>"Results-driven marketing professional with 5+ years of experience in digital strategy and team leadership."</em></p>

<p>Work experience should be listed in reverse chronological order (most recent first) using bullet points with <strong>strong action verbs</strong>: <em>"Led a team of 8 designers to deliver a £2m rebranding project"</em>, <em>"Increased social media engagement by 340% within 12 months"</em>, <em>"Streamlined the reporting process, reducing delivery time by 30%."</em> Key action verbs include: led, managed, developed, created, designed, implemented, streamlined, increased, reduced, improved, launched, negotiated, analysed, coordinated, supervised, and achieved. Always include specific numbers and results where possible.</p>

<p>A cover letter has four sections: opening (state the role and where you saw it), why this company (show you've researched them), why you (match your experience to their requirements), and call to action (request an interview). Tailor every application by using keywords from the job description, addressing every requirement with evidence, and researching the company's values. Example opening: <em>"I am writing to apply for the Marketing Manager position at GreenTech Solutions, as advertised on LinkedIn."</em> Never use the same generic CV and cover letter for every application — customisation shows genuine interest and significantly improves your chances.</p>`,
    examples: [
      {
        sentence: "Developed and executed a social media strategy that grew followers by 15,000 in 6 months.",
        note: "Strong CV bullet point — starts with an action verb, includes specific results and numbers."
      },
      {
        sentence: "I am writing to apply for the Marketing Manager position at GreenTech Solutions, as advertised on LinkedIn.",
        note: "Cover letter opening — clearly states the role, company, and where you found the listing."
      },
      {
        sentence: "Resolved 95% of customer complaints within 24 hours, achieving a 4.8/5 satisfaction rating.",
        note: "Quantified achievement — specific percentages and ratings make your impact tangible and credible."
      },
      {
        sentence: "Your commitment to sustainability resonates strongly with my personal values and professional experience.",
        note: "Cover letter 'why this company' section — shows research and alignment with company values."
      },
      {
        sentence: "Results-driven marketing professional with 5+ years of experience in digital strategy and team leadership.",
        note: "Professional summary — concise, includes years of experience, key skills, and one notable strength."
      }
    ],
    commonMistakes: [
      {
        mistake: "Responsible for social media.",
        correction: "Developed and executed a social media strategy that grew followers by 15,000 in 6 months. (Start with action verbs and include specific results.)"
      },
      {
        mistake: "Helped with customer service.",
        correction: "Resolved 95% of customer complaints within 24 hours, achieving a 4.8/5 satisfaction rating. (Quantify your achievements with numbers.)"
      },
      {
        mistake: "Made the website better.",
        correction: "Redesigned the company website, improving load speed by 40% and increasing conversions by 22%. (Use strong action verbs and measurable results.)"
      },
      {
        mistake: "Dear Sir/Madam, I am writing about any job you have.",
        correction: "Dear Ms. Johnson, I am writing to apply for the Marketing Manager position advertised on your careers page. (Always address a specific person and role.)"
      }
    ],
    quiz: [
      {
        question: "Which CV bullet point is the strongest?",
        options: [
          "Responsible for social media.",
          "Managed social media.",
          "Developed a social media strategy that grew followers by 15,000 in 6 months.",
          "Did social media work."
        ],
        correctAnswer: 2,
        explanation: "The strongest bullet point starts with an action verb ('Developed') and includes specific, measurable results ('15,000 followers in 6 months')."
      },
      {
        question: "What should NOT be included in a UK/US CV?",
        options: [
          "Professional summary",
          "Work experience",
          "Photo, age, and marital status",
          "Education"
        ],
        correctAnswer: 2,
        explanation: "In UK/US CVs, personal information like photo, age, marital status, and religion should NOT be included — they're irrelevant and can lead to discrimination."
      },
      {
        question: "What are the four sections of a cover letter?",
        options: [
          "Introduction, life story, hobbies, conclusion",
          "Opening/purpose, why this company, why you/qualifications, call to action",
          "Salary requirements, benefits wanted, start date, references",
          "Name, address, phone number, email"
        ],
        correctAnswer: 1,
        explanation: "A cover letter has: opening (role + source), why this company (research), why you (qualifications matching requirements), and call to action (interview request)."
      },
      {
        question: "Why should you tailor each CV and cover letter?",
        options: [
          "It's not necessary — one CV works for all jobs",
          "To use keywords from the job description and show genuine interest",
          "To make each application longer",
          "Because employers compare all applications"
        ],
        correctAnswer: 1,
        explanation: "Tailoring shows you've read the job description carefully, uses their keywords (which applicant tracking systems look for), and demonstrates genuine interest."
      },
      {
        question: "Which is a strong action verb for a CV?",
        options: [
          "Helped",
          "Did",
          "Streamlined",
          "Worked on"
        ],
        correctAnswer: 2,
        explanation: "'Streamlined' is a strong, specific action verb that implies efficiency improvement. 'Helped', 'Did', and 'Worked on' are vague and weak."
      }
    ]
  }
};
