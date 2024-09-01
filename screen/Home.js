import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../consts/colors';
import { SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const width = Dimensions.get('window').width / 2 - 35;


const Home = ({ navigation }) => {
  
  {/*This to save the product data*/}
  const[prodData, setProdData] = useState([]);
  {/*This to save the search reference*/}
  const[prodSearch, setProdSearch] = useState(null);
  const[filteredProd, setFilterProd] = useState(prodData);
  const[isRender, setRender] = useState(false);

  const[catData, setCatData] = useState([]);
  const[filteredCat, setFilterCat] = useState(null);

  {/* refresh content for each navigation */}
  useEffect(() => {
    const refresh = navigation.addListener('focus', () => {loadContent()});
    return refresh     
  },[navigation])

  function loadContent(){
    loadProd()
    loadCat()
  }
  
  {/* This is to load the products from database */}
  function loadProd(){
    setRender(true)
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
  .finally(() => setRender(false))
  }
  
  {/* This is to load the categories from database */}
  function loadCat(){
    setRender(true)
    return fetch("http://10.0.2.2:5000/api/cat")
    .then(res => res.json())
    .then(data => { 
      setCatData(data)
      setFilterCat(data)
      
    })
    .catch((error) =>{
      console.log(error)
    })
    .finally(() => setRender(false))
  }
 
  {/*This to filter the data according to search words*/}
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
  {/*This to filter the data according to selected category*/}
 function pressProdCat(category){
   
   let prodList=prodData.filter(prod => prod.category == category.name)

   setFilterProd(prodList)
   setFilterCat(category)
 }
  {/*This to display the categories*/}
  function renderProdCategories() {
    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity
          style={{
            ...style.categoryBtn,
          }}
          onPress={() => pressProdCat(item)}>
          <View
            style={{
              width: 108,
              height: 108,
              borderRadius: 100,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth:0.9,
              borderColor:COLORS.light,
              backgroundColor: (filteredCat?.id == item.id) ? '#f6eddc' : COLORS.white,
            }}>
              <Image 
                  source={global.category[item.id-1]}
                  resizeMode={"contain"}
                style={{
                  width: 98,
                  height: 108,
                  flex:2,
                }}
              />
          </View>
          <View style={{justifyContent:'space-between'}}>
          <Text style={{ fontWeight:'bold',marginTop:5, fontSize: 15, color:COLORS.dark}}>
              {item.name}
            </Text>
          </View>

        </TouchableOpacity>
      );
    };
    return (
      <SafeAreaView style={style.categoryListingContainer}>
        <FlatList
          data={catData}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{paddingVertical: 10 }}
        />
      </SafeAreaView>
      
    );
  }
   {/*This to display the product items*/} 
  const Card = ({ productItemList }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Product', {
              Aitem: productItemList,
            })}>
                <View style={style.itemContainer}>
                  <View style={{ height: 135, alignItems: 'center' }}>
                    <Image
                      style={{ 
                        flex: 2,width: 200,height: 200, resizeMode: 'contain' }}
                      source={global.product[productItemList.id-1]}
                    />
                  </View>
                  <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
                    <Text style={{ textAlign: 'center',fontWeight: 'bold', fontSize: 15, marginTop: 10 }}>
                      {productItemList.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',position:'absolute',
                    }}>
                    <Text style={{top:270,fontSize: 16}}>
                      RM {Number(productItemList.price).toFixed(2)}
                    </Text>
                  </View>

                  {/* Touchable */}
                  <TouchableOpacity style={{flex: 3, zIndex: 999,justifyContent: 'center',
                      alignItems: 'center'}}>
                      <View
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        flexDirection: 'row',
                        height: 35,
                        width: 105,
                        marginBottom: 25,
                        backgroundColor: COLORS.blue,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{ textTransform:'uppercase',fontSize: 15, color: COLORS.white }}>View</Text>
                    </View>
                  </TouchableOpacity>
              </View>
        </TouchableOpacity>
      </View>
      
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingHorizontal: 20, backgroundColor: '#fff' }}>
      <View style={style.header}>
        <View>
          <Text style={{fontSize: 35, fontWeight: 'bold',color:COLORS.blue, letterSpacing:0.5 }}>Hello.</Text>
          <Text style={{fontSize: 16,color:COLORS.redOrange, letterSpacing:0.5, opacity:0.9 }}>What would you like to get today?</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={style.searchContainer}>
        <SearchBar 
            searchIcon={{size:25,marginLeft:2}}
            clearIcon={{size:25}}
            onChangeText={(prod) => prodSearchFilter(prod)}
            onClear={(prod) => prodSearchFilter('')}
            placeholder="Search for a product"
            value={prodSearch}
            containerStyle={{backgroundColor:'white', flex: 1, borderBottomWidth:0,borderTopWidth:0,}}
            inputStyle={{color:COLORS.black,paddingHorizontal:10}}
            style={{fontSize:17}}
            placeholderTextColor={COLORS.grey}
            inputContainerStyle={{backgroundColor:'#E0E0E0',padding:5,borderRadius:15,opacity:0.5}}
          />
        </View>
      </View>
      
  
      <View style={{marginTop:10,marginBottom:5}}>
      <TouchableOpacity style={{position:'absolute', zIndex:5,right:10}} onPress={() =>{loadContent()}}><Icon name="refresh" size={35}/></TouchableOpacity>
   
        <Text style={{ fontSize:18, fontWeight:'bold',color:"#F37121",letterSpacing:0.2}}>Browse by categories: </Text>
          <View style={{marginTop:15}}>
            {renderProdCategories()}
          </View>
          
        
      </View>
      <FlatList
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: 10,
          paddingBottom: 50,
        }}
        numColumns={2}
        data={filteredProd}
        keyExtractor={(prod) => prod.id.toString()}
        renderItem={({ item }) => <Card productItemList={item} />}
      />
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  header: {
    marginVertical:5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 18,
    fontStyle: 'italic',
    flex: 1,
    marginLeft:10,
    color:COLORS.grey,
  },
  categoryListingContainer: {
    marginTop:-20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  categoryBtn: {
    marginRight: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between'
  },

  itemContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom:10,
    height: 300,
    width,
    marginHorizontal: 2,
    borderRadius: 10,
    padding: 15,
    backgroundColor:COLORS.white,
    shadowColor:COLORS.grey,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1.05,
    shadowRadius: 3.84,
    elevation: 5,
  },

});
export default Home;
