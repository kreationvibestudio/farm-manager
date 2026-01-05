import { NextRequest, NextResponse } from 'next/server'
import * as budgetsAPI from '@/lib/api/financial/budgets'
import { requireAuth } from '@/lib/auth/api-auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) {
      return authResult // Unauthorized response
    }

    const categories = await budgetsAPI.getBudgetCategories()

    // Add caching headers for better performance (5 minutes cache)
    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'private, max-age=300, stale-while-revalidate=600',
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
