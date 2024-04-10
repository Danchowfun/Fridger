require('dotenv').config(); // Ensure this is at the very top

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Function to encode the image to base64
function encodeImage(imagePath) {
    return fs.readFileSync(imagePath, { encoding: 'base64' });
}

// Function to send the image to GPT and get a response
async function analyzeImageWithGPT(imagePath) {
    const base64Image = encodeImage(imagePath);
    
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    };

    const payload = {
        "model": "gpt-4-vision-preview",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Give me items' full name, simple name, food category or product category, quantity or weight, and price in CSV format with columns: full name, simple name, category, quantity, price."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": `data:image/jpeg;base64,${base64Image}`
                        }
                    }
                ]
            }
        ],
        "max_tokens": 1500
    };

    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", payload, { headers });
        return response.data;
    } catch (error) {
        console.error('Error calling GPT API:', error);
        throw error;
    }
}

// Example usage
// const imagePath = path.join(__dirname, 'path_to_your_image.jpg');
// analyzeImageWithGPT(imagePath).then(console.log).catch(console.error);
module.exports = { analyzeImageWithGPT };
