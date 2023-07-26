const fs = require('fs');
const axios = require('axios');
const readline = require('readline');

// Function to prompt the user for input
function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Function to write content to a file
function writeFile(filename, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, content, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Function to read content from a file
function readFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// Function to send data to OpenAI API
async function sendToOpenAI(inputData) {
  const apiKey = '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'; // Replace with your OpenAI API key
  const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-002/completions' ; // Or any other API endpoint you want to use

  try {
    const response = await axios.post(apiUrl, {
      prompt: inputData,
      max_tokens: 150 // Adjust as needed
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].text;
  } catch (error) {
    console.error('Error while sending data to OpenAI:', error.message);
    return '';
  }
}

// Main function to run the script
async function main() {
  const userInput = await prompt('Enter your input: ');

  // Write user input to input.txt file
  await writeFile('input.txt', userInput);

  // Read the input from input.txt file
  const inputFromFile = await readFile('input.txt');

  // Process the input (You can perform any processing you need here)

  // Send the processed input to OpenAI API
  const output = await sendToOpenAI(inputFromFile);

  // Write the output to output.txt file
  await writeFile('output.txt', output);

  console.log('Processing complete! Check output.txt for the result.');
}

// Call the main function to start the process
main().catch((error) => console.error(error));
