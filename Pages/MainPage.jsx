import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Linking, LogBox } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import WeekView, { createFixedWeekDate, addLocale } from 'react-native-week-view';
import { Header, Icon, Button } from 'react-native-elements';
import moment from 'moment';
import Overlay from 'react-native-modal-overlay';
import registerForPushNotificationsAsync from './registerForPushNotificationsAsync ';
import * as Notifications from 'expo-notifications';

LogBox.ignoreAllLogs();

export default function MainPage(props) {

  //Patient id fron Mood page
  const idPatient = props.route.params.id;

  //UpdatePermission
  const UpdatePermission = props.route.params.UpdatePermission;

  //Types of activities
  const [types] = useState(['תרגול', 'פנאי', 'תפקוד']);

  //Percent
  const [tirgul, setTirgul] = useState();
  const [pnai, setPnai] = useState();
  const [tifkud, setTifkud] = useState();
  //total
  const [total, setTotal] = useState();

  //Events list fron DATA
  const [myEvents, setMyEvents] = useState([]);

  //Today Date
  const todayDate = moment(new Date()).format("DD.MM.YYYY");
  const MyTodayComponent = ({ formattedDate, textStyle }) => (
    <Text style={[textStyle, { fontWeight: 'bold' }]}>{formattedDate}</Text>
  );

  //Overlay
  const [disabledRate, setDisabledRate] = useState(false);
  const disabledDelete = (UpdatePermission === 1 ? false : true);
  const [visible, setVisible] = useState(false);
  const toggleOverlay = (e) => {
    setVisible(!visible);
    setActivity(e);
    { e.rate == 1 ? setDisabledRate(true) : setDisabledRate(false) }
  };
  const [ref, setRef] = useState(0);

  //selected activity - on press activity
  const [activity, setActivity] = useState();

  //DATA url
  //percent
  const apiUrlpercent = "https://proj.ruppin.ac.il/igroup83/test2/tar6/api/Patient?id";
  //events
  const apiUrlEvents = "https://proj.ruppin.ac.il/igroup83/test2/tar6/api/PatientActivity?id";
  //delete
  const urlDelete = "https://proj.ruppin.ac.il/igroup83/test2/tar6/api/PatientActivity?id";
  //alert
  const apiUrlAlert = "https://proj.ruppin.ac.il/igroup83/test2/tar6/api/Alert?id=";


  //notification
  //notifications
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  //EVERY RENDER
  useEffect(() => {

    // This listener is fired whenever a notification is received while the app is foregrounded 
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      //console.log(notification);
      setNotification(notification);
    });
    //This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed) 
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      //console.log(response);
      setNotification(response.notification);
    });

    setInterval(sendPushNotification, 900000); //every 15 min

    types.map((item) => {

      //GET percentages of activities
      fetch(apiUrlpercent + '=' + idPatient + '&clasification=' + item, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json ; charset=UTP-8',
          'Accept': 'application/json ; charset=UTP-8'
        })
      }).then(
        (response) => response.json()
      ).then((res) => {
        if (res) {
          var obj = res.map(percent => percent);
          obj.map((percent) => {
            if (percent) {
              if (item == 'תרגול') {
                setTirgul(percent.ComplishionPresentae);
              }
              if (item == 'תפקוד') {
                setTifkud(percent.ComplishionPresentae);
              }
              if (item == 'פנאי') {
                setPnai(percent.ComplishionPresentae);
              }
            }
          })
        } else {
          console.log('percent in empty');
        }
        return res;
      }).catch((error) => {
        console.log('percent in empty');
      }).done();
    })

    //GET total percent
    fetch(apiUrlpercent + '=' + idPatient, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json ; charset=UTP-8',
        'Accept': 'application/json ; charset=UTP-8'
      })
    }).then(
      (response) => response.json()
    ).then((res) => {
      //console.log('total : ', res[0]);
      setTotal(res[0].ComplishionPresentae);
      return res;
    }).catch((error) => {
      console.log('total is empty');
    }).done();

    //GET patient events from DATA
    fetch(apiUrlEvents + "=" + idPatient, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json ; charset=UTP-8',
        'Accept': 'application/json ; charset=UTP-8'
      })
    }).then(
      (response) => response.json()
    ).then((res) => {
      var arr = [];
      if (res) {
        res.map((event, key) => {

          let check = event.IsRated == 1 ? '✔️  ' : '';

          let obj = { //set new object for every event to match for this calender
            id: event.IdPatientActivity,
            name: event.ActivityName,
            key: key,
            description: check + event.ActivityName,
            startDate: new Date(event.StartPatientActivity),
            endDate: new Date(event.EndPatientActivity),
            color: (event.ActivityClassification == 'פנאי' ? 'rgba(158, 130, 246, 0.85)' : event.ActivityClassification == 'תרגול' ? 'rgba(253, 165, 81, 0.85)' : 'rgba(249, 103, 124, 0.85)'),
            type: event.ActivityClassification,
            link: event.ActivityLink,
            about: event.DescriptionActivity,
            isMoved: event.IsMoveablePatientActivity,
            isRequired: event.IsMandatoryPatientActivity,
            repetition: event.RepetitionPatientActivity,
            sets: event.SetsPatientActivity,
            rate: event.IsRated
          };
          arr = [...arr, obj]; //add to arr
        });
        setMyEvents(arr);
      } else {
        console.log('Events is empty');
      }
      return res;
    }).catch((error) => {
      console.log("err GET Events=", error);
    }).done();

  }, [props.route.params.back, ref]);

  //send notification
  const sendPushNotification = () => {
    
    //GET notifications
    fetch(apiUrlAlert + idPatient, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json ; charset=UTP-8',
        'Accept': 'application/json ; charset=UTP-8'
      })
    }).then(
      (response) => response.json()
    ).then((res) => {
      if (res[0]) {

        //check
        const time = moment(new Date()).format("HH:mm:ss");
        console.log(time, res[0]);

        //make message
        const message = {
          to: res[0].Code,
          sound: 'default',
          title: "מחכה לך פעילות " + res[0].AlertDateTime + " באפליקציה",
          body: res[0].PartA_data + ' ' + res[0].PartB_data + ' ' + res[0].PartC_data,
          // data: { name: "nir", seconds: new Date().getSeconds()}
        };

        //send message
        fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });

      } else {
        console.log('alert is empty');
      }
      return res;
    }).catch((error) => {
      console.log('alert is empty');
    }).done();

  }

  const submit = () => {
    setVisible(!visible);
    //console.log(activity.id);
    props.navigation.navigate('Rate', { id: props.route.params.id, name: props.route.params.name, activity: activity });
  }

  //DELETE activity
  const deleteActivity = () => {

    //DELETE activity from data
    fetch(urlDelete + "=" + activity.id, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json ; charset=UTP-8',
        'Accept': 'application/json ; charset=UTP-8'
      })
    }).then(res => {
      return res;
    }).then((result) => {
      setRef(!ref);
      setVisible(!visible);
      return result;
    }).catch((error) => {
      console.log("err GET Activityes=", error);
    }).done();

  }

  return (
    <View style={styles.topContainer}>

      <Header
        rightComponent={<View>
          <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => { props.navigation.navigate('Log in') }}>
            <Icon name='logout' color='black' size={27} style={{ marginTop: 12, transform: [{ rotateY: '180deg' }] }} />
          </TouchableOpacity>
        </View>}
        centerComponent={<View style={{
          display: 'flex',
          flexDirection: 'row',
        }}>
          <Text style={{ fontSize: 20, marginRight: 10, marginTop: 14 }}>{props.route.params.name}</Text>
          <Icon name='account-circle' color='black' size={33} style={{ marginTop: 10 }} />
        </View>}
        containerStyle={{
          backgroundColor: 'white',
          justifyContent: 'space-around',
        }}
      />

      <ImageBackground source={require('../images/background2.png')} resizeMode="cover" style={styles.image}>

        <View style={styles.headerView}>
          <Text style={styles.title2}>{todayDate}</Text>
        </View>

        <View style={styles.precentView}>
          <View style={{ marginTop: '5%', backgroundColor: 'rgba(253, 165, 81, 0.7)', height: 80, width: 105, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(253, 165, 81, 0.7)', marginHorizontal: 15, marginLeft: '5%' }}>
            <Text style={{ textAlign: 'center', top: -22, fontSize: 18 }}>תרגול</Text>
            <Text style={{ textAlign: 'center', top: 5, fontSize: 25, fontWeight: '400' }}>{tirgul ? Math.round(tirgul * 100) : 0}%</Text>
          </View>
          <View style={{ marginTop: '5%', backgroundColor: 'rgba(249, 103, 124, 0.63)', height: 80, width: 105, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(249, 103, 124, 0.63)', marginHorizontal: 15 }}>
            <Text style={{ textAlign: 'center', top: -22, fontSize: 18, marginTop: 1 }}>תפקוד</Text>
            <Text style={{ textAlign: 'center', top: 5, fontSize: 25, fontWeight: '400' }}>{tifkud ? Math.round(tifkud * 100) : 0}%</Text>
          </View>
          <View style={{ marginTop: '5%', backgroundColor: 'rgba(158, 130, 246, 0.57)', height: 80, width: 105, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(158, 130, 246, 0.57)', marginHorizontal: 15 }}>
            <Text style={{ textAlign: 'center', top: -22, fontSize: 18, marginTop: 1 }}>פנאי</Text>
            <Text style={{ textAlign: 'center', top: 5, fontSize: 25, fontWeight: '400' }}>{pnai ? Math.round(pnai * 100) : 0}%</Text>
          </View>
        </View>

        <View style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: '5%',
        }}>
          <Text style={{ textAlign: 'left', fontSize: 18, marginLeft: '6%', marginTop: 2 }}>ההתקדמות שלי</Text>
          <Icon name='directions-run' size={27} style={{ marginHorizontal: '2%', transform: [{ rotateY: '180deg' }], top: -2 }} />
          <Text style={{ textAlign: 'left', fontSize: 18, marginTop: 2 }}>...</Text>
        </View>

        <View style={styles.totalPer}>
          <View style={{
            backgroundColor: total < 0.3 ? '#FF4949' : total < 0.6 ? '#FF8D29' : '#8BDB81',
            height: '100%',
            width: total * 100 + '%',
            borderWidth: 1,
            borderRadius: 14,
            borderColor: total < 0.3 ? '#FF4949' : total < 0.6 ? '#FF8D29' : '#8BDB81',
          }}></View>
          <Text style={styles.totalPerText}>{total ? Math.round(total * 100) : 0}%</Text>
        </View>

        <View style={styles.calenderView}>
          <WeekView
            local={moment.updateLocale('en', {
              months: [
                "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי",
                "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
              ],
              weekdays: [
                'ראשון', 'שני', 'שלישי', 'רביעי'
                , 'חמישי', 'שישי', 'שבת'
              ]
            })}
            startHour={7}
            timeStep={30}
            events={myEvents}
            selectedDate={new Date()}
            numberOfDays={1} //מספר הימים המוצגים
            showTitle={true}
            headerStyle={{ backgroundColor: '#EFEFEF', borderColor: '#EFEFEF' }}
            hoursInDisplay={8} //מקטין את המרווחים בין השעות
            TodayHeaderComponent={MyTodayComponent}
            formatDateHeader="dddd      DD"
            weekStartsOn={0}
            onEventPress={toggleOverlay} //לחיצה על אירוע
            onGridClick={UpdatePermission === 1 ? (pressEvent, startHour, date) => { props.navigation.navigate('Add Activity', { Date: date, StartHour: startHour, id: props.route.params.id, name: props.route.params.name, UpdatePermission: props.route.params.UpdatePermission }) } : ''} //לחיצה לשיבוץ פעילות
            headerTextStyle={{ fontSize: 17 }}
            hourTextStyle={{ fontSize: 14 }}
            eventContainerStyle={{ size: 30 }}
          />

          {/* Activity Overlay */}
          <Overlay visible={visible} onBackdropPress={toggleOverlay}
            containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            childrenWrapperStyle={{ backgroundColor: activity ? activity.color : 'transparent', opacityValue: 5, borderWidth: 1, borderColor: 'rgba(176, 219, 239, 0.83)', borderRadius: 15, alignItems: 'right' }}>
            <TouchableOpacity onPress={toggleOverlay}>
              <Icon name='close' size={20}
                style={{
                  marginBottom: 8,
                }} />
            </TouchableOpacity>
            <Text style={styles.texttitle}>{activity ? activity.name : ''}</Text>
            <Text style={styles.Secondarytitle}>{activity ? activity.about : ''}</Text>

            <View style={{
              display: 'flex',
              flexDirection: 'row',
            }}>
              <Icon name='schedule' size={40}
                style={{
                  marginTop: 10,
                  marginLeft: '18%',
                }} />
              <Text style={styles.textSecondary}>{activity ? moment(activity.startDate).format("HH:MM") : ''}</Text>
            </View>

            <View style={{
              display: 'flex',
              flexDirection: 'row',
            }}>
              <Icon name='accessibility' size={40}
                style={{
                  marginTop: 10,
                  marginLeft: '18%',
                }} />
              <Text style={styles.textSecondary}>{activity ? activity.repetition : '0'} X {activity ? activity.sets : '0'}</Text>
            </View>

            <TouchableOpacity style={{
              display: 'flex',
              flexDirection: 'row'
            }} onPress={() => (activity ? activity.link ? Linking.openURL(activity.link) : '' : '')}>
              <Icon name={activity ? activity.link ? 'videocam' : '' : ''} size={40}
                style={{
                  marginTop: 10,
                  marginLeft: '18%',
                }} />
              <Text style={styles.textSecondary}>{activity ? activity.link ? ' לחץ לצפייה בסרטון' : '' : ''}</Text>
            </TouchableOpacity>

            <View style={{
              display: 'flex',
              flexDirection: 'row'
            }}>
              <Button
                title="דווח ביצוע"
                buttonStyle={styles.submitButton}
                titleStyle={{ color: 'black', marginHorizontal: 20, fontSize: 20 }}
                onPress={submit}
                disabled={disabledRate}
              />
              <Button
                title="מחק פעילות"
                buttonStyle={styles.deleteButton}
                titleStyle={{ color: 'black', marginHorizontal: 20, fontSize: 20 }}
                onPress={deleteActivity}
                disabled={disabledDelete}
              />
            </View>

          </Overlay>

        </View>

      </ImageBackground >
    </View>
  )
}

const styles = StyleSheet.create({

  totalPerText: {
    textAlign: 'center',
    fontSize: 20,
    top: -27
  },

  totalPer: {
    backgroundColor: '#EFEFEF',
    width: '90%',
    marginHorizontal: '5%',
    height: 33,
    position: 'relative',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'black',
    marginBottom: '5%'
  },

  submitButton: {
    backgroundColor: '#D3DE32',
    borderColor: 'rgba(0, 0, 0, 0)',
    borderRadius: 5,
    borderWidth: 1,
    marginHorizontal: '5%',
    marginTop: '15%'
  },

  deleteButton: {
    backgroundColor: 'rgba(214, 61, 57, 1)',
    borderColor: 'rgba(0, 0, 0, 0)',
    borderRadius: 5,
    borderWidth: 1,
    marginHorizontal: '5%',
    marginTop: '15%'
  },

  texttitle: {
    marginTop: 7,
    textAlign: 'left',
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 10,
    marginLeft: '13%'
  },

  textSecondary: {
    marginTop: 18,
    textAlign: 'right',
    fontSize: 18,
  },

  Secondarytitle: {
    marginVertical: 5,
    textAlign: 'left',
    fontSize: 18,
    marginLeft: '13%'
  },

  fillcontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    top: -25,
    marginHorizontal: '3.5%'
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
    fontSize: 18,
    color: '#000000',
    textAlign: 'left',
    marginTop: '3%'
  },

  topContainer: {
    flex: 1,
    backgroundColor: 'white'
  },

  headerView: {
    height: 65,
    width: '95%',
    marginTop: '3%',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },

  precentView: {
    height: 120,
    width: '97%',
    backgroundColor: 'rgba(239, 239, 239, 0.8)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '1.5%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'rgba(239, 239, 239, 0.8)',
  },

  calenderView: {
    height: 545,
    width: '100%',
    marginTop: '1%',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },

  image: {
    flex: 1,
    justifyContent: "center",
  },

});