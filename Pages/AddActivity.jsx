import { View, Text, StyleSheet, ImageBackground, ScrollView, Switch, TouchableOpacity, TextInput } from 'react-native';
import { Button, Icon, Header } from 'react-native-elements';
import React, { useState } from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import moment from 'moment';
import Overlay from 'react-native-modal-overlay';

export default function AddActivity(props) {
    //SET DATE&TIME
    const time = moment(props.route.params.Date).format("YYYY-MM-DDTHH:mm");
    const sec = parseInt(time.substring(14, 16));
    const newSecStart = (sec < 30 ? '00' : '30');
    const startTime = time.substring(0, 14) + newSecStart;
    const endTime = moment(startTime, "YYYY-MM-DDThh:mm").add(30, 'minutes').format('YYYY-MM-DDThh:mm');
    const idPatient = props.route.params.id;

    //Select options
    const activityType = ["תרגול", "פנאי", "תפקוד"]

    //Activity List - from DATA and after SEARCH
    const [DataActivities, SetDataActivities] = useState([]);
    const [activityes, setActivityes] = useState([]);

    //Search Bar
    const onChangeSearch = query => {
        if (query) {
            var filterData = DataActivities.filter(item => item.ActivityName.includes(query));
            setActivityes(filterData);
        }
        else {
            setActivityes(DataActivities);
        }
    }

    //Activity variables
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [about, setAbout] = useState('');
    const [idActivity, setIdActivity] = useState(0);
    const [sets, setSets] = useState('');
    const [repit, setRepit] = useState('');
    const [type, setType] = useState('');
    const [isEnabledMoved, setIsEnabledMoved] = useState(0);
    const [isEnabledRequired, setIsEnabledRequired] = useState(0);

    //Activity object from data to list
    const [fillName, setFillName] = useState();
    const [fillLink, setFillLink] = useState();
    const [fillAbout, setFillAbout] = useState();

    //Input variables
    const [nameInput, setNameInput] = useState({ color: '#a9a9a9', text: 'שם הפעילות' });
    const [aboutInput, setAboutInput] = useState({ color: '#a9a9a9', text: 'אודות' });

    //Toggle Switch
    const toggleSwitchMoved = () => {
        setIsEnabledMoved(previousState => !previousState);
    }
    const toggleSwitchRequired = () => {
        setIsEnabledRequired(previousState => !previousState);
    }

    //Overlay
    const [visible, setVisible] = useState(false);
    const toggleOverlay = () => {
        setVisible(!visible);
    };

    //DATA - url
    //activityes
    const apiUrlAddActivity = "https://proj.ruppin.ac.il/igroup83/test2/tar6/api/PatientActivity";
    //events
    const apiUrlEvents = "https://proj.ruppin.ac.il/igroup83/test2/tar6/api/Activity?activityClassification";

    const addToBoard = () => {

        //check empty fields
        if (!name.trim()) { //Check for the Name TextInput
            let newobj = { color: 'red', text: 'נראה שחסרה שם פעילות' };
            setNameInput(newobj)
            return;
        }
        if (!about.trim()) { //Check for the about TextInput
            let newobj = { color: 'red', text: 'נראה שחסר טקסט אודות' };
            setAboutInput(newobj)
            return;
        }
        if (!type.trim()) { //Check for the about TextInput
            setVisible(!visible);
            return;
        }

        //SET promossions
        let moved = (isEnabledMoved ? 1 : 0);
        let required = (isEnabledRequired ? 1 : 0);

        //SET activity object
        let obj = [{
            StartPatientActivity: startTime,
            EndPatientActivity: endTime,
            RepetitionPatientActivity: repit,
            SetsPatientActivity: sets,
            IsMoveablePatientActivity: moved,
            IsMandatoryPatientActivity: required,
            IdPatient: idPatient,
            IdActivity: idActivity,
            StatusPatientActivity: 1,
            ActivityLink: link,
            ActivityName: name,
            ActivityClassification: type,
            DescriptionActivity: about
        }];

        //PUT activity to DB
        fetch(apiUrlAddActivity, {
            method: 'PUT',
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
                    props.navigation.navigate('Main Page', { id: idPatient, name: props.route.params.name, back: obj[0].IdActivity });
                }, error => {
                    console.log("err post=", error);
                })
    }

    //fill inputs with exist activity data
    const fillActivity = (e) => {
        setFillName(e.ActivityName);
        setName(e.ActivityName);
        setFillLink(e.ActivityLink);
        setLink(e.ActivityLink);
        setFillAbout(e.DescriptionActivity);
        setAbout(e.DescriptionActivity);
        setIdActivity(e.IdActivity);
    }

    //render exist selected type activityes
    const changeActivityType = type => {

        setType(type); //selected type

        //GET selected type activityes nfrom DB
        fetch(apiUrlEvents + "=" + type, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json ; charset=UTP-8',
                'Accept': 'application/json ; charset=UTP-8'
            })
        }).then(
            (response) => response.json()
        ).then((res) => {
            console.log('OK Activityes');
            if (res) {
                var obj = res.map(activity => activity);
                SetDataActivities(obj);
                setActivityes(obj);
            } else {
                console.log('Activityes in empty');
            }
            return res;
        }).catch((error) => {
            console.log("err GET Activityes=", error);
        }).done();
    }

    const headerfunc = () => {
        props.navigation.goBack();
    }

    return (

        <View style={styles.topContainer}>

            <Header
                rightComponent={<View>
                    <TouchableOpacity style={{ marginTop: 6, marginLeft: 5 }} onPress={headerfunc}>
                        <Icon name='arrow-back-ios' color='black' size={25} />
                    </TouchableOpacity>
                </View>}
                containerStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    justifyContent: 'space-around',
                }}
            />

            <ImageBackground source={require('../images/background1.png')} resizeMode="cover" style={styles.image}>
                <Text style={styles.title}>פעילות חדשה</Text>
                <View style={styles.container}>

                    {/* left container */}
                    <View style={styles.leftcontainer}>
                        <SelectDropdown
                            rowTextStyle={{ fontSize: 15 }}
                            data={activityType}
                            defaultButtonText={'בחר סוג פעילות'}
                            buttonTextStyle={{ fontSize: 18 }}
                            buttonStyle={{ height: 40, width: '90%', borderColor: "black", borderWidth: 0.5, borderRadius: 5, marginHorizontal: '5%', marginVertical: '5%', backgroundColor: '#F0E5CF' }}
                            onSelect={changeActivityType}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem
                            }}
                            rowTextForSelection={(item, index) => {
                                return item
                            }}
                        />
                        <TextInput
                            defaultValue={fillName}
                            style={styles.input}
                            placeholder={nameInput.text}
                            onChangeText={newText => setName(newText)}
                            placeholderTextColor={nameInput.color}
                            textAlign='right'
                        />
                        <TextInput
                            defaultValue={fillLink}
                            style={styles.inputLink}
                            onChangeText={newText => setLink(newText)}
                            placeholder="כתובת סרטון"
                            placeholderTextColor="#a9a9a9"
                            textAlign='right'
                            multiline={true}
                        />
                        <TextInput
                            defaultValue={fillAbout}
                            style={styles.inputDisc}
                            onChangeText={newText => setAbout(newText)}
                            placeholder={aboutInput.text}
                            placeholderTextColor={aboutInput.color}
                            textAlign='right'
                            multiline={true}
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={newText => setSets(newText)}
                            placeholder="מספר סטים"
                            placeholderTextColor="#a9a9a9"
                            textAlign='right'
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={newText => setRepit(newText)}
                            placeholder="מספר חזרות"
                            placeholderTextColor="#a9a9a9"
                            textAlign='right'
                        />
                    </View>

                    {/* right container */}
                    <View style={styles.rightcontainer}>
                        <Text style={styles.text}>רשימת פעילויות</Text>
                        <View style={styles.Searchbar}>
                            <View style={styles.searchSection}>
                                <Icon style={styles.searchIcon} name="search" size={25} color="#000" />
                                <TextInput
                                    style={styles.searchinput}
                                    onChangeText={onChangeSearch}
                                    placeholder="חיפוש"
                                    textAlign='right'
                                />
                            </View>
                            <View style={styles.scrollView}>
                                <ScrollView>
                                    {activityes.map((item, key) => {
                                        return (
                                            <TouchableOpacity key={key} onPress={() => fillActivity(item)}>
                                                <Text style={styles.activity}>{item.ActivityName}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </View>
                <Button
                    title="שמור"
                    buttonStyle={styles.buttonStyle}
                    titleStyle={styles.titleStyle}
                    containerStyle={styles.containerStyle}
                    onPress={addToBoard}
                />
                <Overlay visible={visible} onBackdropPress={toggleOverlay}
                    containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center' }}
                    childrenWrapperStyle={{ backgroundColor: 'white', borderWidth: 1, borderColor: 'white', borderRadius: 15, alignItems: 'center', width: '80%' }}>
                    <Text style={styles.textSecondary}>
                        נראה שלא הזנת סוג פעילות
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

    searchSection: {
        flexDirection: 'row',
    },

    searchIcon: {
        marginTop: '35%'
    },

    topContainer: {
        flex: 1,
    },

    toggleinput: {
        marginHorizontal: '5%',
        marginTop: '3%',
        fontSize: 15
    },

    toggleRequired: {
        flexDirection: "row",
        marginTop: '10%',
    },

    toggleMoved: {
        flexDirection: "row",
        marginTop: '10%',
    },

    searchinput: {
        flexDirection: "row",
        height: 40,
        marginHorizontal: '2%',
        backgroundColor: 'white',
        flexShrink: 1,
        flexWrap: 'wrap',
        width: '90%',
        borderBottomWidth: 1,
        fontSize: 15
    },

    activity: {
        marginTop: '2%',
        padding: 20,
        backgroundColor: 'rgba(255, 173, 96, 0.59)',
        display: 'flex',
        borderWidth: 0.3,
        borderRadius: 10,
        borderColor: 'black',
        textAlign: 'left',
        fontSize: 15
    },

    Searchbar: {
        marginHorizontal: '1%',
        marginVertical: '10%'
    },

    inputDisc: {
        flexDirection: "row",
        height: 200,
        width: '92%',
        borderBottomWidth: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        borderColor: 'black',
        fontSize: 15,
        marginTop: '5%',
        marginHorizontal: '3%',
    },

    input: {
        flexDirection: "row",
        height: 40,
        width: '92%',
        marginTop: '5%',
        marginHorizontal: '3%',
        backgroundColor: 'white',
        borderRadius: 5,
        borderBottomWidth: 1,
        fontSize: 15
    },

    inputLink: {
        flexDirection: "row",
        height: 85,
        width: '92%',
        backgroundColor: 'white',
        marginHorizontal: '3%',
        borderRadius: 5,
        borderBottomWidth: 1,
        fontSize: 15,
        marginTop: '5%'
    },

    text: {
        fontSize: 18,
        marginTop: '5%',
        textAlign: 'left',
        marginHorizontal: '5%'
    },

    container: {
        display: 'flex',
        flexDirection: 'row',
    },

    leftcontainer: {
        display: 'flex',
        backgroundColor: '#EFEFEF',
        height: 600,
        width: '48%',
        marginLeft: '1.5%',
        borderColor: '#EFEFEF',
        borderRadius: 10,
        borderWidth: 1,
    },

    rightcontainer: {
        display: 'flex',
        backgroundColor: '#EFEFEF',
        borderColor: '#EFEFEF',
        borderRadius: 10,
        borderWidth: 1,
        height: 600,
        width: '48%',
        marginLeft: '1%',
    },

    scrollView: {
        backgroundColor: '#EFEFEF',
        height: 485,
        width: '96%',
        marginHorizontal: '2%',
        marginTop: '5%',
        borderWidth: 1,
        borderColor: '#EFEFEF',
        borderRadius: 5,
    },

    image: {
        flex: 1,
        justifyContent: "center",
    },

    title: {
        width: 380,
        fontFamily: 'Arial',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 35,
        color: '#000000',
        textAlign: 'left',
        marginHorizontal: '5%',
        marginTop:'12%',
        marginBottom:'5%'
    },

    buttonStyle: {
        backgroundColor: '#D3DE32',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000000',
        shadowColor: 'black',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 15,
        shadowOffset: { width: 56, height: 13 },
        shadowRadius: 5,
        shadowOffset: { width: 0.1, height: 0.1 },
    },

    titleStyle: {
        fontSize: 18,
        color: 'black'
    },

    containerStyle: {
        marginHorizontal: '2.5%',
        width: '95%',
        marginVertical: '5%'
    },

});