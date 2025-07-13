import { useEffect, useRef, useState } from "react";
import { Button } from "./Button"

interface ModalProps {
    title?: string;
    buttonLabel: string;
    children?: React.ReactNode;
    onClose?: () => void;
    onOpen?: () => void; 
    onDelete?: () => void;
}

export const Modal = ({ title, buttonLabel, children, onClose, onOpen, onDelete }: ModalProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const modal = useRef(null);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <>
      <div className="container mx-auto">
        <Button
            type="button"
            label={buttonLabel}
            onClick={() => {
              setModalOpen(true);
              onOpen?.();
            }}
        />
        <div
          className={`fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-dark/90 px-4 py-5 z-50 ${
            modalOpen ? "block" : "hidden"
          }`}
        >
          <div
            ref={modal}
            onFocus={() => setModalOpen(true)}
            className="border w-full max-w-[650px] rounded-[20px] bg-[#f7fbff] px-8 py-12 text-center dark:bg-dark-2 md:px-[70px] md:py-[60px] z-50"
          >
            <h3 className="pb-[18px] text-xl font-semibold text-dark dark:text-[#1d798d] sm:text-2xl">
              {title}
            </h3>

            {children}

            <div className="-mx-3 flex flex-wrap">
              <div className="w-1/2 px-3">
                <button
                  onClick={() => {
                    onDelete?.();
                    setModalOpen(false);
                  }}
                  className="block w-full rounded-md border border-stroke p-3 text-center text-base font-medium text-dark transition hover:border-red-600 hover:bg-red-600 hover:text-white dark:text-black"
                >
                  Delete
                </button>
                
              </div>
              <div className="w-1/2 px-3">
                <button
                    type="submit"
                    form="edit-form"
                    onClick={() => setModalOpen(false)}
                    className="block w-full rounded-md border border-primary bg-primary p-3 text-center text-base font-medium text-black transition hover:bg-green-500"
                >
                  <p> Confirm </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
