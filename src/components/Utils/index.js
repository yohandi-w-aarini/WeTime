import Meteor from 'react-native-meteor';
import firebase from 'react-native-firebase';

// Require `PhoneNumberFormat`.
const PNF = require('google-libphonenumber').PhoneNumberFormat;
 
// Get an instance of `PhoneNumberUtil`.
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const formatMobileNumber = (defaultUserCountryCode, number) => {
  var numberFormat = number.replace(/\s/g, '');
  var countryCode = defaultUserCountryCode;
  //check for E.164 phone number format
  if(numberFormat.substr(0,1) != '+'){
    //use group owner's verified phone number country code (a safe assumption);
    //converts e.g. "06xxxxxxxx" to "+316xxxxxxxx"
    numberFormat = "+"+countryCode+numberFormat.substr(1, numberFormat.length);
  }else{
    //get country code from the number
    countryCode =  phoneUtil.parse(number, 'NL').getCountryCode();
  }

  return {countryCode:countryCode,number:numberFormat}
}

const generateDynamicLink = (countryCode, number) => {
  const link = 
  new firebase.links.DynamicLink(`https://weq.io?countryCode=${countryCode}&msisdn=${number}`, 'wetime.page.link')
    .android.setPackageName('io.weq.wetime')
    .ios.setBundleId('io.weq.wetime');

  return firebase.links().createShortDynamicLink(link);
}

export async function generateCreateGroupData(defaultCountryCode, selectedUserMobile, selectedUserEmail){
  var createGroupMobileData = [];
  for(var i = 0; i<selectedUserMobile.length; i++){
    var contact = selectedUserMobile[i];
    if(contact.phoneNumbers && contact.phoneNumbers.length > 0){
      var mobile = contact.phoneNumbers.find((number)=>{return number.label == 'mobile'});
      if(mobile && mobile.number){
        var formatted = formatMobileNumber(defaultCountryCode, mobile.number);
        var link = await generateDynamicLink(formatted.countryCode,formatted.number);
        formatted.link = link;
        createGroupMobileData.push(formatted);
      }
    };
  }
  console.log(createGroupMobileData);
  return createGroupMobileData;
}