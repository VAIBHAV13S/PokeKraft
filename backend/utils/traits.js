const TYPES = ['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Ghost', 'Steel', 'Fairy', 'Dark', 'Rock', 'Ground', 'Poison', 'Flying', 'Bug', 'Fighting', 'Normal'];
const ELEMENTS = ['Flame', 'Ocean', 'Leaf', 'Thunder', 'Mind', 'Frost', 'Scale', 'Spirit', 'Metal', 'Light', 'Shadow', 'Stone', 'Earth', 'Toxin', 'Wind', 'Shell', 'Fist', 'Star'];
const TIERS = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythical'];
const STYLES = ['Anime', '3D Render', 'Pixel Art', 'Watercolor', 'Oil Painting', 'Sketch'];

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function generateRandomTraits() {
    const type = getRandomItem(TYPES);
    const element = getRandomItem(ELEMENTS);
    const tier = getRandomItem(TIERS);
    const style = getRandomItem(STYLES);

    // Calculate stats based on tier
    let baseStat = 50;
    if (tier === 'Rare') baseStat = 70;
    if (tier === 'Epic') baseStat = 90;
    if (tier === 'Legendary') baseStat = 120;
    if (tier === 'Mythical') baseStat = 150;

    const stats = {
        hp: baseStat + Math.floor(Math.random() * 20),
        attack: baseStat + Math.floor(Math.random() * 20),
        defense: baseStat + Math.floor(Math.random() * 20),
        speed: baseStat + Math.floor(Math.random() * 20),
    };

    return {
        type,
        element,
        tier,
        style,
        stats,
        name: `${element}${type.substring(0, 3)}or`, // Simple name generation logic
        description: `A ${tier} ${type}-type Pokémon infused with the power of ${element}.`,
    };
}
