const fs = require('fs');
const path = require('path');

const soundsListPath = path.join(__dirname, 'sounds-list.js');
const categorizedSoundsPath = path.join(__dirname, 'sounds-list.js');

// Manually read the content of sounds-list.js
const soundsListContent = fs.readFileSync(soundsListPath, 'utf-8');

// Extract the array from the content
const soundsMatch = soundsListContent.match(/const sounds = (.*);/s);
if (!soundsMatch) {
    console.error('Could not find sounds array in sounds-list.js');
    process.exit(1);
}

let sounds;
try {
    // Use a safer method to parse the array
    sounds = eval(soundsMatch[1]);
} catch (e) {
    console.error('Error parsing sounds array:', e);
    process.exit(1);
}


const categories = {
    Music: ["Theme", "Song", "Instrumental", "Drum", "Bongo", "Sad Violin", "Hallelujah", "All Star", "Benny Hill", "Bill Nye", "Bright Side of Life", "Curb Enthusiasm", "Dracula Theme", "Every Little Thing is Gonna Be Alright", "Family Feud Theme", "Fox TV Theme", "Free credit report", "Friends Theme", "Full House", "Get Swifty", "Giligans Island Theme", "Godfather Theme", "In the Arms of an Angel", "In the Navy", "Inception", "India", "Irish", "Its raining men hallelujah", "Jammin Bob Marley", "Jeopardy Theme", "Jurassic Park Theme Song", "Laverne and Shirley Theme", "Law and Order", "Looney Toons Theme", "Mad World", "Mash Theme", "Mexican Americans", "Mexican", "Mingle Game", "Mission Impossible", "Moneyyy Song", "Phone a Friend HOLD", "Pinky and The Brain", "Price is right LOSE", "Rehab Amy Winehouse", "Right Near the Beach Boi", "Roxanne", "Roxannel", "Sad Violin", "ScoobyDoo", "Seinfeld Intro", "Silly Spanish Flea FRIDGE", "Spend your Money like Money aint Song", "Spongebob Fail", "Spring", "Star Wars Cantina", "Step By Step", "Surpnse-supnse", "Suspense Harp", "Suspense Medium", "Suspense Short", "Suspense Tuba", "Tequila", "The Adams Family Theme", "The Jeffersons Theme", "The Stripper", "Threes Company", "Trombone High Pitch", "Two and half men", "Universal Studios", "Walk like an egyptian", "Weakest Link", "Wonka flute"],
    SoundEffects: ["Airhorn", "Gong", "Boing", "Bottle Rocket", "Boxing Bell", "Breaking News", "Broken-glass", "Buzzer", "Camera Click", "Car Crash", "Cartoon Slipping", "Crickets", "Ding", "Dun Dun Dunnnn", "Gun", "Whip", "Taco bell bong", "Tada", "Toilet"],
    Gaming: ["MK", "Fatality", "Flawless Victory", "Mario", "Metal Gear", "Pac Man", "Pokemon", "Wasted", "You Lose"],
    Trump: ["Trump"],
    Money: ["Money", "Millionaire", "Bank Notes", "Donation", "Kaching", "Taxes"],
    Adult: ["Anal Sex", "Gay", "Home Alone and Interested in Sex", "I dropped my monster condom", "Im gonna come", "Oral Sex", "Orgasm", "Pornhub", "Sex Change I Need It Now", "Sexy GF", "That means your gay", "What are you a homo", "Why are you gay", "You sound like a gay"],
    BodilyFunctions: ["Fart"],
    CrowdReactions: ["cheer", "Clapping", "Crowd", "Gasp", "Ha Ha", "Laughing", "Sad Trombone", "Western crowd"],
    Animals: ["Camel", "Cat", "Chewbaca", "Chicken-jockey", "Dogs", "Donkey", "Eagle", "Elephant", "Horse", "Meow", "Monkey", "Moo", "Pig", "Piglet Squel", "Puppy", "Sheep", "Wolf", "Woodpecker"]
};

const categorizedSounds = sounds.map(sound => {
    for (const category in categories) {
        for (const keyword of categories[category]) {
            if (sound.name.toLowerCase().includes(keyword.toLowerCase())) {
                return { ...sound, category };
            }
        }
    }
    return { ...sound, category: 'General' };
});

const outputContent = `const sounds = ${JSON.stringify(categorizedSounds, null, 4)};`;

fs.writeFile(categorizedSoundsPath, outputContent, (err) => {
    if (err) {
        console.error('Error writing categorized-sounds.js:', err);
        return;
    }
    console.log('categorized-sounds.js generated successfully!');
});
