const express = require('express');
const multer = require('multer');
const Receipt = require('../models/Receipt');
const Stock = require('../models/Stock');
const { analyzeImageWithGPT } = require('../services/gptService'); // Adjust the path as necessary

const upload = multer({ dest: 'uploads/' }); // Stores files in 'uploads/' folder
const router = express.Router();

router.post('/upload', upload.single('receipt'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const gptResponse = await analyzeImageWithGPT(req.file.path);
        const content = gptResponse.choices[0].message.content;


        // Assuming the CSV pattern you are interested in is "item name, full name, quantity, price"
        // and considering that the quantity might also include units (not just digits), the regex has been adjusted
        const csvPattern = /^.+,.+,.+,[\w\s]+,\d+(\.\d+)?$/gm;
        const matchedLines = content.replace(/"/g, '').match(csvPattern);
        console.log(content)
        console.log(matchedLines)
        if (!matchedLines) {
            throw new Error("No valid grocery data found.");
        }

        // Process matched lines into structured grocery data
        const groceryData = matchedLines.map(line => {
            const [itemName, generalName, category, quantity, priceString] = line.split(',');
            return {
                itemName,
                generalName,
                category,
                quantity,
                price: parseFloat(priceString),
                bestByDate: new Date(new Date().setDate(new Date().getDate() + 30)),
                dateAdded: new Date() 
            };
        });

        const newReceipt = new Receipt({
            userId: req.user._id,
            dateTime: new Date(),
            groceryData: groceryData,
        });

        await newReceipt.save();

        // Save items to the StockItem database
        await Stock.findOneAndUpdate(
            { userId: req.user._id },
            { $push: { items: { $each: groceryData } } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
          );

        res.status(201).json({ message: 'Receipt uploaded and analyzed successfully', receiptId: newReceipt._id });
    } catch (error) {
        console.error('Error processing receipt:', error);
        res.status(500).send('Error processing receipt.');
    }
});

module.exports = router;
