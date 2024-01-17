INSERT INTO department (name)
VALUES ('Sales'), ('IT'), ('HR');

INSERT INTO role (title, salary, department_id)
VALUES 
('Sales', 55000, 1),
('Sales Manager', 70000, 1),
('IT Technician', 60000, 2),
('Support Specialist', 65000, 2),
('HR Coordinator', 52000, 3),
('HR Manager', 60000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Smith', 1, NULL),
('Jane', 'Doe', 2, NULL),
('Peter', 'White', 3, NULL),
('Sally', 'Roe', 4, Null),
('Mike', 'Miller', 5, NULL),
('Robert', 'Anderson', 6, NULL);
