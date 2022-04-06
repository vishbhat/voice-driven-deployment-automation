import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Card, CardMedia, Button, Typography, CardContent, CardActions, Grid, Modal, Box } from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

function Blogs(props) {
  const location = useLocation();
  const userId = location.state.userId;
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  function toMyBlogs() {
    navigate("/myBlogs", { state: { userId: userId } });
  }

  useEffect(() => {
    const API_URL = `http://44.193.194.164:5000/blogs`;
    axios({
      method: "get",
      url: API_URL,
    }).then(function (response) {
      if (response.status === 200) {
        setBlogs(response.data);
      }
    });
    const API_URL_USERS = `http://44.193.194.164:5000/users`;
    axios({
      method: "get",
      url: API_URL_USERS,
    }).then(function (res) {
      if (res.status === 200) {
        setUsers(res.data);
      }
    });
  }, []);

  const [active, setActive] = useState({});
  const [open, setOpen] = useState(false);
  const handleClick = (blog) => {
      setActive(blog)
      setOpen(true)
  }
  const handleClose = () => setOpen(false);

  const handleLike = (blog) => {
    const API_URL = `http://44.193.194.164:5000/blogs/like/${blog.userId}/${blog.blogId}`;
    axios({
      method: "get",
      url: API_URL,
    }).then(function (res) {
      if (res.status === 200) {
        window.location.reload(false);
      }else{
        console.log("Could not like the blog!")
      }
    });
  }

  return (
    <Box sx={{ height: '88.5vh', width: '100%'}}>
      <h1>User Blogs</h1>
      <div style={{ textAlign: "right", paddingRight: "3%" }}>
        <Button variant="contained" onClick={toMyBlogs}>
          My Blogs
        </Button>
        
      </div>
      <Grid container spacing={2} sx={{mt: 2, mb: 2, ml:1, mr:1}}>
      {blogs ? blogs.length > 0 ? blogs.map(blog => {
        return (
          <Grid item xs={3} key={blog.blogId}>
          <Card sx={{ maxWidth: 345 }} >
          <CardMedia
            component="img"
            height="140"
            image={`https://travel-journal-images.s3.amazonaws.com/${blog.blogId}/${blog.image}`}
            alt="blog image"
            onClick={() => handleClick(blog)}
          />
          <CardContent onClick={() => handleClick(blog)}>
            <Typography gutterBottom variant="h5" component="div">
              {blog.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {users ? users.length > 0 ? users.map(user => {
                if (user.userId === blog.userId){
                  return(user.firstname + " " + user.lastname)
                }
              }):"No results found." : "Fetching blogs."}
            </Typography>
          </CardContent>
          <CardActions>
           <Button onClick={()=>{handleLike(blog)}}><ThumbUpIcon /></Button> 
           <Typography variant="body1">{blog.likeCount}</Typography>
          </CardActions>
        </Card>
        </Grid>
        );
      }) : "No results found." : "Fetching events."}
     </Grid>
     <div>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {active.title}
          </Typography>
          <img
              src={`https://travel-journal-images.s3.amazonaws.com/${active.blogId}/${active.image}`}
              alt="blog"
              height = "100px"
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {active.content}
          </Typography>
        </Box>
      </Modal>
    </div>
    </Box>
  );
}

export default Blogs;
