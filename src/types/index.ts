export interface EmployeeType {
  id: string;
  idnum: string;
  name: string;
  employer: string;
  role: string;
  dept: string;
  createdAt?: string;
}

export interface DocumentItemType {
  name: string;
  data: string;
  docType: 'Statement' | 'Incident Report' | 'Investigation Report' | 'Other' | string;
  uploadedAt: string;
}

export interface IncidentType {
  id: string;
  empId: string;
  date: string;
  type: 'Accident' | 'Incident' | 'Injury' | 'Near Miss' | string;
  category: 'Ro Ro' | 'Container' | 'Fire' | 'Construction' | 'Others' | string;
  shift: 'Day' | 'Night' | string;
  location: string;
  equipment: string;
  injury: string;
  bodypart?: string;
  desc: string;
  action?: string;
  witness?: string;
  reporter?: string;
  status: 'Opened' | 'Under Review' | 'Completed' | string;
  docs: DocumentItemType[];
  createdAt?: string;
}
