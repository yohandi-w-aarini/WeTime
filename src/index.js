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
import NotificationHandler from './screens/NotificationHandler';

Meteor.connect(settings.METEOR_URL);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasInternet:true,
      connected: false,
      elapsed: 0,
      smsLink:false,
      smsLinkClickTimestamp:undefined,
      handleNotification:undefined
    };

    this.startTime = new Date();

    //Subscribe to URL open events while the app is still/already running.
    this.onLinkFromSms = firebase.links().onLink((url) => {
      this.setState({smsLink : url, smsLinkClickTimestamp: new Date()});
    });
  }

  async componentDidMount(){
    var connectionInfo = await NetInfo.getConnectionInfo();

    this.appLaunchedByLink = await firebase.links().getInitialLink();

    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
      // Process your token as required
      this.setDeviceToken(this.props, fcmToken)
    });

    this.appLaunchedByNotification = await firebase.notifications().getInitialNotification();
    console.log("LAUNCHED by NOTIFICATION");
    console.log(this.appLaunchedByNotification);

    if(this.appLaunchedByNotification){
      this.setState({handleNotification: this.appLaunchedByNotification});
      await firebase.notifications().cancelNotification(notificationOpen.notification._notificationId);
      this.appLaunchedByNotification = undefined;
    }

    this.notificationOpenedListener = firebase.notifications().onNotificationOpened(async (notificationOpen) => {
      console.log("NOTIFICATION OPEN");
      console.log(notificationOpen);
      this.setState({handleNotification: notificationOpen});
      await firebase.notifications().cancelNotification(notificationOpen.notification._notificationId);
    });

    this.notificationListener = firebase.notifications().onNotification((nextOrObserver) => {
      // Process your message as required
      console.log("NOTIFICATION RECEIVED (while app is in foreground)");
      if(nextOrObserver && nextOrObserver._data){
        console.log(nextOrObserver);

        // Build a channel group for notification
        const channelGroup = new firebase.notifications.Android.ChannelGroup('weTime-calls', 'Call of WeTime(s)');

        // Create the channel group
        firebase.notifications().android.createChannelGroup(channelGroup);

        // Build a channel
        const channel = new firebase.notifications.Android.Channel('weTime-call-channel', 'WeTime Call Channel', firebase.notifications.Android.Importance.Max)
        .setGroup('wetime-calls')
        .setDescription('My WeTime call channel');

        // Create the channel
        firebase.notifications().android.createChannel(channel);

        //build notification
        const notification = new firebase.notifications.Notification()
        .setNotificationId(nextOrObserver._notificationId)
        .setTitle(nextOrObserver._data.title)
        .setBody(nextOrObserver._data.body)
        .setData(nextOrObserver._data);

        //set property that will make android show this notification as "heads up notification"
        notification
        .android.setChannelId('channelId')
        .android.setSmallIcon('ic_launcher')
        .android.setDefaults(firebase.notifications.Android.Defaults.All)
        .android.setPriority(firebase.notifications.Android.Priority.High);

        // Build an action
        const action = new firebase.notifications.Android.Action('action_positive', 'ic_launcher', 'Yes, Please');
        const action2 = new firebase.notifications.Android.Action('action_negative', 'ic_launcher', 'No thanks');
        // Add the action to the notification
        notification.android.addAction(action);
        notification.android.addAction(action2);

        console.log("NEW PRIORITY NOTIFICATION");
        console.log(notification);

        // Display the notification
        firebase.notifications().displayNotification(notification);
      }

    });

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

  async componentWillReceiveProps(nextProps){
    if(nextProps.status && nextProps.status.connected === false){
      if(!this.startTime){
        this.startTime = new Date();
      }
      if(!this.timer){
        this.timer = setInterval(this.tick.bind(this), 50);
      }
    }
    
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      // user has a device token
      this.setDeviceToken(nextProps, fcmToken)
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
    
    if(this.onTokenRefreshListener){
      this.onTokenRefreshListener();
    }

    if(this.notificationOpenedListener){
      this.notificationOpenedListener();
    }

    if(this.notificationListener){
      this.notificationListener();
    }
  }

  setDeviceToken(props, fcmToken){
    if(props.status && props.status.connected && props.user){
      var user = props.user;
      //user profile doesn't have a device token or device token is not the same
      if(!(user.devices && user.devices[0].deviceToken)||(user.devices && user.devices[0].deviceToken && user.devices[0].deviceToken != fcmToken)){
        //set/update deviceToken in user database
        Meteor.call('update.deviceToken',fcmToken, (error, response)=>{
          if(error){
            console.log(error);
          }
        });
      }
    }
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
        if(this.state.handleNotification){
          return <NotificationHandler notification={this.state.notification}/>;
        }else{
          return <PrivateStack />;
        }
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
