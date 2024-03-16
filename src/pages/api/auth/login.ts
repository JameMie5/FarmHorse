import { type NextApiRequest, type NextApiResponse } from 'next'
import fetch from 'node-fetch'

interface LoginResponse {
  statusCode: number
  data: {
    access_token: string
    payload: {
      id: string
    }
    permissions: string[]
    expires_at: string
  }
  message: string
}

export async function restLogin(phoneNo: string, password: string) {
  const endpoint = `${process.env.API_URL}/Authenticate/Login`
  // /api/v2/authentication/login
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNo,
        password,
        remember_me: true,
      }),
    })

    const data = (await response.json()) as LoginResponse

    if (!response.ok) {
      // Handle non-2xx responses
      throw new Error(data.message || 'Error logging in')
    }

    return data
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authen = await restLogin(req.body.phoneNo, req.body.password)
    res.status(200).json(authen)
  } catch (error: any) {}
}
