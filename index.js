const db = require('./db/connection');
const inquirer = require('inquirer');
const figlet = require('figlet');
require('console.table');

//Figlet Title "Employee Manager"

//What would you like to do? *helper text in dark gray (Use arrow keys)
    //View All Empoyees
        //table el from employees c1-3(Employee Id, first_name, last_name)
        //center join? from roles table c4(title)
        //center join? from departments table c5(department_name)
        //right join? from roles table c6(salary)
        //right join? from employees table based on manager_id combine (first_name, Last_name)

    //Add Employee
        //What is the employee's first_name?
        //What is the employee's last_name?
        //What is the employee's role?
            //dropdown with role table(title)
        //Who is the employee's manager?
            //dropdown with all manager combined first_name last_name
                //*first option is None* for dropdown

    //Update Employee Role
        //Which employee's role do you want to update?
            //dropdown with all employees combined first_name last_name
                //when employee is selected dropdown of all roles(title)

    //View All Roles
        //table *All columns from roles table*

    //Add Role
        //What is the name of the role?
        //What is the salary of the role?
        //Which department does the role belong to?
            //drop down list of department_name

    //View All Departments
        //table *All columns from departments table*

    // Add Department
        //What is the name of the department?

    //Quit

  //*helper text in dark gray (Move up and down to reveal more choices)