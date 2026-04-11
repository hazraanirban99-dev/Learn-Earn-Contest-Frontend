import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component ensures that the window scrolls to the top
 * whenever the route changes. This provides a consistent user experience
 * across all pages of the application.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Reset scroll position to top whenever pathname changes
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // Using 'instant' for a sharp reset, common in modern SPAs
        });
    }, [pathname]);

    return null; // This component doesn't render anything
};

export default ScrollToTop;
