import clsx from "clsx";
import "./IconButton.css";
import { Button } from "@headlessui/react";
import { PlacesType, Tooltip } from "react-tooltip";

interface IconButtonProps {
  icon?: string;
  iconSet?: string;
  tooltipLabel?: string;
  tooltipPosition?: PlacesType;
  classes?: string;
  hasBackground?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}

export default function IconButton({
  icon,
  iconSet = "material-icons-outlined",
  classes,
  tooltipLabel,
  tooltipPosition = "bottom",
  hasBackground = false,
  type = "button",
  disabled = false,
  onClick,
}: IconButtonProps) {
  return (
    <>
      <Button
        type={type}
        className={clsx("IconButton", hasBackground && "background", classes)}
        onClick={onClick}
        data-tooltip-id="icon_button_tooltip"
        data-tooltip-content={tooltipLabel}
        data-tooltip-place={tooltipPosition}
        onMouseLeave={(e) => e.currentTarget.blur()}
        disabled={disabled}
      >
        <span className={clsx("icon", iconSet)}>{icon}</span>
      </Button>
      <Tooltip id="icon_button_tooltip" className="tooltip" noArrow />
    </>
  );
}
