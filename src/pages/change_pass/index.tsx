import React, { useEffect, useState } from 'react'
import { IResponse, defaultResponse, IFetchData } from '@/types/response'
import { useRouter } from 'next/router'
import LoginLayout from '@/layouts/login'
import { fetchData } from '@/utils/fetchData'
import Swal from 'sweetalert2'
import { useSession } from 'next-auth/react'

interface IFormData {
  cpassword: string
  npassword: string
  rpassword: string
}

const ChangePass = (): React.JSX.Element => {
  const router: any = useRouter()
  const session: any = useSession()
  const [cpassword, setCPassword] = useState('');
  const [npassword, setNPassword] = useState('');
  const [rpassword, setRPassword] = useState('');
  const [offcanvasVisible, setOffcanvasVisible] = useState(true)

  const [showPassword, setShowPassword] = useState({
    cpassword: false,
    npassword: false,
    rpassword: false,
  })
  const [formData, setFormData] = useState<IFormData>({
    cpassword: '',
    npassword: '',
    rpassword: '',
  })
  const updateField = (e: any, field: string) => {
    setFormData({
      ...formData,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    })
  }
  const sendPassword = async () => {
    // POST
    const _res: IFetchData = await fetchData(
      '/Security/ChangeMyPassword',
      'POST',
      {
        cpassword: formData.cpassword,
        npassword: formData.npassword,
        rpassword: formData.rpassword,
      },
      session.data.accessToken
    )
    console.log('%cindex.tsx line:48 _res::::::::::::::', 'color: #007acc;', _res)
    if (_res.statusCode === 200 && _res.data.data.err == 'N') {
      Swal.fire({
        title: _res.data.data.title,
        text: _res.data.data.msg,
        icon: _res.data.data.icon,
      }).then((result) => {
        if (result.isConfirmed) {
          setOffcanvasVisible(false);
          setCPassword('');
          setNPassword('');
          setRPassword('');
        }
      });
    } else {
      Swal.fire({
        title: _res.data.data.title,
        text: _res.data.data.msg,
        icon: _res.data.data.icon,
      })
    }
  }
  return (
    <>
    <div className="offcanvas offcanvas-end" id="offcanvasRighta" aria-labelledby="offcanvasRightLabel">
      <div className="offcanvas-header">
        <h5 id="offcanvasRightLabel" className="_text_secondary">
          Change Password
        </h5>
        <div className="px-2 py-1 _btn_export _rounded5px _cursor_pointer" data-bs-dismiss="offcanvas" aria-label="Close">
          <i className="fa-solid fa-xmark"></i>
        </div>
      </div>
      <div className="offcanvas-body">
        <div className="row">
          <div className="col-12 mb-2" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <input

              type={showPassword.cpassword ? 'text' : 'password'}
              className={`form-control form-control-lg _border_input`}
              name="cpassword"
              placeholder="password"
              value={cpassword} 
              onChange={(e) => {
                updateField(e, 'cpassword');
                setCPassword(e.target.value); 
              }}
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => ({ ...prev, cpassword: !prev.cpassword }))}
              className="_btn_eye"
              style={{
                position: 'absolute',
                right: '20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}>
              {showPassword.cpassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
            </button>
          </div>

          <div className="col-12 mb-2" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <input
              type={showPassword.npassword ? 'text' : 'password'}
              className={`form-control form-control-lg _border_input`}
              name="npassword"
              placeholder="new password"
              value={npassword} 
              onChange={(e) => {
                updateField(e, 'npassword');
                setNPassword(e.target.value); 
              }}
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => ({ ...prev, npassword: !prev.npassword }))}
              className="_btn_eye"
              style={{
                position: 'absolute',
                right: '20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}>
              {showPassword.npassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
            </button>
          </div>
          <div className="col-12 mb-2" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <input
              type={showPassword.rpassword ? 'text' : 'password'}
              className={`form-control form-control-lg _border_input`}
              name="rpassword"
              placeholder="confirm password"
              value={rpassword} 
              onChange={(e) => {
                updateField(e, 'rpassword');
                setRPassword(e.target.value); 
              }}
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => ({ ...prev, rpassword: !prev.rpassword }))}
              className="_btn_eye"
              style={{
                position: 'absolute',
                right: '20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}>
              {showPassword.rpassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
            </button>
          </div>
          <div className="col-12 mt-2">
            <button
              className="btn _btn_main form-control btn-lg"
              onClick={() => {
                sendPassword()
              }}
              data-bs-dismiss="offcanvas" 
            >
              <small>Change Password</small>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className="offcanvas offcanvas-end" id="offcanvasRightEdit" aria-labelledby="offcanvasRightEditLabel">
      <div className="offcanvas-header">
        <h5 id="offcanvasRightEditLabel" className="_text_secondary">
          Edit Password
        </h5>
        <div className="px-2 py-1 _btn_export _rounded5px _cursor_pointer" data-bs-dismiss="offcanvas" aria-label="Close">
          <i className="fa-solid fa-xmark"></i>
        </div>
      </div>
      <div className="offcanvas-body">
        <div className="row">
          <div className="col-12 mb-2" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <input

              type={showPassword.cpassword ? 'text' : 'password'}
              className={`form-control form-control-lg _border_input`}
              name="cpassword"
              placeholder="password"
              value={cpassword} 
              onChange={(e) => {
                updateField(e, 'cpassword');
                setCPassword(e.target.value); 
              }}
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => ({ ...prev, cpassword: !prev.cpassword }))}
              className="_btn_eye"
              style={{
                position: 'absolute',
                right: '20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}>
              {showPassword.cpassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
            </button>
          </div>

          <div className="col-12 mb-2" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <input
              type={showPassword.npassword ? 'text' : 'password'}
              className={`form-control form-control-lg _border_input`}
              name="npassword"
              placeholder="new password"
              value={npassword} 
              onChange={(e) => {
                updateField(e, 'npassword');
                setNPassword(e.target.value); 
              }}
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => ({ ...prev, npassword: !prev.npassword }))}
              className="_btn_eye"
              style={{
                position: 'absolute',
                right: '20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}>
              {showPassword.npassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
            </button>
          </div>
          <div className="col-12 mb-2" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <input
              type={showPassword.rpassword ? 'text' : 'password'}
              className={`form-control form-control-lg _border_input`}
              name="rpassword"
              placeholder="confirm password"
              value={rpassword} 
              onChange={(e) => {
                updateField(e, 'rpassword');
                setRPassword(e.target.value); 
              }}
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => ({ ...prev, rpassword: !prev.rpassword }))}
              className="_btn_eye"
              style={{
                position: 'absolute',
                right: '20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}>
              {showPassword.rpassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
            </button>
          </div>
          <div className="col-12 mt-2">
            <button
              className="btn _btn_main form-control btn-lg"
              onClick={() => {
                sendPassword()
              }}
              data-bs-dismiss="offcanvas" 
            >
              <small>Change Password</small>
            </button>
          </div>
        </div>
      </div>
    </div>
    
</>

    
  )
}
ChangePass.getLayout = function getLayout(page: any) {
  return <LoginLayout>{page}</LoginLayout>
}
export default ChangePass
export { getStaticProps } from "@/utils/getStaticProps"
