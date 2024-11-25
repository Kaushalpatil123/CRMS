// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import image from '../background.png';

// project import
import { ThemeMode } from 'config';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

const AuthBackground = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'absolute',
        // filter: 'blur(140px)',
        zIndex: -1,
        bottom: 0,
        left: 0,
        top: 0,
        right: 0,
        overflow: 'hidden',
        backgroundImage: `url(${image})`, // Add your background image path here
        backgroundSize: 'cover', // Adjust the size (cover/fill/contain)
        backgroundPosition: 'center', // Center the image
        backgroundRepeat: 'no-repeat', // Prevent image repetition
        '&:before': {
          content: `" "`,
          width: 300,
          height: 300,
          borderRadius: '50%',
          bgcolor: 'warning.lighter',
          position: 'absolute',
          top: 0,
          right: 0,
          opacity: theme.palette.mode === ThemeMode.DARK ? 0.6 : 1
        }
      }}
    >
      <Box
        sx={{
          width: 250,
          height: 250,
          borderRadius: '50%',
          bgcolor: theme.palette.success.lighter,
          ml: 20,
          position: 'absolute',
          bottom: 180,
          opacity: theme.palette.mode === ThemeMode.DARK ? 0.8 : 1
        }}
      />
      <Box
        sx={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          bgcolor: theme.palette.error.light,
          position: 'absolute',
          bottom: 0,
          left: -50,
          opacity: theme.palette.mode === ThemeMode.DARK ? 0.8 : 1
        }}
      />
    </Box>
  );
};

export default AuthBackground;
