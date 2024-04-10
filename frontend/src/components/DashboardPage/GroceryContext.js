// GroceryContext.js
import React, { createContext, useContext, useState } from 'react';

const GroceryContext = createContext();

export function useGrocery() {
  return useContext(GroceryContext);
}

export const GroceryProvider = ({ children }) => {
  const [refreshGroceries, setRefreshGroceries] = useState(false);

  return (
    <GroceryContext.Provider value={{ refreshGroceries, setRefreshGroceries }}>
      {children}
    </GroceryContext.Provider>
  );
};
