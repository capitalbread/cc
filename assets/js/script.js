'use strict';

/**
 * Add event on elements
 */
const addEventOnElem = function (elem, type, callback) {
  if (elem instanceof NodeList || elem instanceof HTMLCollection) {
    elem.forEach(e => e.addEventListener(type, callback));
  } else if (elem instanceof HTMLElement) {
    elem.addEventListener(type, callback);
  }
}

/**
 * Navbar toggle
 */
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

/**
 * Active header & back top btn when window scroll down to 100px
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const toggleBackTopBtn = function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", toggleBackTopBtn);

/**
 * Filter functionality
 */
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter]");

let lastClickedBtn = filterBtn[0];

const filter = function () {
  lastClickedBtn.classList.remove("active");
  this.classList.add("active");
  lastClickedBtn = this;

  filterItems.forEach(item => {
    item.style.display = item.dataset.filter === this.dataset.filterBtn ? "block" : "none";
  });
}

addEventOnElem(filterBtn, "click", filter);

/**
 * Carousel functionality
 */
document.addEventListener('DOMContentLoaded', function () {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  // Remove any existing clone nodes from previous runs
  while (carousel.firstChild && carousel.firstChild.classList.contains('clone')) {
    carousel.removeChild(carousel.firstChild);
  }

  const scrollSpeed = 1; // Scroll speed in pixels per frame
  let scrollPosition = 0;
  let isScrolling = false;

  function scrollCarousel() {
    if (isScrolling) {
      scrollPosition += scrollSpeed;
      carousel.scrollLeft = scrollPosition;

      // If the scroll position is greater than the scroll width, reset it
      if (scrollPosition >= carousel.scrollWidth - carousel.clientWidth) {
        scrollPosition = 0;
      }

      requestAnimationFrame(scrollCarousel);
    }
  }

  carousel.addEventListener('mousedown', () => {
    isScrolling = true;
    scrollCarousel();
  });

  carousel.addEventListener('mouseup', () => {
    isScrolling = false;
  });

  carousel.addEventListener('mouseleave', () => {
    isScrolling = false;
  });

  carousel.addEventListener('touchstart', () => {
    isScrolling = true;
    scrollCarousel();
  });

  carousel.addEventListener('touchend', () => {
    isScrolling = false;
  });
});

/**
 * Add to cart button functionality
 */
document.querySelectorAll('.card').forEach(card => {
  const button = card.querySelector('.add-to-cart-btn');
  
  if (!button) {
    console.error('Add to Cart button not found.');
    return;
  }

  button.addEventListener('click', () => {
    const cardTitle = card.querySelector('.card-title')?.textContent || 'No Title';
    const cardDescription = card.querySelector('.card-description')?.textContent || 'No Description';
    const cardPrice = card.querySelector('.card-price')?.textContent || '0';

    console.log('Adding item to cart:', cardTitle, cardDescription, cardPrice); // Debug log

    // Show "Adding Item" state
    button.style.backgroundColor = 'red';
    button.textContent = 'ADDING ITEM';

    // Get existing cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Check if item is already in the cart
    const itemIndex = cartItems.findIndex(item => item.title === cardTitle);
    if (itemIndex === -1) {
      // Add new item to cart
      cartItems.push({ title: cardTitle, description: cardDescription, price: cardPrice });
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      // Change the button text to "ADDED" after 2 seconds
      setTimeout(() => {
        button.textContent = 'ADDED';
        button.style.backgroundColor = ''; // Reset to original background color or set to desired color
        // After 1 second, revert the button text back to "Add to Cart"
        setTimeout(() => {
          button.textContent = 'Add to Cart';
          button.style.backgroundColor = ''; // Reset to original background color or set to desired color
        }, 1000);
      }, 2000);

    } else {
      // Change the button text to "Already Added"
      button.textContent = 'Already Added';
      button.style.backgroundColor = ''; // Reset to original background color or set to desired color
    }
    
    // Update the cart item count
    updateCartCount();
    updateFloatingCartCount(); // Ensure the floating cart count is updated as well
  });

  card.addEventListener('mouseover', () => {
    button.style.display = 'block';
  });

  card.addEventListener('mouseout', () => {
    button.style.display = 'none';
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.card')) {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.style.display = 'none';
    });
  }
});

/**
 * Update the cart count
 */
function updateCartCount() {
  const cartCountElem = document.querySelector('.header-action-btn.cart-btn .span');
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  if (cartCountElem) {
    cartCountElem.textContent = cartItems.length;
  } else {
    console.error('Cart count element not found.');
  }
}

// Update cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);

// Add event listener to the cart button to navigate to cart.html
document.addEventListener('DOMContentLoaded', function () {
  const cartBtn = document.querySelector('.header-action-btn.cart-btn'); // Correct selector
  if (cartBtn) {
    cartBtn.addEventListener('click', function () {
      window.location.href = 'cart.html';
    });
  }
});

// NEW FLOATING CART

// Function to update the cart count
function updateFloatingCartCount() {
  const cartCountElem = document.querySelector('.floating-cart-btn .cart-count');
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  if (cartCountElem) {
    cartCountElem.textContent = cartItems.length;
  } else {
    console.error('Cart count element not found.');
  }
}

// Update the cart count on page load
document.addEventListener('DOMContentLoaded', function () {
  updateFloatingCartCount();

  const floatingCartBtn = document.querySelector('.floating-cart-btn');
  if (floatingCartBtn) {
    floatingCartBtn.addEventListener('click', function () {
      window.location.href = 'cart.html'; // Navigate to cart page
    });
  } else {
    console.error('Floating cart button not found.');
  }
});

// Update cart count whenever an item is added
document.querySelectorAll('.card').forEach(card => {
  const button = card.querySelector('.add-to-cart-btn');
  
  if (button) {
    button.addEventListener('click', () => {
      // Existing code to handle adding to cart...
      // After updating the cart, update the floating cart count
      updateFloatingCartCount();
    });
  }
});





