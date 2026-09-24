import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Incident from '@/models/Incident';
import { INITIAL_INCIDENTS } from '@/lib/seedData';
import { getMemoryIncidents, createMemoryIncident } from '@/lib/memoryStore';

export async function GET() {
  try {
    const conn = await dbConnect();
    if (conn) {
      let incidents = await Incident.find({}).sort({ date: -1 });
      if (incidents.length === 0) {
        await Incident.insertMany(INITIAL_INCIDENTS);
        incidents = await Incident.find({}).sort({ date: -1 });
      }
      return NextResponse.json({ success: true, source: 'mongodb', data: incidents });
    }
  } catch (error: unknown) {
    console.warn('MongoDB query error, returning memory store:', error);
  }

  return NextResponse.json({ success: true, source: 'memory', data: getMemoryIncidents() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { empId, date, type, category, shift, location, equipment, desc } = body;

    if (!empId || !date || !type || !category || !shift || !location || !equipment || !desc) {
      return NextResponse.json(
        { success: false, error: 'Please fill all mandatory incident fields (*).' },
        { status: 400 }
      );
    }

    const conn = await dbConnect();
    let generatedId = body.id;

    if (conn) {
      if (!generatedId) {
        const count = await Incident.countDocuments();
        generatedId = `INC-${String(count + 1).padStart(3, '0')}`;
      }
      const incidentData = {
        ...body,
        id: generatedId,
        status: body.status || 'Opened',
        injury: body.injury || 'None',
        docs: body.docs || [],
      };

      const newInc = await Incident.create(incidentData);
      return NextResponse.json({ success: true, source: 'mongodb', data: newInc }, { status: 201 });
    }

    // Memory fallback
    const newInc = createMemoryIncident(body);
    return NextResponse.json({ success: true, source: 'memory', data: newInc }, { status: 201 });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to save incident';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

