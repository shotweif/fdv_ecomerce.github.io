let loader = document.querySelector('.loader');
let user = JSON.parse(sessionStorage.user || null);

const becomeSellerElement = document.querySelector('.become_seller');
const productListeningElement = document.querySelector('.product_listing');
const applyForm = document.querySelector('.apply_form');
const showAplyFormBtn = document.querySelector('#apply_btn');

window.onload = () => {
    if (sessionStorage.user) {
        if (compareToken(user.authToken, user.email)) {
            if(!user.seller){
                becomeSellerElement.classList.remove('hide');

            }else{
                loader.style.display = 'block';
                productListeningElement.classList.remove('hide');
                setupProducts();
            }

        } else {
            location.replace('/login');
        }
    } else {
        location.replace('/login');
    }
}

showAplyFormBtn.addEventListener('click', () => {
    becomeSellerElement.classList.add('hide');
    applyForm.classList.remove('hide');
})

// form submission
const applyFormButton = document.querySelector('#apply_form_btn');
const businessName = document.querySelector('#business_name');
const address = document.querySelector('#address');
const about = document.querySelector('#about');
const number = document.querySelector('#number');
const tac = document.querySelector('#terms_and_cond');
const legitInfo = document.querySelector('#legitInfo');

applyFormButton.addEventListener('click', () => {
    // making server request
    loader.style.display = 'block';
    sendData('/seller', {
        name: businessName.value,
        address: address.value,
        about: about.value,
        number: number.value,
        tac: tac.checked,
        legit: legitInfo.checked,
        email: JSON.parse(sessionStorage.user).email
    })
})

const setupProducts = () => {
    fetch('/get-products', {
        method: 'POST',
        headers: new Headers({"Content-Type":"application/json"}),
        body: JSON.stringify({email: user.email})
    })
    .then(res => res.json())
    .then(data => {
        loader.style.display = null;
        productListeningElement.classList.remove('hiden');
        if(data == 'no products'){
            let emptySvg = document.querySelector('.no_product_image');
            emptySvg.classList.remove('hiden');
        }else{
            data.forEach(product => createProduct(product));
        }
    });
}
