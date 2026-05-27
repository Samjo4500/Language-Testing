/**
 * Real educational content for all 132 lessons.
 * Keyed by content type → lesson title → HTML content.
 */

export const LESSON_CONTENT_MAP: Record<string, Record<string, string>> = {
  reading: {
    'Common Phrases': `<h3>Everyday English Greetings</h3>
<p>When you meet someone for the first time, the words you choose matter. In English-speaking cultures, a warm greeting sets the tone for the entire conversation. The most common first-time greeting is <strong>"Nice to meet you"</strong>, often accompanied by a handshake or a friendly smile.</p>
<p>For people you already know, greetings become more casual. Friends might say <strong>"Hey!"</strong>, <strong>"How's it going?"</strong>, or <strong>"What's up?"</strong> These phrases signal a relaxed, friendly relationship. In contrast, formal situations — such as meeting a new boss or attending a business event — call for <strong>"Good morning/afternoon"</strong> or <strong>"How do you do?"</strong></p>
<p>Leaving a conversation also has its own phrases. A simple <strong>"Goodbye"</strong> works everywhere, but you can also use <strong>"Take care"</strong>, <strong>"See you later"</strong>, or <strong>"Have a great day"</strong> for a warmer farewell. The key is matching your language to the situation: formal for professional settings, casual for friends.</p>`,

    'Everyday Activities': `<h3>A Day in the Life</h3>
<p>Everyone has a daily routine — the sequence of actions we repeat each day. Describing your routine in English requires the <strong>present simple tense</strong>, because these are habits and regular events. For example: <strong>"I wake up at 7 AM. I eat breakfast, brush my teeth, and leave for work."</strong></p>
<p>Native speakers often use time expressions to structure their descriptions. Words like <strong>"first"</strong>, <strong>"then"</strong>, <strong>"after that"</strong>, and <strong>"finally"</strong> help listeners follow the sequence. Try describing your own morning: <em>"First, I check my phone. Then I make coffee. After that, I take a shower and get dressed."</em></p>
<p>Notice that routines include both actions (verbs) and the objects involved (nouns). The verb <strong>"make"</strong> goes with <strong>"coffee"</strong> or <strong>"the bed"</strong>, while <strong>"do"</strong> pairs with <strong>"homework"</strong> or <strong>"exercise"</strong>. Learning these common collocations will make your English sound much more natural.</p>`,

    'Ordering Food': `<h3>Eating Out in English</h3>
<p>Ordering food at a restaurant follows a predictable pattern in English. When you arrive, the host might ask <strong>"Table for how many?"</strong> or <strong>"Do you have a reservation?"</strong> Once seated, the waiter will bring a menu and ask <strong>"Are you ready to order?"</strong> or <strong>"Can I get you something to drink?"</strong></p>
<p>When ordering, it is polite to say <strong>"I'd like..."</strong> or <strong>"Could I have..."</strong> rather than just naming the dish. For example: <strong>"I'd like the grilled salmon, please."</strong> If you need more time, say <strong>"Could we have a few more minutes?"</strong> If you have dietary needs, you can ask <strong>"Does this dish contain nuts?"</strong> or <strong>"Do you have vegetarian options?"</strong></p>
<p>At the end of the meal, you can signal the waiter by saying <strong>"Could we have the bill, please?"</strong> In many English-speaking countries, it is customary to leave a tip of 15–20% of the total. Simply say <strong>"Keep the change"</strong> if you want the tip included in your cash payment.</p>`,

    'At the Store': `<h3>Shopping in English</h3>
<p>Whether you are buying groceries, clothes, or electronics, shopping conversations in English follow common patterns. When you enter a store, a shop assistant might ask <strong>"Can I help you?"</strong> or <strong>"Are you looking for anything in particular?"</strong> If you are just browsing, a polite response is <strong>"I'm just looking, thanks."</strong></p>
<p>When you find something you want, you will need to ask about price and size. Useful phrases include <strong>"How much is this?"</strong>, <strong>"Do you have this in a larger size?"</strong>, and <strong>"Can I try this on?"</strong> In clothing stores, the fitting room is where you try on garments. If something does not fit, you can say <strong>"It doesn't fit"</strong> or <strong>"Do you have a different color?"</strong></p>
<p>At the checkout, the cashier might ask <strong>"Would you like a bag?"</strong> or <strong>"Are you paying by cash or card?"</strong> Understanding these common exchanges makes shopping in English-speaking countries much less stressful and far more enjoyable.</p>`,

    'Asking for Directions': `<h3>Finding Your Way</h3>
<p>Getting lost in an unfamiliar place can be stressful, but knowing how to ask for — and understand — directions in English makes all the difference. The most common way to start is <strong>"Excuse me, could you tell me how to get to...?"</strong> or simply <strong>"Where is the nearest...?"</strong></p>
<p>People giving directions use specific verbs: <strong>turn left/right</strong>, <strong>go straight</strong>, <strong>go past</strong>, and <strong>cross the street</strong>. They also use distance phrases like <strong>"It's about two blocks away"</strong> or <strong>"It's a five-minute walk."</strong> Landmarks are often used as reference points: <strong>"Turn left at the traffic light, then go past the post office."</strong></p>
<p>If you did not understand, do not be afraid to ask again. Say <strong>"Could you say that again, please?"</strong> or <strong>"So I turn left, then right?"</strong> to confirm. Many people will also offer to show you on a map or point in the right direction. Remember: it is always better to ask than to wander around lost!</p>`,

    'At the Doctor': `<h3>Visiting the Doctor</h3>
<p>If you feel unwell while in an English-speaking country, you may need to visit a doctor. At the clinic, the receptionist will ask <strong>"What are your symptoms?"</strong> or <strong>"What brings you in today?"</strong> Common responses include <strong>"I have a headache"</strong>, <strong>"My throat hurts"</strong>, <strong>"I've been feeling dizzy"</strong>, or <strong>"I have a fever."</strong></p>
<p>The doctor will examine you and may ask follow-up questions: <strong>"How long have you had this pain?"</strong>, <strong>"Are you taking any medication?"</strong>, or <strong>"Do you have any allergies?"</strong> Be honest and specific — use body language to point to the affected area if you do not know the English word.</p>
<p>After the examination, the doctor might prescribe medicine and say <strong>"Take this twice a day after meals"</strong> or <strong>"Get plenty of rest and drink lots of water."</strong> If the situation is serious, they may refer you to a specialist. Always ask if anything is unclear: <strong>"When should I come back?"</strong> or <strong>"Are there any side effects?"</strong></p>`,

    'Describing Your Home': `<h3>Home Sweet Home</h3>
<p>Being able to describe where you live is a fundamental skill in English. Start with the type of dwelling: <strong>"I live in an apartment / a house / a flat."</strong> Then add details about size and location: <strong>"It's a two-bedroom apartment in the city center"</strong> or <strong>"It's a small house with a garden in the suburbs."</strong></p>
<p>When describing rooms, use <strong>"there is"</strong> for singular nouns and <strong>"there are"</strong> for plural ones. For example: <strong>"There is a big sofa in the living room. There are two lamps next to the bed."</strong> You can also use prepositions of place: <strong>"The TV is in front of the sofa"</strong> or <strong>"The kitchen is next to the dining room."</strong></p>
<p>Adjectives help bring your description to life. Instead of just saying <strong>"a room"</strong>, say <strong>"a bright, spacious room with large windows."</strong> Words like <strong>cozy</strong>, <strong>modern</strong>, <strong>noisy</strong>, and <strong>quiet</strong> give the listener a much better picture of your home.</p>`,

    'Talking About Weather': `<h3>Weather Talk</h3>
<p>In many English-speaking cultures, talking about the weather is more than just sharing information — it is a social ritual. It serves as a safe, neutral topic to break the ice with strangers or fill an awkward silence. Common opening phrases include <strong>"Lovely day, isn't it?"</strong>, <strong>"It's really cold today"</strong>, or <strong>"Looks like it might rain."</strong></p>
<p>English has a rich vocabulary for describing weather conditions. Rather than just saying <strong>"it's hot"</strong>, you could say <strong>"It's boiling"</strong>, <strong>"It's scorching"</strong>, or <strong>"It's a heatwave."</strong> Instead of <strong>"it's raining"</strong>, try <strong>"It's pouring"</strong>, <strong>"It's drizzling"</strong>, or <strong>"It's chucking it down."</strong> These expressions make your English more vivid and natural.</p>
<p>Seasons also shape daily life. In winter, people talk about <strong>frost</strong>, <strong>snow</strong>, and <strong>freezing temperatures</strong>. Summer brings conversations about <strong>sunburn</strong>, <strong>sunscreen</strong>, and <strong>staying hydrated</strong>. Understanding weather vocabulary helps you follow forecasts and plan your day accordingly.</p>`,

    // Intermediate Reading
    'Job Interviews': `<h3>Mastering the Job Interview</h3>
<p>A job interview in English can be daunting, but understanding the common format and expected responses will boost your confidence. Most interviews begin with <strong>"Tell me about yourself"</strong> — this is not an invitation to share your life story. Instead, give a concise professional summary: your background, key skills, and why you are interested in this role.</p>
<p>Employers frequently ask behavioral questions starting with <strong>"Tell me about a time when..."</strong> or <strong>"Give me an example of..."</strong> The STAR method helps structure your answer: describe the <strong>Situation</strong>, explain the <strong>Task</strong>, detail the <strong>Action</strong> you took, and share the <strong>Result</strong>. This framework demonstrates problem-solving skills clearly and concisely.</p>
<p>At the end of the interview, you will usually be asked <strong>"Do you have any questions for us?"</strong> Always say yes. Smart questions like <strong>"What does a typical day look like in this role?"</strong> or <strong>"How do you measure success in this position?"</strong> show genuine interest and engagement.</p>`,

    'Study Methods': `<h3>Effective Learning Strategies</h3>
<p>Research in cognitive science has identified several study techniques that dramatically improve retention and understanding. One of the most powerful is <strong>spaced repetition</strong> — reviewing material at increasing intervals rather than cramming all at once. This approach leverages how your brain consolidates memories over time.</p>
<p>Another proven method is <strong>active recall</strong>, which means testing yourself rather than simply re-reading notes. When you force your brain to retrieve information, you strengthen the neural pathways that make that knowledge accessible later. Flashcards, practice quizzes, and teaching the material to someone else are all forms of active recall.</p>
<p>The <strong>Pomodoro Technique</strong> helps manage study time effectively: work in focused 25-minute blocks followed by 5-minute breaks. After four blocks, take a longer 15–30 minute break. This rhythm prevents mental fatigue and maintains concentration throughout longer study sessions.</p>`,

    'Digital Communication': `<h3>The New Language of Connection</h3>
<p>Digital communication has transformed how we interact, creating entirely new forms of language. Text messages, emails, and social media posts each have their own conventions. In professional emails, a clear subject line, formal greeting, and concise body are essential. In contrast, text messages favor brevity — abbreviations like <strong>ASAP</strong>, <strong>BTW</strong>, and <strong>TBH</strong> save time and characters.</p>
<p>Emojis and GIFs have become a visual language of their own, adding emotional nuance that plain text lacks. A simple thumbs-up emoji can confirm an arrangement, while a crying-laughing face signals amusement. However, context matters — what is appropriate in a group chat may be unprofessional in a work email.</p>
<p>Understanding digital etiquette is increasingly important. <strong>Response time</strong>, <strong>tone</strong>, and <strong>formality level</strong> should match the medium and the relationship. A quick "k" might seem dismissive, while a lengthy formal email for a simple question can feel excessive. Finding the right balance is a modern communication skill.</p>`,

    'Making Conversation': `<h3>The Art of Small Talk</h3>
<p>Small talk is the social lubricant of English-speaking cultures. It may seem trivial, but these brief exchanges about weather, weekend plans, or current events serve an important purpose: they build rapport and signal friendliness. Mastering small talk opens doors to deeper conversations and stronger relationships.</p>
<p>Good small talk follows a simple pattern: start with a safe topic, ask an open-ended question, listen actively, and share something about yourself. For example: <strong>"Did you do anything interesting this weekend?"</strong> → listen → <strong>"That sounds fun. I went hiking myself."</strong> The key is balance — talking too much about yourself seems self-centered, while only asking questions can feel like an interrogation.</p>
<p>Topics to avoid in small talk include politics, religion, personal finances, and overly personal questions. Safe topics include travel, hobbies, food, entertainment, and — especially in Britain — the weather. When in doubt, let the other person guide the depth of the conversation.</p>`,

    'Film & Music': `<h3>Entertainment as Cultural Insight</h3>
<p>Film and music are not just entertainment — they are windows into the culture and values of English-speaking societies. Hollywood movies export American idioms and cultural references worldwide, while British television has popularized distinctly British humor and social commentary. Understanding these references enriches your comprehension of everyday English.</p>
<p>When discussing films, English speakers use specific vocabulary: <strong>"The plot was predictable"</strong>, <strong>"The acting was superb"</strong>, <strong>"The special effects were breathtaking"</strong>, or <strong>"It was a box-office hit."</strong> For music, you might say <strong>"The lyrics are meaningful"</strong>, <strong>"The melody is catchy"</strong>, or <strong>"It topped the charts for three weeks."</strong></p>
<p>Streaming platforms have made English-language content more accessible than ever. Watching with English subtitles, rather than translations in your native language, is one of the most effective ways to improve both listening comprehension and vocabulary acquisition.</p>`,

    'Climate Change': `<h3>Understanding Our Changing Planet</h3>
<p>Climate change is one of the most pressing issues of our time, and being able to discuss it in English is increasingly important. The core concept is straightforward: human activities — especially burning fossil fuels — release greenhouse gases that trap heat in the atmosphere, causing global temperatures to rise.</p>
<p>Key vocabulary includes <strong>carbon emissions</strong> (CO2 released into the atmosphere), <strong>renewable energy</strong> (power from sources like wind and solar that do not deplete natural resources), and <strong>sustainability</strong> (meeting present needs without compromising future generations). Understanding these terms helps you follow news reports and participate in informed discussions.</p>
<p>Individuals can contribute by reducing their <strong>carbon footprint</strong> — the total greenhouse gases generated by their actions. Simple steps include using public transport, reducing meat consumption, and supporting environmentally responsible companies. Every small action contributes to the larger goal of limiting global warming to 1.5 degrees Celsius above pre-industrial levels.</p>`,

    'Understanding News': `<h3>Media Literacy in English</h3>
<p>Staying informed through English-language news requires more than just vocabulary — it demands critical thinking. News articles follow a specific structure: the <strong>headline</strong> captures attention, the <strong>lead paragraph</strong> summarizes the key facts, and the body provides details, context, and quotes. Understanding this structure helps you identify the most important information quickly.</p>
<p>Be aware of the difference between <strong>news reporting</strong> (objective facts) and <strong>opinion pieces</strong> (subjective analysis). Headlines can also be misleading — they often use sensational language to attract clicks. A headline that says <strong>"Scientists Shocked by Discovery"</strong> might refer to something far less dramatic than the words suggest.</p>
<p>To develop media literacy, compare coverage of the same story across multiple sources. Notice how different outlets emphasize different aspects, use different tone, and select different quotes. This practice sharpens your analytical reading skills and helps you form more balanced opinions about current events.</p>`,

    'Rights & Responsibilities': `<h3>Citizenship and the Law</h3>
<p>Living in an English-speaking country means understanding both your rights and your obligations under the law. <strong>Rights</strong> are freedoms protected by law — such as freedom of speech, the right to a fair trial, and the right to privacy. <strong>Responsibilities</strong> are duties expected of citizens — such as paying taxes, serving on a jury, and obeying traffic laws.</p>
<p>Legal English has its own vocabulary. A <strong>plaintiff</strong> brings a case to court; a <strong>defendant</strong> is the person being sued or charged. A <strong>verdict</strong> is the jury's decision, and a <strong>sentence</strong> is the punishment given by a judge. Understanding these terms helps you follow legal proceedings and news coverage of court cases.</p>
<p>The principle of <strong>rule of law</strong> means that everyone — including government officials — is subject to the same laws. This concept is fundamental to democratic societies and distinguishes them from systems where those in power operate above the law.</p>`,

    'Creative Expression': `<h3>Art as Universal Language</h3>
<p>Art transcends language barriers, yet discussing art in English requires specific vocabulary and expressions. When analyzing a painting, you might describe its <strong>composition</strong> (how elements are arranged), <strong>color palette</strong> (the range of colors used), <strong>texture</strong> (the surface quality), and <strong>mood</strong> (the emotional feeling it evokes).</p>
<p>Art criticism often uses the framework of <strong>describe, analyze, interpret, evaluate</strong>. First, describe what you literally see. Then analyze how the elements work together — how does the artist use contrast, balance, or perspective? Next, interpret the meaning — what message or emotion might the artist be conveying? Finally, evaluate the work — is it successful in achieving its purpose?</p>
<p>Creativity is not limited to visual art. Writing, music, dance, and design all involve creative expression. In professional contexts, <strong>"creative thinking"</strong> and <strong>"thinking outside the box"</strong> are highly valued skills that employers actively seek in candidates.</p>`,

    'Predictions & Plans': `<h3>Imagining Tomorrow</h3>
<p>Discussing the future in English involves several grammatical structures, each with a different nuance. <strong>"Will"</strong> expresses general predictions: <strong>"AI will transform the workplace."</strong> <strong>"Going to"</strong> indicates plans based on present evidence: <strong>"It's going to rain — look at those clouds."</strong> The <strong>future continuous</strong> describes actions in progress at a future time: <strong>"This time next year, I'll be studying abroad."</strong></p>
<p>When making predictions about technology and society, English speakers often use hedging language to express uncertainty: <strong>"It's likely that..."</strong>, <strong>"Experts predict that..."</strong>, or <strong>"There's a good chance that..."</strong> This nuanced approach acknowledges that the future is inherently uncertain.</p>
<p>Innovation vocabulary includes terms like <strong>breakthrough</strong>, <strong>disruption</strong>, <strong>prototype</strong>, and <strong>scalable</strong>. Understanding these concepts helps you engage with discussions about emerging technologies, from artificial intelligence to renewable energy to space exploration.</p>`,

    // Advanced Reading
    'International Relations': `<h3>Navigating Global Diplomacy</h3>
<p>International relations encompass the complex web of interactions between nations, international organizations, and non-state actors. At its core, the field examines how states pursue their interests — security, economic prosperity, and ideological influence — within a system that lacks a central governing authority. This anarchic structure, as political scientists term it, creates both opportunities for cooperation and risks of conflict.</p>
<p>Diplomatic language is deliberately nuanced and carefully calibrated. When a government <strong>"expresses deep concern"</strong>, it signals disapproval without committing to action. <strong>"Condemns"</strong> represents a stronger stance, while <strong>"reserves the right to respond"</strong> serves as an implicit threat. Understanding these gradations is essential for interpreting diplomatic statements accurately.</p>
<p>Key frameworks in international relations include <strong>realism</strong> (states act in their self-interest), <strong>liberalism</strong> (cooperation and institutions reduce conflict), and <strong>constructivism</strong> (ideas and identities shape state behavior). No single theory fully explains global politics, but together they provide analytical tools for understanding complex geopolitical dynamics.</p>`,

    'Ethical Dilemmas': `<h3>When Right and Wrong Collide</h3>
<p>Ethical dilemmas arise when moral principles conflict, making it impossible to satisfy all values simultaneously. The classic <strong>trolley problem</strong> illustrates this: should you divert a runaway trolley to save five people if it means one person will die? Utilitarian reasoning suggests yes — maximize overall welfare — while deontological ethics might say no — you must not use a person merely as a means to an end.</p>
<p>In professional contexts, ethical dilemmas are rarely so dramatic but equally challenging. A journalist may struggle between the public's right to know and an individual's right to privacy. A doctor might balance patient confidentiality against the duty to warn others of danger. These tensions require careful reasoning and often have no universally agreed-upon answer.</p>
<p>The language of ethics includes terms like <strong>moral imperative</strong> (an obligation that must be followed), <strong>consequentialism</strong> (judging actions by their outcomes), and <strong>virtue ethics</strong> (focusing on the character of the moral agent). Developing ethical reasoning skills is essential for navigating the gray areas that define real-world decision-making.</p>`,

    'Research Methods': `<h3>The Architecture of Knowledge</h3>
<p>Scientific research follows systematic methodologies designed to minimize bias and produce reliable, reproducible results. The <strong>hypothesis-driven approach</strong> begins with a testable prediction, which is then evaluated through carefully designed experiments. <strong>Qualitative research</strong>, by contrast, explores meaning and experience through interviews, observations, and textual analysis.</p>
<p>A critical concept in research is <strong>peer review</strong> — the process by which independent experts evaluate a study before it is published. This gatekeeping mechanism, while imperfect, helps ensure that published findings meet standards of rigor and credibility. Understanding peer review helps you assess the reliability of scientific claims you encounter in media and policy discussions.</p>
<p>Research vocabulary includes terms like <strong>methodology</strong> (the overall approach), <strong>sample size</strong> (the number of participants or observations), <strong>statistical significance</strong> (the probability that results are not due to chance), and <strong>replication</strong> (repeating a study to confirm findings). These concepts are fundamental to evaluating the strength of scientific evidence.</p>`,

    'Market Analysis': `<h3>Reading the Economic Landscape</h3>
<p>Market analysis involves evaluating economic conditions to make informed decisions about investment, business strategy, and policy. At the macroeconomic level, key indicators include <strong>GDP</strong> (gross domestic product), <strong>inflation</strong> (the rate at which prices rise), <strong>unemployment</strong>, and <strong>interest rates</strong>. These metrics provide a snapshot of an economy's health and trajectory.</p>
<p>Financial markets operate on the principle of <strong>supply and demand</strong>: when demand for an asset exceeds supply, prices rise; when supply exceeds demand, prices fall. However, markets are also influenced by <strong>sentiment</strong> — the collective psychology of investors. Terms like <strong>"bull market"</strong> (rising prices, optimism) and <strong>"bear market"</strong> (falling prices, pessimism) reflect this emotional dimension.</p>
<p>Critical analysis of market trends requires distinguishing between <strong>correlation</strong> (two variables move together) and <strong>causation</strong> (one variable directly influences another). Just because two trends coincide does not mean one causes the other — a common logical fallacy that can lead to costly investment mistakes.</p>`,

    'Literary Criticism': `<h3>Reading Between the Lines</h3>
<p>Literary criticism is the systematic study, evaluation, and interpretation of literature. Far from being purely subjective, it applies established theoretical frameworks to uncover layers of meaning that a surface reading might miss. <strong>Close reading</strong> — the careful analysis of word choice, imagery, structure, and tone — is the foundation of all literary analysis.</p>
<p>Major critical approaches include <strong>formalism</strong> (focusing on the text itself, independent of context), <strong>Marxist criticism</strong> (examining class and economic power), <strong>feminist criticism</strong> (analyzing gender representation), and <strong>postcolonial criticism</strong> (investigating the legacy of colonialism). Each lens reveals different dimensions of a text, much like shining light from different angles.</p>
<p>When writing literary analysis, avoid merely summarizing the plot. Instead, make an <strong>argument</strong> about what the text means and <strong>support it with evidence</strong> — specific quotations, patterns, and techniques that the author employs. The strongest analyses consider counterarguments and acknowledge ambiguity rather than forcing a single interpretation.</p>`,

    'Cognitive Bias': `<h3>The Hidden Forces in Our Thinking</h3>
<p>Cognitive biases are systematic patterns of deviation from rational judgment that affect everyone, regardless of intelligence or education. The <strong>confirmation bias</strong>, for instance, leads us to seek and favor information that confirms our existing beliefs while dismissing contradictory evidence. This bias shapes everything from political opinions to investment decisions.</p>
<p>The <strong>availability heuristic</strong> causes us to overestimate the likelihood of events that are easy to recall — typically because they are vivid, recent, or emotionally charged. After seeing news coverage of a plane crash, for example, people tend to overestimate the danger of flying, even though statistically it remains one of the safest forms of travel.</p>
<p>Understanding cognitive biases is not just an academic exercise — it has practical implications for decision-making. By recognizing when these mental shortcuts are leading us astray, we can implement <strong>debiasing strategies</strong>: seeking disconfirming evidence, considering base rates, and slowing down our reasoning processes when the stakes are high.</p>`,

    'Historical Interpretation': `<h3>The Past Through Different Eyes</h3>
<p>History is not simply a record of what happened — it is an ongoing conversation about how to interpret and understand the past. The same event can be described in radically different ways depending on the historian's perspective, the sources available, and the questions being asked. This is why <strong>historiography</strong> — the study of how history is written — is as important as the events themselves.</p>
<p>Primary sources (documents, artifacts, and accounts from the time period) form the backbone of historical research, but they are never neutral. Every source reflects its creator's biases, limitations, and agenda. A king's proclamation, a soldier's diary, and a peasant's tax record each tell a different story about the same era. Skilled historians triangulate multiple sources to construct the most reliable account possible.</p>
<p>Language shapes historical understanding in profound ways. Terms like <strong>"revolution"</strong>, <strong>"liberation"</strong>, and <strong>"uprising"</strong> can describe the same event with very different connotations. Being alert to these linguistic choices helps you read historical narratives more critically and recognize when a writer is framing events to support a particular interpretation.</p>`,

    'International Law': `<h3>Order Without a World Government</h3>
<p>International law governs relations between states and international organizations in the absence of a global sovereign authority. Its sources include <strong>treaties</strong> (written agreements between states), <strong>customary international law</strong> (practices followed out of a sense of legal obligation), and <strong>general principles of law</strong> recognized by civilized nations. Unlike domestic law, enforcement relies primarily on state consent and collective pressure rather than a centralized police force.</p>
<p>The <strong>United Nations</strong> serves as the primary forum for developing and maintaining international legal norms. Its charter establishes fundamental principles such as sovereign equality of states, prohibition of the use of force, and self-determination of peoples. However, the veto power held by the five permanent Security Council members means that enforcement of these principles is often inconsistent.</p>
<p>Emerging areas of international law include <strong>cyber law</strong> (governing state behavior in cyberspace), <strong>space law</strong> (regulating activities beyond Earth's atmosphere), and <strong>climate law</strong> (addressing transboundary environmental harm). These fields reflect the evolving nature of international legal challenges in an interconnected world.</p>`,

    'Medical Ethics': `<h3>Life, Death, and Moral Reasoning</h3>
<p>Medical ethics provides a framework for navigating the moral complexities of healthcare. Its four foundational principles — <strong>autonomy</strong> (respecting patient choices), <strong>beneficence</strong> (acting in the patient's best interest), <strong>non-maleficence</strong> (do no harm), and <strong>justice</strong> (fair distribution of resources) — sometimes conflict, requiring careful balancing in clinical practice.</p>
<p>Informed consent is a cornerstone of modern medical ethics. Patients must receive adequate information about their condition, proposed treatments, alternatives, and risks before making decisions. The principle of autonomy means that competent adults have the right to refuse treatment, even when that refusal may lead to harm or death — a position that challenges purely paternalistic models of healthcare.</p>
<p>End-of-life decisions, genetic editing, organ allocation, and research on vulnerable populations are among the most contested areas in medical ethics. These debates require not only medical knowledge but also philosophical reasoning about the nature of personhood, the value of life, and the limits of human intervention in natural processes.</p>`,

    'Language Evolution': `<h3>The Living, Breathing Nature of Language</h3>
<p>Language is not a static system — it evolves continuously in response to social, technological, and cultural change. Old English (circa 500–1100 CE) would be largely incomprehensible to modern English speakers, and even Shakespeare's Early Modern English requires annotation. The processes driving this change — <strong>phonological shift</strong>, <strong>grammaticalization</strong>, <strong>lexical borrowing</strong>, and <strong>semantic drift</strong> — are well documented by historical linguists.</p>
<p>The internet has accelerated language change at an unprecedented rate. Words like <strong>"selfie"</strong>, <strong>"hashtag"</strong>, and <strong>"doomscroll"</strong> entered the lexicon within the past two decades, while <strong>"literally"</strong> has undergone semantic widening to mean both "in a literal sense" and "figuratively for emphasis" — a shift that prescriptivists resist but descriptivists document as natural evolution.</p>
<p>Understanding language change challenges the notion that there is one "correct" English. <strong>Prescriptive grammar</strong> attempts to enforce fixed rules, while <strong>descriptive grammar</strong> observes how language is actually used. Both approaches have value, but recognizing that all living languages change helps us approach linguistic variation with curiosity rather than judgment.</p>`,

    'Dissertation Writing': `<h3>From Proposal to Defense</h3>
<p>A dissertation or thesis represents the culmination of years of academic study and the most sustained piece of scholarly writing most scholars will ever undertake. Unlike a typical essay, a dissertation demands original contribution to knowledge, requiring the writer to move beyond synthesis of existing literature toward independent analysis and argumentation. The process typically begins with a <strong>research proposal</strong> — a document that articulates the research question, justifies its significance, and outlines the methodology to be employed.</p>
<p>The structure of a dissertation follows a rigorous convention, though variations exist across disciplines. In the humanities, the <strong>monograph model</strong> prevails: an extended argument organized into thematically coherent chapters, each building upon the last. In the sciences and social sciences, the <strong>article-based model</strong> is common, in which the dissertation comprises a series of publishable papers unified by a general introduction and concluding discussion. Regardless of format, every dissertation must demonstrate <strong>methodological transparency</strong>, <strong>critical engagement with existing scholarship</strong>, and <strong>coherent argumentation</strong> supported by robust evidence.</p>
<p>Perhaps the most underestimated challenge of dissertation writing is the psychological dimension. The extended timeline — often spanning several years — demands exceptional self-regulation, resilience in the face of setbacks, and the capacity to sustain intellectual momentum over long periods without external deadlines. Successful candidates typically develop systematic writing habits, cultivate supportive peer networks, and learn to view revision not as failure but as an integral part of the scholarly process.</p>
<p>The language of dissertation writing is characteristically formal, precise, and hedged. Writers must master the art of <strong>cautious assertion</strong>: rather than claiming outright that something is true, they qualify their statements with phrases such as <strong>"the evidence suggests"</strong>, <strong>"it is reasonable to conclude"</strong>, or <strong>"these findings lend support to the hypothesis"</strong>. This epistemic modesty reflects the provisional nature of scholarly knowledge and the writer's awareness of the limitations inherent in any single study.</p>`,

    'Research Methodology': `<h3>Foundations of Systematic Inquiry</h3>
<p>Research methodology constitutes the philosophical and practical framework that guides the entire research process, from formulating questions to interpreting findings. It is not merely a set of tools or techniques — it is the <strong>epistemological stance</strong> that determines what counts as knowledge, how that knowledge can be obtained, and what criteria establish its validity. Understanding methodology is essential because the approach a researcher selects fundamentally shapes the nature of the conclusions that can be drawn.</p>
<p>The broadest methodological distinction is between <strong>quantitative</strong> and <strong>qualitative</strong> approaches. Quantitative research seeks to measure phenomena numerically, test hypotheses through statistical analysis, and generalize findings to broader populations. Its strengths include precision, replicability, and the ability to identify patterns across large datasets. Qualitative research, by contrast, explores the meaning and experience of social phenomena through interviews, ethnographic observation, and textual interpretation. It prioritizes depth over breadth, seeking to understand the complexity of particular contexts rather than to generalize across them.</p>
<p>Increasingly, researchers adopt <strong>mixed-methods designs</strong> that integrate quantitative and qualitative approaches within a single study. A sequential explanatory design, for instance, might first administer a large-scale survey to identify statistical trends, then conduct in-depth interviews to explore the mechanisms underlying those trends. This triangulation of methods can yield insights that neither approach could achieve alone, though it demands expertise in multiple research paradigms and careful attention to how different types of data are integrated and reconciled.</p>
<p>Methodological rigor also requires transparency about <strong>limitations</strong> and <strong>ethical considerations</strong>. Every research design involves trade-offs between internal validity (confidence in causal claims), external validity (generalizability), and practical constraints such as time, funding, and access to participants. Ethical research practice demands informed consent, confidentiality, and the minimization of harm — principles that are not merely procedural requirements but moral imperatives that safeguard the integrity of the research enterprise.</p>`,
    'Connecting Sentences with And, But, So, Because': `<p><strong>Coordinating conjunctions</strong> connect two ideas of equal importance. The most common are FANBOYS: <strong>For, And, Nor, But, Or, Yet, So</strong>.</p>
<p>At A1-A2 level, focus on these four:</p>
<p><strong>AND</strong> — adds information (similar ideas)
<ul><li>"I like coffee <strong>and</strong> I like tea."</li>
<li>"She speaks English <strong>and</strong> Spanish."</li>
<li>"He works in London <strong>and</strong> he lives there too."</li></p>
<p><strong>BUT</strong> — shows contrast (opposite ideas)
<li>"I like him, <strong>but</strong> I don't trust him."</li>
<li>"It's expensive, <strong>but</strong> it's good quality."</li>
<li>"She's very talented, <strong>but</strong> she's sometimes late."</li></p>
<p><strong>SO</strong> — shows result (consequence)
<li>"It was raining, <strong>so</strong> I took an umbrella."</li>
<li>"I was tired, <strong>so</strong> I went to bed early."</li>
<li>"The shop was closed, <strong>so</strong> we went home."</li></p>
<p><strong>BECAUSE</strong> — shows reason (cause)
<li>"I stayed home <strong>because</strong> I was ill."</li>
<li>"She's happy <strong>because</strong> she passed her exam."</li>
<li>"We left early <strong>because</strong> the traffic was bad."</li></p>
<p><strong>Important word order:</strong>
<li>With <strong>and/but/or</strong>: comma before the conjunction when connecting two complete sentences</li>
  - "I like pizza, <strong>and</strong> my brother likes pasta."
<li>With <strong>so/because</strong>: the reason can come first or second</li>
  - "I was tired, <strong>so</strong> I slept." / "<strong>Because</strong> I was tired, I slept." (notice the comma)</p>
<p><strong>Common mistake:</strong> "Because" and "so" together — choose ONE
<li>❌ "Because it was raining, so I stayed home."</li>
<li>✅ "It was raining, so I stayed home."</li>
<li>✅ "Because it was raining, I stayed home."</li></ul></p>`,
    'Talking About Past Experiences': `<p>The <strong>past simple</strong> is for completed actions in the past. You already know it — this lesson focuses on using it to tell stories and describe experiences.</p>
<p><strong>Time expressions for the past:</strong>
<ul><li><strong>ago</strong>: "I went to Paris <strong>three years ago</strong>."</li>
<li><strong>last</strong>: "I saw him <strong>last week/month/year/Saturday</strong>."</li>
<li><strong>yesterday</strong>: "I finished it <strong>yesterday morning/afternoon/evening</strong>."</li>
<li><strong>in + past year</strong>: "We met <strong>in 2019</strong>."</li>
<li><strong>when</strong>: "When I was a child, I lived in Spain."</li>
<li><strong>previous</strong>: "My <strong>previous</strong> job was in sales."</li></p>
<p><strong>Sequencing events (telling a story in order):</strong>
<li><strong>First</strong>, I woke up. <strong>Then</strong>, I had breakfast. <strong>After that</strong>, I went to work. <strong>Later</strong>, I had a meeting. <strong>Finally</strong>, I went home.</li>
<li>Other sequencing words: <strong>Next</strong>, <strong>In the end</strong>, <strong>Eventually</strong>, <strong>Suddenly</strong></li></p>
<p><strong>Talking about childhood:</strong>
<li>"When I was young, I used to play football every day."</li>
<li>"As a child, I lived in a small village."</li>
<li>"I grew up in Brazil."</li>
<li>"My favourite toy was a red car."</li></p>
<p><strong>Past simple irregular verbs to practise:</strong>
<li>go → went, eat → ate, see → saw, have → had, do → did, make → made, take → took, get → got, find → found, know → knew, think → thought, come → came, say → said, tell → told</li></ul></p>`,
    'Making Comparisons: Better, Worse, More, Less': `<p><strong>Comparatives</strong> (comparing two things):</p>
<p><em>Short adjectives (+1-2 syllables):</em>
<ul><li>Add <strong>-er</strong>: tall → <strong>taller</strong>, fast → <strong>faster</strong>, cheap → <strong>cheaper</strong></li>
<li>Double final consonant: big → <strong>bigger</strong>, hot → <strong>hotter</strong>, thin → <strong>thinner</strong></li>
<li>y → i + -er: happy → <strong>happier</strong>, easy → <strong>easier</strong></li></p>
<p><em>Long adjectives (2+ syllables):</em>
<li>Use <strong>more</strong>: expensive → <strong>more expensive</strong>, beautiful → <strong>more beautiful</strong></li>
<li>Use <strong>less</strong>: interesting → <strong>less interesting</strong>, comfortable → <strong>less comfortable</strong></li></p>
<p><em>Irregular comparatives:</em>
<li>good → <strong>better</strong>, bad → <strong>worse</strong>, far → <strong>farther/further</strong></li>
<li>much/many → <strong>more</strong>, little → <strong>less</strong></li></p>
<p><strong>Using comparatives in sentences:</strong>
<li>"London is <strong>bigger than</strong> Paris." (short adj + -er + than)</li>
<li>"This book is <strong>more interesting than</strong> that one." (more + long adj + than)</li>
<li>"My phone is <strong>less expensive than</strong> yours." (less + long adj + than)</li>
<li>"She speaks English <strong>better than</strong> me." (irregular)</li></p>
<p><strong>Superlatives</strong> (comparing 3+ things — "the most"):
<li>Short: tall → <strong>the tallest</strong>, fast → <strong>the fastest</strong></li>
<li>Long: expensive → <strong>the most expensive</strong>, beautiful → <strong>the most beautiful</strong></li>
<li>Irregular: good → <strong>the best</strong>, bad → <strong>the worst</strong></li></p>
<p><strong>Intensifiers (making comparisons stronger):</strong>
<li>"It's <strong>much</strong> better." / "It's <strong>a lot</strong> cheaper." (big difference)</li>
<li>"It's <strong>slightly</strong> more expensive." / "It's <strong>a bit</strong> colder." (small difference)</li>
<li>"It's <strong>even</strong> worse than I thought."</li></ul></p>`,
    'Expressing Future Plans: Going to vs. Will': `<p><strong>GOING TO</strong> — plans and intentions (already decided), predictions with evidence
<ul><li>"I'm <strong>going to visit</strong> my grandmother next weekend." (plan already made)</li>
<li>"She's <strong>going to study</strong> medicine at university." (intention)</li>
<li>"Look at those black clouds! It's <strong>going to rain</strong>." (prediction based on visible evidence)</li></p>
<p><strong>WILL</strong> — spontaneous decisions (made at the moment of speaking), predictions (opinions), promises, offers
<li>"I'll have the salad, please." (deciding now, at the restaurant)</li>
<li>"I think it <strong>will</strong> be sunny tomorrow." (opinion/prediction)</li>
<li>"I <strong>won't forget</strong> to call you." (promise)</li>
<li>"I'll help you with your bags." (offer)</li></p>
<p><strong>The key difference:</strong>
<li><strong>Going to</strong> = decision made BEFORE speaking</li>
<li><strong>Will</strong> = decision made AT THE MOMENT of speaking</li></p>
<p><strong>Examples showing the contrast:</strong>
<li>"I'm going to have a quiet evening." (I decided this morning)</li>
<li>"Actually, I'll come to the party after all!" (I just changed my mind)</li></p>
<p><strong>Other future forms at A2:</strong>
<li><strong>Present continuous for future:</strong> "I'm meeting John at 6." (arranged, in diary)</li>
<li><strong>Will vs. Going to in conditionals:</strong></li></ul>
  - "If it rains, I <strong>will</strong> stay home." (conditional = always will)
  - "I'm <strong>going to</strong> stay home if it rains." (plan, not conditional structure)</p>`,
    'Giving Opinions and Agreeing/Disagreeing': `<p><strong>Giving opinions:</strong>
<ul><li>"I think (that)..." — most common, neutral</li>
<li>"I believe (that)..." — slightly stronger, more personal</li>
<li>"In my opinion,..." — clear, good for discussions</li>
<li>"In my view,..." — similar to "in my opinion"</li>
<li>"It seems to me that..." — softer, more tentative</li>
<li>"I feel that..." — emotional/personal perspective</li>
<li>"If you ask me,..." — informal, direct</li>
<li>"The way I see it,..." — informal, explaining your perspective</li></p>
<p><strong>Asking for opinions:</strong>
<li>"What do you think?"</li>
<li>"What's your opinion?"</li>
<li>"How do you feel about this?"</li>
<li>"Do you agree?"</li>
<li>"Would you agree that...?"</li></p>
<p><strong>Agreeing (strong to weak):</strong>
<li>"I completely/totally agree."</li>
<li>"I couldn't agree more." (= I agree 100%)</li>
<li>"Exactly!" / "Absolutely!"</li>
<li>"That's a good point."</li>
<li>"I think you're right."</li>
<li>"I agree up to a point." (= I partly agree)</li></p>
<p><strong>Disagreeing (polite to direct):</strong>
<li>"I see your point, but..." (most polite, acknowledges first)</li>
<li>"I understand what you're saying, but..."</li>
<li>"I'm not sure I agree."</li>
<li>"I think it's a bit more complicated than that."</li>
<li>"With respect, I think..." (formal)</li>
<li>"I'm afraid I have to disagree." (more direct)</li></p>
<p><strong>Partial agreement:</strong>
<li>"I agree with you about X, but I'm not so sure about Y."</li>
<li>"That's true in some cases, but..."</li>
<li>"You have a point, but on the other hand..."</li></ul></p>`,
    'Talking About Routines and Habits': `<p>You already know the present simple. This lesson adds <strong>variety and detail</strong> to how you talk about routines.</p>
<p><strong>Frequency adverbs — position:</strong>
<ul><li>Before the main verb: "I <strong>always</strong> eat breakfast."</li>
<li>After "be": "She <strong>is usually</strong> tired on Mondays."</li>
<li>Between auxiliary and main verb: "I <strong>have never been</strong> to Japan."</li></p>
<p><strong>Order of frequency (most → least):</strong>
always → usually → often / frequently → sometimes → occasionally → rarely / seldom → never</p>
<p><strong>Other frequency expressions:</strong>
<li>"I go to the gym <strong>three times a week</strong>."</li>
<li>"I check my emails <strong>every morning</strong>."</li>
<li>"I <strong>hardly ever</strong> eat fast food."</li>
<li>"Once in a while, I treat myself to a nice dinner."</li>
<li>"From time to time, I work from home."</li></p>
<p><strong>Talking about routines — varied structures:</strong>
<li>"I tend to..." (I usually...)</li>
<li>"I'm in the habit of..." (slightly formal)</li>
<li>"I make a point of..." (I make an effort to...)</li>
<li>"I can't function without my morning coffee." (informal, emphatic)</li>
<li>"No matter what, I always..." (emphatic)</li></p>
<p><strong>Weekly routine example:</strong>
"On weekdays, I usually wake up at 7 and get ready for work. I tend to skip breakfast — just coffee! I commute by train, which takes about 30 minutes. I work from 9 to 5, with a lunch break at midday. In the evening, I either go to the gym or meet friends. I rarely stay up past 11 because I need my sleep!"</p>
<p><strong>Questions about habits:</strong>
<li>"Are you a morning person or a night owl?"</li>
<li>"What's the first thing you do when you wake up?"</li>
<li>"How often do you exercise?"</li>
<li>"Do you have any unusual habits?"</li></ul></p>`,
    'Describing Health and Feelings': `<p><strong>Body parts:</strong>
head, face, eyes, ears, nose, mouth, throat, neck, chest, stomach, back, arm, elbow, wrist, hand, finger, leg, knee, ankle, foot, toe</p>
<p><strong>Common ailments and symptoms:</strong>
<ul><li>"I have a headache." / "My head hurts."</li>
<li>"I have a sore throat."</li>
<li>"I have a cold / the flu."</li>
<li>"I have a temperature / fever."</li>
<li>"I feel sick / nauseous." (want to vomit)</li>
<li>"I have a cough." / "I have a runny nose."</li>
<li>"I have stomach ache." / "I have back pain."</li>
<li>"I feel dizzy." (like the room is spinning)</li>
<li>"I feel weak / tired."</li>
<li>"I'm allergic to..." (nuts, pollen, cats, etc.)</li></p>
<p><strong>At the doctor's:</strong>
<li>"I've been feeling ill for three days."</li>
<li>"It hurts when I..."</li>
<li>"I've got a pain in my..."</li>
<li>"I keep getting headaches."</li>
<li>"I feel worse today."</li>
<li>"Is it serious?"</li>
<li>"How often should I take this?"</li></p>
<p><strong>Emotional states:</strong>
<li>Positive: happy, excited, relaxed, calm, grateful, proud, confident</li>
<li>Negative: sad, worried, stressed, nervous, frustrated, bored, lonely, angry, disappointed</li>
<li>"I feel..." (current emotion)</li>
<li>"I'm feeling a bit..." (temporary, softer)</li>
<li>"I've been feeling..." (over a period of time)</li></p>
<p><strong>Describing pain (1-10 scale):</strong>
<li>"It's just a mild pain." (1-3)</li>
<li>"It's quite painful." (4-6)</li>
<li>"It really hurts." (7-8)</li>
<li>"It's unbearable." (9-10)</li></ul></p>`,
    'Narrating a Simple Story': `<p><strong>Story structure (simple but effective):</strong></p>
<p><strong>Beginning</strong> — set the scene (who, where, when)
<ul><li>"Last summer, I went on holiday to Spain with my friends."</li>
<li>"When I was a student, something funny happened to me."</li></p>
<p><strong>Middle</strong> — the action (what happened)
<li>Use past simple for the main events</li>
<li>Use <strong>was/were + verb-ing</strong> (past continuous) for background actions:</li>
  - "I <strong>was walking</strong> home when I <strong>saw</strong> a cat in a tree."
  - "We <strong>were having</strong> dinner when the phone <strong>rang</strong>."
  - "While I <strong>was waiting</strong> for the bus, it <strong>started</strong> to rain."</p>
<p><strong>End</strong> — the result or lesson
<li>"In the end, everything worked out fine."</li>
<li>"It was the funniest thing that ever happened to me."</li>
<li>"I learned to always check the weather forecast!"</li></p>
<p><strong>Storytelling connectors:</strong>
<li>Time: <strong>One day</strong>, <strong>Last year</strong>, <strong>A few weeks ago</strong></li>
<li>Sequence: <strong>First</strong>, <strong>Then</strong>, <strong>Next</strong>, <strong>After that</strong>, <strong>A few minutes later</strong></li>
<li>Surprise: <strong>Suddenly</strong>, <strong>All of a sudden</strong>, <strong>Out of nowhere</strong></li>
<li>Ending: <strong>In the end</strong>, <strong>Finally</strong>, <strong>Eventually</strong>, <strong>Luckily</strong></li>
<li>Reaction: <strong>To my surprise</strong>, <strong>I couldn't believe it</strong>, <strong>You can imagine how I felt</strong></li></p>
<p><strong>Past continuous + past simple together:</strong>
<li>"I <strong>was sleeping</strong> when the alarm <strong>went off</strong>." (background action + main event)</li>
<li>"While she <strong>was cooking</strong>, she <strong>burned</strong> the chicken." (two things happening, one interrupts the other)</li></ul></p>`,
    'Talking About Technology and Daily Devices': `<p><strong>Essential technology vocabulary:</strong>
<ul><li><strong>Devices:</strong> smartphone, laptop, tablet, desktop computer, smartwatch, wireless headphones, charger, power bank, USB cable, webcam, microphone, speaker, printer, scanner, router, WiFi</li>
<li><strong>Verbs:</strong> download, upload, install, update, charge, scroll, swipe, click, tap, type, search, stream, share, save, delete, back up, restart, log in / log out, sign up, set up, turn on / off</li>
<li><strong>Apps and platforms:</strong> social media, messaging app, video call, email, cloud storage, streaming service, navigation app, online banking, password</li></p>
<p><strong>Talking about technology habits:</strong>
<li>"I check my phone as soon as I wake up." (informal)</li>
<li>"I probably spend too much time on social media."</li>
<li>"I use my laptop for work and my tablet for watching films."</li>
<li>"I can't live without [app name] — I use it every day."</li>
<li>"I try to limit my screen time, but it's difficult."</li></p>
<p><strong>Describing problems:</strong>
<li>"My phone keeps freezing." (stops working temporarily)</li>
<li>"The battery dies really quickly."</li>
<li>"I forgot my password." / "I got locked out of my account."</li>
<li>"My internet connection is really slow."</li>
<li>"The app keeps crashing." (closes unexpectedly)</li>
<li>"I think I have a virus." / "I've been hacked."</li></p>
<p><strong>Technology opinions:</strong>
<li>"Technology makes life easier, but..."</li>
<li>"I think we're too dependent on our phones."</li>
<li>"AI is going to change everything."</li>
<li>"I prefer face-to-face communication to texting."</li>
<li>"Online shopping is so convenient."</li></ul></p>`,
    'Cultural Awareness and Social Norms': `<p><strong>Greetings — formal to informal:</strong>
<ul><li>Very formal (first meeting, business): "How do you do?" (response: "How do you do?")</li>
<li>Formal: "Nice to meet you." / "Pleased to meet you."</li>
<li>Standard: "Hello, I'm [name]." / "Hi, I'm [name]."</li>
<li>Casual: "Hi there!" / "Hey! How's it going?" / "What's up?" (very informal US)</li>
<li>British: "You alright?" / "Alright?" (means "Hello," not "Are you okay?")</li></p>
<p><strong>First names vs. titles:</strong>
<li>In UK/US, people usually use first names quickly — even in business</li>
<li>"Please, call me Tom" = use my first name</li>
<li>Titles: Mr (man), Mrs (married woman), Ms (woman — marital status unknown), Miss (unmarried woman — less common now), Dr (doctor/professor)</li>
<li>Always use a title + surname unless invited to use first names</li></p>
<p><strong>Small talk — safe topics:</strong>
<li>Weather (especially in the UK!)</li>
<li>The journey/travel</li>
<li>The event/venue</li>
<li>Hobbies and interests</li>
<li>Work (but not salary!)</li>
<li>Holidays and travel plans</li></p>
<p><strong>Topics to avoid (especially first meetings):</strong>
<li>Age and weight</li>
<li>Money and salary</li>
<li>Politics and religion</li>
<li>Personal relationships</li>
<li>Controversial topics</li></p>
<p><strong>Tipping culture:</strong>
<li><strong>UK:</strong> 10-12.5% in restaurants if service isn't included. Not expected in pubs/cafes.</li>
<li><strong>US:</strong> 15-20% in restaurants ESSENTIAL (waiters earn very low wages). $1-2 per drink at bars.</li>
<li><strong>Australia/NZ:</strong> Tipping not expected but appreciated for good service.</li></p>
<p><strong>Personal space:</strong>
<li>UK/US: about an arm's length of distance when talking</li>
<li>Standing too close can make people uncomfortable</li>
<li>Touching: handshake is standard. Hugs only with friends. Kissing on the cheek is less common in UK/US than in Southern Europe.</li></p>
<p><strong>Queuing (standing in line):</strong>
<li>Very important in the UK! Jumping the queue is extremely rude.</li>
<li>"Sorry, is this the queue?" / "Are you in the queue?"</li>
<li>"Excuse me, I was here first." (if someone tries to push in)</li></p>
<p><strong>Being polite — magic words:</strong>
<li><strong>Please</strong> — when asking for something: "A coffee, please."</li>
<li><strong>Thank you / Thanks</strong> — constantly used in English!</li>
<li><strong>Sorry</strong> — even when it's not your fault (British people say sorry a lot!)</li>
<li><strong>Excuse me</strong> — to get past someone, to interrupt, or to get attention</li></ul></p>`,
    'Relative Clauses — Defining and Non-Defining': `<p><strong>What are relative clauses?</strong>
Relative clauses give extra information about a noun. They turn two short sentences into one sophisticated sentence.</p>
<ul><li>"The man <strong>lives next door</strong>. He is a doctor."</li>
<li>→ "The man <strong>who lives next door</strong> is a doctor."</li>
<p><strong>Relative pronouns:</strong>
| Pronoun | Used for | Example |
|---------|----------|---------|
| <strong>who</strong> | people | The woman <strong>who</strong> called you is my boss. |
| <strong>which</strong> | things, animals | The car <strong>which</strong> he bought is red. |
| <strong>that</strong> | people OR things | The book <strong>that</strong> I read was excellent. |
| <strong>whose</strong> | possession | The man <strong>whose</strong> car was stolen is here. |
| <strong>where</strong> | places | The city <strong>where</strong> I was born is beautiful. |
| <strong>whom</strong> | people (object, formal) | The person <strong>whom</strong> you met is my uncle. |</p>
<p><strong>Defining relative clauses (essential information):</strong>
<li>No commas</li>
<li>The information is NECESSARY to identify the noun</li>
<li>"The students <strong>who study hard</strong> pass the exam." (only the hard-working students — not all students)</li>
<li>"I need a computer <strong>that works quickly</strong>." (not just any computer)</li>
<li><strong>You can use "that" instead of "who" or "which" in defining clauses.</strong></li></p>
<p><strong>Non-defining relative clauses (extra information):</strong>
<li>ALWAYS use commas (or pause in speech)</li>
<li>The information is NOT essential — it's extra detail</li>
<li>"My brother, <strong>who lives in Paris</strong>, is visiting me." (I only have one brother — "who lives in Paris" is just extra info)</li>
<li>"The Eiffel Tower, <strong>which was built in 1889</strong>, attracts millions of visitors."</li>
<li><strong>NEVER use "that" in non-defining clauses — only who or which.</strong></li></p>
<p><strong>Omitting the relative pronoun:</strong>
When the relative pronoun is the OBJECT of the relative clause, you can omit it (in defining clauses only):
<li>"The book <strong>(that)</strong> I bought yesterday is great." (that = object of bought)</li>
<li>"The woman <strong>(who/whom)</strong> I saw is a doctor."</li>
But NOT when it's the subject:
<li>"The man <strong>who</strong> called you is here." (who = subject of called — cannot omit)</li></ul></p>`,
    'Gerunds and Infinitives — Choosing Correctly': `<p><strong>Some verbs are followed by the GERUND (verb-ing):</strong></p>
<p>| Category | Verbs |
|----------|-------|
| Enjoyment/hate | enjoy, mind, suggest, recommend, avoid, can't stand, dislike, fancy |
| Starting/stopping | start, stop, finish, quit, give up, keep, continue, postpone, delay |
| Success/failure | succeed in, have difficulty (in), have trouble (in), be used to, look forward to |</p>
<p><em>Examples:</em>
<ul><li>"I <strong>enjoy reading</strong> in the evening."</li>
<li>"She <strong>avoided answering</strong> my question."</li>
<li>"I <strong>look forward to meeting</strong> you." (note: "to" is a preposition here, not part of the infinitive)</li>
<li>"He <strong>gave up smoking</strong> last year."</li>
<li>"We <strong>succeeded in finishing</strong> on time."</li></p>
<p><strong>Some verbs are followed by the INFINITIVE (to + verb):</strong></p>
<p>| Category | Verbs |
|----------|-------|
| Wants/desires | want, would like, hope, expect, wish, intend, plan, aim |
| Promises/agreements | promise, agree, refuse, offer, decide, threaten, volunteer |
| Needs/abilities | need, afford, manage, fail, seem, appear, tend, pretend |</p>
<p><em>Examples:</em>
<li>"I <strong>want to learn</strong> Japanese."</li>
<li>"She <strong>promised to call</strong> me."</li>
<li>"He <strong>managed to finish</strong> early."</li>
<li>"They <strong>decided to move</strong> to London."</li></p>
<p><strong>Some verbs can use BOTH — but the meaning changes:</strong></p>
<p>| Verb | Gerund meaning | Infinitive meaning |
|------|---------------|-------------------|
| <strong>remember</strong> | I did it, and now I recall it: "I <strong>remember meeting</strong> him." | Remember to do it (don't forget): "<strong>Remember to lock</strong> the door." |
| <strong>forget</strong> | I did it but can't recall: "I'll <strong>never forget visiting</strong> Rome." | I didn't do it: "I <strong>forgot to buy</strong> milk." |
| <strong>stop</strong> | I quit the activity: "I <strong>stopped smoking</strong>." | I paused to do something else: "I <strong>stopped to buy</strong> coffee." |
| <strong>try</strong> | I experimented: "<strong>Try adding</strong> more salt." | I attempted: "I <strong>tried to open</strong> the window." |
| <strong>regret</strong> | I'm sorry about the past: "I <strong>regret telling</strong> him." | I'm sorry about what I must say: "I <strong>regret to inform</strong> you that..." |
| <strong>mean</strong> | This involves: "Learning Japanese <strong>means studying</strong> every day." | I intend to: "I <strong>meant to call</strong> you." |</p>
<p><strong>After prepositions — always gerund:</strong>
<li>"I'm interested <strong>in learning</strong> French."</li>
<li>"She's good <strong>at singing</strong>."</li>
<li>"Thank you <strong>for helping</strong> me."</li>
<li>"He apologised <strong>for being</strong> late."</li>
<li>"I'm thinking <strong>about changing</strong> jobs."</li></ul></p>`,
    'Adjective and Adverb Position and Order': `<p><strong>Adjective order — the royal rule (OSASCOMP):</strong></p>
<p>When using multiple adjectives before a noun, they follow this order:</p>
<p>| Order | Type | Examples |
|-------|------|----------|
| 1 | <strong>O</strong>pinion | beautiful, lovely, terrible, nice |
| 2 | <strong>S</strong>ize | big, small, tiny, huge |
| 3 | <strong>A</strong>ge | old, new, young, ancient |
| 4 | <strong>S</strong>hape | round, square, flat |
| 5 | <strong>C</strong>olour | red, blue, dark |
| 6 | <strong>O</strong>rigin | French, Japanese, American |
| 7 | <strong>M</strong>aterial | wooden, metal, silk, plastic |
| 8 | <strong>P</strong>urpose | sleeping (bag), running (shoes), shopping (trolley) |</p>
<p><em>Examples:</em>
<ul><li>"a <strong>beautiful old Italian</strong> car" (opinion + age + origin)</li>
<li>"a <strong>lovely big round wooden</strong> table" (opinion + size + shape + material)</li>
<li>"my <strong>new black running</strong> shoes" (age + colour + purpose)</li>
<li>"a <strong>terrible small square plastic</strong> container" (opinion + size + shape + material)</li></p>
<p><strong>Common mistakes:</strong>
<li>❌ "a red big car" → ✅ "a big red car" (size before colour)</li>
<li>❌ "an Italian old beautiful car" → ✅ "a beautiful old Italian car"</li>
<li>❌ "wooden a table" → ✅ "a wooden table" (article comes first)</li></p>
<p><strong>Adverbs of manner — position:</strong>
Adverbs describing HOW something is done usually go:
<li>After the verb: "She speaks <strong>fluently</strong>."</li>
<li>After the object: "He plays the guitar <strong>beautifully</strong>."</li>
<li>NOT between verb and object: ❌ "He plays beautifully the guitar."</li></p>
<p><strong>Exceptions (adverbs that can go before the main verb):</strong>
<li>Adverbs of frequency: "She <strong>always</strong> arrives on time."</li>
<li>Adverbs of certainty: "I <strong>definitely</strong> agree." / "I <strong>probably</strong> won't come."</li>
<li>Adverbs of degree: "I <strong>really</strong> enjoyed it." / "I <strong>quite</strong> like it."</li></p>
<p><strong>Adverbs with two verbs (auxiliary + main verb):</strong>
<li>"She <strong>has always lived</strong> here." (between auxiliary and main verb)</li>
<li>"They <strong>are probably going</strong> to win." (between auxiliary and main verb)</li>
<li>"I <strong>don't usually eat</strong> breakfast." (after negative auxiliary)</li></ul></p>`,
    'Ellipsis and Substitution for Fluent Speech': `<p><strong>Ellipsis</strong> = leaving out words that are understood from context</p>
<p><em>In responses:</em>
<ul><li>A: "Are you coming?" B: "Yes, I <strong>am</strong>." (not "Yes, I am coming.")</li>
<li>A: "Has she finished?" B: "She <strong>has</strong>." / "I think <strong>so</strong>."</li>
<li>A: "Do you like it?" B: "I <strong>do</strong>, actually."</li></p>
<p><em>After auxiliaries:</em>
<li>"I don't like coffee, but my wife <strong>does</strong>." (= likes coffee)</li>
<li>"He can swim, but I <strong>can't</strong>." (= can't swim)</li>
<li>"She's Italian, but her husband <strong>isn't</strong>." (= isn't Italian)</li></p>
<p><em>With infinitives (to):</em>
<li>"I don't want to go, but I have <strong>to</strong>." (= to go)</li>
<li>"You should study more." "I know. I'm trying <strong>to</strong>."</li></p>
<p><strong>Substitution words:</strong></p>
<p><em>"One" — substitutes for a countable noun:</em>
<li>"I need a new phone. This <strong>one</strong> is too slow."</li>
<li>"Your jacket is nice. Where did you buy <strong>it</strong>?" (we can't use "one" with the SAME item)</li>
<li>"Your jacket is nice. I want to buy <strong>one</strong> too." (one = a similar jacket)</li>
<li>"The red shoes are nice, but I prefer the blue <strong>ones</strong>." (ones = shoes — plural)</li></p>
<p><em>"So" — substitutes for "so + adjective":</em>
<li>"I think she's angry." "If <strong>so</strong>, we should apologise." (= if she is angry)</li>
<li>"Is it expensive?" "I hope not <strong>so</strong>."</li></p>
<p><em>"Do/does/did so" — substitutes for a whole verb phrase:</em>
<li>"He said he would call, and he <strong>did so</strong> immediately." (formal)</li>
<li>More natural: "He said he would call, and he <strong>did</strong>."</li></p>
<p><em>"Such" — for emphasis with nouns:</em>
<li>"It was <strong>such</strong> a good film." (not "so good a film")</li>
<li>"They're <strong>such</strong> nice people."</li>
<li>"I've never seen <strong>such</strong> beautiful weather."</li></ul></p>`,
    'Complex Sentence Connectors — Despite, Although, However': `<p><strong>Contrasting ideas — six ways to say "but":</strong></p>
<p>| Structure | Grammar | Example |
|-----------|---------|---------|
| <strong>but</strong> | simple conjunction | It was raining, <strong>but</strong> we went out. |
| <strong>although/though/even though</strong> | conjunction + full clause | <strong>Although</strong> it was raining, we went out. |
| <strong>despite/in spite of</strong> | preposition + noun/verb-ing | <strong>Despite</strong> the rain, we went out. |
| <strong>however</strong> | adverb — separate sentence | It was raining. <strong>However</strong>, we went out. |
| <strong>nevertheless/nonetheless</strong> | adverb — formal | The task was hard. <strong>Nevertheless</strong>, we finished. |
| <strong>while/whereas</strong> | contrast two facts | <strong>While</strong> I like tea, my sister prefers coffee. |</p>
<p><strong>Key differences:</strong></p>
<p><em>Although + subject + verb (full clause):</em>
<ul><li>"<strong>Although</strong> she was tired, she finished the work."</li>
<li>"She finished the work <strong>although</strong> she was tired."</li>
<li>"<strong>Even though</strong> it was expensive, we bought it." (stronger contrast)</li>
<li>❌ "Although being tired..." → Despite being tired..."</li></p>
<p><em>Despite/In spite of + noun or verb-ing (no subject+verb):</em>
<li>"<strong>Despite</strong> the rain, we went out." (noun)</li>
<li>"<strong>Despite</strong> being tired, she finished." (verb-ing)</li>
<li>"<strong>In spite of</strong> the bad weather, we had a good time."</li>
<li>❌ "Despite it was raining..." → "Although it was raining..." or "Despite the rain..."</li></p>
<p><em>However — punctuation is crucial:</em>
<li>"It was raining. <strong>However,</strong> we went out." (full stop before, comma after)</li>
<li>"It was raining; <strong>however,</strong> we went out." (semicolon before)</li>
<li>"It was raining. We went out, <strong>however</strong>." (less common, at the end)</li></p>
<p><em>While/Whereas — showing contrast between two things:</em>
<li>"<strong>While</strong> Tom is very outgoing, his brother is quite shy."</li>
<li>"I prefer tea, <strong>whereas</strong> my wife only drinks coffee."</li>
<li>"<strong>Whereas</strong> the north is industrial, the south is mainly agricultural."</li></ul></p>`,
    'Wishes, Regrets, and Hypothetical Past': `<p><strong>I wish / If only — three structures:</strong></p>
<p><em>1. Wish about the PRESENT (want things to be different now):</em>
Structure: <strong>I wish / If only + past simple</strong>
<ul><li>"I <strong>wish I knew</strong> the answer." (I don't know it — present)</li>
<li>"I <strong>wish I had</strong> more free time." (I don't have enough — present)</li>
<li>"<strong>If only</strong> she <strong>lived</strong> nearer." (She lives far away — present)</li>
<li>"I <strong>wish it weren't</strong> raining." (It IS raining — present)</li></p>
<p><em>Important:</em> After "wish," we use <strong>were</strong> for all persons (formal/subjunctive):
<li>"I <strong>wish I were</strong> taller." (not "was" — though "was" is common in informal English)</li>
<li>"I <strong>wish he were</strong> here."</li></p>
<p><em>2. Wish about the PAST (regret about something that already happened):</em>
Structure: <strong>I wish / If only + past perfect (had + past participle)</strong>
<li>"I <strong>wish I had studied</strong> harder." (I didn't study hard — past)</li>
<li>"I <strong>wish I hadn't said</strong> that." (I said it, and I regret it — past)</li>
<li>"<strong>If only</strong> we <strong>had arrived</strong> earlier!" (We arrived late — past)</li>
<li>"I <strong>wish I had never met</strong> him." (I did meet him — past)</li></p>
<p><em>3. Wish about the FUTURE (want someone/something to change):</em>
Structure: <strong>I wish / If only + would + verb</strong>
<li>"I <strong>wish you would stop</strong> talking." (Please stop!)</li>
<li>"I <strong>wish it would stop</strong> raining." (I want the weather to change)</li>
<li>"<strong>If only</strong> he <strong>would listen</strong> to me!" (He never listens)</li>
<li>We only use "wish + would" for things we can't control or for other people's behaviour</li></p>
<p><strong>I regret + verb-ing (present regret about past action):</strong>
<li>"I <strong>regret telling</strong> everyone about it." (I told them, and now I'm sorry)</li>
<li>"I <strong>regret not studying</strong> harder." (I didn't study, and now I'm sorry)</li>
<li>"Do you <strong>regret moving</strong> to London?"</li></p>
<p><strong>I should have / shouldn't have:</strong>
<li>"I <strong>should have gone</strong> to university." (I didn't go — I regret it)</li>
<li>"I <strong>shouldn't have eaten</strong> so much." (I ate too much — I regret it)</li>
<li>"You <strong>should have told</strong> me earlier!"</li></ul></p>`,
    'Expressing Probability and Certainty': `<p><strong>Modal verbs for probability (present/future):</strong></p>
<p>| Certainty | Modal | Example |
|-----------|-------|---------|
| 100% certain | <strong>will</strong> | "The sun <strong>will</strong> rise tomorrow." |
| 90% certain | <strong>must</strong> | "He <strong>must</strong> be tired — he worked 12 hours." |
| 70% likely | <strong>should/ought to</strong> | "The train <strong>should</strong> arrive soon." |
| 50% possible | <strong>may/might/could</strong> | "It <strong>might</strong> rain later." |
| unlikely | <strong>might not/may not</strong> | "She <strong>might not</strong> come to the party." |
| 90% certain (negative) | <strong>can't</strong> | "That <strong>can't</strong> be true!" |</p>
<p><em>Note: "Must" for deduction is NOT obligation here — it's logical conclusion:</em>
<ul><li>"He <strong>must</strong> be rich." (I'm sure he is — look at his car!)</li>
<li>"He <strong>must</strong> work hard." (I'm sure he does — look at his success!)</li></p>
<p><strong>Modal verbs for past probability:</strong>
Structure: <strong>modal + have + past participle</strong></p>
<p>| Certainty | Example |
|-----------|---------|
| certain (didn't happen) | "You <strong>can't have seen</strong> him — he's in Australia!" |
| very likely | "He <strong>must have forgotten</strong> about the meeting." |
| likely | "She <strong>should have arrived</strong> by now." |
| possible | "They <strong>might have missed</strong> the train." |
| possible (negative) | "He <strong>may not have received</strong> my email." |</p>
<p><strong>Adverbs of probability:</strong>
| Adverb | Certainty | Position in sentence |
|--------|-----------|---------------------|
| definitely | 100% | "I <strong>will definitely</strong> be there." |
| certainly | 90% | "It <strong>will certainly</strong> rain." |
| probably | 70% | "I <strong>will probably</strong> go." / "I <strong>probably won't</strong> go." |
| possibly | 40% | "I <strong>could possibly</strong> help." |
| perhaps/maybe | 30-50% | "<strong>Perhaps</strong> we should wait." (at the beginning) |
| unlikely | low | "I'm <strong>unlikely</strong> to attend." |</p>
<p><strong>Word order with adverbs:</strong>
<li>Before the main verb: "It <strong>will probably</strong> rain."</li>
<li>After "be": "She <strong>is definitely</strong> coming."</li>
<li>After negative auxiliaries: "I <strong>don't probably</strong>..." ❌ → "I <strong>probably won't</strong>..." ✅</li>
<li>In questions: "<strong>Will you definitely</strong> be there?" / "Will you <strong>definitely</strong> be there?"</li></ul></p>`,
    'Emphasis and Focus Structures': `<p><strong>Cleft sentences (splitting for emphasis):</strong></p>
<p><em>It-clefts — emphasising different parts:</em>
<ul><li>"<strong>It was John</strong> who broke the window." (not Mary)</li>
<li>"<strong>It was the window</strong> that John broke." (not the door)</li>
<li>"<strong>It was yesterday</strong> that he arrived." (not today)</li>
<li>"<strong>It was in Paris</strong> that they met." (not London)</li>
<li>"<strong>It was because he was late</strong> that we left." (the reason)</li></p>
<p>Structure: <strong>It + be + emphasised part + that/who + rest of sentence</strong></p>
<p><em>What-clefts (pseudo-clefts):</em>
<li>"<strong>What I need</strong> is more time."</li>
<li>"<strong>What annoys me</strong> is his attitude."</li>
<li>"<strong>What happened</strong> was that I lost my keys."</li>
<li>"<strong>All I want</strong> is a quiet evening."</li></p>
<p><em>Reversed what-clefts (more emphatic):</em>
<li>"A quiet evening is <strong>what I need</strong>."</li>
<li>"More time is <strong>what we're asking for</strong>."</li></p>
<p><strong>Fronting — moving information to the beginning:</strong></p>
<p>Normal: "I have never seen such a beautiful sunset."
Fronted: "<strong>Never have I seen</strong> such a beautiful sunset." (more dramatic)</p>
<p><em>Fronting with negative adverbs:</em>
When a sentence starts with a negative adverb, we use <strong>inversion</strong> (auxiliary + subject + verb):
<li>"<strong>Rarely does</strong> she arrive late." (She rarely arrives late.)</li>
<li>"<strong>Hardly had</strong> I arrived when the meeting started."</li>
<li>"<strong>Not only did</strong> he fail the exam, <strong>but</strong> he also lost his job."</li>
<li>"<strong>Under no circumstances</strong> should you open that door."</li>
<li>"<strong>Little did</strong> they know what was waiting for them."</li></p>
<p><em>Fronting without inversion:</em>
<li>"<strong>On the table</strong> was a mysterious letter."</li>
<li>"<strong>In the corner</strong> sat an old man."</li></p>
<p><strong>Adding emphasis with "do/does/did":</strong>
<li>"I <strong>do</strong> like him." (I really like him — responding to doubt)</li>
<li>"She <strong>does</strong> speak French." (contradicting someone who said she doesn't)</li>
<li>"They <strong>did</strong> finish the project." (emphasising that it happened)</li></ul></p>`,
    'Indirect Questions and Polite Requests': `<p><strong>Direct vs. indirect questions:</strong></p>
<p>Direct questions can sound abrupt or rude in professional/formal contexts. Indirect questions soften them.</p>
<p>| Direct | Indirect (polite) |
|--------|-------------------|
| "Where is the station?" | "Could you tell me <strong>where the station is</strong>?" |
| "What time does the meeting start?" | "Do you know <strong>what time the meeting starts</strong>?" |
| "How much does it cost?" | "I was wondering <strong>how much it costs</strong>." |
| "Has the report been finished?" | "Can you tell me <strong>if the report has been finished</strong>?" |
| "Why was the decision made?" | "I'd like to know <strong>why the decision was made</strong>." |</p>
<p><strong>Key grammar rule:</strong> After the introductory phrase, the question becomes a statement (subject before verb, no question mark inside):
<ul><li>Direct: "Where <strong>is</strong> he?"</li>
<li>Indirect: "Could you tell me where he <strong>is</strong>?" (NOT "where is he")</li></p>
<p><strong>Introductory phrases for indirect questions:</strong>
<li>"Could you tell me...?"</li>
<li>"Do you know...?"</li>
<li>"Would you mind telling me...?"</li>
<li>"I was wondering..."</li>
<li>"I'd like to know..."</li>
<li>"Do you happen to know...?" (very polite)</li>
<li>"I was hoping you could tell me..."</li></p>
<p><strong>Indirect yes/no questions:</strong>
Use <strong>if</strong> or <strong>whether</strong>:
<li>"Is he coming?" → "Do you know <strong>if he's coming</strong>?"</li>
<li>"Did she finish it?" → "Could you tell me <strong>whether she finished it</strong>?"</li>
<li>"Can we reschedule?" → "I was wondering <strong>if we could reschedule</strong>."</li></ul></p>
<p><strong>Polite requests — softening scale:</strong></p>
<p>| Directness | Example |
|------------|---------|
| Very direct | "Give me the file." |
| Direct | "Can I have the file?" |
| Polite | "Could I have the file, please?" |
| Very polite | "Would it be possible to get the file?" |
| Extremely polite | "I was wondering if I could possibly get a copy of the file." |</p>`,
    'Writing Research Papers and Literature Reviews': `<p><strong>The IMRAD structure (standard for research papers):</strong></p>
<p><em>Introduction:</em>
<ul><li>Establish the research context and significance</li>
<li>Identify the research gap (what's missing in current knowledge)</li>
<li>State your research question and hypothesis</li>
<li>Brief overview of methodology</li></p>
<p><em>Methods:</em>
<li>Describe participants/materials</li>
<li>Explain procedures in sufficient detail for replication</li>
<li>Use passive voice and past tense: "Participants <strong>were recruited</strong> from..."</li></p>
<p><em>Results:</em>
<li>Present findings objectively, without interpretation</li>
<li>Use tables, figures, and statistics</li>
<li>"The data <strong>showed</strong> a significant correlation between X and Y (p < 0.05)."</li></p>
<p><em>Discussion:</em>
<li>Interpret your results</li>
<li>Compare with previous research</li>
<li>Acknowledge limitations</li>
<li>Suggest implications and future research</li></p>
<p><strong>Literature review — not a summary, a synthesis:</strong></p>
<p>❌ Bad: "Smith (2019) studied X. Jones (2020) studied Y. Brown (2021) studied Z."</p>
<p>✅ Good: "While Smith (2019) and Jones (2020) both identified X as a significant factor, their findings diverge on the role of Y. Brown (2021) offers a potential resolution by demonstrating that..."</p>
<p><strong>Synthesis techniques:</strong>
<li><strong>Agreement:</strong> "Several studies (Smith, 2019; Jones, 2020; Lee, 2021) have confirmed that..."</li>
<li><strong>Contrast:</strong> "Whereas Smith (2019) argues X, Jones (2020) contends Y."</li>
<li><strong>Gap:</strong> "Despite extensive research on X, few studies have examined Y."</li>
<li><strong>Progression:</strong> "Early studies focused on X (Smith, 2015), later shifting to Y (Jones, 2018), with recent work exploring Z (Lee, 2022)."</li></p>
<p><strong>Academic hedging (cautious language):</strong>
<li>"The results <strong>suggest</strong> that..." (not "prove")</li>
<li>"It <strong>appears</strong> that X may influence Y."</li>
<li>"This <strong>may be due to</strong>..."</li>
<li>"One possible <strong>interpretation</strong> is..."</li>
<li>"It is <strong>likely</strong> that..." / "It <strong>remains unclear</strong> whether..."</li></ul></p>`,
    'Thesis Statements and Argument Architecture': `<p><strong>Thesis statement — what it is and isn't:</strong></p>
<p>A thesis statement is NOT:
<ul><li>❌ A fact: "Climate change is happening." (undeniable, no argument)</li>
<li>❌ A topic: "This essay is about education." (too broad)</li>
<li>❌ A question: "Is social media harmful?" (doesn't state a position)</li></p>
<p>A thesis statement IS:
<li>✅ An arguable position: "While social media connects people globally, its algorithm-driven design prioritises engagement over wellbeing, making it a net negative for adolescent mental health."</li>
<li>✅ Specific and debatable: someone could reasonably disagree</li>
<li>✅ A roadmap: hints at the structure to follow</li></p>
<p><strong>The Toulmin model of argumentation:</strong></p>
<p>| Component | Function | Example |
|-----------|----------|---------|
| <strong>Claim</strong> | Your position | "Remote work should be the default" |
| <strong>Data/Evidence</strong> | Support | "A 2022 Stanford study found 13% productivity gains" |
| <strong>Warrant</strong> | Why evidence supports claim | "Higher productivity benefits both employees and employers" |
| <strong>Backing</strong> | Support for the warrant | "Meta-analysis of 50 studies confirms this correlation" |
| <strong>Qualifier</strong> | Limits on the claim | "In knowledge-work industries..." |
| <strong>Rebuttal</strong> | Counter-arguments | "Some argue remote work harms team cohesion; however..." |</p>
<p><strong>Counterargument integration techniques:</strong></p>
<p>1. <strong>Acknowledge-Refute:</strong> "Critics argue X. However, this overlooks Y."
2. <strong>Concession-Pivot:</strong> "While it is true that X, this does not negate Y."
3. <strong>Straw-man correction:</strong> "A common misconception is X. In reality, Y."
4. <strong>Limiting scope:</strong> "This argument applies specifically to X and should not be generalised to Y."</p>
<p><strong>Signposting in argumentative writing:</strong>
<li>"The first line of argument supporting this thesis is..."</li>
<li>"This position is further strengthened by..."</li>
<li>"Turning to potential objections..."</li>
<li>"Having established X, we now turn to Y."</li>
<li>"In light of the evidence presented, it is clear that..."</li></ul></p>`,
    'Data Analysis and Research Reporting': `<p><strong>Reporting statistics — precise language:</strong></p>
<p><em>Measures of central tendency:</em>
<ul><li>"The <strong>mean</strong> average was 45.3 years (SD = 12.4)."</li>
<li>"The <strong>median</strong> response time was 2.3 seconds."</li>
<li>"The <strong>mode</strong> across all groups was 'strongly agree.'"</li></p>
<p><em>Significance and correlation:</em>
<li>"A <strong>statistically significant</strong> difference was observed between groups (t(98) = 2.45, p = 0.016)."</li>
<li>"There was a <strong>strong positive correlation</strong> between X and Y (r = 0.78, p < 0.001)."</li>
<li>"The effect size was <strong>small to moderate</strong> (Cohen's d = 0.42)."</li>
<li>"The results <strong>approached significance</strong> (p = 0.052)." (be careful — some journals reject this!)</li></p>
<p><em>Changes over time:</em>
<li>"X increased <strong>steadily</strong> from 20% in 2018 to 47% in 2023."</li>
<li>"Y remained <strong>relatively stable</strong> throughout the period (range: 12-15%)."</li>
<li>"A <strong>sharp decline</strong> was observed following the intervention (p < 0.01)."</li></p>
<p><strong>Describing charts and figures:</strong>
<li>"As illustrated in <strong>Figure 1</strong>, X demonstrates a clear upward trend."</li>
<li>"<strong>Table 2</strong> presents the demographic breakdown by age and gender."</li>
<li>"The data reveal three distinct patterns. <strong>First</strong>,... <strong>Second</strong>,... <strong>Third</strong>,..."</li></p>
<p><strong>Methodology writing — reproducibility:</strong>
<li>"Data <strong>were collected</strong> using [method] over a [time period]."</li>
<li>"Participants <strong>were randomly assigned</strong> to either the experimental or control condition."</li>
<li>"Responses <strong>were coded</strong> independently by two researchers (inter-rater reliability: κ = 0.84)."</li>
<li>"All analyses <strong>were conducted</strong> using SPSS v28."</li></p>
<p><strong>Qualitative reporting:</strong>
<li>"Thematic analysis <strong>revealed</strong> four core themes:..."</li>
<li>"Participants <strong>frequently</strong> described..."</li>
<li>"A <strong>recurring motif</strong> across interviews was..."</li>
<li>"Representative quotations <strong>illustrate</strong> each theme (see Appendix A)."</li></ul></p>`,
    'Executive Communication and Leadership Language': `<p><strong>Vision statements — characteristics:</strong>
<ul><li>Future-oriented: "We <strong>will become</strong>..." / "Our vision <strong>is to</strong>..."</li>
<li>Inspiring but grounded: not empty hype, but aspirational</li>
<li>Inclusive: "<strong>Together</strong>, we will..." / "<strong>Every</strong> member of our team..."</li>
<li>Memorable: concrete imagery, not abstract jargon</li></p>
<p><em>Examples:</em>
<li>"To organise the world's information and make it universally accessible and useful." (Google)</li>
<li>"We believe that we are on the face of the earth to make great products." (Apple)</li></p>
<p><strong>Strategic framing — how leaders describe decisions:</strong></p>
<p>| Frame | Language | Used for |
|-------|----------|----------|
| <strong>Opportunity</strong> | "This positions us to..." / "This opens the door to..." | Growth investments |
| <strong>Necessity</strong> | "The market demands that we..." / "We have no option but to..." | Difficult changes |
| <strong>Continuity</strong> | "Building on our strengths..." / "As we have always done..." | Maintaining stability |
| <strong>Transformation</strong> | "A fundamental shift in how we..." / "Reimagining our approach to..." | Major pivots |
| <strong>Challenge</strong> | "Rising to meet..." / "In the face of unprecedented..." | Crisis management |</p>
<p><strong>Board presentation language:</strong>
<li>"I'd like to walk you through <strong>three key areas</strong>..."</li>
<li>"The numbers tell a clear story..."</li>
<li>"This aligns with the <strong>strategic priorities</strong> we set in Q1."</li>
<li>"I want to flag <strong>two risks</strong> that require board attention."</li>
<li>"We are recommending X <strong>on the basis of</strong> Y."</li>
<li>"I'll now <strong>open the floor</strong> for questions."</li></p>
<p><strong>Shareholder letter techniques:</strong>
<li>Acknowledge context: "In a year marked by..."</li>
<li>Own failures: "We did not meet our target in X, and here's what we learned."</li>
<li>Balance short-term and long-term: "While quarterly results reflect..., our investment in... positions us for..."</li>
<li>Use "we" not "I": leadership language is collective</li></ul></p>`,
    'Legal and Contract English': `<p><strong>Legal English characteristics:</strong>
<ul><li>Archaic words: <strong>hereby</strong>, <strong>thereof</strong>, <strong>hereinafter</strong>, <strong>aforementioned</strong>, <strong>witnesseth</strong></li>
<li>Latin/French terms: <strong>prima facie</strong>, <strong>pro bono</strong>, <strong>de facto</strong>, <strong>force majeure</strong>, <strong>null and void</strong></li>
<li>Triplets: <strong>"null, void, and of no effect"</strong> / <strong>"give, devise, and bequeath"</strong> / <strong>"terms, conditions, and provisions"</strong></li>
<li>Passive voice dominance: "Payment <strong>shall be made</strong> within 30 days."</li>
<li>No pronouns — full nouns repeated: "The Seller shall deliver the Goods. The Seller warrants that the Goods..."</li>
<li>Numbered clauses and sub-clauses: 1.1, 1.2, 1.2(a), etc.</li></p>
<p><strong>Common contract clauses:</strong></p>
<p>| Clause | Purpose | Example Language |
|--------|---------|-----------------|
| <strong>Recitals/Whereas</strong> | Background context | "<strong>Whereas</strong> the Company wishes to engage the Consultant..." |
| <strong>Term</strong> | Duration | "This Agreement <strong>shall commence</strong> on [date] and <strong>continue</strong> for 12 months." |
| <strong>Termination</strong> | Ending the contract | "Either party <strong>may terminate</strong> this Agreement upon 30 days' written notice." |
| <strong>Force Majeure</strong> | Unforeseeable events | "Neither party <strong>shall be liable</strong> for failure to perform due to events beyond reasonable control." |
| <strong>Indemnity</strong> | Protection against loss | "The Contractor <strong>shall indemnify</strong> the Company against all claims arising from..." |
| <strong>Governing Law</strong> | Which law applies | "This Agreement <strong>shall be governed by</strong> and construed in accordance with the laws of England." |
| <strong>Severability</strong> | If one part is invalid | "If any provision is held invalid, the remaining provisions <strong>shall continue</strong> in full force." |</p>
<p><strong>"Shall" vs "will" vs "may" in contracts:</strong>
<li><strong>Shall</strong> = obligation/mandatory: "The Seller <strong>shall deliver</strong> the goods."</li>
<li><strong>Will</strong> = future action (less formal, sometimes weaker): "The parties <strong>will meet</strong> quarterly."</li>
<li><strong>May</strong> = permission/discretion: "The Buyer <strong>may</strong> cancel within 14 days."</li>
<li><strong>Shall not / May not</strong> = prohibition: "The Employee <strong>shall not</strong> disclose confidential information."</li></p>
<p><strong>Plain English movement:</strong>
Modern legal writing increasingly favours clarity:
<li>❌ "The party of the first part shall hereinafter be referred to as..."</li>
<li>✅ "'The Company' means..."</li>
<li>❌ "Notwithstanding anything to the contrary herein contained..."</li>
<li>✅ "Despite any other clause in this agreement..."</li></ul></p>`,
    'Medical and Technical English': `<p><strong>Medical English — patient communication vs. professional communication:</strong></p>
<p>| Audience | Register | Example |
|----------|----------|---------|
| Patient | Plain English | "Your heart isn't pumping blood as well as it should." |
| Professional | Technical | "The patient presents with reduced ejection fraction consistent with congestive heart failure." |</p>
<p><strong>Common medical prefixes and roots:</strong>
| Prefix/Root | Meaning | Examples |
|-------------|---------|----------|
| <strong>hyper-</strong> | excessive, high | hypertension, hyperglycaemia |
| <strong>hypo-</strong> | deficient, low | hypotension, hypothyroidism |
| <strong>brady-</strong> | slow | bradycardia |
| <strong>tachy-</strong> | fast | tachycardia |
| <strong>-itis</strong> | inflammation | appendicitis, bronchitis |
| <strong>-ectomy</strong> | removal | appendectomy, mastectomy |
| <strong>-oscopy</strong> | visual examination | endoscopy, colonoscopy |</p>
<p><strong>Technical English — precision and clarity:</strong></p>
<p><em>Vague vs. precise:</em>
<ul><li>❌ "Make sure the temperature isn't too high."</li>
<li>✅ "Maintain the temperature below 40°C."</li>
<li>❌ "Use the right amount of solution."</li>
<li>✅ "Add 50ml of 0.9% sodium chloride solution."</li></p>
<p><em>Technical writing conventions:</em>
<li>Use imperative for instructions: "<strong>Ensure</strong> the valve <strong>is closed</strong> before proceeding."</li>
<li>Use passive for processes: "The sample <strong>is then heated</strong> to 100°C."</li>
<li>Define acronyms on first use: "<strong>Chronic Obstructive Pulmonary Disease (COPD)</strong>"</li>
<li>Use numbered steps for procedures</li>
<li>Include units with every measurement</li></ul></p>
<p><strong>Research abstracts — structure:</strong>
1. <strong>Background:</strong> Why this study matters (2-3 sentences)
2. <strong>Methods:</strong> What was done (2-3 sentences)
3. <strong>Results:</strong> Key findings with numbers (2-3 sentences)
4. <strong>Conclusion:</strong> Implications (1-2 sentences)</p>`,
    'Conference Presentations and Public Speaking': `<p><strong>Opening techniques for high-stakes presentations:</strong></p>
<p><em>The hook (first 30 seconds determine everything):</em>
<ul><li><strong>Shocking statistic:</strong> "Every year, 8 million tons of plastic enter our oceans. That's equivalent to dumping one garbage truck of plastic into the ocean every minute."</li>
<li><strong>Provocative question:</strong> "What if everything we believe about motivation is wrong?"</li>
<li><strong>Personal story:</strong> "Three years ago, I stood in an emergency room and watched a patient die from a preventable error. That moment changed my career."</li>
<li><strong>Contrast:</strong> "In 1990, it took $3 billion and 13 years to sequence one human genome. Today, it costs $200 and takes 24 hours."</li></p>
<p><strong>Structuring a keynote (different from a standard presentation):</strong>
1. <strong>The Hook</strong> (1 min) — grab attention
2. <strong>The Stakes</strong> (2 min) — why this matters NOW
3. <strong>The Journey</strong> (10-15 min) — 3 key insights, each with evidence
4. <strong>The Application</strong> (3 min) — what the audience should do differently
5. <strong>The Closing</strong> (1 min) — memorable final thought</p>
<p><strong>Handling difficult Q&A:</strong></p>
<p>| Type of questioner | Strategy | Example response |
|-------------------|----------|-----------------|
| <strong>The Challenger</strong> (aggressive disagreement) | Acknowledge, don't escalate, bridge back | "That's an important critique. What I'd emphasise is..." |
| <strong>The Wanderer</strong> (off-topic long question) | Gently redirect | "That's fascinating, and perhaps we can discuss it after. To return to today's focus..." |
| <strong>The Expert</strong> (knows more than you) | Defer and appreciate | "You've clearly studied this deeply. My understanding is... What would you add?" |
| <strong>The Confused</strong> (didn't follow) | Don't blame them; reframe | "Let me put that another way..." |
| <strong>The Multi-parter</strong> (asks 3+ questions) | Answer one, offer follow-up | "Great questions. Let me address the first, and I'd welcome continuing this conversation after." |</p>
<p><strong>Vocal techniques for impact:</strong>
<li><strong>Pace variation:</strong> Slow down for key points, speed up for background</li>
<li><strong>Pause:</strong> After a key statement, count to three in your head</li>
<li><strong>Volume:</strong> Lower your voice for intimacy, raise for emphasis</li>
<li>"The most important finding is this... [pause]... it changes everything we thought we knew."</li></ul></p>`,
    'Media Interviews and Press Communication': `<p><strong>The bridging technique (staying on message):</strong>
Journalists ask questions you don't want to answer. Bridging lets you acknowledge the question then pivot to your message.</p>
<p>| Bridge phrase | Function |
|--------------|----------|
| "What's important is..." | Redirect to your priority |
| "What I can tell you is..." | Set boundaries on what you'll discuss |
| "Let me put that in context..." | Widen the frame |
| "The real question is..." | Reframe the issue |
| "I'm not at liberty to discuss X, but what I can say is..." | Decline politely then redirect |
| "Actually, that's not quite accurate. The reality is..." | Correct a premise |</p>
<p><em>Example:</em>
Journalist: "Rumours say your company is facing bankruptcy. Is that true?"
❌ Bad: "No comment." (sounds guilty)
✅ Good: "I'm not going to speculate on rumours. What I can tell you is that we just closed our most successful quarter, with revenue up 23%, and we're investing aggressively in expansion."</p>
<p><strong>Key messaging — the rule of three:</strong>
Prepare exactly three key messages before any interview:
1. "Our Q3 revenue grew 23% year-on-year."
2. "We are expanding into three new markets."
3. "Customer satisfaction scores reached an all-time high of 94%."</p>
<p>Every answer should somehow connect back to one of these three messages.</p>
<p><strong>The soundbite — crafting quotable phrases:</strong>
Journalists need short, punchy quotes. Prepare them in advance:
<ul><li>❌ "We have observed through extensive market research that there appears to be a significant increase in consumer preference for sustainable products."</li>
<li>✅ "Sustainability isn't a niche anymore — it's the main event."</li></ul></p>
<p><strong>Press release structure:</strong>
1. <strong>Headline:</strong> Clear, active, newsworthy
2. <strong>Dateline:</strong> City, Date —
3. <strong>Lead paragraph:</strong> Who, what, when, where, why (most important info first)
4. <strong>Body:</strong> Supporting details, quotes from leadership
5. <strong>Boilerplate:</strong> "About [Company]" paragraph
6. <strong>Contact information</strong></p>`,
    'Editing and Proofreading at C2 Level': `<p><strong>The C2 editing checklist:</strong></p>
<p><em>1. Clarity — is every sentence immediately understandable?</em>
<ul><li>❌ "The committee made a decision about the issue."</li>
<li>✅ "The committee approved the proposal." (specific)</li>
<li>❌ "There are many factors that contribute to the problem."</li>
<li>✅ "Three factors drive this problem: X, Y, and Z."</li></p>
<p><em>2. Concision — cut unnecessary words:</em>
<li>❌ "due to the fact that" → ✅ "because"</li>
<li>❌ "in the event that" → ✅ "if"</li>
<li>❌ "at this point in time" → ✅ "now"</li>
<li>❌ "for the purpose of" → ✅ "to"</li>
<li>❌ "in order to" → ✅ "to" (usually)</li>
<li>❌ "It is important to note that" → ✅ delete entirely or say "Notably,"</li></p>
<p><em>3. Consistency — check throughout:</em>
<li>Spelling: British vs. American (organisation/organization)</li>
<li>Punctuation: Oxford comma or not (be consistent)</li>
<li>Tense: don't switch between past and present without reason</li>
<li>Voice: active vs. passive (academic often uses both, but be intentional)</li>
<li>Formatting: heading styles, numbering, font</li></p>
<p><em>4. Flow — do sentences and paragraphs connect logically?</em>
<li>Check transitional words between paragraphs</li>
<li>Ensure each paragraph follows from the previous one</li>
<li>Read aloud — awkward phrasing becomes obvious</li></p>
<p><em>5. Common C2-level errors to watch for:</em>
<li>Dangling modifiers: "Walking down the street, the building was beautiful." (Who was walking?)</li>
<li>Faulty parallelism: "She likes swimming, running, and to ride bikes." → "swimming, running, and riding"</li>
<li>Misplaced modifiers: "I almost ate the whole cake." vs. "I ate almost the whole cake."</li>
<li>Pronoun reference errors: "The government and the opposition disagree because it wants change." (Who wants change?)</li></p>
<p><strong>Proofreading techniques:</strong>
<li><strong>Read backwards</strong> (last sentence first) to catch spelling without being distracted by meaning</li>
<li><strong>Read aloud</strong> to catch awkward rhythm and missing words</li>
<li><strong>Change the font</strong> to trick your brain into seeing the text as new</li>
<li><strong>Wait 24 hours</strong> between writing and editing</li>
<li><strong>Use a checklist</strong>, not memory</li></ul></p>`,
    'Writing for Publication: Journals and Op-Eds': `<p><strong>Academic journal submission — what editors want:</strong></p>
<p><em>Before writing — know your journal:</em>
<ul><li>Read the "Aims and Scope" section</li>
<li>Study recent articles — what's the structure? Length? Style?</li>
<li>Check the impact factor and acceptance rate</li>
<li>Follow the author guidelines EXACTLY (formatting, references, word count)</li></p>
<p><em>The cover letter:</em>
<li>State what you're submitting and to which journal</li>
<li>Explain why your paper fits this journal specifically</li>
<li>Highlight the contribution: "This paper is the first to..."</li>
<li>Confirm originality: "This work has not been published elsewhere."</li>
<li>Suggest reviewers (some journals ask for this)</li></p>
<p><strong>Responding to peer review:</strong></p>
<p>| Reviewer comment | Tone | Response strategy |
|-----------------|------|-------------------|
| "The methodology is unclear." | Critical | Thank → Clarify → Show changes |
| "Have you considered X?" | Constructive | Thank → Address or explain why not |
| "This has been done before by Smith (2019)." | Hostile | Thank → Distinguish your work → Cite additional evidence |
| "The writing needs improvement." | Vague | Thank → Revise extensively → Ask colleague to proofread |</p>
<p><em>Never respond emotionally. Always:</em>
1. Thank the reviewer
2. Restate the concern to show you understood
3. Explain what you changed (or why you didn't)
4. Reference line numbers in your revision</p>
<p><strong>Op-ed (opinion editorial) structure:</strong></p>
<p>Unlike academic writing, op-eds are:
<li>Short: 600-800 words</li>
<li>Timely: connected to current events</li>
<li>Argumentative: clear thesis from the start</li>
<li>Accessible: written for educated general readers, not specialists</li>
<li>Evidence-based: supported by data, but not overwhelmed by it</li></p>
<p><em>Op-ed structure:</em>
1. <strong>Lede</strong> (1-2 sentences): The hook — timely, provocative, specific
2. <strong>Thesis</strong> (1 sentence): Your clear position
3. <strong>Evidence</strong> (3-4 paragraphs): Supporting arguments with examples/data
4. <strong>Counter</strong> (1 paragraph): Address the strongest opposition
5. <strong>Conclusion</strong> (1-2 sentences): Call to action or forward-looking statement</p>
<p><em>Example lede:</em>
<li>❌ "Artificial intelligence is changing many industries."</li>
<li>✅ "Last month, an AI diagnosed a rare cancer that three human doctors missed. The patient survived because of a machine. This is not the future — it's yesterday, and our medical regulations are still stuck in 1995."</li></ul></p>`,
    'Reading Practice — Signs, Menus, and Short Texts': `<p><strong>Reading strategies for short texts:</strong></p>
<p><em>Skimming for main idea (5-10 seconds):</em>
<ul><li>Read the title/heading</li>
<li>Read the first sentence</li>
<li>Look at any bold text or highlights</li>
<li>Don't read every word — get the general meaning</li></p>
<p><em>Scanning for details:</em>
<li>Know what you're looking for before you read</li>
<li>Move your eyes quickly across the text</li>
<li>Look for numbers, names, times, prices</li>
<li>Stop when you find the information you need</li></p>
<p><em>Using context clues for unknown words:</em>
<li>Look at the words AROUND the unknown word</li>
<li>Is it positive or negative?</li>
<li>What kind of word is it? (noun, verb, adjective?)</li>
<li>Can you guess the meaning without a dictionary?</li></p>
<p><strong>Common real-world texts:</strong></p>
<p><em>Signs and notices:</em>
<li>"<strong>Out of order</strong>" = not working</li>
<li>"<strong>Mind the step</strong>" = be careful, there's a step</li>
<li>"<strong>Please queue here</strong>" = stand in line here</li>
<li>"<strong>No entry</strong>" = you cannot go in</li>
<li>"<strong>Push / Pull</strong>" = how to open the door</li>
<li>"<strong>Caution: Wet floor</strong>" = be careful, the floor is slippery</li></p>
<p><em>Menus:</em>
<li>"<strong>Starters</strong>" = small first course (appetisers)</li>
<li>"<strong>Mains</strong>" = main course</li>
<li>"<strong>Sides</strong>" = extra vegetables, potatoes, rice</li>
<li>"<strong>V</strong> = vegetarian option</li>
<li>"<strong>Allergens:</strong> please inform staff of any allergies"</li>
<li>"<strong>Service charge included</strong>" = tip is already in the price</li></p>
<p><em>Emails (informal):</em>
<li>"<strong>Subject:</strong>" = what the email is about</li>
<li>"<strong>Hi / Hey</strong> [name]" = informal greeting</li>
<li>"<strong>How's it going?</strong>" = friendly opening</li>
<li>"<strong>BTW</strong>" = by the way</li>
<li>"<strong>Let me know</strong>" = tell me when you decide</li>
<li>"<strong>See you soon / Catch you later</strong>" = informal closing</li></ul></p>`,
    'A1-A2 Grammar Checkpoint 1': `<p>This lesson is a comprehensive review of Lessons 1-22. Key concepts to remember:</p>
<p><strong>Present Simple vs. Present Continuous:</strong>
<ul><li>Habits/facts → present simple: "I <strong>work</strong> in an office."</li>
<li>Now/temporary → present continuous: "I <strong>am working</strong> from home this week."</li></p>
<p><strong>Articles:</strong>
<li>First mention/general: <strong>a/an</strong></li>
<li>Specific/known: <strong>the</strong></li>
<li>General plurals/uncountable: <strong>no article</strong></li></p>
<p><strong>Prepositions:</strong>
<li>Time: <strong>in</strong> July, <strong>on</strong> Monday, <strong>at</strong> 5 o'clock</li>
<li>Place: <strong>in</strong> London, <strong>on</strong> the street, <strong>at</strong> the airport</li>
<li>Movement: <strong>into</strong>, <strong>out of</strong>, <strong>across</strong>, <strong>through</strong></li></p>
<p><strong>Questions:</strong>
<li>Yes/No: Auxiliary + subject + verb? "<strong>Do</strong> you like...?"</li>
<li>Wh-: Wh-word + auxiliary + subject + verb? "<strong>Where does</strong> she live?"</li>
<li>Tags: Positive statement + negative tag? "You're coming, <strong>aren't you</strong>?"</li></ul></p>`,
    'A1-A2 Grammar Checkpoint 2': `<p><strong>Past Simple vs. Past Continuous:</strong>
<ul><li>Completed action → past simple: "I <strong>walked</strong> to school."</li>
<li>Background action → past continuous: "I <strong>was walking</strong> when I <strong>saw</strong> her."</li></p>
<p><strong>Modals:</strong>
<li><strong>Can/could:</strong> ability and permission</li>
<li><strong>Should:</strong> advice</li>
<li><strong>Must/have to:</strong> obligation (must = speaker's opinion; have to = external rule)</li>
<li><strong>Mustn't</strong> = prohibition / <strong>Don't have to</strong> = no obligation</li></p>
<p><strong>Comparatives and Superlatives:</strong>
<li>Short adj: tall → <strong>taller</strong> → <strong>the tallest</strong></li>
<li>Long adj: expensive → <strong>more expensive</strong> → <strong>the most expensive</strong></li>
<li>Irregular: good → <strong>better</strong> → <strong>the best</strong> / bad → <strong>worse</strong> → <strong>the worst</strong></li></p>
<p><strong>Conjunctions:</strong>
<li><strong>And:</strong> adding information</li>
<li><strong>But:</strong> contrast</li>
<li><strong>So:</strong> result</li>
<li><strong>Because:</strong> reason</li></ul></p>`,
    'Common A1-A2 Mistakes and How to Fix Them': `<p><strong>The top 20 A1-A2 mistakes:</strong></p>
<p>| # | Mistake | Correction | Rule |
|---|---------|-----------|------|
| 1 | I am agree | I <strong>agree</strong> | State verbs = no continuous |
| 2 | She can speaks | She <strong>can speak</strong> | Modal + base verb, no -s |
| 3 | I don't can | I <strong>can't</strong> | Negatives go ON the modal |
| 4 | He has 20 years | He <strong>is</strong> 20 years old | Age = be, not have |
| 5 | I very like | I <strong>like it very much</strong> | "Very" doesn't modify verbs |
| 6 | I am use to | I <strong>am used to</strong> + noun/-ing | "Used to" = accustomed |
| 7 | I have cold | I <strong>have a cold</strong> | Need article with illness |
| 8 | I am born in | I <strong>was born in</strong> | Birth is past, passive |
| 9 | I look forward to see you | I look forward to <strong>seeing</strong> you | "to" = preposition here |
| 10 | I am interesting | I am <strong>interested</strong> | -ed = person, -ing = thing |
| 11 | I have lived here since 3 years | I have lived here <strong>for</strong> 3 years | Since + point, for + duration |
| 12 | I explain you | I <strong>explain to you</strong> / I <strong>tell you</strong> | Explain needs "to" |
| 13 | I am agree with you | I <strong>agree with you</strong> | No "am" with agree |
| 14 | She is more taller | She is <strong>much taller</strong> | More OR -er, not both |
| 15 | I have much time | I have <strong>a lot of</strong> time | Much = negative/question |
| 16 | I am late because the traffic | I am late <strong>because of</strong> the traffic | Because + clause, because of + noun |
| 17 | I like very much coffee | I like coffee <strong>very much</strong> | Adverb goes at end |
| 18 | How many money? | How <strong>much</strong> money? | Much = uncountable |
| 19 | I did a mistake | I <strong>made</strong> a mistake | Make + mistake (collocation) |
| 20 | I am coming from Spain | I <strong>come from</strong> Spain | Origin = simple present |</p>`,
    'A2 Practice Test — Listening and Reading': `<p><strong>A2 Listening — what to expect:</strong>
<ul><li>Short dialogues (2-3 speakers)</li>
<li>Everyday situations: shopping, travel, phone calls</li>
<li>You hear each recording twice</li>
<li>Question types: multiple choice, matching, gap-fill</li></p>
<p><strong>Listening tips:</strong>
1. Read the questions BEFORE you listen
2. Underline keywords in the questions
3. The first answer you hear might be wrong — listen for changes ("but," "however")
4. For gap-fill, check the word limit ("NO MORE THAN TWO WORDS")
5. If you miss an answer, move on — don't panic</p>
<p><strong>A2 Reading — what to expect:</strong>
<li>Short texts: emails, signs, adverts, articles</li>
<li>Question types: multiple choice, true/false/not given, matching</li></p>
<p><strong>Reading tips:</strong>
1. Skim first — get the main idea in 30 seconds
2. Read the questions, then scan for answers
3. For true/false: if the text says the OPPOSITE, it's FALSE. If not mentioned, NOT GIVEN
4. Don't use outside knowledge — answer only from the text</p>
<p><strong>Test strategy:</strong>
<li>Don't spend too long on one question</li>
<li>If you don't know, guess — no marks for blank answers</li>
<li>Check your answers at the end if you have time</li>
<li>In gap-fill, check spelling!</li></ul></p>`,
    'Common B1-B2 Mistakes and How to Fix Them': `<p><strong>The top 20 B1-B2 mistakes:</strong></p>
<p>| # | Mistake | Correction | Why |
|---|---------|-----------|-----|
| 1 | If I <strong>would have</strong> known | If I <strong>had</strong> known | Third conditional = past perfect, not would |
| 2 | I <strong>am agree</strong> | I <strong>agree</strong> | State verbs = no continuous |
| 3 | I <strong>suggest you to go</strong> | I <strong>suggest (that) you go</strong> | Suggest + clause (no to) |
| 4 | I <strong>look forward to hear</strong> | I <strong>look forward to hearing</strong> | To = preposition here |
| 5 | I <strong>am here since</strong> 2020 | I <strong>have been here since</strong> 2020 | Since requires present perfect |
| 6 | <strong>The</strong> nature / <strong>the</strong> society | <strong>__</strong> nature / <strong>__</strong> society | Abstract nouns = no article |
| 7 | I <strong>very like</strong> it | I <strong>like it very much</strong> | Very doesn't modify verbs |
| 8 | <strong>Despite</strong> it was raining | <strong>Although</strong> it was raining / <strong>Despite</strong> the rain | Despite + noun, not clause |
| 9 | I <strong>am interesting</strong> in it | I <strong>am interested</strong> in it | -ed = person, -ing = thing |
| 10 | <strong>In</strong> the last years | <strong>Over/During</strong> the last few years | In + period, not list |
| 11 | <strong>I would</strong> if I <strong>can</strong> | <strong>I would</strong> if I <strong>could</strong> | Conditional consistency |
| 12 | I <strong>have</strong> 25 years | I <strong>am</strong> 25 | Age = be, not have |
| 13 | I <strong>explain you</strong> | I <strong>explain to you</strong> / I <strong>tell you</strong> | Explain needs to |
| 14 | <strong>How</strong> it looks like | <strong>What</strong> it looks like | What = thing, how = manner |
| 15 | <strong>Nowadays</strong> + simple past | <strong>Nowadays</strong> + present simple | Nowadays = present |
| 16 | I <strong>am used to work</strong> | I <strong>am used to working</strong> | Used to + -ing |
| 17 | <strong>Most</strong> of people | <strong>Most</strong> people / <strong>Most of the</strong> people | Most + noun directly |
| 18 | I <strong>did a mistake</strong> | I <strong>made a mistake</strong> | Collocation |
| 19 | <strong>It</strong> makes me to think | <strong>It</strong> makes me think | Make + bare infinitive |
| 20 | I <strong>can't hardly</strong> hear | I <strong>can hardly</strong> hear | Hardly = almost not (already negative) |</p>`,
    'B1-B2 Grammar Checkpoint 1': `<p><strong>Conditionals review:</strong></p>
<p>| Type | Structure | Example |
|------|-----------|---------|
| <strong>Zero</strong> | If + present, present | "If you <strong>heat</strong> water to 100°C, it <strong>boils</strong>." |
| <strong>First</strong> | If + present, will | "If it <strong>rains</strong>, we <strong>will cancel</strong> the picnic." |
| <strong>Second</strong> | If + past, would | "If I <strong>won</strong> the lottery, I <strong>would travel</strong> the world." |
| <strong>Third</strong> | If + past perfect, would have | "If I <strong>had studied</strong> harder, I <strong>would have passed</strong>." |
| <strong>Mixed</strong> | If + past perfect, would | "If I <strong>had taken</strong> that job, I <strong>would be</strong> in London now." |</p>
<p><strong>Passive voice:</strong>
<ul><li>Form: <strong>be + past participle</strong></li>
<li>Present simple: "The report <strong>is written</strong> every month."</li>
<li>Past simple: "The report <strong>was written</strong> last week."</li>
<li>Present perfect: "The report <strong>has been written</strong>."</li>
<li>Modal: "The report <strong>must be finished</strong> by Friday."</li>
<li>When to use: when the agent is unknown, unimportant, or when we want to be objective</li></p>
<p><strong>Reported speech — backshifting:</strong></p>
<p>| Direct | Reported |
|--------|----------|
| Present simple → | Past simple |
| Present continuous → | Past continuous |
| Past simple → | Past perfect |
| Will → | Would |
| Can → | Could |
| Must → | Had to |</p>
<li>"I <strong>am</strong> tired." → He said he <strong>was</strong> tired.</li>
<li>"I <strong>will</strong> help you." → She said she <strong>would</strong> help me.</li>
<li>"I <strong>have finished</strong>." → He said he <strong>had finished</strong>.</li>
<li>"I <strong>can</strong> swim." → She said she <strong>could</strong> swim.</li>
<li>"Do you <strong>like</strong> coffee?" → He <strong>asked if</strong> I <strong>liked</strong> coffee.</li></ul>`,
    'B1-B2 Grammar Checkpoint 2': `<p><strong>Relative clauses — quick review:</strong>
<ul><li>Defining (no commas): "The man <strong>who lives next door</strong> is a doctor."</li>
<li>Non-defining (commas): "My brother, <strong>who lives in Paris</strong>, is visiting."</li>
<li><strong>Never use "that" in non-defining clauses.</strong></li>
<li>Omit the pronoun when it's the object: "The book <strong>(that)</strong> I read was great."</li></p>
<p><strong>Gerunds vs. infinitives — quick review:</strong></p>
<p>| Followed by gerund (-ing) | Followed by infinitive (to) | Both (different meaning) |
|---------------------------|----------------------------|--------------------------|
| enjoy, avoid, suggest, consider | want, decide, promise, hope | remember, forget, try, stop |</p>
<li>"I <strong>enjoy swimming</strong>." (gerund)</li>
<li>"I <strong>want to swim</strong>." (infinitive)</li>
<li>"I <strong>remember meeting</strong> him." (I have a memory of it)</li>
<li>"<strong>Remember to meet</strong> him." (don't forget)</li>
<p><strong>Emphasis structures:</strong>
<li>Cleft sentences: "<strong>It was John</strong> who broke the window."</li>
<li>Fronting: "<strong>Never have I seen</strong> such beauty."</li>
<li>"Do/does/did" emphasis: "I <strong>do</strong> like it!" / "She <strong>did</strong> finish!"</li></p>
<p><strong>Complex connectors:</strong>
<li>Despite/In spite of + noun/-ing: "<strong>Despite</strong> the rain, we went."</li>
<li>Although/Though/Even though + clause: "<strong>Although</strong> it was raining, we went."</li>
<li>However (separate sentence): "It was raining. <strong>However</strong>, we went."</li>
<li>Whereas/While (contrast): "<strong>While</strong> I like tea, she prefers coffee."</li></ul></p>`,
    'Exam Strategy — IELTS Band 5.5-6.5 Preparation': `<p><strong>IELTS format overview:</strong>
<ul><li>Listening: 40 questions, 4 sections, 30 minutes + 10 minutes transfer</li>
<li>Reading: 40 questions, 3 texts, 60 minutes</li>
<li>Writing: 2 tasks, 60 minutes</li>
<li>Speaking: 3 parts, 11-14 minutes</li>
<li>Scored 0-9 in half-band increments</li></p>
<p><strong>Listening strategies:</strong>
<li>Section 1 (easiest): Everyday conversation — aim for 8-10/10</li>
<li>Section 2: Monologue (tour guide, announcement) — aim for 7-8/10</li>
<li>Section 3: Academic discussion — aim for 6-7/10</li>
<li>Section 4 (hardest): Academic lecture — aim for 5-6/10</li>
<li>Read ahead during the 30-second pauses between sections</li>
<li>Write answers in ALL CAPS during the test (no spelling penalty for capitals)</li>
<li>For gap-fill, check the word limit: "NO MORE THAN TWO WORDS AND/OR A NUMBER"</li></p>
<p><strong>Reading strategies:</strong>
<li>Spend 20 minutes per text</li>
<li>Start with the easiest text (you can tell from the topic)</li>
<li>True/False/Not Given is the hardest question type:</li>
  - TRUE = the text agrees with the statement
  - FALSE = the text contradicts the statement
  - NOT GIVEN = no information about this in the text
<li>Matching headings: read the paragraph first, THEN the headings</li></p>
<p><strong>Writing Task 1 (Band 5.5-6.5):</strong>
<li>150+ words, 20 minutes</li>
<li>Describe a chart/graph/map/process</li>
<li>Include: overview (main trend), specific data, comparisons</li>
<li>Don't give opinions — just describe</li>
<li>Structure: Introduction → Overview → Details 1 → Details 2</li></p>
<p><strong>Writing Task 2 (Band 5.5-6.5):</strong>
<li>250+ words, 40 minutes</li>
<li>Essay: opinion, discussion, problem/solution, or advantage/disadvantage</li>
<li>Structure: Introduction (2 sentences) → Body 1 → Body 2 → Conclusion (1-2 sentences)</li>
<li>Include a clear thesis statement in the introduction</li>
<li>Use linking words: Firstly, However, In conclusion</li></ul></p>`,
    'Exam Strategy — Cambridge B2 First (FCE) Preparation': `<p><strong>B2 First format:</strong>
<ul><li>Reading and Use of English: 7 parts, 52 questions, 75 minutes</li>
<li>Writing: 2 parts, 80 minutes</li>
<li>Listening: 4 parts, 30 questions, 40 minutes</li>
<li>Speaking: 4 parts, 14 minutes (with another candidate)</li></p>
<p><strong>Reading and Use of English — the hardest paper:</strong></p>
<p><em>Part 1: Multiple choice cloze (vocabulary)</em>
<li>Tests collocations, phrasal verbs, linking words, fixed phrases</li>
<li>Strategy: read the whole text first, don't look at options yet</li></p>
<p><em>Part 2: Open cloze (grammar)</em>
<li>One word per gap — articles, prepositions, auxiliaries, pronouns</li>
<li>Most common answers: the, a, of, in, it, is, are, have, has, be, been, being, to, for, on, at, by, with, from, as, that, which, who, when, where, what, how, not, no, so, too, very, much, many, more, most, some, any, all, each, every, both, either, neither, one, two (and other numbers), there, here, up, out, off, down, over, through, during, while, although, though, however, therefore, thus, hence, moreover, furthermore, additionally, also, too, either, neither, nor, but, yet, still, already, yet, still, just, only, even, rather, quite, fairly, pretty, rather, somewhat, somehow, anyway, besides, except, apart from, despite, in spite of, instead, otherwise, else, own, same, such, so, as, like, than, then, now, before, after, since, until, till, once, whenever, wherever, whatever, whichever, however, whoever, whomever, whomsoever, whatsoever, etc.</li></p>
<p><em>Part 4: Key word transformations (the trickiest):</em>
<li>Given a sentence + a key word → rewrite keeping the meaning</li>
<li>Must use the key word unchanged</li>
<li>2-5 words needed (including the key word)</li>
<li>Tests: passive, conditionals, reported speech, comparatives, causative have, modal perfect</li></ul></p>`,
    'B2 Practice Test — Listening and Reading': `<p><strong>Timed practice — simulate exam conditions:</strong></p>
<p><em>Listening (45 minutes):</em>
<ul><li>Use headphones if possible</li>
<li>No pausing or replaying</li>
<li>Transfer answers carefully in the last 10 minutes (IELTS) or as you go (FCE)</li>
<li>Write clearly — unclear answers get no marks</li></p>
<p><em>Reading (60 minutes):</em>
<li>Strict timing — 20 minutes per text</li>
<li>No dictionary</li>
<li>Read questions before the text (for IELTS) or skim first (for FCE)</li>
<li>For T/F/NG: base answers ONLY on the text, not your knowledge</li>
<li>If stuck, mark your best guess and move on</li></p>
<p><strong>Common traps in B2 listening:</strong>
<li>Distractors: answers that sound right but are wrong</li>
<li>Speakers changing their minds: "I wanted X, but actually Y..."</li>
<li>Numbers: 15 vs. 50, £30 vs. £13 — listen carefully</li>
<li>Similar-sounding words: "ship" vs. "sheep," "14" vs. "40"</li></p>
<p><strong>Common traps in B2 reading:</strong>
<li>NOT GIVEN vs. FALSE: the text doesn't say = NOT GIVEN; contradicts = FALSE</li>
<li>Paraphrasing: the answer uses different words from the text</li>
<li>Over-specific options: an answer that adds information not in the text</li></ul></p>`,
    'From B2 to C1 — Transition Roadmap': `<p><strong>What's the difference between B2 and C1?</strong></p>
<p>| Skill | B2 (Can do) | C1 (Can do) |
|-------|-------------|-------------|
| <strong>Fluency</strong> | Speak at length with some hesitation | Speak fluently, almost no searching for words |
| <strong>Accuracy</strong> | Complex sentences with some errors | Consistently accurate, even in complex structures |
| <strong>Vocabulary</strong> | Sufficient for most topics | Wide range, including idiomatic and colloquial |
| <strong>Register</strong> | Generally appropriate | Seamlessly shifts between formal and informal |
| <strong>Listening</strong> | Understand standard native speech | Understand fast, idiomatic, accented speech |
| <strong>Reading</strong> | Understand articles and reports | Understand implicit meaning, tone, nuance |
| <strong>Writing</strong> | Clear, well-structured essays | Sophisticated, nuanced, stylistically aware |</p>
<p><strong>Gap analysis — assess yourself:</strong></p>
<p>Rate 1-5 (1 = weak, 5 = strong):
1. Can I use all conditional types correctly? __
2. Can I use passive voice naturally? __
3. Can I use reported speech without thinking? __
4. Do I know 50+ phrasal verbs? __
5. Can I understand films without subtitles? __
6. Can I write a 300-word essay in 40 minutes? __
7. Can I participate in a debate in English? __
8. Can I understand different accents (Scottish, Australian, Indian)? __</p>
<p>Score: 32-40 = Ready for C1 / 24-31 = Some gaps to fill / Below 24 = Focus on B2 consolidation</p>
<p><strong>Transition strategy:</strong></p>
<p><em>Month 1: Fill grammar gaps</em>
<ul><li>Review conditionals, passive, reported speech</li>
<li>Practise key word transformations (FCE/CPE style)</li>
<li>Focus on articles and prepositions (the most persistent errors)</li></p>
<p><em>Month 2: Expand vocabulary</em>
<li>Learn 10 new collocations per day</li>
<li>Study phrasal verbs in context (not lists)</li>
<li>Read one academic article per week</li></p>
<p><em>Month 3: Develop fluency</em>
<li>Practise speaking for 2 minutes without hesitation</li>
<li>Listen to podcasts at native speed</li>
<li>Start writing more complex essays</li></p>
<p><em>Month 4+: C1 content</em>
<li>Move to the Advanced course on TestCEFR</li>
<li>Focus on nuance, register, and cultural fluency</li></ul></p>`,
    'Advanced Pronunciation — Intonation and Rhythm': `<p><strong>English as a stress-timed language:</strong>
Unlike syllable-timed languages (Spanish, French, Italian) where each syllable takes roughly equal time, English has stressed syllables at roughly equal intervals, with unstressed syllables squeezed between them.</p>
<p>Example: "The <strong>cat</strong> sat on the <strong>mat</strong>" — stressed syllables (cat, mat) are evenly spaced. "The," "sat on the" are rushed.</p>
<p><strong>Sentence stress — content vs. function words:</strong></p>
<p><em>Content words (usually stressed):</em>
nouns, main verbs, adjectives, adverbs, question words, negatives</p>
<p><em>Function words (usually unstressed/weak):</em>
articles, prepositions, pronouns, auxiliary verbs, conjunctions</p>
<p>Example: "<strong>Where</strong> are you <strong>going</strong>?" — "Where" and "going" are stressed; "are you" are weak.</p>
<p><strong>Intonation patterns:</strong></p>
<p><em>Falling intonation (↘):</em>
<ul><li>Statements: "I'll <strong>see</strong> you to<strong>mor</strong>row."</li>
<li>Wh- questions: "<strong>Where</strong> are you <strong>from</strong>?"</li>
<li>Commands: "<strong>Close</strong> the <strong>door</strong>."</li></p>
<p><em>Rising intonation (↗):</em>
<li>Yes/No questions: "Are you <strong>coming</strong>?"</li>
<li>Checking understanding: "You mean <strong>now</strong>?"</li>
<li>Lists (before the last item): "I bought <strong>milk</strong>, <strong>bread</strong>, and <strong>eggs</strong>?"</li></p>
<p><em>Fall-rise (↘↗):</em>
<li>Uncertainty, reservation, implication:</li>
<li>"I <strong>suppose</strong> so." (but I'm not fully convinced)</li>
<li>"That's <strong>true</strong>." (but there's more to say)</li>
<li>"I <strong>like</strong> it." (with reservation — maybe not fully)</li></ul></p>
<p><strong>Linking and assimilation review:</strong></p>
<p><em>Linking /r/ (British English):</em>
"Media event" → "Medi<strong>a-r</strong>event"
"Law and order" → "Law<strong>r</strong>and order"</p>
<p><em>Linking /w/ and /j/:</em>
"Go on" → "Go<strong>w</strong>on"
"I am" → "I<strong>y</strong>am"</p>
<p><em>Assimilation:</em>
"Don't you" → "Don<strong>ch</strong>a"
"Would you" → "Wou<strong>j</strong>a"
"Last year" → "Las<strong>ch</strong>ear"
"Ten people" → "Te<strong>m</strong> people"</p>`,
    'Public Speaking Mastery — Keynotes and Panels': `<p><strong>Stage presence — the physical dimension:</strong></p>
<p><em>Open body language:</em>
<ul><li>Stand with feet shoulder-width apart (stable, confident)</li>
<li>Use purposeful gestures — illustrate your points with hands</li>
<li>Move deliberately — don't pace nervously, but don't stand frozen</li>
<li>Own the space — move to different areas for different points</li></p>
<p><em>Eye contact:</em>
<li>Scan the room in a "W" pattern (left front → right front → left back → right back → centre)</li>
<li>Hold contact for 3-5 seconds per person</li>
<li>In panels, make eye contact with other panelists when responding to them</li></p>
<p><em>Vocal variety:</em>
<li>Pace: Slow down for key points, speed up for excitement</li>
<li>Pause: The most powerful tool. After a key statement, pause for 3-5 seconds.</li>
<li>Volume: Lower for intimacy and tension, raise for emphasis</li>
<li>"The numbers tell a story. [pause] A story we cannot ignore."</li></p>
<p><strong>Audience engagement techniques:</strong></p>
<p><em>Opening hooks (30 seconds to capture attention):</em>
<li><strong>Startling statistic:</strong> "Every 40 seconds, someone in the world dies by suicide."</li>
<li><strong>Provocative question:</strong> "What if everything we believe about motivation is wrong?"</li>
<li><strong>Personal story:</strong> "Three years ago, I stood in an emergency room and watched a patient die from a preventable error."</li>
<li><strong>Contrast:</strong> "In 1990, it cost $3 billion to sequence one human genome. Today, it costs $200."</li></p>
<p><em>Maintaining engagement:</em>
<li>"Raise your hand if..." (physical participation)</li>
<li>"Imagine you're..." (mental participation)</li>
<li>"Turn to the person next to you and discuss..." (social participation)</li>
<li>"By a show of hands..." (quick polling)</li></p>
<p><strong>Impromptu speaking — the PREP method:</strong>
When asked an unexpected question:
<li><strong>P</strong>oint: State your main point immediately</li>
<li><strong>R</strong>eason: Give one reason</li>
<li><strong>E</strong>xample: Provide a concrete example</li>
<li><strong>P</strong>oint: Restate your main point</li></ul></p>
<p>Example: "What's your view on remote work?"
"<strong>Point:</strong> I believe hybrid models are the future. <strong>Reason:</strong> They balance productivity with collaboration. <strong>Example:</strong> Microsoft's research showed hybrid workers were both more productive and more satisfied. <strong>Point:</strong> Hybrid isn't a compromise — it's the optimal solution."</p>`,
    'Writing Policies, White Papers, and Proposals': `<p><strong>Policy document structure:</strong></p>
<p>1. <strong>Purpose statement:</strong> Why this policy exists
2. <strong>Scope:</strong> Who it applies to
3. <strong>Definitions:</strong> Key terms
4. <strong>Policy statement:</strong> The actual rules
5. <strong>Procedures:</strong> How to comply
6. <strong>Responsibilities:</strong> Who does what
7. <strong>Enforcement:</strong> Consequences of non-compliance
8. <strong>Review date:</strong> When it will be updated</p>
<p>Example (simplified): "It is the policy of [Organisation] that all employees complete cybersecurity training within 30 days of joining. The IT Department is responsible for delivering training. Non-compliance may result in suspension of system access. This policy will be reviewed annually."</p>
<p><strong>White paper — the authoritative report:</strong></p>
<p>Unlike marketing materials, white papers are:
<ul><li>Evidence-based, not promotional</li>
<li>Objective in tone (even if commissioned by a company)</li>
<li>Length: 6-12 pages typically</li>
<li>Structured with executive summary, problem analysis, solution, case studies</li></ul></p>
<p><em>White paper structure:</em>
1. <strong>Title page:</strong> Clear, professional
2. <strong>Executive summary:</strong> 1 page maximum — the only page some readers will read
3. <strong>Introduction:</strong> Problem context and significance
4. <strong>Current landscape:</strong> What's happening now, with data
5. <strong>Challenges:</strong> Specific problems to solve
6. <strong>Proposed solution:</strong> Evidence-based recommendations
7. <strong>Case studies/examples:</strong> Proof the solution works
8. <strong>Conclusion:</strong> Summary and call to action
9. <strong>References:</strong> Academic and professional sources</p>
<p><strong>Proposal — persuading decision-makers:</strong></p>
<p><em>Structure:</em>
1. <strong>Executive summary</strong> (write this LAST, but put it FIRST)
2. <strong>Background/Problem:</strong> What needs fixing
3. <strong>Proposed solution:</strong> What you recommend
4. <strong>Implementation plan:</strong> Timeline, resources, budget
5. <strong>Benefits:</strong> ROI, efficiency gains, risk reduction
6. <strong>Risk assessment:</strong> What could go wrong and mitigation
7. <strong>Conclusion:</strong> Clear recommendation</p>
<p><em>Key principle:</em> Decision-makers are busy. The executive summary must be sufficient on its own.</p>`,
    'Common C1-C2 Mistakes — The Final Polish': `<p><strong>Preposition errors at C1-C2:</strong></p>
<p>| Correct | Common error |
|---------|-------------|
| depend <strong>on</strong> | depend of |
| interested <strong>in</strong> | interested on |
| arrive <strong>at/in</strong> | arrive to |
| listen <strong>to</strong> | listen |
| talk <strong>to/with</strong> | talk |
| look <strong>forward to</strong> | look forward for |
| prevent <strong>from</strong> | prevent to |
| prohibit <strong>from</strong> | prohibit to |
| accuse <strong>of</strong> | accuse for |
| suspect <strong>of</strong> | suspect for |
| consists <strong>of</strong> | consists in |
| aware <strong>of</strong> | aware about |
| capable <strong>of</strong> | capable to |
| responsible <strong>for</strong> | responsible of |
| similar <strong>to</strong> | similar with |
| different <strong>from</strong> | different to/than (US: than is OK) |
| married <strong>to</strong> | married with |
| angry <strong>with</strong> (people) / angry <strong>at</strong> (situations) | angry against |
| good <strong>at</strong> | good in |
| bad <strong>at</strong> | bad in |
| afraid <strong>of</strong> | afraid from |</p>
<p><strong>Article subtleties:</strong></p>
<p>No article with:
<ul><li>Abstract nouns (general): "<strong>__</strong> love is powerful" BUT "<strong>The</strong> love I feel for you"</li>
<li>Institutions (general): "go to <strong>__</strong> hospital/prison/school/church" (as patient/prisoner/pupil/worshipper) vs. "go to <strong>the</strong> hospital" (as visitor)</li>
<li>Meals (general): "have <strong>__</strong> breakfast" BUT "<strong>The</strong> breakfast we had was excellent"</li>
<li>Languages: "speak <strong>__</strong> French" BUT "<strong>The</strong> French spoken in Canada..."</li>
<li>Sports/games: "play <strong>__</strong> football" BUT "<strong>The</strong> football match was exciting"</li>
<li>Days/months: "on <strong>__</strong> Monday" / "in <strong>__</strong> July"</li></ul></p>
<p><strong>Register slips to avoid:</strong></p>
<p>| Context | Too informal | Correct |
|---------|-------------|---------|
| Academic | "This essay will talk about..." | "This essay examines/argues/analyses..." |
| Academic | "a lot of" | "a significant number of," "a considerable amount of" |
| Academic | "get" | "obtain," "acquire," "receive" |
| Academic | "big problem" | "significant issue," "major challenge" |
| Academic | "things" | "factors," "aspects," "elements" |
| Professional | "I think..." | "I would suggest...," "It appears that..." |
| Professional | "sorry for the delay" | "please accept my apologies for the delay" |
| Professional | " ASAP" | "at your earliest convenience" |</p>`,
    'Grammar — Edge Cases and Exceptions': `<p><strong>The subjunctive mood:</strong></p>
<p>The subjunctive expresses hypothetical, desirable, or mandatory situations. It's rare in English but important at C2.</p>
<p><em>Formulaic subjunctive (fixed phrases):</em>
<ul><li>"God <strong>save</strong> the Queen" (not saves)</li>
<li>"Long <strong>live</strong> the King"</li>
<li>"God <strong>bless</strong> you"</li>
<li>"Come what <strong>may</strong>"</li>
<li>"Suffice it to <strong>say</strong>"</li></p>
<p><em>Mandative subjunctive (after certain verbs/adjectives):</em>
<li>"I <strong>suggest</strong> (that) he <strong>be</strong> informed immediately." (not "is")</li>
<li>"It is <strong>essential</strong> (that) she <strong>attend</strong> the meeting." (not "attends")</li>
<li>"They <strong>demanded</strong> (that) he <strong>leave</strong> at once." (not "leaves")</li></p>
<p><em>Verbs/adjectives triggering the subjunctive:</em>
suggest, recommend, demand, insist, propose, request, require, urge, advise, ask, command, order, prefer, propose, vital, essential, important, necessary, imperative, mandatory, crucial</p>
<p><em>Was vs. were (unreal conditional):</em>
<li>Formal: "If I <strong>were</strong> you..." / "I wish it <strong>were</strong> true."</li>
<li>Informal (increasingly accepted): "If I <strong>was</strong> you..."</li>
<li>At C2, use "were" in formal writing; "was" is acceptable in speech.</li></p>
<p><strong>Singular "they":</strong></p>
<p>"Someone left <strong>their</strong> laptop." — grammatically correct, increasingly standard.</p>
<p>Historical fact: Singular "they" has been in English since the 14th century (Chaucer, Shakespeare, Austen all used it). The "he" default is a 19th-century prescription, not a historical rule.</p>
<p>At C2: Use singular "they" confidently. It's natural, inclusive, and historically justified.</p>
<p><strong>Preposition stranding — ending sentences with prepositions:</strong></p>
<p>Winston Churchill (possibly apocryphally): "This is the sort of English up with which I will not put."</p>
<p>The rule "never end a sentence with a preposition" was imported from Latin grammar and doesn't fit English well.</p>
<p>Natural English:
<li>"What are you talking <strong>about</strong>?" (NOT "About what are you talking?")</li>
<li>"That's the person I was referring <strong>to</strong>."</li>
<li>"This is something I won't put up <strong>with</strong>."</li></p>
<p>At C2: Stranding prepositions is natural and correct. Avoiding it often creates awkward, unnatural sentences.</p>
<p><strong>Split infinitives:</strong></p>
<p>"To <strong>boldly</strong> go where no one has gone before." — This is fine.</p>
<p>The "rule" against split infinitives comes from Latin (where infinitives are one word and can't be split). English infinitives are two words ("to go") — splitting them is natural and often clearer.</p>
<p>Sometimes splitting is BETTER:
<li>"I decided to <strong>really</strong> try hard." (split = emphasis on "really")</li>
<li>"I decided <strong>really</strong> to try hard." (awkward — "really" seems to modify "decided")</li></ul></p>`,
    'Writing — Style Guides (APA, MLA, Chicago, Oxford)': `<p><strong>When to use which style guide:</strong></p>
<p>| Style | Discipline | Key feature |
|-------|-----------|-------------|
| <strong>APA</strong> (American Psychological Association) | Social sciences, psychology, education | Author-date in-text citations |
| <strong>MLA</strong> (Modern Language Association) | Humanities, literature, arts | Author-page in-text citations |
| <strong>Chicago</strong> | History, some social sciences | Footnotes or author-date |
| <strong>Oxford (OSCOLA)</strong> | Law | Footnotes, minimal bibliography |
| <strong>IEEE</strong> | Engineering, computer science | Numbered references |
| <strong>Harvard</strong> | General, business | Author-date (similar to APA) |</p>
<p><strong>Key differences — citations:</strong></p>
<p>| Element | APA 7th | MLA 9th | Chicago |
|---------|---------|---------|---------|
| In-text | (Smith, 2020, p. 45) | (Smith 45) | Footnote or (Smith 2020, 45) |
| Book ref | Smith, J. (2020). <em>Title</em>. Publisher. | Smith, John. <em>Title</em>. Publisher, 2020. | 1. John Smith, <em>Title</em> (Place: Publisher, 2020), 45. |
| Journal | Smith, J. (2020). Title. <em>Journal</em>, 5(2), 45-60. | Smith, John. "Title." <em>Journal</em>, vol. 5, no. 2, 2020, pp. 45-60. | Smith, "Title," <em>Journal</em> 5, no. 2 (2020): 45. |
| DOI/URL | https://doi.org/xxxxx | https://doi.org/xxxxx | Include if no page refs |</p>
<p><strong>Key differences — formatting:</strong></p>
<p>| Element | APA | MLA | Chicago |
|---------|-----|-----|---------|
| Title page | Required | Not always | Required |
| Running head | Page number only | Last name + page | Not required |
| Headings | 5 levels, bold | No strict system | Various systems |
| Numbers | Words for 0-9, numerals for 10+ | No strict rule | Words for 0-100 |
| Block quotes | 40+ words, indented | 4+ lines, indented | 5+ lines, indented |</p>
<p><strong>Common errors:</strong>
<ul><li>Mixing styles in one document</li>
<li>Inconsistent formatting of the same element</li>
<li>Missing elements (publisher, year, page numbers)</li>
<li>Incorrect use of italics vs. quotation marks</li>
<li>Not including DOI when available</li></ul></p>`,
    'Maintaining C2 — Continuous Improvement Strategies': `<p><strong>The C2 plateau — why learners get stuck:</strong></p>
<p>At lower levels, progress is visible: new tenses, new vocabulary. At C2, progress is SUBTLE: a slightly better choice of word, a more natural rhythm, a more precise register shift. This can feel like standing still.</p>
<p>You're not standing still. The work you're doing now is refinement, not acquisition.</p>
<p><strong>Deliberate practice for C2 maintenance:</strong></p>
<p><em>1. Extensive reading (30 min daily):</em>
<ul><li>Read what native professionals read: The Economist, The Atlantic, The New Yorker, Nature, Harvard Business Review</li>
<li>Read fiction: Pulitzer winners, Booker Prize shortlists</li>
<li>Read outside your comfort zone: if you're a scientist, read philosophy; if you're in business, read literary fiction</li></p>
<p><em>2. Active listening (20 min daily):</em>
<li>Podcasts: BBC World Service, NPR, TED talks, academic lectures</li>
<li>Vary accents: British, American, Australian, Indian, African English</li>
<li>Listen once for gist, again for language features</li></p>
<p><em>3. Production with feedback (weekly):</em>
<li>Write 500 words weekly — essays, reviews, journal entries</li>
<li>Speak for 10 minutes on a topic, record yourself, listen back</li>
<li>Get feedback from a native speaker or C2-level user</li>
<li>Join a speaking club, debate society, or Toastmasters</li></p>
<p><em>4. Vocabulary maintenance (10 min daily):</em>
<li>Read with a dictionary nearby — look up words you ALMOST know</li>
<li>Maintain a "precision notebook": words that are slightly better than what you usually use</li>
<li>Review collocations, not isolated words</li></p>
<p><em>5. Register flexibility (ongoing):</em>
<li>Practise writing the same idea in 3 registers: formal, neutral, informal</li>
<li>Notice register shifts in what you read and hear</li>
<li>Code-switch intentionally between contexts</li></p>
<p><strong>Warning signs of regression:</strong>
<li>You start simplifying your vocabulary unconsciously</li>
<li>You avoid complex structures you once used</li>
<li>You find yourself searching for words you used to know</li>
<li>Your accent slips back toward L1 patterns</li></ul></p>
<p>If you notice these: increase input immediately. Regression happens quickly; recovery takes longer.</p>`,
    'The Complete C2 Speaker — Final Integration': `<p><strong>What does "C2" really mean?</strong></p>
<p>The CEFR says a C2 speaker "can understand with ease virtually everything heard or read" and "can express themselves spontaneously, very fluently and precisely, differentiating finer shades of meaning even in more complex situations."</p>
<p>But here's what that looks like in practice:</p>
<p><em>A C2 speaker can:</em>
<ul><li>Understand a lecture on an unfamiliar topic, including humour, asides, and implied criticism</li>
<li>Read a 500-page novel and understand not just the plot but the subtext, symbolism, and authorial intent</li>
<li>Write a 3,000-word essay that's not just correct but compelling, with a distinctive voice</li>
<li>Participate in a heated debate, thinking on their feet, using rhetorical devices, and adapting their register moment by moment</li>
<li>Translate between English and their L1 at a professional level, handling nuance and cultural references</li>
<li>Switch between formal academic English and street slang without conscious effort</li></p>
<p><em>A C2 speaker cannot necessarily:</em>
<li>Know every word (no one does — English has 170,000+ words in active use)</li>
<li>Understand every regional accent immediately (some take exposure)</li>
<li>Never make a mistake (even native speakers make errors)</li></ul></p>
<p><strong>The C2 self-assessment:</strong></p>
<p>Rate yourself 1-5 on each:</p>
<p>| Skill | 1-2 (gap) | 3 (developing) | 4 (strong) | 5 (mastery) |
|-------|-----------|----------------|------------|-------------|
| Reading: academic papers | | | | |
| Reading: literary fiction | | | | |
| Listening: lectures | | | | |
| Listening: varied accents | | | | |
| Writing: formal essays | | | | |
| Writing: creative pieces | | | | |
| Speaking: presentations | | | | |
| Speaking: debate/argument | | | | |
| Register shifting | | | | |
| Cultural fluency | | | | |</p>
<p>Score: 40-50 = C2 mastery / 30-39 = C2 with gaps / Below 30 = C1+ working toward C2</p>
<p><strong>The three pillars of lifelong English mastery:</strong></p>
<p>1. <strong>Input:</strong> Never stop reading and listening widely. The day you stop inputting is the day you start regressing.</p>
<p>2. <strong>Output:</strong> Never stop producing. Writing and speaking are skills that atrophy without use.</p>
<p>3. <strong>Reflection:</strong> Regularly assess your own language. Record yourself. Read your old writing. Notice improvement and remaining gaps.</p>
<p><strong>Your C2 commitment:</strong></p>
<p>Complete this statement:
"I commit to maintaining my C2 English by [specific action] for [time period], because [reason]."</p>
<p>Example: "I commit to reading one long-form article daily for the next year, because I want to maintain the precision and breadth of vocabulary I've developed."</p>`,

    'All Tenses Review — Present, Past, and Future': `<p><strong>Present Tenses — side by side:</strong></p>
<p><strong>Key difference:</strong>
<li>"I <strong>live</strong> in Madrid." (permanent — present simple)</li>
<li>"I <strong>am living</strong> in Madrid." (temporary — present continuous)</li></p>
<p><strong>Past Tenses — side by side:</strong></p>
<p><strong>Future Forms — side by side:</strong></p>
<p><strong>Common tense mistakes:</strong>
<li>❌ "I am agree." → ✅ "I <strong>agree</strong>." (no continuous for state verbs)</li>
<li>❌ "I don't can swim." → ✅ "I <strong>can't</strong> swim."</li>
<li>❌ "Yesterday I go to the cinema." → ✅ "Yesterday I <strong>went</strong> to the cinema."</li>
<li>❌ "I will going to travel." → ✅ "I <strong>am going to travel</strong>." / "I <strong>will travel</strong>."</li></p>
<p><strong>Time marker words:</strong>
<li>Present simple: always, usually, every day, often, sometimes, never</li>
<li>Present continuous: now, at the moment, currently, this week</li>
<li>Past simple: yesterday, last week, ago, in 2019</li>
<li>Past continuous: while, when (for interrupted actions)</li>
<li>Future: tomorrow, next week, soon, tonight</li></p>`,
    'Articles and Quantifiers Masterclass': `<p><strong>A / An (indefinite articles — first mention, general):</strong>
<li>"I saw <strong>a</strong> film last night." (first mention — any film)</li>
<li>"She's <strong>an</strong> engineer." (profession)</li>
<li>"I'd like <strong>a</strong> coffee, please." (one — countable)</li>
<li>Use <strong>an</strong> before vowel sounds: <strong>an</strong> apple, <strong>an</strong> hour (silent h), <strong>an</strong> MBA</li>
<li>Use <strong>a</strong> before consonant sounds: <strong>a</strong> university (sounds like 'y'), <strong>a</strong> one-way street</li></p>
<p><strong>The (definite article — specific, known, unique):</strong>
<li>"<strong>The</strong> film I saw was brilliant." (second mention — we know which film)</li>
<li>"<strong>The</strong> sun is shining." (unique — only one sun)</li>
<li>"I live near <strong>the</strong> station." (specific station known to speaker and listener)</li>
<li>"<strong>The</strong> richest people live there." (superlative always uses "the")</li></p>
<p><strong>No article (zero article):</strong>
<li>Plural/general nouns: "I like <strong>__</strong> cats." (cats in general)</li>
<li>Uncountable nouns (general): "I love <strong>__</strong> music."</li>
<li>Meals: "I had <strong>__</strong> breakfast at 8."</li>
<li>Languages: "She speaks <strong>__</strong> French."</li>
<li>Days/months with "on/in": "on <strong>__</strong> Monday" / "in <strong>__</strong> July"</li></p>
<p><strong>Some vs. Any:</strong>
<li><strong>Some</strong> = positive sentences and offers/questions expecting "yes"</li>
  - "I have <strong>some</strong> free time." / "Would you like <strong>some</strong> coffee?"
<li><strong>Any</strong> = negative sentences and most questions</li>
  - "I don't have <strong>any</strong> money." / "Do you have <strong>any</strong> questions?"
<li>❌ "I don't have some money." → ✅ "I don't have <strong>any</strong> money."</li></p>
<p><strong>Much / Many / A lot of:</strong>
<li><strong>Much</strong> = uncountable (usually negative/question): "I don't have <strong>much</strong> time."</li>
<li><strong>Many</strong> = countable: "I don't have <strong>many</strong> friends here."</li>
<li><strong>A lot of / Lots of</strong> = both (informal, positive): "I have <strong>a lot of</strong> time/friends."</li>
<li>❌ "I have much time." (too formal/unnatural in positive) → ✅ "I have <strong>a lot of</strong> time."</li></p>`,
    'Prepositions of Time, Place, and Movement': `<p><strong>Time prepositions:</strong></p>
<p><strong>Place prepositions:</strong></p>
<p><strong>Transport prepositions:</strong>
<li><strong>by</strong> + transport (no article): <strong>by</strong> car, <strong>by</strong> bus, <strong>by</strong> plane, <strong>by</strong> bike, <strong>on</strong> foot</li>
<li><strong>in/on</strong> + article + transport: <strong>in</strong> a car, <strong>on</strong> the bus, <strong>on</strong> a plane</li></p>
<p><strong>Movement prepositions:</strong>
<li><strong>into</strong> = in + to (entering): "She walked <strong>into</strong> the room."</li>
<li><strong>out of</strong> = exiting: "He got <strong>out of</strong> the taxi."</li>
<li><strong>onto</strong> = on + to: "The cat jumped <strong>onto</strong> the table."</li>
<li><strong>across</strong> = from one side to another: "We walked <strong>across</strong> the bridge."</li>
<li><strong>through</strong> = from one end to another: "The train went <strong>through</strong> the tunnel."</li>
<li><strong>along</strong> = following a line: "We walked <strong>along</strong> the river."</li>
<li><strong>up/down</strong> = direction: "She ran <strong>up</strong> the stairs."</li></p>`,
    'Question Formation and Tag Questions': `<p><strong>Yes/No questions (auxiliary + subject + verb):</strong>
<li>"<strong>Do</strong> you like coffee?" / "<strong>Did</strong> she call you?"</li>
<li>"<strong>Are</strong> they coming?" / "<strong>Have</strong> you finished?"</li>
<li>"<strong>Can</strong> he swim?" / "<strong>Will</strong> it rain?"</li></p>
<p><strong>Wh- questions:</strong></p>
<p><strong>Question word order:</strong>
Wh-word + auxiliary + subject + verb:
<li>"<strong>Where does</strong> she <strong>work</strong>?" (NOT "Where she works?")</li>
<li>"<strong>What did</strong> you <strong>do</strong> yesterday?"</li>
<li>"<strong>How long have</strong> you <strong>lived</strong> here?"</li></p>
<p><strong>Tag questions — mini questions at the end:</strong>
<li>Positive statement → <strong>negative tag</strong>: "You're English, <strong>aren't you</strong>?"</li>
<li>Negative statement → <strong>positive tag</strong>: "You don't like coffee, <strong>do you</strong>?"</li>
<li>Use the same auxiliary as the main sentence</li></p>
<p><strong>Common tag questions:</strong>
<li>"It's cold today, <strong>isn't it</strong>?"</li>
<li>"You've been here before, <strong>haven't you</strong>?"</li>
<li>"He can swim, <strong>can't he</strong>?"</li>
<li>"They won't be late, <strong>will they</strong>?"</li>
<li>"Let's go, <strong>shall we</strong>?"</li>
<li>"Don't forget, <strong>will you</strong>?"</li></p>
<p><strong>Intonation matters:</strong>
<li>Falling intonation (↘) = I'm sure, just making conversation</li>
<li>Rising intonation (↗) = I'm really asking, I don't know the answer</li></p>`,
    'Modal Verbs — Can, Could, Should, Must, Have To': `<p><strong>Modal verbs have NO "to" after them and NO "-s" in third person:</strong>
<li>❌ "She <strong>cans</strong> swim." → ✅ "She <strong>can</strong> swim."</li>
<li>❌ "I <strong>must to</strong> go." → ✅ "I <strong>must</strong> go."</li></p>
<p><strong>Ability:</strong>
<li><strong>Can</strong> (present ability): "I <strong>can</strong> swim."</li>
<li><strong>Could</strong> (past ability): "I <strong>could</strong> swim when I was five."</li>
<li><strong>Be able to</strong> (future/other tenses): "I <strong>will be able to</strong> help you tomorrow."</li></p>
<p><strong>Permission:</strong>
<li><strong>Can</strong> (informal): "<strong>Can</strong> I use your phone?"</li>
<li><strong>Could</strong> (more polite): "<strong>Could</strong> I borrow your pen?"</li>
<li><strong>May</strong> (very formal): "<strong>May</strong> I come in?"</li></p>
<p><strong>Advice:</strong>
<li><strong>Should</strong> / <strong>Shouldn't</strong>: "You <strong>should</strong> see a doctor." / "You <strong>shouldn't</strong> eat so late."</li>
<li><strong>Ought to</strong>: "You <strong>ought to</strong> apologise." (slightly more formal)</li>
<li><strong>Could</strong>: "You <strong>could</strong> try restarting it." (suggestion)</li></p>
<p><strong>Obligation (necessity):</strong>
<li><strong>Must</strong> (strong, speaker's opinion): "I <strong>must</strong> finish this today." (I think it's necessary)</li>
<li><strong>Have to</strong> (external obligation): "I <strong>have to</strong> wear a uniform." (the rule says so)</li>
<li><strong>Mustn't</strong> vs. <strong>Don't have to</strong> (VERY IMPORTANT):</li>
  - "You <strong>mustn't</strong> smoke here." = <strong>Prohibition</strong> (it's not allowed)
  - "You <strong>don't have to</strong> come." = <strong>No obligation</strong> (you can if you want, but it's not necessary)</p>`,
    'Describing Processes and Instructions': `<p><strong>Imperatives (giving instructions — no subject needed):</strong>
<li>"<strong>Mix</strong> the flour and water."</li>
<li>"<strong>Press</strong> the red button."</li>
<li>"<strong>Turn left</strong> at the traffic lights."</li>
<li>For negative instructions: "<strong>Don't touch</strong> the oven." / "<strong>Do not</strong> open."</li>
<li>Polite imperatives: "<strong>Please fill in</strong> the form." / "<strong>Kindly wait</strong> here."</li></p>
<p><strong>Sequencing words:</strong></p>
<p><strong>Passives for formal instructions:</strong>
<li>"The mixture <strong>should be stirred</strong> continuously."</li>
<li>"The form <strong>must be completed</strong> in black ink."</li>
<li>"Your password <strong>will be sent</strong> to your email."</li></p>
<p><strong>Checking understanding:</strong>
<li>"Is that clear?"</li>
<li>"Do you follow?"</li>
<li>"Should I go over that again?"</li>
<li>"Any questions so far?"</li></p>`,
    'Asking for Clarification and Repetition': `<p><strong>When you don't hear or understand:</strong></p>
<p><em>Polite (formal):</em>
<li>"I'm sorry, could you repeat that, please?"</li>
<li>"I beg your pardon?"</li>
<li>"Sorry, I didn't catch that."</li>
<li>"Could you say that again, please?"</li></p>
<p><em>Casual (friends):</em>
<li>"Sorry, what?"</li>
<li>"Say that again?"</li>
<li>"Huh?" (very informal — use carefully)</li>
<li>"You what?" (British, informal)</li></p>
<p><strong>When you need them to speak slower:</strong>
<li>"Could you speak a bit more slowly, please?"</li>
<li>"I'm still learning English. Could you slow down a little?"</li>
<li>"Sorry, my English isn't very good. Could you say that more simply?"</li></p>
<p><strong>When you don't understand a word:</strong>
<li>"What does ______ mean?"</li>
<li>"Sorry, I'm not familiar with that word."</li>
<li>"Could you explain what ______ means?"</li>
<li>"Is ______ similar to ______?"</li></p>
<p><strong>When you want to confirm you understood:</strong>
<li>"So, you're saying that... Is that right?"</li>
<li>"If I've understood correctly, you mean..."</li>
<li>"Just to confirm, you want me to..."</li>
<li>"Let me make sure I've got this. You said..."</li></p>
<p><strong>Paraphrasing (saying it in your own words):</strong>
<li>"So basically, you want me to arrive at 9 instead of 10?"</li>
<li>"In other words, the meeting is cancelled?"</li></p>`,
    'Social Media and Modern Communication': `<p><strong>Common texting abbreviations:</strong></p>
<p><strong>Social media vocabulary:</strong>
<li><strong>post</strong> (n/v): "I saw your <strong>post</strong> about the holiday." / "Did you <strong>post</strong> the photo?"</li>
<li><strong>share</strong>: "Please <strong>share</strong> this with your friends."</li>
<li><strong>like</strong>: "I got 200 <strong>likes</strong> on my photo!"</li>
<li><strong>comment</strong>: "She left a nice <strong>comment</strong> on my post."</li>
<li><strong>follow/follower</strong>: "I have 500 <strong>followers</strong> on Instagram."</li>
<li><strong>story</strong>: "I put it on my <strong>story</strong>."</li>
<li><strong>go viral</strong>: "Her video <strong>went viral</strong> — 10 million views!"</li>
<li><strong>scroll</strong>: "I was just <strong>scrolling</strong> through TikTok."</li>
<li><strong>unfriend/unfollow</strong>: "I <strong>unfollowed</strong> him because his posts are annoying."</li>
<li><strong>block</strong>: "She <strong>blocked</strong> me after our argument."</li></p>
<p><strong>Online etiquette (netiquette):</strong>
<li>Don't write in ALL CAPS — it looks like shouting</li>
<li>Use emojis to show tone, but not too many in formal contexts 😊</li>
<li>Reply to messages within a reasonable time</li>
<li>Don't share other people's photos without asking</li>
<li>Be careful what you post — it stays online forever</li></p>`,
    'Talking About Goals and Ambitions': `<p><strong>Structures for goals and ambitions:</strong></p>
<p><em>Want to / Would like to (desires):</em>
<li>"I <strong>want to</strong> travel the world."</li>
<li>"I <strong>would like to</strong> learn Japanese." (more polite/soft)</li></p>
<p><em>Plan to / Intend to (intentions):</em>
<li>"I <strong>plan to</strong> start my own business."</li>
<li>"I <strong>intend to</strong> finish my degree next year."</li></p>
<p><em>Hope to / Dream of (aspirations):</em>
<li>"I <strong>hope to</strong> get promoted this year."</li>
<li>"I <strong>dream of</strong> becoming a famous writer." (dream of + verb-ing)</li></p>
<p><em>Aim to / Goal is to (targets):</em>
<li>"My <strong>aim is to</strong> save enough money to buy a house."</li>
<li>"Our <strong>goal is to</strong> double sales by 2026."</li></p>
<p><em>Would love to (enthusiastic desire):</em>
<li>"I <strong>would love to</strong> work abroad someday."</li>
<li>"She <strong>would love to</strong> meet her favourite singer."</li></p>
<p><strong>Time frames:</strong>
<li>Short-term: "In the near future..." / "This year, I want to..."</li>
<li>Medium-term: "In the next few years..." / "By 2027, I plan to..."</li>
<li>Long-term: "Eventually, I hope to..." / "In the long run, my dream is to..."</li>
<li>Lifelong: "I've always wanted to..." / "My ultimate ambition is to..."</li></p>`,
    'Listening Practice — Conversations and Announcements': `<p><strong>Two types of listening:</strong></p>
<p><em>Listening for gist (general understanding):</em>
<li>What is the conversation about?</li>
<li>Who is speaking? Where are they?</li>
<li>What is the main point?</li>
<li>You don't need to understand every word — just the overall meaning</li></p>
<p><em>Listening for detail (specific information):</em>
<li>What time does the train leave?</li>
<li>How much does it cost?</li>
<li>What gate number?</li>
<li>Focus on numbers, times, names, and key facts</li></p>
<p><strong>Common announcement types and key phrases:</strong></p>
<p><em>At the airport:</em>
<li>"Flight BA284 <strong>to</strong> London Heathrow <strong>is now boarding</strong> at Gate 14."</li>
<li>"Would passenger Smith please <strong>proceed to</strong> Gate 12 immediately."</li>
<li>"This is the <strong>final call</strong> for Flight EZY205 to Berlin."</li>
<li>"Due to <strong>adverse weather conditions</strong>, all flights are delayed."</li>
<li>"Passengers are reminded <strong>not to leave</strong> luggage unattended."</li></p>
<p><em>At the train station:</em>
<li>"The 14:30 service <strong>to</strong> Manchester Piccadilly <strong>will depart from</strong> Platform 4."</li>
<li>"We <strong>apologise for</strong> the delay to the 15:45 service."</li>
<li>"This train <strong>terminates at</strong> London Victoria."</li>
<li>"Please <strong>mind the gap</strong> between the train and the platform."</li></p>
<p><em>In shops/restaurants:</em>
<li>"<strong>Closing in</strong> 15 minutes. Please bring your items to the checkout."</li>
<li>"<strong>Today's special</strong> is grilled salmon with vegetables."</li>
<li>"Table 5, your order <strong>is ready</strong>."</li></p>
<p><strong>Active listening strategies:</strong>
1. <strong>Predict:</strong> Before listening, think about what you might hear
2. <strong>Listen for keywords:</strong> Don't try to understand every word
3. <strong>Infer from context:</strong> Use what you already know to fill gaps
4. <strong>Take notes:</strong> Write down numbers, names, and times
5. <strong>Don't panic if you miss something:</strong> Keep listening — the answer might come later</p>`,

  },

  vocabulary: {
    'Common Phrases': `<h3>Essential Greeting Phrases</h3>
<p>The vocabulary in this lesson focuses on the most frequently used phrases in English greetings and introductions. These expressions appear in everyday conversation, from casual encounters to formal business meetings. Mastering them will give you confidence in any social situation.</p>
<p>Each phrase below includes its typical context — whether it is formal, informal, or neutral. Pay special attention to the difference between <strong>"How do you do?"</strong> (very formal, used for first meetings) and <strong>"How's it going?"</strong> (very casual, used with friends). Using the wrong register can create an awkward impression.</p>
<p>Practice these phrases by role-playing different scenarios: meeting a new colleague, greeting a neighbor, or introducing yourself at a party. The more you use them, the more natural they will feel. Remember that body language — eye contact, a smile, and a handshake — accompanies these phrases and completes the greeting.</p>`,

    'Everyday Activities': `<h3>Words for Your Daily Life</h3>
<p>This vocabulary lesson covers the essential words for describing daily routines. From the moment your alarm goes off to when you turn off the lights at night, every action has a name in English. Learning these words allows you to describe your day to others and understand their descriptions in return.</p>
<p>Notice that English uses specific verbs with specific activities: you <strong>"brush"</strong> your teeth, <strong>"make"</strong> your bed, <strong>"have"</strong> breakfast, and <strong>"catch"</strong> the bus. These verb-noun combinations, called <strong>collocations</strong>, are fixed expressions that native speakers use automatically. Learning them as pairs is more effective than learning the words separately.</p>
<p>Try writing out your entire daily routine using the new vocabulary. Then compare it with a partner's routine. Describing differences — <strong>"I take the bus, but she drives"</strong> — reinforces the vocabulary and gives you valuable speaking practice.</p>`,

    'Ordering Food': `<h3>Restaurant and Food Vocabulary</h3>
<p>Knowing the right words at a restaurant makes dining out a pleasure rather than a challenge. This lesson covers the essential vocabulary for ordering food, understanding menus, and interacting with restaurant staff. From <strong>appetizers</strong> to <strong>dessert</strong>, each course has its own terminology.</p>
<p>Menus often use cooking terms that may be unfamiliar: <strong>grilled</strong> (cooked over direct heat), <strong>braised</strong> (cooked slowly in liquid), <strong>poached</strong> (cooked gently in simmering water), and <strong>roasted</strong> (cooked in an oven). Understanding these terms helps you choose dishes you will enjoy.</p>
<p>Restaurant vocabulary also includes words for the dining experience itself: <strong>reservation</strong>, <strong>warning</strong>, <strong>tip</strong>, <strong>bill</strong>, and <strong>takeaway</strong>. Knowing these terms ensures you can handle any situation, from booking a table to paying the check.</p>`,

    'At the Store': `<h3>Shopping Vocabulary Essentials</h3>
<p>Shopping vocabulary goes beyond simple product names. This lesson teaches you the words you need to navigate any store, from asking for help to completing your purchase. Key categories include store layout (<strong>aisle</strong>, <strong>shelf</strong>, <strong>checkout</strong>), payment terms (<strong>cash</strong>, <strong>card</strong>, <strong>receipt</strong>), and product descriptions (<strong>organic</strong>, <strong>brand</strong>, <strong>special offer</strong>).</p>
<p>In clothing stores, additional vocabulary includes <strong>fitting room</strong>, <strong>size</strong>, <strong>color</strong>, and <strong>material</strong>. When something does not fit, you might ask <strong>"Do you have this in a smaller/larger size?"</strong> or <strong>"Do you have this in blue?"</strong> Being able to make these requests confidently transforms the shopping experience.</p>
<p>Understanding pricing terms is equally important. Words like <strong>discount</strong>, <strong>sale</strong>, <strong>clearance</strong>, and <strong>refund</strong> help you navigate promotions and handle returns. If something is wrong with your purchase, knowing how to say <strong>"I'd like to return this"</strong> or <strong>"Can I exchange this for a different one?"</strong> is essential.</p>`,

    'Asking for Directions': `<h3>Navigation and Direction Words</h3>
<p>This vocabulary lesson covers the essential words for navigating an English-speaking city. From basic direction words (<strong>left</strong>, <strong>right</strong>, <strong>straight</strong>) to more complex terms like <strong>intersection</strong>, <strong>roundabout</strong>, and <strong>landmark</strong>, these words appear constantly in travel and daily life situations.</p>
<p>Prepositions of place are crucial for giving and understanding directions. <strong>"Next to"</strong>, <strong>"opposite"</strong>, <strong>"between"</strong>, <strong>"behind"</strong>, and <strong>"in front of"</strong> describe where things are relative to each other. Practice by describing the location of buildings near your home using these prepositions.</p>
<p>Transport vocabulary is also covered: <strong>bus stop</strong>, <strong>train station</strong>, <strong>subway</strong>, <strong>taxi rank</strong>, and <strong>parking lot</strong>. Knowing these terms helps you follow directions and find your way in any English-speaking city.</p>`,

    'At the Doctor': `<h3>Health and Medical Vocabulary</h3>
<p>Medical vocabulary is essential for anyone living in or visiting an English-speaking country. This lesson covers body parts, common symptoms, and medical terms you will encounter at a doctor's office or pharmacy. From <strong>headache</strong> and <strong>fever</strong> to <strong>prescription</strong> and <strong>side effects</strong>, these words help you communicate your health needs clearly.</p>
<p>Describing pain accurately is particularly important. English uses different adjectives for different types of pain: a <strong>sharp</strong> pain (sudden and intense), a <strong>dull</strong> ache (continuous but not severe), a <strong>throbbing</strong> pain (pulsating), and a <strong>burning</strong> sensation (hot and stinging). Giving your doctor this detail helps them diagnose your condition more accurately.</p>
<p>Pharmacy vocabulary includes <strong>over-the-counter</strong> medicine (available without a prescription), <strong>dosage</strong> (the amount to take), and <strong>refill</strong> (getting more of a prescription medicine). Understanding these terms ensures you follow treatment instructions correctly.</p>`,

    'Describing Your Home': `<h3>Home and Household Vocabulary</h3>
<p>This lesson expands your vocabulary for describing homes and household items. From the structure of a house (<strong>roof</strong>, <strong>wall</strong>, <strong>floor</strong>, <strong>ceiling</strong>) to the furniture within each room (<strong>sofa</strong>, <strong>wardrobe</strong>, <strong>countertop</strong>, <strong>bookshelf</strong>), these words enable you to paint a detailed picture of any living space.</p>
<p>Room-specific vocabulary is important: the <strong>kitchen</strong> contains appliances and cookware, the <strong>bathroom</strong> has fixtures and toiletries, and the <strong>bedroom</strong> features bedding and storage furniture. Learning these words in context — by room — makes them easier to remember and use naturally.</p>
<p>Descriptive adjectives bring your descriptions to life. Instead of saying <strong>"a nice room"</strong>, try <strong>"a cozy, well-lit room with comfortable furniture."</strong> Adjectives like <strong>spacious</strong>, <strong>compact</strong>, <strong>modern</strong>, <strong>traditional</strong>, <strong>bright</strong>, and <strong>quiet</strong> help listeners visualize exactly what you are describing.</p>`,

    'Talking About Weather': `<h3>Weather Vocabulary Beyond the Basics</h3>
<p>English has an unusually rich vocabulary for describing weather — a reflection of its importance in British and American culture. This lesson moves beyond basic terms like <strong>hot</strong> and <strong>cold</strong> to more nuanced expressions: <strong>drizzle</strong> (very light rain), <strong>overcast</strong> (completely cloudy), <strong>humid</strong> (moist air), and <strong>breezy</strong> (gentle wind).</p>
<p>Idiomatic weather expressions add color to your English. <strong>"Under the weather"</strong> means feeling ill. <strong>"A storm in a teacup"</strong> describes an overreaction. <strong>"Break the ice"</strong> has nothing to do with temperature — it means to start a conversation. These idioms are common in everyday speech and make your English sound more natural.</p>
<p>Seasonal vocabulary includes terms for extreme weather: <strong>heatwave</strong>, <strong>blizzard</strong>, <strong>thunderstorm</strong>, <strong>tornado</strong>, and <strong>drought</strong>. Understanding these terms is important for personal safety, as weather warnings in English-speaking countries use this specific vocabulary.</p>`,

    // Intermediate Vocabulary
    'Career Vocabulary': `<h3>Professional English for the Workplace</h3>
<p>This lesson covers the vocabulary you need to navigate professional environments in English. From job titles and department names to performance review language and office communication, these words appear constantly in the workplace. Understanding them is essential for career advancement in any English-speaking organization.</p>
<p>Key categories include <strong>hiring terms</strong> (recruitment, candidate, interview, offer), <strong>workplace dynamics</strong> (collaboration, delegation, feedback, deadline), and <strong>career development</strong> (promotion, mentorship, networking, skill set). Each category builds on everyday English but uses words in specific professional contexts that may differ from their general meanings.</p>
<p>Professional communication also has its own register. Words like <strong>"facilitate"</strong>, <strong>"leverage"</strong>, <strong>"streamline"</strong>, and <strong>"synergy"</strong> are common in business contexts but rare in casual conversation. Learning when and how to use these terms appropriately is a mark of professional fluency.</p>`,

    'Academic Vocabulary': `<h3>The Language of Learning</h3>
<p>Academic English differs from everyday English in its precision, formality, and complexity. This lesson introduces the vocabulary commonly found in textbooks, lectures, research papers, and academic discussions. Words like <strong>hypothesis</strong>, <strong>methodology</strong>, <strong>analysis</strong>, and <strong>conclusion</strong> form the backbone of academic discourse.</p>
<p>The <strong>Academic Word List (AWL)</strong> — a collection of 570 word families that appear frequently across academic texts — is a valuable resource. Words on this list include <strong>approach</strong>, <strong>concept</strong>, <strong>context</strong>, <strong>framework</strong>, and <strong>perspective</strong>. Learning these words significantly improves reading comprehension in academic settings.</p>
<p>Academic vocabulary also includes <strong>reporting verbs</strong> used to reference sources: <strong>argue</strong>, <strong>claim</strong>, <strong>suggest</strong>, <strong>demonstrate</strong>, and <strong>contend</strong>. Each verb carries a different level of certainty and commitment, allowing writers to precisely position themselves relative to the ideas they discuss.</p>`,

    'Tech Vocabulary': `<h3>The Language of the Digital Age</h3>
<p>Technology vocabulary has become essential in modern English. This lesson covers terms related to computing, the internet, software, and digital communication. From basic concepts like <strong>download</strong> and <strong>upload</strong> to more advanced terms like <strong>encryption</strong>, <strong>algorithm</strong>, and <strong>cloud computing</strong>, these words appear in both professional and casual contexts.</p>
<p>Cybersecurity vocabulary is increasingly important: <strong>phishing</strong> (fraudulent attempts to obtain sensitive information), <strong>malware</strong> (malicious software), <strong>firewall</strong> (a security system), and <strong>two-factor authentication</strong> (an extra layer of account protection). Understanding these terms helps you protect yourself online and discuss digital security knowledgeably.</p>
<p>Tech idioms have entered everyday English: <strong>"That went viral"</strong> (spread rapidly online), <strong>"Let me Google that"</strong> (search for information), <strong>"I'm not tech-savvy"</strong> (not skilled with technology), and <strong>"It's glitchy"</strong> (not working properly). These expressions reflect how deeply technology has permeated daily life.</p>`,

    'Relationship Vocabulary': `<h3>Words That Connect Us</h3>
<p>Describing relationships in English requires nuanced vocabulary that captures different levels of closeness, commitment, and connection. From <strong>acquaintance</strong> (someone you barely know) to <strong>soulmate</strong> (a deeply connected partner), the words you choose signal the nature and depth of a relationship.</p>
<p>Verbs of interaction are equally important: you <strong>befriend</strong> someone, <strong>confide in</strong> a trusted friend, <strong>reconcile with</strong> someone after a disagreement, and <strong>drift apart</strong> from someone gradually. These phrases describe the dynamic nature of relationships over time, capturing how connections strengthen, change, or fade.</p>
<p>Conflict vocabulary includes <strong>misunderstanding</strong>, <strong>disagreement</strong>, <strong>argument</strong>, <strong>falling out</strong>, and <strong>estrangement</strong>. Knowing how to describe conflicts — and their resolutions — is essential for discussing personal experiences and understanding relationship dynamics in literature and media.</p>`,

    'Culture Vocabulary': `<h3>Understanding Cultural Expression</h3>
<p>Cultural vocabulary encompasses the terms used to discuss art, music, film, literature, traditions, and social customs. This lesson covers words that help you analyze and appreciate cultural products while understanding their social significance. Terms like <strong>heritage</strong>, <strong>tradition</strong>, <strong>ritual</strong>, <strong>cultural norms</strong>, and <strong>diversity</strong> are fundamental to these discussions.</p>
<p>When discussing entertainment, specific vocabulary signals sophistication: <strong>"The cinematography was stunning"</strong> rather than <strong>"The pictures were nice"</strong>; <strong>"The narrative structure was unconventional"</strong> rather than <strong>"The story was weird"</strong>. These distinctions matter in academic and professional contexts where precision is valued.</p>
<p>Cross-cultural vocabulary includes terms for cultural phenomena: <strong>globalization</strong>, <strong>cultural appropriation</strong>, <strong>soft power</strong>, <strong>assimilation</strong>, and <strong>cultural exchange</strong>. Understanding these concepts enables meaningful participation in discussions about culture in an interconnected world.</p>`,

    'Environmental Vocabulary': `<h3>The Language of Our Planet</h3>
<p>Environmental vocabulary has become essential for understanding news, policy debates, and scientific discussions about the natural world. This lesson covers terms from <strong>biodiversity</strong> (the variety of life in an ecosystem) to <strong>carbon footprint</strong> (the total greenhouse gases produced by a person or organization).</p>
<p>Key environmental concepts include <strong>sustainability</strong> (using resources at a rate that allows them to replenish), <strong>conservation</strong> (protecting natural resources), <strong>renewable energy</strong> (power from sources that do not deplete), and <strong>ecosystem services</strong> (the benefits humans receive from nature, such as clean water and pollination). These terms appear regularly in policy documents and media coverage.</p>
<p>Climate-specific vocabulary includes <strong>greenhouse effect</strong>, <strong>global warming</strong>, <strong>sea level rise</strong>, <strong>ocean acidification</strong>, and <strong>deforestation</strong>. Understanding these terms allows you to follow scientific reports and participate in discussions about one of the defining challenges of our era.</p>`,

    'Media Vocabulary': `<h3>Decoding the News</h3>
<p>Media literacy requires understanding the specialized vocabulary of journalism and news production. This lesson covers terms that describe how news is created, presented, and consumed. From <strong>headline</strong> and <strong>byline</strong> to <strong>editorial</strong> and <strong>op-ed</strong>, these words help you navigate the landscape of English-language media.</p>
<p>Understanding bias-related vocabulary is crucial: <strong>spin</strong> (presenting information to favor a particular viewpoint), <strong>framing</strong> (how a story is contextualized), <strong>sensationalism</strong> (exaggerating stories for attention), and <strong>clickbait</strong> (misleading headlines designed to attract clicks). Recognizing these techniques makes you a more critical consumer of news.</p>
<p>Digital media terms include <strong>viral</strong> (spreading rapidly online), <strong>trending</strong> (currently popular), <strong>echo chamber</strong> (an environment where existing views are reinforced), and <strong>algorithm</strong> (the automated system that determines what content you see). These concepts shape how information flows in the modern world.</p>`,

    'Legal Vocabulary': `<h3>Understanding the Language of Law</h3>
<p>Legal English is notoriously complex, but understanding its basic vocabulary is essential for anyone interacting with the legal system in an English-speaking country. This lesson introduces key terms that appear in contracts, court proceedings, and everyday discussions about rights and responsibilities.</p>
<p>Fundamental legal terms include <strong>plaintiff</strong> (the person bringing a case), <strong>defendant</strong> (the person being accused or sued), <strong>verdict</strong> (the decision), <strong>appeal</strong> (requesting a higher court to review the decision), and <strong>statute</strong> (a written law passed by a legislature). These words appear constantly in legal contexts and news reporting about court cases.</p>
<p>Contract vocabulary is equally important: <strong>clause</strong> (a specific provision), <strong>breach</strong> (violation of terms), <strong>liability</strong> (legal responsibility), <strong>indemnify</strong> (compensate for loss), and <strong>null and void</strong> (having no legal effect). Understanding these terms protects your interests when signing agreements.</p>`,

    'Art Vocabulary': `<h3>The Language of Creative Expression</h3>
<p>Discussing art in English requires vocabulary that moves beyond simple descriptions of liking or disliking. This lesson provides the terminology for analyzing, evaluating, and appreciating creative works across visual art, music, literature, and performance. From <strong>composition</strong> to <strong>perspective</strong>, these words help you articulate your response to art with precision.</p>
<p>Visual art terms include <strong>medium</strong> (the materials used), <strong>texture</strong> (surface quality), <strong>contrast</strong> (difference between elements), <strong>balance</strong> (visual equilibrium), and <strong>perspective</strong> (the technique of creating depth). These concepts allow you to discuss what you see in a painting, photograph, or sculpture with specificity and insight.</p>
<p>Performance and music vocabulary covers <strong>choreography</strong>, <strong>improvisation</strong>, <strong>tempo</strong>, <strong>harmony</strong>, and <strong>resonance</strong>. Whether reviewing a concert, describing a dance performance, or analyzing a film, these terms give your observations depth and credibility.</p>`,

    'Innovation Vocabulary': `<h3>Words for the Future</h3>
<p>Innovation vocabulary helps you discuss the technologies, ideas, and trends shaping the future. This lesson covers terms from <strong>disruption</strong> (a radical change in an industry) to <strong>scalability</strong> (the ability to grow without losing quality). Understanding these words is essential for engaging with conversations about technology, business, and social change.</p>
<p>Startup and entrepreneurship vocabulary includes <strong>venture capital</strong> (funding for early-stage companies), <strong>pivot</strong> (a fundamental change in strategy), <strong>prototype</strong> (an early version of a product), and <strong>minimum viable product</strong> (the simplest version that can test a concept). These terms dominate discussions in the technology sector.</p>
<p>Emerging technology vocabulary covers <strong>artificial intelligence</strong>, <strong>machine learning</strong>, <strong>blockchain</strong>, <strong>quantum computing</strong>, and <strong>biotechnology</strong>. While the technical details of these fields are complex, the vocabulary for discussing their implications and applications is accessible and increasingly important for informed public discourse.</p>`,

    // Advanced Vocabulary
    'Political Vocabulary': `<h3>The Language of Power and Governance</h3>
<p>Political vocabulary in English is precise and heavily nuanced, reflecting the complexity of governance and international relations. This lesson covers the terms essential for understanding political discourse, from <strong>sovereignty</strong> (a state's authority over its own affairs) to <strong>hegemony</strong> (dominance of one group over others). These words appear in diplomatic statements, policy analysis, and news commentary.</p>
<p>Electoral vocabulary includes <strong>constituency</strong> (the area a politician represents), <strong>suffrage</strong> (the right to vote), <strong>gerrymandering</strong> (manipulating electoral boundaries for political advantage), and <strong>mandate</strong> (the authority granted by an election victory). Understanding these terms is crucial for following elections and political debates in English-speaking countries.</p>
<p>Diplomatic language deliberately uses <strong>hedging</strong> and <strong>euphemism</strong>. <strong>"Express concern"</strong> means disapprove mildly; <strong>"take appropriate measures"</strong> may mean military action; <strong>"frank and candid exchange"</strong> often means a disagreement. Recognizing these coded expressions is essential for accurate interpretation of diplomatic communications.</p>`,

    'Philosophy Vocabulary': `<h3>The Lexicon of Deep Thinking</h3>
<p>Philosophical vocabulary allows you to engage with fundamental questions about existence, knowledge, morality, and meaning. This lesson covers essential terms from epistemology (the study of knowledge), ethics (the study of morality), metaphysics (the study of reality), and logic (the study of valid reasoning).</p>
<p>Key terms include <strong>epistemology</strong> (how we know what we know), <strong>ontology</strong> (the nature of being), <strong>teleology</strong> (purpose or goal-directedness), and <strong>pragmatism</strong> (judging ideas by their practical consequences). Each term represents a distinct way of approaching philosophical questions and has influenced centuries of intellectual tradition.</p>
<p>Ethical vocabulary includes <strong>deontology</strong> (duty-based ethics), <strong>consequentialism</strong> (outcome-based ethics), <strong>virtue ethics</strong> (character-based ethics), and <strong>utilitarianism</strong> (maximizing overall happiness). Understanding these frameworks helps you analyze moral arguments and articulate your own ethical positions with precision.</p>`,

    'Scientific Vocabulary': `<h3>The Precision of Scientific Language</h3>
<p>Scientific English is characterized by precision, objectivity, and standardized terminology. This lesson covers the vocabulary essential for reading research papers, understanding scientific news, and participating in evidence-based discussions. From <strong>hypothesis</strong> and <strong>variable</strong> to <strong>peer review</strong> and <strong>replication</strong>, these terms form the backbone of scientific discourse.</p>
<p>Statistical vocabulary is particularly important: <strong>correlation</strong> (a relationship between variables), <strong>causation</strong> (one variable directly affects another), <strong>significance</strong> (results unlikely to be due to chance), and <strong>sample size</strong> (the number of observations). Misunderstanding these terms leads to common errors in interpreting scientific findings.</p>
<p>Research methodology terms include <strong>quantitative</strong> (numerical data), <strong>qualitative</strong> (descriptive data), <strong>longitudinal study</strong> (following subjects over time), <strong>control group</strong> (the comparison group), and <strong>double-blind</strong> (neither researchers nor participants know who receives the treatment). These concepts are fundamental to evaluating the validity of scientific claims.</p>`,

    'Financial Vocabulary': `<h3>The Language of Markets and Money</h3>
<p>Financial vocabulary enables you to understand and discuss economic news, investment decisions, and market trends. This lesson covers terms from personal finance (<strong>compound interest</strong>, <strong>diversification</strong>, <strong>asset allocation</strong>) to macroeconomic concepts (<strong>fiscal policy</strong>, <strong>monetary policy</strong>, <strong>trade deficit</strong>).</p>
<p>Market vocabulary includes <strong>bull market</strong> (rising prices, optimism), <strong>bear market</strong> (falling prices, pessimism), <strong>volatility</strong> (rapid price changes), <strong>liquidity</strong> (how easily an asset can be converted to cash), and <strong>dividend</strong> (a share of company profits paid to shareholders). These terms appear daily in financial news and investment discussions.</p>
<p>Corporate finance vocabulary covers <strong>equity</strong> (ownership in a company), <strong>debt</strong> (borrowed money), <strong>leverage</strong> (using borrowed money to increase potential returns), <strong>valuation</strong> (estimating a company's worth), and <strong>IPO</strong> (initial public offering, when a company first sells shares to the public). Understanding these concepts is essential for anyone involved in business or investing.</p>`,

    'Literary Vocabulary': `<h3>The Craft of Literary Analysis</h3>
<p>Literary analysis requires a specialized vocabulary that allows you to discuss how texts create meaning. This lesson covers the essential terms for analyzing literature at an advanced level, from <strong>narrative voice</strong> and <strong>point of view</strong> to <strong>intertextuality</strong> and <strong>metafiction</strong>.</p>
<p>Figurative language terms are fundamental: <strong>metaphor</strong> (saying one thing is another), <strong>simile</strong> (comparing using "like" or "as"), <strong>personification</strong> (giving human qualities to non-human things), <strong>irony</strong> (a gap between expectation and reality), and <strong>allegory</strong> (a story with a hidden meaning). Recognizing these devices deepens your understanding of how writers craft their work.</p>
<p>Narrative technique vocabulary includes <strong>stream of consciousness</strong> (presenting a character's unbroken thought process), <strong>unreliable narrator</strong> (a narrator whose account cannot be fully trusted), <strong>foreshadowing</strong> (hinting at future events), and <strong>subtext</strong> (meaning beneath the surface). These concepts are essential for sophisticated literary interpretation and critical writing.</p>`,

    'Psychology Vocabulary': `<h3>The Language of the Mind</h3>
<p>Psychological vocabulary has permeated everyday English, but its precise meanings in academic contexts differ from casual usage. This lesson clarifies key terms and introduces the vocabulary needed to discuss mental processes, behavioral patterns, and therapeutic approaches with accuracy and sophistication.</p>
<p>Cognitive psychology terms include <strong>heuristics</strong> (mental shortcuts), <strong>cognitive dissonance</strong> (discomfort from holding contradictory beliefs), <strong>confirmation bias</strong> (favoring information that confirms existing views), and <strong>working memory</strong> (the system that temporarily holds and manipulates information). These concepts explain how we process information and make decisions.</p>
<p>Clinical vocabulary covers <strong>diagnosis</strong>, <strong>prognosis</strong>, <strong>therapy</strong>, <strong>remission</strong>, and <strong>comorbidity</strong> (the presence of multiple conditions simultaneously). Understanding these terms helps you navigate mental health discussions with appropriate precision and sensitivity.</p>`,

    'History Vocabulary': `<h3>The Vocabulary of the Past</h3>
<p>Historical vocabulary enables nuanced discussion of past events, their causes, and their significance. This lesson covers terms that historians use to analyze, interpret, and debate the meaning of historical events — from <strong>primary sources</strong> and <strong>historiography</strong> to <strong>revisionism</strong> and <strong>periodization</strong>.</p>
<p>Causal analysis terms are essential: <strong>catalyst</strong> (an event that speeds up change), <strong>precipitating factor</strong> (the immediate cause), <strong>underlying cause</strong> (the deeper reason), and <strong>structural factor</strong> (systemic conditions that shape events). Understanding these distinctions helps you construct and evaluate historical arguments about why things happened.</p>
<p>Interpretive vocabulary includes <strong>teleological</strong> (viewing history as purposeful progression), <strong>deterministic</strong> (seeing outcomes as inevitable), <strong>contingent</strong> (dependent on specific circumstances), and <strong>agency</strong> (the capacity of individuals to shape events). These terms frame how we understand the relationship between human choice and historical forces.</p>`,

    'Legal English': `<h3>Advanced Legal Terminology</h3>
<p>Advanced legal English operates at the intersection of domestic and international law, requiring precision with terminology that often has specific legal meanings different from everyday usage. This lesson covers terms essential for understanding international legal frameworks, treaties, and dispute resolution mechanisms.</p>
<p>International law vocabulary includes <strong>jurisdiction</strong> (the authority to apply law), <strong>extradition</strong> (transferring a person from one state to another for prosecution), <strong>sovereign immunity</strong> (protection of states from being sued in foreign courts), and <strong>ratification</strong> (formal confirmation of a treaty). These concepts determine how legal authority operates across national boundaries.</p>
<p>Human rights terminology covers <strong>inalienable rights</strong> (rights that cannot be taken away), <strong>due process</strong> (fair treatment through the judicial system), <strong>habeas corpus</strong> (the right to challenge unlawful detention), and <strong>genocide</strong> (the deliberate destruction of a people). These terms carry enormous weight in international legal and political discourse.</p>`,

    'Medical Terminology': `<h3>Advanced Medical and Ethical Language</h3>
<p>Advanced medical vocabulary extends beyond clinical terminology to encompass the ethical, regulatory, and research dimensions of modern healthcare. This lesson covers terms used in medical research, bioethics, and health policy — language that appears in academic papers, hospital ethics committees, and public health debates.</p>
<p>Research terminology includes <strong>clinical trial</strong> (a study testing new treatments), <strong>placebo</strong> (an inactive substance used for comparison), <strong>double-blind</strong> (neither patients nor researchers know who receives the treatment), and <strong>incidence</strong> versus <strong>prevalence</strong> (new cases versus total existing cases). These distinctions are critical for evaluating medical evidence.</p>
<p>Bioethics vocabulary covers <strong>informed consent</strong>, <strong>paternalism</strong> (making decisions for others "for their own good"), <strong>allocative justice</strong> (fair distribution of resources), <strong>euthanasia</strong>, and <strong>genomic editing</strong>. These terms frame some of the most challenging debates in contemporary medicine and require both medical understanding and moral reasoning.</p>`,

    'Linguistics Vocabulary': `<h3>The Science of Language Itself</h3>
<p>Linguistic vocabulary provides the metalanguage — the language used to describe language — that enables precise discussion of how English works at every level. This lesson covers terms from phonology (sound systems) and morphology (word structure) to syntax (sentence structure) and semantics (meaning).</p>
<p>Core linguistic terms include <strong>phoneme</strong> (the smallest unit of sound that distinguishes meaning), <strong>morpheme</strong> (the smallest unit of meaning), <strong>syntax</strong> (the rules governing sentence structure), <strong>pragmatics</strong> (how context affects meaning), and <strong>discourse</strong> (language use beyond the sentence level). These concepts provide the analytical tools for understanding how language functions systematically.</p>
<p>Sociolinguistic vocabulary covers <strong>register</strong> (language variety appropriate to a context), <strong>code-switching</strong> (alternating between languages or dialects), <strong>pidgin</strong> (a simplified contact language), and <strong>creole</strong> (a pidgin that has developed into a full language). These terms illuminate the relationship between language and social identity, power, and community.</p>`,
    'Confusing Words and False Friends': `<p><strong>Commonly confused word pairs:</strong></p>
<p>| Word | Meaning | Word | Meaning |
|------|---------|------|---------|
| <strong>affect</strong> (v) | to influence | <strong>effect</strong> (n) | result |
| <strong>advice</strong> (n) | recommendation | <strong>advise</strong> (v) | to recommend |
| <strong>practice</strong> (n) | rehearsal | <strong>practise</strong> (v) | to rehearse |
| <strong>licence</strong> (n) | permit (UK) | <strong>license</strong> (v) | to permit |
| <strong>principal</strong> (adj/n) | main / head of school | <strong>principle</strong> (n) | moral rule |
| <strong>complement</strong> (v/n) | complete/match | <strong>compliment</strong> (n) | praise |
| <strong>stationary</strong> (adj) | not moving | <strong>stationery</strong> (n) | paper, pens |
| <strong>weather</strong> (n) | rain, sun, etc. | <strong>whether</strong> (conj) | if |
| <strong>lose</strong> (v) | to misplace | <strong>loose</strong> (adj) | not tight |
| <strong>accept</strong> (v) | to agree to receive | <strong>except</strong> (prep) | excluding |</p>
<p><strong>Examples:</strong>
<ul><li>"The weather <strong>affected</strong> my mood." / "The <strong>effect</strong> was immediate."</li>
<li>"Can you give me some <strong>advice</strong>?" / "I <strong>advise</strong> you to study."</li>
<li>"I need more <strong>practice</strong>." / "I need to <strong>practise</strong> more."</li></p>
<p><strong>False friends (words that look similar to your language but mean something different):</strong></p>
<p>| Word | Looks like... | Actually means | Common mistake |
|------|--------------|----------------|----------------|
| <strong>actually</strong> | "aktuell" (German: current) | in reality | "Actually, I live in Berlin" = In fact... |
| <strong>eventual</strong> | "eventual" (Spanish: possible) | final/ultimate | "The eventual result" = the final result |
| <strong>sensible</strong> | "sensible" (French: sensitive) | reasonable, wise | "A sensible decision" = a wise decision |
| <strong>sympathetic</strong> | "simpatico" (friendly, nice) | showing compassion | "She was sympathetic" = she felt sorry for me |
| <strong>library</strong> | "libreria" (bookshop) | place to borrow books | NOT a bookshop |
| <strong>realise</strong> | "realiser" (to accomplish) | to become aware | "I realised I was wrong" |</p>
<p><strong>Other tricky words:</strong>
<li><strong>bring</strong> (towards the speaker) vs. <strong>take</strong> (away from the speaker)</li>
<li><strong>borrow</strong> (receive temporarily) vs. <strong>lend</strong> (give temporarily)</li>
<li><strong>raise</strong> (transitive — raise your hand) vs. <strong>rise</strong> (intransitive — the sun rises)</li>
<li><strong>say</strong> (focus on words) vs. <strong>tell</strong> (focus on listener — tell someone something)</li>
<li><strong>look</strong> (intentional) vs. <strong>see</strong> (accidental) vs. <strong>watch</strong> (focused attention over time)</li>
<li><strong>hear</strong> (accidental) vs. <strong>listen</strong> (intentional)</li></ul></p>`,
    'Vocabulary Expansion — Everyday Nouns and Verbs': `<p><strong>The most important everyday nouns (grouped by topic):</strong></p>
<p><em>Home:</em>
furniture, appliance, blanket, curtain, cushion, shelf, drawer, bin, mop, vacuum</p>
<p><em>Food:</em>
ingredients, recipe, flavour, portion, leftovers, takeaway, snack, dessert, spicy, raw</p>
<p><em>Transport:</em>
pedestrian, passenger, platform, departure, arrival, traffic jam, petrol station, parking space, motorway, roundabout</p>
<p><em>Work:</em>
colleague, employer, employee, salary, deadline, meeting, presentation, promotion, cv/resume, experience</p>
<p><em>Health:</em>
appointment, prescription, symptom, temperature, bandage, pharmacy, vitamins, allergic, injured, exhausted</p>
<p><strong>Word families — one root, many forms:</strong></p>
<p>| Noun | Verb | Adjective | Adverb |
|------|------|-----------|--------|
| help | help | helpful | helpfully |
| comfort | comfort | comfortable | comfortably |
| success | succeed | successful | successfully |
| difference | differ | different | differently |
| importance | matter (to be important) | important | importantly |
| choice | choose | chosen | — |
| strength | strengthen | strong | strongly |
| happiness | — | happy | happily |
| sadness | sadden | sad | sadly |
| beauty | beautify | beautiful | beautifully |</p>
<p><strong>Learning strategy:</strong>
Don't learn words in isolation. Learn them in CHUNKS:
<ul><li>❌ "make" + "decision" (separate)</li>
<li>✅ "make a decision" (together)</li></ul></p>`,
    'Vocabulary Expansion — Describing Words and Expressions': `<p><strong>Common adjective-noun pairs (collocations):</strong></p>
<p><em>Weather:</em>
heavy rain, strong wind, bright sun, thick fog, freezing cold, boiling hot</p>
<p><em>People:</em>
close friend, best friend, old friend, hard worker, fast learner, heavy sleeper</p>
<p><em>Feelings:</em>
broken heart, deep sadness, pure joy, bright smile, warm welcome</p>
<p><em>Places:</em>
busy street, quiet village, crowded city, empty room, dirty kitchen, tidy garden</p>
<p><strong>Extreme adjectives (use with "absolutely," not "very"):</strong></p>
<p>| Normal | Extreme | Example |
|--------|---------|---------|
| very good | excellent, outstanding, brilliant | "The food was <strong>absolutely excellent</strong>." |
| very bad | terrible, awful, dreadful | "The weather was <strong>absolutely terrible</strong>." |
| very big | huge, enormous, massive | "The stadium is <strong>absolutely enormous</strong>." |
| very small | tiny, minute | "The kitten was <strong>absolutely tiny</strong>." |
| very tired | exhausted | "I'm <strong>absolutely exhausted</strong>." |
| very hungry | starving | "I'm <strong>absolutely starving</strong>!" |
| very angry | furious | "She was <strong>absolutely furious</strong>." |
| very happy | delighted, ecstatic | "I was <strong>absolutely delighted</strong>." |
| very surprised | astonished, amazed | "We were <strong>absolutely amazed</strong>." |
| very beautiful | gorgeous, stunning | "The view was <strong>absolutely stunning</strong>." |</p>
<p><strong>Set phrases (sounds natural when used together):</strong>
<ul><li>"Make yourself at home."</li>
<li>"Take your time."</li>
<li>"It's up to you." (you decide)</li>
<li>"I'm on my way." (I'm coming)</li>
<li>"It's not worth it." (the effort is too much for the result)</li>
<li>"That's a shame." (that's unfortunate)</li>
<li>"You never know." (anything is possible)</li>
<li>"Fair enough." (I accept your point)</li></ul></p>`,
    'Vocabulary — Idioms and Phrasal Verbs at B2': `<p><strong>Essential B2 idioms — work and professional:</strong></p>
<p>| Idiom | Meaning | Example |
|-------|---------|---------|
| <strong>raise the bar</strong> | set higher standards | "Her presentation really <strong>raised the bar</strong> for the team." |
| <strong>hit the ground running</strong> | start immediately with energy | "The new manager <strong>hit the ground running</strong> — changes by day two." |
| <strong>get the ball rolling</strong> | start a process | "Let's <strong>get the ball rolling</strong> on the new project." |
| <strong>think outside the box</strong> | be creative | "We need to <strong>think outside the box</strong> to solve this." |
| <strong>back to the drawing board</strong> | start again | "The client rejected the design — <strong>back to the drawing board</strong>." |
| <strong>cut corners</strong> | do something cheaply/quickly | "Don't <strong>cut corners</strong> on safety." |
| <strong>the bottom line</strong> | the essential point | "<strong>The bottom line</strong> is we need more funding." |
| <strong>on the same page</strong> | in agreement | "Before we start, let's make sure we're <strong>on the same page</strong>." |</p>
<p><strong>Separable vs. inseparable phrasal verbs:</strong></p>
<p><em>Separable (object can go between or after):</em>
<ul><li>"Turn <strong>the music</strong> down" = "Turn down <strong>the music</strong>"</li>
<li>"Pick <strong>him</strong> up" = "Pick up <strong>him</strong>" (but: "Pick <strong>him</strong> up" — pronouns go in the middle!)</li>
<li>"Fill <strong>it</strong> out" = "Fill out <strong>the form</strong>"</li></p>
<p><em>Inseparable (object always after):</em>
<li>"Look <strong>after</strong> the children" (NOT "look the children after")</li>
<li>"Run <strong>into</strong> an old friend"</li>
<li>"Get <strong>on</strong> with someone"</li>
<li>"Come <strong>across</strong> something"</li></p>
<p><strong>Three-part phrasal verbs:</strong>
<li>"look <strong>forward to</strong>" (anticipate)</li>
<li>"catch <strong>up with</strong>" (reach the same level)</li>
<li>"put <strong>up with</strong>" (tolerate)</li>
<li>"get <strong>away with</strong>" (avoid punishment)</li>
<li>"live <strong>up to</strong>" (meet expectations)</li>
<li>"make <strong>up for</strong>" (compensate)</li></ul></p>`,
    'Vocabulary — Academic and Formal Word Lists': `<p><strong>AWL Sub-lists 1-5 — essential academic words:</strong></p>
<p>| Word family | Noun | Verb | Adjective | Adverb |
|-------------|------|------|-----------|--------|
| <strong>analyse</strong> | analysis | analyse/analyze | analytical | analytically |
| <strong>approach</strong> | approach | approach | approachable | — |
| <strong>area</strong> | area | — | — | — |
| <strong>assess</strong> | assessment | assess | assessable | — |
| <strong>assume</strong> | assumption | assume | assumed | — |
| <strong>authority</strong> | authority | authorise | authoritative | authoritatively |
| <strong>available</strong> | availability | — | available | — |
| <strong>benefit</strong> | benefit | benefit | beneficial | beneficially |
| <strong>concept</strong> | concept | conceptualise | conceptual | conceptually |
| <strong>consist</strong> | consistency | consist | consistent | consistently |
| <strong>constitute</strong> | constituent | constitute | constituent | — |
| <strong>context</strong> | context | contextualise | contextual | contextually |
| <strong>contract</strong> | contract | contract | contractual | — |
| <strong>create</strong> | creation | create | creative | creatively |
| <strong>data</strong> | data | — | — | — |
| <strong>define</strong> | definition | define | definitive | definitively |
| <strong>derive</strong> | derivation | derive | derivative | — |
| <strong>distribute</strong> | distribution | distribute | distributive | — |
| <strong>economy</strong> | economy | economise | economic/economical | economically |
| <strong>environment</strong> | environment | — | environmental | environmentally |
| <strong>establish</strong> | establishment | establish | established | — |
| <strong>estimate</strong> | estimate | estimate | estimated | — |
| <strong>evident</strong> | evidence | — | evident | evidently |
| <strong>export</strong> | export | export | exported | — |
| <strong>factor</strong> | factor | factor | — | — |
| <strong>finance</strong> | finance | finance | financial | financially |
| <strong>formula</strong> | formula | formulate | formulaic | — |
| <strong>function</strong> | function | function | functional | functionally |
| <strong>identify</strong> | identity/identification | identify | identifiable/identical | identifiably |
| <strong>income</strong> | income | — | — | — |
| <strong>indicate</strong> | indication | indicate | indicative | — |
| <strong>individual</strong> | individual | — | individual | individually |
| <strong>interpret</strong> | interpretation | interpret | interpretive | interpretively |
| <strong>involve</strong> | involvement | involve | involved | — |
| <strong>issue</strong> | issue | issue | — | — |
| <strong>labour</strong> | labour | labour | — | — |
| <strong>legal</strong> | legality | legalise | legal | legally |
| <strong>legislate</strong> | legislation | legislate | legislative | legislatively |
| <strong>major</strong> | majority | — | major | majorly |
| <strong>method</strong> | method | — | methodical | methodically |
| <strong>occur</strong> | occurrence | occur | — | — |
| <strong>percent</strong> | percentage | — | — | — |
| <strong>period</strong> | period | — | periodic | periodically |
| <strong>policy</strong> | policy | — | — | — |
| <strong>principle</strong> | principle | — | principal/principled | principally |
| <strong>proceed</strong> | procedure/proceeds | proceed | procedural | procedurally |
| <strong>process</strong> | process | process | processed | — |
| <strong>require</strong> | requirement | require | required | — |
| <strong>research</strong> | research | research | — | — |
| <strong>respond</strong> | response | respond | responsive | responsively |
| <strong>role</strong> | role | — | — | — |
| <strong>section</strong> | section | section | sectional | — |
| <strong>sector</strong> | sector | sectorise | sectoral | — |
| <strong>significant</strong> | significance | signify | significant | significantly |
| <strong>similar</strong> | similarity | — | similar | similarly |
| <strong>source</strong> | source | source | — | — |
| <strong>specific</strong> | specificity | specify | specific | specifically |
| <strong>structure</strong> | structure | structure | structural | structurally |
| <strong>theory</strong> | theory | theorise | theoretical | theoretically |
| <strong>vary</strong> | variety/variation/variance | vary | variable/various | variably/variously |</p>
<p><strong>Formal alternatives for informal words:</strong></p>
<p>| Informal | Formal | Example |
|----------|--------|---------|
| get | obtain/acquire/receive | "Please <strong>obtain</strong> permission first." |
| keep | maintain/preserve/retain | "We must <strong>maintain</strong> high standards." |
| show | demonstrate/indicate/illustrate | "The data <strong>demonstrate</strong> a clear trend." |
| help | assist/aid/facilitate | "Technology can <strong>facilitate</strong> learning." |
| end | conclude/terminate/cease | "The meeting <strong>concluded</strong> at 5 PM." |
| big | substantial/significant/considerable | "A <strong>substantial</strong> amount of money" |
| good | beneficial/effective/advantageous | "An <strong>effective</strong> solution" |
| bad | detrimental/adverse/negative | "The <strong>adverse</strong> effects of..." |
| use | utilise/employ/apply | "We <strong>employed</strong> a mixed-methods approach." |
| make | produce/generate/create/construct | "The factory <strong>produces</strong> 500 units daily." |</p>`,
    'Vocabulary — Rare and Academic Word Mastery': `<p><strong>Academic Word List (AWL) sub-lists 6-10 — advanced tier:</strong></p>
<p>| Word | Meaning | Example |
|------|---------|---------|
| <strong>ubiquitous</strong> | present everywhere | "Smartphones are now <strong>ubiquitous</strong> in developed nations." |
| <strong>paradigm</strong> | model, framework | "This represents a <strong>paradigm</strong> shift in our approach." |
| <strong>dichotomy</strong> | division into two | "The <strong>dichotomy</strong> between work and life is artificial." |
| <strong>pragmatic</strong> | practical, realistic | "We need a <strong>pragmatic</strong> solution, not an idealistic one." |
| <strong>nuance</strong> | subtle distinction | "The <strong>nuance</strong> of her argument was lost in summary." |
| <strong>juxtapose</strong> | place side by side | "The film <strong>juxtaposes</strong> wealth and poverty." |
| <strong>ambiguity</strong> | openness to interpretation | "The <strong>ambiguity</strong> of the law creates confusion." |
| <strong>reiterate</strong> | say again | "Let me <strong>reiterate</strong>: this decision is final." |
| <strong>underpin</strong> | support, form basis | "Trust <strong>underpins</strong> every successful relationship." |
| <strong>extrapolate</strong> | infer from known data | "We can <strong>extrapolate</strong> from these findings." |
| <strong>mitigate</strong> | make less severe | "Measures to <strong>mitigate</strong> climate change are urgent." |
| <strong>amalgamate</strong> | combine, merge | "The two departments were <strong>amalgamated</strong>." |
| <strong>cohesive</strong> | unified, connected | "The team was remarkably <strong>cohesive</strong>." |
| <strong>disseminate</strong> | spread widely | "The research was <strong>disseminated</strong> globally." |
| <strong>ephemeral</strong> | fleeting, short-lived | "Fame is <strong>ephemeral</strong>; impact is enduring." |
| <strong>fortuitous</strong> | lucky, accidental | "Their meeting was entirely <strong>fortuitous</strong>." |
| <strong>gregarious</strong> | sociable | "She was naturally <strong>gregarious</strong> and outgoing." |
| <strong>hegemony</strong> | dominance | "Cultural <strong>hegemony</strong> shapes our values." |
| <strong>idiosyncratic</strong> | unique to an individual | "His <strong>idiosyncratic</strong> style made him recognisable." |
| <strong>juxtaposition</strong> | placing things side by side | "The <strong>juxtaposition</strong> of old and new was striking." |</p>
<p><strong>Literary vocabulary:</strong>
<ul><li><strong>Exegesis</strong> — critical interpretation of a text</li>
<li><strong>Synecdoche</strong> — part representing whole ("all hands on deck")</li>
<li><strong>Metonymy</strong> — associated word substituted ("the Crown" = the monarchy)</li>
<li><strong>Parataxis</strong> — short, equal clauses (Hemingway's style)</li>
<li><strong>Hypotaxis</strong> — subordinate clauses (academic style)</li>
<li><strong>Litotes</strong> — understatement for emphasis ("not bad" = very good)</li>
<li><strong>Chiasmus</strong> — reversed structure ("Ask not what your country can do for you — ask what you can do for your country.")</li></ul></p>`,
    'Vocabulary — Idioms, Proverbs, and Cultural References': `<p><strong>Biblical allusions (very common in English):</strong></p>
<p>| Expression | Origin | Meaning |
|------------|--------|---------|
| <strong>a doubting Thomas</strong> | Thomas doubted Jesus's resurrection | someone who refuses to believe without proof |
| <strong>the prodigal son</strong> | Parable of the lost son | someone who returns after a long absence |
| <strong>a Good Samaritan</strong> | Parable of the Samaritan | someone who helps strangers |
| <strong>the writing on the wall</strong> | Belshazzar's feast | warning of impending disaster |
| <strong>an eye for an eye</strong> | Old Testament law | revenge proportional to the offence |
| <strong>salt of the earth</strong> | Jesus's Sermon on the Mount | fundamentally good people |
| <strong>pearls before swine</strong> | Jesus's teaching | giving something valuable to those who won't appreciate it |
| <strong>scapegoat</strong> | Ancient Hebrew ritual | someone blamed for others' faults |</p>
<p><strong>Classical/Greek allusions:</strong></p>
<p>| Expression | Origin | Meaning |
|------------|--------|---------|
| <strong>Achilles' heel</strong> | Greek myth | fatal weakness |
| <strong>Pandora's box</strong> | Greek myth | source of many unforeseen problems |
| <strong>Sisyphean task</strong> | Greek myth | endless, frustrating labour |
| <strong>a Trojan horse</strong> | Greek myth | something that seems harmless but contains a threat |
| <strong>crossing the Rubicon</strong> | Julius Caesar | passing a point of no return |
| <strong>the die is cast</strong> | Julius Caesar | a decision has been made that cannot be changed |
| <strong>Et tu, Brute?</strong> | Julius Caesar | expression of betrayal |</p>
<p><strong>Regional British idioms:</strong>
<ul><li>"It's all gone pear-shaped" = it's all gone wrong</li>
<li>"Bob's your uncle" = there you have it / it's that simple</li>
<li>"Taking the mickey" = making fun of someone</li>
<li>"Gone to pot" = deteriorated</li>
<li>"Spend a penny" = use the toilet (euphemism)</li>
<li>"Not my cup of tea" = not something I enjoy</li></p>
<p><strong>Pop culture references C2 speakers should recognise:</strong>
<li>"Orwellian" = surveillance state, propaganda (from George Orwell's <em>1984</em>)</li>
<li>"Kafkaesque" = absurd bureaucratic nightmare (from Franz Kafka)</li>
<li>"Catch-22" = a no-win situation (from Joseph Heller's novel)</li>
<li>"Big Brother" = oppressive surveillance (from <em>1984</em>)</li>
<li>"The emperor's new clothes" = collective denial of an obvious truth</li>
<li>"Sisyphean" = endless, futile labour</li></ul></p>`,

  },

  grammar: {
    'Basic Sentence Structure': `<h3>Building Blocks of English Sentences</h3>
<p>English sentences follow a fundamental pattern: <strong>Subject + Verb + Object</strong> (SVO). This is the backbone of English grammar and differs from many other languages. For example: <strong>"I (subject) eat (verb) breakfast (object)."</strong> Even complex sentences build on this basic structure.</p>
<p>Statements follow SVO order, but questions invert the subject and verb: <strong>"Do you eat breakfast?"</strong> Negative sentences add <strong>"not"</strong> after the auxiliary verb: <strong>"I do not eat breakfast."</strong> Understanding these three patterns — affirmative, negative, and interrogative — gives you the foundation for constructing any English sentence.</p>
<p>Remember that the subject always comes before the verb in English statements. This is different from languages like Arabic or Spanish, where the verb can come first. If you consistently put the subject first, your English sentences will sound much more natural.</p>`,

    'Present Simple Tense': `<h3>The Tense of Habits and Facts</h3>
<p>The present simple tense is used for habitual actions, general truths, and fixed arrangements. For most subjects, the verb stays in its base form: <strong>"I work", "We work", "They work".</strong> However, for third-person singular (he, she, it), we add <strong>-s</strong> or <strong>-es</strong>: <strong>"She works", "He watches".</strong></p>
<p>Negative sentences use <strong>"do not"</strong> (don't) or <strong>"does not"</strong> (doesn't): <strong>"I don't work on Sundays", "She doesn't like coffee".</strong> Questions follow the same pattern: <strong>"Do you work?", "Does she like tea?"</strong> The auxiliary verb <strong>do/does</strong> carries the tense, while the main verb stays in its base form.</p>
<p>Time expressions commonly used with the present simple include <strong>always, usually, often, sometimes, rarely,</strong> and <strong>never</strong>. These adverbs of frequency typically go before the main verb: <strong>"I always brush my teeth before bed."</strong> With the verb <strong>"to be"</strong>, they go after: <strong>"She is never late."</strong></p>`,

    'Countable & Uncountable Nouns': `<h3>One, Two, Many — or Just "Some"?</h3>
<p>English nouns fall into two categories: <strong>countable</strong> (things you can count: one apple, two apples) and <strong>uncountable</strong> (things you cannot count: water, rice, information). This distinction affects which articles and quantifiers you use. Countable nouns can be singular or plural and take <strong>"a/an"</strong> or number words. Uncountable nouns are always singular and take <strong>"some"</strong> or measurement phrases.</p>
<p>Common uncountable nouns include <strong>water, bread, money, information, advice, homework, furniture,</strong> and <strong>weather</strong>. You cannot say <strong>"two breads"</strong> — instead, you use measurement words: <strong>"two slices of bread"</strong> or <strong>"two loaves of bread."</strong> Learning which nouns are uncountable is one of the trickiest aspects of English grammar for learners.</p>
<p>Quantifiers differ for each type: use <strong>"many"</strong> and <strong>"few"</strong> with countable nouns (<strong>"many books"</strong>), and <strong>"much"</strong> and <strong>"little"</strong> with uncountable nouns (<strong>"much water"</strong>). <strong>"Some"</strong> and <strong>"any"</strong> work with both types. In questions and negatives: <strong>"Is there any milk?"</strong>, <strong>"There aren't any eggs."</strong></p>`,

    'Asking About Prices': `<h3>How Much Does It Cost?</h3>
<p>Asking about prices in English uses specific grammatical structures. The most common question is <strong>"How much is this?"</strong> or <strong>"How much does this cost?"</strong> For plural items, use <strong>"How much are these?"</strong> or <strong>"How much do these cost?"</strong> The structure follows the same pattern as other questions with <strong>how much</strong>.</p>
<p>When discussing prices, English uses currency names before the amount: <strong>"five dollars"</strong>, <strong>"ten pounds"</strong>, <strong>"three euros"</strong>. In writing, currency symbols come before the number: <strong>$5, £10, €3</strong>. Prices are read as: <strong>"$4.99" = "four dollars and ninety-nine cents"</strong> or colloquially <strong>"four ninety-nine."</strong></p>
<p>Comparative structures are useful when shopping: <strong>"Is there a cheaper one?"</strong>, <strong>"This is more expensive than I expected."</strong> Superlatives help with decisions: <strong>"What's the best value?"</strong> or <strong>"Which is the most affordable option?"</strong> These grammatical structures are essential for smart shopping conversations.</p>`,

    'Prepositions of Place': `<h3>Where Exactly? In, On, At, and Beyond</h3>
<p>Prepositions of place describe where something is located. The three most common — <strong>in, on,</strong> and <strong>at</strong> — follow general rules: use <strong>in</strong> for enclosed spaces (<strong>"in the room"</strong>), <strong>on</strong> for surfaces (<strong>"on the table"</strong>), and <strong>at</strong> for specific points (<strong>"at the bus stop"</strong>). However, many uses are idiomatic and must be memorized.</p>
<p>Common combinations include <strong>in a city/country</strong> (<strong>"in London"</strong>), <strong>on a street</strong> (<strong>"on Oxford Street"</strong>), <strong>at an address</strong> (<strong>"at 25 Baker Street"</strong>). Transportation prepositions also have rules: <strong>on a bus/train/plane</strong>, but <strong>in a car/taxi</strong>. These distinctions matter for clear communication about location.</p>
<p>More precise prepositions include <strong>between</strong> (in the middle of two things), <strong>among</strong> (in the middle of many things), <strong>opposite</strong> (facing), <strong>next to</strong> (beside), <strong>behind</strong> (at the back of), and <strong>in front of</strong> (ahead of). Combining these with the basic prepositions gives you the full toolkit for describing any spatial relationship.</p>`,

    'Should & Must': `<h3>Modals of Advice and Obligation</h3>
<p><strong>Should</strong> and <strong>must</strong> are modal verbs that express different levels of necessity. <strong>Should</strong> gives advice or recommendations — it suggests the best action but leaves room for choice: <strong>"You should see a doctor"</strong> (I recommend it, but it is your decision). <strong>Must</strong> expresses strong obligation or necessity — it leaves little or no choice: <strong>"You must take this medicine"</strong> (it is essential).</p>
<p>The negative forms carry different meanings. <strong>"Shouldn't"</strong> means it is not a good idea: <strong>"You shouldn't eat so much sugar"</strong> (advice against). <strong>"Mustn't"</strong> means it is prohibited: <strong>"You mustn't drive without a license"</strong> (it is against the law). This distinction is crucial — confusing the two could lead to misunderstanding.</p>
<p>Other related modals include <strong>ought to</strong> (similar to should, slightly more formal), <strong>have to</strong> (external obligation, similar to must), and <strong>need to</strong> (necessity). Each modal carries a slightly different nuance: <strong>"I must study"</strong> (I feel it is necessary) vs. <strong>"I have to study"</strong> (circumstances require it).</p>`,

    'There is / There are': `<h3>Existence in English</h3>
<p><strong>"There is"</strong> and <strong>"There are"</strong> are used to say that something exists or is present. Use <strong>"there is"</strong> with singular and uncountable nouns: <strong>"There is a book on the table"</strong>, <strong>"There is milk in the fridge."</strong> Use <strong>"there are"</strong> with plural nouns: <strong>"There are three bedrooms in my apartment."</strong></p>
<p>In questions, the order reverses: <strong>"Is there a supermarket near here?"</strong>, <strong>"Are there any good restaurants in this area?"</strong> Negative forms use <strong>"isn't"</strong> and <strong>"aren't"</strong>: <strong>"There isn't a gym in my building"</strong>, <strong>"There aren't many parks in the city center."</strong></p>
<p>The contraction <strong>"there's"</strong> is extremely common in spoken English and works for both singular and — informally — plural nouns. However, in writing and formal speech, use the full form: <strong>"There are two cats"</strong> (not <strong>"There's two cats"</strong> in formal contexts). Mastering this structure allows you to describe any scene or location naturally.</p>`,

    'Like vs As': `<h3>Similarity and Comparison</h3>
<p><strong>Like</strong> and <strong>as</strong> both express similarity, but they function differently in English grammar. <strong>Like</strong> is a preposition followed by a noun or pronoun: <strong>"She looks like her mother"</strong>, <strong>"It sounds like rain."</strong> It compares one thing to another directly. <strong>As</strong> is a conjunction followed by a clause (subject + verb): <strong>"Do as I say, not as I do."</strong></p>
<p>A common mistake is using <strong>like</strong> where <strong>as</strong> is needed: <strong>"She works like a teacher"</strong> (she resembles a teacher) vs. <strong>"She works as a teacher"</strong> (she is a teacher). The difference is significant — <strong>like</strong> means "similar to," while <strong>as</strong> means "in the role of."</p>
<p>Special uses of <strong>as</strong> include: <strong>as if / as though</strong> (for unreal situations: <strong>"It looks as if it's going to rain"</strong>), <strong>as...as</strong> (for equal comparisons: <strong>"She's as tall as her brother"</strong>), and <strong>such as</strong> (for giving examples: <strong>"I enjoy outdoor activities such as hiking and cycling"</strong>).</p>`,

    // Intermediate Grammar
    'Present Perfect for Experience': `<h3>Have You Ever...?</h3>
<p>The present perfect tense connects the past to the present. It is formed with <strong>have/has + past participle</strong>. We use it for life experiences — things that happened at an unspecified time before now: <strong>"I have visited Paris"</strong> (at some point in my life). The exact time is not important; what matters is the result in the present.</p>
<p>Common time expressions with the present perfect include <strong>ever</strong> (in questions: <strong>"Have you ever worked abroad?"</strong>), <strong>never</strong> (for negative experiences: <strong>"I've never eaten sushi"</strong>), <strong>already</strong> (something completed: <strong>"She's already finished the report"</strong>), and <strong>yet</strong> (something expected: <strong>"Have you submitted your application yet?"</strong>).</p>
<p>Do not use the present perfect with specific past time expressions. <strong>"I have been to London in 2019"</strong> is incorrect — use the past simple: <strong>"I went to London in 2019."</strong> The present perfect is for unspecified time; the past simple is for specified time. This distinction is one of the most common challenges for English learners.</p>`,

    'Conditionals (First & Second)': `<h3>If This, Then That</h3>
<p>Conditional sentences express that one thing depends on another. The <strong>first conditional</strong> describes real or likely situations: <strong>"If it rains tomorrow, I will stay home."</strong> Structure: <strong>if + present simple, will + base verb</strong>. This conditional talks about realistic future possibilities.</p>
<p>The <strong>second conditional</strong> describes unreal or unlikely situations: <strong>"If I won the lottery, I would travel the world."</strong> Structure: <strong>if + past simple, would + base verb</strong>. Despite using the past tense, this conditional talks about the present or future — the past tense signals unreality, not past time.</p>
<p>Both conditionals can be reversed: <strong>"I will stay home if it rains"</strong> (no comma needed when the if-clause comes second). Mixed uses are also common: <strong>"If I were you, I would accept the offer"</strong> (second conditional for advice). Note that <strong>"If I were"</strong> is preferred over <strong>"If I was"</strong> in formal English for unreal conditionals.</p>`,

    'Reported Speech': `<h3>He Said, She Said</h3>
<p>When we report what someone else said, we typically shift the tense one step back. <strong>"I am tired"</strong> becomes <strong>"She said she was tired."</strong> Present simple shifts to past simple, present continuous to past continuous, and present perfect to past perfect. This <strong>backshift</strong> happens because the original statement was made in the past.</p>
<p>Pronouns also change to reflect the new speaker's perspective. <strong>"I will bring my notes"</strong> becomes <strong>"He said he would bring his notes."</strong> Time expressions shift too: <strong>"today"</strong> becomes <strong>"that day"</strong>, <strong>"tomorrow"</strong> becomes <strong>"the next day"</strong>, and <strong>"yesterday"</strong> becomes <strong>"the day before"</strong>.</p>
<p>Questions follow different rules depending on type. Yes/no questions use <strong>if</strong> or <strong>whether</strong>: <strong>"Are you coming?" → "She asked if I was coming."</strong> Wh-questions keep the question word: <strong>"Where do you live?" → "He asked where I lived."</strong> Reported questions maintain statement word order — no inversion.</p>`,

    'Relative Clauses': `<h3>Connecting Ideas with Who, Which, and That</h3>
<p>Relative clauses provide extra information about a noun, using relative pronouns: <strong>who</strong> (people), <strong>which</strong> (things), <strong>that</strong> (people or things), <strong>whose</strong> (possession), <strong>where</strong> (places), and <strong>when</strong> (times). There are two types: <strong>defining</strong> (essential information) and <strong>non-defining</strong> (extra information).</p>
<p>Defining relative clauses identify which person or thing we mean: <strong>"The woman who interviewed me was very friendly."</strong> Without the clause, we would not know which woman. Non-defining clauses add extra information between commas: <strong>"My boss, who is from Canada, speaks French fluently."</strong> We already know who the boss is — the clause adds detail.</p>
<p>In defining clauses, <strong>that</strong> can replace <strong>who</strong> or <strong>which</strong>, and the relative pronoun can be omitted when it is the object: <strong>"The book (that) I read was excellent."</strong> In non-defining clauses, you cannot use <strong>that</strong> and cannot omit the pronoun. These rules are strict in formal English writing.</p>`,

    'Passive Voice': `<h3>When the Action Matters More Than the Actor</h3>
<p>In the passive voice, the object of an active sentence becomes the subject: <strong>Active: "Shakespeare wrote Hamlet"</strong> → <strong>Passive: "Hamlet was written by Shakespeare."</strong> The passive is formed with <strong>be + past participle</strong>. We use it when the action is more important than who performed it, or when the actor is unknown or obvious.</p>
<p>The passive exists in all tenses. Present simple: <strong>"English is spoken worldwide."</strong> Past simple: <strong>"The bridge was built in 1890."</strong> Present perfect: <strong>"The report has been completed."</strong> Future: <strong>"The project will be finished next month."</strong> Modal verbs: <strong>"The problem must be solved."</strong></p>
<p>Be careful not to overuse the passive. Active sentences are generally clearer and more direct. Use the passive strategically — when you want to emphasize the result rather than the actor, when the actor is unknown (<strong>"My car was stolen"</strong>), or in formal and academic writing where objectivity is valued.</p>`,

    'Articles & Determiners': `<h3>Choosing the Right Article</h3>
<p>English articles — <strong>a/an</strong> (indefinite) and <strong>the</strong> (definite) — are small words that carry significant meaning. <strong>"A/an"</strong> introduces something new or unspecified: <strong>"I saw a bird."</strong> <strong>"The"</strong> refers to something specific or already mentioned: <strong>"The bird was an eagle."</strong> Sometimes no article is needed at all — the <strong>zero article</strong>.</p>
<p>The zero article is used with uncountable and plural nouns in general statements: <strong>"Water is essential for life"</strong> (not <strong>"The water is essential"</strong>), <strong>"Dogs are loyal animals"</strong> (not <strong>"The dogs are loyal"</strong>). However, when you are being specific, the article returns: <strong>"The water in this river is polluted"</strong>, <strong>"The dogs next door are noisy."</strong></p>
<p>Other determiners include <strong>this/that/these/those</strong> (demonstratives), <strong>some/any</strong> (for unspecified quantities), <strong>each/every</strong> (for individual items in a group), and <strong>both/neither/either</strong> (for two items). Choosing the right determiner depends on whether the noun is countable, singular or plural, and specific or general.</p>`,

    'Modal Verbs of Obligation': `<h3>Must, Have To, Should, and Need</h3>
<p>Modal verbs of obligation express different degrees of necessity. <strong>Must</strong> indicates strong obligation, often from the speaker's authority: <strong>"You must wear a seatbelt."</strong> <strong>Have to</strong> expresses external obligation: <strong>"I have to submit this report by Friday."</strong> The difference is subtle — <strong>must</strong> feels more personal, <strong>have to</strong> more circumstantial.</p>
<p>For advice and recommendations, use <strong>should</strong> or <strong>ought to</strong>: <strong>"You should review the contract carefully before signing."</strong> For necessity, use <strong>need to</strong>: <strong>"We need to leave early to avoid traffic."</strong> The negative forms are particularly important to distinguish: <strong>mustn't</strong> (prohibition) vs. <strong>don't have to</strong> (lack of necessity).</p>
<p>In the past, most modals change form. <strong>Must</strong> becomes <strong>had to</strong>: <strong>"I had to work late yesterday."</strong> <strong>Should</strong> stays as <strong>should have + past participle</strong> for regrets: <strong>"I should have studied harder."</strong> Understanding these past forms is essential for narrating experiences and reflecting on past decisions.</p>`,

    'Adjective Order & Intensifiers': `<h3>The Rules of Description</h3>
<p>When using multiple adjectives before a noun, English follows a specific order: <strong>opinion → size → age → shape → color → origin → material → purpose</strong>. For example: <strong>"a beautiful large old round red Italian wooden dining table."</strong> Native speakers follow this order instinctively, and getting it wrong sounds jarring even if the meaning is clear.</p>
<p>Intensifiers strengthen or weaken adjectives. Common intensifiers include <strong>very, really, absolutely, incredibly, extremely,</strong> and <strong>quite</strong>. However, some intensifiers only work with certain adjective types: <strong>absolutely</strong> pairs with extreme adjectives (<strong>"absolutely freezing"</strong>, not <strong>"absolutely cold"</strong>), while <strong>very</strong> pairs with base adjectives (<strong>"very cold"</strong>, not <strong>"very freezing"</strong>).</p>
<p>Gradable adjectives (cold, hot, good, bad) can be compared and modified by degree: <strong>"quite cold, very cold, extremely cold."</strong> Extreme adjectives (freezing, boiling, perfect, terrible) represent the endpoint of a scale and cannot be graded: you can say <strong>"absolutely freezing"</strong> but not <strong>"very freezing."</strong> This distinction is a mark of sophisticated English usage.</p>`,

    'Future Tenses': `<h3>Will, Going To, and Beyond</h3>
<p>English has several ways to talk about the future, each with a different nuance. <strong>Will</strong> expresses spontaneous decisions and general predictions: <strong>"I'll answer the phone"</strong> (deciding now), <strong>"The world population will reach 10 billion by 2050."</strong> <strong>Going to</strong> expresses plans and predictions based on present evidence: <strong>"I'm going to study medicine"</strong> (a plan), <strong>"Look at those clouds — it's going to rain."</strong></p>
<p>The <strong>future continuous</strong> (will be + -ing) describes actions in progress at a future time: <strong>"This time tomorrow, I'll be flying to Tokyo."</strong> The <strong>future perfect</strong> (will have + past participle) describes actions completed before a future point: <strong>"By next December, I will have graduated."</strong> These tenses add precision to your future references.</p>
<p>In time clauses (after <strong>when, before, after, until, as soon as</strong>), use the present tense for future meaning: <strong>"I'll call you when I arrive"</strong> (not <strong>"when I will arrive"</strong>). This is a common error for learners whose first language uses future tenses in time clauses.</p>`,

    // Advanced Grammar
    'Inversion & Emphasis': `<h3>Turning the Sentence Upside Down</h3>
<p>Inversion places the auxiliary verb before the subject for emphasis or rhetorical effect. Negative inversion, triggered by negative adverbials at the start of a sentence, is particularly powerful: <strong>"Never have I witnessed such dedication"</strong> (instead of <strong>"I have never witnessed..."</strong>). Other triggers include <strong>rarely, seldom, hardly, scarcely, no sooner, not only,</strong> and <strong>under no circumstances</strong>.</p>
<p>So/Neither inversion expresses agreement: <strong>"She speaks French, and so does her brother"</strong> (agreement with a positive), <strong>"I don't like sushi, neither do I"</strong> (agreement with a negative). The auxiliary verb matches the original tense: <strong>"They worked late, and so did we"</strong> (past tense).</p>
<p>Place and direction inversion occurs with directional adverbs: <strong>"On the hill stood a lonely church"</strong>, <strong>"Down came the rain."</strong> This literary inversion creates vivid imagery and is common in descriptive and narrative writing. Understanding inversion allows you to add rhetorical variety to your English expression.</p>`,

    'Hedging & Vagueness': `<h3>The Art of Saying Less Than You Mean</h3>
<p>Hedging is the strategic use of cautious language to avoid overstatement, soften claims, or indicate uncertainty. In academic and professional English, hedging is not weak — it is sophisticated. It signals that you understand the complexity of an issue and are making claims proportional to the evidence.</p>
<p>Common hedging devices include <strong>modal verbs</strong> (<strong>"This could suggest..."</strong>), <strong>adverbs of probability</strong> (<strong>"It is arguably the most significant factor"</strong>), <strong>approximators</strong> (<strong>"The results indicate a possible correlation"</strong>), and <strong>impersonal subjects</strong> (<strong>"It has been suggested that..."</strong>). Each device creates a slightly different degree of commitment to the statement.</p>
<p>Vagueness serves different purposes in casual and formal contexts. In everyday speech, vague language (<strong>"sort of", "kind of", "about", "roughly"</strong>) softens assertions and avoids sounding too direct. In academic writing, vagueness is used with precision — you are deliberately indicating the limits of certainty rather than being imprecise through carelessness.</p>`,

    'Nominalisation': `<h3>Turning Actions into Things</h3>
<p>Nominalisation is the process of converting verbs or adjectives into nouns, making sentences more compact and formal. Instead of <strong>"The government investigated the matter and this caused controversy"</strong>, nominalisation produces <strong>"The government investigation caused controversy."</strong> This transformation is a hallmark of academic and professional writing.</p>
<p>Common nominalisation patterns include: <strong>verb → noun</strong> (<strong>evaluate → evaluation, develop → development, suggest → suggestion</strong>), and <strong>adjective → noun</strong> (<strong>significant → significance, relevant → relevance, probable → probability</strong>). The resulting nouns allow you to pack more information into fewer words.</p>
<p>Overusing nominalisation can make writing dense and difficult to read. The key is balance: use it when precision and formality are required, but switch to verb-based structures when clarity and directness are priorities. Compare <strong>"The implementation of the strategy resulted in the improvement of performance"</strong> (heavily nominalised) with <strong>"Implementing the strategy improved performance"</strong> (clearer and more direct).</p>`,

    'Conditional Concessives': `<h3>Even If, Whether or Not, and Despite</h3>
<p>Conditional concessives express that something is true regardless of the condition. <strong>"Even if it rains, we will go hiking"</strong> means the plan does not change whether it rains or not. This structure differs from a regular conditional — it is not about cause and effect but about irrelevance of the condition.</p>
<p><strong>Whether or not</strong> is similar but more explicit: <strong>"Whether or not you agree, the decision has been made."</strong> <strong>Despite</strong> and <strong>in spite of</strong> are followed by noun phrases: <strong>"Despite the rain, we went hiking."</strong> <strong>Although</strong>, <strong>though</strong>, and <strong>even though</strong> are followed by clauses: <strong>"Even though it was raining, we went hiking."</strong></p>
<p>Advanced concessive structures include <strong>much as</strong> (<strong>"Much as I admire her work, I cannot support this proposal"</strong>), <strong>while</strong> (<strong>"While the evidence is compelling, it is not conclusive"</strong>), and <strong>admittedly</strong> (<strong>"Admittedly, the sample size was small, but the findings are significant"</strong>). These structures allow nuanced argumentation that acknowledges counterpoints while maintaining your position.</p>`,

    'Rhetorical Devices': `<h3>Persuasion Through Pattern</h3>
<p>Rhetorical devices are techniques that writers and speakers use to persuade, emphasize, or create memorable language. <strong>Anaphora</strong> repeats the opening of successive clauses: <strong>"We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields."</strong> This repetition builds momentum and emotional intensity.</p>
<p><strong>Antithesis</strong> juxtaposes contrasting ideas in parallel structure: <strong>"It was the best of times, it was the worst of times."</strong> <strong>Chiasmus</strong> reverses the order of words in parallel clauses: <strong>"Ask not what your country can do for you — ask what you can do for your country."</strong> Both devices create balance and memorability.</p>
<p>Other important devices include <strong>tricolon</strong> (groups of three: <strong>"Government of the people, by the people, for the people"</strong>), <strong>zeugma</strong> (one verb governing multiple objects: <strong>"She stole my heart and my wallet"</strong>), and <strong>litotes</strong> (understatement through double negation: <strong>"Not bad"</strong> meaning <strong>"good"</strong>). Recognizing these devices enhances both your reading comprehension and your own persuasive writing.</p>`,

    'Discourse Analysis': `<h3>How Language Creates Meaning Beyond Sentences</h3>
<p>Discourse analysis examines how language functions above the sentence level — how texts and conversations are organized, how coherence is achieved, and how power relations are enacted through language. It moves beyond grammar to consider the social and communicative dimensions of language use.</p>
<p>Key concepts include <strong>cohesion</strong> (the linguistic links between sentences — reference, substitution, ellipsis, conjunction), <strong>coherence</strong> (the logical flow of ideas that makes a text meaningful), and <strong>genre</strong> (the conventionalized form that different types of text follow — academic articles, business reports, news stories).</p>
<p>Critical discourse analysis (CDA) examines how language reflects and reinforces power structures. It asks questions like: Whose voices are represented and whose are absent? What assumptions does the text make? How are readers positioned to interpret events? These analytical skills are essential for advanced reading and for producing writing that is aware of its own rhetorical strategies.</p>`,

    'Evaluative Language': `<h3>Judging with Words</h3>
<p>Evaluative language expresses the speaker's attitude, judgment, or assessment. It goes beyond describing facts to conveying opinions, values, and emotional responses. Words like <strong>"remarkably", "unfortunately", "surprisingly", "arguably",</strong> and <strong>"notoriously"</strong> all carry evaluative weight that shapes how readers interpret information.</p>
<p>Appraisal theory identifies three main systems: <strong>affect</strong> (expressing emotion: <strong>"I was delighted by the proposal"</strong>), <strong>judgment</strong> (evaluating behavior: <strong>"Her dedication was admirable"</strong>), and <strong>appreciation</strong> (evaluating things: <strong>"The architecture was stunning"</strong>). Understanding these categories helps you analyze and craft persuasive language.</p>
<p>In academic writing, evaluative language must be carefully calibrated. <strong>"The study demonstrates..."</strong> is stronger than <strong>"The study suggests..."</strong> which is stronger than <strong>"The study hints at..."</strong> Each verb choice signals a different level of confidence. Mastering evaluative language is essential for writing that is both authoritative and intellectually honest.</p>`,

    'Subjunctive & Mandative': `<h3>The Grammar of Wishes and Demands</h3>
<p>The subjunctive mood expresses hypothetical, desired, or demanded situations. In English, it appears in two main contexts: <strong>mandative subjunctive</strong> (after verbs of command or suggestion) and <strong>formulaic subjunctive</strong> (in fixed expressions). The mandative subjunctive uses the base form of the verb regardless of the subject: <strong>"The committee recommended that she be appointed"</strong> (not <strong>"is appointed"</strong>).</p>
<p>Verbs that trigger the mandative subjunctive include <strong>recommend, suggest, insist, demand, require, propose,</strong> and <strong>request</strong>. The structure is: <strong>verb + that + subject + base form</strong>: <strong>"The law requires that all citizens vote"</strong>, <strong>"The doctor insisted that he rest."</strong> In British English, <strong>should + base form</strong> is an accepted alternative: <strong>"The committee recommended that she should be appointed."</strong></p>
<p>Formulaic subjunctive appears in fixed expressions: <strong>"God save the Queen"</strong> (not <strong>"saves"</strong>), <strong>"Heaven forbid"</strong>, <strong>"Come what may"</strong>, <strong>"Be that as it may"</strong>, and <strong>"If need be."</strong> These expressions preserve older grammatical forms that have otherwise disappeared from everyday English. Recognizing them helps you understand formal and literary texts.</p>`,

    'Participle Clauses': `<h3>Condensing Sentences with -ing and -ed</h3>
<p>Participle clauses use present participles (<strong>-ing</strong>) or past participles (<strong>-ed/-en</strong>) to create more concise sentences by reducing full relative or adverbial clauses. <strong>Present participle clauses</strong> describe active or simultaneous actions: <strong>"Walking through the park, she noticed a rare bird"</strong> (= <strong>"While she was walking..."</strong>).</p>
<p>Past participle clauses describe passive or completed actions: <strong>"Built in the 12th century, the cathedral is a masterpiece"</strong> (= <strong>"Because it was built..."</strong>). Perfect participle clauses (<strong>having + past participle</strong>) describe completed actions before the main clause: <strong>"Having finished the exam, she felt relieved"</strong> (= <strong>"After she had finished..."</strong>).</p>
<p>A critical rule: the subject of the participle clause must match the subject of the main clause. <strong>"Walking to work, the rain started"</strong> is incorrect because it implies the rain was walking. The correct version is <strong>"Walking to work, I got caught in the rain"</strong> or <strong>"As I was walking to work, the rain started."</strong> This "dangling participle" error is common even among native speakers.</p>`,

    'Metadiscourse': `<h3>Writing About Writing</h3>
<p>Metadiscourse is language that refers to the text itself rather than to the subject matter. It is the "writing about writing" that guides readers through your argument: <strong>"In this section, I will argue..."</strong>, <strong>"As discussed above..."</strong>, <strong>"The following example illustrates..."</strong>. Without metadiscourse, academic writing would be impenetrable.</p>
<p>Metadiscourse falls into two broad categories: <strong>interactive</strong> (helping organize the text for the reader) and <strong>interactional</strong> (involving the reader in the argument). Interactive markers include transitions (<strong>"however", "furthermore", "consequently"</strong>), frame markers (<strong>"first", "finally", "to conclude"</strong>), and endophoric markers (<strong>"see Figure 1", "as noted earlier"</strong>).</p>
<p>Interactional markers include hedges (<strong>"perhaps", "it seems"</strong>), boosters (<strong>"clearly", "undoubtedly"</strong>), attitude markers (<strong>"surprisingly", "importantly"</strong>), self-mentions (<strong>"I argue"</strong>), and engagement markers (<strong>"note that", "consider"</strong>). The strategic use of metadiscourse distinguishes sophisticated academic writing from mere information delivery.</p>`,

    'Peer Review Process': `<h3>The Gatekeepers of Academic Knowledge</h3>
<p>The peer review process is the mechanism by which scholarly work is evaluated by independent experts before publication, serving as the principal quality-control system in academia. When a manuscript is submitted to a journal, the editor first assesses whether it falls within the journal's scope and meets basic standards of rigor. If it passes this initial screening, it is sent to typically two or three <strong>anonymous reviewers</strong> — scholars with expertise in the relevant field who evaluate the work's methodology, argumentation, and contribution to knowledge.</p>
<p>The language of peer review is governed by its own conventions and grammatical patterns. Reviewers frequently employ <strong>evaluative adjectives</strong> such as <strong>"compelling", "rigorous", "problematic",</strong> and <strong>"insufficient"</strong> alongside <strong>hedging constructions</strong> that soften criticism: <strong>"The authors might consider..."</strong>, <strong>"It would strengthen the paper if..."</strong>, <strong>"One potential concern is that..."</strong>. This diplomatic register reflects both professional courtesy and the understanding that scholarly disagreement is legitimate — a reviewer is not rejecting a colleague's work outright but identifying areas where the argument could be more robust.</p>
<p>From a grammatical standpoint, peer review reports are notable for their extensive use of <strong>conditional and modal constructions</strong>. Recommendations are typically framed with <strong>should</strong>, <strong>could</strong>, or <strong>would</strong> rather than imperative commands: <strong>"The methodology section should be expanded to include..."</strong>, <strong>"The authors could address this limitation by..."</strong>. This modal language preserves the author's intellectual autonomy while still conveying substantive critique. The <strong>passive voice</strong> is also prevalent: <strong>"It is recommended that..."</strong>, <strong>"Further justification is needed for..."</strong> — a construction that depersonalizes the critique and frames suggestions as objective requirements rather than individual preferences.</p>
<p>The peer review process, while foundational to academic publishing, is not without its critics. Concerns about <strong>reviewer bias</strong> — whether ideological, institutional, or based on the identity of the author — have prompted many journals to adopt <strong>double-blind review</strong>, in which neither authors nor reviewers know each other's identities. More radical alternatives include <strong>open peer review</strong>, where reports and reviewer names are published alongside the article, and <strong>post-publication review</strong>, where evaluation occurs after the work becomes publicly available. Understanding these debates is essential for any scholar navigating the contemporary publishing landscape.</p>`,

    // ═══════════════════════════════════════════════════════════
    //  BEGINNER (A1-A2) — 10 Lessons from Course Markdown
    // ═══════════════════════════════════════════════════════════

    'Present Simple — Daily Routines': `<h3>Present Simple — Daily Routines</h3>
<p>The present simple describes <strong>habits, routines, and facts</strong>. It's the most common tense in English.</p>
<p><strong>Structure:</strong></p>
<ul>
<li>I / You / We / They + base verb → "I <strong>work</strong> at 9 AM."</li>
<li>He / She / It + base verb + <strong>-s/-es</strong> → "She <strong>works</strong> at 9 AM."</li>
</ul>
<p><strong>Spelling rules for -s:</strong> Most verbs add -s (works, eats). Verbs ending in -ch, -sh, -ss, -x, -o, -z add -es (watches, washes, goes). Verbs ending in consonant + y change y to i and add -es (studies, flies). Verbs ending in vowel + y add -s (plays, stays).</p>
<p><strong>Common time expressions:</strong> every day, always, usually, often, sometimes, rarely, never, in the morning, at night, on weekends.</p>
<p><strong>Practice:</strong> She ___ (work) in a hospital. / They ___ (not/live) in the city centre. / ___ he ___ (speak) French? / We ___ (usually/eat) dinner at 7 PM.</p>
<p><strong>Answers:</strong> works / don't live / Does, speak / usually eat</p>`,

    'Present Continuous — Right Now': `<h3>Present Continuous — Right Now</h3>
<p>The present continuous describes <strong>actions happening now</strong> or <strong>temporary situations</strong>.</p>
<p><strong>Structure:</strong> Subject + am/is/are + verb-ing</p>
<p><strong>Forming -ing:</strong> Most verbs add -ing (working, reading). Verbs ending in -e: remove -e, add -ing (making, writing). Short verbs (CVC): double final letter, add -ing (running, sitting, swimming).</p>
<p><strong>Present simple vs present continuous:</strong> "I <strong>drink</strong> coffee every day." (habit) vs. "I <strong>am drinking</strong> coffee right now." (happening now). "I <strong>live</strong> in Paris." (permanent) vs. "I <strong>am living</strong> with my parents this month." (temporary).</p>
<p><strong>Practice:</strong> She usually ___ (drive) to work, but today she ___ (take) the bus. / Listen! The baby ___ (cry). / Every summer, we ___ (go) to the beach.</p>
<p><strong>Answers:</strong> drives, is taking / is crying / go</p>`,

    'Articles — A, An, The': `<h3>Articles — A, An, The</h3>
<p><strong>A / An</strong> = one of many, not specific: "I have <strong>a</strong> car." / "She is <strong>an</strong> engineer." Use <strong>an</strong> before vowel sounds: an apple, an hour (silent h), an umbrella. Use <strong>a</strong> before consonant sounds: a book, a university (sounds like "y"), a horse.</p>
<p><strong>The</strong> = specific, known, unique: "<strong>The</strong> car in the garage is mine." / "<strong>The</strong> sun is hot." / "I saw <strong>the</strong> film you recommended."</p>
<p><strong>No article (∅):</strong> Plural general nouns: "I like ∅ cats." Uncountable general nouns: "I drink ∅ water." Proper nouns: "She lives in ∅ Paris." Meals: "I have ∅ breakfast at 8."</p>
<p><strong>Practice:</strong> I am ___ student. / She is ___ honest person. / ___ book on the table is mine. / I like ___ music. / He plays ___ guitar.</p>
<p><strong>Answers:</strong> a / an / The / ∅ / the</p>`,

    'Prepositions of Place — In, On, At': `<h3>Prepositions of Place — In, On, At</h3>
<p><strong>In</strong> = inside a space or large area: in a room, in a building, in a city, in a country.</p>
<p><strong>On</strong> = surface contact or specific days: on the table, on the wall, on the floor, on Monday, on Christmas Day.</p>
<p><strong>At</strong> = specific point or general location: at the bus stop, at the door, at the top, at home, at work, at school.</p>
<p><strong>Common phrases to memorize:</strong> at home / at work / at school. in the morning / in the afternoon / in the evening. on Monday / on the weekend (US). at night / at the weekend (UK). in summer / in March. on time (punctual) / in time (before the deadline).</p>
<p><strong>Practice:</strong> She lives ___ London. / The book is ___ the table. / I am ___ home. / We met ___ Monday. / My birthday is ___ July.</p>
<p><strong>Answers:</strong> in / on / at / on / in</p>`,

    'Past Simple — Regular Verbs': `<h3>Past Simple — Regular Verbs</h3>
<p>The past simple describes <strong>completed actions</strong> at a specific time in the past.</p>
<p><strong>Regular verbs: add -ed</strong> Most verbs: play → <strong>played</strong>, work → <strong>worked</strong>. Verbs ending in -e: dance → <strong>danced</strong>, like → <strong>liked</strong>. Verbs ending in consonant + y: study → <strong>studied</strong>, carry → <strong>carried</strong>. Short verbs (CVC): stop → <strong>stopped</strong>, plan → <strong>planned</strong>.</p>
<p><strong>Time expressions:</strong> yesterday, last week, last month, last year, ago (two days ago, three weeks ago), in 2019.</p>
<p><strong>Common mistakes:</strong> ❌ "I have visited Paris last year." → ✅ "I <strong>visited</strong> Paris last year." ❌ "Did you went?" → ✅ "<strong>Did</strong> you <strong>go</strong>?"</p>
<p><strong>Practice:</strong> She ___ (walk) to school yesterday. / They ___ (not/finish) the project on time. / ___ he ___ (call) you last night?</p>
<p><strong>Answers:</strong> walked / didn't finish / Did, call</p>`,

    'Past Simple — Irregular Verbs Part 1': `<h3>Past Simple — Irregular Verbs (Part 1)</h3>
<p>Irregular verbs do NOT add -ed. You must memorize the past form.</p>
<p><strong>Group 1: Same form</strong> (base = past = past participle): cut → cut → cut, put → put → put, read → read → read</p>
<p><strong>Group 2: Vowel change</strong> (i → a → u): begin → began → begun, drink → drank → drunk, sing → sang → sung, swim → swam → swum</p>
<p><strong>Group 3: Other common patterns:</strong> go → went → gone, come → came → come, know → knew → known, think → thought → thought, bring → brought → brought, buy → bought → bought, teach → taught → taught, catch → caught → caught</p>
<p><strong>Practice:</strong> Complete the table — go → ___ / ___ | see → ___ / ___ | eat → ___ / ___ | take → ___ / ___ | give → ___ / ___</p>
<p><strong>Answers:</strong> went/gone, saw/seen, ate/eaten, took/taken, gave/given</p>`,

    'Can / Can\'t — Ability and Possibility': `<h3>Can / Can't — Ability and Possibility</h3>
<p><strong>Can</strong> is a modal verb — it does NOT change for he/she/it.</p>
<p><strong>Ability:</strong> "I <strong>can</strong> swim." / "She <strong>can</strong> speak three languages." / "He <strong>can't</strong> drive."</p>
<p><strong>Possibility:</strong> "You <strong>can</strong> take the bus. It's faster." / "We <strong>can't</strong> go to the beach. It's raining."</p>
<p><strong>Requests:</strong> "<strong>Can</strong> you help me?" / "<strong>Can</strong> I use your phone?" / "<strong>Can</strong> you open the window, please?"</p>
<p><strong>Offers:</strong> "I <strong>can</strong> help you with that." / "I <strong>can</strong> carry your bag."</p>
<p><strong>Pronunciation note:</strong> "Can't" in British English sounds like /kɑːnt/. In American English, it sounds like /kænt/.</p>
<p><strong>Practice:</strong> I ___ swim very well. / She ___ play the piano. She never learned. / ___ you speak more slowly, please?</p>
<p><strong>Answers:</strong> can / can't / Can</p>`,

    'Question Formation': `<h3>Question Formation</h3>
<p><strong>Yes/No questions (with auxiliary):</strong> Present simple: Do/Does + subject + verb? → "<strong>Do</strong> you <strong>like</strong> pizza?" Past simple: Did + subject + verb? → "<strong>Did</strong> she <strong>go</strong> to school?" Present continuous: Am/Is/Are + subject + verb-ing? → "<strong>Are</strong> they <strong>coming</strong>?"</p>
<p><strong>WH- questions:</strong> What (thing/action), Where (place), When (time), Who (person), Why (reason), How (manner), How much (uncountable price), How many (countable quantity).</p>
<p><strong>Subject questions (no auxiliary!):</strong> "<strong>Who</strong> broke the window?" (NOT "Who did break...") / "<strong>What</strong> happened?" (NOT "What did happen?")</p>
<p><strong>Practice:</strong> ___ (you/live)? / ___ (she/work) yesterday? / ___ (they/coming) to the party? / ___ (why/he/leave) early?</p>
<p><strong>Answers:</strong> Where do you live? / Did she work yesterday? / Are they coming to the party? / Why did he leave early?</p>`,

    'Countable & Uncountable Nouns (Detailed)': `<h3>Countable & Uncountable Nouns</h3>
<p><strong>Countable nouns:</strong> Things you can count. Have singular and plural forms. "How <strong>many</strong> books?"</p>
<p><strong>Uncountable nouns:</strong> Things you cannot count. No plural form. water, rice, advice, information, money, luggage. "How <strong>much</strong> water?"</p>
<p><strong>Common uncountable nouns that confuse learners:</strong> ❌ "an information" → ✅ "some information". ❌ "two advices" → ✅ "two pieces of advice". ❌ "many money" → ✅ "much money / a lot of money". ❌ "furnitures" → ✅ "some furniture".</p>
<p><strong>Quantifiers:</strong> Countable: some / a lot of / many (positive), any / not many (negative). Uncountable: some / a lot of / much (positive), any / not much (negative).</p>
<p><strong>Practice:</strong> rice ___ | chair ___ | music ___ | homework ___ | bottle ___</p>
<p><strong>Answers:</strong> uncountable / countable / uncountable / uncountable / countable</p>`,

    'Basic Conversation — Introducing Yourself': `<h3>Introducing Yourself</h3>
<p><strong>Introducing yourself:</strong> "Hello, my name is [Name]. Nice to meet you." / "Hi, I'm [Name]. I'm from [Country/City]." / "Good morning. I'm [Name]. I work as a [Job]."</p>
<p><strong>Asking about someone:</strong> "What's your name?" / "Where are you from?" / "What do you do?" (= What is your job?) / "How old are you?" / "Do you speak [language]?" / "Where do you live?"</p>
<p><strong>Common responses:</strong> "I'm from Spain. / I come from Spain." / "I work as a teacher. / I'm a teacher." / "I'm 25 years old." / "Yes, I speak a little English."</p>
<p><strong>Polite phrases:</strong> "Nice to meet you too." / "Pardon? / Sorry?" (when you don't understand) / "Could you repeat that, please?" / "I don't understand." / "How do you say [word] in English?"</p>
<p><strong>Practice:</strong> Complete the dialogue — A: Hello! ___? B: Hi! I'm Marco. ___? A: I'm Sarah. ___? B: I'm from Italy. ___?</p>
<p><strong>Answers:</strong> What's your name? / And you? / Where are you from? / What about you?</p>`,

    // ═══════════════════════════════════════════════════════════
    //  INTERMEDIATE (B1-B2) — 10 Lessons from Course Markdown
    // ═══════════════════════════════════════════════════════════

    'Present Perfect Continuous': `<h3>Present Perfect Continuous</h3>
<p>The present perfect continuous connects the past with the present. It emphasizes <strong>duration</strong> and <strong>ongoing activity</strong>.</p>
<p><strong>Structure:</strong> Subject + has/have + been + verb-ing</p>
<p><strong>Examples:</strong> "I <strong>have been working</strong> here for three years." / "She <strong>has been studying</strong> English since 2020." / "It <strong>has been raining</strong> all morning."</p>
<p><strong>When to use it:</strong> 1) Actions that started in the past and continue to now (with for/since). 2) Recently completed actions with visible results. 3) Temporary situations that may change.</p>
<p><strong>Common mistakes:</strong> ❌ "I am working here for 3 years." → ✅ "I <strong>have been working</strong> here for 3 years." ❌ "She has been knowing him for years." → ✅ "She <strong>has known</strong> him for years." (Stative verbs don't use continuous)</p>
<p><strong>Practice:</strong> He ___ (work) on this project ___ last Monday. / They ___ (live) in London ___ six months. / I ___ (wait) for the bus ___ 20 minutes.</p>
<p><strong>Answers:</strong> has been working, since / have been living, for / have been waiting, for</p>`,

    'Comparative & Superlative Adjectives': `<h3>Comparative & Superlative Adjectives</h3>
<p><strong>Comparatives</strong> (comparing two things): Short adjectives add <strong>-er</strong> → "taller," "faster," "bigger." Long adjectives use <strong>more</strong> → "more expensive." <strong>Irregulars:</strong> good → better, bad → worse, far → farther/further.</p>
<p><strong>Superlatives</strong> (comparing 3+ things): Short adjectives add <strong>-est</strong> → "tallest," "fastest." Long adjectives use <strong>most</strong> → "most expensive." <strong>Irregulars:</strong> good → best, bad → worst, far → farthest/furthest.</p>
<p><strong>Spelling rules:</strong> Big → <strong>bigg</strong>er (double final consonant). Easy → <strong>eas</strong>ier (y → i). Expensive → <strong>more expensive</strong> (no change).</p>
<p><strong>Practice:</strong> Living in the city is ___ (expensive) than the countryside. / That was the ___ (bad) meal I have ever had. / My English is getting ___ (good) every day. / Japan is the ___ (beautiful) country I have visited.</p>
<p><strong>Answers:</strong> more expensive / worst / better / most beautiful</p>`,

    'First Conditional (Real Future)': `<h3>First Conditional — Real Future</h3>
<p>The first conditional talks about <strong>real, possible future situations</strong>.</p>
<p><strong>Structure:</strong> If + present simple, will + base verb</p>
<p><strong>Examples:</strong> "<strong>If it rains tomorrow, I will stay home.</strong>" / "<strong>If you study hard, you will pass the exam.</strong>"</p>
<p><strong>Variations:</strong> Instead of "will," you can use <strong>can, may, might, should</strong>: "If you finish early, <strong>you can leave</strong>." (permission) / "If the weather is good, <strong>we might go</strong> hiking." (possibility) / "If you feel sick, <strong>you should see</strong> a doctor." (advice)</p>
<p><strong>Common mistakes:</strong> ❌ "If it will rain, I stay home." → ✅ "If it <strong>rains</strong>, I <strong>will stay</strong> home." (No "will" after "if")</p>
<p><strong>Practice:</strong> If I ___ (have) time tomorrow, I ___ (help) you. / If it ___ (not/stop) raining, we ___ (cancel) the picnic. / If he ___ (arrive) late, he ___ (miss) the meeting.</p>
<p><strong>Answers:</strong> have, will help / doesn't stop, will cancel / arrives, will miss</p>`,

    'Second Conditional (Unreal Present/Future)': `<h3>Second Conditional — Unreal Present/Future</h3>
<p>The second conditional talks about <strong>unreal, hypothetical, or unlikely situations</strong>.</p>
<p><strong>Structure:</strong> If + past simple, would + base verb</p>
<p><strong>Examples:</strong> "<strong>If I had a million dollars, I would travel the world.</strong>" / "<strong>If she were here, she would know what to do.</strong>"</p>
<p><strong>Important note on "were":</strong> For all subjects (I, he, she, it), use <strong>were</strong> in formal English: "If I <strong>were</strong> you" (not "If I was you").</p>
<p><strong>Using "could" and "might":</strong> "If I spoke French, I <strong>could work</strong> in Paris." (ability) / "If we left now, we <strong>might catch</strong> the train." (possibility)</p>
<p><strong>Practice:</strong> If I ___ (be) you, I ___ (take) the job. / If she ___ (have) more time, she ___ (learn) Japanese. / If I ___ (win) the lottery, I ___ (buy) a house.</p>
<p><strong>Answers:</strong> were, would take / had, would learn / won, would buy</p>`,

    'Third Conditional (Unreal Past)': `<h3>Third Conditional — Unreal Past</h3>
<p>The third conditional is about <strong>regrets, missed opportunities, and hypothetical past</strong>.</p>
<p><strong>Structure:</strong> If + past perfect, would have + past participle</p>
<p><strong>Examples:</strong> "<strong>If I had studied harder, I would have passed the exam.</strong>" / "<strong>If she had left earlier, she wouldn't have missed the train.</strong>"</p>
<p><strong>Contractions:</strong> "I would have" → "I'd have" or "I'd've." "If I had" → "If I'd."</p>
<p><strong>Using "could have" and "might have":</strong> "If I had taken the job, I <strong>could have moved</strong> to New York." (past possibility) / "If he had been more careful, he <strong>might not have broken</strong> it." (uncertainty)</p>
<p><strong>Practice:</strong> If I ___ (arrive) earlier, I ___ (get) a better seat. / If she ___ (listen) to me, she ___ (not/make) that mistake. / If they ___ (invite) me, I ___ (come) to the party.</p>
<p><strong>Answers:</strong> had arrived, would have gotten / had listened, wouldn't have made / had invited, would have come</p>`,

    'Mixed Conditionals (Past → Present)': `<h3>Mixed Conditionals — Past → Present</h3>
<p>Mixed conditionals combine <strong>different time frames</strong>. The most common connects a past hypothetical cause with a present consequence.</p>
<p><strong>Structure:</strong> If + past perfect (hypothetical past), would + base verb (present consequence)</p>
<p><strong>Examples:</strong> "<strong>If I had studied medicine, I would be a doctor now.</strong>" / "<strong>If she had taken that job, she would be living in London.</strong>" / "<strong>If we had invested in that company, we would be rich.</strong>"</p>
<p><strong>Other combinations:</strong> Past cause → present result: "If I <strong>had studied</strong> more, I <strong>would know</strong> the answer." Present cause → past result: "If I <strong>spoke</strong> better English, I <strong>would have gotten</strong> that job." (less common)</p>
<p><strong>Practice:</strong> If I had gone to bed earlier last night, I ___ (not/be) so tired now. / If she had saved more money, she ___ (be able to) afford the trip. / If he had learned to drive, he ___ (not/need) to take the bus.</p>
<p><strong>Answers:</strong> wouldn't be / would be able to / wouldn't need</p>`,

    'Passive Voice (All Tenses)': `<h3>Passive Voice — All Tenses</h3>
<p>The passive voice shifts focus from <strong>who did the action</strong> to <strong>what happened</strong>.</p>
<p><strong>Structure:</strong> Subject + be (in correct tense) + past participle</p>
<p><strong>All tenses in passive:</strong> Present simple: "The report <strong>is written</strong>." Present continuous: "The report <strong>is being written</strong>." Past simple: "The report <strong>was written</strong>." Past continuous: "The report <strong>was being written</strong>." Present perfect: "The report <strong>has been written</strong>." Future: "The report <strong>will be written</strong>." Modal: "The report <strong>must be written</strong>."</p>
<p><strong>When to use passive:</strong> 1) The agent is unknown: "My car <strong>was stolen</strong>." 2) The agent is obvious: "He <strong>was arrested</strong>." 3) Focus on the action: "The new policy <strong>has been implemented</strong>." 4) Formal/academic writing: "It <strong>has been suggested</strong> that..."</p>
<p><strong>Practice:</strong> Someone has stolen my bicycle. → My bicycle ___. / They will announce the results tomorrow. → The results ___. / They are building a new hospital. → A new hospital ___.</p>
<p><strong>Answers:</strong> has been stolen / will be announced tomorrow / is being built</p>`,

    'Reported Speech (Detailed)': `<h3>Reported Speech</h3>
<p>When we report what someone said, we usually move the verb <strong>one step back in time</strong>.</p>
<p><strong>Tense changes:</strong> Present simple → Past simple. Present continuous → Past continuous. Past simple → Past perfect. Will → Would. Can → Could. May → Might. Must → Had to.</p>
<p><strong>Example:</strong> Direct: "I <strong>am tired</strong>," she said. → Reported: She said that she <strong>was tired</strong>. Direct: "I <strong>will help</strong> you," he promised. → Reported: He promised that he <strong>would help</strong> me.</p>
<p><strong>Time/place changes:</strong> today → that day, yesterday → the day before, tomorrow → the next day, now → then, here → there, this → that.</p>
<p><strong>Question reporting:</strong> "Where <strong>are</strong> you going?" → He asked where I <strong>was</strong> going. / "Did you <strong>see</strong> him?" → He asked if I <strong>had seen</strong> him.</p>
<p><strong>Practice:</strong> "I am busy," she said. → She said ___. / "He will come tomorrow," she told me. → She told me ___. / "Where do you live?" he asked. → He asked ___.</p>
<p><strong>Answers:</strong> she was busy / he would come the next day / where I lived</p>`,

    'Modal Verbs of Deduction': `<h3>Modal Verbs of Deduction</h3>
<p>We use modal verbs to express how <strong>certain</strong> we are about something.</p>
<p><strong>Present deductions:</strong> <strong>must</strong> (Very sure - 95%): "She <strong>must be</strong> tired. She worked 12 hours." / <strong>might/may/could</strong> (Possible - 50%): "He <strong>might be</strong> at home." / <strong>can't</strong> (Impossible - 0%): "That <strong>can't be</strong> true."</p>
<p><strong>Past deductions:</strong> <strong>must have</strong> (Very sure): "She <strong>must have forgotten</strong>." / <strong>might/may/could have</strong> (Possible): "He <strong>might have left</strong> already." / <strong>can't have</strong> (Impossible): "He <strong>can't have stolen</strong> it."</p>
<p><strong>Important distinction:</strong> "He <strong>must</strong> be rich." (deduction: I'm sure he's rich) vs. "He <strong>has to</strong> be rich." (obligation: someone requires it).</p>
<p><strong>Practice:</strong> She ___ (must/might) be at work. Her car is not here. / They ___ (can't/might) have finished already. It's too early. / That ___ (must/can't) be the right answer. It doesn't make sense.</p>
<p><strong>Answers:</strong> must / can't / can't</p>`,

    'Hedging Language & Softening': `<h3>Hedging Language & Softening</h3>
<p><strong>Hedging</strong> means softening what you say so you don't sound too direct or rude. It's essential for professional and academic English.</p>
<p><strong>Why hedge?</strong> ❌ "This is the best solution." (too absolute) → ✅ "This <strong>appears to be</strong> one of the <strong>most viable</strong> solutions <strong>available at present</strong>." (more diplomatic)</p>
<p><strong>Hedging phrases:</strong> Tentative opinions: I think / I believe / It seems to me that. Uncertainty: perhaps, maybe, possibly, probably. Limited commitment: as far as I know, to the best of my knowledge. Generalization: tends to, generally, in most cases. Softening disagreement: I see your point, but... / That's a valid perspective, however... / I understand where you're coming from, but...</p>
<p><strong>Practice:</strong> Soften: "You are wrong about this." → ___ / Soften: "This plan will fail." → ___ / Soften: "The data is incorrect." → ___</p>
<p><strong>Answers:</strong> "I'm not sure I agree with that point." / "I'm concerned this plan might face some challenges." / "The data may need to be reviewed."</p>`,

    // ═══════════════════════════════════════════════════════════
    //  ADVANCED (C1-C2) — 10 Lessons from Course Markdown
    // ═══════════════════════════════════════════════════════════

    'Subjunctive Mood (Advanced)': `<h3>The Subjunctive Mood</h3>
<p>The subjunctive mood is used in <strong>formal English</strong> to express wishes, demands, suggestions, and hypothetical scenarios.</p>
<p><strong>Type 1: Bare infinitive subjunctive (formal)</strong> — After verbs like demand, insist, suggest, recommend, propose, require: "I <strong>suggest that he go</strong> early." (NOT "he goes") / "The manager <strong>demanded that she finish</strong> the report by Friday." / "It is <strong>essential that every applicant submit</strong> two references."</p>
<p><strong>Type 2: "Were" for all subjects (unreal)</strong> — "If I <strong>were</strong> you, I would accept." / "If she <strong>were</strong> here, she would agree." / "I wish I <strong>were</strong> taller."</p>
<p><strong>Type 3: Fixed expressions</strong> — "God <strong>bless</strong> you." / "Long <strong>live</strong> the Queen." / "Come what <strong>may</strong>, I will finish this." / "Be that as it <strong>may</strong>, we must proceed."</p>
<p><strong>Practice:</strong> I suggest that he ___ (leave) early. / It is important that she ___ (be) on time. / If I ___ (be) in charge, things would be different.</p>
<p><strong>Answers:</strong> leave / be / were</p>`,

    'Cleft Sentences and Emphasis': `<h3>Cleft Sentences and Emphasis</h3>
<p>Cleft sentences allow you to <strong>emphasise specific information</strong> by splitting a simple sentence into two clauses.</p>
<p><strong>It-clefts:</strong> Subject: "<strong>It was John</strong> who broke the window." Object: "<strong>It was the window</strong> that John broke." Time: "<strong>It was yesterday</strong> that he arrived." Place: "<strong>It was in Paris</strong> that they met." Reason: "<strong>It was because he was late</strong> that we left."</p>
<p><strong>Wh-clefts (pseudo-clefts):</strong> "<strong>What I need</strong> is more time." / "<strong>What surprised me</strong> was his reaction." / "<strong>Where we went</strong> was a complete secret."</p>
<p><strong>Reversed wh-clefts:</strong> "More time is <strong>what I need</strong>." / "His reaction is <strong>what surprised me</strong>."</p>
<p><strong>All-clefts:</strong> "<strong>All I want</strong> is a fair chance." / "<strong>All she did</strong> was complain."</p>
<p><strong>Practice:</strong> Emphasise: <u>My brother</u> taught me to drive. → ___ / I need <u>a new laptop</u>. → ___ / They met <u>at a conference</u>. → ___</p>
<p><strong>Answers:</strong> It was my brother who taught me to drive. / What I need is a new laptop. / It was at a conference that they met.</p>`,

    'Hedging and Tentative Language (Advanced)': `<h3>Advanced Hedging and Tentative Language</h3>
<p>At C1-C2, direct statements sound immature. <strong>Hedging</strong> shows intellectual humility and precision.</p>
<p><strong>Modal hedges:</strong> "The data <strong>would appear to suggest</strong> that..." / "One <strong>might reasonably argue</strong> that..." / "This <strong>could potentially indicate</strong> that..."</p>
<p><strong>Probability adverbs:</strong> "The results <strong>arguably/presumably/ostensibly</strong> support this theory." / "It is <strong>conceivably/potentially/plausibly</strong> the case that..."</p>
<p><strong>Verbal hedges:</strong> "It <strong>tends to be the case</strong> that..." / "The evidence <strong>seems to point toward</strong>..." / "This <strong>appears to corroborate</strong> the hypothesis that..."</p>
<p><strong>Noun phrases:</strong> "There is <strong>a strong possibility</strong> that..." / "It is <strong>a reasonable assumption</strong> that..." / "There is <strong>growing evidence</strong> to suggest that..."</p>
<p><strong>Shield hedges:</strong> "<strong>According to recent studies</strong>, climate change is accelerating." / "<strong>It is widely held that</strong> free markets drive innovation."</p>
<p><strong>Practice:</strong> Transform: "This method is the best." → ___ / Transform: "The results prove the theory." → ___</p>
<p><strong>Answers:</strong> "This method <strong>would appear to be</strong> among the most effective currently available." / "The results <strong>provide strong support for</strong> the theory, <strong>although further research would be beneficial</strong>."</p>`,

    'Nominalisation (Advanced)': `<h3>Nominalisation</h3>
<p><strong>Nominalisation</strong> turns actions and qualities into noun phrases. It makes writing more formal, concise, and abstract.</p>
<p><strong>Verb → Noun:</strong> decide → <strong>the decision</strong> to, investigate → <strong>an investigation</strong> into, argue → <strong>the argument</strong> that, analyse → <strong>an analysis</strong> of, improve → <strong>an improvement</strong> in, develop → <strong>the development</strong> of.</p>
<p><strong>Adjective → Noun:</strong> important → <strong>the importance</strong> of, possible → <strong>the possibility</strong> of, likely → <strong>the likelihood</strong> of, difficult → <strong>the difficulty</strong> of.</p>
<p><strong>Example transformations:</strong> ❌ "The government decided to increase taxes, and this caused protests." → ✅ "<strong>The decision</strong> to increase taxes <strong>led to</strong> widespread protests." ❌ "We analysed the data carefully, and we found some interesting results." → ✅ "<strong>Careful analysis</strong> of the data <strong>revealed</strong> some interesting findings."</p>
<p><strong>Warning:</strong> Don't overuse. Mix nominalised and verbal sentences for rhythm.</p>
<p><strong>Practice:</strong> Nominalise: "She argued that the policy was unfair, but nobody listened." → ___ / "Scientists investigated the phenomenon for decades." → ___</p>
<p><strong>Answers:</strong> "<strong>Her argument</strong> that the policy was unfair <strong>fell on deaf ears</strong>." / "<strong>Decades of investigation</strong> into the phenomenon <strong>were conducted</strong> by scientists."</p>`,

    'Discourse Markers for Sophisticated Writing': `<h3>Discourse Markers for Sophisticated Writing</h3>
<p><strong>Discourse markers</strong> connect ideas and show relationships between sentences. At C1-C2, you need sophisticated ones — not just "but" and "so."</p>
<p><strong>Adding information:</strong> "<strong>Furthermore</strong>," "<strong>Moreover</strong>," "<strong>In addition</strong>," "<strong>What is more</strong>," "<strong>Not only... but also</strong>."</p>
<p><strong>Contrasting:</strong> "<strong>Nevertheless</strong>," "<strong>Nonetheless</strong>," "<strong>Conversely</strong>," "<strong>By contrast</strong>," "<strong>On the other hand</strong>," "<strong>Having said that</strong>."</p>
<p><strong>Cause and effect:</strong> "<strong>Consequently</strong>," "<strong>As a result</strong>," "<strong>Hence</strong>," "<strong>Therefore</strong>," "<strong>This means that</strong>."</p>
<p><strong>Giving examples:</strong> "<strong>To illustrate</strong>," "<strong>A case in point is</strong>," "<strong>By way of illustration</strong>."</p>
<p><strong>Concluding:</strong> "<strong>To sum up</strong>," "<strong>All in all</strong>," "<strong>Taking everything into account</strong>," "<strong>On balance</strong>."</p>
<p><strong>Reformulating:</strong> "<strong>In other words</strong>," "<strong>To put it another way</strong>," "<strong>That is to say</strong>," "<strong>Put simply</strong>."</p>`,

    'Inversion for Emphasis (Advanced)': `<h3>Inversion for Emphasis</h3>
<p>Inversion (reversing subject-verb order) adds <strong>dramatic emphasis</strong> and is expected at C1-C2.</p>
<p><strong>Negative adverbials at the beginning:</strong> "<strong>Never before</strong> have I witnessed such behaviour." / "<strong>Rarely</strong> does a film live up to its hype." / "<strong>Seldom</strong> have I been so impressed." / "<strong>Hardly had</strong> the meeting started when the fire alarm went off." / "<strong>No sooner had</strong> I arrived than it began to rain."</p>
<p><strong>After "only":</strong> "<strong>Only later</strong> did I realise my mistake." / "<strong>Only when</strong> the report was published did the government respond." / "<strong>Only by</strong> working together can we solve this."</p>
<p><strong>After "so/such...that":</strong> "<strong>So beautiful</strong> was the sunset that we stopped to watch." / "<strong>Such was</strong> the confusion that nobody knew what to do."</p>
<p><strong>Conditional inversion (without "if"):</strong> "<strong>Had I known</strong>, I would have acted differently." (= If I had known) / "<strong>Were she to agree</strong>, we could proceed." (= If she were to agree) / "<strong>Should you need</strong> assistance, please contact us." (= If you should need)</p>`,

    'Advanced Reporting Verbs': `<h3>Advanced Reporting Verbs</h3>
<p>At B1-B2, you use "He said that..." At C1-C2, you choose verbs that show <strong>attitude</strong>.</p>
<p><strong>Neutral:</strong> state, report, mention, note, observe, point out, acknowledge. <strong>Agreement:</strong> agree, confirm, support, affirm, endorse, corroborate. <strong>Disagreement:</strong> argue, claim, contend, challenge, dispute, reject, refute, dismiss. <strong>Tentativeness:</strong> suggest, imply, indicate, speculate, hypothesise, postulate. <strong>Emphasis:</strong> assert, insist, maintain, emphasise, stress, underscore. <strong>Criticism:</strong> criticise, condemn, denounce, disparage, question.</p>
<p><strong>Structure patterns:</strong> verb + that: "She <strong>argued that</strong> the policy was flawed." / verb + noun: "He <strong>rejected</strong> the proposal." / verb + -ing: "She <strong>admitted</strong> making a mistake." / verb + to + infinitive: "He <strong>claimed to have</strong> discovered the solution." / verb + object + to + infinitive: "They <strong>persuaded him to</strong> reconsider."</p>
<p><strong>Practice:</strong> "The results prove nothing," she ___. (dispute/insist/speculate) / "We need to act now," he ___. (mention/insist/imply) / "It might work," she ___. (demand/speculate/assert)</p>
<p><strong>Answers:</strong> disputed / insisted / speculated</p>`,

    'Academic Writing — Cohesion and Coherence': `<h3>Cohesion and Coherence</h3>
<p><strong>Cohesion</strong> (how sentences connect) + <strong>Coherence</strong> (how ideas flow logically) = excellent academic writing.</p>
<p><strong>1. Reference:</strong> "The experiment <strong>was conducted</strong> over three weeks. <strong>It</strong> yielded significant results. <strong>These findings</strong> suggest that..."</p>
<p><strong>2. Substitution:</strong> "The first proposal was rejected. <strong>A revised one</strong> was submitted." / "Organic food is expensive. <strong>So is</strong> free-range meat."</p>
<p><strong>3. Ellipsis:</strong> "Some people prefer tea; others [prefer] coffee." / "The first study was large; the second [study was] small."</p>
<p><strong>4. Lexical chains:</strong> "<strong>Education</strong> policy... <strong>curriculum</strong> reform... <strong>student</strong> outcomes... <strong>learning</strong> objectives... <strong>teaching</strong> methods"</p>
<p><strong>5. Conjunction:</strong> Addition: furthermore, moreover. Contrast: however, conversely. Cause: consequently, therefore. Example: for instance, specifically.</p>
<p><strong>6. Semantic patterns:</strong> Problem → Solution → Evaluation. General → Specific → Example. Claim → Evidence → Conclusion.</p>`,

    'Metaphorical and Idiomatic Language': `<h3>Metaphorical and Idiomatic Language</h3>
<p>Native speakers use <strong>metaphor</strong> constantly. At C1-C2, you need to understand and produce it.</p>
<p><strong>Business metaphors:</strong> "We need to <strong>get the ball rolling</strong>." (start) / "Let's <strong>touch base</strong> next week." (meet briefly) / "We <strong>hit a roadblock</strong>." (encountered a problem) / "The project is <strong>on track</strong>." (progressing well) / "We <strong>moved the goalposts</strong>." (changed the criteria)</p>
<p><strong>Academic metaphors:</strong> "This research <strong>sheds light on</strong> the problem." / "The study <strong>builds on</strong> previous work." / "These findings <strong>challenge</strong> the dominant paradigm." / "The theory <strong>falls apart</strong> under scrutiny."</p>
<p><strong>War/sports metaphors:</strong> "The government <strong>fought</strong> the recession." / "Scientists are <strong>battling</strong> to find a cure." / "The two companies are in a <strong>price war</strong>."</p>
<p><strong>Nature metaphors:</strong> "The economy is <strong>blooming</strong>." / "A <strong>wave</strong> of protests swept the country." / "The idea <strong>took root</strong> quickly."</p>
<p><strong>Important:</strong> Academic writing prefers <strong>dead metaphors</strong> (so common they're literal: "field of study") over creative metaphors.</p>`,

    'Critical Thinking and Evaluation Language': `<h3>Critical Thinking and Evaluation Language</h3>
<p>At C1-C2, you don't just describe — you <strong>evaluate, critique, and synthesise</strong>.</p>
<p><strong>Evaluating strengths:</strong> "The principal strength of this approach lies in..." / "A notable advantage is..." / "This is particularly valuable because..." / "The methodology is robust in that..."</p>
<p><strong>Evaluating weaknesses:</strong> "A potential limitation is..." / "One drawback worth noting is..." / "The study is not without its shortcomings..." / "This raises questions about..."</p>
<p><strong>Evaluating evidence:</strong> "The evidence <strong>overwhelmingly supports</strong>..." / "There is <strong>insufficient evidence</strong> to conclude that..." / "The data <strong>appears to corroborate</strong>..." / "These findings <strong>should be interpreted with caution</strong> due to..."</p>
<p><strong>Synthesising multiple sources:</strong> "While Smith (2020) argues that..., Jones (2021) contends that..." / "Both studies converge on the point that..., though they differ regarding..." / "This aligns with earlier research by..., but contradicts..."</p>
<p><strong>Drawing measured conclusions:</strong> "On balance, the evidence suggests that..." / "Bearing these limitations in mind, it would be premature to conclude that..." / "Future research would benefit from investigating..."</p>`,
  },

  listening: {
    'Listening: Presentation Skills': `<h3>Listening for Professional Presentations</h3>
<p>In this listening exercise, you will hear a conversation about presentation skills in a professional setting. Pay attention to phrases like <strong>"I'd like to start by..."</strong>, <strong>"Moving on to..."</strong>, and <strong>"To sum up..."</strong> These are signposting expressions that speakers use to guide their audience through a presentation.</p>
<p>As you listen, note how the speakers use transitional phrases to move between points. Effective presenters make their structure explicit: they tell the audience what they will cover, cover it, and then summarize what they have said. This three-part structure — preview, body, review — is the foundation of clear professional communication.</p>
<p>Listen also for the intonation patterns that indicate emphasis and new information. Speakers typically stress the most important words in each sentence and use rising intonation to signal that more information is coming, and falling intonation to signal completion. These prosodic features help listeners follow complex arguments.</p>`,

    'Listening: Academic Discussion': `<h3>Listening to Academic Debate</h3>
<p>This listening exercise features an academic discussion between a professor and students. Academic discussions follow specific conventions: speakers hedge their claims (<strong>"It could be argued that..."</strong>), build on others' points (<strong>"Building on what Sarah said..."</strong>), and politely disagree (<strong>"I see your point, but..."</strong>). Recognizing these patterns helps you participate effectively in seminars and conferences.</p>
<p>Listen for how speakers manage turn-taking. In academic settings, interruptions are usually signaled with phrases like <strong>"If I could just add..."</strong> or <strong>"Sorry to interrupt, but..."</strong> rather than speaking over someone. When a speaker wants to hold the floor, they might say <strong>"If I could just finish this point..."</strong></p>
<p>Notice how speakers use references to shared knowledge (<strong>"As we discussed last week..."</strong>) and citations (<strong>"Smith's 2019 study found..."</strong>). These references create a web of connections that gives academic conversation its depth and authority.</p>`,

    'Listening: Tech Support Call': `<h3>Listening to Problem-Solving</h3>
<p>This listening exercise presents a tech support phone call. Tech support conversations follow a predictable pattern: <strong>identify the problem → ask diagnostic questions → propose a solution → confirm resolution</strong>. Understanding this structure helps you both give and receive technical assistance in English.</p>
<p>Listen for clarification strategies: <strong>"So if I understand correctly..."</strong>, <strong>"You're saying that..."</strong>, and <strong>"Can you describe exactly what happens when...?"</strong> These phrases confirm understanding and prevent miscommunication. On the caller's side, you will hear descriptions of problems: <strong>"The screen goes blank"</strong>, <strong>"It keeps freezing"</strong>, <strong>"I'm getting an error message."</strong></p>
<p>Technical language in these contexts mixes specialized terms with everyday expressions. The support agent may say <strong>"Let me remote into your system"</strong> (technical) followed by <strong>"Can you click on the little gear icon?"</strong> (everyday). This code-switching makes technical information accessible to non-expert callers.</p>`,

    'Listening: British vs American English': `<h3>Listening Across the Atlantic</h3>
<p>This listening exercise highlights differences between British and American English in vocabulary, pronunciation, and idiomatic expressions. While both varieties are mutually intelligible, understanding their differences prevents miscommunication and enriches your English comprehension. You will hear two speakers — one British and one American — discussing the same topics using different vocabulary.</p>
<p>Listen for vocabulary differences: <strong>lift/elevator, flat/apartment, boot/trunk, biscuit/cookie, university/college</strong>. Pronunciation differences include the British <strong>/r/</strong> (non-rhotic, not pronounced after vowels) versus the American rhotic <strong>/r/</strong>, and vowel differences in words like <strong>dance, bath,</strong> and <strong>tomato</strong>.</p>
<p>Idiomatic expressions also vary: British <strong>"Bob's your uncle"</strong> (there you go, it's done) has no American equivalent, while American <strong>"Break a leg"</strong> (good luck) is now used on both sides of the Atlantic. Understanding these differences makes you a more versatile English user in any international context.</p>`,

    'Listening: Movie Review Discussion': `<h3>Listening to Cultural Commentary</h3>
<p>In this listening exercise, you will hear two people discussing a film they have both seen. Film discussions in English use specific evaluative language: <strong>"The cinematography was breathtaking"</strong>, <strong>"The plot was predictable"</strong>, <strong>"The pacing felt off"</strong>, and <strong>"The performances were outstanding."</strong> These phrases go beyond simple "I liked it" to provide substantive critique.</p>
<p>Listen for how speakers express agreement and disagreement about art. Agreement phrases include <strong>"Absolutely — I thought the same thing"</strong> and <strong>"You're spot on about that."</strong> Polite disagreement phrases include <strong>"I see what you mean, but I felt..."</strong> and <strong>"That's an interesting take. For me, though..."</strong></p>
<p>Notice how the speakers reference specific scenes and techniques to support their opinions. Strong criticism in English always provides evidence rather than making unsupported claims. <strong>"The ending was unsatisfying because it resolved the conflict too easily"</strong> is far more persuasive than simply saying <strong>"The ending was bad."</strong></p>`,

    'Listening: Sustainability Talk': `<h3>Listening to Environmental Discourse</h3>
<p>This listening exercise features a presentation on sustainability and environmental action. Environmental discourse in English uses specific language patterns: data references (<strong>"According to the IPCC report..."</strong>), causal language (<strong>"Rising temperatures lead to..."</strong>), and calls to action (<strong>"We must reduce our carbon emissions by..."</strong>). Recognizing these patterns helps you follow environmental discussions and presentations.</p>
<p>Listen for hedging language that reflects scientific uncertainty: <strong>"Models suggest that..."</strong>, <strong>"It is projected that..."</strong>, and <strong>"There is growing evidence that..."</strong> Scientists use hedging not because they are unsure, but because they understand the limits of current data and want to be precise about what is and is not yet certain.</p>
<p>Pay attention to how the speaker structures the argument: problem → evidence → causes → solutions. This logical structure is standard in persuasive environmental communication and helps listeners follow complex scientific information.</p>`,

    'Listening: News Report': `<h3>Listening to Journalistic English</h3>
<p>This listening exercise presents a news report in standard journalistic English. News reports follow a specific structure: the lead (most important information first), followed by supporting details, background context, and quotes. This "inverted pyramid" structure means the essential facts are communicated immediately — even if the listener stops paying attention after the first sentence.</p>
<p>Listen for attribution language: <strong>"According to police..."</strong>, <strong>"Officials say..."</strong>, <strong>"Witnesses reported..."</strong> These phrases signal the source of information and indicate its reliability. Unattributed claims in news (<strong>"It is believed that..."</strong>) are less reliable than those with named sources.</p>
<p>Journalistic English uses concise sentences and active voice. Reporters avoid unnecessary words and front-load key information. Compare journalistic style (<strong>"Firefighters rescued three people from the burning building at 2 AM"</strong>) with academic style (<strong>"It was reported that three individuals were extracted from a structure affected by combustion at approximately 2:00 AM"</strong>). Both convey the same information, but the journalistic version is designed for rapid comprehension.</p>`,

    'Listening: Courtroom Drama': `<h3>Listening to Legal English</h3>
<p>This listening exercise presents a courtroom scene with legal vocabulary and formal register. Courtroom English is deliberately formal and follows strict conventions. Lawyers address the judge as <strong>"Your Honor"</strong>, witnesses are asked to <strong>"swear to tell the truth, the whole truth, and nothing but the truth"</strong>, and objections follow specific formulas: <strong>"Objection, Your Honor — hearsay!"</strong></p>
<p>Listen for the difference between direct examination (friendly questioning by your own lawyer) and cross-examination (challenging questions by the opposing lawyer). Direct examination uses open questions (<strong>"What did you see that evening?"</strong>), while cross-examination uses leading questions (<strong>"Isn't it true that you were nowhere near the scene?"</strong>). This strategic difference in questioning technique reflects the adversarial nature of the legal system.</p>
<p>Legal language also uses archaic terms that have been preserved through centuries of tradition: <strong>"hereby", "whereas", "notwithstanding", "aforementioned"</strong>. While modern legal writing increasingly favors plain language, these terms still appear in courtrooms and formal legal documents.</p>`,

    'Listening: Art Critique': `<h3>Listening to Aesthetic Judgment</h3>
<p>This listening exercise features an art critique discussion between a curator and a critic. Art criticism uses a specialized vocabulary of evaluation: <strong>"The composition draws the eye toward..."</strong>, <strong>"The use of contrast creates tension..."</strong>, <strong>"The brushwork conveys a sense of..."</strong>. These phrases describe both what is visible and the emotional or conceptual effects the artwork produces.</p>
<p>Listen for how critics balance subjective response with analytical language. Rather than simply saying <strong>"I like it"</strong>, a critic might say <strong>"The work succeeds in its exploration of light and shadow, though its emotional resonance may be limited by its technical precision."</strong> This combination of appreciation and critique is the hallmark of sophisticated art discourse.</p>
<p>Notice how the speakers reference art historical movements and comparisons: <strong>"This recalls the luminism of the Hudson River School"</strong> or <strong>"There's a clear dialogue with post-minimalist sculpture."</strong> These references position the work within a broader artistic tradition and demonstrate the depth of knowledge that informs the critique.</p>`,

    'Listening: Futurist Interview': `<h3>Listening to Speculative Discourse</h3>
<p>This listening exercise features an interview with a futurist discussing emerging technologies and their potential impact. Speculative discourse in English uses specific language to discuss possibilities without making definitive claims. Listen for modal verbs (<strong>"could", "might", "may"</strong>), conditional structures (<strong>"If AI continues to advance at this pace..."</strong>), and hedging phrases (<strong>"It is conceivable that..."</strong>).</p>
<p>The futurist uses evidence-based projection rather than pure speculation: <strong>"Based on current trends in computing power, we can expect..."</strong> rather than <strong>"I think that..."</strong>. This distinction is important — credible futurist analysis grounds predictions in data while acknowledging uncertainty. Listen for how the speaker qualifies their statements.</p>
<p>Notice also how the interviewer pushes back with challenging questions: <strong>"But isn't that overly optimistic?"</strong>, <strong>"What about the ethical implications?"</strong>, <strong>"How would you respond to critics who say this is science fiction?"</strong> Good journalistic interviewing balances enthusiasm with skepticism, helping listeners form their own informed opinions.</p>`,

    // Advanced Listening
    'Listening: UN Debate': `<h3>Listening to Multilateral Diplomacy</h3>
<p>This listening exercise presents excerpts from a United Nations debate on international security. Multilateral diplomatic discourse is characterized by extreme formality, careful hedging, and strategic ambiguity. Representatives use language that advances their government's position while maintaining diplomatic relationships with opposing states.</p>
<p>Listen for diplomatic hedging: <strong>"My delegation is deeply concerned by..."</strong> (strong disapproval), <strong>"We urge all parties to..."</strong> (a call to action), <strong>"We reserve the right to..."</strong> (an implicit threat). These carefully calibrated phrases convey meaning without the directness that would damage diplomatic relations.</p>
<p>Notice the use of third-person and institutional language: <strong>"My delegation believes"</strong> rather than <strong>"I believe"</strong>, <strong>"The Government of France contends"</strong> rather than <strong>"We think."</strong> This formal register distances the speaker's personal views from the official state position and gives statements the weight of national authority.</p>`,

    'Listening: Ethics Panel': `<h3>Listening to Moral Reasoning</h3>
<p>This listening exercise features a panel discussion on bioethics. Ethical discourse requires careful distinction between <strong>descriptive claims</strong> (what is) and <strong>normative claims</strong> (what ought to be). Listen for how panelists move between factual premises and moral conclusions, and how they challenge each other's reasoning.</p>
<p>Listen for the language of moral evaluation: <strong>"It is impermissible to..."</strong> (strong prohibition), <strong>"We have a moral obligation to..."</strong> (duty), <strong>"It would be regrettable if..."</strong> (mild disapproval), and <strong>"There is a strong case for..."</strong> (supporting argument). Each phrase signals a different level of moral commitment.</p>
<p>Notice how panelists handle disagreement. In ethical debates, participants often reframe each other's arguments: <strong>"If I understand your position, you're arguing that... But wouldn't that also imply...?"</strong> This steel-manning technique (presenting the strongest version of an opponent's view before rebutting it) is a sign of intellectual rigor and good faith engagement.</p>`,

    'Listening: Research Presentation': `<h3>Listening to Scientific Communication</h3>
<p>This listening exercise presents a research presentation at an academic conference. Scientific presentations follow a conventional structure: <strong>introduction → methods → results → discussion → conclusion</strong>. Understanding this structure helps you anticipate what information is coming and assess the validity of the claims being made.</p>
<p>Listen for how the presenter navigates the tension between confidence and caution. Scientists use hedging to indicate the limits of their findings: <strong>"Our results suggest..."</strong> (not <strong>"Our results prove"</strong>), <strong>"This finding is consistent with..."</strong> (not <strong>"This confirms"</strong>), and <strong>"Further research is needed to..."</strong> (acknowledging limitations). This precision is the hallmark of credible scientific communication.</p>
<p>Pay attention to how the presenter handles questions. Conference Q&A sessions can be challenging, with audience members asking pointed questions about methodology, sample size, or alternative explanations. Effective presenters acknowledge limitations honestly and suggest how their work could be improved or extended.</p>`,

    'Listening: Market Commentary': `<h3>Listening to Financial Analysis</h3>
<p>This listening exercise features a financial analyst commenting on market conditions. Financial discourse uses specific vocabulary to describe market movements (<strong>"rally", "correction", "downturn", "volatility"</strong>), investor psychology (<strong>"sentiment", "fear index", "herd behavior"</strong>), and economic indicators (<strong>"GDP growth", "inflation rate", "yield curve"</strong>). Understanding these terms is essential for following financial news and analysis.</p>
<p>Listen for conditional reasoning in financial commentary: <strong>"If the Fed raises interest rates, we could see a shift from growth stocks to value stocks"</strong>. Financial analysis is inherently about probabilities, not certainties, and skilled analysts use conditional structures to communicate the range of possible outcomes.</p>
<p>Notice the analyst's use of evidence and attribution: <strong>"According to the latest employment data..."</strong>, <strong>"As Bloomberg reported this morning..."</strong>, <strong>"Our proprietary model indicates..."</strong>. These references establish credibility and allow listeners to evaluate the reliability of the claims being made.</p>`,

    'Listening: Literary Analysis': `<h3>Listening to Close Reading</h3>
<p>This listening exercise presents a literary scholar performing a close reading of a poem. Close reading is the practice of carefully analyzing a text's language, structure, and imagery to uncover layers of meaning. The scholar demonstrates how attention to individual word choices, sound patterns, and structural decisions reveals the text's deeper significance.</p>
<p>Listen for the language of literary interpretation: <strong>"The poet's choice of 'shatter' rather than 'break' suggests..."</strong>, <strong>"The enjambment between lines 3 and 4 creates a tension between..."</strong>, <strong>"The repetition of the consonant sound mimics..."</strong>. These phrases illustrate how critics move from specific textual features to interpretive claims.</p>
<p>Notice how the scholar balances personal response with analytical rigor. Literary analysis is not mere opinion — it requires evidence from the text and logical reasoning. The strongest interpretations acknowledge ambiguity: <strong>"While this reading is compelling, the poem also admits another interpretation..."</strong></p>`,

    'Listening: Psychology Lecture': `<h3>Listening to Scientific Explanation</h3>
<p>This listening exercise presents a psychology lecture on cognitive biases. Academic lectures in English follow predictable discourse patterns: the lecturer signals the topic (<strong>"Today we're going to examine..."</strong>), provides definitions (<strong>"Cognitive bias refers to..."</strong>), gives examples (<strong>"Consider the following scenario..."</strong>), and summarizes (<strong>"So what we've seen is..."</strong>).</p>
<p>Listen for signposting language that helps you follow the argument: <strong>"The first type of bias I want to discuss is..."</strong>, <strong>"Moving on to the second category..."</strong>, <strong>"This brings us to an important implication..."</strong>. These phrases act as road signs, helping listeners navigate complex information.</p>
<p>Notice how the lecturer uses analogies and real-world examples to make abstract concepts concrete. <strong>"Think of confirmation bias like wearing tinted glasses — you see everything through a filter that reinforces what you already believe."</strong> Analogies are a powerful tool in academic explanation, bridging the gap between technical concepts and everyday understanding.</p>`,

    'Listening: Historical Debate': `<h3>Listening to Interpretive Argument</h3>
<p>This listening exercise features two historians debating the causes of a major historical event. Historical debate requires participants to engage with evidence, acknowledge complexity, and reason by analogy. Listen for how each historian marshals evidence, addresses counterarguments, and draws different conclusions from the same facts.</p>
<p>Listen for the language of historical causation: <strong>"The primary catalyst was..."</strong>, <strong>"This was exacerbated by..."</strong>, <strong>"A contributing factor was..."</strong>, <strong>"The underlying cause can be traced to..."</strong>. These phrases establish different levels of causal significance and help listeners understand the relative importance of multiple factors.</p>
<p>Notice how historians qualify their claims. Rather than making absolute statements, they use phrases like <strong>"The evidence suggests that..."</strong>, <strong>"It is plausible that..."</strong>, and <strong>"While we cannot be certain, the most likely explanation is..."</strong>. This epistemic humility reflects the inherent difficulty of determining historical truth with certainty.</p>`,

    'Listening: Treaty Negotiation': `<h3>Listening to Diplomatic Language</h3>
<p>This listening exercise simulates a treaty negotiation between representatives of two countries. Diplomatic negotiations use highly formal, carefully worded language where every word is chosen for its legal implications. Listen for how the negotiators use conditional promises (<strong>"We would be prepared to...provided that..."</strong>), strategic vagueness (<strong>"appropriate measures"</strong>), and face-saving language (<strong>"We note with concern..."</strong>).</p>
<p>Listen for the structure of diplomatic proposals. A typical proposal follows the pattern: <strong>acknowledge the shared interest → present your position → offer concessions → request reciprocal action</strong>. This structure maintains the appearance of cooperation while advancing national interests.</p>
<p>Notice how disagreements are expressed indirectly. Rather than saying <strong>"We reject your proposal"</strong>, a diplomat might say <strong>"We have some reservations about this approach"</strong> or <strong>"This would present significant challenges for my government."</strong> This indirectness preserves the relationship and keeps the negotiation open.</p>`,

    'Listening: Medical Conference': `<h3>Listening to Clinical Discourse</h3>
<p>This listening exercise features a presentation at a medical conference. Medical discourse combines scientific precision with clinical relevance, requiring listeners to understand both statistical evidence and its implications for patient care. Listen for how the speaker moves between population-level data and individual patient outcomes.</p>
<p>Listen for the language of clinical evidence: <strong>"The randomized controlled trial demonstrated a statistically significant reduction in..."</strong>, <strong>"The number needed to treat was..."</strong>, <strong>"The confidence interval suggests..."</strong>. These phrases indicate the strength and reliability of clinical findings.</p>
<p>Notice how the speaker addresses uncertainty and limitations: <strong>"While these results are promising, the study population was limited to..."</strong>, <strong>"Long-term follow-up data are not yet available"</strong>, <strong>"These findings may not be generalizable to..."</strong>. This transparency about limitations is a hallmark of ethical medical communication and is essential for evidence-based practice.</p>`,

    'Listening: Linguistics Colloquium': `<h3>Listening to Metalanguage</h3>
<p>This listening exercise presents a linguistics colloquium where scholars discuss language change. When linguists talk about language, they use metalanguage — language about language — with precise technical terms. Listen for terms like <strong>phonological merger</strong> (when two sounds become one), <strong>grammaticalization</strong> (when a content word becomes a function word), and <strong>semantic bleaching</strong> (when a word loses its original meaning).</p>
<p>Listen for how the speakers use examples from multiple languages to support their arguments. Comparative linguistics relies on cross-linguistic evidence: <strong>"This pattern is attested not only in English but also in Mandarin, Swahili, and Quechua, suggesting a universal cognitive basis."</strong> Such evidence strengthens claims by showing that a phenomenon is not language-specific.</p>
<p>Notice the density of technical terminology in this lecture compared to everyday speech. Academic linguistics discourse assumes specialized knowledge and uses jargon precisely to avoid the ambiguity of everyday language. Understanding this register is essential for engaging with linguistic scholarship at an advanced level.</p>`,
  },

  quiz: {
    'Greetings & Introductions Quiz': `<h3>Test Your Greeting Knowledge</h3>
<p>This quiz covers the vocabulary, phrases, and grammar from the Greetings & Introductions module. You will be tested on formal and informal greetings, self-introduction phrases, and appropriate language for different social situations. Read each question carefully and choose the best answer.</p>`,

    'Daily Routines Quiz': `<h3>Test Your Routine Vocabulary</h3>
<p>This quiz tests your understanding of daily routine vocabulary, the present simple tense, and time expressions from the Daily Routines module. Review the key concepts before starting, and try to answer without looking back at the lesson content.</p>`,

    'Food & Drink Quiz': `<h3>Test Your Food Vocabulary</h3>
<p>This quiz covers vocabulary and grammar from the Food & Drink module, including restaurant phrases, countable and uncountable nouns, and food-related collocations. Choose the best answer for each question.</p>`,

    'Shopping & Money Quiz': `<h3>Test Your Shopping English</h3>
<p>This quiz tests your knowledge of shopping vocabulary, price-related questions, and grammar from the Shopping & Money module. You will be asked about store vocabulary, payment terms, and how to ask about prices correctly.</p>`,

    'Travel & Transport Quiz': `<h3>Test Your Direction Skills</h3>
<p>This quiz covers vocabulary and grammar from the Travel & Transport module, including direction words, prepositions of place, and navigation phrases. Test your ability to give and understand directions in English.</p>`,

    'Health & Body Quiz': `<h3>Test Your Health Vocabulary</h3>
<p>This quiz tests your knowledge of health and body vocabulary, modal verbs of obligation, and doctor-patient communication from the Health & Body module. Choose the correct answer for each question.</p>`,

    'Home & Family Quiz': `<h3>Test Your Home Vocabulary</h3>
<p>This quiz covers vocabulary and grammar from the Home & Family module, including room names, furniture words, family terms, and the there is/there are structure. Select the best answer for each question.</p>`,

    'Weather & Seasons Quiz': `<h3>Test Your Weather Knowledge</h3>
<p>This quiz tests your understanding of weather vocabulary, seasonal terms, and the grammar of similarity (like vs. as) from the Weather & Seasons module. Read each question carefully before answering.</p>`,

    // Intermediate Quiz
    'Work & Career Quiz': `<h3>Test Your Professional English</h3>
<p>This quiz covers vocabulary and grammar from the Work & Career module, including interview phrases, career terminology, and the present perfect tense for describing experience. Apply what you have learned to real-world workplace scenarios.</p>`,

    'Education & Learning Quiz': `<h3>Test Your Academic English</h3>
<p>This quiz tests your knowledge of academic vocabulary, study method terms, and conditional structures from the Education & Learning module. Choose the answer that best completes each statement or question.</p>`,

    'Technology & Digital Life Quiz': `<h3>Test Your Tech Vocabulary</h3>
<p>This quiz covers digital communication vocabulary, tech terminology, and reported speech from the Technology & Digital Life module. You will be tested on your ability to understand and use English in digital contexts.</p>`,

    'Relationships & Communication Quiz': `<h3>Test Your Social English</h3>
<p>This quiz tests your understanding of relationship vocabulary, communication phrases, and relative clauses from the Relationships & Communication module. Select the most appropriate answer for each scenario.</p>`,

    'Entertainment & Culture Quiz': `<h3>Test Your Cultural English</h3>
<p>This quiz covers cultural vocabulary, entertainment terms, and the passive voice from the Entertainment & Culture module. Apply what you have learned about discussing films, music, and art in English.</p>`,

    'Environment & Nature Quiz': `<h3>Test Your Environmental English</h3>
<p>This quiz tests your knowledge of environmental vocabulary, sustainability concepts, and articles/determiners from the Environment & Nature module. Show your understanding of how to discuss climate and conservation in English.</p>`,

    'News & Media Quiz': `<h3>Test Your Media Literacy</h3>
<p>This quiz covers media vocabulary, journalistic terms, and discourse markers from the News & Media module. Test your ability to understand and critically analyze English-language news content.</p>`,

    'Law & Society Quiz': `<h3>Test Your Legal English</h3>
<p>This quiz tests your knowledge of legal vocabulary, civic terminology, and modal verbs of obligation from the Law & Society module. Apply what you have learned about rights, responsibilities, and the language of law.</p>`,

    'Arts & Creativity Quiz': `<h3>Test Your Artistic English</h3>
<p>This quiz covers art vocabulary, creative expression terms, and adjective order from the Arts & Creativity module. Test your ability to discuss and evaluate creative works in English.</p>`,

    'Future & Innovation Quiz': `<h3>Test Your Future English</h3>
<p>This quiz tests your knowledge of innovation vocabulary, future prediction terms, and future tense structures from the Future & Innovation module. Apply what you have learned about discussing technology and change in English.</p>`,

    // Advanced Quiz
    'Global Issues & Politics Quiz': `<h3>Test Your Political English</h3>
<p>This quiz covers political vocabulary, diplomatic terminology, and inversion structures from the Global Issues & Politics module. Test your understanding of how to discuss international relations and governance in sophisticated English.</p>`,

    'Philosophy & Ethics Quiz': `<h3>Test Your Philosophical English</h3>
<p>This quiz tests your knowledge of philosophical vocabulary, ethical terminology, and hedging language from the Philosophy & Ethics module. Apply what you have learned about discussing moral reasoning and abstract concepts in English.</p>`,

    'Science & Research Quiz': `<h3>Test Your Scientific English</h3>
<p>This quiz covers scientific vocabulary, research methodology terms, and nominalisation from the Science & Research module. Test your ability to understand and discuss scientific concepts in formal English.</p>`,

    'Economics & Finance Quiz': `<h3>Test Your Financial English</h3>
<p>This quiz tests your knowledge of financial vocabulary, market terminology, and conditional concessives from the Economics & Finance module. Apply what you have learned about discussing economics and investment in English.</p>`,

    'Literature & Critical Analysis Quiz': `<h3>Test Your Literary English</h3>
<p>This quiz covers literary vocabulary, critical analysis terms, and rhetorical devices from the Literature & Critical Analysis module. Test your understanding of how to analyze and discuss literature in academic English.</p>`,

    'Psychology & Human Behavior Quiz': `<h3>Test Your Psychological English</h3>
<p>This quiz tests your knowledge of psychological vocabulary, behavioral terminology, and discourse analysis from the Psychology & Human Behavior module. Apply what you have learned about discussing the mind and behavior in English.</p>`,

    'History & Civilization Quiz': `<h3>Test Your Historical English</h3>
<p>This quiz covers historical vocabulary, interpretive terminology, and evaluative language from the History & Civilization module. Test your ability to discuss and analyze historical events using precise English.</p>`,

    'Law & International Relations Quiz': `<h3>Test Your International Legal English</h3>
<p>This quiz tests your knowledge of international law vocabulary, legal terminology, and subjunctive structures from the Law & International Relations module. Apply what you have learned about discussing treaties, sovereignty, and global governance in English.</p>`,

    'Medicine & Healthcare Quiz': `<h3>Test Your Medical English</h3>
<p>This quiz covers medical vocabulary, bioethics terminology, and participle clauses from the Medicine & Healthcare module. Test your understanding of how to discuss healthcare, ethics, and clinical research in English.</p>`,

    'Linguistics & Language Quiz': `<h3>Test Your Linguistic English</h3>
<p>This quiz tests your knowledge of linguistic vocabulary, language science terms, and metadiscourse from the Linguistics & Language module. Apply what you have learned about discussing language itself in academic English.</p>`,
  },
};
