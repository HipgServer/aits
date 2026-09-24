import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Employee from '@/models/Employee';
import { INITIAL_EMPLOYEES } from '@/lib/seedData';
import { getMemoryEmployees, createMemoryEmployee } from '@/lib/memoryStore';

export async function GET() {
  try {
    const conn = await dbConnect();
    if (conn) {
      let employees = await Employee.find({}).sort({ createdAt: -1 });
      if (employees.length === 0) {
        // Seed initial employees
        await Employee.insertMany(INITIAL_EMPLOYEES);
        employees = await Employee.find({}).sort({ createdAt: -1 });
      }
      return NextResponse.json({ success: true, source: 'mongodb', data: employees });
    }
  } catch (error: unknown) {
    console.warn('MongoDB query error, returning memory store:', error);
  }

  return NextResponse.json({ success: true, source: 'memory', data: getMemoryEmployees() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, idnum, name, employer, role, dept } = body;

    if (!id || !idnum || !name || !employer || !role || !dept) {
      return NextResponse.json(
        { success: false, error: 'All fields marked with * are required.' },
        { status: 400 }
      );
    }

    const conn = await dbConnect();
    if (conn) {
      const existing = await Employee.findOne({ id });
      if (existing) {
        return NextResponse.json(
          { success: false, error: `Employee ID ${id} already exists.` },
          { status: 400 }
        );
      }
      const newEmp = await Employee.create({ id, idnum, name, employer, role, dept });
      return NextResponse.json({ success: true, source: 'mongodb', data: newEmp }, { status: 201 });
    }

    // Memory fallback
    try {
      const newEmp = createMemoryEmployee({ id, idnum, name, employer, role, dept });
      return NextResponse.json({ success: true, source: 'memory', data: newEmp }, { status: 201 });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating employee';
      return NextResponse.json({ success: false, error: msg }, { status: 400 });
    }
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to create employee';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

