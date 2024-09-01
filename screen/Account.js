import React, {useState, useEffect, useContext} from 'react';
import { SafeAreaView } from 'react-native';
import { Text, View, StyleSheet, TouchableOpacity, useWindowDimensions,TextInput} from 'react-native';
import { Avatar,Title,Caption,TouchableRipple, } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useSharedValue,withSpring,useAnimatedStyle } from 'react-native-reanimated';
import COLORS from '../consts/colors';
import {CheckButton} from '../components/Custom_Pay';

const Account = ({navigation}) => {
  const [user, setUser] = useState([])
  const[isRender, setRender] = useState(false);
  {/* refresh content for each navigation */}
  useEffect(() => {
    const refresh = navigation.addListener('focus', () => {loadContent()});
    return refresh     
  },[navigation])

  function loadContent(){
    setRender(true)
    return fetch("http://10.0.2.2:5000/api/user", {
    method:'GET', 
    headers:{
      Accept:'application/json', 
      'Content-Type':'application/json'
      }
  })
  .then(res => res.json())
  .then(data => {  
    setUser(data)
    const userId=global.userid
    var i =data.length;
    var found = false;

    while(i--){
      if(data[i].id==userId){
        setUser(data[i])
        found = true;
        break;
      }
    }

  })
  .catch((error) =>{
    console.log(error)
  })
  .finally(() => setRender(false))
  }



  {/*Get the screen dimensions*/}
  const dimensions=useWindowDimensions();
  const top=useSharedValue(dimensions.height);

  const SPRING_CONFIG={
    damping:80,
    overshootClamping:true,
    restDisplacementThreshold:0.1,
    restSpeedThreshold:0.1,
    stiffness:500,
  };

  const style=useAnimatedStyle(() => {
    return{
      top: withSpring(top.value, SPRING_CONFIG),
    };
  });
  
  const gestureHandler=useAnimatedGestureHandler({
    onStart(_, context){
      context.startTop = top.value;

    },
    onActive(event, context){
      top.value= context.startTop + event.translationY;
    },
    onEnd(){
      {/*Dismiss if low*/}
      if(top.value>dimensions.height/ 2 + 200){
        top.value=dimensions.height;
      }
      else{
        top.value= dimensions.height/2;
      }
    },
  });

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.userInfoSection}>
          <View style={{flexDirection:'row',marginTop:15}}>
            <Avatar.Image size={80} source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAw1BMVEX////1S1UwNELu7/DlSVP9TFb6TFYsNEIrLz7+TFYvM0ITMkEnM0IgJTYYM0EdM0HsSlQbITMTGi4iM0EdIjQPFywXHTAnKzv09fZXWmTvSlTPRlFydHyYmZ7aR1LHRVDExciJPUlbXmdLTllER1Pk5ebeSFKeP0u2Q06jpKmRPkrX2NrLzM+4ub1maHF4O0dZOEVHNkR5e4I8QE3ARE+xQk1+PEhjOUZUN0RCNkOPPkoADSadnqOsrbGoQUxuOkeDhYzuxAxXAAAQzUlEQVR4nO1d6XqqyhKNiIAggoDghME4xTExmjkmvv9TXbS6AXcSrQbU3HtZP87e33e2NIuqrqm7q6+uMmTIkCFDhgwZMmTIkCFDhgwZMmTIkCFDhgwZ/p/Qn85Gbuum2+31lstlr1ufb9y1N6ld+r3SQN9zW8tq1bZUx5F8yFv4fzqqWjGqznwz61/6FRNgMprLRkWVZO5XSI5lSDcfk0u/agzkZy3VUJ0D5ALIkmpYrVn+0q/Mgvy6blsOglxEmJZdX/+3zMvZ3LAOaeavorSMuXfplz+OvmtVpO+vL5ZMUysrilLWtn/4/zXNkvidpK26f1tbp/Pqv8rpc/MpLe46n7fN9oDndZ3nB83V7bBzt1AUzRT/4akaremlafwKr1vdF59olrXF02eTLxYLBUEQchT+34VCoSgMVuNnTjFLe4J0qt2/yXHataP8xJJWfhlfN4RChNk3CEIx1/780spmVJSS0fUuTecbJvvyK5XFp1WjeIhchGYxd915VUr7HP+Wj8w/GBF+oqbdXecKKHaUZEFoPpmaGOXY+kM2Z2RH7EtJuX9sMNGjJBuPL4oZPsgx3EsTI5j0KuFrmdrTIAY9SnLQ0SIz0ur9CVV1IxPQ1MZ8MSY9QEEfRpRVqm4uTe9qslRDfua4UUjEb8cx9ymGuqpyFxbjOhRgSXnTk/PbcWyMQ8MqVdcX5FebG4H9VL74dPgBxzuFqqpszy8Wkfe5wIRqi2Z6/HYcm69aYFS5C2XJXqChojLE+XYGCMKwTMUoVb1LEPyoBgJ8aacrQEBh8BKIsTo6P8GNEQhwnLoAAYIwDmajsTk3wRb18iXxOpkHPIRCk6NGtdI6L8Eb6gW1Z/00AgQI+j3VVHV+ToJ1akSVzilm4B7HjkIp3pyfoKh8nk5DKYqfAcX6uQhSFRXLzdMT9CmuqNs4l6LOKUGzfcopGKLQpvmG9XAOghtiRUVucB6C/lxs07qcfYaUcWRQgvy5CPoUB5Ti6eNwj0QyonhGghGKcvXEdbg+JVg6m4oSim2SF8uV05ZvlhKxomcyMhGKTeI0pOUpCVIzqlyfm6BvUa8JReeE8duaWJlkjn5b7i7s18BRCFx/dXYqgnQSap1YBLelfKHYGKyGT3d3T53xbbNRZCJZ7JAY1ThVRtyDSVh6YVZRX2oC37z9HA6fS4pmlnyYpqaY98MBC8nCC2QaUu80BF2L+Amdld7g8W5RVsqaae4vwvhhkXK/yuE56mSlyjqJ458QHVWabOV6fvha1r6vFQYky9wtuoRMDapcPYWeEh3V3hgmoSA83ivmr+wIRwVfBSmOtZPp6QjCUXGBl6DPjysfoUc4oo2z8AIPrKReuMlTR4F39cX24id+sqSqFbti7W3UUO6wDAdl+EUl7SJqC5JebYjO6QthGQmYOY5qVSqGPP9Ye1Nv7baWhhqQNBcN5GOHoKdOyokUMTPiK9omNJ61kJ2k2u9yy13PZl50GWLiOjblWFpgn/wKH66a7oJGHcwMOloTeC5cebAqN6Pf9rB5S4tK8R73bIFEb1KqNY0piLD0hdRRYRBssZDs5eGdQG6ViFG7w5mbwhd8vFTzqC4RIY8kSD2zn+v0jr7HxCGrA8otTop8+kL0wJCaY6yZeSUqKqGq8XmOUNRwX7AwhvVFw0uNIYhQLGHN3RdZ4XSWOGuQl0jE+4XT0waoiNRNiyAxpCbSUwiPJMvB1zf7pLqFtGSFoZmuOZ2DCE0UPz88Jm7CYahRz4g3usd9xAbxiSnlwn02ERbvSIrDpEMkosAKkc7EdAJwl4QzuKQpqKcYTBWjvA0z8Rk3E3VgqKaTRUFtxkSuwRSfS7EMnauyOKRCZ0dRdtIg6IEVUAaooYW2Em+K1GwyF3Bb4cgwdhpe/0YC9cGJsPBEAg7mquZmNxmw2VkBsqg0bE0e7Iy2wo3cgGze2TAPNDFY1FR4BHNqJ0+i1hZ4e9S4OWG1S99kO4aRgyKChgzdcqArVvLKImQVpSekkoKrkOIs9IHNLt0xTYdYI+0hDwkctvwkgBWveDGGmu5sjcjh/AXRFs5KqqazCgyLVJ02KKkRa1j4mGVssRJmvO0lZPjgsCip8Lmb/1K8PQUQ4JeR6kImRAybtg8oF5WRuT2ZHOpHrLHga2qPyAmx2n1NmUtGkJhwDTWmz/B+pzmVeH54pDL4fN8xwURMWBxeqyzRYi7HwdyIt4g5s1hmRK4ITj+hv4CQn/WzxowWwZhio6ecAAlGwrIiJ7NM/txgFy3KMVdp+7spgc0Rc8J1OcloZEwSDiPLF0KznMCUUoYv2GoQyYNjzgmAZ8f5qlLMcBhyRPzKCIm+E+UXxLpht+cRAx7XReUhukDX1Qsd8E1JttiweaiUGKJlKHyaiX1+jynKCBjGtG4w60X0Ijqd9kmKipAbKkhDk3QeMtrSXE6HRL8anyDJfk308mUyWzoBGWL9oe/zIfhOENWQIV/Q69rtRP4QKkLYBHHLEIJEO35hmHnIBlkziTccRG1oyx2kF7GyUQBxFm/4pftdXBp3c53LFiL6s+LNTOguoIapfeKHTOSDIQhGF2oCd5GgLrxhHZLmh/E+ap3NNyX2Tj5aUP1CFhLDjxpzSKh6l5HLsLnE3umKFoNZPiq4i3jFdrICVMKf4KDeKX69DQonShs9ZC6XYGEPLLd4j99zJUDhK8FyN2GIW7HYQYc6bayJ+EG0lGE4yEcThG2EIX5iFN7IqlecPVkfbItcW/BJGfZYGdLdPO9x4qj+++63IocejjCU42/jY2ZI9oFY8byFB5uHmMdLsFGRdR5SUxq3csLsENspzUNWhrGtNyTc2PJzGgki+ab4DZcJv2mLleF1omztim4zwY9IZ/65tJREbQliGlKmwUdtpCKsxlzxguos3tIIt4nqQlc0nUEXogJvETMlpdVZ7Gg5AfZGOfFzC5IfjvG5xVeStSfIgPEV4YSpTDhk6Y41t4g5EWEaMnxQ4RmWurzYDEmd5h47IjWmnBEnBSa5BYNhyyWaFLsxobwnYquJuVxxEX9fJNkgWMITpCuICRYuqqxhFFnm5tQNszn9gL1X5hs+8CalPSM+waslWePGn3RqkBMyrG2s1hV6tBGfPOnEHSY5P0MWSD8Z8qchPYRgs5QyNrRRivmET4D1YfIlUpesPel4IQoc3aXP0KtjY5PfiOi9Jj5BHcqlsZJRClJYeNEZZmI7OApkb5DDuEEzJgUfP+V4fZF8/ZBEGaUBjzenhVVwGgh5nJWegOdE5RFvZhr8AAoKidaA6Tr+iscL0ZfigvbqQBW/a/T0U5mp2RTPkw01yc52Q8XUHOoMQswJwopaVEymSLZ4i9oty9nnBq+/pbEXAyJT8b7BIsRtbyByhg5RVqRnU8ts3cJ4vpHKfhoSSWkDnkWIu8m4+yEiOb0hJ45umQj6n3yQyp6oK2h5rN3qbELMFe+Q5wUgMvTDe7YT8DyvQ3Iox1zKC0D3JvoM2Y5wk/MCR3M3ctbBZHy6/zpkb2LSk5Z0fynPMwqRHPo4aukgMGSJRrfYvo6YNHUC1CAe3voLRoqkdvp+2GH0mYN7ShCUNIXzwJDTlO58vWAzNiSROvKNSdS0YJqFvpmhSpqgzkYBeT5X4lmFSLYOHqlofLAWSrbYvQvZq5+85xA5y6J9boXIYg5oIeywJWBeZs7tzAyvk0Q03o7yfUDIsY2+2fSUlmsPhzUt1pIs6Civg7tPfhjhiu5P5JQmo57itg8xLzMTHSUn5BJb0h0gMAZbw0BRuNYQoSkYMo1Bhru30MnxKjUNgvTcnNaGZ2PfhBzTO1KQhnmI30ieg+/cTvX8Yd8Ap9yBhyOnYpGcBj4SGBNTrTwiKTbgM0NaIbOd4vwdJL0xeR5PsXhLO8kcNnY10m9AWaEoNsg7kJAwrZ5Y9Cz3GISImYrF4Dz35sjDN7TGhpIivIA+TvksN+2KYQ54HEUhaDoqO8f8VZDhK53jCTAZfxDnLPVBTElPBTITj1EstF9pU3VEE+egSmO+HsuByeh6h2RmKTbGoK1N2vxxikLuLSxFYRahPsJC1NvBrlh08PYJmpsEvU30oxSL11zQFb+KM+Zu0Dfb5Fa/i5EOrdPeJqk2qCFCLK+OUCzwX2G7+HdsqXb0TvvwiMrzb83rA4LkaGUKWUUUQY+hgOFPFIXcMNLy3/LQj/esyAUE4x9VNRiX507SYyjwiW+/UxSKq7AXPmfXWbxxvh7eAqK9rr434gtGpWYm8cnKf0GSKD8L4H+hWGzfh62vJJs1bxuFN9WIyn27+AtBHjIWhBtiRtCvLRRiNLoRGp1QQWXjhj2c6t8YQeevktJpRMTYCIfkyc45+wT9L0lz1tApRigKhdvovSJOvOFnTuS+EzHsNRghqD/BMCk6+xBB38TbCEXINAqD+7D3nFRlX/8lqG3CK0/E8v0ArGp0uNtT9k2kWZRYavMR7K4wKEcUtJ7Exk3qEVUt727NiA7WJh22KvG2sxzFkvYv1aOjCpHbRDiVSzo/ZlyoqtprU4gOpS/gSzqnaj9P9dS8i86MTmhBnfc0MlL3PbjcRVT2Zj1ZKUi4YngItI9weUwp6s1FIEC5Ok9n5Py8GqiqtmhTjo0hXdA6WR/hq6u5s29tGo/B7VOyynmpjeNxQc9IUXts7FkZTj3pXR5kKpIAVQ/unuCklC9Jc8MAADSVhqMnayJM0Kdd9bVrf9iwvaWK7D2Hx6RLW0Zy2vN2OpypJzvNo3yf0eQX1MnLVbdWy6cZRvlPqwUtIzlzwTe5M/XVj96NsKBO0FlOa/kt0uJInjYNbswqLegunXNci0R39wTtLe1WHl4pJY7hw/It2sCVDnaO+y2urh6CCQIER8ErpUDyn2eNjL2Lhc9zR0l4f8DOsqne/ksl4vj9UZ4auf7zfBciBbc9cXKv/+2t4pL8+UH9XiDFc16HFFB0Nj++FzvJ3x+zcS5AMKKoav1nIcLb4VjWDjyhX1fPrqKAFt0vKcnfJyKe5gFyu996MpVg5cwEI0VOcPfHUNsiQqyG+k3o9M9/d962bSwd3epOjr8uO2qRwO0S9x/6kWNQ5JTsD4RIGPnVwuD7QndY+nlcL/AaVm+aLsWaFz7cWV7oHlIfD8GKg2S0DhhVZn79ViBA2Tjz3Y77mIVpnGO7+XQ41vKuERQyLnsfsI9+nboN32NJoxQ4+vycIMOX/8LV3JFyvKw6bjJdrdX6biW89UJCrs+dGP1ucEmFz1HdTGLb1Vpt+lCJXERf+QMCBKzVyGs51fo6H4Ok/5N114g+KFGbspRR2xiRJEey1JbHRtL/x7OWakUfYsReHDgNJvVq5PU4pyI/zPKY0GwX0PVnD3JUPf0JmGhx4DSY1qNy5GTHsuuulz8YgW7/Z99z67YVvTjIl1/95PWmWJh2q3svKktORe1uRl6/RhDy2qE/HW26qu1Ev8x2Inf/Jr8tJi1D5fYhOWrFsHutzWg9m04mk/5kOvVm649Nq6tWbfUfdr5Trbb+nn5GkXdVW5K5f+GLU1Wtim0bhm1XKpaqOt+4bf9VRXUvF4Oi4c0N6/vbH4dkGXPv0i+PRG1dt/dM41Fs7dLN+sT1+nSxdW+G+oO+/sBOUg3nYfa3vB8Ok9Gcsyt7N8h9E51TMbj56G/blsPwvV1r+V71ifpmM8T2ljm7+r5subP/AsuCQH/ijdzNvF7vblGvzzfuaDb53+CWIUOGDBkyZMiQIUOGDBkyZMiQIUOGDBkyZMiAxX8AqwCNAfruT/8AAAAASUVORK5CYII='}}/>
            <View style={{marginLeft:20}}>
              <Title style={[styles.title,{marginTop:25}]}>Hello, @{user.username}!</Title>
            </View>
          </View>  
          <View style={{marginTop:12,marginBottom:-10}}>
            <CheckButton 
            label={"Edit Account Details"}
            icon="edit"
            isize={20}
            icolor="white"
            onPress={() => navigation.navigate("EditAccount", {AUser: user,})}
            bcolor={COLORS.blue}
            tcolor={COLORS.white}
            />
          </View>
          <View style={{marginTop:12,marginBottom:-10}}>
            <CheckButton 
            label={"Logout"}
            icon="sign-out-alt"
            isize={20}
            icolor="white"
            onPress={() => navigation.navigate("LoginScreen")} 
            bcolor={COLORS.blue}
            tcolor={COLORS.white}
            />
          </View>
        </View>
        {/* This is the section that displays user information */}
        <View style={styles.userInfoSection}>
          <View style={styles.showRow}>
            <Icon name="location-pin" size={30} />
            <Text style={styles.rowContent}>{user.address}</Text>
          </View>
          <View style={styles.showRow}>
            <Icon name="email" size={30} />
            <Text style={styles.rowContent}>{user.email}</Text>
          </View>
        </View>
    </SafeAreaView>
  );
};

export default Account;

const styles=StyleSheet.create({
  container:{
    flex:1,
  },
  userInfoSection:{
    paddingHorizontal:30,
    marginBottom:18,
  },
  header:{
    fontSize:15,
    fontWeight:'400',
  },
  title:{
    fontSize:25,
    fontWeight:'bold',
  },
  showRow:{
    flexDirection:'row',
    marginBottom:5,
    marginTop:10,
    padding:10
  },
  menuSection:{
    paddingHorizontal:30,
    marginBottom:25,
  },
  menuItem:{
    flexDirection:'row',
    paddingVertical:15,
    marginTop:5,

  },
  menuItemText:{
    color:COLORS.grey,
    marginLeft:25,
    fontSize:16,
  },
  btnText:{
    textTransform:'uppercase',
    fontSize:14,
    color:COLORS.white,
    fontWeight:'700',

  },
  rowContent:{
    marginLeft:10,
    fontSize:20,
    color:COLORS.grey,
    fontWeight:'700',
  },
  accPanel:{
    position:'absolute',
    left:0,
    right:0,
    bottom:0,
    backgroundColor:COLORS.yellow,
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    shadowColor:COLORS.grey,
    shadowOffset:{
      width:0,
      height:10,
    },
    shadowOpacity:4.0,
    shadowRadius:3.84,
    elevation:10,
    padding:20,
    justifyContent:'center',
    alignItems:'center',
  
  },
  accBttn:{
    padding: 13,
    borderRadius: 10,
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    marginTop:20,
    width:200,
  },
  accBttnTitle:{
    textTransform:'lowercase',
    fontSize: 16,
    fontWeight: 'bold',
    color:COLORS.white,
  },
  accTitle:{
    fontSize: 27,
    height: 35,
  },
});