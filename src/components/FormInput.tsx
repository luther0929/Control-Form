import React from "react";

interface InputProps {
    value?: string;
    error?: string; 
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label?: string;
}

export const Input = ({ value, error, onChange, onBlur, placeholder, label }: InputProps) => {
  return (
    <>
      <label className='mb-[10px] block text-base font-medium text-dark dark:text-black'>
        {label}
      </label>
      <input
        type='text'
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2 ${error ? "border-red-500 active:border-red-500 focus:border-red-500" : "active:ring focus:ring"}`}
      />
      <div className="flex justify-center items-center min-h-10">
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </>
  )
}

