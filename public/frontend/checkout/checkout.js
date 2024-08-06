import Main from '../main.js';
import QuickView from '../quickView.js';
import Header from '../header.js';
import Cart from '../cart.js';

class Checkout {

  checkoutForm;
  checkoutCart;
  checkoutCartContainer;
  checkoutFieldsContainer;

  constructor() {

    this.checkoutCart = Cart.getCart();
    this.checkoutCartContainer = document.querySelector('#checkout-cart-container');
    this.checkoutForm = document.querySelector('#checkoutForm');
    this.checkoutFieldsContainer = document.querySelector('#checkout-fields-container');

    this.renderCheckoutCart();
    this.initCheckoutEventListeners();
  }

  initCheckoutEventListeners() {

    this.checkoutCartContainer.addEventListener('click', this.handleCheckoutCartContainerClick.bind(this));

    this.checkoutForm.addEventListener('submit', this.handleCheckoutFormSubmit.bind(this));

    this.initFormSubmitHandle();
    this.initCCfields();
  }


  handleCheckoutCartContainerClick(e) {
    if (e.target.closest('.btn-checkout-delete-cart-item')) {
      this.deleteCheckoutCartItem(e);
      return;
    }
  }

  async handleCheckoutFormSubmit(e) {
    e.preventDefault();

    if (this.checkoutCart.length == 0) {

      Main.renderMessage(this.checkoutFieldsContainer, true, `You can't checkout because you don't have any products..`, 'beforeend');

      setTimeout(() => Main.renderMessage(this.checkoutFieldsContainer, false), 1500);
      return;
    }

    const formData = new FormData(this.checkoutForm);
    const form = Object.fromEntries(formData.entries());

    this.checkoutCart = Cart.getCart();
    form.cart = this.checkoutCart;

    console.log(form);
    await this.sendOrder(form);
  }


  async sendOrder(order) {

    try {
      const response = await fetch(`/api/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) throw new Error('Failed getting response');
      await response.json();

      // this.renderSpinner(this.feedbackMessage, false);
      // this.showMessage('Successfully added brand!');

      // this.formAddBrand.reset();

    } catch (error) {
      console.log(error);
      // this.showMessage('Error adding brand..');
      // this.renderSpinner();
    }
  }


  deleteCheckoutCartItem(e) {
    const row = e.target.closest('tr');
    const productId = row.getAttribute('data-product-id');
    const quantity = row.getAttribute('data-product-quantity');
    const size = row.getAttribute('data-product-size');

    this.checkoutCart = Cart.getCart();
    const newCart = this.checkoutCart.filter(item => !(item._id === productId && item.size === size));

    Cart.updateCart(newCart);
    this.renderCheckoutCart();

  }

  renderCheckoutCart() {

    const table = this.checkoutCartContainer.querySelector('tbody');
    table.innerHTML = '';

    // getting latest cart data
    this.checkoutCart = Cart.getCart();
    this.checkoutCartContainer.querySelector('.badge').innerText = this.checkoutCart.length;

    if (this.checkoutCart.length == 0) {
      table.parentElement.insertAdjacentHTML('beforebegin', `<p class="lean">Your cart is empty..</p>`);
      this.checkoutCartContainer.querySelector('.cart-total').innerText = `$0.00`;
      return;
    }

    // this.cartModal.querySelector('.modal-footer > span').classList.add('hidden');
    let total = 0;
    this.checkoutCart.forEach(item => {

      table.insertAdjacentHTML('beforeend', `

          <tr data-product-id="${item._id}" data-product-quantity="${item.quantity}" data-product-size="${item.size}">
                <td><img src="${item.img}" class="img-fluid" alt="${item.title}"
                              style="width: 50px; height: auto;"></td>
                         <td style="font-size:0.85rem;">${item.title}</td>
                                <td>${item.quantity}</td>
                                <td>${item.price}</td>
                                <td>${item.size}</td>
                                <td><button type="button" class="btn btn-outline-danger btn-sm btn-checkout-delete-cart-item">&times;</button></td>
                      </tr>`);

      total += item.price * item.quantity;
    })

    const formattedTotal = total.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    this.checkoutCartContainer.parentElement.querySelector('.cart-total').innerText = formattedTotal;


  }

  initFormSubmitHandle() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
  }

  initCCfields() {
    document.getElementById('cc-number').addEventListener('input', function (e) {
      e.target.value = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    });

    document.getElementById('cc-cvv').addEventListener('input', function (e) {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    });
  }
}


Main.initComponents([Header, QuickView, Checkout]);

Main.hidePreLoader();
