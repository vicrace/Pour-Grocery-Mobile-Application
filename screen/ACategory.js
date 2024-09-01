import React, {useState, useEffect} from 'react';
import { Text, View, FlatList,StyleSheet, Modal, TextInput,TouchableOpacity, Dimensions, Alert, ScrollView} from 'react-native';
import { SearchBar } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import GlobalStyle from '../components/GlobalStyle';

let ImgImport = require('../imgImport');
const ACategory = ({navigation}) => {

  {/*This variable is to save data */}
  const[catData, setCatData] = useState([]);

  {/*This is for modal */}
  const[showEdit,setShowEdit] = useState(false);
  const[showAdd,setShowAdd] = useState(false);  

  {/*This is for list render */}
  const[isRender, setRender] = useState(false);

  {/*This to save the edit id for reference, another is to store data */}
  const[editItem, setEdit] = useState();
  const[inputText,setInput] = useState();

  {/*This to save the search reference*/}
  const[search, setSearch] = useState(null);
  const[filteredCat, setFilter] = useState(catData);

  {/*This to add new cat*/}
  const[addCat, setAddCat] = useState('');

  useEffect(() => {
    load()
  },[])

  {/*This to reload page */}
  function load(){
     setRender(true)
     return fetch("http://10.0.2.2:5000/api/cat")
    .then(res => res.json())
    .then(data => { 
      setCatData(data)
      setFilter(data)
    })
    .catch((error) =>{
      console.log(error)
    })
    .finally(() => setRender(false),global.catData = catData)
  }

  {/*This to edit category*/} 
  function editCategory(id,name) {
  return fetch("http://10.0.2.2:5000/api/cat/" + id, {
   method: 'PUT',
   headers: {
      Accept: 'application/json',
     'Content-Type': 'application/json',
   },
   body: JSON.stringify({ 
       id : id,
       name : name,
    })
  })
   .then(res => res.json())
   .then((responseJson) => {
        if(responseJson.affected > 0) {
            Alert.alert('Record Updated', 'Record for `' + name + '` has been updated');
        }
        else {
            Alert.alert('Error updating record');
        }
        load()
   })
    .catch((error) =>{
      console.log(error)
    })
  } 

  {/*This to add category*/} 
  function addCategory(name) {
  return fetch("http://10.0.2.2:5000/api/cat", {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
        name : name,
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
        load()
   })
    .catch((error) =>{
      console.log(error)
    })
  }

  {/*This to delete category*/} 
  function deleteCategory(id) {
  return fetch("http://10.0.2.2:5000/api/cat/" + id, {
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
          load()
    })
      .catch((error) =>{
        console.log(error)
      })
  }

 {/*This to open the pop up edit*/}
  const PressCatEdit = (item) => {
    setShowEdit(true);
    setInput(item.name)
    setEdit(item.id)
  }

  const EditCatSave = () => {

     if(inputText == ""){
      Alert.alert("REMINDER","Please enter a category name...");
      return;
    }

    editCategory(editItem,inputText)
    setShowEdit(false)
  };

  {/*This to add the add data*/}
  const PressCatAdd = () => {
    if(!addCat){
      Alert.alert("REMINDER","Please enter a category name...");
      return;
    }

    addCategory(addCat)
    global.category[global.category.length] =ImgImport.cat7;
    global.catData = catData;
    setShowAdd(false)
    setAddCat('')
  };

  {/*This to delete the data*/}
  const PressCatDel = (id) => {

    deleteCategory(id)
    global.category =ImgImport.images;
    global.catData = catData;
  }

  {/*This to filter the data*/}
  const searchFilter = (text) => {
    if (text) {
      const newData = catData.filter(function (item) {
        const itemData = item.name
          ? item.name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilter(newData);
      setSearch(text);
    } else {
      setFilter(catData);
      setSearch(text);
    }
  };

  const renderItem = ({ item, index }) => (
     <View style={styles.item}>
      <Text style={[styles.title,GlobalStyle.customFont_Content]}>{item.name}</Text>
      <FontAwesome5 name="pen" style={styles.editbtn} size={17} onPress={() => PressCatEdit(item)}/>
      <FontAwesome5 name="trash" style={styles.delbtn} size={17} onPress={() => PressCatDel(item.id)}  />
    </View>
  ); 

  return (

     <ScrollView style={[styles.container,GlobalStyle.customBackground]}>

      <View style={{flexDirection:'row',marginVertical:20}}>

        {/*This search bar*/}
        <SearchBar 
          searchIcon={{size:18}}
          onChangeText={(text) => searchFilter(text)}
          onClear={(text) => searchFilter('')}
          placeholder="Search Here"
          value={search}
          containerStyle={{backgroundColor:'#EEEEEE', flex: 1, borderBottomWidth:0,borderTopWidth:0,}}
          inputStyle={{color:'#455A64',paddingHorizontal:10}}
          style={{backgroundColor:'#ECEFF1',fontSize:16, borderRadius:15}}
          placeholderTextColor={"#90A4AE"}
          inputContainerStyle={{backgroundColor:"#CFD8DC",padding:2}}
        />

        <FontAwesome5 name="plus-circle" style={styles.catAddBtn} size={30} color={"#90CAF9"} onPress={() => setShowAdd(true)}  />
      </View>

    {/*This the flat list display */}
      <FlatList
          data={filteredCat}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshing={isRender}
        />
    

      {/*This modal is for edit */}
      <Modal transparent={true} visible={showEdit} animationType="fade" onRequestClose={() => setShowEdit(false)}>
        <View style={styles.popContainer}>
          <View style={styles.popView}>
              <View style={{flexDirection: 'row', paddingBottom:50}}>
                <FontAwesome5 name="times" style={styles.closebtn} size={25} onPress={() => setShowEdit(false)}/>
                <Text style={[{left:28, fontWeight:'bold'},GlobalStyle.customFont_Title]}>EDIT CATEGORY</Text>
              </View>
              
              <TextInput 
                style={[styles.editBox,GlobalStyle.customFont_Content]} 
                defaultValue={inputText} 
                onChangeText={(text)=> setInput(text)}
                editable={true}
                multiline={false} 
              />
              
              <TouchableOpacity onPress={() => EditCatSave() } style={styles.catSavebtn}>
                 <Text style={[styles.catSavetext,GlobalStyle.customFont_Content,{color:'white'}]}>Save</Text> 
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/*This modal is for Add */}
      <Modal transparent={true} visible={showAdd} animationType="fade" onRequestClose={() => setShowAdd(false)}>
        <View style={styles.popContainer}>
          <View style={styles.popView}>
              <View style={{flexDirection: 'row', paddingBottom:50}}>
                <FontAwesome5 name="times" style={styles.closebtn} size={25} onPress={() => setShowAdd(false)}/>
                <Text style={[{left:28, fontWeight:'bold'},GlobalStyle.customFont_Title]}>ADD CATEGORY</Text>
              </View>
              
              <TextInput 
                style={[styles.editBox,GlobalStyle.customFont_Content]} 
                placeholder="New Category...."
                value={addCat}
                onChangeText={(text)=> setAddCat(text)}
                editable={true}
                multiline={false} 
              />
              
              <TouchableOpacity onPress={() => PressCatAdd() } style={styles.catSavebtn}>
                 <Text style={[styles.catSavetext,GlobalStyle.customFont_Content,{color:'white'}]}>Add</Text> 
              </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  //style whole screen
  container: {
    paddingHorizontal : 15,
    height: Dimensions.get('screen').height,
    paddingBottom: 10,
  },

  //style for each item
  item: {
    backgroundColor: '#ffffff',
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    flex: 1,
  },

  //style for title
  title: {
    fontSize: 18,
    color: '#424242',
    width: 200,
    flex:1,
  },

  //style for edit button
  editbtn: {
    color: '#80CBC4',
    paddingTop:3,
    paddingRight:30,
  },

  //style for delete button
  delbtn: {
    color: '#FFAB91',
    paddingTop:3,
    paddingRight: 7,
  },

  //style for pop up close button
  closebtn: {
    color: '#757575',
    left:220,
  },

  //style for pop up edit
  popContainer:{
    backgroundColor:'#000000aa',
    flex:1,
    alignItems: "center",
  },

  popView:{
   backgroundColor:"#ffffff", 
   marginVertical:90,
   width:300,
   maxHeight:260,
   top:150,
   padding:30, 
   flex:1,
  },

  editBox: {
    borderRadius:10,
    height: 50,
    borderBottomColor: '#616161',
    borderBottomWidth: 3,
    fontSize:18,
    textAlign:'center',
    backgroundColor:'#EEEEEE',
  },

  catSavebtn: {
    backgroundColor: '#616161',
    width: 100,
    borderRadius: 10,
    padding: 7,
    marginTop: 35,
    marginLeft:73,
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

export default ACategory;