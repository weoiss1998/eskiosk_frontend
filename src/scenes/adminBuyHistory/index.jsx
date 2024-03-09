import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { Button} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {AuthCheck} from "../../components/authcheck";


class ProductEntry {
  id = 0;
  user_id = 0;
  user_name = "";
  product_name = "";
  quantity = 0;
  price = 0.0;
  total = 0.0;
  paid = false;
  period = "";
  date = "";
}

var salesEntryList = [];
var salesEntries;

const AdminBuyHistory = () => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let isSubscribed = true;
    var auth = AuthCheck();
      if (auth === false) {
        navigate("/login");
      }
    const fetchData = async () => {
      try {
        //const response = await fetch("./db.json");
        //const response = await fetch("http://fastapi.localhost:8008/salesEntries/");
        var url = new URL("http://fastapi.localhost:8008/salesEntries/");
        url.searchParams.append('user_id', sessionStorage.getItem("user_id"));
        url.searchParams.append('token', sessionStorage.getItem("token"));
        const response = await fetch(url, {method: "GET"});
        const result = await response.json();
        if (isSubscribed) {
          //setData(result);
          salesEntries = result;
        }
        //console.table(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
        //console.log(JSON.stringify([...items]));
      salesEntryList = [];
      for(let i = 0; i < salesEntries.length; i++) {
          var temp = new ProductEntry();
          temp.id = salesEntries[i].id;
          temp.user_id = salesEntries[i].user_id;
          temp.user_name = salesEntries[i].user_name;
          temp.quantity = salesEntries[i].quantity;
          temp.product_name = salesEntries[i].product_name;
          temp.price = salesEntries[i].price;
          temp.total = salesEntries[i].quantity * salesEntries[i].price;
          temp.paid = salesEntries[i].paid;
          temp.period = salesEntries[i].period;
          temp.date = salesEntries[i].timestamp;
          //console.log(temp);
          salesEntryList.push(temp);
          }
          
      setData(salesEntries);
    }
    if (status === 0) {
      fetchData();
      setStatus(1);
    }
    if (status === 1) {
      setStatus(2);
    }
  
    return () => isSubscribed = false;
  }, [salesEntries]); 

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "user_name", headerName: "User Name", flex: 1 },
    { field: "product_name", headerName: "Name" },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "price",
      headerName: "Price per Unit",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "total",
      headerName: "Total",
      flex: 1,
    },
    {
      field: "paid",
      headerName: "Paid",
      flex: 1,
    },
    {
      field: "period",
      headerName: "Period",
      flex: 1,
    },
    {field: "date", headerName: "Date", flex: 1,},
  ];

  return (
    <Box m="20px">
      <Header title="PRODUCT BUY HISTORY" subtitle="See the buy history" />
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
        <DataGrid rows={salesEntryList} columns={columns} />
      </Box>
    </Box>
  );
};

export default AdminBuyHistory;
