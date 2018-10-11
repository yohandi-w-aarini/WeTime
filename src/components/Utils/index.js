import Meteor from 'react-native-meteor';
import firebase from 'react-native-firebase';

export const sendSmsInvite = (countryCode, number) => {
    var numberFormat = number.replace(/\s/g, '');
    //check for E.164 phone number format
    if(numberFormat.substr(0,1) != '+'){
      //use user's verified phone number country code (a safe assumption);
      //converts e.g. "06xxxxxxxx" to "+316xxxxxxxx"
      numberFormat = "+"+countryCode+numberFormat.substr(1, numberFormat.length);
    }

    const link = 
    new firebase.links.DynamicLink(`https://weq.io?countryCode=${countryCode}&msisdn=${numberFormat}`, 'wetime.page.link')
      .android.setPackageName('io.weq.wetime')
      .ios.setBundleId('io.weq.wetime');

    firebase.links()
        .createShortDynamicLink(link)
        .then((url) => {
          Meteor.call('send.sms.invitation',numberFormat,url, (error, response)=>{
            if(error){
              console.log(error);
            }
          });
    });
}