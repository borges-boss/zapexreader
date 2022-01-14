import React, {Component, useCallback, useState} from 'react';
import {View, Text, Platform} from 'react-native';
import {TextInput} from 'react-native-paper';
import Toolbar from '../Components/Toolbar';
import {Button} from 'react-native-paper';
import AppStyle from '../../Assets/styles/AppStyle';
import {useTheme} from '@react-navigation/native';
import PermissionUtils from '../../Logic/PermissionUtils';
import {Snackbar} from 'react-native-paper';
//Icon ionic-ios-barcode
//import Icon from 'react-native-vector-icons/Ionicons';
//import Icon from 'react-native-vector-icons/Feather';
//Icon feather-trash-2
//Icon material-replay
function Home({navigation, route}) {
  const [mapCode, setMapCode] = useState(null);
  const [fieldError, setFieldError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message,setMessage] = useState(null);
  const {colors} = useTheme();

  const search = useCallback(() => {
    if (mapCode !== null && mapCode !== ' ') {
      setIsLoading(true);
    } else {
        setMessage("O campo não pode ficar vazio");
        setFieldError(true);
    }
  });

  return (
    <View>
      <Toolbar />
      <Text style={[AppStyle.textTitle, {marginTop: 24, marginLeft: 16}]}>
        Bem vindo ao Zapex Scanner
      </Text>
      <Text
        style={[
          AppStyle.textSubtitle,
          {marginTop: 16, marginLeft: 16, textAlign: 'left', width: '80%'},
        ]}>
        Digite o codigo do mapa no campo abaixo
      </Text>

      <View
        style={{
          paddingTop: '10%',
          height: '100%',
          alignItems: 'center',
          paddingLeft: 16,
          paddingRight: 16,
        }}>
        <View style={{width: '100%'}}>
          <TextInput
            error={fieldError}
            activeOutlineColor={colors.primary}
            placeholder={'Cogigo do mapa'}
            value={mapCode}
            onChangeText={text => {
              setMapCode(text);
            }}
            mode={'outlined'}
            style={{marginBottom: 24}}
          />
          <Button
            icon={'magnify'}
            onPress={() => {
              navigation.navigate('Barcode', {preScreen: 'Home'});
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
      </View>

      <Snackbar
        visible={message!==null}
        onDismiss={()=>{
          setMessage(null);
        }}
        action={{
          label: 'dismiss',
          onPress: () => {
            // Do something
            setMessage(null);
            setFieldError(false);
          },
        }}>
        {message}
      </Snackbar>
    </View>
  );
}

export default Home;
