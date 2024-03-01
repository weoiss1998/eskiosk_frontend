import { Box, Typography, useTheme, TextField  } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Button} from "@mui/material";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import { Grid, Divider } from "@mui/material";
import img from "./image.jpg";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import {AuthCheck} from "../../components/authcheck";



const card = {
  name: "Nature Around Us",
  db_id: 0,
  quantity: 1,
  price:
    "10,99",
  image: "img"
};

let products;

function AddToCart(items, db_id, quantity, props) {
  //console.log("AddToCart");
  //console.log(items);
  if (sessionStorage.getItem("cart") == null) {
  }
  else {
    items = new Map(JSON.parse(sessionStorage.getItem("cart")));
  }
  if (items.has(db_id)) {
    items.set(db_id, items.get(db_id) + quantity);
  } else {
    items.set(db_id, quantity);
  }
  sessionStorage.setItem("cart", JSON.stringify([...items]));
  var temp = 0;
                items.forEach (function(value, key) {
                  temp += parseInt(value);
                });
  props.setCartAmount(temp);
}

var resolution = 0;

const Shop = (props) => {
 resolution = window.screen.height * window.devicePixelRatio/6;
//const [data, setData] = useState([]);
const navigate = useNavigate();
const [index, setIndex] = useState(0);
const [cards, setCards] = React.useState([]);
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
    try {
      //const response = await fetch("./db.json");
      const response = await fetch("http://fastapi.localhost:8008/products/");
      const result = await response.json();
      //setData(result);
      products = result;
      console.log(products.length)
      //console.table(data);
      if (index < products.length) {
        var picture= img;
        if (products[index].image != null && products[index].image != ""){
          picture = products[index].image;
        }
        
        setCards([...cards, {image: picture ,name: products[index].name,db_id: products[index].id,quantity: products[index].quantity,price:products[index].price}]);
        console.log(products[index].id);
        setIndex(index+1);
        
    }} catch (error) {
      console.error('Error fetching data:', error);
  }}
  fetchData();

}, [products]);

async function sendMoney(values) {
  var url = new URL("http://fastapi.localhost:8008/sendMoney/");
  url.searchParams.append('user_id', sessionStorage.getItem("user_id"));
  url.searchParams.append('email', values.email);
  url.searchParams.append('amount', values.amount);
  const response = await fetch(url, {method: "POST",});
  console.log(JSON.stringify({email: values.email, amount: values.amount}))
  const obj = await response.json()
  console.log(response.status);
  if (response.status === 200){
    if (window.confirm("Money sent successfully")) {
    }
  }
  else {
      if (window.confirm("Error sending money")) {
      }  
  }
}

const handleFormSubmit = (values) => {
  if(window.confirm("Do you want to send money to " + values.email + " in the amount of " + values.amount + " €?")){
  sendMoney(values);
  }
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
        m="40px 0 0 0px"
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
            if (index < products.length) {
            setCards([...cards, {image: img,name: products[index].name,db_id: products[index].id,quantity: products[index].quantity,price:products[index].price}]);
            //console.log(products[index].id);
            setIndex(index+1);
            }
          }}
        >
          Add
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
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Amount"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.amount}
                name="amount"
                error={!!touched.amount && !!errors.amount}
                helperText={touched.amount && errors.amount}
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
      <Grid container spacing={5}>
        {cards.map((cards, index) => {
          const { image, name, db_id, quantity, price } = cards;
          return (
            <Grid item>
              <Card key={index} >
                <CardMedia component="img" src={`data:image/png;base64, ${image}`}  sx={{ width: resolution, objectFit: "contain" }}/>
                <CardContent>
                  <Typography
                    className={"MuiTypography--heading"}
                    variant={"h6"}
                    gutterBottom
                  >
                    {name}
                  </Typography>
                  <Typography
                    className={"MuiTypography--subheading"}
                    variant={"caption"}
                  > only {quantity} left in stock! 
                  <br/>
                    {price}
                  </Typography>
                  <Divider light />

                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => {
                      AddToCart(items, db_id, 1, props); 
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      </Box>
    </Box>
  );
};



export default Shop;
