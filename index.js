const fs = require("fs");
const { Parser } = require("json2csv");

let rawdata = fs.readFileSync("source/data.json");
let data = JSON.parse(rawdata);

let users = {};
for (let i = 0; i < data.members.length; i++) {
  const member = data.members[i];
  users[member.id] = member.fullName;
}

let lists = {};
for (let i = 0; i < data.lists.length ; i++) {
    const list = data.lists[i];

    // only opened lists
    if(!list.closed) {
      lists[list.id] = list.name;
    }
}

let labels = {};
for (let i = 0; i < data.labels.length; i++) {
  const label = data.labels[i];
  labels[label.id] = label.name;
}

parsedCards = [];
for (let i = 0; i < data.cards.length; i++) {
  const card = data.cards[i];

  // labels
  let cardLabels = [];
  for (let i = 0; i < card.labels.length; i++) {
    const label = card.labels[i];
    cardLabels.push(label.name);
  }

  // users
  let cardUsers = [];
  for (let i = 0; i < card.idMembers.length; i++) {
    const userId = card.idMembers[i];

    cardUsers.push(users[userId]);
  }

  if(!card.closed) {
    parsedCards.push({
      name: card.name,
      description: card.desc,
      list: lists[card.idList],
      members: cardUsers.toString(),
      labels: cardLabels.toString(),
    });
  }
}

//parse csv
const fields = ["name", "description", "list", "members", "labels"];
const opts = { fields };

try {

    // JSON FILE
    fs.truncate("dist/data.json", 0, function () {
      // write json
      fs.writeFileSync('dist/data.json', JSON.stringify(parsedCards));
    });


    // CSV FILE
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(parsedCards);

  // clear file
    fs.truncate("dist/data.csv", 0, function () {
      // write csv
      fs.writeFileSync("dist/data.csv", csv);
    });
} catch (err) {
  console.error(err);
}
