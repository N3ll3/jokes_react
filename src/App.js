import './App.css';
import React, { useState, useRef, useEffect } from 'react';

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);

  //What does useEffect do? By using this Hook, you tell React that your component needs to do something after render.
  //React will remember the function you passed(we’ll refer to it as our “effect”), and call it later after performing the DOM updates.
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const fetchJokes = async (setJokes) => {
  await fetch(`https://v2.jokeapi.dev/joke/Any?type=single&amount=10`)
    .then((response) => response.json())
    .then((data) => {
      setJokes(data.jokes);
    });
};

// const initialJokes = [
//   {
//     title: 'React',
//     url: 'https://reactjs.org',
//     author: 'Jordan walke',
//     num_comments: 3,
//     points: 4,
//     objectID: 0,
//   },
//   {
//     title: 'Redux',
//     url: 'https://redux.js.org',
//     author: 'Dan Abramov, Andrew Clarck',
//     num_comments: 2,
//     points: 5,
//     objectID: 1,
//   },
// ];

const App = () => {
  const [jokes, setJokes] = useState([]);
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', '');

  useEffect(() => {
    fetchJokes(setJokes);
  }, []);

  //fonction de callback pour recuperer info du composant enfant
  // pour pouvoir ensuite faire le tri dans la liste de Jokes  searchedJokes
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRemoveJokes = (itemobjectID) => {
    const newJokes = jokes.filter((joke) => itemobjectID !== joke.id);
    setJokes(newJokes);
  };

  //Utilisation des info remontees depuis children components pour retraitement sur autre component
  console.log(jokes);
  const searchedJokes = jokes.filter((joke) =>
    joke.category.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
  );

  return (
    <div className='App'>
      <h1>French Jokes </h1>

      <InputWithLabel
        id='search'
        type='text'
        value={searchTerm}
        onInputChange={handleSearch}
        isFocused // equivalent a isFocused ={true} (bool)
      >
        {/* <!-- prop.children--> */}
        <strong>Search :</strong>
      </InputWithLabel>

      <hr />
      <List list={searchedJokes} onRemoveItem={handleRemoveJokes} />
    </div>
  );
};

const List = ({ list, onRemoveItem }) =>
  list.map((item) => (
    <Item key={item.id} onRemoveItem={onRemoveItem} {...item} />
  ));

const Item = ({ onRemoveItem, category, joke, id, type }) => (
  <div className='joke'>
    <button type='button' onClick={() => onRemoveItem(id)}>
      <i className='fas fa-times'></i>
    </button>
    <br />
    <span>Category : {category}</span> <br />
    <span>Type : {type}</span> <br />
    <span>Joke : {joke}</span>
  </div>
);

const InputWithLabel = ({
  id,
  type = 'text',
  value,
  onInputChange,
  children,
  isFocused,
}) => {
  const inputRef = useRef();
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);
  return (
    <>
      <label htmlFor={id}>{children} </label>
      <input
        ref={inputRef}
        autoFocus={isFocused}
        id={id}
        type={type}
        onChange={onInputChange}
        value={value}
      />
    </>
  );
};

export default App;
