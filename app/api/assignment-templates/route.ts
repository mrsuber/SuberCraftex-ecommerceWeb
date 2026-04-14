import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, requireAdmin } from '@/lib/auth/verify-auth'

// GET - List all assignment templates (curriculum)
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)

    // Only admin, tailor (mentor), technician can view templates
    if (!auth.user || !['admin', 'tailor', 'technician'].includes(auth.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level')
    const category = searchParams.get('category')
    const serviceTrack = searchParams.get('serviceTrack')

    const where: any = { isActive: true }

    if (level) {
      where.level = parseInt(level)
    }

    if (category) {
      where.category = category
    }

    // Filter by service track (tailoring, device_repair, etc.)
    if (serviceTrack) {
      where.serviceTrack = serviceTrack
    }

    const templates = await db.assignmentTemplate.findMany({
      where,
      orderBy: [{ level: 'asc' }, { orderIndex: 'asc' }],
    })

    // Group by level and module
    const grouped = templates.reduce((acc: any, template) => {
      const levelKey = `Level ${template.level}`
      if (!acc[levelKey]) {
        acc[levelKey] = {}
      }

      const moduleKey = `Module ${template.moduleNumber}`
      if (!acc[levelKey][moduleKey]) {
        acc[levelKey][moduleKey] = []
      }

      acc[levelKey][moduleKey].push({
        id: template.id,
        assignmentNumber: template.assignmentNumber,
        title: template.title,
        description: template.description,
        difficulty: template.difficulty,
        estimatedHours: template.estimatedHours,
        category: template.category,
        subcategory: template.subcategory,
        skills: template.skills,
      })

      return acc
    }, {})

    // Build dynamic level summary
    const byLevel: Record<string, number> = {}
    const maxLevel = templates.length > 0 ? Math.max(...templates.map(t => t.level)) : 0
    for (let i = 1; i <= maxLevel; i++) {
      const count = templates.filter((t) => t.level === i).length
      if (count > 0) {
        byLevel[`level${i}`] = count
      }
    }

    return NextResponse.json({
      templates,
      grouped,
      summary: {
        total: templates.length,
        byLevel,
      },
    })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}
