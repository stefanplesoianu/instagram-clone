import React, { useState, useContext } from "react";
import SearchForm from "./SearchForm";
import { YapContext } from "./Context";

const SearchMenu = () => {
    const [people, setPeople] = useState([]) // slows down speed if fetched unnecessarily
    const { isFollowedByUser } = useContext(YapContext);

    return (
        <div className="container">
            <SearchForm title='Search' people={people} setPeople={setPeople} followedIds={isFollowedByUser} />
        </div>
    );
}

export default SearchMenu;
