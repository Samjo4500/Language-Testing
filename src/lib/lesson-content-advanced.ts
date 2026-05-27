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

export const ADVANCED_LESSON_CONTENT: Record<string, LessonStructuredContent> = {
  "The Subjunctive Mood": {
    explanation: `<h2>Understanding the Subjunctive Mood</h2>
<p>The subjunctive mood is a grammatical category used to express wishes, demands, suggestions, and hypothetical or counterfactual situations. Unlike the indicative mood, which states facts, the subjunctive signals that the speaker is describing something that is <strong>not necessarily real</strong> but is instead desired, imagined, or mandated. In Modern English, the subjunctive is relatively sparse compared to languages such as French or Spanish, yet it persists in several important constructions that advanced learners must master. The three principal varieties are the <em>mandative subjunctive</em>, the <em>were-subjunctive</em>, and <em>formulaic subjunctive</em> expressions, each of which serves a distinct communicative function.</p>

<h2>The Mandative Subjunctive</h2>
<p>The mandative subjunctive appears in subordinate clauses governed by verbs, adjectives, or nouns that convey necessity, urgency, or recommendation — for instance, <em>insist, demand, suggest, recommend, essential, vital, imperative, requirement</em>. In these clauses, the verb takes its bare infinitive form regardless of the subject: "It is essential that he <strong>be</strong> present," "The committee recommended that she <strong>receive</strong> the award." Note that the mandative subjunctive does not conjugate for person or number, so it lacks the third-person <em>-s</em> and does not use past-tense forms. British English frequently substitutes <em>should</em> + infinitive ("It is essential that he should be present"), but in formal American English and international academic writing, the bare infinitive is preferred. Learners should recognise both patterns but aim for the mandative form in their own formal writing.</p>

<h2>The Were-Subjunctive and Formulaic Expressions</h2>
<p>The were-subjunctive survives in conditional and wish clauses where the situation is counterfactual. In sentences such as "If I <strong>were</strong> you, I would reconsider" and "I wish it <strong>were</strong> otherwise," <em>were</em> is used for all subjects, including first- and third-person singular, marking the unreality of the proposition. Although informal speech often substitutes <em>was</em>, the were-form remains the expected standard in writing and formal contexts. Beyond conditionals, a number of fixed or <em>formulaic</em> subjunctive expressions persist in academic and formal prose: "Come what may," "Be that as it may," "Suffice it to say," and "If need be." These fossilised phrases are relics of a once-robust subjunctive system and, though limited in number, they enrich advanced writing considerably when deployed correctly.</p>

<h2>Choosing Between Subjunctive and Indicative</h2>
<p>One of the subtler challenges is deciding when the subjunctive is required versus when the indicative is appropriate. A clause introduced by <em>that</em> after a mandative trigger always takes the subjunctive in American English, whereas after verbs of perception or cognition (<em>believe, think, know</em>), the indicative is standard: "I believe that she <strong>is</strong> qualified" (indicative) versus "I insist that she <strong>be</strong> qualified" (subjunctive). The distinction hinges on whether the embedded proposition is presented as an <em>objective fact</em> (indicative) or as a <em>desired or mandated outcome</em> (subjunctive). Mastering this contrast is essential for producing nuanced, authoritative prose at the C1-C2 level.</p>`,
    examples: [
      {
        sentence: "It is imperative that every student submit the assignment by Friday.",
        note: "Mandative subjunctive: 'submit' is the bare infinitive, not 'submits', because the clause follows a mandative trigger ('imperative')."
      },
      {
        sentence: "The board demanded that the CEO resign with immediate effect.",
        note: "Mandative subjunctive after 'demanded': 'resign' remains in the bare infinitive form regardless of the third-person subject."
      },
      {
        sentence: "If I were in your position, I would negotiate a better deal.",
        note: "Were-subjunctive in a counterfactual conditional: 'were' is used instead of 'was' to signal unreality."
      },
      {
        sentence: "Be that as it may, we cannot ignore the financial implications.",
        note: "Formulaic subjunctive: a fixed expression meaning 'even so' or 'nevertheless', retaining the archaic subjunctive form."
      },
      {
        sentence: "I wish it were possible to reverse the damage already done.",
        note: "Were-subjunctive in a wish clause, indicating that the wished-for situation is counterfactual."
      },
      {
        sentence: "Suffice it to say, the experiment yielded inconclusive results.",
        note: "Formulaic subjunctive: 'suffice' is in the bare infinitive form within this fixed academic expression meaning 'it is enough to say'."
      }
    ],
    commonMistakes: [
      {
        mistake: "It is essential that he is present at the meeting.",
        correction: "It is essential that he be present at the meeting.",
      },
      {
        mistake: "If I was you, I would accept the offer.",
        correction: "If I were you, I would accept the offer.",
      },
      {
        mistake: "The manager insisted that the report is submitted on time.",
        correction: "The manager insisted that the report be submitted on time.",
      },
      {
        mistake: "The professor recommended that she applies for the scholarship.",
        correction: "The professor recommended that she apply for the scholarship.",
      }
    ],
    quiz: [
      {
        question: "Which sentence correctly uses the mandative subjunctive?",
        options: [
          "The committee insisted that he apologises publicly.",
          "The committee insisted that he apologise publicly.",
          "The committee insisted that he should apologises publicly.",
          "The committee insisted that he would apologise publicly."
        ],
        correctAnswer: 1,
        explanation: "After mandative triggers like 'insisted', the bare infinitive 'apologise' is required, not the third-person 'apologises' or a modal construction."
      },
      {
        question: "Identify the sentence that correctly employs the were-subjunctive.",
        options: [
          "If she was the CEO, she would restructure the department.",
          "If she were the CEO, she would restructure the department.",
          "If she is the CEO, she would restructure the department.",
          "If she had been the CEO, she would restructure the department."
        ],
        correctAnswer: 1,
        explanation: "In counterfactual conditionals referring to the present, the were-subjunctive 'were' is the standard form, even with singular subjects."
      },
      {
        question: "What does the formulaic subjunctive 'be that as it may' mean?",
        options: [
          "It must be that way",
          "Even so; nevertheless",
          "That may be the reason",
          "Let it happen as planned"
        ],
        correctAnswer: 1,
        explanation: "'Be that as it may' is a concessive formulaic expression meaning 'even so' or 'nevertheless', used to acknowledge a point while maintaining a contrary position."
      },
      {
        question: "Which of the following sentences requires the indicative rather than the subjunctive?",
        options: [
          "It is vital that she attend the conference.",
          "I suggest that he seek professional advice.",
          "I believe that she is fully capable of leading the project.",
          "The law mandates that all citizens carry identification."
        ],
        correctAnswer: 2,
        explanation: "'Believe' is a verb of cognition, not a mandative trigger, so the indicative 'is' is correct. The other sentences all contain mandative triggers (vital, suggest, mandates) that require the subjunctive."
      },
      {
        question: "In the sentence 'The doctor recommended that the patient ___ more rest', which verb form is correct?",
        options: [
          "gets",
          "get",
          "got",
          "getting"
        ],
        correctAnswer: 1,
        explanation: "After the mandative trigger 'recommended', the bare infinitive 'get' is the correct subjunctive form, not the third-person 'gets' or any other conjugation."
      }
    ]
  },

  "Cleft Sentences for Emphasis": {
    explanation: `<h2>What Are Cleft Sentences?</h2>
<p>Cleft sentences are grammatical structures that divide a single clause into two parts in order to place focal emphasis on a particular element of the message. The term <em>cleft</em> derives from the verb 'to cleave', meaning to split or divide, and that is precisely what these constructions do: they take a simple sentence and restructure it so that one piece of information is highlighted as new or particularly important. At the C1-C2 level, mastering cleft sentences is essential because they allow speakers and writers to manage the <strong>information flow</strong> of their discourse — guiding the listener or reader toward what is most salient, contrasting an element with alternatives, or building a rhetorical argument step by step.</p>

<h2>It-Clefts and Wh-Clefts</h2>
<p>The most common type is the <em>it-cleft</em>, which follows the pattern <em>It + be + focused element + that/who clause</em>: "It was John who broke the window." Here, the focus falls on 'John', distinguishing him from other potential culprits. The that/who clause (the <em>cleft clause</em>) provides the background, and the element between <em>it be</em> and the relative word is the <em>focused element</em>. Wh-clefts (also called <em>pseudo-clefts</em>) reverse this pattern: "What I need is a vacation." The structure is <em>What + clause + be + focused element</em>. Wh-clefts typically place the focused element at the end, capitalising on the natural tendency of English to place new information in clause-final position. Variants include wh-clefts beginning with <em>where, when, how, the person who, the thing that, the reason why</em>, and similar expressions.</p>

<h2>All-Clefts, The-Reason Clefts, and Other Variants</h2>
<p>Beyond it-clefts and wh-clefts, several related structures serve similar emphatic functions. <em>All-clefts</em> restrict the focus to an exclusive set: "All I want is some peace and quiet." <em>The-reason clefts</em> highlight causality: "The reason she resigned was the constant criticism." <em>The-thing clefts</em> foreground a particular object or concept: "The thing that bothers me is the lack of transparency." <em>The-kind clefts</em> narrow a category: "The kind of person she is would never accept a bribe." Each variant enables a slightly different rhetorical move — exclusion, causal explanation, identification, or categorisation — and choosing among them is a matter of communicative intent rather than mere grammatical correctness.</p>

<h2>Using Clefts for Rhetorical Effect</h2>
<p>In academic and persuasive writing, cleft sentences serve as powerful tools for shaping argumentation. They can <em>contrast</em> one view with another ("It is not the methodology that is flawed but the interpretation"), <em>correct a misconception</em> ("What researchers often overlook is the cultural dimension"), or <em>build suspense</em> by withholding key information until clause-final position ("What ultimately proved decisive was the witness's testimony"). Overusing clefts, however, can make prose feel stilted and overly dramatic; the skill lies in deploying them at strategic moments to guide the reader's attention precisely where it matters most. When used judiciously, clefts are among the most effective devices for achieving rhetorical clarity and emphasis at the advanced level.</p>`,
    examples: [
      {
        sentence: "It was the lack of funding, not the design, that doomed the project.",
        note: "It-cleft used to contrast two possible causes, placing emphasis on 'the lack of funding' as the true reason."
      },
      {
        sentence: "What the data reveal is a consistent decline in participation rates.",
        note: "Wh-cleft (pseudo-cleft) placing the key finding ('a consistent decline') in the focused, clause-final position."
      },
      {
        sentence: "All she asked for was a fair hearing and an unbiased panel.",
        note: "All-cleft restricting the focus exclusively to what was requested, implying no unreasonable demands."
      },
      {
        sentence: "The reason the policy failed was that it ignored local conditions.",
        note: "The-reason cleft explicitly highlighting causality — the failure is attributed to a specific oversight."
      },
      {
        sentence: "It is precisely this ambiguity that makes the poem so compelling.",
        note: "It-cleft with 'precisely' intensifying the focus, a common pattern in academic and literary analysis."
      },
      {
        sentence: "What concerns most economists is the long-term sustainability of the debt.",
        note: "Wh-cleft fronting the topic of concern and placing the actual worry in the highlighted final position."
      }
    ],
    commonMistakes: [
      {
        mistake: "It was him who suggested the revision.",
        correction: "It was he who suggested the revision.",
      },
      {
        mistake: "What I want to know is that why the deadline was moved.",
        correction: "What I want to know is why the deadline was moved.",
      },
      {
        mistake: "It is the cost which is the main problem.",
        correction: "It is the cost that is the main problem.",
      },
      {
        mistake: "All what I need is more time.",
        correction: "All I need is more time. (or: What I need is more time.)",
      }
    ],
    quiz: [
      {
        question: "Which sentence is an example of a wh-cleft (pseudo-cleft)?",
        options: [
          "It was Maria who discovered the error.",
          "What Maria discovered was a significant error.",
          "All Maria wanted was to correct the error.",
          "The person who discovered the error was Maria."
        ],
        correctAnswer: 1,
        explanation: "A wh-cleft follows the pattern 'What + clause + be + focused element'. 'What Maria discovered was a significant error' fits this pattern perfectly."
      },
      {
        question: "In the it-cleft 'It was the methodology that the reviewers criticised', which element receives the emphasis?",
        options: [
          "The reviewers",
          "That",
          "The methodology",
          "Criticised"
        ],
        correctAnswer: 2,
        explanation: "In an it-cleft, the focused element — the one placed between 'it be' and the relative clause — receives the emphasis. Here, 'the methodology' is the focused element."
      },
      {
        question: "What is the rhetorical effect of the all-cleft 'All she requested was an extension'?",
        options: [
          "It emphasises that multiple things were requested",
          "It restricts and minimises the scope of the request",
          "It indicates the request was denied",
          "It suggests the request was excessive"
        ],
        correctAnswer: 1,
        explanation: "The all-cleft restricts the focus to an exclusive set, implying that only one thing — and nothing more — was requested, thereby minimising the scope."
      },
      {
        question: "Which sentence correctly uses a the-reason cleft?",
        options: [
          "The reason she left was because she was exhausted.",
          "The reason she left was that she was exhausted.",
          "It was because she was exhausted that was the reason she left.",
          "What was the reason she left that she was exhausted."
        ],
        correctAnswer: 1,
        explanation: "In a the-reason cleft, the complement after 'was' should be a that-clause, not a because-clause. 'The reason...was that...' is the standard pattern."
      },
      {
        question: "How does the it-cleft 'It is not the theory that is flawed but the application' function rhetorically?",
        options: [
          "It presents two equally valid interpretations",
          "It corrects a misconception by contrasting two elements",
          "It introduces a new topic without emphasis",
          "It expresses uncertainty about both the theory and the application"
        ],
        correctAnswer: 1,
        explanation: "This it-cleft uses a negative-positive contrast ('not X but Y') to correct a potential misconception, redirecting the reader's focus from the wrongly blamed element to the actual problem."
      }
    ]
  },

  "Advanced Hedging and Tentative Language": {
    explanation: `<h2>The Role of Hedging in Advanced English</h2>
<p>Hedging is the linguistic practice of modifying the strength of one's statements to reflect the degree of certainty, to protect against challenge, or to conform to the conventions of cautious academic discourse. At the C1-C2 level, hedging goes far beyond inserting 'maybe' or 'perhaps' into a sentence; it involves a sophisticated repertoire of <strong>epistemic stance markers</strong>, <em>shielding devices</em>, and <em>subjectivity frames</em> that allow the writer to calibrate precisely how committed they are to a proposition. Academic writers hedge not because they are unsure, but because intellectual honesty demands acknowledging the limits of evidence, and because unqualified claims are more vulnerable to refutation.</p>

<h2>Epistemic Stance and Shielding Devices</h2>
<p>Epistemic stance markers encode the speaker's or writer's degree of knowledge about a proposition. Expressions such as <em>"It would appear that…"</em>, <em>"One might reasonably suppose…"</em>, and <em>"The data would seem to suggest…"</em> all distance the writer from an outright assertion, leaving room for alternative interpretations. Shielding devices go a step further by attributing the claim to a broader framework of knowledge: <em>"To the best of our knowledge…"</em>, <em>"As far as can be determined…"</em>, <em>"Based on the available evidence…"</em>. These constructions shield the writer by framing the claim as the best current inference rather than as an absolute truth. Modal verbs — <em>may, might, could, would</em> — are also central to hedging, but at advanced levels, they are typically combined with adverbs (<em>possibly, arguably, conceivably</em>) and lexical verbs (<em>tend to, appear to, seem to</em>) to create layered, nuanced expressions of certainty.</p>

<h2>Scaling Certainty and Academic Convention</h2>
<p>Not all hedges are equal in strength, and advanced writers must learn to <strong>scale their certainty</strong> appropriately. A claim hedged with <em>"There is strong evidence to suggest that…"</em> carries more conviction than one hedged with <em>"It has been speculated that…"</em> The hierarchy of hedging strength typically runs from strong hedges expressing high confidence (<em>"It is well established that…"</em>, <em>"There is compelling evidence that…"</em>) through moderate hedges (<em>"It appears that…"</em>, <em>"The results indicate that…"</em>) to weak hedges expressing low confidence (<em>"It has been tentatively proposed that…"</em>, <em>"One might speculate that…"</em>). Academic conventions vary by discipline: the natural sciences tend to permit stronger claims with lighter hedging, whereas the humanities and social sciences often favour more cautious formulations. Understanding these conventions is crucial for producing writing that is both credible and contextually appropriate.</p>`,
    examples: [
      {
        sentence: "It would appear that the intervention had a measurable impact on retention rates.",
        note: "Epistemic stance marker: 'It would appear that' distances the writer from a direct claim, presenting the conclusion as an inference from the data."
      },
      {
        sentence: "To the best of our knowledge, no prior study has examined this interaction.",
        note: "Shielding device: 'To the best of our knowledge' protects the claim by framing it as limited to the authors' current awareness."
      },
      {
        sentence: "The findings would seem to suggest a correlation, though causation cannot be inferred.",
        note: "Layered hedging: 'would seem to suggest' combines modal 'would' with 'seem to' for a tentative claim, and the clause 'though causation cannot be inferred' adds an explicit caveat."
      },
      {
        sentence: "One might reasonably suppose that cultural factors play a significant role.",
        note: "Subjectivity frame with 'might reasonably': the hedge acknowledges that the supposition is plausible but not proven."
      },
      {
        sentence: "Arguably, the most important variable was omitted from the analysis.",
        note: "'Arguably' signals that the claim is debatable and invites the reader to consider it as one possible interpretation among others."
      },
      {
        sentence: "As far as can be determined from the available data, the trend is consistent across regions.",
        note: "Shielding device: 'As far as can be determined' qualifies the claim by reference to the scope of the evidence, implying the conclusion is provisional."
      }
    ],
    commonMistakes: [
      {
        mistake: "The data proves that the theory is correct.",
        correction: "The data would appear to support the theory.",
      },
      {
        mistake: "It is certain that cultural factors caused the discrepancy.",
        correction: "It is plausible that cultural factors contributed to the discrepancy.",
      },
      {
        mistake: "Research shows that this approach always works.",
        correction: "Research tends to indicate that this approach is often effective.",
      },
      {
        mistake: "We know for a fact that the results are valid.",
        correction: "Based on the available evidence, the results would appear to be valid.",
      }
    ],
    quiz: [
      {
        question: "Which sentence uses the most appropriate level of hedging for an academic claim based on limited data?",
        options: [
          "The results clearly prove that the hypothesis is correct.",
          "The results would seem to suggest that the hypothesis may have some merit.",
          "The results maybe sort of indicate the hypothesis could be right.",
          "The results conclusively demonstrate the validity of the hypothesis."
        ],
        correctAnswer: 1,
        explanation: "'Would seem to suggest' with 'may have some merit' provides an appropriately cautious hedged claim for limited data — neither overstating the conclusion nor lapsing into informality."
      },
      {
        question: "What is the function of the phrase 'to the best of our knowledge' in academic writing?",
        options: [
          "It claims comprehensive and complete knowledge of the subject",
          "It shields the claim by acknowledging the limits of the authors' awareness",
          "It asserts that the claim is universally accepted",
          "It indicates the authors disagree with the claim"
        ],
        correctAnswer: 1,
        explanation: "'To the best of our knowledge' is a shielding device that qualifies a claim by framing it within the boundaries of what the authors currently know, protecting against the possibility of unknown counterexamples."
      },
      {
        question: "Rank these hedging expressions from strongest to weakest: (A) 'There is compelling evidence that…', (B) 'It has been tentatively proposed that…', (C) 'The results indicate that…'",
        options: [
          "A > C > B",
          "C > A > B",
          "B > C > A",
          "A > B > C"
        ],
        correctAnswer: 0,
        explanation: "'Compelling evidence' expresses strong confidence, 'indicate' is a moderate hedge, and 'tentatively proposed' is a weak hedge expressing low confidence. The order is therefore A (strongest) > C > B (weakest)."
      },
      {
        question: "Which of the following is an example of layered hedging?",
        options: [
          "The study found that the drug is effective.",
          "It is possible that the results are significant.",
          "The data would seem to suggest a possible trend.",
          "Clearly, the experiment was a success."
        ],
        correctAnswer: 2,
        explanation: "'Would seem to suggest' (modal + lexical verb hedge) combined with 'possible' (adverbial hedge) creates layered hedging — multiple devices stacked to express a carefully calibrated degree of uncertainty."
      },
      {
        question: "Why is the sentence 'The data proves that the theory is correct' problematic in academic writing?",
        options: [
          "It uses too many hedges and sounds uncertain",
          "'Proves' is too strong and absolute; academic writing typically requires more cautious claims",
          "The sentence is grammatically incorrect",
          "Academic writing never refers to data or theories"
        ],
        correctAnswer: 1,
        explanation: "'Proves' makes an unqualified, absolute claim that is rare in academic discourse. Academic convention favours hedged language ('supports', 'is consistent with', 'would appear to confirm') that acknowledges the provisionality of findings."
      }
    ]
  },

  "Nominalisation in Academic Writing": {
    explanation: `<h2>What Is Nominalisation?</h2>
<p>Nominalisation is the process of converting verbs, adjectives, or entire clauses into noun forms, thereby allowing actions, qualities, and processes to be expressed as things. For example, the verb <em>decide</em> becomes the noun <em>decision</em>; the adjective <em>stable</em> becomes the noun <em>stability</em>; the clause <em>people polluted the river</em> becomes the noun phrase <em>pollution of the river</em>. This grammatical transformation is one of the hallmarks of academic and formal English. It enables writers to pack complex information into dense noun phrases, to shift focus away from individual actors and towards abstract concepts, and to create the <strong>impersonal, objective tone</strong> that scholarly discourse demands. At the C1-C2 level, controlling nominalisation is essential for producing prose that sounds authoritative and appropriately formal.</p>

<h2>Why Nominalisation Matters in Academic Register</h2>
<p>Nominalisation serves several interconnected functions in academic writing. First, it <em>decreases agency</em>: instead of saying "The researchers analysed the data and found significant correlations," one can write "The analysis of the data revealed significant correlations," removing the human agent and foregrounding the process itself. Second, it <em>condenses information</em>: a nominalised phrase can encapsulate an entire clause, allowing writers to stack multiple ideas within a single noun phrase ("The government's decision to implement the policy prompted widespread opposition"). Third, it facilitates <em>thematic progression</em>: once an action or quality is nominalised, it can serve as the subject or complement of a subsequent clause, creating a chain of reasoning: "The discovery of the molecule led to further investigation. This investigation, in turn, resulted in a breakthrough." These functions collectively produce the characteristic density and formality of academic prose.</p>

<h2>Common Patterns and Overuse Pitfalls</h2>
<p>The most productive nominalisation patterns involve suffixation: <em>-tion/-sion</em> (analyse → analysis, conclude → conclusion), <em>-ment</em> (develop → development), <em>-ity/-ness</em> (stable → stability, effective → effectiveness), <em>-ance/-ence</em> (perform → performance, exist → existence), and <em>-al</em> (refuse → refusal). While these patterns are indispensable, <strong>overusing nominalisation</strong> can produce prose that is needlessly opaque and difficult to read. A sentence such as "The implementation of the regulation resulted in the cessation of operations" is technically grammatical but far less clear than "When the regulation was implemented, operations ceased." The key principle is to nominalise when it serves a rhetorical purpose — creating cohesion, reducing agency, or achieving formality — but to retain verbal constructions when clarity and readability are paramount. Skilful academic writers alternate between nominalised and verbal styles, deploying each where it is most effective.</p>`,
    examples: [
      {
        sentence: "The government's decision to withdraw funding was met with widespread disapproval.",
        note: "Nominalisation of 'decide' → 'decision': the action is expressed as a noun, shifting focus from the act of deciding to the decision as a factual event."
      },
      {
        sentence: "Pollution of the river has had devastating effects on the local ecosystem.",
        note: "Nominalisation of 'pollute' → 'pollution': the verb is converted to a noun phrase, removing the agent and presenting the process as an abstract entity."
      },
      {
        sentence: "Their analysis of the data revealed several unexpected correlations.",
        note: "Nominalisation of 'analyse' → 'analysis': the action of analysing becomes a noun that can function as the subject's possession, creating a more formal and impersonal construction."
      },
      {
        sentence: "The stability of the compound under extreme conditions remains uncertain.",
        note: "Nominalisation of the adjective 'stable' → 'stability': the quality is reified as a noun, enabling it to serve as the subject of the clause."
      },
      {
        sentence: "The refusal to cooperate complicated the negotiation process considerably.",
        note: "Nominalisation of 'refuse' → 'refusal': the verb becomes a noun, allowing the entire concept of non-cooperation to be treated as a single unit."
      }
    ],
    commonMistakes: [
      {
        mistake: "The discover of the new species was announced last week.",
        correction: "The discovery of the new species was announced last week.",
      },
      {
        mistake: "When they implement the policy, it caused a lot of argue.",
        correction: "The implementation of the policy caused considerable argument.",
      },
      {
        mistake: "The perform of the system exceeded expectations.",
        correction: "The performance of the system exceeded expectations.",
      },
      {
        mistake: "The exist of the manuscript was unknown for centuries.",
        correction: "The existence of the manuscript was unknown for centuries.",
      }
    ],
    quiz: [
      {
        question: "Which sentence demonstrates correct nominalisation of the verb 'investigate'?",
        options: [
          "The investigate of the incident revealed no foul play.",
          "The investigation of the incident revealed no foul play.",
          "The investigatement of the incident revealed no foul play.",
          "The investigator of the incident revealed no foul play."
        ],
        correctAnswer: 1,
        explanation: "The noun form of 'investigate' is 'investigation' (suffix -tion), not 'investigate' (verb), 'investigatement' (non-existent), or 'investigator' (person who investigates)."
      },
      {
        question: "Why might a writer choose the nominalised version 'The analysis of the data revealed significant trends' over 'After they analysed the data, they found significant trends'?",
        options: [
          "Nominalisation always makes sentences shorter",
          "It removes the human agent and creates a more impersonal, formal tone",
          "Nominalisation is the only grammatically correct option",
          "It makes the sentence easier for non-native speakers to understand"
        ],
        correctAnswer: 1,
        explanation: "Nominalisation removes the agent ('they') and presents the process as an abstract entity ('the analysis'), producing the impersonal, objective register expected in academic writing."
      },
      {
        question: "What is a potential pitfall of overusing nominalisation?",
        options: [
          "Sentences become too short and simple",
          "Prose can become unnecessarily dense, opaque, and hard to read",
          "It makes writing sound too informal and conversational",
          "It eliminates the need for verbs entirely, which is ungrammatical"
        ],
        correctAnswer: 1,
        explanation: "Excessive nominalisation creates noun-heavy prose that is dense and difficult to process. For example, 'The cessation of operations due to the implementation of regulations' is less readable than 'Operations ceased because regulations were implemented'."
      },
      {
        question: "Which suffix is used to form the nominalisation of the adjective 'effective'?",
        options: [
          "-tion",
          "-ness",
          "-ment",
          "-ance"
        ],
        correctAnswer: 1,
        explanation: "The adjective 'effective' becomes the noun 'effectiveness' using the suffix '-ness'. The other suffixes do not apply: 'effectivation', 'effectivement', and 'effectivance' are not English words."
      },
      {
        question: "Choose the sentence that best balances nominalisation and clarity.",
        options: [
          "The making of the decision by the committee for the purpose of the improvement of the system resulted in the creation of a plan.",
          "The committee decided to improve the system and created a plan.",
          "The committee's decision to improve the system led to the formulation of a plan.",
          "The decisionment of the committee for system improvementness created a plan."
        ],
        correctAnswer: 2,
        explanation: "Option C strikes the right balance: 'decision' and 'formulation' provide appropriate nominalisation for a formal tone, while the overall structure remains clear and readable. Option A is over-nominalised and opaque, B is too informal for academic prose, and D contains non-existent word forms."
      }
    ]
  },

  "Discourse Markers and Cohesive Devices": {
    explanation: `<h2>Understanding Discourse Markers</h2>
<p>Discourse markers are words and phrases that organise, signal, and manage the flow of information in spoken and written text. They do not typically add propositional content themselves; rather, they indicate the <strong>relationships between propositions</strong> — signalling contrast, addition, cause, consequence, concession, or sequence. Examples include <em>furthermore, nevertheless, consequently, in other words, be that as it may</em>, and <em>notwithstanding</em>. At the C1-C2 level, the challenge is not merely knowing what these markers mean but selecting the one that precisely encodes the logical relationship you intend, using it in the correct syntactic position, and varying your choices to avoid repetition and monotone prose.</p>

<h2>Categories of Cohesive Devices</h2>
<p>Cohesive devices can be grouped into several functional categories. <em>Additive</em> markers (<em>furthermore, moreover, in addition, additionally, equally important</em>) signal that a new point supports or supplements the preceding one. <em>Contrastive</em> markers (<em>nevertheless, nonetheless, however, in contrast, conversely, on the other hand, be that as it may, notwithstanding</em>) indicate that the upcoming point opposes or qualifies the previous one. <em>Causal</em> markers (<em>consequently, therefore, as a result, hence, thus</em>) express a cause-effect relationship. <em>Sequential</em> markers (<em>firstly, subsequently, finally, in the first place, moving on</em>) organise text in temporal or logical order. Each category contains a range of options differing in formality, nuance, and syntactic behaviour, and the advanced writer must navigate these distinctions with care.</p>

<h2>Signposting in Academic Writing</h2>
<p>Academic writing relies heavily on <em>signposting</em> — the explicit signalling of the text's structure and argumentative moves. Phrases such as <em>"In light of the foregoing discussion…"</em>, <em>"Turning now to the question of…"</em>, <em>"Having established that…"</em>, and <em>"It is worth noting at this juncture that…"</em> guide the reader through the writer's line of reasoning. Effective signposting prevents the reader from becoming lost in a complex argument and reinforces the logical coherence of the text. However, signposting can be overdone: excessive meta-discourse ('In this section, I will discuss… Then I will argue… Next I will consider…') produces a mechanical, formulaic style. The ideal is to signpost <strong>at key transitions</strong> — where the argument shifts direction, introduces a major new point, or arrives at a conclusion — while allowing the prose to flow naturally between those signposts.</p>`,
    examples: [
      {
        sentence: "The sample size was relatively small; nevertheless, the results were statistically significant.",
        note: "Contrastive marker 'nevertheless' signals that the second clause presents a finding that runs counter to the expectation set up by the first."
      },
      {
        sentence: "Furthermore, the study found that participant engagement increased over time.",
        note: "Additive marker 'furthermore' indicates that this point adds to and builds upon a previously stated finding."
      },
      {
        sentence: "Notwithstanding the limitations of the methodology, the findings contribute to our understanding of the phenomenon.",
        note: "'Notwithstanding' is a formal concessive marker meaning 'despite', acknowledging a weakness while affirming the value of the results."
      },
      {
        sentence: "In light of the foregoing discussion, it is clear that further research is warranted.",
        note: "Signposting phrase 'In light of the foregoing discussion' connects the conclusion to the preceding argument, signalling a logical deduction."
      },
      {
        sentence: "Be that as it may, the ethical implications cannot be ignored.",
        note: "Concessive discourse marker 'Be that as it may' acknowledges a preceding point while asserting that a different consideration still applies."
      },
      {
        sentence: "Consequently, the policy was revised to address the identified shortcomings.",
        note: "Causal marker 'consequently' signals that the policy revision was a direct result of the previously described problems."
      }
    ],
    commonMistakes: [
      {
        mistake: "The results were significant. Furthermore, the sample size was small.",
        correction: "The sample size was small; nevertheless, the results were significant. (Using 'furthermore' implies addition, not contrast.)",
      },
      {
        mistake: "Notwithstanding the fact that the results were inconclusive, but the methodology was sound.",
        correction: "Notwithstanding the inconclusive results, the methodology was sound. (Do not double-mark contrast with both 'notwithstanding' and 'but'.)",
      },
      {
        mistake: "Firstly, the data was collected. Then, it was analysed. And then, results were reported. And then, conclusions were drawn.",
        correction: "First, the data were collected. Subsequently, they were analysed and the results reported. Finally, conclusions were drawn. (Vary sequential markers and avoid repetition.)",
      },
      {
        mistake: "However the team worked hard, the project failed.",
        correction: "However hard the team worked, the project failed. (Or: Although the team worked hard, the project failed.)",
      }
    ],
    quiz: [
      {
        question: "Which discourse marker correctly signals a contrastive relationship?",
        options: [
          "Furthermore",
          "Consequently",
          "Nevertheless",
          "Similarly"
        ],
        correctAnswer: 2,
        explanation: "'Nevertheless' is a contrastive marker indicating that the following point qualifies or opposes the preceding one. 'Furthermore' is additive, 'consequently' is causal, and 'similarly' is comparative."
      },
      {
        question: "In the sentence '___ the methodological limitations, the study offers valuable insights', which marker is most appropriate?",
        options: [
          "Furthermore",
          "Notwithstanding",
          "Consequently",
          "Hence"
        ],
        correctAnswer: 1,
        explanation: "'Notwithstanding' is a concessive preposition meaning 'despite', which correctly signals that the study's value is affirmed despite its limitations. The other options do not express concession."
      },
      {
        question: "What is the main problem with the sentence: 'The results were promising, however, the sample was too small'?",
        options: [
          "'However' cannot be used to show contrast",
          "The comma placement is incorrect; 'however' as a contrastive conjunctive adverb requires a semicolon before or a full stop before it",
          "The sentence is too short",
          "'Promising' and 'small' are contradictory"
        ],
        correctAnswer: 1,
        explanation: "When 'however' is used as a sentence adverb (conjunctive adverb) rather than within a clause, it should be preceded by a semicolon or full stop, not just a comma: 'The results were promising; however, the sample was too small.'"
      },
      {
        question: "Which of the following is an example of effective academic signposting?",
        options: [
          "Now I will talk about something else.",
          "Turning now to the question of ethical oversight, it is important to consider…",
          "Anyway, ethics matter.",
          "So yeah, moving on to ethics."
        ],
        correctAnswer: 1,
        explanation: "'Turning now to the question of…' is a formal signposting phrase that explicitly signals a transition to a new topic while maintaining the academic register. The other options are too informal for academic writing."
      },
      {
        question: "Which sentence uses a causal discourse marker correctly?",
        options: [
          "The experiment was well designed; nevertheless, the results were reliable.",
          "The funding was cut; consequently, the project was postponed.",
          "The theory is widely accepted; furthermore, some scholars dispute it.",
          "The data were incomplete; in contrast, the conclusions were sound."
        ],
        correctAnswer: 1,
        explanation: "'Consequently' is a causal marker correctly indicating that the postponement was a result of the funding cut. 'Nevertheless' and 'in contrast' are contrastive, and 'furthermore' is additive — none of which fits the logical relationship in their respective sentences."
      }
    ]
  },

  "Inversion for Rhetorical Effect": {
    explanation: `<h2>What Is Inversion?</h2>
<p>In English, the standard word order is Subject-Verb-Object (SVO), and any departure from this order is known as <em>inversion</em>. While English uses inversion in questions ("Have you finished?") as a matter of grammar, <strong>inversion for rhetorical effect</strong> is a stylistic choice that advanced speakers and writers employ to create emphasis, drama, or formality. By placing a negative or restrictive element at the beginning of a clause and inverting the subject and auxiliary verb, the writer signals that something remarkable, unexpected, or emphatic follows. This device is a hallmark of formal, literary, and academic prose at the C1-C2 level, and mastering it adds considerable sophistication to one's written expression.</p>

<h2>Negative Adverbial Inversion</h2>
<p>The most common type of rhetorical inversion involves placing a negative or near-negative adverbial at the front of the clause: <em>never, rarely, seldom, scarcely, hardly, no sooner, not only, nowhere, little</em>. When these items occupy the initial position, the subject and auxiliary verb invert: "Never <strong>have I</strong> witnessed such determination," "Rarely <strong>does one</strong> encounter such generosity," "Scarcely <strong>had</strong> she arrived when the trouble began." The effect is emphatic and often literary — the fronted negative element sets up a strong expectation, and the inverted clause delivers the unexpected content with rhetorical force. Note that if no auxiliary verb exists, <em>do/does/did</em> must be inserted, just as in questions: "Seldom <strong>did</strong> he complain."</p>

<h2>So/Such Inversion and Conditional Inversion</h2>
<p>After <em>so</em> or <em>such</em> when used as degree adverbs at the start of a clause, inversion occurs: "So impressive <strong>was</strong> the performance that the audience rose to their feet," "Such <strong>was</strong> her determination that no obstacle could deter her." This construction is particularly effective in descriptive and narrative writing, creating a dramatic build-up before revealing the subject. Conditional inversion replaces <em>if</em> with an inverted auxiliary in formal conditional clauses: "Had I known about the risks, I would have acted differently" (= "If I had known…"), "Were she to accept the offer, the entire dynamic would change" (= "If she were to accept…"). This pattern is especially common in formal academic and professional writing, lending concision and gravitas to hypothetical statements.</p>

<h2>Inversion After 'Only' Phrases and Other Fronted Elements</h2>
<p>Inversion also occurs after phrases beginning with <em>only</em>: "Only then <strong>did</strong> she realise the significance of the discovery," "Only after considerable debate <strong>was</strong> a consensus reached." Similarly, phrases with <em>not until, not since, under no circumstances, on no account, in no way, at no time</em> trigger inversion when fronted: "Under no circumstances <strong>should</strong> the data be disclosed," "At no time <strong>was</strong> the protocol violated." These constructions carry a strong prescriptive or emphatic force and are characteristic of legal, regulatory, and formal academic prose. The key to using all forms of inversion effectively is restraint: inverting too frequently makes writing feel affected and overwrought, but deploying it at a carefully chosen moment can lend a sentence extraordinary weight and memorability.</p>`,
    examples: [
      {
        sentence: "Never have I encountered such a compelling argument for reform.",
        note: "Negative adverbial inversion: 'Never' is fronted, triggering inversion of the auxiliary 'have' and the subject 'I' for rhetorical emphasis."
      },
      {
        sentence: "So profound was the impact that the entire industry was transformed.",
        note: "So-inversion: 'So profound' is fronted, the verb 'was' inverts before the subject 'the impact', creating dramatic emphasis on the degree."
      },
      {
        sentence: "Had the researchers considered alternative explanations, their conclusions might have differed.",
        note: "Conditional inversion: 'Had' replaces 'If…had', creating a concise, formal conditional without the explicit 'if'."
      },
      {
        sentence: "Only after the experiment was repeated did the findings gain acceptance.",
        note: "'Only after' phrase fronted, triggering inversion with 'did'. The emphasis falls on the condition that had to be met before acceptance."
      },
      {
        sentence: "Under no circumstances should the participants' identities be revealed.",
        note: "Negative prepositional phrase 'Under no circumstances' fronted, triggering inversion of 'should' and the subject — a construction common in formal rules and regulations."
      },
      {
        sentence: "Such was the complexity of the problem that even experts disagreed on the solution.",
        note: "Such-inversion: 'Such' is fronted before the verb 'was' and subject 'the complexity of the problem', emphasising the extraordinary degree."
      }
    ],
    commonMistakes: [
      {
        mistake: "Never I have seen such a display of courage.",
        correction: "Never have I seen such a display of courage.",
      },
      {
        mistake: "Had she knew the truth, she would have acted differently.",
        correction: "Had she known the truth, she would have acted differently.",
      },
      {
        mistake: "Only then she realised what had happened.",
        correction: "Only then did she realise what had happened.",
      },
      {
        mistake: "So impressive the performance was that the audience applauded for minutes.",
        correction: "So impressive was the performance that the audience applauded for minutes.",
      }
    ],
    quiz: [
      {
        question: "Which sentence correctly uses negative adverbial inversion?",
        options: [
          "Seldom she does complain about the workload.",
          "Seldom does she complain about the workload.",
          "Seldom she complains about the workload.",
          "Does seldom she complain about the workload."
        ],
        correctAnswer: 1,
        explanation: "When 'seldom' is fronted, the subject and auxiliary verb invert: 'Seldom does she complain'. The auxiliary 'does' is inserted because the main verb 'complain' has no auxiliary."
      },
      {
        question: "What does the conditional inversion 'Were she to accept the position, she would relocate' mean?",
        options: [
          "She has already accepted the position and will relocate",
          "If she were to accept the position, she would relocate",
          "She should accept the position and relocate",
          "She was relocating when she accepted the position"
        ],
        correctAnswer: 1,
        explanation: "Conditional inversion with 'Were she to' is equivalent to 'If she were to', expressing a hypothetical conditional. It does not indicate that the event has happened — only that it is imagined as a possibility."
      },
      {
        question: "Identify the incorrectly inverted sentence.",
        options: [
          "Hardly had the meeting begun when a disruption occurred.",
          "So rapid was the decline that recovery seemed impossible.",
          "Only after the data were verified the results were published.",
          "Under no circumstances may the documents be removed."
        ],
        correctAnswer: 2,
        explanation: "After 'Only after' fronting, inversion is required: 'Only after the data were verified were the results published.' The given version lacks inversion and is incorrect."
      },
      {
        question: "Which fronted element does NOT trigger inversion?",
        options: [
          "Not only",
          "Sometimes",
          "Never",
          "Under no circumstances"
        ],
        correctAnswer: 1,
        explanation: "'Sometimes' is an adverb of frequency but not a negative or restrictive one, so it does not trigger inversion. 'Not only', 'never', and 'under no circumstances' are all negative/restrictive elements that require inversion when fronted."
      },
      {
        question: "Complete the sentence with correct inversion: 'No sooner ___ the announcement than the market reacted.'",
        options: [
          "the CEO had made",
          "had the CEO made",
          "the CEO made",
          "did the CEO make"
        ],
        correctAnswer: 1,
        explanation: "'No sooner' is a negative fronted element that triggers past perfect inversion: 'No sooner had the CEO made' — auxiliary 'had' inverts before the subject 'the CEO'."
      }
    ]
  },

  "Reporting Verbs and Academic Voice": {
    explanation: `<h2>Beyond 'Said' and 'Told'</h2>
<p>In academic writing, the verbs used to report others' ideas are far more than neutral labels of speech; they are <strong>stance-bearing choices</strong> that position the writer in relation to the reported material. The verb 'said' is rarely used in academic prose because it is evaluatively neutral — it tells the reader nothing about the writer's attitude toward the reported claim. Instead, academic writers choose from a rich palette of reporting verbs, each encoding a different degree of commitment, tentativeness, or evaluation. For instance, 'Smith <em>contends</em>' signals strong advocacy, 'Lee <em>suggests</em>' conveys tentativeness, and 'Jones <em>challenges</em>' indicates opposition. Understanding these distinctions is essential for constructing a credible and nuanced academic voice at the C1-C2 level.</p>

<h2>Categories of Reporting Verbs</h2>
<p>Reporting verbs can be classified along several dimensions. <em>Argumentative verbs</em> — <em>contend, assert, maintain, argue, claim, insist</em> — present the source's position as a firm or forceful claim. <em>Tentative verbs</em> — <em>suggest, imply, hypothesise, speculate, postulate, intimate</em> — frame the reported position as provisional or hedged. <em>Evaluative verbs</em> — <em>challenge, dispute, refute, contradict, question, criticise, deny</em> — encode the source's or the writer's negative evaluation of a position. <em>Neutral verbs</em> — <em>note, observe, state, describe, outline, report</em> — present information without strong evaluative loading. Crucially, the same source can be reported with different verbs to produce different rhetorical effects: 'Chen <em>claims</em> that…' (skeptical distance) versus 'Chen <em>demonstrates</em> that…' (endorsement).</p>

<h2>Complement Patterns and Writer Stance</h2>
<p>Different reporting verbs govern different complement structures, and these grammatical patterns are not arbitrary — they correlate with the verb's meaning and the writer's stance. Many argumentative and tentative verbs take <em>that-clauses</em>: "She <em>argued that</em> the results were inconclusive." Some verbs take <em>wh-clauses</em>: "He <em>questioned whether</em> the methodology was appropriate." A smaller set take <em>to-infinitive</em> clauses: "She <em>claimed to have</em> discovered the mechanism." Some verbs allow <em>noun phrase</em> objects: "They <em>criticised the study's</em> sampling procedure." Understanding these patterns is essential for grammatical accuracy, but it also matters for stance: for example, 'He argued that the policy was flawed' embeds the proposition within the reporting frame, whereas 'He argued the policy to be flawed' is more formal and creates slightly more distance. At the advanced level, writers should vary their complement structures to avoid monotony and to fine-tune their positioning relative to the reported ideas.</p>`,
    examples: [
      {
        sentence: "Martinez contends that the current model fails to account for cultural variation.",
        note: "Argumentative verb 'contends' presents the source's position as a strong, deliberate claim — the writer is taking a firm stance."
      },
      {
        sentence: "The authors hypothesise that the observed effect may be temperature-dependent.",
        note: "Tentative verb 'hypothesise' frames the reported idea as a provisional explanation, not yet confirmed."
      },
      {
        sentence: "Patel disputes the claim that cognitive decline is inevitable in ageing populations.",
        note: "Evaluative verb 'disputes' signals active disagreement, positioning the reported source in opposition to an existing claim."
      },
      {
        sentence: "As Nakamura observes, the correlation between income and health outcomes is well documented.",
        note: "Neutral verb 'observes' reports a point without strong evaluative loading, implying the writer broadly accepts the observation."
      },
      {
        sentence: "Thompson implies that the findings may have been selectively reported.",
        note: "Tentative verb 'implies' suggests the source did not state the accusation directly but hinted at it, preserving plausible deniability."
      },
      {
        sentence: "The review questions whether the sample size was adequate for the conclusions drawn.",
        note: "Evaluative verb 'questions' takes a wh-clause ('whether'), introducing doubt about the validity of the sampled study's methodology."
      }
    ],
    commonMistakes: [
      {
        mistake: "She suggested that the researcher is wrong.",
        correction: "She challenged the researcher's conclusion. (Or: She disputed the finding.) 'Suggested' is too tentative for expressing direct disagreement.",
      },
      {
        mistake: "He claimed about the existence of a new species.",
        correction: "He claimed that a new species existed. (Or: He claimed the existence of a new species.) 'Claim' does not take 'about'.",
      },
      {
        mistake: "The study refuted to the hypothesis.",
        correction: "The study refuted the hypothesis. 'Refute' takes a direct object without a preposition.",
      },
      {
        mistake: "She argued the data to be insufficient, but the committee disagreed her.",
        correction: "She argued that the data were insufficient, but the committee disagreed with her. 'Disagree' requires 'with' before a person.",
      }
    ],
    quiz: [
      {
        question: "Which reporting verb best conveys that a source is presenting a strong, deliberate claim?",
        options: [
          "Suggests",
          "Implies",
          "Contends",
          "Speculates"
        ],
        correctAnswer: 2,
        explanation: "'Contends' is an argumentative reporting verb that signals a firm, deliberate claim. 'Suggests' and 'implies' are tentative, and 'speculates' indicates a hypothesis without strong evidence."
      },
      {
        question: "In the sentence 'Kim ___ whether the methodology was appropriate', which verb is grammatically and semantically correct?",
        options: [
          "asserted",
          "questioned",
          "claimed",
          "insisted"
        ],
        correctAnswer: 1,
        explanation: "'Questioned whether' is grammatically and semantically correct — 'question' takes a wh-clause and conveys doubt. 'Assert', 'claim', and 'insist' typically take that-clauses and express strong positive claims, not doubt."
      },
      {
        question: "What is the difference between 'Chen claims that the theory is flawed' and 'Chen demonstrates that the theory is flawed'?",
        options: [
          "There is no meaningful difference; both verbs are neutral",
          "'Claims' distances the writer from Chen's position, while 'demonstrates' endorses it as proven",
          "'Claims' is more formal than 'demonstrates'",
          "'Demonstrates' suggests Chen is wrong, while 'claims' suggests he is right"
        ],
        correctAnswer: 1,
        explanation: "'Claims' introduces sceptical distance — the writer is not committing to the truth of Chen's assertion. 'Demonstrates' signals that the writer accepts Chen's proof as valid, thereby endorsing the conclusion."
      },
      {
        question: "Which complement pattern is correct after the verb 'refute'?",
        options: [
          "refuted about the claim",
          "refuted that the claim",
          "refuted the claim",
          "refuted to the claim"
        ],
        correctAnswer: 2,
        explanation: "'Refute' takes a direct noun phrase object without a preposition: 'refuted the claim'. It does not take 'about', 'that' without a clause, or 'to' before its object."
      },
      {
        question: "A writer wants to indicate that a source hinted at an idea without stating it directly. Which verb is most appropriate?",
        options: [
          "Asserts",
          "Denies",
          "Implies",
          "Demonstrates"
        ],
        correctAnswer: 2,
        explanation: "'Implies' means to suggest something indirectly, without stating it explicitly — exactly the meaning required. 'Asserts' states directly, 'denies' contradicts, and 'demonstrates' proves."
      }
    ]
  },

  "Grammatical Cohesion: Ellipsis and Substitution": {
    explanation: `<h2>Cohesion Through Economy</h2>
<p>Grammatical cohesion refers to the linguistic devices that create textual connectedness by linking one part of a text to another. Among the most important of these devices are <strong>ellipsis</strong> and <strong>substitution</strong>, both of which achieve cohesion through economy — by omitting or replacing elements that can be recovered from the surrounding context. Rather than repeating the same words or phrases, skilled writers use ellipsis and substitution to avoid redundancy, maintain flow, and signal to the reader that the current clause is connected to a previous one. At the C1-C2 level, mastering these devices is essential for producing natural, fluent, and sophisticated prose that reads like the work of an accomplished English writer.</p>

<h2>Ellipsis: Omitting What Can Be Recovered</h2>
<p>Ellipsis is the omission of one or more words from a clause where their meaning can be understood from the context. The most common type in English is <em>verb phrase ellipsis</em>: "She can play the piano and he can ___, too" (the omitted element is 'play the piano'). <em>Noun phrase ellipsis</em> occurs when the head noun is omitted after a determiner or modifier: "Some students passed the exam, but many did not" ('many' = 'many students'). <em>Clausal ellipsis</em> omits an entire clause: "She might accept the offer, and she might not ___" ('not' stands for 'not accept the offer'). Ellipsis is governed by a recoverability principle: the omitted material must be inferable from the linguistic context, typically from the immediately preceding clause. When used correctly, ellipsis creates a tight, rhythmic prose style; when the omitted element is ambiguous or unrecoverable, it causes confusion.</p>

<h2>Substitution: Replacing with Pro-Forms</h2>
<p>Substitution replaces a previously mentioned element with a <em>pro-form</em> — a word that stands in for another item. <em>Nominal substitution</em> uses <em>one/ones</em>: "I prefer the red shirt to the blue one." <em>Verbal substitution</em> uses <em>do/does/did</em>: "She speaks French fluently, and so does her brother." <em>Clausal substitution</em> uses <em>so/not</em>: "Will the project be completed on time?" — "I think so" / "I hope not." Each type of substitution serves a different cohesive function: nominal substitution avoids repeating a noun, verbal substitution avoids repeating a verb phrase, and clausal substitution avoids repeating an entire proposition. Together with ellipsis, these devices create the <strong>textual economy and flow</strong> that distinguish proficient writing from the laboured, repetitive prose of less skilled writers.</p>`,
    examples: [
      {
        sentence: "She can play the piano and he can, too.",
        note: "Verb phrase ellipsis: 'play the piano' is omitted from the second clause because it is recoverable from the first."
      },
      {
        sentence: "I prefer the original methodology to the revised one.",
        note: "Nominal substitution: 'one' substitutes for 'methodology', avoiding repetition of the noun."
      },
      {
        sentence: "The initial hypothesis was supported by the data, and so was the secondary hypothesis.",
        note: "Verbal substitution: 'was' substitutes for 'was supported by the data', with 'so' triggering subject-auxiliary inversion."
      },
      {
        sentence: "Will the funding be extended? — I think so.",
        note: "Clausal substitution: 'so' substitutes for the entire clause 'the funding will be extended', expressing affirmative belief."
      },
      {
        sentence: "Some participants completed the survey, but many did not.",
        note: "Noun phrase ellipsis: 'many' implies 'many participants', and 'did not' uses verbal ellipsis for 'did not complete the survey'."
      },
      {
        sentence: "They claimed the results were conclusive, but I suspect not.",
        note: "Clausal substitution: 'not' substitutes for the negative of the preceding clause, meaning 'I suspect the results were not conclusive'."
      }
    ],
    commonMistakes: [
      {
        mistake: "She speaks French and he speaks French too, so they speaks French.",
        correction: "She speaks French and so does he. (Use verbal substitution 'does' instead of repeating the verb phrase.)",
      },
      {
        mistake: "I need a pen. Have you got one pen?",
        correction: "I need a pen. Have you got one? ('One' already substitutes for 'pen'; adding 'pen' is redundant.)",
      },
      {
        mistake: "Will the project succeed? — I think not so.",
        correction: "Will the project succeed? — I think not. (Clausal substitution uses 'not' alone, not 'not so'.)",
      },
      {
        mistake: "She can swim and he can swim, too, but she can swim better than he can swim.",
        correction: "She can swim and so can he, but she swims better than he can. (Use substitution and ellipsis to avoid repetition.)",
      }
    ],
    quiz: [
      {
        question: "Which sentence uses verb phrase ellipsis correctly?",
        options: [
          "He has finished the report and she has finished the report, too.",
          "He has finished the report and she has, too.",
          "He has finished the report and she has too finished.",
          "He has finished the report and she has finished too the report."
        ],
        correctAnswer: 1,
        explanation: "Verb phrase ellipsis allows the omission of 'finished the report' from the second clause: 'she has, too' is understood as 'she has finished the report, too'. This avoids redundant repetition."
      },
      {
        question: "In the sentence 'I prefer the ceramic mug to the glass one', what type of substitution is 'one'?",
        options: [
          "Verbal substitution",
          "Clausal substitution",
          "Nominal substitution",
          "Adjectival substitution"
        ],
        correctAnswer: 2,
        explanation: "'One' substitutes for the noun 'mug' — this is nominal substitution, where a pro-form replaces a noun to avoid repetition."
      },
      {
        question: "What does 'so' substitute for in the exchange: 'Is the proposal feasible?' — 'I believe so.'?",
        options: [
          "The word 'proposal'",
          "The word 'feasible'",
          "The entire clause 'the proposal is feasible'",
          "Nothing; 'so' is a conjunction here"
        ],
        correctAnswer: 2,
        explanation: "In clausal substitution, 'so' stands for the entire preceding proposition: 'I believe so' = 'I believe the proposal is feasible'."
      },
      {
        question: "Which sentence contains a redundant repetition that should be replaced with substitution or ellipsis?",
        options: [
          "Some agreed with the proposal, but many did not.",
          "She can drive a car and so can he.",
          "I need a laptop, and she needs a laptop too, so we both need a laptop.",
          "They completed the task, and we did too."
        ],
        correctAnswer: 2,
        explanation: "The sentence repeats 'need a laptop' three times unnecessarily. A cohesive version would use substitution or ellipsis: 'I need a laptop, and so does she.'"
      },
      {
        question: "Complete with the correct clausal substitution: 'Will the deadline be extended?' — 'I suspect ___.'",
        options: [
          "so not",
          "not",
          "not so",
          "no"
        ],
        correctAnswer: 1,
        explanation: "Clausal substitution for a negative response uses 'not' alone: 'I suspect not' means 'I suspect the deadline will not be extended'. 'Not so' and 'so not' are incorrect, and 'no' is a direct negation rather than a clausal substitute."
      }
    ]
  },

  "Metaphorical Language and Idiomatic Expression": {
    explanation: `<h2>Conceptual Metaphor Theory</h2>
<p>Far from being merely ornamental, metaphor is fundamental to human thought and language. According to <em>conceptual metaphor theory</em>, developed by Lakoff and Johnson, our ordinary conceptual system is fundamentally metaphorical in nature. We understand abstract concepts — time, knowledge, argument, emotion — by mapping them onto more concrete domains. Thus, we speak of <em>building</em> an argument, <em>navigating</em> complexity, <em>uncovering</em> the truth, and <em>illuminating</em> a problem. These are not isolated poetic flourishes but systematic patterns of thought that shape how we reason about the world. At the C1-C2 level, understanding metaphor as a <strong>cognitive and rhetorical tool</strong> — not just a stylistic embellishment — enables learners to interpret and produce nuanced, culturally embedded language with greater precision and confidence.</p>

<h2>Dead Metaphors, Live Metaphors, and Academic Discourse</h2>
<p>Metaphors exist on a spectrum from <em>dead</em> (fully conventionalised, no longer perceived as figurative) to <em>live</em> (novel and striking). 'The foot of the mountain' and 'the leg of the table' are dead metaphors — speakers process them literally. 'The government's u-turn on policy' and 'a sea change in public opinion' are partially dead; the figurative origin is still perceptible but the expressions are widely conventionalised. Live metaphors, by contrast, are freshly coined: 'The research landscape is a tangled thicket of contradictory findings.' In academic writing, <strong>dead and conventionalised metaphors</strong> are entirely acceptable and indeed pervasive ('the data shed light on…', 'this paves the way for…', 'the findings point to…'). Live metaphors, however, require care: a striking metaphor can clarify and illuminate, but a poorly chosen or mixed metaphor ('The data sheds light on the road that paves the way for the building blocks') creates confusion and undermines credibility.</p>

<h2>Idiomatic Expression at C1-C2</h2>
<p>Idiomatic expressions are fixed phrases whose meaning cannot be derived from the individual words — 'the elephant in the room' (an obvious problem no one wants to address), 'a double-edged sword' (something with both advantages and disadvantages), 'to pave the way' (to prepare for a development). At advanced levels, idiomatic competence is not about peppering speech with colourful phrases but about using idioms <em>appropriately, accurately, and with register awareness</em>. Many idioms are informal and unsuitable for academic writing; others, however, are fully at home in formal prose ('a case in point', 'by the same token', 'in the final analysis'). The key distinctions are <strong>register</strong> (formal vs. informal), <strong>transparency</strong> (how easily the meaning is guessed), and <strong>productivity</strong> (whether the idiom can be modified without breaking it). Advanced learners must develop sensitivity to all three dimensions in order to use idiomatic language convincingly.</p>`,
    examples: [
      {
        sentence: "The findings pave the way for a new line of inquiry into the mechanism.",
        note: "Conventionalised metaphor 'pave the way' = prepare or facilitate. It is widely accepted in academic register and no longer perceived as vividly figurative."
      },
      {
        sentence: "The elephant in the room is the lack of funding, which no one has yet addressed.",
        note: "Idiomatic expression 'the elephant in the room' = an obvious but unmentioned problem. More common in spoken and semi-formal academic contexts (e.g., discussion sections)."
      },
      {
        sentence: "Artificial intelligence is a double-edged sword: it offers efficiency but raises ethical concerns.",
        note: "Idiom 'a double-edged sword' = something with both benefits and drawbacks. Used to signal balanced, two-sided evaluation."
      },
      {
        sentence: "The current approach is merely scratching the surface of a deeply complex issue.",
        note: "Metaphor 'scratching the surface' = dealing with only the superficial aspect. Useful for indicating that analysis needs to go deeper."
      },
      {
        sentence: "The proposal represents a sea change in how the organisation approaches sustainability.",
        note: "Partially conventionalised metaphor 'a sea change' = a profound transformation. Formal enough for academic and professional contexts."
      },
      {
        sentence: "Navigating the complexities of international law requires both expertise and diplomacy.",
        note: "Conceptual metaphor 'navigating complexity' draws on the domain of physical movement through difficult terrain, mapping it onto intellectual challenge."
      }
    ],
    commonMistakes: [
      {
        mistake: "The findings pave the road for new research.",
        correction: "The findings pave the way for new research. ('Pave the way' is the fixed idiom; 'pave the road' is not the established form.)",
      },
      {
        mistake: "AI is a two-sided sword that cuts both edges.",
        correction: "AI is a double-edged sword. (The fixed idiom is 'double-edged sword'; mixing elements of related expressions creates an awkward hybrid.)",
      },
      {
        mistake: "The research sheds light on the issue and opens new doors that pave the way for building blocks of the foundation.",
        correction: "The research sheds light on the issue and paves the way for further investigation. (Mixed metaphors create confusion; use one consistent figurative frame.)",
      },
      {
        mistake: "He is the elephant of the room about the budget crisis.",
        correction: "The budget crisis is the elephant in the room. (The idiom is 'the elephant in the room', referring to the problem, not the person; 'of' should be 'in'.)",
      }
    ],
    quiz: [
      {
        question: "What is a 'dead metaphor'?",
        options: [
          "A metaphor that is no longer understood by anyone",
          "A metaphor that has become so conventionalised it is no longer perceived as figurative",
          "A metaphor about death and mortality",
          "A metaphor that is grammatically incorrect"
        ],
        correctAnswer: 1,
        explanation: "A dead metaphor is one that has become so fully conventionalised in everyday language that speakers process it literally — e.g., 'the foot of the mountain', 'the arm of a chair'. It is still understood but no longer recognised as figurative."
      },
      {
        question: "Which sentence contains a mixed metaphor?",
        options: [
          "The research sheds light on a long-standing problem.",
          "The findings pave the way for future studies.",
          "The data plant the seeds that pave the way for a new dawn of understanding.",
          "The argument is built on a solid foundation of evidence."
        ],
        correctAnswer: 2,
        explanation: "This sentence mixes three incompatible figurative frames: planting (seeds), paving (a road), and a new dawn (daylight). The clashing imagery creates confusion rather than clarity."
      },
      {
        question: "The idiom 'a double-edged sword' means:",
        options: [
          "Something that is extremely dangerous",
          "Something that has both advantages and disadvantages",
          "Something that is used in battle",
          "Something that cuts in two directions physically"
        ],
        correctAnswer: 1,
        explanation: "'A double-edged sword' idiomatically means something that has both positive and negative consequences — it cuts both ways, benefiting and harming simultaneously."
      },
      {
        question: "Which of these idiomatic expressions is most appropriate in formal academic writing?",
        options: [
          "It's a piece of cake to replicate the results.",
          "By the same token, the second experiment yielded similar findings.",
          "The researchers went the extra mile to ensure accuracy.",
          "The theory is on its last legs."
        ],
        correctAnswer: 1,
        explanation: "'By the same token' is a formal idiomatic expression meaning 'similarly' or 'for the same reason', appropriate for academic register. The other options are too informal for scholarly writing."
      },
      {
        question: "According to conceptual metaphor theory, why do we say 'building an argument'?",
        options: [
          "It is a random coincidence of language",
          "We map the abstract concept of argument onto the concrete domain of physical construction",
          "Arguments are always about buildings",
          "It is a live metaphor that surprises the reader"
        ],
        correctAnswer: 1,
        explanation: "Conceptual metaphor theory holds that we understand abstract domains (like argument) by mapping them onto concrete, embodied domains (like physical construction). 'Building an argument' reflects the ARGUMENT IS CONSTRUCTION metaphor, a systematic pattern in our conceptual system."
      }
    ]
  },

  "Critical Evaluation and Argumentation": {
    explanation: `<h2>Language for Critical Analysis</h2>
<p>Critical evaluation is the intellectual process of assessing the strength, validity, and significance of claims, evidence, and arguments. At the C1-C2 level, this process demands not only clear thinking but also <strong>precise linguistic resources</strong> for expressing nuanced judgement. Advanced English provides a rich repertoire of evaluative language — adjectives such as <em>compelling, problematic, reductive, persuasive, contentious, robust, tenuous</em>, and verbs such as <em>undermine, bolster, corroborate, problematise, substantiate</em> — that enable writers to calibrate their assessments with precision. Choosing between 'the argument is <em>unconvincing</em>' and 'the argument is <em>tenuous</em>' is not merely a matter of synonym variation; it reflects a different emphasis — the former on the reader's response, the latter on the argument's inherent weakness. Mastering these distinctions is central to producing authoritative academic prose.</p>

<h2>Concessive Structures and Counterargument</h2>
<p>Effective argumentation requires the ability to <em>acknowledge opposing positions</em> before refuting or qualifying them. Concessive structures are the primary grammatical means of doing this: "While X may be true, Y presents a more nuanced picture"; "Although the methodology was sound, the sample size limits the generalisability of the findings"; "Admittedly, the study has strengths, yet its central claim remains problematic." These structures serve a crucial rhetorical function: they demonstrate that the writer has considered alternative viewpoints, which strengthens credibility, and they create a dialectical movement in which thesis and antithesis lead to synthesis. At the advanced level, writers should vary their concessive markers — <em>while, although, admittedly, it is true that, granted, certainly… but/yet/however/nevertheless</em> — to avoid monotony and to fine-tune the degree of concession. A concession introduced by 'admittedly' signals stronger acceptance of the opposing point than one introduced by 'while'.</p>

<h2>Structuring Evaluation: Claim, Evidence, Assessment</h2>
<p>A well-structured evaluation typically follows a three-part pattern: <em>claim → evidence → assessment</em>. First, the writer states the position being evaluated ("Smith argues that economic growth inevitably reduces inequality"). Second, the writer presents the relevant evidence ("However, the data from post-industrial economies show widening income gaps during periods of growth"). Third, the writer delivers an explicit assessment ("This suggests that Smith's claim is reductive, as it fails to account for the mediating role of policy"). This pattern can be elaborated — with multiple pieces of evidence, alternative interpretations, and graded assessments — but the underlying structure remains the same. At the C1-C2 level, writers should aim to make their evaluation <strong>explicit and transparent</strong>, using evaluative language at the assessment stage rather than leaving the reader to infer the judgement. Phrases such as 'This is problematic because…', 'While this interpretation has merit, it overlooks…', and 'A more compelling account would consider…' are indispensable tools for this purpose.</p>`,
    examples: [
      {
        sentence: "While the study's methodology is generally robust, the small sample size problematises its claims to generalisability.",
        note: "Concessive structure with evaluative adjectives: 'robust' (positive) and 'problematises' (critical verb), balancing strengths and weaknesses."
      },
      {
        sentence: "The argument is compelling in its ambition but reductive in its treatment of cultural factors.",
        note: "Dual evaluation using contrasting evaluative adjectives: 'compelling' acknowledges the argument's strength, while 'reductive' identifies its oversimplification."
      },
      {
        sentence: "Admittedly, the longitudinal design strengthens the study; nevertheless, the attrition rate raises concerns about sample bias.",
        note: "Double concessive structure: 'admittedly' concedes a strength, 'nevertheless' introduces a counterbalancing weakness — demonstrating balanced, critical evaluation."
      },
      {
        sentence: "The author's claim is tenuous, as it rests on a single case study with no corroborating evidence.",
        note: "Evaluative adjective 'tenuous' (weak, flimsy) followed by explicit justification, following the claim-evidence-assessment pattern."
      },
      {
        sentence: "A more nuanced analysis would consider how socioeconomic variables mediate the observed effect.",
        note: "Constructive critical language: instead of merely attacking, the writer proposes an improvement, signalling intellectual generosity and analytical depth."
      }
    ],
    commonMistakes: [
      {
        mistake: "The study is bad because it has problems.",
        correction: "The study is methodologically problematic because it relies on a non-representative sample. (Be specific and use precise evaluative vocabulary.)",
      },
      {
        mistake: "Although the argument is strong, but it has weaknesses.",
        correction: "Although the argument is strong, it has weaknesses. (Do not use 'although' and 'but' together to mark the same concessive relationship.)",
      },
      {
        mistake: "The theory is wrong and completely terrible and has no value.",
        correction: "The theory is reductive and fails to account for key variables, limiting its explanatory power. (Use precise, measured evaluation rather than emotive absolutes.)",
      },
      {
        mistake: "The data is good. The data shows the hypothesis is good.",
        correction: "The data substantiate the hypothesis, providing compelling evidence for the proposed mechanism. (Avoid vague evaluative words like 'good'; use precise academic alternatives.)",
      }
    ],
    quiz: [
      {
        question: "Which sentence best demonstrates balanced critical evaluation?",
        options: [
          "The study is completely wrong and has no merit whatsoever.",
          "While the study makes a valuable contribution, its reliance on self-reported data introduces potential bias.",
          "The study is kind of okay but not really good.",
          "The study is the best research ever conducted on this topic."
        ],
        correctAnswer: 1,
        explanation: "This sentence uses a concessive structure ('While…') to acknowledge a strength ('valuable contribution') before introducing a specific, justified criticism ('reliance on self-reported data introduces potential bias'). It is balanced, precise, and appropriately hedged."
      },
      {
        question: "What is the function of the concessive structure 'Admittedly… nevertheless…' in academic argumentation?",
        options: [
          "To present two unrelated facts",
          "To concede a point while maintaining an opposing position, demonstrating balanced reasoning",
          "To agree entirely with the opposing view",
          "To avoid committing to any position"
        ],
        correctAnswer: 1,
        explanation: "'Admittedly… nevertheless…' concedes a point (showing the writer has considered the opposing view) before introducing a counterbalancing argument. This strengthens the writer's credibility and demonstrates dialectical reasoning."
      },
      {
        question: "Which evaluative adjective suggests that an argument oversimplifies a complex issue?",
        options: [
          "Compelling",
          "Robust",
          "Reductive",
          "Persuasive"
        ],
        correctAnswer: 2,
        explanation: "'Reductive' means oversimplifying something complex — reducing it to simpler terms than it warrants. 'Compelling', 'robust', and 'persuasive' are all positive evaluative adjectives."
      },
      {
        question: "In the claim-evidence-assessment pattern, what is the function of the 'assessment' stage?",
        options: [
          "To introduce a new, unrelated claim",
          "To provide the raw data without interpretation",
          "To deliver an explicit evaluative judgement based on the evidence presented",
          "To repeat the initial claim in different words"
        ],
        correctAnswer: 2,
        explanation: "The assessment stage is where the writer delivers an explicit evaluative judgement, drawing on the evidence to support that evaluation. Without this stage, the reader is left to infer the writer's position, which weakens the argument."
      },
      {
        question: "Which sentence follows the claim-evidence-assessment pattern most effectively?",
        options: [
          "The policy is problematic. It was implemented in 2010. It has issues.",
          "Chen argues that economic growth reduces inequality. However, data from post-industrial economies show widening income gaps during periods of growth, suggesting the claim is reductive.",
          "Economic growth is good. Data show things improve. This is correct.",
          "I disagree with Chen because I think inequality is a problem that matters a lot."
        ],
        correctAnswer: 1,
        explanation: "This sentence follows the pattern clearly: claim (Chen argues…), evidence (data show widening income gaps), and assessment (suggesting the claim is reductive). It is specific, well-structured, and uses precise evaluative language."
      }
    ]
  },

  "Diplomatic Language and Softening": {
    explanation: `<h2>Diplomatic Language and Softening</h2>
<p>At the C1-C2 level, language is not merely about being understood — it is about <strong>managing relationships, preserving face</strong>, and achieving goals without creating conflict. Directness that works in some cultures can damage professional relationships in English-speaking contexts. Diplomatic language uses three main techniques: <strong>softeners</strong>, <strong>downtoners</strong>, and <strong>restructuring</strong>.</p>

<p>Softeners reduce the force of a statement. Adverb softeners include <em>"I'm afraid I can't meet the deadline"</em>, <em>"It's slightly more complicated than that"</em>, <em>"The figures are a little concerning"</em>, and <em>"I'm not entirely convinced by that approach."</em> Modal softeners use <em>might, may, could,</em> and <em>would</em> to make claims tentative: <em>"It might be worth reconsidering"</em> (not "You should reconsider"), <em>"We may need to adjust our strategy"</em>, and <em>"That wouldn't be my first choice."</em> Downtoners make criticism indirect: <em>"I'm not sure that's the most effective approach"</em> (not "That's wrong"), and <em>"I wonder if we should consider alternatives."</em></p>

<p>The <strong>sandwich technique</strong> packages criticism constructively: (1) Positive: <em>"The presentation was well-structured and visually engaging"</em>, (2) Constructive: <em>"One area for development might be the pacing in the middle section"</em>, (3) Encouraging: <em>"With that adjustment, it will be even more compelling."</em> Diplomatic refusal uses phrases like <em>"I'd love to help, but I'm stretched quite thin at the moment"</em> and <em>"Under different circumstances, I'd be delighted to, but…"</em> Partial agreement to disagree uses <em>"I take your point about cost efficiency. I wonder, though, whether quality might suffer."</em></p>`,
    examples: [
      {
        sentence: "I'm not entirely convinced by that approach. Perhaps we could explore some alternatives?",
        note: "Modal softener + suggestion — 'not entirely convinced' is far more diplomatic than 'that's wrong'."
      },
      {
        sentence: "It might be worth reconsidering the timeline.",
        note: "Modal softener — 'might be worth' turns a directive into a gentle suggestion."
      },
      {
        sentence: "I'd love to help, but I'm stretched quite thin at the moment. Have you spoken to Jamie?",
        note: "Diplomatic refusal + alternative — declines without offence and offers a solution."
      },
      {
        sentence: "The presentation was well-structured and visually engaging. One area for development might be the pacing. With that adjustment, it will be even more compelling.",
        note: "Sandwich technique — positive, constructive, encouraging. Criticism is received better within a positive frame."
      },
      {
        sentence: "I take your point about cost efficiency. I wonder, though, whether quality might suffer if we cut corners.",
        note: "Partial agreement + redirect — acknowledges the other view before introducing a concern."
      }
    ],
    commonMistakes: [
      {
        mistake: "Your idea won't work.",
        correction: "I'm not entirely sure that approach would deliver the results we're hoping for. Perhaps we could explore some alternatives? (Direct criticism damages relationships.)"
      },
      {
        mistake: "You need to finish this by Friday.",
        correction: "Would it be feasible to have this completed by Friday? That would really help us stay on track. (Commands feel aggressive; questions feel collaborative.)"
      },
      {
        mistake: "This report is full of mistakes.",
        correction: "Thank you for pulling this together. There are a few areas where the figures might need double-checking before we finalise it. (Constructive feedback preserves motivation.)"
      },
      {
        mistake: "That's not my job.",
        correction: "That falls a bit outside my usual remit. I'd be happy to point you towards the right person, though. (Polite boundary-setting with a helpful alternative.)"
      }
    ],
    quiz: [
      {
        question: "Which sentence uses a modal softener most effectively?",
        options: [
          "You must reconsider the timeline.",
          "It might be worth reconsidering the timeline.",
          "The timeline is wrong.",
          "Change the timeline now."
        ],
        correctAnswer: 1,
        explanation: "'It might be worth reconsidering' uses the modal 'might' to soften what could otherwise be a directive. It preserves the other person's autonomy while still conveying the suggestion."
      },
      {
        question: "What is the sandwich technique?",
        options: [
          "Give three criticisms in a row",
          "Start with something positive, give constructive feedback, then end with encouragement",
          "Put all criticism between two jokes",
          "Sandwich your real opinion between two lies"
        ],
        correctAnswer: 1,
        explanation: "The sandwich technique frames criticism between positive and encouraging remarks, making it more likely to be received constructively rather than defensively."
      },
      {
        question: "How do you refuse a request diplomatically?",
        options: [
          "No. I won't do it.",
          "I refuse.",
          "I'd love to help, but I'm stretched quite thin at the moment.",
          "That's not my problem."
        ],
        correctAnswer: 2,
        explanation: "Starting with appreciation ('I'd love to help') and giving a valid reason ('stretched quite thin') softens the refusal while maintaining the relationship."
      },
      {
        question: "Which phrase uses a downtoner to make criticism indirect?",
        options: [
          "That's completely wrong.",
          "I wonder if we should consider alternatives.",
          "Your work is terrible.",
          "I hate this idea."
        ],
        correctAnswer: 1,
        explanation: "'I wonder if we should consider alternatives' implies the current approach is inadequate without directly criticising it. The downtoner 'I wonder' makes it a question rather than a judgement."
      },
      {
        question: "What does 'I take your point about X, but I wonder whether Y' achieve?",
        options: [
          "It agrees completely",
          "It disagrees completely",
          "It partially agrees and then introduces a contrasting concern diplomatically",
          "It avoids the topic"
        ],
        correctAnswer: 2,
        explanation: "This structure acknowledges the other person's point ('I take your point') before introducing an alternative perspective ('I wonder whether'), making disagreement feel collaborative rather than adversarial."
      }
    ]
  },

  "Humour, Irony, and Figurative Language": {
    explanation: `<h2>Humour, Irony, and Figurative Language</h2>
<p>Understanding and using English humour is a mark of advanced proficiency. The main types include: <strong>self-deprecating humour</strong> (making fun of yourself to put others at ease, especially common in British English: <em>"Well, I'm hardly the expert here — I can barely work my own phone"</em>), <strong>understatement</strong> (saying something is small when it's actually major: <em>"It's a bit chilly"</em> when it's -10°C), <strong>wordplay and puns</strong> (using double meanings: <em>"I used to be a baker, but I couldn't make enough dough"</em>), and <strong>sarcasm</strong> (saying the opposite of what you mean, often mockingly: <em>"Oh great, another meeting. Just what I needed."</em>).</p>

<p>Sarcasm and irony are distinct. <strong>Sarcasm</strong> is saying the opposite with mocking intent — tone is key. <strong>Irony</strong> is a contrast between expectation and reality — <em>"The fire station burned down"</em> is ironic, not sarcastic. Figurative language at C1-C2 includes <strong>metaphors</strong> (<em>"Time is money"</em>, <em>"The market is a roller coaster"</em>), <strong>similes</strong> (<em>"He works like a dog"</em>, <em>"It's as clear as mud"</em> — sarcastic, meaning not clear at all), and <strong>idioms</strong> (<em>"It's not rocket science"</em> = it's not difficult; <em>"The ball is in your court"</em> = it's your decision; <em>"Don't throw the baby out with the bathwater"</em> = don't discard something valuable when removing something bad).</p>

<p>In professional settings, safe humour includes universal experiences (meetings, technology fails), self-deprecation, and clever wordplay. Avoid sarcasm in emails (tone doesn't translate), jokes at someone else's expense, anything about protected characteristics, and anything requiring very specific cultural knowledge. When in doubt, leave it out.</p>`,
    examples: [
      {
        sentence: "My cooking is so bad the smoke alarm cheers me on.",
        note: "Self-deprecating humour — making fun of yourself is safe and puts others at ease."
      },
      {
        sentence: "It's a bit chilly. (said during a blizzard at -15°C)",
        note: "Classic British understatement — describing something extreme as mild for comic effect."
      },
      {
        sentence: "Oh great, another meeting. Just what I needed.",
        note: "Sarcasm — saying the opposite of what you mean. Tone makes the meaning clear."
      },
      {
        sentence: "The market is a roller coaster this month.",
        note: "Metaphor — comparing the market to a roller coaster conveys volatility vividly without literal meaning."
      },
      {
        sentence: "It's as clear as mud. (meaning: it's completely unclear)",
        note: "Simile used sarcastically — the literal meaning of 'clear' is reversed for humorous effect."
      }
    ],
    commonMistakes: [
      {
        mistake: "Using sarcasm in a professional email.",
        correction: "Avoid sarcasm in writing — tone doesn't translate. What sounds playful in speech can read as rude in text. Use direct, polite language instead."
      },
      {
        mistake: "Making jokes about a colleague's appearance.",
        correction: "In professional settings, only self-deprecation is safe. Never make jokes at someone else's expense, especially about personal characteristics."
      },
      {
        mistake: "Taking 'Not bad' literally as a criticism.",
        correction: "In British English, 'Not bad' often means 'excellent'. Understatement is a cultural norm — it's praise, not criticism."
      },
      {
        mistake: "Using idioms like 'touch base' with non-native speakers who may not understand.",
        correction: "In international contexts, use plain language: 'let's discuss' instead of 'let's touch base'. Idioms often don't translate across cultures."
      }
    ],
    quiz: [
      {
        question: "Which sentence uses self-deprecating humour?",
        options: [
          "You're terrible at this.",
          "My cooking is so bad the smoke alarm cheers me on.",
          "This company is a joke.",
          "Nobody here knows what they're doing."
        ],
        correctAnswer: 1,
        explanation: "Self-deprecating humour makes fun of yourself, not others. It's the safest form of humour in professional settings because it doesn't target anyone else."
      },
      {
        question: "What is the difference between sarcasm and irony?",
        options: [
          "They are the same thing",
          "Sarcasm is always funny; irony is always sad",
          "Sarcasm is saying the opposite with mocking intent; irony is a contrast between expectation and reality",
          "Irony requires an audience; sarcasm doesn't"
        ],
        correctAnswer: 2,
        explanation: "Sarcasm is deliberate — saying the opposite to mock or convey contempt. Irony is situational — a contrast between what is expected and what actually happens."
      },
      {
        question: "What does 'It's not rocket science' mean?",
        options: [
          "It's about space travel",
          "It's extremely difficult",
          "It's not difficult",
          "It requires scientific knowledge"
        ],
        correctAnswer: 2,
        explanation: "'It's not rocket science' is an idiom meaning 'it's not difficult'. Rocket science is used as a metaphor for something extremely complex."
      },
      {
        question: "Why should sarcasm be avoided in professional emails?",
        options: [
          "Emails should never contain any humour",
          "Tone doesn't translate in writing — sarcasm can read as rude or mean",
          "Sarcasm is only for face-to-face arguments",
          "Emails are always formal"
        ],
        correctAnswer: 1,
        explanation: "Sarcasm relies heavily on tone of voice and facial expressions. In writing, these cues are absent, so sarcasm often comes across as genuinely mean rather than playfully ironic."
      },
      {
        question: "What does 'The market is a roller coaster' use?",
        options: [
          "Simile",
          "Irony",
          "Metaphor",
          "Sarcasm"
        ],
        correctAnswer: 2,
        explanation: "A metaphor directly equates one thing to another without 'like' or 'as'. A simile would be 'The market is LIKE a roller coaster.' The metaphor is more vivid and direct."
      }
    ]
  },

  "Narrative Techniques and Storytelling": {
    explanation: `<h2>Narrative Techniques and Storytelling</h2>
<p>Compelling storytelling at the C1-C2 level uses a structured arc: <strong>hook → context → inciting incident → rising action → climax → resolution → takeaway</strong>. Beyond structure, advanced storytelling employs techniques like <strong>framing</strong> (beginning at the end or middle: <em>"The hospital corridor was silent at 3 AM. Twelve hours earlier, everything had been normal."</em>), <strong>flashbacks</strong> (<em>"It reminded me of something that happened five years ago…"</em>), and <strong>pacing control</strong> (short sentences for action: <em>"The door opened. Nobody there."</em>; longer sentences for reflection: <em>"I stood for what felt like an eternity, trying to process what I'd just heard."</em>).</p>

<p>The principle of <strong>"show, don't tell"</strong> is fundamental. Instead of telling <em>"It was scary"</em>, show: <em>"My hands wouldn't stop shaking. Every shadow in the corridor seemed to move."</em> Instead of telling <em>"She was angry"</em>, show: <em>"Her voice dropped to a whisper. She set her cup down very carefully."</em> This technique creates vivid, immersive experiences for the listener or reader by conveying emotions through observable details rather than labelling them directly.</p>

<p>Dialogue techniques include varied speech tags beyond "said" (<em>muttered, snapped, whispered, sighed</em>), action beats instead of tags (<em>"'I'm done.' She slammed the door."</em>), and <strong>subtext</strong> — what the character means versus what they say (<em>"'Fine. Do whatever you want.' She turned away."</em> — she is NOT fine). Withholding information builds suspense: <em>"There was one thing I hadn't told them. One thing that changed everything."</em> The skill lies in choosing the right technique for each moment and knowing when to reveal information for maximum impact.</p>`,
    examples: [
      {
        sentence: "The hospital corridor was silent at 3 AM. Twelve hours earlier, everything had been normal.",
        note: "Framing — beginning at the end creates immediate intrigue and a sense of impending drama."
      },
      {
        sentence: "My hands wouldn't stop shaking. Every shadow in the corridor seemed to move.",
        note: "Show, don't tell — instead of saying 'I was scared', physical details convey the fear vividly."
      },
      {
        sentence: "'Fine. Do whatever you want.' She turned away.",
        note: "Subtext — the words say 'fine' but the action (turning away) and tone reveal she is absolutely NOT fine."
      },
      {
        sentence: "The door opened. Nobody there.",
        note: "Pacing — short, fragmented sentences create urgency and tension in action moments."
      },
      {
        sentence: "There was one thing I hadn't told them. One thing that changed everything.",
        note: "Withholding information — creates suspense by promising revelation, keeping the audience engaged."
      }
    ],
    commonMistakes: [
      {
        mistake: "It was scary. I was afraid.",
        correction: "My hands wouldn't stop shaking. Every shadow in the corridor seemed to move. (Show emotions through physical details and observable behaviour, not labels.)"
      },
      {
        mistake: "She was angry. She said she was angry.",
        correction: "Her voice dropped to a whisper. She set her cup down very carefully. (Let actions and behaviour convey emotion instead of stating it directly.)"
      },
      {
        mistake: "'I'm fine,' she said. She was not fine.",
        correction: "'Fine. Do whatever you want.' She turned away. (Use subtext — the gap between words and actions tells the story more powerfully than explanation.)"
      },
      {
        mistake: "And then this happened. And then that happened. And then...",
        correction: "Use varied pacing: short sentences for action, longer ones for reflection. Vary sentence openings and rhythms to maintain engagement."
      }
    ],
    quiz: [
      {
        question: "What does 'show, don't tell' mean in storytelling?",
        options: [
          "Use pictures instead of words",
          "Convey emotions through observable details and actions rather than stating them directly",
          "Always describe everything in minute detail",
          "Never use adjectives"
        ],
        correctAnswer: 1,
        explanation: "'Show, don't tell' means using physical details, actions, and dialogue to convey emotions rather than labelling them. 'Her hands trembled' shows fear; 'She was scared' tells it."
      },
      {
        question: "What is 'subtext' in dialogue?",
        options: [
          "The literal meaning of what a character says",
          "A summary of the conversation",
          "The underlying meaning beneath what a character says — the gap between words and true feelings",
          "The punctuation used in dialogue"
        ],
        correctAnswer: 2,
        explanation: "Subtext is the unspoken meaning — what a character really thinks or feels, which differs from what they actually say. 'Fine. Do whatever you want' is not fine at all."
      },
      {
        question: "Which sentence uses framing as a narrative technique?",
        options: [
          "I woke up and had breakfast.",
          "The hospital corridor was silent at 3 AM. Twelve hours earlier, everything had been normal.",
          "She walked to the shop.",
          "It was a sunny day."
        ],
        correctAnswer: 1,
        explanation: "Framing begins at a dramatic point (3 AM in a hospital) and then jumps back in time, creating immediate intrigue about how the narrator got there."
      },
      {
        question: "How does pacing affect storytelling?",
        options: [
          "It doesn't matter how long or short sentences are",
          "Short sentences create urgency and tension; longer sentences create reflection and atmosphere",
          "All sentences should be the same length",
          "Longer sentences are always better"
        ],
        correctAnswer: 1,
        explanation: "Short, fragmented sentences accelerate the pace for action and tension. Longer, flowing sentences slow the pace for reflection and atmosphere. Varying rhythm keeps audiences engaged."
      },
      {
        question: "What is the purpose of withholding information in a story?",
        options: [
          "To confuse the audience",
          "To make the story shorter",
          "To build suspense by promising a revelation, keeping the audience engaged",
          "To avoid having to explain things"
        ],
        correctAnswer: 2,
        explanation: "Withholding key information ('There was one thing I hadn't told them') creates a promise to the audience that a revelation is coming, which maintains engagement and suspense."
      }
    ]
  },

  "Register Shifting \u2014 Formal to Informal": {
    explanation: `<h2>Register Shifting — Formal to Informal</h2>
<p>Register is the level of formality in language, determined by the situation, the relationship between speakers, the medium, and the topic. The formality spectrum runs from <strong>frozen</strong> (legal oaths, <em>"hereby"</em>) through <strong>formal</strong> (academic papers, <em>"furthermore"</em>) and <strong>consultative</strong> (job interviews, <em>"I believe"</em>) to <strong>casual</strong> (chat with colleagues, <em>"anyway"</em>) and <strong>intimate</strong> (close friends, <em>"sort of thing"</em>). Mastering register shifting means choosing the right level for every context.</p>

<p>The same meaning can be expressed at different registers. <em>"It is submitted that the aforementioned findings are indicative of a broader trend"</em> (extremely formal) → <em>"The findings suggest a broader trend that warrants further investigation"</em> (professional formal) → <em>"It looks like there's a bigger pattern here. We should dig into it"</em> (neutral professional) → <em>"Looks like a trend to me. Worth exploring?"</em> (casual). Key vocabulary shifts include: <em>commence → begin → start → kick off</em>, <em>terminate → end → finish → wrap up</em>, <em>sufficient → enough → plenty</em>, <em>assistance → help → a hand</em>, <em>purchase → buy → pick up</em>, and <em>approximately → about → around → -ish</em>.</p>

<p>When to shift register: <strong>upward</strong> (more formal) for job interviews, first meetings with senior people, formal complaints, and writing to unknown clients; <strong>downward</strong> (less formal) once rapport is established, at team celebrations, and with industry peers at conferences. You can even shift within the same email: opening formal, body slightly less formal, closing formal again. The key skill is reading the room — noticing the register others are using and matching it appropriately.</p>`,
    examples: [
      {
        sentence: "It is submitted that the aforementioned findings are indicative of a broader trend.",
        note: "Extremely formal register — passive voice, Latinate vocabulary, legal/academic style."
      },
      {
        sentence: "The findings suggest a broader trend that warrants further investigation.",
        note: "Professional formal — still formal but more direct and readable than the frozen register."
      },
      {
        sentence: "It looks like there's a bigger pattern here. We should dig into it.",
        note: "Neutral professional — contractions, simpler vocabulary, direct but still workplace-appropriate."
      },
      {
        sentence: "Looks like a trend to me. Worth exploring?",
        note: "Casual register — ellipsis, informal phrasing, appropriate for close colleagues."
      },
      {
        sentence: "Same old pattern, innit?",
        note: "Very informal/intimate register — slang, tag question, only appropriate with close friends."
      }
    ],
    commonMistakes: [
      {
        mistake: "Using casual register in a job interview: 'So, yeah, I reckon I'm pretty good at that stuff.'",
        correction: "Using consultative register: 'I believe my experience in this area would be an asset to your team.' (Match your register to the formality of the situation.)"
      },
      {
        mistake: "Using formal register with close colleagues: 'I would like to request your assistance with regard to the aforementioned matter.'",
        correction: "Using casual register: 'Could you give me a hand with this?' (Over-formal language with colleagues creates distance, not respect.)"
      },
      {
        mistake: "Mixing registers inappropriately: 'Pursuant to our discussion, I've knocked up a draft.'",
        correction: "Keep register consistent: 'Following our discussion, I've prepared a draft.' (Don't mix legal language with slang in the same sentence.)"
      },
      {
        mistake: "Using 'approximately' in casual conversation.",
        correction: "Use 'about' or 'around' in casual speech: 'It costs about fifty pounds' not 'It costs approximately fifty pounds.' (Formal words in casual contexts sound stilted.)"
      }
    ],
    quiz: [
      {
        question: "Which register is appropriate for a job interview?",
        options: [
          "Frozen",
          "Formal to consultative",
          "Casual",
          "Intimate"
        ],
        correctAnswer: 1,
        explanation: "Job interviews require formal to consultative register — professional but not legalistic. You want to sound competent and polished, not stiff or overly casual."
      },
      {
        question: "What is the casual alternative to 'purchase'?",
        options: [
          "Acquire",
          "Procure",
          "Buy",
          "Kick off"
        ],
        correctAnswer: 2,
        explanation: "The register shift for 'purchase' goes: purchase (formal) → buy (neutral) → pick up (casual). 'Kick off' is the casual form of 'commence', not 'purchase'."
      },
      {
        question: "Which sentence is in the consultative register?",
        options: [
          "It is hereby declared that the findings are significant.",
          "I was wondering if you could possibly help me with this?",
          "Fancy a coffee? I'm dying for one.",
          "You know what I mean… that thing we talked about."
        ],
        correctAnswer: 1,
        explanation: "Consultative register is standard, polite language used in professional but not extremely formal situations. The other options are frozen (A), casual (C), and intimate (D)."
      },
      {
        question: "When should you shift to a MORE formal register?",
        options: [
          "At a team celebration",
          "When chatting with close colleagues",
          "In a first meeting with a senior executive",
          "When sending a quick message to a friend"
        ],
        correctAnswer: 2,
        explanation: "First meetings with senior people require upward register shift — more formal language shows respect and professionalism. Casual language would seem disrespectful."
      },
      {
        question: "What does 'approximately → about → around → -ish' demonstrate?",
        options: [
          "Grammar errors",
          "The same meaning expressed at progressively less formal registers",
          "Different meanings",
          "American vs British English"
        ],
        correctAnswer: 1,
        explanation: "This shows a register gradient: 'approximately' (formal) → 'about' (neutral) → 'around' (casual) → '-ish' (very informal). Same meaning, different levels of formality."
      }
    ]
  },

  "Persuasion and Rhetoric": {
    explanation: `<h2>Persuasion and Rhetoric</h2>
<p>Classical rhetoric, originating with Aristotle, identifies three pillars of persuasion: <strong>ethos</strong> (credibility), <strong>pathos</strong> (emotion), and <strong>logos</strong> (logic). Ethos establishes your credibility: <em>"Having worked in this industry for 20 years, I've seen this pattern repeatedly."</em> Pathos appeals to emotion: <em>"Imagine telling your team their jobs are secure because you made the right call today."</em> Logos appeals to logic: <em>"The data show a 23% improvement in efficiency."</em></p>

<p>Classical rhetorical devices remain powerful tools. <strong>Tripling</strong> (rule of three): <em>"This strategy is simpler, faster, and cheaper."</em> — three items create rhythm and completeness. <strong>Rhetorical questions</strong>: <em>"Can we afford to wait any longer?"</em> — used for emphasis, not to seek information. <strong>Anaphora</strong> (repetition at the start of phrases): <em>"We want safety. We want fairness. We want a future."</em> — creates momentum. <strong>Antithesis</strong> (contrasting ideas): <em>"We must learn to live together as brothers or perish together as fools."</em> — sharpens the choice. <strong>Analogies and metaphors</strong>: <em>"Changing the system now is like changing the engine while flying the plane."</em></p>

<p>Modern persuasion techniques complement classical rhetoric. <strong>Social proof</strong>: <em>"Over 10,000 companies have already adopted this approach."</em> <strong>Scarcity/urgency</strong>: <em>"This pricing is only available until the end of the quarter."</em> <strong>Reciprocity</strong>: <em>"I've shared our preliminary analysis. I'd welcome your thoughts."</em> The most persuasive arguments combine all three classical appeals — ethos, pathos, and logos — with modern techniques and at least one rhetorical device for maximum impact.</p>`,
    examples: [
      {
        sentence: "Having worked in this industry for 20 years, I've seen this pattern repeatedly.",
        note: "Ethos — establishing credibility through experience. The audience is more likely to trust a speaker who demonstrates relevant expertise."
      },
      {
        sentence: "Imagine telling your team their jobs are secure because you made the right call today.",
        note: "Pathos — emotional appeal. Vivid imagery ('telling your team their jobs are secure') connects the argument to personal feelings."
      },
      {
        sentence: "The data show a 23% improvement in efficiency, and the system pays for itself in 8 months.",
        note: "Logos — logical appeal using specific data and a clear cause-effect argument."
      },
      {
        sentence: "We want safety. We want fairness. We want a future.",
        note: "Anaphora — repetition of 'We want' at the start of each phrase creates rhythmic momentum and emotional force."
      },
      {
        sentence: "We can pay for wellbeing now, or we can pay for recruitment indefinitely.",
        note: "Antithesis — presenting two contrasting options in parallel structure sharpens the choice and makes one option clearly preferable."
      }
    ],
    commonMistakes: [
      {
        mistake: "Relying solely on logic without emotional appeal.",
        correction: "Combine logos with pathos and ethos. Data alone rarely persuades — people decide with emotions and justify with logic. Add a personal story or vivid image."
      },
      {
        mistake: "Using too many rhetorical questions in a row.",
        correction: "Use rhetorical questions sparingly for emphasis — one or two in a speech is powerful; five in a row feels manipulative. Balance with statements."
      },
      {
        mistake: "Making claims without supporting evidence.",
        correction: "Every claim needs backing: statistical evidence (logos), credible sources (ethos), or relatable stories (pathos). Unsupported claims weaken your entire argument."
      },
      {
        mistake: "Using 'honestly' or 'to be honest' repeatedly.",
        correction: "These phrases actually undermine your credibility (ethos) by implying you might not always be honest. Let the strength of your evidence speak for itself."
      }
    ],
    quiz: [
      {
        question: "Which rhetorical device is used in 'We want change. We need change. We demand change.'?",
        options: [
          "Antithesis",
          "Anaphora",
          "Metaphor",
          "Rhetorical question"
        ],
        correctAnswer: 1,
        explanation: "Anaphora is the repetition of the same word or phrase at the beginning of successive clauses. Here, 'We' + verb is repeated three times, creating rhythmic momentum."
      },
      {
        question: "What appeal is used in 'As a doctor with 15 years in emergency medicine, I can tell you…'?",
        options: [
          "Pathos",
          "Logos",
          "Ethos",
          "Anaphora"
        ],
        correctAnswer: 2,
        explanation: "This is ethos — establishing credibility through professional credentials and experience. The audience trusts the speaker because of their demonstrated expertise."
      },
      {
        question: "Which sentence uses antithesis?",
        options: [
          "We came, we saw, we conquered.",
          "Can we afford to wait any longer?",
          "It was the best of times, it was the worst of times.",
          "The data show a 23% improvement."
        ],
        correctAnswer: 2,
        explanation: "Antithesis places contrasting ideas in parallel structure: 'best of times' vs 'worst of times'. The contrast sharpens the difference and makes the statement more memorable."
      },
      {
        question: "What is 'social proof' as a persuasion technique?",
        options: [
          "Proving your argument with scientific evidence",
          "Using the behaviour or choices of others to validate your proposal",
          "Being friendly on social media",
          "Writing formal proofs"
        ],
        correctAnswer: 1,
        explanation: "Social proof uses the fact that others have already adopted something as evidence that it's a good choice: 'Over 10,000 companies have already adopted this approach.'"
      },
      {
        question: "Which combination makes the most persuasive argument?",
        options: [
          "Logos only",
          "Pathos only",
          "Ethos only",
          "A combination of ethos, pathos, and logos"
        ],
        correctAnswer: 3,
        explanation: "The most persuasive arguments combine all three classical appeals: credibility (ethos), emotion (pathos), and logic (logos). Relying on only one is significantly less effective."
      }
    ]
  },

  "Connotation and Word Choice Precision": {
    explanation: `<h2>Connotation and Word Choice Precision</h2>
<p>At the C1-C2 level, choosing the right word means understanding not just <strong>denotation</strong> (the literal dictionary definition) but <strong>connotation</strong> (the emotional and cultural associations a word carries). For example, <em>skinny</em>, <em>thin</em>, <em>slim</em>, and <em>slender</em> all mean approximately the same thing literally, but their connotations differ dramatically: <em>skinny</em> (negative — too thin), <em>thin</em> (neutral), <em>slim</em> (positive — elegant, healthy), <em>slender</em> (very positive — graceful).</p>

<p>Connotative differences appear everywhere. Describing someone who doesn't talk much: <em>quiet</em> (neutral), <em>reserved</em> (positive — thoughtful), <em>withdrawn</em> (negative — possibly depressed), <em>shy</em> (slightly negative — lacking confidence), <em>contemplative</em> (positive — deeply thoughtful). Describing a plan: <em>simple</em> (neutral/positive), <em>basic</em> (neutral/possibly unsophisticated), <em>rudimentary</em> (negative — too simple, incomplete), <em>streamlined</em> (positive — efficient), <em>naive</em> (negative — oversimplified).</p>

<p><strong>Loaded language</strong> uses connotation to persuade: <em>"Freedom fighters"</em> vs. <em>"terrorists"</em> (same people, different connotations). <strong>Euphemisms</strong> soften unpleasant realities: <em>"let go"</em> instead of <em>"fired"</em>, <em>"passed away"</em> instead of <em>"died"</em>, <em>"restructuring"</em> instead of <em>"closing departments"</em>. To choose the right word, ask: What's my purpose? Who's my audience? What's the context? What emotional effect do I want?</p>`,
    examples: [
      {
        sentence: "She is slender, with an elegant posture.",
        note: "'Slender' has a strongly positive connotation — suggesting grace and beauty, unlike 'skinny' which implies unattractively thin."
      },
      {
        sentence: "He is rather withdrawn since the accident.",
        note: "'Withdrawn' has a negative connotation — suggesting social isolation and possibly depression, unlike 'reserved' which is more neutral/positive."
      },
      {
        sentence: "The company let go of 200 employees.",
        note: "Euphemism — 'let go' softens the harshness of 'fired' or 'made redundant', making the statement less emotionally charged."
      },
      {
        sentence: "The manager introduced a streamlined process.",
        note: "'Streamlined' has a positive connotation — suggesting efficiency and modernisation, unlike 'simplified' or 'rudimentary'."
      },
      {
        sentence: "The government described them as freedom fighters; the media called them terrorists.",
        note: "Loaded language — the same group is described with opposite connotations depending on the speaker's perspective."
      }
    ],
    commonMistakes: [
      {
        mistake: "She looks skinny in that dress. (intended as compliment)",
        correction: "She looks slim in that dress. ('Skinny' has a negative connotation; 'slim' is positive and flattering.)"
      },
      {
        mistake: "He's a very stubborn person. (intended as praise)",
        correction: "He's a very determined person. ('Stubborn' is negative; 'determined' is the positive equivalent.)"
      },
      {
        mistake: "They fired him. (in a formal, sensitive context)",
        correction: "His position was made redundant. / He was let go. (Euphemisms are more appropriate in sensitive or formal contexts.)"
      },
      {
        mistake: "The fanatical manager imposed his ridiculous scheme on the exhausted staff.",
        correction: "The manager introduced a new scheme that staff found demanding. (Remove loaded language when neutral reporting is required.)"
      }
    ],
    quiz: [
      {
        question: "Which word has the MOST POSITIVE connotation for describing someone's build?",
        options: [
          "Skinny",
          "Bony",
          "Thin",
          "Slender"
        ],
        correctAnswer: 3,
        explanation: "From most negative to most positive: bony → skinny → thin → slim → slender. 'Slender' suggests grace and elegance — the most positive connotation."
      },
      {
        question: "What is the difference between 'freedom fighters' and 'terrorists'?",
        options: [
          "They refer to completely different groups",
          "They are synonyms",
          "They can refer to the same people but with opposite connotations — positive vs. negative framing",
          "One is formal and the other is informal"
        ],
        correctAnswer: 2,
        explanation: "These are loaded terms that can describe the same people. 'Freedom fighters' has positive connotations (fighting for liberty), while 'terrorists' has negative connotations (using violence and fear)."
      },
      {
        question: "Which is a euphemism for 'died'?",
        options: [
          "Expired",
          "Passed away",
          "Kicked the bucket",
          "Croaked"
        ],
        correctAnswer: 1,
        explanation: "'Passed away' is a euphemism — a gentler, more respectful way to say 'died'. The other options are either too blunt ('expired') or too informal/disrespectful."
      },
      {
        question: "What does 'loaded language' mean?",
        options: [
          "Language that is difficult to understand",
          "Language heavy with words",
          "Words chosen specifically for their emotional impact to influence the audience's perception",
          "Academic jargon"
        ],
        correctAnswer: 2,
        explanation: "Loaded language uses words with strong emotional connotations to shape how the audience perceives a topic — e.g., 'tax relief' frames tax as a burden, 'estate tax' vs. 'death tax' frames the same tax differently."
      },
      {
        question: "Which word describes a plan with a NEGATIVE connotation of being too simple?",
        options: [
          "Streamlined",
          "Straightforward",
          "Rudimentary",
          "Efficient"
        ],
        correctAnswer: 2,
        explanation: "'Rudimentary' has a negative connotation — suggesting something is basic, incomplete, or lacking sophistication. 'Streamlined' and 'efficient' are positive; 'straightforward' is neutral."
      }
    ]
  },

  "Implying and Inferring \u2014 What's Unsaid": {
    explanation: `<h2>Implying and Inferring — What's Unsaid</h2>
<p>In English, especially British English, what people say and what they mean are often different. Understanding <strong>implicature</strong> — the gap between said and meant — is essential at C1-C2. British understatement is legendary: <em>"I hear what you say"</em> (I disagree and don't want to discuss it further), <em>"With the greatest respect"</em> (I think you're wrong), <em>"That's not bad"</em> (That's excellent), <em>"Quite good"</em> (a bit disappointing), and <em>"I'll bear that in mind"</em> (I've already forgotten it).</p>

<p>Implicature operates in professional contexts too. Your manager says <em>"The deadline is Friday, but of course, quality is the priority."</em> Implication: The deadline IS Friday — figure out how to do both. A client says <em>"Your competitor's proposal was… interesting."</em> With a flat tone, they hated it (you're in a strong position); with rising intonation, they're genuinely considering it (you need to differentiate). <strong>Indirect speech acts</strong> perform actions without directly stating them: <em>"It's cold in here"</em> (= Please close the window). <em>"That report is due tomorrow"</em> (= You need to finish it today).</p>

<p>Refusing without saying no: <em>"I'll have to check my diary"</em> (probably no), <em>"That sounds… ambitious"</em> (I think it will fail), <em>"Let's revisit this next quarter"</em> (I'm stalling). Subtext in writing: <em>"We note your concerns"</em> = We acknowledge them but may not act; <em>"We are monitoring the situation closely"</em> = We are doing nothing yet. To read implicature, consider: tone of voice, context (relationship, power dynamics, recent events), facial expressions, what is NOT said, and cultural norms.</p>`,
    examples: [
      {
        sentence: "\"That's not bad.\" (British understatement)",
        note: "In British English, 'not bad' often means 'excellent'. Understatement is a cultural norm — it's high praise, not faint praise."
      },
      {
        sentence: "\"It's cold in here.\" (= Please close the window / turn on the heating)",
        note: "Indirect speech act — stating a fact about temperature rather than making a direct request. The hearer infers the intended action."
      },
      {
        sentence: "\"Your competitor's proposal was… interesting.\" (flat tone)",
        note: "With a flat tone, 'interesting' means the client hated it. The pause before the word and the neutral adjective signal polite dismissal."
      },
      {
        sentence: "\"We note your concerns.\"",
        note: "Professional subtext — 'We acknowledge your concerns but may not act on them.' The word 'note' implies awareness without commitment."
      },
      {
        sentence: "\"Let's revisit this next quarter.\"",
        note: "Diplomatic stalling — the speaker doesn't want to say no directly but has no intention of agreeing. 'Revisit' sounds constructive while being evasive."
      }
    ],
    commonMistakes: [
      {
        mistake: "Taking 'I hear what you say' as agreement.",
        correction: "In British English, 'I hear what you say' actually means 'I disagree and don't want to discuss it further.' Don't confuse hearing with agreeing."
      },
      {
        mistake: "Taking 'Quite good' as high praise.",
        correction: "In British English, 'quite good' often means 'a bit disappointing' — it's faint praise. 'Very good' or 'excellent' are genuine compliments."
      },
      {
        mistake: "Responding to 'It's cold in here' with 'Yes, it is' and doing nothing.",
        correction: "Recognise the indirect speech act: the speaker is asking you to close the window or turn on the heating, not making a weather observation."
      },
      {
        mistake: "Taking 'We are monitoring the situation closely' at face value.",
        correction: "In corporate communication, this often means 'We are doing nothing yet but want to appear proactive.' Read between the lines of corporate speak."
      }
    ],
    quiz: [
      {
        question: "In British English, what does 'That's not bad' typically mean?",
        options: [
          "It's mediocre",
          "It's terrible",
          "It's excellent",
          "It's literally not bad — just acceptable"
        ],
        correctAnswer: 2,
        explanation: "British understatement uses 'not bad' to mean 'excellent'. It's high praise disguised as mild approval — a cultural convention of not seeming too enthusiastic."
      },
      {
        question: "What is an indirect speech act?",
        options: [
          "A grammatical error",
          "Performing an action (like making a request) by saying something that doesn't directly state it",
          "Speaking without verbs",
          "A formal speech"
        ],
        correctAnswer: 1,
        explanation: "An indirect speech act uses a statement or question to perform a different function — e.g., saying 'It's cold in here' to request that someone close the window."
      },
      {
        question: "A client says 'Your competitor's proposal was… interesting' with a flat tone. What do they most likely mean?",
        options: [
          "They found it genuinely fascinating",
          "They thought it was well-written",
          "They were not impressed by it",
          "They want to hear more about it"
        ],
        correctAnswer: 2,
        explanation: "With a flat tone and the pause before 'interesting', this is polite dismissal. In professional contexts, 'interesting' with flat delivery usually means the opposite."
      },
      {
        question: "What does 'We note your concerns' typically imply in a professional email?",
        options: [
          "We will definitely address your concerns",
          "We acknowledge them but may not act on them",
          "We agree with your concerns",
          "We are grateful for your feedback"
        ],
        correctAnswer: 1,
        explanation: "'Note your concerns' is professional hedging — it acknowledges receipt without committing to action. The word 'note' implies awareness, not agreement or commitment."
      },
      {
        question: "How should you interpret 'Let's revisit this next quarter'?",
        options: [
          "They're enthusiastic and want to continue soon",
          "They're stalling and probably hope you'll forget about it",
          "They want to schedule a meeting for next quarter",
          "They agree with your proposal"
        ],
        correctAnswer: 1,
        explanation: "'Revisit next quarter' is diplomatic stalling — the speaker wants to defer without saying no directly. The implication is that the topic is not a priority now (and likely won't be then either)."
      }
    ]
  },

  "Advanced Discourse Management": {
    explanation: `<h2>Advanced Discourse Management</h2>
<p>Advanced discourse management is the ability to control and direct complex conversations, debates, and meetings with authority. Opening and framing: <em>"Before we dive in, let's establish what we want to achieve today"</em> and <em>"There are three critical issues on the table. I'd like us to tackle them in order of urgency."</em> Managing topics: <em>"We've spent good time on X. Let's move to Y and come back to X if we have time"</em> and <em>"That's an important point, but it's somewhat tangential. Can we park it for now?"</em></p>

<p>Turn-taking management ensures balanced participation: <em>"Sarah, you haven't weighed in yet. What are your thoughts?"</em>, <em>"I'd like to hear from someone who hasn't spoken yet"</em>, and <em>"Let's go round the table and get one point from each person."</em> Dealing with dominant speakers: <em>"Thank you, Mike. Let's hear from someone else now"</em> and <em>"I want to make sure we have balanced input."</em> Dealing with silence: <em>"I sense some hesitation. Is there a concern we haven't voiced?"</em> and <em>"It's okay to push back — in fact, I'd welcome it."</em></p>

<p>Redirecting derails: <em>"That's a separate issue worth its own discussion. For now, let's stay on…"</em> and <em>"Good point, but let's not get into the weeds on that today."</em> Managing conflict: <em>"I can see both sides have merit. Let's find the common ground"</em> and <em>"Where do you actually disagree? It sounds like you mostly agree on the goal but differ on method."</em> Closing with authority: <em>"Let me summarise what I've heard and check I've got it right"</em> and <em>"The action items are: X will do Y by Z. Is that correct?"</em></p>`,
    examples: [
      {
        sentence: "Before we dive in, let's establish what we want to achieve today.",
        note: "Opening and framing — sets expectations and gives the meeting purpose before discussion begins."
      },
      {
        sentence: "That's an important point, but it's somewhat tangential. Can we park it for now?",
        note: "Managing topics — acknowledges the point's value while redirecting focus. 'Park it' means set aside for later."
      },
      {
        sentence: "Sarah, you haven't weighed in yet. What are your thoughts?",
        note: "Turn-taking — actively inviting quieter members to contribute ensures balanced participation."
      },
      {
        sentence: "I can see both sides have merit. Let's find the common ground.",
        note: "Managing conflict — validating both perspectives before steering toward agreement."
      },
      {
        sentence: "The action items are: Alex will draft the proposal by Friday, and Jordan will schedule the client call by Wednesday. Is that correct?",
        note: "Closing with authority — summarises decisions, assigns clear responsibilities, and confirms agreement."
      }
    ],
    commonMistakes: [
      {
        mistake: "Letting one person dominate the entire meeting without intervening.",
        correction: "Thank you, Mike. Let's hear from someone else now. Maria, what's your view? (Active turn-taking management ensures balanced input.)"
      },
      {
        mistake: "Allowing the meeting to drift off-topic for 20 minutes.",
        correction: "That's a separate issue worth its own discussion. Let's return to our agenda item. (Redirect firmly but politely.)"
      },
      {
        mistake: "Ending a meeting without summarising decisions or assigning action items.",
        correction: "Let me summarise: we've agreed to X by Friday. Alex will lead, and Jordan will support. Correct? (Always close with clear outcomes.)"
      },
      {
        mistake: "Ignoring conflict and hoping it resolves itself.",
        correction: "I can see both sides. Where exactly do you disagree? Let's isolate the difference. (Address conflict directly but constructively.)"
      }
    ],
    quiz: [
      {
        question: "Which phrase is used to redirect a conversation that has gone off-topic?",
        options: [
          "That's a stupid point.",
          "That's an important point, but it's somewhat tangential. Can we park it for now?",
          "Stop talking about that.",
          "I don't care about that topic."
        ],
        correctAnswer: 1,
        explanation: "'That's an important point, but it's somewhat tangential' validates the speaker while redirecting. 'Park it' means to set it aside for later — diplomatic and effective."
      },
      {
        question: "How should you handle a dominant speaker in a meeting?",
        options: [
          "Let them talk as long as they want",
          "Interrupt them rudely",
          "Thank them for their input and actively invite others to speak",
          "Ignore them completely"
        ],
        correctAnswer: 2,
        explanation: "'Thank you, Mike. Let's hear from someone else now' acknowledges their contribution while creating space for others. It's firm but respectful."
      },
      {
        question: "What does 'park it' mean in a meeting context?",
        options: [
          "Leave and come back later",
          "Set the topic aside to discuss at a later time",
          "End the meeting",
          "Agree with the point"
        ],
        correctAnswer: 1,
        explanation: "'Park it' means to acknowledge a point but set it aside for later discussion — it's not dismissed, just deferred. This keeps the meeting on track without ignoring valid contributions."
      },
      {
        question: "Why is it important to close a meeting with a summary?",
        options: [
          "To make the meeting last longer",
          "To ensure everyone leaves with the same understanding of decisions and action items",
          "To show who was paying attention",
          "It's not important"
        ],
        correctAnswer: 1,
        explanation: "A closing summary ensures alignment — everyone knows what was decided, who is responsible for what, and by when. Without it, people may leave with different interpretations."
      },
      {
        question: "How should you handle silence when you ask a question in a meeting?",
        options: [
          "Move on immediately",
          "Get angry at the group",
          "Acknowledge the hesitation and invite participation: 'I sense some hesitation. Is there a concern we haven't voiced?'",
          "Answer your own question"
        ],
        correctAnswer: 2,
        explanation: "Silence often signals disagreement, uncertainty, or fear of speaking up. Acknowledging it ('I sense some hesitation') gives permission to contribute and surfaces unspoken concerns."
      }
    ]
  },

  "Writing Style \u2014 Voice and Tone Development": {
    explanation: `<h2>Writing Style — Voice and Tone Development</h2>
<p>Voice is the <strong>personality of the writing</strong> — the sense that a real person is speaking. At C1-C2, your writing should have a recognisable voice, not sound like a textbook. Key elements include <strong>sentence length and rhythm</strong> (short sentences create urgency: <em>"The door opened. Nobody spoke. Something was wrong."</em>; long sentences create reflection: <em>"It was the kind of morning when the light seems to come from everywhere and nowhere."</em>), <strong>word choice</strong> (precise words over general ones: not "walked" but "strode, wandered, shuffled, marched, crept"), and <strong>perspective</strong> (first person for personal immediacy, second for direct engagement, third for objective distance).</p>

<p>Controlling tone is about matching your writing's personality to its purpose. <strong>Authoritative</strong> tone: confident, declarative, evidence-based — for reports and expert content. <strong>Conversational</strong> tone: contractions, questions, direct address — for blogs and emails. <strong>Empathetic</strong> tone: acknowledging feelings, inclusive language — for customer support. <strong>Urgent</strong> tone: short sentences, imperative verbs, time references — for announcements. <strong>Playful</strong> tone: wordplay, unexpected comparisons — for creative content. <strong>Reflective</strong> tone: past tense, philosophical, measured — for essays and memoirs.</p>

<p>Stylistic devices for voice include <strong>alliteration</strong> (<em>"The silent, steady stride of someone with somewhere to be"</em>), <strong>varied sentence openings</strong> (not every sentence starting with "The…" or "It…"), and <strong>unexpected word combinations</strong> (<em>"the silence was loud"</em>). The same topic can be written in completely different voices — a corporate memo about timesheets, a humorous social media post, or a literary novel opening — and each voice creates a fundamentally different reader experience.</p>`,
    examples: [
      {
        sentence: "The door opened. Nobody spoke. Something was wrong.",
        note: "Short sentences for urgency — each sentence adds tension. The brevity forces the reader to feel the suspense."
      },
      {
        sentence: "It was the kind of morning when the light seems to come from everywhere and nowhere, when the world holds its breath between seasons.",
        note: "Long, flowing sentence for reflection — creates atmosphere and invites the reader to slow down and imagine."
      },
      {
        sentence: "Effective Monday, the new policy takes effect across all departments. Compliance is non-negotiable.",
        note: "Authoritative tone — declarative, confident, no room for debate. Appropriate for formal announcements."
      },
      {
        sentence: "I know change can feel unsettling. From Monday, we'll be implementing a new policy, and I want to make sure everyone feels supported.",
        note: "Empathetic tone — acknowledges feelings first, then introduces the change. Creates psychological safety."
      },
      {
        sentence: "Monday. The policy changes. Read this now.",
        note: "Urgent tone — short, imperative, time-pressured. Creates immediate attention and a sense of importance."
      }
    ],
    commonMistakes: [
      {
        mistake: "Writing every sentence at the same length and rhythm.",
        correction: "Vary sentence length for rhythm and effect. Mix short, punchy sentences with longer, flowing ones. Monotone rhythm loses readers."
      },
      {
        mistake: "Using 'walked' when 'strode', 'wandered', or 'crept' would be more precise.",
        correction: "Choose precise verbs that convey manner and mood: 'strode' (purposeful), 'wandered' (aimless), 'crept' (stealthy), 'marched' (determined). General verbs create flat writing."
      },
      {
        mistake: "Starting every sentence with 'The' or 'It'.",
        correction: "Vary sentence openings: 'Despite the rain, they continued.' / 'Under normal circumstances, this would work.' / 'Rarely had she felt so certain.' Different openings create dynamic prose."
      },
      {
        mistake: "Using an academic tone for a blog post or social media.",
        correction: "Match tone to context. Blogs need conversational tone (contractions, questions, direct address). Academic tone on social media sounds stilted and disconnected."
      }
    ],
    quiz: [
      {
        question: "What effect do short sentences create in writing?",
        options: [
          "Relaxation and calm",
          "Urgency and tension",
          "Boredom",
          "Confusion"
        ],
        correctAnswer: 1,
        explanation: "Short sentences create urgency and tension — they speed up the reading pace and create a staccato rhythm that conveys action, suspense, or importance."
      },
      {
        question: "Which tone is most appropriate for a customer support message?",
        options: [
          "Authoritative",
          "Playful",
          "Empathetic",
          "Urgent"
        ],
        correctAnswer: 2,
        explanation: "Empathetic tone acknowledges the customer's feelings and creates psychological safety: 'I understand this is frustrating. Let me help you resolve this.'"
      },
      {
        question: "What is the benefit of varying sentence openings?",
        options: [
          "It makes writing longer",
          "It creates dynamic, engaging prose that holds the reader's attention",
          "It's grammatically required",
          "It makes writing more formal"
        ],
        correctAnswer: 1,
        explanation: "Varying sentence openings prevents monotony and keeps readers engaged. When every sentence starts the same way, the writing feels flat and predictable."
      },
      {
        question: "Which word is more precise than 'walked' for someone moving purposefully?",
        options: [
          "Went",
          "Strode",
          "Did",
          "Got"
        ],
        correctAnswer: 1,
        explanation: "'Strode' conveys purpose, confidence, and determination — it's far more vivid than 'walked'. 'Wandered' would be aimless, 'crept' would be stealthy, 'marched' would be forceful."
      },
      {
        question: "What is 'voice' in writing?",
        options: [
          "The volume at which you read",
          "The personality of the writing — the sense that a real person is speaking",
          "The number of characters in a story",
          "The tense used"
        ],
        correctAnswer: 1,
        explanation: "Voice is the personality behind the words — it's what makes one writer's work distinguishable from another's. It comes from word choice, rhythm, tone, and perspective."
      }
    ]
  },

  "Cross-Cultural Communication Competence": {
    explanation: `<h2>Cross-Cultural Communication Competence</h2>
<p>Effective communication across cultures requires understanding that English is used differently around the world. Cultures are classified as <strong>high-context</strong> (meaning is embedded in context, relationships, and what's unsaid — Japan, China, Arab countries) or <strong>low-context</strong> (meaning is explicitly stated in words — Germany, US, Australia). English-speaking cultures vary: the UK is moderate-high context (indirectness, understatement), the US is low context (direct, explicit), and India is high context (relationship-driven, indirect).</p>

<p>Direct vs. indirect criticism varies dramatically. American: <em>"This is wrong. Here's how to fix it."</em> British: <em>"I see what you mean. Have you considered an alternative approach?"</em> Japanese: <em>"This is very interesting. It might be worth exploring other possibilities."</em> (said with hesitation). German: <em>"This contains three factual errors."</em> Brazilian: <em>"This is great! Maybe we could also try…"</em> Time orientation also differs: monochronic cultures (UK, US, Germany — one thing at a time, schedules are sacred) vs. polychronic cultures (Latin America, Middle East — multiple things simultaneously, relationships take priority).</p>

<p>When English is used as a <strong>lingua franca</strong> between non-native speakers, challenges increase: directness may sound blunter than intended, idioms cause confusion (<em>"Let's touch base"</em>), humour doesn't translate, and silence means different things (thinking in Finnish, disagreement in Japanese, confusion in many contexts). Best practices: speak clearly (not loudly), avoid idioms and phrasal verbs, check understanding both ways, be explicit about disagreement, confirm in writing, and be patient with indirectness. Remember: someone who says <em>"That might be difficult"</em> may actually mean <em>"No"</em>.</p>`,
    examples: [
      {
        sentence: "A British manager says: 'If you have time, could you possibly look at this? No rush.'",
        note: "High-context British communication — this is actually a request with urgency, not a low-priority optional task. The indirectness can mislead non-British colleagues."
      },
      {
        sentence: "An American gives feedback: 'You're doing great! Just a tiny thing — maybe the report could be a bit different.'",
        note: "Low-context American communication — the 'tiny thing' may actually be a significant issue. Germans, who prefer direct feedback, might miss the real message."
      },
      {
        sentence: "'Postpone' instead of 'put off'; 'increase' instead of 'ramp up.'",
        note: "Lingua franca best practice — using plain, international vocabulary instead of phrasal verbs and idioms that confuse non-native speakers."
      },
      {
        sentence: "A Japanese colleague says: 'That might be difficult.'",
        note: "High-context indirectness — in Japanese business culture, 'might be difficult' often means 'no' outright. Understanding this prevents false hope."
      },
      {
        sentence: "'Can you confirm I've understood correctly?' AND 'Does that make sense?'",
        note: "Checking understanding both ways — ensuring you understood them AND they understood you. Essential for international communication."
      }
    ],
    commonMistakes: [
      {
        mistake: "Assuming everyone communicates the same way in English.",
        correction: "Recognise cultural differences: British indirectness, American directness, German precision, Japanese harmony. Adapt your style to your audience."
      },
      {
        mistake: "Using idioms like 'Let's touch base' with non-native speakers.",
        correction: "Use plain language: 'Let's discuss this later.' Idioms and phrasal verbs confuse non-native speakers and can lead to misunderstanding."
      },
      {
        mistake: "Taking 'That might be difficult' at face value from a Japanese colleague.",
        correction: "In high-context cultures, 'might be difficult' often means 'no'. Read between the lines and follow up politely to clarify."
      },
      {
        mistake: "Speaking louder when someone doesn't understand your English.",
        correction: "Speak more slowly and clearly, not louder. Use simpler vocabulary and shorter sentences. Confirm understanding by asking them to paraphrase."
      }
    ],
    quiz: [
      {
        question: "Which culture is classified as high-context?",
        options: [
          "Germany",
          "United States",
          "Japan",
          "Australia"
        ],
        correctAnswer: 2,
        explanation: "Japan is a high-context culture where meaning is embedded in relationships, context, and what's unsaid. Germany, the US, and Australia are low-context cultures where meaning is explicit."
      },
      {
        question: "What does a British manager likely mean by 'If you have time, could you possibly look at this? No rush.'?",
        options: [
          "It's completely optional and low priority",
          "Please do this when you have a moment, but it's not urgent",
          "This is important — please do it soon, despite the polite framing",
          "I'm just being friendly"
        ],
        correctAnswer: 2,
        explanation: "In British high-context communication, indirectness and softening ('if you have time', 'no rush') often mask genuine urgency. The politeness is cultural, not an indication of low priority."
      },
      {
        question: "Why should you avoid idioms in international meetings?",
        options: [
          "Idioms are always incorrect English",
          "Idioms are too formal",
          "Idioms often don't translate across cultures and can confuse non-native speakers",
          "Idioms are only for written communication"
        ],
        correctAnswer: 2,
        explanation: "Idioms like 'touch base', 'ball's in your court', and 'think outside the box' are confusing for non-native speakers. Use plain alternatives: 'discuss', 'your decision', 'be creative'."
      },
      {
        question: "What is the best practice when speaking English as a lingua franca?",
        options: [
          "Speak loudly and use lots of idioms",
          "Speak clearly (not loudly), avoid idioms, and check understanding both ways",
          "Use only formal academic language",
          "Speak as fast as possible to sound fluent"
        ],
        correctAnswer: 1,
        explanation: "Speak clearly and slowly (not loudly), avoid idioms and phrasal verbs, and check understanding both ways: 'Can you confirm I've understood?' AND 'Does that make sense?'"
      },
      {
        question: "In which culture is being 5 minutes late to a meeting considered unacceptable?",
        options: [
          "Brazil",
          "Many Arab countries",
          "Germany",
          "India"
        ],
        correctAnswer: 2,
        explanation: "Germany is a monochronic culture where schedules are sacred and punctuality is a sign of respect. In polychronic cultures (Brazil, Arab countries), relationships take priority over strict schedules."
      }
    ]
  }
};
