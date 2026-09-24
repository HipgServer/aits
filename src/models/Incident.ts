import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDocumentItem {
  name: string;
  data: string; // Base64 or URL
  docType: 'Statement' | 'Incident Report' | 'Investigation Report' | 'Other' | string;
  uploadedAt: string;
}

export interface IIncident extends Document {
  id: string; // INC-001
  empId: string; // EMP-001 reference
  date: string; // YYYY-MM-DDTHH:mm
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
  docs: IDocumentItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

const DocumentItemSchema = new Schema<IDocumentItem>({
  name: { type: String, required: true },
  data: { type: String, required: true },
  docType: { type: String, default: 'Statement' },
  uploadedAt: { type: String, required: true },
});

const IncidentSchema: Schema = new Schema<IIncident>(
  {
    id: { type: String, required: true, unique: true, index: true },
    empId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    shift: { type: String, required: true },
    location: { type: String, required: true },
    equipment: { type: String, default: '' },
    injury: { type: String, default: 'None' },
    bodypart: { type: String, default: '' },
    desc: { type: String, required: true },
    action: { type: String, default: '' },
    witness: { type: String, default: '' },
    reporter: { type: String, default: '' },
    status: { type: String, default: 'Opened' },
    docs: { type: [DocumentItemSchema], default: [] },
  },
  { timestamps: true }
);

const Incident: Model<IIncident> =
  mongoose.models.Incident || mongoose.model<IIncident>('Incident', IncidentSchema);

export default Incident;
