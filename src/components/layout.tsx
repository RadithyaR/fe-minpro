import { FC, PropsWithChildren } from "react";
import Navbar from "./Navbar";

interface LayoutProps extends PropsWithChildren {
  disabledNavbar?: boolean;
}

const Layout: FC<LayoutProps> = ({ children, disabledNavbar = false }) => {
  return (
    <>
      {!disabledNavbar && <Navbar />}

      {children}
    </>
  );
};

export default Layout;
