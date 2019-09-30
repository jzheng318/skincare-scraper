import React from 'react';
import NavBar from './components/layout/navbar';
import SearchBar from './components/layout/searchbar';
// import Landing from './components/layout/landing';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <Switch>
          <Route exact path="/" component={SearchBar} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
