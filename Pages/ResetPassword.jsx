import { View, Text, ImageBackground, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Button, Icon, Header } from 'react-native-elements';
import React, { useState } from 'react';
import Overlay from 'react-native-modal-overlay';

export default function ResetPassword(props) {

    const [email, setEmail] = useState("");
    const [mailInput, setMailInput] = useState({ color: '#a9a9a9', text: 'כתובת אימייל' });
    const [emailInputFocus, setEmailInputFocus] = useState(false);

    //Overlay Sucsess
    const [visibleS, setVisibleS] = useState(false);
    const toggleOverlayS = () => {
        setVisibleS(!visibleS);
    };

    //Overlay
    const [visible, setVisible] = useState(false);
    const toggleOverlay = () => {
        setVisible(!visible);
    };

    //DATA - url
    const apiPOST = "https://proj.ruppin.ac.il//igroup83/test2/tar6/api/Patient/";
    const apiPUT = "https://proj.ruppin.ac.il//igroup83/test2/tar6/api/Patient?email=";

    const reset = () => {

        //check empty fields
        if (!email.trim()) { //Check for the Email TextInput
            let newobj = { color: 'red', text: 'נראה שלא הזנת כתובת אימייל' };
            setMailInput(newobj)
            return;
        }

        //POST email to DB
        fetch(apiPOST + email + "/ans", {
            method: 'POST',
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
                    console.log('OK send email', result);

                    if (result.Message === "An error has occurred.") {
                        toggleOverlay();
                    } else {

                        //PUT new password to DB
                        fetch(apiPUT + email + "&password=" + result, {
                            method: 'PUT',
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
                                    console.log('PUT success');
                                    toggleOverlayS();
                                }, error => {
                                    console.log("err put=", error);
                                })
                    }

                }, error => {
                    console.log("err post=", error);
                })
    }

    const headerfunc = () => {
        props.navigation.goBack();
    }

    return (
        <View style={styles.topContainer}>

            <Header
                rightComponent={<View>
                    <TouchableOpacity style={{ marginTop: '10%', marginLeft: 5 }} onPress={headerfunc}>
                        <Icon name='arrow-back-ios' color='black' size={25} />
                    </TouchableOpacity>
                </View>}
                containerStyle={{
                    backgroundColor: 'white',
                    justifyContent: 'space-around',
                }}
            />

            <ImageBackground source={require('../images/background.png')} resizeMode='stretch' style={styles.image}>

                <Text style={styles.title}>שחזור סיסמא</Text>

                <View style={styles.inputSection}>
                    <Icon style={styles.icon} name="email" size={27} color="#000" />
                    <TextInput
                        style={[styles.inputEmail, { borderBottomColor: emailInputFocus ? '#fc7b03' : '#000' }]}
                        onChangeText={newText => setEmail(newText)}
                        placeholder={mailInput.text}
                        placeholderTextColor={mailInput.color}
                        textAlign='right'
                        onFocus={event => setEmailInputFocus(true)}
                        onBlur={event => setEmailInputFocus(false)}
                    />
                </View>

                <Button
                    title="שלח"
                    buttonStyle={styles.buttonStyle}
                    titleStyle={styles.titleStyle}
                    containerStyle={styles.containerStyle}
                    onPress={reset}
                />

                <Overlay visible={visibleS} onBackdropPress={toggleOverlayS}
                    containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center' }}
                    childrenWrapperStyle={{ backgroundColor: 'white', borderWidth: 1, borderColor: 'white', borderRadius: 15, alignItems: 'center', width: '80%' }}>
                    <Text style={styles.textSecondary}>
                        נשלח לכתובת האימייל שהוזנה קישור לאיפוס סיסמא
                    </Text>
                    <Button
                        title="אישור"
                        buttonStyle={{ backgroundColor: '#D3DE32' }}
                        titleStyle={{ color: 'black', marginHorizontal: 15, fontSize: 20 }}
                        onPress={() => { props.navigation.goBack() }}
                    />
                </Overlay>


                <Overlay visible={visible} onBackdropPress={toggleOverlay}
                    containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center' }}
                    childrenWrapperStyle={{ backgroundColor: 'white', borderWidth: 1, borderColor: 'white', borderRadius: 15, alignItems: 'center', width: '80%'  }}>
                    <Text style={styles.textSecondary}>
                        כתובת האימייל אינה קיימת במערכת
                    </Text>
                    <Button
                        title="אישור"
                        buttonStyle={{ backgroundColor: 'rgba(214, 61, 57, 1)' }}
                        titleStyle={{ color: 'white', marginHorizontal: 15, fontSize: 20 }}
                        onPress={toggleOverlay}
                    />
                </Overlay>

            </ImageBackground>

        </View>
    )
}

const styles = StyleSheet.create({

    textSecondary: {
        marginBottom: 10,
        marginTop: 10,
        textAlign: 'center',
        fontSize: 17,
    },

    title: {
        flex: 1,
        width: 380,
        left: 50,
        top: 320,
        fontFamily: 'Arial',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 35,
        color: '#000000',
        textAlign: 'left',
    },

    inputSection: {
        flexDirection: 'row',
        marginBottom:'5%',
    },

    icon: {
        marginLeft: 50,
        marginRight: 15,
        marginTop: 35
    },

    topContainer: {
        flex: 1,
    },

    image: {
        flex: 1,
        justifyContent: "center"
    },

    inputEmail: {
        flexDirection: "row",
        height: 50,
        marginVertical: 25,
        backgroundColor: 'white',
        width: '60%',
        borderBottomWidth: 1,
        fontSize: 15,
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
        marginHorizontal: '19%',
        marginBottom:'55%',
    },

});