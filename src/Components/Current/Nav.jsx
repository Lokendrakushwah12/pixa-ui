import React from 'react';
import { Link } from 'react-router-dom';
import UploadSVG from '../../assets/icons/upload.svg';

const Nav = () => {
  return (
    <>
      <div className="flex items-center justify-between w-full h-[60px] border-b sm:px-12 lg:px-24 z-50 bg-[#fefefe]">
        <div className="flex items-center gap-4 ml-4">
          <Link to="/">
            <h1 className="text-[20px] font-[600] text-[#313131] hover:text-[#212121] transition-all cursor-pointer">Pixa UI</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4 mr-4">
          <Link to='/about' className="text-[14px] p-1 rounded-[4px] font-[500] text-[#313131] hover:text-[#212121] transition-all cursor-pointer">About</Link>
          <Link to='https://github.com/Lokendrakushwah12/pixa-ui' target='_blank' rel="noopener noreferrer" className="text-[14px] p-1 rounded-[4px] font-[500] text-[#313131] hover:text-[#212121] transition-all cursor-pointer">GitHub</Link>
          <Link to='' className="text-[14px] p-1 rounded-[8px] shadow-md shadow-[rgba(0,0,0,0.08)] hover:shadow-[rgba(0,0,0,0.15)] font-[500] text-[#313131] hover:text-[#212121] transition-all cursor-pointer border hover:bg-[#f9f9fa] flex gap-1 justify-center items-center">Submit your Components <img src={UploadSVG} alt="uploadIcon" /></Link>
        </div>
      </div>
    </>
  )
}

export default Nav;
