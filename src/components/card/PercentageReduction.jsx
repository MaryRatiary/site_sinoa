import React from 'react'

const PercentageReduction = () => {
    const percentages = [
        {
            "value": 10,
            "reason": "dès 2 articles achetés"
        },
        {
            "value": 15,
            "reason": "dès 3 articles achetés"
        },
        {
            "value": 20,
            "reason": "dès 4 articles achetés"
        },
    ]
  return (
    <>
        <div className="w-full grid grid-cols-3 mb-7 mt-15">
            {percentages.map((p) => (
                <div 
                key={p.value}
                className='p-2 flex flex-col justify-center items-center border border-gray-300/70 text-gray-600 text-sm'
                >
                    <span className='text-lg text-[#0f0f0f] font-bold'>
                        -{p.value}%
                    </span>
                    <span>
                        {p.reason}
                    </span>
                </div>
            ))}
        </div>
    </>
  )
}

export default PercentageReduction