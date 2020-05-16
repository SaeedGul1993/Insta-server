import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { NavLink, useHistory } from 'react-router-dom';
import './navbar.css';
import { connect } from 'react-redux';
import { User_Info_Method } from '../../Redux/Action/user';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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

  console.log('userInfo in nav', props.userInfo);

  const history = useHistory();

  const onLogout = () => {
    localStorage.clear();
    props.getUserInfo(null);
    history.push("/");
  }

  const renderList = () => {
    if (props.userInfo != null) {
      return [
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

  return (
    <div className={classes.root}>
      <AppBar className="app-bar" position="fixed">
        <Toolbar>
          <NavLink to={props.userInfo != null ? "/home" : "/login"} exact activeClassName="active-component">
            <Typography variant="h6" className={classes.title}>
              Instagram
          </Typography>
          </NavLink>
          <div className="nav-sub-item-container">
            {renderList()}
          </div>
        </Toolbar>
      </AppBar>
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