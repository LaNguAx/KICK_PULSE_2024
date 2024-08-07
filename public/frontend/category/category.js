import Main from '../main.js';
import QuickView from '../quickView.js';
import Header from '../header.js';

class Category {

  categoryProductsContainer;
  filtersBtn;
  filtersModal;
  filtersModalObj;
  applyFiltersBtn;
  resetFiltersBtn;

  selectedFilters = [];

  constructor() {
    this.filtersBtn = document.querySelector('#filters-btn');
    this.filtersModal = document.querySelector('#filters-modal');
    this.filtersModalObj = new bootstrap.Modal(document.getElementById('filters-modal'), {
      keyboard: false
    });
    this.applyFiltersBtn = document.querySelector('#apply-filters-btn');
    this.resetFiltersBtn = document.querySelector('#reset-filters-btn');
    this.categoryProductsContainer = document.querySelector('.category-products');

    this.initCategoryEventListeners();
  }

  initCategoryEventListeners() {
    this.filtersBtn.addEventListener('click', this.handleFiltersBtnClick.bind(this));
    this.applyFiltersBtn.addEventListener('click', this.handleApplyFiltersBtnClick.bind(this));
    this.resetFiltersBtn.addEventListener('click', this.resetFilters.bind(this));
  }

  handleFiltersBtnClick(e) {

  }

  async handleApplyFiltersBtnClick(e) {

    this.filtersModalObj.hide();

    const checkedFilters = [...document.querySelectorAll('.filter:checked')];

    Main.renderSpinner(this.categoryProductsContainer, true);
    const response = await fetch(`/api/categories/products/${this.filtersModal.getAttribute('data-category-id')}`);
    if (!response.ok)
      throw new Error('Failed getting products for category');
    const result = await response.json();

    const products = result.data;


    const filters = checkedFilters.map(filter => filter.getAttribute('id'));

    const filterPrice = parseInt(document.getElementById('priceRange').value);


    // Filter and map the elements to get only the checked ones' ids
    const brandFilters = new Set([...document.querySelectorAll('.filter-brand')]
      .filter(el => el.checked)  // Only include checked elements
      .map(el => el.id));        // Map to their ids

    const genderFilters = new Set([...document.querySelectorAll('.filter-gender')]
      .filter(el => el.checked)  // Only include checked elements
      .map(el => el.id));        // Map to their ids

    const sizeFilters = new Set([...document.querySelectorAll('.filter-size')]
      .filter(el => el.checked)  // Only include checked elements
      .map(el => el.id));        // Map to their ids

    let filteredProducts = products;
    if (brandFilters.size > 0)
      filteredProducts = products.filter(product =>
        brandFilters.has(product.brand.name));

    if (genderFilters.size > 0)
      filteredProducts = filteredProducts.filter(product => genderFilters.has(product.gender));

    if (sizeFilters.size > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.sizes.some(size => sizeFilters.has(size))
      );
    }

    filteredProducts = filteredProducts.filter(product => product.price <= filterPrice);


    Main.renderSpinner(this.categoryProductsContainer, false);
    console.log(filteredProducts)
    if (filteredProducts.length == 0) {
      this.resetFilters();
      Main.renderMessage(this.categoryProductsContainer, true, 'No products found..', 'beforebegin');

      setTimeout(() =>
        Main.renderMessage(this.categoryProductsContainer, false, 'No products found..', 'beforebegin'), 1500);

      this.filtersModalObj.hide();
      return;
    }

    // //if price range changed and other filters stayed
    // const DEFAULT_PRICE_RANGE = 2500;
    // if (checkedFilters.length == 0 && filterPrice != DEFAULT_PRICE_RANGE) {
    //   const pricedProducts = products.filter(prod => prod.price <= filterPrice);
    //   if (pricedProducts.length == 0) this.renderProducts(produc)
    //   this.renderProducts(pricedProducts);
    //   return;

    // }

    if (checkedFilters.length == 0) {
      this.renderProducts(products);
      return;
    }


    this.renderProducts(filteredProducts);

    Main.renderSpinner(this.categoryProductsContainer, false);
  }

  renderProducts(products) {
    let HTML = '';
    products.forEach(product => {
      HTML += `
        <div class="col product-card" data-product-id="${product._id}">
            <div class="card h-100">
                <button type="button"
                    class="btn nav-link p-0 border-0 h-100 d-flex flex-column align-items-center"
                    data-bs-toggle="modal" data-bs-target="#quick-view-modal">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body text-center p-2 d-flex flex-column mt-auto">
                            <h5 class="card-title flex-grow-1 d-flex align-items-center justify-content-center">
                                ${product.name}</h5>
                            <strong class="d-block mt-2">Quick View</strong>
                        </div>
                </button>
            </div>
            </div >
        `;
    });

    this.categoryProductsContainer.innerHTML = '';
    this.categoryProductsContainer.insertAdjacentHTML('afterbegin', HTML);
  }

  resetFilters() {
    const checkedFilters = [...document.querySelectorAll('.filter:checked')];
    checkedFilters.forEach(filter => filter.checked = false);
    const DEFAULT_PRICE_RANGE = 2500;
    const filterPrice = document.getElementById('priceRange');
    filterPrice.value = DEFAULT_PRICE_RANGE;
    document.getElementById('currentPrice').innerText = filterPrice.value;

    this.collapseAllAccordions();
    this.filtersModalObj.hide();
    this.applyFiltersBtn.click()
  }

  collapseAllAccordions() {
    var accordionItems = document.querySelectorAll('.accordion-collapse');
    accordionItems.forEach(function (item) {
      var collapseInstance = new bootstrap.Collapse(item, {
        toggle: false
      });
      collapseInstance.hide();
    });
  }

}


Main.initComponents([Header, QuickView, Category]);

Main.hidePreLoader();
