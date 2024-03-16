import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import MenuSidebar from '@/components/Menu_sidebar'

const Sidebar = (): React.JSX.Element => {
  const router = useRouter()

  return (
    <>
      <div className="row">
        <div className="col-8 p-3">
          <Link href="/">
            <Image src="/logo-more.png" width={200} height={100} style={{ width: '160%', height: 'auto' }} alt="Logo" />
          </Link>
        </div>
        <MenuSidebar />
      </div>
    </>
  )
}
export default Sidebar
export { getStaticProps } from '@/utils/getStaticProps'
