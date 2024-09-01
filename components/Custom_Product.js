import React, {Component}from 'react';
import { Text, View, TouchableOpacity, Alert, StyleSheet,Dimensions, TextInput, FlatList, Modal, Image} from 'react-native';


const widthscreen = Dimensions.get('screen').width;
const itemspace = 10;
const widthrow = (widthscreen - 5 * itemspace) / 2;
const ratio = 999/ 1000;




const ProductImg = props =>{
    //console.log(props);
    const {isProductPage}=props;

    const imgstyle = isProductPage ? {
        width: widthscreen,
        height: widthscreen / ratio,
    } : {};

    return <View >
     
     <Image source={props.imageSource} 
     style={[styles.image, imgstyle]}
     />
     </View>
};




const styles = StyleSheet.create({
    image: {
        marginTop:20,
		width: widthrow,
        height: widthrow / ratio,
    },
});

export default ProductImg;