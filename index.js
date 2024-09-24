const { Telegraf } = require('telegraf');
const express = require('express');

const app = express();

const fs = require('fs');

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
const bot = new Telegraf('7281684073:AAEkkWIq-mcHVD-upDGQ-9YMV5m1CR5WjxY');
const ADMIN = '6740154062';

let waitingForRequest = {}

function readPlaylistFromFile() {
    try {
        // Synchronous file read, returns the contents of the file
        const data = fs.readFileSync('data.json', 'utf8');
        
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading JSON file:', err);
        return null; // Return null or handle the error as needed
    }
}

bot.start((ctx) => ctx.reply(`Hello ${ctx.from.first_name}, welcome to Otabek\'s daily playlist`, { 
    parse_mode: "HTML", 
    reply_markup: { 
        inline_keyboard: [ 
            [{ text: "Search", switch_inline_query_current_chat: "" }], 
            [{ text: "Choose the singer", callback_data: 'singer' }],
            [{ text: "🎵 Send Song Request", callback_data: 'send_request' }],
            [{ text: "Send feedback", callback_data: 'send_feedback' }],
        ], 
    }, 
}
));

bot.action('send_request', (ctx) => {
    waitingForRequest[ctx.from.id] = {step: 'request'} // Set the waiting state for this user
    ctx.reply("Please send me the name of the song you want to request:");
});
bot.action('send_feedback', (ctx) => {
    waitingForRequest[ctx.from.id] = {step: 'feedback'}; // Set the waiting state for this user
    ctx.reply("Please send your feedback");
});

bot.on('text', (ctx) => {
    // Check if the last action was a song request
    if (waitingForRequest[ctx.from.id] && waitingForRequest[ctx.from.id].step == 'request') {
        const songRequest = ctx.message.text; // Get the song name from the user's message
        
        // Send the request to the admin
        bot.telegram.sendMessage(ADMIN, `New song request from ${ctx.from.username || ctx.from.first_name}: ${songRequest}`);

        // Acknowledge the request to the user
        ctx.reply(`Thank you for your request! You requested the song: <b>${songRequest}</b>`, { parse_mode: "HTML" });

        delete waitingForRequest;
    } else if (waitingForRequest[ctx.from.id] && waitingForRequest[ctx.from.id].step == 'feedback') {
        // Ignore any other messages
        const songRequest = ctx.message.text; // Get the song name from the user's message
        
        // Send the request to the admin
        bot.telegram.sendMessage(ADMIN, `New feedback from ${ctx.from.username || ctx.from.first_name}: ${songRequest}`);

        // Acknowledge the request to the user
        ctx.reply(`Thank you for your request!`, { parse_mode: "HTML" });
        delete waitingForRequest;
    } else {
        ctx.reply("I am currently only accepting song requests. Please click the button to request a song.");
    }
});

bot.action('singer', (ctx) => {
    return ctx.reply('Otabek\'s top singers:', {
        parse_mode: "HTML", 
    reply_markup: { 
        inline_keyboard: [ 
            [{ text: "Billie Eilish", callback_data: 'billie' }],
            [{ text: "Adele", callback_data: 'adele' }],
            [{ text: "Lana Del Rey", callback_data: 'Lana_Del_Rey' }],
            [{ text: "Bruno Mars", callback_data: 'bruno_Mars' }],
            [{ text: "Tom odell", callback_data: 'tom_odell' }],
            [{ text: "Eminem", callback_data: 'eminem' }],
            [{ text: "Coldplay", callback_data: 'coldplay' }],
            [{ text: "Uzbek nostalgia songs", callback_data: 'uzbek' }],

        ], 
    },
    })
})

bot.action('billie', (ctx) => {
    return ctx.reply('Choose the song', {
        reply_markup: { 
            inline_keyboard: [ 
                [{ text: "Happier than ever", callback_data: 'happier' }],
                [{ text: "ocean eyes", callback_data: 'ocean' }],
                [{ text: "bellyache", callback_data: 'bellyache' }],
                [{ text: "everthing I wanted", callback_data: 'everything' }],
                [{ text: "What was I made for", callback_data: 'what' }],
                [{ text: "getting older", callback_data: 'getting' }],
            ], 
        },
    })
})
bot.action('adele', (ctx) => {
    return ctx.reply('Choose the song', {
        reply_markup: { 
            inline_keyboard: [ 
                [{ text: "Skyfall", callback_data: 'skyfall' }],
                [{ text: "Rolling in the deep", callback_data: 'rolling' }],
            ], 
        },
    })
})
bot.action('Lana_Del_Rey', (ctx) => {
    return ctx.reply('Choose the song', {
        reply_markup: { 
            inline_keyboard: [ 
                [{ text: "Summertime Sadness", callback_data: 'summer' }],
                [{ text: "Say yes to heaven", callback_data: 'say_yes' }],
            ], 
        },
    })
})
bot.action('bruno_Mars', (ctx) => {
    return ctx.reply('Choose the song', {
        reply_markup: { 
            inline_keyboard: [ 
                [{ text: "grenade", callback_data: 'grenade' }],
            ], 
        },
    })
})
bot.action('tom_odell', (ctx) => {
    return ctx.reply('Choose the song', {
        reply_markup: { 
            inline_keyboard: [ 
                [{ text: "another love", callback_data: 'another_love' }],
            ], 
        },
    })
})
bot.action('eminem', (ctx) => {
    return ctx.reply('Choose the song', {
        reply_markup: { 
            inline_keyboard: [ 
                [{ text: "mockingbird", callback_data: 'mockingbird' }],
            ], 
        },
    })
})
bot.action('coldplay', (ctx) => {
    return ctx.reply('Choose the song', {
        reply_markup: { 
            inline_keyboard: [ 
                [{ text: "a sky full of stars", callback_data: 'a_sky' }],
                [{ text: "yellow", callback_data: 'yellow' }],
                [{ text: "Viva La Vida", callback_data: 'viva' }],
            ], 
        },
    })
})
bot.action('uzbek', (ctx) => {
    return ctx.answerCbQuery('Not available yet', {show_alert: true});
})


bot.action('test', (ctx) => {
    return ctx.replyWithAudio('CQACAgUAAxkBAAMcZvJP5BzpTBo2p9Mc9i50i88jJYcAAh8HAAK5kDhXnc2h18nhdr02BA')
})

bot.on('text', (ctx) => {
    const data = readPlaylistFromFile();
    console.log(data.billie);
})

bot.on('audio', (ctx) => {
    const audio = ctx.message.audio;

    // Extract the file_id from the audio object
    const fileId = audio.file_id;

    // Respond to the user with the file_id
    ctx.reply(`Received your audio file! The file ID is: <code>${fileId}</code>`, {parse_mode: "html"});
});

bot.action(['happier', 'ocean', 'bellyache', 'everything', 'what', 'getting'], (ctx) => {
    const data = readPlaylistFromFile();
    const songKey = ctx.match[0]; // This retrieves the callback data (like 'happy', 'ocean', etc.)
    const songFileId = data.billie[songKey]; // Get the corresponding file ID from the songData object

    console.log(songKey);
    if (songFileId) {
        // Send the audio file using the file_id
        return ctx.replyWithAudio(songFileId);
    } else {
        return ctx.reply('Song not found.');
    }
});
bot.action(['skyfall', 'rolling'], (ctx) => {
    const data = readPlaylistFromFile();
    const songKey = ctx.match[0]; // This retrieves the callback data (like 'happy', 'ocean', etc.)
    const songFileId = data.adele[songKey]; // Get the corresponding file ID from the songData object

    console.log(songKey);
    if (songFileId) {
        // Send the audio file using the file_id
        return ctx.replyWithAudio(songFileId);
    } else {
        return ctx.reply('Song not found.');
    }
});
bot.action(['summer', 'say_yes'], (ctx) => {
    const data = readPlaylistFromFile();
    const songKey = ctx.match[0]; // This retrieves the callback data (like 'happy', 'ocean', etc.)
    const songFileId = data.Lana_Del_Rey[songKey]; // Get the corresponding file ID from the songData object

    console.log(songKey);
    if (songFileId) {
        // Send the audio file using the file_id
        return ctx.replyWithAudio(songFileId);
    } else {
        return ctx.reply('Song not found.');
    }
});
bot.action(['grenade'], (ctx) => {
    const data = readPlaylistFromFile();
    const songKey = ctx.match[0]; // This retrieves the callback data (like 'happy', 'ocean', etc.)
    const songFileId = data.bruno_Mars[songKey]; // Get the corresponding file ID from the songData object

    console.log(songKey);
    if (songFileId) {
        // Send the audio file using the file_id
        return ctx.replyWithAudio(songFileId);
    } else {
        return ctx.reply('Song not found.');
    }
});
bot.action(['another_love'], (ctx) => {
    const data = readPlaylistFromFile();
    const songKey = ctx.match[0]; // This retrieves the callback data (like 'happy', 'ocean', etc.)
    const songFileId = data.tom_odell[songKey]; // Get the corresponding file ID from the songData object

    console.log(songKey);
    if (songFileId) {
        // Send the audio file using the file_id
        return ctx.replyWithAudio(songFileId);
    } else {
        return ctx.reply('Song not found.');
    }
});
bot.action(['mockingbird'], (ctx) => {
    const data = readPlaylistFromFile();
    const songKey = ctx.match[0]; // This retrieves the callback data (like 'happy', 'ocean', etc.)
    const songFileId = data.eminem[songKey]; // Get the corresponding file ID from the songData object

    console.log(songKey);
    if (songFileId) {
        // Send the audio file using the file_id
        return ctx.replyWithAudio(songFileId);
    } else {
        return ctx.reply('Song not found.');
    }
});
bot.action(['a_sky', 'yellow', 'viva'], (ctx) => {
    const data = readPlaylistFromFile();
    const songKey = ctx.match[0]; // This retrieves the callback data (like 'happy', 'ocean', etc.)
    const songFileId = data.coldplay[songKey]; // Get the corresponding file ID from the songData object

    console.log(songKey);
    if (songFileId) {
        // Send the audio file using the file_id
        return ctx.replyWithAudio(songFileId);
    } else {
        return ctx.reply('Song not found.');
    }
});

app.get('/', (req, res) => {
    res.send('Bot is running!');
  });

  bot.launch()
  .then(() => console.log('Bot is running'))
  .catch((err) => console.error('Failed to launch the bot:', err));

// Start the Express server
const PORT = process.env.PORT || 5000; // Change to an unused port if necessary
app.listen(2000, () => {
  console.log(`Server is running on port ${2000}`);
});
