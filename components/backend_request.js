import {Alert} from 'react-native';

export function editCategory(id,name) {
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
   })
    .catch((error) =>{
      console.log(error)
    })
}

export function addCategory(name) {
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
   })
    .catch((error) =>{
      console.log(error)
    })
}

export function deleteCategory(id) {
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
   })
    .catch((error) =>{
      console.log(error)
    })
}