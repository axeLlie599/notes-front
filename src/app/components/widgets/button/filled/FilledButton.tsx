import { Button } from "@headlessui/react";
import clsx from "clsx";
import { PlacesType, Tooltip } from "react-tooltip";

import "./FilledButton.css";

interface FilledButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  pastelColor?: boolean;
  title?: string;
  classes?: string;
  tooltip?: string;
  tooltipPosition?: PlacesType;
  type?: "button" | "submit" | "reset";
  ref?: React.Ref<HTMLButtonElement>;
  autoFocus?: boolean;
}

export default function FilledButton({
  disabled = false,
  onClick,
  tooltip,
  tooltipPosition = "bottom",
  classes,
  pastelColor = false,
  title = "Filled Button",
  type = "button",
  ref = null,
  autoFocus = false,
}: FilledButtonProps) {
  return (
    <>
      <Button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={clsx("FilledButton", pastelColor && "pastel", classes)}
        data-tooltip-id="filled_button_tooltip"
        data-tooltip-content={tooltip}
        data-tooltip-place={tooltipPosition}
        onMouseLeave={(e) => e.currentTarget.blur()}
        ref={ref}
        autoFocus={autoFocus}
      >
        {title}
      </Button>

      <Tooltip id="filled_button_tooltip" className="tooltip" noArrow />
    </>
  );
}
