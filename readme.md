# Schema
`mysql -u root < schema.sql`
`mysql -u root < data.sql`

# Setup MySQL
`mysql -u root`

# MySQL Commands
`show databases;`
`use crm;`
`select * from Companies;`
`select * from Customers;`
`describe Customers;`
`show tables;`

`describe employees;`
`describe taskforces;`
`describe departments;`
`select * from employees;`
`select * from taskforces;`
`select * from departments;`

# Express Commands
`npm init -y`
`npm install express hbs wax-on dotenv mysql2 handlebars-helpers`

# Setup Express
`create index.js file`
`npm install -g nodemon`
`nodemon`

# Create a new database user
In the MySQL CLI:
```
CREATE USER 'ahkow'@'localhost' IDENTIFIED BY 'rotiprata123';
```

```
GRANT ALL PRIVILEGES on sakila.* TO 'ahkow'@'localhost' WITH GRANT OPTION;
```
**Note:** Replace *sakila* with the name of the database you want the user to have access to
 
 ```
FLUSH PRIVILEGES;
```
