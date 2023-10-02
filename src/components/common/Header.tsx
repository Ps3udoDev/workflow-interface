import React from 'react';
import Button from '@mui/material/Button';
import useStore from '../../store/store';

interface HeaderProps {
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleDarkMode }) => {
  const { conversionToXstateCode } = useStore()

  const handleConversionXstateCode = (event: React.MouseEvent) => {
    event.preventDefault();
    conversionToXstateCode()
  }

  return (
    <header className='flex flex-row-reverse'>
      <Button onClick={toggleDarkMode}>
        Cambiar Modo
      </Button>
      <Button onClick={handleConversionXstateCode}>
        Convert to Xsate Code 
      </Button>
    </header>
  );
};

export default Header;
