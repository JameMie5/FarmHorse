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

interface IFormData {
  contact_id: number
  objid: number
  member_objid: number
  member_name: string
  horse_objid: number
  horse_name: string
  coach_objid: number
  coach_name: string
  support_objid: number
  support_name: string
  booking_type: string
  booking_fdatetime: string
  booking_tdatetime: string
  remarks: string
  booking_status: string
  image_link_key: string
  cdate: string
  ldate: string

  value_data: string
}
const Users = (): React.JSX.Element => {
  const session: any = useSession()
  const [response, setResponse] = useState<IResponse>(defaultResponse)
  const [startJobDate, setStartJobDate] = useState<Date | null>(null)
  const [stopJobDate, setStopJobDate] = useState<Date | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [formData, setFormData] = useState<IFormData>({
    contact_id: 0,
    objid: 0,
    member_objid: 0,
    member_name: '',
    horse_objid: 0,
    horse_name: '',
    coach_objid: 0,
    coach_name: '',
    support_objid: 0,
    support_name: '',
    booking_type: '',
    booking_fdatetime: '',
    booking_tdatetime: '',
    remarks: '',
    booking_status: '',
    image_link_key: '',
    cdate: '',
    ldate: '',

    value_data: '',
  })
  const updateField = (e: any) => {
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

  // GET ShowinfoMembership
  const showinfoMembership = async () => {
    const data: IFetchData = await fetchData(`/Farm/MemberShipSearch?contact=1`, 'GET', {}, session?.data?.accessToken)
    console.log('abc', data)
    if (data.statusCode === 200) {
      console.log(MembershipList)
      setMembershipList(data.data.data)
    } else {
      console.error('Error fetching province data:', data.error)
    }
  }
  useEffect(() => {
    showinfoMembership()
  }, [session])
  const [MembershipList, setMembershipList] = useState<IUser>()

  // GET ShowinfoHorse
  const showinfoHorse = async () => {
    const data: IFetchData = await fetchData(`/Farm/HorseSearch?contact_id=1`, 'GET', {}, session?.data?.accessToken)
    console.log('abc', data)
    if (data.statusCode === 200) {
      console.log(HorseList)
      setHorseList(data.data.data)
    } else {
      console.error('Error fetching Horse data:', data.error)
    }
  }
  useEffect(() => {
    showinfoHorse()
  }, [session])
  const [HorseList, setHorseList] = useState<IUser>()

  // GET ShowinfemCoach
  const showinfoCoach = async () => {
    const data: IFetchData = await fetchData(`/Farm/EmployeeSearch?contact_id=1`, 'GET', {}, session?.data?.accessToken)
    console.log('abc', data)
    if (data.statusCode === 200) {
      console.log(CoachList)
      setCoachList(data.data.data)
    } else {
      console.error('Error fetching EmstatusList data:', data.error)
    }
  }
  useEffect(() => {
    showinfoCoach()
  }, [session])
  const [CoachList, setCoachList] = useState<IUser>()

  // GET ShowinfemSupport
  const showinfoSupport = async () => {
    const data: IFetchData = await fetchData(`/Farm/EmployeeSearch?contact_id=1`, 'GET', {}, session?.data?.accessToken)
    console.log('abc', data)
    if (data.statusCode === 200) {
      console.log(SupportList)
      setSupportList(data.data.data)
    } else {
      console.error('Error fetching SupportList data:', data.error)
    }
  }
  useEffect(() => {
    showinfoSupport()
  }, [session])
  const [SupportList, setSupportList] = useState<IUser>()

  // GET ShowinfemBooking
  const showinfoBooking = async () => {
    const data: IFetchData = await fetchData(`/Farm/SystemValueSearch?contact_id=1&value_code=Booking%20type`, 'GET', {}, session?.data?.accessToken)
    console.log('abc', data)
    if (data.statusCode === 200) {
      console.log(BookingList)
      setBookingList(data.data.data)
    } else {
      console.error('Error fetching BookingList data:', data.error)
    }
  }
  useEffect(() => {
    showinfoBooking()
  }, [session])
  const [BookingList, setBookingList] = useState<IUser>()

  // GET ShowinfemBookingType
  const showinfoBookingType = async () => {
    const data: IFetchData = await fetchData(`/Farm/SystemValueSearch?contact_id=1&value_code=BOOKING%20STATUS`, 'GET', {}, session?.data?.accessToken)
    console.log('abc', data)
    if (data.statusCode === 200) {
      console.log(BookingTypeList)
      setBookingTypeList(data.data.data)
    } else {
      console.error('Error fetching BookingList data:', data.error)
    }
  }
  useEffect(() => {
    showinfoBookingType()
  }, [session])
  const [BookingTypeList, setBookingTypeList] = useState<IUser>()

  const sendEmployee = async () => {
    // POST
    try {
      const _res: IFetchData = await fetchData(
        '/Farm/BookingUpdate',
        'POST',
        {
          contact_id: 1,
          objid: 0,
          member_objid: 1,
          member_name: formData.member_name,
          horse_objid: 1,
          horse_name: formData.horse_name,
          coach_objid: 1,
          coach_name: formData.coach_name,
          support_objid: 1,
          support_name: formData.support_name,
          booking_type: formData.booking_type,
          booking_fdatetime: formData.booking_fdatetime,
          booking_tdatetime: formData.booking_tdatetime,
          remarks: formData.remarks,
          booking_status: formData.booking_status,
          image_link_key: 'string',
          cdate: 'string',
          ldate: 'string',
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
        getBooking()
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

  const [BookingListA, setEmpolyeeList] = useState<IUser[]>([])
  const u = useTranslations('TEXT')
  const b = useTranslations('BUTTON')
  const s = useTranslations('TEXT-INPUT')

  const getBooking = async () => {
    const data: IFetchData = await fetchData('/Farm/BookingSearch?contact_id=1', 'GET', {}, session?.data?.accessToken)
    console.log('%cindex.tsx line:19 _res ::::::::::::::::::::::', 'color: #007acc;', data?.data?.data)
    if (data.statusCode === 200) {
      setEmpolyeeList(data.data.data)
    }
  }
  useEffect(() => {
    getBooking()
  }, [session])

  const DeleteBookingData = async (userId: number) => {
    try {
      const _res: IFetchData = await fetchData(
        `/Farm/BookingDelete`,
        'POST',
        {
          objid: userId,
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
          }).then(() => {
            window.location.reload() // รีเฟรชหน้าเว็บหลังจากที่ลบข้อมูลเรียบร้อยแล้ว
          })
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

  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined)
  const [selectedmember_name, setSelectedLogin_name] = useState<string | undefined>(undefined)

  const showUserData = (userId: number, member_name: string) => {
    setSelectedUserId(userId)
    setSelectedLogin_name(member_name)
  }

  const formatDate = (datetime: string | number | Date) => {
    const date = new Date(datetime)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const day = date.getDate()
    const monthIndex = date.getMonth()
    const year = date.getFullYear()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const monthName = monthNames[monthIndex]
    const formattedDate = `${day} ${monthName} ${year} ${hours}:${minutes}`
    return formattedDate
  }

  const breadcrumbItems = [{ text: 'Booking', href: '/booking' }]

  return (
    <>
      <div className="_breadcrumb">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className="row _rounded5px bg-white my-3 _shadow">
        <div className="col-12">
          <div className="row p-3">
            <div className="col-12 mb-2">
              <h5 className="text-dark">{u('Booking')}</h5>
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
                    <Link href={`/booking/addbooking`}>
                      <button className="btn _btn_main px-lg-4 px-md-4 mx-0 ms-lg-3 ms-md-3 ms-0 _w_100 ms-lg-0 ms-md-0 ms-1">
                        <i className="fa-solid fa-plus mx-1"></i>
                        {b('AddBooking')}
                      </button>
                    </Link>
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
                      <small>{u('BOOKINGNO')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('BOOKING NAME')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('TEL')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('BOOKING START')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('BOOKING END')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('BOOKING STATUS')}</small>
                    </th>
                    <th scope="col" className="_w_table_action">
                      <small>{u('Action')}</small>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {BookingListA &&
                    BookingListA.map((item: IUser, index: number) => (
                      <tr key={index} className="Text-detail">
                        <td data-content="BOOKINGNO">
                          <div className="d-flex flex-row align-items-center">
                            <small className="pe-2">{item.booking_no}</small>
                          </div>
                        </td>
                        <td data-content="BOOKING NAME">
                          <small>{item.booking_name}</small>
                        </td>
                        <td data-content="TEL">
                          <small>{item.tel}</small>
                        </td>
                        <td data-content="BOOKING START">
                          <small>{formatDate(item.booking_fdatetime)}</small>
                        </td>
                        <td data-content="BOOKING END">
                          <small>{formatDate(item.booking_tdatetime)}</small>
                        </td>
                        <td data-content="BOOKING STATUS">
                          <small>{item.booking_status}</small>
                        </td>
                        <td data-content="ACTIONS">
                          <div className="text-end">
                            <Link href={`/booking/editbooking?objid=${item.objid}`}>
                              <i className="pe-3 fa-solid fa-pen-to-square _Link"></i>
                            </Link>
                            <i className="pe-3 fa-solid fa-trash" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight_Delete_Booking" aria-controls="offcanvasRight" onClick={() => showUserData(item?.objid || 0, item?.member_name || '')}></i>
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
            Add Booking
          </h5>
          <div className="px-2 py-1 _btn_export _rounded5px _cursor_pointer" data-bs-dismiss="offcanvas" aria-label="Close">
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>
        <div className="offcanvas-body">
          <div className="row">
            <div className="col-12 mb-3">
              <label htmlFor="Province" className="form-label mb-1">
                <small className="_text_secondary">MemberShip</small>
              </label>
              <select
                className="form-select"
                id="member_name"
                name="member_name"
                onChange={(e: any) => {
                  updateField(e)
                }}
                aria-label=".form-select example">
                <option disabled selected>
                  MemberShip
                </option>
                {MembershipList && MembershipList.map((item: IUser, index: number) => <option key={index}>{item.fname}</option>)}
              </select>
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="Province" className="form-label mb-1">
                <small className="_text_secondary">Horse</small>
              </label>
              <select
                className="form-select"
                id="horse_name"
                name="horse_name"
                onChange={(e: any) => {
                  updateField(e)
                }}
                aria-label=".form-select example">
                <option disabled selected>
                  Horse
                </option>
                {HorseList && HorseList.map((item: IUser, index: number) => <option key={index}>{item.horse_name}</option>)}
              </select>
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="Province" className="form-label mb-1">
                <small className="_text_secondary">Coach</small>
              </label>
              <select
                className="form-select"
                id="coach_name"
                name="coach_name"
                onChange={(e: any) => {
                  updateField(e)
                }}
                aria-label=".form-select example">
                <option disabled selected>
                  Coach
                </option>
                {CoachList && CoachList.map((item: IUser, index: number) => <option key={index}>{item.fname}</option>)}
              </select>
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="Province" className="form-label mb-1">
                <small className="_text_secondary">Support</small>
              </label>
              <select
                className="form-select"
                id="support_name"
                name="support_name"
                onChange={(e: any) => {
                  updateField(e)
                }}
                aria-label=".form-select example">
                <option disabled selected>
                  Support
                </option>
                {SupportList && SupportList.map((item: IUser, index: number) => <option key={index}>{item.fname}</option>)}
              </select>
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="Booking" className="form-label mb-1">
                <small className="_text_secondary">Booking Type</small>
              </label>
              <select
                className="form-select"
                id="booking_type"
                name="booking_type"
                onChange={(e: any) => {
                  updateField(e)
                }}
                aria-label=".form-select example">
                <option disabled selected>
                  Booking Type
                </option>
                {BookingList && BookingList.map((item: IUser, index: number) => <option key={index}>{item.value_data}</option>)}
              </select>
            </div>

            <div className="col-12 mb-2">
              <label htmlFor="birthDate" className="form-label mb-1">
                <small className="_text_secondary">Booking Start</small>
              </label>
              <input
                type="datetime-local"
                value={selectedDate ? selectedDate.toISOString().slice(0, 16) : ''}
                onChange={(e: any) => {
                  updateField(e)
                  handleDateChange(e)
                }}
                className="form-control"
                id="booking_fdatetime"
                name="booking_fdatetime"
                placeholder="Booking Start"
              />
            </div>

            <div className="col-12 mb-2">
              <label htmlFor="birthDate" className="form-label mb-1">
                <small className="_text_secondary">Booking end</small>
              </label>
              <input
                type="datetime-local"
                value={startJobDate ? startJobDate.toISOString().slice(0, 16) : ''}
                onChange={(e: any) => {
                  updateField(e)
                  handleStartJobDateChange(e)
                }}
                className="form-control"
                id="booking_tdatetime"
                name="booking_tdatetime"
                placeholder="Booking end"
              />
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="booking_status" className="form-label mb-1">
                <small className="_text_secondary">Booking Status</small>
              </label>
              <select
                className="form-select"
                id="booking_status"
                name="booking_status"
                onChange={(e: any) => {
                  updateField(e)
                }}
                aria-label=".form-select example">
                <option disabled selected>
                  Select Booking Status
                </option>
                {BookingTypeList && BookingTypeList.map((item: IUser, index: number) => <option key={index}>{item.value_data}</option>)}
              </select>
            </div>

            <div className="col-12 mb-2">
              <label htmlFor="Background" className="form-label mb-1">
                <small className="_text_secondary">Remake</small>
              </label>
              <textarea
                className="form-control"
                id="remarks"
                name="remarks"
                placeholder="Remake"
                onChange={(e: any) => {
                  updateField(e)
                }}
              />
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

      {/* Edut Infomation */}
      <div className="offcanvas offcanvas-end" id="offcanvasRightEm_Edit_Booking" aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header">
          <h5 id="offcanvasRightLabel" className="_text_secondary">
            Edit User
          </h5>
          <div className="px-2 py-1 _btn_export _rounded5px _cursor_pointer" data-bs-dismiss="offcanvas" aria-label="Close">
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>
        <div className="offcanvas-body">
          <div className="row">
            <div className="col-12 mb-2 "></div>
          </div>
        </div>
      </div>

      {/* Delete Infomation */}
      <div className="offcanvas offcanvas-end" id="offcanvasRight_Delete_Booking" aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header">
          <h5 id="offcanvasRightLabel" className="_text_secondary">
            Delete
          </h5>
          <div className="px-2 py-1 _btn_export _rounded5px _cursor_pointer" data-bs-dismiss="offcanvas" aria-label="Close">
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>
        <div className="offcanvas-body">
          <div className="row">
            {BookingListA && BookingListA.length && (
              <div className="col-12 mb-2">
                <label htmlFor="Username" className="form-label mb-1"></label>
                <div className="text-start">
                  <span style={{ display: 'block' }}>
                    <p>USER LOGIN: {selectedmember_name}</p>
                  </span>
                </div>
                <div className="mt-4">
                  <button className="btn btn-danger" onClick={() => DeleteBookingData(Number(selectedUserId))}>
                    delete
                  </button>
                </div>
              </div>
            )}
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
