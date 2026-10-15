import React from 'react'

function AToggle({ checked, onChange, id }) {
  return (
    <label htmlFor={id} className='relative inline-block w-9 h-5 cursor-pointer'>
      <input type='checkbox' id={id} checked={checked} onChange={onChange} className='hidden' />
      <div className={`w-full h-full rounded-full transition-colors ${checked ? 'bg-gradient-to-b from-[#2BC820] to-[#1B8808]' : 'bg-gradient-to-b from-[#333333] to-[#8E8E8E]'}`}>
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
    </label>
  )
}

export default AToggle
