//===================
// PORT
//===================
process.env.PORT = process.env.PORT || 3000;

//===================
// ENTORNO
//===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================
// Vencimiento del TOKEN
//===================
// 60 seg
// 60 min
// 24 hr
// 30 dias
process.env.CADUCIDAD_TOKEN = '1d';

//===================
// SEED
//===================
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';


//===================
// BASE DE DATOS
//===================  

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';

} else {
    urlDB = process.env.mongo_remoto;
}

process.env.URLDB = urlDB;

//===================
// CLIENT_ID
//=================== 
process.env.CLIENT_ID = process.env.CLIENT_ID || '371383672843-m8df9ek2q60vtntqd4oct4ggfcoh9qbf.apps.googleusercontent.com';