import EmployeeOrgApp from '.';
import { sampleOrganization } from './sample';
import { IEmployeeOrgApp } from './types';

describe('EmployeeOrgApp', () => {
  let app: IEmployeeOrgApp;

  beforeAll(() => {
    app = new EmployeeOrgApp(sampleOrganization);
  });

  it('should move an employee to a new supervisor', () => {
    app.move(2, 11); // Move employee with uniqueId 2 under supervisor with uniqueId 11
    expect(app.ceo.subordinates[1].subordinates[3].uniqueId).toBe(2);
  });

  it('should undo the last move action', () => {
    app.undo(); // Undo the last move action
    expect(app.ceo.subordinates[3].uniqueId).toBe(2);
  });

  it('should redo the last undo action', () => {
    app.redo(); // Redo the last undone action
    expect(app.ceo.subordinates[1].subordinates[3].uniqueId).toBe(2);
  });

  it('should move an employee to a new supervisor and make its subordinates become subordinates of the old supervisor', () => {
    app.move(6, 11);
    expect(app.ceo.subordinates[0].subordinates[0].uniqueId).toBe(10);
  });
});
