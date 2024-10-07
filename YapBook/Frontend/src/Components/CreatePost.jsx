import React, { useState } from "react";
import { createPost } from "../APIs/indexAPI";
import { useNavigate } from "react-router-dom";
import '../Styles/CreatePost.css'

const CreatePost = () => {
    const [file, setFile] = useState(null)
    const [content, setContent] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const data  = await createPost(content, file)
            navigate(`/posts/${data.id}`)
        } catch(error) {
            console.error('Could not create post.', error)
            alert('Could not create post, please try again.')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="create-post-form">
            <label htmlFor="file">Upload a file:</label>
            <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setFile(e.target.files[0])} 
                className="select-file"
                id="file"
            />

            <label htmlFor="content">Write a description for your post:</label>
            <textarea 
                name="content" 
                id="content" 
                onChange={(e) => setContent(e.target.value)}
                value={content}
            />
            <button type="submit">Create Post</button>
        </form>
    )
}

export default CreatePost