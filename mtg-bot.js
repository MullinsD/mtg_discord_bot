const Discord = require("discord.js");
const mtg = require('mtgsdk');
const client = new Discord.Client();

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  const args = message.content.trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  switch (command) {
      case 'mtg':
        let cardName = args.slice(0).join(" ");
        mtg.card.where({name: cardName})
        .then(cards => {
            console.log(cards);
            if (cards.length) {
                for( var i = 0; i < cards.length; i++) {
                    if(cards[i].hasOwnProperty('imageUrl')) {
                        break;
                    }
                }
                var additional = "";
                if(cards[i].types.indexOf("Planeswalker") > -1) {
                    additional = "Loyalty: " + cards[i].loyalty;
                }
                else if(cards[i].types.indexOf("Creature") > -1) {
                    additional = `${cards[i].power}/${cards[i].toughness}`;
                }
                const embeddedCard = new Discord.RichEmbed()
                .setTitle(cards[i].name + " " + cards[i].manaCost)
                .setColor(0x00AE86)
                .setDescription(cards[i].types.join(" ") + '\n' + cards[i].text + `\n${additional}`)
                .setTimestamp()
                .setURL(`http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${cards[i].multiverseid}`)
                .setImage(cards[i].imageUrl);
                message.channel.send(embeddedCard);
            }
            else {
                message.channel.send("Did you mean...");
                console.log(cardName.split(/ +/g)[0])
               /*  mtg.card.all({name: cardName.split(/ +/g)[0]})
                .on('data', card => {
                    console.log(card.name);
                    message.channel.send(card.name);
                }) */
            }
        })
        break;
  }
});

client.login(process.env.TOKEN);