import React from 'react';
import {View,Text,ActivityIndicator} from 'react-native';
import {TouchableRipple} from 'react-native-paper'; 
import {useTheme} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Button = props => {
    const {colors} = useTheme();    

    return (
    <TouchableRipple onPress={()=>{
        if(props.onPress!==undefined && props.onPress!==null)
            props.onPress();
    }}>
        <View style={{flexDirection:"row", backgroundColor:colors.primary,padding:16,justifyContent:"center",borderRadius:8}}>
            {props.icon!==undefined ? <MaterialCommunityIcons name={props.icon} size={24} color={colors.card}/> : null}
            <Text style={{paddingLeft:14,color:colors.card,fontSize:16,fontWeight:"400"}}>{props.text}</Text>
        </View>
    </TouchableRipple>
    );
}

export default Button;
