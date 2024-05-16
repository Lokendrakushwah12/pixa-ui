import React from 'react'

const Nav = () => {
  return (
    <>
      <div className="flex items-center justify-between w-full h-[60px] border-b sm:px-12 lg:px-24">
        <div className="flex items-center gap-4 ml-4">
          <h1 className="text-lg font-bold text-gray-800">Pixa UI</h1>
        </div>
        <div className="flex items-center gap-4 mr-4">
          <button className="text-sm font-semibold text-gray-800">About</button>
          <button className="text-sm font-semibold text-gray-800">Submit your Components</button>
          <button className="text-sm font-semibold text-gray-800">GitHub</button>
        </div>
      </div>
    </>
  )
}

export default Nav