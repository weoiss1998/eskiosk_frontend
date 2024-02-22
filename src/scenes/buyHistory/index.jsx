import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { Button} from "@mui/material";
import { useEffect, useState } from "react";

function Product(id, name, quantity, price, total, paid, period) {
  this.id = id;
  this.prduct_name = name;
  this.quantity = quantity;
  this.price = price;
  this.total = total;
  this.paid = paid;
  this.period = period;
}

var salesEntryList = [];
var salesEntries;

const BuyHistory = () => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(0);

  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      try {
        //const response = await fetch("./db.json");
        //const response = await fetch("http://fastapi.localhost:8008/salesEntries/");
        let user_id = 1;  //to be replaced with user id from session
        if (sessionStorage.getItem("user_id") == null) {
        }
        else {
          user_id = sessionStorage.getItem("user_id");
        }
        var url = new URL("http://fastapi.localhost:8008/salesEntriesID/");
        url.searchParams.append('user_id', user_id);
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
          var temp = new Product();
          temp.id = salesEntries[i].id;
          temp.quantity = salesEntries[i].quantity;
          temp.product_name = salesEntries[i].product_name;
          temp.price = salesEntries[i].price;
          temp.total = salesEntries[i].quantity * salesEntries[i].price;
          temp.paid = salesEntries[i].paid;
          temp.period = salesEntries[i].period;
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

export default BuyHistory;
