import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Grid, List, ListItem, ListItemAvatar, ListItemText, Typography, Menu, MenuItem, Divider, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { More } from 'iconsax-react';
import AlertBlogDelete from './AlertBlogDelete';
import AddBlog from './AddBlog';
import BlogPreview from './BlogPreview';
import { PopupTransition } from 'components/@extended/Transitions'; // Import PopupTransition
import { Dialog, Stack, Button } from '@mui/material'; // Import Dialog, Stack, and Button
import EditBlog from './Editblog';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DOMPurify from 'dompurify';
// const isCreating = !blog;

const BlogCard = ({ blogcard, blog, onCancel,setupdateddata }) => {
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [add, setAdd] = useState(false);
  const [editModal, setEditModal] = useState({
    open: false,
    blog: null
  });

  const [EditImage, setEditImage] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [addNewTitle, setaddNewTitle] = useState();
  const [addNewImage, setaddNewImage] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [originalDescription, setOriginalDescription] = useState('');
  const [originalImage, setOriginalImage] = useState(null);
  const [FileImage, setFileImage] = useState();
  // const [updateddata,setupdateddata] = useState(false)


  const [viewModal, setViewModal] = useState({
    open: false,
    blog: null
  });

  // Delete State
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    id: null
  });

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation({ open: true, id });
  };

  //Delete Handling
  const handleConfirmDelete = async () => {
    // handleClose();
    const { id } = deleteConfirmation;
    if (id) {
      try {
        const token = localStorage.getItem("token");
        // if (!token) {
        // If no token is found, redirect to the login page
        //   navigate("/");
        // } else {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/blogs/${id}`, {
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${token}`
          }
        })

        // Update rowData after deletion
        // setRowData((prevRowData) => prevRowData.filter((blog) => blog._id !== id));
        console.log('Deleted blog of id -->', id);
        setupdateddata(true)
        
        toast.success('blog deleted Successfully');

        // }
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
    // toast.error('Id does not exist or Not getting id');
    setDeleteConfirmation({ open: false, id: null });
  };

  //   const getInitialValues = (blog) => {
  //   const newblog = {
  //     name: '',
  //     description: ''
  //   };

  //   if (blog) {
  //     newblog.name = blog.fatherName;
  //     newblog.description = blog.description;
  //     return _.merge({}, newblog, blog);
  //   }

  //   return newblog;
  // };
  //
  // const isCreating = !blog;

  // Fetch avatar image based on blog

  const openMenu = Boolean(anchorEl);
  const handleClickOpen = () => {
    setOpen(true);
    console.log('open', setOpen(true));
  };

  const handleClose = () => {
    setOpen(false);
    console.log('setOpen(false)', setOpen(false));
  };

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    handleMenuClose();
  };

  const handleMenuClick = (event) => {
    // setAnchorEl(event.currentTarget);
    // event.preventDefault();
    console.log('Handle menu click par 3 button open', setAnchorEl(event.currentTarget));
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    console.log('Handle menu click par 3 button close  ', setAnchorEl(null));
  };

  const handleAdd = () => {
    setAdd(!add);
  };

  // const handleEdit = (blog) => {
  //   // Open the edit modal and set the initial values for editing
  //   setEditModal({
  //     open: true,
  //     blog: { ...blog }
  //   });
  //   handleMenuClose();
  // };

  const handleviewedit = async (blogId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/${blogId}`, {
        headers: {
          'Content-Type': 'application/json' // Include the user's token
        }
      });

      // Assuming your raw body response is plain text
      const responseData = response.data;
      console.log('This is response data', responseData);

      // Adjust this logic based on the actual format of your raw body response
      // For example, if your response is plain text, you might display it directly
      setViewModal({
        open: true,
        blog: responseData // Adjust this line accordingly
      });
    } catch (error) {
      console.error('Error fetching blog details:', error);
    }
  };





// updating the state data from edit

// useEffect(async() => {
//   if(updateddata){


//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs`, {

//       });

//       if (response.data) {
//         setRowData(response.data.blogs);
//         console.log("response data blogs", response.data.blogs);
//        // Update rowData state with fetched data
//       } else {
//         console.error("Empty response data or unexpected htmlFormat");
//       }
//     } catch (error) {
//       console.error("Error fetching blogs:", error);
//     }
//     // }
//     setupdateddata(false)
//     console.log('FInal setupdated ba') 
//   }
//   },[updateddata])









  // const handleEdit = () => {
  //   // Open the edit modal and set the initial values for editing

  //   setEditModal({
  //     open: true,
  //     blog: { ...blogcard },
  //   });
  //   // handleClose();
  //   // onCancel();
  //   console.log("row akkakka", blogcard);
  //   setEditTitle(blogcard.name);
  //   setEditDescription(blogcard.description);
  //   setOriginalTitle(blogcard.name);
  //   setOriginalDescription(blogcard.description);
  //   setEditImage(blogcard.image); // Assuming you have an image field in your blog object
  //   setOriginalImage(blogcard.image); // Assuming you have an image field in your blog object
  //   console.log("seteditimage ho ri h?---", blogcard.image);
  // };

  const handleEdit = () => {
    // Open the edit modal and set the initial values for editing
    
    setEditModal({ open: true,blog: { ...blogcard }, });
    
  };

  const handleView = async (blogId) => {
    setOpen(true);
    setViewModal({
      setOpen: true,
      blog: { ...blogcard }
    });
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/${blogId}`, {
        headers: {
          'Content-Type': 'application/json' // Include the user's token
        }
      });

      // Assuming your raw body response is plain text
      const responseData = response.data;
      console.log('This is response data', responseData);

      // Adjust this logic based on the actual format of your raw body response
      // For example, if your response is plain text, you might display it directly
      setViewModal({
        setOpen: true,
        blog: responseData // Adjust this line accordingly
      });
    } catch (error) {
      console.error('Error fetching blog details:', error);
    }
  };

  console.log('this is blogcard data :- ', blogcard);

  // Delete function implement

  return (
    <>
      {deleteConfirmation.open && (
        <div className="fixed top-0 left-0 w-full h-full z-40 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md">
            <p className="mb-4">Are you sure you want to delete this record?</p>
            <div className="flex justify-end">
              <button className="bg-red-500 text-white px-4 py-2 rounded-md mr-4" onClick={handleConfirmDelete}>
                Confirm
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                onClick={() => setDeleteConfirmation({ open: false, id: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid container spacing={2.25}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton edge="end" aria-label="comments" color="secondary" onClick={handleMenuClick}>
                    <More style={{ fontSize: '1.15rem' }} />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar alt='Not found' src={blogcard.image} />
                 { console.log('Blogcard image--->',blogcard.image)}
                </ListItemAvatar>
                <ListItemText primary={<Typography variant="subtitle1">{blogcard.title}</Typography>} />
              </ListItem>
            </List>

            <Menu
              id="fade-menu"
              MenuListProps={{
                'aria-labelledby': 'fade-button'
              }}
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              {/* <MenuItem sx={{ a: { textDecoration: 'none', color: 'inherit' } }}></MenuItem> */}
              {/* <Dialog
                maxWidth="sm"
                fullWidth
                TransitionComponent={PopupTransition}
                onClose={() => setEditModal({ open: false, blog: null })}
                open={editModal.open} // Use editModal.open instead of add
                sx={{ '& .MuiDialog-paper': { p: 0 } }}
              >
                <EditBlog blogcard={blogcard} blog={editModal.blog} onCancel={() => setEditModal({ open: false, blog: null })} />
               
              </Dialog> */}
              <Dialog
                maxWidth="sm"
                fullWidth
                TransitionComponent={PopupTransition}
                onClose={() => setEditModal({ open: false })}
                open={editModal.open} // Use editModal.open instead of add
                sx={{ '& .MuiDialog-paper': { p: 0 } }}
              >
                <EditBlog blogcard={blogcard} setupdateddata={setupdateddata} blog={editModal.blog} setEditModal = {setEditModal} onCancel={() => setEditModal({ open: false })} />
              </Dialog>

              <MenuItem
                onClick={() => {
                  handleEdit(blogcard._id);
                  // handleMenuClose;
                }}
              >
                {console.log('Edit button clicked',blogcard._id)}
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleDeleteConfirmation(blogcard._id);
                  handleMenuClose();
                }}
              >
                Delete
              </MenuItem>
            </Menu>

            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography>
                {/* <div>{blogcard.description}</div> */}
                <p
                  className="text-left"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(blogcard.description)
                  }}
                />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1} direction={{ xs: 'column', md: 'row' }}>
                <Grid item xs={6}>
                  <List
                    sx={{
                      p: 0,
                      overflow: 'hidden',
                      '& .MuiListItem-root': { px: 0, py: 0.5 },
                      '& .MuiListItemIcon-root': { minWidth: 28 }
                    }}
                  ></List>
                </Grid>
                <Grid item xs={6}>
                  <List
                    sx={{
                      p: 0,
                      overflow: 'hidden',
                      '& .MuiListItem-root': { px: 0, py: 0.5 },
                      '& .MuiListItemIcon-root': { minWidth: 28 }
                    }}
                  ></List>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0.5,
                    m: 0
                  }}
                  component="ul"
                ></Box>
              </Box>
            </Grid>

            {/* Rest of your code */}
          </Grid>
        </Grid>
        <Stack
          direction="row"
          className="hideforPDf"
          alignItems="center"
          spacing={1}
          justifyContent="space-between"
          sx={{ mt: 'auto', mb: 0, pt: 2.25 }}
        >
          {/* <Typography variant="caption" color="text.secondary">
            Updated in {blogcard.time}
          </Typography> */}

          <Button variant="outlined" size="small" onClick={(e) => handleView(blogcard._id)}>
            Preview
          </Button>
          <BlogPreview blogcard={blogcard} open={open} onClose={handleClose} />
        </Stack>
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
      </MainCard>

      <Dialog
        maxWidth="sm"
        fullWidth
        TransitionComponent={PopupTransition}
        onClose={handleAdd}
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 } }}
      >
        <AddBlog blogcard={blogcard} onCancel={handleAdd} />
      </Dialog>

      {/* <AlertBlogDelete title={blogcard.fatherName} open={openAlert} handleClose={handleAlertClose} /> */}
    </>
  );
};

// BlogCard.propTypes = {

//   blogcard: PropTypes.shape({
//     fatherName: PropTypes.string,
//     image: PropTypes.string,
//     title: PropTypes.string,
//     description: PropTypes.string,
//     id : PropsTypes.string
//     // Add description prop type
//   })
// };

export default BlogCard;
