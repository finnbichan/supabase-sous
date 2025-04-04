import { supabase } from './supabase';
import { NavigationContainer, useNavigation, useRoute, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerToggleButton} from '@react-navigation/drawer';
import { HeaderBackButton } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { useState, useEffect, createContext, useContext } from 'react';
import Login from './app/screens/Login';
import Home from './app/screens/Home';
import UserRecipes from './app/screens/UserRecipes';
import Recipe from './app/screens/Recipe';
import Settings from './app/screens/Settings';
import AddOrEditUserRecipe from './app/screens/AddOrEditUserRecipe';
import NewUser from './app/screens/NewUser';
import ConfirmOTP from './app/screens/ConfirmOTP';
import Explore from './app/screens/Explore';
import EditButton from './app/components/EditButton';
import ShoppingLists from './app/screens/ShoppingLists';
import './globals';
import { AuthContext } from './Contexts';
import List from './app/screens/List';
import RightHeaderButton from './app/components/RightHeaderButton';
import * as SplashScreen from 'expo-splash-screen';
import Session from '@supabase/supabase-js'

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const LoggedInDrawer = createDrawerNavigator();

const MainAppTabs = createBottomTabNavigator();

const LoggedOutStack = createNativeStackNavigator();

function LeftButton() {
  const route = useRoute();
  const navigation = useNavigation();
  const screen = route.name;
  const renderBack = screen === 'Add a recipe' || screen === 'Recipe' || screen === 'Shopping Lists' || screen === 'List';
  const prevScreen = route.params?.prevScreen || 'Home';
  const editing = screen === 'Add a recipe' && route.params?.recipe;
  
  return (
  renderBack ? (
    editing ?
      <HeaderBackButton tintColor='#FFF' onPress={() => navigation.navigate(prevScreen, {prevScreen: 'Your recipes', recipe: route.params.recipe})} />
    :
      <HeaderBackButton tintColor='#FFF' onPress={() => navigation.navigate(prevScreen)} />
  ) : (
    <DrawerToggleButton tintColor='#FFF'/>
  )
)
}

function RightButton() { 
  const route = useRoute();
  const navigation = useNavigation();
  const screen = route.name;

  const session = useContext(AuthContext);
  const isOwnRecipe = route.params?.recipe?.user_id == session.user.id;

  if (screen === 'Recipe' && isOwnRecipe) {
    return <EditButton nav={navigation} target={"Add a recipe"} params={{prevScreen: "Recipe", recipe: route.params.recipe}}/>
  } else if (screen === 'Shopping Lists') {
    return <RightHeaderButton navigation={navigation} target="List" prevScreen="Shopping Lists"/>
  } else if (screen === 'Your recipes') {
    return <RightHeaderButton navigation={navigation} target="Add a recipe" prevScreen="Your recipes"/>
  } else if (screen === 'Home') {
    return <RightHeaderButton navigation={navigation} icon='list' target="Shopping Lists" prevScreen="Home"/>
  } else {
    return <></>
  }
}

//react native navigation doesnt do well with back buttons for nested navigators, so we flatten the stack
//and hide the buttons for add recipe/edit recipe/recipe view
//Problem: tab button no longer highlighted on these screens
function TabsStack() {
  return (
    <MainAppTabs.Navigator
    screenOptions={{
      animation: 'shift',
      headerTitle: () => <LogoTitle />,
      headerTitleAlign: 'left',
      headerStyle: {backgroundColor: '#181818'},
      headerShadowVisible: false,
      headerTintColor: '#fff',
      headerLeft: () => <LeftButton />,
      tabBarStyle: {backgroundColor:'#181818', borderTopWidth:0},
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#B3B3B3',
      tabBarHideOnKeyboard: true,
      headerRight: () => <RightButton />
    }}
    >
      <MainAppTabs.Screen name="Home" component={Home}
      options={{
        tabBarIcon: ({focused}) => {
          return (
            focused ? (
            <Image 
            style={{width: 25, height: 25}}
            source={require('./assets/calendar.png')}
            />
          ) : (
            <Image 
            style={{width: 25, height: 25}}
            source={require('./assets/calendar_inactive.png')}
            />
          )
          )
        }
      }}
      /> 
      <MainAppTabs.Screen name="Shopping Lists" component={ShoppingLists} options={{
        tabBarButton: () => null
      }}/>
      <MainAppTabs.Screen name="List" component={List} options={{
        tabBarButton: () => null,
        unmountOnBlur: true
      }}/>
      <MainAppTabs.Screen name="Your recipes" component={UserRecipes} 
      options={{
        tabBarIcon: ({focused}) => {
          return (
            focused ? (
            <Image 
            style={{width: 25, height: 25}}
            source={require('./assets/book.png')}
            />
          ) : (
            <Image 
            style={{width: 25, height: 25}}
            source={require('./assets/book_inactive.png')}
            />
          )
          )
        }
      }}
      />
      <MainAppTabs.Screen name="Add a recipe" component={AddOrEditUserRecipe} options={{
        tabBarButton: () => null,
        unmountOnBlur: true
      }} />
      <MainAppTabs.Screen name="Recipe" component={Recipe} options={{
        tabBarButton: () => null,
        unmountOnBlur: true
      }} />
      <MainAppTabs.Screen name="Explore" component={Explore}
      options={{
        tabBarIcon: ({focused}) => {
          return (
            focused ? (
            <Image 
            style={{width: 25, height: 25}}
            source={require('./assets/chef_hat.png')}
            />
          ) : (
            <Image 
            style={{width: 25, height: 25}}
            source={require('./assets/chef_hat_inactive.png')}
            />
          )
          )
        }
      }}
      />
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
  const [appIsReady, setAppIsReady] = useState(false);
  const [session, setSession] = useState(null);
  
  useEffect(() => {
     supabase.auth.onAuthStateChange((event, session) => {
      if (event == 'SIGNED_OUT') {
        setSession(null)
        setAppIsReady(true)
      } else { 
        setSession(session)
        setAppIsReady(true);
      }
    })
  }, [])

  if(appIsReady) {
    SplashScreen.hide();
  }

  if(!appIsReady) {
    return(null)
  }

  return (
    <AuthContext.Provider value={session}>
      <NavigationContainer theme={DarkTheme}>
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

