import React from 'react'

interface ButtonProps {
    type?: "button" | "submit" | "reset"
    isDisabled?: boolean
    label?: string
}

export const Button = ({ type, isDisabled, label }: ButtonProps) => {
  return (
    <button
        type={type}
        disabled={isDisabled}
        className='bg-[#1d798d] dark:bg-dark-2 border-dark dark:border-dark-2 border rounded-md inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-gray-500 hover:border-body-color hover:cursor-pointer disabled:bg-gray-500 disabled:border-gray-3 disabled:text-dark-5 disabled:cursor-not-allowed'>
      {label}
    </button>
  )
}
