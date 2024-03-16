import { useRouter } from 'next/router'
import { fetchData } from '@/utils/fetchData'
import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useSession } from 'next-auth/react'
import Swal from 'sweetalert2'
import { IUser, defaultUser } from '@/types/user'
import { type IResponse, defaultResponse, IFetchData } from '@/types/response'

interface IProfile {
  allow_login_flag: boolean
  avatar_image: string
  change_pass_every_days: Number
  count_login_false: Number
  default_page_link: string
  external_no: string
  fb_for_2fa: string
  fname: string
  gemail_for_2fa: string
  group_id: Number
  group_name: string
  id: Number
  last_login: string
  last_logout: string
  line_for_2fa: string
  lname: string
  login_false_disable: Number
  login_flag: boolean
  login_name: string
  login_status: string
  mobile_no: string
  must_change_password_flag: boolean
  must_use_2fa: boolean
}
const Profile = (): React.JSX.Element => {
  const router = useRouter()
  const session: any = useSession()
  const [response, setResponse] = useState<IResponse>(defaultResponse)
  const [userData, setUserData] = useState<any>(null)
  const [formData, setFormData] = useState<IProfile>({
    allow_login_flag: false,
    avatar_image: '',
    change_pass_every_days: 0,
    count_login_false: 0,
    default_page_link: '',
    external_no: '',
    fb_for_2fa: '',
    fname: '',
    gemail_for_2fa: '',
    group_id: 0,
    group_name: '',
    id: 0,
    last_login: '0001-01-01T00:00:00',
    last_logout: '0001-01-01T00:00:00',
    line_for_2fa: '',
    lname: '',
    login_false_disable: 0,
    login_flag: false,
    login_name: '',
    login_status: '',
    mobile_no: '',
    must_change_password_flag: false,
    must_use_2fa: false,
  })

  useEffect(() => {
    showinfoprofile()
  }, [session])
  const [userList, setUserList] = useState<IUser>()

  const showinfoprofile = async () => {
    // GET
    const data: IFetchData = await fetchData('/Security/MyInfo?contact_id=1', 'GET', {}, session?.data?.accessToken)
    console.log('abc', data)
    if (data.statusCode === 200) {
      console.log(userList)
      setUserList(data.data.data)
    } else {
      console.error('Error fetching user data:', data.error)
    }
  }

  return (
    <div className="offcanvas offcanvas-end _b_offcanvas " id="offcanvasProfile" aria-labelledby="offcanvasProfileLabel">
      <div className="offcanvas-header">
        <h5 id="offcanvasRightLabel" className="_text_secondary">
          Profile
        </h5>
        <div className="px-2 py-1 _btn_export _rounded5px _cursor_pointer" data-bs-dismiss="offcanvas" aria-label="Close">
          <i className="fa-solid fa-xmark"></i>
        </div>
      </div>
     

      <div className="d-flex justify-content-center row"> 
        {userList && (
          <div>
            <div>
            <img className="rounded-circle _imageds_login" src={userList.avatar_image || '/img/profile-demo.png'} alt="user-demo" data-bs-toggle="dropdown" aria-expanded="false" />
            </div>
            <div className="row">
              <div className="col-12 mb-2 mt-3">
                <label htmlFor="Username" className="form-label mb-1">
                  <small className="_text_secondary">Username</small>
                </label>
                <input type="text" className="form-control" id="Username" name="login_name" value={`${userList.login_name}`} readOnly />
              </div>

              <div className="col-12 mb-2 mt-3">
                <label htmlFor="FirstName" className="form-label mb-1">
                  <small className="_text_secondary">First Name</small>
                </label>
                <input type="text" className="form-control" id="First Name" name="fname" value={`${userList.fname}`} readOnly />
              </div>

              <div className="col-12 mb-2 mt-3">
                <label htmlFor="LastName" className="form-label mb-1">
                  <small className="_text_secondary">Last Name</small>
                </label>
                <input type="text" className="form-control" id="Last Name" name="lname" value={`${userList.lname}`} readOnly />
              </div>

              <div className="col-12 mb-2 mt-3">
                <label htmlFor="FirstName" className="form-label mb-1">
                  <small className="_text_secondary">Tel</small>
                </label>
                <input type="text" className="form-control" id="Username" name="login_name" value={`${userList.mobile_no}`} readOnly />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
