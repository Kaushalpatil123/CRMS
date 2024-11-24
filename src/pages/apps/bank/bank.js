
import React, { useState, useEffect } from "react";
import axios from "axios";
import EditPopup from "./editPopUp"; // Import the EditPopup component
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa"; // Import the plus icon
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, } from "@mui/material";
import toast from "react-hot-toast";
import { addBankDetails, deleteBankDetailsById, fetchBankDetailsById, fetchBanks } from "pages/utils/bank/api";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useLocation } from "react-router";

const BankDetailsComponent = ({ matchedId, BankIdd, setBankDetails, setSelectedBankIdd, setIsEditQuotation, quotation ,changeBankId}) => {
    const [banks, setBanks] = useState([]);
    const [selectedBankId, setSelectedBankId] = useState("");
    const [BanksID, setBanksID] = useState('');
    const [bankDetailsText, setBankDetailsText] = useState({});
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [newBankDetails, setNewBankDetails] = useState({
        bankname: "",
        branch: "",
        accountnumber: "",
        IFSC: "",
        accountname: ""
    });
    const location = useLocation();
    const { quotationId } = location.state || {};

    useEffect(() => {
        if (matchedId) {
            console.log(matchedId)
            setBanksID(matchedId);
        }
    }, []);

    useEffect(() => {
        if (BanksID) {
            console.log("this is selected bank id ---->", BanksID)
            changeBankId && changeBankId(BanksID);

        }
    }, [BanksID]);
    
    
    useEffect(() => {
        if (BankIdd) {
            console.log("this is selected bank id ---->",selectedBankId)
            setBanksID(BankIdd);
        }
    }, [BankIdd]);
    
    // const getBanks = async () => {
    //     if (quotationId === undefined){
    //         try {
    //             const response = await fetchBanks();
    //             console.log("Response",response,"Quotation",quotation);
                
    
    //             setBanks(response); 
                
    //         } catch (error) {
    //             console.log(error)
    //         }
           
    //     }else{
    //         try {
    //             const response = await fetchBanks();
    //             console.log("Response",response,"Quotation",quotation);
    //             if (quotation.bankDetails) {
    //                 // Filter the banks to find the one matching the ID
    //                 const filteredBanks = response.filter(bank => bank._id === quotation.bankDetails);
    //                 // If a matching bank is found, show it; otherwise, show all
    //                 if (filteredBanks.length > 0) {
    //                     setBanks(filteredBanks);
    //                     setIsEditQuotation(filteredBanks)
    //                     setSelectedBankId(filteredBanks[0]._id); // Set the selected bank to the matched one
    //                 } else {
    //                     setBanks(response); // Show all banks if no match is found
    //                 }
    //             } else {
    //                 setBanks(response); // Show all banks
    //             }
    //         } catch (error) {
    //             console.error("Error fetching banks", error);
    //         }

    //     }
        
    // };
    useEffect(()=>{
        if(selectedBankId){
            changeBankId && changeBankId(selectedBankId);
        }
    }, [selectedBankId])
    
    const getBanks = async () => {
        try {
            const response = await fetchBanks();
            console.log("Response", response, "Quotation", quotation);
    
            if (quotationId !== undefined) {
                const filteredBanks = response.filter(bank => bank._id === matchedId);
                if (filteredBanks.length > 0) {
                    setBanks(filteredBanks);
                    setSelectedBankId(filteredBanks[0]._id); // Set the selected bank to the matched one
                } else {
                    setBanks(response);
                }
            } else {
                setBanks(response);
            }
        } catch (error) {
            console.error("Error fetching banks", error);
        }
    };
    
    useEffect(() => {
        getBanks();
    }, [ quotation]); // Run on changes to isEditQuotation or quotation

    useEffect(() => {
        const getBankDetails = async () => {
            if (BanksID) {
                try {
                    // const bank = await fetchBankDetailsById(selectedBankId);
                    const bank = await fetchBankDetailsById(BanksID);
console.log(bank)
                    setBankDetailsText(bank);
                    // setBankDetails(bank);
                } catch (error) {
                    console.error("Error fetching bank details", error);
                }
            }
        };

        getBankDetails();
    }, [BanksID, setBankDetails]);

    
const handleAddBankDetails = async () => {
    // Validate that all fields are filled
    if (
        !newBankDetails.bankname ||
        !newBankDetails.branch ||
        !newBankDetails.accountnumber ||
        !newBankDetails.IFSC ||
        !newBankDetails.accountname
    ) {
        alert("All fields are required.");
        return;
    }

    try {
        // Use the imported addBankDetails function
        const response = await addBankDetails(newBankDetails);
        
        // Update the banks list with the new bank details
        setBanks([...banks, response]);
        
        // Reset the form
        setNewBankDetails({ bankname: "", branch: "", accountnumber: "", IFSC: "", accountname: "" });
        
        // Close the popup
        setIsAddPopupOpen(false);
    } catch (error) {
        console.error("Error adding bank details", error);
    }
};



const handleDeleteBank = async () => {
    if (!selectedBankId) {
        toast.error("No bank selected to delete.");
        return;
    }

    const MySwal = withReactContent(Swal);

    // Use SweetAlert2 for confirmation dialog
    const confirmDelete = await MySwal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#779E40',
        cancelButtonColor: '#DC2626',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    });

    if (!confirmDelete.isConfirmed) return;

    try {
        // Use the imported deleteBankDetailsById function
        await deleteBankDetailsById(selectedBankId);

        // Update the state to remove the deleted bank
        setBanks(banks.filter(bank => bank._id !== selectedBankId));

        // Reset relevant state
        setSelectedBankId(""); // Reset the selected bank ID
        setBankDetailsText({}); // Clear the bank details textarea

        toast.success("Bank deleted successfully!");
    } catch (error) {
        console.error("Error deleting bank", error);
        toast.error("Failed to delete the bank. Please try again.");
    }
};


    return (
        <div>
            <label htmlFor="bankDropdown" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >Select Bank:</label>

            <div className="flex items-center justify-between gap-4">
                <select
                    id="bankDropdown"
                    className="block w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-red-600 focus:border-red-600"
                    // value={selectedBankId}
                    value={BanksID}

                    onChange={(e) => {
                        setBanksID(e.target.value)
                        // setSelectedBankIdd(e.target.value)
                    }}
                >
                    <option value="">Select Bank</option>
                    {banks.map((bank) => (
                        <option key={bank._id} value={bank._id}>
                            {bank.accountname} - {bank.bankname}
                        </option>
                    ))}
                </select>

                <Button
                    className="bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 hover:text-white font-inter p-2.5"
                    onClick={() => setIsAddPopupOpen(true)} // Open add popup on click
                >
                    {/* <FaPlus size={10} /> */}

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M5 12h14"></path>
                        <path d="M12 5v14"></path>
                      </svg>
                </Button>
            </div>

            {/* Conditionally render textarea and edit button if a bank is selected */}
            {/* {selectedBankId && ( */}
            {BanksID && (

                <div className="relative my-2">
                    <textarea
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full min-h-[125px] p-2.5"
                        id="bankDetails"
                        value={
                            bankDetailsText.accountname
                                ? `ACCOUNT NAME : ${bankDetailsText.accountname}\nBANK NAME : ${bankDetailsText.bankname}\nBRANCH : ${bankDetailsText.branch}\nACCOUNT NUMBER : ${bankDetailsText.accountnumber}\nIFSC : ${bankDetailsText.IFSC}` // Display specific fields
                                : ""
                        }
                        readOnly
                        placeholder="Bank Details"
                    ></textarea>

                    <button className="absolute top-2 right-6 text-red-600 hover:text-red-700" onClick={() => setIsEditPopupOpen(true)}>
                        <FaEdit size={16} />
                    </button>

                    <button className="absolute top-2 right-12 text-red-600 hover:text-red-700" onClick={handleDeleteBank}>
                        <FaTrash size={16} />
                    </button>
                </div>
            )}

            {/* Add Bank Details Popup */}
            <Dialog open={isAddPopupOpen} onClose={() => setIsAddPopupOpen(false)}>
                <DialogTitle className="text-center text-2xl font-bold w-[650px]">Add Bank Details</DialogTitle>
                <DialogContent>
                    {/* Grid Container for Input Fields */}
                    <div className="grid grid-cols-2 gap-4 mb-6">




                        <div className="">
                            <label className="block mb-2 font-medium">Account Name</label>
                            <input
                                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                                value={newBankDetails.accountname}
                                onChange={(e) => setNewBankDetails({ ...newBankDetails, accountname: e.target.value })}
                                placeholder="Account Name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Bank Name</label>
                            <input
                                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                                value={newBankDetails.bankname}
                                onChange={(e) => setNewBankDetails({ ...newBankDetails, bankname: e.target.value })}
                                placeholder="Bank Name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Branch</label>
                            <input
                                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                                value={newBankDetails.branch}
                                onChange={(e) => setNewBankDetails({ ...newBankDetails, branch: e.target.value })}
                                placeholder="Branch"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Account Number</label>
                            <input
                                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                                value={newBankDetails.accountnumber}
                                onChange={(e) => setNewBankDetails({ ...newBankDetails, accountnumber: e.target.value })}
                                placeholder="Account Number"
                                required
                            />
                        </div>

                        <div col-span-1>
                            <label className="block mb-2 font-medium">IFSC Code</label>
                            <input
                                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                                value={newBankDetails.IFSC}
                                onChange={(e) => setNewBankDetails({ ...newBankDetails, IFSC: e.target.value })}
                                placeholder="IFSC Code"
                                required
                            />
                        </div>


                        <DialogActions className="flex justify-end space-x-2 p-4 mt-5">
                            <button
                                className="bg-red-600 rounded-md text-white px-3 py-2 font-semibold hover:bg-red-700 hover:text-white font-inter"
                                onClick={() => setIsAddPopupOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-lime-600 rounded-md text-white py-2 px-3 font-semibold hover:bg-lime-700 hover:text-white font-inter"
                                onClick={handleAddBankDetails}
                            >
                                Add
                            </button>
                        </DialogActions>
                    </div>
                </DialogContent>


            </Dialog>


            {/* Edit Popup */}
            {isEditPopupOpen && (
                <EditPopup
                    bankDetails={bankDetailsText}
                    bankId={selectedBankId}
                    onClose={() => setIsEditPopupOpen(false)}
                    onSave={(updatedDetails) => {
                        setBankDetailsText(updatedDetails);
                        setBankDetails(updatedDetails); // Pass updated value to the parent
                        setIsEditPopupOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default BankDetailsComponent;

