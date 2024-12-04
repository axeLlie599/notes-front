import {
  CloseButton,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import clsx from "clsx";
import IconButton from "../button/icon-button/IconButton";

import "./Dialog.css";

const FEATURES = {
  slider: false, // Not implemented yet.. maybe in the future
};

interface DialogProps {
  title?: string;
  titleBold?: boolean;
  description?: string;
  open?: boolean;
  onClose?: (value: boolean) => void;
  children: React.ReactNode;
  closeButtonEnabled?: boolean;
}

export default function DialogComponent({
  title,
  titleBold = true,
  open,
  onClose,
  children,
  closeButtonEnabled = true,
}: DialogProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (!onClose) {
      e.stopPropagation();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose ? (value) => onClose(value) : () => null}
      className="Dialog"
    >
      <div className="overlay" onClick={handleClick}>
        <DialogPanel className="dialog" onClick={handleClick}>
          {FEATURES.slider && (
            <div className="slider-container">
              <span className="slider" />
            </div>
          )}
          <section className="header" hidden={!title && !onClose}>
            {title && (
              <DialogTitle className={clsx("title", titleBold && "bold")}>
                {title}
              </DialogTitle>
            )}
            {onClose && closeButtonEnabled && (
              <CloseButton
                as={IconButton}
                icon="close"
                onClick={() => onClose(false)}
                tooltipLabel="Close"
                tooltipPosition="bottom"
              />
            )}
          </section>

          <section className="content">{children}</section>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
