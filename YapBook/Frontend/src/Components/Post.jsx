import React, { useState, useEffect, useContext, useMemo } from 'react';
import { FaHeart, FaComment, FaShare, FaTrash } from 'react-icons/fa';
import { likePost, sharePost, createComment, openPost, getProfile, deletePost, deleteComment } from '../APIs/indexAPI';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../Styles/Post.css';
import { YapContext } from './Context';

const Post = () => {
    const { postId } = useParams();
    const { user } = useContext(YapContext);
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [author, setAuthor] = useState(null);
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [shares, setShares] = useState(0);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await openPost(postId);
                
                if (!data || !data.post) {
                    throw new Error('Post not found');
                }

                setPost(data.post);
                setLikes(data.post.likes || []);
                setShares(data.post.shares.length || 0);
                setComments(data.post.comments || []);

                const authorData = await getProfile(data.post.authorId);
                setAuthor(authorData);
            } catch (error) {
                console.error('Could not fetch post details.', error);
                setPost(null);
            }
        };

        fetchPost();
    }, [postId, user]);

    const handleLike = async () => {
        if (!user) {
            alert('Sign in to use this feature');
            return;
        }

        try {
            const hasLiked = likes.some(like => like.userId === user.id);
            const updatedLikes = hasLiked
                ? likes.filter(like => like.userId !== user.id) 
                : [...likes, { userId: user.id }]; 

            setLikes(updatedLikes);
            await likePost(postId); 
        } catch (error) {
            console.error('Could not like post.', error);
        }
    };

    const handleShare = async () => {
        try {
            await sharePost(postId);
            setShares(prevShares => prevShares + 1); // increase post share count
            alert('Post shared successfully');
        } catch (error) {
            console.error('Could not share post.', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const newComment = await createComment(commentText, postId);
            newComment.user = user;
            setComments(prevComments => [...prevComments, newComment]);
            setCommentText(''); 
        } catch (error) {
            console.error('Could not add the comment.', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await deleteComment(postId, commentId); 
                setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
                alert('Comment deleted successfully.');
            } catch (error) {
                console.error('Could not delete comment.', error);
                alert('Failed to delete comment.');
            }
        }
    };

    const handleDeletePost = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(postId);
                alert('Post deleted successfully.');
                navigate('/');
            } catch (error) {
                console.error('Could not delete post.', error);
                alert('Failed to delete post.');
            }
        }
    };

    //use memo to improve fetch performance
    const likeCount = useMemo(() => likes.length, [likes]);
    const commentCount = useMemo(() => comments.length, [comments]);
    const shareCount = useMemo(() => shares, [shares]);

    if (!post) {
        return <p>Post not found</p>;
    }

    return (
        <div className="post-container">
            <div className="post-content">
                <div className="post-header">
                    {author ? (
                        <>
                            <img src={author.imageUrl} alt={author.username} className="author-image" />
                            <Link to={`/profile/${author.id}`} className="author-username">{author.username}</Link>
                            {post.authorId === user?.id && (  // only the author can delete the post
                                <FaTrash onClick={handleDeletePost} className="delete-icon" /> 
                            )}
                        </>
                    ) : (
                        <p>Loading author...</p>
                    )}
                </div>
                <div className="post-description">
                    <p>{post.content}</p>
                </div>
                <div className="post-image">
                    <img src={post.imageUrl} alt="Post" />
                </div>
                <div className="post-actions">
                    <FaHeart
                        onClick={handleLike}
                        className={`like-icon ${likes.some(like => like.userId === user?.id) ? 'liked' : ''}`}
                    />
                    <FaComment className="icon" />
                    <FaShare onClick={handleShare} className="icon" />
                    <p>{likeCount} likes</p>
                    <p>{commentCount} comments</p>
                    <p>{shareCount} shares</p>
                </div>
            </div>

            <div className="comments-section">
                {user ? (
                    <>
                        {comments.map(comment => (
                            <div key={comment.id} className="comment">
                                <Link to={`/profile/${comment.userId}`} className="comment-author">{comment.user.username}</Link>
                                <p>{comment.content}</p>
                                {comment.userId === user.id && ( 
                                    <FaTrash onClick={() => handleDeleteComment(comment.id)} className="delete-icon" />
                                )}
                            </div>
                        ))}
                        <form onSubmit={handleCommentSubmit}>
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                            />
                            <button type="submit">Post</button>
                        </form>
                    </>
                ) : (
                    <p>Sign in to access this feature</p>
                )}
            </div>
        </div>
    );
};

export default Post;
