import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native-web';
import { Tracker } from './screens/Tracker.js';
import { Settings } from './screens/Settings.js';


export default function App() {
  return (
    <View>
      <Text>Home</Text>
      <Navigation></Navigation>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  screens: {
    TrackerScreen: Tracker,
    SettingsScreen: Settings
  },
});

const Navigation = createStaticNavigation(RootStack);
