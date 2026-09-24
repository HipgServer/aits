import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Employee from '@/models/Employee';
import {
  getMemoryEmployeeById,
  updateMemoryEmployee,
  deleteMemoryEmployee,
} from '@/lib/memoryStore';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conn = await dbConnect();
    if (conn) {
      const emp = await Employee.findOne({ id });
      if (!emp) {
        return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, source: 'mongodb', data: emp });
    }

    const memoryEmp = getMemoryEmployeeById(id);
    if (!memoryEmp) {
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, source: 'memory', data: memoryEmp });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to fetch employee';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const conn = await dbConnect();
    if (conn) {
      const updated = await Employee.findOneAndUpdate({ id }, body, { new: true });
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, source: 'mongodb', data: updated });
    }

    const updated = updateMemoryEmployee(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, source: 'memory', data: updated });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to update employee';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conn = await dbConnect();
    if (conn) {
      const res = await Employee.deleteOne({ id });
      if (res.deletedCount === 0) {
        return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, source: 'mongodb', message: 'Employee deleted' });
    }

    const deleted = deleteMemoryEmployee(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, source: 'memory', message: 'Employee deleted' });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to delete employee';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

