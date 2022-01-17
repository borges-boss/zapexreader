import React, {Component, useState, useEffect} from 'react';
import {View, BackHandler} from 'react-native';
import BarcodeScanner from 'react-native-scan-barcode';
import HardwareUtils from '../../Logic/HardwareUtils';

/*
BarcodeFormat.UPC_A
BarcodeFormat.UPC_E
BarcodeFormat.EAN_13
BarcodeFormat.EAN_8
BarcodeFormat.RSS_14
BarcodeFormat.CODE_39
BarcodeFormat.CODE_93
BarcodeFormat.CODE_128
BarcodeFormat.ITF
BarcodeFormat.CODABAR
BarcodeFormat.QR_CODE
BarcodeFormat.DATA_MATRIX
BarcodeFormat.PDF_417
*/

async function processBarcode(result) {
  console.log(
    'List of codes fetched: ' + JSON.stringify(global.scannedBarcode),
  );
  if (
    global.scannedBarcode.filter(value => {
      return value.Codigo == result.data;
    }).length > 0
  ) {
    console.log('Code is valid');
    console.log('Codes: ' + JSON.stringify(global.scannedBarcode));

    //beep_07
    for (let i = 0; i < global.scannedBarcode.length; i++) {
      if (
        global.scannedBarcode[i].Codigo == result.data &&
        global.scannedBarcode[i].isOnTheList == undefined
      ) {
        HardwareUtils.playSound('beep_07.mp3');
        global.scannedBarcode[i].isOnTheList = true;
        break;
      }
    }
    console.log('Barcode result: ' + JSON.stringify(result));
  } else {
    console.log("It's not on the fetched list");
    if (
      global.scannedBarcode.filter(value => {
        return value.Codigo == result.data;
      }).length <= 0
    ) {
      HardwareUtils.playSound('beep_buzzer_fail.wav');
      result.isOnTheList = false;
      result.Codigo = result.data;
      console.log('Not on the list: ' + JSON.stringify(result));
      global.scannedBarcode.push(result);
      console.log('Barcode result: ' + JSON.stringify(result));
    } else {
      console.log('Already on the list');
    }
  }
}

function Barcode({navigation, route}) {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (route.params.preScreen === 'Home') {
      BackHandler.addEventListener('hardwareBackPress', function () {
        console.log('BackHardware button override');
        navigation.navigate('Home');
        return true;
      });
    } else {
      BackHandler.addEventListener('hardwareBackPress', function () {
        console.log('BackHardware button override');
        navigation.navigate('Scanned');
        return true;
      });
    }
  });

  const [scannerConfig, setScannerConfig] = useState({
    torchMode: 'off',
    cameraType: 'back',
  });

  return (
    <BarcodeScanner
      onBarCodeRead={async result => {
        if (!isProcessing) {
          setIsProcessing(true);
          await processBarcode(result);
          navigation.navigate('Scanned', {data: global.scannedBarcode});
        }
      }}
      style={{flex: 1}}
      torchMode={scannerConfig.torchMode}
      cameraType={scannerConfig.cameraType}
    />
  );
}

export default Barcode;
