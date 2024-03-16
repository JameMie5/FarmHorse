import { useRouter } from 'next/router'
import { fetchData } from '@/utils/fetchData'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useSession } from 'next-auth/react'
import { IUser, defaultUser } from '@/types/user'
import { type IResponse, defaultResponse, IFetchData } from '@/types/response'

import MainLayout from '@/layouts/main'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/breadcrumb'
import { useTranslations } from 'next-intl'

interface IProfile {
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
const Em_Profile = (): React.JSX.Element => {
  const router = useRouter()
  const session: any = useSession()
  const [userList, setUserList] = useState<IUser[]>([])
  const [response, setResponse] = useState<IResponse>(defaultResponse)
  const [userData, setUserData] = useState<any>(null)
  const [formData, setFormData] = useState<IProfile>({
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

  const showinfoprofile = async () => {
    try {
      const data: IFetchData = await fetchData(`/Farm/EmployeeSearch?contact_id=1&objid=${router.query.objid}`, 'GET', {}, session?.data?.accessToken)
      console.log('response::::::', data)
      if (data.statusCode === 200) {
        console.log(userList)
        setUserList(data.data.data)
      } else {
        console.error('Error fetching user data:', data.error)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }
  useEffect(() => {
    showinfoprofile()
  }, [session])

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

  const formatDate = (datetime: string | number | Date) => {
    const date = new Date(datetime)
    // สร้าง array ของชื่อเดือนภาษาอังกฤษ
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    // ดึงข้อมูลวันที่, เดือน, ปี, ชั่วโมง, นาที
    const day = date.getDate()
    const monthIndex = date.getMonth()  
    const year = date.getFullYear()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    // แปลงเดือนให้อยู่ในรูปแบบของชื่อเดือน
    const monthName = monthNames[monthIndex]
    // สร้าง string ที่รวมวันที่, เดือน, ปี, เวลา
    const formattedDate = `${day} ${monthName} ${year}`
    return formattedDate
  }
  
  const breadcrumbItems = [
    { text: 'Employee ', href: '/employee' },
    { text: 'Booking', href: '/employee/booking'},
  ];

  const [EmployeeList, setEmpolyeeList] = useState<IUser[]>([])
  const u = useTranslations('TEXT')
  const b = useTranslations('BUTTON')
  const s = useTranslations('TEXT-INPUT')

  return (
    <>
    <div className='row _breadcrumb'>
     <Breadcrumb items={breadcrumbItems} />
     </div>
      <div>
        <div className="row">
        {userList && userList.length && (
            <div className="col-12">
              <div className="row">
                <div className="p-0">
                  <Link href={`/employee/Profile?objid=${userList[0].objid}`}>
                    <button type="button" className="btn mx-1 btn_menu_ ">
                      <i className="fa-solid fa-user mx-1"></i>Profile
                    </button>
                  </Link>
                  {/* <Link href={`/employee/competition_history?objid=${userList[0].objid}`}>
                    <button type="button" className="btn mx-1">
                      <i className="fa-solid fa-lock-open mx-1"></i>Competition History
                    </button>
                  </Link>
                  <Link href={`/employee/horse?objid=${userList[0].objid}`}>
                    <button type="button" className="btn mx-1">
                      <i className="fa-solid fa-dollar-sign mx-1"></i>Horse
                    </button>
                  </Link> */}
                  <Link href={`/employee/booking?objid=${userList[0].objid}`}>
                    <button type="button" className="btn btn_menu">
                    <i className="fa-solid fa-calendar-days mx-1"></i>Booking
                    </button>
                  </Link>
                  {/* <Link href={`/employee/income_expenses?objid=${userList[0].objid}`}>
                    <button type="button" className="btn mx-1">
                      <i className="fa-solid fa-link mx-1"></i>Income Expenses
                    </button>
                  </Link> */}
                </div>
              </div>
            </div>
          )}
        </div>
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
                      <small>{u('CHAOCH NAME')}</small>
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
                  {EmployeeList &&
                    EmployeeList.map((item: IUser, index: number) => (
                      <tr key={index}>
                        <td data-content="ChochName">
                          <div className="d-flex flex-row align-items-center">
                            <div>
                              <small className="pe-2">{item.booking_name}</small>
                            </div>
                          </div>
                        </td>
                        <td data-content="BookingStart">
                          <small>{formatDate(item.booking_fdatetime)}</small>
                        </td>
                        <td data-content="BookingEnd">
                          <small>{formatDate(item.booking_tdatetime)}</small>
                        </td>
                        <td data-content="BookingStatus">
                          <small className={
                            item.booking_status === 'CONFIRM' ? 'text-success' : 
                            item.booking_status === 'WAITING' ? 'text-warning' : ''
                            }>
                              {item.booking_status}</small>
                        </td>
                        {/* className={
                            item.booking_status === 'online' ? 'text-success' : 
                            item.booking_status === 'WORKING' ? 'text-warning' :
                            item.employee_status === 'offline' ? 'text-danger' : ''} */}
                        <td data-content="Action">
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
      </div>
    </>
  )
}
Em_Profile.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>
}
export default Em_Profile
export { getStaticProps } from '@/utils/getStaticProps'
