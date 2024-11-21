'use strict';
/**
 * Add event on elements
 */const t=function(t,o,n){if(t instanceof NodeList||t instanceof HTMLCollection){t.forEach(t=>t.addEventListener(o,n))}else if(t instanceof HTMLElement){t.addEventListener(o,n)}}
/**
 * Navbar toggle
 */;const o=document.querySelector("[data-navbar]");const n=document.querySelectorAll("[data-nav-toggler]");const c=document.querySelector("[data-overlay]");const e=function(){o.classList.toggle("active");c.classList.toggle("active")};t(n,"click",e);
/**
 * Active header & back top btn when window scroll down to 100px
 */const a=document.querySelector("[data-header]");const i=document.querySelector("[data-back-top-btn]");const d=function(){if(window.scrollY>100){a.classList.add("active");i.classList.add("active")}else{a.classList.remove("active");i.classList.remove("active")}};t(window,"scroll",d);
/**
 * Filter functionality
 */const s=document.querySelectorAll("[data-filter-btn]");const l=document.querySelectorAll("[data-filter]");let u=s[0];const r=function(){u.classList.remove("active");this.classList.add("active");u=this;l.forEach(t=>{t.style.display=t.dataset.filter===this.dataset.filterBtn?"block":"none"})};t(s,"click",r);
/**
 * Carousel functionality
 */document.addEventListener('DOMContentLoaded',function(){const t=document.querySelector('.carousel');if(!t)return;
// Remove any existing clone nodes from previous runs
while(t.firstChild&&t.firstChild.classList.contains('clone')){t.removeChild(t.firstChild)}const o=1;// Scroll speed in pixels per frame
let n=0;let c=false;function e(){if(c){n+=o;t.scrollLeft=n;
// If the scroll position is greater than the scroll width, reset it
if(n>=t.scrollWidth-t.clientWidth){n=0}requestAnimationFrame(e)}}t.addEventListener('mousedown',()=>{c=true;e()});t.addEventListener('mouseup',()=>{c=false});t.addEventListener('mouseleave',()=>{c=false});t.addEventListener('touchstart',()=>{c=true;e()});t.addEventListener('touchend',()=>{c=false})});
/**
 * Add to cart button functionality
 */document.querySelectorAll('.card').forEach(a=>{const i=a.querySelector('.add-to-cart-btn');if(!i){console.error('Add to Cart button not found.');return}i.addEventListener('click',()=>{const o=a.querySelector('.card-title')?.textContent||'No Title';const t=a.querySelector('.card-description')?.textContent||'No Description';const n=a.querySelector('.card-price')?.textContent||'0';console.log('Adding item to cart:',o,t,n);// Debug log
// Show "Adding Item" state
i.style.backgroundColor='red';i.textContent='ADDING ITEM';
// Get existing cart items from localStorage
const c=JSON.parse(localStorage.getItem('cartItems'))||[];
// Check if item is already in the cart
const e=c.findIndex(t=>t.title===o);if(e===-1){
// Add new item to cart
c.push({title:o,description:t,t:n});localStorage.setItem('cartItems',JSON.stringify(c));
// Change the button text to "ADDED" after 2 seconds
setTimeout(()=>{i.textContent='ADDED';i.style.backgroundColor='';// Reset to original background color or set to desired color
// After 1 second, revert the button text back to "Add to Cart"
setTimeout(()=>{i.textContent='Add to Cart';i.style.backgroundColor='';// Reset to original background color or set to desired color
},1e3)},2e3)}else{
// Change the button text to "Already Added"
i.textContent='Already Added';i.style.backgroundColor='';// Reset to original background color or set to desired color
}
// Update the cart item count
f();m();// Ensure the floating cart count is updated as well
});a.addEventListener('mouseover',()=>{i.style.display='block'});a.addEventListener('mouseout',()=>{i.style.display='none'})});document.addEventListener('click',t=>{if(!t.target.closest('.card')){document.querySelectorAll('.add-to-cart-btn').forEach(t=>{t.style.display='none'})}});
/**
 * Update the cart count
 */function f(){const t=document.querySelector('.header-action-btn.cart-btn .span');const o=JSON.parse(localStorage.getItem('cartItems'))||[];if(t){t.textContent=o.length}else{console.error('Cart count element not found.')}}
// Update cart count on page load
document.addEventListener('DOMContentLoaded',f);
// Add event listener to the cart button to navigate to cart.html
document.addEventListener('DOMContentLoaded',function(){const t=document.querySelector('.header-action-btn.cart-btn');// Correct selector
if(t){t.addEventListener('click',function(){window.location.href='cart.html'})}});
// NEW FLOATING CART
// Function to update the cart count
function m(){const t=document.querySelector('.floating-cart-btn .cart-count');const o=JSON.parse(localStorage.getItem('cartItems'))||[];if(t){t.textContent=o.length}else{console.error('Cart count element not found.')}}
// Update the cart count on page load
document.addEventListener('DOMContentLoaded',function(){m();const t=document.querySelector('.floating-cart-btn');if(t){t.addEventListener('click',function(){window.location.href='cart.html';// Navigate to cart page
})}else{console.error('Floating cart button not found.')}});
// Update cart count whenever an item is added
document.querySelectorAll('.card').forEach(t=>{const o=t.querySelector('.add-to-cart-btn');if(o){o.addEventListener('click',()=>{
// Existing code to handle adding to cart...
// After updating the cart, update the floating cart count
m()})}});
