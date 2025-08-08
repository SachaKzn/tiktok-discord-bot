const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ]
});

const N8N_WEBHOOK_URL = 'https://fourfivesixgrowth.app.n8n.cloud/webhook-test/discord-webhook';

client.on('ready', () => {
    console.log(`🚀 Bot is online as ${client.user.tag}!`);
    console.log(`📡 Connected to ${client.guilds.cache.size} server(s)`);
});

client.on('messageCreate', async (message) => {
    // Ignore bot messages
    if (message.author.bot) return;
    
    console.log(`📥 Message from ${message.author.username}: ${message.content}`);
    
    // Check if message contains TikTok URL
    const tiktokRegex = /https?:\/\/(vm\.|www\.|m\.)?tiktok\.com\/[^\s]+/gi;
    const tiktokUrls = message.content.match(tiktokRegex);
    
    if (tiktokUrls) {
        console.log('🎵 TikTok URL detected:', tiktokUrls[0]);
        
        // Send to N8N webhook
        try {
            const response = await axios.post(N8N_WEBHOOK_URL, {
                content: message.content,
                author: {
                    id: message.author.id,
                    username: message.author.username
                },
                channel_id: message.channel.id,
                guild_id: message.guild?.id
            });
            
            console.log('✅ Sent to N8N successfully');
            await message.react('👀');
            await message.reply('🔄 Processing your TikTok video...');
            
        } catch (error) {
            console.error('❌ Error sending to N8N:', error.message);
            await message.react('❌');
            await message.reply('⚠️ Sorry, something went wrong processing that video!');
        }
    }
});

// Login with bot token
client.login(process.env.BOT_TOKEN);
