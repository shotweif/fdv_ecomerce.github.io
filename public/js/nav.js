const createNav = () => {
    let nav = document.querySelector('.navbar');

    const logoDir = "img/logo/fdv-logo-light.png";

    nav.innerHTML = `
    <div class="nav">
        <img src="`+logoDir+`" class="fdv-logo" alt="FDV-logo">
        <div class="nav_items">
            <div class="search">
                <input type="text" class="search_box" placeholder="search product">
                <button class="search_btn">
                    <i class='bx bx-search'></i>
                </button>
            </div>
            <a>
                <img src="img/user.png" id="usr_img" alt="">
                <div class="login_logout_popup hiden">
                    <p class="account_info">Usuario, name <p>
                    <button class="btn" id="usr_btn"> Cerrar cesion </button>
                    <p class="account_create vis">Crear una cuenta.</p>
                </div>
            </a>
            <a href="#"><i class='bx bxs-shopping-bags' ></i></a>
        </div>
    </div>
    <ul class="link_container">
        <li class="link_item"><a href="#" class="link">Inicio</a></li>
        <li class="link_item"><a href="#" class="link">Catálogo</a></li>
        <li class="link_item"><a href="#" class="link">Galería</a></li>
        <li class="link_item"><a href="#" class="link">Contacto</a></li>
        <li class="link_item"><a href="#" class="link">Acerca de Nosotros</a></li>
    </ul>
    `;
}

createNav();

// nav popup
const userImageButton = document.querySelector('#usr_img');
const userPopup = document.querySelector('.login_logout_popup');
const popuptext = document.querySelector('.account_info')
const actionBtn = document.querySelector('#usr_btn')
let createBtn = document.querySelector('.account_create');

userImageButton.addEventListener('click', () => {
    userPopup.classList.toggle('hiden');
})

window.onload = () => {
    let user = JSON.parse(sessionStorage.user || null);

    if(user != null){
         // means user is logged in 
        popuptext.innerHTML = `Usuario, ${user.name}`;
        actionBtn.innerHTML = `Cerrar sesion`;
        actionBtn.addEventListener('click', () => {
            sessionStorage.clear();
            location.reload();
        })
        createBtn.classList.add('vis');
    }else{
        // means user is logged out
        popuptext.innerHTML = `Inicia secion para empezar`;
        actionBtn.innerHTML = `Iniciar sesion`;
        actionBtn.addEventListener('click', () => {
            location.href = '/login';
        })
        createBtn.classList.remove('vis');
    }
}

createBtn.addEventListener('click', () => {
    window.location='/signup';
})