const productContainers = [...document.querySelectorAll('.product_container')];
const nxtBtn =[...document.querySelectorAll('.nxt_btn')];
const preBtn =[...document.querySelectorAll('.pre_btn')];

productContainers.forEach((item, i) => {
    let containerDimentions = item.getBoundingClientRect();
    let containerWidth = containerDimentions.width;
    
    nxtBtn[i].addEventListener('click', () => {
        item.scrollLeft += (containerWidth/2);
    })
    preBtn[i].addEventListener('click', () => {
        item.scrollLeft -= (containerWidth/2);
    })
})