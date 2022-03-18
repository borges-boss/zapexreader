import React, {useEffect, useState,useRef} from 'react';
import {View, Text, FlatList, Platform, BackHandler} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppStyle from '../../Assets/styles/AppStyle';
import Toolbar from '../Components/Toolbar';
import {useTheme} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import PermissionUtils from '../../Logic/PermissionUtils';
import FloatingActionButton from '../Components/FloatingActionButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TextInput, Button} from 'react-native-paper';
import HardwareUtils from '../../Logic/HardwareUtils';

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
            color={
              props.isOnTheList !== undefined && props.isOnTheList
                ? 'green'
                : props.isOnTheList === undefined
                ? colors.text
                : 'tomato'
            }
          />
          <Text
            style={{
              color:
                props.isOnTheList !== undefined && props.isOnTheList
                  ? 'green'
                  : props.isOnTheList === undefined
                  ? colors.text
                  : 'tomato',
              fontSize: 18,
              marginLeft: 16,
              lineHeight: 25,
              flexWrap:"wrap",
              width:"80%"

            }}>
            {props.code}
          </Text>
        </View>
        <Feather
          onPress={() => {
            if (!props.disabled) props.onDelete(props.code);
          }}
          name={'trash-2'}
          style={{opacity: props.isEnabled ? 1 : 0.8}}
          size={24}
          color={
            props.isOnTheList !== undefined && props.isOnTheList
              ? 'green'
              : props.isOnTheList === undefined
              ? colors.text
              : 'tomato'
          }
        />
      </View>
    </TouchableRipple>
  );
};

function processBarcode(list, code) {
  console.log('List of codes fetched: ' + JSON.stringify(list));

  if (
    list.filter(value => {
      return value.Codigo == code;
    }).length > 0
  ) {
    //beep_07
    let temp = null;
    let index = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].Codigo == code && list[i].isOnTheList == undefined) {
        HardwareUtils.playSound('beep_07.mp3');
        list[i].isOnTheList = true;
        temp = list[i];
        index = i;
        break;
      }
    }

    if (temp !== null) {
      list.splice(index, 1);
      list.unshift(temp);
    }

    return list;
  } else {
    if (
      list.filter(value => {
        return value.Codigo == code;
      }).length <= 0
    ) {
      HardwareUtils.playSound('beep_buzzer_fail.wav');
      list.unshift({Codigo: code, isOnTheList: false});
      return list;
    } else {
      console.log('Already on the list');
      return null;
    }
  }
}

function Scanned({navigation, route}) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldError, setFieldError] = useState(false);
  const [barcode, setBarcode] = useState(null);
  const {colors} = useTheme();
  let textInputRef = useRef(null);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', function () {
      global.scannedBarcode = [];
      navigation.navigate('Home');
      return true;
    });
  }, []);

  useEffect(() => {
    if (route.params.data !== undefined && route.params.data !== null) {
      setData(route.params.data);
    }
  }, []);

  return (
    <SafeAreaView style={{height: '100%'}}>
      <Toolbar
        icon={'replay'}
        action={() => {
          navigation.navigate('Home');
        }}
      />

      <View style={{padding: 8, marginTop: 16}}>
        <TextInput
        ref={(ref)=>{
          textInputRef = ref;
        }}
          focusable={true}
          blurOnSubmit={false}
          autoFocus={true}
          onSubmitEditing={() => {
            //navigation.navigate('Barcode', {preScreen: 'Home'});
            if (barcode !== null && barcode !== '' && barcode !== ' ') {
              let response = processBarcode(data, barcode);
              if (response !== null) setData(response);
            } else {
              setFieldError(true);
            }
            textInputRef.focus();
            setBarcode('');
            
            if(textInputRef!==null) 
              textInputRef.focus();
          }}
          keyboardType={'numeric'}
          onFocus={() => {
            setFieldError(false);
          }}
          left={
            <TextInput.Icon name={'barcode'} size={24} color={colors.text} />
          }
          editable={!isLoading}
          error={fieldError}
          activeOutlineColor={colors.primary}
          placeholder={'Inserir codigo de barras...'}
          value={barcode}
          onChangeText={text => {
            setBarcode(text);
          }}
          mode={'outlined'}
          style={{marginBottom: 8}}
        />

        <Text
          style={[
            AppStyle.textSubtitle,
            {textAlign: 'left', fontSize: 16, marginBottom: 18},
          ]}>
          Codigos de barra invalidos aparecerão em vermelho
        </Text>

        <Button
          onPress={() => { 
            //navigation.navigate('Barcode', {preScreen: 'Home'});
            if (barcode !== null && barcode !== '' && barcode !== ' ') {
              let response = processBarcode(data, barcode);
              if (response !== null) setData(response);
            } else {
              setFieldError(true);
            }

            setBarcode('');
            if(textInputRef!==null) 
              textInputRef.focus();
          }}
          loading={isLoading}
          color={'#fff'}
          style={{
            backgroundColor: !isLoading ? colors.primary : 'gray',
            padding: 8,
          }}>
          Procurar
        </Button>
      </View>
      <SafeAreaView style={{padding: 8, flex: 1}}>
        {data.length > 0 ? (
          <FlatList
            style={{marginTop: '8%'}}
            data={data}
            keyExtractor={(item, index) => item + index}
            renderItem={({item}) => (
              <Item
                disabled={isLoading}
                code={item.Codigo}
                isOnTheList={
                  item.isOnTheList !== undefined ? item.isOnTheList : undefined
                }
                onDelete={code => {
                  let temp = data.filter(value => {
                    return value.Codigo != code;
                  });
                  global.scannedBarcode = temp;
                  route.params.data = temp;
                  //setData([]);
                  setData(temp);
                  if(textInputRef!==null) 
                    textInputRef.focus();
                }}
              />
            )}
          />
        ) : (
          <View
            style={{
              height: '70%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: colors.text}}>
              Nenhum codigo de barras encontrado
            </Text>
          </View>
        )}
      </SafeAreaView>
      {/*
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
      */}
    </SafeAreaView>
  );
}

export default Scanned;
