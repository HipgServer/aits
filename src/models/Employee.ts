import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmployee extends Document {
  id: string; // EMP-001
  idnum: string; // National ID / Passport
  name: string;
  employer: string;
  role: string;
  dept: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const EmployeeSchema: Schema = new Schema<IEmployee>(
  {
    id: { type: String, required: true, unique: true, index: true },
    idnum: { type: String, required: true },
    name: { type: String, required: true },
    employer: { type: String, required: true },
    role: { type: String, required: true },
    dept: { type: String, required: true },
  },
  { timestamps: true }
);

const Employee: Model<IEmployee> =
  mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);

export default Employee;
