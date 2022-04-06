import { DropzoneArea } from 'material-ui-dropzone';
import { useEffect, useState } from "react";
import { styled } from '@mui/system'
import { Box, TextField, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";


const FormTab = styled('div')(({ theme }) => ({
    margin: "10px",
    padding: theme.spacing(1),
    boxShadow: "0 0 10px -1px",
    borderRadius: "10px",
    border: "1px solid lightgray",
    overflow: "auto"
}))

const API_URL = "http://44.193.194.164:5000/blogs";

const EditBlog = (props) => {

    const location = useLocation();
    const userId = location.state.userId;
    const blogId = location.state.blogId;
    const navigate = useNavigate();


    const defaultValues = {
        title: "",
        content: "",
    };

    const [blogValues, setBlogValues] = useState(defaultValues);

    useEffect(() => {
        axios.get(`${API_URL}/${userId}/${blogId}`)
            .then(response => {
                setBlogValues(response.data[0])
            }).catch(err => {
                setBlogValues({})
                console.log(err?.response?.data?.message || "Something went wrong")
            })
    }, [userId])


    const handleSubmit = (event) => {
        event.preventDefault();

        blogValues['userId'] = userId
        blogValues['blogId'] = blogId

        axios.post(`${API_URL}/update`, blogValues).then((res) => {
            if (res.data.status) {
                alert("Blog Updated!")
                navigate("/myBlogs", { state: { userId: userId }})
            } else {
                console.log(res?.data?.message || "Cannot create blog")
            }
        })
            .catch((err) => {
                console.log(err?.response?.data?.message || "Cannot create blog")
            });
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setBlogValues(prevState => ({
            ...prevState,
            [id]: value
        }))
    }


    return (
        <>
            <FormTab sx={{ height: '86vh', width: '100%'}}>
                <h1>Edit Blog</h1>
                <form onSubmit={handleSubmit} >
                    <Box sx={{ display: 'flex', flexDirection: 'column', m: 1, alignItems: 'center' }}>
                        <Box sx={{ alignItems: "center" }}>
                            <TextField
                                fullWidth
                                required
                                label="Title"
                                id="title"
                                type="text"
                                sx={{ mb: 1, width: '70ch' }}
                                value={blogValues.title}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                required
                                label="Content"
                                id="content"
                                type="text"
                                multiline
                                rows={10}
                                rowsmax={10}
                                sx={{ mb: 1, width: '70ch' }}
                                value={blogValues.content}
                                onChange={handleInputChange}
                            />
                        </Box>

                        <Button
                            variant="contained"
                            sx={{ m: 1, width: "25ch" }}
                            type="submit"
                        >
                            Submit
                        </Button>
                    </Box>
                </form>
            </FormTab>
        </>
    );
}

export default EditBlog;