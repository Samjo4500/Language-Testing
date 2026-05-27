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
  }
};
