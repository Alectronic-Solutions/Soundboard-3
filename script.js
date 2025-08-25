document.addEventListener('DOMContentLoaded', () => {
    const soundboardGrid = document.getElementById('soundboard-grid');
    const searchInput = document.getElementById('search-input');
    const stopAllButton = document.getElementById('stop-all-button');
    const fileUploadInput = document.getElementById('file-upload');
    const categorySelect = document.getElementById('category-select');
    const editButton = document.getElementById('edit-button');

    // --- GLOBAL STATE ---
    let editMode = false;
    let editIdx = null;
    // Always sort by category
    let currentSort = 'category';
    let currentCategory = 'all';
    let currentSearch = '';
    // remember last selected category so "Edit Category Order..." can restore it
    let lastSelectedCategory = 'all';

    // --- DEFINE YOUR SOUNDS HERE ---
    // Canonical sounds list (enforced). Paths assume files live in "sounds/" with the same display name + .ogg
    const DEFAULT_SOUNDS = [
        // Money (37)
        { name: `Add up those figures Sir!`, path: `sounds/Add up those figures Sir!.ogg`, category: 'Money' },
        { name: `All you can talk about is Money`, path: `sounds/All you can talk about is Money.ogg`, category: 'Money' },
        { name: `Another One`, path: `sounds/Another One.ogg`, category: 'Drums' },
        { name: `Baby I got your Money - Song`, path: `sounds/Baby I got your Money - Song.ogg`, category: 'Money' },
        { name: `Bank Notes for Millionaires`, path: `sounds/Bank Notes for Millionaires.ogg`, category: 'Money' },
        { name: `Bye Felicia`, path: `sounds/Bye Felicia.ogg`, category: 'Money' },
        { name: `Cash me outside how bout dat`, path: `sounds/Cash me outside how bout dat.ogg`, category: 'Money' },
        { name: `Did somebody say make Money Money`, path: `sounds/Did somebody say make Money Money.ogg`, category: 'Money' },
        { name: `Give us some Money`, path: `sounds/Give us some Money.ogg`, category: 'Money' },
        { name: `Hello Future Millionaires`, path: `sounds/Hello Future Millionaires.ogg`, category: 'Money' },
        { name: `I do not have any Money`, path: `sounds/I do not have any Money.ogg`, category: 'Money' },
        { name: `Kaching`, path: `sounds/Kaching.ogg`, category: 'Money' },
        { name: `LOSE Millionaire`, path: `sounds/LOSE Millionaire.ogg`, category: 'Money' },
        { name: `LOSE Millionaire Short`, path: `sounds/LOSE Millionaire Short.ogg`, category: 'Money' },
        { name: `Mario Coin`, path: `sounds/Mario Coin.ogg`, category: 'Money' },
        { name: `Mario Game Over`, path: `sounds/Mario Game Over.ogg`, category: 'Money' },
        { name: `Mario Power Up`, path: `sounds/Mario Power Up.ogg`, category: 'Money' },
        { name: `Mario Thank You so Much`, path: `sounds/Mario Thank You so Much.ogg`, category: 'Money' },
        { name: `Millionaire $$$5min`, path: `sounds/Millionaire $$$5min.ogg`, category: 'Money' },
        { name: `Money Money I want more Money`, path: `sounds/Money Money I want more Money.ogg`, category: 'Money' },
        { name: `Moneyyy Song`, path: `sounds/Moneyyy Song.ogg`, category: 'Money' },
        { name: `Phone a Friend HOLD`, path: `sounds/Phone a Friend HOLD.ogg`, category: 'Money' },
        { name: `She Shall Lure some Millionaire`, path: `sounds/She Shall Lure some Millionaire.ogg`, category: 'Money' },
        { name: `Show me the Money`, path: `sounds/Show me the Money.ogg`, category: 'Money' },
        { name: `Spend your Money like Money aint Song`, path: `sounds/Spend your Money like Money aint Song.ogg`, category: 'Money' },
        { name: `Taxes`, path: `sounds/Taxes.ogg`, category: 'Money' },
        { name: `Thaaanks Sarcastic`, path: `sounds/Thaaanks Sarcastic.ogg`, category: 'Money' },
        { name: `Thank You for the donation lady`, path: `sounds/Thank You for the donation lady.ogg`, category: 'Money' },
        { name: `Thank You for your patronage`, path: `sounds/Thank You for your patronage.ogg`, category: 'Money' },
        { name: `Thank You Rick`, path: `sounds/Thank You Rick.ogg`, category: 'Money' },
        { name: `Thank You South Park`, path: `sounds/Thank You South Park.ogg`, category: 'Money' },
        { name: `Thank You Sweet`, path: `sounds/Thank You Sweet.ogg`, category: 'Money' },
        { name: `The Most Important Thing is Money`, path: `sounds/The Most Important Thing is Money.ogg`, category: 'Money' },
        { name: `Tip for you in my pocket`, path: `sounds/Tip for you in my pocket.ogg`, category: 'Money' },
        { name: `Weakest Link`, path: `sounds/Weakest Link.ogg`, category: 'Money' },
        { name: `You're a Millionaire`, path: `sounds/You're a Millionaire.ogg`, category: 'Money' },

        // Drums (6)
        { name: `Drums 1min`, path: `sounds/Drums 1min.ogg`, category: 'Drums' },
        { name: `Drums Bongos`, path: `sounds/Drums Bongos.ogg`, category: 'Drums' },
        { name: `Drums Medium`, path: `sounds/Drums Medium.ogg`, category: 'Drums' },
        { name: `Drums Rim Shot`, path: `sounds/Drums Rim Shot.ogg`, category: 'Drums' },
        { name: `Drums Ting`, path: `sounds/Drums Ting.ogg`, category: 'Drums' },
        { name: `Dun Dun Dunnnn`, path: `sounds/Dun Dun Dunnnn.ogg`, category: 'Drums' },

        // Sound Effects (44)
        { name: `Airhorn Buildup`, path: `sounds/Airhorn Buildup.ogg`, category: 'Sound Effects' },
        { name: `Airhorn Classic`, path: `sounds/Airhorn Classic.ogg`, category: 'Sound Effects' },
        { name: `Airhorn Fast`, path: `sounds/Airhorn Fast.ogg`, category: 'Sound Effects' },
        { name: `Airhorn Sad`, path: `sounds/Airhorn Sad.ogg`, category: 'Sound Effects' },
        { name: `Angelic Holy Tone`, path: `sounds/Angelic Holy Tone.ogg`, category: 'Sound Effects' },
        { name: `Asian Gong`, path: `sounds/Asian Gong.ogg`, category: 'Sound Effects' },
        { name: `Bike Horn`, path: `sounds/Bike Horn.ogg`, category: 'Sound Effects' },
        { name: `Boing`, path: `sounds/Boing.ogg`, category: 'Sound Effects' },
        { name: `Boing Tree`, path: `sounds/Boing Tree.ogg`, category: 'Sound Effects' },
        { name: `Boing Two`, path: `sounds/Boing Two.ogg`, category: 'Sound Effects' },
        { name: `Bottle Rocket`, path: `sounds/Bottle Rocket.ogg`, category: 'Sound Effects' },
        { name: `Boxing Bell`, path: `sounds/Boxing Bell.ogg`, category: 'Sound Effects' },
        { name: `Breaking News`, path: `sounds/Breaking News.ogg`, category: 'Sound Effects' },
        { name: `Breaking News 2`, path: `sounds/Breaking News 2.ogg`, category: 'Sound Effects' },
        { name: `Breaking News 3`, path: `sounds/Breaking News 3.ogg`, category: 'Sound Effects' },
        { name: `Broken-glass`, path: `sounds/Broken-glass.ogg`, category: 'Sound Effects' },
        { name: `Buzzer`, path: `sounds/Buzzer.ogg`, category: 'Sound Effects' },
        { name: `Camera Click`, path: `sounds/Camera Click.ogg`, category: 'Sound Effects' },
        { name: `Car Crash`, path: `sounds/Car Crash.ogg`, category: 'Sound Effects' },
        { name: `Cartoon Slipping`, path: `sounds/Cartoon Slipping.ogg`, category: 'Sound Effects' },
        { name: `Countdown`, path: `sounds/Countdown.ogg`, category: 'Sound Effects' },
        { name: `Ding`, path: `sounds/Ding.ogg`, category: 'Sound Effects' },
        { name: `Fairy`, path: `sounds/Fairy.ogg`, category: 'Sound Effects' },
        { name: `Goofy car horn`, path: `sounds/Goofy car horn.ogg`, category: 'Sound Effects' },
        { name: `Gun Cock`, path: `sounds/Gun Cock.ogg`, category: 'Sound Effects' },
        { name: `Gun Lazers Reggae`, path: `sounds/Gun Lazers Reggae.ogg`, category: 'Sound Effects' },
        { name: `Gun Lazers Tie Fighter`, path: `sounds/Gun Lazers Tie Fighter.ogg`, category: 'Sound Effects' },
        { name: `Gun Rapid Fire`, path: `sounds/Gun Rapid Fire.ogg`, category: 'Sound Effects' },
        { name: `Gun Richochet Miss`, path: `sounds/Gun Richochet Miss.ogg`, category: 'Sound Effects' },
        { name: `Gun Shot with Cock`, path: `sounds/Gun Shot with Cock.ogg`, category: 'Sound Effects' },
        { name: `Hallelujah`, path: `sounds/Hallelujah.ogg`, category: 'Sound Effects' },
        { name: `Law and Order`, path: `sounds/Law and Order.ogg`, category: 'Sound Effects' },
        { name: `Punch`, path: `sounds/Punch.ogg`, category: 'Sound Effects' },
        { name: `Spring`, path: `sounds/Spring.ogg`, category: 'Sound Effects' },
        { name: `Suspense Harp`, path: `sounds/Suspense Harp.ogg`, category: 'Sound Effects' },
        { name: `Suspense Medium`, path: `sounds/Suspense Medium.ogg`, category: 'Sound Effects' },
        { name: `Suspense Short`, path: `sounds/Suspense Short.ogg`, category: 'Sound Effects' },
        { name: `Suspense Tuba`, path: `sounds/Suspense Tuba.ogg`, category: 'Sound Effects' },
        { name: `Taco bell bong`, path: `sounds/Taco bell bong.ogg`, category: 'Sound Effects' },
        { name: `Tada`, path: `sounds/Tada.ogg`, category: 'Sound Effects' },
        { name: `Toilet`, path: `sounds/Toilet.ogg`, category: 'Sound Effects' },
        { name: `Whip`, path: `sounds/Whip.ogg`, category: 'Sound Effects' },
        { name: `Wonka flute`, path: `sounds/Wonka flute.ogg`, category: 'Sound Effects' },
        
        // Adult (19)
        { name: `Anal Sex`, path: `sounds/Anal Sex.ogg`, category: 'Adult' },
        { name: `Do not come`, path: `sounds/Do not come.ogg`, category: 'Adult' },
        { name: `Gay`, path: `sounds/Gay.ogg`, category: 'Adult' },
        { name: `Hawk Tuah`, path: `sounds/Hawk Tuah.ogg`, category: 'Adult' },
        { name: `Hawk Tuah Arnold`, path: `sounds/Hawk Tuah Arnold.ogg`, category: 'Adult' },
        { name: `Hawk Tuah Short`, path: `sounds/Hawk Tuah Short.ogg`, category: 'Adult' },
        { name: `Home Alone and Interested in Sex`, path: `sounds/Home Alone and Interested in Sex.ogg`, category: 'Adult' },
        { name: `I dropped my monster condom`, path: `sounds/I dropped my monster condom.ogg`, category: 'Adult' },
        { name: `I got hairy legs`, path: `sounds/I got hairy legs.ogg`, category: 'Adult' },
        { name: `Im gonna come`, path: `sounds/Im gonna come.ogg`, category: 'Adult' },
        { name: `Its raining men hallelujah`, path: `sounds/Its raining men hallelujah.ogg`, category: 'Adult' },
        { name: `Oral Sex`, path: `sounds/Oral Sex.ogg`, category: 'Adult' },
        { name: `Orgasm`, path: `sounds/Orgasm.ogg`, category: 'Adult' },
        { name: `Pornhub`, path: `sounds/Pornhub.ogg`, category: 'Adult' },
        { name: `Sex Change I Need It Now`, path: `sounds/Sex Change I Need It Now.ogg`, category: 'Adult' },
        { name: `That means your gay`, path: `sounds/That means your gay.ogg`, category: 'Adult' },
        { name: `What are you a homo`, path: `sounds/What are you a homo.ogg`, category: 'Adult' },
        { name: `Why are you gay`, path: `sounds/Why are you gay.ogg`, category: 'Adult' },
        { name: `You sound like a gay`, path: `sounds/You sound like a gay.ogg`, category: 'Adult' },
        { name: `Fart`, path: `sounds/Fart.ogg`, category: 'Adult' },
        { name: `Fart Large`, path: `sounds/Fart Large.ogg`, category: 'Adult' },
        { name: `Fart Two`, path: `sounds/Fart Two.ogg`, category: 'Adult' },

        // Crowd & Reactions (34)
        { name: `Big cheer`, path: `sounds/Big cheer.ogg`, category: 'Crowd & Reactions' },
        { name: `Clapping Cheering`, path: `sounds/Clapping Cheering.ogg`, category: 'Crowd & Reactions' },
        { name: `Clapping Large Audience`, path: `sounds/Clapping Large Audience.ogg`, category: 'Crowd & Reactions' },
        { name: `Clapping Medium`, path: `sounds/Clapping Medium.ogg`, category: 'Crowd & Reactions' },
        { name: `Clapping Medium Audience`, path: `sounds/Clapping Medium Audience.ogg`, category: 'Crowd & Reactions' },
        { name: `Clapping Normal`, path: `sounds/Clapping Normal.ogg`, category: 'Crowd & Reactions' },
        { name: `Clapping Short`, path: `sounds/Clapping Short.ogg`, category: 'Crowd & Reactions' },
        { name: `Clapping Sus`, path: `sounds/Clapping Sus.ogg`, category: 'Crowd & Reactions' },
        { name: `Crickets`, path: `sounds/Crickets.ogg`, category: 'Crowd & Reactions' },
        { name: `Crowd Aww Cute`, path: `sounds/Crowd Aww Cute.ogg`, category: 'Crowd & Reactions' },
        { name: `Crowd Aww Loss`, path: `sounds/Crowd Aww Loss.ogg`, category: 'Crowd & Reactions' },
        { name: `Crowd Aww Nooo`, path: `sounds/Crowd Aww Nooo.ogg`, category: 'Crowd & Reactions' },
        { name: `Crowd Booo`, path: `sounds/Crowd Booo.ogg`, category: 'Crowd & Reactions' },
        { name: `Evil Laugh`, path: `sounds/Evil Laugh.ogg`, category: 'Crowd & Reactions' },
        { name: `Female scream`, path: `sounds/Female scream.ogg`, category: 'Crowd & Reactions' },
        { name: `Gasp`, path: `sounds/Gasp.ogg`, category: 'Crowd & Reactions' },
        { name: `Ha Ha Ha Shut Up`, path: `sounds/Ha Ha Ha Shut Up.ogg`, category: 'Crowd & Reactions' },
        { name: `Ha Ha Nelson`, path: `sounds/Ha Ha Nelson.ogg`, category: 'Crowd & Reactions' },
        { name: `Laughing`, path: `sounds/Laughing.ogg`, category: 'Crowd & Reactions' },
        { name: `Laughing Clap`, path: `sounds/Laughing Clap.ogg`, category: 'Crowd & Reactions' },
        { name: `Laughing Fo`, path: `sounds/Laughing Fo.ogg`, category: 'Crowd & Reactions' },
        { name: `Laughing One`, path: `sounds/Laughing One.ogg`, category: 'Crowd & Reactions' },
        { name: `Laughing Sitcom`, path: `sounds/Laughing Sitcom.ogg`, category: 'Crowd & Reactions' },
        { name: `Laughing Tree`, path: `sounds/Laughing Tree.ogg`, category: 'Crowd & Reactions' },
        { name: `Laughing Two`, path: `sounds/Laughing Two.ogg`, category: 'Crowd & Reactions' },
        { name: `MotherFucker`, path: `sounds/MotherFucker.ogg`, category: 'Crowd & Reactions' },
        { name: `Ok Lil Jon`, path: `sounds/Ok Lil Jon.ogg`, category: 'Crowd & Reactions' },
        { name: `Sad Trombone`, path: `sounds/Sad Trombone.ogg`, category: 'Crowd & Reactions' },
        { name: `Tim Allen Grunt Home Improvement`, path: `sounds/Tim Allen Grunt Home Improvement.ogg`, category: 'Crowd & Reactions' },
        { name: `Trombone High Pitch`, path: `sounds/Trombone High Pitch.ogg`, category: 'Crowd & Reactions' },
        { name: `Western crowd`, path: `sounds/Western crowd.ogg`, category: 'Crowd & Reactions' },
        { name: `What Lil Jon`, path: `sounds/What Lil Jon.ogg`, category: 'Crowd & Reactions' },
        { name: `Yeah Lil Jon`, path: `sounds/Yeah Lil Jon.ogg`, category: 'Crowd & Reactions' },
        { name: `You Suck You Jackass`, path: `sounds/You Suck You Jackass.ogg`, category: 'Crowd & Reactions' },

        // Gaming (10)
        { name: `Brutal MK`, path: `sounds/Brutal MK.ogg`, category: 'Gaming' },
        { name: `Fatality`, path: `sounds/Fatality.ogg`, category: 'Gaming' },
        { name: `Flawless Victory MK`, path: `sounds/Flawless Victory MK.ogg`, category: 'Gaming' },
        { name: `Metal Gear Alert sus`, path: `sounds/Metal Gear Alert.ogg`, category: 'Gaming' },
        { name: `Mission failed`, path: `sounds/Mission failed.ogg`, category: 'Gaming' },
        { name: `Pac Man Death`, path: `sounds/Pac Man Death.ogg`, category: 'Gaming' },
        { name: `Pokemon`, path: `sounds/Pokemon.ogg`, category: 'Gaming' },
        { name: `Wasted`, path: `sounds/Wasted.ogg`, category: 'Gaming' },
        { name: `Who's that Pokemon`, path: `sounds/Who's that Pokemon.ogg`, category: 'Gaming' },
        { name: `You Lose MK`, path: `sounds/You Lose MK.ogg`, category: 'Gaming' },

        // Animal (19)
        { name: `Camel`, path: `sounds/Camel.ogg`, category: 'Animal' },
        { name: `Cat Angry`, path: `sounds/Cat Angry.ogg`, category: 'Animal' },
        { name: `Chewbaca`, path: `sounds/Chewbaca.ogg`, category: 'Animal' },
        { name: `Dinosaur Groan`, path: `sounds/Dinosaur Groan.ogg`, category: 'Animal' },
        { name: `Dogs`, path: `sounds/Dogs.ogg`, category: 'Animal' },
        { name: `Donkey`, path: `sounds/Donkey.ogg`, category: 'Animal' },
        { name: `Eagle`, path: `sounds/Eagle.ogg`, category: 'Animal' },
        { name: `Elephant`, path: `sounds/Elephant.ogg`, category: 'Animal' },
        { name: `Horse Running`, path: `sounds/Horse Running.ogg`, category: 'Animal' },
        { name: `Horse Whinny`, path: `sounds/Horse Whinny.ogg`, category: 'Animal' },
        { name: `Meow`, path: `sounds/Meow.ogg`, category: 'Animal' },
        { name: `Monkey`, path: `sounds/Monkey.ogg`, category: 'Animal' },
        { name: `Moo`, path: `sounds/Moo.ogg`, category: 'Animal' },
        { name: `Pig`, path: `sounds/Pig.ogg`, category: 'Animal' },
        { name: `Piglet Squel`, path: `sounds/Piglet Squel.ogg`, category: 'Animal' },
        { name: `Puppy`, path: `sounds/Puppy.ogg`, category: 'Animal' },
        { name: `Road Runner`, path: `sounds/Road Runner.ogg`, category: 'Animal' },
        { name: `Sheep`, path: `sounds/Sheep.ogg`, category: 'Animal' },
        { name: `Wolf`, path: `sounds/Wolf.ogg`, category: 'Animal' },

        // Music (70)
        { name: `All Star All Star`, path: `sounds/All Star All Star.ogg`, category: 'Music' },
        { name: `Aye Yi Yi Yi Mex`, path: `sounds/Aye Yi Yi Yi Mex.ogg`, category: 'Music' },
        { name: `Baby Elephant Walk FRIDGE`, path: `sounds/Baby Elephant Walk FRIDGE.ogg`, category: 'Music' },
        { name: `Bad Boys Theme`, path: `sounds/Bad Boys Theme.ogg`, category: 'Music' },
        { name: `Bad to the Bone`, path: `sounds/Bad to the Bone.ogg`, category: 'Music' },
        { name: `Banjo Deliverance`, path: `sounds/Banjo Deliverance.ogg`, category: 'Music' },
        { name: `Benny Hill Chase Silly`, path: `sounds/Benny Hill Chase Silly.ogg`, category: 'Music' },
        { name: `Bill Nye the Science Guy`, path: `sounds/Bill Nye the Science Guy.ogg`, category: 'Music' },
        { name: `Bright Side of Life`, path: `sounds/Bright Side of Life.ogg`, category: 'Music' },
        { name: `Cheers`, path: `sounds/Cheers.ogg`, category: 'Music' },
        { name: `Chinese Intro`, path: `sounds/Chinese Intro.ogg`, category: 'Music' },
        { name: `Come-on-down`, path: `sounds/Come-on-down.ogg`, category: 'Music' },
        { name: `Countdown`, path: `sounds/Countdown.ogg`, category: 'Music' },
        { name: `Curb Enthusiasm`, path: `sounds/Curb Enthusiasm.ogg`, category: 'Music' },
        { name: `Curb-your-enthusiasm`, path: `sounds/Curb-your-enthusiasm.ogg`, category: 'Music' },
        { name: `Dracula Theme`, path: `sounds/Dracula Theme.ogg`, category: 'Music' },
        { name: `Enoch`, path: `sounds/Enoch.ogg`, category: 'Music' },
        { name: `Every Little Thing is Gonna Be Alright`, path: `sounds/Every Little Thing is Gonna Be Alright.ogg`, category: 'Music' },
        { name: `Family Feud Theme`, path: `sounds/Family Feud Theme.ogg`, category: 'Music' },
        { name: `Fox TV Theme`, path: `sounds/Fox TV Theme.ogg`, category: 'Music' },
        { name: `Free credit report`, path: `sounds/Free credit report.ogg`, category: 'Music' },
        { name: `Friends Theme`, path: `sounds/Friends Theme.ogg`, category: 'Music' },
        { name: `Full House`, path: `sounds/Full House.ogg`, category: 'Music' },
        { name: `Gameshow Ending Wacky`, path: `sounds/Gameshow Ending Wacky.ogg`, category: 'Music' },
        { name: `Get Swifty`, path: `sounds/Get Swifty.ogg`, category: 'Music' },
        { name: `Giligans Island Theme`, path: `sounds/Giligans Island Theme.ogg`, category: 'Music' },
        { name: `Godfather Theme`, path: `sounds/Godfather Theme.ogg`, category: 'Music' },
        { name: `Hello and welcome`, path: `sounds/Hello and welcome.ogg`, category: 'Music' },
        { name: `In the Arms of an Angel`, path: `sounds/In the Arms of an Angel.ogg`, category: 'Music' },
        { name: `In the Navy`, path: `sounds/In the Navy.ogg`, category: 'Music' },
        { name: `Inception`, path: `sounds/Inception.ogg`, category: 'Music' },
        { name: `India`, path: `sounds/India.ogg`, category: 'Music' },
        { name: `Irish`, path: `sounds/Irish.ogg`, category: 'Music' },
        { name: `Jammin Bob Marley`, path: `sounds/Jammin Bob Marley.ogg`, category: 'Music' },
        { name: `Jeopardy Theme`, path: `sounds/Jeopardy Theme.ogg`, category: 'Music' },
        { name: `Kells`, path: `sounds/Kells.ogg`, category: 'Music' },
        { name: `Laverne and Shirley Theme`, path: `sounds/Laverne and Shirley Theme.ogg`, category: 'Music' },
        { name: `Let her go`, path: `sounds/Let her go.ogg`, category: 'Music' },
        { name: `Looney Toons Theme`, path: `sounds/Looney Toons Theme.ogg`, category: 'Music' },
        { name: `Mad World`, path: `sounds/Mad World.ogg`, category: 'Music' },
        { name: `Mash Theme`, path: `sounds/Mash Theme.ogg`, category: 'Music' },
        { name: `Mexican`, path: `sounds/Mexican.ogg`, category: 'Music' },
        { name: `Mexican Americans`, path: `sounds/Mexican Americans.ogg`, category: 'Music' },
        { name: `Mingle Game`, path: `sounds/Mingle Game.ogg`, category: 'Music' },
        { name: `Mission Impossible`, path: `sounds/Mission Impossible.ogg`, category: 'Music' },
        { name: `Pinky and The Brain`, path: `sounds/Pinky and The Brain.ogg`, category: 'Music' },
        { name: `Price is right LOSE`, path: `sounds/Price is right LOSE.ogg`, category: 'Music' },
        { name: `Rehab Amy Winehouse`, path: `sounds/Rehab Amy Winehouse.ogg`, category: 'Music' },
        { name: `Right Near the Beach Boi`, path: `sounds/Right Near the Beach Boi.ogg`, category: 'Music' },
        { name: `Roxanne`, path: `sounds/Roxanne.ogg`, category: 'Music' },
        { name: `Roxannel`, path: `sounds/Roxannel.ogg`, category: 'Music' },
        { name: `Sad Violin`, path: `sounds/Sad Violin.ogg`, category: 'Music' },
        { name: `ScoobyDoo`, path: `sounds/ScoobyDoo.ogg`, category: 'Music' },
        { name: `Seinfeld Intro`, path: `sounds/Seinfeld Intro.ogg`, category: 'Music' },
        { name: `Silly Spanish Flea FRIDGE`, path: `sounds/Silly Spanish Flea FRIDGE.ogg`, category: 'Music' },
        { name: `Spongebob Fail`, path: `sounds/Spongebob Fail.ogg`, category: 'Music' },
        { name: `Star Wars Cantina`, path: `sounds/Star Wars Cantina.ogg`, category: 'Music' },
        { name: `Step By Step`, path: `sounds/Step By Step.ogg`, category: 'Music' },
        { name: `Surpnse-supnse`, path: `sounds/Surpnse-supnse.ogg`, category: 'Music' },
        { name: `Tequila`, path: `sounds/Tequila.ogg`, category: 'Music' },
        { name: `The Adams Family Theme`, path: `sounds/The Adams Family Theme.ogg`, category: 'Music' },
        { name: `The Jeffersons Theme`, path: `sounds/The Jeffersons Theme.ogg`, category: 'Music' },
        { name: `The Stripper`, path: `sounds/The Stripper.ogg`, category: 'Music' },
        { name: `Threes Company`, path: `sounds/Threes Company.ogg`, category: 'Music' },
        { name: `Two and half men`, path: `sounds/Two and half men.ogg`, category: 'Music' },
        { name: `Universal Studios`, path: `sounds/Universal Studios.ogg`, category: 'Music' },
        { name: `Vince Tammy`, path: `sounds/Vince Tammy.ogg`, category: 'Music' },
        { name: `Walk like an egyptian`, path: `sounds/Walk like an egyptian.ogg`, category: 'Music' },
        { name: `Why Can't We Be Friends`, path: `sounds/Why Can't We Be Friends.ogg`, category: 'Music' },
        { name: `You Belong To Me`, path: `sounds/You Belong To Me.ogg`, category: 'Music' },

        // General (102) - reduced/trimmed to the provided list
        { name: `2000 Years Later`, path: `sounds/2000 Years Later.ogg`, category: 'General' },
        { name: `Accidents Happen`, path: `sounds/Accidents Happen.ogg`, category: 'General' },
        { name: `Airplane`, path: `sounds/Airplane.ogg`, category: 'General' },
        { name: `All this computer hacking is making me thirsty`, path: `sounds/All this computer hacking is making me thirsty.ogg`, category: 'General' },
        { name: `Are You High or ?`, path: `sounds/Are You High or ?.ogg`, category: 'General' },
        { name: `Are you sure about that`, path: `sounds/Are you sure about that.ogg`, category: 'General' },
        { name: `As long as the matrix exists`, path: `sounds/As long as the matrix exists.ogg`, category: 'General' },
        { name: `Banned from micky mouse club for inappropriate`, path: `sounds/Banned from micky mouse club for inappropriate.ogg`, category: 'General' },
        { name: `Beat up by a guy wearing a dress`, path: `sounds/Beat up by a guy wearing a dress.ogg`, category: 'General' },
        { name: `British`, path: `sounds/British.ogg`, category: 'General' },
        { name: `Can Do Sarcastic`, path: `sounds/Can Do Sarcastic.ogg`, category: 'General' },
        { name: `Can You Dig lt`, path: `sounds/Can You Dig lt.ogg`, category: 'General' },
        { name: `Chicken-jockey`, path: `sounds/Chicken-jockey.ogg`, category: 'General' },
        { name: `Come on man`, path: `sounds/Come on man.ogg`, category: 'General' },
        { name: `Credits Received`, path: `sounds/Credits Received.ogg`, category: 'General' },
        { name: `Crying Baby`, path: `sounds/Crying Baby.ogg`, category: 'General' },
        { name: `CSI Yeah`, path: `sounds/CSI Yeah.ogg`, category: 'General' },
        { name: `Do I look like I know what a Jpeg is`, path: `sounds/Do I look like I know what a Jpeg is.ogg`, category: 'General' },
        { name: `Do you ever look at someone and wonder what they are thinking`, path: `sounds/Do you ever look at someone and wonder what they are thinking.ogg`, category: 'General' },
        { name: `Does he look like a bitch`, path: `sounds/Does he look like a bitch.ogg`, category: 'General' },
        { name: `Eat Shit Derek`, path: `sounds/Eat Shit Derek.ogg`, category: 'General' },
        { name: `English do you speak it`, path: `sounds/English do you speak it.ogg`, category: 'General' },
        { name: `Especially on weed man`, path: `sounds/Especially on weed man.ogg`, category: 'General' },
        { name: `Future army soldier`, path: `sounds/Future army soldier.ogg`, category: 'General' },
        { name: `Fuuuck Long`, path: `sounds/Fuuuck Long.ogg`, category: 'General' },
        { name: `Get er Done`, path: `sounds/Get er Done.ogg`, category: 'General' },
        { name: `Get help`, path: `sounds/Get help.ogg`, category: 'General' },
        { name: `Ghost moan`, path: `sounds/Ghost moan.ogg`, category: 'General' },
        { name: `Gonna Smoke Some Weed`, path: `sounds/Gonna Smoke Some Weed.ogg`, category: 'General' },
        { name: `He He Jackson`, path: `sounds/He He Jackson.ogg`, category: 'General' },
        { name: `Helicopter`, path: `sounds/Helicopter.ogg`, category: 'General' },
        { name: `Hell naw`, path: `sounds/Hell naw.ogg`, category: 'General' },
        { name: `Hoo wee what a cliffhanger`, path: `sounds/Hoo wee what a cliffhanger.ogg`, category: 'General' },
        { name: `How Dare You`, path: `sounds/How Dare You.ogg`, category: 'General' },
        { name: `How Good of You to Join Us Bane`, path: `sounds/How Good of You to Join Us Bane.ogg`, category: 'General' },
        { name: `How it feels to chew 5 gum`, path: `sounds/How it feels to chew 5 gum.ogg`, category: 'General' },
        { name: `I can't take it anymore`, path: `sounds/I can't take it anymore.ogg`, category: 'General' },
        { name: `I cant hear anything`, path: `sounds/I cant hear anything.ogg`, category: 'General' },
        { name: `I Caramba Bart`, path: `sounds/I Caramba Bart.ogg`, category: 'General' },
        { name: `I dont give a fuuu`, path: `sounds/I dont give a fuuu.ogg`, category: 'General' },
        { name: `I have to fufill my purpose so I can go away`, path: `sounds/I have to fufill my purpose so I can go away.ogg`, category: 'General' },
        { name: `I think moto like you`, path: `sounds/I think moto like you.ogg`, category: 'General' },
        { name: `I thought this was america`, path: `sounds/I thought this was america.ogg`, category: 'General' },
        { name: `I thought we had a deal`, path: `sounds/I thought we had a deal.ogg`, category: 'General' },
        { name: `I-am-steve`, path: `sounds/I-am-steve.ogg`, category: 'General' },
        { name: `I've always been here for you guys and I always will be`, path: `sounds/I've always been here for you guys and I always will be.ogg`, category: 'General' },
        { name: `I've been doing martial arts my whole life I dont wanna fight`, path: `sounds/I've been doing martial arts my whole life I dont wanna fight.ogg`, category: 'General' },
        { name: `I've Fallen and I can't get up`, path: `sounds/I've Fallen and I can't get up.ogg`, category: 'General' },
        { name: `Jade Pussycat`, path: `sounds/Jade Pussycat.ogg`, category: 'General' },
        { name: `Just do it`, path: `sounds/Just do it.ogg`, category: 'General' },
        { name: `Ladies and Gentlemen we got em`, path: `sounds/Ladies and Gentlemen we got em.ogg`, category: 'General' },
        { name: `Limit on Talking`, path: `sounds/Limit on Talking.ogg`, category: 'General' },
        { name: `Lot of perverts in here`, path: `sounds/Lot of perverts in here.ogg`, category: 'General' },
        { name: `My name Jeff`, path: `sounds/My name Jeff.ogg`, category: 'General' },
        { name: `Obama if we are racist`, path: `sounds/Obama if we are racist.ogg`, category: 'General' },
        { name: `Ohhh La La`, path: `sounds/Ohhh La La.ogg`, category: 'General' },
        { name: `Radar`, path: `sounds/Radar.ogg`, category: 'General' },
        { name: `Smoke Weed Everyday`, path: `sounds/Smoke Weed Everyday.ogg`, category: 'General' },
        { name: `Thats a lot of Nuts`, path: `sounds/Thats a lot of Nuts.ogg`, category: 'General' },
        { name: `Thats What She Said`, path: `sounds/Thats What She Said.ogg`, category: 'General' },
        { name: `The more you know`, path: `sounds/The more you know.ogg`, category: 'General' },
        { name: `Tree Fiddy`, path: `sounds/Tree Fiddy.ogg`, category: 'General' },
        { name: `Well Be Right Back`, path: `sounds/Well Be Right Back.ogg`, category: 'General' },
        { name: `Were here to help`, path: `sounds/Were here to help.ogg`, category: 'General' },
        { name: `What are you people on dope`, path: `sounds/What are you people on dope.ogg`, category: 'General' },
        { name: `What da dog do`, path: `sounds/What da dog do.ogg`, category: 'General' },
        { name: `What do you mean funny funny how`, path: `sounds/What do you mean funny funny how.ogg`, category: 'General' },
        { name: `What is That Joke`, path: `sounds/What is That Joke.ogg`, category: 'General' },
        { name: `What the hell is going on here exactly`, path: `sounds/What the hell is going on here exactly.ogg`, category: 'General' },
        { name: `What the hell is wrong with you people`, path: `sounds/What the hell is wrong with you people.ogg`, category: 'General' },
        { name: `Whats the sound of one hand clapping`, path: `sounds/Whats the sound of one hand clapping.ogg`, category: 'General' },
        { name: `Where is the lamb sauce`, path: `sounds/Where is the lamb sauce.ogg`, category: 'General' },
        { name: `Wheres the rest of my meth`, path: `sounds/Wheres the rest of my meth.ogg`, category: 'General' },
        { name: `White Dude for Harris`, path: `sounds/White Dude for Harris.ogg`, category: 'General' },
        { name: `Who is your daddy and what does he do`, path: `sounds/Who is your daddy and what does he do.ogg`, category: 'General' },
        { name: `Who the Hell Cares`, path: `sounds/Who the Hell Cares.ogg`, category: 'General' },
        { name: `Why in the fuck would I do that`, path: `sounds/Why in the fuck would I do that.ogg`, category: 'General' },
        { name: `WoHoo Homer`, path: `sounds/WoHoo Homer.ogg`, category: 'General' },
        { name: `Woodpecker`, path: `sounds/Woodpecker.ogg`, category: 'General' },
        { name: `Wow`, path: `sounds/Wow.ogg`, category: 'General' },
        { name: `Wow Dude`, path: `sounds/Wow Dude.ogg`, category: 'General' },
        { name: `Wow kid`, path: `sounds/Wow kid.ogg`, category: 'General' },
        { name: `Ya Science`, path: `sounds/Ya Science.ogg`, category: 'General' },
        { name: `Yahoo`, path: `sounds/Yahoo.ogg`, category: 'General' },
        { name: `Yeah Probably`, path: `sounds/Yeah Probably.ogg`, category: 'General' },
        { name: `Yeah So What`, path: `sounds/Yeah So What.ogg`, category: 'General' },
        { name: `Yeah this is gonna help with that bitch`, path: `sounds/Yeah this is gonna help with that bitch.ogg`, category: 'General' },
        { name: `Yippeee`, path: `sounds/Yippeee.ogg`, category: 'General' },
        { name: `You Can Do lt`, path: `sounds/You Can Do lt.ogg`, category: 'General' },
        { name: `You Have Smoked Yourself Retarded`, path: `sounds/You Have Smoked Yourself Retarded.ogg`, category: 'General' },
        { name: `You Wanna Get High`, path: `sounds/You Wanna Get High.ogg`, category: 'General' },
        { name: `Your Rights Are My Responsibilities`, path: `sounds/Your Rights Are My Responsibilities.ogg`, category: 'General' },

        // Trumpism (10)
        { name: `Americas going to be great again gang`, path: `sounds/Americas going to be great again gang.ogg`, category: 'Trumpism' },
        { name: `Bing bing bong Thomas the train and Donald Trump`, path: `sounds/Bing bing bong Thomas the train and Donald Trump.ogg`, category: 'Trumpism' },
        { name: `Bomb the shit out of them Trump`, path: `sounds/Bomb the shit out of them Trump.ogg`, category: 'Trumpism' },
        { name: `Congratulations Trump`, path: `sounds/Congratulations Trump.ogg`, category: 'Trumpism' },
        { name: `Hackings Bad Trump`, path: `sounds/Hackings Bad Trump.ogg`, category: 'Trumpism' },
        { name: `I am a Millionaire - Trump`, path: `sounds/I am a Millionaire - Trump.ogg`, category: 'Trumpism' },
        { name: `I don't remember Trump`, path: `sounds/I don't remember Trump.ogg`, category: 'Trumpism' },
        { name: `I really have nothing better to do Trump`, path: `sounds/I really have nothing better to do Trump.ogg`, category: 'Trumpism' },
        { name: `Will I pay a lot of tax Trump`, path: `sounds/Will I pay a lot of tax Trump.ogg`, category: 'Trumpism' },
        { name: `Your Fired Trump`, path: `sounds/Your Fired Trump.ogg`, category: 'Trumpism' },
    ];
    // start the runtime list from the canonical defaults
    let sounds = DEFAULT_SOUNDS.slice();

    // --- Category icon mapping ---
    const categoryIcons = {
        "General": "🔊",
        "Sound Effects": "✨",
        "Music": "🎵",
        "Crowd & Reactions": "👏",
        "Gaming": "🎮",
        "Trumpism": "🇺🇸",
        "Money": "💰",
        "Adult": "🔞",
        "Bodily Functions": "💨",
        "Uncategorized": "❓",
        "no category": "❓"
    };

    // --- Category Group Order Logic ---
    const DEFAULT_CATEGORY_ORDER = ['Money','Drums','Sound Effects','Adult','Crowd & Reactions','Gaming','Animal','Music','General','Trumpism'];
    let categoryOrder = DEFAULT_CATEGORY_ORDER.slice();

    function getAllCategories() {
        const cats = [];
        sounds.forEach(s => {
            if (s.category && !cats.includes(s.category)) cats.push(s.category);
        });
        return cats;
    }

    function updateCategoryOrderFromSounds() {
        // Only add new categories to the end, never reorder existing ones
        const allCats = getAllCategories();
        allCats.forEach(cat => {
            if (!categoryOrder.includes(cat)) categoryOrder.push(cat);
        });
        // Remove deleted categories
        categoryOrder = categoryOrder.filter(cat => allCats.includes(cat));
    }

    // --- Persistence helpers ---
    const STORAGE_KEY = 'soundboard3_sounds';
    const CATEGORY_ORDER_KEY = 'soundboard3_category_order';

    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sounds));
        localStorage.setItem(CATEGORY_ORDER_KEY, JSON.stringify(categoryOrder));
    }

    function loadState() {
        // Start from canonical defaults, then merge persisted edits (color/textColor/category/order)
        try {
            const savedSounds = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            const savedOrder = JSON.parse(localStorage.getItem(CATEGORY_ORDER_KEY) || 'null');

            // Start from canonical defaults
            sounds = DEFAULT_SOUNDS.slice();
            categoryOrder = DEFAULT_CATEGORY_ORDER.slice();

            // Restore saved category order if present
            if (Array.isArray(savedOrder) && savedOrder.length) {
                categoryOrder = savedOrder.slice();
            }

            // Merge saved sound edits (match by path, fallback to name)
            if (Array.isArray(savedSounds) && savedSounds.length) {
                const savedMap = new Map();
                savedSounds.forEach(s => {
                    if (!s) return;
                    if (s.path) savedMap.set(s.path, s);
                    else if (s.name) savedMap.set('name:' + s.name, s);
                });
                sounds.forEach((def, idx) => {
                    const saved = savedMap.get(def.path) || savedMap.get('name:' + def.name);
                    if (saved) {
                        if (typeof saved.color !== 'undefined') sounds[idx].color = saved.color;
                        if (typeof saved.textColor !== 'undefined') sounds[idx].textColor = saved.textColor;
                        if (typeof saved.category !== 'undefined') sounds[idx].category = saved.category;
                    }
                });
            }

            // Persist merged state back so localStorage remains in sync
            saveState();
        } catch (e) {
            // If anything fails, fall back to canonical defaults and persist
            sounds = DEFAULT_SOUNDS.slice();
            categoryOrder = DEFAULT_CATEGORY_ORDER.slice();
            saveState();
        }
    }

    // --- Category Order Editor ---
    function renderCategoryOrderEditor() {
        // Create or update a modal for editing category order
        let modal = document.getElementById('category-order-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'category-order-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content" style="max-width:400px;">
                    <span class="close" id="category-order-modal-close">&times;</span>
                    <h2>Edit Category Order</h2>
                    <ul id="category-order-list" style="list-style:none;padding:0;margin:0;"></ul>
                    <div style="margin-top:16px;display:flex;gap:8px;">
                        <button id="category-order-save">Save</button>
                        <button id="category-order-cancel">Cancel</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        // Populate list
        const list = modal.querySelector('#category-order-list');
        list.innerHTML = '';
        categoryOrder.forEach((cat, idx) => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.alignItems = 'center';
            li.style.gap = '8px';
            li.style.marginBottom = '6px';
            li.innerHTML = `
                <span class="cat-name" style="flex:1">${cat}</span>
                 <button type="button" class="cat-up" ${idx === 0 ? 'disabled' : ''}>&#8593;</button>
                 <button type="button" class="cat-down" ${idx === categoryOrder.length - 1 ? 'disabled' : ''}>&#8595;</button>
                 <button type="button" class="cat-delete" style="color:#c00;background:none;border:none;font-size:18px;cursor:pointer;" title="Delete Category">&#10006;</button>
             `;
            // Move up/down handlers
            li.querySelector('.cat-up').onclick = () => {
                if (idx > 0) {
                    [categoryOrder[idx - 1], categoryOrder[idx]] = [categoryOrder[idx], categoryOrder[idx - 1]];
                    renderCategoryOrderEditor();
                }
            };
            li.querySelector('.cat-down').onclick = () => {
                if (idx < categoryOrder.length - 1) {
                    [categoryOrder[idx + 1], categoryOrder[idx]] = [categoryOrder[idx], categoryOrder[idx + 1]];
                    renderCategoryOrderEditor();
                }
            };
            // Delete handler
            li.querySelector('.cat-delete').onclick = () => {
                // Remove category from order
                const catToDelete = categoryOrder[idx];
                categoryOrder.splice(idx, 1);
                // Remove category from all sounds
                sounds.forEach(s => {
                    if (s.category === catToDelete) s.category = undefined;
                });
                renderCategoryOrderEditor();
                renderSoundButtons();
                saveState();
            };
            list.appendChild(li);
        });

        // Modal controls
        modal.style.display = 'flex';
        modal.querySelector('#category-order-modal-close').onclick = () => { modal.style.display = 'none'; };
        modal.querySelector('#category-order-cancel').onclick = () => { modal.style.display = 'none'; };
        modal.querySelector('#category-order-save').onclick = () => {
            modal.style.display = 'none';
            renderSoundButtons();
            saveState();
        };
    }

    // --- Shared palette used for both button background and text color dropdowns
    const PALETTE = [
        { label: 'Default', value: '' },
        { label: 'White',   value: '#ffffff' },
        { label: 'Black',   value: '#000000' },
        { label: 'Dark',    value: '#232b39' },
        { label: 'Gray',    value: '#49536b' },
        { label: 'Blue',    value: '#4f8cff' },
        { label: 'Red',     value: '#ff5252' },
        { label: 'Yellow',  value: '#ffc107' },
        { label: 'Green',   value: '#00e676' },
        { label: 'Purple',  value: '#e040fb' },
        { label: 'Orange',  value: '#ff6f00' }
    ];

    // --- Fast lookup for sounds by name/path ---
    let soundMap = new Map();
    function updateSoundMap() {
        soundMap.clear();
        sounds.forEach(s => soundMap.set(s.path, s));
    }

    // --- Track which button is playing which audio ---
    const buttonAudioMap = new Map();

    // --- Preload all sounds in parallel, only once per path ---
    // Map of successfully preloaded Audio objects (originalPath -> Audio)
    const preloadedAudio = new Map();
    // Map of encoded/actual src -> originalPath (so encoded loads can be looked up by original path)
    const preloadedEncodedToOriginal = new Map();
    // Set of paths that have failed preload attempts (to avoid repeated warnings)
    const failedPreloads = new Set();

    // Return candidate srcs to try loading for a given original path.
    function candidateSrcsFor(path) {
        const list = [path];
        try {
            const enc = encodeURI(path);
            if (enc && !list.includes(enc)) list.push(enc);
            // also try replacing spaces explicitly (some systems use unencoded spaces)
            const spaces = path.replace(/ /g, '%20');
            if (spaces && !list.includes(spaces)) list.push(spaces);
        } catch (e) { /* ignore */ }
        return list;
    }

    function preloadAllSounds() {
        const uniquePaths = Array.from(new Set(sounds.map(s => s.path).filter(Boolean)));
        uniquePaths.forEach(async (originalPath) => {
            if (!originalPath || preloadedAudio.has(originalPath) || failedPreloads.has(originalPath)) return;

            const candidates = candidateSrcsFor(originalPath);
            let succeeded = false;

            for (const srcCandidate of candidates) {
                // skip blob/data urls for HEAD checks; let audio handle blob: directly
                try {
                    const audio = new Audio();
                    audio.preload = 'auto';
                    audio.src = srcCandidate;

                    const loaded = await new Promise((resolve) => {
                        let done = false;
                        const onSuccess = () => { if (!done) { done = true; resolve({ ok: true, audio }); } };
                        const onError = () => { if (!done) { done = true; resolve({ ok: false }); } };
                        audio.addEventListener('canplaythrough', onSuccess, { once: true });
                        audio.addEventListener('error', onError, { once: true });
                        // fallback timeout
                        setTimeout(() => { if (!done) { done = true; resolve({ ok: false }); } }, 4500);
                        try { audio.load(); } catch (e) { /* ignore */ }
                    });

                    if (loaded.ok) {
                        // store under originalPath; also remember which src was successful
                        preloadedAudio.set(originalPath, loaded.audio);
                        preloadedEncodedToOriginal.set(srcCandidate, originalPath);
                        // also map the encodeURI(originalPath) to originalPath if different
                        try {
                            const enc = encodeURI(originalPath);
                            if (enc !== srcCandidate) preloadedEncodedToOriginal.set(enc, originalPath);
                        } catch (e) { /* ignore */ }
                        console.debug('Preloaded audio for', originalPath, 'via', srcCandidate);
                        succeeded = true;
                        break;
                    }
                } catch (err) {
                    // continue to next candidate
                }
            }

            if (!succeeded) {
                failedPreloads.add(originalPath);
                console.warn('Preload failed for', originalPath, '- tried variants:', candidates);
            }
        });
    }

    // --- Helper: check if audio is playable before playing ---
    function canPlayAudio(path) {
        if (!path) return false;
        const ext = path.split('.').pop().toLowerCase();
        const testAudio = document.createElement('audio');
        let mime = '';
        if (ext === 'ogg') mime = 'audio/ogg';
        else if (ext === 'mp3') mime = 'audio/mpeg';
        else if (ext === 'wav') mime = 'audio/wav';
        else if (ext === 'm4a') mime = 'audio/mp4';
        return testAudio.canPlayType(mime) !== '';
    }

    // --- Main render logic ---
    function renderSoundButtons() {
        updateCategoryOrderFromSounds();
        updateSoundMap();
        const list = getFilteredSounds();
        soundboardGrid.innerHTML = '';

        if (!currentSort) currentSort = 'name';
        if (!currentCategory) currentCategory = 'all';
        if (typeof currentSearch === 'undefined') currentSearch = '';

        // --- Add "no category" to categoryOrder if not present ---
        if (!categoryOrder.includes("no category")) {
            categoryOrder.push("no category");
        }

        // Grouped by category block
        if (currentSort === 'category' && currentCategory === 'all' && !currentSearch) {
            categoryOrder.forEach(cat => {
                // Special handling for "no category"
                let group;
                if (cat === "no category") {
                    group = list.filter(sound => !sound.category || sound.category.trim() === "");
                } else {
                    group = list.filter(sound => sound.category === cat);
                }
                if (group.length > 0) {
                    const block = document.createElement('section');
                    block.className = 'category-block';

                    // Header (compact: no emoji or counts displayed)
                    const header = document.createElement('div');
                    header.className = 'category-header';
                    header.setAttribute('data-category', cat);
                    // keep the category name as a tooltip only
                    header.title = cat;
                    block.appendChild(header);

                    // Sound grid
                    const grid = document.createElement('div');
                    grid.className = 'category-sound-grid';
                    group.forEach(sound => {
                        const idx = sounds.indexOf(sound);
                        const button = createSoundButton(sound, idx);
                        button.setAttribute('data-category', cat);
                        if (!editMode) {
                            button.onclick = () => playOrStopSound(sound.path, button);
                        }
                        grid.appendChild(button);
                    });
                    block.appendChild(grid);
                    soundboardGrid.appendChild(block);
                }
            });
            // Show uncategorized at the end
            const uncategorized = list.filter(sound => !sound.category);
            if (uncategorized.length > 0) {
                const block = document.createElement('section');
                block.className = 'category-block';
                const header = document.createElement('div');
                header.className = 'category-header';
                header.setAttribute('data-category', 'Uncategorized');
                // tooltip only
                header.title = 'Uncategorized';
                block.appendChild(header);

                const grid = document.createElement('div');
                grid.className = 'category-sound-grid';
                uncategorized.forEach(sound => {
                    const idx = sounds.indexOf(sound);
                    const button = createSoundButton(sound, idx);
                    button.setAttribute('data-category', 'Uncategorized');
                    // --- Fix: Always attach a click handler to playOrStopSound ---
                    if (!editMode) {
                        button.onclick = () => playOrStopSound(sound.path, button);
                    }
                    grid.appendChild(button);
                });
                block.appendChild(grid);
                soundboardGrid.appendChild(block);
            }
        } else {
            // Flat grid for search/filter
            const block = document.createElement('section');
            block.className = 'category-block';
            const grid = document.createElement('div');
            grid.className = 'category-sound-grid';
            list.forEach((sound, idx) => {
                // Assign "no category" for display if missing
                const cat = sound.category && sound.category.trim() ? sound.category : "no category";
                const button = createSoundButton(sound, sounds.indexOf(sound));
                button.setAttribute('data-category', cat);
                if (!editMode) {
                    button.onclick = () => playOrStopSound(sound.path, button);
                }
                grid.appendChild(button);
            });
            block.appendChild(grid);
            soundboardGrid.appendChild(block);
        }
        populateCategoryFilter();
        saveState();
        // Do NOT call preloadAllSounds here for every render!
    }

    // --- Category filter population ---
    function populateCategoryFilter() {
        const prev = lastSelectedCategory || categorySelect.value;
        // Show all categories from all sounds
        const categories = Array.from(new Set(sounds.map(s => s.category && s.category.trim() ? s.category : "no category")));
        categorySelect.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            categorySelect.appendChild(opt);
        });
        // Append edit option at the end of the dropdown
        const editOpt = document.createElement('option');
        editOpt.value = '__edit_order__';
        editOpt.textContent = 'Edit Category Order...';
        categorySelect.appendChild(editOpt);
        // Restore previous selection if valid, otherwise default to 'all'
        if (prev && (prev === 'all' || categories.includes(prev))) {
            categorySelect.value = prev;
        } else {
            categorySelect.value = 'all';
        }
        lastSelectedCategory = categorySelect.value;
    }

    // --- Helper: getFilteredSounds ---
    function getFilteredSounds() {
        let list = sounds;
        if (currentSearch && currentSearch.trim() !== '') {
            const searchTerm = currentSearch.toLowerCase();
            list = list.filter(sound => sound.name.toLowerCase().includes(searchTerm));
        }
        if (currentCategory !== 'all') {
            if (currentCategory === "no category") {
                list = list.filter(sound => !sound.category || sound.category.trim() === "");
            } else {
                list = list.filter(sound => sound.category === currentCategory);
            }
        }
        // Sort
        if (currentSort === 'name') {
            list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        } else if (currentSort === 'category') {
            list = [...list].sort((a, b) => {
                const idxA = a.category ? categoryOrder.indexOf(a.category) : categoryOrder.indexOf("no category");
                const idxB = b.category ? categoryOrder.indexOf(b.category) : categoryOrder.indexOf("no category");
                if (idxA === idxB) {
                    return a.name.localeCompare(b.name);
                }
                return idxA - idxB;
            });
        }
        return list;
    }

    function createSoundButton(sound, idx) {
        const button = document.createElement('button');
        button.classList.add('sound-button');
        button.textContent = sound.name;
        button.dataset.soundPath = sound.path;
        button.dataset.soundName = sound.name;
        if (sound.color) button.style.backgroundColor = sound.color;
        button.style.color = sound.textColor || "#fff";
        button.style.textShadow = "1.5px 1.5px 0 #222, 0 2.5px 8px #000a, 0 0 2px #fff";
        if (editMode) {
            button.style.outline = '2px dashed #007bff';
            button.title = 'Click to edit';
            // compute index at click time to avoid stale indices
            button.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                openEditModal(sound, sounds.indexOf(sound));
            };
        } else {
            button.style.outline = '';
            button.title = '';
            // Attach play/stop handler
            button.onclick = () => playOrStopSound(sound.path, button);
        }
        return button;
    }

    // --- Play or stop sound for a button ---
    function playOrStopSound(soundPath, button) {
        if (editMode) return;

        // If this button is already playing, stop it
        if (buttonAudioMap.has(button)) {
            const audio = buttonAudioMap.get(button);
            audio.pause();
            audio.currentTime = 0;
            button.classList.remove('playing');
            buttonAudioMap.delete(button);
            return;
        }

        if (!soundPath) {
            alert('No sound file specified.');
            return;
        }

        // Build candidate path variants to try when a path may not exactly match the file name.
        function candidatePaths(orig) {
            const variants = [];
            variants.push(orig);
            try {
                const idx = orig.lastIndexOf('.');
                const base = idx !== -1 ? orig.slice(0, idx) : orig;
                const ext = idx !== -1 ? orig.slice(idx) : '';
                // common fallbacks: remove " sus", remove trailing words like "sus", collapse multiple spaces, strip certain punctuation
                const cleaned1 = base.replace(/\s+sus$/i, '').trim(); // remove trailing "sus"
                const cleaned2 = base.replace(/\ssus\s?/ig, ' ').replace(/\s{2,}/g, ' ').trim(); // remove "sus" anywhere
                const cleaned3 = base.replace(/[?!"'’]/g, '').trim();
                const cleaned4 = base.replace(/\s{2,}/g, ' ').trim();
                [cleaned1, cleaned2, cleaned3, cleaned4].forEach(b => {
                    if (b && (b + ext) !== orig && !variants.includes(b + ext)) variants.push(b + ext);
                });
                // also try removing parentheses content
                const noParen = base.replace(/\s*\(.*?\)\s*/g, '').trim();
                if (noParen && (noParen + ext) !== orig && !variants.includes(noParen + ext)) variants.push(noParen + ext);
            } catch (e) { /* noop */ }
            return variants;
        }

        // Try each candidate path until one plays
        const candidates = candidatePaths(soundPath);
        let played = false;
        let lastAudio = null;

        const tryNext = (i) => {
            if (i >= candidates.length) {
                // All attempts failed
                button.classList.remove('playing');
                buttonAudioMap.delete(button);
                alert('Failed to play sound. Tried multiple filename variants. Check that the sound file exists in the sounds/ folder and matches the expected name.');
                console.warn('Tried candidates:', candidates);
                return;
            }
            const path = candidates[i];
            let audio = null;
            // If we preloaded the original path (or an encoded variant), use the preloaded Audio clone
            const tryGetPreloaded = (p) => {
                if (preloadedAudio.has(p)) return preloadedAudio.get(p).cloneNode(false);
                const enc = (() => { try { return encodeURI(p); } catch (e) { return null; } })();
                if (enc && preloadedEncodedToOriginal.has(enc)) {
                    const orig = preloadedEncodedToOriginal.get(enc);
                    if (preloadedAudio.has(orig)) return preloadedAudio.get(orig).cloneNode(false);
                }
                // also check if an encoded form itself was stored as a key
                if (preloadedAudio.has(enc)) return preloadedAudio.get(enc).cloneNode(false);
                return null;
            };
            audio = tryGetPreloaded(path);
            if (audio) {
                // ensure src is set to candidate so playback uses same resolved URL if needed
                try { audio.src = (audio.src || path); } catch (e) { /* ignore */ }
            } else {
                audio = new Audio(path);
            }

            // attach lightweight error logging
            const onError = () => {
                audio.removeEventListener('error', onError);
                audio.removeEventListener('canplay', onCanPlay);
                tryNext(i + 1);
            };
            const onCanPlay = () => {
                audio.removeEventListener('error', onError);
                audio.removeEventListener('canplay', onCanPlay);
                // attempt to play
                audio.play().then(() => {
                    played = true;
                    button.classList.add('playing');
                    buttonAudioMap.set(button, audio);
                    // cleanup listeners
                    audio.addEventListener('ended', () => {
                        button.classList.remove('playing');
                        buttonAudioMap.delete(button);
                    });
                    audio.addEventListener('pause', () => {
                        button.classList.remove('playing');
                        buttonAudioMap.delete(button);
                    });
                }).catch((err) => {
                    // couldn't play this candidate; try next
                    console.warn('Play rejected for', path, err && err.message);
                    tryNext(i + 1);
                });
            };
            audio.addEventListener('error', onError);
            audio.addEventListener('canplay', onCanPlay);
            // Some browsers won't fire canplay for remote blobs; try immediate play attempt after short timeout
            setTimeout(() => {
                // If not already handled by canplay/error, try to play once — will go to catch and then try next
                if (!played) {
                    audio.play().then(() => {
                        played = true;
                        button.classList.add('playing');
                        buttonAudioMap.set(button, audio);
                        audio.addEventListener('ended', () => {
                            button.classList.remove('playing');
                            buttonAudioMap.delete(button);
                        });
                        audio.addEventListener('pause', () => {
                            button.classList.remove('playing');
                            buttonAudioMap.delete(button);
                        });
                    }).catch(() => {
                        // wait for error/canplay handlers to trigger fallback
                    });
                }
            }, 60);
        };

        // mark UI as trying to play
        button.classList.add('playing');
        tryNext(0);
    }

    // --- Edit mode toggle ---
    editButton.addEventListener('click', () => {
        editMode = !editMode;
        editButton.classList.toggle('active', editMode);
        renderSoundButtons();
    });

    // --- Sticky header scrolled state ---
    const headerEl = document.querySelector('header.controls');
    if (headerEl) {
        const onScroll = () => {
            headerEl.classList.toggle('scrolled', window.scrollY > 8);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        // initialize
        onScroll();
    }

    // --- File upload functionality ---
    fileUploadInput.addEventListener('change', (event) => {
        const files = Array.from(event.target.files);
        files.forEach(file => {
            if (!file.type.startsWith('audio/')) return;
            const url = URL.createObjectURL(file);
            let baseName = file.name.replace(/\.[^/.]+$/, "");
            let name = baseName;
            let counter = 1;
            while (sounds.some(s => s.name === name)) {
                name = `${baseName} (${counter++})`;
            }
            sounds.push({
                name,
                path: url,
                category: undefined
            });
            updateCategoryOrderFromSounds();
        });
        renderSoundButtons();
        saveState();
        fileUploadInput.value = '';
        // Preload newly uploaded sounds (preloadAllSounds will skip already-preloaded or failed paths)
        preloadAllSounds();
    });

    // --- Stop All functionality ---
    stopAllButton.addEventListener('click', () => {
        // Stop all currently playing audios
        buttonAudioMap.forEach((audio, button) => {
            audio.pause();
            audio.currentTime = 0;
            button.classList.remove('playing');
        });
        buttonAudioMap.clear();
    });

    // --- Controls event listeners ---
    searchInput.addEventListener('input', () => {
        currentSearch = searchInput.value;
        renderSoundButtons();
    });
    categorySelect.addEventListener('change', () => {
        const val = categorySelect.value;
        if (val === '__edit_order__') {
            // Open category order editor and restore previous selection
            updateCategoryOrderFromSounds();
            renderCategoryOrderEditor();
            // restore
            categorySelect.value = lastSelectedCategory || 'all';
            return;
        }
        lastSelectedCategory = val;
        currentCategory = val;
        renderSoundButtons();
    });

    // --- Category order modal, persistence, etc. ---
    // On load, restore state
    loadState();
    updateSoundMap();
    renderSoundButtons();
    preloadAllSounds();

    function openEditModal(sound, idx) {
        editIdx = idx;
        document.getElementById('edit-sound-name').value = sound.name;

        // Category dropdown:
        const categorySelect = document.getElementById('edit-sound-category');
        const categoryCustom = document.getElementById('edit-sound-category-custom');
        // Ensure we have an up-to-date categoryOrder
        updateCategoryOrderFromSounds();
        // Populate select: (No category) + known categories + Custom...
        categorySelect.innerHTML = '';
        const noneOpt = document.createElement('option');
        noneOpt.value = '';
        noneOpt.textContent = '(No category)';
        categorySelect.appendChild(noneOpt);
        categoryOrder.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            categorySelect.appendChild(opt);
        });
        const customOpt = document.createElement('option');
        customOpt.value = '__custom__';
        customOpt.textContent = 'Custom...';
        categorySelect.appendChild(customOpt);

        // Set initial values and show/hide custom input as appropriate
        if (sound.category && categoryOrder.includes(sound.category)) {
            categorySelect.value = sound.category;
            categoryCustom.value = '';
            categoryCustom.style.display = 'none';
        } else if (sound.category) {
            // unknown category -> treat as custom
            categorySelect.value = '__custom__';
            categoryCustom.value = sound.category;
            categoryCustom.style.display = 'inline';
        } else {
            categorySelect.value = '';
            categoryCustom.value = '';
            categoryCustom.style.display = 'none';
        }

        // Toggle custom input when user picks "Custom..."
        categorySelect.onchange = function () {
            if (this.value === '__custom__') {
                categoryCustom.style.display = 'inline';
                categoryCustom.focus();
            } else {
                categoryCustom.style.display = 'none';
            }
        };

        // --- Color dropdown / preview ---
        const colorSelect = document.getElementById('edit-sound-color-select');
        const textColorSelect = document.getElementById('edit-sound-textcolor');
        const colorPreview = document.getElementById('edit-color-preview');
        // defensive guards: bail early if modal elements are missing (prevents exceptions)
        if (!colorSelect || !textColorSelect || !colorPreview) {
            // still open the modal but skip palette population if elements are missing
            document.getElementById('edit-modal').style.display = 'flex';
        } else {
            // Populate both selects from the shared PALETTE so options match
            if (colorSelect) {
                colorSelect.innerHTML = '';
                PALETTE.forEach(p => {
                    const opt = document.createElement('option');
                    opt.value = p.value;
                    opt.textContent = p.label;
                    colorSelect.appendChild(opt);
                });
            }
            if (textColorSelect) {
                textColorSelect.innerHTML = '';
                PALETTE.forEach(p => {
                    // For text dropdown show color name; include 'Default' as a valid choice
                    const opt = document.createElement('option');
                    opt.value = p.value || '#ffffff'; // treat '' as white default for text dropdown
                    opt.textContent = p.label;
                    textColorSelect.appendChild(opt);
                });
            }
            // Set selected values from existing sound data
            if (colorSelect) colorSelect.value = sound.color || '';
            if (textColorSelect) textColorSelect.value = sound.textColor || '#ffffff';

             // show preview square and a sample letter to preview text color
             colorPreview.style.backgroundColor = sound.color || 'transparent';
             colorPreview.style.display = 'inline-flex';
             colorPreview.style.alignItems = 'center';
             colorPreview.style.justifyContent = 'center';
             colorPreview.style.fontWeight = '700';
             colorPreview.style.fontSize = '12px';
             colorPreview.textContent = 'A';
             // set preview text color from sound.textColor (if set)
             colorPreview.style.color = sound.textColor || '#ffffff';

        // If user picks a button color, also set the text color select to that value (per your request)
        colorSelect.onchange = function () {
            const v = this.value;
            colorPreview.style.backgroundColor = v || 'transparent';
            if (v) {
                textColorSelect.value = v;
                colorPreview.style.color = v;
            }
        };

        // Wire text color change to update preview text color
        textColorSelect.onchange = function () {
            colorPreview.style.color = this.value || '#ffffff';
        };

        document.getElementById('edit-modal').style.display = 'flex';
        } // end defensive guard block for modal elements

        // Enable move buttons and wire handlers so the user can reorder while editing
        const moveUpBtn = document.getElementById('move-up-btn');
        const moveDownBtn = document.getElementById('move-down-btn');
        const refreshModalFields = () => {
            const cur = sounds[editIdx];
            document.getElementById('edit-sound-name').value = cur.name || '';
            // update color selects/previews
            const colorSel = document.getElementById('edit-sound-color-select');
            const colorPreview = document.getElementById('edit-color-preview');
            if (colorSel) colorSel.value = cur.color || '';
            if (colorPreview) {
                colorPreview.style.backgroundColor = cur.color || 'transparent';
                colorPreview.style.color = cur.textColor || '#ffffff';
                colorPreview.textContent = 'A';
            }
            if (textColorSelect) textColorSelect.value = cur.textColor || '#ffffff';
            // update category fields
            const categorySelectEl = document.getElementById('edit-sound-category');
            const categoryCustomEl = document.getElementById('edit-sound-category-custom');
            if (cur.category && Array.from(categorySelectEl.options).some(o => o.value === cur.category)) {
                categorySelectEl.value = cur.category;
                categoryCustomEl.value = '';
                categoryCustomEl.style.display = 'none';
            } else if (cur.category) {
                categorySelectEl.value = '__custom__';
                categoryCustomEl.value = cur.category;
                categoryCustomEl.style.display = 'inline';
            } else {
                categorySelectEl.value = '';
                categoryCustomEl.value = '';
                categoryCustomEl.style.display = 'none';
            }
            moveUpBtn.disabled = (editIdx === 0);
            moveDownBtn.disabled = (editIdx === sounds.length - 1);
        };
        moveUpBtn.disabled = (idx === 0);
        moveDownBtn.disabled = (idx === sounds.length - 1);
        // attach handlers (overwrite previous handlers to avoid duplicates)
        moveUpBtn.onclick = () => {
            if (editIdx > 0) {
                [sounds[editIdx - 1], sounds[editIdx]] = [sounds[editIdx], sounds[editIdx - 1]];
                editIdx = editIdx - 1;
                updateCategoryOrderFromSounds();
                refreshModalFields();
                renderSoundButtons();
                saveState();
            }
        };
        moveDownBtn.onclick = () => {
            if (editIdx < sounds.length - 1) {
                [sounds[editIdx + 1], sounds[editIdx]] = [sounds[editIdx], sounds[editIdx + 1]];
                editIdx = editIdx + 1;
                updateCategoryOrderFromSounds();
                refreshModalFields();
                renderSoundButtons();
                saveState();
            }
        };
    }

    // --- Modal save logic ---
    document.getElementById('edit-sound-form').onsubmit = function(e) {
        e.preventDefault();
        if (editIdx === null) return;
        const name = document.getElementById('edit-sound-name').value.trim();
        // read preset color from dropdown and text color from color input
        let color = document.getElementById('edit-sound-color-select').value.trim();
               if (!color) color = undefined;
        let textColor = (document.getElementById('edit-sound-textcolor') && document.getElementById('edit-sound-textcolor').value) || undefined;

        let category = document.getElementById('edit-sound-category-custom').value.trim();
        if (!category) category = document.getElementById('edit-sound-category').value.trim();

        sounds[editIdx].name = name || sounds[editIdx].name;
        sounds[editIdx].color = color || undefined;
        sounds[editIdx].textColor = textColor || undefined;
        sounds[editIdx].category = category || undefined;

        updateCategoryOrderFromSounds();
        closeEditModal();
        renderSoundButtons();
        saveState();
       };

    function closeEditModal() {
        document.getElementById('edit-modal').style.display = 'none';
        editIdx = null;
    }

    // Make sure modal close (X), Cancel button and clicking outside modal-content close the modal
    const editModalEl = document.getElementById('edit-modal');
    const editModalCloseBtn = document.getElementById('edit-modal-close');
    const editModalCancelBtn = document.getElementById('edit-sound-cancel');
    if (editModalCloseBtn) editModalCloseBtn.addEventListener('click', closeEditModal);
    if (editModalCancelBtn) editModalCancelBtn.addEventListener('click', closeEditModal);
    if (editModalEl) {
        editModalEl.addEventListener('click', (e) => {
            // clicking the overlay (not the modal content) closes the modal
            if (e.target === editModalEl) closeEditModal();
        });
    }

    // --- Debugging: log sound names (only if debug button exists) ---
    const _dbgBtn = document.getElementById && document.getElementById('debug-log-sounds');
    if (_dbgBtn) {
        _dbgBtn.addEventListener('click', () => {
            console.log('Sounds:', sounds.map(s => s.name));
        });
    }
    // If you want a persistent debug button in the UI, add:
    // <button id="debug-log-sounds" style="display:none">Debug</button>
    // to index.html (hidden by default) or remove this block if you don't need it.
});