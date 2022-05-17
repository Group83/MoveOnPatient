import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import WeekView, { createFixedWeekDate, addLocale } from 'react-native-week-view';
import {Header,Icon, Button } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import Overlay from 'react-native-modal-overlay';
//import Icon from 'react-native-vector-icons/FontAwesome';

export default function MainPage(props) {

  //Patient id fron Mood page
  const idPatient = props.route.params.id;

  //Types of activities
  const [types] = useState(['תרגול', 'פנאי', 'תפקוד']);

  //Percent
  const [tirgul, setTirgul] = useState();
  const [pnai, setPnai] = useState();
  const [tifkud, setTifkud] = useState();

  //Events list fron DATA
  const [myEvents, setMyEvents] = useState([]);

  //Today Date
  const todayDate = moment(new Date()).format("DD.MM.YYYY");
  const MyTodayComponent = ({ formattedDate, textStyle }) => (
    <Text style={[textStyle, { fontWeight: 'bold' }]}>{formattedDate}</Text>
  );

  //Overlay
  const [disabled, setDisabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const toggleOverlay = (e) => {
    setVisible(!visible);
    setIdAct(e.id);
    setActivity(e);
    { e.rate == 1 ? setDisabled(true) : setDisabled(false) }
  };

  //selected activity - on press activity
  const [idAct, setIdAct] = useState(0);
  const [activity, setActivity] = useState();

  //DATA url
  //percent
  const apiUrlpercent = "https://proj.ruppin.ac.il/igroup83/test2/tar6/api/Patient?id";
  //events
  const apiUrlEvents = "https://proj.ruppin.ac.il/igroup83/test2/tar6/api/PatientActivity?id";

  //EVERY RENDER
  useEffect(() => {

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
        console.log('OK Percent', item);
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
      console.log('OK Events');
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

  }, [props.route.params.name]);

  const submit = () => {
    setVisible(!visible);
    props.navigation.navigate('Rate', { id: props.route.params.id, name: props.route.params.name, activity: activity });
  }

  const headerfunc = () => {
    props.navigation.goBack();
  }

  return (
    <View style={styles.topContainer}>

      <Header
        // rightComponent={<View>
        //   <TouchableOpacity style={{ marginLeft: 5 }} onPress={headerfunc}>
        //     <Icon name='angle-left' color='black' size={30} />
        //   </TouchableOpacity>
        // </View>}
        // centerComponent={<View style={{
        //   display: 'flex',
        //   flexDirection: 'row',
        // }}>
        //   <Text style={{ fontSize: 20, marginRight: 10, marginTop: 12 }}>{props.route.params.name}</Text>
        //   <Icon name='user-o' color='black' size={25} style={{ marginTop: 10 }} />
        // </View>}
        containerStyle={{
          backgroundColor: 'white',
          justifyContent: 'space-around',
        }}
      />

      <ImageBackground source={require('../images/background2.png')} resizeMode="cover" style={styles.image}>

        <View style={styles.headerView}>
          <Text style={styles.title1}>היי  {props.route.params.name} ,</Text>
          <Text style={styles.title2}>{todayDate}</Text>
        </View>

        <View style={styles.precentView}>
          <View style={{ backgroundColor: 'rgba(253, 165, 81, 0.7)', height: 70, width: 90, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(253, 165, 81, 0.7)', marginHorizontal: 12, marginLeft: '5%' }}>
            <Text style={{ textAlign: 'center', top: -22, fontSize: 18 }}>תרגול</Text>
            <Text style={{ textAlign: 'center', top: 2, fontSize: 25, fontWeight: '500' }}>{tirgul ? Math.round(tirgul * 100) : 0}%</Text>
          </View>
          <View style={{ backgroundColor: 'rgba(249, 103, 124, 0.63)', height: 70, width: 90, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(249, 103, 124, 0.63)', marginHorizontal: 12 }}>
            <Text style={{ textAlign: 'center', top: -22, fontSize: 18 }}>תפקוד</Text>
            <Text style={{ textAlign: 'center', top: 2, fontSize: 25, fontWeight: '500' }}>{tifkud ? Math.round(tifkud * 100) : 0}%</Text>
          </View>
          <View style={{ backgroundColor: 'rgba(158, 130, 246, 0.57)', height: 70, width: 90, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(158, 130, 246, 0.57)', marginHorizontal: 12 }}>
            <Text style={{ textAlign: 'center', top: -22, fontSize: 18 }}>פנאי</Text>
            <Text style={{ textAlign: 'center', top: 2, fontSize: 25, fontWeight: '500' }}>{pnai ? Math.round(pnai * 100) : 0}%</Text>
          </View>
        </View>
        <View style={styles.fillcontainer}>
          <Progress.Bar progress={tirgul ? tirgul : 0} width={80} color={tirgul < 0.5 ? 'red' : 'lawngreen'} borderWidth={1} borderColor='darkgrey' marginHorizontal={17} />
          <Progress.Bar progress={tifkud ? tifkud : 0} width={80} color={tifkud < 0.5 ? 'red' : 'lawngreen'} borderWidth={1} borderColor='darkgrey' marginHorizontal={17} />
          <Progress.Bar progress={pnai ? pnai : 0} width={80} color={pnai < 0.5 ? 'red' : 'lawngreen'} borderWidth={1} borderColor='darkgrey' marginHorizontal={17.5} />
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
            formatDateHeader="dddd DD"
            weekStartsOn={0}
            onEventPress={toggleOverlay} //לחיצה על אירוע
          //onGridClick={(pressEvent, startHour, date) => { props.navigation.navigate('Rate') }} //לחיצה לשיבוץ פעילות
          />

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
            <View style={{
              display: 'flex',
              flexDirection: 'row',
            }}>
              <Icon name='videocam' size={40}
                style={{
                  marginTop: 10,
                  marginLeft: '18%',
                }} />
              <Text style={styles.textSecondary}>{activity ? activity.link ? activity.link : 'לא נמצא סרטון מתאים' : ''}</Text>
            </View>
            <Button
              title="דווח ביצוע"
              buttonStyle={styles.submitButton}
              titleStyle={{ color: 'black', marginHorizontal: 20, fontSize: 20 }}
              onPress={submit}
              disabled={disabled}
            />
          </Overlay>

        </View>

      </ImageBackground >
    </View>
  )
}

const styles = StyleSheet.create({

  submitButton: {
    backgroundColor: '#D3DE32',
    borderColor: '#D3DE32',
    borderRadius: 5,
    borderWidth: 1,
    marginLeft: '37%',
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
    textAlign: 'right',
    fontSize: 18,
    marginLeft: '13%'
  },

  fillcontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    top: -25,
    marginLeft: '8.5%',
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
    height: 135,
    width: '85%',
    marginTop: '4%',
    backgroundColor: '#EFEFEF',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '7%',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 10
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