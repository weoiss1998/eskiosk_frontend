import {
  Box,
  useTheme,
  TextField,
  Stack,
  FormControlLabel,
  Switch,
  FormGroup,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Button } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { AuthCheck } from "../../components/authcheck";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { API_URL } from "../../components/apiURL";

async function getDb() {
  var url = new URL("http://fastapi.localhost:8008/createBackup/");
  url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
  url.searchParams.append("token", sessionStorage.getItem("token"));
  const response = await fetch(url, { method: "GET" });
  response.blob().then((blob) => {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "backup.dump.gz");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  });
}

var fileUploaded;

class AdminSettings {
  mail_for_purchases = true;
  confirmation_prompt = true;
  auto_invoice = false;
  set_warning_for_product = -1;
  paypal_link = "";
}

class UserSettings {
  mail_for_purchases = true;
  confirmation_prompt = true;
}

const Settings = (props) => {
  var password = "";
  const navigate = useNavigate();
  const ref = useRef(null);
  var auth = AuthCheck();
  if (auth === false) {
    navigate("/login");
  }
  const [settings, setSettings] = useState({
    mail_for_purchases: true,
    confirmation_prompt: true,
  });
  const [adminSettings, setAdminSettings] = useState({
    mail_for_purchases: true,
    confirmation_prompt: true,
    auto_invoice: false,
    set_warning_for_product: -1,
    paypal_link: "",
  });
  const hiddenFileInput = useRef(null);
  const [file, setFile] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const initialValues = {
    password: "",
  };
  const checkoutSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
  });

  useEffect(() => {
    const fetchData = async () => {
      var check = await AuthCheck();
      if (check === false) {
        navigate("/login");
      }
      try {
        var url = new URL(API_URL + "/getSettings/");
        url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
        url.searchParams.append("token", sessionStorage.getItem("token"));
        const response = await fetch(url, { method: "GET" });
        const userSettings = await response.json();
        if (sessionStorage.getItem("is_admin") === "true") {
          var temp = new AdminSettings();
          temp.mail_for_purchases = userSettings.mail_for_purchases;
          temp.confirmation_prompt = userSettings.confirmation_prompt;
          temp.auto_invoice = userSettings.auto_invoice;
          temp.set_warning_for_product = userSettings.set_warning_for_product;
          temp.paypal_link = userSettings.paypal_link;
          if (
            adminSettings.mail_for_purchases != temp.mail_for_purchases ||
            adminSettings.confirmation_prompt != temp.confirmation_prompt ||
            adminSettings.auto_invoice != temp.auto_invoice ||
            adminSettings.set_warning_for_product !=
              temp.set_warning_for_product ||
            adminSettings.paypal_link != temp.paypal_link
          ) {
            setAdminSettings(temp);
          }
        } else {
          var temp = new UserSettings();
          temp.mail_for_purchases = userSettings.mail_for_purchases;
          temp.confirmation_prompt = userSettings.confirmation_prompt;

          if (
            settings.mail_for_purchases != temp.mail_for_purchases ||
            settings.confirmation_prompt != temp.confirmation_prompt
          ) {
            setSettings(temp);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [settings, adminSettings]);

  async function postDB() {
    const form = new FormData();
    //var name = String(file.name);
    form.append("file", file);

    const response = await fetch(API_URL + "/restoreBackup/", {
      method: "POST",
      /*headers: {
        'accept': 'application/json',
        'Content-Type': 'multipart/form-data'
    },*/
      body: form,
    });
    const obj = await response.json();
    if (response.status === 400) {
      alert(obj.detail);
    }
  }

  async function handleDBCall(event) {
    if (event.target.name === "mail_for_purchases") {
      var url = new URL(API_URL + "/change_mail_for_purchases/");
      url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
      url.searchParams.append("token", sessionStorage.getItem("token"));
      url.searchParams.append("mail_for_purchases", event.target.checked);
      const response = await fetch(url, { method: "PATCH" });
      if (response.status === 200) {
        setAdminSettings({
          ...adminSettings,
          mail_for_purchases: event.target.checked,
        });
      }
    } else if (event.target.name === "confirmation_prompt") {
      var url = new URL(API_URL + "/change_confirmation_prompt/");
      url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
      url.searchParams.append("token", sessionStorage.getItem("token"));
      url.searchParams.append("confirmation_prompt", event.target.checked);
      const response = await fetch(url, { method: "PATCH" });
      if (response.status === 200) {
        setAdminSettings({
          ...adminSettings,
          confirmation_prompt: event.target.checked,
        });
      }
    } else if (event.target.name === "auto_invoice") {
      var url = new URL(API_URL + "/change_auto_invoice/");
      url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
      url.searchParams.append("token", sessionStorage.getItem("token"));
      url.searchParams.append("auto_invoice", event.target.checked);
      const response = await fetch(url, { method: "PATCH" });
      if (response.status === 200) {
        setAdminSettings({
          ...adminSettings,
          auto_invoice: event.target.checked,
        });
      }
    } else if (event.target.id === "set_warning_for_product") {
      var url = new URL(API_URL + "/change_set_warning_for_product/");
      url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
      url.searchParams.append("token", sessionStorage.getItem("token"));
      url.searchParams.append("set_warning_for_product", event.target.value);
      const response = await fetch(url, { method: "PATCH" });
      if (response.status === 200) {
        setAdminSettings({
          ...adminSettings,
          set_warning_for_product: event.target.value,
        });
      }
    } else if (event.target.id === "paypal_link") {
      var url = new URL(API_URL + "/changePayPalLink/");
      url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
      url.searchParams.append("token", sessionStorage.getItem("token"));
      url.searchParams.append("link", event.target.value);
      const response = await fetch(url, { method: "PATCH" });
      if (response.status === 200) {
        setAdminSettings({ ...adminSettings, paypal_link: event.target.value });
      }
    }
  }
  async function handleSwitches(event) {
    if (event.target.name === "mail_for_purchases") {
      var url = new URL(API_URL + "/change_mail_for_purchases/");
      url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
      url.searchParams.append("token", sessionStorage.getItem("token"));
      url.searchParams.append("mail_for_purchases", event.target.checked);
      const response = await fetch(url, { method: "PATCH" });
      if (response.status === 200) {
        setSettings({ ...settings, mail_for_purchases: event.target.checked });
      }
    } else if (event.target.name === "confirmation_prompt") {
      var url = new URL(API_URL + "/change_confirmation_prompt/");
      url.searchParams.append("user_id", sessionStorage.getItem("user_id"));
      url.searchParams.append("token", sessionStorage.getItem("token"));
      url.searchParams.append("confirmation_prompt", event.target.checked);
      const response = await fetch(url, { method: "PATCH" });
      if (response.status === 200) {
        setSettings({ ...settings, confirmation_prompt: event.target.checked });
      }
    }
  }
  const handleSwitchChange = (event) => {
    handleDBCall(event);
  };

  const handleUserSwitchChange = (event) => {
    handleSwitches(event);
  };

  async function updatePassword(values) {
    var url = new URL(API_URL + "/updateNewPassword/");
    if (values === "") {
      alert("Password is empty");
      return;
    }
    if (values.length < 8) {
      alert("Password is too short");
      return;
    }
    if (window.confirm("Do you want to update your password?") === true) {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: sessionStorage.getItem("user_id"),
          token: sessionStorage.getItem("token"),
          password: values,
        }),
      });
      if (response.status === 200) {
        alert("Password updated");
      } else {
        alert("Password not updated");
      }
    }
  }

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

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleTextFieldChange = (event) => {
    password = event.target.value;
  };

  const handleDBUpload = (event) => {
    setFile(event.target.files[0]);
    fileUploaded = event.target.files[0]; // ADDED
    console.log(fileUploaded);
  };

  if (sessionStorage.getItem("is_admin") === "true") {
    return (
      <Box m="20px">
        <Header title="Settings" />
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
            color="secondary"
            onClick={() => {
              getDb();
            }}
          >
            Download Database
          </Button>
          <br />
          <br />
          <Stack direction="row" spacing={1}>
            <Button
              component="label"
              role={undefined}
              onClick={handleClick}
              color="secondary"
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput
                type="file"
                ref={hiddenFileInput}
                onChange={handleDBUpload}
              />
            </Button>
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={() => {
                postDB(fileUploaded);
              }}
            >
              Send to Server
            </Button>
          </Stack>
          <br />
          <br />
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={adminSettings.mail_for_purchases}
                  color="secondary"
                  onChange={handleSwitchChange}
                  name="mail_for_purchases"
                />
              }
              label="A Mail for every purchase"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={adminSettings.confirmation_prompt}
                  color="secondary"
                  onChange={handleSwitchChange}
                  name="confirmation_prompt"
                />
              }
              label="Always show a confirmation when performing an action"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={adminSettings.auto_invoice}
                  color="secondary"
                  onChange={handleSwitchChange}
                  name="auto_invoice"
                />
              }
              label="Create at the start of the month an invoice for all user"
            />
          </FormGroup>
          <TextField
            id="set_warning_for_product"
            label="-1 for Disabling"
            type="number"
            value={adminSettings.set_warning_for_product}
            defaultValue={adminSettings.set_warning_for_product}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              inputProps: {
                max: 100,
                min: -1,
              },
            }}
            onChange={handleSwitchChange}
          />
          Warning that a product has only X on stock <br />
          <br />
          <TextField
            id="paypal_link"
            label="PayPal.me Link"
            type="text"
            value={adminSettings.paypal_link}
            defaultValue={adminSettings.paypal_link}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleSwitchChange}
          />
          <br />
          <br />
          <TextField
            variant="filled"
            type="password"
            label="password"
            onChange={(e) => handleTextFieldChange(e)}
            name="password"
            sx={{ gridColumn: "span 2" }}
          />
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={() => {
              updatePassword(password);
            }}
          >
            Update Password
          </Button>
        </Box>
      </Box>
    );
  } else {
    return (
      <Box m="20px">
        <Header title="Settings" />
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
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.mail_for_purchases}
                  color="secondary"
                  onChange={handleUserSwitchChange}
                  name="mail_for_purchases"
                />
              }
              label="A Mail for every purchase"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.confirmation_prompt}
                  color="secondary"
                  onChange={handleUserSwitchChange}
                  name="confirmation_prompt"
                />
              }
              label="Always show a confirmation when performing an action"
            />
          </FormGroup>
          <br />

          <TextField
            variant="filled"
            type="password"
            label="password"
            onChange={(e) => handleTextFieldChange(e)}
            name="password"
            sx={{ gridColumn: "span 2" }}
          />
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={() => {
              updatePassword(password);
            }}
          >
            Update Password
          </Button>
        </Box>
      </Box>
    );
  }
};

export default Settings;
