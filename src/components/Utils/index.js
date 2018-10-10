import Meteor from 'react-native-meteor';
import firebase from 'react-native-firebase';

export const sendSmsInvite = (number) => {
    const link = 
    new firebase.links.DynamicLink('https://weq.io?param1=foo&param2=bar', 'wetime.page.link')
      .android.setPackageName('io.weq.wetime')
      .ios.setBundleId('io.weq.wetime');

    firebase.links()
        .createShortDynamicLink(link)
        .then((url) => {
          Meteor.call('send.sms.invitation',number,url, (error, response)=>{
            if(error){
              console.log(error);
            }
          });
    });
}