import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Platform} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppStyle from '../../Assets/styles/AppStyle';
import Toolbar from '../Components/Toolbar';
import {useTheme} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Button from '../Components/Button';
import PermissionUtils from '../../Logic/PermissionUtils';
import FloatingActionButton from '../Components/FloatingActionButton';

const Item = props => {
  const {colors} = useTheme();
  return (
    <TouchableRipple>
      <View
        style={{
          padding: 8,
          flexDirection: 'row',
          alignItems: 'center',
          textVerticalAlign: 'middle',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row'}}>
          <MaterialCommunityIcons
            name={'barcode-scan'}
            size={28}
            color={(props.isOnTheList) ? colors.text : "tomato"}
          />
          <Text
            style={{
              color: (props.isOnTheList) ? colors.text : "tomato",
              fontSize: 18,
              marginLeft: 16,
              lineHeight: 25,
            }}>
            {props.code}
          </Text>
        </View>
        <Feather
          onPress={() => {
            global.scannedBarcode = global.scannedBarcode.filter(value => {
              return value.data !== props.code;
            });
            props.onDelete(global.scannedBarcode);
          }}
          name={'trash-2'}
          size={24}
          color={(props.isOnTheList) ? colors.text : "tomato"}
        />
      </View>
    </TouchableRipple>
  );
};

function Scanned({navigation, route}) {
  const [data, setData] = useState([]);
  const {colors} = useTheme();

  useEffect(() => {
    if (global.scannedBarcode !== undefined && global.scannedBarcode !== null) {
      setData([]);
      setData(global.scannedBarcode);
    }
  }, [global.scannedBarcode]);

  return (
    <View style={{height: '100%'}}>
      <Toolbar />
      <View style={{padding: 8}}>
       { (data.length > 0) ?
        <FlatList
          style={{marginTop: '8%'}}
          data={data}
          keyExtractor={(item, index) => item + index}
          renderItem={({item}) => (
            <Item
              code={item.data}
              isOnTheList={item.isOnTheList}
              onDelete={newList => {
                setData([]);
                setData(newList);
              }}
            />
          )}
        /> 
        : 
        <View style={{height:"100%",justifyContent:"center",alignItems:"center"}}>
          <Text style={{color:colors.text}}>
            Nenhum codigo de barras escaneado
          </Text>
        </View>
        }
      </View>
      <FloatingActionButton
        onPress={async () => {
          if (
            Platform.OS === 'android' &&
            (await PermissionUtils.hasAndroidCameraPermission())
          ) {
            navigation.navigate('Barcode', {preScreen: 'Scanned'});
          }
        }}
        icon={'barcode-scan'}
        backgroundColor={colors.primary}
        iconColor={'#fff'}
      />
    </View>
  );
}

export default Scanned;
