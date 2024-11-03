/* eslint-disable @typescript-eslint/no-unused-vars */
import "./styles/main.css";
import "./styles/material-icons/material-icons.css";

import useTheme from "./hooks/theme.app";

export default function Application() {
  const ENABLE_THEME_CHANGE = true;
  //const themeHook = useTheme({ enabled: ENABLE_THEME_CHANGE });
  useTheme({ enabled: ENABLE_THEME_CHANGE });

  return (
    <div className="Application wide-screen flex-center">
      <code>Now you can write this from zero</code>
    </div>
  );
}
