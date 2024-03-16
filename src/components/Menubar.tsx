import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import MenuSidebar from '@/components/Menu_sidebar'
import LoginLayout from '@/layouts/login'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { type IResponse, defaultResponse, IFetchData } from '@/types/response'

import { fetchData } from '@/utils/fetchData'
import Swal from 'sweetalert2'
import ChangePass from '@/pages/change_pass'
import Buttonlanguage from './buttonlanguage'
import { useTranslations } from 'next-intl'
import Profile from '@/pages/Profile'
import Breadcrumb from './breadcrumb'
import { IUser } from '@/types/user'

interface IFormData {
  cpassword: string
  npassword: string
  rpassword: string
}
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
const Menubar = (): React.JSX.Element => {
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

  const p = useTranslations('MENUBAR')

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
    <>
      <div className="row _rounded5px bg-white py-2 mt-3 mb-lg-3 p-3 mb-md-0 mb-0 _shadow mx-0 sticky-top">
        <div className="col-12 d-flex justify-content-between py-1">
          <div className="d-flex align-items-center _hamberger">
            <h4 className="d-lg-none d-md-block d-block" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample">
              <i className="fa-solid fa-bars"></i>
            </h4>
          </div>
          <div className="d-flex justify-content-end">
            <div className="d-flex mt-2 mx-3">
              <div className="Buttonlanguage">
                <Buttonlanguage />
              </div>
            </div>
            {(userList && <img className="rounded-circle _cursor_pointer _img_profile" src={userList.avatar_image} width={40} height={40} alt="user-demo" data-bs-toggle="dropdown" aria-expanded="false" />) || <img className="rounded-circle _cursor_pointer _img_profile" src="/img/profile-demo.png" width={40} height={40} alt="user-demo" data-bs-toggle="dropdown" aria-expanded="false" />}
            <ul className="dropdown-menu dropdown-menu-end _img_profile ">
              <li>
                <button className="dropdown-item" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasProfile" aria-controls="offcanvasProfile">
                  <i className="fa-solid fa-user pe-2"></i>
                  {p('Profile')}
                </button>
              </li>
              <li>
                <button className="dropdown-item" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRighta" aria-controls="offcanvasRight">
                  <i className="fa-solid fa-unlock pe-2"></i>
                  {p('Chang Password')}
                </button>
              </li>

              <li>
                <hr className="my-2" />
              </li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  type="button"
                  onClick={() => {
                    signOut({ callbackUrl: '/login' })
                  }}>
                  <i className="fa-solid fa-right-from-bracket pe-2"></i>
                  {p('Logout')}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <ChangePass />
      <Profile />

      <div className="offcanvas offcanvas-start _w_offcanvas" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div className="offcanvas-header">
          <Link href="/">
            <Image src="/vercel.svg" width={0} height={0} style={{ width: '60%', height: 'auto' }} alt="Logo" />
          </Link>
          <div className="px-2 py-1 _btn_export _rounded5px _cursor_pointer" data-bs-dismiss="offcanvas" aria-label="Close">
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>
        <div className="offcanvas-body">
          <MenuSidebar />
        </div>
      </div>
    </>
  )
}

export default Menubar
export { getStaticProps } from '@/utils/getStaticProps'
function setUserList(data: any) {
  throw new Error('Function not implemented.')
}
