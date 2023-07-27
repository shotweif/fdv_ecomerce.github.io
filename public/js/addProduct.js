let user = JSON.parse(sessionStorage.user || null);
let loader = document.querySelector('.loader');

// checking user is loagged in or not
window.onload = () => {
    if(user){
        if(!compareToken(user.authToken, user.email)){
            location.reload('login');
        }
    }else{
        location.replace('/login');
    }
}

// price inputs
const actualPrice = document.querySelector('#actual_price');
const discountPercentage = document.querySelector('#discount');
const sellingPrice = document.querySelector('#sell_price');

actualPrice.addEventListener('input', () => {
    if(discountPercentage.value){
        let discount = actualPrice.value * discountPercentage.value / 100;
        sellingPrice.value = actualPrice.value - discount;
    }else{
        sellingPrice.value = actualPrice.value;
    }
})

discountPercentage.addEventListener('input', () => {
    if(discountPercentage.value>=100){
        discountPercentage.value = 95;
    }else{
        let discount = actualPrice.value * discountPercentage.value / 100;
        sellingPrice.value = actualPrice.value - discount;
    }
})

sellingPrice.addEventListener('input', () => {
    let discount = (sellingPrice.value/ actualPrice.value)*100;
    discountPercentage.value = discount;
})

//----------------------------------------------------------------------------
// upload image handle
let uploadImages = document.querySelectorAll('.fileupload');
let imagePaths = []; //will store all uploaded images paths

/*
fetch('/s3url').then(res => res.json())
.then(url => console.log(url));


uploadImages.forEach((fileupload, index) => {
    fileupload.addEventListener('change', () => {
        const file = fileupload.files[0];
        let imageUrl;

        if(file.type.includes('image')){
            // name user upload an image
            fetch('/s3url').then(res => res.json())
            .then(url => {
                fetch(url, {
                    method: 'PUT',
                    headers: new Headers({'Content-Type':'multipart/form-data'}),
                    body: file
                }).then(res => {
                    imageUrl = url.split("?")[0];
                    imagePaths[index] = imageUrl;
                    let label = document.querySelector(`label[for=${fileupload.id}]`);
                    label.style.backgroundImage = `url(${imageUrl})`;
                    let productImage = document.querySelector('.product_image');
                    productImage.style.backgrounfImage = `url(${imageUrl})`;

                })
            })
        }else{
            showAlert('upload image only');
        }
    })
})
*/
//----------------------------------------------------------------------------

// form submission
const productName = document.querySelector('#product_name');
const productLine = document.querySelector('#product-des');
const des = document.querySelector('#des');

let sizes = []; // will store all the size

const stock = document.querySelector('#stock');
const tags = document.querySelector('#tags');
const tac = document.querySelector('#tac');

// buttons
const addProductBtn = document.querySelector('#add_btn');
const saveDraft = document.querySelector('#save_btn');

// store size function
const storeSizes = () => {
    sizes = []
    let sizeCheckBox = document.querySelectorAll('.size_checkbox');
    sizeCheckBox.forEach(item => {
        if(item.checked){
            sizes.push(item.value)
        }
    })
}

const validateForm = () => {
    if(!productName.value.length){
        return showAlert('Ingrese nombre del producto !');
    }else if(productLine.value.length > 100 || productLine.value.length < 10){
        return showAlert('La descripcion debe ser entre 10 a 100 letras !');
    }else if(!des.value.length){
        return showAlert('Falta de descripcion del producto');
    }/*else if(!imagePaths.length){
        return showAlert('Carge minimo una imagen.');
    }*/else if(!sizes.length){
        return showAlert('Seleccione minimo un tamaño de producto');
    }else if(!actualPrice.value.length){
        return showAlert('Ingrese el precio del producto !!!');
    }else if(stock.value < 5){
        return showAlert('Debe ingresar un stock de minimo 5 !');
    }else if(!tags.value.length){
        return showAlert('Asignale una etiqueta al producto.');
    }else if(!tac.checked){
        return showAlert('Debes haceptar los terminos y condiciones para continuar.');
    }
    return true;
}

const productData = () => {
    //let idCod = productName.value +"-"+ Math.floor(Math.random()*5000);
    return data = {
        //idCod: idCod,
        name: productName.value,
        prodDes : productLine.value,
        des : des.value,
        images : imagePaths,
        sizes: sizes,
        actualPrice: actualPrice.value,
        discount: discountPercentage.value,
        sellPrice: sellingPrice.value,
        stock: stock.value,
        tags: tags.value,
        tac: tac.checked,
        email: user.email
    }
}

addProductBtn.addEventListener('click', () => {
    storeSizes();
    // validate form
    if(validateForm()){
        loader.style.display = 'block';
        let data = productData();
        sendData('/add-product', data);
    }
})

saveDraft.addEventListener('click', () => {
    //store size
    storeSizes();

    //check for product name
    if(!productName.value.length){
        showAlert('Ingrese nombre del producto.');
    }else{
        let data = productData();
        data.draft = true;
        sendData('/add-product', data);
    }
})



const fetchProductData = () => {
    // delete the tempProduct from the session
    delete sessionStorage.tempsProduct;
    fetch('/get-products', {
        method:'POST',
        headers: new Headers({'Content-Type':'application/json'}),
        body: JSON.stringify({email: user.email, id: productId})
    })
    .then(res => res.json())
    .then((data)=> {
        console.log(data);
    })
}

// exsiting product datail handle
let productId = null;
if(location.pathname != '/add-product'){
    productId = decodeURI(location.pathname.split('/').pop());
    let productDetail = JSON.parse(sessionStorage.tempsProduct || null);

    //fetch the data if product is not in session
    //if(productDetail == null){
        //fetchProductData();
    //}
}

