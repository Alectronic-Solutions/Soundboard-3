document.addEventListener('DOMContentLoaded', () => {
    const soundboardGrid = document.getElementById('soundboard-grid');
    const searchInput = document.getElementById('search-input');
    const stopAllButton = document.getElementById('stop-all-button');
    const fileUploadInput = document.getElementById('file-upload');
    const categorySelect = document.getElementById('category-select');
    const editButton = document.getElementById('edit-button');

    let currentlyPlayingAudio = []; // To keep track of active audio elements
    let editMode = false;
    let editIdx = null;

    // --- DEFINE YOUR SOUNDS HERE ---
    // You need to create a 'sounds' folder in the same directory as your HTML file
    // and place your audio files (e.g., sound1.mp3, cool_effect.wav) there.
    // Then, list them in the 'sounds' array below.
    let sounds = [
        { name: '2000 Years Later', path: 'sounds/2000 Years Later.ogg', category: 'General' },
        { name: 'Accidents Happen', path: 'sounds/Accidents Happen.ogg', category: 'General' },
        { name: 'Add up those figures sir', path: 'sounds/Add up those figures sir.ogg', category: 'General' },
        { name: 'Airhorn Buildup', path: 'sounds/Airhorn Buildup.ogg', category: 'Sound Effects' },
        { name: 'Airhorn Classic', path: 'sounds/Airhorn Classic.ogg', category: 'Sound Effects' },
        { name: 'Airhorn Fast', path: 'sounds/Airhorn Fast.ogg', category: 'Sound Effects' },
        { name: 'Airhorn Sad', path: 'sounds/Airhorn Sad.ogg', category: 'Sound Effects' },
        { name: 'Airplane', path: 'sounds/Airplane.ogg', category: 'General' },
        { name: 'All Star All Star', path: 'sounds/All Star All Star.ogg', category: 'Music' },
        { name: 'All this computer hacking is making me thirsty', path: 'sounds/All this computer hacking is making me thirsty.ogg', category: 'General' },
        { name: 'All you can talk about is Money', path: 'sounds/All you can talk about is Money.ogg', category: 'Money' },
        { name: 'Americas going to be great again gang', path: 'sounds/Americas going to be great again gang.ogg', category: 'Trumpism' },
        { name: 'Anal Sex', path: 'sounds/Anal Sex.ogg', category: 'Adult' },
        { name: 'Angelic Holy Tone', path: 'sounds/Angelic Holy Tone.ogg', category: 'Music' },
        { name: 'Another One', path: 'sounds/Another One.ogg', category: 'General' },
        { name: 'Are You High or Just Incredibly Stupid', path: 'sounds/Are You High or Just Incredibly Stupid.ogg', category: 'General' },
        { name: 'Are you sure about that', path: 'sounds/Are you sure about that.ogg', category: 'General' },
        { name: 'As long as the matrix exists the human race can never be free', path: 'sounds/As long as the matrix exists the human race can never be free.ogg', category: 'General' },
        { name: 'Asian Gong', path: 'sounds/Asian Gong.ogg', category: 'Sound Effects' },
        { name: 'Aye Yi Yi Yi', path: 'sounds/Aye Yi Yi Yi.ogg', category: 'General' },
        { name: 'Baby Elephant Walk FRIDGE', path: 'sounds/Baby Elephant Walk FRIDGE.ogg', category: 'Music' },
        { name: 'Baby I got your Money - Song', path: 'sounds/Baby I got your Money - Song.ogg', category: 'Music' },
        { name: 'Bad Boys Theme', path: 'sounds/Bad Boys Theme.ogg', category: 'Music' },
        { name: 'Bad to the Bone', path: 'sounds/Bad to the Bone.ogg', category: 'Music' },
        { name: 'Banjo Deliverance', path: 'sounds/Banjo Deliverance.ogg', category: 'Music' },
        { name: 'Bank Notes for Millionaires', path: 'sounds/Bank Notes for Millionaires.ogg', category: 'Money' },
        { name: 'Banned from micky mouse club for inappropriate', path: 'sounds/Banned from micky mouse club for inappropriate.ogg', category: 'General' },
        { name: 'Beat up by a guy wearing a dress', path: 'sounds/Beat up by a guy wearing a dress.ogg', category: 'General' },
        { name: 'Benny Hill Chase Silly', path: 'sounds/Benny Hill Chase Silly.ogg', category: 'Music' },
        { name: 'Big cheer', path: 'sounds/Big cheer.ogg', category: 'Crowd & Reactions' },
        { name: 'Bike Horn', path: 'sounds/Bike Horn.ogg', category: 'Sound Effects' },
        { name: 'Bill Nye the Science Guy', path: 'sounds/Bill Nye the Science Guy.ogg', category: 'Music' },
        { name: 'Bing bing bong Thomas the train and Donald Trump', path: 'sounds/Bing bing bong Thomas the train and Donald Trump.ogg', category: 'Trumpism' },
        { name: 'Boing Tree', path: 'sounds/Boing Tree.ogg', category: 'Sound Effects' },
        { name: 'Boing Two', path: 'sounds/Boing Two.ogg', category: 'Sound Effects' },
        { name: 'Boing', path: 'sounds/Boing.ogg', category: 'Sound Effects' },
        { name: 'Bomb the shit out of them Trump', path: 'sounds/Bomb the shit out of them Trump.ogg', category: 'Trumpism' },
        { name: 'Bottle Rocket', path: 'sounds/Bottle Rocket.ogg', category: 'Sound Effects' },
        { name: 'Boxing Bell', path: 'sounds/Boxing Bell.ogg', category: 'Sound Effects' },
        { name: 'Breaking News 2', path: 'sounds/Breaking News 2.ogg', category: 'Sound Effects' },
        { name: 'Breaking News 3', path: 'sounds/Breaking News 3.ogg', category: 'Sound Effects' },
        { name: 'Breaking News', path: 'sounds/Breaking News.ogg', category: 'Sound Effects' },
        { name: 'Bright Side of Life', path: 'sounds/Bright Side of Life.ogg', category: 'Music' },
        { name: 'British', path: 'sounds/British.ogg', category: 'General' },
        { name: 'Broken-glass', path: 'sounds/Broken-glass.ogg', category: 'Sound Effects' },
        { name: 'Brutal MK', path: 'sounds/Brutal MK.ogg', category: 'Gaming' },
        { name: 'Buzzer', path: 'sounds/Buzzer.ogg', category: 'Sound Effects' },
        { name: 'Bye Felicia', path: 'sounds/Bye Felicia.ogg', category: 'General' },
        { name: 'Camel', path: 'sounds/Camel.ogg', category: 'General' },
        { name: 'Camera Click', path: 'sounds/Camera Click.ogg', category: 'Sound Effects' },
        { name: 'Can Do Sarcastic', path: 'sounds/Can Do Sarcastic.ogg', category: 'General' },
        { name: 'Can You Dig lt', path: 'sounds/Can You Dig lt.ogg', category: 'General' },
        { name: 'Car Crash', path: 'sounds/Car Crash.ogg', category: 'Sound Effects' },
        { name: 'Cartoon Slipping', path: 'sounds/Cartoon Slipping.ogg', category: 'Sound Effects' },
        { name: 'Cash me outside how bout dat', path: 'sounds/Cash me outside how bout dat.ogg', category: 'General' },
        { name: 'Cat Angry', path: 'sounds/Cat Angry.ogg', category: 'General' },
        { name: 'Cheers', path: 'sounds/Cheers.ogg', category: 'Crowd & Reactions' },
        { name: 'Chewbaca', path: 'sounds/Chewbaca.ogg', category: 'General' },
        { name: 'Chicken-jockey', path: 'sounds/Chicken-jockey.ogg', category: 'General' },
        { name: 'Chinese Intro', path: 'sounds/Chinese Intro.ogg', category: 'Music' },
        { name: 'Clapping Cheering', path: 'sounds/Clapping Cheering.ogg', category: 'Crowd & Reactions' },
        { name: 'Clapping Large Audience', path: 'sounds/Clapping Large Audience.ogg', category: 'Crowd & Reactions' },
        { name: 'Clapping Medium Audience', path: 'sounds/Clapping Medium Audience.ogg', category: 'Crowd & Reactions' },
        { name: 'Clapping Medium', path: 'sounds/Clapping Medium.ogg', category: 'Crowd & Reactions' },
        { name: 'Clapping Normal', path: 'sounds/Clapping Normal.ogg', category: 'Crowd & Reactions' },
        { name: 'Clapping Short', path: 'sounds/Clapping Short.ogg', category: 'Crowd & Reactions' },
        { name: 'Clapping Sus', path: 'sounds/Clapping Sus.ogg', category: 'Crowd & Reactions' },
        { name: 'Come on man', path: 'sounds/Come on man.ogg', category: 'General' },
        { name: 'Come-on-down', path: 'sounds/Come-on-down.ogg', category: 'Music' },
        { name: 'Congratulations Trump', path: 'sounds/Congratulations Trump.ogg', category: 'Trumpism' },
        { name: 'Cop Siren', path: 'sounds/Cop Siren.ogg', category: 'Sound Effects' },
        { name: 'Credits Received', path: 'sounds/Credits Received.ogg', category: 'General' },
        { name: 'Crickets', path: 'sounds/Crickets.ogg', category: 'Sound Effects' },
        { name: 'Crowd Aww Cute', path: 'sounds/Crowd Aww Cute.ogg', category: 'Crowd & Reactions' },
        { name: 'Crowd Aww Loss', path: 'sounds/Crowd Aww Loss.ogg', category: 'Crowd & Reactions' },
        { name: 'Crowd Aww Nooo', path: 'sounds/Crowd Aww Nooo.ogg', category: 'Crowd & Reactions' },
        { name: 'Crowd Booo', path: 'sounds/Crowd Booo.ogg', category: 'Crowd & Reactions' },
        { name: 'Crying Baby', path: 'sounds/Crying Baby.ogg', category: 'General' },
        { name: 'CSI Yeah', path: 'sounds/CSI Yeah.ogg', category: 'General' },
        { name: 'Curb Enthusiasm', path: 'sounds/Curb Enthusiasm.ogg', category: 'Music' },
        { name: 'Curb-your-enthusiasm', path: 'sounds/Curb-your-enthusiasm.ogg', category: 'Music' },
        { name: 'Did somebody say make Money Money', path: 'sounds/Did somebody say make Money Money.ogg', category: 'Money' },
        { name: 'Ding', path: 'sounds/Ding.ogg', category: 'Sound Effects' },
        { name: 'Dinosaur Groan', path: 'sounds/Dinosaur Groan.ogg', category: 'General' },
        { name: 'Do I look like I know what a Jpeg is', path: 'sounds/Do I look like I know what a Jpeg is.ogg', category: 'General' },
        { name: 'Do not come', path: 'sounds/Do not come.ogg', category: 'General' },
        { name: 'Do you ever look at someone and wonder what they are thinking', path: 'sounds/Do you ever look at someone and wonder what they are thinking.ogg', category: 'General' },
        { name: 'Dogs', path: 'sounds/Dogs.ogg', category: 'General' },
        { name: 'Donkey', path: 'sounds/Donkey.ogg', category: 'General' },
        { name: 'Dracula Theme', path: 'sounds/Dracula Theme.ogg', category: 'Music' },
        { name: 'Drums 1min', path: 'sounds/Drums 1min.ogg', category: 'Music' },
        { name: 'Drums Bongos', path: 'sounds/Drums Bongos.ogg', category: 'Music' },
        { name: 'Drums Medium', path: 'sounds/Drums Medium.ogg', category: 'Music' },
        { name: 'Drums Rim Shot', path: 'sounds/Drums Rim Shot.ogg', category: 'Music' },
        { name: 'Drums Ting', path: 'sounds/Drums Ting.ogg', category: 'Music' },
        { name: 'Dun Dun Dunnnn', path: 'sounds/Dun Dun Dunnnn.ogg', category: 'Music' },
        { name: 'Eagle', path: 'sounds/Eagle.ogg', category: 'General' },
        { name: 'Elephant', path: 'sounds/Elephant.ogg', category: 'General' },
        { name: 'English do you speak it', path: 'sounds/English do you speak it.ogg', category: 'General' },
        { name: 'Enoch', path: 'sounds/Enoch.ogg', category: 'General' },
        { name: 'Especially on weed man', path: 'sounds/Especially on weed man.ogg', category: 'General' },
        { name: 'Every Little Thing is Gonna Be Alright', path: 'sounds/Every Little Thing is Gonna Be Alright.ogg', category: 'Music' },
        { name: 'Evil Laugh', path: 'sounds/Evil Laugh.ogg', category: 'General' },
        { name: 'Fairy', path: 'sounds/Fairy.ogg', category: 'General' },
        { name: 'Family Feud Theme', path: 'sounds/Family Feud Theme.ogg', category: 'Music' },
        { name: 'Fart Large', path: 'sounds/Fart Large.ogg', category: 'Bodily Functions' },
        { name: 'Fart Two', path: 'sounds/Fart Two.ogg', category: 'Bodily Functions' },
        { name: 'Fart', path: 'sounds/Fart.ogg', category: 'Bodily Functions' },
        { name: 'Fatality', path: 'sounds/Fatality.ogg', category: 'Gaming' },
        { name: 'Female scream', path: 'sounds/Female scream.ogg', category: 'General' },
        { name: 'Flawless Victory MK', path: 'sounds/Flawless Victory MK.ogg', category: 'Gaming' },
        { name: 'Fox TV Theme', path: 'sounds/Fox TV Theme.ogg', category: 'Music' },
        { name: 'Free credit report', path: 'sounds/Free credit report.ogg', category: 'Music' },
        { name: 'Friends Theme', path: 'sounds/Friends Theme.ogg', category: 'Music' },
        { name: 'Full House', path: 'sounds/Full House.ogg', category: 'Music' },
        { name: 'Future army soldier', path: 'sounds/Future army soldier.ogg', category: 'General' },
        { name: 'Fuuuck Long', path: 'sounds/Fuuuck Long.ogg', category: 'General' },
        { name: 'Gameshow Ending Wacky', path: 'sounds/Gameshow Ending Wacky.ogg', category: 'Music' },
        { name: 'Gasp', path: 'sounds/Gasp.ogg', category: 'Crowd & Reactions' },
        { name: 'Gay', path: 'sounds/Gay.ogg', category: 'Adult' },
        { name: 'Get er Done', path: 'sounds/Get er Done.ogg', category: 'General' },
        { name: 'Get help', path: 'sounds/Get help.ogg', category: 'General' },
        { name: 'Get Swifty', path: 'sounds/Get Swifty.ogg', category: 'Music' },
        { name: 'Ghost moan', path: 'sounds/Ghost moan.ogg', category: 'General' },
        { name: 'Giligans Island Theme', path: 'sounds/Giligans Island Theme.ogg', category: 'Music' },
        { name: 'Give us some Money', path: 'sounds/Give us some Money.ogg', category: 'Money' },
        { name: 'Godfather Theme', path: 'sounds/Godfather Theme.ogg', category: 'Music' },
        { name: 'Gonna Smoke Some Weed', path: 'sounds/Gonna Smoke Some Weed.ogg', category: 'General' },
        { name: 'Goofy car horn', path: 'sounds/Goofy car horn.ogg', category: 'Sound Effects' },
        { name: 'Gun Cock', path: 'sounds/Gun Cock.ogg', category: 'Sound Effects' },
        { name: 'Gun Lazers Reggae', path: 'sounds/Gun Lazers Reggae.ogg', category: 'Sound Effects' },
        { name: 'Gun Lazers Tie Fighter', path: 'sounds/Gun Lazers Tie Fighter.ogg', category: 'Sound Effects' },
        { name: 'Gun Rapid Fire', path: 'sounds/Gun Rapid Fire.ogg', category: 'Sound Effects' },
        { name: 'Gun Richochet Miss', path: 'sounds/Gun Richochet Miss.ogg', category: 'Sound Effects' },
        { name: 'Gun Shot with Cock', path: 'sounds/Gun Shot with Cock.ogg', category: 'Sound Effects' },
        { name: 'Ha Ha Ha Shut Up', path: 'sounds/Ha Ha Ha Shut Up.ogg', category: 'Crowd & Reactions' },
        { name: 'Ha Ha Nelson', path: 'sounds/Ha Ha Nelson.ogg', category: 'Crowd & Reactions' },
        { name: 'Hackings Bad Trump', path: 'sounds/Hackings Bad Trump.ogg', category: 'Trumpism' },
        { name: 'Hallelujah', path: 'sounds/Hallelujah.ogg', category: 'Music' },
        { name: 'Hawk Tuah Arnold', path: 'sounds/Hawk Tuah Arnold.ogg', category: 'General' },
        { name: 'Hawk Tuah Short', path: 'sounds/Hawk Tuah Short.ogg', category: 'General' },
        { name: 'Hawk Tuah', path: 'sounds/Hawk Tuah.ogg', category: 'General' },
        { name: 'He He Jackson', path: 'sounds/He He Jackson.ogg', category: 'General' },
        { name: 'Helicopter', path: 'sounds/Helicopter.ogg', category: 'General' },
        { name: 'Hell naw', path: 'sounds/Hell naw.ogg', category: 'General' },
        { name: 'Hello and welcome', path: 'sounds/Hello and welcome.ogg', category: 'General' },
        { name: 'Hello Future Millionaires', path: 'sounds/Hello Future Millionaires.ogg', category: 'Money' },
        { name: 'Home Alone and Interested in Sex', path: 'sounds/Home Alone and Interested in Sex.ogg', category: 'Adult' },
        { name: 'Hoo wee what a cliffhanger', path: 'sounds/Hoo wee what a cliffhanger.ogg', category: 'General' },
        { name: 'Horse Running', path: 'sounds/Horse Running.ogg', category: 'General' },
        { name: 'Horse Whinny', path: 'sounds/Horse Whinny.ogg', category: 'General' },
        { name: 'How Dare You', path: 'sounds/How Dare You.ogg', category: 'General' },
        { name: 'How Good of You to Join Us Bane', path: 'sounds/How Good of You to Join Us Bane.ogg', category: 'General' },
        { name: 'How it feels to chew 5 gum', path: 'sounds/How it feels to chew 5 gum.ogg', category: 'General' },
        { name: 'I am a Millionaire - Trump', path: 'sounds/I am a Millionaire - Trump.ogg', category: 'Trumpism' },
        { name: 'I cant hear anything', path: 'sounds/I cant hear anything.ogg', category: 'General' },
        { name: "I can't take it anymore", path: "sounds/I can't take it anymore.ogg", category: 'General' },
        { name: 'I Caramba Bart', path: 'sounds/I Caramba Bart.ogg', category: 'General' },
        { name: 'I do not have any Money', path: 'sounds/I do not have any Money.ogg', category: 'Money' },
        { name: 'I dont give a fuuu', path: 'sounds/I dont give a fuuu.ogg', category: 'General' },
        { name: "I don't remember Trump", path: "sounds/I don't remember Trump.ogg", category: 'Trumpism' },
        { name: 'I dropped my monster condom', path: 'sounds/I dropped my monster condom.ogg', category: 'Adult' },
        { name: 'I got hairy legs', path: 'sounds/I got hairy legs.ogg', category: 'General' },
        { name: 'I have to fufill my purpose so I can go away', path: 'sounds/I have to fufill my purpose so I can go away.ogg', category: 'General' },
        { name: 'I really have nothing better to do Trump', path: 'sounds/I really have nothing better to do Trump.ogg', category: 'Trumpism' },
        { name: 'I think moto like you', path: 'sounds/I think moto like you.ogg', category: 'General' },
        { name: 'I thought this was america', path: 'sounds/I thought this was america.ogg', category: 'General' },
        { name: 'I thought we had a deal', path: 'sounds/I thought we had a deal.ogg', category: 'General' },
        { name: 'I-am-steve', path: 'sounds/I-am-steve.ogg', category: 'General' },
        { name: 'Im a Secret Agent', path: 'sounds/Im a Secret Agent.ogg', category: 'General' },
        { name: 'Im Chris Hanson with Dateline NBC', path: 'sounds/Im Chris Hanson with Dateline NBC.ogg', category: 'General' },
        { name: 'Im gonna come', path: 'sounds/Im gonna come.ogg', category: 'Adult' },
        { name: 'Im making a donation', path: 'sounds/Im making a donation.ogg', category: 'General' },
        { name: 'Im Sorry I was such a saint before', path: 'sounds/Im Sorry I was such a saint before.ogg', category: 'General' },
        { name: 'Im Sorry', path: 'sounds/Im Sorry.ogg', category: 'General' },
        { name: 'In the Arms of an Angel', path: 'sounds/In the Arms of an Angel.ogg', category: 'Music' },
        { name: 'In the Navy', path: 'sounds/In the Navy.ogg', category: 'Music' },
        { name: 'Inception', path: 'sounds/Inception.ogg', category: 'Music' },
        { name: 'India', path: 'sounds/India.ogg', category: 'Music' },
        { name: 'Irish', path: 'sounds/Irish.ogg', category: 'Music' },
        { name: 'It is Maam', path: 'sounds/It is Maam.ogg', category: 'General' },
        { name: 'Its getting wierd', path: 'sounds/Its getting wierd.ogg', category: 'General' },
        { name: 'Its raining men hallelujah', path: 'sounds/Its raining men hallelujah.ogg', category: 'Music' },
        { name: "I've always been here for you guys and I always will be", path: "sounds/I've always been here for you guys and I always will be.ogg", category: 'General' },
        { name: "I've been doing martial arts my whole life I dont wanna fight", path: "sounds/I've been doing martial arts my whole life I dont wanna fight.ogg", category: 'General' },
        { name: "Ive fallen and I can't get up", path: "sounds/Ive fallen and I can't get up.ogg", category: 'General' },
        { name: "I've Fallen and I can't get up", path: "sounds/I've Fallen and I can't get up.ogg", category: 'General' },
        { name: 'Jade Pussycat', path: 'sounds/Jade Pussycat.ogg', category: 'General' },
        { name: 'Jammin Bob Marley', path: 'sounds/Jammin Bob Marley.ogg', category: 'Music' },
        { name: 'Jeopardy Theme', path: 'sounds/Jeopardy Theme.ogg', category: 'Music' },
        { name: 'Just do it', path: 'sounds/Just do it.ogg', category: 'General' },
        { name: 'Kaching', path: 'sounds/Kaching.ogg', category: 'Money' },
        { name: 'Kells', path: 'sounds/Kells.ogg', category: 'General' },
        { name: 'Ladies and Gentlemen we got em', path: 'sounds/Ladies and Gentlemen we got em.ogg', category: 'General' },
        { name: 'Laughing Clap', path: 'sounds/Laughing Clap.ogg', category: 'Crowd & Reactions' },
        { name: 'Laughing Fo', path: 'sounds/Laughing Fo.ogg', category: 'Crowd & Reactions' },
        { name: 'Laughing One', path: 'sounds/Laughing One.ogg', category: 'Crowd & Reactions' },
        { name: 'Laughing Sitcom', path: 'sounds/Laughing Sitcom.ogg', category: 'Crowd & Reactions' },
        { name: 'Laughing Tree', path: 'sounds/Laughing Tree.ogg', category: 'Crowd & Reactions' },
        { name: 'Laughing Two', path: 'sounds/Laughing Two.ogg', category: 'Crowd & Reactions' },
        { name: 'Laughing', path: 'sounds/Laughing.ogg', category: 'Crowd & Reactions' },
        { name: 'Laverne and Shirley Theme', path: 'sounds/Laverne and Shirley Theme.ogg', category: 'Music' },
        { name: 'Law and Order', path: 'sounds/Law and Order.ogg', category: 'Music' },
        { name: 'Let her go', path: 'sounds/Let her go.ogg', category: 'General' },
        { name: 'Limit on Talking', path: 'sounds/Limit on Talking.ogg', category: 'General' },
        { name: 'Looney Toons Theme', path: 'sounds/Looney Toons Theme.ogg', category: 'Music' },
        { name: 'LOSE Millionaire Short', path: 'sounds/LOSE Millionaire Short.ogg', category: 'Money' },
        { name: 'LOSE Millionaire', path: 'sounds/LOSE Millionaire.ogg', category: 'Money' },
        { name: 'Mad World', path: 'sounds/Mad World.ogg', category: 'Music' },
        { name: 'Mario Coin', path: 'sounds/Mario Coin.ogg', category: 'Gaming' },
        { name: 'Mario Game Over', path: 'sounds/Mario Game Over.ogg', category: 'Gaming' },
        { name: 'Mario Lose Life', path: 'sounds/Mario Lose Life.ogg', category: 'Gaming' },
        { name: 'Mario Power Up', path: 'sounds/Mario Power Up.ogg', category: 'Gaming' },
        { name: 'Mario Thank You so Much', path: 'sounds/Mario Thank You so Much.ogg', category: 'Gaming' },
        { name: 'Mash Theme', path: 'sounds/Mash Theme.ogg', category: 'Music' },
        { name: 'Meow', path: 'sounds/Meow.ogg', category: 'General' },
        { name: 'Metal Gear Alert', path: 'sounds/Metal Gear Alert.ogg', category: 'Gaming' },
        { name: 'Mexican Americans', path: 'sounds/Mexican Americans.ogg', category: 'Music' },
        { name: 'Mexican', path: 'sounds/Mexican.ogg', category: 'Music' },
        { name: 'Millionaire $$$5min', path: 'sounds/Millionaire $$$5min.ogg', category: 'Money' },
        { name: 'Mingle Game', path: 'sounds/Mingle Game.ogg', category: 'Music' },
        { name: 'Mission failed', path: 'sounds/Mission failed.ogg', category: 'Gaming' },
        { name: 'Mission Impossible', path: 'sounds/Mission Impossible.ogg', category: 'Music' },
        { name: 'Money Money I want more Money', path: 'sounds/Money Money I want more Money.ogg', category: 'Money' },
        { name: 'Moneyyy Song', path: 'sounds/Moneyyy Song.ogg', category: 'Money' },
        { name: 'Monkey', path: 'sounds/Monkey.ogg', category: 'General' },
        { name: 'Moo', path: 'sounds/Moo.ogg', category: 'General' },
        { name: 'My name Jeff', path: 'sounds/My name Jeff.ogg', category: 'General' },
        { name: 'Obama if we are racist', path: 'sounds/Obama if we are racist.ogg', category: 'General' },
        { name: 'Ohhh La La', path: 'sounds/Ohhh La La.ogg', category: 'General' },
        { name: 'Ok Lil Jon', path: 'sounds/Ok Lil Jon.ogg', category: 'General' },
        { name: 'Pac Man Death', path: 'sounds/Pac Man Death.ogg', category: 'Gaming' },
        { name: 'Phone a Friend HOLD', path: 'sounds/Phone a Friend HOLD.ogg', category: 'Music' },
        { name: 'Pig', path: 'sounds/Pig.ogg', category: 'General' },
        { name: 'Piglet Squel', path: 'sounds/Piglet Squel.ogg', category: 'General' },
        { name: 'Pinky and The Brain', path: 'sounds/Pinky and The Brain.ogg', category: 'Music' },
        { name: 'Pokemon', path: 'sounds/Pokemon.ogg', category: 'Gaming' },
        { name: 'Pornhub', path: 'sounds/Pornhub.ogg', category: 'Adult' },
        { name: 'Price is right LOSE', path: 'sounds/Price is right LOSE.ogg', category: 'Music' },
        { name: 'Punch', path: 'sounds/Punch.ogg', category: 'Sound Effects' },
        { name: 'Puppy', path: 'sounds/Puppy.ogg', category: 'General' },
        { name: 'Radar', path: 'sounds/Radar.ogg', category: 'General' },
        { name: 'Rehab Amy Winehouse', path: 'sounds/Rehab Amy Winehouse.ogg', category: 'Music' },
        { name: 'Right Near the Beach Boi', path: 'sounds/Right Near the Beach Boi.ogg', category: 'Music' },
        { name: 'Road Runner', path: 'sounds/Road Runner.ogg', category: 'General' },
        { name: 'Roxanne', path: 'sounds/Roxanne.ogg', category: 'Music' },
        { name: 'Roxannel', path: 'sounds/Roxannel.ogg', category: 'Music' },
        { name: 'Sad Trombone', path: 'sounds/Sad Trombone.ogg', category: 'Crowd & Reactions' },
        { name: 'Sad Violin', path: 'sounds/Sad Violin.ogg', category: 'Music' },
        { name: 'ScoobyDoo', path: 'sounds/ScoobyDoo.ogg', category: 'Music' },
        { name: 'Seinfeld Intro', path: 'sounds/Seinfeld Intro.ogg', category: 'Music' },
        { name: 'Sex Change I Need It Now', path: 'sounds/Sex Change I Need It Now.ogg', category: 'Adult' },
        { name: 'She Shall Lure some Millionaire', path: 'sounds/She Shall Lure some Millionaire.ogg', category: 'Money' },
        { name: 'Sheep', path: 'sounds/Sheep.ogg', category: 'General' },
        { name: 'Show me the Money', path: 'sounds/Show me the Money.ogg', category: 'Money' },
        { name: 'Silly Spanish Flea FRIDGE', path: 'sounds/Silly Spanish Flea FRIDGE.ogg', category: 'Music' },
        { name: 'Smoke Weed Everyday', path: 'sounds/Smoke Weed Everyday.ogg', category: 'General' },
        { name: 'Spend your Money like Money aint Song', path: 'sounds/Spend your Money like Money aint Song.ogg', category: 'Money' },
        { name: 'Spongebob Fail', path: 'sounds/Spongebob Fail.ogg', category: 'Music' },
        { name: 'Spring', path: 'sounds/Spring.ogg', category: 'Music' },
        { name: 'Star Wars Cantina', path: 'sounds/Star Wars Cantina.ogg', category: 'Music' },
        { name: 'Step By Step', path: 'sounds/Step By Step.ogg', category: 'Music' },
        { name: 'Surpnse-supnse', path: 'sounds/Surpnse-supnse.ogg', category: 'Music' },
        { name: 'Suspense Harp', path: 'sounds/Suspense Harp.ogg', category: 'Music' },
        { name: 'Suspense Medium', path: 'sounds/Suspense Medium.ogg', category: 'Music' },
        { name: 'Suspense Short', path: 'sounds/Suspense Short.ogg', category: 'Music' },
        { name: 'Suspense Tuba', path: 'sounds/Suspense Tuba.ogg', category: 'Music' },
        { name: 'Taco bell bong', path: 'sounds/Taco bell bong.ogg', category: 'Sound Effects' },
        { name: 'Tada', path: 'sounds/Tada.ogg', category: 'Sound Effects' },
        { name: 'Taxes', path: 'sounds/Taxes.ogg', category: 'Money' },
        { name: 'Tequila', path: 'sounds/Tequila.ogg', category: 'Music' },
        { name: 'Thaaanks Sarcastic', path: 'sounds/Thaaanks Sarcastic.ogg', category: 'General' },
        { name: 'Thank You for the donation lady', path: 'sounds/Thank You for the donation lady.ogg', category: 'Money' },
        { name: 'Thank You for your patronage', path: 'sounds/Thank You for your patronage.ogg', category: 'Money' },
        { name: 'Thank You Rick', path: 'sounds/Thank You Rick.ogg', category: 'General' },
        { name: 'Thank You South Park', path: 'sounds/Thank You South Park.ogg', category: 'General' },
        { name: 'Thank You Sweet', path: 'sounds/Thank You Sweet.ogg', category: 'General' },
        { name: 'That means your gay', path: 'sounds/That means your gay.ogg', category: 'Adult' },
        { name: 'Thats a lot of Nuts', path: 'sounds/Thats a lot of Nuts.ogg', category: 'General' },
        { name: 'Thats What She Said', path: 'sounds/Thats What She Said.ogg', category: 'General' },
        { name: 'The Adams Family Theme', path: 'sounds/The Adams Family Theme.ogg', category: 'Music' },
        { name: 'The Jeffersons Theme', path: 'sounds/The Jeffersons Theme.ogg', category: 'Music' },
        { name: 'The more you know', path: 'sounds/The more you know.ogg', category: 'General' },
        { name: 'The Most Important Thing is Money', path: 'sounds/The Most Important Thing is Money.ogg', category: 'Money' },
        { name: 'The Stripper', path: 'sounds/The Stripper.ogg', category: 'Music' },
        { name: 'Threes Company', path: 'sounds/Threes Company.ogg', category: 'Music' },
        { name: 'Tim Allen Grunt Home Improvement', path: 'sounds/Tim Allen Grunt Home Improvement.ogg', category: 'General' },
        { name: 'Tip for you in my pocket', path: 'sounds/Tip for you in my pocket.ogg', category: 'Money' },
        { name: 'Toilet', path: 'sounds/Toilet.ogg', category: 'Sound Effects' },
        { name: 'Tree Fiddy', path: 'sounds/Tree Fiddy.ogg', category: 'General' },
        { name: 'Trombone High Pitch', path: 'sounds/Trombone High Pitch.ogg', category: 'Music' },
        { name: 'Two and half men', path: 'sounds/Two and half men.ogg', category: 'Music' },
        { name: 'Universal Studios', path: 'sounds/Universal Studios.ogg', category: 'Music' },
        { name: 'Vince Tammy', path: 'sounds/Vince Tammy.ogg', category: 'General' },
        { name: 'Walk like an egyptian', path: 'sounds/Walk like an egyptian.ogg', category: 'Music' },
        { name: 'Wasted', path: 'sounds/Wasted.ogg', category: 'Gaming' },
        { name: 'Weakest Link', path: 'sounds/Weakest Link.ogg', category: 'Music' },
        { name: 'Well Be Right Back', path: 'sounds/Well Be Right Back.ogg', category: 'General' },
        { name: 'Were here to help', path: 'sounds/Were here to help.ogg', category: 'General' },
        { name: 'Western crowd', path: 'sounds/Western crowd.ogg', category: 'Crowd & Reactions' },
        { name: 'What are you a homo', path: 'sounds/What are you a homo.ogg', category: 'Adult' },
        { name: 'What are you people on dope', path: 'sounds/What are you people on dope.ogg', category: 'General' },
        { name: 'What da dog do', path: 'sounds/What da dog do.ogg', category: 'General' },
        { name: 'What do you mean funny funny how', path: 'sounds/What do you mean funny funny how.ogg', category: 'General' },
        { name: 'What is That Joke', path: 'sounds/What is That Joke.ogg', category: 'General' },
        { name: 'What Lil Jon', path: 'sounds/What Lil Jon.ogg', category: 'General' },
        { name: 'What the hell is going on here exactly', path: 'sounds/What the hell is going on here exactly.ogg', category: 'General' },
        { name: 'What the hell is wrong with you people', path: 'sounds/What the hell is wrong with you people.ogg', category: 'General' },
        { name: 'Whats the sound of one hand clapping', path: 'sounds/Whats the sound of one hand clapping.ogg', category: 'General' },
        { name: 'Where is the lamb sauce', path: 'sounds/Where is the lamb sauce.ogg', category: 'General' },
        { name: 'Wheres the rest of my meth', path: 'sounds/Wheres the rest of my meth.ogg', category: 'General' },
        { name: 'Whip', path: 'sounds/Whip.ogg', category: 'Sound Effects' },
        { name: 'White Dude for Harris', path: 'sounds/White Dude for Harris.ogg', category: 'General' },
        { name: 'Who is your daddy and what does he do', path: 'sounds/Who is your daddy and what does he do.ogg', category: 'General' },
        { name: 'Who the Hell Cares', path: 'sounds/Who the Hell Cares.ogg', category: 'General' },
        { name: "Who's that Pokemon", path: "sounds/Who's that Pokemon.ogg", category: 'Gaming' },
        { name: 'Why are you gay', path: 'sounds/Why are you gay.ogg', category: 'Adult' },
        { name: "Why Can't We Be Friends", path: "sounds/Why Can't We Be Friends.ogg", category: 'Music' },
        { name: 'Will I pay a lot of tax Trump', path: 'sounds/Will I pay a lot of tax Trump.ogg', category: 'Trumpism' },
        { name: 'WoHoo Homer', path: 'sounds/WoHoo Homer.ogg', category: 'General' },
        { name: 'Wolf', path: 'sounds/Wolf.ogg', category: 'General' },
        { name: 'Wonka flute', path: 'sounds/Wonka flute.ogg', category: 'Music' },
        { name: 'Woodpecker', path: 'sounds/Woodpecker.ogg', category: 'General' },
        { name: 'Wow Dude', path: 'sounds/Wow Dude.ogg', category: 'General' },
        { name: 'Wow kid', path: 'sounds/Wow kid.ogg', category: 'General' },
        { name: 'Wow', path: 'sounds/Wow.ogg', category: 'General' },
        { name: 'Ya Science', path: 'sounds/Ya Science.ogg', category: 'General' },
        { name: 'Yahoo', path: 'sounds/Yahoo.ogg', category: 'General' },
        { name: 'Yeah Lil Jon', path: 'sounds/Yeah Lil Jon.ogg', category: 'General' },
        { name: 'Yeah Probably', path: 'sounds/Yeah Probably.ogg', category: 'General' },
        { name: 'Yeah So What', path: 'sounds/Yeah So What.ogg', category: 'General' },
        { name: 'Yippeee', path: 'sounds/Yippeee.ogg', category: 'General' },
        { name: 'You Belong To Me', path: 'sounds/You Belong To Me.ogg', category: 'Music' },
        { name: 'You Can Do lt', path: 'sounds/You Can Do lt.ogg', category: 'General' },
        { name: 'You Lose MK', path: 'sounds/You Lose MK.ogg', category: 'Gaming' },
        { name: 'You sound like a gay', path: 'sounds/You sound like a gay.ogg', category: 'Adult' },
        { name: 'You Wanna Get High', path: 'sounds/You Wanna Get High.ogg', category: 'General' },
        { name: 'Your Fired Trump', path: 'sounds/Your Fired Trump.ogg', category: 'Trumpism' },
        { name: 'Your Rights Are My Responsibilities', path: 'sounds/Your Rights Are My Responsibilities.ogg', category: 'General' },
        { name: "You're a Millionaire", path: "sounds/You're a Millionaire.ogg", category: 'Money' },
        { name: 'Countdown', path: 'sounds/Countdown.ogg', category: 'Sound Effects' },
        { name: 'Why in the fuck would I do that', path: 'sounds/Why in the fuck would I do that.ogg', category: 'General' },
        { name: 'Yeah this is gonna help with that bitch', path: 'sounds/Yeah this is gonna help with that bitch.ogg', category: 'General' },
        { name: 'You Have Smoked Yourself Retarded', path: 'sounds/You Have Smoked Yourself Retarded.ogg', category: 'General' },
        { name: 'Does he look like a bitch', path: 'sounds/Does he look like a bitch.ogg', category: 'General' },
        { name: 'Eat Shit Derek', path: 'sounds/Eat Shit Derek.ogg', category: 'General' },
        { name: 'Im Kinda Retarded', path: 'sounds/Im Kinda Retarded.ogg', category: 'General' },
        { name: 'Lot of perverts in here', path: 'sounds/Lot of perverts in here.ogg', category: 'General' },
        { name: 'MotherFucker', path: 'sounds/MotherFucker.ogg', category: 'General' },
        { name: 'Orgasm', path: 'sounds/Orgasm.ogg', category: 'Adult' },
        { name: 'Oral Sex', path: 'sounds/Oral Sex.ogg', category: 'Adult' },
    ];

    // --- Category Group Order Logic ---
    let categoryOrder = [];

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
        const savedSounds = localStorage.getItem(STORAGE_KEY);
        const savedOrder = localStorage.getItem(CATEGORY_ORDER_KEY);
        if (savedSounds) {
            try {
                sounds = JSON.parse(savedSounds);
                // --- Ensure new sounds are present ---
                const ensureSound = (name, path, category) => {
                    if (!sounds.some(s => s.name === name && s.path === path)) {
                        sounds.push({ name, path, category });
                    }
                };
                ensureSound('Countdown', 'sounds/Countdown.ogg', 'Sound Effects');
                ensureSound('Why in the fuck would I do that', 'sounds/Why in the fuck would I do that.ogg', 'General');
                ensureSound('Yeah this is gonna help with that bitch', 'sounds/Yeah this is gonna help with that bitch.ogg', 'General');
                ensureSound('You Have Smoked Yourself Retarded', 'sounds/You Have Smoked Yourself Retarded.ogg', 'General');
                ensureSound('Does he look like a bitch', 'sounds/Does he look like a bitch.ogg', 'General');
                ensureSound('Eat Shit Derek', 'sounds/Eat Shit Derek.ogg', 'General');
                ensureSound('Im Kinda Retarded', 'sounds/Im Kinda Retarded.ogg', 'General');
                ensureSound('Lot of perverts in here', 'sounds/Lot of perverts in here.ogg', 'General');
                ensureSound('MotherFucker', 'sounds/MotherFucker.ogg', 'General');
                ensureSound('Orgasm', 'sounds/Orgasm.ogg', 'Adult');
                ensureSound('Oral Sex', 'sounds/Oral Sex.ogg', 'Adult');
            } catch {}
        } else {
            // --- Ensure new sounds are present on first load ---
            const ensureSound = (name, path, category) => {
                if (!sounds.some(s => s.name === name && s.path === path)) {
                    sounds.push({ name, path, category });
                }
            };
            ensureSound('Countdown', 'sounds/Countdown.ogg', 'Sound Effects');
            ensureSound('Why in the fuck would I do that', 'sounds/Why in the fuck would I do that.ogg', 'General');
            ensureSound('Yeah this is gonna help with that bitch', 'sounds/Yeah this is gonna help with that bitch.ogg', 'General');
            ensureSound('You Have Smoked Yourself Retarded', 'sounds/You Have Smoked Yourself Retarded.ogg', 'General');
            ensureSound('Does he look like a bitch', 'sounds/Does he look like a bitch.ogg', 'General');
            ensureSound('Eat Shit Derek', 'sounds/Eat Shit Derek.ogg', 'General');
            ensureSound('Im Kinda Retarded', 'sounds/Im Kinda Retarded.ogg', 'General');
            ensureSound('Lot of perverts in here', 'sounds/Lot of perverts in here.ogg', 'General');
            ensureSound('MotherFucker', 'sounds/MotherFucker.ogg', 'General');
            ensureSound('Orgasm', 'sounds/Orgasm.ogg', 'Adult');
            ensureSound('Oral Sex', 'sounds/Oral Sex.ogg', 'Adult');
        }
        if (savedOrder) {
            try {
                categoryOrder = JSON.parse(savedOrder);
            } catch {}
        }
        // If no saved order, initialize from sounds
        if (!categoryOrder || !Array.isArray(categoryOrder)) {
            categoryOrder = getAllCategories();
        }
        // Always ensure order is in sync with sounds
        updateCategoryOrderFromSounds();
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
                <span style="flex:1">${cat}</span>
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

    // Add a button to open the category order modal
    if (!document.getElementById('edit-category-order-btn')) {
        const btn = document.createElement('button');
        btn.id = 'edit-category-order-btn';
        btn.textContent = 'Edit Category Order';
        btn.style.marginLeft = '10px';
        document.querySelector('.control-group').appendChild(btn);
        btn.onclick = () => {
            updateCategoryOrderFromSounds();
            renderCategoryOrderEditor();
        };
    }

    // --- Fast lookup for sounds by name/path ---
    let soundMap = new Map();
    function updateSoundMap() {
        soundMap.clear();
        sounds.forEach(s => soundMap.set(s.path, s));
    }

    // --- Fast sort cache ---
    let lastSortKey = '';
    let lastSortList = [];
    function sortSounds(soundsArr) {
        const sortKey = currentSort + '|' + categoryOrder.join(',') + '|' + soundsArr.length;
        if (sortKey === lastSortKey) return lastSortList;
        let sorted;
        if (currentSort === 'name') {
            sorted = [...soundsArr].sort((a, b) => a.name.localeCompare(b.name));
        } else if (currentSort === 'category') {
            sorted = [...soundsArr].sort((a, b) => {
                const idxA = a.category ? categoryOrder.indexOf(a.category) : -1;
                const idxB = b.category ? categoryOrder.indexOf(b.category) : -1;
                if (idxA === idxB) {
                    return a.name.localeCompare(b.name);
                }
                return idxA - idxB;
            });
        } else {
            sorted = soundsArr;
        }
        lastSortKey = sortKey;
        lastSortList = sorted;
        return sorted;
    }

    function getFilteredSounds() {
        let list = sounds;
        if (currentSearch && currentSearch.trim() !== '') {
            const searchTerm = currentSearch.toLowerCase();
            list = list.filter(sound => sound.name.toLowerCase().includes(searchTerm));
        }
        if (currentCategory !== 'all') {
            list = list.filter(sound => sound.category === currentCategory);
        }
        return sortSounds(list);
    }

    // --- Preload all sounds in parallel, only once per path ---
    const preloadedAudio = new Map();
    function preloadAllSounds() {
        preloadedAudio.clear();
        const uniquePaths = new Set(sounds.map(s => s.path));
        uniquePaths.forEach(path => {
            if (!path || path.startsWith('blob:')) return;
            const audio = new Audio();
            audio.preload = 'auto';
            audio.src = path;
            const ext = path.split('.').pop().toLowerCase();
            let mime = '';
            if (ext === 'ogg') mime = 'audio/ogg';
            else if (ext === 'mp3') mime = 'audio/mpeg';
            else if (ext === 'wav') mime = 'audio/wav';
            else if (ext === 'm4a') mime = 'audio/mp4';
            if (audio.canPlayType(mime)) {
                audio.load();
                preloadedAudio.set(path, audio);
            }
        });
    }

    // --- Main render logic ---
    function renderSoundButtons() {
        updateCategoryOrderFromSounds();
        updateSoundMap();
        const list = getFilteredSounds();
        soundboardGrid.innerHTML = '';
        if (currentSort === 'category' && currentCategory === 'all' && !currentSearch) {
            categoryOrder.forEach(cat => {
                const group = list.filter(sound => sound.category === cat);
                if (group.length > 0) {
                    const header = document.createElement('div');
                    header.textContent = cat;
                    header.className = 'category-header';
                    header.style.gridColumn = '1/-1';
                    header.style.fontWeight = 'bold';
                    header.style.margin = '10px 0 0 0';
                    header.style.fontSize = '1.1em';
                    soundboardGrid.appendChild(header);
                    group.forEach(sound => {
                        const idx = sounds.indexOf(sound);
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
                            button.onclick = (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openEditModal(sound, idx);
                            };
                        } else {
                            button.style.outline = '';
                            button.title = '';
                            button.onclick = () => {
                                playSound(sound.path, button);
                            };
                        }
                        soundboardGrid.appendChild(button);
                    });
                }
            });
            // Show uncategorized at the end
            const uncategorized = list.filter(sound => !sound.category);
            if (uncategorized.length > 0) {
                const header = document.createElement('div');
                header.textContent = 'Uncategorized';
                header.className = 'category-header';
                header.style.gridColumn = '1/-1';
                header.style.fontWeight = 'bold';
                header.style.margin = '10px 0 0 0';
                header.style.fontSize = '1.1em';
                soundboardGrid.appendChild(header);
                uncategorized.forEach(sound => {
                    const idx = sounds.indexOf(sound);
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
                        button.onclick = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openEditModal(sound, idx);
                        };
                    } else {
                        button.style.outline = '';
                        button.title = '';
                        button.onclick = () => {
                            playSound(sound.path, button);
                        };
                    }
                    soundboardGrid.appendChild(button);
                });
            }
        } else {
            list.forEach((sound, idx) => {
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
                    button.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const origIdx = sounds.indexOf(sound);
                        openEditModal(sound, origIdx);
                    };
                } else {
                    button.style.outline = '';
                    button.title = '';
                    button.onclick = () => {
                        playSound(sound.path, button);
                    };
                }
                soundboardGrid.appendChild(button);
            });
        }
        populateCategoryFilter();
        saveState();
        preloadAllSounds();
    }

    // --- Only update and re-render when state changes ---
    searchInput.addEventListener('input', () => {
        currentSearch = searchInput.value;
        renderSoundButtons();
    });
    categorySelect.addEventListener('change', () => {
        currentCategory = categorySelect.value;
        renderSoundButtons();
    });
    document.getElementById('sort-select').addEventListener('change', function () {
        currentSort = this.value;
        renderSoundButtons();
    });

    // --- Modal logic ---
    function openEditModal(sound, idx) {
        editIdx = idx;
        document.getElementById('edit-sound-name').value = sound.name;

        // Category dropdown: always include current category, then all others (no duplicates)
        const catSelect = document.getElementById('edit-sound-category');
        catSelect.innerHTML = '';
        const seen = new Set();
        if (sound.category && sound.category.trim()) {
            const opt = document.createElement('option');
            opt.value = sound.category;
            opt.textContent = sound.category;
            catSelect.appendChild(opt);
            seen.add(sound.category);
        }
        categoryOrder.forEach(cat => {
            if (cat && !seen.has(cat)) {
                const opt = document.createElement('option');
                opt.value = cat;
                opt.textContent = cat;
                catSelect.appendChild(opt);
                seen.add(cat);
            }
        });
        catSelect.value = sound.category || '';
        document.getElementById('edit-sound-category-custom').value = '';

        // Button color
        let colorInput = document.getElementById('edit-sound-color');
        let colorText = document.getElementById('edit-sound-color-text');
        if (sound.color && /^#([0-9a-f]{3}){1,2}$/i.test(sound.color.trim())) {
            colorInput.value = sound.color;
            colorText.value = sound.color;
        } else {
            colorInput.value = '#6c757d';
            colorText.value = sound.color || '';
        }

        // Text color
        let textColorInput = document.getElementById('edit-sound-textcolor');
        let textColorText = document.getElementById('edit-sound-textcolor-text');
        if (sound.textColor && /^#([0-9a-f]{3}){1,2}$/i.test(sound.textColor.trim())) {
            textColorInput.value = sound.textColor;
            textColorText.value = sound.textColor;
        } else if (sound.textColor) {
            textColorInput.value = '#ffffff';
            textColorText.value = sound.textColor;
        } else {
            textColorInput.value = '#ffffff';
            textColorText.value = '';
        }

        document.getElementById('edit-modal').style.display = 'flex';
        document.getElementById('move-up-btn').disabled = (idx === 0);
        document.getElementById('move-down-btn').disabled = (idx === sounds.length - 1);
    }

    function closeEditModal() {
        document.getElementById('edit-modal').style.display = 'none';
        editIdx = null;
    }
    document.getElementById('edit-modal-close').onclick = closeEditModal;
    document.getElementById('edit-sound-cancel').onclick = (e) => {
        e.preventDefault();
        closeEditModal();
    };

    // --- Modal color sync ---
    document.getElementById('edit-sound-color').addEventListener('input', function() {
        document.getElementById('edit-sound-color-text').value = this.value;
    });
    document.getElementById('edit-sound-color-text').addEventListener('input', function() {
        let val = this.value.trim();
        if (/^#([0-9a-f]{3}){1,2}$/i.test(val)) {
            document.getElementById('edit-sound-color').value = val;
        }
    });
    document.getElementById('edit-sound-textcolor').addEventListener('input', function() {
        document.getElementById('edit-sound-textcolor-text').value = this.value;
    });
    document.getElementById('edit-sound-textcolor-text').addEventListener('input', function() {
        let val = this.value.trim();
        if (/^#([0-9a-f]{3}){1,2}$/i.test(val)) {
            document.getElementById('edit-sound-textcolor').value = val;
        }
    });

    // --- Modal move up/down logic ---
    document.getElementById('move-up-btn').onclick = function() {
        if (editIdx > 0) {
            // Swap in the sounds array
            [sounds[editIdx - 1], sounds[editIdx]] = [sounds[editIdx], sounds[editIdx - 1]];
            editIdx = editIdx - 1;
            saveState();
            renderSoundButtons();
            openEditModal(sounds[editIdx], editIdx);
        }
    };
    document.getElementById('move-down-btn').onclick = function() {
        if (editIdx < sounds.length - 1) {
            // Swap in the sounds array
            [sounds[editIdx], sounds[editIdx + 1]] = [sounds[editIdx + 1], sounds[editIdx]];
            editIdx = editIdx + 1;
            saveState();
            renderSoundButtons();
            openEditModal(sounds[editIdx], editIdx);
        }
    };

    // --- Modal save logic ---
    document.getElementById('edit-sound-form').onsubmit = function(e) {
        e.preventDefault();
        if (editIdx === null) return;
        const name = document.getElementById('edit-sound-name').value.trim();
        let color = document.getElementById('edit-sound-color-text').value.trim();
        if (!color) color = document.getElementById('edit-sound-color').value;
        let textColor = document.getElementById('edit-sound-textcolor-text').value.trim();
        if (!textColor) textColor = document.getElementById('edit-sound-textcolor').value;
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

    // --- Preload all sounds ---
    // We'll keep a map of Audio objects for instant playback
    const preloadedAudio = new Map();

    function preloadAllSounds() {
        preloadedAudio.clear();
        sounds.forEach(sound => {
            // Only preload if not already in map and path is not a blob (uploaded files)
            if (!preloadedAudio.has(sound.path) && sound.path && !sound.path.startsWith('blob:')) {
                const audio = new Audio();
                audio.preload = 'auto';
                // Set src and check if browser can play it
                audio.src = sound.path;
                // Only add if browser can play the file type
                const ext = sound.path.split('.').pop().toLowerCase();
                let mime = '';
                if (ext === 'ogg') mime = 'audio/ogg';
                else if (ext === 'mp3') mime = 'audio/mpeg';
                else if (ext === 'wav') mime = 'audio/wav';
                else if (ext === 'm4a') mime = 'audio/mp4';
                if (audio.canPlayType(mime)) {
                    audio.load();
                    preloadedAudio.set(sound.path, audio);
                }
            }
        });
    }

    function playSound(soundPath, button) {
        if (editMode) return; // Don't play in edit mode

        // Use preloaded audio if available, otherwise create new
        let audio;
        if (preloadedAudio.has(soundPath)) {
            const orig = preloadedAudio.get(soundPath);
            audio = orig.cloneNode(true);
        } else {
            audio = new Audio(soundPath);
            // Check if browser can play this type before playing
            const ext = soundPath.split('.').pop().toLowerCase();
            let mime = '';
            if (ext === 'ogg') mime = 'audio/ogg';
            else if (ext === 'mp3') mime = 'audio/mpeg';
            else if (ext === 'wav') mime = 'audio/wav';
            else if (ext === 'm4a') mime = 'audio/mp4';
            if (!audio.canPlayType(mime)) {
                alert('Your browser cannot play this audio type: ' + ext);
                return;
            }
        }
        audio.play().catch(err => {
            alert('Failed to play sound. File may be missing or unsupported.');
        });
        currentlyPlayingAudio.push(audio);
        audio.addEventListener('ended', () => {
            currentlyPlayingAudio = currentlyPlayingAudio.filter(a => a !== audio);
        });
    }

    // --- Main render logic ---
    function renderSoundButtons() {
        updateCategoryOrderFromSounds();
        updateSoundMap();
        const list = getFilteredSounds();
        soundboardGrid.innerHTML = '';
        if (currentSort === 'category' && currentCategory === 'all' && !currentSearch) {
            categoryOrder.forEach(cat => {
                const group = list.filter(sound => sound.category === cat);
                if (group.length > 0) {
                    const header = document.createElement('div');
                    header.textContent = cat;
                    header.className = 'category-header';
                    header.style.gridColumn = '1/-1';
                    header.style.fontWeight = 'bold';
                    header.style.margin = '10px 0 0 0';
                    header.style.fontSize = '1.1em';
                    soundboardGrid.appendChild(header);
                    group.forEach(sound => {
                        const idx = sounds.indexOf(sound);
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
                            button.onclick = (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openEditModal(sound, idx);
                            };
                        } else {
                            button.style.outline = '';
                            button.title = '';
                            button.onclick = () => {
                                playSound(sound.path, button);
                            };
                        }
                        soundboardGrid.appendChild(button);
                    });
                }
            });
            // Show uncategorized at the end
            const uncategorized = list.filter(sound => !sound.category);
            if (uncategorized.length > 0) {
                const header = document.createElement('div');
                header.textContent = 'Uncategorized';
                header.className = 'category-header';
                header.style.gridColumn = '1/-1';
                header.style.fontWeight = 'bold';
                header.style.margin = '10px 0 0 0';
                header.style.fontSize = '1.1em';
                soundboardGrid.appendChild(header);
                uncategorized.forEach(sound => {
                    const idx = sounds.indexOf(sound);
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
                        button.onclick = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openEditModal(sound, idx);
                        };
                    } else {
                        button.style.outline = '';
                        button.title = '';
                        button.onclick = () => {
                            playSound(sound.path, button);
                        };
                    }
                    soundboardGrid.appendChild(button);
                });
            }
        } else {
            list.forEach((sound, idx) => {
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
                    button.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const origIdx = sounds.indexOf(sound);
                        openEditModal(sound, origIdx);
                    };
                } else {
                    button.style.outline = '';
                    button.title = '';
                    button.onclick = () => {
                        playSound(sound.path, button);
                    };
                }
                soundboardGrid.appendChild(button);
            });
        }
        populateCategoryFilter();
        saveState();
        preloadAllSounds();
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
        preloadAllSounds(); // Preload new uploaded sounds if needed
    });

    // --- Stop All functionality ---
    stopAllButton.addEventListener('click', () => {
        currentlyPlayingAudio.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        currentlyPlayingAudio = [];
    });

    // --- Controls event listeners ---
    searchInput.addEventListener('input', () => {
        currentSearch = searchInput.value;
        renderSoundButtons();
    });
    categorySelect.addEventListener('change', () => {
        currentCategory = categorySelect.value;
        renderSoundButtons();
    });
    document.getElementById('sort-select').addEventListener('change', function () {
        currentSort = this.value;
        renderSoundButtons();
    });

    // --- Category order modal, persistence, etc. ---
    // On load, restore state
    loadState();
    updateSoundMap();
    renderSoundButtons();
    preloadAllSounds();
});