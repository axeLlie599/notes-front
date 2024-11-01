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
}

export default function FilledButton({
  disabled = false,
  onClick,
  tooltip,
  tooltipPosition = "bottom",
  classes,
  pastelColor = false,
  title = "Filled Button",
}: FilledButtonProps) {
  return (
    <>
      <Button
        disabled={disabled}
        onClick={onClick}
        className={clsx("FilledButton", pastelColor && "pastel", classes)}
        data-tooltip-id="filled_button_tooltip"
        data-tooltip-content={tooltip}
        data-tooltip-place={tooltipPosition}
        onMouseLeave={(e) => e.currentTarget.blur()}
      >
        {title}
      </Button>

      <Tooltip id="filled_button_tooltip" className="tooltip" noArrow />
    </>
  );
}
