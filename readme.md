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

# Express Commands
`npm init -y`
`npm install express hbs wax-on dotenv mysql2 handlebars-helpers`

# Setup Express
`create index.js file`
`npm install -g nodemon`
`nodemon`

# ER Diagram
<img width="989" alt="crm_er_diagram" src="https://github.com/missycoder/MySQL-Customer-Relationship-Management/assets/156276105/80c20378-7c2c-4b63-97b3-d6f18795b4aa">

# CRM Diagram
![crm_diagram](https://github.com/missycoder/MySQL-Customer-Relationship-Management/assets/156276105/2ae1634a-90bd-4b90-9cce-19ac8e77d2cb)

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
