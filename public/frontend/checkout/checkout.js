import Main from '../main.js';
import QuickView from '../quickView.js';
import Header from '../header.js';

class Checkout {

  constructor() {


    this.initCheckoutEventListeners();
  }

  initCheckoutEventListeners() {
    this.initFormSubmitHandle();
    this.initCCfields();
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
