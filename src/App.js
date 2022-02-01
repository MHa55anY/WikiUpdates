import './App.css';
import Domains from './components/first';
import Users from './components/second';

function App() {
  return (
    <div className="App">
      <div className='header'><h1>Wiki Updates</h1></div>
      <div className='content'>
      <Domains />
      <Users />
      </div>
      
    </div>
  );
}

export default App;
