import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';

// ═══════════════════════════════════════════════════════════════
// COMPREHENSIVE VOCABULARY SEED DATA
// 30-50 words per CEFR level (A1–C2) with distractors
// ═══════════════════════════════════════════════════════════════

interface SeedWord {
  word: string;
  definition: string;
  example: string;
  gapSentence: string;
  partOfSpeech: string;
  level: string;
  category: string;
  distractors: string[];
}

const VOCAB_SEED_DATA: SeedWord[] = [
  // ═══════════════════════════════════════════════════════════
  // A1 — Beginner (40 words)
  // Basic greetings, family, food, colors, daily actions
  // ═══════════════════════════════════════════════════════════
  { word: 'hello', definition: 'A greeting used when you meet someone', example: 'Hello! How are you today?', gapSentence: '_____! How are you today?', partOfSpeech: 'interjection', level: 'A1', category: 'general', distractors: ['goodbye', 'sorry', 'please'] },
  { word: 'goodbye', definition: 'A word you say when you leave someone', example: 'Goodbye! See you tomorrow.', gapSentence: '_____! See you tomorrow.', partOfSpeech: 'interjection', level: 'A1', category: 'general', distractors: ['hello', 'welcome', 'sorry'] },
  { word: 'name', definition: 'The word that identifies a person or thing', example: 'My name is Sarah.', gapSentence: 'My _____ is Sarah.', partOfSpeech: 'noun', level: 'A1', category: 'general', distractors: ['age', 'home', 'time'] },
  { word: 'house', definition: 'A building where people live', example: 'We live in a small house near the park.', gapSentence: 'We live in a small _____ near the park.', partOfSpeech: 'noun', level: 'A1', category: 'general', distractors: ['car', 'school', 'office'] },
  { word: 'water', definition: 'A clear liquid that people drink to stay alive', example: 'Can I have a glass of water, please?', gapSentence: 'Can I have a glass of _____, please?', partOfSpeech: 'noun', level: 'A1', category: 'general', distractors: ['milk', 'bread', 'rice'] },
  { word: 'food', definition: 'Things that people eat to stay alive', example: 'The food at this restaurant is delicious.', gapSentence: 'The _____ at this restaurant is delicious.', partOfSpeech: 'noun', level: 'A1', category: 'general', distractors: ['drink', 'water', 'music'] },
  { word: 'book', definition: 'A collection of pages with words that you read', example: 'I am reading an interesting book.', gapSentence: 'I am reading an interesting _____.', partOfSpeech: 'noun', level: 'A1', category: 'general', distractors: ['letter', 'paper', 'picture'] },
  { word: 'school', definition: 'A place where children go to learn', example: 'The children walk to school every morning.', gapSentence: 'The children walk to _____ every morning.', partOfSpeech: 'noun', level: 'A1', category: 'general', distractors: ['market', 'hospital', 'church'] },
  { word: 'teacher', definition: 'A person who helps students learn', example: 'Our teacher is very kind and patient.', gapSentence: 'Our _____ is very kind and patient.', partOfSpeech: 'noun', level: 'A1', category: 'general', distractors: ['student', 'doctor', 'driver'] },
  { word: 'friend', definition: 'A person you know well and like spending time with', example: 'She is my best friend from school.', gapSentence: 'She is my best _____ from school.', partOfSpeech: 'noun', level: 'A1', category: 'general', distractors: ['teacher', 'neighbor', 'cousin'] },
  { word: 'family', definition: 'A group of people who are related to each other', example: 'My family has four people.', gapSentence: 'My _____ has four people.', partOfSpeech: 'noun', level: 'A1', category: 'general', distractors: ['team', 'class', 'group'] },
  { word: 'big', definition: 'Large in size', example: 'The elephant is a very big animal.', gapSentence: 'The elephant is a very _____ animal.', partOfSpeech: 'adjective', level: 'A1', category: 'general', distractors: ['small', 'fast', 'old'] },
  { word: 'small', definition: 'Not large in size', example: 'The cat is a small animal.', gapSentence: 'The cat is a _____ animal.', partOfSpeech: 'adjective', level: 'A1', category: 'general', distractors: ['big', 'tall', 'long'] },
  { word: 'good', definition: 'Of a high quality or standard', example: 'This is a good restaurant.', gapSentence: 'This is a _____ restaurant.', partOfSpeech: 'adjective', level: 'A1', category: 'general', distractors: ['bad', 'old', 'new'] },
  { word: 'bad', definition: 'Of a low quality or standard', example: 'The weather was bad yesterday.', gapSentence: 'The weather was _____ yesterday.', partOfSpeech: 'adjective', level: 'A1', category: 'general', distractors: ['good', 'nice', 'fine'] },
  { word: 'happy', definition: 'Feeling pleasure and enjoyment', example: 'I am very happy to see you!', gapSentence: 'I am very _____ to see you!', partOfSpeech: 'adjective', level: 'A1', category: 'general', distractors: ['sad', 'angry', 'tired'] },
  { word: 'sad', definition: 'Feeling unhappy', example: 'She felt sad when her friend moved away.', gapSentence: 'She felt _____ when her friend moved away.', partOfSpeech: 'adjective', level: 'A1', category: 'general', distractors: ['happy', 'glad', 'proud'] },
  { word: 'run', definition: 'To move quickly on foot', example: 'I run every morning before breakfast.', gapSentence: 'I _____ every morning before breakfast.', partOfSpeech: 'verb', level: 'A1', category: 'general', distractors: ['walk', 'sit', 'stand'] },
  { word: 'walk', definition: 'To move on foot at a normal speed', example: 'We walk to the park every evening.', gapSentence: 'We _____ to the park every evening.', partOfSpeech: 'verb', level: 'A1', category: 'general', distractors: ['run', 'drive', 'fly'] },
  { word: 'eat', definition: 'To put food in your mouth and swallow it', example: 'We eat lunch at noon.', gapSentence: 'We _____ lunch at noon.', partOfSpeech: 'verb', level: 'A1', category: 'general', distractors: ['drink', 'cook', 'buy'] },
  { word: 'drink', definition: 'To take liquid into your mouth and swallow it', example: 'I drink coffee every morning.', gapSentence: 'I _____ coffee every morning.', partOfSpeech: 'verb', level: 'A1', category: 'general', distractors: ['eat', 'pour', 'make'] },
  { word: 'sleep', definition: 'To rest with your eyes closed', example: 'I usually sleep eight hours a night.', gapSentence: 'I usually _____ eight hours a night.', partOfSpeech: 'verb', level: 'A1', category: 'general', distractors: ['wake', 'work', 'play'] },
  { word: 'read', definition: 'To look at and understand written words', example: 'I like to read books before bed.', gapSentence: 'I like to _____ books before bed.', partOfSpeech: 'verb', level: 'A1', category: 'general', distractors: ['write', 'speak', 'listen'] },
  { word: 'write', definition: 'To form letters or words on a surface', example: 'Please write your name on the form.', gapSentence: 'Please _____ your name on the form.', partOfSpeech: 'verb', level: 'A1', category: 'general', distractors: ['read', 'sign', 'draw'] },
  { word: 'speak', definition: 'To say words using your voice', example: 'She can speak three languages.', gapSentence: 'She can _____ three languages.', partOfSpeech: 'verb', level: 'A1', category: 'general', distractors: ['hear', 'write', 'read'] },
  { word: 'listen', definition: 'To pay attention to sounds or someone speaking', example: 'Please listen carefully to the instructions.', gapSentence: 'Please _____ carefully to the instructions.', partOfSpeech: 'verb', level: 'A1', category: 'general', distractors: ['speak', 'talk', 'hear'] },
  { word: 'open', definition: 'To move something so it is no longer closed', example: 'Please open the window — it is hot.', gapSentence: 'Please _____ the window — it is hot.', partOfSpeech: 'verb', level: 'A1', category: 'general', distractors: ['close', 'shut', 'lock'] },
  { word: 'close', definition: 'To move something so it covers an opening', example: 'Please close the door when you leave.', gapSentence: 'Please _____ the door when you leave.', partOfSpeech: 'verb', level: 'A1', category: 'general', distractors: ['open', 'lock', 'push'] },
  { word: 'come', definition: 'To move toward a place or person', example: 'Please come here for a moment.', gapSentence: 'Please _____ here for a moment.', partOfSpeech: 'verb', level: 'A1', category: 'general', distractors: ['go', 'leave', 'stay'] },
  { word: 'go', definition: 'To move from one place to another', example: 'We go to school by bus.', gapSentence: 'We _____ to school by bus.', partOfSpeech: 'verb', level: 'A1', category: 'general', distractors: ['come', 'arrive', 'return'] },
  { word: 'mother', definition: 'A female parent', example: 'My mother cooks delicious food every day.', gapSentence: 'My _____ cooks delicious food every day.', partOfSpeech: 'noun', level: 'A1', category: 'general', distractors: ['father', 'sister', 'aunt'] },
  { word: 'father', definition: 'A male parent', example: 'My father works in a hospital.', gapSentence: 'My _____ works in a hospital.', partOfSpeech: 'noun', level: 'A1', category: 'general', distractors: ['mother', 'brother', 'uncle'] },
  { word: 'apple', definition: 'A round fruit with red, green, or yellow skin', example: 'She ate a red apple for a snack.', gapSentence: 'She ate a red _____ for a snack.', partOfSpeech: 'noun', level: 'A1', category: 'general', distractors: ['banana', 'orange', 'grape'] },
  { word: 'red', definition: 'The color of blood or fire', example: 'She wore a beautiful red dress.', gapSentence: 'She wore a beautiful _____ dress.', partOfSpeech: 'adjective', level: 'A1', category: 'general', distractors: ['blue', 'green', 'white'] },
  { word: 'blue', definition: 'The color of the clear sky or sea', example: 'The sky is blue today.', gapSentence: 'The sky is _____ today.', partOfSpeech: 'adjective', level: 'A1', category: 'general', distractors: ['red', 'green', 'gray'] },
  { word: 'green', definition: 'The color of grass and leaves', example: 'The garden has many green plants.', gapSentence: 'The garden has many _____ plants.', partOfSpeech: 'adjective', level: 'A1', category: 'general', distractors: ['red', 'yellow', 'brown'] },
  { word: 'morning', definition: 'The early part of the day before noon', example: 'I exercise every morning before work.', gapSentence: 'I exercise every _____ before work.', partOfSpeech: 'noun', level: 'A1', category: 'general', distractors: ['evening', 'afternoon', 'night'] },
  { word: 'night', definition: 'The dark part of the day when the sun is down', example: 'The stars shine at night.', gapSentence: 'The stars shine at _____.', partOfSpeech: 'noun', level: 'A1', category: 'general', distractors: ['morning', 'noon', 'dawn'] },
  { word: 'today', definition: 'On this day; the present day', example: 'I have a lot of work to do today.', gapSentence: 'I have a lot of work to do _____.', partOfSpeech: 'adverb', level: 'A1', category: 'general', distractors: ['tomorrow', 'yesterday', 'always'] },
  { word: 'always', definition: 'Every time; on every occasion', example: 'She always arrives on time.', gapSentence: 'She _____ arrives on time.', partOfSpeech: 'adverb', level: 'A1', category: 'general', distractors: ['never', 'sometimes', 'often'] },

  // ═══════════════════════════════════════════════════════════
  // A2 — Elementary (40 words)
  // Daily routines, shopping, weather, directions, adverbs
  // ═══════════════════════════════════════════════════════════
  { word: 'weather', definition: 'The condition of the atmosphere at a particular time', example: 'The weather is sunny and warm today.', gapSentence: 'The _____ is sunny and warm today.', partOfSpeech: 'noun', level: 'A2', category: 'general', distractors: ['climate', 'season', 'forecast'] },
  { word: 'vacation', definition: 'A period of time when you rest and do not work', example: 'We went on vacation to Spain last summer.', gapSentence: 'We went on _____ to Spain last summer.', partOfSpeech: 'noun', level: 'A2', category: 'travel', distractors: ['journey', 'holiday', 'trip'] },
  { word: 'appointment', definition: 'An arrangement to meet someone at a set time', example: 'I have a doctor appointment at 3 PM.', gapSentence: 'I have a doctor _____ at 3 PM.', partOfSpeech: 'noun', level: 'A2', category: 'general', distractors: ['meeting', 'schedule', 'deadline'] },
  { word: 'neighborhood', definition: 'The area around where you live', example: 'Our neighborhood has a nice park.', gapSentence: 'Our _____ has a nice park.', partOfSpeech: 'noun', level: 'A2', category: 'general', distractors: ['community', 'district', 'village'] },
  { word: 'comfortable', definition: 'Providing physical ease and relaxation', example: 'This sofa is very comfortable.', gapSentence: 'This sofa is very _____.', partOfSpeech: 'adjective', level: 'A2', category: 'general', distractors: ['uncomfortable', 'difficult', 'expensive'] },
  { word: 'delicious', definition: 'Very pleasant to taste', example: 'The cake smells delicious!', gapSentence: 'The cake smells _____!', partOfSpeech: 'adjective', level: 'A2', category: 'general', distractors: ['terrible', 'strange', 'boring'] },
  { word: 'expensive', definition: 'Costing a lot of money', example: 'That restaurant is too expensive for me.', gapSentence: 'That restaurant is too _____ for me.', partOfSpeech: 'adjective', level: 'A2', category: 'general', distractors: ['cheap', 'affordable', 'valuable'] },
  { word: 'recommend', definition: 'To suggest something as being good or suitable', example: 'I recommend trying the local cuisine.', gapSentence: 'I _____ trying the local cuisine.', partOfSpeech: 'verb', level: 'A2', category: 'general', distractors: ['suggest', 'advise', 'propose'] },
  { word: 'apply', definition: 'To formally request something, such as a job', example: 'She decided to apply for the manager position.', gapSentence: 'She decided to _____ for the manager position.', partOfSpeech: 'verb', level: 'A2', category: 'business', distractors: ['accept', 'refuse', 'offer'] },
  { word: 'improve', definition: 'To make or become better', example: 'She wants to improve her English pronunciation.', gapSentence: 'She wants to _____ her English pronunciation.', partOfSpeech: 'verb', level: 'A2', category: 'general', distractors: ['worsen', 'change', 'maintain'] },
  { word: 'environment', definition: 'The natural world around us', example: 'We must protect the environment for future generations.', gapSentence: 'We must protect the _____ for future generations.', partOfSpeech: 'noun', level: 'A2', category: 'general', distractors: ['atmosphere', 'climate', 'surroundings'] },
  { word: 'experience', definition: 'Knowledge or skill gained from doing something', example: 'He has five years of experience in web development.', gapSentence: 'He has five years of _____ in web development.', partOfSpeech: 'noun', level: 'A2', category: 'general', distractors: ['education', 'training', 'practice'] },
  { word: 'absolutely', definition: 'Completely and without any doubt', example: 'I absolutely agree with your plan.', gapSentence: 'I _____ agree with your plan.', partOfSpeech: 'adverb', level: 'A2', category: 'general', distractors: ['partially', 'hardly', 'barely'] },
  { word: 'definitely', definition: 'Without any doubt; certainly', example: 'I will definitely come to the party.', gapSentence: 'I will _____ come to the party.', partOfSpeech: 'adverb', level: 'A2', category: 'general', distractors: ['probably', 'possibly', 'maybe'] },
  { word: 'unfortunately', definition: 'In a way that is unlucky or regrettable', example: 'Unfortunately, the flight was canceled.', gapSentence: '_____, the flight was canceled.', partOfSpeech: 'adverb', level: 'A2', category: 'general', distractors: ['fortunately', 'happily', 'luckily'] },
  { word: 'fortunately', definition: 'In a lucky or favorable way', example: 'Fortunately, I found my lost keys.', gapSentence: '_____, I found my lost keys.', partOfSpeech: 'adverb', level: 'A2', category: 'general', distractors: ['unfortunately', 'sadly', 'suddenly'] },
  { word: 'recently', definition: 'Not long ago; in the near past', example: 'She recently started a new job.', gapSentence: 'She _____ started a new job.', partOfSpeech: 'adverb', level: 'A2', category: 'general', distractors: ['formerly', 'previously', 'rarely'] },
  { word: 'suddenly', definition: 'Quickly and without warning', example: 'Suddenly, it started to rain heavily.', gapSentence: '_____, it started to rain heavily.', partOfSpeech: 'adverb', level: 'A2', category: 'general', distractors: ['gradually', 'slowly', 'gently'] },
  { word: 'eventually', definition: 'In the end; after a long time or delay', example: 'Eventually, we found the right address.', gapSentence: '_____, we found the right address.', partOfSpeech: 'adverb', level: 'A2', category: 'general', distractors: ['immediately', 'quickly', 'initially'] },
  { word: 'immediately', definition: 'Without any delay; right away', example: 'Please leave the building immediately.', gapSentence: 'Please leave the building _____.', partOfSpeech: 'adverb', level: 'A2', category: 'general', distractors: ['eventually', 'gradually', 'shortly'] },
  { word: 'destination', definition: 'The place someone is traveling to', example: 'Paris is a popular tourist destination.', gapSentence: 'Paris is a popular tourist _____.', partOfSpeech: 'noun', level: 'A2', category: 'travel', distractors: ['location', 'direction', 'station'] },
  { word: 'souvenir', definition: 'A small item you buy to remember a place', example: 'I bought a small souvenir from the museum.', gapSentence: 'I bought a small _____ from the museum.', partOfSpeech: 'noun', level: 'A2', category: 'travel', distractors: ['gift', 'memory', 'ticket'] },
  { word: 'recipe', definition: 'Instructions for preparing a dish of food', example: 'I found a great recipe for chocolate cake.', gapSentence: 'I found a great _____ for chocolate cake.', partOfSpeech: 'noun', level: 'A2', category: 'general', distractors: ['menu', 'ingredient', 'portion'] },
  { word: 'laundry', definition: 'Clothes that need to be washed or have been washed', example: 'I need to do the laundry this weekend.', gapSentence: 'I need to do the _____ this weekend.', partOfSpeech: 'noun', level: 'A2', category: 'general', distractors: ['cleaning', 'ironing', 'drying'] },
  { word: 'umbrella', definition: 'A device you hold over your head to protect from rain', example: "Don't forget your umbrella — it might rain.", gapSentence: "Don't forget your _____ — it might rain.", partOfSpeech: 'noun', level: 'A2', category: 'general', distractors: ['jacket', 'raincoat', 'boots'] },
  { word: 'breakfast', definition: 'The first meal of the day, eaten in the morning', example: 'I always have breakfast at 7 AM.', gapSentence: 'I always have _____ at 7 AM.', partOfSpeech: 'noun', level: 'A2', category: 'general', distractors: ['lunch', 'dinner', 'supper'] },
  { word: 'commute', definition: 'To travel regularly between home and work', example: 'I commute to work by train every day.', gapSentence: 'I _____ to work by train every day.', partOfSpeech: 'verb', level: 'A2', category: 'general', distractors: ['travel', 'transfer', 'migrate'] },
  { word: 'temperature', definition: 'A measure of how hot or cold something is', example: 'The temperature outside is 25 degrees.', gapSentence: 'The _____ outside is 25 degrees.', partOfSpeech: 'noun', level: 'A2', category: 'general', distractors: ['weather', 'climate', 'degree'] },
  { word: 'furniture', definition: 'Large movable items like tables, chairs, and beds', example: 'We bought new furniture for the living room.', gapSentence: 'We bought new _____ for the living room.', partOfSpeech: 'noun', level: 'A2', category: 'general', distractors: ['equipment', 'appliance', 'decoration'] },
  { word: 'grocery', definition: 'A store that sells food and household items', example: 'I need to stop at the grocery store on my way home.', gapSentence: 'I need to stop at the _____ store on my way home.', partOfSpeech: 'noun', level: 'A2', category: 'general', distractors: ['bakery', 'pharmacy', 'market'] },
  { word: 'piece of cake', definition: 'Something very easy to do', example: 'The exam was a piece of cake.', gapSentence: 'The exam was a _____ of cake.', partOfSpeech: 'idiom', level: 'A2', category: 'idioms', distractors: ['cup of tea', 'bowl of soup', 'slice of bread'] },
  { word: 'look forward to', definition: 'To feel excited about something that will happen', example: 'I look forward to meeting you next week.', gapSentence: 'I look _____ to meeting you next week.', partOfSpeech: 'phrasal_verb', level: 'A2', category: 'phrasal_verbs', distractors: ['hold on to', 'get back to', 'come up with'] },
  { word: 'give up', definition: 'To stop trying or quit doing something', example: "Don't give up — you're almost there!", gapSentence: "Don't _____ up — you're almost there!", partOfSpeech: 'phrasal_verb', level: 'A2', category: 'phrasal_verbs', distractors: ['take up', 'hold on', 'carry on'] },

  // ═══════════════════════════════════════════════════════════
  // B1 — Intermediate (40 words)
  // Work, hobbies, health, education, abstract concepts
  // ═══════════════════════════════════════════════════════════
  { word: 'appreciate', definition: 'To recognize the value or quality of something', example: 'I really appreciate your help with this project.', gapSentence: 'I really _____ your help with this project.', partOfSpeech: 'verb', level: 'B1', category: 'general', distractors: ['ignore', 'doubt', 'question'] },
  { word: 'approach', definition: 'To come nearer to something or someone', example: 'We need to approach this problem differently.', gapSentence: 'We need to _____ this problem differently.', partOfSpeech: 'verb', level: 'B1', category: 'general', distractors: ['avoid', 'escape', 'ignore'] },
  { word: 'benefit', definition: 'An advantage or positive result', example: 'Regular exercise has many health benefits.', gapSentence: 'Regular exercise has many health _____.', partOfSpeech: 'noun', level: 'B1', category: 'general', distractors: ['drawback', 'problem', 'risk'] },
  { word: 'challenge', definition: 'Something that is difficult to do or deal with', example: 'Learning a new language is a challenge.', gapSentence: 'Learning a new language is a _____.', partOfSpeech: 'noun', level: 'B1', category: 'general', distractors: ['benefit', 'advantage', 'pleasure'] },
  { word: 'demonstrate', definition: 'To show clearly how something works or is done', example: 'The teacher demonstrated the experiment step by step.', gapSentence: 'The teacher _____ the experiment step by step.', partOfSpeech: 'verb', level: 'B1', category: 'general', distractors: ['explain', 'describe', 'conceal'] },
  { word: 'develop', definition: 'To grow or cause something to grow and change', example: 'They plan to develop new software for schools.', gapSentence: 'They plan to _____ new software for schools.', partOfSpeech: 'verb', level: 'B1', category: 'general', distractors: ['destroy', 'reduce', 'abandon'] },
  { word: 'effective', definition: 'Producing the result that was intended', example: 'This medicine is very effective against headaches.', gapSentence: 'This medicine is very _____ against headaches.', partOfSpeech: 'adjective', level: 'B1', category: 'general', distractors: ['useless', 'harmful', 'weak'] },
  { word: 'establish', definition: 'To start or create something that will last', example: 'The company was established in 1990.', gapSentence: 'The company was _____ in 1990.', partOfSpeech: 'verb', level: 'B1', category: 'general', distractors: ['destroy', 'close', 'abandon'] },
  { word: 'identify', definition: 'To recognize someone or something and say who they are', example: 'Can you identify the person in this photo?', gapSentence: 'Can you _____ the person in this photo?', partOfSpeech: 'verb', level: 'B1', category: 'general', distractors: ['confuse', 'disguise', 'ignore'] },
  { word: 'indicate', definition: 'To show or point out something', example: 'The results indicate a clear improvement.', gapSentence: 'The results _____ a clear improvement.', partOfSpeech: 'verb', level: 'B1', category: 'general', distractors: ['hide', 'deny', 'conceal'] },
  { word: 'interpret', definition: 'To explain the meaning of something', example: 'How do you interpret the data in this chart?', gapSentence: 'How do you _____ the data in this chart?', partOfSpeech: 'verb', level: 'B1', category: 'general', distractors: ['ignore', 'misunderstand', 'overlook'] },
  { word: 'invest', definition: 'To put money into something to make a profit', example: 'She decided to invest in renewable energy.', gapSentence: 'She decided to _____ in renewable energy.', partOfSpeech: 'verb', level: 'B1', category: 'business', distractors: ['withdraw', 'spend', 'waste'] },
  { word: 'maintain', definition: 'To keep something in good condition', example: 'It is important to maintain a healthy lifestyle.', gapSentence: 'It is important to _____ a healthy lifestyle.', partOfSpeech: 'verb', level: 'B1', category: 'general', distractors: ['neglect', 'abandon', 'ignore'] },
  { word: 'obtain', definition: 'To get something, especially by effort', example: 'She obtained her degree from Oxford University.', gapSentence: 'She _____ her degree from Oxford University.', partOfSpeech: 'verb', level: 'B1', category: 'general', distractors: ['lose', 'drop', 'miss'] },
  { word: 'participate', definition: 'To take part in an activity or event', example: 'All students are encouraged to participate in the discussion.', gapSentence: 'All students are encouraged to _____ in the discussion.', partOfSpeech: 'verb', level: 'B1', category: 'general', distractors: ['avoid', 'refuse', 'withdraw'] },
  { word: 'recognize', definition: 'To know someone or something because you have seen them before', example: 'I did not recognize her with her new haircut.', gapSentence: 'I did not _____ her with her new haircut.', partOfSpeech: 'verb', level: 'B1', category: 'general', distractors: ['forget', 'confuse', 'mistake'] },
  { word: 'represent', definition: 'To act or speak on behalf of someone', example: 'The lawyer will represent the company in court.', gapSentence: 'The lawyer will _____ the company in court.', partOfSpeech: 'verb', level: 'B1', category: 'general', distractors: ['oppose', 'ignore', 'betray'] },
  { word: 'significant', definition: 'Important or large enough to have an effect', example: 'There has been a significant improvement in her grades.', gapSentence: 'There has been a _____ improvement in her grades.', partOfSpeech: 'adjective', level: 'B1', category: 'general', distractors: ['minor', 'slight', 'trivial'] },
  { word: 'strategy', definition: 'A plan of action to achieve a goal', example: 'We need a new marketing strategy.', gapSentence: 'We need a new marketing _____.', partOfSpeech: 'noun', level: 'B1', category: 'business', distractors: ['problem', 'mistake', 'reaction'] },
  { word: 'tradition', definition: 'A custom or belief passed down through generations', example: 'It is a tradition to eat turkey on Thanksgiving.', gapSentence: 'It is a _____ to eat turkey on Thanksgiving.', partOfSpeech: 'noun', level: 'B1', category: 'general', distractors: ['trend', 'fashion', 'innovation'] },
  { word: 'opportunity', definition: 'A favorable time or chance to do something', example: 'This internship is a great opportunity for students.', gapSentence: 'This internship is a great _____ for students.', partOfSpeech: 'noun', level: 'B1', category: 'general', distractors: ['obstacle', 'problem', 'threat'] },
  { word: 'deadline', definition: 'The latest time by which something must be finished', example: 'The deadline for the project is next Friday.', gapSentence: 'The _____ for the project is next Friday.', partOfSpeech: 'noun', level: 'B1', category: 'general', distractors: ['milestone', 'timetable', 'schedule'] },
  { word: 'advantage', definition: 'A beneficial factor or positive condition', example: 'Knowing multiple languages is an advantage in business.', gapSentence: 'Knowing multiple languages is an _____ in business.', partOfSpeech: 'noun', level: 'B1', category: 'general', distractors: ['disadvantage', 'problem', 'weakness'] },
  { word: 'revenue', definition: 'The income that a business receives', example: "The company's revenue increased by 20% this quarter.", gapSentence: "The company's _____ increased by 20% this quarter.", partOfSpeech: 'noun', level: 'B1', category: 'business', distractors: ['expense', 'profit', 'loss'] },
  { word: 'itinerary', definition: 'A planned route or schedule for a trip', example: 'Our travel agent prepared a detailed itinerary for the tour.', gapSentence: 'Our travel agent prepared a detailed _____ for the tour.', partOfSpeech: 'noun', level: 'B1', category: 'travel', distractors: ['destination', 'passport', 'ticket'] },
  { word: 'accommodation', definition: 'A place where people can stay or live', example: 'We booked accommodation near the beach.', gapSentence: 'We booked _____ near the beach.', partOfSpeech: 'noun', level: 'B1', category: 'travel', distractors: ['transportation', 'restaurant', 'entertainment'] },
  { word: 'break the ice', definition: 'To start a conversation in an awkward social situation', example: 'He told a joke to break the ice at the party.', gapSentence: 'He told a joke to _____ the ice at the party.', partOfSpeech: 'idiom', level: 'B1', category: 'idioms', distractors: ['hit the roof', 'cut the cord', 'turn the page'] },
  { word: 'carry out', definition: 'To perform or complete a task', example: 'The team carried out the research successfully.', gapSentence: 'The team _____ out the research successfully.', partOfSpeech: 'phrasal_verb', level: 'B1', category: 'phrasal_verbs', distractors: ['put off', 'take over', 'give up'] },
  { word: 'bring up', definition: 'To mention or introduce a topic for discussion', example: 'She brought up an important issue during the meeting.', gapSentence: 'She _____ up an important issue during the meeting.', partOfSpeech: 'phrasal_verb', level: 'B1', category: 'phrasal_verbs', distractors: ['shut down', 'put away', 'take back'] },
  { word: 'come across', definition: 'To find or meet by chance', example: 'I came across an interesting article yesterday.', gapSentence: 'I _____ across an interesting article yesterday.', partOfSpeech: 'phrasal_verb', level: 'B1', category: 'phrasal_verbs', distractors: ['go through', 'look into', 'run over'] },
  { word: 'figure out', definition: 'To understand or solve something after thinking about it', example: 'I finally figured out how to use the new software.', gapSentence: 'I finally _____ out how to use the new software.', partOfSpeech: 'phrasal_verb', level: 'B1', category: 'phrasal_verbs', distractors: ['give up', 'put off', 'turn down'] },
  { word: 'put off', definition: 'To delay or postpone something to a later time', example: "Don't put off until tomorrow what you can do today.", gapSentence: "Don't _____ off until tomorrow what you can do today.", partOfSpeech: 'phrasal_verb', level: 'B1', category: 'phrasal_verbs', distractors: ['take on', 'carry out', 'bring about'] },

  // ═══════════════════════════════════════════════════════════
  // B2 — Upper Intermediate (40 words)
  // News, opinions, technology, environment, abstract concepts
  // ═══════════════════════════════════════════════════════════
  { word: 'accommodate', definition: 'To provide space or adapt to fit someone or something', example: 'The hotel can accommodate up to 500 guests.', gapSentence: 'The hotel can _____ up to 500 guests.', partOfSpeech: 'verb', level: 'B2', category: 'general', distractors: ['reject', 'exclude', 'displace'] },
  { word: 'acknowledge', definition: 'To accept or admit that something is true', example: 'The government acknowledged the problem publicly.', gapSentence: 'The government _____ the problem publicly.', partOfSpeech: 'verb', level: 'B2', category: 'general', distractors: ['deny', 'ignore', 'dismiss'] },
  { word: 'advocate', definition: 'To publicly support a particular idea or plan', example: 'She advocates for better education in rural areas.', gapSentence: 'She _____ for better education in rural areas.', partOfSpeech: 'verb', level: 'B2', category: 'general', distractors: ['oppose', 'criticize', 'challenge'] },
  { word: 'anticipate', definition: 'To expect something to happen and prepare for it', example: 'We anticipate a high demand for the new product.', gapSentence: 'We _____ a high demand for the new product.', partOfSpeech: 'verb', level: 'B2', category: 'general', distractors: ['ignore', 'overlook', 'disregard'] },
  { word: 'circumvent', definition: 'To find a way around a problem or rule', example: 'They tried to circumvent the regulations.', gapSentence: 'They tried to _____ the regulations.', partOfSpeech: 'verb', level: 'B2', category: 'general', distractors: ['enforce', 'obey', 'follow'] },
  { word: 'collaborate', definition: 'To work together on a shared project', example: 'The two companies decided to collaborate on the research.', gapSentence: 'The two companies decided to _____ on the research.', partOfSpeech: 'verb', level: 'B2', category: 'business', distractors: ['compete', 'conflict', 'argue'] },
  { word: 'compromise', definition: 'To reach an agreement by each side giving up something', example: 'We need to compromise to move the project forward.', gapSentence: 'We need to _____ to move the project forward.', partOfSpeech: 'verb', level: 'B2', category: 'general', distractors: ['resist', 'insist', 'demand'] },
  { word: 'contemplate', definition: 'To think carefully about something for a long time', example: 'She is contemplating a career change.', gapSentence: 'She is _____ a career change.', partOfSpeech: 'verb', level: 'B2', category: 'general', distractors: ['ignore', 'dismiss', 'rush'] },
  { word: 'convey', definition: 'To communicate or express a message or feeling', example: 'Please convey my apologies to the team.', gapSentence: 'Please _____ my apologies to the team.', partOfSpeech: 'verb', level: 'B2', category: 'general', distractors: ['hide', 'withhold', 'conceal'] },
  { word: 'deteriorate', definition: 'To become worse over time', example: 'His health began to deteriorate rapidly.', gapSentence: 'His health began to _____ rapidly.', partOfSpeech: 'verb', level: 'B2', category: 'general', distractors: ['improve', 'stabilize', 'recover'] },
  { word: 'elaborate', definition: 'To add more detail or explain further', example: 'Could you elaborate on your proposal?', gapSentence: 'Could you _____ on your proposal?', partOfSpeech: 'verb', level: 'B2', category: 'general', distractors: ['simplify', 'summarize', 'reduce'] },
  { word: 'facilitate', definition: 'To make a process easier or smoother', example: 'Technology can facilitate remote learning.', gapSentence: 'Technology can _____ remote learning.', partOfSpeech: 'verb', level: 'B2', category: 'general', distractors: ['hinder', 'block', 'complicate'] },
  { word: 'fluctuate', definition: 'To rise and fall irregularly in number or amount', example: 'Oil prices fluctuate based on global demand.', gapSentence: 'Oil prices _____ based on global demand.', partOfSpeech: 'verb', level: 'B2', category: 'business', distractors: ['stabilize', 'remain', 'settle'] },
  { word: 'incorporate', definition: 'To include something as part of a whole', example: 'We should incorporate user feedback into the design.', gapSentence: 'We should _____ user feedback into the design.', partOfSpeech: 'verb', level: 'B2', category: 'general', distractors: ['exclude', 'remove', 'separate'] },
  { word: 'inevitable', definition: 'Certain to happen and cannot be avoided', example: 'Change is inevitable in any growing organization.', gapSentence: 'Change is _____ in any growing organization.', partOfSpeech: 'adjective', level: 'B2', category: 'general', distractors: ['avoidable', 'optional', 'unlikely'] },
  { word: 'legitimate', definition: 'Allowed by law or reasonable', example: 'She has a legitimate reason for being absent.', gapSentence: 'She has a _____ reason for being absent.', partOfSpeech: 'adjective', level: 'B2', category: 'general', distractors: ['illegal', 'invalid', 'doubtful'] },
  { word: 'negotiate', definition: 'To discuss something to reach an agreement', example: 'The two companies are negotiating a merger.', gapSentence: 'The two companies are _____ a merger.', partOfSpeech: 'verb', level: 'B2', category: 'business', distractors: ['argue', 'refuse', 'demand'] },
  { word: 'perceive', definition: 'To notice or become aware of something', example: 'She perceived a change in his attitude.', gapSentence: 'She _____ a change in his attitude.', partOfSpeech: 'verb', level: 'B2', category: 'general', distractors: ['ignore', 'overlook', 'miss'] },
  { word: 'predominant', definition: 'Being the most common or important', example: 'English is the predominant language in international business.', gapSentence: 'English is the _____ language in international business.', partOfSpeech: 'adjective', level: 'B2', category: 'general', distractors: ['minor', 'rare', 'insignificant'] },
  { word: 'subordinate', definition: 'Less important or lower in rank', example: 'All other issues are subordinate to this one.', gapSentence: 'All other issues are _____ to this one.', partOfSpeech: 'adjective', level: 'B2', category: 'general', distractors: ['superior', 'equal', 'dominant'] },
  { word: 'perspective', definition: 'A particular way of viewing something', example: 'The article offers a fresh perspective on climate change.', gapSentence: 'The article offers a fresh _____ on climate change.', partOfSpeech: 'noun', level: 'B2', category: 'general', distractors: ['prejudice', 'assumption', 'illusion'] },
  { word: 'sustainable', definition: 'Able to continue without harming the environment', example: 'We need to find sustainable energy solutions.', gapSentence: 'We need to find _____ energy solutions.', partOfSpeech: 'adjective', level: 'B2', category: 'general', distractors: ['harmful', 'wasteful', 'temporary'] },
  { word: 'controversy', definition: 'A prolonged public disagreement or debate', example: 'The new policy has caused considerable controversy.', gapSentence: 'The new policy has caused considerable _____.', partOfSpeech: 'noun', level: 'B2', category: 'general', distractors: ['agreement', 'harmony', 'consensus'] },
  { word: 'consequence', definition: 'A result or effect of an action', example: 'Every decision has consequences.', gapSentence: 'Every decision has _____.', partOfSpeech: 'noun', level: 'B2', category: 'general', distractors: ['cause', 'reason', 'origin'] },
  { word: 'implement', definition: 'To put a plan or decision into effect', example: 'The school will implement the new policy next semester.', gapSentence: 'The school will _____ the new policy next semester.', partOfSpeech: 'verb', level: 'B2', category: 'general', distractors: ['abandon', 'cancel', 'delay'] },
  { word: 'stakeholder', definition: 'A person with an interest or concern in a business', example: 'All stakeholders were invited to the annual meeting.', gapSentence: 'All _____ were invited to the annual meeting.', partOfSpeech: 'noun', level: 'B2', category: 'business', distractors: ['competitor', 'observer', 'outsider'] },
  { word: 'diversify', definition: 'To expand into new areas or markets', example: 'The company decided to diversify into renewable energy.', gapSentence: 'The company decided to _____ into renewable energy.', partOfSpeech: 'verb', level: 'B2', category: 'business', distractors: ['concentrate', 'specialize', 'narrow'] },
  { word: 'layover', definition: 'A short stop between parts of a journey', example: 'We have a three-hour layover in Dubai.', gapSentence: 'We have a three-hour _____ in Dubai.', partOfSpeech: 'noun', level: 'B2', category: 'travel', distractors: ['stopover', 'connection', 'transfer'] },
  { word: 'expedition', definition: 'A journey made for a specific purpose like exploration', example: 'The scientific expedition explored the Amazon rainforest.', gapSentence: 'The scientific _____ explored the Amazon rainforest.', partOfSpeech: 'noun', level: 'B2', category: 'travel', distractors: ['vacation', 'excursion', 'holiday'] },
  { word: 'burn the midnight oil', definition: 'To work late into the night', example: 'She burned the midnight oil to finish the report.', gapSentence: 'She _____ the midnight oil to finish the report.', partOfSpeech: 'idiom', level: 'B2', category: 'idioms', distractors: ['hit the nail', 'break the ice', 'spill the beans'] },
  { word: 'the ball is in your court', definition: 'It is your turn to make a decision or take action', example: "I've made my offer — the ball is in your court now.", gapSentence: "I've made my offer — the ball is in your _____ now.", partOfSpeech: 'idiom', level: 'B2', category: 'idioms', distractors: ['field', 'game', 'hand'] },
  { word: 'take over', definition: 'To assume control or responsibility for something', example: 'She will take over as manager next month.', gapSentence: 'She will _____ over as manager next month.', partOfSpeech: 'phrasal_verb', level: 'B2', category: 'phrasal_verbs', distractors: ['hand over', 'give up', 'put off'] },
  { word: 'iron out', definition: 'To resolve difficulties or disagreements', example: 'We need to iron out the details before signing the contract.', gapSentence: 'We need to _____ out the details before signing the contract.', partOfSpeech: 'phrasal_verb', level: 'B2', category: 'phrasal_verbs', distractors: ['smooth over', 'work out', 'figure out'] },
  { word: 'empirical', definition: 'Based on observation or experiment rather than theory', example: 'The study provides empirical evidence for the theory.', gapSentence: 'The study provides _____ evidence for the theory.', partOfSpeech: 'adjective', level: 'B2', category: 'academic', distractors: ['theoretical', 'hypothetical', 'speculative'] },
  { word: 'methodology', definition: 'A system of methods used in a particular area of study', example: 'The research methodology was clearly outlined in the paper.', gapSentence: 'The research _____ was clearly outlined in the paper.', partOfSpeech: 'noun', level: 'B2', category: 'academic', distractors: ['conclusion', 'hypothesis', 'result'] },
  { word: 'citation', definition: 'A reference to a published source in academic writing', example: 'Proper citation is essential in academic writing.', gapSentence: 'Proper _____ is essential in academic writing.', partOfSpeech: 'noun', level: 'B2', category: 'academic', distractors: ['quotation', 'reference', 'attribution'] },

  // ═══════════════════════════════════════════════════════════
  // C1 — Advanced (40 words)
  // Academic, abstract concepts, nuanced vocabulary
  // ═══════════════════════════════════════════════════════════
  { word: 'ambiguous', definition: 'Having more than one possible meaning', example: 'The instructions were ambiguous and caused confusion.', gapSentence: 'The instructions were _____ and caused confusion.', partOfSpeech: 'adjective', level: 'C1', category: 'general', distractors: ['clear', 'obvious', 'explicit'] },
  { word: 'clandestine', definition: 'Kept secret or done in secret', example: 'They held clandestine meetings to plan the surprise party.', gapSentence: 'They held _____ meetings to plan the surprise party.', partOfSpeech: 'adjective', level: 'C1', category: 'general', distractors: ['public', 'open', 'obvious'] },
  { word: 'coerce', definition: 'To force someone to do something by using threats', example: 'He was coerced into signing the document.', gapSentence: 'He was _____ into signing the document.', partOfSpeech: 'verb', level: 'C1', category: 'general', distractors: ['persuade', 'encourage', 'invite'] },
  { word: 'contemporary', definition: 'Belonging to the present time; modern', example: 'The museum features contemporary art from local artists.', gapSentence: 'The museum features _____ art from local artists.', partOfSpeech: 'adjective', level: 'C1', category: 'general', distractors: ['ancient', 'historical', 'outdated'] },
  { word: 'contingent', definition: 'Dependent on certain conditions being met', example: 'The deal is contingent on regulatory approval.', gapSentence: 'The deal is _____ on regulatory approval.', partOfSpeech: 'adjective', level: 'C1', category: 'general', distractors: ['independent', 'certain', 'guaranteed'] },
  { word: 'delineate', definition: 'To describe or outline something precisely', example: 'The report delineates the key challenges facing the industry.', gapSentence: 'The report _____ the key challenges facing the industry.', partOfSpeech: 'verb', level: 'C1', category: 'general', distractors: ['confuse', 'obscure', 'muddle'] },
  { word: 'disparate', definition: 'Very different and not connected', example: 'The team brought together disparate skills and backgrounds.', gapSentence: 'The team brought together _____ skills and backgrounds.', partOfSpeech: 'adjective', level: 'C1', category: 'general', distractors: ['similar', 'identical', 'uniform'] },
  { word: 'eclectic', definition: 'Including a wide variety of styles or ideas', example: 'The restaurant has an eclectic menu with dishes from around the world.', gapSentence: 'The restaurant has an _____ menu with dishes from around the world.', partOfSpeech: 'adjective', level: 'C1', category: 'general', distractors: ['uniform', 'narrow', 'limited'] },
  { word: 'elucidate', definition: 'To make something clearer by explaining it', example: 'The professor elucidated the complex theory with a simple diagram.', gapSentence: 'The professor _____ the complex theory with a simple diagram.', partOfSpeech: 'verb', level: 'C1', category: 'general', distractors: ['complicate', 'confuse', 'obscure'] },
  { word: 'exacerbate', definition: 'To make a problem or situation worse', example: 'The drought was exacerbated by record-high temperatures.', gapSentence: 'The drought was _____ by record-high temperatures.', partOfSpeech: 'verb', level: 'C1', category: 'general', distractors: ['improve', 'relieve', 'alleviate'] },
  { word: 'frivolous', definition: 'Not having any serious purpose or value', example: 'The court dismissed the frivolous lawsuit.', gapSentence: 'The court dismissed the _____ lawsuit.', partOfSpeech: 'adjective', level: 'C1', category: 'general', distractors: ['serious', 'important', 'meaningful'] },
  { word: 'heuristic', definition: 'A practical method that helps in learning or problem-solving', example: 'The teacher used a heuristic approach to engage students.', gapSentence: 'The teacher used a _____ approach to engage students.', partOfSpeech: 'adjective', level: 'C1', category: 'academic', distractors: ['theoretical', 'abstract', 'rigid'] },
  { word: 'immutable', definition: 'Unable to be changed', example: 'The laws of physics are considered immutable.', gapSentence: 'The laws of physics are considered _____.', partOfSpeech: 'adjective', level: 'C1', category: 'general', distractors: ['flexible', 'variable', 'adaptable'] },
  { word: 'juxtapose', definition: 'To place things side by side for comparison', example: 'The artist juxtaposes light and dark to create tension.', gapSentence: 'The artist _____ light and dark to create tension.', partOfSpeech: 'verb', level: 'C1', category: 'general', distractors: ['separate', 'isolate', 'divide'] },
  { word: 'meticulous', definition: 'Showing great attention to detail; very careful', example: 'The editor was meticulous in checking every reference.', gapSentence: 'The editor was _____ in checking every reference.', partOfSpeech: 'adjective', level: 'C1', category: 'general', distractors: ['careless', 'sloppy', 'hasty'] },
  { word: 'nuanced', definition: 'Having subtle differences in meaning or expression', example: 'The politician gave a nuanced response to the question.', gapSentence: 'The politician gave a _____ response to the question.', partOfSpeech: 'adjective', level: 'C1', category: 'general', distractors: ['simple', 'blunt', 'direct'] },
  { word: 'pragmatic', definition: 'Dealing with things in a practical, realistic way', example: 'We need a pragmatic approach to solve this crisis.', gapSentence: 'We need a _____ approach to solve this crisis.', partOfSpeech: 'adjective', level: 'C1', category: 'general', distractors: ['idealistic', 'theoretical', 'impractical'] },
  { word: 'relinquish', definition: 'To voluntarily give up control or possession', example: 'She decided to relinquish her role as CEO.', gapSentence: 'She decided to _____ her role as CEO.', partOfSpeech: 'verb', level: 'C1', category: 'general', distractors: ['retain', 'claim', 'seize'] },
  { word: 'succinct', definition: 'Expressed clearly and briefly', example: 'Her succinct summary impressed the committee.', gapSentence: 'Her _____ summary impressed the committee.', partOfSpeech: 'adjective', level: 'C1', category: 'general', distractors: ['wordy', 'lengthy', 'verbose'] },
  { word: 'ubiquitous', definition: 'Present or found everywhere', example: 'Smartphones have become ubiquitous in modern society.', gapSentence: 'Smartphones have become _____ in modern society.', partOfSpeech: 'adjective', level: 'C1', category: 'general', distractors: ['rare', 'scarce', 'uncommon'] },
  { word: 'disseminate', definition: 'To spread information widely', example: 'The organization disseminates research findings to the public.', gapSentence: 'The organization _____ research findings to the public.', partOfSpeech: 'verb', level: 'C1', category: 'academic', distractors: ['conceal', 'withhold', 'suppress'] },
  { word: 'rhetoric', definition: 'The art of effective or persuasive speaking', example: 'His rhetoric captivated the audience.', gapSentence: 'His _____ captivated the audience.', partOfSpeech: 'noun', level: 'C1', category: 'general', distractors: ['silence', 'mumble', 'whisper'] },
  { word: 'inadvertent', definition: 'Not intentional; happening by accident', example: 'The data breach was caused by inadvertent misconfiguration.', gapSentence: 'The data breach was caused by _____ misconfiguration.', partOfSpeech: 'adjective', level: 'C1', category: 'general', distractors: ['deliberate', 'intentional', 'planned'] },
  { word: 'proliferate', definition: 'To increase rapidly in number', example: 'Online courses have proliferated since the pandemic.', gapSentence: 'Online courses have _____ since the pandemic.', partOfSpeech: 'verb', level: 'C1', category: 'general', distractors: ['decline', 'shrink', 'diminish'] },
  { word: 'ambivalent', definition: 'Having mixed feelings about something', example: 'She felt ambivalent about moving to a new city.', gapSentence: 'She felt _____ about moving to a new city.', partOfSpeech: 'adjective', level: 'C1', category: 'general', distractors: ['certain', 'decisive', 'confident'] },
  { word: 'acquisition', definition: 'The purchase of one company by another', example: 'The acquisition was valued at $5 billion.', gapSentence: 'The _____ was valued at $5 billion.', partOfSpeech: 'noun', level: 'C1', category: 'business', distractors: ['sale', 'merger', 'closure'] },
  { word: 'synergy', definition: 'Combined effort producing greater results than individual efforts', example: 'The merger will create synergy between the two departments.', gapSentence: 'The merger will create _____ between the two departments.', partOfSpeech: 'noun', level: 'C1', category: 'business', distractors: ['conflict', 'friction', 'division'] },
  { word: 'procurement', definition: 'The process of obtaining goods or services for an organization', example: 'The procurement department handles all vendor contracts.', gapSentence: 'The _____ department handles all vendor contracts.', partOfSpeech: 'noun', level: 'C1', category: 'business', distractors: ['distribution', 'manufacturing', 'marketing'] },
  { word: 'qualitative', definition: 'Relating to qualities or characteristics rather than quantities', example: 'The study used qualitative interviews to gather data.', gapSentence: 'The study used _____ interviews to gather data.', partOfSpeech: 'adjective', level: 'C1', category: 'academic', distractors: ['quantitative', 'numerical', 'statistical'] },
  { word: 'corroborate', definition: 'To confirm or support a statement with evidence', example: "The witness corroborated the defendant's testimony.", gapSentence: "The witness _____ the defendant's testimony.", partOfSpeech: 'verb', level: 'C1', category: 'academic', distractors: ['contradict', 'refute', 'deny'] },
  { word: 'pedagogy', definition: 'The method and practice of teaching', example: 'Modern pedagogy emphasizes student-centered learning.', gapSentence: 'Modern _____ emphasizes student-centered learning.', partOfSpeech: 'noun', level: 'C1', category: 'academic', distractors: ['curriculum', 'syllabus', 'assessment'] },

  // ═══════════════════════════════════════════════════════════
  // C2 — Mastery (40 words)
  // Sophisticated, literary, highly specialized vocabulary
  // ═══════════════════════════════════════════════════════════
  { word: 'abnegate', definition: 'To renounce or give up a belief or principle', example: 'He chose to abnegate his claim to the family fortune.', gapSentence: 'He chose to _____ his claim to the family fortune.', partOfSpeech: 'verb', level: 'C2', category: 'general', distractors: ['assert', 'claim', 'demand'] },
  { word: 'acquiesce', definition: 'To accept something reluctantly but without protest', example: 'She acquiesced to the committee decision.', gapSentence: 'She _____ to the committee decision.', partOfSpeech: 'verb', level: 'C2', category: 'general', distractors: ['resist', 'oppose', 'rebel'] },
  { word: 'ameliorate', definition: 'To make something bad or unsatisfactory better', example: 'The new policy aims to ameliorate working conditions.', gapSentence: 'The new policy aims to _____ working conditions.', partOfSpeech: 'verb', level: 'C2', category: 'general', distractors: ['worsen', 'deteriorate', 'exacerbate'] },
  { word: 'bellicose', definition: 'Demonstrating aggression and willingness to fight', example: 'His bellicose rhetoric worried the diplomatic community.', gapSentence: 'His _____ rhetoric worried the diplomatic community.', partOfSpeech: 'adjective', level: 'C2', category: 'general', distractors: ['peaceful', 'gentle', 'conciliatory'] },
  { word: 'cacophony', definition: 'A harsh mixture of unpleasant sounds', example: 'The cacophony of car horns filled the busy street.', gapSentence: 'The _____ of car horns filled the busy street.', partOfSpeech: 'noun', level: 'C2', category: 'general', distractors: ['harmony', 'melody', 'symphony'] },
  { word: 'capricious', definition: 'Given to sudden and unaccountable changes of mood', example: 'The capricious weather made it hard to plan the event.', gapSentence: 'The _____ weather made it hard to plan the event.', partOfSpeech: 'adjective', level: 'C2', category: 'general', distractors: ['consistent', 'steady', 'predictable'] },
  { word: 'didactic', definition: 'Intended to teach or instruct, often in a moralizing way', example: 'The novel has a didactic tone that some readers find preachy.', gapSentence: 'The novel has a _____ tone that some readers find preachy.', partOfSpeech: 'adjective', level: 'C2', category: 'academic', distractors: ['entertaining', 'amusing', 'frivolous'] },
  { word: 'ebullient', definition: 'Full of cheerful energy and excitement', example: 'Her ebullient personality lit up the entire room.', gapSentence: 'Her _____ personality lit up the entire room.', partOfSpeech: 'adjective', level: 'C2', category: 'general', distractors: ['melancholy', 'somber', 'gloomy'] },
  { word: 'ephemeral', definition: 'Lasting for a very short time', example: 'The beauty of cherry blossoms is ephemeral.', gapSentence: 'The beauty of cherry blossoms is _____.', partOfSpeech: 'adjective', level: 'C2', category: 'general', distractors: ['permanent', 'lasting', 'enduring'] },
  { word: 'equivocate', definition: 'To use vague language to avoid committing to an answer', example: 'The politician continued to equivocate on the issue.', gapSentence: 'The politician continued to _____ on the issue.', partOfSpeech: 'verb', level: 'C2', category: 'general', distractors: ['clarify', 'assert', 'declare'] },
  { word: 'esoteric', definition: 'Understood by only a small group with specialized knowledge', example: "The philosopher's esoteric writings baffled most readers.", gapSentence: "The philosopher's _____ writings baffled most readers.", partOfSpeech: 'adjective', level: 'C2', category: 'general', distractors: ['common', 'accessible', 'familiar'] },
  { word: 'exigent', definition: 'Pressing; requiring immediate action', example: 'The exigent circumstances demanded an emergency meeting.', gapSentence: 'The _____ circumstances demanded an emergency meeting.', partOfSpeech: 'adjective', level: 'C2', category: 'general', distractors: ['relaxed', 'trivial', 'optional'] },
  { word: 'grandiloquent', definition: 'Using pompous or extravagant language', example: 'His grandiloquent speech impressed nobody.', gapSentence: 'His _____ speech impressed nobody.', partOfSpeech: 'adjective', level: 'C2', category: 'general', distractors: ['modest', 'simple', 'concise'] },
  { word: 'halcyon', definition: 'Peaceful, calm, and prosperous', example: 'They fondly remembered the halcyon days of their childhood.', gapSentence: 'They fondly remembered the _____ days of their childhood.', partOfSpeech: 'adjective', level: 'C2', category: 'general', distractors: ['turbulent', 'chaotic', 'stormy'] },
  { word: 'iconoclast', definition: 'A person who attacks cherished beliefs or institutions', example: 'The iconoclast challenged every tradition in the field.', gapSentence: 'The _____ challenged every tradition in the field.', partOfSpeech: 'noun', level: 'C2', category: 'general', distractors: ['traditionalist', 'conformist', 'follower'] },
  { word: 'idiosyncratic', definition: 'Peculiar or unique to an individual', example: 'Her idiosyncratic style of painting attracted many collectors.', gapSentence: 'Her _____ style of painting attracted many collectors.', partOfSpeech: 'adjective', level: 'C2', category: 'general', distractors: ['ordinary', 'conventional', 'typical'] },
  { word: 'indefatigable', definition: 'Persisting tirelessly and without giving up', example: 'The indefatigable researcher worked late into every night.', gapSentence: 'The _____ researcher worked late into every night.', partOfSpeech: 'adjective', level: 'C2', category: 'general', distractors: ['exhausted', 'lazy', 'weary'] },
  { word: 'loquacious', definition: 'Tending to talk a great deal; very talkative', example: 'The loquacious host kept the dinner party entertained.', gapSentence: 'The _____ host kept the dinner party entertained.', partOfSpeech: 'adjective', level: 'C2', category: 'general', distractors: ['quiet', 'taciturn', 'silent'] },
  { word: 'magnanimous', definition: 'Very generous or forgiving, especially toward rivals', example: 'She was magnanimous in victory, praising her opponent.', gapSentence: 'She was _____ in victory, praising her opponent.', partOfSpeech: 'adjective', level: 'C2', category: 'general', distractors: ['petty', 'vindictive', 'spiteful'] },
  { word: 'obfuscate', definition: 'To make something unclear or hard to understand', example: 'Politicians sometimes obfuscate the truth with complex language.', gapSentence: 'Politicians sometimes _____ the truth with complex language.', partOfSpeech: 'verb', level: 'C2', category: 'general', distractors: ['clarify', 'explain', 'illuminate'] },
  { word: 'perfunctory', definition: 'Carried out with minimal effort or interest', example: 'He gave a perfunctory nod before returning to his work.', gapSentence: 'He gave a _____ nod before returning to his work.', partOfSpeech: 'adjective', level: 'C2', category: 'general', distractors: ['thorough', 'diligent', 'careful'] },
  { word: 'recalcitrant', definition: 'Stubbornly refusing to obey rules or cooperate', example: 'The recalcitrant student refused to follow the rules.', gapSentence: 'The _____ student refused to follow the rules.', partOfSpeech: 'adjective', level: 'C2', category: 'general', distractors: ['compliant', 'obedient', 'cooperative'] },
  { word: 'quintessential', definition: 'Representing the most perfect example of a quality', example: 'She is the quintessential English teacher — passionate and dedicated.', gapSentence: 'She is the _____ English teacher — passionate and dedicated.', partOfSpeech: 'adjective', level: 'C2', category: 'general', distractors: ['atypical', 'unusual', 'mediocre'] },
  { word: 'ineffable', definition: 'Too great or extreme to be expressed in words', example: 'The beauty of the sunset was ineffable.', gapSentence: 'The beauty of the sunset was _____.', partOfSpeech: 'adjective', level: 'C2', category: 'general', distractors: ['describable', 'ordinary', 'common'] },
  { word: 'aberration', definition: 'A departure from what is normal or expected', example: 'The warm winter was an aberration from typical weather patterns.', gapSentence: 'The warm winter was an _____ from typical weather patterns.', partOfSpeech: 'noun', level: 'C2', category: 'general', distractors: ['norm', 'standard', 'routine'] },
  { word: 'supercilious', definition: 'Behaving as though one is superior to others', example: 'His supercilious attitude alienated his colleagues.', gapSentence: 'His _____ attitude alienated his colleagues.', partOfSpeech: 'adjective', level: 'C2', category: 'general', distractors: ['humble', 'modest', 'respectful'] },
  { word: 'verisimilitude', definition: 'The appearance of being true or real', example: 'The novel achieves verisimilitude through meticulous historical detail.', gapSentence: 'The novel achieves _____ through meticulous historical detail.', partOfSpeech: 'noun', level: 'C2', category: 'academic', distractors: ['fiction', 'fantasy', 'illusion'] },
  { word: 'perspicacious', definition: 'Having a keen insight and understanding', example: 'A perspicacious investor spotted the trend early.', gapSentence: 'A _____ investor spotted the trend early.', partOfSpeech: 'adjective', level: 'C2', category: 'general', distractors: ['obtuse', 'unaware', 'ignorant'] },
  { word: 'lacuna', definition: 'A gap or missing part, especially in a text', example: 'There is a lacuna in the historical record for that period.', gapSentence: 'There is a _____ in the historical record for that period.', partOfSpeech: 'noun', level: 'C2', category: 'academic', distractors: ['abundance', 'surplus', 'excess'] },
  { word: 'pulchritude', definition: 'Great physical beauty', example: 'The pulchritude of the ancient temple left visitors speechless.', gapSentence: 'The _____ of the ancient temple left visitors speechless.', partOfSpeech: 'noun', level: 'C2', category: 'general', distractors: ['ugliness', 'plainness', 'drabness'] },
  { word: 'depreciation', definition: 'A decrease in value of something over time', example: 'The depreciation of equipment is factored into the budget.', gapSentence: 'The _____ of equipment is factored into the budget.', partOfSpeech: 'noun', level: 'C2', category: 'business', distractors: ['appreciation', 'increase', 'growth'] },
  { word: 'benchmark', definition: 'A standard against which things can be compared', example: 'This report sets a new benchmark for the industry.', gapSentence: 'This report sets a new _____ for the industry.', partOfSpeech: 'noun', level: 'C2', category: 'business', distractors: ['milestone', 'deadline', 'target'] },
  { word: 'thesis', definition: 'A long research paper written for a university degree', example: 'She defended her thesis on renewable energy policy.', gapSentence: 'She defended her _____ on renewable energy policy.', partOfSpeech: 'noun', level: 'C2', category: 'academic', distractors: ['essay', 'report', 'summary'] },
  { word: 'anomaly', definition: 'Something that deviates from the standard or expected', example: 'The researchers noted an anomaly in the data.', gapSentence: 'The researchers noted an _____ in the data.', partOfSpeech: 'noun', level: 'C2', category: 'academic', distractors: ['pattern', 'norm', 'standard'] },
];

export async function POST(request: NextRequest) {
  // Block in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seed endpoints disabled in production' }, { status: 403 });
  }

  try {
    // ── Auth check — always require admin ──
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized — admin authentication required for seeding.' },
        { status: 401 }
      );
    }
    const adminError = requireAdmin(user);
    if (adminError) return adminError;

    let created = 0;
    let skipped = 0;
    let updated = 0;

    for (const item of VOCAB_SEED_DATA) {
      const existing = await db.vocabWord.findFirst({
        where: {
          word: item.word,
          level: item.level,
          category: item.category,
        },
      });

      if (existing) {
        // Update existing word with gapSentence, partOfSpeech, and distractors if missing
        const needsUpdate =
          !existing.gapSentence ||
          !existing.partOfSpeech ||
          !existing.distractors;

        if (needsUpdate) {
          await db.vocabWord.update({
            where: { id: existing.id },
            data: {
              ...(item.gapSentence && !existing.gapSentence ? { gapSentence: item.gapSentence } : {}),
              ...(item.partOfSpeech && !existing.partOfSpeech ? { partOfSpeech: item.partOfSpeech } : {}),
              ...(item.distractors && !existing.distractors ? { distractors: JSON.stringify(item.distractors) } : {}),
            },
          });
          updated++;
        }
        skipped++;
        continue;
      }

      await db.vocabWord.create({
        data: {
          word: item.word,
          definition: item.definition,
          example: item.example,
          gapSentence: item.gapSentence,
          partOfSpeech: item.partOfSpeech,
          distractors: JSON.stringify(item.distractors),
          level: item.level,
          category: item.category,
          isActive: true,
        },
      });
      created++;
    }

    // Count words by level
    const levelCounts: Record<string, number> = {};
    for (const level of ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']) {
      const count = await db.vocabWord.count({ where: { level, isActive: true } });
      levelCounts[level] = count;
    }

    return NextResponse.json({
      success: true,
      message: `Vocabulary seeding complete. Created: ${created}, Updated: ${updated}, Skipped: ${skipped}`,
      created,
      updated,
      skipped,
      total: created + skipped,
      levelCounts,
    });
  } catch (error) {
    console.error('Vocabulary seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed vocabulary data.' },
      { status: 500 }
    );
  }
}
