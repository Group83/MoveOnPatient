import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, LogBox } from 'react-native';
import { Button, Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import Overlay from 'react-native-modal-overlay';
import registerForPushNotificationsAsync from './registerForPushNotificationsAsync ';
import * as Notifications from 'expo-notifications';

LogBox.ignoreAllLogs();

export default function Mood(props) {

  //notifications
  const [expoPushToken, setExpoPushToken] = useState('');
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();

  const headerfunc = () => {
    props.navigation.goBack();
  }

  //Patient id fron log in page
  const idPatient = props.route.params.id;

  //mood
  const [mood, setMood] = useState('');
  const moodType = ['מצוין', 'טוב מאוד', 'בסדר', 'לא טוב', 'רע'];
  const value = [5, 4, 3, 2, 1];
  const emoji = ['😄', '🙂', '🙄', '😕', '🥺'];
  const [colors, setColors] = useState(['#F0E5CF', '#F0E5CF', '#F0E5CF', '#F0E5CF', '#F0E5CF']);

  //SET DATE&TIME
  const time = moment(new Date()).format("YYYY-MM-DDTHH:mm");
  const sec = parseInt(time.substring(14, 16));
  const newSecStart = (sec < 30 ? '00' : '30');
  const date = time.substring(0, 14) + newSecStart;

  const changeColor = (index, key) => {
    var some_array = ['#F0E5CF', '#F0E5CF', '#F0E5CF', '#F0E5CF', '#F0E5CF'];
    some_array[key] = '#D3DE32';
    setColors(some_array);
    setMood(index);
  }

  //Overlay
  const [visible, setVisible] = useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  //DATA - url
  //send daily mood
  const apiUrl = "https://proj.ruppin.ac.il/igroup83/test2/tar6/api/DailyMood";
  const apiUrlToken = "https://proj.ruppin.ac.il/igroup83/test2/tar6/api/Patient?id=";

  useEffect(() => {

    //get user token (one time in each day)
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    //POST TOKEN
    fetch(apiUrlToken + idPatient + "&code=" + expoPushToken, {
      method: 'POST',
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
          console.log('ok token');
        }, error => {
          console.log("err token=", error);
        })

  })

  const submit = () => {

    if (!mood) { //Check for input
      toggleOverlay();
      return;
    }

    //SET DailyMood object
    let obj = [{
      DateDailyMood: date,
      MoodDailyMood: mood,
      IdPatient: idPatient
    }];

    //POST DailyMood to DB
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
          console.log('ok mood');
          props.navigation.navigate('Main Page', { id: idPatient, name: props.route.params.name, UpdatePermission: props.route.params.UpdatePermission, back: 0, expoPushToken:expoPushToken  });
        }, error => {
          console.log("err post=", error);
        })
  }

  return (
    <View style={styles.topContainer}>

      <Header
        rightComponent={<View>
          <TouchableOpacity style={{ marginLeft: 5 }} onPress={headerfunc}>
            <Icon name='angle-left' color='black' size={30} />
          </TouchableOpacity>
        </View>}
        containerStyle={{
          backgroundColor: 'white',
          justifyContent: 'space-around',
        }}
      />

      <ImageBackground source={require('../images/background1.png')} resizeMode='stretch' style={styles.image}>

        <View style={{ flex: 1 }}>
          <Text style={styles.title1}>היי  {props.route.params.name} ,</Text>
          <Text style={styles.title2}>שמחים לראות אותך שוב !</Text>
        </View>

        <View style={styles.moodContainer}>
          <Text style={styles.moodTitle}>איך אתה מרגיש היום ?</Text>
          {moodType.map((item, key) => {
            return (
              <TouchableOpacity key={key} onPress={() => changeColor(value[key], key)}>
                <View key={key} style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                  <View style={{
                    backgroundColor: 'white',
                    width: '75%',
                    height: 60,
                    marginVertical: '2%',
                    marginHorizontal: '12%',
                    borderColor: colors[key],
                    borderWidth: 5,
                    borderRadius: 10,
                  }}>
                    <Text style={styles.moodType}>{item}</Text>
                    <Text style={styles.emoji}>{emoji[key]}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>

        <Button
          title="אישור"
          buttonStyle={styles.buttonStyle}
          titleStyle={styles.titleStyle}
          containerStyle={styles.containerStyle}
          onPress={submit}
        // onPress={async () => {
        //   await sendPushNotification(expoPushToken);
        // }}
        />

        <Overlay visible={visible} onBackdropPress={toggleOverlay}
          containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center' }}
          childrenWrapperStyle={{ backgroundColor: 'white', borderWidth: 1, borderColor: 'white', borderRadius: 15, alignItems: 'center', width: '80%' }}>
          <Text style={styles.textSecondary}>
            נראה שלא הזנת מצב רוח
          </Text>
          <Button
            title="אישור"
            buttonStyle={{ backgroundColor: 'rgba(214, 61, 57, 1)' }}
            titleStyle={{ color: 'white', marginHorizontal: 15 }}
            onPress={toggleOverlay}
          />
        </Overlay>

      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({

  textSecondary: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 17,
  },

  checkCon: {
    backgroundColor: 'white',
    width: '10%',
    height: 60,
    marginVertical: '2%',
    marginLeft: '2%',
    backgroundColor: '#F0E5CF',
  },

  buttonStyle: {
    backgroundColor: '#D3DE32',
    borderRadius: 10,
    borderColor: '#D3DE32',
    borderWidth: 1,
  },

  titleStyle: {
    fontSize: 23,
    color: 'black'
  },

  containerStyle: {
    height: 43,
    width: '80%',
    top: -70,
    marginHorizontal: '10%'
  },

  emoji: {
    textAlign: 'right',
    marginHorizontal: '20%',
    fontSize: 35,
    top: -30
  },

  moodType: {
    textAlign: 'left',
    marginTop: '5%',
    marginHorizontal: '20%',
    fontFamily: 'Arial',
    fontStyle: 'normal',
    fontWeight: '100',
    fontSize: 23,
    color: '#000000',
  },

  mood: {
    backgroundColor: 'white',
    width: '75%',
    height: 60,
    marginVertical: '2%',
    marginHorizontal: '1%',
    borderColor: '#F0E5CF',
    borderLeftWidth: 1,
    borderRadius: 10,
  },

  moodTitle: {
    textAlign: 'center',
    marginVertical: '7%',
    fontFamily: 'Arial',
    fontStyle: 'normal',
    fontWeight: '100',
    fontSize: 23,
    color: '#000000',
  },

  moodContainer: {
    backgroundColor: '#F0E5CF',
    width: '80%',
    height: 460,
    marginHorizontal: '10%',
    top: -100,
    borderColor: '#F0E5CF',
    borderLeftWidth: 1,
    borderRadius: 10,
  },

  title1: {
    left: '5%',
    top: 120,
    fontFamily: 'Arial',
    fontStyle: 'normal',
    fontWeight: '100',
    fontSize: 33,
    color: '#000000',
    textAlign: 'left',
  },

  title2: {
    top: 135,
    left: '5%',
    fontFamily: 'Arial',
    fontStyle: 'normal',
    fontWeight: '100',
    fontSize: 22,
    color: '#000000',
    textAlign: 'left',
  },

  topContainer: {
    flex: 2,
  },

  image: {
    flex: 1,
    justifyContent: "center"
  },

});