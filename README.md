# EmployeeOrgApp

I created a concrete class called EmployeeOrgApp that implements
IEmployeeOrgApp. The class should be instantiable with the ceo as a
constructor parameter.

## Installation

Install my-project with npm

```bash
  npm install
```

## Features

- When an employee is moved to a new supervisor, its existing subordinates will become the subordinates of old supervisor.
- Employees without any subordinates have an empty list for their subordinates property
- Created class is tested with jest via command

```
npm run test
```
