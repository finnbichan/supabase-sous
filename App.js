import { supabase } from './supabase';
import { getFocusedRouteNameFromRoute, NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerToggleButton} from '@react-navigation/drawer';
import { HeaderBackButton } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { useState, useEffect, createContext } from 'react';
import Login from './app/screens/Login';
import Home from './app/screens/Home';
import UserRecipes from './app/screens/UserRecipes';
import Recipe from './app/screens/Recipe';
import Settings from './app/screens/Settings';
import AddOrEditUserRecipe from './app/screens/AddOrEditUserRecipe';
import NewUser from './app/screens/NewUser';
import ConfirmOTP from './app/screens/ConfirmOTP';
import Explore from './app/screens/Explore';
import './globals';
import { AuthContext } from './Contexts';
import BackButton from './app/components/BackButton';

const Stack = createNativeStackNavigator();

const LoggedInDrawer = createDrawerNavigator();

const MainAppTabs = createBottomTabNavigator();

const RecipePages = createNativeStackNavigator();

const LoggedOutStack = createNativeStackNavigator();

function LeftButton() {
  const route = useRoute();
  const navigation = useNavigation();
  const screen = route.name;
  const prevScreen = route.params?.prevScreen || 'Home';
  const editing = screen === 'Add a recipe' && route.params?.recipe;
  console.log("screen", route.name)
  
  switch (screen) {
    case 'Add a recipe':
      return editing ? 
      <HeaderBackButton tintColor='#FFF' onPress={() => navigation.navigate(prevScreen, {recipe: route.params.recipe})} />
      :
      <HeaderBackButton tintColor='#FFF' onPress={() => navigation.navigate(prevScreen)} />
    case 'Recipe':
      return <HeaderBackButton tintColor='#FFF' onPress={() => navigation.navigate(prevScreen)} />
    default:
      return <DrawerToggleButton tintColor='#FFF'/>
  }
  
}

//react native navigation doesnt do well with back buttons for nested navigators, so we flatten the stack
//and hide the buttons for add recipe/edit recipe/recipe view
//Problem: tab button no longer highlighted on these screens
function TabsStack() {
  return (
    <MainAppTabs.Navigator
    screenOptions={{
      headerTitle: () => <LogoTitle />,
      headerTitleAlign: 'left',
      headerStyle: {backgroundColor: '#181818'},
      headerShadowVisible: false,
      headerTintColor: '#fff',
      headerLeft: () => <LeftButton />,
      tabBarStyle: {backgroundColor:'#181818', borderTopWidth:0},
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#B3B3B3'
    }}
    >
      <MainAppTabs.Screen name="Home" component={Home} />
      <MainAppTabs.Screen name="Your recipes" component={UserRecipes} />
      <MainAppTabs.Screen name="Add a recipe" component={AddOrEditUserRecipe} options={{
        tabBarButton: () => null
      }} />
      <MainAppTabs.Screen name="Recipe" component={Recipe} options={{
        tabBarButton: () => null
      }} />
      <MainAppTabs.Screen name="Explore" component={Explore}/>
    </MainAppTabs.Navigator>
  );
}

function LoggedInStack() {

  return (
      <LoggedInDrawer.Navigator
      screenOptions={{
        drawerStyle: {backgroundColor: '#181818'},
      drawerLabelStyle: {color: '#fff'},
      drawerActiveBackgroundColor: '#404040'
      }}>
        <LoggedInDrawer.Screen name="sous" component={TabsStack} options={{headerShown: false}}/>
        <LoggedInDrawer.Screen name="Settings" component={Settings} options={{
      headerTitle: () => <LogoTitle />,
      headerTitleAlign: 'left',
      headerStyle: {backgroundColor: '#181818'},
      headerShadowVisible: false,
      headerTintColor: '#fff',
      headerLeft: () => <LeftButton />
    }}/>
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
    <AuthContext.Provider value={session}>
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
    </AuthContext.Provider>
  );
}

