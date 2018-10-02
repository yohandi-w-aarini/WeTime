import { createStackNavigator } from 'react-navigation';
import CreateGroupInvite from 'WeTime/src/components/CreateGroupInvite';
import CreateGroupName from 'WeTime/src/components/CreateGroupName';

export default CreateGroup = createStackNavigator({
  SetGroupName: {
    screen: CreateGroupName,
    navigationOptions: {
      header: null,
    }
  },
  SetGroupMember: {
    screen: CreateGroupInvite,
  },
});
