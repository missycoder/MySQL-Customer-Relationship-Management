const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
// database client to connect to mysql database
const { createConnection } = require('mysql2/promise');
require('dotenv').config();

const app = express();

//setup view engine
app.set('view engine', 'hbs');

require('handlebars-helpers')({
    handlebars : hbs.handlebars
})

//enable static files
app.use(express.static('public'));

// enable form processing
app.use(express.urlencoded({ extended: false }));

//wax-on (template inheritance)
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

async function main() {
    const connection = await createConnection({
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'database': process.env.DB_DATABASE,
        'password': process.env.DB_PASSWORD
    })
}

app.get('/customers', async (req, res) => {
    // array destructuring
    // `execute` function returns the array
    const [customers] = await connection.execute(`SELECT * FROM Customers INNER JOIN Companies ON Customers.company_id = Companies.company_id`);
    res.render('customers/index', {
        'customers': customers
    })
})

// CREATE Customers
app.get('/create-customers', async function (req, res) {
    const [companies] = await connection.execute(`SELECT * FROM COMPANIES`);

    res.render('create-customers', {
        companies
    });
})

// SUBMIT FORM
app.post('/create-customers', async function (req, res) {
    // object destructuring
    const { first_name, last_name, rating, company_id } = req.body;
    // object destructuring with rename
    const query = `INSERT INTO Customers(first_name, last_name, rating, company_id) 
    VALUES ("${first_name}", "${last_name}", ${rating}, 1);`
})



app.listen(3000, () => {
    console.log('Server has started')
});

main();