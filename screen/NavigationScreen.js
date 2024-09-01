import React, {useState} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { getFocusedRouteNameFromRoute, } from '@react-navigation/native';
import Home from './Home';
import Cart from './Cart';
import Account from './Account';
import AProduct from './AProduct';
import ACategory from './ACategory';

const Tab = createBottomTabNavigator();

function getHeaderTitle(route) {

  const routeName = getFocusedRouteNameFromRoute(route) ?? '1';

  switch (routeName) {
    case '1':
      return 'POUR Grocery';
    case 'Home':
      return 'Home';
    case 'Cart':
      return 'Shopping Cart';
    case 'Account':
      return 'My Account';
    case 'AProduct':
      return 'Product';
    case 'ACategory':
      return 'Category';
  }
}

const UserTabNavigator = () => {

  return(
    
      <Tab.Navigator
        tabBarOptions={{
          style: styles.navBar,
          activeTintColor: '#4682b4',
          inactiveTintColor: '#d3d3d3',
          showLabel: false,
        }} 
      >
        <Tab.Screen name="Home" component={Home}
        options={{
           tabBarIcon: ({ color, size }) =>(
              <FontAwesome5 name="home" color={color} size={27} />
           ),
        }}
        />

        <Tab.Screen name="Cart" component={Cart}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="shopping-cart" color={color} size={27} />
            ),
          }}
        />

        <Tab.Screen name="Account" component={Account}
            options={{
              title: 'Account',
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name="user-alt" color={color} size={27} />
              ),
            }}

        />    
      </Tab.Navigator>
  );
};

const AdminTabNavigator = () =>{
  return(
      <Tab.Navigator
        tabBarOptions={{
          style: styles.navBar,
          activeTintColor: '#4682b4',
          inactiveTintColor: '#d3d3d3',
          showLabel: false,
        }} 
      >
        <Tab.Screen name="AProduct" component={AProduct}
        options={{
           tabBarIcon: ({ color, size }) =>(
              <FontAwesome5 name="utensils" color={color} size={27} />
           ),
        }}
        />
         
        <Tab.Screen name="ACategory" component={ACategory}
         options={{
           tabBarIcon: ({ color, size }) =>(
              <FontAwesome5 name="copyright" color={color} size={27} />
           ),
         }}
        />

        <Tab.Screen name="Account" component={Account}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="user-alt" color={color} size={27} />
            ),
            
          }}
        />
        
      </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: '#ffffff',
  },

});

module.exports = {
  UserTabNavigator : UserTabNavigator,
  AdminTabNavigator :AdminTabNavigator,
  getHeaderTitle : getHeaderTitle,
}
