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
import Breadcrumb from '@/components/breadcrumb'
import axios from 'axios'

interface IFormData {
  contact: number
  objid: number
  member_code: string
  image_profile: string
  fname: string
  lname: string
  sex: string
  phone_no: string
  email: string
  birthdate: string
  start_member_date: string
  stop_member_date: string
  expiry_member_date: string
  address: string
  province: string
  zipcode: string
  member_level: string
  member_status: string
  line_id: string
  image_link_key: string
}

const Membership = (): React.JSX.Element => {
  const session: any = useSession()
  const [response, setResponse] = useState<IResponse>(defaultResponse)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null)
  const [selectedStopDate, setSelectedStopDate] = useState<Date | null>(null)
  const [selectedExpiryDate, setSelectedExpiryDate] = useState<Date | null>(null)
  const [imageDataProfile, setImageDataProfile] = useState<string | null>(null)
  const [imageProfile, setImageProfile] = useState<string | null>(null)
  const [formData, setFormData] = useState<IFormData>({
    contact: 0,
    objid: 0,
    member_code: '',
    image_profile: '',
    fname: '',
    lname: '',
    sex: '',
    phone_no: '',
    email: '',
    birthdate: '',
    start_member_date: '',
    stop_member_date: '',
    expiry_member_date: '',
    address: '',
    province: '',
    zipcode: '',
    member_level: '',
    member_status: '',
    line_id: '',
    image_link_key: '',
  })

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value))
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStartDate(new Date(e.target.value))
  }

  const handleStopDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStopDate(new Date(e.target.value))
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedExpiryDate(new Date(e.target.value))
  }
  
  const [selectedMembershipStatus, setSelectedMembershipStatus] = useState<number | undefined>(undefined)
  const [selectedMemberLevel, setSelectedMemberLevel] = useState<string | undefined>(undefined)
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>(undefined)

  const updateField = (e: any) => {
    if (e.target.name === 'employee_status') {
      setSelectedMembershipStatus(e.target.value);
    }
    if (e.target.name === 'position') {
      setSelectedMemberLevel(e.target.value);
    }
    if (e.target.name === 'province') {
      setSelectedProvince(e.target.value);
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };
  const sendMemberShip = async () => {
    // POST
    console.log('imageProfile', imageProfile)
    try {
      const _res: IFetchData = await fetchData(
        '/Farm/MemberShipUpdate',
        'POST',
        {
          contact: 1,
          objid: 0,
          member_code: formData.member_code,
          image_profile: imageProfile,
          fname: formData.fname,
          lname: formData.lname,
          sex: formData.sex,
          phone_no: formData.phone_no,
          email: formData.email,
          birthdate: formData.birthdate,
          start_member_date: formData.start_member_date,
          stop_member_date: formData.stop_member_date,
          expiry_member_date: formData.expiry_member_date,
          address: formData.address,
          province: formData.province,
          zipcode: formData.zipcode,
          member_level: formData.member_level,
          member_status: formData.member_status,
          line_id: formData.line_id,
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
        getMemberShipList()
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

  const [MemberShipList, setMemberShipList] = useState<IUser[]>([])
  const u = useTranslations('TEXT')
  const b = useTranslations('BUTTON')
  const s = useTranslations('TEXT-INPUT')

  const getMemberShipList = async () => {
    const data: IFetchData = await fetchData('/Farm/MemberShipSearch?contact_id=1', 'GET', {}, session?.data?.accessToken)
    console.log('%cindex.tsx line:19 _res ::::::::::::::::::::::', 'color: #007acc;', data?.data?.data)
    if (data.statusCode === 200) {
      setMemberShipList(data.data.data)
    }
  }
  useEffect(() => {
    getMemberShipList()
  }, [session])

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

    // GET MemberStatus
    const showinfoMemberStatus = async () => {
      const data: IFetchData = await fetchData(`/Farm/SystemValueSearch?contact_id=1&value_code=MEMBER%20STATUS`, 'GET', {}, session?.data?.accessToken)
      console.log('abc', data)
      if (data.statusCode === 200) {
        console.log(MemberStatusList)
        setMemberStatusList(data.data.data)
      } else {
        console.error('Error fetching province data:', data.error)
      }
    }
    useEffect(() => {
      showinfoMemberStatus()
    }, [session])
    const [MemberStatusList, setMemberStatusList] = useState<IUser>()

    // GET MemberLevel
    const showinfoMemberLevel = async () => {
      const data: IFetchData = await fetchData(`/Farm/SystemValueSearch?contact_id=1&value_code=MEMBER%20LEVEL`, 'GET', {}, session?.data?.accessToken)
      console.log('abc', data)
      if (data.statusCode === 200) {
        console.log(MemberLevelList)
        setMemberLevelList(data.data.data)
      } else {
        console.error('Error fetching province data:', data.error)
      }
    }
    useEffect(() => {
      showinfoMemberLevel()
    }, [session])
    const [MemberLevelList, setMemberLevelList] = useState<IUser>()

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
        const uploadImageProfile = await axios.post(`${process.env.API_URL}/File/UploadFile`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        // console.log('data', data)
        setImageProfile(`${process.env.API_URL}/File/DownloadFile/${uploadImageProfile.data.data.objid}`)
        console.log('setImageProfile', `${process.env.API_URL}/File/DownloadFile/${uploadImageProfile.data.data.objid}`)
      } catch (error) {
        console.error('Error uploading image:', error)
      }
    }
  }


  return (
    <>
      <div className="row _rounded5px bg-white my-3 _shadow">
        <div className="col-12">
          <div className="row p-3">
            <div className="col-12 mb-2">
              <h5 className="text-dark">{u('Membership')}</h5>
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
                      {b('AddMembership')}
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
                      <small>{u('Memberlavel')}</small>
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
                  {MemberShipList &&
                    MemberShipList.map((item: IUser, index: number) => (
                      <tr key={index}>
                        <td data-content="User">
                          <div className="d-flex flex-row align-items-center">
                          <div>
                              {item.image_profile ? <img className="rounded-circle me-2" src={item.image_profile} width={40} height={40} alt="user-demo" /> : <img className="rounded-circle me-2" src="/img/profile-demo.png" width={40} height={40} alt="user-demo" />}
                              <small className="pe-2">{item.fname}</small>
                              <small>{item.lname}</small>
                            </div>
                          </div>
                        </td>
                        <td data-content="Memberlavel">
                          <small>{item.member_level}</small>
                        </td>
                        <td data-content="Tel">
                          <small>{item.phone_no}</small>
                        </td>
                        <td data-content="Status">
                          <small>{item.member_status}</small>
                        </td>
                        <td data-content="Action">
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
                              <Link href={`/membership/Profile?objid=${item.objid}`}>
                                <li>
                                  <a className="dropdown-item " href="#">
                                    view
                                  </a>
                                </li>
                              </Link>
                            </ul>
                          </div>
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
              {imageProfile && <img src={imageProfile} width={100} height={100} alt="Uploaded" />}
              {!imageDataProfile && !imageProfile && <img className="_img_profile" src="/img/profile-demo.png" width={100} height={100} alt="Preview" />}
            </label>
          </div>

          <div className="row">
            <div className="col-12 mb-2">
              <label htmlFor="Member Code" className="form-label mb-1">
                <small className="_text_secondary">Member Code</small>
              </label>
              <input
                type="text"
                className="form-control"
                id="member_code"
                name="member_code"
                placeholder="Member Code"
                onChange={(e: any) => {
                  updateField(e)
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
                  updateField(e)
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
              <label htmlFor="Line ID" className="form-label mb-1">
                <small className="_text_secondary">Line ID</small>
              </label>
              <input
                type="text"
                className="form-control"
                id="line_id"
                name="line_id"
                placeholder="Line ID"
                onChange={(e: any) => {
                  updateField(e)
                }}
              />
            </div>

            <div className="col-12 mb-2">
              <label htmlFor="Start Member Date" className="form-label mb-1">
                <small className="_text_secondary">Start Member Date</small>
              </label>
              <input
                type="date"
                value={selectedStartDate ? selectedStartDate.toISOString().slice(0, 10) : ''}
                onChange={(e: any) => {
                  updateField(e)
                  handleStartDateChange(e)
                }}
                className="form-control"
                id="start_member_date"
                name="start_member_date"
                placeholder="Start Member Date"
              />
            </div>

            <div className="col-12 mb-2">
              <label htmlFor="Stop Member Date" className="form-label mb-1">
                <small className="_text_secondary">Stop Member Date</small>
              </label>
              <input
                type="date"
                value={selectedStopDate ? selectedStopDate.toISOString().slice(0, 10) : ''}
                onChange={(e: any) => {
                  updateField(e)
                  handleStopDateChange(e)
                }}
                className="form-control"
                id="stop_member_date"
                name="stop_member_date"
                placeholder="Stop Member Date"
              />
            </div>

            <div className="col-12 mb-2">
              <label htmlFor="Expiry Member Date" className="form-label mb-1">
                <small className="_text_secondary">Expiry Member Date</small>
              </label>
              <input
                type="date"
                value={selectedExpiryDate ? selectedExpiryDate.toISOString().slice(0, 10) : ''}
                onChange={(e: any) => {
                  updateField(e)
                  handleExpiryDateChange(e)
                }}
                className="form-control"
                id="expiry_member_date"
                name="expiry_member_date"
                placeholder="Expiry Member Date"
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
              <label htmlFor="Member Status" className="form-label mb-1">
                <small className="_text_secondary">Member Status</small>
              </label>
              <select
                className="form-select"
                id="member_status"
                name="member_status"
                value={selectedMembershipStatus}
                onChange={(e: any) => {
                  updateField(e)
                }}
                aria-label=".form-select example">
                <option selected>Open this select menu</option>
                {MemberStatusList &&
                  MemberStatusList.map((item: IUser, index: number) => (
                    <option key={index} value={item.value_data}>
                      {item.value_data}
                    </option>
                  ))}
              </select>
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="Member Level" className="form-label mb-1">
                <small className="_text_secondary">Member Level</small>
              </label>
              <select
                className="form-select"
                id="member_level"
                name="member_level"
                value={selectedMemberLevel}
                onChange={(e: any) => {
                  updateField(e)
                }}
                aria-label=".form-select example">
                <option selected>Open this select menu</option>
                {MemberLevelList &&
                  MemberLevelList.map((item: IUser, index: number) => (
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
                  sendMemberShip()
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
Membership.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>
}
export default Membership
export { getStaticProps } from '@/utils/getStaticProps'
function setSelectedDate(arg0: Date) {
  throw new Error('Function not implemented.')
}

