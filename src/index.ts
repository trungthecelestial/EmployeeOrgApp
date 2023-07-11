import { Employee, IEmployeeOrgApp } from './types';

class EmployeeOrgApp implements IEmployeeOrgApp {
  public ceo: Employee;
  private moveHistory: { employee: Employee; oldSupervisor: Employee }[];
  private redoHistory: { employee: Employee; newSupervisor: Employee }[];

  constructor(ceo: Employee) {
    this.ceo = ceo;
    this.moveHistory = [];
    this.redoHistory = [];
  }

  move(employeeID: number, supervisorID: number): void {
    const employee = this.findEmployeeByUniqueId(this.ceo, employeeID);
    const newSupervisor = this.findEmployeeByUniqueId(this.ceo, supervisorID);
    const oldSupervisor = this.findSupervisor(this.ceo, employee);

    if (oldSupervisor) {
      oldSupervisor.subordinates = oldSupervisor.subordinates
        .filter((subordinate) => subordinate !== employee)
        .concat(employee.subordinates);
    }

    newSupervisor.subordinates.push(employee);
    employee.subordinates = [];

    this.moveHistory.push({ employee, oldSupervisor });

    // Clear the redo history when a new move operation is performed
    this.redoHistory = [];
  }

  undo() {
    const lastMove = this.moveHistory.pop();

    if (lastMove) {
      const { employee, oldSupervisor } = lastMove;
      const currentSupervisor = this.findSupervisor(this.ceo, employee);

      if (currentSupervisor) {
        currentSupervisor.subordinates = currentSupervisor.subordinates.filter(
          (subordinate) => subordinate !== employee,
        );
      }

      oldSupervisor.subordinates.push(employee);

      this.redoHistory.push({ employee, newSupervisor: currentSupervisor });
    }
  }

  redo() {
    const lastRedo = this.redoHistory.pop();

    if (lastRedo) {
      const { employee, newSupervisor } = lastRedo;
      const currentSupervisor = this.findSupervisor(this.ceo, employee);

      if (currentSupervisor) {
        currentSupervisor.subordinates = currentSupervisor.subordinates.filter(
          (subordinate) => subordinate !== employee,
        );
      }

      newSupervisor.subordinates.push(employee);

      this.moveHistory.push({ employee, oldSupervisor: currentSupervisor });
    }
  }

  private findEmployeeByUniqueId(root: Employee, employeeID: number): Employee {
    const stack: Employee[] = [root];

    while (stack.length > 0) {
      const current = stack.pop();

      if (current) {
        if (current.uniqueId === employeeID) {
          return current;
        }

        stack.push(...current.subordinates);
      }
    }

    // Employee not found in the organization
    throw new Error('Employee not found');
  }

  private findSupervisor(root: Employee, employee: Employee): Employee {
    const stack: Employee[] = [root];

    while (stack.length > 0) {
      const current = stack.pop();

      if (current) {
        if (current.subordinates.includes(employee)) {
          return current;
        }

        stack.push(...current.subordinates);
      }
    }

    // Supervisor not found in the organization
    throw new Error('Supervisor not found');
  }
}

export default EmployeeOrgApp;
