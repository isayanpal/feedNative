import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "./index";
import AddPostScreen from "./add-post";

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Add Post" component={AddPostScreen} />
    </Tab.Navigator>
  );
}
