
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";

const Navbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        backgroundColor: "white",
        padding: "0 1rem",
        boxShadow:"none"
      }}
    >
      <Toolbar className="flex items-center justify-between"
       sx={{
        height: "20px",
        padding: "0 16px",
      }}
      >
        <Box className="flex items-center gap-32">
          <Box className='w-[280px]'>
          <Typography
          
            noWrap
            sx={{
              fontSize:'1.5rem',
              fontWeight: "bold",
              color: "black",
              textAlign:"center",
              
            }}
          >
            CRMS
          </Typography>
          </Box>
        
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: "400px",
              backgroundColor: "#F6F6F6",
              borderRadius: "8px",
              

            }}
          >
            <InputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              sx={{
                color: "#262a2a",
                width: "100%",
              }}
            />
          </Box>
        </Box>
        <Box>
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="w-15 h-15 object-cover"
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
