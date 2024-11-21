'use strict';

document.addEventListener('DOMContentLoaded', function () {
  const cartList = document.getElementById('cart-list');
  const cartTotal = document.getElementById('cart-total');
  const emptyCartMessage = document.getElementById('empty-cart-message');
  const generalCardImage = './assets/images/cart-card.jpg';

  // Check if cartList, cartTotal, and emptyCartMessage elements exist
  if (!cartList || !cartTotal || !emptyCartMessage) {
    console.error('Cart elements not found.');
    return;
  }

  // Function to update the cart total
  function updateCartTotal() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const total = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
      return sum + price;
    }, 0);

    cartTotal.textContent = `$${total.toFixed(2)}`;
  }

  // Function to get the appropriate image size based on screen width
  function getImageSize() {
    return window.innerWidth <= 600 ? '80px' : '100px';
  }

  // Render cart items
  function renderCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartList.innerHTML = '';
  
    if (cartItems.length === 0) {
      emptyCartMessage.style.display = 'block';
    } else {
      emptyCartMessage.style.display = 'none';
      cartItems.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
  
        // Set image size based on screen width
        const imageSize = getImageSize();
  
        cartItem.innerHTML = `
          <img src="${generalCardImage}" alt="General Card" style="border-radius: 10px; width: ${imageSize}; height: auto;">
          <div class="cart-item-info" style="color: red;">
            <div class="card-title">${item.title}</div>
            <div class="card-description">${item.description}</div>
            <div class="card-price">${item.price}</div>
          </div>
          <button class="remove-item" data-index="${index}">x</button>
        `;
  
        cartList.appendChild(cartItem);
      });
    }
  
    updateCartTotal();
    updateModalCartTotal(); // Update modal total
  }

  // Function to add cart Items to checkout Modal
  function updateModalCartTotal() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const total = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
      return sum + price;
    }, 0);
  
    // Update the cart total in the modal
    const modalCartTotal = document.getElementById('modal-cart-total');
    if (modalCartTotal) {
      modalCartTotal.textContent = `$${total.toFixed(2)}`;
    }
  }

  // Function to remove item from cart
  function removeCartItem(index) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCartItems();
  }

  // Handle remove button click
  cartList.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-item')) {
      const index = e.target.getAttribute('data-index');
      removeCartItem(index);
    }
  });

  // Initial render of cart items
  renderCartItems();

  // Checkout Functionality
  const checkoutButton = document.querySelector('.checkout-btn');
  const modal = document.getElementById('modal');

  checkoutButton.addEventListener('click', function () {
    updateModalCartTotal(); // Update the total before showing the modal
    modal.style.display = 'flex';
  });

  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  document.querySelectorAll('.grid-item').forEach(function (item) {
    item.addEventListener('click', function () {
      const formId = item.getAttribute('data-target');
      const formOverlay = document.getElementById(formId);
      formOverlay.style.display = 'flex';
      modal.style.display = 'none';
    });
  });

  document.querySelectorAll('.close-form').forEach(function (button) {
    button.addEventListener('click', function () {
      const formOverlay = button.closest('.form-overlay');
      formOverlay.style.display = 'none';
    });
  });

  // Replace with your actual Telegram Bot API key and chat ID
  const telegramApiKey = '7349914973:AAGj0OxyMtxwXfZ3i2XeWUVB-9r5ctLiFak';
  const chatId = '5576539609';

  // Handle form submissions for each checkout form
  document.querySelectorAll('[id^="checkout-form"]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent the default form submission behavior

      // Gather the form data
      const formData = new FormData(form);
      let message = 'Sold Goods Submission:\n';
      
      // Get cart items from localStorage
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      if (cartItems.length > 0) {
        message += 'Cart Items:\n';
        cartItems.forEach(item => {
          message += `     ${item.title} - ${item.price}\n`;
        });
      } else {
        message += 'No items in the cart.\n';
      }

      // Append user information
      const userEmail = formData.get('email') || 'No email provided'; // Adjust the key as necessary
      message += `By User: ${userEmail}\n`;

      // Include the submitted image (if applicable)
      const submittedImage = formData.get('payment-screenshot'); // Change the key to match your form's file input
      if (submittedImage) {
        message += `Image: [Payment Screenshot]\n`; // Link or text placeholder for the image
      }

      // Send the data to Telegram
      fetch(`https://api.telegram.org/bot${telegramApiKey}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML', // Optional: to enable HTML formatting
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.ok) {
          // Display the payment confirmation popup
          const paymentPopup = document.getElementById('payment-popup');
          paymentPopup.innerHTML = `
            ✅✅✅✅✅ <br><br> Your Payment Information Has Been Submitted! Your Goods Should Drop To Your Inbox Soon.<br><br>
            If Your Goods Are Not Received Within 25 Minutes! Please Check Your Spam Email Folder! <br><br>
            Can't Locate Your Goods Or Need A Refund? Find The SUPPORT Tab in the Navigation. Without a Proof Of Payment Confirmation Refunds Are Guaranteed!
          `;
          paymentPopup.style.backgroundColor = '#007BFF'; // Light blue background
          paymentPopup.style.display = 'block';

          // Show the "Back To Home Page" button
          const backHomeButton = document.querySelector('.back-home-button');
          backHomeButton.style.display = 'block';

          // Hide the form
          const formOverlay = form.closest('.form-overlay');
          formOverlay.style.display = 'none';

          // Clear the form inputs
          form.reset();

          // Clear the cart
          clearCart();
        } else {
          console.error('Error sending message to Telegram:', data.description);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  });

  // Function to clear cart
  function clearCart() {
    localStorage.removeItem('cartItems');
    renderCartItems();
  }

  // Copy BTC Address to Clipboard
  const btcAddressSpan = document.getElementById('btc-address');
  if (btcAddressSpan) {
    btcAddressSpan.addEventListener('click', function () {
      navigator.clipboard.writeText(btcAddressSpan.textContent)
        .then(() => {
          const paymentPopup = document.getElementById('payment-popup');
          paymentPopup.textContent = 'Address Copied!';
          paymentPopup.style.backgroundColor = '#28a745'; // Green background
          paymentPopup.style.display = 'block';
          setTimeout(() => {
            paymentPopup.style.display = 'none';
          }, 1000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    });
  }
});
