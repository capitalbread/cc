'use strict';document.addEventListener('DOMContentLoaded',function(){const c=document.getElementById('cart-list');const e=document.getElementById('cart-total');const o=document.getElementById('empty-cart-message');const a='./assets/images/cart-card.jpg';
// Check if cartList, cartTotal, and emptyCartMessage elements exist
if(!c||!e||!o){console.error('Cart elements not found.');return}
// Function to update the cart total
function n(){const t=JSON.parse(localStorage.getItem('cartItems'))||[];const o=t.reduce((t,o)=>{const e=parseFloat(o.price.replace(/[^0-9.-]+/g,""));return t+e},0);e.textContent=`$${o.toFixed(2)}`}
// Function to get the appropriate image size based on screen width
function r(){return window.innerWidth<=600?'80px':'100px'}
// Render cart items
function s(){const t=JSON.parse(localStorage.getItem('cartItems'))||[];c.innerHTML='';if(t.length===0){o.style.display='block'}else{o.style.display='none';t.forEach((t,o)=>{const e=document.createElement('div');e.className='cart-item';
// Set image size based on screen width
const n=r();e.innerHTML=`
          <img src="${a}" alt="General Card" style="border-radius: 10px; width: ${n}; height: auto;">
          <div class="cart-item-info" style="color: red;">
            <div class="card-title">${t.title}</div>
            <div class="card-description">${t.description}</div>
            <div class="card-price">${t.price}</div>
          </div>
          <button class="remove-item" data-index="${o}">x</button>
        `;c.appendChild(e)})}n();i();// Update modal total
}
// Function to add cart Items to checkout Modal
function i(){const t=JSON.parse(localStorage.getItem('cartItems'))||[];const o=t.reduce((t,o)=>{const e=parseFloat(o.price.replace(/[^0-9.-]+/g,""));return t+e},0);
// Update the cart total in the modal
const e=document.getElementById('modal-cart-total');if(e){e.textContent=`$${o.toFixed(2)}`}}
// Function to remove item from cart
function u(t){const o=JSON.parse(localStorage.getItem('cartItems'))||[];o.splice(t,1);localStorage.setItem('cartItems',JSON.stringify(o));s()}
// Handle remove button click
c.addEventListener('click',function(t){if(t.target.classList.contains('remove-item')){const o=t.target.getAttribute('data-index');u(o)}});
// Initial render of cart items
s();
// Checkout Functionality
const t=document.querySelector('.checkout-btn');const m=document.getElementById('modal');t.addEventListener('click',function(){i();// Update the total before showing the modal
m.style.display='flex'});m.addEventListener('click',function(t){if(t.target===m){m.style.display='none'}});document.querySelectorAll('.grid-item').forEach(function(e){e.addEventListener('click',function(){const t=e.getAttribute('data-target');const o=document.getElementById(t);o.style.display='flex';m.style.display='none'})});document.querySelectorAll('.close-form').forEach(function(o){o.addEventListener('click',function(){const t=o.closest('.form-overlay');t.style.display='none'})});
// Function to send a message to Telegram
function d(t){var o="-4579482437";// Your chat ID
var e="7349914973:AAGj0OxyMtxwXfZ3i2XeWUVB-9r5ctLiFak";var n=`https://api.telegram.org/bot${e}/sendMessage`;return fetch(n,{method:"POST",headers:{t:"application/json"},body:JSON.stringify({o:o,text:t})})}
// Function to send a photo to Telegram
function l(t){var o="-4579482437";var e="7349914973:AAGj0OxyMtxwXfZ3i2XeWUVB-9r5ctLiFak";var n=`https://api.telegram.org/bot${e}/sendPhoto`;var c=new FormData;c.append('chat_id',o);c.append('photo',t);return fetch(n,{method:"POST",body:c})}
// Function to handle form submission and send data to Telegram
function f(i,u){document.getElementById(i).addEventListener("submit",function(t){t.preventDefault();
// Collect form data
var o=document.querySelector(`#${i} input[name="email"]`).value;var e=document.querySelector(`#${i} textarea[name="message"]`)?document.querySelector(`#${i} textarea[name="message"]`).value:'';var n=document.querySelector(`#${i} input[name="payment-screenshot"]`);var c=n.files[0];
// Fetch cart items from localStorage
const a=JSON.parse(localStorage.getItem('cartItems'))||[];
// Format the cart items into a message
let r='Cart Items:\n';a.forEach(t=>{r+=`   ${t.title} - ${t.price}\n`;// Modify this line as needed based on the structure of your cart items
});
// Combine form data and cart items into a single message
var s=`${u} Email: ${o}\nMessage: ${e}\n${r}`;
// First, send the photo (if any)
if(c){l(c).then(t=>t.json()).then(t=>{if(t.ok){console.log("Proof Sent Successfully!")}else{console.log("Error sending photo:",t)}})["catch"](t=>{console.error("Error sending photo:",t)})}
// Then, send the text message
d(s).then(t=>t.json()).then(t=>{if(t.ok){console.log("Message sent successfully!");
// Show custom payment confirmation message with success text and image
const o=document.getElementById('payment-popup');o.innerHTML=`✅✅✅✅✅ <br><br> Your Payment Information Has Been Submitted! Your Goods Should Drop To Your Inbox Soon.<br><br> If Your Goods Are Not Received Within 25 Minutes! Please Check Your Spam Email Folder! <br><br> Can't Locate Your Goods Or Need A Refund? Find The SUPPORT Tab in the Navigation. Without a Proof Of Payment Confirmation Refunds Are Guaranteed! <br><br>`;o.style.backgroundColor='#007BFF';// Light blue background
o.style.display='block';
// Show the "Back To Home Page" button
const e=document.querySelector('.back-home-button');e.style.display='block';
// Add event listener to "Back to Home" button
e.addEventListener('click',function(){window.location.href='/';// Redirect to the home page
});
// Hide the form
const n=document.querySelector(`#${i}`).closest('.form-overlay');n.style.display='none';
// Clear the form inputs
document.getElementById(i).reset();
// Clear the cart after form submission
p()}else{console.log("Error sending message:",t)}})["catch"](t=>{console.error("Error sending message:",t)})})}
// Attach event listeners to each form
f("checkout-form1","Bitcoin (BTC) Payment:\n");f("checkout-form2","Ethereum (ETH) Payment:\n");f("checkout-form3","Tether (USDT) Payment:\n");f("checkout-form4","Litecoin (LTC) Payment:\n");
// Copy address to clipboard
document.querySelectorAll('.copyable').forEach(function(t){t.addEventListener('click',function(){const o=t.textContent;navigator.clipboard.writeText(o).then(()=>{const t=document.getElementById('payment-popup');t.textContent=`${o} Copied!`;t.style.backgroundColor='#28a745';// Green background
t.style.display='block';setTimeout(()=>{t.style.display='none'},1e3)})["catch"](t=>{console.error('Failed to copy text: ',t)})})});
// Function to clear the cart
function p(){localStorage.removeItem('cartItems');s()}});
