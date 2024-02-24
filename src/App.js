import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Cart from "./scenes/cart";
import Shop from "./scenes/shop";
import FullFeaturedCrudGrid from "./scenes/test";
import FormProduct from "./scenes/formProduct";
import Products from "./scenes/products";
import BuyHistory from "./scenes/buyHistory";
import Login from "./loginProcedures/login";
import Register from "./loginProcedures/register";
import VerifyMail from "./loginProcedures/VerifyMail";
import ForgotPassword from "./loginProcedures/forgotPassword";
import ChangePassword from "./loginProcedures/changePassword";
import AdminBuyHistory from "./scenes/adminBuyHistory";
import { useLocation, Navigate } from 'react-router-dom';


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const excludedRoutes = ['/login', '/Register', '/Verifymail', '/ForgotPassword', '/ChangePassword'];

  // Function to check if the current location matches certain paths

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
        {!excludedRoutes.includes(location.pathname)  && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
          {!excludedRoutes.includes(location.pathname)  && <Topbar setIsSidebar={setIsSidebar} />}
              <Routes>
              <Route path="/" element={<Navigate to ="/login" />}/>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/test" element={<FullFeaturedCrudGrid />} />
              <Route path="/formProduct" element={<FormProduct />} />
              <Route path="/products" element={<Products />} />
              <Route path="/buyHistory" element={<BuyHistory />} />
              <Route path="/login" element={<Login  />} />
              <Route path="adminBuyHistory" element={<AdminBuyHistory/>}/>
              <Route path="/Register" element={<Register  />} />
              <Route path="/Verifymail" element={<VerifyMail  />} />
              <Route path="/ForgotPassword" element={<ForgotPassword />} />
              <Route path="/ChangePassword" element={<ChangePassword />} />
              </Routes>
            </main>       

        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
