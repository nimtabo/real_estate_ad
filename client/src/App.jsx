import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.scss';
import Navbar from './components/Navbar/Navbar';
import Landing from './components/Landing/Landing';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Estates from './components/Estates/Estates';

const App = () => {
    return (
        <div className='App'>
            <Router>
                <Navbar />
                <Route exact path='/' component={Landing} />
                <section className='container'>
                    <Switch>
                        <Route exact path='/estates' component={Estates} />
                        <Route exact path='/register' component={Register} />
                        <Route exact path='/login' component={Login} />
                    </Switch>
                </section>
            </Router>
        </div>
    );
};

export default App;