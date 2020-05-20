import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { SearchSharp } from '@material-ui/icons'
import { NavLink, useHistory } from 'react-router-dom';
import './navbar.css';
import { connect } from 'react-redux';
import { User_Info_Method } from '../../Redux/Action/user';
import Modal from '@material-ui/core/Modal';
import { TextField } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  modal: {
    display: 'flex',
    justifyContent: 'center',
  },
  paper: {
    position: 'absolute',
    width: 500,
    height: 500,
    border: '2px solid white',
    margin: "50px auto",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontFamily: "'Grand Hotel', cursive",
    fontSize: "40px"
  },
  btn: {
    fontFamily: "'Bree Serif', serif",
    textTransform: "Capitalize",
    fontSize: '17px'
  }
}));

function NavBar(props) {

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openModalMethod, setOpenModalMethod] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [search_user, setSearchUser] = React.useState('');
  const [search_user_array, setSearchUserArray] = React.useState([]);

  const handleOpen = () => {
    setOpen(true);
    setOpenModalMethod(true)
  };

  const handleClose = () => {
    setOpen(false);
    setOpenModalMethod(false);
  };


  // console.log('userInfo in nav', props.userInfo);

  const history = useHistory();

  const onLogout = () => {
    localStorage.clear();
    props.getUserInfo(null);
    history.push("/");
  }

  const renderList = () => {
    if (props.userInfo != null) {
      return [
        <Button onClick={() => handleOpen()}> <SearchSharp className="search-icon" /> </Button>,
        <NavLink to="/profile" exact activeClassName="active-component">
          <Button className={classes.btn} color="inherit">Profile</Button>
        </NavLink>,
        <NavLink to="/createpost" exact activeClassName="active-component">
          <Button className={classes.btn} color="inherit">CreatePost</Button>
        </NavLink>,
        <NavLink to="/myfollowingposts" exact activeClassName="active-component">
          <Button className={classes.btn} color="inherit">Following</Button>
        </NavLink>,
        <Button color="secondary" variant="contained" onClick={onLogout}>
          Logout
        </Button>
      ]
    }
    else {
      return [
        <NavLink to="/" exact activeClassName="active-component">
          <Button className={classes.btn} color="inherit">Signin</Button>
        </NavLink>,
        <NavLink to="/signup" exact activeClassName="active-component">
          <Button className={classes.btn} color="inherit">Signup</Button>
        </NavLink>
      ]
    }
  }
  useEffect(() => {
    if (search_user != "") {
      setLoading(true);
      fetch("http://localhost:5000/search-user", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        }
        , body: JSON.stringify({
          query: search_user
        })
      }).then(res => res.json())
        .then(res => {
          console.log("res", res.user);
          setSearchUserArray(res.user);
          setLoading(false);
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [search_user])

  // useEffect(() => {
  //     if(!search_user_array.length){
  //       setSearchUserArray([]);
  //     }
  // },[search_user_array])



  const searchMethod = (value) => {
    setSearchUser(value);
    console.log("value", value.length);
    if (value.length == 0) {
      setSearchUserArray([]);
    }
  }
  const searchModal = () => {
    return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div id="transition-modal-title">
              <TextField
                label="search user..."
                type="text"
                className="input-search"
                value={search_user}
                onChange={(e) => searchMethod(e.target.value)}
              />
            </div>
            <div className="list-user-container">
              <ul>
                {loading ? <h3 style={{ textAlign: 'center' }}>Loading....</h3> :
                  search_user_array.length ? search_user_array.map((user) => {
                    return <NavLink exact to={user._id == props.userInfo._id ? `/profile` : `/profile/${user._id}`}><li key={user._id} id="transition-modal-description">{user.email}</li></NavLink>
                  }) : <p style={{ textAlign: 'center' }}> no data found</p>}
              </ul>
            </div>
          </div>
        </Fade>
      </Modal >

    )
  }
  return (
    <div className={classes.root}>
      <AppBar className="app-bar" position="fixed">
        <Toolbar>
          <NavLink to={props.userInfo != null ? "/home" : "/login"} exact activeClassName="active-component">
            <Typography variant="h6" className="titleOfInstagram">
              Instagram
          </Typography>
          </NavLink>
          <div className={props.userInfo !=null ? "nav-sub-item-container" :"nav-sub-item-container1"}>
            {renderList()}
          </div>
        </Toolbar>
      </AppBar>
      {openModalMethod ? searchModal() : false}
    </div>
  );
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
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);