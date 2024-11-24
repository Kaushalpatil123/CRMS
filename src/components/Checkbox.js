import { createTheme, ThemeProvider } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';

const theme = createTheme({
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '& .MuiSvgIcon-root': {
            borderRadius: 0,
            
          },
          '&.Mui-checked .MuiSvgIcon-root': {
            color: '#779E40',
          },
        },
      },
    },
  },
});

const CustomBox = (props) => (
  <ThemeProvider theme={theme}>
    <Checkbox {...props}/>
  </ThemeProvider>
);

export default CustomBox;
