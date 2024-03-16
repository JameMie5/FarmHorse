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

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import Moment from 'moment'

const steps = ['เลือกวัน', 'เลือกเวลา', 'รายละเอียด', 'เลือกโค้ช', 'เลือกม้า', 'เสร็จสิ้น']

interface IFormData {
  contact_id: number
  objid: number
  booking_type: string
  member_objid: number
  booking_name: string
  tel: string
  booking_fdatetime: string
  booking_tdatetime: string
  comein_person: number
  service_person: number
  remarks: string
  support_objid: number
  booking_status: string
  line_id: string

  booking_no: string
  horse_details: string

  coach_details: string

  value_data: string
}

const Users = (): React.JSX.Element => {
  const session: any = useSession()
  const [weightValue, setWeightValue] = useState(0)
  const [PriceValue, setPriceValue] = useState(0)
  const [response, setResponse] = useState<IResponse>(defaultResponse)
  const [formData, setFormData] = useState<IFormData>({
    contact_id: 0,
    objid: 0,
    booking_type: '',
    member_objid: 0,
    booking_name: '',
    tel: '',
    booking_fdatetime: '',
    booking_tdatetime: '',
    comein_person: 0,
    service_person: 0,
    remarks: '',
    support_objid: 0,
    booking_status: '',
    line_id: '',
    booking_no: '',
    horse_details: '',

    coach_details: '',

    value_data: '',
  })

  const [selectedOwnerName, setSelectedOwnerName] = useState<string | undefined>(undefined)
  const [selectedBookingName, setSelectedBookingName] = useState<string | undefined>(undefined)
  const [selecteddates, setSelecteddates] = useState<string | undefined>(undefined)
  const [selectedMemberObjid, setSelectedMemberObjid] = useState<string | undefined>(undefined)
  const [selectedMemberA, setSelectedMemberA] = useState<string | undefined>(undefined)

  const updateField = (e: any) => {
    if (e.target.name === 'member_objid') {
      // ตรวจสอบชื่อของ input ที่เกี่ยวข้อง
      setSelectedMemberObjid(e.target.value)
    }

    if (e.target.name === 'Member') {
      // แก้ไขนี้ ให้เปรียบเทียบ name แทน objid
      setSelectedMemberA(e.target.value)
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
      // แก้ไขนี้ ให้เปรียบเทียบ name แทน objid
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    })
  }

  // GET ShowinfoHorse
  const showinfoHorse = async () => {
    const data: IFetchData = await fetchData(`/Farm/HorseAvailable?contact_id=1`, 'GET', {}, session?.data?.accessToken)
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
    const data: IFetchData = await fetchData(`/Farm/CoachAvailable?contact_id=1`, 'GET', {}, session?.data?.accessToken)
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

  // GET infoBookingName
  const showinfoOwnerName = async () => {
    const data: IFetchData = await fetchData(`/Farm/MemberShipSearch?contact=1`, 'GET', {}, session?.data?.accessToken)
    console.log('abc', data)
    if (data.statusCode === 200) {
      console.log(OwnerNameList)
      setOwnerNameList(data.data.data)
    } else {
      console.error('Error fetching province data:', data.error)
    }
  }
  useEffect(() => {
    showinfoOwnerName()
  }, [session])
  const [OwnerNameList, setOwnerNameList] = useState<IUser>()

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
  const [selectedDate, setSelectedDate] = useState(null) // หรือค่าเริ่มต้นที่คุณต้องการ

  const sendBooking = async () => {
    // POST
    try {
      const _res: IFetchData = await fetchData(
        '/Farm/BookingUpdate',
        'POST',
        {
          contact_id: 1,
          objid: 0,
          booking_type: 'Member',
          member_objid: selectedMember.objid,
          booking_name: selectedMember.name,
          tel: selectedMember.phone,
          booking_fdatetime: selectDate + 'T' + selectTimeStart,
          booking_tdatetime: selectDate + 'T' + selectTimeEnd,
          comein_person: formData.comein_person,
          service_person: formData.service_person,
          remarks: formData.remarks,
          support_objid: 0,
          booking_status: 'WAITING',
          line_id: '',
        },
        session?.data?.accessToken
      )
      if (_res.statusCode == 200) {
        console.log('clickedCoach', typeof clickedCoach)
        try {
          const _resCoach: IFetchData = await fetchData(
            '/Farm/UpdateCoachByBookNo',
            'POST',
            {
              contact_id: 1,
              booking_no: _res.data.data.booking_no,
              coach_details: `[${clickedCoach}]`,  //แบบนี้ก็ใช้ได้ `${JSON.stringify(clickedCoach)}`,
            },
            session?.data?.accessToken
          );
          
          

          console.log('%cindex.tsx line:48 UpdateHorseByBookNo::::::::::::::', 'color: #007acc;', _resCoach)

          if (_resCoach.statusCode === 200 && _resCoach.data.data.err === 'N') {
            console.log()
            setResponse(_resCoach.data)
            Swal.fire({
              title: _resCoach.data.data.title,
              text: _resCoach.data.data.msg,
              icon: _resCoach.data.data.icon,
            })
            getBooking()
          } else {
            Swal.fire({
              title: _resCoach.data.data.title,
              text: _resCoach.data.data.msg,
              icon: _resCoach.data.data.icon,
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
      if (_res.statusCode == 200) {
        console.log('_res.statusCode 200')
        try {
          const _resHorse: IFetchData = await fetchData(
            '/Farm/UpdateHorseByBookNo',
            'POST',
            {
              contact_id: 1,
              booking_no: _res.data.data.booking_no,
              horse_details: `[${clickedHorse}]`,
            },
            session?.data?.accessToken
          )

          console.log('%cindex.tsx line:48 UpdateHorseByBookNo::::::::::::::', 'color: #007acc;', _resHorse)

          if (_resHorse.statusCode === 200 && _resHorse.data.data.err === 'N') {
            console.log()
            setResponse(_resHorse.data)
            Swal.fire({
              title: _resHorse.data.data.title,
              text: _resHorse.data.data.msg,
              icon: _resHorse.data.data.icon,
            })
            getBooking()
          } else {
            Swal.fire({
              title: _resHorse.data.data.title,
              text: _resHorse.data.data.msg,
              icon: _resHorse.data.data.icon,
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

  // const sendHorseByBooking = async (data: any) => {
  //   // POST HorseByBooking
  //   console.log('sendHorseByBooking', data)
  //   try {
  //     const _res: IFetchData = await fetchData(
  //       '/Farm/UpdateHorseByBookNo',
  //       'POST',
  //       {
  //         contact_id: 1,
  //         booking_no: '',
  //         horse_details: '',
  //       },
  //       session?.data?.accessToken
  //     )

  //     console.log('%cindex.tsx line:48 sendUser::::::::::::::', 'color: #007acc;', _res)

  //     if (_res.statusCode === 200 && _res.data.data.err === 'N') {
  //       console.log()
  //       setResponse(_res.data)
  //       Swal.fire({
  //         title: _res.data.data.title,
  //         text: _res.data.data.msg,
  //         icon: _res.data.data.icon,
  //       })
  //       getBooking()
  //     } else {
  //       Swal.fire({
  //         title: _res.data.data.title,
  //         text: _res.data.data.msg,
  //         icon: _res.data.data.icon,
  //       })
  //     }
  //   } catch (error) {
  //     console.error('An error occurred:', error)
  //     Swal.fire({
  //       title: 'Error',
  //       text: 'An error occurred while adding employee. Please try again.',
  //       icon: 'error',
  //     })
  //   }
  // }

  // const sendCoachByBooking = async () => {
  //   // POST HorseByBooking
  //   try {
  //     const _res: IFetchData = await fetchData(
  //       '/Farm/UpdateHorseByBookNo',
  //       'POST',
  //       {
  //         contact_id: 1,
  //         booking_no: '',
  //         coach_details: formData.coach_details,
  //       },
  //       session?.data?.accessToken
  //     )

  //     console.log('%cindex.tsx line:48 sendUser::::::::::::::', 'color: #007acc;', _res)

  //     if (_res.statusCode === 200 && _res.data.data.err === 'N') {
  //       console.log()
  //       setResponse(_res.data)
  //       Swal.fire({
  //         title: _res.data.data.title,
  //         text: _res.data.data.msg,
  //         icon: _res.data.data.icon,
  //       })
  //       getBooking()
  //     } else {
  //       Swal.fire({
  //         title: _res.data.data.title,
  //         text: _res.data.data.msg,
  //         icon: _res.data.data.icon,
  //       })
  //     }
  //   } catch (error) {
  //     console.error('An error occurred:', error)
  //     Swal.fire({
  //       title: 'Error',
  //       text: 'An error occurred while adding employee. Please try again.',
  //       icon: 'error',
  //     })
  //   }
  // }

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

  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined)
  const [selectedmember_name, setSelectedLogin_name] = useState<string | undefined>(undefined)

  const showUserData = (userId: number, member_name: string) => {
    setSelectedUserId(userId)
    setSelectedLogin_name(member_name)
  }

  const breadcrumbItems = [
    { text: 'Booking', href: '/booking' },
    { text: 'AddBooking', href: '/booking/addbooking' },
  ]

  const [showDetails, setShowDetails] = useState(false)
  const [timeSelected, setTimeSelected] = useState(false)
  const [notshowDetails, setNotShowDetails] = useState(true) // เพิ่มสถานะเพื่อเก็บว่าควรแสดงรายละเอียดหรือไม่

  const handleTimeSelection = (index: number) => {
    setShowDetails(true) // เมื่อคลิกเลือกเวลาให้แสดงรายละเอียด
    setNotShowDetails(false)
    setTimeSelected(true)
  }

  // เลือกวัน
  const currentDate = new Date()
  const [selectDate, setSelectDate] = useState<number | null>(null)
  const [selectTimeStart, setSelectTimeStart] = useState<number | null>(null)
  const [selectTimeEnd, setSelectTimeEnd] = useState<number | null>(null)
  const [clickeddate, setClickedIndexdate] = useState<number | null>(null)
  const [clickedIndex, setClickedIndex] = useState<number | null>(null) // กำหนด union type ระหว่าง number และ null ให้กับ state

  const handleClick = (dateObj: { dateTime: string }, index: number) => {
    const setDate: any = Moment(dateObj.dateTime).format('YYYY-MM-DD')
    setClickedIndex(index) 
    setSelectDate(setDate)
    console.log('date', Moment(dateObj.dateTime).format('YYYY-MM-DD'))
  }

  const handleClickDate = (timeObj: string, index: number) => {
    const setTimeStart: any = timeObj.split('-')[0].trim()
    const setTimeEnd: any = timeObj.split('-')[1].trim()
    setSelectTimeStart(setTimeStart)
    setSelectTimeEnd(setTimeEnd)
    setClickedIndexdate(index)
    console.log('Time', timeObj.split('-')[0].trim())
    console.log('Time', timeObj.split('-'))
  }

  const [clickedCoach, setClickedCoach] = useState<number[]>([])

  const handleClickCoach = (coachObjId: number, index: number) => {
    setClickedCoach((prevState) => {
      if (!prevState.includes(coachObjId)) {
        return [...prevState, coachObjId]
      } else {
        return prevState.filter((clickedId) => clickedId !== coachObjId)
      }
    })
  }
  useEffect(() => {
    console.log('date', clickedCoach)
  }, clickedCoach)

  const [clickedHorse, setClickedHorse] = useState<number[]>([])

  const handleClickHorse = (HorseObjId: number, index: number) => {
    setClickedHorse((prevState) => {
      if (!prevState.includes(HorseObjId)) {
        return [...prevState, HorseObjId]
      } else {
        return prevState.filter((clickedId) => clickedId !== HorseObjId)
      }
    })
  }

  useEffect(() => {
    console.log('date', clickedHorse)
  }, clickedHorse)

  // สร้างรายการวันที่
  const dates = []
  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(currentDate.getDate() + i)
    const day = date.toLocaleDateString('th-TH', { weekday: 'long' })
    const dateTime = date.toLocaleDateString('en-TN', { year: 'numeric', month: 'long', day: 'numeric' })
    dates.push({ day, dateTime })
  }

  const params = {
    slidesPerView: 6,
    spaceBetween: 20,
    loop: false,
    allowSlideNext: true,
  }

  // เลือกเวลา
  // GET ShowinfoHorse
  const showTime = async () => {
    const data: IFetchData = await fetchData(`/Farm/SystemValueSearch?contact_id=1&value_code=BOOKING%20TIME`, 'GET', {}, session?.data?.accessToken)
    console.log('abc', data)
    if (data.statusCode === 200) {
      console.log(TimeList)
      setTimeList(data.data.data)
    } else {
      console.error('Error fetching Horse data:', data.error)
    }
  }
  useEffect(() => {
    showTime()
  }, [session])
  const [TimeList, setTimeList] = useState<IUser>()

  // GET ShowinfoCoachAvailable
  const showCoachAvailable = async () => {
    const data: IFetchData = await fetchData(`/Farm/CoachAvailable?contact_id=1`, 'GET', {}, session?.data?.accessToken)
    console.log('abc', data)
    if (data.statusCode === 200) {
      console.log(CoachAvailableList)
      setCoachAvailableList(data.data.data)
    } else {
      console.error('Error fetching Horse data:', data.error)
    }
  }
  useEffect(() => {
    showCoachAvailable()
  }, [session])
  const [CoachAvailableList, setCoachAvailableList] = useState<IUser>()

  // GET ShowinfoHorseAvailable
  const showHorseAvailable = async () => {
    const data: IFetchData = await fetchData(`/Farm/HorseAvailable?contact_id=1`, 'GET', {}, session?.data?.accessToken)
    console.log('abc', data)
    if (data.statusCode === 200) {
      console.log(HorseAvailableList)
      setHorseAvailableList(data.data.data)
    } else {
      console.error('Error fetching Horse data:', data.error)
    }
  }
  useEffect(() => {
    showHorseAvailable()
  }, [session])
  const [HorseAvailableList, setHorseAvailableList] = useState<IUser>()

  const paramsCoch = {
    // ปรับ spaceBetween ตามความเหมาะสมของ UI
    loop: false, // เปิดใช้งาน loop
    allowSlideNext: true, // ให้สามารถเลื่อนไปข้างหน้าได้ถึงสุดท้าย
  }

  //Stepper
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set<number>())

  const isStepOptional = (step: number) => {
    return step === 1
  }

  const isStepSkipped = (step: number) => {
    return skipped.has(step)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const daySwiperRef = React.useRef<any>(null)
  const dateSwiperRef = React.useRef<any>(null)
  const coachSwiperRef = React.useRef<any>(null)
  const horseSwiperRef = React.useRef<any>(null)

  // Day
  const handleNextDay = () => {
    if (daySwiperRef.current && daySwiperRef.current!.swiper) {
      daySwiperRef.current!.swiper.slideNext()
    }
  }

  const handlePrevDay = () => {
    if (daySwiperRef.current && daySwiperRef.current!.swiper) {
      daySwiperRef.current!.swiper.slidePrev()
    }
  }

  // Date
  const handleNextDate = () => {
    if (dateSwiperRef.current && dateSwiperRef.current.swiper) {
      dateSwiperRef.current.swiper.slideNext()
    }
  }

  const handlePrevDate = () => {
    if (dateSwiperRef.current && dateSwiperRef.current.swiper) {
      dateSwiperRef.current.swiper.slidePrev()
    }
  }

  // Coach
  const handleNextCoach = () => {
    if (coachSwiperRef.current && coachSwiperRef.current.swiper) {
      const swiperInstance = coachSwiperRef.current.swiper
      if (swiperInstance.isEnd) {
        // ถ้าอยู่ที่สไลด์สุดท้ายแล้วให้เลื่อนไปที่สไลด์แรก
        swiperInstance.slideToLoop(0)
      } else {
        swiperInstance.slideNext()
      }
    }
  }

  const handlePrevCoach = () => {
    if (coachSwiperRef.current && coachSwiperRef.current.swiper) {
      const swiperInstance = coachSwiperRef.current.swiper
      if (swiperInstance.isBeginning) {
        // ถ้าอยู่ที่สไลด์แรกแล้วให้เลื่อนไปที่สไลด์สุดท้าย
        swiperInstance.slideToLoop(swiperInstance.slides.length - 1)
      } else {
        swiperInstance.slidePrev()
      }
    }
  }

  // Horse
  const handleNextHorse = () => {
    if (coachSwiperRef.current && coachSwiperRef.current.swiper) {
      coachSwiperRef.current.swiper.slideNext()
    }
  }

  const handlePrevHorse = () => {
    if (horseSwiperRef.current && horseSwiperRef.current.swiper) {
      horseSwiperRef.current.swiper.slidePrev()
    }
  }

  const [selectedMember, setSelectedMember] = useState({ objid: '', name: '', phone: '' })
  const [MemberName, setMemberName] = useState('')

  function handleSelectChange(e: any) {
    const selectedValue = e.target.value.split(' ')
    setSelectedMember({
      objid: `${selectedValue[0]}`,
      name: `${selectedValue[1]} ${selectedValue[2]}`,
      phone: selectedValue[3],
    })
    setActiveStep(2)
  }

  const [slidesPerView, setSlidesPerView] = useState(2) // กำหนด slidesPerView เริ่มต้นเป็น 2

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1920) {
        setSlidesPerView(6)
      } else if (window.innerWidth >= 820) {
        setSlidesPerView(4)
      } else if (window.innerWidth >= 375) {
        setSlidesPerView(2)
      } else {
        setSlidesPerView(1)
      }
    }

    handleResize() // เรียกใช้ฟังก์ชัน handleResize ทันทีหลังจากโหลดครั้งแรก

    window.addEventListener('resize', handleResize) // เพิ่ม event listener สำหรับ resize
    return () => window.removeEventListener('resize', handleResize) // ลบ event listener เมื่อ component ถูก unmount
  }, [])

  const [showStepper, setShowStepper] = useState(true) // เริ่มต้นแสดง Stepper

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 990) {
        // ถ้าขนาดหน้าจอน้อยกว่า 375 pixels
        setShowStepper(false) // ซ่อน Stepper
      } else {
        setShowStepper(true) // แสดง Stepper
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <div>
        <div className="col-12 _breadcrumb">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="">
          <Box sx={{ width: '100%' }}>
            {showStepper && (
              <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                  const stepProps: { completed?: boolean } = {}
                  const labelProps: { optional?: React.ReactNode } = {}
                  if (isStepOptional(index)) {
                    labelProps.optional = <Typography variant="caption"></Typography>
                  }
                  if (isStepSkipped(index)) {
                    stepProps.completed = false
                  }
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  )
                })}
              </Stepper>
            )}
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment></React.Fragment>
            )}
          </Box>
        </div>
        <div className="row _rounded5px bg-white my-3 _shadow">
          <div className="">
            <div className="row p-4">
              <h5>เพิ่มการจอง</h5>
            </div>
            <div className="row">
              <div className="col-12 px-0">
                <hr className="my-lg-2 my-md-0 my-0" />
              </div>
              <div className="row mx-1">
                <h5>เลือกวัน</h5>
              </div>
              <div className="p-2">
                <div className="col-12">
                  <div>
                    <div className="swiper-wrapper">
                      <button className="fa-solid fa-chevron-left _iconleft" style={{ marginLeft: '20px' }} onClick={handlePrevDay}></button>
                      <Swiper spaceBetween={-90} slidesPerView={slidesPerView} onSlideChange={() => console.log('slide change')} onSwiper={(swiper) => console.log(swiper)} ref={daySwiperRef}>
                        {dates.map((date, index) => (
                          // eslint-disable-next-line react/jsx-key
                          <SwiperSlide>
                            <div className="col" key={index}>
                              <button
                                type="button"
                                className={`btn-outline bg-white _datebtn mx-5 ${clickedIndex === index ? 'clicked' : ''}`}
                                id="Date"
                                name="cdate"
                                value={selecteddates}
                                onClick={() => {
                                  handleClick(date, index)
                                  setActiveStep(0) // กำหนดให้ไม่มีขั้นตอนที่ถูกเลือกอยู่
                                }}>
                                <p>{date.day}</p>
                                <p>{date.dateTime}</p>
                              </button>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      <button className="fa-solid fa-chevron-right _iconright" onClick={handleNextDay}></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 px-0">
                <hr className="my-lg-2 my-md-0 my-0" />
              </div>
              <div className="row mx-1">
                <h5>เลือกเวลา</h5>
              </div>
              <div className="mt-4">
                <div className="swiper-wrapper">
                  <button className="fa-solid fa-chevron-left _iconleft" style={{ marginLeft: '20px' }} onClick={handlePrevDate}></button>
                  <Swiper spaceBetween={0} slidesPerView={slidesPerView} onSlideChange={() => console.log('slide change')} onSwiper={(swiper) => console.log(swiper)} ref={dateSwiperRef}>
                    {TimeList &&
                      TimeList.map((item: IUser, index: number) => (
                        <SwiperSlide key={index} className="_swiper">
                          <div className="mx-4" style={{ display: 'flex', flexDirection: 'row' }}>
                            <div key={index} className="col" style={{ marginRight: '10px' }} onClick={() => handleTimeSelection(index)}>
                              <button
                                className={`btn date_btn ${clickeddate === index ? 'active' : ''}`}
                                id="booking_fdatetime"
                                name="booking_fdatetime"
                                value={selecteddates}
                                onChange={(e: any) => {
                                  updateField(e)
                                }}
                                onClick={() => {
                                  handleClickDate(item.value_data, index)
                                  setActiveStep(1)
                                }}>
                                {item.value_data}
                              </button>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                  </Swiper>
                  <button className="fa-solid fa-chevron-right _iconright" onClick={handleNextDate}></button>
                </div>
              </div>
            </div>
            {notshowDetails && (
              <div className="row mt-4">
                <div className="col-12 px-0">
                  <hr className="my-lg-2 my-md-0 my-0" />
                </div>
                <div className="row mx-1">
                  <h5>รายละเอียด</h5>
                </div>

                <div className="col-sm-12 col-xl-4 p-4 mb-3">
                  <label htmlFor="Owner Name" className="form-label mb-1">
                    <small className="_text_secondary">สมาชิก</small>
                    <small className="_text_secondary text-danger"> *ถ้าไม่มีเลือก Guest</small>
                  </label>
                  <select disabled className="form-select" id="booking_name" name="booking_name" aria-label=".form-select example">
                    <option selected>กรุณาเลือกเวลา</option>
                  </select>
                </div>
              </div>
            )}

            {showDetails && (
              <div className="row mt-4">
                <div className="col-12 px-0">
                  <hr className="my-lg-2 my-md-0 my-0" />
                </div>
                <div className="row mx-1">
                  <h5>รายละเอียด</h5>
                </div>

                <div className="col-sm-12 col-xl-6 p-4 mb-3">
                  <label htmlFor="Owner Name" className="form-label mb-1">
                    <small className="_text_secondary">สมาชิก</small>
                    <small className="_text_secondary text-danger"> *ถ้าไม่มีเลือก Guest</small>
                  </label>
                  <select
                    onBlur={() => {
                      setActiveStep(2)
                    }}
                    className="form-select"
                    id="member_objid"
                    name="member_objid"
                    aria-label="Member"
                    value={selectedMemberObjid}
                    onChange={(e: any) => {
                      handleSelectChange(e)
                      setActiveStep(2) // เพิ่มบรรทัดนี้
                    }}>
                    <option selected>เลือก</option>
                    {OwnerNameList &&
                      OwnerNameList.map((item: IUser, index: number) => (
                        <option key={index} value={`${item.objid} ${item.fname} ${item.lname} ${item.phone_no}`}>
                          {item.fname} {item.lname}
                        </option>
                      ))}
                  </select>

                  <div className="row mt-3">
                    {OwnerNameList && (
                      <div className="col-12 mb-2 _aaaaa">
                        <label htmlFor="Horse Name" className="form-label mb-1">
                          <small className="_text_secondary">Member_Objid</small>
                          <small className="text-danger mx-1">*</small>
                        </label>
                        <input
                          readOnly
                          type="text"
                          className="form-control"
                          id="member_objid"
                          name="member_objid"
                          placeholder="Horse Name"
                          value={`${selectedMember.objid || ''}`}
                          onChange={(e: any) => {
                            updateField({ objid: 'member_objid', value: e.target.value })
                          }}
                        />
                      </div>
                    )}
                    {OwnerNameList && (
                      <div className="col-6 mb-2">
                        <label htmlFor="Horse Name" className="form-label mb-1">
                          <small className="_text_secondary">ชื่อการจอง</small>
                          <small className="text-danger mx-1">*</small>
                        </label>
                  
                        <input
                          disabled
                          readOnly
                          type="text"
                          className="form-control"
                          id="booking_name"
                          name="booking_name"
                          placeholder="Booking Name"
                          value={selectedMember.name}
                          onChange={(e: any) => {
                            updateField({ name: e.target.name, value: e.target.value })
                          }}
                        />
                      </div>
                    )}
                    <div className="col-6 mb-2">
                      <label htmlFor="Horse Name" className="form-label mb-1">
                        <small className="_text_secondary">เบอร์โทร</small>
                        <small className="text-danger mx-1">*</small>
                      </label>
                      
                      {OwnerNameList && (
                        <input
                          disabled
                          readOnly
                          type="text"
                          className="form-control"
                          id="tel"
                          name="tel"
                          placeholder="Phone Number"
                          value={selectedMember.phone || ''}
                          onChange={(e: any) => {
                            updateField(e)
                          }}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-2">
                      <div className="col-12 mb-2">
                        <div className="col-12 mb-2 position-relative">
                          <label htmlFor="weight" className="form-label mb-1">
                            <small className="_text_secondary">เข้ามากี่คน</small>
                            <small className="text-danger mx-1">*</small>
                          </label>
                          <div className="d-flex align-items-center">
                            <input
                              type="text"
                              className="form-control _inout_wight"
                              id="comein_person"
                              name="comein_person"
                              placeholder="Comein"
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

                    <div className="col-6 mb-2">
                      <div className="col-12 mb-2">
                        <div className="col-12 mb-2 position-relative">
                          <label htmlFor="Price" className="form-label mb-1">
                            <small className="_text_secondary">ใช้บริการกี่คน</small>
                            <small className="text-danger mx-1">*</small>
                          </label>
                          <div className="d-flex align-items-center">
                            <input
                              type="text"
                              className="form-control _inout_wight"
                              id="service_person"
                              name="service_person"
                              placeholder="Service"
                              value={PriceValue}
                              onChange={(e: any) => {
                                updateField(e)
                                setPriceValue(e.target.value)
                              }}
                            />
                            <div className="d-flex flex-column align-items-center icon_b ">
                              <i
                                className="fa-solid fa-caret-up _icon_Up"
                                onClick={() => setPriceValue((prevValue) => prevValue + 1)}
                                style={{
                                  border: 'none',
                                  cursor: 'pointer',
                                }}></i>
                              <i
                                className="fa-solid fa-caret-down _icon_Down"
                                onClick={() => setPriceValue((prevValue) => prevValue - 1)}
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
                      <label htmlFor="Background" className="form-label mb-1">
                        <small className="_text_secondary">หมายเหตุ</small>
                      </label>
                      <textarea
                        className="form-control"
                        id="remarks"
                        name="remarks"
                        placeholder="blackgurod"
                        onChange={(e: any) => {
                          updateField(e)
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showDetails && (
              <div className="row mt-4">
                <div className="col-12 px-0">
                  <hr className="my-lg-2 my-md-0 my-0" />
                </div>
                <div className="row p-4">
                  <h5>เลือกโค้ช</h5>
                </div>
                <div className="swiper-wrapper">
                  <button className="fa-solid fa-chevron-left _iconleft" style={{ marginLeft: '20px' }} onClick={handlePrevCoach}></button>
                  <Swiper {...paramsCoch} spaceBetween={-90} slidesPerView={slidesPerView} onSlideChange={() => console.log('slide change')} onSwiper={(swiper) => console.log(swiper)} ref={coachSwiperRef}>
                    {' '}
                    {CoachList &&
                      CoachList.map((item: IUser, index: number) => (
                        <SwiperSlide key={index} className="mx-5" style={{ flexDirection: 'column' }}>
                          <div className="p-4">
                            <div className="card card_img" style={{ width: '230px' }}>
                              <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}> {item.image_profile ? <img className="me-2 _Image_pro" src={item.image_profile} width="100%" alt="user-demo" /> : <img className="me-2 _Image_pro" src="/img/profile-demo.png" width={230} height={232} alt="user-demo" />}</div>
                              <div className="card-body">
                                <h5 className="card-title">{item.coach_name}</h5>
                                <a
                                  className={`btn btn-primary col-12 _btn_main ${clickedCoach.includes(item.coach_objid) ? 'clicked' : ''}`}
                                  id="coach_details"
                                  onClick={() => {
                                    setActiveStep(3)
                                    handleClickCoach(item.coach_objid, index) // ให้แน่ใจว่าค่า item.coach_objid ถูกส่งให้ handleClickCoach และไม่มีข้อผิดพลาดในการส่งค่า
                                  }}>
                                  Select
                                </a>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                  </Swiper>
                  <button className="fa-solid fa-chevron-right _iconright" onClick={handleNextCoach}></button>
                </div>
              </div>
            )}
            {showDetails && (
              <div className="row mt-4">
                <div className="col-12 px-0">
                  <hr className="my-lg-2 my-md-0 my-0" />
                </div>
                <div className="row p-4">
                  <h5>เลือกม้า</h5>
                  <div className="swiper-wrapper">
                    <button className="fa-solid fa-chevron-left _iconleft" style={{ marginLeft: '20px' }} onClick={handlePrevHorse}></button>
                    <Swiper {...paramsCoch} spaceBetween={-80} slidesPerView={slidesPerView} onSlideChange={() => console.log('slide change')} onSwiper={(swiper) => console.log(swiper)} ref={horseSwiperRef}>
                      {' '}
                      {HorseList &&
                        HorseList.map((item: IUser, index: number) => (
                          <SwiperSlide key={index} className="mx-5" style={{ flexDirection: 'column' }}>
                            <div className="p-4">
                              <div className="card card_img" style={{ width: '230px' }}>
                                <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}> {item.image_profile ? <img className="me-2 _Image_pro" src={item.image_profile} width="100%" alt="user-demo" /> : <img className="me-2 _Image_pro" src="/img/profile-demo.png" width={230} height={232} alt="user-demo" />}</div>
                                <div className="card-body">
                                  <h5 className="card-title">{item.horse_name}</h5>
                                  <div className="d-flex justify-content-between">
                                  <a
                                  className={`btn btn-primary col-12 _btn_main ${clickedHorse.includes(item.horse_objid) ? 'clicked' : ''}`}
                                  id="coach_details"
                                  onClick={() => {
                                    setActiveStep(5)
                                    handleClickHorse(item.horse_objid, index) // ให้แน่ใจว่าค่า item.coach_objid ถูกส่งให้ handleClickCoach และไม่มีข้อผิดพลาดในการส่งค่า
                                  }}>
                                  Select
                                </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        ))}
                    </Swiper>
                    <button className="fa-solid fa-chevron-right _iconright" onClick={handleNextHorse}></button>
                  </div>
                </div>
                <div className="p-4"></div>
              </div>
            )}
          </div>
          <div className="p-4">
            <button
              className="btn _btn_A"
              onClick={() => {
                sendBooking()
              }}>
              Sumit
            </button>
          </div>
        </div>
      </div>

      {/* modal */}
      {HorseList &&
        HorseList.map((item: IUser, index: number) => (
          // eslint-disable-next-line react/jsx-key
          <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Details
                  </h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">{item.horse_name}ddcdcdc</div>
              </div>
            </div>
          </div>
        ))}
    </>
  )
}
Users.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>
}
export default Users
export { getStaticProps } from '@/utils/getStaticProps'
