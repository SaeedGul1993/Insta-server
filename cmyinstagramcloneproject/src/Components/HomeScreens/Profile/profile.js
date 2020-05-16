import React, { useState, useEffect } from 'react';
import './profile.css';
import { connect } from 'react-redux';
import { User_Info_Method, User_Update_Method } from '../../Redux/Action/user';
import Input from '@material-ui/core/Input';


const PrfilePage = (props) => {
    const [myPosts, setMyPosts] = useState([]);
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");

    useEffect(() => {
        console.log("userInfo", typeof (props.userInfo))
        fetch("http://localhost:5000/myposts", {
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                setMyPosts(result.mypost)
            })
            .catch(err => {
                console.log(err);

            })
        console.log("props", props.userInfo);
    }, [])

    useEffect(() => {
        if (image) {
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
                    const user = {
                        _id: props.userInfo._id,
                        name: props.userInfo.name,
                        email: props.userInfo.email,
                        followers: props.userInfo.followers,
                        following: props.userInfo.following,
                        pic: data.url
                    }
                    props.getUserUpdates(user);
                })
                .catch(err => {
                    console.log(err);

                })
        }
    }, [image])
    useEffect(() => {
        if (url) {
            console.log("url",url);
            fetch("http://localhost:5000/updatepic", {
                method: "put",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    pic: url
                })
            })
                .then(res => res.json())
                .then(result => {
                    console.log(result);
                    alert("profile update successfully");
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [url])
    const updateProfile = (file) => {
        setImage(file);
    }

    return (
        <div className="main-container">
            <div className="profile-container">
                <div>
                    <img className="avatar-style" src={props.userInfo.pic} />
                    <div>
                        <span className="update-heading">Update Pic</span>  <Input type="file" placeholder="update pic" inputProps={{ 'aria-label': 'description' }} onChange={(e) => updateProfile(e.target.files[0])} />
                    </div>
                </div>
                <div>
                    <h1 className="profile-name">{props.userInfo.name}</h1>
                    <h3 >{props.userInfo.email}</h3>
                    <div className="user-activity">
                        <h4>{myPosts.length} Posts</h4>
                        <h4>{props.userInfo.followers.length} Followers</h4>
                        <h4>{props.userInfo.following.length} Followings</h4>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {myPosts.map((post) => {
                    return <img key={post.id} className="items" alt={post.title} src={post.pic} />
                })}
            </div>
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
        getUserInfo: (data) => { dispatch(User_Info_Method(data)) },
        getUserUpdates: (data) => { dispatch(User_Update_Method(data)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PrfilePage);