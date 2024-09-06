import React, {useState} from 'react'
import LeftSidebar from './layout/LeftSidebar';

interface MainLayoutProps {
    children: React.ReactNode;
    defaultTitle?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, defaultTitle= 'Dashboard'}) => {
    const [pageTitle, setPageTitle] = useState<string>(defaultTitle);

    const handleTitleChange = (title: string) =>{
        setPageTitle(title);
    }

  return (
    <div className='flex flex-row bg-white'>
        <div className='w-[15%]'>
            <LeftSidebar onSelectTitle={handleTitleChange} />
        </div>
        <div className='w-[85%] h-screen'>
            <h1 className='font-bold text-4xl m-4'>{pageTitle}</h1>
            { children }
        </div>
    </div>
  )
}

export default MainLayout;