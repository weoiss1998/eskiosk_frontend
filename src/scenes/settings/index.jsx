import { Box, Typography, useTheme, TextField  } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Button} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { Grid, Divider } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import {AuthCheck} from "../../components/authcheck";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';


let products;

async function getDb() {
  var url = new URL("http://fastapi.localhost:8008/createBackup/");
  const response = await fetch(url, {method: "GET",});
  response.blob().then(blob => {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'backup.dump.gz');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  });
}

var fileUploaded;


const Settings = (props) => {
const hiddenFileInput = useRef(null); 
//const [data, setData] = useState([]);
const navigate = useNavigate();
const [file, setFile] = useState(null);
const theme = useTheme();
const colors = tokens(theme.palette.mode);
const initialValues = {
  email: "",
  amount: 0,
};
let patternTwoDigisAfterComma = /^\d+(\.\d{0,2})?$/;
const checkoutSchema = yup.object().shape({
  email: yup.string(),//email("invalid email").required("required"),
  amount: yup
  .number()
  .positive()
  .test(
    "is-decimal",
    "The amount should be a decimal with maximum two digits after comma",
    (val) => {
      if (val != undefined) {
        return patternTwoDigisAfterComma.test(val);
      }
      return true;
    }
  )
  .required("required"),
});


useEffect(() => {
  
  const fetchData = async () => {
    var check = await AuthCheck();
  if (check === false) {
    navigate("/login");    
  }
}
  fetchData();

}, [products]);

async function postDB() {
  const form = new FormData();
  //var name = String(file.name);
  form.append("file", file);

  const response = await fetch("http://fastapi.localhost:8008/restoreBackup/", {
      method: "POST",
      /*headers: {
        'accept': 'application/json',
        'Content-Type': 'multipart/form-data'
    },*/
      body: form
  });
  const obj = await response.json();
  if (response.status === 400) {
    alert(obj.detail);
  }

  console.log(obj);
}

const handleFormSubmit = (values) => {
  if(window.confirm("Do you want to send money to " + values.email + " in the amount of " + values.amount + " €?")){
  sendMoney(values);
  }
};
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const handleClick = event => {
  hiddenFileInput.current.click();   
};

const handleDBUpload = event => {
  setFile(event.target.files[0]);
  fileUploaded = event.target.files[0]; // ADDED
  console.log(fileUploaded);
  /*const reader = new FileReader();
  reader.onloadend = () => {
    const base64String = reader.result.split(",")[1];
    console.log(base64String);
    picture = base64String;
    // Do something with the base64String
  };
  reader.readAsDataURL(fileUploaded);*/
  };


  //console.table(products);
  var items = new Map();
 
/*
  <Box
  display="grid"
  gap="30px"
  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
  sx={{
    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
  }}
>
*/
  return (
    <Box m="20px">
      <Header title="Shop" subtitle="Products to buy" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      ><Box
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="140px"
      gap="20px"
    >
      {/* ROW 1 */}
      <Box
        gridColumn="span 3"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={() => {
          getDb();
          }}
        >
          Download Database
        </Button>
 
      </Box>
      <Box
        gridColumn="span 3"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
                   <Button
  component="label"
  role={undefined}
  onClick={handleClick}
  color="secondary"
  variant="contained"
  tabIndex={-1}
  startIcon={<CloudUploadIcon />}
>
  Upload file
  <VisuallyHiddenInput type="file" ref={hiddenFileInput} onChange={handleDBUpload} />
</Button>

<Button
      variant="contained"
      size="small"
      color="primary"
      onClick={() => {
        postDB(fileUploaded);
      }}
    >
      Send to Server
    </Button>
      </Box>
      <Box
        gridColumn="span 3"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {/*Box Inhalt hier*/}
      </Box>
      <Box
        gridColumn="span 3"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
         <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>

              <Box display="flex" justifyContent="end" mt="20px" >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Send Money to Collegue
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      </Box>      
      </Box>
      </Box>
    </Box>
  );
};



export default Settings;
