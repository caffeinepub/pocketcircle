import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalPortalProps {
  children: ReactNode;
  onClose?: () => void;
}

function getModalRoot(): HTMLElement {
  let el = document.getElementById("modal-root");
  if (!el) {
    el = document.createElement("div");
    el.id = "modal-root";
    document.body.appendChild(el);
  }
  return el;
}

export default function ModalPortal({ children, onClose }: ModalPortalProps) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4"
        style={{
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
        onClick={(e) => e.target === e.currentTarget && onClose?.()}
      >
        {children}
      </motion.div>
    </AnimatePresence>,
    getModalRoot(),
  );
}
