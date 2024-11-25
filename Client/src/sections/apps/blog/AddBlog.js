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
  //   FormControl,
  //   FormControlLabel,
  FormLabel,
  Grid,
  //   FormHelperText,
  InputLabel,
  //   ListItemText,
  //   MenuItem,
  //   OutlinedInput,
  //   Select,
  Stack,
  //   Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project-imports
import AlertBlogDelete from './AlertBlogDelete';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { ThemeMode } from 'config';

// assets
import { Camera, Trash } from 'iconsax-react';
import ReactQuill from 'react-quill';
import axios from 'axios';

const avatarImage = require.context('assets/images/users', true);

// const handleQuillChange = (value) => {
//   setaddNewDescription(value);
// };

// const handleQuillEditDescriptionChange = (value) => {
//   setEditDescription(value);
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

const AddBlog = ({ blog, onCancel, setupdateddata,setAdd }) => {
  const [addNewDescription, setaddNewDescription] = useState('');
  const theme = useTheme();
  const isCreating = !blog;
  const [BoolImage, setBoolImage] = useState(false);
  // const [BoolImage, setBoolImage] = useState(false);

  const [EditImage, setEditImage] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [addNewTitle, setaddNewTitle] = useState();
  const [addNewImage, setaddNewImage] = useState(null);

  const [selectedImage, setSelectedImage] = useState(undefined);
  const [avatar, setAvatar] = useState(avatarImage(`./avatar-${isCreating && !blog?.avatar ? 1 : blog.avatar}.png`));

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const BlogSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Name is required'),
    description: Yup.string().max(500)
  });

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
        // const newblog = {
        //   name: values.name,
        //   email: values.email,
        //   description: values.description,
        //   orderStatus: values.orderStatus
        // };

        if (blog) {
          // dispatch(updateblog(blog.id, newblog)); - update
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
          // dispatch(createblog(newblog)); - add
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

  const [viewModal, setViewModal] = useState({
    open: false,
    blog: null
  });

  const handleQuillChange = (value) => {
    setaddNewDescription(value);
  };

  // const handleQuillEditDescriptionChange = (value) => {
  //   setEditDescription(value);
  // };
  // Add New Blog

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
    // if (selectedImage) {
    // }

    if (file) {
      setAvatar(URL.createObjectURL(file));
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
    // console.log("addednewimage", setaddNewImage);
    setaddNewImage('');
  };

  const handleSaveNewBlog = async () => {
    const token = localStorage.getItem('token');
    try {
      // const newdescription = ReactHtmlParser(addNewDescription)
      //  const newdescription = ReactHtmlParser(addnew)
      // const plainText = DOMPurify.sanitize(addNewDescription, { ALLOWED_TAGS: allowedTags });
      const requestData = new FormData();
      requestData.append('title', addNewTitle);
      requestData.append('description', addNewDescription);
      requestData.append('image', addNewImage);
      console.log('addimage m image kaise aare?', addNewImage);

      // console.log("requestdat", requestData);

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/blog`, requestData, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
      });

      // Handle the response as needed
      console.log('Create API response:', response.data);

      if (response.data.status === 'success') {
        // Close the add new modal after successful creation
        setupdateddata(true);
        setTimeout(() => {
          setAdd((prev)=>!prev)
          
        }, 3000);
        toast.success('Blog Added successfully');
        // setAddNewModal({ open: false });
        // Fetch the updated data from the server and update the rowData state
        try {
          const updatedData = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs`);
          setRowData(updatedData.data.blogs);
          console.log('Updated rowData:', updatedData.data.blogs);
        } catch (error) {
          console.log('Error', error);
        }

        // toast.success('Blog created Successfully');
      } else {
        toast.error('Error creating blog');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      // Handle error and display a toast or error message to the user
      toast.error('Error creating blog');
    }
  };

  // const handleViewModalClose = () => {
  //   setViewModal({
  //     open: false,
  //     blog: null,
  //   });
  // };

  // const handleView = async (blogId) => {
  //   try {
  //     const response = await axios.get(`${server}/api/blogs/${blogId}`, {
  //       headers: {
  //         "Content-Type": "application/json", // Include the user's token
  //       },
  //     });

  //     // Assuming your raw body response is plain text
  //     const responseData = response.data;
  //     console.log("This is response data", responseData);

  //     // Adjust this logic based on the actual format of your raw body response
  //     // For example, if your response is plain text, you might display it directly
  //     setViewModal({
  //       open: true,
  //       blog: responseData, // Adjust this line accordingly
  //     });
  //   } catch (error) {
  //     console.error("Error fetching blog details:", error);
  //   }
  // };

  // const [editModal, setEditModal] = useState({
  //   open: false,
  //   blog: null,
  // });

  // const handleEdit = (blog) => {
  //   setEditModal({
  //     open: true,
  //     blog: { ...blog },
  //   });

  //   console.log("row akkakka", blog);
  //   // Set the initial values for editing
  //   setEditTitle(blog.title);
  //   setoriginalTitle(blog.title);

  //   setEditDescription(blog.description);
  //   setoriginalDescription(blog.description);
  //   setEditImage(blog.image);
  //   setoriginalImage(blog.image);
  //   console.log("seteditimage ho ri h?---", blog.image);
  // };

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form
            autoComplete="off"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              handleAddModalClose();
              handleSaveNewBlog();
            }}
          >
            <DialogTitle>New Blog</DialogTitle>
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
                      <Avatar alt="Avatar 1" src={avatar} sx={{ width: 72, height: 72, border: '1px dashed' }} />
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
                      onChange={handleImageChange}
                    />
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
                          {...getFieldProps('name')}
                          // error={Boolean(touched.name && errors.name)}
                          // helperText={touched.name && errors.name}
                          onChange={(e) => setaddNewTitle(e.target.value)}
                          value={addNewTitle}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="desc">Description</InputLabel>
                        {/* <TextField
                          fullWidth
                          id="blog-description"
                          multiline
                          rows={4}
                          placeholder="Enter Description"
                          
                        /> */}
                        <div className="max-h-40 overflow-y-auto">
                          <ReactQuill
                            theme="snow"
                            name="description"
                            id="blog-description"
                            className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                            placeholder="Description"
                            required=""
                            onChange={handleQuillChange}
                            // onChange={(e) => setaddNewDescription(e.target.value)}
                            value={addNewDescription}
                          />
                        </div>
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
                <Grid item>
                  {!isCreating && (
                    <Tooltip title="Delete blog" placement="top">
                      <IconButton onClick={() => setOpenAlert(true)} size="large" color="error">
                        <Trash variant="Bold" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="error" onClick={onCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600" variant="contained" disabled={isSubmitting}>
                      Add
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

AddBlog.propTypes = {
  blog: PropTypes.any,
  onCancel: PropTypes.func
};

export default AddBlog;
