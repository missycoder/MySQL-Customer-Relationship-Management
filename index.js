const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const { createConnection } = require('mysql2/promise');

let app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

let connection;

async function main() {
    const connection = await createConnection({
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'database': process.env.DB_NAME,
        'password': process.env.DB_PASSWORD
    })
}

app.get('/customers', async (req, res) => {
    let [customers] = await connection.execute('SELECT * FROM Customers INNER JOIN Companies ON Customers.company_id = Companies.company_id');
    res.render('customers/index', {
        'customers': customers
    })
})


app.listen(3000, ()=>{
    console.log('Server is running')
});

main();