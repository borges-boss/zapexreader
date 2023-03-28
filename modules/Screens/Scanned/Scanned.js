import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  Platform,
  BackHandler,
  ScrollView,
  Keyboard,
} from 'react-native';
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
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

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
              flexWrap: 'wrap',
              width: '80%',
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
//12051
function Scanned({navigation, route}) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldError, setFieldError] = useState(false);
  const [barcode, setBarcode] = useState(null);
  const [isScanningMod, setIsScanningMod] = useState(true);
  const {colors} = useTheme();
  let textInputRef = useRef(null);
  let flatList = useRef(null);
  let scrollView = useRef(null);

  function _keyboardDidHide() {
    setIsScanningMod(true);
    //console.log("Keyboard did hide");
    if(textInputRef!==null && !textInputRef.isFocused()){
      textInputRef.focus();
    }
  }

  function _keyboardDidShow() {
    if (isScanningMod === true) {
      Keyboard.dismiss();
      if (textInputRef !== null) {
        textInputRef.focus();
      }
    }
  }

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

    if (textInputRef !== null) {
      textInputRef.focus();
    }

    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    //Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    return () => {
      Keyboard.removeAllListeners('keyboardDidHide');
      Keyboard.removeAllListeners('keyboardDidShow');
    };
  }, []);

  const isScanningDone = data => {
    //If all items were scanned successfully
    //show alert
    if (
      data.filter(value => {
        return value.isOnTheList !== undefined;
      }).length === data.length
    ) {
      //show alert
      Alert.alert(
        'Atenção',
        'Todos os codigos de barra foram escaneados, deseja retornar a tela principal ?', //body of the alert modal
        [
          {
            text: 'Não',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Sim',
            onPress: () => {
              navigation.navigate('Home');
            },
          },
        ],
      );
    }
  };

  return (
    <ScrollView
      //keyboardShouldPersistTaps="handled"
      ref={ref => {
        scrollView = ref;
      }}>
      <Toolbar
        icon={'replay'}
        action={() => {
          navigation.navigate('Home');
        }}
      />

      <View style={{padding: 8, marginTop: 16}}>
        <TextInput
          ref={ref => {
            if (ref !== null) {
              textInputRef = ref;
            }
          }}
          showSoftInputOnFocus={isScanningMod}
          focusable={true}
          blurOnSubmit={false}
          autoFocus={false}
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
            console.log('IsScanningMod', isScanningMod);
            if (isScanningMod === false) {
              console.log('Text', text);
              setBarcode(text);
            }
          }}
          onChange={({nativeEvent}) => {
            if (isScanningMod === true) {
              console.log('onChange');
              setBarcode('');
              if (textInputRef !== null) {
                textInputRef.clear();
              }
              //navigation.navigate('Barcode', {preScreen: 'Home'});
              if (
                nativeEvent.text !== null &&
                nativeEvent.text !== '' &&
                nativeEvent.text !== ' '
              ) {
                let response = processBarcode(data, nativeEvent.text);
                //setData([]);
                if (response !== null) {
                  setData(Array.from(response));
                  isScanningDone(response);
                }
              } else {
                setFieldError(true);
              }
              textInputRef.focus();

              if (textInputRef !== null) textInputRef.focus();

              if (flatList !== null)
                flatList.scrollToOffset({animated: true, offset: 0});
            }
          }}
          onSubmitEditing={({nativeEvent}) => {
            if (isScanningMod === false) {
              setBarcode('');
              if (textInputRef !== null) {
                textInputRef.clear();
              }
              //navigation.navigate('Barcode', {preScreen: 'Home'});
              if (
                nativeEvent.text !== null &&
                nativeEvent.text !== '' &&
                nativeEvent.text !== ' '
              ) {
                let response = processBarcode(data, nativeEvent.text);
                //setData([]);
                if (response !== null) {
                  setData(Array.from(response));
                  isScanningDone(response);
                }
              } else {
                setFieldError(true);
              }
              textInputRef.focus();

              if (textInputRef !== null) textInputRef.focus();

              if (flatList !== null)
                flatList.scrollToOffset({animated: true, offset: 0});
            }
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
          icon={isScanningMod ? 'keyboard' : 'camera'}
          onPress={() => {
            setIsScanningMod(isScanningMod === true ? false : true);
            if (textInputRef !== null) {
              textInputRef.focus();
            }
          }}
          loading={isLoading}
          color={'#fff'}
          style={{
            backgroundColor: !isLoading ? colors.primary : 'gray',
            padding: 8,
          }}>
          {isScanningMod ? 'Digitar' : "Escanear"}
        </Button>
      </View>
      <SafeAreaView style={{padding: 8, flex: 1}}>
        {data.length > 0 ? (
          <FlatList
            ref={ref => {
              flatList = ref;
            }}
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
                  if (textInputRef !== null) textInputRef.focus();
                }}
              />
            )}
          />
        ) : (
          <View
            style={{
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: colors.text}}>
              Nenhum codigo de barras encontrado
            </Text>
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
}

export default Scanned;
