import React, { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import LoginLayout from '@/layouts/login'
import { checkValidateField, removeErrorValidateField, validateField } from '@/utils/validateField'
import Swal from 'sweetalert2'
import Image from 'next/image'



interface IFormData {
  phoneNo: string
  password: string
}
const Login = (): React.JSX.Element => {
  //  next
  const router = useRouter()
  const session: any = useSession()
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<IFormData>({
    phoneNo: '',
    password: '',
  })
  const [errorList, setErrorList] = useState<string[]>([])

  useEffect(() => {
    console.log('%cindex.tsx line:16 phoneNo', 'color: #007acc;', errorList)
  }, [errorList])

  const updateField = (e: any) => {
    const _errorList = removeErrorValidateField(errorList, e.target.name)
    setErrorList([..._errorList])
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    })
  }
  //  Process functions
  const handleSubmit = async (e: any) => {
    const _validate = validateField([
      {
        key: 'phoneNo',
        value: formData?.phoneNo,
        type: 'notBlank',
      },
      {
        key: 'password',
        value: formData?.password,
        type: 'notBlank',
      },
    ])
    if (_validate.status) {
      try {
        const _response: any = await signIn('APP', {
          phoneNo: formData.phoneNo,
          password: formData.password,
          redirect: false,
        })
        console.log('%cindex.tsx line:77 _response', 'color: #007acc;', _response)
        if (_response.ok) {
          Swal.fire({
            customClass: {
              title: 'text-primary',
            },
            title: 'Successfully',
            text: 'Successfully',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000,
          })
        } else {
          Swal.fire({
            customClass: {
              title: 'text-danger',
            },
            title: 'Error',
            text: 'login *not* completed (Login name or password not correct)',
            icon: 'error',
            timer: 1000,
          })
        }
      } catch (error) {
        // Handle errors
        console.error('Error during form submission:', error)
      }
    } else {
      setErrorList(_validate.data)
    }
  }

  useEffect(() => {
    if (session.status === 'authenticated' && session.data.user.user._xcp == true) {
      setTimeout(() => {
        router.push('/change_password')
      }, 1000)
    }
    if (session.status === 'authenticated' && session.data.user.user._xcp == false) {
      setTimeout(() => {
        router.push('/')
      }, 1000)
    }
  }, [router, session])

  return (
    <>
      <div className="row mx-0">
        <div className="col-xl-4 col-lg-6 col-md-7 col-12 mx-auto">
          <div className="row mx-0 px-3 py-5 bg-white _rounded15px _shadow">
            <div className="col-6 mx-auto mb-2 d-flex justify-content-center">
              <Image src="/logo-more.png"
                width={200}
                height={100}
                style={{ width: '200%', height: 'auto' }}
                alt="Logo" />
            </div>
            <div className="col-12 mb-2 mt-4 text-center">
              <small>Hey, Enter your details to get sign in to your account</small>
            </div>

            <div className="col-12 mb-2">
              <input
                type='text'
                className={`form-control form-control-lg _border_input ${checkValidateField(errorList, 'phoneNo') ? 'border-danger' : ''}`}
                value={formData.phoneNo}
                name="phoneNo"
                placeholder="username"
                onChange={(e: any) => {
                  updateField(e)
                }}

              />

            </div>
            <div className="col-12 mb-2" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control form-control-lg _border_input ${checkValidateField(errorList, 'password') ? 'border-danger' : ''}`}
                value={formData.password}
                name="password"
                placeholder="password"
                onChange={(e: any) => {
                  updateField(e)
                }}
                style={{ paddingRight: '40px' }} // ให้เพิ่มพื้นที่ด้านขวาของ input
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="_btn_eye"
                style={{
                  position: 'absolute',
                  right: '20px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? (
                  <i className="fa-solid fa-eye-slash"></i>
                ) : (
                  <i className="fa-solid fa-eye"></i>
                )}
              </button>
            </div>

            <div className="col-12 mt-2">
              <button className="btn _btn_main form-control btn-lg" onClick={handleSubmit}>
                <small>Sign in</small>
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center pt-2">
              <p className="mb-0">
                <small>
                  © Copyright{' '}
                  <a href="https://www.unicorntechint.com/" target="_black">
                    Unicorn Tech Integration
                  </a>{' '}
                  2023. All Rights Reserved
                </small>
              </p>
              <p className="mb-0">
                <small>
                  <a href="https://www.unicorntechint.com/privacy/pdpa/" target="_black">
                    Terms, Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="https://www.unicorntechint.com/privacy/cookie/" target="_black">
                    Cookies Policy.
                  </a>
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Login.getLayout = function getLayout(page: any) {
  return <LoginLayout>{page}</LoginLayout>
}
export default Login
export { getStaticProps } from "@/utils/getStaticProps"
