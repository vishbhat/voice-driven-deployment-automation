import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import Footer from "./Footer";

const Header = () => {

    const navigate = useNavigate();

    return (
        <Box sx={{ height: '100%' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                    Travel Journal
                    </Typography>
                    <Button color="inherit" onClick={()=>{navigate("/login")}}> <LogoutIcon /></Button>
                </Toolbar>
            </AppBar>
           
                <Outlet />
            
            <Box>
                <Footer />
            </Box>
        </Box>
    );
};

export default Header;
