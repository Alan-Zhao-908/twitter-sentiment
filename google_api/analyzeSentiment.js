// Imports the Google Cloud client library
const language = require('@google-cloud/language');
// Creates a client
const client = new language.LanguageServiceClient();

let analyzeSentiment = (text) => {

  /**
   * TODO(developer): Uncomment the following line to run this code.
   */
  // let text = 'Elderen is amazing! He is so smart';

  // Prepares a document, representing the provided text
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  return new Promise((resolve, reject) => {
    // Detects syntax in the document
    client
    .analyzeSentiment({document: document})
    .then(results => {
      let magnitude = results[0].documentSentiment.magnitude
      let score = results[0].documentSentiment.score
      resolve([score, magnitude])
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  })
  }


module.exports = analyzeSentiment