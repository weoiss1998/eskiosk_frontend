import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { Button} from "@mui/material";
import { useEffect, useState } from "react";

class User{
  id= 0;
  name=  "";
  email = "";
  isActive = false;
  accessLevel = false;
  lastTurnover = 0.0;
  paid = false;
  actualTurnover = 0.0;
  salesPeriod = 0;
  modifiedName = false;
  modifiedEmail = false;
  modifiedStatus = false;
  modifiedAccessLevel = false;
  modifiedPaid = false;
}

var userList = [];
var users;

async function saveChanges(userList) {
  for(let i = 0; i < userList.length; i++) {
    if(userList[i].modifiedName === true) {
      /*var url = new URL("http://fastapi.localhost:8008/changeUserName/");
      url.searchParams.append('user_id', userList[i].id);
      url.searchParams.append('name', userList[i].name);
      const response = await fetch(url, {method: "PATCH"});
      await response.json();
      userList[i].modifiedName = false;*/
    }
    if(userList[i].modifiedEmail === true) {
      /*var url = new URL("http://fastapi.localhost:8008/changeMail/");
      url.searchParams.append('user_id', userList[i].id);
      url.searchParams.append('email', userList[i].email);
      const response = await fetch(url, {method: "PATCH"});
      await response.json();
      userList[i].modifiedEmail = false;*/
    }
    if(userList[i].modifiedStatus === true) {
      /*var url = new URL("http://fastapi.localhost:8008/changeStatus/");
      url.searchParams.append('user_id', userList[i].id);
      url.searchParams.append('status', userList[i].isActive);
      const response = await fetch(url, {method: "PATCH"});
      await response.json();
      userList[i].modifiedEmail = false;*/
    }
    if(userList[i].modifiedAccessLevel === true) {
      /*var url = new URL("http://fastapi.localhost:8008/changeAccessLevel/");
      url.searchParams.append('user_id', userList[i].id);
      url.searchParams.append('is_admin', userList[i].accessLevel);
      const response = await fetch(url, {method: "PATCH"});
      await response.json();
      userList[i].modifiedAccessLevel = false;*/
    }
    if(userList[i].modifiedPaid === true) {
      var url = new URL("http://fastapi.localhost:8008/changePaid/");
      url.searchParams.append('user_id', userList[i].id);
      url.searchParams.append('paid', userList[i].paid);
      const response = await fetch(url, {method: "PATCH"});
      await response.json();
      userList[i].modifiedPaid = false;
    }
    
  }
  window.location.reload();
}


const Team = () => {
  const handleClick = (event, cellValues) => {
    console.log(cellValues.row);
  };

  const changePassword = (event, cellValues) => {
  };

  const closePeriod = () => {
    var url = new URL("http://fastapi.localhost:8008/closePeriod/");
    const response = fetch(url, {method: "POST"});
  };
  

  const [data, setData] = useState([]);
  const [status, setStatus] = useState(0);

  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      try {
        //const response = await fetch("./db.json");
        const response = await fetch("http://fastapi.localhost:8008/userData/");
        const result = await response.json();
        if (isSubscribed) {
          //setData(result);
          users = result;
        }
        //console.table(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
        //console.log(JSON.stringify([...items]));
      userList = [];
      for(let i = 0; i < users.length; i++) {
          var temp = new User();
          temp.id = users[i].id;
          temp.name = users[i].name;
          temp.email = users[i].email;
          temp.isActive = users[i].is_active;
          temp.accessLevel = users[i].is_admin;
          temp.lastTurnover = users[i].last_turnover;
          temp.paid = users[i].paid;
          temp.actualTurnover = users[i].actual_turnover;
          temp.salesPeriod = users[i].sales_period;
          temp.modifiedName = false;
          temp.modifiedEmail = false;
          temp.modifiedStatus = false;
          temp.modifiedAccessLevel = false;
          temp.modifiedPaid = false;
          //console.log(temp);
          userList.push(temp);
          }
          
      setData(users);
    }
    if (status === 0) {
      fetchData();
      setStatus(1);
    }
    if (status === 1) {
      setStatus(2);
    }
  
    return () => isSubscribed = false;
  }, [users]); 

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    /*{
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },*/
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "isActive",
      headerName: "Is Active?",
      editable: true,
      type: "boolean",
      flex: 1,
    },
    {
      field: "accessLevel",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              access === "admin"
                ? colors.greenAccent[600]
                : access === "manager"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {access === "manager" && <SecurityOutlinedIcon />}
            {access === "user" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "lastTurnover",
      headerName: "Turnover last period",
      flex: 1,
    },
    {
      field: "paid",
      headerName: "Paid",
      editable: true,
      type: "boolean",
      flex: 1,
    },
    {
      field: "actualTurnover",
      headerName: "Turnover actual period",
      flex: 1,
    },
    {
      field: "Change Password",
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              changePassword(event, cellValues);
            }}
          >
            Change Password
          </Button>
        );
      }
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
      <Header title="USERS" subtitle="Managing the Users" />
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
        saveChanges(userList);
      }}
    >
      Save All
      </Button>
      <Button
      variant="contained"
      size="small"
      color="primary"
      onClick={() => {
        closePeriod();
      }}
    >
      Close Period
      </Button>
        <DataGrid checkboxSelection rows={userList} columns={columns} onCellEditCommit={(props, event) => {
          for(let i = 0; i < userList.length; i++) { 
            if(userList[i].id === props.id) {
              if(props.field === "name") {
                userList[i].modifiedName = true;
                userList[i].name = props.value;
              }
              if(props.field === "paid") {
                userList[i].modifiedPaid = true;
                userList[i].paid = props.value;
              }
              /*if(props.field === "price") {
                userList[i].modifiedPrice = true;
                userList[i].price = props.value;
              }*/
            }
          }
         // console.table(userList);
        }} />
      </Box>
    </Box>
  );
};

export default Team;
