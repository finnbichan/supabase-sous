import { supabase } from './supabase';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerToggleButton} from '@react-navigation/drawer';
import { HeaderBackButton } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, useColorScheme } from 'react-native';
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
import { LightTheme, CustomDarkTheme } from './app/styles/Colours';
import { useTheme } from '@react-navigation/native';
import { createPortal } from 'react-dom';

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
  const { colours } = useTheme();
  return (
  renderBack ? (
    editing ?
      <HeaderBackButton tintColor={colours.text} onPress={() => navigation.navigate(prevScreen, {prevScreen: 'Your recipes', recipe: route.params.recipe})} />
    :
      <HeaderBackButton tintColor={colours.text} onPress={() => navigation.navigate(prevScreen)} />
  ) : (
    <DrawerToggleButton tintColor={colours.text}/>
  )
)
}

function RightButton() { 
  const route = useRoute();
  const navigation = useNavigation();
  const screen = route.name;

  const session = useContext(AuthContext);
  const isOwnRecipe = route.params?.recipe?.user_id == session.user.id;

  /*if (screen === 'Recipe' && isOwnRecipe) {
    return <EditButton nav={navigation} target={"Add a recipe"} params={{prevScreen: "Recipe", recipe: route.params.recipe}}/>
  } else */
  if (screen === 'Shopping Lists') {
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
  const { assets, colours } = useTheme();
  return (
    <MainAppTabs.Navigator
    screenOptions={{
      animation: 'shift',
      headerTitle: () => <LogoTitle />,
      headerTitleAlign: 'center',
      headerStyle: {backgroundColor: colours.card},
      headerShadowVisible: false,
      headerTintColor: colours.text,
      headerLeft: () => <LeftButton />,
      tabBarStyle: {backgroundColor: colours.card, borderTopWidth:0},
      tabBarActiveTintColor: colours.text,
      tabBarInactiveTintColor: colours.secondaryText,
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
            source={assets.calendar}
            />
          ) : (
            <Image 
            style={{width: 25, height: 25}}
            source={assets.calendar_inactive}
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
        unmountOnBlur: true,
      }}/>
      <MainAppTabs.Screen name="Your recipes" component={UserRecipes} 
      options={{
        tabBarIcon: ({focused}) => {
          return (
            focused ? (
            <Image 
            style={{width: 25, height: 25}}
            source={assets.book}
            />
          ) : (
            <Image 
            style={{width: 25, height: 25}}
            source={assets.book_inactive}
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
            source={assets.chef_hat}
            />
          ) : (
            <Image 
            style={{width: 25, height: 25}}
            source={assets.chef_hat_inactive}
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
  const { assets, colours } = useTheme();
  return (
      <LoggedInDrawer.Navigator
      screenOptions={{
        drawerStyle: {backgroundColor: colours.card},
      drawerLabelStyle: {color: colours.text},
      drawerActiveBackgroundColor: '#00AEFF'
      }}>
        <LoggedInDrawer.Screen name="sous" component={TabsStack} options={{headerShown: false}}/>
        <LoggedInDrawer.Screen name="Settings" component={Settings} options={{
      headerTitle: () => <LogoTitle />,
      headerTitleAlign: 'left',
      headerStyle: {backgroundColor: colours.card},
      headerShadowVisible: false,
      headerTintColor: colours.text,
      headerLeft: () => <LeftButton />
    }}/>
      </LoggedInDrawer.Navigator>
  )
};

function AnonStack() {
  const { colours } = useTheme();
  return (
    <LoggedOutStack.Navigator 
      initialRouteName='NewUser'
      screenOptions={{
        headerTitle: () => <LogoTitle />,
        headerTitleAlign: 'center',
        headerStyle: {backgroundColor: colours.card},
        headerShadowVisible: false,
        headerTintColor: colours.card 
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
  const { assets } = useTheme();
  return (
    <Image
      style={{ width: 120, height: 50}}
      source={assets.sous_transparent}
    />
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [session, setSession] = useState(null);
  const scheme = useColorScheme();

  console.log(scheme)
  
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
      <NavigationContainer theme={scheme === 'dark' ? CustomDarkTheme : LightTheme}>
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

