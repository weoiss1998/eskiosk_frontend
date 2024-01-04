import logo from './logo.svg';
import './App.css';
//import * as mod from './start/Login.js'

/*function sayHello() {
  alert('You clicked me!');
}*/


async function Users() {
    const response = await fetch("http://fastapi.localhost:8008/users/?skip=0&limit=100")
    const todos = await response.json()
    console.log(JSON.stringify(todos))
}

/*async function StartLogin(){
  mod.Login()
}*/

function App() {
return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload. 1TEST 
          <button onClick={Users}>Default</button>          
        </p>
      </header>


    </div>
  );
}



//http://fastapi.localhost:8008/users/?skip=0&limit=100

export default App;
