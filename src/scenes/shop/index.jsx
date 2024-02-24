import { Box, Typography, useTheme } from "@mui/material";
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



const card = {
  name: "Nature Around Us",
  db_id: 0,
  quantity: 1,
  price:
    "10,99",
  image: "img"
};

let products;

function AddToCart(items, db_id, quantity) {
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
}



const Shop = () => {
//const [data, setData] = useState([]);
const [index, setIndex] = useState(0);
const [cards, setCards] = React.useState([]);
const theme = useTheme();
const colors = tokens(theme.palette.mode);


useEffect(() => {

  const fetchData = async () => {
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
    }
  }
  console.log("fetchData");
  fetchData();

}, [products]);

  

  //console.table(products);
  var items = new Map();
 

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
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={() => {
            setIndex(0);
            setCards([]);
          }}
        >
          Reset
        </Button>
      <Grid container spacing={1}>
        {cards.map((cards, index) => {
          const { image, name, db_id, quantity, price } = cards;
          return (
            <Grid item>
              <Card key={index} >
                <CardMedia component="img" src={`data:image/png;base64, ${image}`} />
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
                      AddToCart(items, db_id, 1); 
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
