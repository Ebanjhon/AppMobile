import { NavigationContainer } from "@react-navigation/native";
import Login from "./Screens/Login/Login";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./Screens/Home/Home";
import Chat from "./Screens/Chat/Chat"
import Profile from "./Screens/Profile/Profile"
import Register from "./Screens/Register/Register";
import Post from "./Screens/PostDetail/Post"
import Course from "./Screens/CourseDetail/CourseDetail";
import ClassDetail from "./Screens/Class_Teacher/ClassDetail";
import { FontAwesome5, Entypo, FontAwesome } from '@expo/vector-icons';
import React, { createContext, useReducer, useState } from "react";
import userReducer from "./config/MyUserReducer";
import MyConText from "./config/MyConText";
import AddScores from "./Screens/InoutScores/InputScores";
import ShowListStudent from "./Screens/ShowListStudent/ShowList";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator()

// nhom stak nav
function StackGroup() {

    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="Course" component={Course} />
            <Stack.Screen name="ClassDetail" component={ClassDetail} />
            <Stack.Screen name="Post" component={Post} />
            <Stack.Screen name="AddScores" component={AddScores} />
            <Stack.Screen name="ShowListStudent" component={ShowListStudent} />
        </Stack.Navigator>
    )
}

// nhom bottom nav
function TabGroup() {

    return (
        <Tab.Navigator screenOptions={({ route, navigation }) => ({
            tabBarIcon: ({ color, focused, size }) => {
                let iconName;
                if (route.name === 'StackGroup') {
                    iconName = "home";
                    return <FontAwesome5 name={iconName} size={size} color={color} />
                } else if (route.name === 'Chat') {
                    iconName = "chat";
                    return <Entypo name={iconName} size={size} color={color} />
                } else if (route.name === 'Profile') {
                    iconName = "user";
                    return <FontAwesome name={iconName} size={size} color={color} />
                }
                return <FontAwesome name={iconName} size={size} color={color} />
            },
        })}

        >
            <Tab.Screen name="StackGroup"
                component={StackGroup}
                options={{ headerShown: false, tabBarLabel: "Home" }}
            />
            <Tab.Screen name="Chat" component={Chat}
            />
            <Tab.Screen name="Profile" component={Profile}
                options={{ headerShown: false }}
            />
        </Tab.Navigator>

    )
}

// const UserContext = createContext()

export default function navigation() {

    const [user, dispatch] = useReducer(userReducer)
    return (


        <MyConText.Provider value={[user, dispatch]}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Login'>
                    <Stack.Screen name="Nav" component={TabGroup} options={{ headerShown: false }} />
                    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                    <Stack.Screen name="Register" component={Register} />
                </Stack.Navigator>
            </NavigationContainer>
        </MyConText.Provider>

    )
}
