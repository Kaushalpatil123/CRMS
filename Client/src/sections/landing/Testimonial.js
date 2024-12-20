import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';

// third party
import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';

// project-imports
import FadeInWhenVisible from './Animation';
import MainCard from 'components/MainCard';

// assets
import Avatar from 'components/@extended/Avatar';
import Avatar1 from 'assets/images/users/avatar-6.png';
import Avatar2 from 'assets/images/users/avatar-1.png';
import Avatar3 from 'assets/images/users/avatar-2.png';
import Avatar4 from 'assets/images/users/avatar-3.png';
import Avatar5 from 'assets/images/users/avatar-4.png';
import Avatar6 from 'assets/images/users/avatar-5.png';
import Avatar7 from 'assets/images/users/avatar-7.png';
import Avatar8 from 'assets/images/users/avatar-8.png';

// ================================|| SLIDER - ITEMS ||================================ //

const Item = ({ item }) => (
  <MainCard
    sx={{
      width: { xs: '300px', md: '420px' },
      cursor: 'pointer',
      my: 0.2,
      mx: 1.5
    }}
  >
    <Stack direction="row" alignItems="flex-start" spacing={2}>
      <Avatar alt="Avatar" size="lg" src={item.image}></Avatar>
      <Stack>
        <Typography>{item.text}</Typography>
        <Typography>
          <small>{item.name}</small> -{' '}
          <Box component="span" color="textSecondary">
            {item.designation}
          </Box>
        </Typography>
      </Stack>
    </Stack>
  </MainCard>
);

Item.propTypes = {
  item: PropTypes.shape({
    text: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    designation: PropTypes.string
  })
};

// ==============================|| LANDING - TestimonialPage ||============================== //
const TestimonialPage = () => {
  const theme = useTheme();
  const items = [
    { image: Avatar1, text: '“Amazing template for fast develop.💎“', name: 'devbar', designation: 'Customizability' },
    {
      image: Avatar2,
      text: '“Code quality is amazing. Design is astonishing. very easy to customize..😍“',
      name: 'shahabblouch',
      designation: 'Code Quality'
    },
    {
      image: Avatar3,
      text: '“This has been one of my favorite admin dashboards to use. 😍“',
      name: 'htmhell',
      designation: 'Design Quality'
    },
    {
      image: Avatar4,
      text: '“Excellent support, if we need any modification, they are doing immediately“',
      name: 'hemchandkodali',
      designation: 'Customer Support'
    },
    {
      image: Avatar5,
      text: '“For developers like me, this is the total package! 😍 “',
      name: 'sumaranjum',
      designation: 'Feature Availability'
    },
    {
      image: Avatar6,
      text: '“I love the looks of Doledge 7.0. I really like the colors you guys have chosen for this theme. It looks really nice.. 💎“',
      name: 'ritelogic',
      designation: 'Other'
    },
    {
      image: Avatar7,
      text: '“The author is very nice and solved my problem inmediately 😍 “',
      name: 'richitela',
      designation: 'Customer Support'
    },
    {
      image: Avatar8,
      text: '“Perfect for my need. Elegant look n feel with blazing fast code. 💎“',
      name: 'Genstiade',
      designation: 'Feature Availability'
    }
  ];
  return (
    <>
      <Box sx={{ mt: { md: 15, xs: 2.5 } }}>
        <Container>
          <Grid container spacing={2} justifyContent="center" sx={{ textAlign: 'center', marginBottom: 4 }}>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30,
                  delay: 0.2
                }}
              >
                <Typography variant="h2">
                  They{' '}
                  <Box
                    component="span"
                    sx={{
                      color: theme.palette.primary.main
                    }}
                  >
                    love{' '}
                  </Box>{' '}
                  Doledge, Now your turn 😍
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30,
                  delay: 0.4
                }}
              >
                <Typography>
                  We take pride in our Dashboard development, which has been consistently rated 4.6/5 by our satisfied customers. It brings
                  us joy to share the positive feedback we have received from our loyal clients.
                </Typography>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box sx={{ mb: { md: 10, xs: 2.5 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <FadeInWhenVisible>
              <Marquee pauseOnHover gradient={false}>
                {items.map((item, index) => (
                  <Item key={index} item={item} />
                ))}
              </Marquee>
            </FadeInWhenVisible>
          </Grid>
          <Grid item xs={12}>
            <FadeInWhenVisible>
              <Marquee pauseOnHover direction="right" gradient={false}>
                {items.map((item, index) => (
                  <Item key={index} item={item} />
                ))}
              </Marquee>
            </FadeInWhenVisible>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default TestimonialPage;
