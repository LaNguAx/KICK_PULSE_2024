class Orders {
  ordersTab;
  suppliedOrderTab;
  ordersContainer;
  suppliedOrdersContainer

  constructor() {
    this.ordersTab = document.querySelector('.all-orders-tab');
    this.suppliedOrderTab = document.querySelector('.supplied-order-tab');
    this.ordersContainer = document.querySelector('.orders');
    this.suppliedOrdersContainer = document.querySelector('.supplied-order');

    this.initEventListeners();
  }

  initEventListeners() {
    this.ordersTab.addEventListener('click', this.handleOrdersTabClick.bind(this));
    this.suppliedOrderTab.addEventListener('click', this.handleSuppliedOrdersTabClick.bind(this));

    this.ordersContainer.addEventListener('click', this.handleOrdersContainerClick.bind(this));

  }


  async handleOrdersContainerClick(e) {

    if (e.target.closest('.supplied-order-btn')) {
      try {
        await this.supplyOrder(e.target.closest('.card').getAttribute('data-order-id'));
        const orderElement = e.target.closest('.col-md-4');
        this.moveToSuppliedOrders(orderElement);
        return;
      } catch (e) {
        console.error(e);
        return;
      }
    }

    if (e.target.closest('.delete-order')) {
      await this.deleteOrder(e.target.closest('.card').getAttribute('data-order-id'));
      return;
    }


  }

  async deleteOrder(orderId) {
    this.renderSpinner(this.ordersContainer, true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed getting response');
      await response.json();

      const orders = (await this.loadOrders()).filter(order => !order.supplied);

      this.renderSpinner(this.ordersContainer, false);

      this.renderOrders(orders);

      // this.ordersTab.dispatchEvent(new Event('click'));
    } catch (error) {
      console.log(error);
    }

  }

  async supplyOrder(orderId) {
    try {
      this.suppliedOrderTab.dispatchEvent(new Event('click'));
      const prevHTML = this.renderSpinner(this.suppliedOrdersContainer, true);
      const order = await this.getOrder(orderId);
      order.supplied = true;

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) throw new Error('Failed getting response');
      await response.json();
      this.renderSpinner(this.suppliedOrdersContainer, false);

      this.suppliedOrdersContainer.innerHTML = prevHTML;

      await this.renderSuppliedOrders();

    } catch (e) {
      // this.showMessage('Error supplying order..', e);
      console.error(e);
    }

  }


  async renderSuppliedOrders() {
    this.ordersContainer.innerHTML = '';
    const data = await this.loadOrders();

    if (data.length === 0) {
      this.ordersContainer.innerHTML = `<h4>You don't have any supplied orders..</h4>`;
      return;
    }

    const suppliedOrders = data.filter(order => order.supplied);

    if (suppliedOrders.length === 0) {
      this.ordersContainer.innerHTML = `<h4>You don't have any supplied orders..</h4>`;
      return;
    }

    suppliedOrders.forEach((order) => {
      const orderElement = document.createElement('div');
      orderElement.className = 'col-md-4 col-sm-6 col-12 mb-4';
      orderElement.innerHTML = `
        <div class="card position-relative" data-order-id="${order._id}">
          <button type="button" class="btn btn-outline-danger delete-order">X</button>
          <div class="card-body">
            <h5 class="card-title">Order ID: ${order._id}</h5>
            <p class="card-text"><strong>Name:</strong> ${order.firstName} ${order.lastName}</p>
            <p class="card-text"><strong>Email:</strong> ${order.email}</p>
            <p class="card-text"><strong>Address:</strong> ${order.address}</p>
            <p class="card-text"><strong>Country:</strong> ${order.country}</p>
            <p class="card-text"><strong>Zip:</strong> ${order.zip}</p>
            <p class="card-text"><strong>CC Name:</strong> ${order.paymentDetails.ccName}</p>
            <p class="card-text"><strong>CC Number:</strong> ${order.paymentDetails.ccNumber}</p>
            <p class="card-text"><strong>CC Expiration:</strong> ${order.paymentDetails.ccExpiration}</p>
            <p class="card-text"><strong>CC CVV:</strong> ${order.paymentDetails.ccCvv}</p>
            <h6 class="card-subtitle mb-2 text-muted">Cart Items</h6>
            <ul class="list-group list-group-flush mb-3">
              ${order.cart.map(item => `
                <li class="list-group-item">
                  <strong>${item.title}</strong> - Size: ${item.size}, Qty: ${item.quantity}, Price: $${item.price}
                </li>
              `).join('')}
            </ul>
          </div>
          <button type="button" class="btn btn-outline-primary supplied-order-btn">
            <i class="bi bi-check-circle"></i>
            <span class="visually-hidden">Supplied Order</span>
          </button>
        </div>`;
      document.querySelector('.orders.content-container').appendChild(orderElement);
    });
  }
  moveToSuppliedOrders(orderElement) {

    const el = orderElement;
    orderElement.remove();

    this.suppliedOrdersContainer.querySelector('.feedback-message').insertAdjacentElement('beforebegin', el);
    el.querySelector('.supplied-order-btn').remove();
    el.querySelector('.delete-order').remove();

  }

  async getOrder(orderId) {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) throw new Error('Failed fetching!');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`Error loading order\nError message: ${error}`);
    }

  }

  async handleOrdersTabClick(e) {
    if (e.target.classList.contains('active')) return;

    this.highlightTab(e);
    this.showOrders(e);

    this.renderSpinner(this.ordersContainer, true);
    const orders = await this.loadOrders();

    const unsuppliedOrders = orders.filter(order => !order.supplied);

    this.renderSpinner(this.ordersContainer, false);

    this.renderOrders(unsuppliedOrders);
  }

  handleSuppliedOrdersTabClick(e) {
    if (e.target.classList.contains('active')) return;

    this.highlightTab(e);
    this.showAddOrder(e);
  }

  showOrders(e) {
    this.hideAll();
    this.ordersContainer.classList.remove('hidden');
  }

  showAddOrder(e) {
    this.hideAll();
    this.suppliedOrdersContainer.classList.remove('hidden');
  }


  highlightTab(e) {
    document
      .querySelectorAll('.tab')
      .forEach((tab) => tab.classList.remove('active'));

    e.target.classList.toggle('active');
  }
  hideAll() {
    document.querySelectorAll('.content-container').forEach(container => {
      if (!container.classList.contains('hidden')) container.classList.add('hidden');
    });
  }

  renderSpinner(element, on = true) {
    const previousHTML = element.innerHTML;

    if (on)
      element.innerHTML = ` <div class="mt-5 mx-auto d-flex align-items-center justify-content-center">
        <div class="spinner-border text-center" role="status">
          <span class="sr-only display-4"></span>
        </div>
      </div>`;

    else element.innerHTML = '';

    return previousHTML;
  }

  async loadOrders() {
    try {
      const response = await fetch(`/api/orders/`);
      if (!response.ok) throw new Error('Failed fetching!');
      const result = await response.json();
      return result.data;
    } catch (error) {
      this.showMessage(`Error loading orders\nError message: ${error}`);
    }
  }

  renderOrders(data) {
    this.ordersContainer.innerHTML = '';
    if (data.length === 0) {
      this.ordersContainer.innerHTML = `<h4>You don't have any unfulfilled orders..</h4>`;
      return;
    }
    data.forEach((order) => {
      if (!order.supplied) {
        const orderElement = document.createElement('div');
        orderElement.className = 'col-md-4 col-sm-6 col-12 mb-4';
        orderElement.innerHTML = `
          <div class="card position-relative" data-order-id="${order._id}">
            <button type="button" class="btn btn-outline-danger delete-order">X</button>
            <div class="card-body">
              <h5 class="card-title">Order ID: ${order._id}</h5>
              <p class="card-text"><strong>Name:</strong> ${order.firstName} ${order.lastName}</p>
              <p class="card-text"><strong>Email:</strong> ${order.email}</p>
              <p class="card-text"><strong>Address:</strong> ${order.address}</p>
              <p class="card-text"><strong>Country:</strong> ${order.country}</p>
              <p class="card-text"><strong>Zip:</strong> ${order.zip}</p>
              <p class="card-text"><strong>CC Name:</strong> ${order.paymentDetails.ccName}</p>
              <p class="card-text"><strong>CC Number:</strong> ${order.paymentDetails.ccNumber}</p>
              <p class="card-text"><strong>CC Expiration:</strong> ${order.paymentDetails.ccExpiration}</p>
              <p class="card-text"><strong>CC CVV:</strong> ${order.paymentDetails.ccCvv}</p>
              <h6 class="card-subtitle mb-2 text-muted">Cart Items</h6>
              <ul class="list-group list-group-flush mb-3">
                ${order.cart.map(item => `
                  <li class="list-group-item">
                    <strong>${item.title}</strong> - Size: ${item.size}, Qty: ${item.quantity}, Price: $${item.price}
                  </li>
                `).join('')}
              </ul>
            </div>
            <button type="button" class="btn btn-outline-primary supplied-order-btn">
              <i class="bi bi-check-circle"></i>
              <span class="visually-hidden">Supplied Order</span>
            </button>
          </div>`;
        document.querySelector('.orders.content-container').appendChild(orderElement);
      }
    });


  }

}

// Initialize the Dashboard
document.addEventListener('DOMContentLoaded', () => {
  new Orders();
});

function hidePreLoader() {
  window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'none';
  });
}

hidePreLoader();