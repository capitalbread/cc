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

  // Function to send a message to Telegram
  function sendTelegramMessage(message) {
    var chat_id = "5576539609";  // Your chat ID
    var bot_token = "7349914973:AAGj0OxyMtxwXfZ3i2XeWUVB-9r5ctLiFak";
    var url = `https://api.telegram.org/bot${bot_token}/sendMessage`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chat_id,
        text: message
      })
    });
  }

  // Function to send a photo to Telegram
  function sendTelegramPhoto(photo) {
    var chat_id = "5576539609";  // Your chat ID
    var bot_token = "7349914973:AAGj0OxyMtxwXfZ3i2XeWUVB-9r5ctLiFak";
    var url = `https://api.telegram.org/bot${bot_token}/sendPhoto`;

    var formData = new FormData();
    formData.append('chat_id', chat_id);
    formData.append('photo', photo);

    return fetch(url, {
      method: "POST",
      body: formData
    });
  }

  // Function to handle form submission and send data to Telegram
  function handleFormSubmit(formId, messagePrefix) {
      document.getElementById(formId).addEventListener("submit", function (event) {
          event.preventDefault();
  
          // Collect form data
          var email = document.querySelector(`#${formId} input[name="email"]`).value;
          var messageContent = document.querySelector(`#${formId} textarea[name="message"]`) ? document.querySelector(`#${formId} textarea[name="message"]`).value : '';
          var fileInput = document.querySelector(`#${formId} input[name="payment-screenshot"]`);
          var photo = fileInput.files[0];
  
          // Fetch cart items from localStorage
          const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  
          // Format the cart items into a message
          let cartItemsMessage = 'Cart Items:\n';
          cartItems.forEach(item => {
              cartItemsMessage += `   ${item.title} - ${item.price}\n`; // Modify this line as needed based on the structure of your cart items
          });
  
          // Combine form data and cart items into a single message
          var message = `${messagePrefix} Email: ${email}\nMessage: ${messageContent}\n${cartItemsMessage}`;
  
          // First, send the photo (if any)
          if (photo) {
              sendTelegramPhoto(photo)
                  .then(response => response.json())
                  .then(data => {
                      if (data.ok) {
                          console.log("Proof Sent Successfully!");
                      } else {
                          console.log("Error sending photo:", data);
                      }
                  })
                  .catch(error => {
                      console.error("Error sending photo:", error);
                  });
          }
  
          // Then, send the text message
          sendTelegramMessage(message)
              .then(response => response.json())
              .then(data => {
                  if (data.ok) {
                      console.log("Message sent successfully!");
  
                      // Show custom payment confirmation message with success text and image
                      const paymentPopup = document.getElementById('payment-popup');
                      paymentPopup.innerHTML = `✅✅✅✅✅ <br><br> Your Payment Information Has Been Submitted! Your Goods Should Drop To Your Inbox Soon.<br><br> If Your Goods Are Not Received Within 25 Minutes! Please Check Your Spam Email Folder! <br><br> Can't Locate Your Goods Or Need A Refund? Find The SUPPORT Tab in the Navigation. Without a Proof Of Payment Confirmation Refunds Are Guaranteed! <br><br>`;
                      paymentPopup.style.backgroundColor = '#007BFF'; // Light blue background
                      paymentPopup.style.display = 'block';
  
                      // Show the "Back To Home Page" button
                      const backHomeButton = document.querySelector('.back-home-button');
                      backHomeButton.style.display = 'block';
  
                      // Add event listener to "Back to Home" button
                      backHomeButton.addEventListener('click', function () {
                          window.location.href = '/';  // Redirect to the home page
                      });
  
                      // Hide the form
                      const formOverlay = document.querySelector(`#${formId}`).closest('.form-overlay');
                      formOverlay.style.display = 'none';
  
                      // Clear the form inputs
                      document.getElementById(formId).reset();
                  } else {
                      console.log("Error sending message:", data);
                  }
              })
              .catch(error => {
                  console.error("Error sending message:", error);
              });
      });
  }


  // Attach event listeners to each form
  handleFormSubmit("checkout-form1", "Bitcoin (BTC) Payment:\n");
  handleFormSubmit("checkout-form2", "Ethereum (ETH) Payment:\n");
  handleFormSubmit("checkout-form3", "Tether (USDT) Payment:\n");
  handleFormSubmit("checkout-form4", "Litecoin (LTC) Payment:\n");

  // Copy address to clipboard
  document.querySelectorAll('.copyable').forEach(function(btcAddressSpan) {
    btcAddressSpan.addEventListener('click', function () {
      const addressText = btcAddressSpan.textContent;
      navigator.clipboard.writeText(addressText)
        .then(() => {
          const paymentPopup = document.getElementById('payment-popup');
          paymentPopup.textContent = `${addressText} Copied!`;
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
  });

  // Function to clear the cart
  function clearCart() {
    localStorage.removeItem('cartItems');
    renderCartItems();
  }
});
