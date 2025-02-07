const API = (() => {
  const URL = "http://localhost:3000";

  const getCart = async () => {
      const response = await fetch(`${URL}/cart`);
      return response.json();
  };

  const getInventory = async () => {
      const response = await fetch(`${URL}/inventory`);
      return response.json();
  };

  const addToCart = async (inventoryItem, quantity) => {
      if (quantity > 0) {
          const cartItems = await getCart();
          const existingItem = cartItems.find((item) => item.id === inventoryItem.id);

          // Ensure content is cleaned before sending to backend
          const cleanedContent = inventoryItem.content.trim().replace(/\s*x$/, '').replace(/ x$/, '');

          if (existingItem) {
              await updateCart(existingItem.id, existingItem.amount + quantity);
          } else {
              await fetch(`${URL}/cart`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: inventoryItem.id, content: cleanedContent, amount: quantity }),
              });
          }
          document.querySelector(`.inventory-amount[data-id="${inventoryItem.id}"]`).textContent = 0;
      }
  };

  const updateCart = async (id, newAmount) => {
      if (newAmount > 0) {
          await fetch(`${URL}/cart/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount: newAmount }),
          });
      } else {
          await deleteFromCart(id);
      }
  };

  const deleteFromCart = async (id) => {
      await fetch(`${URL}/cart/${id}`, { method: "DELETE" });
  };

  const checkout = async () => {
      const cart = await getCart();
      for (const item of cart) {
          await deleteFromCart(item.id);
      }
  };

  return { getCart, getInventory, addToCart, updateCart, deleteFromCart, checkout };
})();

const View = (() => {
  const domSelectors = {
      inventoryList: document.querySelector(".inventory__list"),
      cartList: document.querySelector(".cart__list"),
      checkoutBtn: document.querySelector(".checkout-btn"),
  };

  const renderInventory = (inventory) => {
      domSelectors.inventoryList.innerHTML = inventory
          .map(
              (item) => `
          <li>
            ${item.content}
            <button class="decrease" data-id="${item.id}">-</button>
            <span class="inventory-amount" data-id="${item.id}">0</span>
            <button class="increase" data-id="${item.id}">+</button>
            <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
          </li>
        `
          )
          .join("");
  };

  const renderCart = (cart) => {
      domSelectors.cartList.innerHTML = cart
          .map(
              (item) => `
          <li data-id="${item.id}">
            ${item.content.trim().replace(/\s*x$/, '').replace(/ x$/, '')} 
            <span class="cart-amount" data-id="${item.id}">${item.amount}</span>
            <button class="edit" data-id="${item.id}">Edit</button>
            <button class="delete" data-id="${item.id}">Delete</button>
          </li>
        `
          )
          .join("");
  };

  return { domSelectors, renderInventory, renderCart };
})();

const Controller = ((model, view) => {
  const init = async () => {
      const inventory = await model.getInventory();
      const cart = await model.getCart();

      view.renderInventory(inventory);
      view.renderCart(cart);

      attachEventListeners();
  };

  const attachEventListeners = () => {
      document.addEventListener("click", async (e) => {
          const id = parseInt(e.target.dataset.id);

          // Increase inventory count
          if (e.target.classList.contains("increase")) {
              const span = document.querySelector(`.inventory-amount[data-id="${id}"]`);
              span.textContent = parseInt(span.textContent) + 1;
          }

          // Decrease inventory count
          if (e.target.classList.contains("decrease")) {
              const span = document.querySelector(`.inventory-amount[data-id="${id}"]`);
              span.textContent = Math.max(0, parseInt(span.textContent) - 1);
          }
        
          // Add to Cart
          if (e.target.classList.contains("add-to-cart")) {
              const amount = parseInt(document.querySelector(`.inventory-amount[data-id="${id}"]`).textContent);
              const rawContent = e.target.parentElement.firstChild.textContent.trim();
              
              // Remove unnecessary "x" before adding to the cart
              const cleanedContent = rawContent.replace(/\s*x$/, '').replace(/ x$/, '');

              const inventoryItem = { id, content: cleanedContent };
              await model.addToCart(inventoryItem, amount);
              document.querySelector(`.inventory-amount[data-id="${id}"]`).textContent = 0;
              view.renderCart(await model.getCart());
          }

          // Delete from Cart
          if (e.target.classList.contains("delete")) {
              await model.deleteFromCart(id);
              view.renderCart(await model.getCart());
          }

          // Edit Cart Item
          if (e.target.classList.contains("edit")) {
              const listItem = e.target.closest("li");
              const quantitySpan = listItem.querySelector(".cart-amount");
              const quantity = parseInt(quantitySpan.textContent.trim());

              const itemName = listItem.firstChild.textContent.trim().replace(/\s*x$/, '').replace(/ x$/, '');

              listItem.innerHTML = `
                  ${itemName} 
                  <button class="decrease-cart" data-id="${id}">-</button>
                  <span class="cart-amount" data-id="${id}">${quantity}</span>
                  <button class="increase-cart" data-id="${id}">+</button>
                  <button class="save" data-id="${id}">Save</button>
                  <button class="delete" data-id="${id}">Delete</button>
              `;
          }

          // Increase quantity in Cart Edit Mode
          if (e.target.classList.contains("increase-cart")) {
              const span = document.querySelector(`.cart-amount[data-id="${id}"]`);
              span.textContent = parseInt(span.textContent) + 1;
          }

          // Decrease quantity in Cart Edit Mode
          if (e.target.classList.contains("decrease-cart")) {
              const span = document.querySelector(`.cart-amount[data-id="${id}"]`);
              span.textContent = Math.max(1, parseInt(span.textContent) - 1);
          }

          // Save edited Cart Item
          if (e.target.classList.contains("save")) {
              const newAmount = parseInt(document.querySelector(`.cart-amount[data-id="${id}"]`).textContent);
              await model.updateCart(id, newAmount);
              view.renderCart(await model.getCart());
          }
      });

      // Checkout button
      view.domSelectors.checkoutBtn.addEventListener("click", async () => {
          if (confirm("Are you sure you want to checkout?")) {
              await model.checkout();
              view.renderCart([]);
          }
      });
  };

  return { init };
})(API, View);

document.addEventListener("DOMContentLoaded", Controller.init);
