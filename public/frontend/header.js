import Cart from './cart.js';
import Search from './search.js';
import User from './user.js';

class Header {
  cart;
  search;
  user;
  constructor() {
    this.cart = new Cart();
    // this.search = new Search();
    this.user = new User();
  }

  get Cart() {
    return this.cart;
  }

  get Search() {
    return this.search;
  }

  get User() {
    return this.user;
  }
}

export default Header;
