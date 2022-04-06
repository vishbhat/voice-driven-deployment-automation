import { Box } from '@mui/material';
// import './Footer.css'
const Footer = () => {



    return (
        <Box>
                <Box
                    py={2} px={3}
                    fontSize={'1 rem'}
                    fontWeight={'medium'}
                    className='cursor-pointer footer-nav'
                    alignItems='center'
                    bgcolor='primary.main'
                    color={'white'}
                    bottom='0'
                    width= '100%'
                    height= '2rem'
                    paddingTop= '4px'
                    position='static'
                >
                    Group 39 : Dynamo
                </Box>
        </Box>
    );
};

export default Footer;
