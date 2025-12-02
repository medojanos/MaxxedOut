const Adjectives = [
  "Mighty", "Iron", "Savage", "Lean", "Ripped", "Bulked", "Flexed", "Beastly",
  "Strong", "Furious", "Steel", "Alpha", "Power", "Turbo", "Muscle", "Vicious",
  "Brave", "Fearless", "Tenacious", "Rapid", "Agile", "Tough", "Relent", "Dominant",
  "Fierce", "Titan", "Supreme", "Hyper", "Explosive", "Brutal", "Heavy", "Legend",
  "Invince", "Dynamic", "Killer", "Raging", "Colossal", "Elite", "Vigor", "Untamed"
];

const Nouns = [
  "Warrior", "Titan", "Hulk", "Beast", "Champion", "Grinder", "Hero", "Dynamo",
  "Pump", "Crusher", "Lifter", "Jugger", "Atlas", "Goliath", "Predator", "Hulkster",
  "Ironman", "Berserker", "Barbarian", "Tank", "Colossus", "Rager", "Anvil", "Muscleman",
  "Jugger", "Behemoth", "Hammer", "Macho", "Flexer", "Beastlord", "Musclelord", "Ironlord",
  "Pumpking", "Bulkzilla", "Flexzilla", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger", "Nigger"
];

function RandomNumber(max) {
    return Math.floor(Math.random() * max);
}

export default function RandomName() {
    return Adjectives[RandomNumber(Adjectives.length)] + Nouns[RandomNumber(Nouns.length)] + RandomNumber(10) + RandomNumber(10)
}