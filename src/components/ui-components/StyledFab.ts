import { styled } from '@mui/material/styles';
import { Fab, FabProps } from '@mui/material';

interface StyledFabProps extends FabProps {
  color?: 'primary' | 'secondary' | 'default' | 'inherit' | 'error' | 'info' | 'success' | 'warning';
}

export const StyledFab = styled(Fab)<StyledFabProps>(() => ({
  color: 'white',
  '&:hover': {
    backgroundImage: `linear-gradient(rgb(0 0 0/10%) 0 0)`
  }
}));
