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
  })

  const showinfoHorseBooking = async () => {
    const data: IFetchData = await fetchData(`/Farm/CaretakerHistorySearch?contact_id=1`, 'GET', {}, session?.data?.accessToken)
    console.log('abc', data)
    if (data.statusCode === 200) {
      console.log(HorseBookingList)
      setHorseBookingList(data.data.data)
    } else {
      console.error('Error fetching EmstatusList data:', data.error)
    }
  }
  useEffect(() => {
    showinfoHorseBooking()
  }, [session])
  const [HorseBookingList, setHorseBookingList] = useState<IUser>()

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
    const formattedDate = `${day} ${monthName} ${year} `
    return formattedDate
  }

  const breadcrumbItems = [
    { text: 'Horse', href: '/horse' },
    { text: 'Booking', href: '/horse/booking' },
  ]

  const u = useTranslations('TEXT')
  const b = useTranslations('BUTTON')
  const s = useTranslations('TEXT-INPUT')

  return (
    <>
      <div className="_breadcrumb">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className="row">
        {HorseBookingList && (
          <div key={HorseBookingList.id}>
            <div className="col-12 mx-3">
              <div className="row">
                <div className="p-0">
                  <Link href={`/horse/profile?objid=${HorseBookingList.objid}`}>
                    <button type="button" className="btn mx-1 ">
                      <i className="fa-solid fa-bell mx-1"></i>Profile
                    </button>
                  </Link>
                  <Link href={`/horse/booking?objid=${HorseBookingList.objid}`}>
                    <button type="button" className="btn mx-1">
                      <i className="fa-solid fa-user mx-1"></i>Booking
                    </button>
                  </Link>
                  <Link href={`/horse/caretaker_history?objid=${HorseBookingList.objid}`}>
                    <button type="button" className="btn mx-1 btn_menu">
                      <i className="fa-solid fa-hat-cowboy mx-1"></i>Caretaker History
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="row _rounded5px bg-white my-3 _shadow">
        <div className="col-12">
          <div className="row p-3">
            <div className="col-12 mb-2">
              <h5 className="text-dark">{u('Horse')}</h5>
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
                      {b('AddHorse')}
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
                      <small>{u('EMPLOYEE NAME')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('DESCRIPTION')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('START DATE')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('END DATE')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('CARETAKER HISTORY STATUS')}</small>
                    </th>
                    <th scope="col" className="_w_table_action">
                      <small>{u('Action')}</small>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {HorseBookingList &&
                    HorseBookingList.map((item: IUser, index: number) => (
                      <tr key={index}>
                        <td data-content="EMPLOYEE NAME">
                          <small>{item.employee_name}</small>
                        </td>
                        <td data-content="DESCRIPTION">
                          <small>{item.description}</small>
                        </td>
                        <td data-content="START DATE">
                          <small>{formatDate(item.start_date)}</small>
                        </td>
                        <td data-content="END DATE">
                          <small>{formatDate(item.stop_date)}</small>
                        </td>
                        <td data-content="CARETAKER HISTORY STATUS">
                          <small>{item.caretaker_history_status}</small>
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
                              aria-expanded="false"></button>
                            <Link href={`/horse/profile?objid=${item.objid}`}>
                              <i className="fa-solid fa-circle-info" style={{ color: '#2e2e2e', right: '100px' }}></i>
                            </Link>
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
    </>
  )
}
Em_Profile.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>
}
export default Em_Profile
export { getStaticProps } from '@/utils/getStaticProps'
