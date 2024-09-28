const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require("@whiskeysockets/baileys");
const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const axios = require("axios");

module.exports = sansekai = async (client, m, chatUpdate) => {
  try {
    var body = m.mtype === "conversation" ? m.message.conversation :
           m.mtype == "imageMessage" ? m.message.imageMessage.caption :
           m.mtype == "videoMessage" ? m.message.videoMessage.caption :
           m.mtype == "extendedTextMessage" ? m.message.extendedTextMessage.text :
           m.mtype == "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
           m.mtype == "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
           m.mtype == "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
           m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId || 
           m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text :
           "";
    if (m.mtype === "viewOnceMessageV2") return
    var budy = typeof m.text == "string" ? m.text : "";
    // var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
    var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/";
    const isCmd2 = body.startsWith(prefix);
    const command = body.replace(prefix, "").trim().split(/ +/).shift().toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const pushname = m.pushName || "No Name";
    const botNumber = await client.decodeJid(client.user.id);
    const itsMe = m.sender == botNumber ? true : false;
    let text = (q = args.join(" "));
    const arg = budy.trim().substring(budy.indexOf(" ") + 1);
    const arg1 = arg.trim().substring(arg.indexOf(" ") + 1);

    const from = m.chat;
    const reply = m.reply;
    const sender = m.sender;
    const mek = chatUpdate.messages[0];

    const color = (text, color) => {
      return !color ? chalk.green(text) : chalk.keyword(color)(text);
    };

    const response = await axios.get("https://nue-api.vercel.app/alicia", {params: {text: m.body}});
const {song_search, anime_search, character_search, google_search, chat_ai} = response.data;
await m.reply(chat_ai.reply);
await new Promise(resolve => setTimeout(resolve, 2000));

    //Plugin AI
if (anime_search.status) {
  try {
    const animeResponse = await axios.get(`https://api.jikan.moe/v4/anime`, {params: {q: anime_search.query}});
    const animeData = animeResponse.data.data[0];
    if (animeData) {
      const translationResponse = await axios.post('https://translate-serverless.vercel.app/api/translate', {
        message: animeData.synopsis,
        from: "en",
        to: "id"
      }, {
        headers: { 'content-type': 'application/json' }
      });
      const translatedSynopsis = translationResponse.data.translatedText;

      await client.sendMessage(from, { 
        image: { url: animeData.images.jpg.large_image_url },
        caption: `Anime ditemukan: ${animeData.title}\nSinopsis: ${translatedSynopsis}\nRating: ${animeData.score}`
      });
    } else {
      m.reply("Anime tidak ditemukan.");
    }
  } catch (error) {
    console.error(error);
    m.reply("Ada yang salah saat mengirim informasi anime. gomenasai🙏🏻");
  }
  await new Promise(resolve => setTimeout(resolve, 2000));
}

if (character_search.status) {
  try {
    const characterResponse = await axios.get(`https://api.jikan.moe/v4/characters`, {params: {q: character_search.query}});
    const characterData = characterResponse.data.data[0];
    if (characterData) {
      const translationResponse = await axios.post('https://translate-serverless.vercel.app/api/translate', {
        message: characterData.about,
        from: "en",
        to: "id"
      }, {
        headers: { 'content-type': 'application/json' }
      });
      const translatedAbout = translationResponse.data.translatedText;

      await client.sendMessage(from, { 
        image: { url: characterData.images.jpg.image_url },
        caption: `Karakter ditemukan: ${characterData.name}\nTentang: ${translatedAbout}`
      });
    } else {
      m.reply("Karakter tidak ditemukan.");
    }
  } catch (error) {
    console.error(error);
    m.reply("Ada yang salah saat mengirim informasi karakter. gomenasai🙏🏻");
  }
  await new Promise(resolve => setTimeout(resolve, 2000));
};
  if (google_search.status) {
  try {
    m.reply("Bentar... aku cari di google!🔎")
    const googleResponse = await axios.get(`https://nue-api.vercel.app/api/bard`, {params: {text: google_search.query}});
    m.reply(`${googleResponse.data.result}`);
  } catch (error) {
    console.error(error);
    m.reply("Ada yang salah saat mengirim hasil pencarian Google. gomenasai🙏🏻");
  }
    await new Promise(resolve => setTimeout(resolve, 2000));
};
  if (song_search.status) {
  try {
    const songResponse = await axios.get("https://nue-api.vercel.app/api/play", {params: {query: song_search.query}});
    m.reply(`Tunggu sebentar... sedang mengirim ${song_search.query}`);
    await client.sendMessage(from, { audio: {url: songResponse.data.download.audio}, mimetype: 'audio/mpeg'});
  } catch (error) {
    console.error(error);
    m.reply("Ada yang salah saat mengirim audio. gomenasai🙏🏻");
  }
    await new Promise(resolve => setTimeout(resolve, 2000));
                   };
  

    // Group
    const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch((e) => {}) : "";
    const groupName = m.isGroup ? groupMetadata.subject : "";

    // Push Message To Console
    let argsLog = budy.length > 30 ? `${q.substring(0, 30)}...` : budy;


    
    } catch (err) {
    console.error(err)
    m.reply("error, try again😭🙏🏻");
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});
