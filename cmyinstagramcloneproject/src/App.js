import React from 'react';
import NavBar from './Components/HomeScreens/NavigationBar/navbar';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './Components/HomeScreens/Home/home';
import ProfilePage from './Components/HomeScreens/Profile/profile';
import LoginPage from './Components/HomeScreens/Login/login';
import SignupPage from './Components/HomeScreens/Signup/signup';
import UserProfilePage from './Components/HomeScreens/UserProfile/userProfile';
import CreatePost from './Components/HomeScreens/CreatePost/createPost';
import MyFollowingPost from './Components/HomeScreens/SubscribePost/SubcribePosts';
import { store, persistedStore } from './Components/Redux/Store/Store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <BrowserRouter>
          <NavBar />
          <Route exact path="/" component={LoginPage} />
          <Route  path="/home" component={Home} />
          <Route path="/signup" component={SignupPage} />
          <Route exact path="/profile" component={ProfilePage} />
          <Route path="/createPost" component={CreatePost} />
          <Route path="/profile/:userId" component={UserProfilePage} />
          <Route path="/myfollowingposts" component={MyFollowingPost} />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
