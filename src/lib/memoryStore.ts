import { EmployeeType, IncidentType } from '@/types';
import { INITIAL_EMPLOYEES, INITIAL_INCIDENTS } from '@/lib/seedData';

interface MemoryStoreCache {
  employees: EmployeeType[];
  incidents: IncidentType[];
}

declare global {
  // eslint-disable-next-line no-var
  var __memoryStore: MemoryStoreCache | undefined;
}

const memoryStoreCache: MemoryStoreCache = globalThis.__memoryStore || {
  employees: [...INITIAL_EMPLOYEES],
  incidents: [...INITIAL_INCIDENTS],
};

if (!globalThis.__memoryStore) {
  globalThis.__memoryStore = memoryStoreCache;
}

// Employee Operations
export function getMemoryEmployees(): EmployeeType[] {
  return memoryStoreCache.employees;
}

export function getMemoryEmployeeById(id: string): EmployeeType | undefined {
  return memoryStoreCache.employees.find((e) => e.id === id);
}

export function createMemoryEmployee(empData: EmployeeType): EmployeeType {
  const existingIndex = memoryStoreCache.employees.findIndex((e) => e.id === empData.id);
  if (existingIndex >= 0) {
    throw new Error(`Employee ID ${empData.id} already exists.`);
  }
  const newEmp = { ...empData };
  memoryStoreCache.employees.unshift(newEmp);
  return newEmp;
}

export function updateMemoryEmployee(id: string, empData: Partial<EmployeeType>): EmployeeType | null {
  const index = memoryStoreCache.employees.findIndex((e) => e.id === id);
  if (index === -1) return null;

  memoryStoreCache.employees[index] = {
    ...memoryStoreCache.employees[index],
    ...empData,
    id, // Preserve ID
  };
  return memoryStoreCache.employees[index];
}

export function deleteMemoryEmployee(id: string): boolean {
  const index = memoryStoreCache.employees.findIndex((e) => e.id === id);
  if (index === -1) return false;

  memoryStoreCache.employees.splice(index, 1);
  return true;
}

// Incident Operations
export function getMemoryIncidents(): IncidentType[] {
  return memoryStoreCache.incidents;
}

export function getMemoryIncidentById(id: string): IncidentType | undefined {
  return memoryStoreCache.incidents.find((i) => i.id === id);
}

export function createMemoryIncident(incData: Omit<IncidentType, 'id'> & { id?: string }): IncidentType {
  let generatedId = incData.id;
  if (!generatedId) {
    const count = memoryStoreCache.incidents.length;
    generatedId = `INC-${String(count + 1).padStart(3, '0')}`;
  }

  const newIncident: IncidentType = {
    id: generatedId,
    empId: incData.empId,
    date: incData.date,
    type: incData.type,
    category: incData.category,
    shift: incData.shift,
    location: incData.location,
    equipment: incData.equipment || '',
    injury: incData.injury || 'None',
    bodypart: incData.bodypart || '',
    desc: incData.desc,
    action: incData.action || '',
    witness: incData.witness || '',
    reporter: incData.reporter || '',
    status: incData.status || 'Opened',
    docs: incData.docs || [],
  };

  memoryStoreCache.incidents.unshift(newIncident);
  return newIncident;
}

export function updateMemoryIncident(id: string, incData: Partial<IncidentType>): IncidentType | null {
  const index = memoryStoreCache.incidents.findIndex((i) => i.id === id);
  if (index === -1) return null;

  memoryStoreCache.incidents[index] = {
    ...memoryStoreCache.incidents[index],
    ...incData,
    id, // Preserve ID
  };
  return memoryStoreCache.incidents[index];
}

export function deleteMemoryIncident(id: string): boolean {
  const index = memoryStoreCache.incidents.findIndex((i) => i.id === id);
  if (index === -1) return false;

  memoryStoreCache.incidents.splice(index, 1);
  return true;
}
