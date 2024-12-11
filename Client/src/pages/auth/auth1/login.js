import React, { useState, useContext } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import logo from '../../../assets/images/crmslogo.PNG';
import backgroundImage from '../../../assets/images/crmsbackdround.png';
import JWTContext from '../../../contexts/JWTContext';
import useScriptRef from '../../../hooks/useScriptRef';
import { Link } from 'react-router-dom';
import axios from 'axios';

const server = process.env.REACT_APP_API_URL;

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .min(3, 'Email must be at least 3 characters')
    .max(255, 'Email must be at most 255 characters')
    .required('Email is required'),
  password: Yup.string()
    .max(255, 'Password must be at most 255 characters')
    .required('Password is required')
});

const modalValidationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  mobile: Yup.string().required('Mobile is required'),
  comment: Yup.string(),
});

const Login = () => {
  const { login } = useContext(JWTContext);
  const scriptedRef = useScriptRef();
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await login(values.email, values.password);


    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials and try again.');
      setErrors({ password: 'Login failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log('Form data:', values);
      const response = await axios.post(`${server}/api/contactus`, values);
      console.log('API response:', response.data);
      toast.success('Your message has been received successfully. We will contact you as soon as possible.');
      handleCloseModal();
      resetForm();
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full pb-10 justify-end align-middle items-center bg-cover bg-center"
    // style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex justify-center align-middle items-center py-3">
        <img src={logo} alt="Logo" className="w-60 rounded" />
      </div>

      <div className="flex-grow flex justify-center align-middle items-center pt-10 mb-20">
        <div
          className="w-full bg-opacity-90 rounded-lg p-8"
          style={{
            maxWidth: '700px',
            background: 'linear-gradient(90deg, #93d9f3, #bfc4f0)',
            boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
          }}
        >
          <Formik initialValues={{ email: '', password: '', submit: null }} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form className="space-y-5 flex flex-col items-center">
                <h1 className="siz font-semibold text-black text-center pb-2 relative" style={{ fontSize: '30px', display: 'inline-block', paddingBottom: '10px' }}>
                  WELCOME BACK!
                  <span style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', width: '339px', height: '4px', backgroundColor: '#F63642' }}></span>
                </h1>

                <div>
                  <p className="text-black text-center" style={{ fontSize: '14px' }}>
                    CRM - Your hub for smarter connections, seamless management,<br /> and growth-driven insights.
                    <span className="font-semibold">Let's get started!</span>
                  </p>
                </div>
                <div className='justify-center align-middle items-center text-center'>
                  <p className='font-semibold'>For Testing</p>
                  <p>ID:- <span>admin@gmail.com</span></p>
                  <p>Password:- <span>admin</span></p>
                </div>

                <p className="text-black text-center font-bold relative" style={{ marginTop: '30px', fontSize: '14px', display: 'inline-block', paddingBottom: '5px' }}>
                  Sign in Access
                  <span style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', width: '189px', height: '2px', backgroundColor: '#F63642' }}></span>
                </p>

                <div>
                  <p className="text-[13px] text-black text-center mb-0">You must become a registered user to login and</p>
                  <p className="text-[13px] text-black text-center mt-0">access the entire site.</p>
                </div>

                <div className="w-[420px] bg-white p-4 shadow-md" style={{ borderRadius: '12px' }}>
                  <Field as="input" className="appearance-none bg-transparent border-b-2 border-gray-300 focus:border-blue-500 w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none" name="email" type="email" placeholder="Enter Your Email" aria-label="Email" />
                  <ErrorMessage name="email" component="div" className="text-red-500 mt-2" />
                </div>

                <div className="w-[420px] bg-white p-4 shadow-md" style={{ borderRadius: '12px' }}>
                  <Field as="input" name="password" type="password" placeholder="Enter Your Password" className="appearance-none bg-transparent border-b-2 border-gray-300 focus:border-blue-500 w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none" />
                  <ErrorMessage name="password" component="div" className="text-red-500" />
                </div>

                <Button fullWidth variant="contained" color="primary" type="submit" disabled={isSubmitting} className="bg-[#5CB85C] flex justify-center p-3 w-[159px] h-[45px] text-black text-[19px]">
                  LOGIN
                </Button>

                <div className="flex">
                  <p>Forget Password?</p>
                  <Link onClick={handleOpenModal} className="text-red-600 ml-[5px]">
                    Contact Administrator
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        PaperProps={{ style: { width: '400px', maxWidth: '90%' } }}
      >
        <DialogTitle>Contact Administrator</DialogTitle>
        <Formik
          initialValues={{ name: '', email: '', mobile: '', comment: '' }}
          validationSchema={modalValidationSchema}
          onSubmit={handleModalSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <DialogContent>
                <Field as={TextField} label="Name" name="name" fullWidth margin="normal" />
                <ErrorMessage name="name" component="div" className="text-red-500" />

                <Field as={TextField} label="Email" name="email" fullWidth margin="normal" />
                <ErrorMessage name="email" component="div" className="text-red-500" />

                <Field as={TextField} label="Mobile" name="mobile" fullWidth margin="normal" />
                <ErrorMessage name="mobile" component="div" className="text-red-500" />

                <Field as={TextField} label="Comment" name="Comment" fullWidth margin="normal" />
                <ErrorMessage name="Comment" component="div" className="text-red-500" />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" color="primary" disabled={isSubmitting}>
                  Submit
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Toast Container */}
      <Toaster position="top-right" />
    </div>
  );
};

export default Login;
