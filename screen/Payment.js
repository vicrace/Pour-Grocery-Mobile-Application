import React, {useState} from 'react';
import { Text, View, TouchableOpacity , Alert, StyleSheet, TextInput, Dimensions, FlatList, Modal} from 'react-native';
import SimpleSelectButton from 'react-native-simple-select-button';
import { StatusBar } from 'expo-status-bar';
import {CheckButton, FeeDisplay} from '../components/Custom_Pay';
import GlobalStyle from '../components/GlobalStyle';

const Payment = ({route,navigation}) => {
  
  const[show,setShow] = useState(false);
  const[selectpay, setSelectPay] = useState('card');
  const[selectBank, setBank] = useState('');
  const[selectAddress,setAddress] = useState(global.address);
  const {price} = route.params;

  function unloadCart(){
    global.cart=[];
  }

  return (
    <View style={[GlobalStyle.customBackground,{flex:1}]}>
      {/*this is the address part*/}
      <View style={{paddingBottom:10}}>
        <Text style={[GlobalStyle.customFont_Title,styles.ptitle,]}>Address</Text>
        <View style={styles.addressBox}>
          <TextInput style={GlobalStyle.customFont_Content} 
            value={selectAddress} 
            placeholder={'no address'} 
            onChangeText={setAddress}
            dataDetectorTypes={'address'}
            multiline
          />
        </View>

      </View>

      {/*this is the payment part*/}
      <View>
        <Text style={[GlobalStyle.customFont_Title,styles.ptitle]}>Payment Methods</Text>
        <StatusBar/>
        <View style={{width:(Dimensions.get('screen').width - 65), alignSelf:'center'}}>
          <FlatList 
            data={pay_method}
            keyExtractor={item => item.value}
            extraData={selectpay}
            renderItem={
              ({item}) =>
              <SimpleSelectButton
                onPress={()=> [setSelectPay(item.value), 
                item.value === "online" ? setShow(true):[setShow(false),setBank('')]
                ]}
                isChecked ={selectpay === item.value}
                text={item.label}
                textSize={15}
                buttonDefaultColor="#fafafa"
                buttonSelectedColor="#ff9c5b"
                textDefaultColor="#a9a9a9"
                textSelectedColor="#ffffff"
              />
            }
          />
        </View>
      </View>

      {/*this is the hidden online banking*/}
      <Modal transparent={true} visible={show}>
        <View style={styles.popContainer}>
          <View style={styles.popView}>
             <FlatList 
              data={online_bank}
              keyExtractor={item => item.value}
              extraData={selectBank}
              renderItem={
                ({item}) =>
                <SimpleSelectButton
                  onPress={()=> [
                    setBank(item.value), 
                    item.value === "online" ? setShow(true):setShow(false)
                    ]}
                  isChecked ={selectBank === item.value}
                  text={item.label}
                  textSize={15}
                  buttonDefaultColor="#f5f5f5"
                  buttonSelectedColor="#ff9c5b"
                  textDefaultColor="#a9a9a9"
                  tesxtSelectedColor="#fff"
              />
              }
            />
          </View>
        </View>
      </Modal>

      {/*this is the amount part*/}
      <View style={styles.amount}>

        <TextInput style={[styles.amountFormat, {color:'black',fontWeight:'bold'}]} 
          value={selectBank} editable={false}
        />
        <FeeDisplay label={'Shipping Fee (RM)'} amount={'15.00'}/>

        <FeeDisplay label={"Sub Total (RM)"} amount={price}/>

        <FeeDisplay label={"Total (RM)"} amount={((Number(15)+Number(price)).toFixed(2)).toString()} isBold={"bold"}/>
      </View>

      <CheckButton
        label={"Made Payment"}
        onPress={() => [Alert.alert("Payment Successful!"),navigation.navigate("Home"), unloadCart()]}
        bcolor="white"
        tcolor="black"
        icon="money-bill"
        isize={27}
      />
      
    </View>
 
  );
};

const styles = StyleSheet.create({

  //style for title
  ptitle:{
    paddingLeft: 20,
    fontSize:17,
    paddingVertical: 15,
    fontWeight: 'bold',
    paddingBottom:4,
  },

  //style for address box
  addressBox:{
    width:Dimensions.get('screen').width - 40, 
    alignSelf:'center',
    padding:10,
    height:75, 
    borderRadius:6, 
    borderWidth:1, 
    borderColor:'black',
    backgroundColor:"#fafafa",
    borderColor: "#9e9e9e",
    borderBottomWidth:3,
  },

  addressText:{
    fontSize:16,
  },

  //style for pop up online bank
  popContainer:{
    backgroundColor:'#000000aa',
    flex:1,
  },

  popView:{
   backgroundColor:"#ffffff", 
   margin:55, 
   padding:30, 
   flex:1,
  },

  //style for amount part
  amount:{
    paddingVertical: 25,
  },

  amountFormat:{
    flexDirection: 'row',
    paddingLeft: 20,
    justifyContent: 'space-between',
  },

});

const pay_method = [
  { label: "Credit/Debit Card", value: "card" },
  { label: "TouchNGo", value: "tng" },
  { label: "Cash", value: "cash" },
  { label: "Online Banking", value: "online" },
];

const online_bank = [
  { label: "Public Bank", value: "Online : PBB"},
  { label: "Hong Leong Bank", value: "Online : HLB"},
  { label: "RHB Bank", value: "Online : RHB"},
  { label: "Maybank", value: "Online : MBB"},
  { label: "OCBC Bank", value: "Online : OCBC"},
  { label: "Standard Charter", value: "Online : SC"},
  { label: "Ambank", value: "Online : Am"},
  { label: "Bank Rakyat", value: "Online : BR"},
]

export default Payment;
