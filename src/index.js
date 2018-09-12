import React from 'react';
import PropTypes from 'prop-types';
import Meteor, { createContainer } from 'react-native-meteor';
import { NetInfo } from 'react-native';

import { PublicStack, PrivateStack } from 'WeTime/src/config/routes';
import Loading from 'WeTime/src/components/Loading';
import NoInternet from 'WeTime/src/components/NoInternet';
import settings from 'WeTime/src/config/settings';
import ServerUnreachable from 'WeTime/src/components/ServerUnreachable';

Meteor.connect(settings.METEOR_URL);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasInternet:true,
      connected: false,
      elapsed: 0
    };

    this.startTime = new Date();
  }

  async componentDidMount(){
    var connectionInfo = await NetInfo.getConnectionInfo();

    if(connectionInfo){
      if(connectionInfo.type == "none"){
        this.setInternetState(false);
      }else{
        this.setInternetState(true);
      }
      NetInfo.addEventListener(
        'connectionChange',
        this.handleConnectivityChange
      );
    }
  }

  componentWillUnmount(){
    // componentDidMount is called by react when the component 
    // has been rendered on the page. We can set the interval here:

    this.clearTimer();

    NetInfo.removeEventListener(
      'connectionChange',
      this.handleConnectivityChange
    );
  }

  handleConnectivityChange(connectionInfo) {
    if(connectionInfo.type == "none"){
      this.setInternetState(false);
    }else{
      this.setInternetState(true);
    }
  }

  setInternetState(state){
    if(this.state.hasInternet != state){
      this.setState({hasInternet: state});
    }

    if(state && !this.timer){
      if(!this.startTime){
        this.startTime = new Date();
      }
      this.timer = setInterval(this.tick.bind(this), 50);
    }else{
      this.clearTimer();
    }
  }

  tick(){
    // This function is called every 50 ms. It updates the 
    // elapsed counter. Calling setState causes the component to be re-rendered
    if(this.props.status && this.props.status.connected === false){
      this.setState({elapsed: new Date() - this.startTime});
    }
    else{
        this.clearTimer();
    }
  }

  clearTimer(){
    this.setState({elapsed: 0});
    clearInterval(this.timer);
    this.timer = false;
    this.startTime = false;
  }
  
  render(){
    const { status, user, loggingIn } = this.props;

    if(this.state.hasInternet){
      if ((status.connected === false || loggingIn) && this.state.elapsed < 5000) {
        return <Loading />;
      }
      else if((status.connected === false || loggingIn) && this.state.elapsed >= 5000){
        return <ServerUnreachable/>
      }
      else if (user !== null) {
        return <PrivateStack />;
      }else{
        return <PublicStack />;
      }
    }else{
      return(
        <NoInternet/>
      )
    }
  }
}

App.propTypes = {
  status: PropTypes.object,
  user: PropTypes.object,
  loggingIn: PropTypes.bool,
};

export default createContainer(() => {
  return {
    status: Meteor.status(),
    user: Meteor.user(),
    loggingIn: Meteor.loggingIn(),
  };
}, App);
