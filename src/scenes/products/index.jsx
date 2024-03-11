import { Box, useTheme, Button, Avatar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState, useRef } from "react";
import { AuthCheck } from "../../components/authcheck";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { API_URL } from "../../components/apiURL";
import { useNavigate } from "react-router-dom";

class Product {
  id = 0;
  name = "";
  quantity = 1;
  price = 10.99;
  type_of_product = "Food";
  is_active = true;
  image = "";
  modifiedName = false;
  modifiedQuantity = false;
  modifiedPrice = false;
  modifiedType = false;
  modifiedIsActive = false;
  modifiedImage = false;
  newImg = false;
}

var productList = [];
var products;

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

async function saveChanges(productList) {
  var exec = false;
  if (sessionStorage.getItem("confirmation_prompt") === "true") {
    if (
      window.confirm(
        "Are you sure you want to save changes? This will update the database."
      )
    ) {
      exec = true;
    }
  } else {
    exec = true;
  }
  if (exec === true) {
    for (let i = 0; i < productList.length; i++) {
      if (productList[i].modifiedName === true) {
        var url = new URL(API_URL + "/changeName/");
        url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
        url.searchParams.append("token", sessionStorage.getItem("token"));
        url.searchParams.append("product_id", productList[i].id);
        url.searchParams.append("name", productList[i].name);
        const response = await fetch(url, { method: "PATCH" });
        await response.json();
        productList[i].modifiedName = false;
      }
      if (productList[i].modifiedQuantity === true) {
        var url = new URL(API_URL + "/changeStock/");
        url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
        url.searchParams.append("token", sessionStorage.getItem("token"));
        url.searchParams.append("product_id", productList[i].id);
        url.searchParams.append("quantity", productList[i].quantity);
        const response = await fetch(url, { method: "PATCH" });
        await response.json();
        productList[i].modifiedQuantity = false;
      }
      if (productList[i].modifiedPrice === true) {
        var url = new URL(API_URL + "/changePrice/");
        url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
        url.searchParams.append("token", sessionStorage.getItem("token"));
        url.searchParams.append("product_id", productList[i].id);
        url.searchParams.append("price", productList[i].price);
        const response = await fetch(url, { method: "PATCH" });
        await response.json();
        productList[i].modifiedPrice = false;
      }
      if (productList[i].modifiedType === true) {
        var url = new URL(API_URL + "/changeType/");
        url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
        url.searchParams.append("token", sessionStorage.getItem("token"));
        url.searchParams.append("product_id", productList[i].id);
        url.searchParams.append(
          "type_of_product",
          productList[i].type_of_product
        );
        const response = await fetch(url, { method: "PATCH" });
        await response.json();
        productList[i].modifiedType = false;
      }
      if (productList[i].modifiedIsActive === true) {
        var url = new URL(API_URL + "/changeActive/");
        url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
        url.searchParams.append("token", sessionStorage.getItem("token"));
        url.searchParams.append("product_id", productList[i].id);
        url.searchParams.append("is_active", productList[i].is_active);
        const response = await fetch(url, { method: "PATCH" });
        await response.json();
        productList[i].modifiedIsActive = false;
      }
      if (productList[i].modifiedImage === true) {
        var url = new URL(API_URL + "/changeImage/");
        url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
        url.searchParams.append("token", sessionStorage.getItem("token"));
        url.searchParams.append("product_id", productList[i].id);
        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: productList[i].image,
          }),
        });
        await response.json();
        productList[i].modifiedImage = false;
      }
    }
    window.location.reload();
  }
}

var picture = "";
var product_id = 0;

const Products = () => {
  const navigate = useNavigate();
  const hiddenFileInput = useRef(null);
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
        const response = await fetch(API_URL + "/products/");
        const result = await response.json();
        if (isSubscribed) {
          //setData(result);
          products = result;
        }
        //console.table(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      //console.log(JSON.stringify([...items]));
      productList = [];
      for (let i = 0; i < products.length; i++) {
        var temp = new Product();
        temp.id = products[i].id;
        temp.quantity = products[i].quantity;
        temp.name = products[i].name;
        temp.price = products[i].price;
        temp.type_of_product = products[i].type_of_product;
        temp.is_active = products[i].is_active;
        temp.image = products[i].image;
        temp.modifiedIsActive = false;
        temp.modifiedName = false;
        temp.modifiedQuantity = false;
        temp.modifiedPrice = false;
        temp.modifiedType = false;
        //console.log(temp);
        productList.push(temp);
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
  }, [products]);

  const handleClick = (event, cellValues) => {
    product_id = cellValues.id;
  };

  const handlePicture = (event) => {
    const fileUploaded = event.target.files[0]; // ADDED

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];
      picture = base64String;
      if (picture.length > 0) {
        for (let i = 0; i < productList.length; i++) {
          if (productList[i].id === product_id) {
            productList[i].image = picture;
            productList[i].modifiedImage = true;
          }
        }
      }
    };
    reader.readAsDataURL(fileUploaded);
  };

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
      field: "image",
      headerName: "Image",
      flex: 1,
      renderCell: (params) => (
        <Avatar
          alt="Image"
          src={`data:image/png;base64, ${params.value}`}
          sx={{ width: 50, height: 50 }}
        />
      ),
    },
    {
      field: "is_active",
      headerName: "Is Active?",
      editable: true,
      type: "boolean",
      flex: 1,
    },
    {
      field: "type_of_product",
      headerName: "Type of Product",
      editable: true,
      type: "singleSelect",
      valueOptions: ["Food", "Drink"],
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
      headerName: "Price in EUR",
      flex: 1,
    },
    {
      field: "updateImage",
      flex: 1,
      headerName: "Update Image",
      renderCell: (cellValues) => {
        return (
          <Button
            component="label"
            role={undefined}
            onClick={(event) => {
              handleClick(event, cellValues);
            }}
            color="secondary"
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload Image
            <VisuallyHiddenInput type="file" onChange={handlePicture} />
          </Button>
        );
      },
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
      >
        {" "}
        <Button
          variant="contained"
          size="small"
          color="secondary"
          onClick={() => {
            saveChanges(productList);
          }}
        >
          Save All
        </Button>
        <DataGrid
          rows={productList}
          columns={columns}
          onCellEditCommit={(props, event) => {
            for (let i = 0; i < productList.length; i++) {
              if (productList[i].id === props.id) {
                if (props.field === "name") {
                  productList[i].modifiedName = true;
                  productList[i].name = props.value;
                }
                if (props.field === "quantity") {
                  productList[i].modifiedQuantity = true;
                  productList[i].quantity = props.value;
                }
                if (props.field === "price") {
                  productList[i].modifiedPrice = true;
                  productList[i].price = props.value;
                }
                if (props.field === "is_active") {
                  productList[i].modifiedIsActive = true;
                  productList[i].is_active = props.value;
                }
                if (props.field === "type_of_product") {
                  productList[i].modifiedType = true;
                  productList[i].type_of_product = props.value;
                }
              }
            }
            // console.table(productList);
          }}
        />
      </Box>
    </Box>
  );
};

export default Products;
