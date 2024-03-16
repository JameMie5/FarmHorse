import { useTranslations } from 'next-intl';
import Link from 'next/link'
import { useRouter } from 'next/router'

const Menu_sidebar = (): React.JSX.Element => {
  const router = useRouter()
  const d = useTranslations('TEXT');

  return (
    <>
      <div className="col-12 mb-1">
        <p className='bold-text mx-2'>{d("Farm")}</p>

      </div>
      <div className="col-12 mt-2">
        <div className="accordion accordion-flush" id="accordionFlushExample2">
          <div className="accordion-item">
            <h2 className="accordion-header" id="flush-headingOne">
            <button className="accordion-button mb-2 px-3 _text_secondary py-2 mb-1" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse2" aria-expanded="true" aria-controls="flush-collapse2">
                <small className="pe-2">
                <i className="fa-solid fa-chalkboard head_sysrem"></i>
                </small>
                {d("Systems")}
              </button>
            </h2>
            <div id="flush-collapse2" className="accordion-collapse collapse show" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample2">
              <div className="accordion-body mb-2 px-0 py-0">
                <Link href="/employee" className={`btn w-100 px-3 text-start _text_secondary ${router.pathname == '/employee' ? '_active_btn' : ''}`}>
                  <small className="pe-2">
                  <i className="fa-regular fa-address-book _icon_circle"></i>
                  </small>
                  {d("Employee")}
                </Link>
              </div>
              <div className="accordion-body mb-2 px-0 py-0">
                <Link href="/membership" className={`btn px-3 w-100 text-start _text_secondary ${router.pathname == '/membership' ? '_active_btn' : ''}`}>
                  <small className="pe-2">
                  <i className="fa-solid fa-hat-cowboy _icon_circle"></i>
                  </small>
                  {d("Membership")}
                </Link>
              </div>
              <div className="accordion-body mb-1 px-0 py-0">
                <Link href="/horse" className={`btn px-3 w-100 text-start _text_secondary ${router.pathname == '/horse' ? '_active_btn' : ''}`}>
                  <small className="pe-2 ">
                  <i className="fa-solid fa-horse _icon_circle"></i>
                  </small>
                  {d("Horse")}
                </Link>
              </div>
              <div className="accordion-body mb-1 px-0 py-0">
                <Link href="/booking" className={`btn px-3 w-100 text-start _text_secondary ${router.pathname == '/booking' ? '_active_btn' : ''}`}>
                  <small className="pe-2 ">
                  <i className="fa-regular fa-bookmark _icon_circle"></i>
                  </small>
                  {d("Booking")}
                </Link>
              </div>
            </div>
            <p className='bold-text mt-2  mx-2'>{d("Authentication")}</p>
            <div className="col-12 mb-1 mt-2">
              <Link href="/users" className={`btn px-3 w-100 text-start _text_secondary ${router.pathname == '/users' ? '_active_btn' : ''}`}>
                <small className="pe-2">
                  <i className="fa-solid fa-user-tag"></i>
                </small>
                {d("Userlogin")}
              </Link>
            </div>
            <div className="col-12 mb-1 mt-2">
              <Link href="/groupuser" className={`btn px-3 w-100 text-start _text_secondary ${router.pathname == '/groupuser' ? '_active_btn' : ''}`}>
                <small className="pe-2">
                <i className="fa-solid fa-user-group"></i>
                </small>
                {d("Groupuser")}
              </Link>
            </div>
            <div className="col-12 mb-1 mt-2">
              <Link href="/managesystems" className={`btn px-3 w-100 text-start _text_secondary ${router.pathname == '/managesystems' ? '_active_btn' : ''}`}>
                <small className="pe-2">
                <i className="fa-solid fa-user-gear"></i>
                </small>
                {d("Managesystems")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Menu_sidebar
export { getStaticProps } from "@/utils/getStaticProps"
