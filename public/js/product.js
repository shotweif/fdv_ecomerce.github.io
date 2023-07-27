// Images Slide
const productImages = document.querySelectorAll(".product_images img");
const productImageSlide = document.querySelector(".image_slider");

let activeImageSilde = 0;

productImages.forEach((item, i) => {
    item.addEventListener('click', () => {
        productImages[activeImageSilde].classList.remove('active');
        item.classList.add('active');
        productImageSlide.style.backgroundImage = `url('${item.src}')`;
        activeImageSilde = i;
    })
})

//Toggle size button
const sizeBtn = document.querySelectorAll('.size_radio_btn');

let checkBtn = 0;

sizeBtn.forEach((item, i) => {
    item.addEventListener('click', () => {
        sizeBtn[checkBtn].classList.remove('check');
        item.classList.add('check');
        checkBtn = i;
    })
})