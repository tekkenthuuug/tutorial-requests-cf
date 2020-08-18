const functions = require('firebase-functions');

// http request 1
exports.randomNumber = functions.https.onRequest((req, res) => {
  const number = Math.round(Math.random() * 100);
  console.log(number);
  res.json(number);
});

// http request 2
exports.toTheDojo = functions.https.onRequest((req, res) => {
  res.redirect('https://www.thenetninja.co.uk');
});

// http callable functions
exports.sayHello = functions.https.onCall((data, context) => {
  return `hello, ${data.name}`;
});
