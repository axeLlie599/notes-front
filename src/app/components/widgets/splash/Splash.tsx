import clsx from "clsx";
import { ReactNode } from "react";
import "./Splash.css";

interface SplashProps {
  children: ReactNode;
  classes?: string;
}

export default function Splash(props: SplashProps) {
  return (
    <>
      <div className={clsx("Splash", props.classes)}>
        {props.children || <></>}
      </div>
    </>
  );
}

Splash.Icon = ({
  iconSet = "material-icons",
  icon = "info",
}: {
  icon?: string;
  iconSet?: string;
}) => <section className={clsx("icon", iconSet)}>{icon}</section>;

Splash.Title = ({ title = "Please provide title" }: { title?: string }) => (
  <span className="title">{title}</span>
);

Splash.Content = ({
  children = <a>Please provide any element or text here</a>,
}: {
  children?: React.ReactNode;
}) => <section className="content">{children}</section>;
