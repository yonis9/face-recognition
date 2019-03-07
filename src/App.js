import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import 'tachyons';
import Particles from 'react-particles-js';
import 'dotenv';

// const app = new Clarifai.App({apiKey: process.env.REACT_APP_API_KEY});


const particleOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    },
    move: {
      speed: 5
    }
 }
}

class App extends Component {
constructor() {
  super()
  this.state= {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user:  {
     id: '',
     name: '',
      email: '',
      password: '',
     entries: 0,
     joined: ''
   }
}

}


loadUser = (data) => {
  this.setState({user: {
     id: data.id,
     name: data.name,
      email: data.email,
      password: data.password,
     entries: data.entries,
     joined: data.joined
  }})
}

onRouteChange = (route) => {
  if (route === 'signin') {
    this.setState({ isSignedIn: false, input: '', imageUrl: '' })
  } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
  this.setState({route: route})
}

displayFaceBox = (box) => {
  this.setState({box: box})
}

onInputChange = (event) => {
  this.setState({input: event.target.value});
}

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}

onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input})
  fetch('https://immense-shore-74081.herokuapp.com/imageUrl', {
              method: 'post',
              headers:{"Content-Type": 'application/json'},
              body: JSON.stringify({
                input: this.state.input
              })
            })
  .then(response => response.json())
   .then(response =>  {
      if(response) {
            fetch('https://immense-shore-74081.herokuapp.com/image', {
              method: 'put',
              headers:{"Content-Type": 'application/json'},
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
            .then(res => res.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, {entries: count}))
            })
            .catch(console.log)
      }
    this.displayFaceBox(this.calculateFaceLocation(response))
    })
        .catch(err => console.log(err));
}

  render() {
    const { isSignedIn, box, imageUrl, route } = this.state;
    return (
      <div className='App'>
       <Particles className='particles'
                params={particleOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {route === 'home'
        ?  <div>   
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition box={box} imageUrl={imageUrl}/>
      </div>
        : (this.state.route ==='signin') 
        ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
        : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      }
      </div>
    );
  }
}

export default App;
