// textbookContent.ts
// Official Global Success Textbook Data (Dialogues & Reading Passages) for Grade 6-9
// Used to generate authentic reading comprehension and listening questions

export interface UnitTextbookData {
  dialogue: string;
  readingPassage: string;
}

export const TEXTBOOK_CONTENT: Record<number, Record<number, UnitTextbookData>> = {
  6: {
    1: {
      dialogue: `Phong: Hi, Vy.
Vy: Hi, Phong. Are you ready?
Phong: Just a minute.
Vy: Oh, this is Duy, my new friend.
Phong: Hi, Duy. Nice to meet you.
Duy: Hi, Phong. I live near here, and we go to the same school!
Phong: Good. Hmm, your school bag looks heavy.
Duy: Yes! I have new books, and we have new subjects to study.
Phong: And a new uniform, Duy! You look smart!
Duy: Thanks, Phong. We always look smart in our uniforms.
Phong: Let me put on my uniform. Then we can go.`,
      readingPassage: `Sunrise is a boarding school in Sydney. Students study and live there. About 1,200 boys and girls go to Sunrise. It has students from all over Australia. They study subjects like maths, science and English.
An Son is a lower secondary school in Bac Giang. It has only 8 classes. There are mountains and green fields around the school. There is a computer room and a library. There is also a school garden and a playground.
Dream is an international school. Here students learn English with English-speaking teachers. In the afternoon, they join many interesting clubs. They play sports and games. Some students do paintings in the art club.`
    },
    2: {
      dialogue: `Mi: Wow! Your room looks so big, Nick.
Nick: It's Elena's room. She's my sister.
Mi: I see. Is there a TV behind you?
Nick: Yes, there is. Where do you live, Mi?
Mi: I live in a town house. And you?
Nick: I live in a country house. Who do you live with?
Mi: My parents and younger brother. We're moving to a flat next month!
Nick: Are you?
Mi: Yes. My aunt lives near there, and I can play with my cousin.
Nick: Are there many rooms in your new flat?
Mi: Yes, there are. There's a living room, three bedrooms, a kitchen and two bathrooms.`,
      readingPassage: `A room at the Crazy House Hotel, Da Lat.
Hi Phong and Mi,
How are you? I'm in Da Lat with my parents. We're staying at the Crazy House Hotel. Wow! It really is crazy. There are ten rooms in the hotel. There's a Kangaroo Room, an Eagle Room, and even an Ant Room. I'm staying in the Tiger Room because there's a big tiger on the wall. The tiger is between the bathroom door and the window. The bed is next to the window, but the window is a strange shape. I put my bag under the bed. There's a lamp, a wardrobe and a desk. You should stay here when you visit Da Lat. It's great. See you soon! Nick`
    },
    3: {
      dialogue: `Phong: That was a great idea, Nam. I love picnics!
Nam: Please pass me the biscuits.
Phong: Sure. Here you are.
Nam: Thanks. What are you reading, Phong?
Phong: 4Teen. It's my favourite magazine!
Nam: Look! It's Mai. And she is with someone.
Phong: Oh, who's that? She has glasses and long black hair.
Nam: I don't know. They're coming over.
Mai: Hi there. This is my friend Chau.
Phong & Nam: Hi, Chau. Nice to meet you.
Chau: Nice to meet you, too.
Nam: Would you like to sit down? We have lots of food.
Mai: Oh, sorry, we can't. We're going to the bookshop.
Chau: Bye for now.
Phong & Nam: Bye bye.`,
      readingPassage: `The Superb Summer Camp is a perfect present for kids aged between 10 and 15. The camp is in Ba Vi Mountains, from 16 to 18 June. Here, kids can participate in games, sports, creativity activities, and arts and music. All in English!
Dear Mum and Dad,
Here I am at the Superb Summer Camp. Mr Black asked us to write emails in English! Wow, everything here is in English! I have some new friends: Jimmy, Phong, and Nhung. They're in the photo. Jimmy has blonde hair and blue eyes. He's clever and creative. He likes taking photos. Phong is the tall boy. He's sporty and plays basketball very well. Nhung has curly black hair. She's kind. She shared her lunch with me today.
We're having fun. Jimmy's taking photos of me. Phong's reading a comic book, and Nhung's playing the violin. I must go now. Please write soon. Love, Nam.`
    },
    4: {
      dialogue: `Phong: Wow! We're in Hoi An. I'm so excited.
Nick: Me too. It's so beautiful. Where shall we go first?
Khang: Let's go to Chua Cau.
Phong: Well, but Tan Ky House is nearer. Shall we go there first?
Nick & Khang: OK, sure.
Phong: First, cross the road, and then turn left.
Nick: Fine, let's go.
Phong: Wait.
Khang: What's up, Phong?
Phong: I think we're lost.
Nick: Look, there's a girl. Let's ask her.
Phong: Excuse me? Can you tell us the way to Tan Ky House?
Girl: Sure. Go straight. Take the second turning on the left, and then turn right.
Phong, Nick & Khang: Thank you.`,
      readingPassage: `My Neighbourhood.
I live in the suburbs of Da Nang City. There are many things I like about my neighbourhood. It's great for outdoor activities because it has beautiful parks, sandy beaches and fine weather. There's almost everything I need here: shops, restaurants, and markets. The people here are friendlier than in other places.
However, there are two things I dislike about it: there are many modern buildings and offices; and the streets are busy and crowded.`
    },
    5: {
      dialogue: `Alice: Hello, welcome to our Geography Club.
(Knock at door)
Alice: Come in, Elena. We're just starting now. But remember you must always be on time.
Elena: Sure. Sorry.
Alice: Today I'm going to talk about some natural wonders of Viet Nam.
Nick: Great! What's that in the first picture?
Alice: It's Ganh Da Dia in Phu Yen.
Elena: Wow. It looks amazing!
Nick: Is picture 2 Ha Long Bay?
Alice: Right. What do you know about it?
Nick: It has many islands.
Alice: Yeah! The scenery is wonderful. This picture shows Tuan Chau, a large island.
Tommy: How about picture 3?`,
      readingPassage: `Ha Long Bay is in Quang Ninh. It has many islands and caves. Tuan Chau, with its beautiful beaches, is a popular tourist attraction in Ha Long Bay. There you can enjoy great seafood. And you can join in exciting activities. Ha Long Bay is Viet Nam's best natural wonder.
Mui Ne is popular for its amazing landscapes. The sand has different colours: white, yellow, red... It's like a desert here. You can ride a bike down the slopes. You can also fly kites, or have a picnic by the beach. The best time to visit the Mui Ne Sand Dunes is early morning or late afternoon. Remember to wear suncream and bring water.`
    },
    6: {
      dialogue: `Linda: Phong, does Viet Nam celebrate New Years?
Phong: Yes, we do. We have Tet.
Linda: When is Tet?
Phong: At different times. This year, it's in January.
Linda: What do you do at Tet?
Phong: We clean our homes and decorate them with flowers.
Linda: Is Tet a time for family gatherings?
Phong: Yes. It's a happy time for everybody.
Linda: Great.
Phong: Yes, and another good thing about Tet is that children get lucky money.
Linda: That sounds interesting. Is there anything special people should do?
Phong: We should say "Happy New Year" when we meet people, and we shouldn't break anything.`,
      readingPassage: `New Year Practices in the World:
In Japan, temples ring their bells 108 times at midnight on December 31. By doing so, people believe the bad things of the past year will leave.
In Spain, people try to put 12 grapes in their mouth at midnight for good luck.
In Switzerland, they drop ice cream on the floor to celebrate the New Year.
In Romania, they throw coins into a river for good luck.
In Thailand, they throw water on other people to wash away bad luck.`
    },
    7: {
      dialogue: `Phong: What's on today, Hung?
Hung: Let's see. VTV7 has a science programme at 2 p.m. And VTV3 has a music talent show for children at 7 p.m.
Phong: How about cartoons?
Hung: VTV1 has "The Lion King" at 8 p.m. It's my favourite cartoon.
Phong: I like it too. But my little brother prefers game shows. He likes "Are You Smarter Than a 5th Grader?"
Hung: VTV3 has that at 8:30 p.m.
Phong: Oh, we can watch both!`,
      readingPassage: `Television is a popular media. It brings many interesting programmes for education and entertainment.
VTV7 is an educational channel for students. It has science, history, and language programmes to help students learn at home. VTV3 is an entertainment channel with music shows, game shows, and comedies. Many people watch television for news, sports, and movies. However, children shouldn't watch too much TV because it is bad for their eyes.`
    },
    8: {
      dialogue: `Duong: Hi, Mai. Where are you going?
Mai: Hi, Duong. I'm going to the gym. I want to keep fit.
Duong: That's great. What sports do you play?
Mai: I play badminton and table tennis. How about you?
Duong: I play football and go swimming. I also like skateboarding.
Mai: Wow, you are so sporty! Do you practice every day?
Duong: Yes, I do gymnastics in the morning and play football in the afternoon.`,
      readingPassage: `Pelé is regarded as the best football player of all time. He was born in Brazil in 1940. He started playing football at a young age. He won three World Cups with Brazil: in 1958, 1962, and 1970. He scored more than 1,200 goals in his career. He is a global sports hero and a symbol of football.`
    },
    9: {
      dialogue: `Mai: What city is in the picture, Nam?
Nam: It's London. It's the capital of the UK.
Mai: Wow, it looks historic! What is that clock tower?
Nam: It's Big Ben. It's a famous landmark of London.
Mai: And what is the bridge over the river?
Nam: It's Tower Bridge. It is over the River Thames.
Mai: Is London often rainy?
Nam: Yes, it is. The weather is cool and rainy. Oxford Street is a great place for shopping in London.`,
      readingPassage: `Stockholm is the capital of Sweden. It is a beautiful city built on 14 islands. It has many parks, historic buildings, and museums. The air in Stockholm is very clean because there is little pollution. People like cycling and walking around the city.
Tokyo is the capital of Japan. It is a modern and busy city. It has millions of people, tall skyscrapers, and high-tech transport. Tokyo is famous for its clean streets and delicious food.`
    },
    10: {
      dialogue: `Trang: What are you drawing, Nick?
Nick: I'm drawing my future house.
Trang: Wow! Where will it be?
Nick: It will be on the Moon.
Trang: On the Moon? That's exciting! What will it look like?
Nick: It will be a large villa with smart appliances.
Trang: Will you have a robot?
Nick: Yes, I will. The robot will do all the housework, cook meals, and guard the house.
Trang: And how will you get electricity?
Nick: I'll use solar panels to get solar energy.`,
      readingPassage: `My dream house will be located on the ocean. It will be a smart house with seven rooms. It will use solar energy for electricity. Inside the house, I will have a hi-tech robot. The robot will help me clean the floors, wash clothes, and cook delicious meals. I'll also have a wireless TV to contact my friends on other planets.`
    },
    11: {
      dialogue: `Mi: Let's go green, Nam!
Nam: What does that mean, Mi?
Mi: It means we should protect our environment by reducing, reusing, and recycling.
Nam: Ah, the 3Rs! How can we do that?
Mi: First, we should reduce plastic bag usage by using reusable bags.
Nam: Second, we can reuse plastic bottles to grow plants.
Mi: Finally, we should recycle paper, glass, and cans.
Nam: That's a great idea. Let's start today!`,
      readingPassage: `Our Earth is in trouble because of pollution. To protect the environment, we should follow the 3Rs: Reduce, Reuse, and Recycle.
First, we should reduce the amount of waste we produce. We can turn off lights when leaving rooms and use reusable bags. Second, we can reuse things like old bottles, jars, and bags instead of throwing them away. Finally, we should recycle materials like paper, plastic, and metal to make new products. If we all do these actions, we will save our green planet.`
    },
    12: {
      dialogue: `Nick: Hi, Phong. What are you doing at the robot show?
Phong: Hi, Nick. I'm looking at the humanoid robots.
Nick: Humanoid robots? What can they do?
Phong: They can walk, talk, and recognise human voices.
Nick: Can they do housework?
Phong: Yes, they can. In the future, robots will be able to do laundry, cook meals, and garden.
Nick: Will they be able to teach students?
Phong: Yes, robot teachers will be able to teach English, maths, and science.`,
      readingPassage: `Robots will play an important role in our future lives.
There will be home robots to help us with chores like laundry, cleaning, and gardening. Teaching robots will assist teachers in classrooms and teach students various subjects. Humanoid robots will work in space stations and dangerous places like mines or rescue zones. Robots will make our lives easier, but they won't be able to replace human emotions.`
    }
  },
  7: {
    1: {
      dialogue: `Trang: What is your hobby, Mi?
Mi: I love arranging flowers. I started it two years ago.
Trang: Really? Who taught you?
Mi: My mother. She is very good at it.
Trang: Is it difficult?
Mi: No, it isn't. It just needs some creativity and patience.
Trang: My hobby is making models. I usually make paper models of cars and planes.
Mi: Wow, that sounds interesting!`,
      readingPassage: `Hobbies are activities we do in our free time for fun and relaxation.
Some people like outdoor hobbies like horse riding, gardening, or playing sports. Others prefer indoor hobbies such as carving wood, arranging flowers, or building dollhouses. Hobbies help us reduce stress, learn new skills, and make new friends. For example, playing chess improves concentration, while gardening keeps us active and healthy.`
    },
    2: {
      dialogue: `Doctor: Hello, Phong. What seems to be the problem?
Phong: Hello, Doctor. I have a sunburn and an allergy.
Doctor: I see. Did you go outside without a hat?
Phong: Yes, I did. I played football in the sun yesterday afternoon.
Doctor: That's why you got a sunburn. And your allergy is from the seafood you ate.
Phong: Yes, I ate some crabs.
Doctor: You should drink more water, avoid the sun, and take this medicine.
Phong: Thank you, Doctor.`,
      readingPassage: `Healthy living is very important to keep fit and active.
To live healthy, we should eat a balanced diet with lots of fruits and vegetables. We should avoid fast food and sugary drinks because they have too many calories. In addition, doing exercise daily is necessary. We can play sports, walk, or cycle to keep active. Sleeping for 8 hours a day also helps our body recover and stay fresh.`
    },
    3: {
      dialogue: `Minh: Hi, Lan. What did you do last weekend?
Lan: Hi, Minh. I did some volunteer work with my club.
Minh: Really? What did you do?
Lan: We visited a nursing home to tutor homeless children and clean up litter in the park.
Minh: That's wonderful!
Lan: Yes, we also donated books and warm clothes to children in poor areas.
Minh: I want to join your club next time.
Lan: Sure, we meet every Saturday.`,
      readingPassage: `Community service is work done by a person or a group of people to help others.
Many students participate in community service to help their local community. They tutor children who have difficulties in learning, clean up streets and public parks, and plant trees to protect the environment. They also donate money, food, and clothes to people in need, such as elderly people in nursing homes or homeless children. Community service makes our society better and teaches students valuable life lessons.`
    },
    4: {
      dialogue: `Nick: Hi, Duong. Did you go to the art gallery yesterday?
Duong: Yes, I did. I saw an amazing exhibition of portraits and paintings.
Nick: Who is the composer of the music they played there?
Duong: It was Trinh Cong Son. The melody was very beautiful.
Nick: I like his music too. Do you play any instrument?
Duong: Yes, I play the guitar. How about you?
Nick: I play the piano. I also like water puppetry, a traditional art in Viet Nam.`,
      readingPassage: `Music and arts bring colour and beauty to our lives.
Artists use their creativity to paint portraits, make sculptures, and perform traditional arts like puppetry or drama. Composers write beautiful melodies that tell stories and express feelings. Visiting an art gallery or attending a music concert helps us relax and appreciate creative talents. Art and music are different across cultures, but they connect people around the world.`
    },
    5: {
      dialogue: `Trang: Let's cook some Vietnamese food, Mum!
Mother: Sure. What do you want to make?
Trang: I want to make spring rolls and eel soup.
Mother: OK. We need some ingredients: pork, carrots, mushrooms, and turmeric.
Trang: Do we have green tea?
Mother: Yes, we have some in the kitchen.
Trang: How much broth do we need for the soup?
Mother: About two litres. And we need to squeeze some lemon juice at the end.`,
      readingPassage: `Vietnamese food is famous for its fresh ingredients and unique recipes.
Popular dishes include Pho, spring rolls, and banh mi. Pho is noodle soup served with beef or chicken broth, fresh herbs, and lime. Spring rolls are made by rolling pork, vegetables, and rice paper together and frying them. Many traditional dishes use turmeric, garlic, and ginger for a distinctive taste. Vietnamese drinks include green tea and iced coffee.`
    },
    6: {
      dialogue: `Nam: Have you ever visited the Temple of Literature, Elena?
Elena: No, I haven't. What is it, Nam?
Nam: It is a famous historic monument in Ha Noi. It was the Imperial Academy, Viet Nam's first university.
Elena: Wow! When was it built?
Elena: It was built in 1070. There are doctor's stone tablets erected on turtle back plaques to honour laureates.
Elena: That sounds fascinating! Let's visit it tomorrow.`,
      readingPassage: `The Temple of Literature (Van Mieu - Quoc Tu Giam) is one of the most famous tourist destinations in Ha Noi.
It was built in 1070 under Emperor Ly Thanh Tong to honour Confucius. In 1076, the Imperial Academy (Quoc Tu Giam) was established on its grounds as Viet Nam's first national university. The monument features beautiful pavilions, historic gates, and doctor's stone tablets. These tablets were erected on turtle statues to record the names of outstanding scholars who passed the royal exams.`
    },
    7: {
      dialogue: `Tom: How do you go to school, Lan?
Lan: I usually walk because my house is near the school. How about you?
Tom: I go by bus. The traffic jam is terrible in the morning.
Lan: Yes, there are too many vehicles. Pedestrians must obey road signs for safety.
Tom: Right. Everyone should wear a helmet when riding a motorbike.
Lan: And passengers on cars must wear seat belts.`,
      readingPassage: `Road safety is an important issue in many big cities.
Terrible traffic jams occur daily because of the high number of vehicles on the roads. To prevent accidents, pedestrians and drivers must obey traffic lights and road signs. Motorcyclists must wear helmets to protect their heads, and car drivers must wear seat belts. Pedestrians should use zebra crossings to cross the streets safely. Respecting traffic laws helps save lives.`
    },
    8: {
      dialogue: `Huy: What film did you watch last night, Phong?
Phong: I watched a sci-fi film about space travel. It was gripping!
Huy: Really? Who was starring in the film?
Phong: A famous actor from the US. The critics gave it positive reviews.
Huy: I prefer comedies because they are funny and relaxing. Horror films are too scary for me.
Phong: Although the sci-fi film was long, I enjoyed every minute of it.`,
      readingPassage: `Films are an important form of entertainment that tells stories through moving pictures.
There are various film genres: comedies, documentaries, sci-fi films, thrillers, and horror films. A gripping thriller keeps viewers excited, while a funny comedy makes people laugh. Star actors bring characters to life, and critics write reviews to share their opinions on new films. Although some movies have low budgets, they can still become global successes.`
    },
    9: {
      dialogue: `Linda: What is your favourite festival, Nam?
Nam: I like the Mid-Autumn Festival. We celebrate it in August or September.
Linda: What do you do during the festival?
Nam: We watch lion dance parades, carry colourful lanterns, and eat mooncakes.
Linda: That sounds fun! In my country, we have Thanksgiving.
Nam: What do you eat?
Linda: We have a big feast with roast turkey, pumpkin pie, and cranberry sauce.`,
      readingPassage: `Festivals around the world are special events to celebrate cultural traditions and harvest seasons.
In Viet Nam, Tet is the most important festival for family reunions. In the US, Thanksgiving is a harvest festival where families gather for a large feast with turkey and cranberry sauce. In Brazil, Carnival features colourful parades, lively music, and dancing in costumes. Festivals bring communities together and help preserve historical customs.`
    },
    10: {
      dialogue: `Tom: What are you reading, Mi?
Mi: I'm reading an article about renewable energy sources.
Tom: Renewable energy? Like solar energy and wind energy?
Mi: Yes, they are clean and will never run out.
Tom: How about coal and natural gas?
Mi: They are non-renewable energy sources. Burning them produces a lot of carbon dioxide, which harms our environment.
Tom: We should use more solar panels and wind turbines to save our planet.`,
      readingPassage: `Energy sources are classified into renewable and non-renewable energy.
Non-renewable sources include coal, oil, and natural gas. They are fossil fuels that release harmful greenhouse gases when burned, contributing to climate change. Renewable energy sources, such as solar power, wind power, and biogas, are clean and environmentally friendly. Installing solar panels and wind turbines helps reduce our carbon footprint and provides sustainable electricity for the future.`
    },
    11: {
      dialogue: `Nick: Do you think we will have flying cars in the future, Phong?
Phong: Yes, I think they will be very popular by 2050.
Nick: How will they fly?
Phong: They will fly in the sky and use solar energy to avoid pollution.
Nick: Will we have driverless cars?
Phong: Yes, they will use AI to drive automatically and prevent crashes.
Nick: That's amazing! How about hyperloops?
Phong: They will transport passengers in tubes at very high speeds.`,
      readingPassage: `Travelling in the future will be faster, safer, and more environmentally friendly.
Traditional petrol cars will be replaced by electric vehicles, solar-powered ships, and driverless cars. Flying cars will allow people to travel in the air, avoiding traffic jams on city streets. Hyperloops and skytrans will carry passengers in elevated tubes at speeds of over 1,000 kilometres per hour. These green technologies will reduce travel time and eliminate carbon emissions.`
    },
    12: {
      dialogue: `Alice: Why do you want to learn English, Huy?
Huy: Because English is an official language in many countries.
Alice: Yes, it is the mother tongue of millions of native speakers.
Huy: Learning English helps me talk to people from different countries.
Alice: And it is the language of international business and science.
Huy: I want to speak English fluently with a good pronunciation and accent.
Alice: Practice makes perfect, Huy!`,
      readingPassage: `English is a global language that connects people from different cultures and countries.
It is spoken as a first language by millions of native speakers in the UK, the US, Canada, Australia, and New Zealand. Additionally, English is an official or second language in many countries, making it the most widely taught foreign language in the world. Being bilingual in English opens up opportunities for international study, career development, and travel.`
    }
  },
  8: {
    1: {
      dialogue: `Tom: Hi, Trang. Surprised to see you. What brings you here?
Trang: Oh, hello Tom. I'm looking for a knitting kit.
Tom: A knitting kit? I didn't know you like knitting.
Trang: Actually, I'm keen on many DIY activities. In my leisure time, I love knitting, building dollhouses, and making paper flowers.
Tom: I see. So, you like spending time on your own.
Trang: Yeah. What do you do in your free time?
Tom: I'm a bit different. I usually hang out with my friends. We go to the cinema, go cycling, or play sport in the park.
Trang: You love spending free time with other people, don't you?
Tom: That's right. By the way, would you like to go to the cinema with me and Mark this Sunday? There's a new comedy at New World Cinema.
Trang: Yes, I'd love to. Can I ask Mai to join us?
Tom: Sure. Let's meet outside the cinema at 9 a.m.`,
      readingPassage: `Some teenagers enjoy spending free time with their friends. Others prefer doing leisure activities with their family members. I love spending time with my family because it's a great way to connect with them.
At the weekend, we usually go for a bike ride. We cycle to some nearby villages to enjoy the fresh air. We take photos and look at them later. My big brother and I are also into cooking. My brother looks for easy recipes. After that, we prepare the ingredients and cook. Sometimes the food is good, but sometimes it isn't; nevertheless, we love whatever we cook. The leisure activity I like the most is doing DIY projects with my mum. She teaches me to make my own dresses and doll clothes. On special occasions, we make special dresses together. Once I won the first prize in a costume contest at my school.`
    },
    2: {
      dialogue: `Nick: You look great with a tan, Mai!
Mai: Thank you. I've just come back from a very enjoyable summer holiday.
Nick: Really? Where did you stay?
Mai: I stayed at my uncle's house in a small village in Bac Giang Province.
Nick: What did you do there?
Mai: A lot of things. It was harvest time. The villagers were harvesting rice with a combine harvester. I helped them load the rice onto a truck. Then we unloaded the rice and dried it.
Nick: Sounds great!
Mai: And sometimes I went with the village children to herd the buffaloes and cows. I made friends with them on my first day.
Nick: Were they friendly?
Mai: Yes, they were. They took me to the paddy fields to fly kites. And in the evening, we played traditional games like bamboo dancing and dragon-snake.
Nick: Oh, I envy you!
Mai: Things move more slowly there than in our city, but people seem to have a healthier life.`,
      readingPassage: `I feel fortunate that I am living in a peaceful village in southern Viet Nam. The scenery here is beautiful and picturesque with vast fields stretching long distances. The houses are surrounded by green trees. There are lakes, ponds, and canals here and there. The air is fresh and cool.
Life here seems to move more slowly than in cities. The people work very hard. They grow vegetables, cultivate rice, and raise cattle. At harvest time, they use combine harvesters to harvest their crops. Many families live by growing fruit trees in the orchards. Others live by fishing in lakes, ponds, and canals.
Life in the village is very comfortable for children. They play traditional games. Sometimes they help their parents pick fruit and herd cattle.
People in my village know each other well. They are friendly and hospitable. They often meet each other in the evening, eating fruit, playing chess, singing folk songs, and chatting about everyday activities.`
    },
    3: {
      dialogue: `Teacher: It's great to see you again, class! What's going on?
Minh: We've decided to use Facebook for our class forum, and we joined some school club activities. We're also preparing for the midterm tests. It's really stressful.
Teacher: I'm sorry to hear that. I know exams may give you a lot of stress. But stay calm and work hard. What other pressure do you have?
Minh: Well, we also have pressure from our parents and friends.
Teacher: Do you? Let's discuss these problems in your new Facebook group. By the way, why did you choose Facebook?
Ann: Because it's user-friendly.
Teacher: Good! How about club activities? Do you find them enjoyable?
Ann: Yes. This year there are some new clubs like arts and crafts, and music. The club leaders will provide us with a variety of activities to suit different interests. And there will also be competitions as usual.
Teacher: Awesome! I hope you all can join the clubs you like.`,
      readingPassage: `Stress is a normal part of teens' life; however, too much stress can be dangerous. When you face stress, use some of these strategies to manage it.
Getting a good night's sleep: Teens need eight to ten hours of sleep a day, so get enough sleep. To make it easier, keep your smartphone away from your bed.
Doing exercise: Doing enough physical exercise is important for teens. You should exercise for at least 60 minutes a day.
Talking it out: Talk about your stress to an adult. This person can be your teacher, parent, or someone you trust.
Writing about it: You can reduce your stress by writing down your problems. You can also write about times you felt good and soon you will start to feel better.
Going outside: You will feel more relaxed if you spend some time in nature. Places with green trees and fresh air will make you feel better.`
    },
    4: {
      dialogue: `Tom: Hi, I'm Tom. You look new here.
Lai: I am. I'm Lai from Ha Giang.
Tom: Oh, I've heard about beautiful Ha Giang. Do you live in the mountains?
Lai: Yes, I do. I'm from the Tay ethnic group. We are the second largest ethnic group in Viet Nam, only after the Kinh.
Tom: Oh... I once saw a bamboo house on high posts in a travel brochure. Do you live in a home like that?
Lai: Yes, we call it a "stilt house". Our house overlooks terraced fields.
Tom: Awesome. What is life in your village like?
Lai: It's peaceful. There are 16 houses in my village. We live very close to nature.
Tom: I love it. Can you tell me something about your culture?
Lai: Certainly. We have our own culture. You can see it in our folk dances, musical instruments like the dan tinh, and our special five-colour sticky rice.
Tom: It sounds interesting. I hope to visit Ha Giang one day.`,
      readingPassage: `Stilt houses are popular among different ethnic minority groups, from the Thai in the Northern Highlands to the Khmer in the Mekong Delta. The houses come in different sizes and styles, and show the traditional culture of their owners.
Stilt houses are made from natural materials like wood, bamboo, and leaves. They stand on strong posts, about two or three metres above the ground. This allows them to keep people safe from wild animals. People climb a seven- or nine-step staircase to enter the house. The most important place in the house is the kitchen. It has an open fire in the middle of the house. It is the place for family gatherings and receiving guests.
The stilt houses of the Tay and Nung usually overlook a field. The stilt houses of the Thai, however, face mountains or a forest. The Bahnar and Ede have a communal house (called a Rong house) as the heart of their village. These communal houses are the largest and tallest ones in the village.`
    },
    5: {
      dialogue: `Elena: Wow, this girl looks so cute.
Trang: Yeah... She's my cousin. She's at Sa Dec Flower Village. Tet is coming soon, so many people visit flower villages to take pictures with the blooming flowers.
Elena: Oh, I'm fond of admiring the flowers. Does your family visit places like this too?
Trang: Yes, we do. We usually visit Nhat Tan Village to buy kumquat trees and peach blossoms.
Elena: I see flowers and ornamental trees everywhere these days. What are they for?
Trang: We, Vietnamese, use plants and flowers for decorations and for offerings. They are an important part of our Tet tradition.
Elena: And what's that tall tree in the photo?
Trang: Well, it's actually a bamboo pole. People place it in the yard of the communal house. They hang decorative items like small bells and lanterns on it. They want to chase away bad luck and pray for a lucky new year.
Elena: Interesting! I didn't know that.`,
      readingPassage: `A village festival day
I live in a small village in northern Viet Nam. Every year, people in my village look forward to the third day of Tet. It is one of our most important festival days.
In the morning, we gather along the riverside to watch some competitions. First, there is a special boat race. Some team members cook rice on the boat while others row the boat as fast as they can. The fastest team with well-cooked rice wins the race. Then, the referee releases a duck into the middle of the river. Contestants jump into the river to catch it. The atmosphere becomes loud with the sound of drums and cheers of festival goers.
At noon, there is a village party at the communal house for the elders. Each family also holds a home party. We cook traditional dishes like sticky rice and steamed chicken. Sometimes, we include food that children love, such as bun cha or even pizzas!
The village festival helps us maintain our traditions, connect with other people, and strengthen our family bonds.`
    },
    6: {
      dialogue: `Nam: Hello, Tom. How're things?
Tom: Oh good. I like it here. The lifestyle is interesting and different from that in my country.
Nam: Really?
Tom: Sure. Students here call their teachers by their title "teacher", not by their names.
Nam: Right. How do you greet your teachers?
Tom: We usually say "Hello" or "Good morning" then Mr, Mrs, or Miss and their surnames, for example "Good morning, Mr Smith."
Nam: Are there other differences?
Tom: People buy and sell a lot of street food here. In my country, people usually buy food in a store or a restaurant.
Nam: Yeah. Buying street food is a common practice in my city.
Tom: And I've noticed that many people have breakfast on the street too! In my country, we typically have a light breakfast at home.
Nam: I see. But here many adults are in the habit of having breakfast outside of their homes. If they're not in a hurry, they'll even have a leisurely coffee there.
Tom: That's fascinating!`,
      readingPassage: `If you go to the American state of Alaska, you might find the traditional lifestyle there interesting. Although Alaska is quite large, with nearly 1.7 million square kilometres, it has a small population of about 730,000.
The native peoples in Alaska still maintain many of their traditions. They keep their old ways of making arts and crafts alive. Various native groups have their own special styles of carving or weaving as well as their unique tribal dances and drumming. Therefore, visitors to Alaska may experience some of their culture in their villages. They may see performances of traditional music and native art in galleries and museums.
Alaska is also known for its unusual method of transport - the dogsled. Today, dog sledding (= mushing) is more of a sport than a true means of transport. The best-known race is the Iditarod Trail Sled Dog Race, a 1,510 km race from Anchorage to Nome. Mushers from all over the world come to Anchorage each March to compete for cash and prizes.`
    },
    7: {
      dialogue: `Club leader: Hello. Welcome back. Today we're discussing environmental problems and environmental protection. What are our serious environmental problems now?
Nam: Pollution and habitat loss, I think.
Ann: I agree. The air and water quality are getting worse and worse.
Club leader: Any others?
Ann: Yes, I can think of some like global warming, endangered species loss, ...
Nam: So what should we do to help protect our environment?
Club leader: We can reduce our carbon footprint even in our homes.
Ann: What do you mean by 'carbon footprint'?
Club leader: It's the amount of carbon dioxide we release into the environment.
Ann: I see. So we can do things like turning off devices when we're not using them.
Club leader: Right ... And there is much more we can do, like practising the 3Rs.
Nam: We can plant more trees in our neighbourhood too.
Ann: And try to avoid using single-use products, like plastic bags, and stop littering.
Club leader: Yeah. And we can volunteer at some local environment programmes to save endangered species.`,
      readingPassage: `Today, there are national parks all over the world, and the number is rising all the time. A national park is a special area for the protection of the environment and wildlife.
In Viet Nam, there are now 34 national parks. Con Dao National Park is one of them. It became a national park in 1993. It consists of 16 small islands covering 20,000 hectares. The ecosystem here is very diverse with thousands of species, including marine animals. Many species of corals as well as sea turtles, dolphins, and endangered dugongs live here as well. The park is also home to a lot of valuable kinds of woods and medicinal plants. Three ancient trees in the park were named "Vietnamese Heritage Trees".
Con Dao National Park, like other national parks, plays a key role in saving endangered species as well as protecting the environment and natural resources. It also helps raise the awareness of local residents about the importance of nature.`
    },
    8: {
      dialogue: `Mai: How was your trip to Bac Ha, Alice?
Alice: It's awesome. I like Bac Ha Fair most. It's an open-air market in Lao Cai.
Mai: What do you like about it?
Alice: Many things. The people at the market were wearing really colourful costumes.
Mai: Yeah ... They came from different minority groups.
Alice: I think so, and most of the products sold at the market were home-grown and home-made. I love it.
Mai: Do you have similar markets in New Zealand?
Alice: Yes, we do. Back in my city, Auckland, we have a farmers' market every Saturday where farmers sell their products. My mother loves shopping there, and she rarely misses one.
Mai: I prefer shopping at the supermarket. I can find almost everything I need there, and I don't have to bargain. All the items have fixed prices on their price tags.
Alice: Right. It's more convenient.
Mai: Yeah ... Oh, I've got to go. My art lesson starts at one o'clock, and I want to go to a convenience store on the way. See you later.
Alice: See you.`,
      readingPassage: `Why We Go to Shopping Centres
Shopping centres attract a lot of customers, especially at the weekend, on holidays, or during sales. People go there to shop. Shopping centres offer a wide range of products to choose from. Customers can touch the products and try on clothes and shoes. This makes them feel more comfortable when they decide to buy something.
However, people also go to shopping centres for many other reasons. Some people go there for entertainment. These centres often offer year-round free entertainment for customers of all ages such as live music and special performances. During holidays, shoppers can see decorations and join in the holiday excitement. It's a good way to relax. Some people go there just to hang out with friends. They go browsing and chat while wandering through the shopping malls. Others visit shopping centres to get exercise. They enjoy walking for one or two hours in clean and well-lit areas. Some people even go there to avoid the heat or cold outside. Shopping centres offer free air conditioning and heating.`
    },
    9: {
      dialogue: `Tom: You look pretty sad, Mi. What's the matter?
Mi: My uncle called us this morning. Our home town has been affected by a flood. It's the second time this year.
Tom: I'm sorry to hear that. How are things there now?
Mi: My uncle, his wife, and his children are all safe. They moved everything to the second floor of their house last night. Are there natural disasters in your home town in the US?
Tom: Yes, we sometimes have tornadoes.
Mi: Tornadoes? Sounds strange. What's a tornado?
Tom: It's a violent storm that moves in a circle with very strong winds. I still remember the tornado we had last year.
Mi: What happened?
Tom: One evening my parents and I were having dinner. Suddenly, we heard a very loud noise. When we looked out of the window, we saw a big funnel of wind moving towards us.
Mi: Did it cause any damage?
Tom: Yes, a lot. It damaged the roof of our house and pulled up some trees in our yard. Fortunately, no one was hurt.`,
      readingPassage: `A volcano in the South Pacific erupted violently last Saturday. It hit Tonga, an island country in the area. The eruption sent a cloud of ash and gas into the air. People could see this cloud from 20 kilometres away. The eruption also caused a tsunami which flooded properties in Tonga's capital. Besides, it destroyed hundreds of homes on some small islands. More than twenty people on these islands are still missing. New Zealand sent two big ships to Tonga to help the victims yesterday.
Residents in tall buildings in Ha Noi were frightened when they felt a slight shaking for about 30 seconds last night. "I was watching TV when my building started trembling. Books, lights, and other things also moved". Ms Nguyen Ha, a resident in the Sunshine Building, shared. Many people living in the building ran out of their homes in fear. According to scientists, a strong earthquake in China caused this shaking. Luckily, there was no damage.`
    },
    10: {
      dialogue: `Trang: Mark, we're having a video conference with Tech Savvy next Thursday, but ...
Mark: Hold on. Is that the technology club at the Japanese school?
Trang: Exactly. But I'm a bit worried. I've never had a video conference call.
Mark: You're kidding! Who doesn't know how to make a video call? Alright, let's do a practice call now.
Trang: Hmm, what do I need to do first?
Mark: It's a piece of cake, Trang. Now, you sit in front of the computer. I'll connect with you via one of my tablets and ...
Trang: Sorry, but how can I adjust this webcam? It's focusing on my forehead.
Mark: Use this button to move it up or down, and this to zoom in or out.
Trang: Thanks. And can you see me clearly on your tablet?
Mark: Yes, of course. We have a high-speed Internet connection here.
Trang: I hope the conference goes smoothly.
Mark: I'm sure it will. We should hold more video conferences like this in the future.
Trang: That's exactly how I feel.`,
      readingPassage: `TELEPATHY
MC: Hi everyone. Today, I'll ask some members of the Technology Club to predict how people will communicate in the future. Let's meet Minh and Tom.
Minh & Tom: Hi everyone.
MC: Minh and Tom, how do you and your friends keep in contact?
Minh: Well, we mostly text each other. We also send voice messages.
Tom: I often see my friends in person, but sometimes we call via the Internet.
MC: Do you think these ways of communication will still be popular in 50 years?
Tom: Not really. We'll use more advanced ways, like telepathy. We'll pass our thoughts to another person without talking and ...
MC: Hold on. I think only a very few people may have this ability.
Minh: Yes, but in the future, everyone will be able to use telepathy. We'll wear a tiny device to catch our thoughts and send them to other people.
MC: Cool! But will there be any problems with telepathy?
Tom: Hmm, telepathy devices can "read" one's mind, so bad people might take advantage of it to control someone else.
MC: Besides that, some people will be too lazy to even talk anymore.`
    },
    11: {
      dialogue: `Minh: Ann, do you like yesterday's lesson? I really enjoy learning online.
Ann: I prefer having face-to-face classes. I like to interact with my classmates during the lessons.
Minh: I think online classes are convenient during bad weather or epidemics. Also, students can still interact when they are in breakout rooms.
Ann: But the Internet connection doesn't always work well enough for us to learn online. And my eyes get tired when I work in front of the computer screen all day long.
Minh: I know what you mean. But there's some great news for us. 3D contact lenses will soon be available. With them, our eyes won't get tired when looking at a computer screen all day long.
Ann: Wow, that's brilliant!
Minh: Another helpful invention is robot teachers. They will teach us when our human teachers are not available or get ill. My uncle said the robots would be able to mark our work and give us feedback too.
Ann: Fantastic! I can't wait.`,
      readingPassage: `Biometrics
No more worries about truancy and cheating! Just introduce biometric applications at your school. With fingerprint scanners, or facial or voice recognition technologies, schools will be able to check students' attendance. Teachers will no longer need to call students' names to find out who is absent. This will make more time for activities!
Schools can also use these biometric applications for students who borrow books and equipment. Even more amazing, teachers can even use the eye-tracking applications to check students' understanding of a lesson and to motivate students to learn.
Nanolearning
Tired of sitting in front of a computer all day long? Unable to concentrate for very long in your classes? Or frequently forgetting large amounts of information? The solution to these is Nanolearning created by Junglemap in 2006. Nanolearning provides you with small amounts of information over a short period of time. Your learning will become effortless.
Believe us! Receive bits of information within two to five minutes via our platform, and you will increase your learning attention and ability. Our app also reports your study activities and results to your teacher.`
    },
    12: {
      dialogue: `Mai: What book are you reading, Nick?
Nick: A journey back to Soduka. I'm on the last page.
Mai: That's a science fiction book, isn't it? What's it about?
Nick: Yes, it is. It's about four creatures Titu, Kaku, Hub, and Barb. They're travelling back to Soduka, a planet like Earth. Along the way they have to land on Earth because their spaceship breaks down. They meet Tommy and become friends with him.
Mai: What happens next?
Nick: Tommy helps the four creatures repair their spaceship, so they can travel back to their home planet. But their commander forces them to return to Earth to destroy it. Tommy and the four creatures try to oppose the commander.
Mai: Sounds thrilling!
Nick: Tommy and the four creatures manage to stop the commander from destroying Earth.
Mai: So it has a happy ending! What do you think about the possibility of aliens attacking Earth?
Nick: I'm not sure about it. But I'm starting to think about it. I sometimes ask myself what we would do if aliens took over our planet.`,
      readingPassage: `Nowadays humans are still wondering what planets in outer space might support life.
Scientists say planets need to meet three main conditions to support life. Firstly, they must have liquid water, so their temperature must not be too high or too low. Secondly, the planets need to have the correct amount of air so that they can hold an atmosphere around. Finally, their size is also important. If a planet is too small, its gravity is not strong enough to hold an amount of air. If it is too big, its gravity will be so strong that it will hold too much air.
Scientists are using space telescopes to find habitable planets. According to them, Mars is one of the most promising planets for life in our solar system. It is a planet like Earth. Its days last for 24.5 hours and its seasons are similar to Earth's. Although scientists have not found actual water on Mars, there seems to be traces of it on the planet's surface. However, the climate on Mars is unsuitable for human life because it is too cold and Mars lacks oxygen to support human life.`
    }
  }
};
