import { View, Text, ImageBackground, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, Icon, Header } from 'react-native-elements';
import React, { useState } from 'react';
import Overlay from 'react-native-modal-overlay';

export default function Login({ navigation }) {

  //Input variables
  const [nicknameInput, setNicknameInput] = useState({ color: '#a9a9a9', text: 'My_Nickname' });
  const [passInput, setPassInput] = useState({ color: '#a9a9a9', text: '********' });
  const [nicknameInputFocus, setNicknameInputFocus] = useState(false);
  const [passwordInputFocus, setPasswordInputFocus] = useState(false);

  //User 
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [patient, setPatient] = useState('');

  //Overlay
  const [visible, setVisible] = useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  //DATA - url
  const apiUrl = "https://proj.ruppin.ac.il//igroup83/test2/tar6/api/Patient?email";
  const apiUrlmood = "https://proj.ruppin.ac.il//igroup83/test2/tar6/api/DailyMood?id";

  //check User function
  const checkUser = () => {

    //check empty fields
    if (!nickname.trim()) { //Check for the Nickname TextInput
      let newobj = { color: 'red', text: 'נראה ששכחת להזין כינוי' };
      setNicknameInput(newobj)
      return;
    }
    if (!password.trim()) { //Check for the Name TextInput
      let newobj = { color: 'red', text: 'נראה ששכחת להזין סיסמא' };
      setPassInput(newobj)
      return;
    }

    //GET user from DB
    fetch(apiUrl + "=" + nickname + "&password=" + password, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json ; charset=UTP-8',
        'Accept': 'application/json ; charset=UTP-8'
      })
    })
      .then(res => {
        return res.json();
      })
      .then(
        (result) => {
          if (result[0]) { //found user

            console.log('Patient : ', result[0]);
            setPatient(result[0]);

            //GET mood from DB
            fetch(apiUrlmood + "=" + patient.IdPatient, {
              method: 'GET',
              headers: new Headers({
                'Content-Type': 'application/json ; charset=UTP-8',
                'Accept': 'application/json ; charset=UTP-8'
              })
            })
              .then(res => {
                return res.json();
              })
              .then(
                (result) => {

                  console.log('mood : ', result[0]);

                  if (result.Message === "The request is invalid.") {

                    //GET user from DB
                    fetch(apiUrl + "=" + nickname + "&password=" + password, {
                      method: 'GET',
                      headers: new Headers({
                        'Content-Type': 'application/json ; charset=UTP-8',
                        'Accept': 'application/json ; charset=UTP-8'
                      })
                    })
                      .then(res => {
                        return res.json();
                      })
                      .then(
                        (result) => {
                          navigation.navigate('Main Page', { id: result[0].IdPatient, name: result[0].NicknamePatient, UpdatePermission: result[0].UpdatePermissionPatient, back: 0 });
                        },
                        (error) => {
                          console.log("err GET=", error);
                        });

                  } else if (typeof (result[0]) !== 'undefined' || result.Message === "The request is invalid.") {
                    navigation.navigate('Main Page', { id: patient.IdPatient, name: patient.NicknamePatient, UpdatePermission: patient.UpdatePermissionPatient, back: 0 });
                  }
                  else {
                    navigation.navigate('Mood', { id: patient.IdPatient, name: patient.NicknamePatient, UpdatePermission: patient.UpdatePermissionPatient });
                  }
                },
                (error) => {
                  console.log("err GET=", error);
                });
          }
          else { //not found user
            toggleOverlay();
          }
        },
        (error) => {
          console.log("err GET=", error);
        });
  }

  return (

    <View style={styles.topContainer}>

      <Header
        centerComponent={
          <Image
            source={require('../images/newlogo.jpeg')}
            resizeMode='contain'
            style={{ width: 230, alignSelf: 'auto', height: 35 }}
          />
        }
        containerStyle={{
          backgroundColor: 'white',
          justifyContent: 'space-around',
        }}
      />

      <ImageBackground source={require('../images/newbackground.png')} resizeMode='stretch' style={styles.image}>

        <Text style={styles.title}>כניסה לחשבון</Text>
        <View style={styles.inputSection}>
          <Icon style={styles.icon} name="person" size={20} color="#000" />
          <TextInput
            style={[styles.inputNickname, { borderBottomColor: nicknameInputFocus ? '#fc7b03' : '#000' }]}
            onChangeText={newText => setNickname(newText)}
            placeholder={nicknameInput.text}
            placeholderTextColor={nicknameInput.color}
            textAlign='right'
            onFocus={event => setNicknameInputFocus(true)}
            onBlur={event => setNicknameInputFocus(false)}
          />
        </View>

        <View style={styles.inputSection}>
          <Icon style={styles.icon} name="vpn-key" size={20} color="#000" />
          <TextInput
            style={[styles.inputPass, { borderBottomColor: passwordInputFocus ? '#fc7b03' : '#000' }]}
            onChangeText={newText => setPassword(newText)}
            placeholder={passInput.text}
            placeholderTextColor={passInput.color}
            textAlign='right'
            secureTextEntry={true}
            onFocus={event => setPasswordInputFocus(true)}
            onBlur={event => setPasswordInputFocus(false)}
          />
        </View>

        <TouchableOpacity onPress={() => {
          navigation.navigate('Reset Password');
        }}>
          <Text style={styles.text}>שכחתי סיסמא</Text>
        </TouchableOpacity>

        <View>
          <Button
            title="כניסה"
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.titleStyle}
            containerStyle={styles.containerStyle}
            onPress={checkUser}
          />
          <Overlay visible={visible} onBackdropPress={toggleOverlay}
            containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center' }}
            childrenWrapperStyle={{ backgroundColor: 'white', borderWidth: 1, borderColor: 'white', borderRadius: 15, alignItems: 'center', width: '80%' }}>
            <Text style={styles.textSecondary}>
              הכינוי או הסיסמה שהזנת אינם קיימים במערכת
            </Text>
            <Button
              title="אישור"
              buttonStyle={{ backgroundColor: 'rgba(214, 61, 57, 1)' }}
              titleStyle={{ color: 'white', marginHorizontal: 15 }}
              onPress={toggleOverlay}
            />
          </Overlay>
        </View>

      </ImageBackground>
    </View >
  )
}

const styles = StyleSheet.create({

  inputSection: {
    flexDirection: 'row',
    top: -200
  },

  icon: {
    marginLeft: 50,
    marginRight: 15,
    marginTop: 35
  },

  topContainer: {
    flex: 1,
  },

  textSecondary: {
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center',
    fontSize: 17,
  },

  image: {
    flex: 1,
    justifyContent: "center"
  },

  title: {
    flex: 1,
    width: 380,
    left: 50,
    top: 250,
    fontFamily: 'Arial',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 35,
    color: '#000000',
    textAlign: 'left',
  },

  inputNickname: {
    flexDirection: "row",
    height: 50,
    marginVertical: 20,
    backgroundColor: 'white',
    flexShrink: 1,
    flexWrap: 'wrap',
    width: '60%',
    marginBottom: 10,
    borderBottomWidth: 1,
    fontSize: 15
  },

  inputPass: {
    flexDirection: "row",
    height: 50,
    marginVertical: 20,
    backgroundColor: 'white',
    flexShrink: 1,
    flexWrap: 'wrap',
    width: '60%',
    marginBottom: 90,
    borderBottomWidth: 1,
    fontSize: 15
  },

  text: {
    top: -258,
    color: '#313131',
    right: '65%'
  },

  buttonStyle: {
    backgroundColor: '#D3DE32',
    borderRadius: 5,
    borderColor: '#000000',
    borderWidth: 1,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 56, height: 13 },
    shadowRadius: 5,
    shadowOffset: { width: 0.1, height: 0.1 },
  },

  titleStyle: {
    fontSize: 23,
    color: 'black'
  },

  containerStyle: {
    height: 43,
    width: '62%',
    top: -175,
    marginHorizontal: '19%'
  },

  iconContainerStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    top: -170,
    marginHorizontal: 0,
  },

});