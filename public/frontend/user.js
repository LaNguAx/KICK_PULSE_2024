import Main from './main.js';
import Cart from './cart.js';



class User {

  loginModal;
  registerModal;
  loginModalObj;
  registerModalObj;

  switchSignInBtn;
  switchSignUpBtn;

  constructor() {
    // Selecting the login and register modals
    this.loginModal = document.querySelector('#loginModal');
    this.registerModal = document.querySelector('#registerModal');

    // Initializing the modals using Bootstrap's modal class
    this.loginModalObj = new bootstrap.Modal(this.loginModal, {
      keyboard: false
    });

    this.registerModalObj = new bootstrap.Modal(this.registerModal, {
      keyboard: false
    });



    this.switchSignInBtn = document.querySelector('#switch-signin');
    this.switchSignUpBtn = document.querySelector('#switch-signup');

    this.initUserEventListeners();
  }

  initUserEventListeners() {
    this.switchSignUpBtn.addEventListener('click', this.switchModals.bind(this));
    this.switchSignInBtn.addEventListener('click', this.switchModals.bind(this));
  }

  switchModals(e) {
    const modal = e.target.getAttribute('data-modal-name');
    this.hideModals();
    if (modal == 'login') {
      setTimeout(() => this.loginModalObj.show(), 200);

    } else {
      setTimeout(() => this.registerModalObj.show(), 200);
    }
  }

  hideModals() {
    this.loginModalObj.hide();
    this.registerModalObj.hide();
  }

}

export default User;
