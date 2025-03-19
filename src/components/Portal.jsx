import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// This component creates a portal to render content outside the normal DOM hierarchy
const Portal = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? createPortal(
    children,
    document.body
  ) : null;
};

export default Portal; 