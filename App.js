import { supabase } from './supabase';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator} from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './app/screens/Login';
import Home from './app/screens/Home';
import UserRecipes from './app/screens/UserRecipes';
import Settings from './app/screens/Settings';
import AddUserRecipe from './app/screens/AddUserRecipe';
import { useState, useEffect } from 'react';


const Stack = createNativeStackNavigator();

const LoggedInDrawer = createDrawerNavigator();

const MainAppTabs = createBottomTabNavigator();

const RecipePages = createNativeStackNavigator();

global.cuisineList = [
  {"id":"0", "label":"Asian"},
  {"id":"1", "label":"European"},
  {"id":"2", "label":"American"}
]
global.dietList = [
  {"id":"0", "label":"None"},
  {"id":"1", "label":"Vegetarian"},
  {"id":"2", "label":"Vegan"}
]
global.easeList = [
  {"id":"0", "label":"< 15 mins"},
  {"id":"1", "label":"15-30 mins"},
  {"id":"2", "label":"30-60 mins"},
  {"id":"3", "label":"> 1 hour"}
]

function Recipes() {
  return (
    <RecipePages.Navigator>
      <RecipePages.Screen name="Your recipes" component={UserRecipes} options={{headerShown: false}} />
      <RecipePages.Screen name="Add a recipe" component={AddUserRecipe} options={{headerShown: false}} />
    </RecipePages.Navigator>
  )
}

function TabsStack() {
  return (
    <MainAppTabs.Navigator>
      <MainAppTabs.Screen name="Home" component={Home} options={{headerShown: false}}/>
      <MainAppTabs.Screen name="Recipes" component={Recipes} options={{headerShown: false}} />
    </MainAppTabs.Navigator>
  );
}

function LoggedInStack() {

  return (
      <LoggedInDrawer.Navigator>
        <LoggedInDrawer.Screen name="sous" component={TabsStack} />
        <LoggedInDrawer.Screen name="Settings" component={Settings} />
      </LoggedInDrawer.Navigator>
  )
};

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event == 'SIGNED_IN') {
      setSession(session)
      } else {
        setSession(null)
      }
    })
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {session ? (
          <Stack.Screen name="LoggedIn" component={LoggedInStack} options={{headerShown: false}} />
        ) : (
          <Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>
        )}
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

