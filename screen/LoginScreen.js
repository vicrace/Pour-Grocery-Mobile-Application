import React, { useState , useEffect } from 'react'
import { TouchableOpacity, StyleSheet, View , Alert, Image} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import RegisterScreen from './RegisterScreen';
import Account from './Account'
import {CheckButton} from '../components/Custom_Pay';
import COLORS from '../consts/colors';

export default function LoginScreen({ navigation }) {

  useEffect(() => {
    load()
  },[])

  const [setting1value, setSetting1value] = useState('initialValue1');
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  function goRegScreen(){
    console.log("Already reg");
    navigation.navigate("RegisterScreen");
  }

  function login(){
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }

    return fetch("http://10.0.2.2:5000/api/user", {
    method:'GET', 
    headers:{
      Accept:'application/json', 
      'Content-Type':'application/json'
      }
  })
  .then(res => res.json())
  .then(data => {  
    var i =data.length;
    var found = false;
    while(i--){
      if(data[i].email == email.value && data[i].password == password.value && email.value!="admin@gmail.com"){
        global.userid = data[i].id;
        global.address = data[i].address;
        global.refresh  = false;
        let ImgImport = require('../imgImport')
        global.category = ImgImport.categoryImg
        global.product = ImgImport.images

        if( global.catData.length === 7){
          global.category[global.category.length] = ImgImport.cat7
        }

        global.cart= []
        global.cartQuan=[]
        navigation.navigate("UserTabNavigator");
        found = true;
        break;
      }

      else if(data[i].email == email.value && email.value == "admin@gmail.com" && data[i].password == password.value && password.value == "admin1234" ){
        global.userid = data[i].id;
        global.address = data[i].address;

        let ImgImport = require('../imgImport')
        global.category = ImgImport.categoryImg
        global.product = ImgImport.images
        
        navigation.navigate("AdminTabNavigator");
        found = true;
        break;
      }
    }
    if(found==false){
      Alert.alert("User does not exist. Please try again or register an Account.");
      navigation.reset({
        routes: [{ name: 'LoginScreen' }],
      })
    }
  })
  .catch((error) =>{
    console.log(error)
  })
}

  function load(){
    global.catData = []
    return fetch("http://10.0.2.2:5000/api/cat")
    .then(res => res.json())
    .then(data => { 
      global.catData = data;
      
    })
    .catch((error) =>{
      console.log(error)
    })
  }

  return (
    <Background>
      <Logo />
      <Header>Login Here.</Header>
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
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <CheckButton 
            label={"LOGIN ACCOUNT"}
            icon="sign-in-alt"
            isize={25}
            icolor="white"
            onPress={login}
            bcolor={COLORS.blue}
            tcolor={COLORS.white}
            />
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  }
})