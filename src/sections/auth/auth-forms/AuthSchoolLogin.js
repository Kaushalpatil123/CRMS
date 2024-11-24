import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'utils/axios';
// reducer - state management
import { LOGIN, LOGOUT } from 'store/reducers/actions';
import authReducer from 'store/reducers/auth';
// material-ui
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import Logo from 'components/logo';
import AuthWrapper from 'sections/auth/AuthWrapper';

// assets
import { Eye, EyeSlash } from 'iconsax-react';
import { dispatch } from 'store';

// ============================|| JWT - LOGIN ||============================ //
const server = process.env.REACT_APP_API_URL;

const AuthSchoolLogin = ({ forgot }) => {
  const [checked, setChecked] = useState(false);

  const { isLoggedIn, login } = useAuth();
  const scriptedRef = useScriptRef();
  const [userName, setuserName] = useState('')
  const [password, setpassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
const setSession = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token', token);
    delete axios.defaults.headers.common.Authorization;
    console.log(' logout done ');
  }
};
function setRole(role){
    localStorage.setItem('role', role);
}

const setUser = (user) => {
  if (user) {
    console.log(' i am session login');
    localStorage.setItem('user', JSON.stringify(user));
    const userlogin = JSON.parse(localStorage.getItem('user'));
    console.log(' user name is ' + userlogin.name);
  } else {
    localStorage.removeItem('user', user);
    delete axios.defaults.headers.common.Authorization;
  }
};
const navigate = useNavigate()
 async function handleSchoolLogin(e){
    e.preventDefault();

     
        try {
          const response = await axios.post(`${server}/api/school/school-login`, { userName, password });

          const { token, role ,user} = response.data;
            console.log(response);
          setSession(token);
          setRole(role);
          setUser(user);
          if (token) {
            navigate('/dashboard/default');
            
            dispatch({
              type: LOGIN,
              payload: {
                isLoggedIn: true,
                user
              }
            });
          }

          if (response.data.status === 'failed') {
            console.log(response.data.error);
          }

        } catch (error) {
          console.log(' you are not admin!! get lost..');
        }
      
  }

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Logo />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Login School Panel</Typography>
            {/* <Typography
              component={Link}
              to={isLoggedIn ? '/auth/register' : '/register'}
              variant="body1"
              sx={{ textDecoration: 'none' }}
              color="primary"
            >
              Don&apos;t have an account?
            </Typography> */}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Formik
            initialValues={{
              phoneNumber: '',
              password: '',
              submit: null
            }}
            validationSchema={Yup.object().shape({
              userName: Yup.string()
                .min(3, 'Username must be at least 3 characters')
                .max(255, 'Username must be at most 255 characters')
                .required('Username is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            // onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            //   try {
            //     await login(values.userName, values.password);
            //     if (scriptedRef.current) {
            //       setStatus({ success: true });
            //       setSubmitting(false);
            //     }
            //   } catch (err) {
            //     console.error(err);
            //     if (scriptedRef.current) {
            //       setStatus({ success: false });
            //       setErrors({ submit: err.message });
            //       setSubmitting(false);
            //     }
            //   }
            // }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSchoolLogin}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="username-login">Username</InputLabel>
                      <OutlinedInput
                        id="userName-login"
                        type="text"
                        value={userName}
                        name="userName"
                        onBlur={handleBlur}
                        onChange={(e) => setuserName(e.target.value)}
                        placeholder="Enter Your Username"
                        fullWidth
                        error={Boolean(userName && errors.userName)}
                      />
                      {userName && errors.userName && (
                        <FormHelperText error id="standard-weight-helper-text-userName-login">
                          {errors.userName}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="password-login">Password</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(password && errors.password)}
                        id="-password-login"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        name="password"
                        onBlur={handleBlur}
                        onChange={(e) => setpassword(e.target.value)}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              color="secondary"
                            >
                              {showPassword ? <Eye /> : <EyeSlash />}
                            </IconButton>
                          </InputAdornment>
                        }
                        placeholder="Enter password"
                      />
                      {password && errors.password && (
                        <FormHelperText error id="standard-weight-helper-text-password-login">
                          {errors.password}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sx={{ mt: -1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checked}
                            onChange={(event) => setChecked(event.target.checked)}
                            name="checked"
                            color="primary"
                            size="small"
                          />
                        }
                        label={<Typography variant="h6">Remember me</Typography>}
                      />

                      <Link variant="h6" component={RouterLink} to={'/login'} color="text.primary">
                        Login As Admin
                      </Link>
                    </Stack>
                  </Grid>
                  {errors.submit && (
                    <Grid item xs={12}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <AnimateButton>
                      <Button
                        disableElevation
                        disabled={isSubmitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        className="bg-blue-500 hover:bg-blue-700 text-white"
                      >
                        Login
                      </Button>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

AuthSchoolLogin.propTypes = {
  forgot: PropTypes.string
};

export default AuthSchoolLogin;
