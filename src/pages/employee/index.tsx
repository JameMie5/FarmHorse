import MainLayout from '@/layouts/main'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { type IResponse, defaultResponse, IFetchData } from '@/types/response'
import { fetchData } from '@/utils/fetchData'
import { useSession } from 'next-auth/react'
import { IUser, defaultUser } from '@/types/user'
import Image from 'next/image'
import Swal from 'sweetalert2'
import router from 'next/router'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Calendar from 'react-calendar'
import Breadcrumb from '@/components/breadcrumb'
import axios from 'axios'

interface IFormData {
  contact_id: number
  objid: number
  employee_code: string
  image_profile: string
  fname: string
  lname: string
  nickname: string
  background: string
  sex: string
  phone_no: string
  email: string
  birthdate: string
  personal_id: string
  start_job_date: string
  stop_job_date: string
  address: string
  province: string
  zipcode: string
  position: string
  employee_status: string
  image_link_key: string

  value_data: string
  cdate: string
  ldate: string
}
const Users = (): React.JSX.Element => {
  const session: any = useSession()
  const [response, setResponse] = useState<IResponse>(defaultResponse)
  const [startJobDate, setStartJobDate] = useState<Date | null>(null)
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null)
  const [stopJobDate, setStopJobDate] = useState<Date | null>(null)
  const [imageDataProfile, setImageDataProfile] = useState<string | null>(null)
  const [imageProfile, setImageProfile] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [formData, setFormData] = useState<IFormData>({
    contact_id: 0,
    objid: 0,
    employee_code: '',
    image_profile: '',
    fname: '',
    lname: '',
    nickname: '',
    background: '',
    sex: '',
    phone_no: '',
    email: '',
    birthdate: '',
    personal_id: '',
    start_job_date: '',
    stop_job_date: '',
    address: '',
    province: '',
    zipcode: '',
    position: '',
    employee_status: '',
    image_link_key: '',

    value_data: '',
    cdate: '',
    ldate: '',
  })

  const [selectedProvince, setSelectedProvince] = useState<number | undefined>(undefined)
  const [selectedPosition, setSelectedPosition] = useState<string | undefined>(undefined)
  const [selectedEmployeeStatus, setSelectedEmployeeStatus] = useState<string | undefined>(undefined)

  const updateField = (e: any) => {

    if (e.target.name === 'employee_status') {
      setSelectedProvince(e.target.value);
    }

    if (e.target.name === 'employee_status') {
      setSelectedPosition(e.target.value);
    }

    if (e.target.name === 'employee_status') {
      setSelectedEmployeeStatus(e.target.value);
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    })
  }
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value))
  }
  const handleStartJobDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartJobDate(new Date(e.target.value))
  }

  const handleStopJobDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStopJobDate(new Date(e.target.value))
  }
  // GET ShowinfoProvince
  const showinfoprovince = async () => {
    const data: IFetchData = await fetchData(`/Farm/SystemValueSearch?contact_id=1&value_code=PROVINCE`, 'GET', {}, session?.data?.accessToken)
    console.log('abc', data)
    if (data.statusCode === 200) {
      console.log(ProvinceList)
      setProvinceList(data.data.data)
    } else {
      console.error('Error fetching province data:', data.error)
    }
  }
  useEffect(() => {
    showinfoprovince()
  }, [session])
  const [ProvinceList, setProvinceList] = useState<IUser>()

  // GET ShowinfoPosition
  const showinfoposition = async () => {
    const data: IFetchData = await fetchData(`/Farm/SystemValueSearch?contact_id=1&value_code=POSITION`, 'GET', {}, session?.data?.accessToken)
    console.log('abc', data)
    if (data.statusCode === 200) {
      console.log(PositionList)
      setPositionList(data.data.data)
    } else {
      console.error('Error fetching position data:', data.error)
    }
  }
  useEffect(() => {
    showinfoposition()
  }, [session])
  const [PositionList, setPositionList] = useState<IUser>()

  // GET ShowinfemStatus
  const showinfoemstatus = async () => {
    const data: IFetchData = await fetchData(`/Farm/SystemValueSearch?contact_id=1&value_code=EMPLOYEE%20STATUS`, 'GET', {}, session?.data?.accessToken)
    console.log('abc', data)
    if (data.statusCode === 200) {
      console.log(EmstatusList)
      setEmstatusList(data.data.data)
    } else {
      console.error('Error fetching EmstatusList data:', data.error)
    }
  }
  useEffect(() => {
    showinfoemstatus()
  }, [session])
  const [EmstatusList, setEmstatusList] = useState<IUser>()

  const sendEmployee = async () => {
    // POST
    console.log('imageProfile', imageProfile)
    try {
      const _res: IFetchData = await fetchData(
        '/Farm/EmployeeUpdate',
        'POST',
        {
          contact_id: 1,
          objid: 0,
          employee_code: formData.employee_code,
          image_profile: imageProfile,
          fname: formData.fname,
          lname: formData.lname,
          nickname: formData.nickname,
          background: formData.background,
          sex: formData.sex,
          phone_no: formData.phone_no,
          email: formData.email,
          birthdate: formData.birthdate,
          personal_id: formData.personal_id,
          start_job_date: formData.start_job_date,
          stop_job_date: formData.stop_job_date,
          address: formData.address,
          province: formData.province,
          zipcode: formData.zipcode,
          position: formData.position,
          employee_status: formData.employee_status,
          image_link_key: 'string',
        },
        session?.data?.accessToken
      )

      console.log('%cindex.tsx line:48 sendUser::::::::::::::', 'color: #007acc;', _res)

      if (_res.statusCode === 200 && _res.data.data.err === 'N') {
        console.log()
        setResponse(_res.data)
        Swal.fire({
          title: _res.data.data.title,
          text: _res.data.data.msg,
          icon: _res.data.data.icon,
        })
        getEmployeeList()
      } else {
        Swal.fire({
          title: _res.data.data.title,
          text: _res.data.data.msg,
          icon: _res.data.data.icon,
        })
      }
    } catch (error) {
      console.error('An error occurred:', error)
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while adding employee. Please try again.',
        icon: 'error',
      })
    }
  }

  const previewImageProfile = async (event: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData()
    const input = event.target

    if (input.files && input.files[0]) {
      const file = input.files[0]
      formData.append('file', file)

      const reader = new FileReader()

      reader.onload = async () => {
        setImageDataProfile(reader.result as string)
      }
      reader.readAsDataURL(file)
      try {
        const uploadImageProfile = await axios.post<{ data: { objid: string } }>(`${process.env.API_URL}/File/UploadFile`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        setImageProfile(`${process.env.API_URL}/File/DownloadFile/${uploadImageProfile.data.data.objid}`)
        console.log('setImageProfile', `${process.env.API_URL}/File/DownloadFile/${uploadImageProfile.data.data.objid}`)
      } catch (error) {
        console.error('Error uploading image:', error)
      }
    }
  }

  const [EmployeeList, setEmpolyeeList] = useState<IUser[]>([])
  const u = useTranslations('TEXT')
  const b = useTranslations('BUTTON')
  const s = useTranslations('TEXT-INPUT')

  const getEmployeeList = async () => {
    const data: IFetchData = await fetchData('/Farm/EmployeeSearch?contact_id=1', 'GET', {}, session?.data?.accessToken)
    console.log('%cindex.tsx line:19 _res ::::::::::::::::::::::', 'color: #007acc;', data?.data?.data)
    if (data.statusCode === 200) {
      setEmpolyeeList(data.data.data)
    }
  }
  useEffect(() => {
    getEmployeeList()
  }, [session])

  return (
    <>
      <div className="row _rounded5px bg-white my-3 _shadow">
        <div className="col-12">
          <div className="row p-3">
            <div className="col-12 mb-2">
              <h5 className="text-dark">{u('Employee')}</h5>
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
                    <button className="btn _btn_export px-lg-4 px-md-4 mx-0 ms-lg-3 ms-md-3 ms-0 _w_100 me-lg-0 me-md-0 me-1">
                      <i className="fa-solid fa-download mx-1"></i>
                      {b('Export')}
                    </button>
                    <button className="btn _btn_main px-lg-4 px-md-4 mx-0 ms-lg-3 ms-md-3 ms-0 _w_100 ms-lg-0 ms-md-0 ms-1" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                      <i className="fa-solid fa-plus mx-1"></i>
                      {b('AddEmployee')}
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
                      <small>{u('Name')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('Nickname')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('Tel')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('Email')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('Status')}</small>
                    </th>
                    <th scope="col" className="_w_table_action">
                      <small>{u('Profile')}</small>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {EmployeeList &&
                    EmployeeList.map((item: IUser, index: number) => (
                      <tr key={index}>
                        <td data-content="NAME">
                          <div className="d-flex flex-row align-items-center">
                            <div>
                              {item.image_profile ? <img className="rounded-circle me-2" src={item.image_profile} width={40} height={40} alt="user-demo" /> : <img className="rounded-circle me-2" src="/img/profile-demo.png" width={40} height={40} alt="user-demo" />}
                              <small className="pe-2">{item.fname}</small>
                              <small>{item.lname}</small>
                            </div>
                          </div>
                        </td>
                        <td data-content="NICKNAME">
                          <small>{item.nickname}</small>
                        </td>
                        <td data-content="TEL">
                          <small>{item.phone_no}</small>
                        </td>
                        <td data-content="EMAIL">
                          <small>{item.email}</small>
                        </td>
                        <td data-content="STATUS">
                          <small className={item.employee_status === 'online' ? 'text-success' : item.employee_status === 'WORKING' ? 'text-warning' : item.employee_status === 'offline' ? 'text-danger' : ''}>{item.employee_status}</small>
                        </td>
                        <td data-content="PROFILE">
                          <Link href={`/employee/Profile?objid=${item.objid}`}>
                            <div className="dropdown text-center">
                              <button
                                className="btn btn-secondary"
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                }}
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false">
                                <i className="fa-solid fa-circle-info" style={{ color: '#2e2e2e', right: '100px' }}></i>
                              </button>
                              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li>
                                  <a className="dropdown-item " href="#">
                                    view
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="offcanvas offcanvas-end" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header">
          <h5 id="offcanvasRightLabel" className="_text_secondary">
            Add Employee
          </h5>
          <div className="px-2 py-1 _btn_export _rounded5px _cursor_pointer" data-bs-dismiss="offcanvas" aria-label="Close">
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>
        <div className="offcanvas-body">
          <div className="image-upload-container">
            <input type="file" id="upload-input" className="file-input" name="image_profile" onChange={previewImageProfile} accept="image/*" />
            <label htmlFor="upload-input" className="upload-label">
              {/* {imageDataProfile && <img src={imageDataProfile} width={100} height={100} alt="Preview" />} */}
              {imageProfile && <img src={imageProfile} width={100} height={100} alt="Uploaded" />}
              {!imageDataProfile && !imageProfile && <img className="_img_profile" src="/img/profile-demo.png" width={100} height={100} alt="Preview" />}
            </label>
          </div>

          <div className="row">
            <div className="col-12 mb-2">
              <label htmlFor="Employee Code" className="form-label mb-1">
                <small className="_text_secondary">Employee Code </small>
                <small className="text-danger">*</small>
              </label>
              <input
                type="text"
                className="form-control"
                id="employee_code"
                name="employee_code"
                placeholder="Employee Code"
                onChange={(e: any) => {
                  updateField(e)
                }}
              />
            </div>
            <div className="col-12 mb-2">
              <label htmlFor="FirstName" className="form-label mb-1">
                <small className="_text_secondary">First Name</small>
                <small className="text-danger">*</small>
              </label>
              <input
                type="text"
                className="form-control"
                id="fname"
                name="fname"
                placeholder="First Name"
                onChange={(e: any) => {
                  updateField(e)
                }}
              />
            </div>
            <div className="col-12 mb-2">
              <label htmlFor="LastName" className="form-label mb-1">
                <small className="_text_secondary">Last Name</small>
                <small className="text-danger">*</small>
              </label>
              <input
                type="text"
                className="form-control"
                id="lname"
                name="lname"
                placeholder="Last Name"
                onChange={(e: any) => {
                  updateField(e)
                }}
              />
            </div>
            <div className="col-12 mb-2">
              <label htmlFor="nickname" className="form-label mb-1">
                <small className="_text_secondary">Nickname</small>
                <small className="text-danger">*</small>
              </label>
              <input
                type="text"
                className="form-control"
                id="nickname"
                name="nickname"
                placeholder="Nickname"
                onChange={(e: any) => {
                  updateField(e)
                }}
              />
            </div>
            <div className="col-12 mb-2">
              <label htmlFor="Tel" className="form-label mb-1">
                <small className="_text_secondary">Tel</small>
              </label>
              <input
                type="text"
                className="form-control"
                id="phone_no"
                name="phone_no"
                placeholder="Tel"
                onChange={(e: any) => {
                  updateField(e)
                }}
              />
            </div>
            <div className="col-12 mb-2">
              <label htmlFor="Email" className="form-label mb-1">
                <small className="_text_secondary">Email</small>
              </label>
              <input
                type="text"
                className="form-control"
                id="email"
                name="email"
                placeholder="Email"
                onChange={(e: any) => {
                  updateField(e)
                }}
              />
            </div>
            <div className="col-12 mb-2">
              <label htmlFor="Gender" className="form-label mb-1">
                <small className="_text_secondary">Gender</small>
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                id="sex"
                name="sex"
                onChange={(e: any) => {
                  updateField(e)
                }}>
                <option value="1">Male</option>
                <option value="2">Female</option>
              </select>
            </div>

            <div className="col-12 mb-2">
              <label htmlFor="birthDate" className="form-label mb-1">
                <small className="_text_secondary">Birth Date</small>
              </label>
              <input
                type="date"
                value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ''}
                onChange={(e: any) => {
                  updateField(e)
                  handleDateChange(e)
                }}
                className="form-control"
                id="birthdate"
                name="birthdate"
                placeholder="Birth Date"
              />
            </div>

            <div className="col-12 mb-2">
              <label htmlFor="Background" className="form-label mb-1">
                <small className="_text_secondary">Background</small>
              </label>
              <textarea
                className="form-control"
                id="background"
                name="background"
                placeholder="Background"
                onChange={(e: any) => {
                  updateField(e)
                }}
              />
            </div>
            <div className="col-12 mb-2">
              <label htmlFor="Personal ID" className="form-label mb-1">
                <small className="_text_secondary">Personal ID</small>
              </label>
              <input
                type="text"
                className="form-control"
                id="personal_id"
                name="personal_id"
                placeholder="Personal ID"
                onChange={(e: any) => {
                  updateField(e)
                }}
              />
            </div>

            <div className="col-6 mb-2">
              <label htmlFor="Start Job Date" className="form-label mb-1">
                <small className="_text_secondary">Start Job Date</small>
              </label>
              <input
                type="date"
                value={startJobDate ? startJobDate.toISOString().slice(0, 10) : ''}
                onChange={(e: any) => {
                  updateField(e)
                  handleStartJobDateChange(e)
                }}
                className="form-control"
                id="start_job_date"
                name="start_job_date"
                placeholder="Start Job Date"
              />
            </div>

            <div className="col-6 mb-2">
              <label htmlFor="Stop Job Date" className="form-label mb-1">
                <small className="_text_secondary">Stop Job Date</small>
              </label>
              <input
                type="date"
                value={stopJobDate ? stopJobDate.toISOString().slice(0, 10) : ''}
                onChange={(e: any) => {
                  updateField(e)
                  handleStopJobDateChange(e)
                }}
                className="form-control"
                id="stop_job_date"
                name="stop_job_date"
                placeholder="Stop Job Date"
              />
            </div>

            <div className="col-12 mb-2">
              <label htmlFor="Address" className="form-label mb-1">
                <small className="_text_secondary">Address</small>
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                placeholder="Address"
                onChange={(e: any) => {
                  updateField(e)
                }}
              />
            </div>
            <div className="col-12 mb-2">
              <label htmlFor="Zipcode" className="form-label mb-1">
                <small className="_text_secondary">Zipcode</small>
              </label>
              <input
                type="text"
                className="form-control"
                id="zipcode"
                name="zipcode"
                placeholder="Zipcode"
                onChange={(e: any) => {
                  updateField(e)
                }}
              />
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="Province" className="form-label mb-1">
                <small className="_text_secondary">Province</small>
              </label>
              <select
                className="form-select"
                id="province"
                name="province"
                value={selectedProvince}
                onChange={(e: any) => {
                  updateField(e)
                }}
                aria-label=".form-select example">
                <option selected>Open this select menu</option>
                {ProvinceList &&
                  ProvinceList.map((item: IUser, index: number) => (
                    <option key={index} value={item.value_data}>
                      {item.value_data}
                    </option>
                  ))}
              </select>
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="Position" className="form-label mb-1">
                <small className="_text_secondary">Position</small>
              </label>
              <select
                className="form-select"
                id="position"
                name="position"
                value={selectedPosition}
                onChange={(e: any) => {
                  updateField(e)
                }}
                aria-label=".form-select example">
                <option selected>Open this select menu</option>
                {PositionList &&
                  PositionList.map((item: IUser, index: number) => (
                    <option key={index} value={item.value_data}>
                      {item.value_data}
                    </option>
                  ))}
              </select>
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="Employee" className="form-label mb-1">
                <small className="_text_secondary">Employee Status</small>
              </label>
              <select
                className="form-select"
                id="employee_status"
                name="employee_status"
                value={selectedEmployeeStatus}
                onChange={(e: any) => {
                  updateField(e)
                }}
                aria-label=".form-select example">
                <option selected>Open this select menu</option>
                {EmstatusList &&
                  EmstatusList.map((item: IUser, index: number) => (
                    <option key={index} value={item.value_data}>
                      {item.value_data}
                    </option>
                  ))}
              </select>
            </div>

            <div className="col-12 mb-2 mt-2">
              <button
                className="btn _btn_main px-3 me-2"
                onClick={() => {
                  sendEmployee()
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
    </>
  )
}
Users.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>
}
export default Users
export { getStaticProps } from '@/utils/getStaticProps'
function setUserList(data: any) {
  throw new Error('Function not implemented.')
}
