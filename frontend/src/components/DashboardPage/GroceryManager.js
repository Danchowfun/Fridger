import React, { useState, useEffect, useCallback } from 'react';
import './dashboard.css';
import { useGrocery } from './GroceryContext';

import { ReactComponent as DefaultLogo } from '../../assets/default-logo.svg';
import { ReactComponent as SnackLogo } from '../../assets/snacks.svg';
import { ReactComponent as BeverageLogo } from '../../assets/beverage.svg';
import { ReactComponent as BreadLogo } from '../../assets/bread.svg';
import { ReactComponent as SaltLogo } from '../../assets/salt.svg';
import { ReactComponent as VegetableLogo } from '../../assets/vegetable.svg';
import { ReactComponent as MeatLogo } from '../../assets/meat.svg';
import { ReactComponent as SauceLogo } from '../../assets/sauce.svg';
import { ReactComponent as DessertLogo } from '../../assets/dessert.svg';
import { ReactComponent as PenIcon } from '../../assets/pencil.svg'; // Assuming you have these SVGs
import { ReactComponent as CrossIcon } from '../../assets/bin.svg';
import { ReactComponent as CancelIcon } from '../../assets/cancel.svg'; // Assuming you have these SVGs
import { ReactComponent as SubmitIcon } from '../../assets/check.svg';

function GroceryManager() {
  const { refreshGroceries, setRefreshGroceries } = useGrocery();
  const [groceries, setGroceries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastItemId, setLastItemId] = useState(null);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [editableItemId, setEditableItemId] = useState(null);


  const fetchGroceries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/stock`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setGroceries(data.filter(item => !item.removed));
    } catch (error) {
      console.error('Error fetching groceries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroceries();
  }, []);

  useEffect(() => {
    if (refreshGroceries) {
      fetchGroceries();
      setRefreshGroceries(false);
    }
  }, [refreshGroceries, setRefreshGroceries]);
  
  // Adjusted event handlers for starting and canceling editing
  const startEditing = (id) => {
    setEditableItemId(id);
    // Optionally, immediately expand the new item being edited and ensure it doesn't collapse
    setExpandedItemId(id);
  };

  const cancelEditing = () => {
    setEditableItemId(null);
  };

  // Implement the submitChanges logic according to your app's needs
  const submitChanges = (id) => {
    console.log(`Submitting changes for item ${id}`);
    // Reset editable state after submission
    setEditableItemId(null);
  };

  const removeItem = useCallback(async (itemId) => {
    try {
      const itemElement = document.getElementById(`item-${itemId}`);
      itemElement.classList.add('fade-out');
  
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/stock/items/${itemId}/remove`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) throw new Error('Failed to remove the item');
  
      // Wait for the transition to finish before removing the item from the list
      setTimeout(() => {
        setGroceries(prevGroceries => prevGroceries.filter(item => item._id !== itemId));
      }, 300); // Match this to your CSS transition duration
      setExpandedItemId(null);
      setLastItemId(null);
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Error removing item.');
    }
  }, []);


  const handleMouseEnter = (itemId, event) => {
    // Assume you have state for managing expandedItemId, lastItemId, and a state or context for maxWidth
    const itemElement = event.currentTarget;
  
    // Get the bounding rectangles
    const itemListRect = itemElement.parentNode.getBoundingClientRect();
    const itemRect = itemElement.getBoundingClientRect();
  
    // Calculate if expanding the item would make it too wide
    itemElement.classList.add('expanded'); // Expand the element
    const expandedRect = itemElement.getBoundingClientRect();
    const expandedWidthEstimate = expandedRect.width; // Example, adjust based on your actual expanded size
    const isTooWide = (itemListRect.right - itemRect.left) < expandedWidthEstimate + 15; 
  
    if (isTooWide) {
      // Set max-width to the item's current width minus some offset if needed
      const newMaxWidth = `${itemListRect.right - itemRect.left - 60}px`;
      document.documentElement.style.setProperty('--expanded-max-width', newMaxWidth);
      setLastItemId(itemId);
    } else {
      // Otherwise, allow it to expand fully by setting max-width to a larger value or 'none'
      document.documentElement.style.setProperty('--expanded-max-width', 'none');
    }
  
    itemElement.classList.remove('expanded');// Assuming double width on expand
    setExpandedItemId(itemId); // Trigger expansion in your component's state
  };

  const handleMouseLeave = () => {
    setExpandedItemId(null);
    setLastItemId(null);
    // Reset padding when the mouse leaves an item
  };
  
  const calculateDaysInStock = useCallback((dateAdded) => {
    const today = new Date();
    const addDate = new Date(dateAdded);
    const timeDiff = today - addDate;
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }, []);

  if (isLoading) {
    return <div>Loading groceries...</div>;
  }

  return (
    <div>
      <div className="title-container">Stock</div>
      <div className="item-list">
        {groceries.length > 0 ? groceries.map(grocery => (
          <div 
          key={grocery._id}
          id={`item-${grocery._id}`}
          className={`item-container ${expandedItemId === grocery._id ? 'expanded' : ''} ${editableItemId === grocery._id ? 'editing' : ''} ${lastItemId === grocery._id ? 'lasted' : ''}`}
          onMouseEnter={(e) => {
            if (!editableItemId) handleMouseEnter(grocery._id, e);
          }}
          onMouseLeave={() => {
            if (!editableItemId) handleMouseLeave();
          }}
        >
          <div className="item-actions cross-action">
            <CrossIcon className="action-icon cross-icon" onClick={() => removeItem(grocery._id)} />
          </div>
          {expandedItemId === grocery._id && editableItemId !== grocery._id && (
            <div className="item-actions pen-action" onClick={() => startEditing(grocery._id)}>
              <PenIcon className="action-icon pen-icon" />
            </div>
          )}
          {editableItemId === grocery._id && (
            <div className="item-actions edit-actions">
              <CancelIcon className="edit-action-icon" onClick={cancelEditing} />
              <SubmitIcon className="edit-action-icon" onClick={() => submitChanges(grocery._id)} />
            </div>
          )}
          <div className="item-content">
              {getCategoryLogo(grocery.category)}
              <div>
                <span className="item-name">
                  {grocery.generalName && grocery.generalName.length > 50 ? `${grocery.generalName.substring(0, 45)}...` : grocery.generalName}
                </span>
                <span className="item-expiration">{calculateDaysInStock(grocery.dateAdded)} days in stock</span>
              </div>
          </div>
          <div className="item-details">
            {editableItemId === grocery._id ? (
              <>
                <p>
                  Original Name:
                  <input defaultValue={grocery.itemName} />
                </p>
                <p>
                  Category:
                  <input defaultValue={grocery.category} />
                </p>
                <p>
                  Quantity:
                  <input defaultValue={grocery.quantity} />
                </p>
                <p>
                  Price:
                  <input defaultValue={grocery.price} />
                </p>
                {/* Implement Save functionality */}
              </>
            ) : (
              <>
                <pp>Original Name: {grocery.itemName}</pp>
                <pp>Category: {grocery.category}</pp>
                <pp>Quantity: {grocery.quantity}</pp>
                <pp>Price: ${grocery.price}</pp>
              </>
            )}
          </div>
        </div>
        )) : <p>No groceries found.</p>}
      </div>
    </div>
  );
}

function getCategoryLogo(category) {
  // Define an array of keywords to check for in the category
  const beverageKeywords = ['liquor', 'beverages', 'wine', 'beer', 'alchohol'];
  const freshKeywords = ['fresh', 'produce', 'salad'];
  const dessertKeywords = ['dessert', 'cream'];
  const sauceKeywords = ['sauce', 'dip', 'spread'];

  if (category){
    if (category.toLowerCase().includes('snack')) {
      return <SnackLogo />
    }
    if (beverageKeywords.some(keyword => category.toLowerCase().includes(keyword))) {
      return <BeverageLogo />
    }
    if (freshKeywords.some(keyword => category.toLowerCase().includes(keyword))) {
      return <VegetableLogo />
    }
    if (dessertKeywords.some(keyword => category.toLowerCase().includes(keyword))) {
      return <DessertLogo />
    }
    if (sauceKeywords.some(keyword => category.toLowerCase().includes(keyword))) {
      return <SauceLogo />
    }
    if (category.toLowerCase().includes('condiment')) {
      return <SaltLogo />
    }
    if (category.toLowerCase().includes('bake')) {
      return <BreadLogo />
    }
    if (category.toLowerCase().includes('meat')) {
      return <MeatLogo />
    }
  }
  return <DefaultLogo />;
}

export default GroceryManager;
