import useScreenSize from './useScreenSize';
import DesktopNavbar from './DesktopNavbar';
import MobileNavbar from './MobileNavbar';

const ResponsiveNavbar = ({ isAuthenticated }) => {
  const { isMobile } = useScreenSize();

  return isMobile ? (
    <MobileNavbar isAuthenticated={isAuthenticated} />
  ) : (
    <DesktopNavbar isAuthenticated={isAuthenticated} />
  );
};

export default ResponsiveNavbar;