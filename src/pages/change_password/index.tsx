import React, { useEffect, useState } from 'react';
import { IResponse, defaultResponse, IFetchData } from '@/types/response';
import { useRouter } from 'next/router';
import LoginLayout from '@/layouts/login';
import { fetchData } from '@/utils/fetchData';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface IFormData {
  cpassword: string;
  npassword: string;
  rpassword: string;
}

const ChangePassword = (): React.JSX.Element => {
  const router: any = useRouter();
  const session: any = useSession();
  const [showPassword, setShowPassword] = useState({
    cpassword: false,
    npassword: false,
    rpassword: false,
  });
  const [formData, setFormData] = useState<IFormData>({
    cpassword: '',
    npassword: '',
    rpassword: '',
  });
  const updateField = (e: any, field: string) => {
    setFormData({
      ...formData,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };
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
    );
    console.log('%cindex.tsx line:48 _res::::::::::::::', 'color: #007acc;', _res);
    if (_res.statusCode === 200 && _res.data.data.err == 'N') {
      Swal.fire({
        title: _res.data.data.title,
        text: _res.data.data.msg,
        icon: _res.data.data.icon,
      });
      router.push('/');
    } else {
      Swal.fire({
        title: _res.data.data.title,
        text: _res.data.data.msg,
        icon: _res.data.data.icon,
      });
    }
  };

  return (
    <>
      <div className="row mx-0">
        <div className="col-xl-4 col-lg-6 col-md-7 col-12 mx-auto">
          <div className="row mx-0 px-3 py-5 bg-white _rounded15px w-100 _shadow">
            <div className="col-6 mx-auto mb-2 d-flex justify-content-center">
            <Image src="/logo-more.png"
                width={200}
                height={100}
                style={{ width: '200%', height: 'auto' }}
                alt="Logo" />
            </div>
            <div className="col-12 mb-2 text-center">
              <small>Change Password</small>
            </div>
            <div className="col-12 mb-2" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <input
                type={showPassword.cpassword ? 'text' : 'password'}
                className={`form-control form-control-lg _border_input`}
                name="cpassword"
                placeholder="password"
                onChange={(e) => {
                  updateField(e, 'cpassword');
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
                }}
              >
                {showPassword.cpassword ? (
                  <i className="fa-solid fa-eye-slash"></i>
                ) : (
                  <i className="fa-solid fa-eye"></i>
                )}
              </button>
            </div>
            <div className="col-12 mb-2" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <input
                type={showPassword.npassword ? 'text' : 'password'}
                className={`form-control form-control-lg _border_input`}
                name="npassword"
                placeholder="new password"
                onChange={(e) => {
                  updateField(e, 'npassword');
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
                }}
              >
                {showPassword.npassword ? (
                  <i className="fa-solid fa-eye-slash"></i>
                ) : (
                  <i className="fa-solid fa-eye"></i>
                )}
              </button>
            </div>
            <div className="col-12 mb-2" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <input
                type={showPassword.rpassword ? 'text' : 'password'}
                className={`form-control form-control-lg _border_input`}
                name="rpassword"
                placeholder="confirm password"
                onChange={(e) => {
                  updateField(e, 'rpassword');
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
                }}
              >
                {showPassword.rpassword ? (
                  <i className="fa-solid fa-eye-slash"></i>
                ) : (
                  <i className="fa-solid fa-eye"></i>
                )}
              </button>
            </div>
            <div className="col-12 mt-2">
              <button
                className="btn _btn_main form-control btn-lg"
                onClick={() => {
                  sendPassword();
                }}>
                <small>Change Password</small>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ChangePassword.getLayout = function getLayout(page: any) {
  return <LoginLayout>{page}</LoginLayout>;
};
export default ChangePassword;
export { getStaticProps } from "@/utils/getStaticProps"