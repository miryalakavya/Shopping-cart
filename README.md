# Responsive Shopping Cart

A simple **shopping cart** application built with **JavaScript, HTML, and CSS**, featuring a **responsive design** for mobile and desktop users.

## Features

✔️ Add items from inventory to the shopping cart  
✔️ Edit item quantities in the cart  
✔️ Remove items from the cart  
✔️ Checkout functionality to clear the cart  
✔️ Fully **responsive** UI for mobile, tablet, and desktop  
✔️ Clean, modern **UI design**  

---
## Screenshots
![Shopping Cart](https://github.com/miryalakavya/Shopping-cart/blob/main/Screenshot/Sceenshot.png)

---

## Technologies Used

- **HTML5** - Structuring the UI  
- **CSS3** - Styling (Flexbox, Media Queries for responsiveness)  
- **JavaScript (ES6)** - Managing cart logic  
- **JSON Server** - Mock backend for storing cart and inventory data  

---

## Setup Instructions

### **1️ Clone the Repository**
Clone this repository using:
```sh
git clone https://github.com/YOUR_USERNAME/shopping-cart.git
cd shopping-cart
```

### **2️ Install Dependencies**
This project requires **JSON Server** to mock an API. Install it globally using:
```sh
npm install -g json-server
```

### **3️ Start the Backend (Mock API)**
Run the following command to start the JSON Server:
```sh
json-server --watch db.json --port 3000
```
This will serve your **cart** and **inventory** data on `http://localhost:3000`.

### **4️ Open the Project**
Simply open `index.html` in your browser:
```sh
open index.html  # Mac
start index.html  # Windows
```

---

## How It Works

**1️** Increase or decrease item quantities in the **inventory section**  
**2️** Click "**Add to Cart**" to move selected items into the cart  
**3️** Edit or remove items inside the **shopping cart**  
**4️** Click "**Checkout**" to clear the cart  

---

##  `db.json` Sample Data
This file is used by **JSON Server** to store inventory and cart data.

```json
{
  "inventory": [
    { "id": 1, "content": "apple" },
    { "id": 2, "content": "peach" }
  ],
  "cart": []
}
```

---

## Responsive Design
This shopping cart is **fully responsive** across all screen sizes.

✔️ **Desktop**: Two-column layout  
✔️ **Tablet**: Adjusted flexible layout  
✔️ **Mobile**: Stacked layout with full-width buttons  

### **Responsive Design Preview**
| Desktop 💻 | Mobile 📱 |
|------------|----------|
| ![Desktop View](![Shopping Cart](https://github.com/miryalakavya/Shopping-cart/blob/main/Screenshot/Sceenshot.png)) | ![Mobile View](https://github.com/miryalakavya/Shopping-cart/blob/main/Screenshot/mobile.png) |


