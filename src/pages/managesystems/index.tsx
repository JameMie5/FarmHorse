import MainLayout from '@/layouts/main';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { type IResponse, defaultResponse, IFetchData } from '@/types/response';
import { fetchData } from '@/utils/fetchData';
import { useSession } from 'next-auth/react';
import { IUser, defaultUser } from '@/types/user';
import Image from 'next/image';
import Swal from 'sweetalert2';
import router from 'next/router';
import { useTranslations } from 'next-intl';
import Link from 'next/link';


interface SystemCodeItem {
  all_recs: number;
  row_id: number;
  objid: number;
  value_data: string;
  cdate: string;
  ldate: string;
}

const Users = (): React.JSX.Element => {
  // gettable
  const [formDatasysystemcode, setFormDatasysystemcode] = useState<SystemCodeItem[]>([]);
    // getselectoption
  const [Datasysystemcode, setDatasysystemcode] = useState<SystemCodeItem[]>([]);


  const [SystemCodeData, setSystemCodeData] = useState<IUser[]>([]);
  const [recsPrePage, setRecsPrePage] = useState<number>(10);
  const session: any = useSession();
  const [formData, setFormData] = useState<SystemCodeItem>({
    value_data: '',
    objid: 0,
    cdate: '',
    ldate: '',
    all_recs: 0,
    row_id: 0,
  });
  
   // getselectoption

  const getSystemCodeData = async () => {
    const data = await fetchData('/Farm/SystemValueSearch?contact_id=1&value_code=system%20code', 'GET', {}, session?.data?.accessToken);
    console.log('test', 'color: #007acc;', data?.data?.data);

    if (data.statusCode === 200) {
      setDatasysystemcode(data.data.data);
    }
  }

  const getSystemCodeDatacode = async () => {
    
  }
  const u = useTranslations('TEXT');
  const b = useTranslations('BUTTON');
  const s = useTranslations('TEXT-INPUT');

  // gettable
 
  const selectSystem = async (systemcode: any) => {
    console.log('system',systemcode)
    const data = await fetchData(`/Farm/SystemValueSearch?contact_id=1&value_code=${systemcode}`, 'GET', {}, session?.data?.accessToken);
    console.log('%cindex.tsx line:19 system ::::::::::::::::::::::', 'color: #007acc;', data?.data?.data);

    if (data.statusCode === 200) {
      setFormDatasysystemcode(data.data.data);
    }
  }
  useEffect(() => {

    getSystemCodeData();
    getSystemCodeDatacode();
  }, [session]);


  return (
    <>
  
      <div className="row _rounded5px bg-white my-3 _shadow">
        <div className="col-12">
          <div className="row p-3">
            <div className="col-12 mb-2">
              <h5 className="text-dark">Manage Systems</h5>
              <div className="col-2 mb-lg-0 mb-md-0 mb-3 mt-2 ">
                <select
                  className="form-select _border_form _w_perpage _cursor_pointer _w_search "
                  aria-label="Default select example"
                  onChange={(e)=> selectSystem(String(e.target.value))}
                  value={recsPrePage}
                >
                  <option value="" hidden>
                    Select Type
                  </option>
                  {Datasysystemcode.map((item: SystemCodeItem, index: number) => (
                    <option key={index} value={item.value_data}>{item.value_data}</option>
                  ))}
                </select>
              </div>
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
                    <input type="text" className="form-control _w_search" placeholder="Search" />
                  </div>
                  <div className="d-flex justify-content-between">
                    <button className="btn _btn_export px-lg-4 px-md-4 mx-0 ms-lg-3 ms-md-3 ms-0 _w_100 me-lg-0 me-md-0 me-1">Export</button>
                    <button className="btn _btn_main px-lg-4 px-md-4 mx-0 ms-lg-3 ms-md-3 ms-0 _w_100 ms-lg-0 ms-md-0 ms-1" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-3 mt-lg-0 mt-md-3 mt-3">
            <div className="col-12 mb-2">
              <table className="table table-mobile-sided table-mobile-responsive mb-0">
                <thead>
                  <tr>
                    <th scope="col">
                      <small>VALUE DATA</small>
                    </th>
                    <th scope="col">
                      <small>CREATE DATE</small>
                    </th>
                    <th scope="col">
                      <small>LAST DATE</small>
                    </th>
                    <th scope="col" className='text-end'>
                      <small>ACTIONS</small>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formDatasysystemcode &&
                    formDatasysystemcode.map((item: SystemCodeItem, index: number) => (
                      <tr key={index}>
                        <td data-content="NAME">
                          <div className="d-flex flex-row align-items-center">
                            <div>
                              <small className="pe-3">{item.value_data}</small>
                            </div>
                          </div>
                        </td>
                        <td data-content="CREATE_DATE">
                          <small>{item.cdate}</small>
                        </td>
                        <td data-content="LAST_DATE">
                          <small>{item.ldate}</small>
                        </td>
                        <td data-content="LAST_DATE" className='text-end'>
                          <i data-bs-toggle="dropdown" className="_cursor_pointer fa-solid fa-ellipsis-vertical "></i>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div >
      </div >

    </>
  )
}
Users.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>
}
export default Users
export { getStaticProps } from '@/utils/getStaticProps'
function getSystem() {
  throw new Error('Function not implemented.');
}

