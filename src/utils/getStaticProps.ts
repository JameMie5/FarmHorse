import {GetStaticPropsContext} from 'next';
export async function getStaticProps({locale}: GetStaticPropsContext) {
    console.log('locale', locale);
    
    return {
      props: {
        messages: (await import(`../../messages/${locale}.json`)).default
      }
    };
  }