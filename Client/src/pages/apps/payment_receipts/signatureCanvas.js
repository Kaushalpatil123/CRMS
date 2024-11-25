// // import React, { useRef, useEffect, useState } from 'react';
// // import { Box, Typography } from '@mui/material';

// // const SignatureCanvas = ({ isSignatureLoaded,setIsSignatureLoaded,sign,setSign }) => {
// //   const canvasRef = useRef(null);
// //   const [preview, setPreview] = useState(null);
// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       const reader = new FileReader();
// //       reader.onloadend = () => {
// //         setPreview(reader.result);
// //         if (isSignatureLoaded) {
// //           isSignatureLoaded(reader.result);
// //         }
// //       };  
// //       if (file.type.startsWith('image/')) {
// //         reader.readAsDataURL(file);
// //       } else {
// //         alert('Please upload a valid image file.');
// //         setPreview(null);
// //         if (isSignatureLoaded) {
// //           isSignatureLoaded(null); 
// //         }
// //       }
// //      }
   

// //   };


// //   useEffect(() => {
// //     const canvas = canvasRef.current;
// //     const context = canvas.getContext('2d');

// //     context.clearRect(0, 0, canvas.width, canvas.height);
    
// //     if (preview) {
// //       const img = new Image();
// //       img.src = preview;
// //       img.onload = () => {
// //         // Draw the image on the canvas
// //         context.drawImage(img, 0, 0, canvas.width, canvas.height);
// //       };
// //     }
// //   }, [preview]);
  
// //   return (
// //     <Box className='h-[200px] relative' sx={{ border: '1px solid rgba(0,0,0,0.3)' }}>
// //       <Box className='h-full'>
// //         <canvas
// //           ref={canvasRef}
// //           style={{ border: '1px solid rgba(0,0,0,0.1)', width: '100%', height: '75%' }}
// //         />
// //       </Box>
// //       <Box className='flex justify-between items-center absolute bottom-3 pl-2'>
// //         <Box>
// //         <input
// //         type="file"
// //         name="file"
// //         id="sign"
// //         onChange={(e)=>(
// //           isSignatureLoaded && sign ?setIsSignatureLoaded(false):setSign(e.target.files[0])
          
// //           )
// //         }
// //         />
// //         </Box>
// //         <Typography className='text-[12px]'>Authorized Signatory</Typography>
// //         <Box className='absolute top-1 right-1'>
        
// //         </Box>
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default SignatureCanvas;
// import React, { useRef, useEffect, useState } from 'react';
// import { Box, Typography } from '@mui/material';

// const SignatureCanvas = ({ isSignatureLoaded, setIsSignatureLoaded, sign, setSign }) => {
//   const canvasRef = useRef(null);
//   const [preview, setPreview] = useState(null);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreview(reader.result); // Set the preview to display the selected image
//         setSign(reader.result); // Update the signature state
//         setIsSignatureLoaded(true); // Mark the signature as loaded
//       };
//       if (file.type.startsWith('image/')) {
//         reader.readAsDataURL(file);
//       } else {
//         alert('Please upload a valid image file.');
//         setPreview(null);
//         setIsSignatureLoaded(false);
//       }
//     }
//   };

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');
//     context.clearRect(0, 0, canvas.width, canvas.height);

//     if (preview) {
//       const img = new Image();
//       img.src = preview;
//       img.onload = () => {
//         // Draw the image on the canvas
//         context.drawImage(img, 0, 0, canvas.width, canvas.height);
//       };
//     }
//   }, [preview]);

//   return (
//     <Box className='h-[200px] relative' sx={{ border: '1px solid rgba(0,0,0,0.3)' }}>
//       <Box className='h-full'>
//         <canvas
//           ref={canvasRef}
//           style={{ border: '1px solid rgba(0,0,0,0.1)', width: '100%', height: '75%' }}
//         />
//       </Box>
//       <Box className='flex justify-between items-center absolute bottom-3 pl-2'>
//         <Box>
//           <input
//             type="file"
//             name="file"
//             id="sign"
//             accept="image/*"
//             onChange={handleFileChange} // Directly handle file change
//           />
//         </Box>
//         <Typography className='text-[12px]'>Authorized Signatory</Typography>
//       </Box>
//     </Box>
//   );
// };

// export default SignatureCanvas;

// import React, { useState } from 'react';
// import { Box, Button, Typography } from '@mui/material';

// const SignatureUploader = () => {
//   const [sign, setSign] = useState(null);
//   const [isSignatureLoaded, setIsSignatureLoaded] = useState(false);
//   const [signPreview, setSignPreview] = useState(null);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSign(file);
//       setSignPreview(URL.createObjectURL(file)); // Create a URL for the image preview
//       setIsSignatureLoaded(true);
//     }
//   };

//   const handleSignatureChange = () => {
//     setIsSignatureLoaded(false);
//     setSign(null);
//     setSignPreview(null);
//   };

//   return (
//     <Box className='h-[200px] relative' sx={{ border: '1px solid rgba(0,0,0,0.3)' }}>
//       <Box className='h-[75%]'>
//         {console.log('default signature--->', sign)}
//         <img 
//           src={signPreview} 
//           alt="Authorized Signatory" 
//           style={{ 
//             border: '1px solid rgba(0,0,0,0.1)', 
//             width: '100%', 
//             height: '100%',
//             objectFit: 'contain',
//             display: 'flex',
//             margin: 'auto' 
//           }} 
//         />
//       </Box>
//       <Box className='flex justify-between items-center bottom-3 pl-2' sx={{ height: '25%' }}>
//         <Box>
//           {isSignatureLoaded && sign ? (
//             <Box>
//               <Button onClick={handleSignatureChange}>Change Signature</Button>
//             </Box>
//           ) : (
//             <Box>
//               <input
//                 type="file"
//                 name="file"
//                 id="sign"
//                 onChange={handleFileChange}
//                 accept="image/*" // Only allow image files
//               />
//             </Box>
//           )}
//         </Box>
//         <Typography className='text-[12px]'>Authorized Signatory</Typography>
//       </Box>
//     </Box>
//   );
// };

// export default SignatureUploader;
import React, { useState, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';

const SignatureUploader = () => {
  const [sign, setSign] = useState(null);
  const [isSignatureLoaded, setIsSignatureLoaded] = useState(false);
  const [signPreview, setSignPreview] = useState(null);
  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSign(file);
      setSignPreview(URL.createObjectURL(file)); // Create a URL for the image preview
      setIsSignatureLoaded(true);
    }
  };

  const handleSignatureChange = () => {
    setIsSignatureLoaded(false);
    setSign(null);
    setSignPreview(null);
    
    // Clear the file input using the ref
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the input value safely
    }
  };

  return (
    <Box className='h-[200px] relative' sx={{ border: '1px solid rgba(0,0,0,0.3)' }}>
      <Box className='h-[75%]'>
        {signPreview && isSignatureLoaded ? (
          <img 
            src={signPreview} 
            alt="Authorized Signatory" 
            style={{ 
              border: '1px solid rgba(0,0,0,0.1)', 
              width: '100%', 
              height: '100%',
              objectFit: 'contain',
              display: 'flex',
              margin: 'auto' 
            }} 
          />
        ) : (
          <Typography className='text-[12px]' style={{ textAlign: 'center', paddingTop: '30px' }}>
            No Signature Loaded
          </Typography>
        )}
      </Box>
      <Box className='flex justify-between items-center bottom-3 pl-2' sx={{ height: '25%' }}>
        <Box>
          {isSignatureLoaded && sign ? (
            <Box>
              <Button onClick={handleSignatureChange}>Change Signature</Button>
            </Box>
          ) : (
            <Box>
              <input
                type="file"
                name="file"
                ref={fileInputRef} // Attach the ref here
                onChange={handleFileChange}
                accept="image/*" // Only allow image files
              />
            </Box>
          )}
        </Box>
        <Typography className='text-[12px]'>Authorized Signatory</Typography>
      </Box>
    </Box>
  );
};

export default SignatureUploader;
