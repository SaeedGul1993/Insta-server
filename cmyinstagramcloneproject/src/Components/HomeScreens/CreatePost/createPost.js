import React, { useState, useEffect } from 'react';
import './createPost.css';
import { Card, TextField, Button } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Upload, message } from 'antd';
import { Link, useHistory } from 'react-router-dom';


const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const history = useHistory();

    useEffect(() => {
        if (url) {

            console.log("url", url);
            fetch("http://localhost:5000/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    pic: url
                })
            }).then(res => res.json())
                .then(data => {
                    console.log("data", data);
                    if (data.error) {
                        alert(data.error);
                    }
                    else {
                        alert("create post successfully.");
                        setTitle("");
                        setBody("");
                        setImage("")
                        history.push("/");
                    }
                })
                .catch(err => {
                    console.log(err);
                })

        }
    }, [url])

    const PostData = () => {

        const data = new FormData();
        data.append("file", image)
        data.append("upload_preset", "instaClone")
        data.append("cloud_name", "azaan")
        fetch("https:api.cloudinary.com/v1_1/azaan/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.url);
                setUrl(data.url)
            })
            .catch(err => {
                console.log(err);

            })
    }

    const handleFile = (e) => {

        setImage(e.target.files[0]);
    }

    return (
        <div className="create-post-container">
            <Card className="create-post-card">
                <div>
                    <TextField
                        label="Title"
                        type="text"
                        fullWidth
                        className="create-post-field"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <TextField
                        label="Body"
                        type="text"
                        fullWidth
                        className="create-post-field"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                </div>
                <div className="create-post-upload-btn">
                    <TextField
                        label="Body"
                        type="file"
                        fullWidth
                        className="create-post-field"
                        onChange={handleFile}
                    />
                </div>
                <div className="create-post-btn">
                    <Button variant="contained" onClick={() => PostData()} >
                        Submit Post
                </Button>
                </div>
            </Card>
        </div>
    )
}

export default CreatePost;