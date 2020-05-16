import React, { useState, useEffect } from 'react';
import './SubscribePost.css';
import { Card, TextField } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { connect } from 'react-redux';
import { User_Info_Method } from '../../Redux/Action/user';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';

const MyFollowingPost = (props) => {
    const [data, setData] = useState([]);
    const [comment, setComment] = useState("");
    useEffect(() => {
        console.log(props.userInfo);
        fetch("http://localhost:5000/getsubpost", {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result.posts);
                setData(result.posts);
            })
            .catch(err => {
                console.log(err);

            })
    }, [])

    const deletePost = (postId) => {
        fetch(`http://localhost:5000/deletepost/${postId}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                const newData = data.filter(item => {
                    return item._id != result._id;
                })
                setData(newData);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const deleteComment = (id1, id2, text) => {

        console.log("postId", id1);
        console.log("commentId", id2);
        fetch("http://localhost:5000/deletecomment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id1,
                commentId: id2,
                text
            })
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result;
                    }
                    else {
                        return item;
                    }
                })
                setData(newData);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const likePost = (id) => {
        fetch("http://localhost:5000/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result;
                    }
                    else {
                        return item;
                    }
                })
                setData(newData);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const unlikePost = (id) => {
        fetch("http://localhost:5000/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result;
                    }
                    else {
                        return item;
                    }
                })
                setData(newData);

            })
            .catch(err => {
                console.log(err);
            })
    }

    const makeComment = (text, id) => {
        fetch("http://localhost:5000/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id,
                text
            })
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result;
                    }
                    else {
                        return item;
                    }
                })
                setData(newData);
                setComment("");
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div className="home-container">
            {data.map((item, index) => {
                return (
                    <Card key={index} className="home-card">
                        <div style={{ display: "flex", justifyContent: 'space-between' }}>
                            <h2><Link to={item.postedBy._id !== props.userInfo._id ? `/profile/${item.postedBy._id}`:'/profile'}>{item.postedBy.name}</Link></h2> {item.postedBy._id === props.userInfo._id && <DeleteIcon onClick={() => deletePost(item._id)} className="delete-btn" />}
                        </div>
                        <div className="home-image">
                            <img alt="loading image" width="100%" src={`${item.pic}`} />
                        </div>
                        <div className="post-area">
                            <div style={{ display: 'flex', justifyContent: 'felx-start' }}>

                                <FavoriteIcon style={{ marginRight: '5px' }} />

                                {item.likes.includes(props.userInfo._id)
                                    ? <ThumbDownAltIcon
                                        style={{ cursor: 'pointer', color: "red" }}
                                        onClick={() => unlikePost(item._id)}
                                    />
                                    :
                                    <ThumbUpIcon style={{ marginRight: '5px', cursor: 'pointer', color: '#1976d2' }}
                                        onClick={() => likePost(item._id)}
                                    />
                                }
                            </div>
                            <p> {item.likes.length} Likes</p>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            <h2>Comments</h2>
                            {
                                item.comments.map(comment => {
                                    return <div key={comment._id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <p ><span className="comment-name">{comment.postedBy.name}</span> : {comment.text}</p>
                                        {comment.postedBy._id === props.userInfo._id && <DeleteIcon onClick={() => deleteComment(item._id, comment._id, comment.text)} className="delete-btn" />}
                                    </div>
                                })
                            }
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                makeComment(e.target[0].value, item._id);
                            }}>
                                <TextField
                                    label="Add a comment"
                                    type="text"
                                    className="coment-input"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </form>
                        </div>
                    </Card>
                )
            })}

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
        getUserInfo: (data) => { dispatch(User_Info_Method()) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MyFollowingPost);