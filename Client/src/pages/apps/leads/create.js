import { TextField, Grid, FormControl, InputLabel, Select, MenuItem, Box, InputAdornment, IconButton, OutlinedInput ,Modal, Typography, Button} from '@mui/material';
import React, { useState, useEffect } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { City, Country, State } from 'country-state-city';
import { postNewLeads,getAllProducts ,createProduct,getAllExecutives,EditParticularLead} from 'pages/utils/leads/api';
import toast, { Toaster } from 'react-hot-toast';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation, useNavigate, useParams } from 'react-router';

const Create = () => {
  const navigate=useNavigate();
  
  const location = useLocation().state || {};
  const { sourceName, name, internalNotes, needs,Email,PhoneNumber,FirstName, LastName,CityName,StateName,CountryName,Company,Agent,productItem,id } = location;
  console.log(id,sourceName,name,internalNotes,needs,FirstName, LastName,CityName,StateName,CountryName,Company,Agent,productItem)
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [company, setcompany] = useState('');
  const [email, setemail] = useState('');
  const [mobile, setmobile] = useState('');
  const [executive, setexecutive] = useState('kaushal');
  const [source, setsource] = useState('');
  const [designation, setdesignation] = useState('');
  const [product, setProduct] = useState('');
  const [productsList, setProductsList] = useState([]);
  
  const [mobileError, setMobileError] = useState("");
  const [requirements, setrequirements] = useState('');
  const [notes, setnotes] = useState('');
  const [open, setOpen] = useState(false);
  const openProductPopup = () => setOpen(true);
  const closeProductPopup = () => setOpen(false);
  const [allExecutives, setAllExecutives] = useState(["wdqw","fwq","qwfqwf"]);

  const [productData, setProductData] = useState({
    itemname: '',
    description: '',
    hsn: '',
    gst: 0,
    code: '',
    category: '',
    subcategory: '',
    actualprice: '',
    sellingprice: '',
  });
 


  const handleChangeProductData = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };
  const handleSubmitProductData = async () => {
  
      const token = localStorage.getItem('token');
      const productDetails = { ...productData };
      await createProduct(productDetails,token);
      const productOptions= await getAllProducts(token);
      setProductsList(productOptions?.products);
      closeProductPopup();
   
  };
  useEffect(() => {
    if(location){
    if (internalNotes) setnotes(internalNotes);
    if(name) setexecutive(name);
    if(sourceName) setsource(sourceName);
    if(needs) setrequirements(needs);
    if(Email) setemail(Email);
    if(PhoneNumber) setmobile(PhoneNumber);
    if(FirstName) setfirstName(FirstName);
    if(LastName) setlastName(LastName);
    if(CountryName) setCountry(CountryName);
    if(CityName) setCity(CityName);
    if(StateName) setState(StateName);
    if(Company) setcompany(Company);
    if(Agent) setexecutive(Agent);
    
  }
  }, [internalNotes,sourceName,name,needs,location,Email,PhoneNumber,FirstName,LastName,CountryName,CityName,StateName,Company,Agent]);
  

  useEffect(()=>{
    const fetchedCountries = Country.getAllCountries(); 
    console.log("countries----->",fetchedCountries)
    setCountries(fetchedCountries);
    if (CountryName) {
      const matchingCountry = fetchedCountries.find(
        (country) => country.name === CountryName
      );
      if (matchingCountry) {
        setCountry(matchingCountry.isoCode);
      }
    }
  
  },[CountryName])
  // useEffect(()=>{
  //   const matchedCountry=countries.find((item)=>item.name === CountryName);
  //   console.log("match--->",country)
  //   setCountry(matchedCountry);
  // },[])
  // useEffect(()=>{
  //   if(CountryName){
  //   const fetchedStates = State.getStatesOfCountry(country); 
  //   setStates(fetchedStates);
  //   }
  // },[CountryName]) 
  // useEffect(()=>{
  //   const fetchedCities = City.getCitiesOfState(country, state); 
  //   setCities(fetchedCities);
  // },[country,state])

  useEffect(() => {
    // Fetch states when country changes
    if (country) {
      const fetchedStates = State.getStatesOfCountry(country);
      setStates(fetchedStates);
      setCities([]);
      if (StateName) {
        const matchingState = fetchedStates.find(
          (state) => state.name === StateName
        );
        if (matchingState) {
          setState(matchingState.isoCode);
        }
      }
    } else {
      setStates([]);
      setCities([]);
    }
  }, [country]);
  // useEffect(() => {
  //   if (CountryName) {
  //     const fetchedStates = State.getStatesOfCountry(CountryName);
  //     setStates(fetchedStates);
      
  //   }
  // }, [CountryName]);
  

  useEffect(() => {
    // Fetch cities when state changes
    if (state) {
      const fetchedCities = City.getCitiesOfState(country, state);
      setCities(fetchedCities);
      if (CityName) {
        const matchingCity = fetchedCities.find(
          (city) => city.name === CityName
        );
        if (matchingCity) {
          setCity(matchingCity.name);
        }
      }
  
    } else {
      setCities([]); // Reset cities if no state is selected
    }
  
  }, [state, country]);
  // useEffect(() => {
  //   if (StateName) {
  //     const fetchedCities = City.getCitiesOfState(CountryName, StateName);
  //     setCities(fetchedCities);
  //   }
  // }, [StateName, CountryName]);
  useEffect(()=>{
      const getProducts=async()=>{
        const token  = localStorage.getItem('token')
        const productOptions= await getAllProducts(token);
        setProductsList(productOptions?.products);
       }
       getProducts();  
  },[])
  useEffect(() => {
    const fetchAllExecutives=async()=>{
      const token =localStorage.getItem('token');
      const response = await getAllExecutives(token);
      console.log(response.data)
      setAllExecutives(response?.data);
    }
    fetchAllExecutives();
  }, []);
  
  const allData = () => {
    const selectedCountry = countries.find((c) => c.isoCode === country)?.name || '';
    const selectedState = states.find((s) => s.isoCode === state)?.name || '';
    const selectedCity = city || '';

    console.log('Selected Country:', selectedCountry);
    console.log('Selected State:', selectedState);
    console.log('Selected City:', selectedCity);
  };
  const EditLeads = async () => {
    const emailInput = document.getElementById("Email");
    if(!company){
      toast.error("Company is required");
      return;
    }
    if(!firstName){
      toast.error("Name is required");
      return;
    }
    if(!email){
      toast.error("Email is required");
      return;
    }
    if (!emailInput.checkValidity()) {
      toast.error("Please enter a valid email");
      return;
    } 
    if(!mobile){
      toast.error("Mobile number is required");
      return;
    }
   
    if(!country){
      toast.error("Country is required");
      return;
    }
    if(!state){
      toast.error("State is required");
      return;
    }
    if(!city){
      toast.error("City is required");
      return;
    }
    if(!executive){
      toast.error("Agent name is required");
      return;
    }
    if(!source){
      toast.error("Source is required");
      return;
    }
    if(!product){
      toast.error("Product is required");
      return;
    }
    if (mobile.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits.");
      return;
    }
   
    // if (
    //   !company ||
    //   !firstName ||
    //   !lastName ||
    //   !email ||
    //   !mobile ||
    //   !country ||
    //   !state ||
    //   !city ||
    //   !executive ||
    //   !source ||
      
    //   !requirements
      
    // ) {
    
    //   toast.error("Please, fill all fields!");
    //   return; 
    // }
    
  
    const selectedCountry = countries.find((c) => c.isoCode === country)?.name || '';
    const selectedState = states.find((s) => s.isoCode === state)?.name || '';
    const selectedCity = city || '';
    console.log('Selected Country:', selectedCountry);
    console.log('Selected State:', selectedState);
    console.log('Selected City:', selectedCity);
    
    const requestData = {
      companyName: company,
      contacts: [
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: mobile
        }
      ],
      // country: selectedCountry,
      // state: selectedState,
      // city: selectedCity,
      country: country,
      state: state,
      city: city,
      executive: executive,
      source: source,
      //designation: designation,
      product: product,
      requirements: requirements,
      notes: notes
      // astInteraction: {
      //   executiveName: 'dwdwdd',
      //   date: 'loi',
      //   description: 'wdwdwdw'
      // },
      // nextInteraction: {
      //   executiveName: 'string',
      //   date: '2024',
      //   description: 'string'
      // }
    };
    const requestDataForUpdate = {
      companyName: company,
      country: country,
      state: state,
      city: city,
      executive: executive,
      source: source,
      updateContact:{
        id:id,
        contact:{
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: mobile
        }
      },
      //designation: designation,
      product: product,
      requirements: requirements,
      notes: notes
      // astInteraction: {
      //   executiveName: 'dwdwdd',
      //   date: 'loi',
      //   description: 'wdwdwdw'
      // },
      // nextInteraction: {
      //   executiveName: 'string',
      //   date: '2024',
      //   description: 'string'
      // }
    };
    const token = localStorage.getItem('token');
    if(id){
      
      const updateLead = await EditParticularLead(id, requestDataForUpdate, token);
      console.log("Particular lead updated--->",updateLead);
      if(updateLead){
        toast.success('Lead Updated Successfully');
      }
      
    }
    else{
      
      const editedLead = await postNewLeads(requestData, token);
      console.log('requestData particular wala---->', editedLead, requestData);
      // getAllLeads();
      if(editedLead){

        toast.success('Lead Created Successfully');
      }
      
    }  
   navigate('/apps/lead');
  };

  useEffect(() => {
    if (productsList.length > 0 && productItem) {
      const isProductInList = productsList.some((product) => product.itemname === productItem);
      if (isProductInList) {
        setProduct(productItem);
      }
    }
  }, [productsList, productItem]);
  
  
   console.log(country,state,city)

  return (
    <div className="container mx-auto">
      <h3 className="text-2xl font-semibold text-gray-900 mb-4">Enter Lead</h3>
      {/* Form Dialog Box */}
      <div className="flex flex-col">
        <form
          id="form"
          className="bg-white rounded-lg shadow-md p-4 flex-grow overflow-auto pb-6"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Grid container spacing={2}>
            {/* Combined Basic Info and Contact Section */}
            <Grid item xs={12} sm={6}>
              <div className="border-2 rounded-md p-2">
                <h4 className="text-lg font-semibold text-black mb-2 flex items-center space-x-2">
                  <PersonIcon  className='text-[#779E40]'/>
                  <span>Basic Info</span>
                </h4>
                <div className="mb-2 flex gap-3">
                  <div className="w-[20%]">
                    <h5 className="text-md font-semibold">Company:</h5>
                  </div>
                  <div className="w-[80%]">
                    <TextField
                      value={company}
                      onChange={(e) => setcompany(e.target.value)}
                      name="Company"
                      id="Company"
                      fullWidth
                      variant="outlined"
                      placeholder="Enter Company"
                      //required
                      InputProps={{
                        style: { height: '45px' }
                      }}
                    />
                  </div>
                </div>
                <div className="mb-2 flex gap-3">
                  <div className="w-[20%]">
                    <h5 className="text-md font-semibold">Name:</h5>
                  </div>
                  <div className="w-[80%] flex gap-3">
                    <select name="title" className="border border-[#dbe0e5] rounded-md">
                      <option value="Mr."> Mr.</option>
                      <option value="Mrs."> Mrs.</option>
                      <option value="Miss"> Miss</option>
                      <option value="Ms."> Ms.</option>
                      <option value="Dr."> Dr.</option>
                    </select>
                    <TextField
                      value={firstName}
                      onChange={(e) => setfirstName(e.target.value)}
                      name="First Name"
                      id="First-Name"
                      fullWidth
                      variant="outlined"
                      placeholder="First Name"
                      //required
                      InputProps={{
                        style: { height: '45px' } // Adjust the height as needed
                      }}
                    />
                    <TextField
                      value={lastName}
                      onChange={(e) => setlastName(e.target.value)}
                      name="Last Name"
                      id="Last-Name"
                      fullWidth
                      variant="outlined"
                      placeholder="Last Name"
                      //required
                      InputProps={{
                        style: { height: '45px' } // Adjust the height as needed
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="border-2 rounded-md p-2 mt-4">
                <h4 className="text-lg font-semibold text-black mb-2 flex items-center space-x-2">
                  <PhoneIcon  className='text-[#779E40]'/>
                  <span>Contact Details</span>
                </h4>
                <div className="mb-2">
                  <div className="mb-2 flex">
                    <div className="w-[20%]">
                      <h5 className="text-md font-semibold">Email:</h5>
                    </div>
                    <div className="w-[80%] flex gap-3">
                      <TextField
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        name="Email"
                        id="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        placeholder="Enter Email"
                        //required
                        InputProps={{
                          style: { height: '45px' } // Adjust the height as needed
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-2 flex">
                    <div className="w-[20%]">
                      <h5 className="text-md font-semibold">Mobile:</h5>
                    </div>
                    <div className="w-[80%] flex gap-3">
                      
                      <TextField
                        value={mobile}
                        onChange={(e) => setmobile(e.target.value)}
                        name="Mobile"
                        id="Mobile"
                        fullWidth
                        variant="outlined"
                        placeholder="Enter Mobile"
                        //required
                        InputProps={{
                          style: { height: '45px' } // Adjust the height as needed
                        }}
                      />
                    </div>
                  </div>
                  <div className="mb-2 flex h-11">
                    <div className="w-[20%]">
                      <h5 className="text-md font-semibold">Country:</h5>
                    </div>
                    <div className="w-[80%] flex gap-3">
                      {/* <select
                        name="Country"
                        id="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className=" w-full h-full"
                      >
                        <option value={CountryName ? CountryName : ""} disabled={CountryName}>
                        {CountryName ? CountryName : "Select Country"}
                        </option>
                        {countries.map((country) => (
                          <option key={country.isoCode} value={country.isoCode}>
                            {country.name}
                          </option>
                        ))}
                      </select> */}
                      <FormControl fullWidth variant="outlined">
  <InputLabel id="country-select-label">
    Select Country
  </InputLabel>
  <Select
    labelId="country-select-label"
    id="Country"
    value={country}
    onChange={(e) => {
      setState("");
      setCity("");
      setCountry(e.target.value);
    }}
   // label={CountryName ? CountryName : "Select Country"}
    label="Select Country"

    className="w-full h-full"
    sx={{
      "& .MuiSelect-icon": {
        right: "12px" // Adjust this value to move the arrow leftward
      }
    }}
  >
    {/* Disabled placeholder option */}
    {/* <MenuItem value="" disabled>
      {CountryName ? CountryName : "Select Country"}
    </MenuItem> */}
    <MenuItem value=""><em>Select Country</em></MenuItem>
    {/* Dynamically render country options */}
    {countries.map((country) => (
      <MenuItem key={country.isoCode} value={country.isoCode}>
        {country.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>

                    </div>
                  </div>

                  <div className="mb-2 flex h-11">
                    <div className="w-[20%]">
                      <h5 className="text-md font-semibold">State:</h5>
                    </div>
                    <div className="w-[80%] flex gap-3">
                      {/* <select
                        name="State"
                        id="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full h-full"
                        // disabled={!states.length}
                      >
                        <option value={StateName ? StateName : ""}>
                        {StateName ? StateName : "Select State"}
                        </option>
                        {states.map((state) => (
                          <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </option>
                        ))}
                      </select> */}
                      <FormControl fullWidth variant="outlined" disabled={!states.length}>
  <InputLabel id="state-select-label">
    Select State
  </InputLabel>
  <Select
    labelId="state-select-label"
    id="State"
    value={state}
    onChange={(e) => {
      setCity("");
      setState(e.target.value)
    }
    }
    label="Select State"
    className="w-full h-full"
    sx={{
      "& .MuiSelect-icon": {
        right: "12px" // Adjust this value to move the arrow leftward
      }
    }}
  >
    {/* Placeholder option */}
    {/* <MenuItem value="">
      {StateName ? StateName : "Select State"}
    </MenuItem> */}
    <MenuItem><em>Select state</em></MenuItem>

    {/* Dynamically render state options */}
    {states.map((state) => (
      <MenuItem key={state.isoCode} value={state.isoCode}>
        {state.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>

                    </div>
                  </div>
                  <div className="mb-2 flex h-11">
                    <div className="w-[20%]">
                      <h5 className="text-md font-semibold">City:</h5>
                    </div>
                    <div className="w-[80%] flex gap-3">
                      {/* <select
                        name="City"
                        id="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-full"
                        // disabled={!cities.length}
                      >
                        <option value={CityName ? CityName : ""} >
                            {CityName ? CityName : "Select City"}
                        </option>
                        {cities.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select> */}
                      <FormControl fullWidth variant="outlined" disabled={!cities.length}>
  <InputLabel id="city-select-label">
  Select City
  </InputLabel>
  <Select
    labelId="city-select-label"
    id="City"
    value={city}
    onChange={(e) => setCity(e.target.value)}
    label="Select City"
    className="w-full h-full"
    sx={{
      "& .MuiSelect-icon": {
        right: "12px" // Adjust this value to move the arrow leftward
      }
    }}
  >
    {/* Placeholder option */}
    {/* <MenuItem value="">
      {CityName ? CityName : "Select City"}
    </MenuItem> */}
  <MenuItem><em>Select city</em></MenuItem>
    {/* Dynamically render city options */}
    {cities.map((city) => (
      <MenuItem key={city.name} value={city.name}>
        {city.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>

                    </div>
                  </div>
                </div>
              </div>
            </Grid>

            {/* Business Info Section */}
            <Grid item xs={12} sm={6}>
              <div className="border-2 rounded-md pt-4  h-full pl-3 pr-3">
                <h4 className="text-lg font-semibold text-black mb-3 flex items-center space-x-2">
                  <CorporateFareIcon className='text-[#779E40]'/>
                  <span>Business Info</span>
                </h4>
                <div className="mb-3 flex gap-3">
                  <div className="w-[20%]">
                    <h5 className="text-md font-semibold">Agent name</h5>
                  </div>
                  <div className="w-[80%] flex gap-3">
                    <FormControl fullWidth variant="outlined" 
                    //required
                    >
                    <InputLabel id="team-label">Enter executive</InputLabel>
                 
                    <Select
                        labelId="team-label"
                        id="team"
                        value={executive}
                        onChange={(e) => setexecutive(e.target.value)}
                        label="Enter Executive"
                      >
                        {/* <MenuItem value={Agent ? Agent : ""} disabled>
                            {Agent ? Agent : "Select Executive"}
                        </MenuItem> */}
                         <MenuItem value="">
                          <em>Select Executive</em>
                        </MenuItem>
                        {allExecutives && allExecutives.map((agent, index) => (
                          <MenuItem key={index} value={agent}>
                            {agent}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div className="mb-3 flex gap-3">
                  <div className="w-[20%]">
                    <h5 className="text-md font-semibold">Source:</h5>
                  </div>
                  <div className="w-[80%] flex gap-3">
                    <TextField
                      onChange={(e) => setsource(e.target.value)}
                      name="Source"
                      value={source}
                      id="Source"
                      fullWidth
                      variant="outlined"
                      placeholder="Enter Source"
                      //required
                    />
                  </div>
                </div>
              
                <div className="mb-3 flex gap-3">
                  <div className="w-[20%]">
                    <h5 className="text-md font-semibold">Product:</h5>
                  </div>
                 
                  <Box className="w-[80%] flex gap-3">
                    <FormControl fullWidth variant="outlined" sx={{ width: 'calc(100% - 50px)' }}>
                      <InputLabel id="product-label">Enter product</InputLabel>
                      <Select
                        labelId="product-label"
                        id="product"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        label="Enter Product"
                      > 
                         <MenuItem value="">
                          <em>Select product</em>
                        </MenuItem>
                                            
                        {productsList && productsList.length > 0 ? (
                          
                          productsList.map(({ itemname }, idx) => (
                            <MenuItem key={idx} value={itemname}>{itemname}</MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No Products Available</MenuItem>
                        )}
                      </Select>
                    </FormControl>

                    {/* Edit Icon on the right of the Select element */}
                    <IconButton
                      edge="end"
                      onClick={openProductPopup}
                      sx={{
                        paddingX: '5px',
                        border: '1px solid grey',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                        '&:hover': {
                          backgroundColor: 'grey',
                          color: 'white',
                        },
                        height: 'auto',
                        minHeight: '1.4375em'
                    
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                <Modal open={open} onClose={closeProductPopup}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: { xs: '90%', md: '500px' },
                      bgcolor: 'background.paper',
                      boxShadow: 24,
                      p: 4,
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h3" component="h2" gutterBottom>
                      Add Product
                    </Typography>

                    {/* Close Button */}
                    <IconButton
                      aria-label="close"
                      onClick={closeProductPopup}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'gray',
                      }}
                    >
                      <CloseIcon />
                    </IconButton>

                    {/* Form Fields */}
                    <form>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Item Name"
                        name="itemname"
                        value={productData.itemname}
                        onChange={handleChangeProductData}
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Description"
                        name="description"
                        value={productData.description}
                        onChange={handleChangeProductData}
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        label="HSN"
                        name="hsn"
                        value={productData.hsn}
                        onChange={handleChangeProductData}
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        label="GST"
                        name="gst"
                        type="number"
                        value={productData.gst}
                        onChange={handleChangeProductData}
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Code"
                        name="code"
                        value={productData.code}
                        onChange={handleChangeProductData}
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Category"
                        name="category"
                        value={productData.category}
                        onChange={handleChangeProductData}
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Subcategory"
                        name="subcategory"
                        value={productData.subcategory}
                        onChange={handleChangeProductData}
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Actual Price"
                        name="actualprice"
                        value={productData.actualprice}
                        onChange={handleChangeProductData}
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Selling Price"
                        name="sellingprice"
                        value={productData.sellingprice}
                        onChange={handleChangeProductData}
                      />
                      <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                        <Button onClick={closeProductPopup} variant="contained" className='border border-red-600 text-red-600'>
                          Close
                        </Button>
                        <Button onClick={handleSubmitProductData} variant="contained" className='bg-[#779E40] text-white hover:bg-[#5F7E33]'>
                          Add
                        </Button>
                      </Box>
                    </form>
                  </Box>
                </Modal>
  
                </div>
                <div className="mb-3 flex gap-3">
                  <div className="w-[20%]">
                    <h5 className="text-md font-semibold">Requirements:</h5>
                  </div>
                  <div className="w-[80%] flex gap-3">
                    <TextField
                      onChange={(e) => setrequirements(e.target.value)}
                      name="Requirements"
                      value={requirements}
                      id="Requirements"
                      fullWidth
                      variant="outlined"
                      placeholder="Enter Requirements"
                      //required
                      multiline
                      rows={4}
                      maxRows={4}
                    />
                  </div>
                </div>
                <div className="mb-3 flex gap-3">
                  <div className="w-[20%]">
                    <h5 className="text-md font-semibold">Internal Notes:</h5>
                  </div>
                  <div className="w-[80%] flex gap-3">
                    <TextField
                      onChange={(e) => setnotes(e.target.value)}
                      value={notes}
                      name="Notes"
                      id="Notes"
                      fullWidth
                      variant="outlined"
                      placeholder="Enter Internal Notes"
                    
                      multiline
                      rows={4}
                      maxRows={4}
                    />
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
          <button
            onClick={EditLeads}
            type="submit"
            className="w-[20vw] mx-auto flex justify-center text-white bg-[#779E40] hover:bg-[#5F7E33] font-semibold rounded-md text-base py-2 mt-6"
          >
            Save
          </button>
        </form>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default Create;
