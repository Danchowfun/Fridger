const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock'); // Adjust the path as necessary
const verifyToken = require('../middleware/authenticateToken'); // Assuming you have a middleware to verify tokens

// GET endpoint to fetch not-removed stock items for the logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id; // Assuming your verifyToken middleware adds user info to req.user
    const userStock = await Stock.findOne({ userId: userId }, 'items -_id').lean();

    if (!userStock) {
      return res.status(404).json({ message: 'No stock found for this user.' });
    }

    // Filter out removed items
    const notRemovedItems = userStock.items.filter(item => !item.removed);

    res.json(notRemovedItems);
  } catch (error) {
    console.error('Failed to fetch stock items:', error);
    res.status(500).json({ message: 'Error fetching stock items.' });
  }
});

router.patch('/items/:itemId/remove', verifyToken, async (req, res) => {
  const userId = req.user._id; // Extracted from the verified token
  const { itemId } = req.params;

  try {
    // Using findOneAndUpdate to directly update the subdocument
    const result = await Stock.findOneAndUpdate(
      { userId, "items._id": itemId }, // Match condition
      { $set: { "items.$.removed": true } }, // Update operation
      { new: true } // Options: return the updated document
    );

    if (!result) {
      return res.status(404).json({ message: 'Stock not found for this user, or item not found.' });
    }

    // Optionally, you could filter the items on the backend before sending the response
    // to only include items not marked as removed, or handle this filtering on the frontend
    res.json({ message: 'Item removed successfully.', stock: result });
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({ message: 'Error removing item.' });
  }
});

module.exports = router;
