import React, { useState } from 'react'
import { useRouter } from 'next/router'
import 'bootstrap/dist/css/bootstrap.min.css'
import Image from 'next/image'
const Dropdown = () => {
  const [language, setLanguage] = useState<'en' | 'th'>('en')
  const router = useRouter()

  const handleLanguageChange = async (newLanguage: 'th' | 'en') => {
    const currentLocale = router.locale
    const newLocale = newLanguage === 'th' ? 'th' : 'en'

    const currentPath = router.pathname
    const newPath = `/${newLocale}${currentPath}`

    await router.push(newPath, undefined, { locale: newLocale })
    setLanguage(newLanguage)
  }

  const renderLanguageText = () => {
    return language === 'en' ? 'English' : 'Thailand'
  }

  const renderLanguageImage = () => {
    return language === 'th' ? '/thailand.jpg' : '/us.png'
  }

  return (
    <>
      <div className="btn-group ">
        <button className="_b_drop btn btn-sm mx-4" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <p className="dropdown-item _b_fontlag" style={{ margin: '' }}>
            <Image src={renderLanguageImage()} alt="" width={25} height={20} style={{ marginRight: '5px' }} />
            {renderLanguageText()}
          </p>
        </button>

        <ul className="dropdown-menu _b_custom-dropdown ">
          <li className="dropdown-item" onClick={() => handleLanguageChange('th')}>
            <Image className="" src={'/thailand.jpg'} alt="" width={25} height={20} /> Thailand
          </li>
          <li className="dropdown-item " onClick={() => handleLanguageChange('en')}>
            <Image src={'/us.png'} alt="" width={25} height={20} /> English
          </li>
        </ul>

        <div className="position-absolute top-0 end-0 dropdown">
          <p className=" " role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i className="_b_iconbell  fa-regular fa-bell" style={{ fontSize: 24 }} />
          </p>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <p className="dropdown-item" >
              ตัวเลือก 1
            </p>
            <p className="dropdown-item" >
              ตัวเลือก 2
            </p>
            <p className="dropdown-item" >
              ตัวเลือก 3
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dropdown
