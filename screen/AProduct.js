import React, {useState, useEffect} from 'react';
import { Text, View, FlatList,StyleSheet,Icon, KeyboardAvoidingView,Image, Modal, TextInput,TouchableOpacity, Dimensions, Alert, ScrollView, Picker} from 'react-native';
import { SearchBar } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import GlobalStyle from '../components/GlobalStyle';
import * as ImagePicker from 'expo-image-picker';
import ProductImg from '../components/Custom_Product';
import {CheckButton, FeeDisplay} from '../components/Custom_Pay';


let ImgImport = require('../imgImport');

const AProduct = ({ navigation }) => {
  {/*This variable is to save data */}
  const[prodData, setProdData] = useState([]);

  {/*This is for modal */}
  const[showProdEdit,setShowProdEdit] = useState(false);
  const[showProdAdd,setShowProdAdd] = useState(false);
  const[showProdView,setShowProdView] = useState(false);

  {/*This is for list render */}
  const[isProdRender, setProdRender] = useState(false);

  {/*This is for list render */}
  const[isRender, setRender] = useState(false);

  {/*This to save the edit id for reference, another is to store data */}
  const[editProd, setProd] = useState();
  const[inputNameText,setInputName] = useState();
  const[inputPriceText,setInputPrice] = useState();
  const[inputCategoryText,setInputCategory] = useState();
  const[inputDescText,setInputDesc] = useState();


  {/*This to save the search reference*/}
  const[prodSearch, setProdSearch] = useState(null);
  const[filteredProd, setFilterProd] = useState(prodData);

  {/*This to add new cat*/}
  const[addProdCat, setAddProdCat] = useState('');
  const[addProdName, setProdAddName] = useState('');
  const[addProdPrice, setProdAddPrice] = useState('');
  const[addProdDesc, setProdAddDesc] = useState('');


 {/*This to open the pop up edit*/}
  const PressProdEdit = (prod) => {
    setShowProdEdit(true);
    setInputName(prod.name)
    setInputPrice(''+prod.price)
    setInputCategory(prod.category)
    setInputDesc(prod.description)
    setProd(prod.id)
    
    
  } 
  
  const catList = () =>{    
    const categories =[];
    for(var i = 0;i<global.catData.length;i++){
      categories.push(global.catData[i].name);
    }
    
    
    return( categories.map((x,i) => { 
      return( <Picker.Item label={x} key={i} value={x}  />)} ));
  }
  
  const PressProdView = (prod) => {
    setShowProdView(true);
    setInputName(prod.name)
    setInputPrice('' +prod.price)
    setInputCategory(prod.category)
    setInputDesc(prod.description)
    setProd(prod.id)
  }

 {/*This to save the edited data*/}
  const handleProdEdit = (editProd) =>{
    const newProdInfo  = prodData.map(prod =>{
      if(prod.id == editProd){
        prod.name = inputNameText;
        prod.price = Number(inputPriceText);
        prod.category = inputCategoryText;
        prod.description = inputDescText;
 
        editProduct(prod.id,prod.name,prod.category,prod.price,prod.description);
        return prod;
      }
      return prod;
    })
    
    setProdData(newProdInfo);
    setProdRender(!isProdRender);
  }

  
  const PressProdSave = () => {
    if(!inputCategoryText || !inputNameText || !inputPriceText || !inputDescText){
      Alert.alert("REMINDER","Please make user no empty field...");
      return;
    }

    handleProdEdit(editProd);
    setShowProdEdit(false)
  };

  {/*This to add the add data*/}
  const PressProdAdd = () => {
    if(!addProdCat || !addProdName || !addProdPrice || !addProdDesc){
      Alert.alert("REMINDER","Please make user no empty field...");
      return;
    }
    
    let lastProd = prodData[prodData.length-1]
    
    var newProdArr = [...prodData,{id:lastProd.id+1, name: addProdName, price:addProdPrice,category:addProdCat, description:addProdDesc}];

    addProd(addProdName,addProdCat,addProdPrice,addProdDesc)
    global.product[global.product.length] = ImgImport.img7;
    setProdData(newProdArr);
    setFilterProd(newProdArr);
    setProdRender(true);
    setShowProdAdd(false);
    setAddProdCat('');
    setProdAddName('');
    setProdAddPrice('');
    setProdAddDesc('');
    
  };

  {/*This to delete the data*/}
  const PressProdDel = (id) => {
    let prodArr = prodData.filter(function(prod){
      return prod.id !== id
    })
    deleteProd(id);
    setProdData(prodArr);
    setFilterProd(prodArr);
    setProdRender(true);
  }

  {/*This to filter the data*/}
  const prodSearchFilter = (search) => {
    if (search) {
      const searchedData = prodData.filter(function (prod) {
        const prodCat = prod.category
          ? prod.category.toUpperCase()
          : ''.toUpperCase();
        const prodName = prod.name
          ? prod.name.toUpperCase()
          : ''.toUpperCase();

        const modifiedSearch = search.toUpperCase();
        return (prodCat.indexOf(modifiedSearch) > -1 || prodName.indexOf(modifiedSearch) > -1);
      });
      setFilterProd(searchedData);
      setProdSearch(search);
    } else {
      setFilterProd(prodData);
      setProdSearch(search);
    }
  };

  const [image, setImage] = useState(null);
  

  function loadContent(){
    checkForCameraRollPermission()
    loadProd()
    catList()
  }
  useEffect(() => {
    const refresh = navigation.addListener('focus', () => {loadContent()});
    return refresh     
  },[navigation])
 
  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    });
    
    console.log(JSON.stringify(_image));

    if (!_image.cancelled) {
      
      setImage(ImgImport.img7);
      
    }
  };
  
  const  checkForCameraRollPermission=async()=>{
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert("Please grant permission to access to phone gallery!");
      }else{
        console.log('Access to gallery granted.')
      }  
  }

  function loadProd(){
    setProdRender(true)  
    return fetch("http://10.0.2.2:5000/api/grocery", {
    method:'GET', 
    headers:{
      Accept:'application/json', 
      'Content-Type':'application/json'
      }
  })
  .then(res => res.json())
  .then(data => {  
    setProdData(data)
    setFilterProd(data)
  })
  .catch((error) =>{
    console.log(error)
  })
  .finally(() => setProdRender(false))

  }

 

  {/*This to edit category*/} 
  function editProduct(id,prodName,prodCat,prodPrice,prodDesc) {
  return fetch("http://10.0.2.2:5000/api/grocery/" + id, {
   method: 'PUT',
   headers: {
      Accept: 'application/json',
     'Content-Type': 'application/json',
   },
   body: JSON.stringify({ 
      id:id,
      name:prodName,
      category:prodCat,
      price: prodPrice ,
      description:prodDesc 
    })
  })
   .then(res => res.json())
   .then((responseJson) => {
        if(responseJson.affected > 0) {
            Alert.alert('Record Updated', 'Record for `' + prodName + '` has been updated');
        }
        else {
            Alert.alert('Error updating record');
        }
       loadProd()
   })
    .catch((error) =>{
      console.log(error)
    })
  } 

  

  {/*This to add product*/} 
  function addProd(prodName,prodCat,prodPrice,prodDesc) {
  return fetch("http://10.0.2.2:5000/api/grocery", {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      name:prodName,
      category:prodCat,
      price: prodPrice ,
      description:prodDesc 
      })
  })
   .then(res => res.json())
   .then((responseJson) => {
        if(responseJson.affected > 0) {
            Alert.alert('Record Added');
        }
        else {
            Alert.alert('Error updating record');
        }
        loadProd()
   })
    .catch((error) =>{
      console.log(error)
    })
  }

  {/*This to delete category*/} 
  function deleteProd(id) {
    
  return fetch("http://10.0.2.2:5000/api/grocery/" + id, {
    method: 'DELETE',
    headers: {
        Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
        id : id,
      })
  })
    .then(res => res.json())
    .then((responseJson) => {
          if(responseJson.affected > 0) {
              Alert.alert('Record deleted');
          }
          else {
              Alert.alert('Error updating record');
          }
          loadProd()
    })
      .catch((error) =>{
        console.log(error)
      })
  }



  const renderItem = ({item}) => (
     <View style={styles.item}>
       <ProductImg imageSource={global.product[item.id-1]}/>
      
      <View>
      <Text style={[styles.title,GlobalStyle.customFont_Content]}>{item.name}</Text>
      
      <Text style={[styles.title,GlobalStyle.customFont_Content,{color: '#1e90ff'}]}>RM{item.price}</Text>

      </View>
      <View style={styles.icons}>
      <FontAwesome5 name="pen" style={styles.editbtn} size={17} onPress={() => PressProdEdit(item)}/>
      <FontAwesome5 name="trash" style={styles.delbtn} size={17} onPress={() => [PressProdDel(item.id)]}  />
      <FontAwesome5 name="eye" style={styles.delbtn} size={17} onPress={() => PressProdView(item)}  />
      </View>
    </View>

  ); 

 
  {/*This variable is to save data */}
  
  return (
    

    
    <ScrollView style={[styles.container,GlobalStyle.customBackground]}>

       <View style={{flexDirection:'row',marginVertical:20}}>

        <SearchBar 
          searchIcon={{size:18}}
          onChangeText={(prod) => prodSearchFilter(prod)}
          onClear={(prod) => prodSearchFilter('')}
          placeholder="Search Here"
          value={prodSearch}
          containerStyle={{backgroundColor:'#EEEEEE', flex: 1, borderBottomWidth:0,borderTopWidth:0,}}
          inputStyle={{color:'#455A64',paddingHorizontal:10}}
          style={{backgroundColor:'#ECEFF1',fontSize:16, borderRadius:15}}
          placeholderTextColor={"#90A4AE"}
          inputContainerStyle={{backgroundColor:"#CFD8DC",padding:2}}
        />

        <FontAwesome5 name="plus-circle" style={styles.catAddBtn} size={30} color={"#90CAF9"} onPress={() => [setImage(ImgImport.imgbg),setShowProdAdd(true)]}  />
      </View>
      
        <FlatList
          data={filteredProd}
          renderItem={renderItem}
          keyExtractor={(prod) => prod.id.toString()}
          extraData={isProdRender}
        />

        {/*This modal is for edit */}
      
        <Modal transparent={true} visible={showProdEdit} animationType="fade" onRequestClose={() => setShowProdEdit(false)}>
        <ScrollView>
          <View style={styles.popContainer}>
            <View style={styles.popView}>
                <View style={{flexDirection: 'row', paddingBottom:50}}>
                  <FontAwesome5 name="times" style={styles.closebtn} size={25} onPress={() => setShowProdEdit(false)}/>
                  <Text style={[{left:28, fontWeight:'bold'},GlobalStyle.customFont_Title]}>EDIT PRODUCT</Text>
                </View>
                <Image style={{height:130,width:130, alignSelf:'center'}} source={global.product[editProd-1]}/>
                <Text>Product Name:</Text>
                <TextInput 
                  style={[styles.editBox,GlobalStyle.customFont_Content]} 
                  placeholder="Product Name"
                  defaultValue={inputNameText} 
                  onChangeText={(prod)=> setInputName(prod)}
                  editable={true}
                  multiline={true} 
                />

                <Text>Product Price:</Text>
                <TextInput 
                  style={[styles.editBox,GlobalStyle.customFont_Content]} 
                  placeholder="Product Price"
                  keyboardType = 'numeric'
                  defaultValue={inputPriceText} 
                  onChangeText={(prod)=> setInputPrice(prod)}
                  editable={true}
                  multiline={false} 
                />

                <Text>Product Category:</Text>
              <View style={styles.pickerStyle}>
                <Picker 
                  mode={'dialog'}
                  selectedValue={inputCategoryText}
                  onValueChange={ (prod) => setInputCategory(prod) } >

                  {catList()}  


                </Picker>
              </View>
                <Text>Product Description:</Text>
                <TextInput 
                  style={[styles.editBox,GlobalStyle.customFont_Content]} 
                  placeholder="Product Description"
                  defaultValue={inputDescText} 
                  onChangeText={(prod)=> setInputDesc(prod)}
                  editable={true}
                  multiline={true} 
                />

                <Text>Product Image:</Text>
                 <CheckButton style={styles.catSavebtn}
                    label={"Change Image"}
                    onPress={() => addImage()}
                    bcolor="#fafafa"
                    tcolor="black"
                    icon="camera-retro"
                    isize={27}
                    i
                    
                  />  

                
                <TouchableOpacity onPress={() => PressProdSave() } style={styles.catSavebtn}>
                  <Text style={[styles.catSavetext,GlobalStyle.customFont_Content]}>Save</Text> 
                </TouchableOpacity>
            </View>
          </View>
          </ScrollView>
        </Modal>

        {/*This modal is for view */}
        <Modal transparent={true} visible={showProdView} animationType="fade" onRequestClose={() => setShowProdView(false)}>
        
          <View style={styles.popContainer}>
            <View style={styles.popView}>
                <View style={{flexDirection: 'row', paddingBottom:50}}>
                  <FontAwesome5 name="times" style={styles.closebtn} size={25} onPress={() => setShowProdView(false)}/>
                  <Text style={[{left:28, fontWeight:'bold'},GlobalStyle.customFont_Title]}>VIEW PRODUCT</Text>
                </View>
                 <Image style={{height:130,width:130, alignSelf:'center'}} source={global.product[editProd-1]}/>
                <Text>Product Name:</Text>
                <TextInput 
                  style={[styles.editBox,GlobalStyle.customFont_Content]} 
                  placeholder="Product Name"
                  defaultValue={inputNameText} 
                  onChangeText={(prod)=> setInputName(prod)}
                  editable={false}
                  multiline={true} 
                />

                <Text>Product Price:</Text>
                <TextInput 
                  style={[styles.editBox,GlobalStyle.customFont_Content]} 
                  placeholder="Product Price"
                  keyboardType = 'numeric'
                  defaultValue={inputPriceText} 
                  onChangeText={(prod)=> setInputPrice(prod)}
                  editable={false}
                  multiline={false} 
                />

                <Text>Product Category:</Text>
                <TextInput 
                  style={[styles.editBox,GlobalStyle.customFont_Content]} 
                  placeholder="Product Category"
                  defaultValue={inputCategoryText} 
                  onChangeText={(prod)=> setInputCategory(prod)}
                  editable={false}
                  multiline={false} 
                />

                <Text>Product Description:</Text>
                <TextInput 
                  style={[styles.editBox,GlobalStyle.customFont_Content]} 
                  placeholder="Product Description"
                  defaultValue={inputDescText} 
                  onChangeText={(prod)=> setInputDesc(prod)}
                  editable={false}
                  multiline={true} 
                />
                
              
                
            </View>
          </View>
        </Modal>

        {/*This modal is for Add */}
      <Modal transparent={true} visible={showProdAdd} animationType="fade" onRequestClose={() => setShowProdAdd(false)}>
        <ScrollView>
        <View style={styles.popContainer}>
          <View style={[{maxheight:200}, styles.popView]}>
              <View style={{flexDirection: 'row', paddingBottom:50}}>
                <FontAwesome5 name="times" style={styles.closebtn} size={25} onPress={() => setShowProdAdd(false)}/>
                <Text style={[{left:28, fontWeight:'bold'},GlobalStyle.customFont_Title]}>ADD PRODUCT</Text>
              </View>
              <Image style={{height:130,width:130, alignSelf:'center'}} source={image}/>
              <Text>Product Name:</Text>
              <TextInput 
                style={[styles.editBox,GlobalStyle.customFont_Content]} 
                placeholder="Product Name"
                value={addProdName}
                onChangeText={(input)=> setProdAddName(input)}
                editable={true}
                multiline={true} 
              />

              <Text>Product Price:</Text>
              <TextInput 
                style={[styles.editBox,GlobalStyle.customFont_Content]} 
                placeholder="Product Price"
                value={addProdPrice}
                onChangeText={(input)=> setProdAddPrice(input)}
                editable={true}
                multiline={false} 
              />

              <Text>Product Category:</Text>
              <View style={styles.pickerStyle}>
                <Picker 
                  mode={'dialog'}
                  selectedValue={addProdCat}
                  onValueChange={ (prod) => setAddProdCat(prod) } >

                  {catList()}  


                </Picker>
              </View>

              <Text>Product Description:</Text>
              <TextInput 
                style={[styles.editBox,GlobalStyle.customFont_Content]} 
                placeholder="Product Description"
                value={addProdDesc}
                onChangeText={(input)=> setProdAddDesc(input)}
                editable={true}
                multiline={true} 
              />

              
                <CheckButton style={styles.catSavebtn}
                    label={"Add Image"}
                    onPress={() => [addImage()]}
                    bcolor="#fafafa"
                    tcolor="black"
                    icon="camera-retro"
                    isize={27}
                    i
                  />

              <TouchableOpacity onPress={() => PressProdAdd() } style={styles.catSavebtn}>
                 <Text style={[styles.catSavetext,GlobalStyle.customFont_Content]}>Add</Text> 
              </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </Modal>
      
    </ScrollView>

      


  );

}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal : 5,
    height: Dimensions.get('screen').height,
    paddingBottom: 10,
  },

  icon:{
    flexDirection: 'row',
    flex: 1,
  },

  item: {
    backgroundColor: '#ffffff',
    marginVertical: 8,
    padding:10,
    marginHorizontal: 16,
    flexDirection: 'row',
    flex: 1,
  },

  title: {
    fontSize: 18,
    color: '#424242',
    width: 180,
    flex:1,
    maxWidth:120,
    paddingRight:20,
  },

  editbtn: {
    color: '#80CBC4',
    paddingTop:3,
    
  },

  delbtn: {
    color: '#FFAB91',
    paddingTop:3,
    paddingRight: 7,
  },

  closebtn: {
    color: '#757575',
    left:220,
  },
  pickerStyle:{
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#000000',
    backgroundColor: '#EEEEEE'
  },
  //style for pop up edit
  popContainer:{
    backgroundColor:'#000000aa',
    flex:1,
    alignItems: "center",
  },

  popView:{
   backgroundColor:"#ffffff", 
   marginVertical:18,
   width:350,
   maxHeight:650,
   
   padding:30, 
   flex:1,
  },

  editBox: {
    borderRadius:10,
    height: 50,
    borderBottomColor: '#616161',
    borderBottomWidth: 3,
    fontSize:17,
    textAlign:'center',
    backgroundColor:'#EEEEEE',
  },

  catSavebtn: {
    backgroundColor:'#EEEEEE',
    width: 100,
    borderRadius: 10,
    padding: 7,
    marginTop: 10,
    marginLeft:95,
  },

  catSavetext: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },

  catAddBtn:{
    paddingVertical:20,
    paddingHorizontal:15,
  }
});

export default AProduct;