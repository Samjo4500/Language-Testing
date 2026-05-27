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
  },

  "Listening — Accents and Fast Speech": {
    explanation: `<h2>Understanding Accents and Fast Connected Speech</h2>
<p>One of the greatest challenges for intermediate listeners is understanding English as it is naturally spoken by people from different regions and backgrounds. <strong>Connected speech</strong> refers to the way native speakers blend words together in natural conversation, making them sound quite different from the isolated words you may have learned in class. There are three main features of connected speech that you need to recognise: <strong>assimilation</strong>, where sounds change to become more like neighbouring sounds (e.g., "ten bikes" sounds like "tem bikes"); <strong>elision</strong>, where sounds disappear entirely (e.g., "next door" sounds like "nex door"); and <strong>linking</strong>, where words are joined together smoothly (e.g., "an apple" sounds like "a-napple"). These features are not optional — they are a fundamental part of how English is spoken by virtually all native speakers, regardless of accent.</p>
<p>English accents vary enormously, even within the same country. In the United Kingdom alone, you will encounter significant differences between Received Pronunciation (RP, often called "BBC English"), Cockney, Scottish English, Geordie, and many others. In the United States, General American, Southern, New York, and African American Vernacular English (AAVE) each have distinct phonological features. For instance, some American speakers <strong>rhotically</strong> pronounce the /r/ sound in "car" and "hard," while most British speakers do not. Australian English features a distinctive vowel shift, and Indian English has its own rhythm and intonation patterns. Understanding these variations does not mean you need to adopt every accent, but you should be able to <em>comprehend</em> speakers from major English-speaking regions.</p>
<p>When dealing with fast speech, a key strategy is to focus on <strong>stressed words</strong> rather than trying to catch every syllable. In English, content words (nouns, main verbs, adjectives, adverbs) are stressed, while function words (articles, prepositions, auxiliary verbs, pronouns) are often reduced or swallowed. For example, in the sentence "What are you going to do?" the stressed words are "what" and "do," while the rest may sound like "whaddaya gonna." Training your ear to pick out stressed words allows you to reconstruct the meaning even when you miss the unstressed elements. Another effective technique is <strong>shadowing</strong> — repeating after a speaker in real time, imitating their rhythm and intonation, which builds your familiarity with natural speech patterns.</p>
<p>Finally, context is your most powerful tool for decoding fast or accented speech. Before listening, consider what you already know about the topic, the speaker, and the situation. While listening, use <strong>predictive listening</strong>: anticipate what the speaker is likely to say next based on the flow of the conversation. If you miss a word, do not stop and dwell on it — keep listening and use the surrounding information to fill in the gaps. With regular exposure to varied accents through podcasts, films, and conversations with diverse speakers, your comprehension will improve dramatically over time.</p>`,
    examples: [
      {
        sentence: "\"I'm going to\" → \"I'm gonna\" (or even \"I'muna\")",
        note: "Reduction of 'going to' is one of the most common fast-speech features. The vowel in 'to' is reduced and the consonants blend together."
      },
      {
        sentence: "\"What do you\" → \"Whaddaya\" (e.g., \"Whaddaya think?\")",
        note: "Multiple reductions: 'what' loses its final /t/, 'do' becomes /də/, and 'you' becomes /yə/. This is extremely common in casual American and British speech."
      },
      {
        sentence: "\"Hand bag\" → \"Hambag\" (assimilation: /d/ + /b/ → /m/ + /b/)",
        note: "The /d/ sound at the end of 'hand' assimilates to become /m/ because the lips are preparing for the /b/ in 'bag.' This makes the transition between sounds smoother."
      },
      {
        sentence: "\"Next day\" → \"Nex day\" (elision: the /t/ is dropped)",
        note: "In clusters of consonants, the middle consonant /t/ is often elided (dropped) because it is difficult to articulate quickly. 'Next day,' 'last time,' and 'must go' all exhibit this pattern."
      },
      {
        sentence: "\"An English teacher\" → \"a-Nenglish teacher\" (linking)",
        note: "The consonant /n/ at the end of 'an' links directly to the vowel /e/ at the beginning of 'English,' creating the impression of a single word 'Nenglish.' This linking is a defining feature of natural English rhythm."
      },
      {
        sentence: "Scottish speaker: \"I haven't seen him\" (with a rolled /r/ and distinct vowel in 'haven't')",
        note: "Scottish English often rolls the /r/ sound and uses different vowel qualities. Recognising these features helps you identify the accent and adjust your expectations for pronunciation patterns."
      }
    ],
    commonMistakes: [
      {
        mistake: "Expecting every word to be pronounced clearly and separately in natural speech.",
        correction: "Train yourself to listen for stressed content words and use context to fill in the reduced function words."
      },
      {
        mistake: "Asking a speaker to 'speak slowly and clearly' instead of developing skills to understand natural speech.",
        correction: "Practise listening to authentic materials (podcasts, interviews, films) at normal speed to build tolerance for connected speech."
      },
      {
        mistake: "Assuming that unfamiliar pronunciation means the speaker is making a mistake.",
        correction: "Recognise that pronunciation varies across accents — what sounds 'wrong' may simply be a different regional variety of English."
      },
      {
        mistake: "Stopping to think about a missed word and losing the rest of the conversation.",
        correction: "Keep listening and use surrounding context to infer the missed word. Stopping breaks the flow and causes you to miss even more information."
      }
    ],
    quiz: [
      {
        question: "What is 'assimilation' in connected speech?",
        options: [
          "Sounds disappearing entirely between words",
          "Sounds changing to become more like neighbouring sounds",
          "Words being linked together smoothly without a gap",
          "Stress shifting from content words to function words"
        ],
        correctAnswer: 1,
        explanation: "Assimilation occurs when a sound changes to become more like an adjacent sound, making the transition smoother. For example, 'ten bikes' sounds like 'tem bikes' because /n/ assimilates to /m/ before the /b/ sound."
      },
      {
        question: "In the phrase 'next day,' what feature of connected speech causes the /t/ to disappear?",
        options: [
          "Linking",
          "Assimilation",
          "Elision",
          "Reduction"
        ],
        correctAnswer: 2,
        explanation: "Elision is the dropping or omission of sounds in connected speech. In 'next day,' the /t/ is elided because it sits in a consonant cluster that is difficult to articulate quickly, resulting in 'nex day.'"
      },
      {
        question: "Which listening strategy is most effective for understanding fast speech?",
        options: [
          "Trying to hear every single syllable clearly",
          "Focusing on stressed content words and using context to fill in gaps",
          "Asking the speaker to repeat every sentence",
          "Reading a transcript before listening"
        ],
        correctAnswer: 1,
        explanation: "In natural English, content words (nouns, main verbs, adjectives, adverbs) are stressed and clearly pronounced, while function words are often reduced. Focusing on stressed words and using context to reconstruct the rest is the most effective strategy."
      },
      {
        question: "What does 'Whaddaya think?' represent?",
        options: [
          "A Scottish accent pronunciation",
          "A formal way of asking for opinions",
          "The reduction of 'What do you' in fast connected speech",
          "An example of assimilation only"
        ],
        correctAnswer: 2,
        explanation: "'Whaddaya' is the reduced form of 'What do you' in fast casual speech. It involves multiple reductions: the /t/ in 'what' is dropped, 'do' becomes /də/, and 'you' becomes /yə/. This is a very common feature of connected speech."
      },
      {
        question: "Why is it important for intermediate learners to expose themselves to different English accents?",
        options: [
          "Because they need to learn to speak with every accent",
          "Because real-world English is spoken with diverse accents, and comprehension requires familiarity with variations",
          "Because exams always test multiple accents",
          "Because only British English is correct"
        ],
        correctAnswer: 1,
        explanation: "In the real world, English is spoken with many different accents. While you do not need to speak with every accent, you need to be able to understand speakers from various regions. Exposure to different accents builds the flexibility needed for real communication."
      }
    ]
  },

  "Listening — Lectures and Podcasts": {
    explanation: `<h2>Listening to Lectures and Podcasts Effectively</h2>
<p>At the B1-B2 level, you should be developing the ability to follow extended spoken discourse such as university lectures, TED Talks, and educational podcasts. Unlike everyday conversations, lectures and podcasts are <strong>monologues</strong> — one person speaks at length on a topic, often using formal or semi-formal language with complex sentence structures and specialised vocabulary. The key challenge is maintaining concentration over a longer period while identifying the most important information. A lecture is not a dictation exercise; you do not need to capture every word. Instead, you need to identify the <strong>main ideas</strong>, the <strong>supporting details</strong>, and the <strong>logical structure</strong> that holds them together.</p>
<p>Most lectures and well-structured podcasts follow a predictable organisational pattern. Speakers typically begin with an <strong>introduction</strong> that previews the main topic and outlines what they will cover. This is followed by the <strong>body</strong>, where each main point is presented, explained, and illustrated with examples or evidence. Finally, a <strong>conclusion</strong> summarises the key takeaways. Recognising these <strong>signpost phrases</strong> — expressions that signal the structure — is essential for following along. Common signposts include: "Today I'm going to talk about...", "Let's move on to...", "The next point is...", "For example...", "To sum up...", and "In conclusion..." These phrases act as road signs, telling you where the speaker is going and what is most important.</p>
<p>Effective note-taking is a crucial companion skill for listening to lectures and podcasts. The <strong>Cornell Method</strong> is widely recommended: divide your page into three sections — a narrow left column for key words and questions, a wider right column for notes, and a bottom section for a summary. During the lecture, write your notes in the right column, focusing on main ideas rather than full sentences. Use abbreviations, symbols, and bullet points to keep up with the speaker. After the lecture, write key terms and questions in the left column and a brief summary at the bottom. This method forces you to process the information actively rather than passively transcribing it, which significantly improves retention and understanding.</p>
<p>Podcasts offer an excellent opportunity to develop your listening skills in a more flexible format. Unlike live lectures, podcasts can be paused, rewound, and replayed, allowing you to work through difficult sections at your own pace. Start with podcasts designed for language learners, which feature slower speech and simpler vocabulary, then gradually move to native-level content. When you encounter an unfamiliar word, try to infer its meaning from context before reaching for a dictionary. Pay attention to the speaker's <strong>intonation</strong> and <strong>emphasis</strong> — a speaker's voice often rises on important points and falls on less significant details. With consistent practice, your ability to follow extended speech will grow, and you will find yourself understanding more with less effort.</p>`,
    examples: [
      {
        sentence: "\"So, today we're going to look at three main causes of the Industrial Revolution.\"",
        note: "A typical lecture introduction that previews the structure. The signpost 'three main causes' tells you to expect three distinct sections in the body of the talk."
      },
      {
        sentence: "\"Let's move on to the second factor, which is technological innovation.\"",
        note: "A transition signpost that signals a shift from one main point to the next. 'Let's move on to' alerts the listener that a new section is beginning."
      },
      {
        sentence: "\"To illustrate this point, consider the case of Japan in the 1980s.\"",
        note: "An example signpost. 'To illustrate this point' signals that the speaker is about to provide a concrete example to support a general claim."
      },
      {
        sentence: "\"In summary, the three key drivers were population growth, new technologies, and access to resources.\"",
        note: "A conclusion signpost. 'In summary' tells the listener that the speaker is recapping the main points — this is crucial information for note-taking."
      },
      {
        sentence: "\"Now, this is really important — the deadline for submissions is next Friday.\"",
        note: "Emphasis marker: 'this is really important' signals that the following information is a key point. Speakers use emphasis markers to draw attention to critical details."
      }
    ],
    commonMistakes: [
      {
        mistake: "Trying to write down every word the speaker says during a lecture.",
        correction: "Focus on main ideas, key terms, and supporting examples. Use abbreviations and your own words rather than attempting verbatim transcription."
      },
      {
        mistake: "Not paying attention during the introduction of a lecture because it seems 'obvious.'",
        correction: "The introduction often contains the outline and main thesis — this is the most valuable part for understanding the overall structure and anticipating what comes next."
      },
      {
        mistake: "Stopping to look up every unknown word in a dictionary while listening to a podcast.",
        correction: "Keep listening and try to infer meaning from context. Pause and look up words only after finishing a section, so you don't lose the thread of the argument."
      },
      {
        mistake: "Treating all information in a lecture as equally important.",
        correction: "Listen for signpost phrases and emphasis markers that distinguish main points from minor details. Not every sentence carries equal weight."
      }
    ],
    quiz: [
      {
        question: "What is the primary purpose of signpost phrases in a lecture?",
        options: [
          "To make the lecture sound more formal and academic",
          "To signal the structure and guide the listener through the organisation of the talk",
          "To test whether the audience is paying attention",
          "To fill time between sections of the lecture"
        ],
        correctAnswer: 1,
        explanation: "Signpost phrases like 'Let's move on to...' and 'In conclusion...' signal the structure of the lecture, helping listeners follow the logical flow and identify what is most important."
      },
      {
        question: "In the Cornell note-taking method, what goes in the right column during the lecture?",
        options: [
          "Key words and questions written after the lecture",
          "A summary of the entire lecture",
          "Main notes — key ideas, abbreviations, and bullet points",
          "The lecturer's exact words, transcribed verbatim"
        ],
        correctAnswer: 2,
        explanation: "In the Cornell Method, the right column is used during the lecture for main notes — key ideas, abbreviations, and bullet points. The left column and summary section are completed after the lecture."
      },
      {
        question: "Why are podcasts particularly useful for developing listening skills at the intermediate level?",
        options: [
          "They always use very simple vocabulary",
          "They can be paused, rewound, and replayed, allowing self-paced learning",
          "They are always shorter than lectures",
          "They never contain unfamiliar accents"
        ],
        correctAnswer: 1,
        explanation: "Podcasts can be paused, rewound, and replayed, which allows learners to work through difficult sections at their own pace — something that is not possible during a live lecture."
      },
      {
        question: "Which of the following is an example of a 'transition' signpost?",
        options: [
          "\"For instance, in Germany...\"",
          "\"Let's move on to the next factor...\"",
          "\"In conclusion, we can see that...\"",
          "\"This is crucial: the exam is on Monday.\""
        ],
        correctAnswer: 1,
        explanation: "'Let's move on to the next factor' is a transition signpost — it signals a shift from one main point to the next. 'For instance' is an example signpost, 'In conclusion' is a summary signpost, and 'This is crucial' is an emphasis marker."
      },
      {
        question: "What should you do when you hear an unfamiliar word during a lecture or podcast?",
        options: [
          "Immediately stop and look it up in a dictionary",
          "Ignore it completely and never think about it again",
          "Try to infer its meaning from the surrounding context and continue listening",
          "Raise your hand and ask the speaker to define it"
        ],
        correctAnswer: 2,
        explanation: "The best approach is to try to infer the meaning from context and continue listening. Stopping to look up a word will cause you to miss the rest of the speaker's point, and ignoring it entirely means you might miss important meaning. Context clues often provide enough information to understand the general idea."
      }
    ]
  },

  "Speaking — Fluency and Coherence Techniques": {
    explanation: `<h2>Building Fluency and Coherence in Speaking</h2>
<p>Fluency and coherence are two distinct but closely related qualities of effective speaking. <strong>Fluency</strong> refers to the ability to speak smoothly, continuously, and at an appropriate speed, without excessive hesitation, repetition, or self-correction. <strong>Coherence</strong> refers to the logical organisation of your ideas — how clearly your thoughts connect to each other and how easily a listener can follow your argument. At the intermediate level, many learners can produce grammatically correct sentences in isolation but struggle to maintain a smooth, well-organised flow of speech over an extended turn. Developing both skills together is essential for confident, effective communication.</p>
<p>One of the most important techniques for improving fluency is learning to use <strong>fillers and discourse markers</strong> strategically. Fillers such as "well," "you know," "I mean," and "let me think" give you a moment to plan your next sentence without creating an awkward silence. Discourse markers like "on the other hand," "in addition," "as a result," and "however" signal the relationship between your ideas and help the listener follow your train of thought. The key is to use these expressions naturally — overusing fillers can make you sound uncertain, while using too few can make your speech sound choppy and disconnected. Aim for a balance where fillers serve as brief planning pauses and discourse markers provide clear signposting.</p>
<p>Coherence is achieved through several interlocking strategies. First, use a clear <strong>organisational structure</strong>: introduce your topic, develop your points in a logical order, and conclude with a summary or opinion. Second, use <strong>linking words and phrases</strong> to connect your sentences: "First of all," "Another reason is," "Furthermore," "In contrast," and "Therefore" all show the relationship between ideas. Third, use <strong>referencing</strong> to avoid repetition — instead of repeating a noun, use pronouns ("it," "they," "this") or synonyms. For example, instead of saying "The environment is important. The environment is threatened by pollution. We must protect the environment," say "The environment is important. It is threatened by pollution, and we must protect it." These techniques create a smooth, connected flow that is much easier to follow.</p>
<p>Practical fluency-building exercises include <strong>timed speaking</strong> (talk about a topic for one minute without stopping), <strong>4/3/2 technique</strong> (deliver the same content three times, first in four minutes, then three, then two, forcing yourself to become more concise and fluent), and <strong>shadowing</strong> (repeating after a native speaker to internalise natural rhythm and intonation). Recording yourself and analysing the playback is also invaluable — you will notice hesitation patterns, repeated fillers, and organisational gaps that you might not be aware of while speaking. The goal is not perfection but <em>continuous improvement</em>: each practice session should feel slightly smoother than the last.</p>`,
    examples: [
      {
        sentence: "\"Well, I think that social media has both positive and negative effects. On the one hand, it connects people. On the other hand, it can be quite addictive.\"",
        note: "'Well' is a filler that gives a moment to plan. 'On the one hand / On the other hand' is a discourse marker pair that signals contrasting ideas, improving coherence."
      },
      {
        sentence: "\"There are several reasons for this. First of all, the cost of living has risen. Furthermore, wages have not kept pace with inflation.\"",
        note: "'First of all' and 'Furthermore' are sequential discourse markers that organise ideas in a logical order, making the argument easy to follow."
      },
      {
        sentence: "\"I went to Paris last year. It was amazing. This city has so much to offer — the food, the architecture, everything.\"",
        note: "'It' and 'This city' are referencing devices that avoid repeating 'Paris.' Using pronouns and demonstratives creates a smooth, connected flow."
      },
      {
        sentence: "\"I mean, the situation is complicated. Let me put it this way — the government wants to reduce emissions, but at the same time, the economy depends on industry.\"",
        note: "'I mean' and 'Let me put it this way' are fillers that buy thinking time and signal a clarification. 'At the same time' signals a contrast within the same situation."
      },
      {
        sentence: "\"So, to sum up, I believe that education is the key to solving this problem. Therefore, we should invest more in schools and training programmes.\"",
        note: "'So' signals a shift to conclusion. 'To sum up' explicitly marks the summary. 'Therefore' signals a logical consequence, linking the belief to the recommendation."
      }
    ],
    commonMistakes: [
      {
        mistake: "Using long silences instead of fillers when searching for words, making the speech sound broken.",
        correction: "Use brief fillers like 'well,' 'let me think,' or 'you see' to fill the pause naturally while you plan your next words."
      },
      {
        mistake: "Overusing a single filler (e.g., saying 'like' or 'you know' in every sentence).",
        correction: "Vary your fillers and discourse markers. Use 'well,' 'I mean,' 'actually,' 'basically,' and others to avoid repetition and sound more natural."
      },
      {
        mistake: "Jumping between ideas without linking words, creating a disconnected, hard-to-follow narrative.",
        correction: "Use discourse markers (however, furthermore, as a result) and referencing (it, this, such) to connect your ideas into a coherent whole."
      },
      {
        mistake: "Repeating the same noun over and over instead of using pronouns or synonyms.",
        correction: "Use referencing: replace repeated nouns with 'it,' 'they,' 'this,' 'that,' or synonyms. For example, 'the project ... it ... this initiative.'"
      }
    ],
    quiz: [
      {
        question: "What is the difference between fluency and coherence?",
        options: [
          "Fluency is about grammar; coherence is about vocabulary",
          "Fluency is about speaking smoothly without excessive hesitation; coherence is about organising ideas logically",
          "Fluency is about using big words; coherence is about using short sentences",
          "There is no real difference — they mean the same thing"
        ],
        correctAnswer: 1,
        explanation: "Fluency refers to the smoothness and continuity of speech — speaking without too many pauses, hesitations, or self-corrections. Coherence refers to how logically and clearly your ideas are organised and connected. Both are needed for effective communication."
      },
      {
        question: "Which of the following is a discourse marker that signals a contrast?",
        options: [
          "Furthermore",
          "On the other hand",
          "Therefore",
          "First of all"
        ],
        correctAnswer: 1,
        explanation: "'On the other hand' introduces a contrasting or opposing idea. 'Furthermore' adds information, 'Therefore' shows a result, and 'First of all' begins a sequence."
      },
      {
        question: "What is the 4/3/2 technique for building fluency?",
        options: [
          "Speak for 4 minutes, then 3 minutes, then 2 minutes on the same topic, becoming more concise each time",
          "Read a text 4 times, summarise it in 3 sentences, then discuss it for 2 minutes",
          "Listen to a 4-minute audio, take 3 minutes of notes, then speak for 2 minutes",
          "Write 4 paragraphs, reduce to 3, then deliver in 2 minutes"
        ],
        correctAnswer: 0,
        explanation: "The 4/3/2 technique involves delivering the same content three times — first in four minutes, then three, then two. This forces you to become more concise, reduce hesitation, and speak more fluently with each repetition."
      },
      {
        question: "Why is it important to use fillers like 'well' or 'I mean' in spoken English?",
        options: [
          "They make you sound more intelligent",
          "They give you a moment to plan your next sentence without creating an awkward silence",
          "They are required by English grammar rules",
          "They replace the need for discourse markers"
        ],
        correctAnswer: 1,
        explanation: "Fillers like 'well' and 'I mean' serve a practical purpose: they fill a brief pause while you plan your next words, preventing awkward silences and keeping the flow of speech. They are a natural part of spoken English, not a sign of weakness."
      },
      {
        question: "Which sentence uses referencing effectively to avoid repetition?",
        options: [
          "\"Climate change is a serious problem. Climate change affects everyone. We must address climate change.\"",
          "\"Climate change is a serious problem. It affects everyone, and we must address it.\"",
          "\"Climate change is a serious problem. This thing affects everyone. We must address the thing.\"",
          "\"Climate change is serious. Everyone is affected. Address it now.\""
        ],
        correctAnswer: 1,
        explanation: "Option B uses 'it' as a pronoun to reference 'climate change,' avoiding the repetitive and awkward re-statement of the full noun phrase. This creates a smooth, natural flow while maintaining clarity."
      }
    ]
  },

  "Speaking — Describing and Comparing in Detail": {
    explanation: `<h2>Describing and Comparing in Detail</h2>
<p>At the intermediate level, you need to move beyond simple descriptions like "It's nice" or "They are different" towards richer, more detailed comparisons and descriptions. Effective description involves using a range of <strong>adjectives and adverbs</strong> with appropriate degree modifiers (e.g., "slightly larger," "significantly more expensive," "by far the most impressive"), as well as <strong>spatial and sequential language</strong> to organise your description logically. When describing an object, place, or process, you should cover key aspects such as appearance, function, size, material, and distinctive features. When comparing, you should identify both <strong>similarities</strong> and <strong>differences</strong>, using structures that highlight the degree and nature of the comparison.</p>
<p>For detailed comparisons, intermediate speakers should master several key structures. <strong>Comparative + than</strong> is the foundation: "The new model is considerably faster than the old one." <strong>Not as... as</strong> expresses a negative comparison: "The hotel was not as luxurious as we expected." <strong>Whereas / while</strong> introduces a contrast: "City life is fast-paced, whereas rural life tends to be more relaxed." <strong>Similar to / different from</strong> states comparison directly: "The Japanese education system is similar to the Korean one in many respects." <strong>In contrast / on the contrary</strong> signals a strong difference: "The north of the country is mountainous; in contrast, the south is mostly flat." Using a variety of these structures, rather than repeating "more than" or "different," makes your speech more sophisticated and precise.</p>
<p>When describing something in detail, it is important to follow a <strong>logical order</strong>. For physical objects or places, you might move from general to specific: start with an overall impression, then describe individual features. For processes, use <strong>sequential language</strong>: "First, the raw materials are collected. Next, they are processed. Then, they are assembled. Finally, the finished product is inspected." For people, you might cover appearance, personality, and achievements in sequence. Using organisational patterns like these helps the listener form a clear mental image and demonstrates your ability to structure extended speech — a skill assessed in exams like IELTS and Cambridge B2 First.</p>
<p>A common pitfall is relying on vague or generic adjectives. Words like "nice," "good," "bad," "big," and "small" convey very little specific information. Instead, use more precise alternatives: "spacious" instead of "big," "dilapidated" instead of "bad condition," "breathtaking" instead of "nice," and "minute" instead of "small." Degree modifiers add further precision: rather than saying "very different," say "strikingly different" or "marginally different" depending on the actual degree. Building a rich descriptive vocabulary is one of the most impactful things you can do to improve your speaking at this level.</p>`,
    examples: [
      {
        sentence: "\"The cathedral is significantly older than the town hall, dating back to the 12th century, whereas the town hall was built in the 18th century.\"",
        note: "'Significantly older' uses a degree modifier for precision. 'Whereas' introduces a clear contrast between the two buildings' ages."
      },
      {
        sentence: "\"The two cities are similar in terms of population size, but they differ markedly in their cultural offerings.\"",
        note: "'Similar in terms of' and 'differ markedly in' are sophisticated comparative structures that go beyond simple 'same/different' language."
      },
      {
        sentence: "\"The apartment is not as spacious as we were led to believe — the living room is barely large enough for a sofa and a coffee table.\"",
        note: "'Not as spacious as' expresses a negative comparison, followed by a specific detail that illustrates the point, making the description vivid and convincing."
      },
      {
        sentence: "\"First, you'll see the main entrance with its ornate wooden doors. Moving inside, the foyer features a marble floor and a grand staircase. Beyond that, the gallery rooms are arranged in a circular layout.\"",
        note: "Spatial organisation using sequencing phrases ('First,' 'Moving inside,' 'Beyond that') guides the listener through a physical space in a logical order."
      },
      {
        sentence: "\"The landscape here is strikingly different from what I'm used to — instead of rolling green hills, there are dramatic red sandstone cliffs stretching to the horizon.\"",
        note: "'Strikingly different from' is a strong comparative phrase. The description then provides a vivid contrast using specific imagery rather than vague terms."
      },
      {
        sentence: "\"While both courses cover the same core topics, the online version is considerably more flexible, allowing students to study at their own pace.\"",
        note: "'While' introduces a concession (similarity), and 'considerably more flexible' introduces the key difference with a precise degree modifier."
      }
    ],
    commonMistakes: [
      {
        mistake: "\"It is more big than the other one.\"",
        correction: "\"It is bigger than the other one.\" (Short adjectives use -er, not 'more + adjective.')"
      },
      {
        mistake: "\"The weather is same as yesterday.\"",
        correction: "\"The weather is the same as yesterday.\" (The definite article 'the' is required before 'same.')"
      },
      {
        mistake: "Using vague language: \"The city is very nice and very big and very different from my town.\"",
        correction: "Use precise vocabulary: \"The city is vibrant and sprawling, with a cultural scene that contrasts sharply with my quiet hometown.\""
      },
      {
        mistake: "\"It is different of what I expected.\"",
        correction: "\"It is different from what I expected.\" (The correct preposition after 'different' is 'from,' not 'of.')"
      }
    ],
    quiz: [
      {
        question: "Which sentence uses a precise degree modifier correctly?",
        options: [
          "The new phone is very more expensive than the old one.",
          "The new phone is slightly more expensive than the old one.",
          "The new phone is more expensiver than the old one.",
          "The new phone is much expensive than the old one."
        ],
        correctAnswer: 1,
        explanation: "'Slightly more expensive' correctly uses a degree modifier ('slightly') before a comparative adjective ('more expensive'). 'Very more expensive' is incorrect ('very' doesn't modify comparatives), 'more expensiver' is a double comparative, and 'much expensive' lacks the comparative form."
      },
      {
        question: "Which structure is used to express a negative comparison?",
        options: [
          "more... than",
          "not as... as",
          "whereas",
          "similar to"
        ],
        correctAnswer: 1,
        explanation: "'Not as... as' expresses a negative comparison, meaning something is less than something else in quality or degree. For example: 'The film was not as exciting as the book.'"
      },
      {
        question: "What is the best way to organise a description of a physical place?",
        options: [
          "List random features as they come to mind",
          "Use only superlative adjectives",
          "Follow a logical spatial order, such as general impression → exterior → interior → details",
          "Describe the smallest details first, then the largest"
        ],
        correctAnswer: 2,
        explanation: "A logical spatial order — moving from general impression to specific features — helps the listener build a clear mental image. Jumping randomly between features makes the description confusing and hard to follow."
      },
      {
        question: "Which of the following is a more precise alternative to 'very big'?",
        options: [
          "Really large",
          "Spacious or sprawling (depending on context)",
          "Big big",
          "More big"
        ],
        correctAnswer: 1,
        explanation: "'Spacious' or 'sprawling' are precise, vivid alternatives to 'very big.' 'Spacious' implies generous interior space, while 'sprawling' suggests something spread out over a large area. Using specific vocabulary is always better than stacking intensifiers."
      },
      {
        question: "Complete the comparison: 'The two programmes are similar ___ many respects, but they differ markedly ___ their approach to assessment.'",
        options: [
          "in / from",
          "in / in",
          "to / from",
          "from / in"
        ],
        correctAnswer: 1,
        explanation: "The correct phrases are 'similar in many respects' and 'differ in their approach.' Both use the preposition 'in' to specify the area of similarity or difference. 'Different from' is the standard preposition for 'different,' but 'differ in' is correct for specifying the aspect."
      }
    ]
  },

  "Speaking — Expressing and Justifying Opinions": {
    explanation: `<h2>Expressing and Justifying Opinions Effectively</h2>
<p>At the B1-B2 level, you are expected not only to state your opinion but also to <strong>justify</strong> it with reasons, examples, and evidence. Simply saying "I think it is good" or "I disagree" is no longer sufficient — you need to explain <em>why</em> you hold that view and support it with logical arguments. There are several useful phrases for introducing opinions: <strong>"In my opinion," "I firmly believe that," "From my perspective," "As far as I am concerned,"</strong> and <strong>"It seems to me that."</strong> These expressions signal to the listener that what follows is your personal viewpoint, not a fact, and they give your speech a more considered, mature quality.</p>
<p>Justifying an opinion requires a clear <strong>reason-result structure</strong>. After stating your opinion, use phrases like "because," "since," "The main reason is that," or "This is due to" to introduce your reasoning. Then, provide a <strong>concrete example</strong> or piece of evidence: "For instance," "A good example of this is," or "This can be seen in the case of..." For example: "In my opinion, remote work should be encouraged. The main reason is that it reduces commuting time, which improves work-life balance. For instance, a friend of mine saved two hours a day after switching to remote work, and her productivity actually increased." This three-part structure — <strong>opinion → reason → example</strong> — is the foundation of persuasive spoken argument.</p>
<p>It is equally important to be able to express <strong>disagreement politely</strong> and <strong>acknowledge opposing views</strong>. Phrases like "I see your point, but..." "I understand what you are saying, however..." and "That may be true, but I would argue that..." allow you to disagree without being confrontational. Acknowledging the other side before presenting your own view is a sign of strong argumentation: "While it is true that social media can be a useful tool for communication, I believe its negative effects on mental health outweigh the benefits." This balanced approach demonstrates both linguistic skill and critical thinking.</p>
<p>A common weakness at this level is the overuse of "I think" as the only opinion phrase. While "I think" is perfectly correct, repeating it in every sentence makes your speech sound monotonous and limits your expressive range. Vary your opinion phrases according to the strength of your view: "I tend to think that" (mild), "I believe that" (moderate), "I am convinced that" (strong), "I strongly believe that" (very strong). Similarly, when you are unsure, use hedging language: "It could be argued that," "It seems likely that," or "There is a chance that." These nuances allow you to express degrees of certainty and make your arguments more sophisticated.</p>`,
    examples: [
      {
        sentence: "\"In my opinion, learning a second language should be compulsory in schools. The main reason is that it broadens students' cultural understanding and improves cognitive skills.\"",
        note: "The opinion is introduced with 'In my opinion,' followed by justification with 'The main reason is that.' This creates a clear opinion-reason structure."
      },
      {
        sentence: "\"I see your point about the cost, but I would argue that the long-term benefits of investing in renewable energy far outweigh the initial expenses.\"",
        note: "A polite disagreement that acknowledges the opposing view ('I see your point') before presenting a counter-argument ('but I would argue that')."
      },
      {
        sentence: "\"I am convinced that universal healthcare is essential. For instance, countries like Sweden and Japan, which have such systems, consistently rank highest in quality-of-life indices.\"",
        note: "'I am convinced that' expresses a strong opinion. 'For instance' introduces concrete evidence from specific countries to support the claim."
      },
      {
        sentence: "\"While it is true that technology can be distracting, it seems to me that its benefits — particularly in education and healthcare — are undeniable.\"",
        note: "'While it is true that' acknowledges a counter-argument. 'It seems to me that' introduces the speaker's opposing view in a balanced, non-confrontational way."
      },
      {
        sentence: "\"I tend to think that remote learning works better for some students than others, since it requires a high degree of self-discipline.\"",
        note: "'I tend to think that' expresses a mild or qualified opinion. 'Since' introduces a reason that explains the nuance in the opinion."
      }
    ],
    commonMistakes: [
      {
        mistake: "Stating an opinion without any justification: \"I think it is bad.\"",
        correction: "Always follow your opinion with a reason and ideally an example: \"I think it is bad because it discourages creativity, and for instance, students in strict systems often report lower motivation.\""
      },
      {
        mistake: "Using 'I think' in every sentence when expressing opinions.",
        correction: "Vary your opinion phrases: 'In my view,' 'I firmly believe,' 'From my perspective,' 'As far as I'm concerned,' and 'I am convinced that' all provide variety and nuance."
      },
      {
        mistake: "Disagreeing too bluntly: \"You are wrong.\"",
        correction: "Disagree politely: \"I see your point, but I have a different perspective on this,\" or \"I understand what you're saying, but I would argue that...\""
      },
      {
        mistake: "Presenting opinions as facts: \"This is the best approach.\"",
        correction: "Use hedging language to signal that this is your view: \"In my opinion, this seems to be the best approach,\" or \"It could be argued that this is the most effective approach.\""
      }
    ],
    quiz: [
      {
        question: "Which phrase expresses a STRONG opinion?",
        options: [
          "I tend to think that",
          "I am convinced that",
          "It could be argued that",
          "It seems to me that"
        ],
        correctAnswer: 1,
        explanation: "'I am convinced that' expresses a strong, firm opinion. 'I tend to think that' is mild, 'It could be argued that' is a hedge (not even the speaker's own opinion necessarily), and 'It seems to me that' is moderate."
      },
      {
        question: "What is the three-part structure recommended for justifying an opinion?",
        options: [
          "Fact → Opinion → Conclusion",
          "Opinion → Reason → Example",
          "Example → Reason → Opinion",
          "Introduction → Body → Conclusion"
        ],
        correctAnswer: 1,
        explanation: "The recommended structure is Opinion → Reason → Example. First state your view, then explain why you hold it, then provide a concrete example or piece of evidence to support your reasoning."
      },
      {
        question: "Which phrase is used to politely disagree with someone?",
        options: [
          "You are completely wrong.",
          "I see your point, but I would argue that...",
          "That is a stupid idea.",
          "No, I disagree completely."
        ],
        correctAnswer: 1,
        explanation: "'I see your point, but I would argue that...' acknowledges the other person's view before presenting your counter-argument. This is polite and shows you have considered the opposing view, which strengthens your own argument."
      },
      {
        question: "What is 'hedging' in the context of expressing opinions?",
        options: [
          "Avoiding expressing any opinion at all",
          "Using language that expresses uncertainty or qualification, such as 'It could be argued that'",
          "Repeating your opinion several times for emphasis",
          "Agreeing with every viewpoint to avoid conflict"
        ],
        correctAnswer: 1,
        explanation: "Hedging means using language that softens or qualifies a claim, expressing a degree of uncertainty. Phrases like 'It could be argued that,' 'It seems likely that,' and 'There is a chance that' are all hedging devices. They make your arguments more nuanced and careful."
      },
      {
        question: "Why should you avoid using only 'I think' when expressing opinions?",
        options: [
          "Because 'I think' is grammatically incorrect",
          "Because it makes your speech sound monotonous and limits your ability to express different degrees of certainty",
          "Because native speakers never use 'I think'",
          "Because 'I think' is too informal for any situation"
        ],
        correctAnswer: 1,
        explanation: "While 'I think' is grammatically correct and commonly used, relying on it exclusively makes your speech repetitive and prevents you from expressing the strength of your conviction. Using a range of phrases ('I believe,' 'I am convinced,' 'I tend to think') allows you to convey varying degrees of certainty."
      }
    ]
  },

  "Reading — Inference and Critical Analysis": {
    explanation: `<h2>Reading Between the Lines: Inference and Critical Analysis</h2>
<p>At the intermediate level, reading comprehension goes well beyond understanding the literal meaning of words on a page. <strong>Inference</strong> is the ability to read between the lines — to understand meanings that are implied but not directly stated. Writers often suggest ideas through tone, word choice, and context rather than spelling them out explicitly. For example, if a text describes a character who "forced a smile and turned away," you can infer that the character is unhappy or uncomfortable, even though the text never says "she was sad." Developing inference skills allows you to understand the full meaning of a text, including the author's attitudes, the subtext, and the implications that lie beneath the surface.</p>
<p>Critical analysis takes inference a step further by asking you to <strong>evaluate</strong> what you read, not just understand it. This means questioning the author's purpose, identifying bias, assessing the strength of evidence, and recognising persuasive techniques. When reading critically, you should ask questions like: <em>What is the author trying to achieve? Is the argument supported by evidence? Are there logical fallacies? Does the author use emotional language to manipulate the reader? Are alternative viewpoints acknowledged?</em> Critical readers do not accept information passively — they engage with the text, weighing its strengths and weaknesses before forming their own judgement. This skill is essential not only for academic reading but also for navigating the vast amounts of information encountered in daily life, from news articles to advertisements.</p>
<p>Several language clues can help you make inferences while reading. <strong>Connotation</strong> — the emotional associations of words beyond their literal meaning — is a powerful signal. For instance, describing a government policy as "draconian" (harsh, oppressive) conveys strong disapproval, while calling it "robust" (strong, effective) conveys approval. <strong>Tone</strong> — the author's attitude towards the subject — can be identified through word choice, sentence structure, and rhetorical devices. A text that uses ironic statements, rhetorical questions, or loaded vocabulary may be expressing a very different meaning from what the words literally say. Recognising these clues is key to accurate inference.</p>
<p>Practising critical analysis involves reading a variety of text types — opinion pieces, editorials, reviews, and persuasive essays — where the author's viewpoint is central. As you read, annotate the text: highlight claims, underline supporting evidence, and note any logical gaps or unsupported assertions. Compare how different sources treat the same topic and consider why they might differ. Over time, you will develop the habit of reading with a questioning mind, which is the hallmark of a proficient, independent reader at B2 level and beyond.</p>`,
    examples: [
      {
        sentence: "\"The company described its recent losses as 'a temporary adjustment period.'\"",
        note: "Inference: The company is downplaying its financial troubles. The euphemistic phrase 'temporary adjustment period' implies the situation may be more serious than the company admits."
      },
      {
        sentence: "\"Despite the new regulations, factories continue to discharge waste into the river, and local residents report a noticeable increase in skin complaints.\"",
        note: "Critical analysis: The word 'despite' signals that the regulations are ineffective. The juxtaposition of continued pollution with health effects implies a causal link the author wants the reader to draw."
      },
      {
        sentence: "\"The so-called 'reform' has done nothing but increase the burden on ordinary families.\"",
        note: "The phrase 'so-called' and the quotation marks around 'reform' show the author's scepticism — they do not believe the policy deserves to be called a reform. This is an example of critical tone through word choice."
      },
      {
        sentence: "\"While some experts claim the technology is safe, others have raised concerns about its long-term environmental impact.\"",
        note: "The author presents both sides but uses 'while' to signal a contrast. The structure suggests the author may lean towards the concerns, as the second clause is given more weight by being the main clause."
      },
      {
        sentence: "\"She stared at the letter for a long time before carefully placing it in the drawer, unread.\"",
        note: "Inference: The character's hesitation and the act of putting the letter away unread suggest she is afraid of or unwilling to face its contents. The emotional subtext is conveyed entirely through actions, not statements."
      }
    ],
    commonMistakes: [
      {
        mistake: "Confusing inference with guessing without evidence — making assumptions that are not supported by the text.",
        correction: "Inferences must be based on textual evidence. Always ask: 'What specific words or phrases in the text support my inference?' If you cannot point to evidence, it is a guess, not an inference."
      },
      {
        mistake: "Taking everything the author writes at face value without considering bias or purpose.",
        correction: "Ask critical questions: What is the author's purpose? What evidence is provided? Are alternative viewpoints considered? Is the language neutral or loaded?"
      },
      {
        mistake: "Assuming that a text's meaning is always straightforward and literal.",
        correction: "Pay attention to connotation, tone, irony, and implied meanings. Writers often communicate more between the lines than directly on them."
      },
      {
        mistake: "Confusing the author's opinion with fact in persuasive or opinion texts.",
        correction: "Distinguish between factual statements (verifiable claims) and opinions (judgements or beliefs). Language clues like 'I believe,' 'arguably,' and 'perhaps' signal opinions."
      }
    ],
    quiz: [
      {
        question: "What is the key difference between inference and a guess?",
        options: [
          "There is no difference; they mean the same thing",
          "An inference is based on textual evidence, while a guess is not supported by the text",
          "An inference is always correct, while a guess is always wrong",
          "A guess is made before reading, while an inference is made after"
        ],
        correctAnswer: 1,
        explanation: "An inference is a logical conclusion drawn from evidence in the text, while a guess is an assumption made without supporting evidence. Inferences must always be grounded in what the text actually says or implies."
      },
      {
        question: "If an author describes a policy as 'draconian,' what can you infer about their attitude?",
        options: [
          "They approve of the policy",
          "They are neutral about the policy",
          "They strongly disapprove of the policy",
          "They are confused about the policy"
        ],
        correctAnswer: 2,
        explanation: "'Draconian' means extremely harsh and oppressive. By choosing this word with strongly negative connotations, the author signals disapproval of the policy. This is an inference based on word choice (connotation)."
      },
      {
        question: "What does the phrase 'so-called' before a word typically signal?",
        options: [
          "The author agrees with the term being used",
          "The author is sceptical or dismissive of the term",
          "The author is defining the term for the reader",
          "The author is quoting a scientific source"
        ],
        correctAnswer: 1,
        explanation: "'So-called' typically signals the author's scepticism or distancing — they do not fully accept the validity of the term that follows. For example, 'the so-called experts' implies the author questions whether these people are truly experts."
      },
      {
        question: "Which of the following is a question a critical reader should ask?",
        options: [
          "How many pages does this text have?",
          "Is the argument supported by evidence, or are there logical gaps?",
          "What font is the text written in?",
          "Who printed this text?"
        ],
        correctAnswer: 1,
        explanation: "Critical readers evaluate the quality of arguments by asking whether claims are supported by evidence and whether the reasoning is sound. This is the core of critical analysis — engaging with the content rather than accepting it passively."
      },
      {
        question: "In the sentence 'She forced a smile and turned away,' what can be inferred?",
        options: [
          "She was genuinely happy",
          "She was pretending to be happy but was actually upset or uncomfortable",
          "She was laughing at a joke",
          "She was excited about something"
        ],
        correctAnswer: 1,
        explanation: "The verb 'forced' implies the smile was not genuine — it required effort because her real emotion was different. 'Turned away' suggests she did not want the other person to see her true feelings. Together, these details imply she was masking unhappiness or discomfort."
      }
    ]
  },

  "Reading — Skimming and Scanning Mastery": {
    explanation: `<h2>Mastering Skimming and Scanning Techniques</h2>
<p><strong>Skimming</strong> and <strong>scanning</strong> are two essential rapid-reading techniques that every intermediate learner must master. Skimming means reading quickly to get a <strong>general overview</strong> of a text — its main topic, structure, and key ideas — without reading every word. Scanning means searching a text quickly for <strong>specific information</strong> — a name, a date, a number, or a particular keyword — without reading the surrounding text in detail. Both skills are distinct from careful reading and serve different purposes, but together they allow you to navigate long texts efficiently and locate information quickly, which is crucial in academic, professional, and exam settings.</p>
<p>Effective skimming involves reading strategically rather than randomly. Start with the <strong>title and headings</strong> — these tell you the topic and structure. Read the <strong>first sentence of each paragraph</strong> (the topic sentence), which usually contains the main idea. Glance at the <strong>first and last paragraphs</strong> of the text, as these typically contain the introduction and conclusion. Look at any <strong>visual elements</strong> such as charts, graphs, or images with captions, as they often summarise key data. Skip detailed examples, statistics, and supporting evidence on your first pass — you can always return to them if needed. The goal is to answer the question "What is this text about, and what are its main points?" in a fraction of the time it would take to read every word.</p>
<p>Scanning requires a different approach. Before scanning, you must know exactly what you are looking for — a <strong>specific piece of information</strong>. If you are looking for a name, train your eyes to sweep the page looking for capitalised words. If you are looking for a date, look for numbers. If you are looking for a definition, scan for terms in bold or italic, or for phrases like "is defined as" or "refers to." Do not read complete sentences while scanning — your eyes should move rapidly across and down the page in a systematic pattern (often an S-shape or Z-shape), stopping only when they register the target information. Once you locate it, you can read the surrounding context carefully to confirm it answers your question.</p>
<p>Both skills improve with practice and are tested directly in exams such as IELTS, TOEFL, and Cambridge B2 First. A common mistake is trying to read every word when you only need a general overview (skimming situation) or when you only need one specific fact (scanning situation). This wastes time and can actually reduce comprehension because you lose sight of the bigger picture while focusing on irrelevant details. The most effective readers move fluidly between skimming, scanning, and careful reading depending on the task, choosing the appropriate strategy for each situation. Developing this flexibility is a hallmark of a confident, efficient reader.</p>`,
    examples: [
      {
        sentence: "Task: Find out what year the company was founded. → Scan for numbers and the keyword 'founded' or 'established.'",
        note: "When scanning for a date, let your eyes move rapidly over the text, stopping only when you see a number near the keywords 'founded' or 'established.' Do not read full sentences."
      },
      {
        sentence: "Task: Get the general idea of a 3-page article on renewable energy. → Skim by reading the title, subheadings, first sentence of each paragraph, and the conclusion.",
        note: "Skimming strategy: title gives the topic, subheadings reveal the structure, first sentences give main ideas, and the conclusion summarises the argument. This takes 2-3 minutes instead of 15."
      },
      {
        sentence: "Task: Find the author's definition of 'sustainability.' → Scan for the word in bold/italic or phrases like 'is defined as' or 'means.'",
        note: "Definitions are often highlighted typographically or signalled by phrases like 'is defined as,' 'refers to,' or 'by X we mean.' Scan for these patterns rather than reading the whole text."
      },
      {
        sentence: "Task: Determine whether an article supports or opposes a new law. → Skim the introduction and conclusion, and look for opinion markers like 'should,' 'must,' 'unfortunately,' or 'fortunately.'",
        note: "The author's stance is usually clearest in the introduction and conclusion. Opinion markers reveal attitude without needing to read every supporting paragraph."
      },
      {
        sentence: "Task: Find the price of a specific product in a catalogue. → Scan for the product name (capitalised or bold), then look for a currency symbol near it.",
        note: "Scanning for prices: locate the product name first, then narrow your search to the immediately surrounding text for a number with a currency symbol (£, $, €)."
      }
    ],
    commonMistakes: [
      {
        mistake: "Reading every word when you only need a general overview of the text.",
        correction: "Use skimming: read the title, headings, first sentence of each paragraph, and the conclusion. Skip details, examples, and statistics on your first pass."
      },
      {
        mistake: "Reading entire sentences when scanning for a specific name, date, or number.",
        correction: "When scanning, let your eyes move quickly across the page looking only for the visual pattern of your target (capitalised words for names, digits for dates/numbers). Stop only when you find it."
      },
      {
        mistake: "Skimming without a clear purpose — just 'glancing' at the text without trying to identify main ideas.",
        correction: "Always skim with a question in mind: 'What is the main topic?' 'What are the key arguments?' This focuses your attention and makes skimming purposeful."
      },
      {
        mistake: "Using only one reading strategy for all tasks instead of choosing the appropriate technique.",
        correction: "Match your strategy to the task: skim for general understanding, scan for specific facts, and read carefully for detailed comprehension. Flexibility is key."
      }
    ],
    quiz: [
      {
        question: "What is the main difference between skimming and scanning?",
        options: [
          "Skimming is for short texts; scanning is for long texts",
          "Skimming gets a general overview; scanning finds specific information",
          "Skimming is slower than scanning",
          "There is no real difference between them"
        ],
        correctAnswer: 1,
        explanation: "Skimming is reading quickly for a general understanding of the text's main ideas and structure. Scanning is searching rapidly for a specific piece of information like a name, date, or keyword. They serve different purposes and use different techniques."
      },
      {
        question: "When skimming a text, which part should you always read?",
        options: [
          "Every word in every paragraph",
          "Only the last paragraph",
          "The title, headings, and the first sentence of each paragraph",
          "The bibliography and footnotes"
        ],
        correctAnswer: 2,
        explanation: "When skimming, focus on the title and headings (for topic and structure) and the first sentence of each paragraph (for main ideas). This gives you the overall picture without reading every word."
      },
      {
        question: "You need to find the population of Tokyo in a 500-page report. Which strategy should you use?",
        options: [
          "Skim the entire report from beginning to end",
          "Read every page carefully until you find the information",
          "Scan for the word 'Tokyo' and numbers near it, possibly using the index first",
          "Read only the introduction and conclusion"
        ],
        correctAnswer: 2,
        explanation: "This is a scanning task — you need a specific piece of information. Scan for 'Tokyo' and nearby numbers, or check the index first to locate the relevant page. Reading the whole report or just the introduction/conclusion would be inefficient."
      },
      {
        question: "When scanning a text for a person's name, what visual feature should your eyes look for?",
        options: [
          "Numbers and dates",
          "Capitalised words",
          "Words in bold or italic",
          "Short paragraphs"
        ],
        correctAnswer: 1,
        explanation: "Proper names are always capitalised in English. When scanning for a name, train your eyes to pick out capitalised words, which will help you locate the name quickly without reading every word."
      },
      {
        question: "Which of the following is NOT an effective skimming technique?",
        options: [
          "Reading the first and last paragraphs carefully",
          "Reading every supporting example in detail",
          "Noting headings and subheadings",
          "Reading the first sentence of each body paragraph"
        ],
        correctAnswer: 1,
        explanation: "Reading every supporting example in detail is the opposite of skimming — it is careful reading. Skimming involves skipping examples, statistics, and supporting evidence on your first pass, focusing only on main ideas and structure."
      }
    ]
  },

  "Writing — Cohesion and Coherence in Essays": {
    explanation: `<h2>Achieving Cohesion and Coherence in Essay Writing</h2>
<p><strong>Cohesion</strong> and <strong>coherence</strong> are two fundamental qualities of effective writing that are often confused but distinctly different. Cohesion refers to the <strong>surface-level connections</strong> between sentences and paragraphs — the grammatical and lexical links that hold a text together. These include linking words (however, furthermore, therefore), referencing (it, this, such), substitution (one, do, so), and ellipsis (omitting words that are understood from context). Coherence refers to the <strong>logical organisation of ideas</strong> — the underlying structure that makes a text make sense as a whole. A text can be cohesive (full of linking words) without being coherent (the ideas don't follow a logical progression), and vice versa. Both must work together for writing to be effective.</p>
<p>Paragraph structure is the backbone of coherence. Each paragraph should contain <strong>one main idea</strong>, expressed in a clear <strong>topic sentence</strong> (usually the first sentence). The remaining sentences in the paragraph should support, explain, or illustrate this main idea with reasons, examples, and evidence. The final sentence may provide a conclusion or transition to the next paragraph. This pattern — sometimes called the <strong>PEEL structure</strong> (Point, Evidence, Explanation, Link) — ensures that every paragraph is focused and purposeful. A common mistake at the intermediate level is writing paragraphs that contain multiple unrelated ideas, making it difficult for the reader to follow the argument.</p>
<p>Linking words and phrases are the most visible tools of cohesion, but they must be used <strong>accurately and appropriately</strong>. Each linking word expresses a specific logical relationship: <strong>addition</strong> (furthermore, in addition, moreover), <strong>contrast</strong> (however, nevertheless, on the other hand), <strong>cause and effect</strong> (therefore, consequently, as a result), <strong>concession</strong> (although, despite, even though), and <strong>sequencing</strong> (firstly, subsequently, finally). Using the wrong linking word distorts the logical relationship between your ideas — for example, using 'furthermore' (addition) when you mean 'however' (contrast) will confuse the reader completely. Equally, overusing linking words — starting every sentence with one — makes writing feel mechanical and unnatural. Use them where they genuinely clarify a relationship, not as decoration.</p>
<p>Beyond linking words, <strong>referencing and substitution</strong> are subtle but powerful cohesion devices. Instead of repeating a noun phrase, use pronouns ("it," "they"), demonstratives ("this," "these"), or synonyms ("the scheme," "the initiative," "the programme" for a government plan). Instead of repeating a verb phrase, use substitution: "Some students enjoy group work, but others <em>do not</em>" (instead of repeating "enjoy group work"). These devices create a smooth, flowing text where ideas connect naturally without awkward repetition. Mastering them is a sign of mature, confident writing at B2 level and above.</p>`,
    examples: [
      {
        sentence: "\"The government has introduced a new recycling policy. This initiative aims to reduce household waste by 50% over the next decade.\"",
        note: "'This initiative' is a referencing device that connects the second sentence to the first, avoiding repetition of 'new recycling policy' while maintaining clarity."
      },
      {
        sentence: "\"Many people believe that technology has improved education. However, critics argue that excessive screen time can harm children's concentration.\"",
        note: "'However' signals a contrast between the two sentences. It tells the reader that the second sentence presents an opposing viewpoint."
      },
      {
        sentence: "\"Some employees prefer working from home; others do not, citing feelings of isolation and lack of collaboration.\"",
        note: "'Others do not' uses substitution — 'do not' replaces the full phrase 'do not prefer working from home.' This avoids repetition while keeping the meaning clear."
      },
      {
        sentence: "\"Firstly, renewable energy reduces carbon emissions. Secondly, it creates new jobs in emerging industries. Finally, it decreases dependence on imported fossil fuels.\"",
        note: "'Firstly,' 'Secondly,' and 'Finally' are sequencing linking words that organise three parallel arguments in a clear, logical order."
      },
      {
        sentence: "\"Although the project was ambitious, it was completed on time. Consequently, the team received a commendation from the board.\"",
        note: "'Although' introduces a concession (the project was ambitious), and 'Consequently' signals the result or effect (receiving a commendation). Both words accurately express the logical relationships."
      }
    ],
    commonMistakes: [
      {
        mistake: "Starting every sentence with a linking word, making the writing sound mechanical.",
        correction: "Use linking words only where they genuinely clarify a logical relationship. Alternate between linked sentences and independent ones to create a natural rhythm."
      },
      {
        mistake: "Using the wrong linking word: \"The weather was terrible. Furthermore, we decided to stay home.\"",
        correction: "'Furthermore' adds information, but here a result is needed: \"The weather was terrible. Consequently, we decided to stay home.\" or \"As a result, we decided to stay home.\""
      },
      {
        mistake: "Repeating the same noun in every sentence: \"The environment is important. The environment is in danger. We must save the environment.\"",
        correction: "Use referencing: \"The environment is important. It is currently in danger, and we must take action to protect it.\""
      },
      {
        mistake: "Writing paragraphs that contain multiple unrelated ideas without a clear topic sentence.",
        correction: "Each paragraph should focus on one main idea, introduced in a topic sentence. Start a new paragraph when you shift to a new point."
      }
    ],
    quiz: [
      {
        question: "What is the difference between cohesion and coherence?",
        options: [
          "They are the same thing",
          "Cohesion is about surface-level connections (linking words, referencing); coherence is about the logical organisation of ideas",
          "Cohesion is about ideas; coherence is about grammar",
          "Cohesion is for paragraphs; coherence is for sentences"
        ],
        correctAnswer: 1,
        explanation: "Cohesion refers to the visible connections between sentences and paragraphs — linking words, pronouns, and substitution devices. Coherence refers to whether the ideas are logically organised and make sense as a whole. Both are needed for effective writing."
      },
      {
        question: "Which linking word correctly expresses a CAUSE-AND-EFFECT relationship?",
        options: [
          "Furthermore",
          "Nevertheless",
          "Consequently",
          "Whereas"
        ],
        correctAnswer: 2,
        explanation: "'Consequently' means 'as a result' and expresses cause and effect. 'Furthermore' adds information, 'Nevertheless' introduces a contrast despite something, and 'Whereas' compares two contrasting facts."
      },
      {
        question: "What is the PEEL structure for paragraphs?",
        options: [
          "Plan, Edit, Evaluate, Link",
          "Point, Evidence, Explanation, Link",
          "Purpose, Example, Effect, Language",
          "Position, Emphasis, Evidence, Logic"
        ],
        correctAnswer: 1,
        explanation: "PEEL stands for Point (topic sentence stating the main idea), Evidence (data or examples), Explanation (analysing the evidence), and Link (connecting back to the main argument or transitioning to the next paragraph)."
      },
      {
        question: "Which sentence uses referencing effectively?",
        options: [
          "\"The government announced a new policy. The new policy will affect millions of people. The new policy has been controversial.\"",
          "\"The government announced a new policy. It will affect millions of people and has already proved controversial.\"",
          "\"The government announced a new policy. That thing will affect people. That thing is controversial.\"",
          "\"The government announced a new policy. A policy will affect millions. A policy is controversial.\""
        ],
        correctAnswer: 1,
        explanation: "Option B uses 'it' to reference 'new policy' and combines the ideas into a flowing sentence. The other options either repeat the noun awkwardly, use vague references ('that thing'), or omit the article incorrectly."
      },
      {
        question: "Identify the error: \"The team worked overtime. However, they met the deadline.\"",
        options: [
          "'However' should be replaced with a word showing result, such as 'Consequently' or 'As a result'",
          "'However' should be replaced with 'Furthermore'",
          "The sentence is correct as written",
          "'However' should be replaced with 'Although'"
        ],
        correctAnswer: 0,
        explanation: "Meeting the deadline is a RESULT of working overtime, not a contrast. 'However' implies contrast, which is illogical here. 'Consequently' or 'As a result' correctly expresses the cause-and-effect relationship: working overtime → meeting the deadline."
      }
    ]
  },

  "Writing — Argumentative and Persuasive Essays": {
    explanation: `<h2>Writing Argumentative and Persuasive Essays</h2>
<p>Argumentative and persuasive essays require you to take a position on an issue and defend it with logical reasoning and evidence. While the two types overlap, there is an important distinction: an <strong>argumentative essay</strong> presents a balanced, reasoned case for a particular viewpoint, acknowledging counter-arguments and refuting them with evidence. A <strong>persuasive essay</strong> goes further — it aims to convince the reader to adopt a specific position or take action, often using emotional appeals alongside logical ones. At the B1-B2 level, you should be able to write both types, but the argumentative approach is more commonly required in academic and exam contexts because it demonstrates critical thinking and balanced judgement.</p>
<p>The structure of an argumentative essay follows a clear pattern. The <strong>introduction</strong> presents the topic, provides background context, and states your thesis — the position you will argue for. Each <strong>body paragraph</strong> develops one main argument in support of your thesis, using the PEEL structure: Point (your claim), Evidence (data, examples, expert opinion), Explanation (how the evidence supports your claim), and Link (connecting back to the thesis). A strong essay also includes a <strong>counter-argument paragraph</strong>, where you acknowledge an opposing view and then refute it, explaining why it is weaker or less valid than your position. The <strong>conclusion</strong> restates the thesis in different words, summarises the key arguments, and may end with a call to action or a final thought. This structure ensures your essay is logical, balanced, and persuasive.</p>
<p>Effective argumentative writing depends on the quality of your evidence and reasoning. Avoid <strong>logical fallacies</strong> — errors in reasoning that undermine your argument. Common fallacies include: <strong>ad hominem</strong> (attacking the person instead of the argument), <strong>straw man</strong> (misrepresenting the opposing view to make it easier to attack), <strong>hasty generalisation</strong> (drawing a broad conclusion from limited evidence), and <strong>false dichotomy</strong> (presenting only two options when more exist). For example, saying "Either we ban cars or the planet is doomed" is a false dichotomy — there are many intermediate policies such as congestion charges, electric vehicles, and improved public transport. Recognising and avoiding these fallacies strengthens your argument and demonstrates intellectual honesty.</p>
<p>The language of argumentation includes several key features. Use <strong>hedging</strong> to avoid overclaiming: "This suggests that..." rather than "This proves that..." Use <strong>reporting verbs</strong> to introduce sources: "Smith (2020) argues that..." "Jones contends that..." "Brown acknowledges that..." Use <strong>conditional structures</strong> to explore implications: "If this policy were implemented, it would lead to..." And use <strong>comparative structures</strong> to evaluate options: "While approach A has some merits, approach B is more sustainable in the long term." These language features give your writing an academic, authoritative tone that is appropriate for formal argumentation.</p>`,
    examples: [
      {
        sentence: "\"This essay will argue that university education should be free for all students, as the social benefits far outweigh the financial costs.\"",
        note: "A clear thesis statement that presents the position and previews the main line of reasoning. The phrase 'This essay will argue that' is a standard academic introduction."
      },
      {
        sentence: "\"Opponents of free education argue that it would place an unsustainable burden on taxpayers. However, this view overlooks the long-term economic returns of an educated workforce.\"",
        note: "A counter-argument followed by a refutation. 'Opponents argue that' presents the opposing view fairly, and 'However, this view overlooks' introduces the refutation."
      },
      {
        sentence: "\"According to a 2022 OECD report, countries with tuition-free higher education have 15% higher graduation rates among low-income students.\"",
        note: "Using statistical evidence from a credible source to support a claim. 'According to' is a reporting phrase that attributes the evidence correctly."
      },
        {
        sentence: "\"If tuition fees were abolished, more students from disadvantaged backgrounds would be able to pursue higher education, leading to greater social mobility.\"",
        note: "A Second Conditional structure explores a hypothetical scenario and its consequences — a powerful technique in argumentative writing for showing implications."
      },
      {
        sentence: "\"In conclusion, while the financial cost of free university education is significant, the evidence demonstrates that the long-term benefits to society — including higher employment, greater innovation, and reduced inequality — are substantially greater.\"",
        note: "A conclusion that restates the thesis, acknowledges a counter-argument ('while the financial cost is significant'), and summarises the key evidence."
      }
    ],
    commonMistakes: [
      {
        mistake: "Failing to state a clear thesis — writing an essay that discusses a topic without taking a position.",
        correction: "Always include a thesis statement in your introduction that clearly states your position. For example: 'This essay will argue that...' or 'I firmly believe that...'"
      },
      {
        mistake: "Making claims without evidence: \"Social media is harmful to teenagers.\"",
        correction: "Support every claim with evidence: \"Social media is harmful to teenagers; a 2021 study by the Royal Society for Public Health found that Instagram was rated the worst platform for young people's mental health.\""
      },
      {
        mistake: "Ignoring counter-arguments entirely, making the essay one-sided and unpersuasive.",
        correction: "Include a counter-argument paragraph: acknowledge the opposing view, then refute it with evidence or reasoning. This shows you have considered the issue from multiple perspectives."
      },
      {
        mistake: "Using a false dichotomy: \"We must either ban all cars or accept the destruction of the planet.\"",
        correction: "Present a more nuanced position that acknowledges intermediate options: \"While private car use contributes significantly to emissions, a combination of congestion pricing, investment in public transport, and incentives for electric vehicles offers a more balanced and achievable solution.\""
      }
    ],
    quiz: [
      {
        question: "What is the key difference between an argumentative essay and a persuasive essay?",
        options: [
          "An argumentative essay is longer than a persuasive essay",
          "An argumentative essay presents a balanced case with counter-arguments; a persuasive essay aims to convince the reader, often using emotional appeals",
          "A persuasive essay is always about politics; an argumentative essay is about any topic",
          "There is no difference between them"
        ],
        correctAnswer: 1,
        explanation: "An argumentative essay presents a reasoned case for a position, acknowledging and refuting counter-arguments. A persuasive essay aims to convince the reader to adopt a position or take action, and may use emotional as well as logical appeals. The argumentative approach is more balanced and academic."
      },
      {
        question: "What is a 'straw man' fallacy?",
        options: [
          "Attacking the person making the argument rather than the argument itself",
          "Misrepresenting an opposing view to make it easier to attack",
          "Drawing a broad conclusion from very limited evidence",
          "Presenting only two options when more exist"
        ],
        correctAnswer: 1,
        explanation: "A straw man fallacy involves misrepresenting or oversimplifying an opponent's argument to make it easier to attack. Instead of engaging with the actual argument, you create a weaker version (a 'straw man') and knock it down."
      },
      {
        question: "Which sentence is a properly hedged academic claim?",
        options: [
          "This proves that the policy is a complete failure.",
          "The evidence suggests that the policy may not be achieving its intended outcomes.",
          "Everyone knows the policy is terrible.",
          "The policy is definitely the worst in history."
        ],
        correctAnswer: 1,
        explanation: "'The evidence suggests that the policy may not be achieving its intended outcomes' uses hedging ('suggests,' 'may not') to make a measured, cautious claim. The other options use absolute or emotionally charged language that overclaims."
      },
      {
        question: "Where should the thesis statement appear in an argumentative essay?",
        options: [
          "In the conclusion",
          "In the first body paragraph",
          "In the introduction",
          "In the counter-argument paragraph"
        ],
        correctAnswer: 2,
        explanation: "The thesis statement should appear in the introduction, typically at the end, so the reader knows your position before you begin presenting your arguments. It provides the roadmap for the entire essay."
      },
      {
        question: "What is the purpose of a counter-argument paragraph in an argumentative essay?",
        options: [
          "To change the topic and discuss something different",
          "To acknowledge an opposing view and then refute it, showing you have considered multiple perspectives",
          "To repeat your main argument in different words",
          "To list all the reasons you disagree with the reader"
        ],
        correctAnswer: 1,
        explanation: "A counter-argument paragraph acknowledges an opposing viewpoint, then refutes it with evidence or reasoning. This demonstrates that you have considered the issue from multiple perspectives, which strengthens your overall argument and shows critical thinking."
      }
    ]
  },

  "Vocabulary — Collocations and Natural Word Pairs": {
    explanation: `<h2>Mastering Collocations and Natural Word Pairs</h2>
<p><strong>Collocations</strong> are combinations of words that naturally occur together in English — they "collocate" or sit beside each other so frequently that any other combination sounds unnatural to a native speaker. For example, we say "make a decision" (not "do a decision"), "heavy rain" (not "strong rain"), "commit a crime" (not "do a crime"), and "fast food" (not "quick food"). These are not rules of grammar — you could argue that "strong rain" makes logical sense — but they are patterns of usage that have become established over centuries of English. Learning collocations is one of the most effective ways to make your English sound natural and fluent, because using the wrong collocation is one of the fastest ways to sound unnatural, even if your grammar is perfect.</p>
<p>Collocations can be categorised into several types. <strong>Adjective + noun</strong> collocations are very common: "strong coffee," "deep breath," "heavy traffic," "utter nonsense." <strong>Verb + noun</strong> collocations are equally important: "pay attention," "break a habit," "catch a cold," "raise awareness." <strong>Verb + adverb</strong> collocations describe how actions are performed: "deeply appreciate," "strongly recommend," "bitterly complain," "widely accepted." <strong>Adverb + adjective</strong> collocations modify the intensity of descriptions: "absolutely essential," "highly unlikely," "perfectly normal," "broadly similar." Each of these patterns has its own conventions that must be learned individually — there are few reliable rules that predict which words go together.</p>
<p>One of the biggest challenges for learners is that collocations often differ between English and their first language, leading to <strong>L1 interference</strong>. A Spanish speaker might say "make a party" (translating from "hacer una fiesta"), but in English we "throw a party" or "have a party." A Chinese speaker might say "open the light" (translating from 开灯), but in English we "turn on the light." A German speaker might say "make homework" (translating from "Hausaufgaben machen"), but in English we "do homework." These errors are entirely logical from the learner's perspective but immediately mark the speaker as non-native. The only solution is to learn collocations as <strong>fixed chunks</strong> rather than individual words — when you learn a new word, always learn the words it commonly collocates with.</p>
<p>Effective strategies for learning collocations include: keeping a <strong>collocation notebook</strong> organised by keyword (e.g., under "decision," record: make a decision, reach a decision, a tough decision, a unanimous decision); using a <strong>collocation dictionary</strong> (such as the Oxford Collocations Dictionary) to check natural word combinations; reading extensively and <strong>noticing</strong> which words appear together; and practising with collocation-focused exercises such as gap-fills and matching activities. Over time, you will develop an intuitive sense of what "sounds right" in English — this is the fluency that collocation knowledge provides.</p>`,
    examples: [
      {
        sentence: "\"We need to make a decision before the end of the day.\"",
        note: "'Make a decision' is a standard verb + noun collocation. We do NOT say 'do a decision.' Under 'decision,' also note: 'reach a decision,' 'take a decision' (more British), 'a tough decision.'"
      },
      {
        sentence: "\"There was heavy traffic on the motorway this morning, so I was late for work.\"",
        note: "'Heavy traffic' is the natural adjective + noun collocation. We do NOT say 'big traffic,' 'strong traffic,' or 'much traffic.' Other collocations with 'heavy': heavy rain, heavy smoker, heavy burden."
      },
      {
        sentence: "\"I would strongly recommend this restaurant to anyone visiting the city.\"",
        note: "'Strongly recommend' is a natural adverb + verb collocation. We do NOT say 'heavily recommend' or 'powerfully recommend.' Other adverb collocations with 'recommend': highly recommend, warmly recommend."
      },
      {
        sentence: "\"It is absolutely essential that you submit the form before the deadline.\"",
        note: "'Absolutely essential' is an adverb + adjective collocation. We do NOT say 'very essential' — because 'essential' is a strong adjective, it takes 'absolutely' or 'completely,' not 'very.'"
      },
      {
        sentence: "\"The company needs to take immediate action to address the problem.\"",
        note: "'Take action' and 'immediate action' are both common collocations. We do NOT say 'make action' or 'do action.' Under 'action,' note: take action, prompt action, decisive action, urgent action."
      },
      {
        sentence: "\"She was bitterly disappointed by the results of the exam.\"",
        note: "'Bitterly disappointed' is an adverb + adjective collocation. 'Bitterly' collocates with a small set of negative emotions: bitterly disappointed, bitterly complain, bitterly regret, bitterly cold."
      }
    ],
    commonMistakes: [
      {
        mistake: "\"Do a decision\" (translating from L1)",
        correction: "\"Make a decision.\" In English, we 'make' decisions, we 'do' tasks and homework. This is a fixed verb + noun collocation."
      },
      {
        mistake: "\"Strong rain\" or \"big rain\"",
        correction: "\"Heavy rain.\" The natural collocation for rain intensity is 'heavy,' not 'strong' or 'big.' We also say 'heavy snow' and 'heavy fog.'"
      },
      {
        mistake: "\"Very essential\" or \"very impossible\"",
        correction: "\"Absolutely essential\" or \"completely impossible.\" Strong adjectives like 'essential,' 'impossible,' 'perfect,' and 'devastated' take 'absolutely' or 'completely,' not 'very.'"
      },
      {
        mistake: "\"Open the light\" (L1 interference)",
        correction: "\"Turn on the light.\" In English, we 'turn on' and 'turn off' lights, devices, and machines. We 'open' and 'close' doors, windows, and containers."
      }
    ],
    quiz: [
      {
        question: "Which is the correct collocation?",
        options: [
          "Do a mistake",
          "Make a mistake",
          "Create a mistake",
          "Build a mistake"
        ],
        correctAnswer: 1,
        explanation: "'Make a mistake' is the standard English collocation. We do not say 'do a mistake' or any other variation. This is a fixed verb + noun combination that must be memorised."
      },
      {
        question: "Which adverb naturally collocates with 'disappointed'?",
        options: [
          "Heavily disappointed",
          "Bitterly disappointed",
          "Strongly disappointed",
          "Powerfully disappointed"
        ],
        correctAnswer: 1,
        explanation: "'Bitterly disappointed' is the natural collocation. 'Bitterly' collocates with a small set of negative emotions and weather: bitterly disappointed, bitterly cold, bitterly complain. The other adverbs do not naturally collocate with 'disappointed.'"
      },
      {
        question: "Why is learning collocations important for language learners?",
        options: [
          "Because using the wrong collocation sounds unnatural even if the grammar is correct",
          "Because collocations are tested in every English exam",
          "Because collocations are grammatical rules that must be followed",
          "Because you cannot speak English without knowing collocations"
        ],
        correctAnswer: 0,
        explanation: "Collocations are not grammatical rules — they are patterns of natural usage. However, using the wrong collocation (e.g., 'do a decision' instead of 'make a decision') immediately sounds unnatural to native speakers, even though the grammar may be technically correct. Learning collocations makes your English sound fluent and natural."
      },
      {
        question: "Which modifier correctly collocates with the strong adjective 'essential'?",
        options: [
          "Very essential",
          "Really essential",
          "Absolutely essential",
          "Fairly essential"
        ],
        correctAnswer: 2,
        explanation: "Strong adjectives (like essential, impossible, perfect, enormous) take 'absolutely' or 'completely,' not 'very' or 'fairly.' We say 'absolutely essential,' not 'very essential,' because 'essential' already expresses an extreme degree."
      },
      {
        question: "Complete the collocation: \"The government needs to ______ action to reduce pollution.\"",
        options: [
          "make",
          "do",
          "take",
          "perform"
        ],
        correctAnswer: 2,
        explanation: "'Take action' is the standard collocation. We do not say 'make action,' 'do action,' or 'perform action.' Other common collocations with 'action': immediate action, decisive action, urgent action, prompt action."
      }
    ]
  }
};
