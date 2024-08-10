import Main from './main.js';

class Search {

  searchForm;
  searchInput;
  searchBtn;
  searchOptions;
  searchModal;
  searchModalContent;
  searchModalObj;

  products = [];

  constructor() {

    this.searchForm = document.querySelector('.search-form');
    this.searchInput = this.searchForm.querySelector('input');
    this.searchBtn = this.searchForm.querySelector('button');
    this.searchOptions = this.searchForm.querySelector('#searchOptions');

    this.searchModal = document.querySelector('#searchModal');
    this.searchModalContent = this.searchModal.querySelector('.modal-body');
    this.searchModalObj = new bootstrap.Modal(this.searchModal, {
      keyboard: false
    });


    this.initSearchEventListeners();
  }

  initSearchEventListeners() {

    this.searchInput.addEventListener('keyup', this.handleSearchInputChange.bind(this));
    this.searchForm.addEventListener('submit', this.handleSearchClick.bind(this));

  }

  handleSearchClick(e) {
    e.preventDefault();

    if (this.products.length == 0)
      return;

    this.searchModalObj.show();

    this.searchModalContent.innerHTML = '';
    this.renderSearchProducts(this.products, 99999);

  }

  async handleSearchInputChange(e) {
    const searchQuery = this.searchInput.value;

    if (searchQuery.length < 3)
      return;


    await this.delay(200);

    const products = await this.getProducts();

    // Create a case-insensitive regex from the search query
    const regex = new RegExp(searchQuery, 'i');

    // Filter products by matching the name with the regex
    const filteredByName = products.filter(product => regex.test(product.name));

    // Handle the filtered products (e.g., update the UI)
    console.log(filteredByName); // For debugging, to see the filtered results


    this.updateDataList(filteredByName);

    this.products = filteredByName;
  }

  updateDataList(products) {
    this.searchOptions.innerHTML = '';
    products.forEach(product => this.searchOptions.insertAdjacentHTML('beforeend', `<option value="${product.name}">`));
  }


  async getProducts() {
    try {
      const response = await fetch(`/api/products/`);
      if (!response.ok) throw new Error('Failed fetching!');
      const result = await response.json();
      this.products = result.data;
      return result.data;
    } catch (error) {
      console.error(`Error loading products\nError message: ${error}`);
    }
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  renderSearchProducts(data, limit = 6) {

    data.forEach((product, idx) => {

      if (idx >= limit) return;

      const productElement = document.createElement('div');
      const subCategories = [];
      product.category.subcategories.forEach((subcat) =>
        subCategories.push(subcat.name)
      );

      // const response = await fetch('/api/products/');

      productElement.className = 'col-md-4 col-sm-6 col-12 mb-4';
      productElement.innerHTML = `
        <div class="card position-relative" data-product-id="${product._id}">
          <button type="button" class="btn btn-outline-danger delete-product">X</button>
          <img src="${product.image}" class="card-img-top" alt="${product.name
        }" />
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text">Price: $${product.price}</p>
            <p class="card-text">Sizes: ${product.sizes.join(', ')}</p>
            <p class="card-text">Quantity: ${product.quantity}</p>
            <p class="card-text">Supplier: ${product.supplier.name}</p>
            <p class="card-text">Brand: ${product.brand.name}</p>
            <p class="card-text">Category: ${product.category.name}</p>
            <p class="card-text">
                  Sub Categories: ${subCategories.length != 0 ? subCategories.join(', ') : ''
        }
                </p>
            <p class="card-text">Gender: ${product.gender}</p>
          </div>
          <button type="button" class="btn btn-outline-secondary edit-product-btn">
                <i class="bi bi-pencil-square"></i>
                <span class="visually-hidden">Edit Category</span>
              </button>
        </div>`;
      this.searchModalContent.appendChild(productElement);
    });
  }

}


export default Search;