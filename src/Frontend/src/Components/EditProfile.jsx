import React, { useContext, useEffect, useRef, useState } from "react";
import { deletePhoto, editPhoto, editProfile, getProfile } from "../APIs/indexAPI";
import { YapContext } from "./Context";
import { FaUserCircle } from "react-icons/fa";
import "../Styles/EditProfile.css";

const EditProfile = () => {
  const { user } = useContext(YapContext);
  const [profile, setProfile] = useState(null);
  const [newBio, setNewBio] = useState("");
  const [newPhoto, setNewPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);  //need this for photo update process

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getProfile(user.id);
        setProfile(userProfile);
        setNewBio(userProfile.bio || "");
        setMessage("");
      } catch (error) {
        setMessage("Could not fetch profile");
      }
    };

    if (user && user.id) {
      fetchProfile();
    }
  }, [user]);

  const handleDeletePhoto = async () => {
    try {
      const response = await deletePhoto();
      setProfile({ ...profile, imageUrl: null });
      setMessage("Photo deleted successfully!");
    } catch (error) {
      console.error("Could not delete photo", error);
      setMessage("Could not delete photo");
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    if(profile.bio === newBio) {
      setMessage('No changes made')
      return
    }
    setMessage("");
    try {
      const updatedProfile = await editProfile({ bio: newBio });
      setProfile({ ...profile, bio: updatedProfile.bio });
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Could not update profile", error);
      setMessage("Could not update profile"); 
    }
  };

  const handleEditPhoto = async () => {
    if (newPhoto) {
      try {
        setMessage("");
        const formData = new FormData();
        formData.append('file', newPhoto);

        const updatedProfile = await editPhoto(formData);
        if (updatedProfile.user && updatedProfile.user.imageUrl) {
          setProfile({ ...profile, imageUrl: updatedProfile.user.imageUrl });
          setNewPhoto(null);
          setMessage("Photo updated successfully!");
        } else {
          console.error("Image URL not found in response:", updatedProfile);
        }
      } catch (error) {
        console.error("Could not edit photo", error);
        setMessage("Could not edit photo");
      }
    } else {
      setMessage("Please select a photo to upload.");
    }
  };

  //set new photo first before asking user for confirmation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(file);
      setMessage("New photo selected. Click 'Upload Photo' to save.");
    }
  };

  const handleBioChange = (e) => {
    setNewBio(e.target.value);
    setMessage(""); 
  };

  return (
    <form onSubmit={handleEditProfile} className="edit-profile-form">
      <div className="photo-container">
        {profile ? (
          <img
            src={profile.imageUrl || defaultProfileImage}
            alt={`${profile.username}'s photo`}
            className="profile-photo"
          />
        ) : (
          <FaUserCircle size={100} color="gray" />
        )}
        <button
          type="button"
          onClick={handleDeletePhoto}
          className="delete-photo-btn"
        >
          Delete Photo
        </button>

        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef} //using inputRef so that the user can confirm uploading a photo instead of uploading directly
          className="hidden-file-input"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="change-photo-btn"
        >
          Change Image
        </button>

        {newPhoto && (
          <button
            type="button"
            onClick={handleEditPhoto}
            className="upload-photo-btn"
          >
            Upload Photo
          </button>
        )}
      </div>

      <div className="bio-container">
        <label htmlFor="bio" className="bio-label">
          Bio:
        </label>
        <textarea
          id="bio"
          value={newBio}
          onChange={handleBioChange}
          className="bio-textarea"
          placeholder="Write something about yourself..."
        />
      </div>

      {message && (
        <p
          className={
            message.includes("successfully") ? "success-message" : "error-message"
          }
        >
          {message}
        </p>
      )}

      <button type="submit" className="save-profile-btn">
        Save Changes
      </button>
    </form>
  );
};

export default EditProfile;
