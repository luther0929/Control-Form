import React from "react";

interface CardProps {
    title?: string
    subtitle?: string
    description?: string
    button?: React.ReactNode
}

export const Card = ({
  title,
  subtitle,
  description,
  button
}: CardProps) => {
  return (
    <>
      {/*  */}
      <div className="mb-10 overflow-hidden rounded-lg bg-white shadow-1 duration-300 hover:shadow-3 dark:bg-dark-2 dark:shadow-card dark:hover:shadow-3">
        <div className="p-8 text-center sm:p-9 md:p-7 xl:p-9">
          <p className="font-bold">
            {title}
          </p>
          {subtitle && (
            <p>
                {subtitle}
            </p>
          )}
          <p className="my-7 text-base leading-relaxed text-body-color dark:text-dark-6">
            {description}
          </p>

          {button && (
              button
          )}
        </div>
      </div>
      {/*  */}
    </>
  );
};
