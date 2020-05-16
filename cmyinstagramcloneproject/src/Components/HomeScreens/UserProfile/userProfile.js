import React, { useState, useEffect } from 'react';
import './userProfile.css';
import { connect } from 'react-redux';
import { User_Info_Method } from '../../Redux/Action/user';
import { useParams } from 'react-router-dom';
import { Button } from '@material-ui/core';

const UserProfilePage = (props) => {
    const { userId } = useParams();
    console.log("userId", userId);
    const [myPosts, setMyPosts] = useState([]);
    const [myFollow, setMyFollow] = useState(props.userInfo ? props.userInfo.following.includes(userId) : true);
    const [myUser, setUser] = useState([]);

    useEffect(() => {
        fetch(`/user/${userId}`, {
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                console.log(result.user);
                console.log("typeOf", result.user.followers);
                setUser(result.user);
                setMyPosts(result.post);
            })
            .catch(err => {
                console.log(err);

            })
    }, [])

    const UserFollow = () => {
        fetch("/follow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userId
            })
        }).then(res => res.json())
            .then(data => {
                console.log("data", data);
                props.getUserInfo(data);
                setUser((prevState) => {
                    console.log("prevState", prevState);
                    return {
                        name: prevState.name,
                        email: prevState.email,
                        pic: prevState.pic,
                        following: prevState.following,
                        followers: [...prevState.followers, data._id]
                    }
                })
                setMyFollow(true)
            })
            .catch(err => {
                console.log(err);
            })
    }
    const UserUnFollow = () => {
        fetch("/unfollow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userId
            })
        }).then(res => res.json())
            .then(data => {
                console.log("data", data);
                props.getUserInfo(data);
                setUser((prevState) => {
                    console.log("prevState", prevState);
                    const newFollowers = prevState.followers.filter(item => item != data._id);
                    return {
                        email: prevState.email,
                        pic: prevState.pic,
                        following: prevState.following,
                        followers: newFollowers
                    }
                })
                setMyFollow(false);
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div className="main-container">
            <div className="profile-container">
                <div>
                    <img className="avatar-style" src={myUser.pic} />
                </div>
                <div>
                    <h1 className="profile-name">{myUser.name}</h1>
                    <h3>{myUser.email}</h3>
                    <div className="user-activity">
                        <h4>{myPosts.length} Posts</h4>
                        <h4>{myUser.followers ? myUser.followers.length : 0} Followers</h4>
                        <h4>{myUser.following ? myUser.following.length : 0} Followings</h4>
                    </div>
                    {
                        myFollow ? <Button color="secondary" variant="contained" onClick={() => UserUnFollow()}>UnFollow</Button>
                            : <Button color="primary" variant="contained" onClick={() => UserFollow()}>Follow</Button>
                    }

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
        getUserInfo: (data) => { dispatch(User_Info_Method(data)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(UserProfilePage);