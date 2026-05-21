/**
 * Seed Script - Populates all question models with rich content
 * for the Question Rotation System.
 */

import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const readingPassages: {
  level: string; title: string; passageText: string; difficultyTier: number;
  variantGroup: string;
  questions: { questionText: string; options: string[]; correctIndex: number; explanation?: string; sortOrder: number }[];
}[] = [
  {
    level: "A2", title: "A Day at the Beach", difficultyTier: 3, variantGroup: "a2-daily-life",
    passageText: "Last Saturday, Emma and her family went to the beach. The weather was warm and sunny, perfect for a day outside. Emma's little brother, Jack, built a big sandcastle while their parents relaxed under a large umbrella. Emma went swimming in the sea and found some beautiful shells. At lunchtime, they ate sandwiches and drank cold lemonade. In the afternoon, they played volleyball with some other families. Everyone was tired but happy when they went home in the evening.",
    questions: [
      { questionText: "What did Jack build at the beach?", options: ["A boat", "A sandcastle", "A kite", "A wall"], correctIndex: 1, explanation: "The passage states Jack built a big sandcastle.", sortOrder: 0 },
      { questionText: "What did the family drink for lunch?", options: ["Hot tea", "Cold water", "Cold lemonade", "Orange juice"], correctIndex: 2, explanation: "The passage mentions they drank cold lemonade.", sortOrder: 1 },
    ],
  },
  {
    level: "A2", title: "My New Neighbour", difficultyTier: 4, variantGroup: "a2-people",
    passageText: "A new family moved next door to us last month. They have a daughter called Sofia, who is the same age as me. Sofia is from Spain, and she speaks both Spanish and English. Her father works at the hospital as a doctor, and her mother is a teacher at the primary school. Sofia and I walk to school together every morning. She has taught me some Spanish words like hola which means hello, and gracias which means thank you. I am happy to have a new friend living so close.",
    questions: [
      { questionText: "Where is Sofia from?", options: ["Portugal", "France", "Spain", "Italy"], correctIndex: 2, explanation: "The text says Sofia is from Spain.", sortOrder: 0 },
      { questionText: "What does gracias mean?", options: ["Hello", "Goodbye", "Thank you", "Please"], correctIndex: 2, explanation: "The passage explains that gracias means thank you.", sortOrder: 1 },
    ],
  },
  {
    level: "A2", title: "The School Library", difficultyTier: 5, variantGroup: "a2-school",
    passageText: "Our school library is open every day from 8:00 in the morning until 5:00 in the afternoon. Students can borrow up to three books at a time and keep them for two weeks. If you need more time, you can renew the books online. The library has a quiet reading area with comfortable chairs, and there are also computers that students can use for homework. Every Wednesday, the librarian, Mrs. Chen, reads stories to younger children. She always chooses exciting books that make the children laugh.",
    questions: [
      { questionText: "How many books can students borrow at one time?", options: ["One", "Two", "Three", "Five"], correctIndex: 2, explanation: "Students can borrow up to three books at a time.", sortOrder: 0 },
      { questionText: "When does Mrs. Chen read stories?", options: ["Every Monday", "Every Wednesday", "Every Friday", "Every weekend"], correctIndex: 1, explanation: "The passage says she reads stories every Wednesday.", sortOrder: 1 },
    ],
  },
  {
    level: "A2", title: "Cooking Together", difficultyTier: 4, variantGroup: "a2-daily-life",
    passageText: "Every Sunday, my grandmother comes to our house and we cook together. Last week, we made a big pot of vegetable soup. First, we chopped carrots, potatoes, and onions. Then, we fried the onions in a little oil until they were soft. After that, we added all the vegetables and some water, and let everything cook for about forty minutes. Finally, we added salt and pepper. The soup smelled wonderful, and it tasted even better. My grandmother says the secret is patience - good food takes time.",
    questions: [
      { questionText: "What did they cook last Sunday?", options: ["Pasta", "Vegetable soup", "Chicken curry", "Rice and beans"], correctIndex: 1, explanation: "They made a big pot of vegetable soup.", sortOrder: 0 },
      { questionText: "What does the grandmother say is the secret to good food?", options: ["Fresh ingredients", "Patience", "Spices", "A good recipe"], correctIndex: 1, explanation: "She says the secret is patience.", sortOrder: 1 },
    ],
  },
  {
    level: "B1", title: "The Benefits of Regular Exercise", difficultyTier: 3, variantGroup: "b1-health",
    passageText: "Regular exercise is one of the most important things you can do for your health. Research has shown that people who exercise at least 150 minutes per week have a lower risk of heart disease, diabetes, and certain types of cancer. Exercise also has mental health benefits - it can reduce stress, improve sleep quality, and boost your mood. Many people think they need to join a gym to get enough exercise, but simple activities like walking, cycling, or gardening can also be very effective. The key is to find an activity you enjoy and make it a regular part of your routine. Even small changes, like taking the stairs instead of the lift, can make a difference over time.",
    questions: [
      { questionText: "According to the passage, how many minutes of exercise per week is recommended?", options: ["60 minutes", "100 minutes", "150 minutes", "200 minutes"], correctIndex: 2, explanation: "The passage mentions at least 150 minutes per week.", sortOrder: 0 },
      { questionText: "What does the passage say about joining a gym?", options: ["It is the only way to exercise properly", "It is too expensive for most people", "It is not necessary - other activities work too", "It is better than walking or cycling"], correctIndex: 2, explanation: "The passage says simple activities can also be effective.", sortOrder: 1 },
    ],
  },
  {
    level: "B1", title: "Living in a Small Town", difficultyTier: 5, variantGroup: "b1-lifestyle",
    passageText: "When I was younger, I always wanted to live in a big city. The bright lights, the tall buildings, and the endless entertainment options seemed so exciting. However, after spending five years living in London, I began to appreciate the quieter things in life. I moved to a small town in the countryside last year, and I have never been happier. Here, I know my neighbours by name, and people always have time to stop and chat. The air is cleaner, the pace of life is slower, and I can walk through beautiful fields in just a few minutes. Of course, there are disadvantages - the shops close early, and there are fewer job opportunities - but for me, the benefits far outweigh the drawbacks.",
    questions: [
      { questionText: "Why did the writer move to a small town?", options: ["They lost their job in London", "They wanted a quieter lifestyle", "Their family lived there", "They could not afford city rent"], correctIndex: 1, explanation: "The writer began to appreciate quieter things in life.", sortOrder: 0 },
      { questionText: "What disadvantage of small-town life is mentioned?", options: ["Crime is higher", "The air is polluted", "Shops close early", "Neighbours are unfriendly"], correctIndex: 2, explanation: "The passage says shops close early as a disadvantage.", sortOrder: 1 },
    ],
  },
  {
    level: "B1", title: "Learning a Musical Instrument", difficultyTier: 6, variantGroup: "b1-education",
    passageText: "Learning to play a musical instrument is a rewarding experience that offers benefits beyond simply making music. Studies have demonstrated that musicians develop better memory, improved coordination, and stronger problem-solving skills. Children who learn an instrument often perform better in subjects like mathematics and languages. However, the learning process requires significant dedication. Most teachers recommend practising for at least twenty minutes every day, and it can take several years before a learner feels truly confident. Despite these challenges, the sense of achievement when you master a difficult piece is unmatched. Many adult learners also find that playing an instrument is an excellent way to relax after a long day at work.",
    questions: [
      { questionText: "How much daily practice do most teachers recommend?", options: ["Ten minutes", "Twenty minutes", "One hour", "Two hours"], correctIndex: 1, explanation: "Most teachers recommend practising for at least twenty minutes every day.", sortOrder: 0 },
      { questionText: "What benefit do children who learn instruments often experience?", options: ["Better physical fitness", "Better performance in maths and languages", "More friends at school", "Faster reading speed"], correctIndex: 1, explanation: "Children who learn an instrument often perform better in mathematics and languages.", sortOrder: 1 },
    ],
  },
  {
    level: "B1", title: "Online Shopping Trends", difficultyTier: 4, variantGroup: "b1-technology",
    passageText: "Online shopping has transformed the way people buy goods and services. In the past decade, e-commerce sales have grown by over 300% in many countries. Consumers appreciate the convenience of browsing products at any time of day, comparing prices across multiple retailers, and having items delivered directly to their homes. However, this shift has created challenges for traditional shops. Many high street stores have closed because they cannot compete with online prices. Some retailers have adapted by offering both online and in-store shopping options. Environmental concerns have also been raised, as the increase in delivery vehicles contributes to traffic congestion and air pollution in urban areas.",
    questions: [
      { questionText: "By how much have e-commerce sales grown in many countries over the past decade?", options: ["Over 100%", "Over 200%", "Over 300%", "Over 500%"], correctIndex: 2, explanation: "The passage says e-commerce sales have grown by over 300%.", sortOrder: 0 },
      { questionText: "What environmental concern is mentioned about online shopping?", options: ["Too much packaging waste", "Delivery vehicles cause congestion and pollution", "Online servers use too much electricity", "Returns create landfill waste"], correctIndex: 1, explanation: "The passage mentions delivery vehicles contribute to traffic congestion and air pollution.", sortOrder: 1 },
    ],
  },
  {
    level: "B2", title: "The Rise of Remote Work", difficultyTier: 4, variantGroup: "b2-work",
    passageText: "The COVID-19 pandemic accelerated a trend that was already underway: the shift towards remote work. Before 2020, only about 5% of European workers regularly worked from home. By 2022, that figure had risen to nearly 25%. While many employees have embraced the flexibility that remote work offers - eliminating commutes, allowing for better work-life balance, and enabling people to live in more affordable areas - employers have expressed concerns about maintaining company culture, monitoring productivity, and ensuring data security. Hybrid models, where employees split their time between home and office, have emerged as a popular compromise. Research suggests that fully remote workers are, on average, 13% more productive than their office-based counterparts, though this varies significantly by industry and role. The long-term implications for commercial real estate, urban planning, and even global labour markets are still unfolding.",
    questions: [
      { questionText: "What percentage of European workers worked from home regularly before 2020?", options: ["About 5%", "About 15%", "About 25%", "About 35%"], correctIndex: 0, explanation: "Before 2020, only about 5% of European workers regularly worked from home.", sortOrder: 0 },
      { questionText: "According to research, how much more productive are fully remote workers on average?", options: ["5%", "10%", "13%", "20%"], correctIndex: 2, explanation: "Research suggests fully remote workers are 13% more productive on average.", sortOrder: 1 },
    ],
  },
  {
    level: "B2", title: "Urban Green Spaces and Public Health", difficultyTier: 5, variantGroup: "b2-environment",
    passageText: "Urban green spaces - parks, gardens, and tree-lined streets - are far more than aesthetic additions to city landscapes. A growing body of epidemiological research has established compelling links between access to green space and improved public health outcomes. Residents of neighbourhoods with abundant vegetation report lower levels of stress, anxiety, and depression. Physical health benefits are equally significant: proximity to parks encourages outdoor exercise, which reduces the risk of obesity, cardiovascular disease, and type 2 diabetes. Perhaps most strikingly, a landmark Dutch study found that the annual prevalence of various disease clusters was systematically lower in municipalities with a higher percentage of green space, even after controlling for socioeconomic variables. This evidence has prompted several cities, including Singapore and Copenhagen, to integrate green infrastructure mandates into their urban planning frameworks, treating parks not as luxuries but as essential public health infrastructure.",
    questions: [
      { questionText: "What did the Dutch study find about green space and disease?", options: ["Disease rates were unaffected by green space", "Disease was lower in greener municipalities after controlling for socioeconomic factors", "Green space only reduced mental health issues", "The study was inconclusive"], correctIndex: 1, explanation: "The Dutch study found disease prevalence was lower in municipalities with more green space, even after controlling for socioeconomic variables.", sortOrder: 0 },
      { questionText: "Which cities are mentioned as integrating green infrastructure mandates?", options: ["London and Paris", "New York and Tokyo", "Singapore and Copenhagen", "Berlin and Amsterdam"], correctIndex: 2, explanation: "Singapore and Copenhagen are cited as integrating green infrastructure mandates.", sortOrder: 1 },
    ],
  },
  {
    level: "B2", title: "The Psychology of Consumer Choice", difficultyTier: 6, variantGroup: "b2-psychology",
    passageText: "When confronted with an abundance of choices, consumers often experience what psychologist Barry Schwartz has termed the paradox of choice. According to this theory, while a certain degree of choice is liberating, excessive options can lead to decision paralysis, increased regret, and diminished satisfaction with the eventual selection. In a classic experiment, researchers set up a jam-tasting booth at a grocery store: on one day, 24 varieties were displayed; on another, only 6. Although the larger display attracted more initial interest, the smaller display generated significantly more purchases. This finding has profound implications for product design, retail strategy, and even public policy. Some governments have simplified pension plan options precisely because excessive choice was discouraging people from saving for retirement at all. The challenge for businesses and policymakers alike is finding the sweet spot between offering sufficient variety and overwhelming the decision-maker.",
    questions: [
      { questionText: "What was the key finding of the jam-tasting experiment?", options: ["More varieties attracted more purchases", "Fewer varieties generated more purchases despite less initial interest", "The number of varieties made no difference", "People always preferred more options"], correctIndex: 1, explanation: "The smaller display (6 varieties) generated significantly more purchases despite attracting less initial interest.", sortOrder: 0 },
      { questionText: "Why have some governments simplified pension plan options?", options: ["To reduce administrative costs", "Too many options discouraged people from saving", "Pension companies requested fewer plans", "To standardise retirement ages"], correctIndex: 1, explanation: "Excessive choice was discouraging people from saving for retirement.", sortOrder: 1 },
    ],
  },
  {
    level: "B2", title: "Artificial Intelligence in Healthcare", difficultyTier: 7, variantGroup: "b2-technology",
    passageText: "Artificial intelligence is poised to revolutionise healthcare delivery in ways that were unimaginable just a decade ago. Machine learning algorithms can now analyse medical images with accuracy that rivals, and in some cases surpasses, that of experienced radiologists. In dermatology, AI systems have demonstrated over 95% accuracy in identifying malignant skin lesions from photographs. Natural language processing tools are being deployed to mine electronic health records for patterns that might escape human attention, potentially enabling earlier diagnosis of conditions like sepsis or heart failure. However, these advances raise critical questions. AI systems are only as good as the data they are trained on, and if that data reflects existing healthcare disparities - for instance, underrepresentation of certain ethnic groups in clinical trials - the algorithms may perpetuate or even amplify those biases. Furthermore, the black box nature of many deep learning models makes it difficult for clinicians to understand why a particular diagnosis was recommended, complicating the issue of medical liability.",
    questions: [
      { questionText: "What accuracy have AI systems achieved in identifying malignant skin lesions?", options: ["Over 85%", "Over 90%", "Over 95%", "Over 99%"], correctIndex: 2, explanation: "AI systems have demonstrated over 95% accuracy in identifying malignant skin lesions.", sortOrder: 0 },
      { questionText: "What concern is raised about the black box nature of AI models?", options: ["They are too expensive to maintain", "They process data too slowly", "It is hard for clinicians to understand why a diagnosis was recommended", "They cannot be integrated with existing systems"], correctIndex: 2, explanation: "The black box nature makes it difficult for clinicians to understand why a particular diagnosis was recommended.", sortOrder: 1 },
    ],
  },
  {
    level: "C1", title: "The Sociolinguistics of Code-Switching", difficultyTier: 5, variantGroup: "c1-linguistics",
    passageText: "Code-switching - the practice of alternating between two or more languages or dialects within a single conversation - has undergone a remarkable re-evaluation in linguistic scholarship over the past three decades. Once dismissed by prescriptivists as a symptom of linguistic incompetence, it is now widely recognised as a sophisticated communicative strategy that bilingual speakers deploy with remarkable agility. Sociolinguists have documented how code-switching serves multiple pragmatic functions: it can signal in-group solidarity, accommodate interlocutors with varying linguistic proficiencies, and convey nuanced social meanings that would be difficult to express in a single language. The work of Carol Myers-Scotton has been particularly influential, demonstrating through her Markedness Model that speakers intuitively calculate the social costs and benefits of each language choice against community norms. Critically, code-switching is not random; it follows grammatical constraints that respect the syntax of both languages involved, suggesting deep cognitive integration of the two linguistic systems rather than haphazard mixing.",
    questions: [
      { questionText: "How was code-switching formerly viewed by prescriptivists?", options: ["As a sign of linguistic incompetence", "As a mark of high education", "As a neutral communicative tool", "As a cultural necessity"], correctIndex: 0, explanation: "Prescriptivists once dismissed code-switching as a symptom of linguistic incompetence.", sortOrder: 0 },
      { questionText: "What does the Markedness Model propose about language choices?", options: ["Speakers always prefer their native language", "Speakers calculate social costs and benefits against community norms", "All language choices carry equal social weight", "Markedness is determined by grammatical complexity"], correctIndex: 1, explanation: "The Markedness Model demonstrates that speakers calculate social costs and benefits of each language choice against community norms.", sortOrder: 1 },
    ],
  },
  {
    level: "C1", title: "Neuroplasticity and Recovery from Brain Injury", difficultyTier: 6, variantGroup: "c1-neuroscience",
    passageText: "The discovery that the adult brain retains a significant capacity for reorganisation - a property termed neuroplasticity - has fundamentally altered the prognosis for patients recovering from stroke and traumatic brain injury. Traditional neurological dogma held that the adult brain was essentially fixed, with localised regions performing immutable functions. Contemporary research, however, has demonstrated that following injury, intact cortical areas can assume the functions of damaged tissue through a process of axonal sprouting and synaptic remodelling. Constraint-induced movement therapy, which forces the use of an affected limb by restricting the unaffected one, exploits this plasticity and has yielded functional improvements even in patients years post-stroke. Nevertheless, neuroplasticity is a double-edged sword: maladaptive reorganisation can lead to chronic pain syndromes, phantom limb sensations, and dystonia. The challenge for rehabilitation science lies in harnessing beneficial plasticity while suppressing harmful neural reorganisation - a balancing act that demands precise timing, intensity, and specificity of therapeutic interventions.",
    questions: [
      { questionText: "What was the traditional view of the adult brain?", options: ["It was highly adaptable and flexible", "It was essentially fixed with regions performing immutable functions", "It could regenerate completely after injury", "It had unlimited capacity for learning"], correctIndex: 1, explanation: "Traditional dogma held that the adult brain was essentially fixed with localised regions performing immutable functions.", sortOrder: 0 },
      { questionText: "Why is neuroplasticity described as a double-edged sword?", options: ["It is both expensive and time-consuming", "It can lead to both recovery and harmful conditions", "It works for some injuries but not others", "It requires medication with serious side effects"], correctIndex: 1, explanation: "Maladaptive reorganisation can lead to chronic pain, phantom limb sensations, and dystonia.", sortOrder: 1 },
    ],
  },
  {
    level: "C1", title: "The Economics of Climate Adaptation", difficultyTier: 7, variantGroup: "c1-economics",
    passageText: "As the window for limiting global warming to 1.5 degrees Celsius narrows, policymakers are increasingly compelled to confront the economics of climate adaptation alongside mitigation. Adaptation - the process of adjusting to actual or expected climate effects - encompasses a vast spectrum of interventions, from constructing sea walls and upgrading drainage infrastructure to developing drought-resistant crop varieties and redesigning urban heat islands. The economics of adaptation are fiendishly complex because they involve long time horizons, deep uncertainty about the magnitude of future climate impacts, and distributional questions about who should bear the costs. Cost-benefit analyses of adaptation projects frequently founder on the difficulty of monetising non-market goods such as biodiversity, cultural heritage, and community cohesion. Moreover, adaptation decisions made today can create path dependencies that constrain future options - a phenomenon economists term maladaptation. For instance, air conditioning, while providing immediate relief from heatwaves, increases energy demand and greenhouse gas emissions, potentially exacerbating the very problem it addresses.",
    questions: [
      { questionText: "Why are cost-benefit analyses of adaptation projects difficult?", options: ["They involve only short-term costs", "It is hard to monetise non-market goods like biodiversity and cultural heritage", "All adaptation costs are easily quantifiable", "They only consider market-based interventions"], correctIndex: 1, explanation: "Cost-benefit analyses founder on the difficulty of monetising non-market goods such as biodiversity, cultural heritage, and community cohesion.", sortOrder: 0 },
      { questionText: "What is the example given of maladaptation?", options: ["Building sea walls that erode beaches", "Air conditioning that increases energy demand and emissions", "Planting trees that consume too much water", "Relocating communities away from coastlines"], correctIndex: 1, explanation: "Air conditioning provides immediate relief but increases energy demand and emissions, potentially exacerbating the problem.", sortOrder: 1 },
    ],
  },
  {
    level: "C1", title: "Digital Surveillance and Democratic Norms", difficultyTier: 8, variantGroup: "c1-politics",
    passageText: "The proliferation of digital surveillance technologies poses a fundamental challenge to the normative foundations of liberal democracy. Facial recognition systems, predictive policing algorithms, and bulk data collection programmes have expanded the capacity of the state to monitor its citizens to an extent that would have been inconceivable to the architects of modern constitutional frameworks. Proponents argue that these tools are indispensable for combating terrorism, organised crime, and cyber threats. Critics, however, contend that the normalisation of mass surveillance corrodes the presumption of privacy that underpins free expression, political association, and journalistic inquiry. The European Court of Human Rights has repeatedly emphasised that surveillance measures must be accompanied by robust independent oversight, yet the pace of technological development consistently outstrips the capacity of legislative bodies to craft proportionate regulatory frameworks. Of particular concern is the chilling effect - the well-documented phenomenon whereby individuals self-censor lawful behaviour when they know, or suspect, they are being observed. Empirical studies from both authoritarian and democratic contexts confirm that awareness of surveillance reduces willingness to participate in political protests, search for sensitive health information online, and communicate with journalists.",
    questions: [
      { questionText: "What do critics argue about mass surveillance?", options: ["It is not effective enough against terrorism", "It is too expensive to implement properly", "It corrodes the presumption of privacy that underpins free expression", "It only works in authoritarian contexts"], correctIndex: 2, explanation: "Critics contend that the normalisation of mass surveillance corrodes the presumption of privacy that underpins free expression, political association, and journalistic inquiry.", sortOrder: 0 },
      { questionText: "What is the chilling effect as described in the passage?", options: ["Technology makes surveillance cheaper", "Individuals self-censor lawful behaviour when they suspect observation", "Surveillance technology cools down physical infrastructure", "Governments lose public trust over time"], correctIndex: 1, explanation: "The chilling effect is the phenomenon whereby individuals self-censor lawful behaviour when they know or suspect they are being observed.", sortOrder: 1 },
    ],
  },
];

const listeningItems: {
  level: string; scriptText: string; context: string; difficultyTier: number;
  variantGroup: string;
  questions: { questionText: string; options: string[]; correctIndex: number; explanation?: string; sortOrder: number }[];
}[] = [
  {
    level: "A2", context: "You hear a woman talking to a shop assistant.",
    scriptText: "Excuse me, I am looking for a birthday present for my daughter. She is ten years old and she loves reading. Do you have any book recommendations? Well, we have a wonderful new series about a young detective. It is very popular with children around her age. It is called The Mystery Club. Each book costs seven pounds ninety-nine. That sounds perfect! I will take the first three books in the series.",
    difficultyTier: 3, variantGroup: "a2-shopping",
    questions: [
      { questionText: "Who is the woman buying a present for?", options: ["Her son", "Her daughter", "Her friend", "Her sister"], correctIndex: 1, explanation: "She says she is looking for a birthday present for her daughter.", sortOrder: 0 },
      { questionText: "How much does one book cost?", options: ["Five pounds ninety-nine", "Seven pounds ninety-nine", "Nine pounds ninety-nine", "Ten pounds"], correctIndex: 1, explanation: "Each book costs seven pounds ninety-nine.", sortOrder: 1 },
    ],
  },
  {
    level: "A2", context: "You hear a man leaving a voicemail message.",
    scriptText: "Hi, this is David. I am calling about the meeting tomorrow. I am afraid I cannot come at ten o clock because I have a dentist appointment. Could we meet at two o clock instead? I have already checked with Sarah, and she says that time works for her too. If two o clock is not good for you, please call me back before five o clock today. Thanks!",
    difficultyTier: 4, variantGroup: "a2-schedule",
    questions: [
      { questionText: "Why can David not come at ten o clock?", options: ["He has another meeting", "He has a dentist appointment", "He is feeling sick", "He has to pick up his children"], correctIndex: 1, explanation: "David says he cannot come at ten because he has a dentist appointment.", sortOrder: 0 },
      { questionText: "What time does David want to meet instead?", options: ["At twelve o clock", "At one o clock", "At two o clock", "At three o clock"], correctIndex: 2, explanation: "David asks to meet at two o clock instead.", sortOrder: 1 },
    ],
  },
  {
    level: "A2", context: "You hear a tour guide speaking to a group of tourists.",
    scriptText: "Welcome to the Old Town walking tour, everyone! My name is Lisa, and I will be your guide today. The tour lasts about two hours, and we will visit the famous cathedral, the old market square, and the riverside gardens. Please wear comfortable shoes because some of the streets are made of cobblestones and can be slippery. We will stop for a coffee break halfway through the tour at a lovely cafe near the bridge. If you have any questions during the tour, just raise your hand.",
    difficultyTier: 5, variantGroup: "a2-travel",
    questions: [
      { questionText: "How long does the walking tour last?", options: ["One hour", "Two hours", "Three hours", "Four hours"], correctIndex: 1, explanation: "The tour guide says the tour lasts about two hours.", sortOrder: 0 },
      { questionText: "Where will they stop for a coffee break?", options: ["Near the cathedral", "At the market square", "Near the bridge", "At the riverside gardens"], correctIndex: 2, explanation: "They will stop for coffee at a cafe near the bridge.", sortOrder: 1 },
    ],
  },
  {
    level: "B1", context: "You hear a radio interview with a young entrepreneur.",
    scriptText: "So, Tom, you started your own business at the age of twenty-two. What gave you the idea? Well, I was always frustrated by how difficult it was to find locally produced food in supermarkets. Everything came from hundreds of miles away. So I thought, why not create an app that connects local farmers directly with consumers? Users can browse produce from farms within thirty miles of their home, place an order, and have it delivered the same day. It took about six months to build the app and find enough farmers to join. The biggest challenge was convincing people to try it. But once they tasted the difference in freshness, word spread quickly. We now have over ten thousand regular customers.",
    difficultyTier: 4, variantGroup: "b1-business",
    questions: [
      { questionText: "What problem did Tom want to solve?", options: ["Supermarkets were too expensive", "Local food was hard to find in supermarkets", "Farmers were losing money", "Food delivery took too long"], correctIndex: 1, explanation: "Tom was frustrated by how difficult it was to find locally produced food in supermarkets.", sortOrder: 0 },
      { questionText: "How many regular customers does the app have now?", options: ["About five thousand", "About ten thousand", "About twenty thousand", "About fifty thousand"], correctIndex: 1, explanation: "Tom says they now have over ten thousand regular customers.", sortOrder: 1 },
    ],
  },
  {
    level: "B1", context: "You hear two colleagues discussing a project.",
    scriptText: "Hey Maria, did you see the email about the Johnson project? The deadline has been moved up by a week. Oh no, really? That is going to be tight. We are still waiting on the data from the research team. I know. I spoke to James this morning and he said they should have it ready by Wednesday at the latest. But that only gives us two days to analyse everything and write the report. What if we start drafting the report now with the sections we can already write, like the introduction and methodology, and then fill in the results when the data arrives? That is actually a great idea. I will start on the introduction this afternoon if you can handle the methodology section.",
    difficultyTier: 5, variantGroup: "b1-work",
    questions: [
      { questionText: "What change has been made to the Johnson project?", options: ["The budget has been reduced", "The deadline has been moved up by a week", "A new team member has been added", "The project has been cancelled"], correctIndex: 1, explanation: "The deadline has been moved up by a week.", sortOrder: 0 },
      { questionText: "What solution do the colleagues agree on?", options: ["Ask for an extension", "Start drafting sections they can already write", "Cancel the project", "Work over the weekend"], correctIndex: 1, explanation: "They agree to start drafting the report with sections they can already write.", sortOrder: 1 },
    ],
  },
  {
    level: "B1", context: "You hear a teacher giving instructions for an assignment.",
    scriptText: "Right everyone, listen carefully. Your next assignment is a group presentation on an environmental topic of your choice. You will work in groups of three or four, and each group must choose a different topic, so we will sign up in class on Friday. Your presentation should last between eight and ten minutes, and every group member must speak. You should include at least three reliable sources - I recommend using academic journals and government reports rather than random websites. I also want you to prepare a one-page handout for the class with the key points and references. The presentations will take place on the fifteenth of March. If you have any questions, come and see me during office hours on Thursday morning.",
    difficultyTier: 6, variantGroup: "b1-education",
    questions: [
      { questionText: "How long should each group presentation last?", options: ["Five to seven minutes", "Eight to ten minutes", "Ten to twelve minutes", "Twelve to fifteen minutes"], correctIndex: 1, explanation: "The presentation should last between eight and ten minutes.", sortOrder: 0 },
      { questionText: "What type of sources does the teacher recommend?", options: ["News articles and blog posts", "Academic journals and government reports", "Textbooks only", "Social media posts"], correctIndex: 1, explanation: "The teacher recommends using academic journals and government reports.", sortOrder: 1 },
    ],
  },
  {
    level: "B2", context: "You hear a discussion on a current affairs programme about urban planning.",
    scriptText: "The city council proposal to pedestrianise the historic centre has drawn mixed reactions. Proponents, including environmental groups and local retailers, argue that car-free zones would dramatically improve air quality, reduce noise pollution, and attract more foot traffic to struggling shops. Indeed, studies from comparable European cities suggest that pedestrianised areas can boost retail revenue by up to thirty percent. However, opponents - notably disability advocacy organisations and some residents - contend that the plans insufficiently address accessibility needs. Wheelchair users and elderly residents who rely on door-to-door transport would face significant difficulties. Moreover, the proposed park-and-ride facilities on the outskirts are, according to critics, inadequately served by public transport links, potentially shifting rather than solving the congestion problem. The council has pledged to consult further before finalising the scheme.",
    difficultyTier: 5, variantGroup: "b2-urban",
    questions: [
      { questionText: "By how much can pedestrianised areas boost retail revenue according to studies?", options: ["Up to 10%", "Up to 20%", "Up to 30%", "Up to 50%"], correctIndex: 2, explanation: "Studies suggest pedestrianised areas can boost retail revenue by up to thirty percent.", sortOrder: 0 },
      { questionText: "What concern do disability advocacy organisations raise?", options: ["Parking fees are too high", "The plans insufficiently address accessibility needs", "Pedestrian zones are too noisy", "There are not enough benches"], correctIndex: 1, explanation: "Opponents contend that the plans insufficiently address accessibility needs.", sortOrder: 1 },
    ],
  },
  {
    level: "B2", context: "You hear part of a lecture on behavioural economics.",
    scriptText: "The concept of nudge theory has gained considerable traction in public policy circles since Thaler and Sunstein influential 2008 publication. At its core, nudge theory proposes that subtle changes to the choice architecture - the way options are presented - can steer people towards better decisions without restricting their freedom of choice. A classic example is organ donation: countries that use an opt-out system, where citizens are presumed donors unless they explicitly decline, have dramatically higher donation rates than opt-in countries. Critics, however, raise legitimate concerns about paternalism. Who decides what constitutes a better decision? And might nudges be deployed to serve commercial or political interests rather than individual welfare? The UK Behavioural Insights Team, colloquially known as the Nudge Unit, has addressed some of these concerns by committing to transparency about which interventions they test and publishing their results regardless of outcome.",
    difficultyTier: 6, variantGroup: "b2-economics",
    questions: [
      { questionText: "What is the key idea of nudge theory?", options: ["People should be forced to make better decisions", "Subtle changes in how options are presented can guide better decisions", "All choices should be eliminated", "Governments should make all decisions for citizens"], correctIndex: 1, explanation: "Nudge theory proposes that subtle changes to choice architecture can steer people towards better decisions without restricting freedom.", sortOrder: 0 },
      { questionText: "What do countries with opt-out organ donation systems have compared to opt-in countries?", options: ["Similar donation rates", "Slightly lower donation rates", "Dramatically higher donation rates", "No difference in donation rates"], correctIndex: 2, explanation: "Countries with opt-out systems have dramatically higher donation rates than opt-in countries.", sortOrder: 1 },
    ],
  },
  {
    level: "B2", context: "You hear two experts discussing renewable energy policy.",
    scriptText: "The transition to renewable energy is often framed as a purely technological challenge, but the policy dimension is equally critical. Germany Energiewende, for instance, demonstrates that ambitious targets alone are insufficient. Despite massive investment in wind and solar capacity, Germany carbon emissions have declined more slowly than anticipated, partly because the simultaneous phase-out of nuclear power necessitated continued reliance on coal and natural gas as baseload sources. The lesson, I think, is that energy transitions must be managed holistically. You cannot simply add renewables to the grid without addressing storage, grid stability, and the social consequences for communities dependent on fossil fuel industries. Spain offers an interesting counterpoint: by combining aggressive renewable deployment with a just transition framework that retrains coal miners and subsidises green industries in former mining regions, they have achieved faster emissions reductions with far less political resistance.",
    difficultyTier: 7, variantGroup: "b2-environment",
    questions: [
      { questionText: "Why have Germany carbon emissions declined more slowly than expected?", options: ["Wind and solar technology is unreliable", "The phase-out of nuclear power required continued use of coal and gas", "Public opposition blocked renewable projects", "The government reduced subsidies for renewables"], correctIndex: 1, explanation: "Germany emissions declined slowly partly because the nuclear phase-out necessitated continued reliance on coal and natural gas.", sortOrder: 0 },
      { questionText: "What approach has Spain taken to manage the energy transition?", options: ["Slower renewable deployment", "Combining renewables with a just transition framework for affected communities", "Banning all fossil fuels immediately", "Privatising the energy sector"], correctIndex: 1, explanation: "Spain combined aggressive renewable deployment with a just transition framework that retrains coal miners and subsidises green industries.", sortOrder: 1 },
    ],
  },
  {
    level: "C1", context: "You hear an academic discussing the implications of quantum computing for cybersecurity.",
    scriptText: "The advent of practical quantum computing would render most contemporary encryption protocols - upon which global financial systems, diplomatic communications, and personal privacy fundamentally depend - critically vulnerable. RSA and ECC, the cryptographic algorithms safeguarding the vast majority of internet transactions, derive their security from the computational intractability of factoring large prime numbers and solving discrete logarithm problems respectively. A sufficiently powerful quantum computer, running Shor algorithm, could solve these problems in polynomial time, effectively breaking encryption that would take classical computers millennia to crack. This prospect has catalysed the field of post-quantum cryptography, which seeks to develop algorithms resistant to quantum attacks. NIST standardised its first post-quantum cryptographic algorithms in 2024, but the transition from legacy systems presents formidable challenges: backward compatibility, performance overhead, and the sheer scale of infrastructure requiring updates mean that migration will likely take a decade or more. Of particular concern is the harvest now, decrypt later threat, whereby adversaries currently intercept and store encrypted communications, anticipating that future quantum capabilities will enable decryption.",
    difficultyTier: 6, variantGroup: "c1-technology",
    questions: [
      { questionText: "Why would quantum computing threaten current encryption?", options: ["It would make computers too fast for security systems", "Shor algorithm could solve problems that current encryption relies on being intractable", "Quantum computers cannot run encryption software", "It would make all data publicly accessible"], correctIndex: 1, explanation: "Shor algorithm could solve prime factorisation and discrete logarithm problems in polynomial time, breaking current encryption.", sortOrder: 0 },
      { questionText: "What is the harvest now, decrypt later threat?", options: ["Hackers currently steal data and wait for quantum decryption capability", "Governments are already using quantum computers", "Encryption will become unnecessary", "Data is being deleted before quantum computers arrive"], correctIndex: 0, explanation: "Adversaries currently intercept and store encrypted communications, anticipating that future quantum capabilities will enable decryption.", sortOrder: 1 },
    ],
  },
  {
    level: "C1", context: "You hear a philosopher debating the concept of moral responsibility in the age of algorithms.",
    scriptText: "The increasing delegation of decision-making to algorithmic systems - from credit scoring and hiring to criminal sentencing and parole decisions - raises profound questions about moral responsibility. When a machine learning model trained on historical data produces discriminatory outcomes, the conventional framework of moral accountability, which presupposes an agent capable of intention and reflection, appears inadequate. The developer who wrote the code may not have intended bias; the data curator may not have recognised the discriminatory patterns; the deploying organisation may have relied on assurances of algorithmic fairness from third-party auditors. This diffusion of responsibility creates what some philosophers have termed a responsibility gap - situations in which harm occurs but no single agent can be held meaningfully accountable. Proposed solutions range from strict liability regimes for deploying organisations to the development of explainable AI that renders algorithmic reasoning transparent enough for human oversight. Yet each approach carries trade-offs: strict liability may deter beneficial innovation, while explainability requirements may sacrifice predictive accuracy.",
    difficultyTier: 7, variantGroup: "c1-ethics",
    questions: [
      { questionText: "What is the responsibility gap described in the passage?", options: ["A lack of qualified AI developers", "Situations where harm occurs but no single agent can be held meaningfully accountable", "The gap between AI capabilities and human intelligence", "A shortage of regulations for AI systems"], correctIndex: 1, explanation: "The responsibility gap refers to situations in which harm occurs but no single agent can be held meaningfully accountable.", sortOrder: 0 },
      { questionText: "What trade-off is associated with strict liability regimes?", options: ["They are too complex to enforce", "They may deter beneficial innovation", "They favour large corporations", "They require too much government oversight"], correctIndex: 1, explanation: "Strict liability may deter beneficial innovation, which is a trade-off of that approach.", sortOrder: 1 },
    ],
  },
  {
    level: "C1", context: "You hear a historian discussing the role of pandemics in shaping social structures.",
    scriptText: "Throughout history, pandemics have served as catalysts for profound social transformation, often accelerating changes that were already latent in the societies they struck. The Black Death of the fourteenth century, for instance, by eliminating roughly a third of Europe population, fundamentally altered the balance of power between labour and capital. The resulting scarcity of workers empowered surviving peasants to demand higher wages and greater freedoms, contributing to the eventual demise of feudal labour obligations. Similarly, the 1918 influenza pandemic coincided with and arguably advanced the expansion of public health infrastructure and the professionalisation of nursing. COVID-19 appears to be following a comparable pattern: the abrupt normalisation of remote work, the heightened public awareness of systemic health inequities, and the unprecedented speed of mRNA vaccine development all represent accelerations of pre-existing trends. The pertinent question is not whether the pandemic will reshape society, but whether the changes it catalyses will be harnessed for equitable reform or allowed to entrench existing disparities.",
    difficultyTier: 8, variantGroup: "c1-history",
    questions: [
      { questionText: "How did the Black Death alter the balance of power between labour and capital?", options: ["It strengthened the power of landowners", "It empowered surviving peasants to demand higher wages and greater freedoms", "It had no significant effect on labour relations", "It eliminated the merchant class entirely"], correctIndex: 1, explanation: "The resulting scarcity of workers empowered surviving peasants to demand higher wages and greater freedoms.", sortOrder: 0 },
      { questionText: "What does the historian suggest is the key question about COVID-19 impact?", options: ["Whether the pandemic will reshape society", "Whether changes will be harnessed for equitable reform or entrench existing disparities", "Whether remote work will become permanent", "Whether another pandemic will occur"], correctIndex: 1, explanation: "The pertinent question is whether the changes will be harnessed for equitable reform or allowed to entrench existing disparities.", sortOrder: 1 },
    ],
  },
];

const speakingPrompts: {
  level: string; promptText: string; preparationTime: number; responseTime: number;
  difficultyTier: number; variantGroup: string;
}[] = [
  { level: "A2", promptText: "Describe your favourite meal. What is it? When do you usually eat it? Why do you like it so much?", preparationTime: 20, responseTime: 90, difficultyTier: 3, variantGroup: "a2-food" },
  { level: "A2", promptText: "Talk about a place you visited recently. Where did you go? Who did you go with? What did you do there?", preparationTime: 20, responseTime: 90, difficultyTier: 3, variantGroup: "a2-travel" },
  { level: "A2", promptText: "Describe your best friend. What do they look like? What kind of person are they? What do you enjoy doing together?", preparationTime: 20, responseTime: 90, difficultyTier: 4, variantGroup: "a2-people" },
  { level: "A2", promptText: "Talk about your typical weekend. What do you usually do on Saturday and Sunday? Do you prefer relaxing or being active?", preparationTime: 20, responseTime: 90, difficultyTier: 4, variantGroup: "a2-routine" },
  { level: "A2", promptText: "Describe your home. How many rooms does it have? Which room is your favourite and why? What would you change about it?", preparationTime: 20, responseTime: 90, difficultyTier: 5, variantGroup: "a2-home" },
  { level: "B1", promptText: "Some people think that children should learn to cook at school, while others believe it is the parents responsibility. What is your opinion? Give reasons and examples to support your view.", preparationTime: 30, responseTime: 120, difficultyTier: 4, variantGroup: "b1-education" },
  { level: "B1", promptText: "Talk about a skill you would like to learn in the future. Why do you want to learn it? How would you go about learning it? How would it benefit your life?", preparationTime: 30, responseTime: 120, difficultyTier: 4, variantGroup: "b1-personal" },
  { level: "B1", promptText: "Describe a festival or celebration that is important in your country. When does it take place? What do people typically do? Why is it significant?", preparationTime: 30, responseTime: 120, difficultyTier: 5, variantGroup: "b1-culture" },
  { level: "B1", promptText: "Do you think social media has a positive or negative effect on friendships? Discuss both sides and give your own opinion with examples.", preparationTime: 30, responseTime: 120, difficultyTier: 5, variantGroup: "b1-technology" },
  { level: "B1", promptText: "Talk about a time when you had to make a difficult decision. What was the situation? What did you decide? Looking back, are you happy with your choice?", preparationTime: 30, responseTime: 120, difficultyTier: 6, variantGroup: "b1-personal" },
  { level: "B2", promptText: "Some people argue that universities should focus on practical skills that prepare students for the job market, while others believe the purpose of university education is to develop critical thinking and broad knowledge. Discuss both perspectives and explain which view you agree with and why.", preparationTime: 40, responseTime: 150, difficultyTier: 5, variantGroup: "b2-education" },
  { level: "B2", promptText: "In many countries, the population is ageing rapidly. What challenges does this demographic shift create for society, and what measures could governments take to address them? Provide specific examples to illustrate your points.", preparationTime: 40, responseTime: 150, difficultyTier: 5, variantGroup: "b2-society" },
  { level: "B2", promptText: "Describe a book, film, or documentary that significantly changed your perspective on an issue. What was it about? How did it challenge your previous views? Would you recommend it to others and why?", preparationTime: 40, responseTime: 150, difficultyTier: 6, variantGroup: "b2-media" },
  { level: "B2", promptText: "The gig economy - characterised by short-term contracts and freelance work - is growing rapidly. Discuss the advantages and disadvantages of this trend for workers. Do you think governments should regulate it more strictly?", preparationTime: 40, responseTime: 150, difficultyTier: 6, variantGroup: "b2-economy" },
  { level: "B2", promptText: "Talk about a global issue that you feel strongly about. Explain why this issue matters to you, what the root causes are, and what individuals or communities can do to make a difference.", preparationTime: 40, responseTime: 150, difficultyTier: 7, variantGroup: "b2-global" },
  { level: "C1", promptText: "The rise of artificial intelligence has led some commentators to argue that creativity - long considered a uniquely human attribute - can now be replicated by machines. To what extent do you agree with this assessment? Discuss the implications for the arts, innovation, and human identity.", preparationTime: 45, responseTime: 180, difficultyTier: 6, variantGroup: "c1-technology" },
  { level: "C1", promptText: "Critically examine the argument that freedom of speech should have no limitations, even when it involves offensive or misleading content. Consider the role of social media platforms, government regulation, and the potential harm to vulnerable groups in your response.", preparationTime: 45, responseTime: 180, difficultyTier: 7, variantGroup: "c1-politics" },
  { level: "C1", promptText: "Some economists argue that gross domestic product is an inadequate measure of a nation progress and wellbeing. Evaluate this claim, considering alternative metrics such as the Genuine Progress Indicator and the Human Development Index. What would a more holistic measure of national success look like?", preparationTime: 45, responseTime: 180, difficultyTier: 7, variantGroup: "c1-economics" },
  { level: "C1", promptText: "Discuss the ethical tensions between scientific advancement and cultural preservation, using the debate over the repatriation of museum artefacts as your primary example. How should institutions balance the pursuit of knowledge with respect for the communities from which these objects originate?", preparationTime: 45, responseTime: 180, difficultyTier: 8, variantGroup: "c1-ethics" },
  { level: "C1", promptText: "To what extent has the concept of privacy been rendered obsolete by digital technology? Analyse the social, legal, and philosophical dimensions of this question, drawing on examples from both democratic and authoritarian contexts.", preparationTime: 45, responseTime: 180, difficultyTier: 8, variantGroup: "c1-privacy" },
];

const writingPrompts: {
  level: string; promptText: string; minWords: number; maxWords: number;
  difficultyTier: number; variantGroup: string;
}[] = [
  { level: "A2", promptText: "Write an email to a friend inviting them to your birthday party. Include the date, time, location, and what activities you have planned. Ask them if they can come and what food they would like.", minWords: 40, maxWords: 100, difficultyTier: 3, variantGroup: "a2-email" },
  { level: "A2", promptText: "Write about your favourite season of the year. Describe what the weather is like, what activities you enjoy during this season, and why you prefer it over the others. Give at least two specific reasons.", minWords: 50, maxWords: 120, difficultyTier: 4, variantGroup: "a2-describe" },
  { level: "A2", promptText: "You recently started a new hobby. Write a message to a friend telling them about it. Explain what the hobby is, how you got interested in it, and what you enjoy most about it. Ask if they would like to try it with you.", minWords: 50, maxWords: 120, difficultyTier: 4, variantGroup: "a2-personal" },
  { level: "A2", promptText: "Write a short review of a restaurant you visited recently. Describe the food, the service, and the atmosphere. Would you recommend it to others? Why or why not?", minWords: 50, maxWords: 120, difficultyTier: 5, variantGroup: "a2-review" },
  { level: "B1", promptText: "Some people believe that school uniforms improve student behaviour and reduce bullying, while others think they restrict self-expression and are unnecessary. Write an essay discussing both views and giving your own opinion. Use specific examples to support your arguments.", minWords: 80, maxWords: 180, difficultyTier: 4, variantGroup: "b1-education" },
  { level: "B1", promptText: "You recently had a problem with a product you bought online. Write an email to the company customer service department explaining what went wrong, when you bought the item, and what you would like them to do about it. Be polite but firm.", minWords: 80, maxWords: 180, difficultyTier: 4, variantGroup: "b1-formal" },
  { level: "B1", promptText: "Write an article for your school magazine about the importance of learning a second language. Discuss the personal, professional, and cultural benefits. Include examples from your own experience or from people you know.", minWords: 80, maxWords: 180, difficultyTier: 5, variantGroup: "b1-language" },
  { level: "B1", promptText: "Describe a challenge you have faced in your life and how you overcame it. Explain what the challenge was, what steps you took to deal with it, and what you learned from the experience. How has it affected who you are today?", minWords: 80, maxWords: 180, difficultyTier: 6, variantGroup: "b1-personal" },
  { level: "B2", promptText: "The increasing use of smartphones among children has become a topic of heated debate. Some experts argue that early exposure to technology hampers cognitive development and social skills, while others contend that digital literacy is essential in the modern world. Write a discursive essay examining both perspectives and presenting a balanced conclusion, supported by relevant evidence and examples.", minWords: 120, maxWords: 250, difficultyTier: 5, variantGroup: "b2-technology" },
  { level: "B2", promptText: "Write a proposal for improving public transport in your city. Identify the main problems with the current system, suggest at least three practical improvements, and explain how each would benefit residents. Consider cost, accessibility, and environmental impact in your proposals.", minWords: 120, maxWords: 250, difficultyTier: 5, variantGroup: "b2-urban" },
  { level: "B2", promptText: "In many countries, young people are choosing to delay marriage and parenthood compared to previous generations. Analyse the social, economic, and cultural factors driving this trend, and discuss whether you think it represents a positive or negative development for society as a whole.", minWords: 120, maxWords: 250, difficultyTier: 6, variantGroup: "b2-society" },
  { level: "B2", promptText: "Write a review of a documentary or podcast that explores a contemporary social issue. Summarise the main arguments presented, evaluate the effectiveness of the evidence used, and offer your own critical perspective on the topic. Would you recommend it to others?", minWords: 120, maxWords: 250, difficultyTier: 7, variantGroup: "b2-media" },
  { level: "C1", promptText: "The concept of cultural appropriation has become central to debates about art, fashion, and media. Critics argue that powerful groups exploit marginalised cultures for profit or aesthetic purposes, while defenders claim that cultural exchange is inevitable and enriching. Write a nuanced essay examining the boundaries between appreciation and appropriation, considering the role of power dynamics, consent, and context. Illustrate your argument with specific examples.", minWords: 180, maxWords: 350, difficultyTier: 6, variantGroup: "c1-culture" },
  { level: "C1", promptText: "Evaluate the argument that universal basic income is the most viable solution to the economic disruptions caused by automation and artificial intelligence. Consider alternative policy approaches, the evidence from pilot programmes, and the potential unintended consequences of UBI implementation. Present a well-reasoned conclusion.", minWords: 180, maxWords: 350, difficultyTier: 7, variantGroup: "c1-economics" },
  { level: "C1", promptText: "Write a critical analysis of the role that social media platforms play in shaping public discourse in democratic societies. Consider the tension between free expression and the spread of misinformation, the economic incentives of platform companies, and the feasibility of regulatory interventions. Propose a framework for balancing these competing interests.", minWords: 180, maxWords: 350, difficultyTier: 7, variantGroup: "c1-politics" },
  { level: "C1", promptText: "Critically examine the proposition that international development aid has done more harm than good in Sub-Saharan Africa. Engage with arguments from both sides of the debate, drawing on specific examples of aid programmes and their outcomes. What alternative models of development, if any, would you propose?", minWords: 180, maxWords: 350, difficultyTier: 8, variantGroup: "c1-development" },
];

async function main() {
  console.log("Seeding question bank...\n");

  console.log("Reading passages: " + readingPassages.length);
  let readingCount = 0;
  for (const rp of readingPassages) {
    const existing = await db.readingPassage.findFirst({
      where: { title: rp.title, level: rp.level },
    });
    if (existing) {
      console.log("  Skip existing: " + rp.level + " - " + rp.title);
      continue;
    }
    await db.readingPassage.create({
      data: {
        level: rp.level, title: rp.title, passageText: rp.passageText,
        difficultyTier: rp.difficultyTier, variantGroup: rp.variantGroup,
        questions: {
          create: rp.questions.map(q => ({
            questionText: q.questionText, options: JSON.stringify(q.options),
            correctIndex: q.correctIndex, explanation: q.explanation, sortOrder: q.sortOrder,
          })),
        },
      },
    });
    readingCount++;
    console.log("  Created: " + rp.level + " - " + rp.title + " (" + rp.questions.length + " questions)");
  }
  console.log("  Total reading passages created: " + readingCount + "\n");

  console.log("Listening items: " + listeningItems.length);
  let listeningCount = 0;
  for (const li of listeningItems) {
    const existing = await db.listeningItem.findFirst({
      where: { context: li.context, level: li.level },
    });
    if (existing) {
      console.log("  Skip existing: " + li.level + " - " + li.context);
      continue;
    }
    await db.listeningItem.create({
      data: {
        level: li.level, scriptText: li.scriptText, context: li.context,
        difficultyTier: li.difficultyTier, variantGroup: li.variantGroup,
        questions: {
          create: li.questions.map(q => ({
            questionText: q.questionText, options: JSON.stringify(q.options),
            correctIndex: q.correctIndex, explanation: q.explanation, sortOrder: q.sortOrder,
          })),
        },
      },
    });
    listeningCount++;
    console.log("  Created: " + li.level + " - " + li.context);
  }
  console.log("  Total listening items created: " + listeningCount + "\n");

  console.log("Speaking prompts: " + speakingPrompts.length);
  let speakingCount = 0;
  for (const sp of speakingPrompts) {
    const existing = await db.speakingPrompt.findFirst({
      where: { promptText: { startsWith: sp.promptText.substring(0, 40) }, level: sp.level },
    });
    if (existing) {
      console.log("  Skip existing: " + sp.level);
      continue;
    }
    await db.speakingPrompt.create({
      data: {
        level: sp.level, promptText: sp.promptText,
        preparationTime: sp.preparationTime, responseTime: sp.responseTime,
        difficultyTier: sp.difficultyTier, variantGroup: sp.variantGroup,
      },
    });
    speakingCount++;
    console.log("  Created: " + sp.level);
  }
  console.log("  Total speaking prompts created: " + speakingCount + "\n");

  console.log("Writing prompts: " + writingPrompts.length);
  let writingCount = 0;
  for (const wp of writingPrompts) {
    const existing = await db.writingPrompt.findFirst({
      where: { promptText: { startsWith: wp.promptText.substring(0, 40) }, level: wp.level },
    });
    if (existing) {
      console.log("  Skip existing: " + wp.level);
      continue;
    }
    await db.writingPrompt.create({
      data: {
        level: wp.level, promptText: wp.promptText,
        minWords: wp.minWords, maxWords: wp.maxWords,
        difficultyTier: wp.difficultyTier, variantGroup: wp.variantGroup,
      },
    });
    writingCount++;
    console.log("  Created: " + wp.level);
  }
  console.log("  Total writing prompts created: " + writingCount + "\n");

  console.log("=== SEED COMPLETE ===");
  const q = await db.question.count();
  const rp2 = await db.readingPassage.count();
  const li2 = await db.listeningItem.count();
  const sp2 = await db.speakingPrompt.count();
  const wp2 = await db.writingPrompt.count();
  console.log("MCQ Questions:    " + q);
  console.log("Reading Passages: " + rp2);
  console.log("Listening Items:  " + li2);
  console.log("Speaking Prompts: " + sp2);
  console.log("Writing Prompts:  " + wp2);
}

main().catch(console.error).finally(() => db.$disconnect());
