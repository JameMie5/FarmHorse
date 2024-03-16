import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    return
  }
  try {
    const _body: any = req.body

    const _data: any = {
      method: _body.method,
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json',
      },
    }
    if (_body.method !== 'GET') {
      _data.body = _body.data
    }

    if (req.headers.authorization) {
      _data.headers.Authorization = req.headers.authorization
    }

    // Use the token in your fetch request
    const externalApiResponse = await fetch(`${process.env.API_URL}${_body.path}`, _data)
    if (!externalApiResponse.ok) {
      // Handle the case where the external API returns an error
      const errorData = await externalApiResponse.json()
      res.status(externalApiResponse.status).json({ error: errorData.message || 'Error during create book' })
      return
    }

    // Handle the external API response data
    const responseData = await externalApiResponse.json()
    res.status(200).json({
      statusCode: 200,
      message: 'successful',
      data: responseData,
    })
  } catch (error: any) {
    console.log('catch', error)
    // Generic error handling
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}
