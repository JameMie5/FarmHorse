export interface IUser {
  [x: string]: any
  gemail_for_2fa: ReactNode
  all_recs: number
  allow_login_flag: boolean
  avatar_image: string
  external_no: string
  fname: string
  group_name: string
  lname: string
  login_name: string
  login_status: string
  mobile_no: string
  objid_sam_user: number
  row_id: number
}
export const defaultUser = {
  all_recs: 1,
  allow_login_flag: true,
  avatar_image: '',
  external_no: '',
  fname: '',
  group_name: '',
  lname: '',
  login_name: '',
  login_status: '',
  mobile_no: '',
  objid_sam_user: 1,
  row_id: 1,
}
