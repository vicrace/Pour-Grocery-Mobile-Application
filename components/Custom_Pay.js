import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions,Image} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
class CheckButton extends Component {
    constructor(props) {
        super(props);

      if(!props.bcolor){
        props.bcolor = 'black';
      }

      if(!props.tcolor){
        props.tcolor = 'white';
      }
    }

    render() {
        return (
          <View >
          <TouchableOpacity onPress={this.props.onPress ? this.props.onPress : ''}>
            <View style={[styles.checkButton, {backgroundColor:this.props.bcolor, marginLeft:this.props.center}]}>
              <FontAwesome5 name={this.props.icon} color={this.props.icolor} size={this.props.isize} style={styles.icon} />
              <Text style={[styles.checkText,{color:this.props.tcolor}]}>{this.props.label}</Text>
              <Image source={this.props.imageSource} style={[styles.image]}/>
            </View>
          </TouchableOpacity>

          </View>
         
        )
    }
}

class FeeDisplay extends Component {
    constructor(props) {
        super(props);
      
    }
    render() {
        return (
         <View style={styles.amountFormat}>
          <Text style={[styles.amountText,{fontWeight:this.props.isBold}]}>{this.props.label}</Text>
          <TextInput 
            style={[styles.amountTotal,{fontWeight:this.props.isBold}]} 
            value={this.props.amount} editable={false}/>
        </View>
        )
    }
}

const styles = StyleSheet.create({

  checkButton:{
    backgroundColor: 'black',
    width: Dimensions.get('screen').width - 65,
    paddingVertical: 12,
    alignSelf: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    height:50,
    paddingBottom:5,
   
  },
  icon:{
    marginLeft: 60,
  },
  image:{
    width: 35,
    height: 35,
  },

  checkText:{
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft:30,
  },

  amountFormat:{
    flexDirection: 'row',
    paddingLeft: 20,
    justifyContent: 'space-between',
  },

  amountText:{
    fontSize: 15,
  },
  
  amountTotal:{
    marginHorizontal:5,
    fontSize: 15,
    paddingRight:25,
    marginTop:-4,
    color: 'black',
  },
});

module.exports = {
    CheckButton : CheckButton,
    FeeDisplay: FeeDisplay,
}