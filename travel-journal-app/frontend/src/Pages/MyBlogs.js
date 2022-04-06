import { useEffect, useState } from 'react';
import { Card, CardMedia, Button, Typography, CardContent, CardActions, Grid, Modal, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios"

const API_URL = "http://44.193.194.164:5000";

const MyBlogs = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state.userId;

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

    const [myBlogs, setMyBlogs] = useState({})

    useEffect(() => {
        axios.get(`${API_URL}/blogs/${userId}`)
            .then(response => {
                setMyBlogs(response.data)
            }).catch(err => {
                setMyBlogs({})
                console.log(err?.response?.data?.message || "Something went wrong")
            })
    }, [userId])

    const [active, setActive] = useState({});
    const [open, setOpen] = useState(false);
    const handleClick = (blog) => {
        setActive(blog)
        setOpen(true)
    }
    const handleClose = () => setOpen(false);

    const handleUpdate = (blogId) => {
        navigate('/editBlog', { state: { userId: userId, blogId: blogId } })
    }

    const handleDelete = (blogId) => {
        axios.delete(`${API_URL}/blogs/${userId}/${blogId}`)
            .then(response => {
                if (response.data.status) {
                    window.location.reload(false);
                }
            }).catch(err => {
                console.log(err?.response?.data?.message || "Something went wrong")
            })
    }

    return (
        <Box style={{ marginTop: 2, marginLeft: 10, height: '88.5vh' }}>

            <div>
                <h1>My Blogs</h1>
                <div style={{ textAlign: "right", paddingRight: "3%" }}>
                    <Grid container justifyContent="flex-end">
                        <Button variant="contained" onClick={() => { navigate("/blogs", { state: { userId: userId } }) }}>View all blog</Button>
                        <Button variant="contained" sx={{ml:1}} onClick={() => { navigate("/newBlog", { state: { userId: userId } }) }}>Add new blog</Button>
                    </Grid>
                </div>
                <Grid container spacing={2} sx={{ mt: 2, mb: 2, ml: 2 }}>
                    {myBlogs ? myBlogs.length > 0 ? myBlogs.map(blog => {
                        return (
                            <Grid item xs={3}>
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
                                    </CardContent>
                                    <CardActions>
                                        <Button onClick={() => { handleUpdate(blog.blogId) }}>Edit</Button>
                                        <Button onClick={() => { handleDelete(blog.blogId) }}>Delete</Button>
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
                                height="100px"
                            />
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                {active.content}
                            </Typography>
                        </Box>
                    </Modal>
                </div>
            </div>

        </Box>
    );
}

export default MyBlogs;