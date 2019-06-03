import React, { Component } from 'react';
import './App.css';
import fire from './Config/Config';
import Login from './Components/Login/Login';
import Navigation from './Components/NavBar/Navigation/Navigation';

class App extends Component {
  constructor()
  {
    super();
    this.state=
    {
      user:'',
      Nombre:'',
      typeUsr:false
    }
    this.getName=this.getName.bind(this);
  }
  getName()
  {
      var num_ctrl=fire.auth().currentUser.email
      fire.database().ref('Estudiante/'+num_ctrl.substr(0,8)).on("value",snapshot=>{
        this.setState({Nombre:snapshot.val().Nombre});
      })
  }
  componentDidMount()
  {
    this.authListener();
  }
  authListener()
  {
    fire.auth().onAuthStateChanged((user)=>
    {
      if(user)
         {
          this.setState({user});
          if(fire.auth().currentUser.email.substr(0,8)!== "superusr") 
            this.getName();
          else
             this.setState({Nombre:"SuperUser",typeUsr:true});
         }
      else
        this.setState({user:null});
    });
  }

  render() {
    return (
      <div>
        { this.state.user ? <Navigation Numero_Control={fire.auth().currentUser.email} Nombre={this.state.Nombre} typeUsr={this.state.typeUsr}/> : <Login/>}
      </div>
    );
  }
}

export default App;
