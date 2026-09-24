import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Incident from '@/models/Incident';
import {
  getMemoryIncidentById,
  updateMemoryIncident,
  deleteMemoryIncident,
} from '@/lib/memoryStore';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conn = await dbConnect();
    if (conn) {
      const inc = await Incident.findOne({ id });
      if (!inc) {
        return NextResponse.json({ success: false, error: 'Incident not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, source: 'mongodb', data: inc });
    }

    const memoryInc = getMemoryIncidentById(id);
    if (!memoryInc) {
      return NextResponse.json({ success: false, error: 'Incident not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, source: 'memory', data: memoryInc });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to fetch incident';
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
      const updated = await Incident.findOneAndUpdate({ id }, body, { new: true });
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Incident record not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, source: 'mongodb', data: updated });
    }

    const updated = updateMemoryIncident(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Incident record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, source: 'memory', data: updated });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to update incident';
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
      const res = await Incident.deleteOne({ id });
      if (res.deletedCount === 0) {
        return NextResponse.json({ success: false, error: 'Incident record not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, source: 'mongodb', message: 'Incident purged' });
    }

    const deleted = deleteMemoryIncident(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Incident record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, source: 'memory', message: 'Incident purged' });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to delete incident';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

