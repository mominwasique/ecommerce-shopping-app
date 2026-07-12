'use client'

import React from 'react'
import { useEffect, useState } from 'react'

const Global = (Component) => {

  useEffect(() => {


    return () => {
      second
    }
  }, [])

  const [cart, setCart] = useState([]);

  const addToCart = (item, qty) => {
    let newCart = cart; // Create a new array copy
    newCart.push(item);
    setCart(newCart);
  };

  const removeFromCart = (item, qty) => {
    let newCart = cart; // Create a new array copy
    let index = newCart.indexOf(item);
    newCart.splice(index); // Add second parameter to remove only one item
    setCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
  };
  return (
    <div>
      <Component>
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      </Component>
    </div>
  )
}

export default Global

