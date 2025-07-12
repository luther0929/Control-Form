import React from "react";

interface TextareaProps {
    value?: string;
    error?: string; 
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    rows?: number;
    maxLength?: number;
    placeholder?: string;
    label?: string;
}

export const DefaultTextarea = ({ value, error, onChange, onBlur, rows, maxLength, placeholder, label }: TextareaProps) => {
  return (
    <>
      <label className='mb-[10px] block text-base font-medium text-dark dark:text-black'>
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 p-5 text-dark-6 outline-none transition focus:border-primary  active:border-primary disabled:cursor-default disabled:bg-gray-2 resize-none ${error ? "border-red-500 focus:border-red-600 active:border-red-600" : "focus:ring active:ring"}`}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </>
  )
}

