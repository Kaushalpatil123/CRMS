
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';
import useConfig from 'hooks/useConfig';

// header style
const headerSX = {
  p: 2.5,
  width: '100%',
  display: 'flex',
  justifyContent:'space-between',
  flexDirection: 'column', // Stack title and action vertically
  '& .MuiCardHeader-action': {
    margin: '0',
    alignSelf: 'flex-end', // Align action to the end of the flex container
    width: '100%', // Make action take full width
  },
  '& .MuiCardHeader-title': {
    flex: '1 1 auto', // Allow title to take available space
    textAlign: 'left', // Align title to the left
  },
  '& .MuiCardHeader-subheader': {
    flex: '1 1 auto', // Allow subheader to take available space
    textAlign: 'left', // Align subheader to the left
  },
};

// ==============================|| CUSTOM - MAIN CARD ||============================== //

const MainCard = forwardRef(
  (
    {
      border = true,
      boxShadow = true,
      children,
      subheader,
      content = true,
      contentSX = {},
      darkTitle,
      divider = true,
      elevation,
      secondary,
      shadow,
      sx = {},
      title,
      codeHighlight = false,
      codeString,
      modal = false,
      ...others
    },
    ref
  ) => {
    const theme = useTheme();
    const { themeContrast } = useConfig();

    return (
      <Card
        elevation={elevation || 0}
        ref={ref}
        {...others}
        sx={{
          position: 'relative',
          border: border ? '1px solid' : 'none',
          borderRadius: 0,
          // borderColor: theme.palette.divider,
          // ...(((themeContrast && boxShadow) || shadow) && {
          //   boxShadow: shadow ? shadow : theme.customShadows.z1
          // }),
          borderColor:'rgba(0,0,0,0.3)',
          ...(codeHighlight && {
            '& pre': {
              m: 0,
              p: '12px !important',
              fontFamily: theme.typography.fontFamily,
              fontSize: '0.75rem'
            }
          }),
          ...(modal && {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: `calc( 100% - 50px)`, sm: 'auto' },
            '& .MuiCardContent-root': {
              overflowY: 'auto',
              minHeight: 'auto',
              maxHeight: `calc(100vh - 200px)`
            }
          }),
          ...sx
        }}
      >
        {/* card header and action */}
        {(title || secondary) && (
          <CardHeader
            sx={headerSX}
            title={title && !darkTitle ? title : <Typography variant="h4">{title}</Typography>}
            action={secondary ? <div style={{ flex: 1 }}>{secondary}</div> : undefined} // Ensure secondary takes full width
            subheader={subheader}
          />
        )}

        {/* content & header divider */}
        {title && divider && <Divider />}

        {/* card content */}
        {content && <CardContent sx={contentSX}>{children}</CardContent>}
        {!content && children}

        {/* card footer - clipboard & highlighter  */}
        {codeString && (
          <>
            {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}
            {/* <Highlighter codeString={codeString} codeHighlight={codeHighlight} /> */}
          </>
        )}
      </Card>
    );
  }
);

MainCard.propTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  children: PropTypes.node,
  subheader: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  content: PropTypes.bool,
  contentClass: PropTypes.string,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  divider: PropTypes.bool,
  elevation: PropTypes.number,
  secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  shadow: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  modal: PropTypes.bool,
  codeHighlight: PropTypes.bool,
  codeString: PropTypes.string
};

export default MainCard;
