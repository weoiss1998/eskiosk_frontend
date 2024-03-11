import { Box, Typography, useTheme, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import { Grid, Divider } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { AuthCheck } from "../../components/authcheck";
import { API_URL } from "../../components/apiURL";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";

const card = {
  name: "Nature Around Us",
  db_id: 0,
  quantity: 1,
  price: "10,99",
  image: "img",
};

let products;

function AddToCart(items, db_id, quantity, props) {
  //console.log("AddToCart");
  //console.log(items);
  if (sessionStorage.getItem("cart") == null) {
  } else {
    items = new Map(JSON.parse(sessionStorage.getItem("cart")));
  }
  if (items.has(db_id)) {
    items.set(db_id, items.get(db_id) + quantity);
  } else {
    items.set(db_id, quantity);
  }
  sessionStorage.setItem("cart", JSON.stringify([...items]));
  var temp = 0;
  items.forEach(function (value, key) {
    temp += parseInt(value);
  });
  props.setCartAmount(temp);
}

async function SingleCheckOut(db_id) {
  if (window.confirm("Do you want to buy this product?")) {
    var url = new URL(API_URL + "/singleCheckOut/");
    url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
    url.searchParams.append("token", sessionStorage.getItem("token"));
    url.searchParams.append("product_id", db_id);
    const response = await fetch(url, { method: "POST" });
    const obj = await response.json();
    if (response.status === 200) {
      if (window.confirm("Product bought successfully")) {
      }
    } else {
      if (window.confirm("Error buying product")) {
      }
    }
  }
}

var resolution = 0;

const Shop = (props) => {
  resolution = (window.screen.height * window.devicePixelRatio) / 6;
  var items = new Map(JSON.parse(sessionStorage.getItem("cart")));
  //const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [cards, setCards] = React.useState([]);
  const [type, setType] = useState(0);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const initialValues = {
    email: "",
    amount: 0,
  };
  let patternTwoDigisAfterComma = /^\d+(\.\d{0,2})?$/;
  const checkoutSchema = yup.object().shape({
    email: yup.string(), //email("invalid email").required("required"),
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
      if (type === 0) {
        try {
          const response = await fetch(API_URL + "/products/avaiable/");
          const result = await response.json();
          //setData(result);
          products = result;
          if (index < products.length) {
            setCards([]);
            var picture = "img";
            if (products[index].image != null && products[index].image != "") {
              picture = products[index].image;
            }

            setCards([
              ...cards,
              {
                image: picture,
                name: products[index].name,
                db_id: products[index].id,
                quantity: products[index].quantity,
                price: products[index].price,
                cart: items.get(products[index].id),
              },
            ]);
            setIndex(index + 1);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else if (type === 1) {
        var url = new URL(API_URL + "/products/oneSort/");
        url.searchParams.append("sort", "Food");
        const response = await fetch(url);
        const result = await response.json();
        //setData(result);
        products = result;
        if (index < products.length) {
          setCards([]);
          var picture = "img";
          if (products[index].image != null && products[index].image != "") {
            picture = products[index].image;
          }

          setCards([
            ...cards,
            {
              image: picture,
              name: products[index].name,
              db_id: products[index].id,
              quantity: products[index].quantity,
              price: products[index].price,
              cart: items.get(products[index].id),
            },
          ]);
          setIndex(index + 1);
        }
      } else if (type === 2) {
        var url = new URL(API_URL + "/products/oneSort/");
        url.searchParams.append("sort", "Drink");
        const response = await fetch(url);
        const result = await response.json();
        //setData(result);
        products = result;
        if (index < products.length) {
          setCards([]);
          var picture = "img";
          if (products[index].image != null && products[index].image != "") {
            picture = products[index].image;
          }
          console.log(items.get(products[index].id));
          setCards([
            ...cards,
            {
              image: picture,
              name: products[index].name,
              db_id: products[index].id,
              quantity: products[index].quantity,
              price: products[index].price,
              cart: items.get(products[index].id),
            },
          ]);
          setIndex(index + 1);
        }
      }
    };
    fetchData();
  }, [products, type]);

  async function sendMoney(values) {
    var url = new URL(API_URL + "/sendMoney/");
    url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
    url.searchParams.append("token", sessionStorage.getItem("token"));
    url.searchParams.append("email", values.email);
    url.searchParams.append("amount", values.amount);
    const response = await fetch(url, { method: "POST" });
    const obj = await response.json();
    if (response.status === 200) {
      if (window.confirm("Money sent successfully")) {
      }
    } else {
      if (window.confirm("Error sending money")) {
      }
    }
  }

  const handleSelectChange = (event) => {
    setType(event.target.value);
    setCards([]);
    setIndex(0);
  };

  const handleFormSubmit = (values) => {
    if (
      window.confirm(
        "Do you want to send money to " +
          values.email +
          " in the amount of " +
          values.amount +
          " €?"
      )
    ) {
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
      >
        <Box
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
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" color="primary">
                Select a Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                color="primary"
                value={type}
                label="Select a type"
                onChange={handleSelectChange}
              >
                <MenuItem value={0}>All</MenuItem>
                <MenuItem value={1}>Food</MenuItem>
                <MenuItem value={2}>Drink</MenuItem>
              </Select>
            </FormControl>
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
                  <Box display="flex" justifyContent="end" mt="20px">
                  <Stack direction="row" spacing={1}>
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
                    </Stack>
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
            const { image, name, db_id, quantity, price, cart } = cards;
            return (
              <Grid item>
                <Card key={index}>
                  <CardMedia
                    component="img"
                    src={`data:image/png;base64, ${image}`}
                    sx={{ width: resolution, objectFit: "contain" }}
                  />
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
                    >
                      {" "}
                      only {quantity} left in stock!
                      <br />
                      {price} €
                    </Typography>
                    <Divider light />
                    <Stack direction="row" spacing={2}>
                    <Badge badgeContent={cart} color="secondary">
                      <Button
                        variant="contained"
                        size="medium"
                        color="secondary"
                        onClick={() => {
                          AddToCart(items, db_id, 1, props);
                          cart = cart + 1;
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Badge>
                    <Button
                      variant="contained"
                      size="medium"
                      color="secondary"
                      onClick={() => {
                        SingleCheckOut(db_id);
                      }}
                    >
                      Buy
                    </Button>
                    </Stack>
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
