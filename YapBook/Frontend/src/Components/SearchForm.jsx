import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { followUser, searchUser } from "../APIs/indexAPI";
import "../Styles/SearchForm.css";
import { YapContext } from "./Context";

const SearchForm = ({ people, title, closeSearchForm, followedIds }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, fetchCurrentUser } = useContext(YapContext); // fetch current user to refresh followed state if needed

  useEffect(() => {
    if (!searchTerm) {
      // initialize search results with follow state from followedIds
      setSearchResults(
        people.map((person) => ({
          ...person,
          isFollowed: followedIds.includes(person.id),
        }))
      );
    }
  }, [people, searchTerm, followedIds]);

  const handleFollow = async (followedId) => {
    try {
      await followUser(followedId);

      // toggle the follow/unfollow state
      setSearchResults((prevResults) =>
        prevResults.map((person) =>
          person.id === followedId
            ? { ...person, isFollowed: !person.isFollowed }
            : person
        )
      );

      // refresh context state keep track across the app
      await fetchCurrentUser(); 
    } catch (error) {
      console.error("Could not perform this action.", error);
      setError("Could not perform this action");
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim().length >= 3) {
      const localResults = people.filter((person) =>
        person.username.toLowerCase().includes(term)
      );

      const updatedLocalResults = localResults.map((person) => ({
        ...person,
        isFollowed: followedIds.includes(person.id),
      }));

      setSearchResults(updatedLocalResults);

      if (updatedLocalResults.length === 0) {
        try {
          const globalResults = await searchUser(term);
          const updatedGlobalResults = globalResults.map((result) => ({
            ...result,
            isFollowed: followedIds.includes(result.id),
          }));

          setSearchResults(updatedGlobalResults);
        } catch (error) {
          console.error("Error performing search", error);
          setError("Error performing search");
        }
      }
    } else {
      setSearchResults(searchTerm ? [] : people);
    }
  };

  return (
    <div className="search-form">
      <div className="search-form-header">
        {title && <h2>{title}</h2>}
        {closeSearchForm && (
          <button className="close-btn" onClick={closeSearchForm}>
            &times;
          </button>
        )}
      </div>
      <form>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search users..."
        />
      </form>
      {error && <p>{error}</p>}
      {searchResults.length > 0 ? (
        searchResults.map((person) => (
          <div key={person.id} className="user-info">
            <img
              src={person.imageUrl}
              alt={person.username}
              className="user-image"
            />
            <p
              className="username"
              onClick={() => navigate(`/profile/${person.id}`)}
            >
              {person.username}
            </p>
            {user.username !== person.username && (
              <button onClick={() => handleFollow(person.id)}>
                {person.isFollowed ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        ))
      ) : searchTerm && !searchResults.length ? (
        <p>No users found</p>
      ) : null}
    </div>
  );
};

export default SearchForm;
