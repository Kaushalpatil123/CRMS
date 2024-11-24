import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// material-ui
import {
  useMediaQuery,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
  Tooltip
} from '@mui/material';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import SimpleBar from 'components/third-party/SimpleBar';
import { PopupTransition } from 'components/@extended/Transitions';
// import {  Edit, Trash } from 'iconsax-react';
import AddBlog from './AddBlog';
import AlertBlogDelete from './AlertBlogDelete';
import { useNavigate } from 'react-router';
import axios from 'axios';
import DOMPurify from 'dompurify';
// import Blog from 'pages/apps/blog/Blog';
const avatarImage = require.context('assets/images/users', true);
// ==============================|| Blog - PREVIEW ||============================== //
// export default function BlogPreview({  blog, open, onClose }) {
  const BlogPreview = ({  blogcard, open, onClose }) => {
  const [rowData, setRowData] = useState([]);

  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [openAlert, setOpenAlert] = useState(false);
  const [add, setAdd] = useState(false);
  const [viewModal, setViewModal] = useState({
    open: false,
    blog: null,
  });


  const handleAdd = () => {
    setAdd(!add);
  };
  const handleClose = () => {
    setOpenAlert(!openAlert);
    onClose();
  };

  const handleViewModalClose = () => {
    setViewModal({
      open: false,
      blog: null,
    });
  };



  const handleView = async (blogId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/${blogId}`, {
        headers: {
          "Content-Type": "application/json", // Include the user's token

        },
      });

      // Assuming your raw body response is plain text
      // const responseData = response.data;


      if (response.data) {
        setRowData(response.data.blogs);
        console.log("response data blogs", response.data.blogs); // Update rowData state with fetched data
      } else {
        console.error("Empty response data or unexpected htmlFormat");
      }
      
      
      // Adjust this logic based on the actual format of your raw body response
      // For example, if your response is plain text, you might display it directly
      setViewModal({
        open: true,
        blog: response.data, // Adjust this line accordingly
      });
    } catch (error) {
      console.error("Error fetching blog details:", error);
    }
  };


  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
 
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs`, {
  
        });

        if (response.data) {
          setRowData(response.data.blogs);
          console.log("response data blogs", response.data.blogs); // Update rowData state with fetched data
        } else {
          console.error("Empty response data or unexpected htmlFormat");
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
      // }
    };

    fetchUsers();
  }, []);


  // useEffect( () => {
  //   const fetchblogbyid= async()=>{
    
    
  //     try {
  //       const response = await axios.get(`process.env.REACT_APP_API_URL/api/blogs/${blog._id}`);
  //       setRowData(response.data);
  //       // setEditTitle(blogcard.title);
  //       // setEditDescription(blogcard.description);
  //       // setEditImage(blogcard.image)
  //       console.log("response rowData:", response.data);
  //     } catch (error) {
  //       console.log("Error", error);
  //     } 
    
      
  //   }
  //   fetchblogbyid();
      
  //   },[])

  // const handleAdd = () => {
  //   setAdd(!add);
  // };


  // Function to fetch the blog details by ID
  // const fetchBlogById = async () => {
  //   try {
  //     // Check if blog is defined and has _id property
  //     if (blog && blog._id) {
  //       const response = await axios.get(`process.env.REACT_APP_API_URL/api/blogs/${blog._id}`);
  //       return response.data; // Return the blog details fetched from the API
  //     } else {
  //       console.error("Blog or _id is undefined");
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Error fetching blog details:", error);
  //     return null;
  //   }
  // };
  
  // useEffect(() => {
  //   fetchBlogById(); // Fetch blog details when the component mounts
  // }, [blog]); // Trigger fetch when the blog prop changes
  






    // {console.log("view model", blogcard)}
    // console.log("view model", viewModal.image)
    // console.log(blogcard._id)
  return (
    <>
   
      <Dialog
        open={open}
        TransitionComponent={PopupTransition}
        keepMounted
        onClose={onClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{ '& .MuiDialog-paper': { width: 1024, maxWidth: 1, m: { xs: 1.75, sm: 2.5, md: 4 } } }}
      >
         {/* {paginatedData.map((row) => ( ))} */}
        <Box id="PopupPrint" sx={{ px: { xs: 2, sm: 3, md: 5 }, py: 1 }}>
          <DialogTitle sx={{ px: 0 }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <List sx={{ width: 1, p: 0 }}>
                <ListItem disablePadding>
                  <ListItemAvatar sx={{ mr: 0.75 }}>
                    <Avatar
                      alt="this is view image"
                      size="lg"
                      // src={avatarImage(`./avatar-${!blog?.avatar ? 1 : blog?.avatar}.png`)}
                      src={blogcard?.image}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    // primary={<Typography variant="h5">{blog?.fatherName}</Typography>}
                    // secondary={<Typography color="secondary"></Typography>}
                  />
                </ListItem>
              </List>
              {/* <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                <Tooltip title="Edit">
                  <IconButton color="secondary" onClick={handleAdd}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete" onClick={handleClose}>
                  <IconButton color="error">
                    <Trash />
                  </IconButton>
                </Tooltip>
              </Stack> */}
            </Stack>
          </DialogTitle>
          <DialogContent dividers sx={{ px: 0 }}>
            <SimpleBar sx={{ height: 'calc(100vh - 290px)' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} >
                  <Grid container spacing={2.25}>
                    <Grid item xs={12}>
                      <MainCard title="Blog Name">
                        <Typography>
                         {/* {blogcard?.description} */}
                         {blogcard?.title}
                        </Typography>
                      </MainCard>
                    </Grid>
                    <Grid item xs={12}>
                      <MainCard title="Description ">
                        <List sx={{ py: 0 }}>
                          {/* <ListItem divider> */}
                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                              <Grid item xs={12}>
                                 {/* {blogcard?.description} */}
                                {/* <div>
                             
                              dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          blogcard?.description
                        ),
                      }}</div> */}
                       <p
                      className="text-left"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                      blogcard.description
                        ),
                      }}
                    />
                              </Grid>
                              {/* <Grid item xs={12} >
                                <Stack spacing={0.5}>
                                  <Typography color="secondary">Institute</Typography>
                                  <Typography>-</Typography>
                                </Stack>
                              </Grid> */}
                            </Grid>
                          {/* </ListItem> */}
                        
                         
                        </List>
                      </MainCard>
                    </Grid>
                  </Grid>
                </Grid>
              
              </Grid>
            </SimpleBar>
          </DialogContent>

          <DialogActions>
            <Button color="error" className="bg-red-500 hover:bg-red-700" variant="contained" onClick={onClose}>
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* edit blog dialog */}
      {/* <Dialog
        maxWidth="sm"
        fullWidth
        TransitionComponent={PopupTransition}
        onClose={handleAdd}
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 } }}
      >
      
        <AddBlog blog={blog} onCancel={handleAdd} />
      </Dialog> */}

      {/* <AlertBlogDelete title={blog?.fatherName} open={openAlert} handleClose={handleClose} /> */}

    </>
  );
}

// BlogPreview.propTypes = {
//   // blog: PropTypes.object,
//   open: PropTypes.bool,
//   onClose: PropTypes.func
// };




export default BlogPreview