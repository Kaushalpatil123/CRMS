import { Card, CardTitle, Button } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { Trash } from 'iconsax-react';
import { Add, Edit } from 'iconsax-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMediaQuery, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const server = process.env.REACT_APP_API_URL;
export default function Component() {
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [addquestion, setAddquestion] = useState();
  const [addanswer, setAddanswer] = useState();
  const [password, setPassword] = useState();
  const [editQues, seteditQues] = useState();
  const [editPassword, setEditPassword] = useState();
  const [editAns, setEditAns] = useState();
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [DialogPasswordUserId, setDialogPasswordUserId] = useState('');

  const [FaqData, setFaqData] = useState([]);
  const [addNewModal, setAddNewModal] = useState({
    open: false
  });

  const handlePasswordDialogOpen = (id) => {
    console.log('id aari h passworddialog m-->', id);
    setDialogPasswordUserId(id);
    setOpenPasswordDialog(true);
    if (localStorage.getItem('role') === 'superadmin') {
      handleDeleteConfirmation(id);
    }
  };

  const handlePasswordDialogClose = () => {
    setOpenPasswordDialog(false);
    // setPassword('');
    // setErrorMessage('');
  };

  const PasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Autochange password matching

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    console.log('submit m aaye ho?');

    const role = localStorage.getItem('role');

    console.log('role btao', role);
    if (role === 'admin') {
      if (password) {
        handlePasswordDialogClose();
        handleDeleteConfirmation(DialogPasswordUserId);
      } else {
        toast.error('Incorrect Password, Try again');
      }
    }
  };

  const handleAddModalClose = () => {
    setAddNewModal({
      open: false
    });
  };

  const handleAddNew = () => {
    setAddNewModal({
      open: true
    });
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    id: null
  });

  const handleClose = () => {
    setOpen(!open);
  };

  // deleting the faq

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const { id } = deleteConfirmation;

    if (id) {
      try {
        const token = localStorage.getItem('token');
        // if (!token) {
        // navigate("/");
        // } else {
        await axios.delete(`${server}/api/faq/deletefaq/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            password: password
          }
        });
        console.log('faqdata filter delete--->', FaqData);

        try {
          const token = localStorage.getItem('token');
          const updatedData = await axios.get(`${server}/api/faq`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('updated api ata--->', updatedData.data);

          setFaqData(updatedData.data);
        } catch (error) {
          console.log('Error duing Updated DAta fetching', error);
        }

        toast.success('FAQ Deleted Successfully');
      } catch (error) {
        console.error('Error deleting Faq:', error);

        toast.error(error.response.data.message);
      }
    }
    setDeleteConfirmation({ open: false, id: null });
  };

  // getting all faq

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // navigate("/");
      } else {
        try {
          const response = await axios.get(`${server}/api/faq`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('response aayaa000--->', response.data);
          if (response.data) {
            setFaqData(response.data);
            console.log('api data faq--->', response.data);
          } else {
            console.error('Empty response data or unexpected format');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };
    fetchUsers();
  }, []);

  // adding new faq

  const handleSaveNewFaq = async () => {
    try {
      // ---- IT's Working ------
      const requestData = {
        question: addquestion,
        answer: addanswer
      };

      const token = localStorage.getItem('token');
      console.log(token);
      const response = await axios.post(`${server}/api/faq/create`, requestData, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
          password: password
        }
      });

      // Handle the response as needed
      console.log('Create API response:', response.data);

      if (response.status === 201) {
        // Close the add new modal after successful creation
        setAddNewModal({ open: false });
        setAddquestion('');
        setAddanswer('');
        setPassword('');

        try {
          const token = localStorage.getItem('token');
          const updatedData = await axios.get(`${server}/api/faq`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('updated api ata--->', updatedData.data);

          setFaqData(updatedData.data);
          toast('New Faq added Successfully');
        } catch (error) {
          // console.log('Error duing Updated DAta fetching', error);
          toast.error(error.response.data.message);
        }
      } else {
        toast.error('Error Creating FAQ');
      }
    } catch (error) {
      console.error('Error creating FAQ:', error);

      toast.error(error.response.data.message);
    }
  };

  //  Edit faq

  const [editModal, setEditModal] = useState({
    open: false,
    details: null
  });

  // Editing the faq

  const handleEdit = (details) => {
    setEditModal({
      open: true,
      details: { ...details }
    });

    // Set the initial values for editing
    seteditQues(details.question);
    console.log('details edit ques ans values', details);
    setEditAns(details.answer);

    console.log('Initializatin completed');
  };

  const handleEditModalClose = () => {
    setEditModal({
      open: false
      // blog: { ...blog },
    });
  };

  // Calling the update api
  const handleSaveEdit = async () => {
    try {
      const requestData = {
        question: editQues,
        answer: editAns
      };

      const token = localStorage.getItem('token');
      const response = await axios.put(`${server}/api/faq/${editModal.details._id}`, requestData, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
          password: editPassword
        }
      });

      // Handle the response as needed

      if (response.status === 200) {
        // Close the edit modal after successful update
        setEditModal({ open: false, details: null });
        seteditQues();
        setEditAns();

        // Fetch the updated data from the server and update the rowData state
        try {
          const token = localStorage.getItem('token');
          const updatedData = await axios.get(`${server}/api/faq`, {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${token}`
            }
          });
          setFaqData(updatedData.data);
          console.log('Updated rowData:', updatedData);
        } catch (error) {
          console.log('Error', error);
          toast.error(error.response.data.message);
        }

        toast('FAQ Details updated Successfully');
      } else {
        toast.error('FAQ Not updated.. Try Again');
      }
    } catch (error) {
      console.error('Error updating FAQ:', error);
      // Handle error and display a toast or error message to the user
      toast.error(error.response.data.message);
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div>
          <CardHeader title="FAQs" />
          <Typography variant="h4" className="pl-4 pb-2">
            Manage the list of FAQs
          </Typography>
        </div>
        {console.log('faq data=->', FaqData)}

        {FaqData?.data?.map((details) => (
          <div className="border-t">
            {console.log('')}
            <div>
              <div className="px-4">
                <div className="flex items-center gap-4 py-4">
                  <div className="flex-1">
                    <div className="font-medium">{details?.question}?</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{details?.answer}.</div>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <Button
                      className="rounded-full"
                      size="icon"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                        handleEdit(details);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      className="rounded-full"
                      size="icon"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                        handlePasswordDialogOpen(details._id);
                        // handleDeleteConfirmation(details._id);
                      }}
                    >
                      <Trash className="w-4 h-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <Typography>
        <Button size="sm" onClick={handleAddNew}>
          Add FAQ
        </Button>
      </Typography>

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

      {addNewModal.open && (
        <div className="fixed top-0 left-0 w-[100vw] h-full flex items-center overflow-y-auto justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md max-w-md w-full mx-4 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-end p-2">
              <button
                type="button"
                className="text-gray-600 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                data-modal-toggle="authentication-modal"
                onClick={() => handleAddModalClose()}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>

            <form
              id="form"
              className="space-y-6"
              onSubmit={(e) => {
                handleAddModalClose();
                handleSaveNewFaq();

                e.preventDefault();
              }}
            >
              <h3 className="text-2xl font-medium text-gray-800 mb-4">Create New FAQ</h3>

              <div>
                <label htmlFor="header" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Question
                </label>
                <input
                  type="text"
                  name="question"
                  id="question"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter FAQ Name"
                  required
                  onChange={(e) => setAddquestion(e.target.value)}
                  value={addquestion}
                />
              </div>
              <div>
                <label htmlFor="answer" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Answer
                </label>
                <input
                  type="text"
                  name="answer"
                  id="answer"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Your Answer"
                  required
                  onChange={(e) => setAddanswer(e.target.value)}
                  value={addanswer}
                />
              </div>
              {localStorage.getItem('role') === 'admin' && (
                <div>
                  <label htmlFor="password" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                    Password
                  </label>
                  <input
                    type="text"
                    name="password"
                    id="password"
                    className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                    placeholder="Enter Password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      {/*  edit FAQ  */}
      {editModal.open && (
        <div className="fixed top-0 left-0 w-[100vw] h-full flex items-center justify-center align-middle  bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md max-w-md w-full mx-4 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between p-2">
              <div className="div">
                <h3 className="text-2xl font-medium text-gray-800 mb-4">Edit FAQ Details</h3>
              </div>

              <div className="">
                <button
                  type="button"
                  className="text-gray-600 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  data-modal-toggle="authentication-modal"
                  onClick={() => handleEditModalClose()}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleEditModalClose();
                handleSaveEdit();
              }}
            >
              <div>
                <label htmlFor="header" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Question
                </label>
                <input
                  type="text"
                  name="question"
                  id="question"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter question"
                  required
                  onChange={(e) => seteditQues(e.target.value)}
                  value={editQues}
                />
              </div>
              <div>
                <label htmlFor="answer" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Answer
                </label>
                <input
                  type="text"
                  name="answer"
                  id="answer"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter answer"
                  required
                  onChange={(e) => setEditAns(e.target.value)}
                  value={editAns}
                />

                {console.log('editquesans', editQues, editAns)}
              </div>

              {localStorage.getItem('role') === 'admin' && (
                <div>
                  <label htmlFor="password" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                    Password
                  </label>
                  <input
                    type="text"
                    name="password"
                    id="password"
                    className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                    placeholder="Enter Password"
                    required
                    onChange={(e) => setEditPassword(e.target.value)}
                    value={editPassword}
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800r"
                // disabled={
                //   editTitle === originalTitle &&
                //   editDescription === originalDescription &&
                //   BoolImage === false
                // }
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}

      {/* deleting  confirmation box */}

      <Dialog open={openPasswordDialog && localStorage.getItem('role') == 'admin'} onClose={handlePasswordDialogClose}>
        <DialogTitle>Enter Password</DialogTitle>
        <DialogContent>
          <form
            id="form"
            className="space-y-6"
            onSubmit={(e) => {
              handlePasswordSubmit(e);
            }}
          >
            <TextField label="Password" type="password" fullWidth value={password} onChange={PasswordChange} />
            <DialogActions>
              <Button onClick={handlePasswordDialogClose}>Cancel</Button>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation  */}

      {deleteConfirmation.open && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
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
    </Card>
  );
}
