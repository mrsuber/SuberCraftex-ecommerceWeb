import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth/verify-auth'
import { AssignmentError, assignJob } from '@/lib/services/job-assignment'

/**
 * POST /api/bookings/[id]/assign — { assigneeId: string | null }
 * Admins assign anyone who does jobs; technicians and tailors take a free job or hand theirs back.
 * The response lists other jobs of that person that overlap this one.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user } = await verifyAuth(request)
  if (!user) return NextResponse.json({ error: 'Please sign in' }, { status: 401 })
  try {
    const body = await request.json().catch(() => ({}))
    const assigneeId = typeof body.assigneeId === 'string' && body.assigneeId ? body.assigneeId : null
    const result = await assignJob((await params).id, assigneeId, user)
    return NextResponse.json({
      assignedTo: result.assignee ? { id: result.assignee.id, name: result.assignee.fullName ?? result.assignee.email } : null,
      clashes: result.clashes,
    })
  } catch (error) {
    if (error instanceof AssignmentError) return NextResponse.json({ error: error.message }, { status: 400 })
    console.error('Error assigning job:', error)
    return NextResponse.json({ error: 'Failed to assign the job' }, { status: 500 })
  }
}
