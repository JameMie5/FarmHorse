import { useRouter } from 'next/router'
import { fetchData } from '@/utils/fetchData'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useSession } from 'next-auth/react'
import { IUser, defaultUser } from '@/types/user'
import { type IResponse, defaultResponse, IFetchData } from '@/types/response'
import Breadcrumb from '@/components/breadcrumb'

import MainLayout from '@/layouts/main'
import React, { ChangeEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'
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
}

const Em_Profile = (): React.JSX.Element => {
  const router = useRouter()
  const session: any = useSession()
  const [userList, setUserList] = useState<IUser[]>([])
  const [imageProfile, setImageProfile] = useState<string | null>(null)
  const [PicturePoolList, setPicturePoolList] = useState<IUser[]>([])
  const [PicturePoolImage, setPicturePoolImage] = useState<any>([])
  const [imageDataProfile, setImageDataProfile] = useState<string | null>(null)

  const [formMember, setformMember] = useState<IProfile>({
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

  const showinfoprofile = async () => {
    try {
      const data: IFetchData = await fetchData(`/Farm/MemberShipSearch?contact_id=1&objid=${router.query.objid}`, 'GET', {}, session?.data?.accessToken)
      console.log('response::::::', data)
      if (data.statusCode === 200) {
        console.log(userList)
        setUserList(data.data.data)
        try {
          const temp: IFetchData = await fetchData(`/Farm/PicturePoolSearch?contact_id=1&image_link_key=${data.data.data[0].image_link_key}`, 'GET', {}, session?.data?.accessToken) //&image_link_key=${router.query.image_link_key}
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
        console.error('Error fetching user data:', data.error)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }
  useEffect(() => {
    showinfoprofile()
  }, [session])

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
            window.location.reload() // รีเฟรชหน้าเว็บหลังจากที่ลบข้อมูลเรียบร้อยแล้ว
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

  const [showDeleteButton, setShowDeleteButton] = useState(false)

  const breadcrumbItems = [
    { text: 'Membership ', href: '/membership' },
    { text: 'Proflie', href: '/membership/Profile' },
  ]
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined)
  const [selectedMemberCode, setSelectedMemberCode] = useState<string | undefined>(undefined);
  const [selectedFname, setSelectedFname] = useState<string | undefined>(undefined);
  const [selectedLname, setSelectedLname] = useState<string | undefined>(undefined);
  const [selectedSex, setSelectedSex] = useState<string | undefined>(undefined);
  const [selectedPhoneNo, setSelectedPhoneNo] = useState<string | undefined>(undefined);
  const [selectedEmail, setSelectedEmail] = useState<string | undefined>(undefined);
  const [selectedBirthdate, setSelectedBirthdate] = useState<string | undefined>(undefined);
  const [selectedStartMemberDate, setSelectedStartMemberDate] = useState<string | undefined>(undefined);
  const [selectedStopMemberDate, setSelectedStopMemberDate] = useState<string | undefined>(undefined);
  const [selectedExpiryMemberDate, setSelectedExpiryMemberDate] = useState<string | undefined>(undefined);
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(undefined);
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>(undefined);
  const [selectedZipcode, setSelectedZipcode] = useState<string | undefined>(undefined);
  const [selectedMemberLevel, setSelectedMemberLevel] = useState<string | undefined>(undefined);
  const [selectedMemberStatus, setSelectedMemberStatus] = useState<string | undefined>(undefined);
  const [selectedLineId, setSelectedLineId] = useState<string | undefined>(undefined);
  const showEditUserData = (
    userId: number,
    member_code: string,
    fname: string,
    lname: string,
    phone_no: string,
    sex: string,
    email: string,
    birthdate: string,
    start_member_date: string,
    stop_member_date: string,
    expiry_member_date: string,
    address: string,
    province: string,
    zipcode: string,
    member_level: string,
    member_status: string,
    line_id: string
  ) => {
    setSelectedUserId(userId);
    setSelectedMemberCode(member_code);
    setSelectedFname(fname);
    setSelectedLname(lname);
    setSelectedPhoneNo(phone_no);
    setSelectedSex(sex);
    setSelectedEmail(email);
    setSelectedBirthdate(birthdate);
    setSelectedStartMemberDate(start_member_date);
    setSelectedStopMemberDate(stop_member_date);
    setSelectedExpiryMemberDate(expiry_member_date);
    setSelectedAddress(address);
    setSelectedProvince(province);
    setSelectedZipcode(zipcode);
    setSelectedMemberLevel(member_level);
    setSelectedMemberStatus(member_status);
    setSelectedLineId(line_id);
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
  const updateField = (e: any) => {
    console.log('e.target.name:::::::::::',e.target.name)
    if (e.target.name === 'employee_status') {
      setSelectedMemberStatus(e.target.value);
    }
    if (e.target.name === 'position') {
      setSelectedMemberLevel(e.target.value);
    }
    if (e.target.name === 'province') {
      setSelectedProvince(e.target.value);
    }
    if (e.target.name === 'sex') {
      setSelectedSex(e.target.value);
    }
    setformMember({
      ...formMember,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null)
  const [selectedStopDate, setSelectedStopDate] = useState<Date | null>(null)
  const [selectedExpiryDate, setSelectedExpiryDate] = useState<Date | null>(null)

  const sendMemberShip = async (userId: number) => {
    console.log("userId",userId)
    // POST
    try {
      const _res: IFetchData = await fetchData(
        '/Farm/MemberShipUpdate',
        'POST',
        {
          contact: 1,
          objid: userId,
          member_code: selectedMemberCode,
          image_profile: imageProfile,
          sex: selectedSex,
          fname: selectedFname,
          lname: selectedLname,
          phone_no: selectedPhoneNo,
          email: selectedEmail,
          birthdate: selectedBirthdate,
          start_member_date: selectedStartMemberDate,
          stop_member_date: selectedStopMemberDate,
          expiry_member_date: selectedExpiryMemberDate,
          address: selectedAddress,
          province: selectedProvince,
          zipcode: selectedZipcode,
          member_level: selectedMemberLevel,
          member_status: selectedMemberStatus,
          line_id: selectedLineId,
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
  const [response, setResponse] = useState<IResponse>(defaultResponse)

  return (
    <>
      <div className="row _breadcrumb">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div>
        <div className="row">
          {userList && userList.length && (
            <div className="col-12 mx-2">
              <div className="row">
                <div className="p-0">
                  <Link href={`/membership/Profile?objid=${userList[0].objid}`}>
                    <button type="button" className="btn mx-1 btn_menu">
                      <i className="fa-solid fa-bell mx-1"></i>Profile
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        {userList &&
          userList.map((M_item) => (
            // eslint-disable-next-line react/jsx-key
            <div className="row top_profile">
              <div className="col-xl-4 col-lg-12 col-md-12 col-12 p-4">
                <div className="row _rounded5px bg-white p-3 gx-3 _shadow">
                  <div className="col-12">
                    <div className="text-center pe-3 mt-5">
                      <img className="_img_profile" src="/img/profile-demo.png" width={100} height={100} alt="user-demo" />
                    </div>
                    <div className="text-center ">
                      <div className="mt-3 pe-3 name_lastname">
                        {M_item.fname} {M_item.lname}
                      </div>
                      <div className="_nickname mt-3">
                        <small>{M_item.member_level}</small>
                      </div>
                      <div className="col-12 d-flex justify-content-evenly details mt-5">
                        <div className="col-6  mt-1" style={{ display: 'flex', alignItems: 'center' }}>
                          <i className="fa-solid fa-phone-volume icon_horse"></i>
                          <div className="mx-1">
                            <div className="text-start _head_text">
                              <small>Tel</small>
                              <div className="_text_details">
                                <small>{M_item.phone_no}</small>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-6  mt-1" style={{ display: 'flex', alignItems: 'center' }}>
                          <i className="fa-solid fa-briefcase icon_horse"></i>
                          <div className="mx-1">
                            <div className="text-start _head_text">
                              <small>Email</small>
                              <div className="_text_details">
                                <small>{M_item.email}</small>
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
                        Nickname: <small className="_font_">{M_item.nickname}</small>
                      </p>
                      <p className="_font_deteil">
                        Birth Date: <small className="_font_">{M_item.birthdate}</small>
                      </p>
                      <p className="_font_deteil">
                        Gender: <small className="_font_">{M_item.sex}</small>
                      </p>
                      <p className="_font_deteil">
                        Background: <small className="_font_">{M_item.background}</small>
                      </p>
                      <p className="_font_deteil">
                        Start Job Date: <small className="_font_">{M_item.start_job_date}</small>
                      </p>
                      <p className="_font_deteil">
                        Stop Job Date: <small className="_font_">{M_item.stop_job_date}</small>
                      </p>
                      <p className="_font_deteil">
                        Employee Code: <small className="_font_">{M_item.employee_code}</small>
                      </p>
                      <p className="_font_deteil">
                        Personal ID: <small className="_font_">{M_item.personal_id}</small>
                      </p>
                      <p className="_font_deteil">
                        Address: <small className="_font_">{M_item.address}</small>
                      </p>
                      <p className="_font_deteil">
                        Province: <small className="_font_">{M_item.province}</small>
                      </p>
                      <p className="_font_deteil">
                        Position: <small className="_font_">{M_item.position}</small>
                      </p>
                      <p className="_font_deteil">
                        Zipcode: <small className="_font_">{M_item.zipcode}</small>
                      </p>
                    </div>
                    <div className="d-flex justify-content-center mt-4">
                      <div className="mx-2">
                      <button
                        type="button"
                        className="btn btn-sm edit_" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRighte" aria-controls="offcanvasRight"
                        onClick={() => showEditUserData(
                          M_item?.objid || '',
                          M_item?.member_code || '',
                          M_item?.fname || '',
                          M_item?.lname || '',
                          M_item?.phone_no || '',
                          M_item?.sex || '',
                          M_item?.email || '',
                          M_item?.birthdate || '',
                          M_item?.start_member_date || '',
                          M_item?.stop_member_date || '',
                          M_item?.expiry_member_date || '',
                          M_item?.address || '',
                          M_item?.province || '',
                          M_item?.zipcode || '',
                          M_item?.member_level || '',
                          M_item?.member_status || '',
                          M_item?.line_id || ''
                        )}
                      >
                        <i className="fa-solid fa-pen-to-square" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRighte" aria-controls="offcanvasRight"></i> Edit
                      </button>
                      </div>
                      <div className="mx-2">
                        <button type="button" className="btn btn-danger btn-sm delete_ " data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight_MemberDelete" aria-controls="offcanvasRight">
                          <i className="fa-solid fa-trash-can mx-1"></i> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="offcanvas offcanvas-end" id="offcanvasRighte" aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header">
          <h5 id="offcanvasRightLabel" className="_text_secondary">
            Edit Member
          </h5>

          <div className="px-2 py-1 _btn_export _rounded5px _cursor_pointer" data-bs-dismiss="offcanvas" aria-label="Close">
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>
        {/* {selectedUserId} */}
        <div className="offcanvas-body"> <div className="image-upload-container">
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
                    value={selectedMemberCode}
                    placeholder="Member Code"
                    onChange={(e) => setSelectedMemberCode(e.target.value)}
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
                    value={selectedFname}
                    placeholder="Member Code"
                    onChange={(e) => setSelectedFname(e.target.value)}
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
                    value={selectedLname}
                    placeholder="Member Code"
                    onChange={(e) => setSelectedLname(e.target.value)}
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
                    value={selectedPhoneNo}
                    placeholder="Member Code"
                    onChange={(e) => setSelectedPhoneNo(e.target.value)}
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
                    value={selectedEmail}
                    placeholder="Member Code"
                    onChange={(e) => setSelectedEmail(e.target.value)}
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
                    value={selectedBirthdate ? selectedBirthdate.toString().slice(0, 10) : ''}
                    onChange={(e: any) => {
                      setSelectedBirthdate(e.target.value)
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
                    value={selectedLineId}
                    placeholder="Member Code"
                    onChange={(e) => setSelectedLineId(e.target.value)}
                  />
                </div>

                <div className="col-12 mb-2">
                  <label htmlFor="Start Member Date" className="form-label mb-1">
                    <small className="_text_secondary">Start Member Date</small>
                  </label>
                  <input
                    type="date"
                    value={selectedStartMemberDate ? selectedStartMemberDate.toString().slice(0, 10) : ''}
                    onChange={(e: any) => {
                      updateField(e)
                      handleStartDateChange(e)
                      setSelectedStartMemberDate(e.target.value)
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
                    value={selectedStopMemberDate ? selectedStopMemberDate.toString().slice(0, 10) : ''}
                    onChange={(e: any) => {
                      updateField(e)
                      handleStopDateChange(e)
                      setSelectedStopMemberDate(e.target.value)
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
                    value={selectedExpiryMemberDate ? selectedExpiryMemberDate.toString().slice(0, 10) : ''}
                    onChange={(e: any) => {
                      updateField(e)
                      handleExpiryDateChange(e)
                      setSelectedExpiryMemberDate(e.target.value)
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
                    value={selectedAddress}
                    placeholder="Member Code"
                    onChange={(e) => setSelectedAddress(e.target.value)}
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
                    value={selectedZipcode}
                    placeholder="Member Code"
                    onChange={(e) => setSelectedZipcode(e.target.value)}
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
                    onChange={(e) => updateField(e)}
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
                    value={selectedMemberStatus}
                    onChange={(e) => setSelectedMemberStatus(e.target.value)}
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
                    onChange={(e) => setSelectedMemberLevel(e.target.value)}
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
                    onClick={() => sendMemberShip(Number(selectedUserId))}>
                    <small>Submit</small>
                  </button>

                  <button className="btn _btn_export px-3" data-bs-dismiss="offcanvas">
                    <small>Cancel</small>
                  </button>
                </div>
              </div>
          
        </div>
      </div>
              <div className="col-xl-8 col-lg-12 col-md-12 col-12 p-4">
                <div className="row _rounded5px bg-white _shadow">
                  <div className="col-12 p-3 d-flex justify-content-between ">
                    <h5>Profile </h5>
                    <button className="btn btn_menu" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight_UploadImagesMemberShip" aria-controls="offcanvasRight">
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
                                    <button type="button" onClick={() => DeletePicture(Number(M_item.objid))} style={{ position: 'absolute', top: '10px', right: '50px', borderRadius: '5px', }} className="btn btn-danger btn-sm">
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
      {/* Delete Infomation */}
      <div className="offcanvas offcanvas-end" id="offcanvasRight_MemberDelete" aria-labelledby="offcanvasRightLabel">
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
      <div className="offcanvas offcanvas-end" id="offcanvasRight_UploadImagesMemberShip" aria-labelledby="offcanvasRightLabel">
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
                  <div key={index} style={{position: 'relative', display: 'inline-block'}}>
                    <div
                      className="col-3 row"
                      style={{
                        position: 'relative',
                        width: '280px',
                        height: '250px',
                        overflow: 'hidden',
                        objectFit: 'cover',
                        borderRadius: '10px',
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
              <button className="Upload btn btn_Upload"  onClick={() => {
                  SendPicture()
                }}>Upload</button>
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
