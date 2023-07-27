// redirect to home if user logged in
window.onload = () => {
    if(sessionStorage.user){
        user = JSON.parse(sessionStorage.user);
        if(compareToken(user.authToken, user.email)){
            location.replace('/');
        }
    }
}

const loader = document.querySelector('.loader');

// selec inputs
const submitBtn = document.querySelector('.submit_btn');
const usr = document.querySelector('#usr') || null;
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const number = document.querySelector('#number') || null;
const tac = document.querySelector('#terms_and_cond') || null;
const notification = document.querySelector('#notification') || null;

password.addEventListener('keypress', (event) => {
    if(event.key === 'Enter'){
        event.preventDefault();
        sendDataFuntionUser();
    }
})

submitBtn.addEventListener('click', () => {
    sendDataFuntionUser();
})


function sendDataFuntionUser(){
    if(usr != null){
        // submit form
        loader.style.display = 'block';
        sendData('/signup', {
            name: usr.value,
            email: email.value,
            password: password.value,
            number: number.value,
            tac: tac.checked,
            notification: notification.checked,
            seller: false
        })
    }else{
        // login page
        if( !email.value.length || !password.value.length){
            showAlert('Compos incompletos !');
        }else{
            loader.style.display = 'block';
            sendData('/login', {
                email: email.value,
                password: password.value,
            })
        }
    }
}