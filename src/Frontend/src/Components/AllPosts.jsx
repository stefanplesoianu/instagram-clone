import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { YapContext } from './Context';
import { FaHeart, FaComment, FaShare } from 'react-icons/fa';
import { getUserPosts, getGuestPosts, likePost, sharePost, getProfile } from '../APIs/indexAPI';
import '../Styles/AllPosts.css';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [error, setError] = useState('');
  const { user, guestId, defaultProfileImage } = useContext(YapContext);
  const navigate = useNavigate();

  // useEffect for fetching posts and user suggestions
  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      try {
        const isUser = Boolean(user);
        let info, response;

        if (user) {
          info = await getProfile(user.id);

          //getting an array with the id's of the user's follows to exclude them from friend suggestions
          const idsToSend = info.following.reduce((acc, curr) => {
            acc.push(curr.userId, curr.followerId);
            return acc;
          }, [user.id]);
          const uniqueIds = [...new Set(idsToSend)];
          response = await getUserPosts(uniqueIds);
        } else {
          response = await getGuestPosts(); 
        }

        //unpacking and splitting posts from users from shared posts
        const { posts = [], sharedPosts = [], users = [] } = response;

        //adding props to sharedPosts as a workaround for React not understanding original props
        const combinedPosts = [
          ...posts.map((post) => ({
            ...post,
            type: "post",
            createdAt: post.createdAt,
            author: {
              id: post.author?.id,
              username: post.author?.username,
              imageUrl: post.author.imageUrl || defaultProfileImage,
            },
          })),
          ...sharedPosts.map((sharedPost) => ({
            ...sharedPost,
            type: "shared",
            createdAt: sharedPost.createdAt,
            author: {
              id: sharedPost.post?.author?.id,
              username: sharedPost.post?.author?.username,
              imageUrl: sharedPost.post?.author?.imageUrl,
            },
            content: sharedPost.post?.content,
            sharedBy: {
              id: sharedPost.user?.id,
              username: sharedPost.user?.username,
            },
            imageUrl: sharedPost.post?.imageUrl,
            sharedPostId: sharedPost.postId, // original post id to pass their params to the Post component
            uniqueKey: `shared-${sharedPost.post?.id}`, // unique key to avoid duplicate keys
          })),
        ];

        setPosts(combinedPosts);

        if (isUser) {
          setUserSuggestions(users);
        }
      } catch (error) {
        console.error('Could not retrieve posts or users', error);
        setError('Could not retrieve posts or users');
      }
    };

    fetchPostsAndUsers();
  }, [user, guestId]);

  // sorting all shared and original posts by their create date
  const sortedPosts = useMemo(
    () => posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [posts]
  );

  // optimistic updates to the state
  const handleLike = async (postId) => {
    try {
      if (user) {
        const post = posts.find(p => p.id === postId);
        const hasLiked = post.likes?.some(like => like.userId === user.id);
        const updatedLikes = hasLiked
          ? post.likes.filter(like => like.userId !== user.id)
          : [...post.likes, { userId: user.id }];

        setPosts(posts.map(p =>
          p.id === postId ? { ...p, likes: updatedLikes } : p
        ));

        await likePost(postId);
      } else {
        alert('Sign in to use this feature');
      }
    } catch (error) {
      console.error('Could not like post.', error);
      setError('Could not like post.');
    }
  };

  const handleShare = async (postId) => {
    try {
      if (user) {
        const updatedPost = await sharePost(postId);
        setPosts(posts.map(post =>
          post.id === postId ? { ...post, shares: updatedPost.shares } : post
        ));
      } else {
        alert('Sign in to use this feature');
      }
    } catch (error) {
      console.error('Could not share post.', error);
      setError('Could not share post.');
    }
  };

  return (
    <div className="all-posts-container">
      <div className="posts-feed">
        {error && <p>{error}</p>}
        {sortedPosts.length > 0 ? (
  sortedPosts.map((post) => (
    <div
      key={post.type === "shared" ? post.uniqueKey : post.id} // unique key for shared posts
      className="post-summary"
    >
      <div className="post-info">
        {post.type === "shared" && post.sharedBy && (
          <p className="shared-by">
            Shared by{" "}
            <Link to={`/profile/${post.sharedBy.id}`}>
              {post.sharedBy.username}
            </Link>
          </p>
        )}
        <div className="post-author">
          <Link to={`/profile/${post.author.id}`} className="author-link">
            <span className="author-username">{post.author.username}</span>
          </Link>
        </div>
        <div className="post-description">
          <p>{post.content}</p>
        </div>
      </div>
      <div className="post-image-container">
        <Link
          to={`/posts/${post.type === "shared" ? post.postId : post.id}`}
          className="post-link"
        >
          {post.imageUrl && (
            <img src={post.imageUrl} alt="Post" className="post-image" />
          )}
        </Link>
      </div>

      {post.type == 'shared' && (
        <div className="post-stats">
          Click image to go to the original post
        </div>
      )}
      {post.type !== "shared" && (
        <div className="post-stats">
          <p
            onClick={() => handleLike(post.id)}
            className={`like-icon ${
              post.likes?.some((like) => like.userId === user?.id) ? "liked" : ""
            }`}
          >
            <FaHeart /> {post.likes?.length || 0} likes
          </p>
          <p
            onClick={() => handleShare(post.id)}
            className={`share-icon ${
              post.shares?.some((share) => share.userId === user?.id)
                ? "shared"
                : ""
            }`}
          >
            <FaShare /> {post.shares?.length || 0} shares
          </p>
          <p onClick={() => navigate(`/posts/${post.id}`)}>
            <FaComment /> {post.comments?.length || 0} comments
          </p>
        </div>
      )}
    </div>
  ))
) : (
  <p>No posts available</p>
)}
</div>

      {(guestId || user) && (
        <div className="friend-suggestions">
          <h3>Suggestions</h3>
          {userSuggestions.length > 0 ? (
            userSuggestions.map(userSuggestion => (
              <div key={userSuggestion.id} className="user-suggestion">
                <img
                  src={userSuggestion.imageUrl || defaultProfileImage}
                  alt={userSuggestion.username}
                  className="user-image"
                />
                <Link to={`/profile/${userSuggestion.id}`} className="username">
                  {userSuggestion.username}
                </Link>
              </div>
            ))
          ) : (
            <p>No user suggestions</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AllPosts;
