// src/scripts.tsx
import { createRoot } from 'react-dom/client';
import React, { useState, useEffect } from 'react';

interface AppProps {
 data: any;
}

interface SearchFilterProps {
 data: any[];
 onSearch: (searchTerm: string) => void;
 setSearchHistory: React.Dispatch<React.SetStateAction<string[]>>;
 searchHistory: string[];
}

interface ListItem {
 id: string;
 title: string;
 provider: string;
 image: string;
}

interface List {
 id: string;
 title: string;
 items: ListItem[];
}

const App: React.FC<AppProps> = ({ data }) => {
 const [searchTerm, setSearchTerm] = useState('');
 const [filteredData, setFilteredData] = useState(data.lists);
 const [searchHistory, setSearchHistory] = useState<string[]>([]);

 // Load search history from localStorage when the component mounts
 useEffect(() => {
 const history = localStorage.getItem('searchHistory');
 if (history) {
 setSearchHistory(JSON.parse(history));
 }
 }, []);

 const handleSearch = (searchTerm: string) => {
 setSearchTerm(searchTerm);
 setFilteredData(data.lists.filter((list: List) => list.title.includes(searchTerm)));
 };

 return (
 <div className="container">
 <SearchFilter data={data.lists} onSearch={handleSearch} setSearchHistory={setSearchHistory} searchHistory={searchHistory} />
 <h1 className="category-title">{data.title}</h1>
 <hr />
 <p className="description">{data.description}</p>
 {filteredData.map((list: List) => (
 <div key={list.id}>
 <h2 className="list-title">{list.title}</h2>
 <div className="game-list">
 {list.items.map((item: ListItem) => (
 <div key={item.id} className="game-item">
  <img src={item.image} alt={item.title} />
  <p className="game-title">{item.title}</p>
 </div>
 ))}
 </div>
 </div>
 ))}
 </div>
 );
};

const SearchFilter: React.FC<SearchFilterProps> = ({ data, onSearch, setSearchHistory, searchHistory }) => {
 const [searchTerm, setSearchTerm] = useState('');

 const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
 setSearchTerm(event.target.value);
 onSearch(event.target.value);
 };

 const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
 addSearchTermToHistory(event.target.value);
 };

 const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
 if (event.key === 'Enter') {
 addSearchTermToHistory(event.currentTarget.value);
 }
 };

 const addSearchTermToHistory = (searchTerm: string) => {
 if (searchTerm && !searchHistory.includes(searchTerm)) {
 setSearchHistory(prevHistory => {
 const updatedHistory: string[] = [searchTerm, ...prevHistory];
 localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
 return updatedHistory;
 });
 }
 };

 return (
 <div>
 <input
 type="text"
 placeholder="Search..."
 value={searchTerm}
 onChange={handleSearch}
 onBlur={handleBlur}
 onKeyDown={handleKeyDown}
 />
 <ul className="search-history">
 {searchHistory.slice(0, 10).map((term: string, index: number) => (
 <li key={index}>{term}</li>
 ))}
 </ul>
 </div>
 );
};

fetch('/api/games/lists.json')
 .then(response => response.json())
 .then(data => {
 createRoot(document.getElementById('root')!).render(<App data={data} />);
 });
