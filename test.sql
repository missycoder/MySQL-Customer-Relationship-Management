-- SELECT Customers;
SELECT * FROM Customers WHERE customer_id=1; -- Jasmine Aladdin

-- CREATE (INSERT) Customers;
INSERT INTO Customers (first_name, last_name, rating, company_id)
VALUES ("Steve", "Jobs", 5, 1),
("Bill", "Gates", 3, 2);

-- UPDATE (INSERT) Customers;
UPDATE Customers SET rating=3
WHERE customer_id = 20;

-- DELETE Customers;
DELETE FROM Customers WHERE customer_id = 19;

-- UPDATE an existing row
UPDATE Companies SET name="Ali Baba Global Finances"
WHERE company_id = 23;

UPDATE Companies SET name="Project X Consultancy"
WHERE company_id = 22;


-- DELETE 
-- the `where` is super important because it
-- specifies which rows to DELETE
-- if there is no `where` clause, then all the rows are DELETED
DELETE FROM Companies WHERE company_id = 24;
