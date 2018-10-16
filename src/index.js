import React from 'react';
import PropTypes from 'prop-types';
import Meteor, { withTracker } from 'react-native-meteor';
import { NetInfo } from 'react-native';
import firebase from 'react-native-firebase';

import { AuthStack, PrivateStack } from 'WeTime/src/config/routes';
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
      elapsed: 0,
      smsLink:false,
      smsLinkClickTimestamp:undefined
    };

    this.appLaunchedByLink;
    this.startTime = new Date();

    //Subscribe to URL open events while the app is still/already running.
    this.onLinkFromSms = firebase.links().onLink((url) => {
      this.setState({smsLink : url, smsLinkClickTimestamp: new Date()});
    });
  }

  async componentDidMount(){
    var connectionInfo = await NetInfo.getConnectionInfo();

    this.appLaunchedByLink = await firebase.links().getInitialLink();

    if(connectionInfo){
      if(connectionInfo.type == "none"){
        this.setInternetState(false);
      }else{
        this.setInternetState(true);
      }
      NetInfo.addEventListener(
        'connectionChange',
        this.handleConnectivityChange.bind(this)
      );
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.status && nextProps.status.connected === false){
      if(!this.startTime){
        this.startTime = new Date();
      }
      if(!this.timer){
        this.timer = setInterval(this.tick.bind(this), 50);
      }
    }
  }

  componentWillUnmount(){
    // componentDidMount is called by react when the component 
    // has been rendered on the page. We can set the interval here:

    this.clearTimer();

    NetInfo.removeEventListener(
      'connectionChange',
      this.handleConnectivityChange.bind(this)
    );
  }

  setInternetState(state){
    //start/stop timer based on connection state to the server
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

  handleConnectivityChange(connectionInfo) {
    if(connectionInfo.type == "none"){
      this.setInternetState(false);
    }else{
      this.setInternetState(true);
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
      //load the appropriate routes based on user's login status
      else if (user) {
        return <PrivateStack />;
      }else{
        return <AuthStack screenProps={{ 
          appLaunchedByLink: this.appLaunchedByLink, 
          smsLink: this.state.smsLink,
          smsLinkClickTimestamp: this.state.smsLinkClickTimestamp, 
          onLinkFromSms: this.onLinkFromSms }}/>;
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

export default withTracker(() => {
  return {
    status: Meteor.status(),
    user: Meteor.user(),
    loggingIn: Meteor.loggingIn(),
  };
})(App);
