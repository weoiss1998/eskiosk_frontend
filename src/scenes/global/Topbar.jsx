import { Box, IconButton, useTheme, Badge } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { API_URL } from "../../components/apiURL";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Topbar = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const logOut = () => {  
    sendLogout();
    sessionStorage.clear();
    navigate("/login")
  }

  async function sendLogout() {
    var url = new URL(API_URL+"/logout/");
    url.searchParams.append('user_id', sessionStorage.getItem("user_id"));
    url.searchParams.append('token', sessionStorage.getItem("token"));
    await fetch(url, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={() => navigate("/settings")}>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onClick={() => navigate("/buyHistory")}>
          <PersonOutlinedIcon />
        </IconButton>
        <IconButton onClick={() => navigate("/cart")}>
        <Badge badgeContent={props.cartAmount} color="secondary">
          <ShoppingCartIcon />
        </Badge>
        </IconButton>
        <IconButton onClick={logOut}>
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
