// importing packages
const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const path = require('path');
const { get } = require('https');
//-------------------------------------------------------------------
// firebase admin setup
let serviceAccount = require("./public/ecommerce-fdv-firebase-adminsdk-7we6f-8459ebeb4e.json");
const { error } = require('console');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ecommerce-fdv-default-rtdb.firebaseio.com"
});

let db = admin.firestore();

//---------------------------------------------- PROBLEM UPLOAD IMAGE
// aws config
/*
const aws = require('aws-sdk');
const dotenv = require('dotenv');
const { url } = require('inspector');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
 
dotenv.config();

// aws parameters
const region = "sa-east-1";
const buckeName = "ecommerce-website-fdv";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

aws.config.update({
    region, 
    accessKeyId, 
    secretAccessKey
}) 

// init s3
//const s3 = new aws.S3();

//generate imagr upload link
/*
async function generateUrl(){
    let data = new Date();
    let id = parseInt(Math.random() * 10000000000);

    const imageName = `${id}${data.getTime()}.jpg`;
    
    const params = ({
        Bucket: buckeName,
        Key: imageName,
        Expires: 300, //300 ms
        ContentType: 'image/jpeg'
    })
    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
    return uploadUrl;
}
*/
//-------------------------------------------------------------------
// declarate static pach
let staticPath = path.join(__dirname, "public");

//-------------------------------------------------------------------
//initializing express.js
const app = express();

//-------------------------------------------------------------------
// middlewares
app.use(express.static(staticPath));
app.use(express.json());

//-------------------------------------------------------------------
// ROUTES OF PAGES
//-------------------------------------------------------------------
// home route
app.get("/",(req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
})

//-------------------------------------------------------------------
// signup route
app.get('/signup', (req, res) => {
    res.sendFile(path.join(staticPath, "signup.html"));
})

app.post('/signup', (req, res) => {
    let { name, email, password, number, tac, notif } = req.body;

    //form validations
    if(name.length < 3){
        return res.json({'alert': 'El nombre debe ser mas largo.'});
    
    }else if(!email.length){
        return res.json({'alert': 'Ingresa tu correo.'});

    }else if(password.length < 8){
        return res.json({'alert': 'La contraseña debe tener mas de 8 caracteres.'});

    }else if(number.length != 0){
        if(!Number(number)||number.length<10){
            return res.json({'alert': 'El numero ingresado es invalido, intente con otro.'});
        };

    }else if(!tac){
        return res.json({'alert': 'Debe aceptar los terminos y condiciones.'});
    }

    // store user in ddbb
    db.collection('users').doc(email).get()
    .then(user =>{
        if(user.exists){
            return res.json({'alert':'Ese correo ya esta registrado'});
        }else{
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, function(err, hash) {
                    req.body.password = hash;
                    db.collection('users').doc(email).set(req.body)
                    .then((data) => {
                        res.json({
                            name: req.body.name,
                            email: req.body.email,
                            seller: req.body.seller,
                        })
                    })
                })
            })
        }
    })
})

//-------------------------------------------------------------------
// login route
app.get('/login', (req, res) => {
    res.sendFile(path.join(staticPath, "login.html"));
})

app.post('/login', (req, res) => {
    let { email, password } = req.body;

    if(!email.length || !password.length){
        return res.json({'alert':'Compos incompletos siii!'});
    }

    db.collection('users').doc(email).get()
    .then(user => {
        if(!user.exists){
            return res.json({'alert':'Usuario no existe!'});
        }else{
            bcrypt.compare(password, user.data().password, (err, result) =>{
                if(result){
                    let data = user.data();
                    return res.json({
                        name: data.name,
                        email: data.email,
                        seller: data.seller,
                    })
                }else{
                    return res.json({'alert':'Contraseña incorrect !'});
                }
            })
        }
    })
})

//-------------------------------------------------------------------
// seller route
app.get('/seller', (req, res) => {
    res.sendFile(path.join(staticPath, "seller.html"));
})

app.post('/seller', (req, res) => {
    let { name, address, about, number, tac, legit, email } = req.body;
    
    if(!name.length||!address.length||!about.length||number.length < 10 ||!Number(number)){
        return res.json({'alert':'Ingresaste informacion invalida !'});
    
    }else if(!tac || !legit){
        return res.json({'alert':'Deves aceptar los terminos y condiciones.'});
    
    }else{
        // update users seller status here
        db.collection('sellers').doc(email).set(req.body)
        .then((data) => {
            db.collection('users').doc(email).update({
                seller: true
            }).then((data) => {
                res.json(true);
            })
        })
    }
})

//-------------------------------------------------------------------
// add products
app.get('/add-product', (req, res) => {
    res.sendFile(path.join(staticPath, "addProduct.html"));
})

app.get('/add-product/:id', (req, res) => {
    res.sendFile(path.join(staticPath, "addProduct.html"));
})

//-------------------------------------------------------------------
// get the upload link
/*
app.get('/s3url', (req, res) => {
    generateUrl().then(url => res.json(url));
})
*/

//-------------------------------------------------------------------
// add product 
app.post('/add-product', (req, res) => {
    let { name, prodDes, des, images, sizes, actualPrice, discount, 
        sellPrice, stock, tags, tac, email, draft } = req.body;
    
    if(!draft){
        // validations
        if(!name.length){
            return res.json({'alert':'Ingrese nombre del producto !'});
        }else if(prodDes.length > 100 || prodDes.length < 10){
            return res.json({'alert':'La descripcion debe ser entre 10 a 100 letras !'});
        }else if(!des.length){
            return res.json({'alert':'Falta de descripcion del producto'});
        }/*else if(!images.length){
            return res.json({'alert':'Carge minimo una imagen.'});
        }*/else if(!sizes.length){
            return res.json({'alert':'Seleccione minimo un tamaño de producto'});
        }else if(!actualPrice.length){
            return res.json({'alert':'Ingrese el precio del producto !!!'});
        }else if(stock.value < 5){
            return res.json({'alert':'Debe ingresar un stock de minimo 5 !'});
        }else if(!tags.length){
            return res.json({'alert':'Asignale una etiqueta al producto.'});
        }else if(tac.checked){
            return res.json({'alert':'Debes haceptar los terminos y condiciones para continuar.'});
        }
    }

    // add product
    let docName = `${name.toLowerCase()}-${Math.floor(Math.random()*5000)}`;
    db.collection("products").doc(docName).set(req.body)
    .then((data) => {
        res.json({ 'product': name });
    })
    .catch(err => {
        return res.json({ 'alert': 'Algo salió mal, inténtalo nuevamente !!' });
    });
});

//-------------------------------------------------------------------
// get products
app.post('/get-products', (req, res) => {
    let { email, id } = req.body;
    let docRef = id ? db.collection('products').doc(id) : db.collection('products').where('email', '==', email);

    docRef.get()
    .then(products => {
        if(products.empty){
            return res.json({'alert':'no products'});
        }
        let productArr = [];
        if(id){
            return res.json(products.data());
        }
        products.forEach(item => {
            let data = item.data();
            data.id = item.data();
            productArr.push(data);
        })
        res.json(productArr);
    })
})

//-------------------------------------------------------------------
// Delete product
app.post('/delete-product', (req, res) => {
    let { id } = req.body;

    db.collection("products").doc(id).delete()
    .then((data) => {
        res.json('success');
    }).catch(err => {
        res.json('err');
    }).documentID;
})

//-------------------------------------------------------------------
// 404 route
app.get('/404', (req, res) => {
    res.sendFile(path.join(staticPath, "404.html"));
})

app.use((req, res) =>{
    res.redirect('/404');
})

//-------------------------------------------------------------------
//-------------------------------------------------------------------
// port conecting
app.listen(3000, () => {
    console.log('listening port 3100...');
})