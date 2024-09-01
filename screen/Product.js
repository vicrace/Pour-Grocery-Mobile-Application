import React, {useState, useEffect} from 'react';
import { Text, View, TouchableOpacity , Alert, StyleSheet,Dimensions, TextInput, FlatList, Modal,Image} from 'react-native';
import SimpleSelectButton from 'react-native-simple-select-button';
import { StatusBar } from 'expo-status-bar';
import {CheckButton, FeeDisplay} from '../components/Custom_Pay';
import ProductImg from '../components/Custom_Product';
import GlobalStyle from '../components/GlobalStyle';
import { LinearGradient } from 'expo-linear-gradient';
import NumericInput from 'react-native-numeric-input';
let ImgImport = require('../imgImport');

const widthscreen = Dimensions.get('screen').width;
const itemspace = 10;
const widthrow = (widthscreen - 3 * itemspace) / 2;
const ratio = 3 / 4;

const Product = ({route,navigation}) => {

  const[quan,setQuan] = useState(1);

  function loadCart(id){
    
   //const cartObj = {id,quan}
   Aitem['qty'] = quan;
    if(global.cart.length==0){
           
      global.cart.push(Aitem);
      
    }
      
    else{//alr have item
      var index = global.cart.findIndex(obj => obj.id === id);
      if(index!==-1){
        global.cart[index]['qty']+=quan;
      }
      else{
        global.cart.push(Aitem);
        
      }
    }
    global.refresh = true;
  }
  
  const {Aitem} = route.params;
  return (
    <View style={{backgroundColor:'rgb(239, 235, 233)', flex: 1}}>
      <LinearGradient
        // Background Linear Gradient
        colors={['rgb(245, 245, 245)', 'transparent']}
        style={styles.background}
      >

      <ProductImg
        isProductPage
        imageSource={ImgImport.images[Aitem.id-1]}
      />

      <View style={styles.prodDetails}>

        <Text style={styles.name}>
           {Aitem.name} 
        </Text>

        <Text style={styles.price}>
          RM {Aitem.price.toFixed(2)}
        </Text>

      
      
      <TextInput style={styles.proddesc}
      multiline editable={false}
      >
        Category : {Aitem.category}
      </TextInput>

      {/* the quantity bar at here - i didn't do styling */}
      <NumericInput 
            value={quan} 
            onChange={prod=>setQuan(prod)} 
            minValue = {1}
            initValue = {quan}
            type='up-down'

            totalWidth={240} 
            totalHeight={50} 
            iconSize={25}
            step={1.5}
            valueType='integer'
            textColor='#B0228C' 
            iconStyle={{ color: 'white' }} 
            upDownButtonsBackgroundColor = 'black'
            rightButtonBackgroundColor='#EA3788' 
            leftButtonBackgroundColor='#E56B70'
      />

      </View>
      <CheckButton center={widthscreen/2}
        label={"Add To Cart"}
        onPress={() => [Alert.alert("Item Added"),navigation.goBack(), loadCart(Aitem.id)]}
        bcolor="#fafafa"
        tcolor="black"
        icon="shopping-bag"
        isize={27}
        i
      />     
      </LinearGradient>
      
    </View>
  );
};

const styles = StyleSheet.create({
	
    prodDetails:{
      marginLeft:30,
      paddingBottom:30,
    },

    name: {
      fontWeight: 'bold',
      marginTop: 10,
      fontSize: 27,
      color: '#161925',
      width:widthscreen,
    },
    background: {
    position: 'absolute',
    left: 0,
    right: 150,
    top: 0,
    height: Dimensions.get("screen").height,
    width: widthscreen/2,
    },
    
    price: {
        marginTop: 5,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e90ff',
        width: widthscreen,
        
    },
    proddesc: {
        height:50,
        marginTop: 1,
        fontWeight: '200',
        marginBottom:1,
        fontSize: 20,
        color: '#94989f',
        width: widthscreen-20,
    },
});
export default Product;