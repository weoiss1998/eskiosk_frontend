import { Box, useTheme } from "@mui/material";
import { DataGrid  } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Button} from "@mui/material";
import { useEffect, useState } from "react";
import {AuthCheck} from "../../components/authcheck";

const product = {
  id: 0,
  name: "Dummy",
  db_id: 0,
  quantity: 1,
  price: 10.99,
  modifiedName: false,
  modifiedQuantity: false,
  modifiedPrice: false
};

class Product{
  id= 0;
  name=  "";
  quantity = 1;
  price = 10.99;
  modifiedName = false;
  modifiedQuantity = false;
  modifiedPrice = false;
}

var productList = [];
var products;

async function saveChanges(productList) {
  for(let i = 0; i < productList.length; i++) {
    if(productList[i].modifiedName === true) {
      var url = new URL("http://fastapi.localhost:8008/changename/");
      url.searchParams.append('user_id', sessionStorage.getItem("user_id"));
      url.searchParams.append('token', sessionStorage.getItem("token"));
      url.searchParams.append('product_id', productList[i].id);
      url.searchParams.append('name', productList[i].name);
      const response = await fetch(url, {method: "PATCH"});
      await response.json();
      productList[i].modifiedName = false;
    }
    if(productList[i].modifiedQuantity === true) {
      var url = new URL("http://fastapi.localhost:8008/changestock/");
      url.searchParams.append('user_id', sessionStorage.getItem("user_id"));
      url.searchParams.append('token', sessionStorage.getItem("token"));
      url.searchParams.append('product_id', productList[i].id);
      url.searchParams.append('quantity', productList[i].quantity);
      const response = await fetch(url, {method: "PATCH"});
      await response.json();
      productList[i].modifiedQuantity = false;
    }
    if(productList[i].modifiedPrice === true) {
      var url = new URL("http://fastapi.localhost:8008/changeprice/");
      url.searchParams.append('user_id', sessionStorage.getItem("user_id"));
      url.searchParams.append('token', sessionStorage.getItem("token"));
      url.searchParams.append('product_id', productList[i].id);
      url.searchParams.append('price', productList[i].price);
      const response = await fetch(url, {method: "PATCH"});
      await response.json();
      productList[i].modifiedPrice = false;
    }
    
  }
  window.location.reload();
}

const Products = () => {
  const handleClick = (event, cellValues) => {
    console.log(cellValues.row);
  };

  const [data, setData] = useState([]);
  const [status, setStatus] = useState(0);

  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      var auth = AuthCheck();
      if (auth === false) {
        navigate("/login");
      }
      try {
        //const response = await fetch("./db.json");
        const response = await fetch("http://fastapi.localhost:8008/products/");
        const result = await response.json();
        if (isSubscribed) {
          //setData(result);
          products = result;
        }
        //console.table(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
        //console.log(JSON.stringify([...items]));
      productList = [];
      for(let i = 0; i < products.length; i++) {
          var temp = new Product();
          temp.id = products[i].id;
          temp.quantity = products[i].quantity;
          temp.name = products[i].name;
          temp.price = products[i].price;
          temp.modifiedName = false;
          temp.modifiedQuantity = false;
          temp.modifiedPrice = false;
          //console.log(temp);
          productList.push(temp);
          }
          
      setData(products);
    }
    if (status === 0) {
      fetchData();
      setStatus(1);
    }
    if (status === 1) {
      setStatus(2);
    }
  
    return () => isSubscribed = false;
  }, [products]); 



  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      editable: true,
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "quantity",
      editable: true,
      headerName: "Quantity",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    /*{
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              handleClick(event, cellValues);
            }}
          >
            {cellValues.value}
          </Button>
        );
          },
    },*/
    {
      field: "price",
      editable: true,
      headerName: "Price",
      flex: 1,
    },
    {
      field: "Print",
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              handleClick(event, cellValues);
            }}
          >
            Print
          </Button>
        );
      }
    },
  ];

  return (
    <Box m="20px">
      <Header title="PRODUCTS" subtitle="Managing the Products" />
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
      > <Button
      variant="contained"
      size="small"
      color="primary"
      onClick={() => {
        saveChanges(productList);
      }}
    >
      Save All
    </Button>
        <DataGrid checkboxSelection rows={productList} columns={columns} onCellEditCommit={(props, event) => {
          for(let i = 0; i < productList.length; i++) { 
            if(productList[i].id === props.id) {
              if(props.field === "name") {
                productList[i].modifiedName = true;
                productList[i].name = props.value;
              }
              if(props.field === "quantity") {
                productList[i].modifiedQuantity = true;
                productList[i].quantity = props.value;
              }
              if(props.field === "price") {
                productList[i].modifiedPrice = true;
                productList[i].price = props.value;
              }
            }
          }
         // console.table(productList);
        }} />
      </Box>
    </Box>
  );
};

export default Products;
