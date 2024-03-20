import { Box, useTheme, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { AuthCheck } from "../../components/authcheck";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../components/apiURL";

class User {
  id = 0;
  name = "";
  email = "";
  isActive = false;
  access = false;
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
  var exec = false;
  if (sessionStorage.getItem("confirmation_prompt") === "true") {
    if (
      window.confirm(
        "Are you sure you want to save the changes? This will finalize your changes."
      )
    ) {
      exec = true;
    }
  } else {
    exec = true;
  }
  if (exec === true) {
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].modifiedName === true) {
        var url = new URL(API_URL + "/changeNameUser/");
        url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
        url.searchParams.append("token", sessionStorage.getItem("token"));
        url.searchParams.append("change_id", userList[i].id);
        url.searchParams.append("name", userList[i].name);
        const response = await fetch(url, { method: "PATCH" });
        await response.json();
        userList[i].modifiedName = false;
      }
      if (userList[i].modifiedEmail === true) {
        var url = new URL(API_URL + "/changeEmail/");
        url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
        url.searchParams.append("token", sessionStorage.getItem("token"));
        url.searchParams.append("change_id", userList[i].id);
        url.searchParams.append("email", userList[i].email);
        const response = await fetch(url, { method: "PATCH" });
        await response.json();
        userList[i].modifiedEmail = false;
      }
      if (userList[i].modifiedStatus === true) {
        var url = new URL(API_URL + "/changeUserStatus/");
        url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
        url.searchParams.append("token", sessionStorage.getItem("token"));
        url.searchParams.append("change_id", userList[i].id);
        url.searchParams.append("is_active", userList[i].isActive);
        const response = await fetch(url, { method: "PATCH" });
        await response.json();
        userList[i].modifiedStatus = false;
      }
      if (userList[i].modifiedAccessLevel === true) {
        var url = new URL(API_URL + "/changeUserAdmin/");
        url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
        url.searchParams.append("token", sessionStorage.getItem("token"));
        url.searchParams.append("change_id", userList[i].id);
        url.searchParams.append("is_admin", userList[i].access);
        const response = await fetch(url, { method: "PATCH" });
        await response.json();
        userList[i].modifiedAccessLevel = false;
      }
      if (userList[i].modifiedPaid === true) {
        var url = new URL(API_URL + "/changePaid/");
        url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
        url.searchParams.append("token", sessionStorage.getItem("token"));
        url.searchParams.append("change_id", userList[i].id);
        url.searchParams.append("paid", userList[i].paid);
        const response = await fetch(url, { method: "PATCH" });
        await response.json();
        userList[i].modifiedPaid = false;
      }
    }
    window.location.reload();
  }
}
const Team = () => {
  const navigate = useNavigate();
  const handleClick = (event, cellValues) => {
    console.log(cellValues.row);
  };

  const closePeriod = () => {
    var exec = false;
    if (sessionStorage.getItem("confirmation_prompt") === "true") {
      if (
        window.confirm(
          "Are you sure you want to close the period? This will finalize the period and start a new one."
        )
      ) {
        exec = true;
      }
    } else {
      exec = true;
    }
    if (exec === true) {
      var url = new URL(API_URL + "/closePeriod/");
      url.searchParams.append("admin_id", sessionStorage.getItem("user_id"));
      url.searchParams.append("token", sessionStorage.getItem("token"));
      const response = fetch(url, { method: "POST" });
    }
  };

  function enterAmount(varValue) {
    var enteredAmount = prompt("Please enter Euro amount you want to add");
    if (enteredAmount == null) {
      return false;
    }
    enteredAmount = enteredAmount.replace(",", ".");
    var code, i, len;
    var foundDot = false;
    for (i = 0, len = enteredAmount.length; i < len; i++) {
      code = enteredAmount.charCodeAt(i);
      if (i === 0) {
        if (
          !(code > 47 && code < 58) && // numeric (0-9)
          !(code === 46) && // Dot
          !(code === 45)
        ) {
          alert("Enter a valid amount");
          return enterAmount();
        }
      } else {
        if (
          !(code > 47 && code < 58) && // numeric (0-9)
          !(code === 46) // Dot
        ) {
          alert("Enter a valid amount");
          return enterAmount();
        }
        if (code === 46) {
          if (foundDot === true) {
            alert("Enter a valid amount");
            return enterAmount();
          }
          var redLen = len - i;
          foundDot = true;
          if (redLen > 3) {
            alert("Enter a valid amount");
            return enterAmount();
          }
        }
      }
    }
    varValue = parseFloat(enteredAmount);
    if (isNaN(varValue)) {
      alert("Enter a valid amount");
      return enterAmount();
    } else if (varValue != null) {
      return varValue;
    }
  }

  function enterPassword() {
    var enteredAmount = prompt("Please enter the new password for the user");
    if (enteredAmount == null) {
      return false;
    } else {
      return enteredAmount;
    }
  }

  async function closePeriodForUser(user_id) {
    var url = new URL(API_URL + "/closePeriodForUser/");
    url.searchParams.append("admin_id", sessionStorage.getItem("user_id"));
    url.searchParams.append("token", sessionStorage.getItem("token"));
    url.searchParams.append("change_id", user_id);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      alert("Period closed for user");
    } else {
      alert("Error closing period for user");
    }
  }

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
        var url = new URL(API_URL + "/userData/");
        url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
        url.searchParams.append("token", sessionStorage.getItem("token"));
        const response = await fetch(url, { method: "GET" });
        const result = await response.json();
        if (isSubscribed) {
          users = result;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      userList = [];
      for (let i = 0; i < users.length; i++) {
        var temp = new User();
        temp.id = users[i].id;
        temp.name = users[i].name;
        temp.email = users[i].email;
        temp.isActive = users[i].is_active;
        temp.access = users[i].is_admin;
        temp.lastTurnover = users[i].last_turnover;
        temp.paid = users[i].paid;
        temp.actualTurnover = users[i].actual_turnover;
        temp.salesPeriod = users[i].sales_period;
        temp.modifiedName = false;
        temp.modifiedEmail = false;
        temp.modifiedStatus = false;
        temp.modifiedAccessLevel = false;
        temp.modifiedPaid = false;
        userList.push(temp);
      }

      setData(users);
    };
    if (status === 0) {
      fetchData();
      setStatus(1);
    }
    if (status === 1) {
      setStatus(2);
    }

    return () => (isSubscribed = false);
  }, [users]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      editable: true,
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      editable: true,
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
      field: "access",
      headerName: "Is Admin?",
      flex: 1,
      editable: true,
      type: "boolean",
    },
    {
      field: "lastTurnover",
      headerName: "Turnover last period",
      flex: 1,
      renderCell: (params) => (
        <Typography>{Number(params.row.lastTurnover).toFixed(2)}€</Typography>
      ),
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
      renderCell: (params) => (
        <Typography>{Number(params.row.actualTurnover).toFixed(2)}€</Typography>
      ),
    },
    {
      field: "Change Password",
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              var newPassword = enterPassword();
              if (newPassword != false) {
                var url = new URL(API_URL + "/changePassword/");
                url.searchParams.append(
                  "user_id",
                  sessionStorage.getItem("user_id")
                );
                url.searchParams.append(
                  "token",
                  sessionStorage.getItem("token")
                );
                const response = fetch(url, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    change_id: cellValues.row.id,
                    password: newPassword,
                  }),
                });
              }
            }}
          >
            Change Password
          </Button>
        );
      },
    },
    {
      field: "Add Money",
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              var amountAddition = enterAmount(amountAddition);
              if (amountAddition != false) {
                cellValues.row.actualTurnover += amountAddition;
                var url = new URL(API_URL + "/addOpenBalances/");
                url.searchParams.append(
                  "user_id",
                  sessionStorage.getItem("user_id")
                );
                url.searchParams.append(
                  "token",
                  sessionStorage.getItem("token")
                );
                url.searchParams.append("change_id", cellValues.row.id);
                url.searchParams.append("amount", amountAddition);
                const response = fetch(url, { method: "POST" });
                window.location.reload();
              }
            }}
          >
            Add Money
          </Button>
        );
      },
    },
    {
      field: "Close Period for User",
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              var exec = false;
              if (sessionStorage.getItem("confirmation_prompt") === "true") {
                if (
                  window.confirm(
                    "Are you sure you want to close the period for this user? This will finalize the period and start a new one."
                  )
                ) {
                  exec = true;
                }
              } else {
                exec = true;
              }
              if (exec === true) {
                closePeriodForUser(cellValues.row.id);
              }
            }}
          >
            Close Period
          </Button>
        );
      },
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
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            size="medium"
            color="secondary"
            onClick={() => {
              saveChanges(userList);
            }}
          >
            Save All
          </Button>
          <Button
            variant="contained"
            size="medium"
            color="secondary"
            onClick={() => {
              closePeriod();
            }}
          >
            Close Period
          </Button>
        </Stack>
        <DataGrid
          rows={userList}
          columns={columns}
          onCellEditCommit={(props, event) => {
            for (let i = 0; i < userList.length; i++) {
              if (userList[i].id === props.id) {
                if (props.field === "name") {
                  userList[i].modifiedName = true;
                  userList[i].name = props.value;
                }
                if (props.field === "paid") {
                  userList[i].modifiedPaid = true;
                  userList[i].paid = props.value;
                }
                if (props.field === "email") {
                  userList[i].modifiedEmail = true;
                  userList[i].email = props.value;
                }
                if (props.field === "isActive") {
                  userList[i].modifiedStatus = true;
                  userList[i].isActive = props.value;
                }
                if (props.field === "access") {
                  userList[i].modifiedAccessLevel = true;
                  userList[i].access = props.value;
                }
              }
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default Team;
