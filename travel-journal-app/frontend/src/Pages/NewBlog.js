import { DropzoneArea } from 'material-ui-dropzone';
import { useState } from "react";
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

const API_URL = "http://44.193.194.164:5000/blogs/create";

const NewBlog = (props) => {

    const location = useLocation();
    const userId = location.state.userId;
    const navigate = useNavigate();


    const defaultValues = {
        title: "",
        content: "",
    };

    const [blogValues, setBlogValues] = useState(defaultValues);
    const [image, setImage] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        let formData = new FormData();
        Object.keys(blogValues).map(function (keyName, keyIndex) {
            return (formData.append(keyName, blogValues[keyName]))
        })
        formData.append('userId', userId);

        formData.append('image', image);
        axios.post(API_URL, formData, {
            headers: { 'content-type': 'multipart/form-data' }
        }).then((res) => {
            if (res.data.status) {
                alert("Blog Posted!")
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
            <FormTab>
                <h1>New Blog</h1>
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
                        <Box sx={{ mb: 1, width: '70ch', alignItems: 'center' }}>
                            <DropzoneArea
                                acceptedFiles={['image/*']}
                                filesLimit={1}
                                dropzoneText={"Drag and drop the image here or click"}
                                onChange={(files) => setImage(files[0])}
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

export default NewBlog;