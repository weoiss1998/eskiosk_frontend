import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../components/apiURL";

const defaultTheme = createTheme();

export default function SignIn(props) {
  var name = "";
  var open_balance = 0;
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    checkAccountExists(data.get("email"), data.get("password"));
  };
  async function checkAccountExists(email, password) {
    const response = await fetch(API_URL + "/check-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
    const obj = await response.json();
    if (obj.is_active === true) {
      name = obj.name;
      open_balance = obj.open_balances;
      logIn(email, password);
    } else {
      if (
        window.confirm(
          "An account does not exist with this email address: " +
            email +
            ". Do you want to create a new account?"
        )
      ) {
        navigate("/register");
      } else {
        navigate("/");
      }
    }
  }
  async function logIn(email, password) {
    const response = await fetch(API_URL + "/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, hash_pw: password }),
    });
    const obj = await response.json();
    if ("success" === obj.message) {
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("name", name);
      sessionStorage.setItem("user_id", obj.user_id);
      sessionStorage.setItem("is_admin", obj.is_admin);
      sessionStorage.setItem("token", obj.token);
      sessionStorage.setItem("open_balance", open_balance);
      props.setOpenBalance(open_balance);
      getSettings(obj.user_id, obj.token);
      navigate("/shop");
    } else {
      window.alert("Wrong email or password");
    }
  }

  async function getSettings(user_id, token) {
    var url = new URL(API_URL + "/getSettings/");
    url.searchParams.append("user_id", user_id);
    url.searchParams.append("token", token);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const obj = await response.json();
    if (response.status === 200) {
      sessionStorage.setItem("confirmation_prompt", obj.confirmation_prompt);
      navigate("/shop");
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forgotPassword" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
