import React, { useState, useEffect } from 'react';
import { Card, TextField, Button } from '@material-ui/core';
import "./login.css";
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { User_Info_Method } from '../../Redux/Action/user';

const LoginPage = (props) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    useEffect(() => {
        console.log("userInfo", props.userInfo);
        if (props.userInfo != null) {
            history.push("/home");
        }

    }, [])
    const PostData = () => {
        if (!/[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm.test(email)) {
            alert("invalid email");
        }
        else {
            fetch("http://localhost:5000/signin", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }).then(res => res.json())
                .then(data => {
                    console.log("data", data);
                    if (data.error) {
                        alert(data.error);
                    }
                    else {
                        alert("sign in successfully.");
                        localStorage.setItem("jwt", data.token);
                        localStorage.setItem("userDetail", JSON.stringify(data.user));
                        setEmail("");
                        setPassword("");
                        props.getUserInfo(data.user);
                        history.push("/home");
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
    return (
        <div className="login-container">
            <Card className="login-card">
                <h2>Instagram</h2>
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
                        id="standard-password-input"
                        label="Password"
                        type="password"
                        fullWidth
                        autoComplete="current-password"
                        className="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <Button variant="contained" onClick={() => PostData()} >
                        Login
                </Button>
                </div>
                <div>
                    <Link className="link" to="/signup">Don't have an account ?</Link>
                </div>
            </Card>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.user_info.userExist
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getUserInfo: (data) => { dispatch(User_Info_Method(data)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);