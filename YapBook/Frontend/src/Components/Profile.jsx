import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { followUser, getProfile, getFollowers, getFollowing } from "../APIs/indexAPI";
import { YapContext } from "./Context";
import SearchForm from "./SearchForm";
import "../Styles/Profile.css";

const Profile = () => {
  const { id } = useParams(); // get user ID from search parameters to compare against user.id
  const { user, currentUser, isFollowedByUser, fetchCurrentUser, error: contextError } = useContext(YapContext);
  const [person, setPerson] = useState(null);
  const [followersData, setFollowersData] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [people, setPeople] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false); // loading state, otherwise too many changing states and site kept crashing
  const [fetchError, setFetchError] = useState(null);

  const fetchPersonData = async (personId) => {
    setLoading(true); 
    setFetchError(null); 
    try {
      const profile = await getProfile(personId);
      setPerson(profile); 

      //easier to render component and keep states updated if follows/followers are fetched separately
      const fetchedFollowers = await getFollowers(personId);
      const fetchedFollowing = await getFollowing(personId);

      const profilesOfFollowers = fetchedFollowers.followers || [];
      const profilesOfFollowing = fetchedFollowing.following || [];

      setFollowersData(profilesOfFollowers);
      setFollowingData(profilesOfFollowing);

      const followerIds = profilesOfFollowers.map((follow) => follow.id);
      const followingIds = profilesOfFollowing.map((follow) => follow.id);

      setFollowers(followerIds);
      setFollowing(followingIds);
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setLoading(false); 
    }
  };

  // fetch data whenever the user changes
  useEffect(() => {
    if (!user) return;
    setLoading(true)
    fetchCurrentUser();
    fetchPersonData(id);
  }, [id, user]);

  const handleShowFollowers = () => {
    setShowSearchForm(true);
    setTitle("Followers");
    setPeople(followersData);
  };

  const handleShowFollowing = () => {
    setShowSearchForm(true);
    setTitle("Following");
    setPeople(followingData);
  };

  const handleFollow = async () => {
    try {
      setLoading(false);
      await followUser(person.id);
      await fetchCurrentUser();
      await fetchPersonData(person.id);
    } catch (err) {
      console.error("Could not perform this action", err);
    }
  };

  const closeSearchForm = () => {
    setShowSearchForm(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if(!user) {
    return <p>Log in to view personal profiles</p>;
  }

  if (fetchError) {
    return <p className="error-message">{fetchError}</p>; 
  }

  if (!person) {
    return <p>User profile data is not available.</p>;
  }

  return (
    <div className="profile-container">
      <div className="info-section">
        <div className="profile-photo">
          <img src={person.imageUrl} alt={person.username} />
        </div>
        <div className="user-info">
          <div className="user-stats">
            <div className="username-edit">
              <p>{person.username}</p>
              {user.username === person.username && (
                <Link to="/profile/edit" className="edit-profile-link">
                  Edit Profile
                </Link>
              )}
            </div>
            <div className="stats-row">
              <p>{person.posts?.length || 0} Posts</p>
              <a href="#" onClick={handleShowFollowers}>
                {followers.length} Followers
              </a>
              <a href="#" onClick={handleShowFollowing}>
                {following.length} Following
              </a>
            </div>
            <div className="user-bio">{person.bio || "No bio available"}</div>
          </div>
          {currentUser?.username !== person.username && (
            <button onClick={handleFollow}>
              {isFollowedByUser.includes(person.id) ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>
      {contextError && <p className="error-message">{contextError}</p>}
      <div className="posts-section">
        {person.posts?.length > 0 ? (
          person.posts.map((post) => (
            <Link key={post.id} to={`/posts/${post.id}`}>
              <img
                src={post.imageUrl}
                alt={`${person.username}'s post`}
                style={{ cursor: "pointer" }}
              />
            </Link>
          ))
        ) : (
          "No posts yet"
        )}
      </div>
      {showSearchForm && (
        <SearchForm
          title={title}
          people={people}
          closeSearchForm={closeSearchForm}
          followedIds={isFollowedByUser}   // pass on this info to keep track of who the logged in user follows
        />
      )}
    </div>
  );
};

export default Profile;
