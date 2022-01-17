import React from 'react';
import {View, Image,Text} from 'react-native';
import {useTheme} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Toolbar = props => {
 
 const {colors} = useTheme();
 
  return (
    <View
      style={{
        backgroundColor: colors.card,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.9,
        shadowRadius: 2,
        elevation: 4,
        flex: 0,
        justifyContent: 'space-between',
        height: 58,
        flexDirection: 'row',
      }}>
      <View style={{justifyContent: 'center', marginLeft: 16}}>
        <View style={{flexDirection: 'row'}}>
          <Image resizeMode={'contain'} style={{width:124,height:37}} source={require("../../Assets/images/logo_zapex.png")} />
        </View>
      </View>

      {props.icon!==undefined && props.action!==undefined ? 
        <MaterialCommunityIcons style={{alignSelf:"center",paddingRight:8}} onPress={()=>{
            props.action();
        }} name={props.icon} size={24} color={colors.text}/>:
        null
      }
    </View>
  );
};

export default Toolbar;
