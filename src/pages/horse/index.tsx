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
  contact_id: number
  objid: number
  owner_objid: number
  owner_name: string
  horse_code: string
  image_profile: string
  passport_id: string
  horse_name: string
  birthdate: string
  sex: string
  fur_color: string
  breed: string
  country_origin: string
  weight: number
  price: number
  horse_status: string
  image_link_key: string

  value_data: string;
}

const Membership = (): React.JSX.Element => {
  const session: any = useSession()
  const [weightValue, setWeightValue] = useState(0)
  const [pricetValue, setPricetValue] = useState(0)

  const [response, setResponse] = useState<IResponse>(defaultResponse)
  const [imageDataProfile, setImageDataProfile] = useState<string | null>(null)
  const [HorseNameValue, setHorseNameValue] = useState<string | null>(null)

  const [imageProfile, setImageProfile] = useState<string | null>(null)
  const [formData, setFormData] = useState<IFormData>({
    contact_id: 0,
    objid: 0,
    owner_objid: 0,
    horse_code: '',
    owner_name: '',
    image_profile: '',
    passport_id: '',
    horse_name: '',
    birthdate: '',
    sex: '',
    fur_color: '',
    breed: '',
    country_origin: '',
    weight: 0,
    price: 0,
    horse_status: '',
    image_link_key: '',

    value_data: ''
  })

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value))
  }

  const [selectedBreed, setSelectedBreed] = useState<number | undefined>(undefined)
  const [selectedCountryOrigin, setSelectedCountryOrigin] = useState<string | undefined>(undefined)
  const [selectedOwnerName, setSelectedOwnerName] = useState<number | undefined>(undefined)

  const [selectedHorseStatus, setSelectedHorseStatus] = useState<string | undefined>(undefined)

  const updateField = (e: any) => {

    if (e.target.name === 'breed') {
      setSelectedBreed(e.target.value);
    }

    if (e.target.name === 'country_origin') {
      setSelectedCountryOrigin(e.target.value);
    }

    if (e.target.name === 'owner_name') {
      setSelectedOwnerName(e.target.value);
    }

    if (e.target.name === 'horse_name') {
      setSelectedHorseStatus(e.target.value);
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    })
  }
  const Sendhorse = async () => {
    // POST
    console.log('imageProfile', imageProfile)
    try {
      const _res: IFetchData = await fetchData('/Farm/HorseUpdate', 'POST', {
        contact_id: 1,
        objid: 0,
        owner_objid: selectedOwnerName,
        horse_code: formData.horse_code,
        image_profile: imageProfile,
        passport_id: formData.passport_id,
        horse_name: HorseNameValue,
        birthdate: formData.birthdate,
        sex: formData.sex,
        fur_color: formData.fur_color,
        breed: formData.breed,
        country_origin: formData.country_origin,
        weight: formData.weight,
        price: formData.price,
        horse_status: selectedHorseStatus,
        image_link_key: '',
      }, session?.data?.accessToken)

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

  const [EmployeeList, setEmpolyeeList] = useState<IUser[]>([])
  const u = useTranslations('TEXT')
  const b = useTranslations('BUTTON')
  const s = useTranslations('TEXT-INPUT')

  const getEmployeeList = async () => {
    const data: IFetchData = await fetchData('/Farm/HorseSearch?contact_id=1', 'GET', {}, session?.data?.accessToken)
    console.log('%cindex.tsx line:19 _res ::::::::::::::::::::::', 'color: #007acc;', data?.data?.data)
    if (data.statusCode === 200) {
      setEmpolyeeList(data.data.data)
    }
  }
  useEffect(() => {
    getEmployeeList()
  }, [session])

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


  // GET infoBreed
  const showinfoBreed = async () => {
    const data: IFetchData = await fetchData(`/Farm/SystemValueSearch?contact_id=1&value_code=BREED`, 'GET', {}, session?.data?.accessToken)
    console.log('abc', data)
    if (data.statusCode === 200) {
      console.log(BreedList)
      setBreedList(data.data.data)
    } else {
      console.error('Error fetching province data:', data.error)
    }
  }
  useEffect(() => {
    showinfoBreed()
  }, [session])
  const [BreedList, setBreedList] = useState<IUser>()

  // GET infoCountryOrigin
  const showinfoCountryOrigin = async () => {
    const data: IFetchData = await fetchData(`/Farm/SystemValueSearch?contact_id=1&value_code=Country%20Origin`, 'GET', {}, session?.data?.accessToken)
    console.log('abc', data)
    if (data.statusCode === 200) {
      console.log(CountryOriginList)
      setCountryOriginList(data.data.data)
    } else {
      console.error('Error fetching province data:', data.error)
    }
  }
  useEffect(() => {
    showinfoCountryOrigin()
  }, [session])
  const [CountryOriginList, setCountryOriginList] = useState<IUser>()

  // GET infoOwnerName
  const showinfoOwnerName = async () => {
    const data: IFetchData = await fetchData(`/Farm/MemberShipSearch?contact=1`, 'GET', {}, session?.data?.accessToken)
    console.log('abc', data)
    if (data.statusCode === 200) {
      console.log("OwnerNameListll",data)
      setOwnerNameList(data.data.data)
    } else {
      console.error('Error fetching province data:', data.error)
    }
  }
  useEffect(() => {
    showinfoOwnerName()
  }, [session])
  const [OwnerNameList, setOwnerNameList] = useState<IUser>()

  // GET infoHorseStatus
  const showinfoHorseStatus = async () => {
    const data: IFetchData = await fetchData(`/Farm/SystemValueSearch?contact_id=1&value_code=HORSE%20STATUS`, 'GET', {}, session?.data?.accessToken)
    console.log('abc', data)
    if (data.statusCode === 200) {
      console.log(HorseStatusList)
      setHorseStatusList(data.data.data)
    } else {
      console.error('Error fetching province data:', data.error)
    }
  }
  useEffect(() => {
    showinfoHorseStatus()
  }, [session])
  const [HorseStatusList, setHorseStatusList] = useState<IUser>()

  return (
    <>
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
                      <small>{u('Hose')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('Price')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('Weight')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('Ownername')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('Passportid')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('Status')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('Createdate')}</small>
                    </th>
                    <th scope="col">
                      <small>{u('Lastdate')}</small>
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
                        <td data-content="Hose">
                          <div className="d-flex flex-row align-items-center">
                            {item.image_profile ? <img className="rounded-circle me-2" src={item.image_profile} width={40} height={40} alt="user-demo" /> : <img className="rounded-circle me-2" src="/img/profile-demo.png" width={40} height={40} alt="user-demo" />}
                            <div>
                              <small className="pe-3">{item.horse_name}</small>
                              <div>
                                <small className="font_size">{item.horse_code}</small>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td data-content="Price">
                          <small>{item.price}</small>
                        </td>
                        <td data-content="Weight">
                          <small>{item.weight}</small>
                        </td>
                        <td data-content="Ownername">
                          <small>{item.owner_name}</small>
                        </td>
                        <td data-content="Passportid">
                          <small>{item.passport_id}</small>
                        </td>
                        <td data-content="Status">
                          <small>{item.horse_status}</small>
                        </td>
                        <td data-content="Createdate">
                          <small>{item.cdate}</small>
                        </td>
                        <td data-content="Lastdate">
                          <small>{item.ldate}</small>
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
                              <Link href={`/horse/profile?objid=${item.objid}`}>
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
              {/* {imageDataProfile && <img src={imageDataProfile} width={100} height={100} alt="Preview" />} */}
              {imageProfile && <img src={imageProfile} width={100} height={100} alt="Uploaded" />}
              {!imageDataProfile && !imageProfile && <img className="_img_profile" src="/img/profile-demo.png" width={100} height={100} alt="Preview" />}
            </label>
          </div>
          <div className="row">
            <div className="col-12 mb-2">
              <label htmlFor="Horse Code" className="form-label mb-1">
                <small className="_text_secondary">Horse Code</small>
                <small className="text-danger mx-1">*</small>
              </label>
              <input
                type="text"
                className="form-control"
                id="horse_code"
                name="horse_code"
                placeholder="Horse Code"
                onChange={(e: any) => {
                  updateField(e)
                }}
              />
            </div>
            <div className="col-12 mb-2">
              <label htmlFor="Horse Name" className="form-label mb-1">
                <small className="_text_secondary">Horse Name</small>
                <small className="text-danger mx-1">*</small>
              </label>
              <input
                type="text"
                className="form-control"
                id="horse_name"
                name="horse_name"
                placeholder="Horse Name"
                value={HorseNameValue ?? ''}  // Use the nullish coalescing operator to provide an empty string if horseNameValue is null
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateField(e);
                  setHorseNameValue(e.target.value);
                }}
              />

            </div>

            <div className="col-12 mb-2">
              <label htmlFor="Passport ID" className="form-label mb-1">
                <small className="_text_secondary">Passport ID</small>
                <small className="text-danger mx-1">*</small>
              </label>
              <input
                type="text"
                className="form-control"
                id="passport_id"
                name="passport_id"
                placeholder="Passport ID"
                onChange={(e: any) => {
                  updateField(e)
                }}
              />
            </div>

            <div className="col-12 mb-2">
              <div className="col-12 mb-2">
                <div className="col-12 mb-2 position-relative">
                  <label htmlFor="weight" className="form-label mb-1">
                    <small className="_text_secondary">Weight</small>
                    <small className="text-danger mx-1">*</small>
                  </label>
                  <div className="d-flex align-items-center">
                    <input
                      type="text"
                      className="form-control _inout_wight"
                      id="weight"
                      name="weight"
                      placeholder="Weight"
                      value={weightValue}
                      onChange={(e: any) => {
                        updateField(e)
                        setWeightValue(e.target.value)
                      }}
                    />
                    <div className="d-flex flex-column align-items-center icon_b ">
                      <i
                        className="fa-solid fa-caret-up _icon_Up"
                        onClick={() => setWeightValue((prevValue) => prevValue + 1)}
                        style={{
                          border: 'none',
                          cursor: 'pointer',
                        }}></i>
                      <i
                        className="fa-solid fa-caret-down _icon_Down"
                        onClick={() => setWeightValue((prevValue) => prevValue - 1)}
                        style={{
                          border: 'none',
                          cursor: 'pointer',
                        }}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 mb-2">
              <div className="col-12 mb-2">
                <div className="col-12 mb-2 position-relative">
                  <label htmlFor="Price" className="form-label mb-1">
                    <small className="_text_secondary">Price</small>
                    <small className="text-danger mx-1">*</small>
                  </label>
                  <div className="d-flex align-items-center">
                    <input
                      type="text"
                      className="form-control _inout_wight"
                      id="price"
                      name="price"
                      placeholder="Price"
                      value={pricetValue}
                      onChange={(e: any) => {
                        updateField(e)
                        setPricetValue(e.target.value)
                      }}
                    />
                    <div className="d-flex flex-column align-items-center icon_b ">
                      <i
                        className="fa-solid fa-caret-up _icon_Up"
                        onClick={() => setPricetValue((prevValue) => prevValue + 1)}
                        style={{
                          border: 'none',
                          cursor: 'pointer',
                        }}></i>
                      <i
                        className="fa-solid fa-caret-down _icon_Down"
                        onClick={() => setPricetValue((prevValue) => prevValue - 1)}
                        style={{
                          border: 'none',
                          cursor: 'pointer',
                        }}></i>
                    </div>
                  </div>
                </div>
              </div>
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
              <label htmlFor="Fur Color" className="form-label mb-1">
                <small className="_text_secondary">Fur Color</small>
              </label>
              <input
                type="text"
                className="form-control"
                id="fur_color"
                name="fur_color"
                placeholder="Fur Color"
                onChange={(e: any) => {
                  updateField(e)
                }}
              />
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="Breed" className="form-label mb-1">
                <small className="_text_secondary">Breed</small>
              </label>
              <select
                className="form-select"
                id="breed"
                name="breed"
                value={selectedBreed}
                onChange={(e: any) => {
                  updateField(e)
                }}
                aria-label=".form-select example">
                <option selected>Open this select menu</option>
                {BreedList &&
                  BreedList.map((item: IUser, index: number) => (
                    <option key={index} value={item.value_data}>
                      {item.value_data}
                    </option>
                  ))}
              </select>
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="Country Origin" className="form-label mb-1">
                <small className="_text_secondary">Country Origin</small>
              </label>
              <select
                className="form-select"
                id="country_origin"
                name="country_origin"
                value={selectedCountryOrigin}
                onChange={(e: any) => {
                  updateField(e)
                }}
                aria-label=".form-select example">
                <option selected>Open this select menu</option>
                {CountryOriginList &&
                  CountryOriginList.map((item: IUser, index: number) => (
                    <option key={index} value={item.value_data}>
                      {item.value_data}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-12 mb-3">
              <label htmlFor="Owner Name" className="form-label mb-1">
                <small className="_text_secondary">Owner Name</small>
              </label>
              
              <select
                className="form-select"
                id="owner_name"
                name="owner_name"
                value={selectedOwnerName}
                onChange={(e: any) => {
                  updateField(e)
                }}
                aria-label=".form-select example"
              >

                <option selected>Open this select menu</option>
                {OwnerNameList &&
                  OwnerNameList.map((item: IUser, index: number) => (
                    <option key={index} value={item.objid}>
                      {item.fname}
                    </option>
                  ))}
              </select>
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="Horse Status" className="form-label mb-1">
                <small className="_text_secondary">Horse Status</small>
              </label>
              <select
                className="form-select"
                id="horse_name"
                name="horse_name"
                value={selectedHorseStatus}
                onChange={(e: any) => {
                  updateField(e)
                }}
                aria-label=".form-select example">
                <option selected>Open this select menu</option>
                {HorseStatusList &&
                  HorseStatusList.map((item: IUser, index: number) => (
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
                  Sendhorse()
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
