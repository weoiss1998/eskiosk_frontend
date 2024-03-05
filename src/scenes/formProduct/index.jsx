import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useEffect, useState, useRef } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import {AuthCheck} from "../../components/authcheck";

var picture="";

const FormProduct = () => {
  var auth = AuthCheck();
  if (auth === false) {
    navigate("/login");
  }
  const hiddenFileInput = useRef(null); 
  const isNonMobile = useMediaQuery("(min-width:600px)");

  async function postNewProduct(values) {
    var url = new URL("http://fastapi.localhost:8008/products/");
    url.searchParams.append('user_id', sessionStorage.getItem("user_id"));
    url.searchParams.append('token', sessionStorage.getItem("token"));
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({name: values.name, price: values.price, quantity: values.quantity, image: picture})
    });
    console.log(JSON.stringify({name: values.name, price: values.price, quantity: values.quantity, image: picture}))
    const obj = await response.json()
    if (obj.is_active===true){
        console.log("yes")
        window.location.reload();
    }
    else {
        if (window.confirm("Error creating new product")) {
        }  
        else {
        }
    }
}
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
  const handleFormSubmit = (values) => {
    if (window.confirm("Do you want to create a new product?")
    ) {
    postNewProduct(values);   
    }
  };

  const handleClick = event => {
    hiddenFileInput.current.click();   
  };

  const handlePicture = event => {
    const fileUploaded = event.target.files[0]; // ADDED

  const reader = new FileReader();
  reader.onloadend = () => {
    const base64String = reader.result.split(",")[1];
    console.log(base64String);
    picture = base64String;
    // Do something with the base64String
  };
  reader.readAsDataURL(fileUploaded);
  };


  return (
    <Box m="20px">
      <Header title="CREATE PRODUCT" subtitle="Create a New Product" />

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
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price}
                name="price"
                error={!!touched.price && !!errors.price}
                helperText={touched.price && errors.price}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Quantity"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.quantity}
                name="quantity"
                error={!!touched.quantity && !!errors.quantity}
                helperText={touched.quantity && errors.quantity}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
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
  <VisuallyHiddenInput type="file" ref={hiddenFileInput} onChange={handlePicture} />
</Button>
              <Button type="submit" color="secondary" variant="contained">
                Create New Product
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

  let patternTwoDigisAfterComma = /^\d+(\.\d{0,2})?$/;
  const commonStringValidator = yup
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
    .min(5, "minimum 5")
    .max(10, "maximum 10")
    .required("Is required");
  
  const validationSchema = yup.object({
    amount: commonStringValidator,
  });


const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  price: yup
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
  quantity: yup.number().positive().required("required"),
  /*quantity: yup.string().email("invalid email").required("required"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address1: yup.string().required("required"),
  address2: yup.string().required("required"),*/
});
const initialValues = {
  name: "",
  price: 0,
  quantity: 0,
};

export default FormProduct;
