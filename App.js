import React, { useState , useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Payment from './screen/Payment';
import Product from './screen/Product';
import EditAccount from './screen/EditAccount';
import Account from './screen/Account';
import LoginScreen from './screen/LoginScreen';
import RegisterScreen from './screen/RegisterScreen';
import {UserTabNavigator, AdminTabNavigator, getHeaderTitle} from './screen/NavigationScreen';
import { NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { theme } from './core/theme';
import { Provider } from 'react-native-paper';

const Stack = createStackNavigator();

const myTheme = {
    colors:{
      backgroundColor: '#EEEEEE',
    },
}

console.disableYellowBox = true;

const App = (props) => {

  return (
    <Provider theme={theme}>
      <NavigationContainer theme={myTheme}>
      <Stack.Navigator>
      
        <Stack.Screen name="LoginScreen" component={LoginScreen}
          options={() => ({
            headerStyle:{backgroundColor: '#EEEEEE'},
            headerTitleStyle:{
              fontWeight: 'bold',
              alignSelf: 'center',
              fontSize: 20,
            },
            headerLeft : null,
          })
        }
        />

        <Stack.Screen name="RegisterScreen" component={RegisterScreen}
          options={() => ({
            headerStyle:{backgroundColor: '#EEEEEE'},
            headerTitleStyle:{
              fontWeight: 'bold',
              alignSelf: 'center',
              fontSize: 20,
            },
            headerLeft : null,
          })
        }
        />

        <Stack.Screen name="UserTabNavigator" component={UserTabNavigator} 
          options={({route}) => ({
            headerTitle: getHeaderTitle(route),
            headerStyle:{backgroundColor: '#EEEEEE'},
            headerTitleStyle:{
                fontWeight: 'bold',
                alignSelf: 'center',
                fontSize: 20,
              },
            headerLeft : null,
            })
          } 
        />

        <Stack.Screen name="AdminTabNavigator" component={AdminTabNavigator} 
          options={({route}) => ({
            headerTitle: getHeaderTitle(route),
            headerStyle:{backgroundColor: '#EEEEEE'},
            headerTitleStyle:{
                fontWeight: 'bold',
                alignSelf: 'center',
                fontSize: 20,
              },
            headerLeft : null,
            })
          } 
        />

        <Stack.Screen name="Payment" component={Payment}
          options={() => ({
            headerStyle:{backgroundColor: '#EEEEEE'}})}
        />
        <Stack.Screen name="Product" component={Product}
          options={() => ({
            headerStyle:{backgroundColor: '#EEEEEE'}})}
        />
        <Stack.Screen name="EditAccount" component={EditAccount}
          options={() => ({
            headerTitle:"Edit Account",
            headerStyle:{backgroundColor: '#EEEEEE'}})}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
};



export default App;
