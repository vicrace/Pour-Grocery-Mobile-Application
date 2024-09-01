import React, { useState } from 'react';
import { Button, View, StyleSheet, TouchableOpacity, Alert, Image} from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import { emailValidator } from '../helpers/emailValidator';
import { passwordValidator } from '../helpers/passwordValidator';
import { nameValidator } from '../helpers/nameValidator';
import { addressValidator } from '../helpers/addressValidator';
import LoginScreen from './LoginScreen';
import {CheckButton} from '../components/Custom_Pay';
import COLORS from '../consts/colors';
export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' })
  const [address, setAddress] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const addressError = addressValidator(address.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError || nameError || addressError) {
      setName({ ...name, error: nameError })
      setAddress({ ...address, error: addressError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }

    return fetch("http://10.0.2.2:5000/api/user", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
          username : name.value,
          email : email.value,
          password : password.value,
          address : address.value,
        })
    })
     .then(res => res.json())
     .then((responseJson) => {
          if(responseJson.affected > 0) {
              Alert.alert('Successfully Registered!');
              navigation.navigate("LoginScreen")
          }
     })
      .catch((error) =>{
        console.log(error)
        Alert.alert('Registration Failed. Same email has been used by someone.');
      })
  }

  return (
    <Background>
      <TouchableOpacity onPress={()=>{navigation.navigate("LoginScreen")}} style={styles.container}>
      <Image
        style={styles.image}
        source={require('../assets/arrow_back.png')}
      />
    </TouchableOpacity>
      <Logo/>
      <Header>Register Account</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="next"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <TextInput
        label="Address"
        returnKeyType="done"
        value={address.value}
        onChangeText={(text) => setAddress({ value: text, error: '' })}
        error={!!address.error}
        errorText={address.error}
      />
      <CheckButton 
            label={"CREATE ACCOUNT"}
            icon="user-alt"
            isize={30}
            icolor="white"
            onPress={onSignUpPressed}
            bcolor={COLORS.blue}
            tcolor={COLORS.white}
        />
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 20,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  container: {
    position: 'absolute',
    top: 10 + getStatusBarHeight(),
    left: 4,
  },
  image: {
    width: 24,
    height: 24,
  },
})