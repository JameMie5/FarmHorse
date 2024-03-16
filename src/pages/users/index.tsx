import MainLayout from '@/layouts/main'
import React, { useEffect, useState } from 'react'
import { type IResponse, defaultResponse, IFetchData } from '@/types/response'
import { fetchData } from '@/utils/fetchData'
import { useSession } from 'next-auth/react'
import { IUser, defaultUser } from '@/types/user'
import Image from 'next/image'
import Swal from 'sweetalert2'
import router from 'next/router'
import { useRouter } from 'next/router'
import LoginLayout from '@/layouts/login'

import { useTranslations } from 'next-intl'
interface IFormData {
  id: number
  fname: string
  lname: string
  mobile_no: string
  external_no: string
  avatar_image: string
  gemail_for_2fa: string
  line_for_2fa: string
  fb_for_2fa: string
  login_name: string
  default_page_link: string
  allow_login_flag: boolean
  must_chang_password_flag: boolean
  must_use_2fa: boolean
  login_flag: boolean
  login_status: string
  login_false_disable: number
  change_pass_every_days: number
  group_id: number
}
interface IFormDataChange {
  id: number
  npassword: string
  rpassword: string
  must_change_password_flag: boolean
}

const Users = (): React.JSX.Element => {
  const session: any = useSession()
  const [response, setResponse] = useState<IResponse | { message: string; status: string }>(defaultResponse)
  const [formData, setFormData] = useState<IFormData>({
    id: 0,
    fname: '',
    lname: '',
    mobile_no: '',
    external_no: '',
    avatar_image: '',
    gemail_for_2fa: '',
    line_for_2fa: '',
    fb_for_2fa: '',
    login_name: '',
    default_page_link: '',
    allow_login_flag: true,
    must_chang_password_flag: true,
    must_use_2fa: true,
    login_flag: true,
    login_status: '',
    login_false_disable: 0,
    change_pass_every_days: 0,
    group_id: 0,
  })
  const [formDataChange, setFormDataChange] = useState<IFormDataChange>({
    id: 0,
    npassword: '',
    rpassword: '',
    must_change_password_flag: true,
  })
  const updateField = (e: any, field: string) => {
    setFormData({
      ...formData,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    })
  }
  const updateFieldChange = (e: any, field: string) => {
    setFormDataChange({
      ...formDataChange,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    })
    console.log('formDataChange:', formDataChange)
  }
  const router: any = useRouter()

  const [showPassword, setShowPassword] = useState({
    npassword: false,
    rpassword: false,
  })

  const sendPassword = async (userId: number): Promise<void> => {
    const _res: IFetchData = await fetchData(
      '/Security/ResetPassword',
      'POST',
      {
        id: userId,
        npassword: formDataChange.npassword,
        rpassword: formDataChange.rpassword,
        must_change_password_flag: true,
      },
      session.data.accessToken
    )

    console.log('%cindex.tsx line:48 _res::::::::::::::', 'color: #007acc;', _res)
    if (_res.statusCode === 200 && _res.data.data.err == 'N') {
      Swal.fire({
        title: _res.data.data.title,
        text: _res.data.data.msg,
        icon: _res.data.data.icon,
      })
      router.push('/users')
    } else {
      Swal.fire({
        title: _res.data.data.title,
        text: _res.data.data.msg,
        icon: _res.data.data.icon,
      })
    }
  }

  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined)
  const [selectedLogin_name, setSelectedLogin_name] = useState<string | undefined>(undefined)

  const showUserData = (userId: number, login_name: string) => {
    setSelectedUserId(userId)
    setSelectedLogin_name(login_name)
  }
  const showrepassUserData = (userId: number, login_name: string) => {
    setSelectedUserId(userId)
    setSelectedLogin_name(login_name)
  }
  const [selectedLogin_names, setSelectedLogin_names] = useState<string | undefined>(undefined)
  const [selectedFname, setSelectedFname] = useState<string | undefined>(undefined)
  const [selectedLname, setSelectedLname] = useState<string | undefined>(undefined)
  const [selectedMobileNo, setSelectedMobileNo] = useState<string | undefined>(undefined)
  const showEditUserData = (userId: number, login_name: string, fname: string, lname: string, mobile_no: string) => {
    setSelectedUserId(userId)
    setSelectedLogin_names(login_name)
    setSelectedFname(fname)
    setSelectedLname(lname)
    setSelectedMobileNo(mobile_no)
  }
  const deleteUser = async (userId: number) => {
    try {
      const _res: IFetchData = await fetchData(
        `/Security/DeleteUserById/`,
        'POST',
        {
          id: userId,
        },
        session?.data?.accessToken
      )

      if (_res.statusCode === 200) {
        const responseData = _res.data?.data

        if (responseData && responseData.err === 'N') {
          Swal.fire({
            title: responseData.title,
            text: responseData.msg,
            icon: responseData.icon,
          })
          getUserList()
        } else {
          Swal.fire({
            title: 'Error',
            text: 'An error occurred',
            icon: 'error',
          })
        }
      }
    } catch (error) {
      console.error('Error during deleteUser:', error)
      Swal.fire({
        title: 'Error',
        text: 'An error occurred',
        icon: 'error',
      })
    }
  }
  const editUser = async (userId: number) => {
    const _res: IFetchData = await fetchData(
      '/Security/UserById',
      'POST',
      {
        id: userId,
        fname: selectedFname,
        lname: selectedLname,
        mobile_no: selectedMobileNo,
        external_no: '',
        avatar_image: '',
        gemail_for_2fa: '',
        line_for_2fa: '',
        fb_for_2fa: '',
        login_name: selectedLogin_names,
        default_page_link: '',
        allow_login_flag: true,
        must_chang_password_flag: true,
        must_use_2fa: true,
        login_flag: true,
        login_status: '',
        login_false_disable: 0,
        change_pass_every_days: 0,
        group_id: 0,
      },
      session?.data?.accessToken
    )

    console.log('%cindex.tsx line:48 editUser::::::::::::::', 'color: #007acc;', _res)

    if (_res.statusCode === 200 && _res.data.data.err === 'N') {
      setResponse(_res.data)
      Swal.fire({
        title: _res.data.data.title,
        text: _res.data.data.msg,
        icon: _res.data.data.icon,
      })

      getUserList()
    } else {
      Swal.fire({
        title: _res.data.data.title,
        text: _res.data.data.msg,
        icon: _res.data.data.icon,
      })
    }
  }

  const sendUser = async () => {
    const _res: IFetchData = await fetchData(
      '/Security/UserById',
      'POST',
      {
        id: 0,
        fname: formData.fname,
        lname: formData.lname,
        mobile_no: '',
        external_no: '',
        avatar_image: '',
        gemail_for_2fa: '',
        line_for_2fa: '',
        fb_for_2fa: '',
        login_name: formData.login_name,
        default_page_link: '',
        allow_login_flag: true,
        must_chang_password_flag: true,
        must_use_2fa: true,
        login_flag: true,
        login_status: 'Online',
        login_false_disable: 0,
        change_pass_every_days: 0,
        group_id: 0,
      },
      session?.data?.accessToken
    )
    console.log('%cindex.tsx line:48 sendUser::::::::::::::', 'color: #007acc;', _res)
    if (_res.statusCode === 200 && _res.data.data.err == 'N') {
      setResponse(_res.data)
      Swal.fire({
        title: _res.data.data.title,
        text: _res.data.data.msg,
        icon: _res.data.data.icon,
      })
      router.push('/users')
      getUserList()
    } else {
      Swal.fire({
        title: _res.data.data.title,
        text: _res.data.data.msg,
        icon: _res.data.data.icon,
      })
    }
  }

  const [userList, setUserList] = useState<IUser[]>([])
  const u = useTranslations('TEXT')
  const b = useTranslations('BUTTON')
  const s = useTranslations('TEXT-INPUT')

  const getUserList = async () => {
    const _res: IFetchData = await fetchData(
      '/Security/SearchUser',
      'GET',
      {
        search_text: '',
      },
      session?.data?.accessToken
    )
    console.log('%cindex.tsx line:19 _res ::::::::::::::::::::::', 'color: #007acc;', _res?.data?.data)
    if (_res.statusCode === 200) {
      setUserList(_res.data.data)
    }
  }

  useEffect(() => {
    getUserList()
  }, [session])

  return (
    <React.Fragment>
      <div className="row _rounded5px bg-white my-3 _shadow">
        <div className="col-12">
          <div className="row p-3">
            <div className="col-12 mb-2">
              <h5 className="text-dark">{u('Searchfilter')}</h5>
            </div>
            <div className="col-12">
              <div className="row">
                <div className="col-lg-4 col-md-4 col-12 mb-lg-0 mb-md-0 mb-3">
                  <select className="form-select _border_form" aria-label="Default select example">
                    <option selected>{s('Selectrole')}</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
                <div className="col-lg-4 col-md-4 col-12 mb-lg-0 mb-md-0 mb-3">
                  <select className="form-select _border_form" aria-label="Default select example">
                    <option selected>{s('Selectplan')}</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
                <div className="col-lg-4 col-md-4 col-12 mb-0">
                  <select className="form-select _border_form" aria-label="Default select example">
                    <option selected>{s('Selectstatus')}</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 px-0">
              <hr className="my-lg-2 my-md-0 my-0" />
            </div>
          </div>
          <div className="row p-3">
            <div className="col-12 ">
              <div className="row">
                <div className="col-2 mb-lg-0 mb-md-0 mb-3">
                  <select className="form-select _border_form _w_perpage" aria-label="Default select example">
                    <option selected>10</option>
                    <option value="1">25</option>
                    <option value="2">50</option>
                    <option value="3">100</option>
                  </select>
                </div>
                <div className="col-lg-10 col-md-10 col-12 d-flex justify-content-end flex-lg-row flex-md-row flex-column ">
                  <div className="mb-lg-0 mb-md-0 mb-3">
                    <input type="text" className="form-control _w_search" placeholder={s('Search')} />
                  </div>
                  <div className="d-flex justify-content-between">
                    <button className="btn _btn_export px-lg-4 px-md-4 mx-0 ms-lg-3 ms-md-3 ms-0 _w_100 me-lg-0 me-md-0 me-1">{b('Export')}</button>
                    <button className="btn _btn_main px-lg-4 px-md-4 mx-0 ms-lg-3 ms-md-3 ms-0 _w_100 ms-lg-0 ms-md-0 ms-1" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                      {b('Adduser')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 px-0">
              <hr className="my-lg-2 my-md-0 my-0" />
            </div>
          </div>
          <div className="row mb-3 mt-lg-0 mt-md-3 mt-3">
            <div className="col-12 mb-2">
              <table className="table table-mobile-sided table-mobile-responsive mb-0">
                <thead>
                  <tr>
                    <th scope="col">
                      <small>{u('User')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('Userlogin')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('Tel')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('Status')}</small>
                    </th>
                    <th scope="col" className="_w_table_action">
                      <small>{u('Action')}</small>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userList &&
                    userList.map((item: IUser, index: number) => (
                      <React.Fragment key={index}>
                        <tr>
                          <td data-content="USER">
                            <div className="d-flex flex-row align-items-center">
                              <Image className="rounded-circle me-2" src="/img/profile-demo.png" width={40} height={40} alt="user-demo" />
                              <div>
                                <small className="pe-3">{item.fname}</small>
                                <small>{item.lname}</small>
                              </div>
                            </div>
                          </td>
                          <td data-content="USER LOGIN">
                            <small>{item.login_name}</small>
                          </td>
                          <td data-content="TEL">
                            <small>{item.mobile_no}</small>
                          </td>
                          <td data-content="STATUS">
                            <span className="badge">
                              <small>{item.login_status}</small>
                            </span>
                          </td>
                          <td data-content="ACTIONS">
                            <div className="text-end">
                              <i className="pe-3 fa-solid fa-pen-to-square" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRighte" aria-controls="offcanvasRight" onClick={() => showEditUserData(item?.objid_sam_user || 0, item?.login_name || '', item?.fname || '', item?.lname || '', item?.mobile_no || '')}></i>
                              <i className="pe-3 fa-solid fa-trash" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRightd" aria-controls="offcanvasRight" onClick={() => showUserData(item?.objid_sam_user || 0, item?.login_name || '')}></i>
                              <i className="fa-solid fa-key" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRightk" onClick={() => showrepassUserData(item?.objid_sam_user || 0, item?.login_name || '')}></i>
                            </div>
                            {/* delete */}
                            <div className="offcanvas offcanvas-end" id="offcanvasRightd" aria-labelledby="offcanvasRightLabel">
                              <div className="offcanvas-header">
                                <h5 id="offcanvasRightLabel" className="_text_secondary">
                                  Delete User
                                </h5>
                                <div className="px-2 py-1 _btn_export _rounded5px _cursor_pointer" data-bs-dismiss="offcanvas" aria-label="Close">
                                  <i className="fa-solid fa-xmark"></i>
                                </div>
                              </div>
                              <div className="offcanvas-body">
                                <div className="row">
                                  <div className="col-12 mb-2">
                                    <label htmlFor="Username" className="form-label mb-1"></label>
                                    <div className="text-center">
                                      <p>USER LOGIN: {selectedLogin_name}</p>
                                    </div>

                                    <div className="">
                                      <button className="btn btn-danger" onClick={() => deleteUser(Number(selectedUserId))}>
                                        delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <div className="offcanvas offcanvas-end" id="offcanvasRightk" aria-labelledby="offcanvasRightLabel">
                          <div className="offcanvas-header">
                            <h5 id="offcanvasRightLabel" className="_text_secondary">
                              Change Password
                            </h5>
                            <div className="px-2 py-1 _btn_export _rounded5px _cursor_pointer" data-bs-dismiss="offcanvas" aria-label="Close">
                              <i className="fa-solid fa-xmark"></i>
                            </div>
                          </div>
                          <div className="offcanvas-body">
                            <div className="row">
                              <div className="col-12 mb-2" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                <input className={`form-control form-control-lg _border_input`} name="login_name" placeholder="username" value={selectedLogin_name} style={{ paddingRight: '40px' }} />
                              </div>
                              <div className="col-12 mb-2" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                <input
                                  type={showPassword.npassword ? 'text' : 'password'}
                                  className={`form-control form-control-lg _border_input`}
                                  name="npassword"
                                  placeholder="new password"
                                  onChange={(e) => {
                                    updateFieldChange(e, 'npassword')
                                  }}
                                  style={{ paddingRight: '40px' }}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword((prev) => ({ ...prev, npassword: !prev.npassword }))}
                                  className="_btn_eye"
                                  style={{
                                    position: 'absolute',
                                    right: '20px',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                  }}>
                                  {showPassword.npassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                                </button>
                              </div>
                              <div className="col-12 mb-2" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                <input
                                  type={showPassword.rpassword ? 'text' : 'password'}
                                  className={`form-control form-control-lg _border_input`}
                                  name="rpassword"
                                  placeholder="confirm password"
                                  onChange={(e) => {
                                    updateFieldChange(e, 'rpassword')
                                  }}
                                  style={{ paddingRight: '40px' }}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword((prev) => ({ ...prev, rpassword: !prev.rpassword }))}
                                  className="_btn_eye"
                                  style={{
                                    position: 'absolute',
                                    right: '20px',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                  }}>
                                  {showPassword.rpassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                                </button>
                              </div>
                              <div className="col-12 mt-2">
                                <button type="button" className="btn _btn_main form-control btn-lg" onClick={() => sendPassword(Number(selectedUserId))} data-bs-dismiss="offcanvas">
                                  <small>Change Password </small>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* edit */}
                        <div className="offcanvas offcanvas-end" id="offcanvasRighte" aria-labelledby="offcanvasRightLabel">
                          <div className="offcanvas-header">
                            <h5 id="offcanvasRightLabel" className="_text_secondary">
                              Edit User
                            </h5>
                            <div className="px-2 py-1 _btn_export _rounded5px _cursor_pointer" data-bs-dismiss="offcanvas" aria-label="Close">
                              <i className="fa-solid fa-xmark"></i>
                            </div>
                          </div>
                          {selectedUserId}
                          <div className="offcanvas-body">
                            <div className="row">
                              <div className="col-12 mb-2 ">
                                <label htmlFor="Username" className="form-label mb-1"></label>
                                <p className="mt-1">Username</p>
                                <input type="text" className="form-control mt-1" id="Username" name="login_name" placeholder="Username" value={selectedLogin_names} onChange={(e) => setSelectedLogin_names(e.target.value)} />
                                <p className="mt-1">First Name</p>

                                <input type="text" className="form-control mt-1" id="FirstName" name="fname" placeholder="First Name" value={selectedFname} onChange={(e) => setSelectedFname(e.target.value)} />
                                <p className="mt-1">Last Name</p>

                                <input type="text" className="form-control mt-1" id="LastName" name="lname" placeholder="Last Name" value={selectedLname} onChange={(e) => setSelectedLname(e.target.value)} />
                                <p>TEL</p>

                                <input type="text" className="form-control mt-1" id="MobileNo" name="mobile_no" placeholder="Mobile No" value={selectedMobileNo} onChange={(e) => setSelectedMobileNo(e.target.value)} />

                                <div className="mt-2">
                                  <button className=" btn _btn_main px-3 me-2" onClick={() => editUser(Number(selectedUserId))}>
                                    save
                                  </button>
                                  <button className="btn _btn_export px-3" data-bs-dismiss="offcanvas">
                                    <small>Cancel</small>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* add */}
                        <div className="offcanvas offcanvas-end" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                          <div className="offcanvas-header">
                            <h5 id="offcanvasRightLabel" className="_text_secondary">
                              Add User
                            </h5>
                            <div className="px-2 py-1 _btn_export _rounded5px _cursor_pointer" data-bs-dismiss="offcanvas" aria-label="Close">
                              <i className="fa-solid fa-xmark"></i>
                            </div>
                          </div>
                          <div className="offcanvas-body">
                            <div className="row">
                              <div className="col-12 mb-2">
                                <label htmlFor="Username" className="form-label mb-1">
                                  <small className="_text_secondary">Username</small>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="Username"
                                  name="login_name"
                                  placeholder="Username"
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    updateField(e, 'login_name')
                                  }}
                                />
                              </div>
                              <div className="col-12 mb-2">
                                <label htmlFor="FirstName" className="form-label mb-1">
                                  <small className="_text_secondary">First Name</small>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="FirstName"
                                  name="fname"
                                  placeholder="First Name"
                                  onChange={(e: any) => {
                                    updateField(e, 'fname')
                                  }}
                                />
                              </div>
                              <div className="col-12 mb-2">
                                <label htmlFor="LastName" className="form-label mb-1">
                                  <small className="_text_secondary">Last Name</small>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="LastName"
                                  name="lname"
                                  placeholder="Last Name"
                                  onChange={(e: any) => {
                                    updateField(e, 'lname')
                                  }}
                                />
                              </div>
                              <div className="col-12 mb-2 mt-2">
                                <button
                                  className="btn _btn_main px-3 me-2"
                                  onClick={() => {
                                    sendUser()
                                  }}>
                                  <small>Submit</small>
                                </button>
                                <button className="btn _btn_export px-3" data-bs-dismiss="offcanvas">
                                  <small>Cancel</small>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
Users.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>
}
export default Users
export { getStaticProps } from '@/utils/getStaticProps'
