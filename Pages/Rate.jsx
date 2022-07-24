import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, LogBox } from 'react-native';
import { Button, Header } from 'react-native-elements';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

LogBox.ignoreAllLogs();

export default function Rate(props) {

  //Activity
  const activity = props.route.params.activity;

  const emojiArr = [{ 1: '🥺' }, { 2: '😕' }, { 3: '🙄' }, { 4: '🙂' }, { 5: '😄' }];
  const [colorsE, setColorsE] = useState(['transparent', 'transparent', 'transparent', 'transparent', 'transparent']);
  const progressArr = ['מלא', 'חלקי', 'כלל לא'];
  const [colorsP, setColorsP] = useState(['transparent', 'transparent', 'transparent',]);
  const dificultArr = ['קשה', 'בינוני', 'קל'];
  const [colorsD, setColorsD] = useState(['transparent', 'transparent', 'transparent',]);

  //Rate
  const [freeText, setFreeText] = useState('');
  const [like, setLike] = useState('');
  const [progress, setProgress] = useState('');
  const [difficult, setDifficult] = useState('');

  const changeColor = (index) => {
    var some_array = ['transparent', 'transparent', 'transparent', 'transparent', 'transparent'];
    some_array[index] = '#D3DE32';
    setColorsE(some_array);
    setLike(index + 1);
  }

  const changeColorP = (index) => {
    var some_array = ['transparent', 'transparent', 'transparent'];
    some_array[index] = '#D3DE32';
    setColorsP(some_array);
    setProgress(progressArr[index]);
  }

  const changeColorD = (index) => {
    var some_array = ['transparent', 'transparent', 'transparent'];
    some_array[index] = '#D3DE32';
    setColorsD(some_array);
    setDifficult(dificultArr[index]);
  }

  //DATA - url
  //send rate
  const apiUrl = "https://proj.ruppin.ac.il/igroup83/test2/tar6/api/ActualPatientActivity";
  //update activity status
  const apiUrlupdate = "https://proj.ruppin.ac.il/igroup83/test2/tar6/api/ActualPatientActivity?id";

  const submit = () => {

    //SET Rate object
    let obj = [{
      IdPatientActualPatientActivity: activity.id,
      LikeTheActivityActualPatientActivity: like,
      StatusActualPatientActivity: 1,
      ActualLevelOfPerformanceActualPatientActivity: progress,
      DifficultyActualPatientActivity: difficult,
      FreeNoteActualPatientActivity: freeText,
      StartActualPatientActivity: moment(activity.startDate).format("YYYY-MM-DDTHH:mm:ss"),
      EndActualPatientActivity: moment(activity.endDate).format("YYYY-MM-DDTHH:mm:ss")
    }];

    //POST Rate to DB
    fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(obj[0]),
      headers: new Headers({
        'Content-Type': 'application/json ; charset=UTP-8',
        'Accept': 'application/json ; charset=UTP-8'
      })
    })
      .then(res => {
        return res;
      })
      .then(
        (result) => {
          console.log('OK update');
          props.navigation.navigate('Main Page', { id: props.route.params.id, name: props.route.params.name, back: activity.id, UpdatePermission: props.route.params.UpdatePermission  });
        }, error => {
          console.log('update failed', error);
        })
  }

  const skip = () => { //•••••••CHECK THIS !!!

    console.log('skip');
    console.log(activity.id);

    //UPDATE activity status
    fetch(apiUrlupdate + '=' + activity.id + '&status=1', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json ; charset=UTP-8',
        'Accept': 'application/json ; charset=UTP-8'
      })
    }).then((res) => {
      console.log('OK update');
      props.navigation.navigate('Main Page', { id: props.route.params.id, name: props.route.params.name, back: activity.id, UpdatePermission: props.route.params.UpdatePermission  });
      return res;
    }).catch((error) => {
      console.log('update failed', error);
    }).done();

  }

  return (

    <View style={styles.topContainer}>

      <Header
        rightComponent={<View>
        </View>}
        containerStyle={{
          backgroundColor: 'white',
          justifyContent: 'space-around',
        }}
      />

      <ImageBackground source={require('../images/background1.png')} resizeMode='stretch' style={styles.image}>

        <View style={{ marginTop: '25%' }}>
          <Text style={styles.title1}>איך היתה לך הפעילות ?</Text>
          <Text style={styles.title2}>אנחנו נשמח לשמוע את הכל !</Text>
        </View>

        <View style={styles.firstContainer}>
          <Text style={styles.quetionTitle}>האם נהנת מהפעילות ?</Text>
          <View style={styles.emojiContainer}>
            {emojiArr.map((item, key) => {
              return (
                <View key={key} style={{
                  flexDirection: 'row',
                }}>
                  <View style={styles.checkConE}>
                    <Icon name='check' size={30}
                      color={colorsE[key]}
                      style={{
                        textAlign: 'right',
                        top: -20,
                        right: -12
                      }} />
                  </View>
                  <TouchableOpacity onPress={() => changeColor(key)}>
                    <Text style={styles.emoji}>{item[key + 1]}</Text>
                  </TouchableOpacity>
                </View>
              )
            })}
          </View>
        </View>

        <View style={styles.secondContainer}>
          <Text style={styles.quetionTitle}>איזה חלק מהפעילות הצלחת לבצע ?</Text>
          <View style={styles.progressCon}>
            {progressArr.map((item, key) => {
              return (
                <TouchableOpacity key={key} onPress={() => changeColorP(key)}>
                  <View key={key} style={styles.progress}>
                    <View style={styles.checkConP}>
                      <Icon name='check' size={30}
                        color={colorsP[key]}
                        style={{
                          textAlign: 'right',
                          top: 2
                        }} />
                    </View>
                    <Text style={styles.progressText}>{item}</Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        <View style={styles.thirdContainer}>
          <Text style={styles.quetionTitle}>האם היה לך קשה במהלך הפעילות ?</Text>
          <View style={styles.progressCon}>
            {dificultArr.map((item, key) => {
              return (
                <TouchableOpacity key={key} onPress={() => changeColorD(key)}>
                  <View key={key} style={styles.progress}>
                    <View tyle={styles.checkConP}>
                      <Icon name='check' size={30}
                        color={colorsD[key]}
                        style={{
                          textAlign: 'right',
                          top: -5,
                          marginRight: 6
                        }} />
                    </View>
                    <Text style={styles.progressText}>{item}</Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        <KeyboardAvoidingView
          behavior="padding" keyboardVerticalOffset={Platform.OS === 'android' ? 45 : 65}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.fourthContainer}>
              <Text style={styles.quetionTitle}>נשמח אם תרצה לחלוק איתנו דברים נוספים :</Text>
              <TextInput
                style={styles.input}
                onChangeText={newText => setFreeText(newText)}
                multiline={true}
                blurOnSubmit={true}
                onSubmitEditing={() => { Keyboard.dismiss() }}
              />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

        <View style={styles.bottonContainer}>
          <Button
            title="שלח"
            buttonStyle={styles.buttonSendStyle}
            titleStyle={styles.titleStyle}
            containerStyle={styles.containerStyle}
            onPress={submit}
          />
          <Button
            title="פעם אחרת"
            buttonStyle={styles.buttonSkipStyle}
            titleStyle={styles.titleStyle}
            containerStyle={styles.containerStyle}
            onPress={skip}
          />
        </View>

      </ImageBackground>

    </View>
  )
}

const styles = StyleSheet.create({

  checkConP: {
    backgroundColor: 'white',
    width: 30,
    height: 30,
    marginHorizontal: '5%',
    marginBottom: 10,
  },

  checkConE: {
    backgroundColor: 'white',
    width: 30,
    height: 30,
    marginVertical: '1%',
    marginLeft: '1%',
  },

  input: {
    flexDirection: "row",
    height: 115,
    width: '94%',
    backgroundColor: 'white',
    marginHorizontal: '3%',
    marginVertical: '2%',
    fontSize: 18,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    textAlignVertical: 'top',
    justifyContent: 'flex-start',
  },

  progressText: {
    fontSize: 22,
  },

  progress: {
    flexDirection: 'row',
    marginHorizontal: '1%',
    backgroundColor: 'white',
    height: 40,
    width: 117,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    alignItems: 'center'
  },

  progressCon: {
    height: 50,
    marginVertical: '3%',
    marginHorizontal: '1.5%',
    borderColor: '#F0E5CF',
    borderWidth: 1,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  quetionTitle: {
    left: '5%',
    fontFamily: 'Arial',
    fontStyle: 'normal',
    fontWeight: '100',
    fontSize: 18,
    color: '#000000',
    textAlign: 'left',
    marginTop: '2%',
  },

  emoji: {
    fontSize: 33,
  },

  emojiContainer: {
    backgroundColor: 'white',
    height: 50,
    marginVertical: '3%',
    marginHorizontal: '3%',
    borderColor: '#F0E5CF',
    borderWidth: 1,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  firstContainer: {
    backgroundColor: '#F0E5CF',
    borderColor: '#F0E5CF',
    borderLeftWidth: 1,
    borderRadius: 10,
    height: 100,
    marginHorizontal: '5%',
    marginTop: '5%',
  },

  secondContainer: {
    backgroundColor: '#F0E5CF',
    borderColor: '#F0E5CF',
    borderLeftWidth: 1,
    borderRadius: 10,
    height: 100,
    marginHorizontal: '5%',
    marginTop: '2%',
  },

  thirdContainer: {
    backgroundColor: '#F0E5CF',
    borderColor: '#F0E5CF',
    borderLeftWidth: 1,
    borderRadius: 10,
    height: 100,
    marginHorizontal: '5%',
    marginTop: '2%',

  },

  fourthContainer: {
    backgroundColor: '#F0E5CF',
    borderColor: '#F0E5CF',
    borderLeftWidth: 1,
    borderRadius: 10,
    height: 160,
    marginHorizontal: '5%',
    marginTop: '2%',
  },

  bottonContainer: {
    height: 100,
    marginTop: '1%',
    marginBottom: '10%',
  },

  buttonSendStyle: {
    backgroundColor: '#D3DE32',
    borderRadius: 10,
    borderColor: '#D3DE32',
    borderWidth: 1,
  },

  buttonSkipStyle: {
    backgroundColor: '#F9677C',
    borderRadius: 10,
    borderColor: '#F9677C',
    borderWidth: 1,
  },

  titleStyle: {
    fontSize: 20,
    color: 'black'
  },

  containerStyle: {
    height: 43,
    marginHorizontal: '5%',
    marginTop: '2%',
  },

  title1: {
    left: '5%',
    fontFamily: 'Arial',
    fontStyle: 'normal',
    fontWeight: '100',
    fontSize: 33,
    color: '#000000',
    textAlign: 'left',
  },

  title2: {
    left: '5%',
    fontFamily: 'Arial',
    fontStyle: 'normal',
    fontWeight: '100',
    fontSize: 22,
    color: '#000000',
    textAlign: 'left',
    marginTop: 8
  },

  topContainer: {
    flex: 1,
  },

  image: {
    flex: 1,
    justifyContent: "center"
  },

});