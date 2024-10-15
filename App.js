import { supabase } from './supabase';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator} from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import Login from './app/screens/Login';
import Home from './app/screens/Home';
import UserRecipes from './app/screens/UserRecipes';
import Recipe from './app/screens/Recipe';
import Settings from './app/screens/Settings';
import AddUserRecipe from './app/screens/AddUserRecipe';
import NewUser from './app/screens/NewUser';
import { useState, useEffect } from 'react';
import ConfirmOTP from './app/screens/ConfirmOTP';


const Stack = createNativeStackNavigator();

const LoggedInDrawer = createDrawerNavigator();

const MainAppTabs = createBottomTabNavigator();

const RecipePages = createNativeStackNavigator();

const LoggedOutStack = createNativeStackNavigator();

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
      <RecipePages.Screen name="Recipe" component={Recipe} options={{headerShown: false}} />
    </RecipePages.Navigator>
  )
}

function TabsStack() {
  return (
    <MainAppTabs.Navigator
    screenOptions={{
      tabBarStyle: {backgroundColor:'#181818', borderTopWidth:0},
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#B3B3B3'
    }}
    >
      <MainAppTabs.Screen name="Home" component={Home} options={{headerShown: false}}/>
      <MainAppTabs.Screen name="Recipes" component={Recipes} options={{headerShown: false}} />
    </MainAppTabs.Navigator>
  );
}

function LoggedInStack() {

  return (
      <LoggedInDrawer.Navigator
      screenOptions={{ 
        headerTitle: () => <LogoTitle />,
        headerTitleAlign: 'left',
        headerStyle: {backgroundColor: '#181818'},
        headerShadowVisible: false,
        headerTintColor: '#fff',
        drawerStyle: {backgroundColor: '#181818'},
        drawerLabelStyle: {color: '#fff'},
        drawerActiveBackgroundColor: '#404040'
      }}
      >
        <LoggedInDrawer.Screen name="sous" component={TabsStack} />
        <LoggedInDrawer.Screen name="Settings" component={Settings} />
      </LoggedInDrawer.Navigator>
  )
};

function AnonStack() {
  return (
    <LoggedOutStack.Navigator 
      initialRouteName='NewUser'
      screenOptions={{
        headerTitle: () => <LogoTitle />,
        headerTitleAlign: 'center',
        headerStyle: {backgroundColor: '#222222'},
        headerShadowVisible: false,
        headerTintColor: '#fff' 
      }}
      >
      <LoggedOutStack.Screen name="Sign up" component={NewUser}/>
      <LoggedOutStack.Screen name="Login" component={Login}/>
      <LoggedOutStack.Screen name="Confirm OTP" component={ConfirmOTP} />
    </LoggedOutStack.Navigator>
  )
};
//TODO: fix different positions
function LogoTitle() {
  return (
    <Image
      style={{ width: 300, height: 55, marginTop: 20}}
      source={require('./assets/sous_transparent.png')}
    />
  );
}

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
     supabase.auth.onAuthStateChange((event, session) => {
      if (event == 'SIGNED_OUT') {
        console.log(event)
        setSession(null)
      } else {
        console.log(event)
        setSession(session)
      }
    })
  }, [])

  console.log(session)

  return (
    <NavigationContainer>
      <Stack.Navigator 
      initialRouteName='AnonUser'
      options={{headerShown: false}}
      >
        {session ? (
          <Stack.Screen name="LoggedIn" component={LoggedInStack} options={{headerShown: false}}/>
        ) : (
          <Stack.Screen 
            name='AnonUser'
            component={AnonStack}
            options={{headerShown: false}}
            />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

