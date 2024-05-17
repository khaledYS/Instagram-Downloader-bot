const igdl = require("instagram-url-direct");
const { Telegraf, Markup } = require("telegraf");
require("dotenv").config();

const token = process.env.TOKEN;
const chnl_token = process.env.CHNL;
const bot = new Telegraf(token);
const joiningMessage = "Please Join our Channel first 🤍🤍 \n انضم الى قنات البوت اولاً 🤍🤍\n \n - https://t.me/gkcl_store \n - https://t.me/gkcl_store"
const poweredBy = "POWERED BY:@OxGkcl";

const onlyJoined = (callback) => async (ctx) => {
    const client_id = ctx.update.message.from.id;
    const res = await ctx.telegram.getChatMember(chnl_token, client_id);
    if (res.status === "left") {
        ctx.sendMessage(joiningMessage, { chat_id: client_id })
    } else {
        await callback(ctx)
    }
}
// Start command
bot.command("start", onlyJoined((ctx) => {
    ctx.reply("Send the link of the tiktok video \n ارسل رابط الفيديو")
})
)
bot.on("callback_query", async (ctx) => {
    const query = ctx.update.callback_query.data;
    const [option, ...data] = query.split("|");
    // ctx.telegram.editMessageMedia()
})

bot.on("message", onlyJoined(async (ctx) => {
    const From = ctx.update.message.from.id;

    let msg = (await ctx.reply(" Fetching your request..."));
    messageId = msg.message_id;
    chatId = msg.chat.id;

    const url = ctx.update.message.text;
    try {
        const data = await igdl(url);
        console.log("hhhhhhhhhhhh")
        if (data.results_number >= 1) {
            const res = data.url_list.map((url, _ind) => {
                return {
                    type: "video",
                    media: url
                }
            });
            await ctx.telegram.editMessageText(chatId, messageId, undefined, "Done");
            await ctx.telegram.deleteMessage(chatId, messageId)
            await ctx.sendChatAction("upload_video");
            await ctx.telegram.sendMediaGroup(chatId, res);
            await ctx.telegram.sendMessage(chatId, ("Done, " + poweredBy))
        }
    } catch (error) {
        await ctx.telegram.editMessageText(chatId, messageId, undefined, 'Invalid Link, Please provide valid links. \n الرابط غير صحيح \n \n POWERED BY:@OxGkcl')
        console.log(error)
    }
})

);

bot.catch(async (err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
    await ctx.reply("خطأ, حاول مجدداً في وقتٍ لاحق.")
    await ctx.sendMessage("خطأ, حاول مجدداً في وقتٍ لاحق." + ctx.updateType, { chat_id: 1326076292 })
})

exports.bot = bot