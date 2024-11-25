import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';
import { Chance } from 'chance';
import jwtDecode from 'jwt-decode';
import toast from 'react-hot-toast'; // Import react-hot-toast

// reducer - state management
import { LOGIN, LOGOUT } from 'store/reducers/actions';
import authReducer from 'store/reducers/auth';

// project-imports
import Loader from 'components/Loader';
import axios from 'utils/axios';

const chance = new Chance();

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken = (token) => {
  if (!token) {
    return false;
  }
  const decoded = jwtDecode(token);
  return decoded.exp > Date.now() / 1000;
};

const setSession = async (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    const LoginActivity = await axios.post(`/api/userActivity/login`, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Login Activity data--->', LoginActivity?.data);
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common.Authorization;
    console.log('Logout done');
  }
};

const setUser = (user) => {
  if (user) {
    localStorage.setItem('role', JSON.stringify(user));
    const userlogin = JSON.parse(localStorage.getItem('role'));
    console.log('Role name is ' + userlogin);
  } else {
    localStorage.removeItem('role');
    delete axios.defaults.headers.common.Authorization;
  }
};

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('role'));
        console.log('token check bro==============>', token)
        console.log('role check bro==========>', user)

        if (token && verifyToken(token)) {
          setSession(token);
          setUser(user);


          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT
        });
      }
    };

    init();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/user/login', { email, password });
      const { token, role } = response.data;

      console.log('response data check---->', response.data)



      if (response.data.status === 'failed') {
        // Show error toast if login fails
        toast.error('Login failed. Please check your credentials and try again.');
        return;
      }





      setSession(token);
      setUser(role);
      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
          role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials and try again.');
    }
  };

  const register = async (email, password, firstName, lastName) => {
    const id = chance.bb_pin();
    const response = await axios.post('/api/account/register', {
      id,
      email,
      password,
      firstName,
      lastName
    });
    let users = response.data;

    if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
      const localUsers = window.localStorage.getItem('users');
      users = [
        ...JSON.parse(localUsers),
        {
          id,
          email,
          password,
          name: `${firstName} ${lastName}`
        }
      ];
    }

    window.localStorage.setItem('users', JSON.stringify(users));
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      setSession(null);
      setUser(null);
      dispatch({ type: LOGOUT });
    } catch {
      console.log('Error during logout.');
    }
  };

  const resetPassword = async () => { };

  const updateProfile = () => { };

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return <JWTContext.Provider value={{ ...state, login, logout, updateProfile }}>{children}</JWTContext.Provider>;
};

JWTProvider.propTypes = {
  children: PropTypes.node
};

export default JWTContext;
