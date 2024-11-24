import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
// material-ui
import { useTheme } from '@mui/material/styles';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormLabel,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _, { update } from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project-imports
import AlertBlogDelete from './AlertBlogDelete';
import IconButton from 'components/@extended/IconButton';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { ThemeMode } from 'config';

// assets
import { Camera } from 'iconsax-react';
import ReactQuill from 'react-quill';
import axios from 'axios';
import { useParams } from 'react-router';

// const handleQuillChange = (value) => {
//   setaddNewDescription(value);
// };

// constant
const getInitialValues = (blog) => {
  const newblog = {
    name: '',
    description: ''
  };

  if (blog) {
    newblog.name = blog.fatherName;
    newblog.description = blog.description;
    return _.merge({}, newblog, blog);
  }

  return newblog;
};

// const allStatus = ['Complicated', 'Single', 'Relationship'];

// ==============================|| blog - ADD / EDIT ||============================== //

const EditBlog = ({ blog, blogcard, onCancel,setEditModal,setupdateddata }) => {
  const [addNewDescription, setaddNewDescription] = useState('');
  const theme = useTheme();
  const isCreating = !blog;
  const [BoolImage, setBoolImage] = useState(false);
  const [EditImage, setEditImage] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [addNewTitle, setaddNewTitle] = useState();
  const [addNewImage, setaddNewImage] = useState(null);
  const [editTitle, setEditTitle] = useState(blogcard?.title || '');
  const [editDescription, setEditDescription] = useState(blogcard?.description || '');
  const [originalTitle, setoriginalTitle] = useState('');
  const [originalDescription, setoriginalDescription] = useState('');
  const [originalImage, setoriginalImage] = useState(null);
  const [FileImage, setFileImage] = useState();


  // const [updateddata,setupdateddata] = useState(false)
  const { id } = useParams();
  // const [editModal, setEditModal] = useState({
  //   open: false,
  //   blog: null
  // });

  const [selectedImage, setSelectedImage] = useState(undefined);
  const BlogSchema = Yup.object().shape({});

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };

  const formik = useFormik({
    initialValues: getInitialValues(blog),
    validationSchema: BlogSchema,
    onSubmit: (values, { setSubmitting }) => {
      try {
        if (blog) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'blog update successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        } else {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Blog added successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        }

        setSubmitting(false);
        onCancel();
      } catch (error) {
        console.error(error);
      }
    }
  });






// updating the state data

// useEffect(() => {
//   if(updateddata){
//     setupdateddata(false)
//   }
  


// }, [updateddata])




  // useEffect to initialize state variables when blogcard prop changes
  // useEffect(() => {
  //   if (blogcard) {
  //     setEditTitle(blogcard.title);
  //     setEditDescription(blogcard.description);
  //     setEditImage(blogcard.image);
  //   }
  // }, [blogcard]); // Dependency on blogcard prop

  const handleQuillEditDescriptionChange = (value) => {
    setEditDescription(value);
  };
  const [viewModal, setViewModal] = useState({
    open: false,
    blog: null
  });

  const handleQuillChange = (value) => {
    setaddNewDescription(value);
  };

  const [addNewModal, setAddNewModal] = useState({
    open: false
  });

  const handleAddModalClose = () => {
    setAddNewModal({
      open: false
      // blog: { ...blog },
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log('file aayi?', file);

    if (file) {
      setaddNewImage(file); // Set the File object directly
    }
  };

  const handleAddNew = () => {
    setAddNewModal({
      open: true
    });

    // Reset the form fields for adding a new blog
    setaddNewTitle('');
    setaddNewDescription('');
    setaddNewImage('');
  };

  // const handleEditModalClose = () => {
  //   setEditModal({
  //     open: false,
  //     // blog: { ...blogcard }
  //   });
  // };

  // Import useParams

  // useEffect in

  // console.log('Blog Data', blog);

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const requestData = new FormData();
      requestData.append('title', editTitle);
      requestData.append('description', editDescription);

      if (FileImage !== originalImage) {
        requestData.append('image', FileImage);
      }

      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/api/blogs/${blog._id}`, requestData, {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
      
        // Update state variables with new data
        setEditTitle(response.data.blog.title);
        setEditDescription(response.data.blog.description);
        setEditImage(response.data.blog.image);

        // Close the edit modal
        
        
  
        
        // Display success message
        
        setupdateddata(true)
        setTimeout(() => {
          setEditModal({ open: false});
          
        }, 2000);
        toast.success('Blog updated successfully');

        

        // Reset the form
    
        
      } else {
        // Display error message
        // toast.error('Error updating blog');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      // Display error message
      // toast.error('Error updating blog');
    }
  };

  // console.log('useEffecrt before data', blog);
  useEffect(() => {
    const fetchblogbyid = async () => {
      const token = localStorage.getItem('token');
      try {
        if (!blog) return;
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/${blog._id}`, {
          headers: {
            'content-type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
      }});
          

        setRowData(response.data);
        setEditTitle(blogcard.title);
        setEditDescription(blogcard.description);
        setEditImage(blogcard.image);
        // console.log('response rowData:', response.data);
      } catch (error) {
        console.log('Error', error);
      }
    };
    fetchblogbyid();
  }, [blog]);

  // setEditTitle(blogcard.title);
  // setEditDescription(blogcard.description);
  // setEditImage(blogcard.image)

  const handleEditImageChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setBoolImage(true);
    } else {
      // Handle the case where the selected file is not an image
      // Handle the case where the selected file is not an image
      console.error('Invalid file type. Please select an image.');
    }
  };
  useEffect(() => {
    if (blogcard) {
      // Initialize state variables with data from blogcard
      setEditTitle(blogcard.title);
      setEditDescription(blogcard.description);
      setEditImage(blogcard.image);
      setoriginalTitle(blogcard.title);
      setoriginalDescription(blogcard.description);
      setoriginalImage(blogcard.image);
      console.log('Blogcard se data aara h edit m---->',blogcard)
    }
  }, [blogcard]);

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  // console.log(blogcard._id)
  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              
              // handleEditModalClose();
              handleSaveEdit();
            }}
          >
            <DialogTitle>Edit Blog</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                    <FormLabel
                      htmlFor="change-avtar"
                      sx={{
                        position: 'relative',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        '&:hover .MuiBox-root': { opacity: 1 },
                        cursor: 'pointer'
                      }}
                    >
                      <div>
                        {!BoolImage ? (
                          <img
                            src={EditImage}
                            alt="Edited Image"
                            style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '50%'
                            }}
                          />
                        ) : (
                          <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Image Changed"
                            style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '50%'
                            }}
                          />
                        )}
                      </div>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Stack spacing={0.5} alignItems="center">
                          <Camera style={{ color: theme.palette.secondary.lighter, fontSize: '2rem' }} />
                          <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                        </Stack>
                      </Box>
                    </FormLabel>
                    <TextField
                      type="file"
                      id="change-avtar"
                      placeholder="Outlined"
                      variant="outlined"
                      sx={{ display: 'none' }}
                      // onChange={(e) => setSelectedImage(e.target.files?.[0])}
                      onChange={handleEditImageChange}
                    />
                    {/* {console.log("Fileimage chck--->", FileImage)} */}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="blog-name">Blog Name</InputLabel>
                        <TextField
                          fullWidth
                          id="blog-name"
                          placeholder="Enter Blog Name"
                          // {...getFieldProps('name')}
                          // error={Boolean(touched.name && errors.name)}
                          // helperText={touched.name && errors.name}
                          // onChange={(e) => setEditTitle(e.target.value)}
                          // value= {blogcard?.title}
                          onChange={(e) => setEditTitle(e.target.value)} // Update editTitle when text changes
                          value={editTitle}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="desc">Description</InputLabel>
                        <div className="max-h-40 overflow-y-auto">
                          <ReactQuill
                            theme="snow"
                            name="description"
                            id="blog-description"
                            className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                            placeholder="Description"
                            required=""
                            // onChange={handleQuillChange}
                            onChange={handleQuillEditDescriptionChange}
                            // value= {blogcard?.description}
                            value={editDescription}
                          />
                        </div>
                        {/* <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="file_input"
                >
                  Upload file
                </label>
                <input
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  type="file"
                  name="image"
                  id="image"
                  required=""

                  onChange={handleEditImageChange}
                  value={EditImage}
                />
              </div> */}
                        {/* {console.log("Fileimage chck--->", FileImage)} */}
                      </Stack>
                    </Grid>

                    {/* for image upload */}
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                {/* <Grid item>
                  {!isCreating && (
                    <Tooltip title="Delete blog" placement="top">
                      <IconButton onClick={() => setOpenAlert(true)} size="large" color="error">
                        <Trash variant="Bold" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid> */}
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button className="bg-gray-300 text-red-600" color="error" onClick={onCancel}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-gray-300 text-red-600 "
                      type="submit"
                      variant="contained"
                      disabled={editTitle === originalTitle && editDescription === originalDescription && BoolImage === false}
                    >
                      Edit
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>


        <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ color: '#fff' }}
      />












      </FormikProvider>
      {!isCreating && <AlertBlogDelete title={blog.fatherName} open={openAlert} handleClose={handleAlertClose} />}





















    </>
  );
};

EditBlog.propTypes = {
  blog: PropTypes.any,
  onCancel: PropTypes.func
};

export default EditBlog;
