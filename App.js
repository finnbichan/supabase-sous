import { supabase } from './supabase';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerToggleButton} from '@react-navigation/drawer';
import { HeaderBackButton } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, useColorScheme } from 'react-native';
import { useState, useEffect, createContext, useContext } from 'react';
import Home from './app/screens/Home';
import Onboarding from './app/screens/Onboarding';
import UserRecipes from './app/screens/UserRecipes';
import Recipe from './app/screens/Recipe';
import Settings from './app/screens/Settings';
import Profile from './app/screens/Profile';
import MealHistory from './app/screens/MealHistory';
import AddOrEditUserRecipe from './app/screens/AddOrEditUserRecipe';
import NewUser from './app/screens/NewUser';
import ConfirmOTP from './app/screens/ConfirmOTP';
import EditButton from './app/components/EditButton';
import ShoppingLists from './app/screens/ShoppingLists';
import './globals';
import { AuthContext, CacheContext, ProfileContext } from './Contexts';
import List from './app/screens/List';
import RightHeaderButton from './app/components/RightHeaderButton';
import * as SplashScreen from 'expo-splash-screen';
import { LightTheme, CustomDarkTheme } from './app/styles/Colours';
import { useTheme } from '@react-navigation/native';
import { BackHandler } from 'react-native';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const LoggedInDrawer = createDrawerNavigator();

const MainAppTabs = createBottomTabNavigator();

const LoggedOutStack = createNativeStackNavigator();

function LeftButton() {
  const route = useRoute();
  const navigation = useNavigation();
  const screen = route.name;
  const renderBack = screen === 'Add a recipe' || screen === 'Recipe' || screen === 'List';
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
      headerShown: false,
      headerTitleAlign: 'center',
      headerStyle: {backgroundColor: colours.card},
      headerShadowVisible: false,
      headerTintColor: colours.text,
      headerLeft: () => <LeftButton />,
      //tabBarStyle: {backgroundColor: colours.card, borderTopWidth:0},
      tabBarActiveTintColor: colours.text,
      tabBarInactiveTintColor: colours.secondaryText,
      tabBarHideOnKeyboard: true,
      headerRight: () => <RightButton />
    }}
    >
      <MainAppTabs.Screen name="Home" component={Home}
      options={{
        headerTitle: () => <LogoTitle />,
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
      <MainAppTabs.Screen name="Recipes" component={UserRecipes} 
      options={{
        headerShown: false,
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
        tabBarItemStyle: { display: 'none' },
        unmountOnBlur: true
      }} />
      <MainAppTabs.Screen name="Recipe" component={Recipe} options={{
        tabBarButton: () => null,
        tabBarItemStyle: { display: 'none' },
        unmountOnBlur: true
      }} />
      <MainAppTabs.Screen name="List" component={List} options={{
        tabBarIcon: ({focused}) => {
          return (
            focused ? (
            <Image 
            style={{width: 25, height: 25}}
            source={assets.list}
            />
          ) : (
            <Image 
            style={{width: 25, height: 25}}
            source={assets.list_inactive}
            />
          )
          )
        }
      }}/>
    </MainAppTabs.Navigator>
  );
}

function LoggedInStack({ route }) {
  const isNewUser = route.params?.isNewUser || false;
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={isNewUser ? "Onboarding" : "Main"}>
        <Stack.Screen name="Onboarding" component={Onboarding} options={{headerShown: false}}/>
        <Stack.Screen name="Main" component={MainStack} options={{headerShown: false}}/>
    </Stack.Navigator>
  )
};

function MainStack() {
  const { assets, colours } = useTheme();
  const [cache, setCache] = useState();
  const route = useRoute();
  const navigation = useNavigation();


  function handleBack() {
    const prevScreen = route.params?.prevScreen || 'Home';
    console.log(route.params)
    navigation.navigate(prevScreen)
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack)
    return () => backHandler.remove()
  }, [])

  return (
    <CacheContext.Provider value={{cache, setCache}}>
        <LoggedInDrawer.Navigator
        screenOptions={{
          drawerStyle: {backgroundColor: colours.card},
          drawerLabelStyle: {color: colours.text},
          drawerActiveBackgroundColor: '#00AEFF',
          drawerPosition: 'right'
        }}>
          <LoggedInDrawer.Screen name="sous" component={TabsStack} options={{headerShown: false, title: 'Home'}}/>
          <LoggedInDrawer.Screen name="Profile" component={Profile} options={{headerShown: false, title: 'Profile & Preferences'}}/>
          <LoggedInDrawer.Screen name="Meal History" component={MealHistory} options={{headerShown: false}}/>
          <LoggedInDrawer.Screen name="Settings" component={Settings} options={{headerShown: false}}/>
        </LoggedInDrawer.Navigator>
      </CacheContext.Provider>
  )
};

function AnonStack() {
  const { colours } = useTheme();
  return (
    <LoggedOutStack.Navigator 
      initialRouteName='Sign up'
      screenOptions={{
        headerTitle: () => <LogoTitle />,
        headerTitleAlign: 'center',
        headerStyle: {backgroundColor: colours.card},
        headerShadowVisible: false,
        headerTintColor: colours.card 
      }}
      >
      <LoggedOutStack.Screen name="Sign up" component={NewUser}/>
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
  const [profile, setProfile] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const scheme = useColorScheme();

  console.log(scheme)
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setSession(null)
        setProfile(null)
        setIsNewUser(false)
      } else if (session) {
        const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url, dietary, allergies, dislikes, portion_size')
        .eq('id', session.user.id)
        .single()

        if (!profile?.display_name) {
          setIsNewUser(true)
        } else {
          setIsNewUser(false)
        }

        setProfile(profile)
        setSession(session)
      }

      setAppIsReady(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (appIsReady) SplashScreen.hide() 
  }, [appIsReady])

  if (!appIsReady) return null;

  return (
    <AuthContext.Provider value={session}>
      <ProfileContext.Provider value={{profile, setProfile}}>
        <NavigationContainer theme={scheme === 'dark' ? CustomDarkTheme : LightTheme}>
          <Stack.Navigator 
          options={{headerShown: false}}
          >
            {session ? (
              <Stack.Screen name="LoggedIn" component={LoggedInStack} initialParams={{ isNewUser }} options={{headerShown: false}}/>
            ) : (
              <Stack.Screen 
                name='AnonUser'
                component={AnonStack}
                options={{headerShown: false}}
                />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ProfileContext.Provider>
    </AuthContext.Provider>
  );
}
