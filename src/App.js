import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './Components/Login';
import Register from './Components/Register';
import Recovery from './Components/Recovery';
import Home from './Components/Home';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={ Login } />
        <Route path="/home" component={ Home } />
        <Route path="/register" component={ Register } />
        <Route path="/recovery" component={ Recovery } />
      </Switch>
    </Router>
  );
}

export default App;
