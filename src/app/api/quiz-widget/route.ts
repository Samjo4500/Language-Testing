import { NextResponse } from 'next/server';

/**
 * Embeddable Mini-Quiz Widget API
 *
 * Returns a random set of English questions for the embeddable quiz widget.
 * Other sites embed this quiz → links back to TestCEFR → automatic backlinks.
 *
 * Query params:
 *   ?count=N  — number of questions (1-10, default 5)
 *   ?level=X  — CEFR level filter (a1, a2, b1, b2, c1, c2)
 */

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  level: string;
  skill: string;
}

const ALL_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Choose the correct word: "She ___ to the store yesterday."',
    options: ['go', 'goes', 'went', 'going'],
    correctIndex: 2,
    explanation: '"Went" is the past tense of "go." When referring to a completed action in the past, we use the simple past tense.',
    level: 'A2',
    skill: 'Grammar',
  },
  {
    id: 'q2',
    question: 'What does "ubiquitous" mean?',
    options: ['Rare and valuable', 'Present everywhere', 'Extremely dangerous', 'Carefully hidden'],
    correctIndex: 1,
    explanation: '"Ubiquitous" means present, appearing, or found everywhere. For example: "Smartphones have become ubiquitous in modern life."',
    level: 'C1',
    skill: 'Vocabulary',
  },
  {
    id: 'q3',
    question: 'Which sentence is grammatically correct?',
    options: [
      'If I would have known, I would have helped.',
      'If I had known, I would have helped.',
      'If I have known, I would help.',
      'If I knew, I will help.',
    ],
    correctIndex: 1,
    explanation: 'This is a third conditional (past unreal condition). The correct structure is: "If + past perfect, would have + past participle."',
    level: 'B2',
    skill: 'Grammar',
  },
  {
    id: 'q4',
    question: '"The meeting has been postponed." What does this mean?',
    options: ['The meeting was cancelled permanently', 'The meeting was moved to a later time', 'The meeting was moved to an earlier time', 'The meeting is happening right now'],
    correctIndex: 1,
    explanation: '"Postponed" means delayed or rescheduled to a later time. It does not mean permanently cancelled — that would be "the meeting has been cancelled."',
    level: 'B1',
    skill: 'Reading',
  },
  {
    id: 'q5',
    question: 'Choose the correct phrase: "I look forward ___ hearing from you."',
    options: ['to', 'for', 'at', 'with'],
    correctIndex: 0,
    explanation: '"Look forward to" is a fixed expression. Note that "to" is a preposition here, so it is followed by the -ing form of the verb.',
    level: 'B1',
    skill: 'Grammar',
  },
  {
    id: 'q6',
    question: 'What is the best synonym for "meticulous"?',
    options: ['Careless', 'Very careful and precise', 'Quick and efficient', 'Simple and plain'],
    correctIndex: 1,
    explanation: '"Meticulous" means showing great attention to detail and extreme care. A meticulous person is thorough and precise in their work.',
    level: 'B2',
    skill: 'Vocabulary',
  },
  {
    id: 'q7',
    question: '"Not only did she finish the report, but she also presented it to the board." What grammatical structure is used here?',
    options: ['Passive voice', 'Inversion for emphasis', 'Reported speech', 'Relative clause'],
    correctIndex: 1,
    explanation: 'Starting a sentence with "Not only" triggers subject-auxiliary inversion ("did she finish" instead of "she did finish"). This is inversion for emphasis, a C1-level structure.',
    level: 'C1',
    skill: 'Grammar',
  },
  {
    id: 'q8',
    question: 'Which word completes the collocation? "She ___ a decision."',
    options: ['did', 'made', 'took', 'had'],
    correctIndex: 1,
    explanation: 'The correct collocation is "make a decision." While you can "take" action, the fixed expression for creating a decision is "make a decision."',
    level: 'B1',
    skill: 'Vocabulary',
  },
  {
    id: 'q9',
    question: '"Had I known about the delay, I would have left earlier." What does this sentence express?',
    options: ['A future possibility', 'A past regret about something that did not happen', 'A present habit', 'A polite request'],
    correctIndex: 1,
    explanation: 'This is a third conditional with inversion ("Had I known" = "If I had known"). It expresses regret about a past situation that cannot be changed.',
    level: 'C1',
    skill: 'Reading',
  },
  {
    id: 'q10',
    question: 'Choose the correct form: "Neither the manager nor the employees ___ aware of the change."',
    options: ['was', 'were', 'is', 'has been'],
    correctIndex: 1,
    explanation: 'With "neither...nor," the verb agrees with the nearest subject. "Employees" is plural, so we use "were." This is a subject-verb agreement rule tested at B2 level.',
    level: 'B2',
    skill: 'Grammar',
  },
  {
    id: 'q11',
    question: 'What does the idiom "bite the bullet" mean?',
    options: ['To eat something hard', 'To face a difficult situation with courage', 'To avoid a problem', 'To complain about something'],
    correctIndex: 1,
    explanation: '"Bite the bullet" means to endure a painful or difficult situation that is unavoidable. It comes from the historical practice of having soldiers bite on a bullet during surgery.',
    level: 'B2',
    skill: 'Vocabulary',
  },
  {
    id: 'q12',
    question: '"The report, which was submitted on Friday, has been approved." The commas around "which was submitted on Friday" indicate that this clause is:',
    options: ['Essential to the meaning', 'Non-restrictive (additional information)', 'A dependent clause', 'Incorrectly punctuated'],
    correctIndex: 1,
    explanation: 'The commas indicate a non-restrictive (non-defining) relative clause — it provides additional information that is not essential to identifying which report. Without the commas, it would be a restrictive clause identifying which specific report.',
    level: 'C1',
    skill: 'Grammar',
  },
  {
    id: 'q13',
    question: 'Which sentence uses the correct register for a formal business email?',
    options: [
      'Hey, I need that report ASAP.',
      'I would appreciate it if you could send the report at your earliest convenience.',
      'Give me the report now.',
      'The report — can you send? Thanks.',
    ],
    correctIndex: 1,
    explanation: 'Formal register uses polite, indirect language. "I would appreciate it if you could" is an appropriately formal way to make a request in a business context.',
    level: 'B2',
    skill: 'Writing',
  },
  {
    id: 'q14',
    question: '"She ran the marathon in spite of her injury." Which word can replace "in spite of"?',
    options: ['Because', 'Although', 'Despite', 'However'],
    correctIndex: 2,
    explanation: '"Despite" is the direct synonym for "in spite of." Both are prepositions followed by a noun phrase. "Although" is similar in meaning but is a conjunction that introduces a clause.',
    level: 'B2',
    skill: 'Vocabulary',
  },
  {
    id: 'q15',
    question: 'What is the main idea of this text: "Climate change poses unprecedented challenges. Rising sea levels threaten coastal communities, while extreme weather events disrupt agriculture and infrastructure worldwide."',
    options: ['Agriculture is the main victim of climate change', 'Climate change creates wide-ranging global problems', 'Sea levels are rising faster than expected', 'Infrastructure needs more investment'],
    correctIndex: 1,
    explanation: 'The main idea encompasses the broadest claim: climate change creates wide-ranging problems. The specific examples (sea levels, agriculture, infrastructure) support this central point but are not themselves the main idea.',
    level: 'B1',
    skill: 'Reading',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = Math.min(Math.max(parseInt(searchParams.get('count') || '5', 10), 1), 10);
  const level = searchParams.get('level')?.toLowerCase();

  let pool = ALL_QUESTIONS;
  if (level && ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'].includes(level)) {
    pool = ALL_QUESTIONS.filter((q) => q.level.toLowerCase() === level);
  }

  // Shuffle and pick
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  return NextResponse.json({
    questions: selected,
    branding: {
      name: 'TestCEFR',
      url: 'https://testcefr.com',
      ctaText: 'Get Your Free CEFR Score',
      ctaUrl: 'https://testcefr.com/register',
    },
  });
}
