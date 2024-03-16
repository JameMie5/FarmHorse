import { useRouter } from 'next/router'
import { fetchData } from '@/utils/fetchData'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useSession } from 'next-auth/react'
import { IUser, defaultUser } from '@/types/user'
import { type IResponse, defaultResponse, IFetchData } from '@/types/response'

import MainLayout from '@/layouts/main'
import React, { ChangeEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'
import Breadcrumb from '@/components/breadcrumb'
import axios from 'axios'
import 'lightbox.js-react/dist/index.css'
import { SlideshowLightbox } from 'lightbox.js-react'

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

  ref_image_link: string
  ref_file_objid: number
  private_flag: true
}

const Em_Profile = (): React.JSX.Element => {
  const router = useRouter()
  const session: any = useSession()
  const [userList, setUserList] = useState<IUser[]>([])
  const [getImagesList, setImagesList] = useState<IUser[]>([])
  const [PicturePoolList, setPicturePoolList] = useState<IUser[]>([])
  const [PicturePoolImage, setPicturePoolImage] = useState<any>([])
  const [imageUrl, setimageUrl] = useState<string[]>([])
  const [imageDataProfile, setImageDataProfile] = useState<string | null>(null)
  const [imageProfileLink, setImageProfileLink] = useState<string | null>(null)
  const [imageProfile, setImageProfile] = useState<string | null>(null)
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

    ref_image_link: '',
    ref_file_objid: 0,
    private_flag: true,
  })
  //GET Infomation Profile
  const showinfoprofile = async () => {
    try {
      const data: IFetchData = await fetchData(`/Farm/EmployeeSearch?contact_id=1&objid=${router.query.objid}`, 'GET', {}, session?.data?.accessToken)
      console.log('showinfoprofile::::::', data)
      if (data.statusCode === 200) {
        console.log(userList)
        if (Array.isArray(data.data.data)) {
          setUserList(data.data.data)

          try {
            const temp: IFetchData = await fetchData(`/Farm/PicturePoolSearch?contact_id=1&image_link_key=${data.data.data[0].image_link_key}`, 'GET', {}, session?.data?.accessToken)
            console.log('response::::::')
            if (temp.statusCode === 200) {
              console.log(PicturePoolList)
              setPicturePoolList(temp.data.data)
            } else {
              console.error('Error fetching user data:', temp.error)
            }
          } catch (error) {
            console.error('Error fetching user data:', error)
          }
        } else {
          console.error('Data from API is not an array:', data.data.data)
        }
      } else {
        console.error('Error fetching user data:')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  // Update Picture
  const SendPicture = async () => {
    console.log('PicturePoolImage::::ACB1235', PicturePoolImage)
    try {
      const promises = PicturePoolImage.map(async (imageUrl: any) => {
        const data: IFetchData = await fetchData(
          `/Farm/PicturePoolUpdate`,
          'POST',
          {
            contact_id: 1,
            objid: 0,
            image_link_key: '',
            ref_image_link: imageUrl,
            ref_file_objid: 0,
            private_flag: true,
          },
          session?.data?.accessToken
        )
        return data
      })

      const results = await Promise.all(promises)
      console.log('SentPicture::::::::::::', results)
      const successResults = results.filter((result) => result.statusCode === 200)
      if (successResults.length > 0) {
        const updatedUserList = successResults.map((result) => result.data.data)
        setUserList(updatedUserList)
      } else {
        console.error('Error fetching user data:')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  // DELETE Picture
  const DeletePicture = async (userId: number) => {
    try {
      const _res: IFetchData = await fetchData(
        `/Farm/PicturePoolDelete`,
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
          }).then(() => {})
          showinfoprofile()
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

  // DELETE Infomation
  const deleteEmployee = async (userId: number) => {
    try {
      const _res: IFetchData = await fetchData(
        `/Farm/EmployeeDelete`,
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
            //window.location.reload() // รีเฟรชหน้าเว็บหลังจากที่ลบข้อมูลเรียบร้อยแล้ว
          })
          showinfoprofile()
          window.history.back() // เด้งกลับไปหน้าที่ผ่านมาหลังจากลบข้อมูลสำเร็จ
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

  useEffect(() => {
    showinfoprofile()
  }, [session])

  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const previewImageProfile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData()
    const input = event.target
    const imageUrl = []

    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i]
        formData.append('file', file)

        const reader = new FileReader()
        console.log('ABC.......', input.files[i])

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
          console.log('uploadImageProfile', uploadImageProfile)

          imageUrl.push(`${process.env.API_URL}/File/DownloadFile/${uploadImageProfile.data.data.objid}`)
          // setImageProfile(imageUrl)
          setPicturePoolImage(imageUrl)
          console.log('setImageProfile', imageUrl)
          // console.log('imageProfile', imageProfile)
        } catch (error) {
          console.error('Error uploading image:', error)
        }
      }
    }
  }
  const sendEmployee = async (userId: number) => {
    // POST
    try {
      const _res: IFetchData = await fetchData(
        '/Farm/EmployeeUpdate',
        'POST',
        {

          contact_id: 1,
          objid: userId,
          employee_code: selectemployeeCode,
          image_profile: imageProfile,
          fname: selectfname,
          lname: selectlname,
          nickname: selectnickname,
          background: selectbackground,
          sex: selectedSex,
          phone_no:phoneNo,
          email:selectemail,
          birthdate: selectbirthdate,
          personal_id: personalId,
          start_job_date: startJobDate,
          stop_job_date: stopJobDate,
          address: selectaddress,
          province: selectedProvince,
          zipcode: selectzipcode,
          position: selectedPosition,
          employee_status: selectedEmployeeStatus,
          image_link_key: 'string'
        },
        session?.data?.accessToken
      )

      console.log('%cindex.tsx line:48 sendUser::::::::::::::', 'color: #007acc;', _res)

      if (_res.statusCode === 200 && _res.data.data.err === 'N') {
        console.log()
        setFormData(_res.data)
        Swal.fire({
          title: _res.data.data.title,
          text: _res.data.data.msg,
          icon: _res.data.data.icon,
        })
        showinfoprofile()
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
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImages = e.target.files
    if (selectedImages) {
      const imageFiles = Array.from(selectedImages)
      setImages(imageFiles)

      const previews = imageFiles.map((image) => URL.createObjectURL(image))
      setImagePreviews(previews)
      previewImageProfile(e)
    }
  }

  const handleDeleteImage = (index: number) => {
    const updatedImages = [...images]
    updatedImages.splice(index, 1)
    setImages(updatedImages)

    const updatedPreviews = [...imagePreviews]
    updatedPreviews.splice(index, 1)
    setImagePreviews(updatedPreviews)
  }

  const handleUpload = () => {
    const formData = new FormData()
    images.forEach((image) => {
      formData.append('images', image)
    })
    // ทำการส่ง formData ไปยังเซิร์ฟเวอร์ เช่น โดยใช้ fetch หรือ axios
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
    const formattedDate = `${day} ${monthName} ${year}`
    return formattedDate
  }

  const [showDeleteButton, setShowDeleteButton] = useState(false)

  const breadcrumbItems = [
    { text: 'Employee ', href: '/employee' },
    { text: 'Proflie', href: '/employee/Proflie' },
  ]

  // function updateField(e: any) {
  //   throw new Error('Function not implemented.')
  // }
  const updateField = (e: any) => {
    if (e.target.name === 'province') {
      setSelectedProvince(e.target.value);
    }


    if (e.target.name === 'position') {
      setSelectedPosition(e.target.value);
    }

    if (e.target.name === 'employee_status') {
      setSelectedEmployeeStatus(e.target.value);
    }
    if (e.target.name === 'sex') {
      setSelectedSex(e.target.value);
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    })
  }
  const [selectemployeeCode, setEmployeeCode] = useState<string | undefined>(undefined);
  const [selectfname, setFname] = useState<string | undefined>(undefined);
  const [selectlname, setLname] = useState<string | undefined>(undefined);
  const [selectnickname, setNickname] = useState<string | undefined>(undefined);
  const [selectbackground, setBackground] = useState<string | undefined>(undefined);
  const [selectedSex, setSelectedSex] = useState<string | undefined>(undefined);
  const [phoneNo, setPhoneNo] = useState<string | undefined>(undefined);
  const [selectemail, setEmail] = useState<string | undefined>(undefined);
  const [selectbirthdate, setBirthdate] = useState<string | undefined>(undefined);
  const [personalId, setPersonalId] = useState<string | undefined>(undefined);
  const [selectaddress, setAddress] = useState<string | undefined>(undefined);
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>(undefined)
  const [selectzipcode, setZipcode] = useState<string | undefined>(undefined);
  const [startJobDate, setStartJobDate] = useState<string | undefined>(undefined);
  const [stopJobDate, setStopJobDate] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null)
  const [selectedStopDate, setSelectedStopDate] = useState<Date | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined)
  const [selectedPosition, setSelectedPosition] = useState<string | undefined>(undefined)
  const [selectedEmployeeStatus, setSelectedEmployeeStatus] = useState<string | undefined>(undefined)

  const showEditUserData = (

    userId: number,
    employee_code: string,
    fname: string,
    lname: string,
    nickname: string,
    background: string,
    sex: string,
    phone_no: string,
    email: string,
    birthdate: string,
    personal_id: string,
    start_job_date: string,
    stop_job_date: string,
    address: string,
    province: string,
    zipcode: string,
    position: string,
    employee_status: string
  ) => {
    setStopJobDate(stop_job_date);
    setStartJobDate(start_job_date);
    setSelectedUserId(userId);
    setEmployeeCode(employee_code);
    setFname(fname);
    setLname(lname);
    setNickname(nickname);
    setBackground(background);
    setSelectedSex(sex);
    setPhoneNo(phone_no);
    setEmail(email);
    setBirthdate(birthdate);
    setPersonalId(personal_id);
    setAddress(address);
    setSelectedProvince(province);
    setZipcode(zipcode);
    setSelectedPosition(position);
    setSelectedEmployeeStatus(employee_status);
  }
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value))
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStartDate(new Date(e.target.value))
  }

  const handleStopDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStopDate(new Date(e.target.value))
  }
  const showinfoprovince = async () => {
    const data: IFetchData = await fetchData(`/Farm/SystemValueSearch?contact_id=1&value_code=PROVINCE&start_recs=1&stop_recs=100`, 'GET', {}, session?.data?.accessToken)
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
  return (
    <>
      <div className="row _breadcrumb">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div>
        <div className="row">
          {userList &&
            userList.map((user) => (
              <div className="col-12" key={user.objid}>
                <div className="row">
                  <div className="">
                    <Link href={`/employee/Profile?objid=${user.objid}`}>
                      <button type="button" className="btn mx-1 btn_menu">
                        <i className="fa-solid fa-user mx-1"></i>Profile
                      </button>
                    </Link>
                    <Link href={`/employee/booking?objid=${user.objid}`}>
                      <button type="button" className="btn mx-1 btn_menu_">
                        <i className="fa-solid fa-calendar-days mx-1"></i>Booking
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="col-12">
          {userList &&
            userList.map((E_item) => (
              // eslint-disable-next-line react/jsx-key
              <div className="row top_profile">
                <div className="col-xl-4 col-lg-12 col-md-12 col-12 p-4">
                  <div className="row _rounded5px bg-white p-3 _shadow">
                    <div className="col-12">
                      <div className="text-center pe-3 mt-5">{E_item.image_profile ? <img className="img_profile me-2" src={E_item.image_profile} width={100} height={100} alt="user-demo" /> : <img className="img_profile me-2" src="/img/profile-demo.png" width={100} height={100} alt="user-demo" />}</div>
                      <div className="text-center ">
                        <div className="mt-3 pe-3 name_lastname">
                          {E_item.fname} {E_item.lname}
                        </div>
                        <div className="_nickname mt-3">
                          <p className={E_item.employee_status === 'online' ? 'text-success' : E_item.employee_status === 'offline' ? 'text-danger' : ''}>{E_item.employee_status}</p>
                        </div>
                        <div className="col-12 details">
                          <div className="col-xl-6  col-sm-12-row mt-1" style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="fa-solid fa-phone-volume icon_horse"></i>
                            <div className="mx-1">
                              <div className="text-start _head_text">
                                <small>Tel</small>
                                <div className="_text_details">
                                  <small>{E_item.phone_no}</small>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-6  col-sm-12-row mt-1" style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="fa-solid fa-envelope icon_horse"></i>
                            <div className="mx-1">
                              <div className="text-start _head_text">
                                <small>Email</small>
                                <div className="_text_details">
                                  <small>{E_item.email}</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div>
                        <p className="_font_deteil">DETAILS</p>
                        <br />
                        <p className="_font_deteil">
                          Tel: <small className="_font_">{E_item.phone_no}</small>
                        </p>
                        <p className="_font_deteil">
                          Gender: <small className="_font_">{E_item.sex}</small>
                        </p>
                        <p className="_font_deteil">
                          Email: <small className="_font_">{E_item.email}</small>
                        </p>
                        <p className="_font_deteil">
                          Nickname: <small className="_font_">{E_item.nickname}</small>
                        </p>
                        <p className="_font_deteil">
                          Birth Date: <small className="_font_">{formatDate(E_item.birthdate)}</small>
                        </p>
                        <p className="_font_deteil">
                          Gender: <small className="_font_">{E_item.sex}</small>
                        </p>
                        <p className="_font_deteil">
                          Background: <small className="_font_">{E_item.background}</small>
                        </p>
                        <p className="_font_deteil">
                          Start Job Date: <small className="_font_">{formatDate(E_item.start_job_date)}</small>
                        </p>
                        <p className="_font_deteil">
                          Stop Job Date: <small className="_font_">{formatDate(E_item.stop_job_date)}</small>
                        </p>
                        <p className="_font_deteil">
                          Employee Code: <small className="_font_">{E_item.employee_code}</small>
                        </p>
                        <p className="_font_deteil">
                          Personal ID: <small className="_font_">{E_item.personal_id}</small>
                        </p>
                        <p className="_font_deteil">
                          Address: <small className="_font_">{E_item.address}</small>
                        </p>
                        <p className="_font_deteil">
                          Province: <small className="_font_">{E_item.province}</small>
                        </p>
                        <p className="_font_deteil">
                          Position: <small className="_font_">{E_item.position}</small>
                        </p>
                        <p className="_font_deteil">
                          Zipcode: <small className="_font_">{E_item.zipcode}</small>
                        </p>
                      </div>
                      <div className="d-flex justify-content-center mt-4">
                        <div className="mx-2">
                        <button type="button" className="btn btn-sm edit_" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRightEm_Edit" aria-controls="offcanvasRight" onClick={() => showEditUserData(
                          E_item?.objid || '',
                          E_item?.employee_code || '',
                          E_item?.fname || '',
                          E_item?.lname || '',
                          E_item?.nickname || '',
                          E_item?.background || '',
                          E_item?.sex || '',
                          E_item?.phone_no || '',
                          E_item?.email || '',
                          E_item?.birthdate || '',
                          E_item?.personal_id || '',
                          E_item?.start_job_date || '',
                          E_item?.stop_job_date || '',
                          E_item?.address || '',
                          E_item?.province || '',
                          E_item?.zipcode || '',
                          E_item?.position || '',
                          E_item?.employee_status || ''
                        )}>
                          <i className="fa-solid fa-pen-to-square"></i> Edit
                        </button>
                        </div>
                        <div className="mx-2">
                          <button type="button" className="btn btn-danger btn-sm delete_ " data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight_Delete" aria-controls="offcanvasRight">
                            <i className="fa-solid fa-trash-can mx-1"></i> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-8 col-lg-12 col-md-12 col-12 p-4">
                  <div className="row _rounded5px bg-white _shadow">
                    <div className="col-12 p-3 d-flex justify-content-between ">
                      <h5>Profile </h5>
                      <button className="btn btn_menu" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight_UploadImages" aria-controls="offcanvasRight">
                        <i className="fa-solid fa-images mx-1 "></i>Upload Image
                      </button>
                    </div>
                    <hr />
                    <div className="col-12 p-3 d-flex flex-wrap">
                      {PicturePoolList &&
                        PicturePoolList.map((M_item) => (
                          // eslint-disable-next-line react/jsx-key
                          <div className="col-3">
                            <div>
                              <div
                                className="col-3 row"
                                style={{
                                  position: 'relative',
                                  width: '280px',
                                  height: '250px',
                                  overflow: 'hidden',
                                  borderRadius: '5px',
                                  padding: '5px',
                                }}
                                onMouseEnter={() => setShowDeleteButton(true)}
                                onMouseLeave={() => setShowDeleteButton(false)}>
                                <SlideshowLightbox showThumbnails={true}>
                                  <img
                                    src={M_item.ref_image_link}
                                    className="Image_Previwe"
                                    style={{
                                      borderRadius: '5px',
                                      position: 'absolute',
                                      width: '80%',
                                      height: '80%',
                                      objectFit: 'cover', // ปรับขนาดภาพให้เต็มพื้นที่ของคอนเทนเนอร์โดยไม่มีการตัดเป็นชิ้น ๆ
                                    }}
                                    alt="Preview"
                                  />
                                </SlideshowLightbox>
                                {showDeleteButton && (
                                  <div className="mx-2">
                                    <button type="button" onClick={() => DeletePicture(Number(M_item.objid))} style={{ position: 'absolute', top: '10px', right: '50px', borderRadius: '5px' }} className="btn btn-danger btn-sm">
                                      <i className="fa-solid fa-trash-can mx-1"></i>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* Edit Infomation */}
      <div className="offcanvas offcanvas-end" id="offcanvasRightEm_Edit" aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header">
          <h5 id="offcanvasRightLabel" className="_text_secondary">
            Edit User
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
                value={selectemployeeCode}
                placeholder="Employee Code"
                onChange={(e) => setEmployeeCode(e.target.value)}

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
                value={selectfname}
                placeholder="First Name"
                 onChange={(e) => setFname(e.target.value)}
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
                value={selectlname}
                name="lname"
                placeholder="Last Name"
                 onChange={(e) => setLname(e.target.value)}
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
                value={selectnickname}
                placeholder="Nickname"
                 onChange={(e) => setNickname(e.target.value)}
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
                value={phoneNo}
                placeholder="Tel"
                 onChange={(e) => setPhoneNo(e.target.value)}
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
                value={selectemail}
                placeholder="Email"
                 onChange={(e) => setEmail(e.target.value)}
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
                    value={selectedSex}
                    onChange={(e) => setSelectedSex(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>


                <div className="col-12 mb-2">
                  <label htmlFor="birthDate" className="form-label mb-1">
                    <small className="_text_secondary">Birth Date</small>
                  </label>
                  <input
                    type="date"
                    value={selectbirthdate ? selectbirthdate.toString().slice(0, 10) : ''}
                    onChange={(e: any) => {
                      setBirthdate(e.target.value)
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
                value={selectbackground}
                placeholder="Background"
                 onChange={(e) => setBackground(e.target.value)}
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
                value={personalId}
                placeholder="Personal ID"
                 onChange={(e) => setPersonalId(e.target.value)}
              />
            </div>

            <div className="col-6 mb-2">
              <label htmlFor="Start Job Date" className="form-label mb-1">
                <small className="_text_secondary">Start Job Date</small>
              </label>
              <input
                type="date"
                value={startJobDate ? startJobDate.toString().slice(0, 10) : ''}
                onChange={(e: any) => {
                  updateField(e)
                  handleStartDateChange(e)
                  setStartJobDate(e.target.value)

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
                value={stopJobDate ? stopJobDate.toString().slice(0, 10) : ''}
                onChange={(e: any) => {
                  updateField(e)
                  handleStopDateChange(e)
                  setStopJobDate(e.target.value)

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
                value={selectaddress}
                placeholder="Address"
                 onChange={(e) => setAddress(e.target.value)}
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
                value={selectzipcode}
                placeholder="Zipcode"
                 onChange={(e) => setZipcode(e.target.value)}
              />
            </div>
            {selectedProvince}
            <div className="col-12 mb-3">
                  <label htmlFor="Province" className="form-label mb-1">
                    <small className="_text_secondary">Province</small>
                  </label>
                  <select
                    className="form-select"
                    id="province"
                    name="province"
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
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
                 onChange={(e) => setSelectedPosition(e.target.value)}
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
                 onChange={(e) => setSelectedEmployeeStatus(e.target.value)}
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
                onClick={() => sendEmployee(Number(selectedUserId))}>
                <small>Submit</small>
              </button>
              <button className="btn _btn_export px-3" data-bs-dismiss="offcanvas">
                <small>Cancel</small>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Delete Infomation */}
      <div className="offcanvas offcanvas-end" id="offcanvasRight_Delete" aria-labelledby="offcanvasRightLabel">
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
            <div className="col-12 mb-2">
              <label htmlFor="Username" className="form-label mb-1"></label>
              <div className="text-start">
                <span style={{ display: 'block' }}>
                  Do you want to delete <span className="_fname_">{userList[0]?.fname}</span> ?
                </span>
              </div>
              <div className="mt-4">
                <button className="btn btn-danger" onClick={() => deleteEmployee(Number(userList[0]?.objid))}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Upload_Image */}
      <div className="offcanvas offcanvas-end" id="offcanvasRight_UploadImages" aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header">
          <p id="offcanvasRightLabel" className="_text_secondary">
            Upload Image
          </p>
          <div className="px-2 py-1 _btn_export _rounded5px _cursor_pointer" data-bs-dismiss="offcanvas" aria-label="Close">
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>
        <div className="offcanvas-body">
          <div className="row p-3">
            <div className="image-upload-container Upload_">
              <input type="file" id="upload-input" className="file-input " name="image_profile" onChange={handleImageChange} accept="image/*" multiple />
              <label htmlFor="upload-input" className="upload-label">
                {images.length === 0 && <img className="Upload" src="/img/Upload_Image.png" width={150} height={160} alt="Preview" />}
                {imagePreviews.map((preview, index) => (
                  <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                    <div
                      className="col-3 row"
                      style={{
                        position: 'relative',
                        width: '280px',
                        height: '280px',
                        overflow: 'hidden',
                        objectFit: 'cover',
                        borderRadius: '5px',
                        padding: '10px',
                      }}>
                      <img className="Preview_Image_Upload" src={preview} alt={`Preview ${index}`} style={{ maxWidth: '300px', maxHeight: '250px' }} />
                    </div>
                    <button className="btn btn-danger delete_image" onClick={() => handleDeleteImage(index)} style={{ position: 'absolute', top: '20px', right: '20px' }}>
                      <i className="fa-solid fa-delete-left"></i>
                    </button>
                  </div>
                ))}
              </label>
            </div>

            <div
              className="d-flex justify-content-start"
              style={{
                width: '200px',
              }}>
              <button
                className="Upload btn btn_Upload"
                onClick={() => {
                  SendPicture()
                }}>
                Upload
              </button>
              <button className="Upload mx-3 btn btn-light btn_Cancel">Cancel</button>
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
