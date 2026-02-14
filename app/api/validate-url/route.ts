import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { url } = await req.json()

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: '*/*',
      },
      redirect: 'follow',
    })

    if (response.ok) {
      return NextResponse.json({ valid: true })
    }

    return NextResponse.json({ valid: false })
  } catch {
    return NextResponse.json({ valid: false })
  }
}
