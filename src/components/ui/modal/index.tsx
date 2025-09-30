"use client";
import React, { useRef, useEffect } from "react";
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean; // New prop to control close button visibility
  isFullscreen?: boolean; // Default to false for backwards compatibility
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true, // Default to true for backwards compatibility
  isFullscreen = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const contentClasses = isFullscreen
    ? "w-full h-full"
    : "relative w-2xl rounded bg-white  dark:bg-gray-900";

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y- modal z-99999">
      {!isFullscreen && (
        <div
          className="fixed inset-0 h-full w-full overflow-y-auto bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}
      <div
        ref={modalRef}
        className={`${contentClasses}  ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute  mt-3 right-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100  "
          >
          <X/>
          </button>
        )}
        <div className="max-h-[80vh] rounded-2xl overflow-y-auto ">
          {children}
        </div>
      </div>
    </div>
  );
};
