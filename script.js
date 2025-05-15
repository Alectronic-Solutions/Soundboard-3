// script.js
let audioContext;
const activeSources = [];
let soundBuffers = {}; // Stores decoded AudioBuffers, keyed by sound id
let allConfiguredSounds = []; // Holds all sound objects (initial + user-added)

const defaultColors = ['#007bff', '#6f42c1', '#28a745', '#fd7e14', '#ffc107', '#17a2b8', '#6610f2'];
let colorIndex = 0;

function getNextDefaultColor() {
    const color = defaultColors[colorIndex];
    colorIndex = (colorIndex + 1) % defaultColors.length;
    return color;
}

// --- Initial Sound Definitions ---
const soundFiles = [
    "2000 Years Later.ogg", "Accidents Happen.ogg", "Add up those figures sir.ogg", "Airhorn Buildup.ogg",
    "Airhorn Classic.ogg", "Airhorn Fast.ogg", "Airhorn Sad.ogg", "Airplane.ogg", "All Star All Star.ogg",
    "All this computer hacking is making me thirsty.ogg", "All you can talk about is Money.ogg",
    "Americas going to be great again gang.ogg", "Anal Sex.ogg", "Angelic Holy Tone.ogg", "Another One.ogg",
    "Are You High or Just Incredibly Stupid.ogg", "Are you sure about that.ogg",
    "As long as the matrix exists the human race can never be free.ogg", "Asian Gong.ogg", "Aye Yi Yi Yi.ogg",
    "Baby Elephant Walk FRIDGE.ogg", "Baby I got your Money - Song.ogg", "Bad Boys Theme.ogg", "Bad to the Bone.ogg",
    "Banjo Deliverance.ogg", "Bank Notes for Millionaires.ogg", "Banned from micky mouse club for inappropriate.ogg",
    "Beat up by a guy wearing a dress.ogg", "Benny Hill Chase Silly.ogg", "Big cheer.ogg", "Bike Horn.ogg",
    "Bill Nye the Science Guy.ogg", "Bing bing bong Thomas the train and Donald Trump.ogg", "Boing Tree.ogg",
    "Boing Two.ogg", "Boing.ogg", "Bomb the shit out of them Trump.ogg", "Bottle Rocket.ogg", "Boxing Bell.ogg",
    "Breaking News 2.ogg", "Breaking News 3.ogg", "Breaking News.ogg", "Bright Side of Life.ogg", "British.ogg",
    "Broken-glass.ogg", "Brutal MK.ogg", "Buzzer.ogg", "Bye Felicia.ogg", "Camel.ogg", "Camera Click.ogg",
    "Can Do Sarcastic.ogg", "Can You Dig lt.ogg", "Car Crash.ogg", "Cartoon Slipping.ogg",
    "Cash me outside how bout dat.ogg", "Cat Angry.ogg", "Cheers.ogg", "Chewbaca.ogg", "Chicken-jockey.ogg",
    "Chinese Intro.ogg", "Clapping Cheering.ogg", "Clapping Large Audience.ogg", "Clapping Medium Audience.ogg",
    "Clapping Medium.ogg", "Clapping Normal.ogg", "Clapping Short.ogg", "Clapping Sus.ogg", "Come on man.ogg",
    "Come-on-down.ogg", "Congratulations Trump.ogg", "Cop Siren.ogg", "Credits Received.ogg", "Crickets.ogg",
    "Crowd Aww Cute.ogg", "Crowd Aww Loss.ogg", "Crowd Aww Nooo.ogg", "Crowd Booo.ogg", "Crying Baby.ogg",
    "CSI Yeah.ogg", "Curb Enthusiasm.ogg", "Curb-your-enthusiasm.ogg", "Did somebody say make Money Money.ogg",
    "Ding.ogg", "Dinosaur Groan.ogg", "Do I look like I know what a Jpeg is.ogg", "Do not come.ogg",
    "Do you ever look at someone and wonder what they are thinking.ogg", "Does he look like a bitch.ogg",
    "Dogs.ogg", "Donkey.ogg", "Dracula Theme.ogg", "Drums 1min.ogg", "Drums Bongos.ogg", "Drums Medium.ogg",
    "Drums Rim Shot.ogg", "Drums Ting.ogg", "Dun Dun Dunnnn.ogg", "Eagle.ogg", "Eat Shit Derek.ogg",
    "Elephant.ogg", "English do you speak it.ogg", "Enoch.ogg", "Especially on weed man.ogg",
    "Every Little Thing is Gonna Be Alright.ogg", "Evil Laugh.ogg", "Fairy.ogg", "Family Feud Theme.ogg",
    "Fart Large.ogg", "Fart Two.ogg", "Fart.ogg", "Fatality.ogg", "Female scream.ogg", "Flawless Victory MK.ogg",
    "Fox TV Theme.ogg", "Free credit report.ogg", "Friends Theme.ogg", "Full House.ogg", "Future army soldier.ogg",
    "Fuuuck Long.ogg", "Gameshow Ending Wacky.ogg", "Gasp.ogg", "Gay.ogg", "Get er Done.ogg", "Get help.ogg",
    "Get Swifty.ogg", "Ghost moan.ogg", "Giligans Island Theme.ogg", "Give us some Money.ogg", "Godfather Theme.ogg",
    "Gonna Smoke Some Weed.ogg", "Goofy car horn.ogg", "Gun Cock.ogg", "Gun Lazers Reggae.ogg",
    "Gun Lazers Tie Fighter.ogg", "Gun Rapid Fire.ogg", "Gun Richochet Miss.ogg", "Gun Shot with Cock.ogg",
    "Ha Ha Ha Shut Up.ogg", "Ha Ha Nelson.ogg", "Hackings Bad Trump.ogg", "Hallelujah.ogg", "Hawk Tuah Arnold.ogg",
    "Hawk Tuah Short.ogg", "Hawk Tuah.ogg", "He He Jackson.ogg", "He was a Retard.ogg", "Helicopter.ogg",
    "Hell naw.ogg", "Hello and welcome.ogg", "Hello Future Millionaires.ogg", "Home Alone and Interested in Sex.ogg",
    "Hoo wee what a cliffhanger.ogg", "Hopefully you didn't fuck around and waste your life.ogg", "Horse Running.ogg",
    "Horse Whinny.ogg", "How Dare You.ogg", "How Good of You to Join Us Bane.ogg", "How it feels to chew 5 gum.ogg",
    "I am a Millionaire - Trump.ogg", "I cant hear anything.ogg", "I can't take it anymore.ogg", "I Caramba Bart.ogg",
    "I do not have any Money.ogg", "I dont give a fuuu.ogg", "I don't remember Trump.ogg",
    "I dropped my monster condom.ogg", "I got hairy legs.ogg", "I have to fufill my purpose so I can go away.ogg",
    "I really have nothing better to do Trump.ogg", "I think moto like you.ogg", "I thought this was america.ogg",
    "I thought we had a deal.ogg", "I-am-steve.ogg", "Im a Secret Agent.ogg", "Im Chris Hanson with Dateline NBC.ogg",
    "Im gonna come.ogg", "--Im gonna go kill myself.ogg", "--Im Kinda Retarded.ogg", "Im making a donation.ogg",
    "Im Sorry I was such a saint before.ogg", "Im Sorry.ogg", "--In a few mins bitch.ogg",
    "--In San Fran its all about gay bath houses.ogg", "In the Arms of an Angel.ogg", "In the Navy.ogg",
    "Inception.ogg", "India.ogg", "Irish.ogg", "It is Maam.ogg", "Its getting wierd.ogg",
    "Its raining men hallelujah.ogg", "I've always been here for you guys and I always will be.ogg",
    "I've been doing martial arts my whole life I dont wanna fight.ogg", "Ive fallen and I can't get up.ogg",
    "I've Fallen and I can't get up.ogg", "Jade Pussycat.ogg", "Jammin Bob Marley.ogg", "Jeopardy Theme.ogg",
    "Just do it.ogg", "Kaching.ogg", "Kells.ogg", "Ladies and Gentlemen we got em.ogg", "Laughing Clap.ogg",
    "Laughing Fo.ogg", "Laughing One.ogg", "Laughing Sitcom.ogg", "Laughing Tree.ogg", "Laughing Two.ogg",
    "Laughing.ogg", "Laverne and Shirley Theme.ogg", "Law and Order.ogg", "Let her go.ogg", "Limit on Talking.ogg",
    "Looney Toons Theme.ogg", "LOSE Millionaire Short.ogg", "LOSE Millionaire.ogg", "--Lot of perverts in here.ogg",
    "Mad World.ogg", "Mario Coin.ogg", "Mario Game Over.ogg", "Mario Lose Life.ogg", "Mario Power Up.ogg",
    "Mario Thank You so Much.ogg", "Mash Theme.ogg", "Meow.ogg", "Metal Gear Alert.ogg", "Mexican Americans.ogg",
    "Mexican.ogg", "Millionaire $$$5min.ogg", "Mingle Game.ogg", "Mission failed.ogg", "Mission Impossible.ogg",
    "Money Money I want more Money.ogg", "Moneyyy Song.ogg", "Monkey.ogg", "Moo.ogg", "--MotherFucker.ogg",
    "My name Jeff.ogg", "Obama if we are racist.ogg", "Ohhh La La.ogg", "0k Lil Jon.ogg", "--Oral Sex.ogg",
    "--Orgasm.ogg", "Pac Man Death.ogg", "Phone a Friend HOLD.ogg", "Pig.ogg", "Piglet Squel.ogg",
    "Pinky and The Brain.ogg", "Pokemon.ogg", "Pornhub.ogg", "Price is right LOSE.ogg", "Punch.ogg", "Puppy.ogg",
    "Radar.ogg", "Rehab Amy Winehouse.ogg", "--Retard Alert.ogg", "Right Near the Beach Boi.ogg", "Road Runner.ogg",
    "Roxanne.ogg", "Roxannel.ogg", "Sad Trombone.ogg", "Sad Violin.ogg", "ScoobyDoo.ogg", "Seinfeld Intro.ogg",
    "Sex Change I Need It Now.ogg", "She Shall Lure some Millionaire.ogg", "Sheep.ogg", "Show me the Money.ogg",
    "--Shut the Fuck Up.ogg", "Silly Spanish Flea FRIDGE.ogg", "ng Next to a Millionaire.ogg", "Smoke Weed Everyday.ogg",
    "Spend your Money like Money aint Song.ogg", "Spongebob Fail.ogg", "Spring.ogg", "Star Wars Cantina.ogg",
    "Step By Step.ogg", "Suicide.ogg", "Surpnse-supnse.ogg", "Suspense Harp.ogg", "Suspense Medium.ogg",
    "Suspense Short.ogg", "Suspense Tuba.ogg", "Taco bell bong.ogg", "Tada.ogg", "Taxes.ogg", "Tequila.ogg",
    "Thaaanks Sarcastic.ogg", "Thank You for the donation lady.ogg", "Thank You for your patronage.ogg",
    "Thank You Rick.ogg", "Thank You South Park.ogg", "Thank You Sweet.ogg", "That means your gay.ogg",
    "Thats a lot of Nuts.ogg", "Thats What She Said.ogg", "The Adams Family Theme.ogg", "The Jeffersons Theme.ogg",
    "The more you know.ogg", "The Most Important Thing is Money.ogg", "The Stripper.ogg", "Threes Company.ogg",
    "Tim Allen Grunt Home Improvement.ogg", "Tip for you in my pocket.ogg", "Toilet.ogg", "Tree Fiddy.ogg",
    "Trombone High Pitch.ogg", "Two and half men.ogg", "Universal Studios.ogg", "Vince Tammy.ogg",
    "Walk like an egyptian.ogg", "Wasted.ogg", "Weakest Link.ogg", "Well Be Right Back.ogg", "Were here to help.ogg",
    "Western crowd.ogg", "What are you a homo.ogg", "What are you people on dope.ogg", "What da dog do.ogg",
    "What do you mean funny funny how.ogg", "What is That Joke.ogg", "What Lil Jon.ogg",
    "What the hell is going on here exactly.ogg", "What the hell is wrong with you people.ogg",
    "Whats the sound of one hand clapping.ogg", "Where is the lamb sauce.ogg", "Wheres the rest of my meth.ogg",
    "Whip.ogg", "White Dude for Harris.ogg", "Who is your daddy and what does he do.ogg", "Who the Hell Cares.ogg",
    "Who's that Pokemon.ogg", "Why are you gay.ogg", "Why Can't We Be Friends.ogg",
    "Why in the fuck would I do that.ogg", "Will I pay a lot of tax Trump.ogg", "WoHoo Homer.ogg", "Wolf.ogg",
    "Wonka flute.ogg", "Woodpecker.ogg", "Wow Dude.ogg", "Wow kid.ogg", "Wow.ogg", "Ya Science.ogg", "Yahoo.ogg",
    "Yeah Lil Jon.ogg", "Yeah Probably.ogg", "Yeah So What.ogg", "Yeah this is gonna help with that bitch.ogg",
    "Yippee.ogg", "Yippeee.ogg", "You Belong To Me.ogg", "You Can Do lt.ogg", "You Have Smoked Yourself Retarded.ogg",
    "You Lose MK.ogg", "You sound like a gay.ogg", "You Suck You Jackass.ogg", "You Wanna Get High.ogg",
    "Your Fired Trump.ogg", "Your Rights Are My Responsibilities.ogg", "You're a Millionaire.ogg"
];

const initialSounds = soundFiles.map(filename => {
    let cleanName = filename.replace(/\.ogg$/i, '').replace(/_/g, ' ');
    let id = cleanName.replace(/[^a-zA-Z0-9]/g, '_');
    if (id.startsWith('--')) {
        id = id.substring(2);
        cleanName = cleanName.substring(2);
    }
    if (id.startsWith('ng_Next')) { // specific fix for "ng Next to a Millionaire.ogg"
        id = "Singing_Next_to_a_Millionaire";
        cleanName = "Singing Next to a Millionaire";
    }


    let category = "General";
    const lowerCaseName = cleanName.toLowerCase();

    if (lowerCaseName.includes("trump")) category = "Trumpism";
    else if (lowerCaseName.includes("money") || lowerCaseName.includes("millionaire") || lowerCaseName.includes("kaching")) category = "Money";
    else if (lowerCaseName.includes("theme") || lowerCaseName.includes("song") || lowerCaseName.includes("music") || lowerCaseName.includes("reggae") || lowerCaseName.includes("marley") || lowerCaseName.includes("rehab") || lowerCaseName.includes("roxanne")) category = "Music & Themes";
    else if (lowerCaseName.includes("fart") || lowerCaseName.includes("burp")) category = "Bodily Functions";
    else if (lowerCaseName.includes("airhorn") || lowerCaseName.includes("siren") || lowerCaseName.includes("gong")) category = "Sound Effects";
    else if (lowerCaseName.includes("mario") || lowerCaseName.includes("pokemon") || lowerCaseName.includes("mk") || lowerCaseName.includes("pac man")) category = "Gaming";
    else if (lowerCaseName.includes("laugh") || lowerCaseName.includes("cheer") || lowerCaseName.includes("clap") || lowerCaseName.includes("boo")) category = "Crowd & Reactions";
    else if (lowerCaseName.includes("sex") || lowerCaseName.includes("gay") || lowerCaseName.includes("homo") || lowerCaseName.includes("pussy") || lowerCaseName.includes("condom") || lowerCaseName.includes("oral") || lowerCaseName.includes("orgasm") || lowerCaseName.includes("pervert")) category = "Adult";
    else if (lowerCaseName.includes("retard")) category = "Controversial";


    return {
        id: id,
        name: cleanName, // Original name for reference and default display
        path: `sounds/${filename}`,
        customText: cleanName, // Editable text, defaults to name
        color: getNextDefaultColor(), // Assign a default color
        category: category // Default category
    };
});


// --- Web Audio API Functions (mostly from the guide) ---
function initAudioContext() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log("AudioContext created. State:", audioContext.state);
        } catch (e) {
            alert("Web Audio API is not supported in this browser. Please try a modern browser.");
            console.error("Error creating AudioContext:", e);
            return false;
        }
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log("AudioContext resumed successfully.");
        }).catch(e => console.error("Error resuming AudioContext:", e));
    }
    return true;
}

async function loadSound(soundObject, retries = 3) {
    if (!audioContext && !initAudioContext()) {
        console.error("AudioContext could not be initialized. Cannot load sound:", soundObject.name);
        return null;
    }
    if (audioContext.state === 'suspended') {
        await audioContext.resume().catch(e => console.warn("Resuming context during loadSound failed.", e));
    }

    try {
        const response = await fetch(soundObject.path, { mode: 'cors' });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} for ${soundObject.path}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        soundBuffers[soundObject.id] = audioBuffer;
        console.log(`Sound "${soundObject.name}" (ID: ${soundObject.id}) loaded.`);
        return audioBuffer;
    } catch (error) {
        console.error(`Error loading sound "${soundObject.name}" from ${soundObject.path}:`, error);
        if (retries > 0) {
            console.log(`Retrying sound "${soundObject.name}" (${retries} retries remaining)`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
            return loadSound(soundObject, retries - 1); // Recursive call with reduced retries
        } else {
            console.error(`Failed to load sound "${soundObject.name}" after multiple retries.`);
            return null;
        }
    }
}

async function preloadInitialSounds() {
    const loadingMessage = document.getElementById('loading-message');
    if (initialSounds.length === 0) {
        if(loadingMessage) loadingMessage.textContent = 'No initial sounds to preload. Add sounds using the "Add .ogg Sound" button.';
        allConfiguredSounds = [];
        renderButtonsWithSortAndFilter();
        return;
    }

    if(loadingMessage) loadingMessage.textContent = 'Loading sounds... (0%)';
    console.log("Preloading initial sounds...");

    allConfiguredSounds = [...initialSounds]; // Initialize with initial sounds
    let loadedCount = 0;

    const loadPromises = allConfiguredSounds.map(sound =>
        loadSound(sound).then(buffer => {
            loadedCount++;
            if(loadingMessage) loadingMessage.textContent = `Loading sounds... (${Math.round((loadedCount / allConfiguredSounds.length) * 100)}%)`;
            if (!buffer) {
                // Optionally remove sound from allConfiguredSounds if it fails to load
                allConfiguredSounds = allConfiguredSounds.filter(s => s.id !== sound.id);
                console.warn(`Failed to load ${sound.name}, it will not be available.`);
            }
        }).catch(error => {
            console.error(`Failed to process promise for sound: ${sound.name}`, error);
            allConfiguredSounds = allConfiguredSounds.filter(s => s.id !== sound.id);
        })
    );

    try {
        await Promise.all(loadPromises);
        console.log('All initial sounds have been processed.');
        if(loadingMessage) loadingMessage.style.display = 'none'; // Hide loading message
    } catch (error) {
        console.error('An error occurred during the preloading of all sounds:', error);
        if(loadingMessage) loadingMessage.textContent = 'Error loading sounds.';
    }
	loadEditsFromLocalStorage();
    loadUserSoundsFromLocalStorage();
    populateCategoryFilter();
    renderButtonsWithSortAndFilter();
}

function saveUserSoundsToLocalStorage() {
    const userSounds = allConfiguredSounds.filter(sound => sound.category === 'User Added');
    localStorage.setItem('userSounds', JSON.stringify(userSounds));
}

async function loadUserSoundsFromLocalStorage() {
    const storedSounds = localStorage.getItem('userSounds');
    if (storedSounds) {
        const userSounds = JSON.parse(storedSounds);
        console.log("Loading user-added sounds from local storage:", userSounds);

        for (const sound of userSounds) {
            try {
                // Fetch the sound data
                const response = await fetch(sound.path, { mode: 'cors' });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status} for ${sound.path}`);
                }
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

                // Add the sound to the soundBuffers
                soundBuffers[sound.id] = audioBuffer;

                // Add the sound to the allConfiguredSounds array
                allConfiguredSounds.push(sound);
                console.log(`User sound "${sound.name}" (ID: ${sound.id}) loaded from local storage.`);
            } catch (error) {
                console.error(`Error loading user-added sound "${sound.name}" from local storage:`, error);
            }
        }
    }
}

let currentSoundSource = null; // Track the currently playing source
let currentSoundId = null; // Track the currently playing sound ID

function playSound(soundId) {
    if (!audioContext || audioContext.state !== 'running') {
        console.warn("AudioContext not active. Attempting to initialize/resume...");
        if (!initAudioContext() || (audioContext && audioContext.state !== 'running')) {
            alert("Audio playback requires user interaction. Please click anywhere on the page first, then try playing the sound again.");
            return;
        }
    }

    const audioBuffer = soundBuffers[soundId];
    if (!audioBuffer) {
        console.error(`AudioBuffer for sound ID "${soundId}" not found. Was it loaded correctly?`);
        alert(`Sound "${soundId}" could not be played. It might not have loaded correctly.`);
        return;
    }

    // Stop any currently playing sound
    stopAllSounds();

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);

    // Track the current sound
    currentSoundSource = source;
    currentSoundId = soundId;

    source.start(0);
    activeSources.push(source);

    // Update total duration
    const totalDurationElement = document.getElementById('total-duration');
    totalDurationElement.textContent = formatTime(audioBuffer.duration);

    // Update current time
    const currentTimeElement = document.getElementById('current-time');
    let startTime = audioContext.currentTime; // Capture start time

    const updateTime = () => {
        if (currentSoundSource && activeSources.includes(currentSoundSource)) {
            const elapsedTime = audioContext.currentTime - startTime;
            currentTimeElement.textContent = formatTime(elapsedTime);
            requestAnimationFrame(updateTime);
        } else {
            currentTimeElement.textContent = '0:00';
        }
    };
    updateTime();

    source.onended = () => {
        const index = activeSources.indexOf(source);
        if (index > -1) {
            activeSources.splice(index, 1);
        }
        currentSoundSource = null;
        currentSoundId = null;
        currentTimeElement.textContent = '0:00';
    };
}

function stopAllSounds() {
    if (!audioContext) return;
    // Iterate over a copy as stopping modifies the original array via onended
    [...activeSources].forEach(source => {
        try {
            source.stop(0);
        } catch (e) {
            console.warn("Error stopping a source during Stop All:", e.message, source);
        }
    });
    activeSources.length = 0; // Clear the array
    currentSoundSource = null;
    currentSoundId = null;
    console.log("Attempted to stop all active sounds.");
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Add restart functionality
const restartButton = document.getElementById('restart-button');
restartButton.addEventListener('click', () => {
    if (currentSoundId) {
        playSound(currentSoundId); // Restart the current sound
    }
});

// --- UI and Interaction Functions ---
const buttonsArea = document.getElementById('buttons-area');

let editMode = false;

function createSoundButton(soundObject) {
    const button = document.createElement('button');
    button.className = 'sound-button';
    button.textContent = soundObject.customText;
    button.style.backgroundColor = soundObject.color;
	button.style.color = soundObject.textColor || getTextColor(soundObject.color); // Use stored text color or calculate
    button.setAttribute('data-sound-id', soundObject.id);

    // --- Drag and Drop ---
    button.setAttribute('draggable', 'true');
    button.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', soundObject.id);
        button.classList.add('dragging');
    });
    button.addEventListener('dragend', () => {
        button.classList.remove('dragging');
    });

    button.addEventListener('dragover', (e) => {
        e.preventDefault();
        button.classList.add('drag-over');
    });
    button.addEventListener('dragleave', () => {
        button.classList.remove('drag-over');
    });
    button.addEventListener('drop', (e) => {
        e.preventDefault();
        button.classList.remove('drag-over');
        const draggedId = e.dataTransfer.getData('text/plain');
        if (draggedId === soundObject.id) return;
        const draggedIdx = allConfiguredSounds.findIndex(s => s.id === draggedId);
        const targetIdx = allConfiguredSounds.findIndex(s => s.id === soundObject.id);
        if (draggedIdx === -1 || targetIdx === -1) return;
        // Move dragged sound to new position
        const [draggedSound] = allConfiguredSounds.splice(draggedIdx, 1);
        allConfiguredSounds.splice(targetIdx, 0, draggedSound);
        saveEditsToLocalStorage();
        renderButtonsWithSortAndFilter();
    });

    button.addEventListener('click', () => {
        if (editMode) {
            openEditModal(soundObject, button);
        } else {
            playSound(soundObject.id);
        }
    });

    buttonsArea.appendChild(button);
}

// Get the modal
const modal = document.getElementById("editModal");

// Get the <span> element that closes the modal
const closeBtn = document.getElementsByClassName("close")[0];

// Function to open the modal
function openEditModal(soundObject, button) {
    const editText = document.getElementById("editText");
    const editColor = document.getElementById("editColor");
	const editTextColor = document.getElementById("editTextColor");
    const editCategory = document.getElementById("editCategory");
    const saveButton = document.getElementById("saveButton");

    editText.value = soundObject.customText;
    editColor.value = soundObject.color;
	editTextColor.value = soundObject.textColor || getTextColor(soundObject.color);
    editCategory.value = soundObject.category;

    saveButton.onclick = function() {
        soundObject.customText = editText.value;
        button.textContent = editText.value;
        button.style.backgroundColor = editColor.value;
		button.style.color = editTextColor.value;
        soundObject.color = editColor.value;
		soundObject.textColor = editTextColor.value;
        soundObject.category = editCategory.value;
        closeEditModal();
        saveEditsToLocalStorage();
        populateCategoryFilter();
        renderButtonsWithSortAndFilter();
    }

    modal.style.display = "block";
    modal.soundObject = soundObject;
    modal.button = button;
}

function getTextColor(backgroundColor) {
    // Convert hex to RGB
    const hexToRgb = (hex) => {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const rgb = hexToRgb(backgroundColor);
    if (!rgb) return '#000000'; // Default to black if conversion fails

    // Calculate luminance
    const luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;

    // Return black or white based on luminance
    return luminance > 128 ? '#000000' : '#FFFFFF';
}

// Function to close the modal
function closeEditModal() {
    modal.style.display = "none";
}

// When the user clicks on <span> (x), close the modal
closeBtn.onclick = function() {
  closeEditModal();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    closeEditModal();
  }
}

// Edit mode toggle
const editModeButton = document.getElementById('edit-mode-btn');
editModeButton.addEventListener('click', () => {
    editMode = !editMode;
    editModeButton.textContent = `Edit Mode: ${editMode ? 'On' : 'Off'}`;
});

async function handleFileUpload(event) {
    if (!audioContext || audioContext.state !== 'running') {
        if (!initAudioContext() || (audioContext && audioContext.state !== 'running')) {
            alert("Audio context not ready. Please click on the page first, then try adding again.");
            event.target.value = '';
            return;
        }
    }

    const file = event.target.files[0];
    if (file) {
        let soundName = file.name.replace(/\.ogg$/i, "").replace(/_/g, " ");
        let soundId = `user_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9]/g, "")}`;

        if (allConfiguredSounds.some(s => s.id === soundId || s.name === soundName)) {
            alert(`A sound with a similar name or ID ("${soundName}") might already exist.`);
            event.target.value = '';
            return;
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            soundBuffers[soundId] = audioBuffer; // Store the buffer

            const newSoundObject = {
                id: soundId,
                name: soundName,
                path: URL.createObjectURL(file), // Use a blob URL
                customText: soundName,
                color: getNextDefaultColor(),
                category: 'User Added'
            };
            allConfiguredSounds.push(newSoundObject);
			saveUserSoundsToLocalStorage();
            populateCategoryFilter(); // Update categories
            renderButtonsWithSortAndFilter(); // Re-render all buttons
            console.log(`User sound "${soundName}" (ID: ${soundId}) added.`);
        } catch (error) {
            console.error(`Error processing user-added file "${file.name}":`, error);
            alert(`Could not process file: "${file.name}". Please ensure it's a valid OGG audio file.`);
        } finally {
            event.target.value = ''; // Reset file input
        }
    }
}


function populateCategoryFilter() {
    const categories = new Set(['All Categories']); // Start with 'All Categories'
    allConfiguredSounds.forEach(sound => {
        if (sound.category) categories.add(sound.category);
    });

    const filterCategorySelect = document.getElementById('filter-category');
    const currentCategoryValue = filterCategorySelect.value; // Preserve selection if possible
    filterCategorySelect.innerHTML = ''; // Clear existing options

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category === 'All Categories' ? 'all' : category;
        option.textContent = category;
        filterCategorySelect.appendChild(option);
    });
    // Try to restore previous selection
    if (Array.from(filterCategorySelect.options).some(opt => opt.value === currentCategoryValue)) {
        filterCategorySelect.value = currentCategoryValue;
    } else {
        filterCategorySelect.value = 'all';
    }
}


function renderButtonsWithSortAndFilter() {
    let soundsToDisplay = [...allConfiguredSounds];

    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const sortBy = document.getElementById('sort-by').value;
    const filterCategory = document.getElementById('filter-category').value;

    // 1. Filter by Category
    if (filterCategory !== 'all') {
        soundsToDisplay = soundsToDisplay.filter(sound => sound.category === filterCategory);
    }

    // 2. Filter by Search Term
    if (searchTerm) {
        soundsToDisplay = soundsToDisplay.filter(sound => {
            return (sound.customText || sound.name).toLowerCase().includes(searchTerm);
        });
    }

    // 3. Sort (skip if drag-and-drop order is used)
    if (sortBy === 'alphabetical-asc') {
        soundsToDisplay.sort((a, b) => (a.customText || a.name).localeCompare(b.customText || b.name));
    } else if (sortBy === 'alphabetical-desc') {
        soundsToDisplay.sort((a, b) => (b.customText || b.name).localeCompare(a.customText || a.name));
    }
    // If sortBy is 'default', keep drag-and-drop order

    buttonsArea.innerHTML = ''; // Clear current buttons

    if (soundsToDisplay.length > 0) {
        soundsToDisplay.forEach(sound => createSoundButton(sound));
    } else {
        const loadingMessage = document.getElementById('loading-message');
        if (loadingMessage && loadingMessage.style.display === 'none') { // Only show if not loading
             buttonsArea.innerHTML = '<p>No sounds match your current filters.</p>';
        } else if (!loadingMessage) { // if loading message element doesn't exist
             buttonsArea.innerHTML = '<p>No sounds match your current filters.</p>';
        }
    }
    // Save edits after rendering to persist any changes from drag/drop or other UI actions
    saveEditsToLocalStorage();
}

// Save all edits and order to localStorage
function saveEditsToLocalStorage() {
    const edits = {};
    allConfiguredSounds.forEach(sound => {
        edits[sound.id] = {
            customText: sound.customText,
            color: sound.color,
            textColor: sound.textColor,
            category: sound.category
        };
    });
    localStorage.setItem('soundEdits', JSON.stringify(edits));
    // Save order as array of ids
    localStorage.setItem('soundOrder', JSON.stringify(allConfiguredSounds.map(s => s.id)));
}

// Load all edits and order from localStorage and apply to allConfiguredSounds
function loadEditsFromLocalStorage() {
    const edits = JSON.parse(localStorage.getItem('soundEdits') || '{}');
    const order = JSON.parse(localStorage.getItem('soundOrder') || '[]');
    // Apply edits
    allConfiguredSounds.forEach(sound => {
        if (edits[sound.id]) {
            sound.customText = edits[sound.id].customText || sound.customText;
            sound.color = edits[sound.id].color || sound.color;
            sound.textColor = edits[sound.id].textColor || sound.textColor;
            sound.category = edits[sound.id].category || sound.category;
        }
    });
    // Apply order
    if (order.length > 0) {
        allConfiguredSounds.sort((a, b) => {
            const ia = order.indexOf(a.id);
            const ib = order.indexOf(b.id);
            if (ia === -1 && ib === -1) return 0;
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
        });
    }
}

// --- Event Listeners Setup ---
document.addEventListener('DOMContentLoaded', () => {
    // Initial AudioContext setup on first user interaction (from guide)
    document.body.addEventListener('click', function oneTimeAudioInit() {
        if (!audioContext || audioContext.state === 'suspended') {
            initAudioContext();
        }
        // Remove this listener after its first execution.
        document.body.removeEventListener('click', oneTimeAudioInit, true);
    }, { capture: true, once: true });

    const stopAllButton = document.getElementById('stop-all-btn');
    if (stopAllButton) {
        stopAllButton.addEventListener('click', stopAllSounds);
    }

    const addSoundInput = document.getElementById('add-sound-input');
    if (addSoundInput) {
        addSoundInput.addEventListener('change', handleFileUpload);
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', renderButtonsWithSortAndFilter);
    }

    const sortBySelect = document.getElementById('sort-by');
    if (sortBySelect) {
        sortBySelect.addEventListener('change', renderButtonsWithSortAndFilter);
    }

    const filterCategorySelect = document.getElementById('filter-category');
    if (filterCategorySelect) {
        filterCategorySelect.addEventListener('change', renderButtonsWithSortAndFilter);
    }

    preloadInitialSounds().then(() => {
        loadEditsFromLocalStorage();
        renderButtonsWithSortAndFilter();
    });
});