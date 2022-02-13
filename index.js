const connection = require('./db/connection');
const inquirer = require('inquirer');
const figlet = require('figlet');
const consoleTable = require('console.table');

const openingScreen = () => {

    figlet('Employee Tracker', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
    });
}

const addBlankLine = () => {
    console.log(` \n`)
}

const startApp = async () => {
    startQuestion();
    // setTimeout(viewAllEmployees, 10);
}

const startQuestion = () => {
    addBlankLine();
    inquirer.prompt({
        name: 'action',
        type: 'rawlist',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'Add Employee',
            'Remove Employee', 
            'Update Employee Role', 
            'View All Roles',
            'Add Role',
            'Remove Role',
            'View All Departments',
            'Add Department',
            'Remove Department',
            'End Program'
        ]
    })
        .then((answer) => {
            switch (answer.action) {

                case 'View All Employees':
                viewAllEmployees()
                break;

                case 'Add Employee':
                addEmployee()
                break;

                case 'Remove Employee':
                removeEmployee()
                break;

                case 'Update Employee Role':
                updateEmployeeRole()
                break;

                case 'View All Roles':
                viewAllRoles()
                break;

                case 'Add Role':
                addRole()
                break;

                case 'Remove Role':
                removeRole()
                break;

                case 'View All Departments':
                viewAllDepartments()
                break;

                case 'Add Department':
                addDepartment()
                break;

                case 'Remove Department':
                removeDepartment()
                break;

                case 'End Program':
                endProgram()
                break;
            }
        })
}

const viewAllEmployees = () => {
    addBlankLine();
    connection.query(
        `SELECT employees.id AS Id, employees.first_name AS First_Name, employees.last_name AS Last_Name, roles.title AS Title, departments.department_name AS Departments, roles.salary AS Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments on roles.department_id = departments.id LEFT JOIN employees manager on manager.id = employees.manager_id ORDER BY department_name ASC;`, 
        (err, res) => {
            if (err) throw err;
            console.table(res)
        }
    )
    setTimeout(startQuestion, 30);
}

const addEmployee = () => {
    addBlankLine();
    connection.query(`SELECT * FROM roles;`, (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: `first_name`,
                type: `input`,
                message: `Enter Employee First Name:`
            },
            {
                name: `last_name`,
                type: `input`,
                message: `Enter Employee Last Name:`
            },
            {
                name: `role`,
                type: `input`,
                message() {
                    const addEmployeeArray = [];
                    res.forEach(({ title, id }) => {
                        addEmployeeArray.push(id + ' = ' + title);
                    });
                    console.log(`What is the employee's role Id number?\n`)
                    return addEmployeeArray.join(`\n`)
                },
                validate: (answer) => {
                    if (isNaN(answer)) {
                        return "Please enter the employee's role id number.";
                    }
                    return true;
                },
            }
        ])
            .then((answer) => {
                connection.query(
                    `INSERT INTO employees SET ?`,
                    [
                        {
                            first_name: answer.first_name,
                            last_name: answer.last_name,
                            role_id: answer.role
                        },
                    ],
                    (err, res) => {
                        if (err) throw err;
                        console.log(`${res.affectedRows} emloyee added. \n`)
                        viewAllEmployees();
                    }
                )
            })
    })
}

const removeEmployee = () => {
    addBlankLine();
    connection.query(`SELECT * FROM employees;`, (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: `employees`,
                type: `input`,
                message() {
                    const employeesArray = [];
                    res.forEach(({ id, first_name, last_name}) => {
                        employeesArray.push(`${id} ${first_name} ${last_name}`);
                    });
                    console.log(`What is the Id number of the employee to remove?\n`)
                    return employeesArray.join(`\n`)
                },
                validate: (answer) => {
                    if (isNaN(answer)) {
                        return "Please enter the employee's Id number.";
                    }
                    return true;
                },
            },
        ])
            .then((answer) => {
                connection.query(`DELETE FROM employees WHERE ?`,
                {
                    id: (answer.employees)
                },
                (err, res) => {
                    if (err) throw err
                    console.log(`${res.affectedRows} Deleted\n`)
                    viewAllEmployees();
                }
                )
            })
    })
};

const updateEmployeeRole = () => {
    addBlankLine();
    connection.query(
        `SELECT employees.id "Id", employees.first_name "First Name", employees.last_name "Last Name" FROM employees;`,
        (err, res) => {
            if (err) throw err;
            console.table(res)
        }
    )
    connection.query(`SELECT * FROM roles;`, (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: `employeeID`,
                type: `input`,
                message: `Input the Id number of the employee you want to update:`,
                validate: (answer) => {
                    if (isNaN(answer)) {
                        return "Please enter the employee's Id number";
                    }
                    return true;
                },
            },
            {
                name: `roleID`,
                type: `input`,
                message() {
                    const roleArray = [];
                    res.forEach(({ title, id }) => {
                        roleArray.push(id + ' = ' + title);
                    });
                    console.log(`What is the new role's Id number?\n`)
                    return roleArray.join(`\n`)
                },
                validate: (answer) => {
                    if (isNaN(answer)) {
                        return "Please enter the new role's Id number.";
                    }
                    return true;
                },
            }
        ])
            .then((answer) => {
                console.log(`Role: ${answer.roleID}`)
                console.log(`Employee Id: ${answer.employeeID}`)
                connection.query(`UPDATE employee SET ? WHERE ?;`,
                    [
                        {
                            role_id: (answer.roleID),
                        },
                        {
                            id: (answer.employeeID)
                        },
                    ],
                    (err, res) => {
                        if (err) throw err
                        console.log(`${res.affectedRows} employee updated\n`)
                        viewAllEmployees();
                    }
                )
            })
    })
};

const viewAllRoles = () => {
    addBlankLine();
    connection.query(
        `SELECT roles.id "Id", roles.title "Title" FROM roles;`,
        (err, res) => {
            if (err) throw err;
            console.table(res)
            startQuestion(); 
        }
    )
}

// addRole()

// removeRole()

// viewAllDepartments()

// addDepartment()

// removeDepartment()

// endProgram()















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

  startApp();