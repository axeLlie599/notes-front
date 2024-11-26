import clsx from "clsx";
import "./Header.css";

import React from "react";

interface HeaderProps {
  classes?: string;
  id?: string;
  children?: React.ReactNode;
  fixed?: boolean;
  inScroll?: boolean;
}

const Header = ({
  children,
  classes,
  id,
  fixed = false,
  inScroll = true,
}: HeaderProps) => {
  return (
    <header
      className={clsx(
        "Header",
        classes,
        fixed && "fixed",
        inScroll && "scroll"
      )}
      id={id}
    >
      {children}
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
