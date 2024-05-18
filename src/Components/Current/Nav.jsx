import React from 'react'
import UploadSVG from '../../assets/icons/upload.svg'

const Nav = () => {
  return (
    <>
      <div className="flex items-center justify-between w-full h-[60px] border-b sm:px-12 lg:px-24 z-50 bg-white">
        <div className="flex items-center gap-4 ml-4">
          <a href="/">
            <h1 className="text-[20px] font-[600] text-[#313131] hover:text-[#212121] transition-all cursor-pointer">Pixa UI</h1>
          </a>
        </div>
        <div className="flex items-center gap-4 mr-4">
          <a href='/about' className="text-[14px] p-1 rounded-[4px] font-[500] text-[#313131] hover:text-[#212121] transition-all cursor-pointer">About</a>
          <a href='https://github.com/Lokendrakushwah12/pixa-ui' target='_blank' className="text-[14px] p-1 rounded-[4px] font-[500] text-[#313131] hover:text-[#212121] transition-all cursor-pointer">GitHub</a>
          <a href='' className="text-[14px] p-1 rounded-[4px] font-[500] text-[#313131] hover:text-[#212121] transition-all cursor-pointer border bg-[#f9f9f9] flex gap-1 justify-center items-center">Submit your Components <img src={UploadSVG} alt="uploadIcon" /></a>
        </div>
      </div>
    </>
  )
}

export default Nav