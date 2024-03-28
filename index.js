const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const { createConnection } = require('mysql2/promise');
require('dotenv').config();

const app = express();

// Setup view engine
app.set('view engine', 'hbs');

require('handlebars-helpers')({
    handlebars: hbs.handlebars
});

// Enable static files
app.use(express.static('public'));

// Enable form processing
app.use(express.urlencoded({ extended: false }));

// Wax-on (template inheritance)
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

async function main() {
    try {
        // Establish database connection
        const connection = await createConnection({
            'host': process.env.DB_HOST,
            'user': process.env.DB_USER,
            'database': process.env.DB_DATABASE,
            'password': process.env.DB_PASSWORD
        });

        // Route to retrieve and display customers
        app.get('/customers', async (req, res) => {
            try {
                const [customers] = await connection.execute(`
                SELECT Customers.*, Companies.name AS company_name FROM Customers JOIN
                Companies ON Customers.company_id = Companies.company_id
                ORDER BY first_name
                `);
                res.render('customers/index', {
                    'customers': customers
                });
            } catch (error) {
                console.error("Error retrieving customers:", error);
                res.status(500).send("Internal server error");
            }
        });

        // Route to render form for CREATING customers
        app.get('/create-customers', async function (req, res) {
            try {
                const [companies] = await connection.execute(`SELECT * FROM COMPANIES`);
                res.render('create-customers', { companies });
            } catch (error) {
                console.error("Error retrieving companies:", error);
                res.status(500).send("Internal server error");
            }
        });

        // Route to handle submission of customer creation form
        app.post('/create-customers', async function (req, res) {
            try {
                const { first_name, last_name, rating, company_id } = req.body;
                const query = `INSERT INTO Customers(first_name, last_name, rating, company_id) 
                            VALUES (?, ?, ?, ?);`;
                await connection.execute(query, [first_name, last_name, rating, company_id]);
                res.status(200).send("Customer created successfully");
            } catch (error) {
                console.error("Error creating customer:", error);
                res.status(500).send("Internal server error");
            }
        });

        // Route to render form for UPDATING customers
        app.get('/update-customers/:customerId', async (req, res) => {
            try {
                const { customerId } = req.params;
                const query = `SELECT * FROM Customers WHERE customer_id = ?;`;
                const [customers] = await connection.execute(query, [customerId]);
                const customerToUpdate = customers[0];
                const [companies] = await connection.execute("SELECT * FROM Companies");
                res.render('update-customers', {
                    'customer': customerToUpdate,
                    'companies': companies
                });
            } catch (error) {
                console.error("Error retrieving customer details for update:", error);
                res.status(500).send("Internal server error");
            }
        });

        // Route to handle submission of customer update form
        app.post('/update-customers/:customerId', async function (req, res) {
            try {
                const { customerId } = req.params;
                const { first_name, last_name, rating, company_id } = req.body;
                const query = `UPDATE Customers SET first_name = ?, last_name = ?, 
                            rating = ?, company_id = ? WHERE customer_id = ?`;
                await connection.execute(query, [first_name, last_name, rating, company_id, customerId]);
                res.redirect('/customers');
            } catch (error) {
                console.error("Error updating customer:", error);
                res.status(500).send("Internal server error");
            }
        });

        // Route to render form for DELETING customers
        app.get('/delete-customers/:customerId', async function (req, res) {
            try {
                const { customerId } = req.params;
                const [customers] = await connection.execute(`SELECT * FROM Customers WHERE customer_id = ?`, [customerId]);
                const customerToDelete = customers[0];
                res.render('delete-customers', { 'customer': customerToDelete });
            } catch (error) {
                console.error("Error retrieving customer details for delete:", error);
                res.status(500).send("Internal server error");
            }
        });

        // Route to handle deletion of customers
        app.post('/delete-customers/:customerId', async function (req, res) {
            try {
                const { customerId } = req.params;
                const query = `DELETE FROM Customers WHERE customer_id = ?`;
                await connection.execute(query, [customerId]);
                res.redirect('/customers');
            } catch (error) {
                console.error("Error deleting customer:", error);
                res.status(500).send("Internal server error");
            }
        });

        // Route to search for customers based on criteria
        app.get('/search-customers', async (req, res) => {
            try {
                // Extract search criteria from query parameters
                const { firstName, lastName, rating, companyId } = req.query;

                // selects data from the Customers table, joining with the Companies table 
                // to include the company name
                let query = `SELECT Customers.*, Companies.name AS company_name FROM Customers JOIN
                             Companies ON Customers.company_id = Companies.company_id`;

                // these arrays will be used to store the parameters for the SQL query 
                // and the conditions for filtering the data
                const queryParams = [];
                const conditions = [];

                if (firstName) {
                    conditions.push(`first_name LIKE ?`);
                    queryParams.push(`%${firstName}%`);
                }

                if (lastName) {
                    conditions.push(`last_name LIKE ?`);
                    queryParams.push(`%${lastName}%`);
                }

                if (rating) {
                    conditions.push(`rating = ?`);
                    queryParams.push(rating);
                }

                if (companyId) {
                    conditions.push(`company_id = ?`);
                    queryParams.push(companyId);
                }
                // If any conditions were added, block appends `WHERE`, joins with 
                // `and` logical operator
                if (conditions.length > 0) {
                    query += ` WHERE ${conditions.join(' AND ')}`;
                }

                // Regardless of whether conditions were added, results sorted by first_name
                query += ` ORDER BY first_name`;

                // awaits the result and extracts the customers array from the result
                const [customers] = await connection.execute(query, queryParams);

                res.render('customers/index', {
                    'customers': customers
                });
            } catch (error) {
                console.error("Error searching customers:", error);
                res.status(500).send("Internal server error");
            }
        });

        // Start the server
        app.listen(3000, () => {
            console.log('Server has started');
        });
    } catch (error) {
        console.error("Error establishing database connection:", error);
        process.exit(1);
    }
}

// Call main function to establish database connection
main();
