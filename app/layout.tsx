import type {Metadata} from 'next';
import './globals.css';
import './elder.css';
export const metadata:Metadata={title:'CareCheck — Close, even from afar',description:'Telugu-friendly meal and tablet check-ins for families living apart.',icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
