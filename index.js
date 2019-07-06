const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const rp = require("request-promise");
const $ = require("cheerio");
const quotes = require("./static/quotes.json");
// replace the value below with the Telegram token you receive from @BotFather
const token = "891800756:AAEN3xOfEEYIYJ2qjd58AJnYCJss_OoWQXM";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.onText(/\/heylisa/, msg => {
  //whoareyou script
  var out =
    "Hey, I am Lisa. I am neither related to Apple nor NASA. You can interact with me using the following commands:\n";
  var c1 = "/xkcd - I will send an awesome xkcd script all your way.\n";
  var c2 = "/chuck - A fun Chuck Norris joke all your way.\n";
  var c3 =
    "/chuck <firstname> - A Chuck Norris joke with the named person as the main character.\n";
  var c4 = "/quote - An inspirational quote all your way.\n";
  out = out + c1 + c2 + c3 + c4;
  bot.sendMessage(msg.chat.id, out);
});

bot.on("message", msg => {
  //getting message
  var args = msg.text.split(" ");
  const chatId = msg.chat.id;

  //chuck norris script
  if (args[0] == "/chuck") {
    if (!args[1]) {
      var norris = "http://api.icndb.com/jokes/random";
    } else {
      var norris = "http://api.icndb.com/jokes/random?firstName=" + args[1];
    }
    // Make a request for a user with a given ID
    axios
      .get(norris)
      .then(function(response) {
        // handle success
        var joke = response["data"].value.joke;
        bot.sendMessage(chatId, joke);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .finally(function() {
        // always executed
      });
  }
  //xkcd script
  if (args[0] == "/xkcd") {
    var max = 3000;
    var min = 0;
    var index = Math.floor(Math.random() * (+max - +min)) + +min;
    const url = "https://xkcd.com/" + index;
    console.log(url);

    rp(url)
      .then(function(html) {
        //success!
        var strip = $("#comic > img", html)[0].attribs.src;
        strip = "https:" + strip;
        console.log(strip);

        bot.sendPhoto(chatId, strip);
      })
      .catch(function(err) {
        //handle error
        bot.sendPhoto(
          chatId,
          "https://imgs.xkcd.com/comics/angular_momentum.jpg"
        );
        console.log("error");
      });
  }
  //quote script
  //quote script
  if (args[0] == "/quote") {
    if (!args[1]) {
      var quoteID = Math.floor(Math.random() * quotes.length);
      var quote = quotes[quoteID].text;
      var author = quotes[quoteID].from;
      var full_quote = quote + "\nBy - " + author;
      bot.sendMessage(chatId, full_quote);
    }
  }
});
