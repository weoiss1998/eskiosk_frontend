import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Team from "./scenes/team";
import Form from "./scenes/form";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Cart from "./scenes/cart";
import Shop from "./scenes/shop";
import FormProduct from "./scenes/formProduct";
import Products from "./scenes/products";
import BuyHistory from "./scenes/buyHistory";
import AdminBuyHistory from "./scenes/adminBuyHistory";
import { useLocation, Navigate } from "react-router-dom";
import Settings from "./scenes/settings";
import SignIn from "./loginProcedures/newLogin";
import SignUp from "./loginProcedures/newRegister";
import NewVerifyMail from "./loginProcedures/newVerifyMail";
import NewChangePassword from "./loginProcedures/newChangePassword";
import NewForgotPassword from "./loginProcedures/newForgotPassword";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const [cartAmount, setCartAmount] = useState(0);
  const excludedRoutes = [
    "/login",
    "/register",
    "/verifyMail",
    "/forgotPassword",
    "/changePassword",
  ];

  if (sessionStorage.getItem("cart") != null) {
    let items = new Map(JSON.parse(sessionStorage.getItem("cart")));
    var temp = 0;
    items.forEach(function (value, key) {
      temp += parseInt(value);
    });
    if (temp !== cartAmount) setCartAmount(temp);
  }

  // Function to check if the current location matches certain paths

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!excludedRoutes.includes(location.pathname) && (
            <Sidebar isSidebar={isSidebar} cartAmount={cartAmount} />
          )}
          <main className="content">
            {!excludedRoutes.includes(location.pathname) && (
              <Topbar setIsSidebar={setIsSidebar} cartAmount={cartAmount} />
            )}
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/team" element={<Team />} />
              <Route path="/form" element={<Form />} />
              <Route
                path="/shop"
                element={
                  <Shop setCartAmount={setCartAmount} cartAmount={cartAmount} />
                }
              />
              <Route
                path="/cart"
                element={
                  <Cart setCartAmount={setCartAmount} cartAmount={cartAmount} />
                }
              />
              <Route path="/formProduct" element={<FormProduct />} />
              <Route path="/products" element={<Products />} />
              <Route path="/buyHistory" element={<BuyHistory />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="adminBuyHistory" element={<AdminBuyHistory />} />
              <Route path="/Register" element={<SignUp />} />
              <Route path="/verifyMail" element={<NewVerifyMail />} />
              <Route path="/ForgotPassword" element={<NewForgotPassword />} />
              <Route path="/ChangePassword" element={<NewChangePassword />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
