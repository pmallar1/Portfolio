'use strict';

function toggleDarkMode() {
    let body = document.querySelector("body");

    if (body.classList.contains("dark-mode-theme")) {
      body.classList.remove("dark-mode-theme");
    } else {
      body.classList.add("dark-mode-theme");
    }
    document.querySelector("#dark-mode-button").addEventListener("click", toggleDarkMode);
  }

  let img1 = document.querySelector('#switcher1 img');
  let btn1 = document.querySelector('#btn1');
  let btn2 = document.querySelector('#btn2');
  let btn3 = document.querySelector('#btn3');
  let switcher1H = document.querySelector('#switcher1 h2');
  let switcher1P = document.querySelector('#switcher1 p');

  btn1.addEventListener('click', () => {
    img1.src = 'https://cdn.shopify.com/s/files/1/0297/3663/2365/files/favicon_1200x630.jpg?v=1613777858';
    switcher1H.innerHTML = `Beanbags | An Invitation for Adventure`
    switcher1P.innerHTML = `We aim to inspire you to start your adventure and achieve something beyond what is expected. We want to provide you with stories, experiences and of course, good coffee wherever you go.`
  });

  btn2.addEventListener('click', () => {
    img1.src = 'https://www.beanbagscoffee.co.uk/images/coffee_button_3.jpg';
    switcher1H.innerHTML = `Craft coffee. | Made simple.`
    switcher1P.innerHTML = `It's all about flavor and texture. We partner with small roasters to share their talent and passion with you.`
  });

  btn3.addEventListener('click', () => {
    img1.src = 'https://media.istockphoto.com/id/1138047633/video/bags-of-coffee-stocked-on-the-shelf-at-coffee-shop.jpg?s=640x640&k=20&c=_V2R34mUvHEKrCDOGz63Echt0eRjOqq9qi0kKi2P1c0=';
    switcher1H.innerHTML = `Life's Too Short To Play it Safe.| Enjoy Anywhere.`
    switcher1P.innerHTML = `Mobilize your brew with single serve packs and enjoy craft coffee anywhere from the office to Everest<br>Start with Beanbags Coffee.`
  });

  let img2 = document.querySelector('#switcher2 img');
  let btn4 = document.querySelector('#btn4');
  let btn5 = document.querySelector('#btn5');
  let btn6 = document.querySelector('#btn6');
  let switcher2H = document.querySelector('#switcher2 h3');
  let switcher2P = document.querySelector('#switcher2 p');

  btn4.addEventListener('click', () => {
    img2.src = 'https://cdn.shopify.com/s/files/1/0297/3663/2365/products/DSC02666-3_400x.jpg?v=1636394921';
    switcher2H.innerHTML = `Reserve Light Roast`
    switcher2P.innerHTML = `7 single serve specialty coffee-bags.<br><br>

    Tropical Fruit | Rosewater | Nougat<br><br>

    Featured roaster:<br>
    Bridge City Coffee<br><br>

    Through their commitment to build value and hope in people, Bridge City works closely with their roasters and partner farms to give you truly premium, great tasting coffee. This lightly roasted coffee has natural fruity flavor notes and sweetness that eliminates any need for cream or sugar. Designed to be smooth and versatile, the Honduras roast is a perfect pairing with beanbags!`
  });

  btn5.addEventListener('click', () => {
    img2.src = 'https://cdn.shopify.com/s/files/1/0297/3663/2365/products/Coffee_Teabag_Explorer_medium-dark_400x.png?v=1631455615';
    switcher2H.innerHTML = `Parkway Medium-Dark Roast`
    switcher2P.innerHTML = `Well Balanced | Smooth Finish<br><br>
    Partner roaster:<br><br>
    Pisgah Coffee Roasters<br><br>

    Parkway is our gateway to doing things differently, starting with your coffee. Brazilian family roots bring you coffee directly from the farmer, ensuring sustainability, traceability, and fair wages. This roast pays homage to the Blue Ridge Parkway, a 469 mile scenic route built purely for enjoying the views of the Appalachian Mountains. Here's to those who enjoy the journey!  `
  });

  btn6.addEventListener('click', () => {
    img2.src = 'https://cdn.shopify.com/s/files/1/0297/3663/2365/products/Explorer_Decaf_72_400x.jpg?v=1631477071';
    switcher2H.innerHTML = `New Geneva Decaf`
    switcher2P.innerHTML = `Hazelnut | Aged Wine Finish<br><br>

    Partner roaster:<br>
    New Geneva Coffee Roasters<br><br>

    Dedicated to great flavor, this roast uses only the highest grade Colombian coffee seedlings available in the region. After roasting, the beans are decaffeinated using a natural EAP soaking process which maintains the original balanced and full bodied flavors along with nutty undertones. `
  });



  document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();
    let firstName = document.getElementById("first-name").value;
    let lastName = document.getElementById("last-name").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let contactMethod = document.querySelector('input[name="contactMethod"]:checked').value;
    let comments = document.getElementById("comments").value;

    let phonePattern = /^\d{10}$/;
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phonePattern.test(phone)) {
      alert("Invalid phone number. Please enter a 10-digit phone number.");
      return;
    }

    if (!emailPattern.test(email)) {
      alert("Invalid email address. Please enter a valid email address.");
      return;
    }

    let customer = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      contactMethod: contactMethod,
      comments: comments
    };

    document.getElementById("contact-form").reset();

    document.getElementById("thank-you-message").style.display = "block";
    document.getElementById("customer-details").innerHTML = `Hello ${firstName} ${lastName}, thank you for contacting us!<br> We will get back to you shortly about your comment regarding,<br><br>" ${comments} "<br><br> through ${contactMethod}.`
  });

let addToCartButtons = document.querySelectorAll('#products1 button[id^="pn"]');

let itemsList1 = document.querySelector('#itemsList1');
let subtotal1 = document.querySelector('#subtotal1 span');
let tax1 = document.querySelector('#tax1 span');
let shipping1 = document.querySelector('#shipping1 span');
let total1 = document.querySelector('#total1 span');

let cartItems = [];
let cartSubtotal = 0;
let taxRate = 0.1; // 10% tax rate
let shippingCost = 5.0;

function updateTotals() {
  itemsList1.innerHTML = '';
  if (cartItems.length === 0) {
    itemsList1.innerHTML = '<li>Your Cart is Empty</li>';
  } else {
    cartItems.forEach(item => {
      let li = document.createElement('li');
      li.textContent = item.name + ' - $' + item.price.toFixed(2);
      itemsList1.appendChild(li);
    });
  }

  subtotal1.textContent = '$' + cartSubtotal.toFixed(2);

  // Update tax
  let taxAmount = cartSubtotal * taxRate;
  tax1.textContent = '$' + taxAmount.toFixed(2);

  // Update shipping
  shipping1.textContent = '$' + shippingCost.toFixed(2);

  // Update total
  let totalAmount = cartSubtotal + taxAmount + shippingCost;
  total1.textContent = '$' + totalAmount.toFixed(2);
}

function addToCartClicked(event) {
  let button = event.target;
  let productSection = button.parentNode;
  let productName = productSection.querySelector('h4').textContent;
  let productPrice = parseFloat(productSection.querySelector('p').textContent.slice(1));

  // Add item to cart
  cartItems.push({ name: productName, price: productPrice });

  // Subtotal
  cartSubtotal += productPrice;

  // Cart totals
  updateTotals();
}

addToCartButtons.forEach(button => {
  button.addEventListener('click', addToCartClicked);
});

updateTotals();

