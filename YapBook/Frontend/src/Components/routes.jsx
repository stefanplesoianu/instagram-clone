import Home from "./Home.jsx";
import AllPosts from './AllPosts.jsx'
import Post from "./Post.jsx";
import Login from "./Login.jsx";
import Register from './Register.jsx'
import EditProfile from './EditProfile.jsx'
import Profile from './Profile.jsx'
import SearchMenu from "./SearchMenu.jsx";
import CreatePost from "./CreatePost.jsx";

const routes = [
    {
        path: '/',
        element: <Home />,
        children: [
            { index: true, element: <AllPosts />},
            { path: 'posts/:postId', element: <Post />},
            { path: 'login', element: <Login />},
            { path: 'register', element: <Register />},
            { path: 'search', element: <SearchMenu />},
            { path: 'profile/edit', element: <EditProfile />},
            { path: 'profile/:id', element: <Profile />},
            { path: 'create', element: <CreatePost />}
        ]
    }
];

export default routes;