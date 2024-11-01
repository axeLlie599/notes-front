import { useMemo } from "react";
import clsx from "clsx";
import "./FAB.css";
import { PlacesType, Tooltip } from "react-tooltip";
import { Button } from "@headlessui/react";

enum FABPosition {
  LeftBottom = "left-bottom",
  RightBottom = "right-bottom",
  TopLeft = "top-left",
  TopRight = "top-right",
  ScreenCenter = "screen-center",
  BottomCenter = "bottom-center",
  Custom = "custom",
}

enum FABExtendedSettings {
  CenterY = "centerY",
  CenterX = "centerX",
}

enum FABSize {
  Medium = "medium",
  Large = "large",
}

interface FABprops {
  label?: string;
  title?: string;
  onClick?: () => void;
  icon: string;
  iconSet?: string;
  classes?: string;
  debugOutline?: boolean;
  size?: FABSize;
  disabled?: boolean;
  hidden?: boolean;
  tooltip?: string;
  tooltipPosition?: PlacesType;
  castShadow?: boolean;
  pos?: FABPosition;
}

export default function FAB(props: FABprops) {
  const {
    label = undefined,
    title = undefined,
    onClick = () => {},
    icon,
    iconSet = "material-icons",
    classes = "",
    debugOutline = false,
    size = FABSize.Medium,
    disabled = false,
    hidden = false,
    tooltip = undefined,
    tooltipPosition = "top",
    pos = FABPosition.RightBottom,
    castShadow = false,
  } = props;

  const FABTemplate = useMemo(() => {
    const fabClasses = clsx(
      "FAB",
      classes,
      size,
      pos,
      debugOutline && "outline",
      label && "extended",
      castShadow && "shadow"
    );

    return (
      <>
        <Button
          className={fabClasses}
          disabled={disabled}
          hidden={hidden}
          onClick={onClick}
          title={title}
          data-tooltip-id="fab_tooltip"
          data-tooltip-content={tooltip}
          data-tooltip-place={tooltipPosition}
        >
          <span className={clsx("Icon", iconSet)}>{icon}</span>
          {label && <span className="Label">{label}</span>}
        </Button>
        <Tooltip id="fab_tooltip" className="tooltip" noArrow />
      </>
    );
  }, [
    castShadow,
    classes,
    debugOutline,
    disabled,
    hidden,
    icon,
    iconSet,
    label,
    onClick,
    pos,
    size,
    title,
    tooltip,
    tooltipPosition,
  ]);

  return FABTemplate;
}

FAB.Extended = FABExtendedSettings;
FAB.Medium = FABSize.Medium;
FAB.Large = FABSize.Large;
FAB.Position = FABPosition;
