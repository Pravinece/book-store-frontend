import React from 'react'

function TableInput({ placeholder, value, className, onChange, ...props }) {
  return (
    <input
      type='text'
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`px-2 py-1 text-[12px] border border-bg1 rounded-3xl outline-none focus:border-brand2 ${className}`}
      {...props}
    />
  )
}

export default TableInput
