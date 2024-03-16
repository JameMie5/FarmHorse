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
import axios from 'axios'
import Breadcrumb from '@/components/breadcrumb'
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
  const [PicturePoolList, setPicturePoolList] = useState<IUser[]>([])
  const [PicturePoolImage, setPicturePoolImage] = useState<any>([])
  const [imageDataProfile, setImageDataProfile] = useState<string | null>(null)
  const [imageProfile, setImageProfile] = useState<string | null>(null)
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

  const showinfoprofile = async () => {
    try {
      const data: IFetchData = await fetchData(`/Farm/HorseSearch?contact_id=1&objid=${router.query.objid}`, 'GET', {}, session?.data?.accessToken)
      console.log('response::::::', data)
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

  // DELETE Infomation
  const deleteEmployee = async (userId: number) => {
    try {
      const _res: IFetchData = await fetchData(
        `/Farm/HorseDelete`,
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

  useEffect(() => {
    showinfoprofile()
  }, [session])

  const breadcrumbItems = [
    { text: 'Horse', href: '/horse' },
    { text: 'Profile', href: '/horse/profile' },
  ]

  return (
    <>
      <div className="_breadcrumb">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div>
        <div className="row">
          {userList &&
            userList.map((E_item) => (
              <div className="col-12 mx-3">
                <div className="row">
                  <div className="p-0">
                    <Link href={`/horse/profile?objid=${E_item.objid}`}>
                      <button type="button" className="btn mx-1 btn_menu">
                        <i className="fa-solid fa-bell mx-1"></i>Profile
                      </button>
                    </Link>
                    <Link href={`/horse/booking?objid=${E_item.objid}`}>
                      <button type="button" className="btn mx-1 ">
                        <i className="fa-solid fa-user mx-1"></i>Booking
                      </button>
                    </Link>
                    <Link href={`/horse/caretaker_history?objid=${E_item.objid}`}>
                      <button type="button" className="btn mx-1 ">
                        <i className="fa-solid fa-hat-cowboy mx-1"></i>Caretaker History
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {userList &&
          userList.map((E_item) => (
            <div className="row top_profile">
              <div className="col-xl-4 col-lg-12 col-md-12 col-12 p-4">
                <div className="row _rounded5px bg-white p-3 gx-3 _shadow">
                  <div className="col-12">
                    <div className="text-center pe-3 mt-5">
                      <img className="_img_profile" src="/img/profile-demo.png" width={100} height={100} alt="user-demo" />
                    </div>
                    <div className="text-center ">
                      <div className="mt-3 pe-3 name_lastname">{E_item.horse_name}</div>
                      <div className="_nickname mt-3">
                        <small>{E_item.horse_code}</small>
                      </div>
                      <div className="col-12 d-flex justify-content-evenly details mt-5">
                        <div className="col-6 _bg mt-1" style={{ display: 'flex', alignItems: 'center' }}>
                          <i className="fa-solid fa-horse icon_horse"></i>
                          <div className="mx-4">
                            <div className="text-start">
                              <small>20</small>
                              <div>
                                <small>Horses</small>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-6 _bg mt-1" style={{ display: 'flex', alignItems: 'center' }}>
                          <i className="fa-solid fa-briefcase icon_horse"></i>
                          <div className="mx-4">
                            <div className="text-start">
                              <small>20</small>
                              <div>
                                <small>Projects</small>
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
                    </div>
                    <div className="d-flex justify-content-center mt-4">
                      <div className="mx-2">
                        <button type="button" className="btn btn-sm edit_">
                          <i className="fa-solid fa-pen-to-square"></i> Edit
                        </button>
                      </div>
                      <div className="mx-2">
                        <button type="button" className="btn btn-danger btn-sm delete_ " data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight_Delete_Horse" aria-controls="offcanvasRight">
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
                    <button className="btn btn_menu" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight_UploadImagesHorse" aria-controls="offcanvasRight">
                      <i className="fa-solid fa-images mx-1 "></i>Upload Image
                    </button>
                  </div>
                  <hr />
                  <div className="col-12 p-3 d-flex flex-wrap">
                    {PicturePoolList &&
                      PicturePoolList.map((M_item) => (
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
      {/* Upload_Image */}
      <div className="offcanvas offcanvas-end" id="offcanvasRight_UploadImagesHorse" aria-labelledby="offcanvasRightLabel">
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
                {images.length === 0 && <img className="Upload" src="/img/Upload_Image.png" width={150} height={160} alt="Preview"/>}
                {imagePreviews.map((preview, index) => (
                  <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
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
      {/* Delete Infomation */}
      <div className="offcanvas offcanvas-end" id="offcanvasRight_Delete_Horse" aria-labelledby="offcanvasRightLabel">
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
                  Do you want to delete <span className="_fname_">{userList[0]?.horse_name}</span> ?
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
    </>
  )
}
Em_Profile.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>
}
export default Em_Profile
export { getStaticProps } from '@/utils/getStaticProps'
