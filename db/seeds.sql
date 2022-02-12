INSERT INTO departments (department_name)
VALUE
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO roles (title, salary, department_id)
VALUE
('Sales Lead', 100000, 1),
('Salesperson', 80000, 1),
('Lead Engineer', 150000, 2),
('Software Engineer', 120000, 2),
('Account Manager', 160000, 3), 
('Accountant', 125000, 3),
('Legal Team Lead', 250000, 4),
('Lawyer', 190000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUE
('John', 'Doe', 1, null),
('Mike', 'Chan', 2, 1),
('Ashley', 'Rodriguez', 3, null),
('Kevin', 'Tupik', 4, 3),
('Kunal', 'Singh', 5, null),
('Malia', 'Brown', 6, 5),
('Sarah', 'Lourd', 7, null),
('Tom', 'Allen', 8, 7);


--View All Employees with id, first name, last name, title, departments, salary, manager
USE employeetracker_db;

SELECT 
employees.id
AS Id, 
employees.first_name
AS First_Name,
employees.last_name
AS Last_Name,
roles.title
AS Title,
departments.department_name 
AS Departments, 
roles.salary 
AS Salary,
CONCAT(manager.first_name, ' ', manager.last_name) 
AS Manager
FROM employees 
LEFT JOIN roles on employees.role_id = roles.id
LEFT JOIN departments on roles.department_id = departments.id 
LEFT JOIN employees manager on manager.id = employees.manager_id
ORDER BY department_name ASC;

--View by Roles with title
USE employeetracker_db;

SELECT
roles.title
AS Title
FROM employeetracker_db.roles
ORDER BY roles.title ASC;

--View by Roles with id, title, departments, salary
USE employeetracker_db;

SELECT
roles.id
AS Id,
roles.title
AS Title,
departments.department_name
AS Departments,
roles.salary
AS Salary
FROM employeetracker_db.roles
LEFT JOIN departments on roles.department_id = departments.id
ORDER BY department_name ASC;

--View Departments
USE employeetracker_db;

SELECT departments.department_name 
AS Departments
FROM departments
ORDER BY department_name ASC;

--View Employees by Departments
USE employeetracker_db;

SELECT employees.id, 
CONCAT(employees.first_name," ", employees.last_name)
AS FullName, 
departments.department_name 
AS Departments
FROM employees 
LEFT JOIN roles on employees.role_id = roles.id
LEFT JOIN departments on roles.department_id = departments.id
ORDER BY department_name ASC;