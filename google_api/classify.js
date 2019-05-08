// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// Creates a client
const client = new language.LanguageServiceClient();

/**
 * TODO(developer): Uncomment the following line to run this code.
 */
const text = 'The food at this restaurant is horrible. I will never go back!';

// Prepares a document, representing the provided text
const document = {
  content: text,
  type: 'PLAIN_TEXT',
};

// Classifies text in the document
client
  .classifyText({document: document})
  .then(results => {
    const classification = results[0];

    console.log('Categories:');
    classification.categories.forEach(category => {
      console.log(
        `Name: ${category.name}, Confidence: ${category.confidence}`
      );
    });
  })
  .catch(err => {
    console.error('ERROR:', err);
  });

