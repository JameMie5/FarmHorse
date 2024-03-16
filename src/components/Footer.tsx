import { IUser } from '@/types/user';
import React, { useState } from 'react'
import { useTranslations } from 'next-intl';


function Footer() {
const t = useTranslations('TEXT');
const [userList, setUserList] = useState<IUser[]>([])
    return (
        <div className="col-12 _b_Footer">©{t("Copyright unicorn")}
            <div className="_b_FooterS">{t("Support")}</div></div>

    )
}

export default Footer
export { getStaticProps } from "@/utils/getStaticProps"