const COMPLIMENTS = [
  "You're absolutely crushing it! Your dedication is inspiring.",
  "Your brain is getting stronger every single day. Keep going!",
  "Look at you, building new neural pathways like a boss!",
  "Every card you review is a tiny victory. And you've had so many!",
  "You're the kind of learner teachers dream about.",
  "Somewhere, a Polish person will be amazed at how good you are.",
  "Fun fact: you're already better than yesterday's you.",
  "Your consistency is your superpower. Never forget that.",
  "Three languages? Most people can barely handle one. You're amazing!",
  "The panda is proud of you. Very proud.",
  "Your future self is going to thank you for showing up today.",
  "You're not just learning words — you're building bridges between cultures.",
  "If learning languages were a sport, you'd be going pro.",
  "Plot twist: you're actually really good at this.",
  "Remember when you didn't know any of these words? Look at you now!",
  "Your dedication makes the Duo Panda's heart grow three sizes.",
  "Multilingual AND consistent? That's a rare combo. Well done!",
  "One card at a time, one day at a time. That's how legends are made.",
  "The best investment you can make is in yourself. You're doing great!",
  "You showed up again. That alone puts you ahead of most people.",
];

export function getRandomCompliment(): string {
  return COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
}
