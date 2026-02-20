import React from 'react'

const AnimatedBtn = ({text}) => {
  return (
    <>
        <div className="w-full text-white">
            <button className="px-4 py-2 rounded-full bg-[#5E2251] block mx-auto my-5">
                {text}
            </button>
        </div>
    </>
  )
}

export default AnimatedBtn