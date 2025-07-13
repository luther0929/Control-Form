import React from "react";

interface SelectProps {
    value?: string;
    error?: string; 
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
    options?: Array<{ value: string; label: string }>
    placeholder?: string
    label?: string;
}

export const Select = ({ value, error, onChange, onBlur, options, placeholder, label }: SelectProps) => {
  return (
    <>
        <label className='mb-[10px] block text-base font-medium text-dark dark:text-black'>
        {label}
        </label>
        <div className='relative z-20'>
        <select
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={`relative z-20 w-full appearance-none rounded-lg border border-stroke dark:border-dark-3 bg-transparent py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 ${error ? "border-red-500 focus:border-red-500 active:border-red-500" : "focus:ring active:ring"}`}
        >
            {placeholder && <option value="" className="text-gray-500">{placeholder}</option>}
            {options?.map(option => (
                <option key={option.value} value={option.value} className='dark:bg-dark-2'>{option.label}</option>
            ))}
        </select>
        <span className='absolute right-4 top-1/2 z-10 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-body-color'></span>
        </div>
        <div className="flex justify-center items-center min-h-10">
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    </>
  )
}