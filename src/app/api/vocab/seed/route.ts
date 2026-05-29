import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

const VOCAB_DATA = [
  // ═══════════════════════════════════════════
  // A1 - General (basic greetings, family, food, colors, numbers)
  // ═══════════════════════════════════════════
  { word: 'hello', definition: 'A greeting used when meeting someone', example: 'Hello! How are you today?', pronunciation: '/həˈloʊ/', level: 'A1', category: 'general' },
  { word: 'goodbye', definition: 'A farewell expression used when leaving', example: 'Goodbye! See you tomorrow.', pronunciation: '/ɡʊdˈbaɪ/', level: 'A1', category: 'general' },
  { word: 'mother', definition: 'A female parent', example: 'My mother cooks delicious food.', pronunciation: '/ˈmʌðər/', level: 'A1', category: 'general' },
  { word: 'father', definition: 'A male parent', example: 'My father works in a hospital.', pronunciation: '/ˈfɑːðər/', level: 'A1', category: 'general' },
  { word: 'sister', definition: 'A female sibling', example: 'My sister is older than me.', pronunciation: '/ˈsɪstər/', level: 'A1', category: 'general' },
  { word: 'brother', definition: 'A male sibling', example: 'I have one brother and two sisters.', pronunciation: '/ˈbrʌðər/', level: 'A1', category: 'general' },
  { word: 'bread', definition: 'A staple food made from flour and water, baked in an oven', example: 'I eat bread for breakfast every morning.', pronunciation: '/bred/', level: 'A1', category: 'general' },
  { word: 'milk', definition: 'A white nutritious liquid produced by mammals', example: 'I drink a glass of milk before bed.', pronunciation: '/mɪlk/', level: 'A1', category: 'general' },
  { word: 'apple', definition: 'A round fruit with red, green, or yellow skin', example: 'An apple a day keeps the doctor away.', pronunciation: '/ˈæpəl/', level: 'A1', category: 'general' },
  { word: 'water', definition: 'A clear, colorless liquid essential for life', example: 'Please give me a glass of water.', pronunciation: '/ˈwɔːtər/', level: 'A1', category: 'general' },
  { word: 'red', definition: 'The color of blood or fire', example: 'She wore a beautiful red dress.', pronunciation: '/red/', level: 'A1', category: 'general' },
  { word: 'blue', definition: 'The color of the clear sky or sea', example: 'The sky is blue today.', pronunciation: '/bluː/', level: 'A1', category: 'general' },
  { word: 'green', definition: 'The color of grass and leaves', example: 'The garden has many green plants.', pronunciation: '/ɡriːn/', level: 'A1', category: 'general' },
  { word: 'happy', definition: 'Feeling pleasure and enjoyment', example: 'I am very happy to see you!', pronunciation: '/ˈhæpi/', level: 'A1', category: 'general' },
  { word: 'friend', definition: 'A person you know well and like', example: 'She is my best friend from school.', pronunciation: '/frend/', level: 'A1', category: 'general' },

  // ═══════════════════════════════════════════
  // A2 - General (daily routines, shopping, weather, directions)
  // ═══════════════════════════════════════════
  { word: 'breakfast', definition: 'The first meal of the day, usually eaten in the morning', example: 'I always have breakfast at 7 AM.', pronunciation: '/ˈbrekfəst/', level: 'A2', category: 'general' },
  { word: 'commute', definition: 'To travel regularly between home and work', example: 'I commute to work by train every day.', pronunciation: '/kəˈmjuːt/', level: 'A2', category: 'general' },
  { word: 'weather', definition: 'The condition of the atmosphere at a particular time', example: 'The weather is sunny and warm today.', pronunciation: '/ˈweðər/', level: 'A2', category: 'general' },
  { word: 'shopping', definition: 'The activity of buying goods from stores', example: 'I went shopping for new clothes yesterday.', pronunciation: '/ˈʃɑːpɪŋ/', level: 'A2', category: 'general' },
  { word: 'direction', definition: 'The way that something is pointing or moving', example: 'Can you give me directions to the station?', pronunciation: '/dəˈrekʃən/', level: 'A2', category: 'general' },
  { word: 'neighbor', definition: 'A person who lives near you', example: 'Our neighbors are very friendly.', pronunciation: '/ˈneɪbər/', level: 'A2', category: 'general' },
  { word: 'recipe', definition: 'A set of instructions for preparing food', example: 'I found a great recipe for chocolate cake.', pronunciation: '/ˈresəpi/', level: 'A2', category: 'general' },
  { word: 'appointment', definition: 'An arrangement to meet someone at a particular time', example: 'I have a doctor\'s appointment at 3 PM.', pronunciation: '/əˈpɔɪntmənt/', level: 'A2', category: 'general' },
  { word: 'holiday', definition: 'A period of time when you do not work or study', example: 'We are going on holiday to Spain next month.', pronunciation: '/ˈhɑːlədeɪ/', level: 'A2', category: 'general' },
  { word: 'exercise', definition: 'Physical activity to stay healthy', example: 'I try to exercise for 30 minutes every day.', pronunciation: '/ˈeksərsaɪz/', level: 'A2', category: 'general' },
  { word: 'laundry', definition: 'Clothes that need to be washed or have been washed', example: 'I need to do the laundry this weekend.', pronunciation: '/ˈlɔːndri/', level: 'A2', category: 'general' },
  { word: 'temperature', definition: 'A measure of how hot or cold something is', example: 'The temperature outside is 25 degrees.', pronunciation: '/ˈtemprətʃər/', level: 'A2', category: 'general' },
  { word: 'umbrella', definition: 'A device used for protection against rain', example: 'Don\'t forget your umbrella — it might rain.', pronunciation: '/ʌmˈbrelə/', level: 'A2', category: 'general' },
  { word: 'grocery', definition: 'A store that sells food and household items', example: 'I need to stop at the grocery store on my way home.', pronunciation: '/ˈɡroʊsəri/', level: 'A2', category: 'general' },
  { word: 'furniture', definition: 'Large movable equipment such as tables and chairs', example: 'We bought new furniture for the living room.', pronunciation: '/ˈfɜːrnɪtʃər/', level: 'A2', category: 'general' },

  // ═══════════════════════════════════════════
  // B1 - General (work, hobbies, health, education)
  // ═══════════════════════════════════════════
  { word: 'career', definition: 'A profession or occupation pursued over a long period', example: 'She has had a successful career in medicine.', pronunciation: '/kəˈrɪr/', level: 'B1', category: 'general' },
  { word: 'hobby', definition: 'An activity done regularly for pleasure', example: 'Photography is my favorite hobby.', pronunciation: '/ˈhɑːbi/', level: 'B1', category: 'general' },
  { word: 'symptom', definition: 'A sign indicating a disease or condition', example: 'One symptom of the flu is a high fever.', pronunciation: '/ˈsɪmptəm/', level: 'B1', category: 'general' },
  { word: 'curriculum', definition: 'The subjects and content taught in a school or course', example: 'The school updated its curriculum this year.', pronunciation: '/kəˈrɪkjələm/', level: 'B1', category: 'general' },
  { word: 'deadline', definition: 'The latest time by which something must be completed', example: 'The deadline for the project is next Friday.', pronunciation: '/ˈdedlaɪn/', level: 'B1', category: 'general' },
  { word: 'invest', definition: 'To put money into something expecting a profit', example: 'She decided to invest in renewable energy.', pronunciation: '/ɪnˈvest/', level: 'B1', category: 'general' },
  { word: 'recommend', definition: 'To suggest something as good or suitable', example: 'I recommend trying the local cuisine.', pronunciation: '/ˌrekəˈmend/', level: 'B1', category: 'general' },
  { word: 'opportunity', definition: 'A favorable circumstance or chance', example: 'This internship is a great opportunity for students.', pronunciation: '/ˌɑːpərˈtuːnəti/', level: 'B1', category: 'general' },
  { word: 'improve', definition: 'To make something better', example: 'She wants to improve her English pronunciation.', pronunciation: '/ɪmˈpruːv/', level: 'B1', category: 'general' },
  { word: 'experience', definition: 'Knowledge or skill gained from doing something', example: 'He has five years of experience in web development.', pronunciation: '/ɪkˈspɪriəns/', level: 'B1', category: 'general' },
  { word: 'advantage', definition: 'A beneficial factor or condition', example: 'Knowing multiple languages is an advantage in business.', pronunciation: '/ədˈvæntɪdʒ/', level: 'B1', category: 'general' },
  { word: 'patient', definition: 'Able to wait calmly; also a person receiving medical care', example: 'You need to be patient when learning a new skill.', pronunciation: '/ˈpeɪʃənt/', level: 'B1', category: 'general' },
  { word: 'responsible', definition: 'Having an obligation to do something', example: 'She is responsible for managing the team.', pronunciation: '/rɪˈspɑːnsəbl/', level: 'B1', category: 'general' },
  { word: 'gradually', definition: 'Slowly, over a period of time', example: 'His English improved gradually over the year.', pronunciation: '/ˈɡrædʒuəli/', level: 'B1', category: 'general' },
  { word: 'determine', definition: 'To decide or find out exactly', example: 'The test will determine your English level.', pronunciation: '/dɪˈtɜːrmɪn/', level: 'B1', category: 'general' },

  // ═══════════════════════════════════════════
  // B2 - General (news, opinions, technology, environment)
  // ═══════════════════════════════════════════
  { word: 'perspective', definition: 'A particular way of viewing something', example: 'The article offers a fresh perspective on climate change.', pronunciation: '/pərˈspektɪv/', level: 'B2', category: 'general' },
  { word: 'sustainable', definition: 'Able to be maintained without depleting resources', example: 'We need to find sustainable solutions for energy.', pronunciation: '/səˈsteɪnəbl/', level: 'B2', category: 'general' },
  { word: 'algorithm', definition: 'A set of rules for solving a problem in computing', example: 'The search algorithm was updated to improve results.', pronunciation: '/ˈælɡərɪðəm/', level: 'B2', category: 'general' },
  { word: 'controversy', definition: 'Prolonged public disagreement or debate', example: 'The new policy has caused considerable controversy.', pronunciation: '/ˈkɑːntrəvɜːrsi/', level: 'B2', category: 'general' },
  { word: 'infrastructure', definition: 'The basic systems and structures needed for operation', example: 'The government invested in road infrastructure.', pronunciation: '/ˈɪnfrəstrʌktʃər/', level: 'B2', category: 'general' },
  { word: 'emission', definition: 'The release of gas or substance into the atmosphere', example: 'Carbon emissions must be reduced to fight climate change.', pronunciation: '/ɪˈmɪʃən/', level: 'B2', category: 'general' },
  { word: 'innovation', definition: 'A new idea, method, or invention', example: 'Technological innovation drives economic growth.', pronunciation: '/ˌɪnəˈveɪʃən/', level: 'B2', category: 'general' },
  { word: 'consequence', definition: 'A result or effect of an action', example: 'Every decision has consequences.', pronunciation: '/ˈkɑːnsəkwens/', level: 'B2', category: 'general' },
  { word: 'negotiate', definition: 'To discuss something to reach an agreement', example: 'The two companies are negotiating a merger.', pronunciation: '/nɪˈɡoʊʃieɪt/', level: 'B2', category: 'general' },
  { word: 'implement', definition: 'To put a plan or decision into effect', example: 'The school will implement the new policy next semester.', pronunciation: '/ˈɪmpləment/', level: 'B2', category: 'general' },
  { word: 'statistics', definition: 'The science of collecting and analyzing numerical data', example: 'Statistics show that unemployment is decreasing.', pronunciation: '/stəˈtɪstɪks/', level: 'B2', category: 'general' },
  { word: 'democracy', definition: 'A system of government by the whole population', example: 'Democracy requires an informed and engaged citizenry.', pronunciation: '/dɪˈmɑːkrəsi/', level: 'B2', category: 'general' },
  { word: 'biodiversity', definition: 'The variety of plant and animal life in an ecosystem', example: 'Loss of biodiversity threatens the planet\'s health.', pronunciation: '/ˌbaɪoʊdaɪˈvɜːrsəti/', level: 'B2', category: 'general' },
  { word: 'hypothesis', definition: 'A proposed explanation based on limited evidence', example: 'The scientist tested her hypothesis through experiments.', pronunciation: '/haɪˈpɑːθəsɪs/', level: 'B2', category: 'general' },
  { word: 'inevitable', definition: 'Certain to happen; unavoidable', example: 'Change is inevitable in any growing organization.', pronunciation: '/ɪnˈevɪtəbl/', level: 'B2', category: 'general' },

  // ═══════════════════════════════════════════
  // C1 - General (academic, abstract concepts, nuanced vocabulary)
  // ═══════════════════════════════════════════
  { word: 'pragmatic', definition: 'Dealing with things sensibly and realistically', example: 'We need a pragmatic approach to solve this crisis.', pronunciation: '/præɡˈmætɪk/', level: 'C1', category: 'general' },
  { word: 'ubiquitous', definition: 'Present, appearing, or found everywhere', example: 'Smartphones have become ubiquitous in modern society.', pronunciation: '/juːˈbɪkwɪtəs/', level: 'C1', category: 'general' },
  { word: 'juxtapose', definition: 'To place side by side for comparison or contrast', example: 'The artist juxtaposes light and dark to create tension.', pronunciation: '/ˌdʒʌkstəˈpoʊz/', level: 'C1', category: 'general' },
  { word: 'paradigm', definition: 'A typical example, pattern, or model', example: 'The discovery created a paradigm shift in physics.', pronunciation: '/ˈpærədaɪm/', level: 'C1', category: 'general' },
  { word: 'ephemeral', definition: 'Lasting for a very short time', example: 'The beauty of cherry blossoms is ephemeral.', pronunciation: '/ɪˈfemərəl/', level: 'C1', category: 'general' },
  { word: 'ostensibly', definition: 'Apparently or seemingly, but perhaps not actually', example: 'He was ostensibly on a business trip, but he was really on vacation.', pronunciation: '/ɑːˈstensəbli/', level: 'C1', category: 'general' },
  { word: 'meticulous', definition: 'Showing great attention to detail; very careful', example: 'The editor was meticulous in checking every reference.', pronunciation: '/məˈtɪkjələs/', level: 'C1', category: 'general' },
  { word: 'ameliorate', definition: 'To make something bad or unsatisfactory better', example: 'The new policy aims to ameliorate working conditions.', pronunciation: '/əˈmiːliəreɪt/', level: 'C1', category: 'general' },
  { word: 'conundrum', definition: 'A confusing and difficult problem or question', example: 'The ethical conundrum left the committee divided.', pronunciation: '/kəˈnʌndrəm/', level: 'C1', category: 'general' },
  { word: 'disseminate', definition: 'To spread information widely', example: 'The organization disseminates research findings to the public.', pronunciation: '/dɪˈseməneɪt/', level: 'C1', category: 'general' },
  { word: 'nuance', definition: 'A subtle difference in meaning or expression', example: 'Understanding cultural nuances is essential for translators.', pronunciation: '/ˈnuːɑːns/', level: 'C1', category: 'general' },
  { word: 'rhetoric', definition: 'The art of effective or persuasive speaking', example: 'His rhetoric captivated the audience.', pronunciation: '/ˈretərɪk/', level: 'C1', category: 'general' },
  { word: 'inadvertent', definition: 'Not resulting from a deliberate action; unintentional', example: 'The data breach was caused by inadvertent misconfiguration.', pronunciation: '/ˌɪnədˈvɜːrtənt/', level: 'C1', category: 'general' },
  { word: 'proliferate', definition: 'To increase rapidly in number', example: 'Online courses have proliferated since the pandemic.', pronunciation: '/prəˈlɪfəreɪt/', level: 'C1', category: 'general' },
  { word: 'ambivalent', definition: 'Having mixed feelings about something', example: 'She felt ambivalent about moving to a new city.', pronunciation: '/æmˈbɪvələnt/', level: 'C1', category: 'general' },

  // ═══════════════════════════════════════════
  // C2 - General (sophisticated, literary, specialized vocabulary)
  // ═══════════════════════════════════════════
  { word: 'sesquipedalian', definition: 'Characterized by long words; long-winded', example: 'His sesquipedalian prose impressed the literary critics.', pronunciation: '/ˌseskwɪpəˈdeɪliən/', level: 'C2', category: 'general' },
  { word: 'verisimilitude', definition: 'The appearance of being true or real', example: 'The novel achieves verisimilitude through meticulous historical detail.', pronunciation: '/ˌverɪsɪˈmɪlɪtuːd/', level: 'C2', category: 'general' },
  { word: 'perspicacious', definition: 'Having a ready insight into and understanding of things', example: 'A perspicacious investor spotted the trend early.', pronunciation: '/ˌpɜːrspɪˈkeɪʃəs/', level: 'C2', category: 'general' },
  { word: 'obfuscate', definition: 'To make something unclear or difficult to understand', example: 'Politicians sometimes obfuscate the truth with complex language.', pronunciation: '/ˈɑːbfʌskeɪt/', level: 'C2', category: 'general' },
  { word: 'lacuna', definition: 'A gap or missing part, especially in a text or manuscript', example: 'There is a lacuna in the historical record for that period.', pronunciation: '/ləˈkjuːnə/', level: 'C2', category: 'general' },
  { word: 'recalcitrant', definition: 'Having an obstinately uncooperative attitude', example: 'The recalcitrant student refused to follow the rules.', pronunciation: '/rɪˈkælsɪtrənt/', level: 'C2', category: 'general' },
  { word: 'quintessential', definition: 'Representing the most perfect example of a quality', example: 'She is the quintessential English teacher — passionate and dedicated.', pronunciation: '/ˌkwɪntɪˈsenʃəl/', level: 'C2', category: 'general' },
  { word: 'ineffable', definition: 'Too great or extreme to be expressed in words', example: 'The beauty of the sunset was ineffable.', pronunciation: '/ɪnˈefəbl/', level: 'C2', category: 'general' },
  { word: 'esoteric', definition: 'Intended for or understood by only a small group', example: 'The philosopher\'s esoteric writings baffled most readers.', pronunciation: '/ˌesəˈterɪk/', level: 'C2', category: 'general' },
  { word: 'perfunctory', definition: 'Carried out with minimum effort or reflection', example: 'He gave a perfunctory nod before returning to his work.', pronunciation: '/pərˈfʌŋktəri/', level: 'C2', category: 'general' },
  { word: 'aberration', definition: 'A departure from what is normal or expected', example: 'The warm winter was an aberration from typical weather patterns.', pronunciation: '/ˌæbəˈreɪʃən/', level: 'C2', category: 'general' },
  { word: 'magnanimous', definition: 'Very generous or forgiving', example: 'She was magnanimous in victory, praising her opponent.', pronunciation: '/mæɡˈnænɪməs/', level: 'C2', category: 'general' },
  { word: 'pulchritude', definition: 'Beauty; physical attractiveness', example: 'The pulchritude of the ancient temple left visitors speechless.', pronunciation: '/ˈpʌlkrɪtuːd/', level: 'C2', category: 'general' },
  { word: 'supercilious', definition: 'Behaving as though one is superior to others', example: 'His supercilious attitude alienated his colleagues.', pronunciation: '/ˌsuːpərˈsɪliəs/', level: 'C2', category: 'general' },
  { word: 'legerdemain', definition: 'Sleight of hand; skillful deception', example: 'The accountant\'s financial legerdemain fooled the auditors.', pronunciation: '/ˌledʒərdəˈmeɪn/', level: 'C2', category: 'general' },

  // ═══════════════════════════════════════════
  // Business (10 words)
  // ═══════════════════════════════════════════
  { word: 'revenue', definition: 'The income generated from business operations', example: 'The company\'s revenue increased by 20% this quarter.', pronunciation: '/ˈrevənuː/', level: 'B1', category: 'business' },
  { word: 'stakeholder', definition: 'A person with an interest or concern in a business', example: 'All stakeholders were invited to the annual meeting.', pronunciation: '/ˈsteɪkhoʊldər/', level: 'B2', category: 'business' },
  { word: 'diversify', definition: 'To expand a business into new areas or markets', example: 'The company decided to diversify into renewable energy.', pronunciation: '/daɪˈvɜːrsɪfaɪ/', level: 'B2', category: 'business' },
  { word: 'leverage', definition: 'To use something to maximum advantage', example: 'We should leverage our expertise to win the contract.', pronunciation: '/ˈlevərɪdʒ/', level: 'B2', category: 'business' },
  { word: 'quarterly', definition: 'Occurring every three months', example: 'The quarterly report shows strong growth.', pronunciation: '/ˈkwɔːrtərli/', level: 'B1', category: 'business' },
  { word: 'acquisition', definition: 'The purchase of one company by another', example: 'The acquisition was valued at $5 billion.', pronunciation: '/ˌækwɪˈzɪʃən/', level: 'C1', category: 'business' },
  { word: 'benchmark', definition: 'A standard against which things can be compared', example: 'This report sets a new benchmark for the industry.', pronunciation: '/ˈbentʃmɑːrk/', level: 'B2', category: 'business' },
  { word: 'synergy', definition: 'Combined effort producing greater results than individual efforts', example: 'The merger will create synergy between the two departments.', pronunciation: '/ˈsɪnərdʒi/', level: 'C1', category: 'business' },
  { word: 'procurement', definition: 'The process of obtaining goods or services', example: 'The procurement department handles all vendor contracts.', pronunciation: '/prəˈkjʊrmənt/', level: 'C1', category: 'business' },
  { word: 'depreciation', definition: 'A decrease in value over time', example: 'The depreciation of equipment is factored into the budget.', pronunciation: '/dɪˌpriːʃiˈeɪʃən/', level: 'C1', category: 'business' },

  // ═══════════════════════════════════════════
  // Travel (10 words)
  // ═══════════════════════════════════════════
  { word: 'itinerary', definition: 'A planned route or journey', example: 'Our travel agent prepared a detailed itinerary for the trip.', pronunciation: '/aɪˈtɪnəreri/', level: 'B1', category: 'travel' },
  { word: 'destination', definition: 'The place to which someone is traveling', example: 'Paris is a popular tourist destination.', pronunciation: '/ˌdestɪˈneɪʃən/', level: 'A2', category: 'travel' },
  { word: 'excursion', definition: 'A short trip or outing for pleasure', example: 'We took an excursion to the nearby island.', pronunciation: '/ɪkˈskɜːrʒən/', level: 'B1', category: 'travel' },
  { word: 'accommodation', definition: 'A place to live or stay', example: 'We booked accommodation near the beach.', pronunciation: '/əˌkɑːməˈdeɪʃən/', level: 'B1', category: 'travel' },
  { word: 'customs', definition: 'The place at a border where officials check goods', example: 'We had to go through customs at the airport.', pronunciation: '/ˈkʌstəmz/', level: 'B1', category: 'travel' },
  { word: 'souvenir', definition: 'A memento kept as a reminder of a place', example: 'I bought a small souvenir from the museum gift shop.', pronunciation: '/ˌsuːvəˈnɪr/', level: 'A2', category: 'travel' },
  { word: 'boarding', definition: 'The process of getting on a plane or ship', example: 'Boarding begins 30 minutes before departure.', pronunciation: '/ˈbɔːrdɪŋ/', level: 'B1', category: 'travel' },
  { word: 'layover', definition: 'A short stay between parts of a journey', example: 'We have a three-hour layover in Dubai.', pronunciation: '/ˈleɪoʊvər/', level: 'B2', category: 'travel' },
  { word: 'embark', definition: 'To board a ship or aircraft', example: 'We will embark on the cruise at sunset.', pronunciation: '/ɪmˈbɑːrk/', level: 'B2', category: 'travel' },
  { word: 'expedition', definition: 'A journey undertaken for a specific purpose', example: 'The scientific expedition explored the Amazon rainforest.', pronunciation: '/ˌekspəˈdɪʃən/', level: 'B2', category: 'travel' },

  // ═══════════════════════════════════════════
  // Idioms (10 words)
  // ═══════════════════════════════════════════
  { word: 'break the ice', definition: 'To initiate conversation in an awkward social situation', example: 'He told a joke to break the ice at the party.', pronunciation: '/breɪk ðə aɪs/', level: 'B1', category: 'idioms' },
  { word: 'hit the nail on the head', definition: 'To describe exactly what is causing a problem', example: 'You hit the nail on the head with that analysis.', pronunciation: '', level: 'B2', category: 'idioms' },
  { word: 'burn the midnight oil', definition: 'To work late into the night', example: 'She burned the midnight oil to finish the report.', pronunciation: '', level: 'B2', category: 'idioms' },
  { word: 'a blessing in disguise', definition: 'Something that seems bad but turns out to be good', example: 'Losing that job was a blessing in disguise — she found a better one.', pronunciation: '', level: 'B1', category: 'idioms' },
  { word: 'the ball is in your court', definition: 'It is your turn to make a decision or take action', example: 'I\'ve made my offer — the ball is in your court now.', pronunciation: '', level: 'B2', category: 'idioms' },
  { word: 'cost an arm and a leg', definition: 'To be extremely expensive', example: 'That luxury car must have cost an arm and a leg.', pronunciation: '', level: 'B1', category: 'idioms' },
  { word: 'piece of cake', definition: 'Something very easy to do', example: 'The exam was a piece of cake — I finished in 20 minutes.', pronunciation: '', level: 'A2', category: 'idioms' },
  { word: 'under the weather', definition: 'Feeling ill or unwell', example: 'I\'m feeling a bit under the weather today.', pronunciation: '', level: 'B1', category: 'idioms' },
  { word: 'once in a blue moon', definition: 'Very rarely', example: 'She visits her hometown once in a blue moon.', pronunciation: '', level: 'B2', category: 'idioms' },
  { word: 'spill the beans', definition: 'To reveal secret information', example: 'Don\'t spill the beans about the surprise party!', pronunciation: '', level: 'B1', category: 'idioms' },

  // ═══════════════════════════════════════════
  // Phrasal Verbs (10 words)
  // ═══════════════════════════════════════════
  { word: 'look forward to', definition: 'To feel excited about something that will happen', example: 'I look forward to meeting you next week.', pronunciation: '', level: 'A2', category: 'phrasal_verbs' },
  { word: 'give up', definition: 'To stop trying or quit doing something', example: 'Don\'t give up — you\'re almost there!', pronunciation: '', level: 'A2', category: 'phrasal_verbs' },
  { word: 'carry out', definition: 'To perform or complete a task', example: 'The team carried out the research successfully.', pronunciation: '', level: 'B1', category: 'phrasal_verbs' },
  { word: 'bring up', definition: 'To mention or introduce a topic', example: 'She brought up an important issue during the meeting.', pronunciation: '', level: 'B1', category: 'phrasal_verbs' },
  { word: 'come across', definition: 'To find or encounter by chance', example: 'I came across an interesting article yesterday.', pronunciation: '', level: 'B1', category: 'phrasal_verbs' },
  { word: 'figure out', definition: 'To understand or solve something', example: 'I finally figured out how to use the new software.', pronunciation: '', level: 'B1', category: 'phrasal_verbs' },
  { word: 'put off', definition: 'To delay or postpone something', example: 'Don\'t put off until tomorrow what you can do today.', pronunciation: '', level: 'B1', category: 'phrasal_verbs' },
  { word: 'run into', definition: 'To meet someone unexpectedly', example: 'I ran into my old friend at the supermarket.', pronunciation: '', level: 'B1', category: 'phrasal_verbs' },
  { word: 'take over', definition: 'To assume control of something', example: 'She will take over as manager next month.', pronunciation: '', level: 'B2', category: 'phrasal_verbs' },
  { word: 'iron out', definition: 'To resolve difficulties or disagreements', example: 'We need to iron out the details before signing the contract.', pronunciation: '', level: 'B2', category: 'phrasal_verbs' },

  // ═══════════════════════════════════════════
  // Academic (10 words)
  // ═══════════════════════════════════════════
  { word: 'empirical', definition: 'Based on observation or experiment rather than theory', example: 'The study provides empirical evidence for the theory.', pronunciation: '/ɪmˈpɪrɪkəl/', level: 'B2', category: 'academic' },
  { word: 'methodology', definition: 'A system of methods used in a particular area', example: 'The research methodology was clearly outlined in the paper.', pronunciation: '/ˌmeθəˈdɑːlədʒi/', level: 'B2', category: 'academic' },
  { word: 'qualitative', definition: 'Relating to qualities or characteristics rather than quantities', example: 'The study used qualitative interviews to gather data.', pronunciation: '/ˈkwɑːlɪteɪtɪv/', level: 'C1', category: 'academic' },
  { word: 'quantitative', definition: 'Relating to measurable quantities rather than qualities', example: 'Quantitative analysis showed a significant correlation.', pronunciation: '/ˈkwɑːntɪteɪtɪv/', level: 'C1', category: 'academic' },
  { word: 'citation', definition: 'A reference to a published or unpublished source', example: 'Proper citation is essential in academic writing.', pronunciation: '/saɪˈteɪʃən/', level: 'B2', category: 'academic' },
  { word: 'peer review', definition: 'Evaluation of work by others in the same field', example: 'The paper underwent rigorous peer review before publication.', pronunciation: '', level: 'C1', category: 'academic' },
  { word: 'thesis', definition: 'A long essay or dissertation involving personal research', example: 'She defended her thesis on renewable energy policy.', pronunciation: '/ˈθiːsɪs/', level: 'C1', category: 'academic' },
  { word: 'corroborate', definition: 'To confirm or support a statement with evidence', example: 'The witness corroborated the defendant\'s testimony.', pronunciation: '/kəˈrɑːbəreɪt/', level: 'C1', category: 'academic' },
  { word: 'anomaly', definition: 'Something that deviates from what is standard or expected', example: 'The researchers noted an anomaly in the data.', pronunciation: '/əˈnɑːməli/', level: 'C1', category: 'academic' },
  { word: 'pedagogy', definition: 'The method and practice of teaching', example: 'Modern pedagogy emphasizes student-centered learning.', pronunciation: '/ˈpedəɡɑːdʒi/', level: 'C1', category: 'academic' },
];

export async function POST(request: NextRequest) {
  // Block in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seed endpoints disabled in production' }, { status: 403 });
  }

  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let created = 0;
    let skipped = 0;

    for (const item of VOCAB_DATA) {
      const existing = await db.vocabWord.findFirst({
        where: {
          word: item.word,
          level: item.level,
          category: item.category,
        },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await db.vocabWord.create({
        data: {
          word: item.word,
          definition: item.definition,
          example: item.example,
          pronunciation: item.pronunciation || null,
          level: item.level,
          category: item.category,
        },
      });
      created++;
    }

    return NextResponse.json({
      success: true,
      message: `Vocabulary seeding complete. Created: ${created}, Skipped (already exist): ${skipped}`,
      created,
      skipped,
      total: created + skipped,
    });
  } catch (error) {
    console.error('Vocab seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed vocabulary data.' },
      { status: 500 }
    );
  }
}
