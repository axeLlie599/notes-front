import clsx from "clsx";
import "./Header.css";

import React from "react";

interface HeaderProps {
  blur?: boolean;
  customChildren?: boolean;
  classes?: string;
  id?: string;
  children?: React.ReactNode;
  shadow?: boolean;
  wide?: boolean;
  debugOutline?: boolean;
  fixed?: boolean;
}

const Header = ({
  blur = false,
  customChildren,
  children,
  shadow = false,
  classes,
  id,
  wide = true,
  debugOutline,
  fixed = false,
}: HeaderProps) => {
  return (
    <header
      className={clsx(
        "Header",
        classes,
        blur && "blurred",
        shadow && "shadow",
        debugOutline && "outline",
        fixed && "fixed"
      )}
      id={id}
    >
      <div
        className={clsx(
          "container",
          wide && "wide",
          !customChildren && "with-sections"
        )}
      >
        {children}
      </div>
    </header>
  );
};

Header.Placeholder = () => (
  <span className="placeholder">Please add children</span>
);

Header.SectionLeft = ({
  children = <Header.Placeholder />,
}: {
  children?: React.ReactNode;
}) => <section className="left">{children}</section>;

Header.SectionCenter = ({
  children = <Header.Placeholder />,
}: {
  children?: React.ReactNode;
}) => <section className="center">{children}</section>;

Header.SectionRight = ({
  children = <Header.Placeholder />,
}: {
  children?: React.ReactNode;
}) => <section className="right">{children}</section>;

export default Header;
