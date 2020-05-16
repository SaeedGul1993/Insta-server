import React, { useState, useEffect } from 'react';
import { Card, TextField, Button } from '@material-ui/core';
import "./signup.css";
import { Link, useHistory } from 'react-router-dom';

const SignupPage = () => {
    const history = useHistory();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState(undefined);

    useEffect(()=>{
        if(url){
            uploadFields();
        }
    },[url])

    const uploadImage = (e) => {

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

    const uploadFields = () => {
        if (!/[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm.test(email)) {
            alert("invalid email");
        }
        else {
            fetch("http://localhost:5000/signup", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    pic: url
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        alert(data.error);
                    }
                    else {
                        alert(data.message);
                        setName("");
                        setEmail("");
                        setPassword("");
                        history.push("/");
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    const PostData = () => {
        if (image) {
            uploadImage();
        }
        else {
            uploadFields();
        }
    }
    return (
        <div className="signup-container">
            <Card className="signup-card">
                <h2>Instagram</h2>
                <div>
                    <TextField
                        label="Name"
                        type="text"
                        fullWidth
                        className="input-field"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <TextField
                        label="Email@gmail.com"
                        type="text"
                        fullWidth
                        className="input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        autoComplete="current-password"
                        className="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="create-post-upload-btn">
                    <TextField
                        label="Upload Profile"
                        type="file"
                        fullWidth
                        className="create-post-field"
                        onChange={(e) =>setImage(e.target.files[0])}
                    />
                </div>
                <div>
                    <Button variant="contained" onClick={() => PostData()} >
                        SignUp
                </Button>
                </div>
                <div>
                    <Link className="link" to="/">Already have an account ?</Link>
                </div>
            </Card>
        </div>
    )
}

export default SignupPage;