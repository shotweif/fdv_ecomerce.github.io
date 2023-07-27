let openEditor;
const createProduct = (data) => {

    openEditor = () => {
        sessionStorage.tempProduct = JSON.stringify(data);
        location.href = `/add-product/${data.id}`;
    }
    //console.log(data.id)
    
    let productContainer = document.querySelector('.product_container');
    productContainer.innerHTML += `
    <div class="product_card">
        <div class="product_image">
            ${data.draft ? `<span class="tag">Edit</span>`:''}
            <img src="${data.images[0] || 'img/galery/defoult/default.jpg'}" class="procduct_thumb" alt="">
            <button class="card_action_btn edit_btn" onclick="openEditor()"><img src="img/editar.png" alt=""> </button>
            <button class="card_action_btn open_btn"><img src="img/openid.png" onclick="location.href='${data.id}'" alt=""> </button>
            <button class="card_action_btn delete_popup_btn" onclick="openDeletePop('${data.id}')"><img src="img/borrar.png" alt=""> </button>
        </div>
        <div class="product_info">
            <h2 class="product_brand">${data.name}</h2>
            <p class="product_short_des">${data.prodDes}</p>
            <span class="price">$${data.sellPrice}</span>
            <span class="actual_price">$${data.actualPrice}</span>
        </div>
    </div>
    `;
}


const openDeletePop = (id) => {
    let deleteAlert = document.querySelector('.delete_alert');
    deleteAlert.style.display = 'flex';

    let closeBtn = document.querySelector('.close_btn');
    closeBtn.addEventListener('click', () => deleteAlert.style.display=null);

    let deleteBtn = document.querySelector('.delete_btn');
    deleteBtn.addEventListener('click', () => deleteItem(id))
}

const deleteItem = (id) => {
    fetch('/delete-product', {
        method: "POST",
        headers: new Headers({"Content-Type":"application/json"}),
        body: JSON.stringify({id : id})
    }).then(res => res.json())
    .then(data => {
        if(data == 'success'){
            location.reload();

        }else{
            showAlert('Ha ocurrido un error al eliminar el producto !!');
        }
    })
}