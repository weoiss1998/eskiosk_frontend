import { Box, Typography, useTheme, Stack } from "@mui/material";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { AuthCheck } from "../../components/authcheck";
import { API_URL } from "../../components/apiURL";
import { useNavigate } from "react-router-dom";

const product = {
  user_id: 0,
  id: 0,
  name: "Dummy",
  db_id: 0,
  quantity: 1,
  price: 10.99,
  cost: 10.99,
};

class Product {
  user_id = 0;
  id = 0;
  name = "";
  quantity = 1;
  price = 10.99;
  cost = 10.99;
}

var cart = [];
var products;
var items;

const Cart = (prop) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(0);

  async function checkout(listCart) {
    var exec = false;
    if (sessionStorage.getItem("confirmation_prompt") === "true") {
      if (
        window.confirm(
          "Are you sure you want to checkout? This will finalize your order."
        )
      ) {
        exec = true;
      }
    } else {
      exec = true;
    }
    if (exec === true) {
      var url = new URL(API_URL + "/cart/products/");
      url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
      url.searchParams.append("token", sessionStorage.getItem("token"));
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listCart),
      });
      const obj = await response.json();
      sessionStorage.removeItem("cart");
      cart = [];
      prop.setCartAmount(0);
      setStatus(0);
      //window.location.reload();
    }
  }

  const handleClick = (event, cellValues) => {
    var exec = false;
    if (sessionStorage.getItem("confirmation_prompt") === "true") {
      if (
        window.confirm(
          "Are you sure you want to delete this item? This will remove it from your cart."
        )
      ) {
        exec = true;
      }
    } else {
      exec = true;
    }
    if (exec === true) {
      cart.splice(cellValues.row.id, 1);
      items.delete(cellValues.row.id);
      var temp = 0;
      items.forEach(function (value, key) {
        temp += parseInt(value);
      });
      prop.setCartAmount(temp);
      sessionStorage.setItem("cart", JSON.stringify([...items]));
      setStatus(0);
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      var auth = AuthCheck();
      if (auth === false) {
        navigate("/login");
      }
      try {
        //const response = await fetch("./db.json");
        const response = await fetch(API_URL + "/products/");
        const result = await response.json();
        //setData(result);
        products = result;
        //console.table(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      if (sessionStorage.getItem("cart") == null) {
      } else {
        items = new Map(JSON.parse(sessionStorage.getItem("cart")));
        //console.log(JSON.stringify([...items]));
        cart = [];
        let user_id = 1; //to be replaced with user id from session
        if (sessionStorage.getItem("user_id") == null) {
        } else {
          user_id = sessionStorage.getItem("user_id");
        }
        items.forEach(function (value, key) {
          for (let i = 0; i < products.length; i++) {
            if (products[i].id == key) {
              var temp = new Product();
              temp.user_id = user_id;
              temp.id = key;
              if (value > products[i].quantity) {
                value = products[i].quantity;
              }
              temp.quantity = value;
              temp.name = products[i].name;
              temp.price = products[i].price;
              temp.cost = temp.quantity * temp.price;
              //console.log(temp);
              cart.push(temp);
            }
          }
        });
      }
      setData(products);
    };
    if (status === 0) {
      fetchData();
      setStatus(1);
    }
    if (status === 1) {
      setStatus(2);
    }

    return () => (isSubscribed = false);
  }, [products, status]);

  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
      editable: true,
    },
    {
      field: "price",
      headerName: "Price per Unit",
      flex: 1,
      renderCell: (params) => (
        <Typography>{Number(params.row.price).toFixed(2)}€</Typography>
      ),
    },
    {
      field: "cost",
      headerName: "Total Cost",
      flex: 1,
      renderCell: (params) => (
        <Typography>{Number(params.row.cost).toFixed(2)}€</Typography>
      ),
    },
    {
      field: "Delete",
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              handleClick(event, cellValues);
            }}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="Cart" subtitle="List of Items" />
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
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            size="medium"
            color="secondary"
            onClick={() => {
              checkout(cart);
              setStatus(0);
              prop.setCartAmount(0);
            }}
          >
            Checkout
          </Button>
          <Button
            variant="contained"
            size="medium"
            color="secondary"
            onClick={() => {
              var exec = false;
              if (sessionStorage.getItem("confirmation_prompt") === "true") {
                if (
                  window.confirm(
                    "Are you sure you want to delete all items from your cart?"
                  )
                ) {
                  exec = true;
                }
              } else {
                exec = true;
              }
              if (exec === true) {
                sessionStorage.removeItem("cart");
                prop.setCartAmount(0);
                cart = [];
                setStatus(0);
              }
            }}
          >
            Delete All
          </Button>

          <Typography variant="h6" color="secondary" size="medium">
            Total:{" "}
            {Number(cart.reduce((acc, item) => acc + item.cost, 0)).toFixed(2)}€
          </Typography>
        </Stack>

        <DataGrid
          rows={cart}
          columns={columns}
          onCellEditCommit={(props, event) => {
            for (let i = 0; i < cart.length; i++) {
              if (cart[i].id === props.id) {
                if (props.field === "quantity") {
                  for (let j = 0; j < products.length; j++) {
                    if (products[j].id === props.id) {
                      if (props.value > products[j].quantity) {
                        props.value = products[j].quantity;
                      }
                      break;
                    }
                  }
                  var items_list = new Map(
                    JSON.parse(sessionStorage.getItem("cart"))
                  );
                  var quantity = Math.round(props.value);
                  items_list.set(cart[i].id, quantity);
                  sessionStorage.removeItem("cart");
                  sessionStorage.setItem(
                    "cart",
                    JSON.stringify([...items_list])
                  );
                  cart[i].quantity = props.value;
                  cart[i].cost = cart[i].quantity * cart[i].price;
                  var temp = 0;
                  items_list.forEach(function (value, key) {
                    temp += parseInt(value);
                  });
                  console.log(temp);
                  prop.setCartAmount(temp);
                  setStatus(0);
                  //window.location.reload();
                }
              }
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default Cart;
