
import MainLayout from '@/layouts/main'
import React, { useEffect, useState } from 'react'
import { type IResponse, defaultResponse, IFetchData } from '@/types/response'
import { fetchData } from '@/utils/fetchData'
import { useSession } from 'next-auth/react'
import { IUser, defaultUser } from '@/types/user'
import Image from 'next/image'
import Swal from 'sweetalert2'
import router from 'next/router'
import { useTranslations } from 'next-intl';
import Link from 'next/link'

interface IFormData {
  contact_id: number
  objid: number
  group_name: string
  group_desc: string
  id: number
}

const GroupUser = (): React.JSX.Element => {
  const session: any = useSession()
  const [response, setResponse] = useState<IResponse>(defaultResponse)
  const [formData, setFormData] = useState<IFormData>({

    contact_id: 0,
    objid: 0,
    group_name: '',
    group_desc: '',
    id: 0
  }
  )
  const [SearchUserGroupList, setSearchUserGroupList] = useState<IUser[]>([])
  const updateField = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    })
  }
  const sendEmployee = async () => {
    // POST
    try {
      const _res: IFetchData = await fetchData(
        '/Security/UpdateUserGroup',
        'POST',
        {
          contact_id: 1,
          objid: 0,
          group_name: formData.group_name,
          group_desc: formData.group_desc,
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
        SearchUserGroup()
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
  const [EmployeeList, setEmpolyeeList] = useState<IUser[]>([])
  const u = useTranslations('TEXT');
  const b = useTranslations('BUTTON');
  const s = useTranslations('TEXT-INPUT');


  const SearchUserGroup = async () => {
    const data: IFetchData = await fetchData('/Security/SearchUserGroup?contact_id=1', 'GET', {}, session?.data?.accessToken)
    console.log('%cindex.tsx line:19 _res ::::::::::::::::::::::', 'color: #007acc;', data?.data?.data)
    if (data.statusCode === 200) {
      setSearchUserGroupList(data.data.data)
    }
  }
  useEffect(() => {
    SearchUserGroup()
  }, [session])
  return (
    <>
      <div className="row _rounded5px bg-white my-3 _shadow">
        <div className="col-12">
          <div className="row p-3">
            <div className="col-12 mb-2">
              <h5 className="text-dark">{u("GroupUser")}</h5>
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
                    <input type="text" className="form-control _w_search" placeholder={s("Search")} />
                  </div>
                  <div className="d-flex justify-content-between">
                    <button className="btn _btn_export px-lg-4 px-md-4 mx-0 ms-lg-3 ms-md-3 ms-0 _w_100 me-lg-0 me-md-0 me-1">
                      <i className="fa-solid fa-download mx-1"></i>
                      {b("Export")}
                    </button>
                    <button className="btn _btn_main px-lg-4 px-md-4 mx-0 ms-lg-3 ms-md-3 ms-0 _w_100 ms-lg-0 ms-md-0 ms-1" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                      <i className="fa-solid fa-plus mx-1"></i>
                      {b("Addgroupuser")}
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
                      <small>{u("Groupname")}</small>
                    </th>
                    <th scope="col">
                      <small>{u("Groupdescription")}</small>
                    </th>
                    <th scope="col">
                      <small>{u("Createdate")}</small>
                    </th>
                    <th scope="col">
                      <small>{u("Lastdate")}</small>
                    </th>
                    <th scope="col" className="_w_table_action">
                      <small>{u("Action")}</small>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SearchUserGroupList && SearchUserGroupList.map((item: IUser, index: number) => (
                    <tr key={index}>
                      <td data-content="Groupname">
                        <div className="d-flex flex-row align-items-center">
                          <Image className="rounded-circle me-2" src="/img/profile-demo.png" width={40} height={40} alt="user-demo" />
                          <div>
                            <small className="pe-3">{item.group_name}</small>
                          </div>

                        </div>
                      </td>
                      <td data-content="Groupdescription">
                        <small>{item.group_desc}</small>
                      </td>
                      <td data-content="Createdate">
                        <small>{item.cdate}</small>
                      </td>
                      <td data-content="Lastdate">
                        <small>{item.ldate}</small>
                      </td>
                      <td data-content="Action">
                        <div className="dropdown text-end">
                          <i className="pe-3 fa-solid fa-pen-to-square _iconUser1" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRightEditU" aria-controls="offcanvasRightEditU"></i>
                          <i className="pe-3 fa-solid fa-trash _iconUser3" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRightd" aria-controls="offcanvasRight"></i>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div >
      </div >

      <div className="offcanvas offcanvas-end" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header">
          <h5 id="offcanvasRightLabel" className="_text_secondary">
            Add Groupuser
          </h5>
          <div className="px-2 py-1 _btn_export _rounded5px _cursor_pointer" data-bs-dismiss="offcanvas" aria-label="Close">
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>
        <div className="offcanvas-body">
          <div className="row">

            <div className="col-12 mb-2">
              <label htmlFor="GroupName" className="form-label mb-1">
                <small className="_text_secondary">Group Name</small>
              </label>
              <input
                type="text"
                className="form-control"
                id="group_name"
                name="group_name"
                placeholder="Group Name"
                onChange={(e: any) => {
                  updateField(e)
                }}
              />
            </div>
            <div className="col-12 mb-2">
              <label htmlFor="GroupDescription" className="form-label mb-1">
                <small className="_text_secondary">Group Description</small>
              </label>
              <input
                type="text"
                className="form-control"
                id="group_desc"
                name="group_desc"
                placeholder="Group Description"
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
    </>
  )
}
GroupUser.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>
}
export default GroupUser
export { getStaticProps } from "@/utils/getStaticProps"

