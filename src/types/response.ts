import type { IUser } from '@/types/user'

export interface IResponse {
  message: string
  status: string
  user?: IUser
}
export const defaultResponse = {
  message: 'string',
  status: 'string',
}
export interface IFetchData {
  [x: string]: any
  statusCode: number
  message?: string
  data: any
}
