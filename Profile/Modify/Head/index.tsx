import { View, Text, TextInput, Button, Pressable, StyleSheet, Image } from 'react-native';
import React, { useState, useEffect, useCallback } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
const showToast = (text1: string, text2: string, type = 'success') => {
    Toast.show({
        type: type,
        text1: text1,
        text2: text2,
        topOffset: 65
    });
}
const ShowImageLibrary = async (success = (img: any) => { }, fail = () => { }) => {
    await launchImageLibrary({ mediaType: 'photo' }, (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');

        } else if (response.errorMessage) {
            console.log('Image picker error: ', response.errorMessage);

        } else {
            let img = response.assets?.[0];
            if (img?.uri == undefined) {
                fail();

            }
            else {
                success(img);

            }
        }
    });
}


export default function (props: any) {
    const { From, Email, Username, HeadImg } = props.route.params;
    const image =
        HeadImg == "" ? require("../../../asset/rain.png") : { uri: HeadImg }
    // 等決定預設頭項後，把該圖放入asset中，並把rain 改掉. require 可以接這裡面的，uri則是可以接網址，地址

    const [photo, setPhoto] = useState(image);
    const [error, setError] = useState(false);
    const successSelected = (img: any) => {
        setPhoto({ uri: img?.uri });
    }
    const failSelected = () => {
        console.log('Fail select photo')
    }
    const gallery = () => {
        ShowImageLibrary(successSelected, failSelected);
    }

    const cancel = () => {
        props.navigation.goBack()
    }

    const confirm = async () => {
        if (photo === image) {
            props.navigation.goBack()
        }
        else {
            const formData = new FormData();
            formData.append('image', {
                uri: photo,
                type: 'image/jpeg',
                name: Username + '.jpg',
            });

            try {

                //需要回傳 新headImg位置
                const value = JSON.stringify({ email: Email, username: Username, headImg: "" });
                AsyncStorage.setItem('UserData', value);
                showToast('頭像修改成功', '');
                props.navigation.goBack();
                props.navigation.goBack();//for reset the parameters

                //     const response = await fetch('http://172.20.10.2:4000/ModifyHeadImg', {
                //         method: 'POST',
                //         body: formData,
                //         headers: {
                //             'Content-Type': 'multipart/form-data',
                //         },
                //     }).then(response => response.json());
                //     if (response.success == 1) {
                //         //需要回傳 新headImg位置
                //         const value = JSON.stringify({ email: Email, username: Username, headImg: response.headImg });
                //         AsyncStorage.setItem('UserData', value);
                //         showToast('頭像修改成功', '');
                //         props.navigation.goBack();
                //         props.navigation.goBack();
                //     }
                //     else {
                //         setError(true);
                //     }

            } catch (error) {
                console.error('Upload error:', error);
            }
        }
    }

    return (

        <View style={styles.container}>
            <View style={styles.UserInfo}>
                <Image
                    style={styles.headImg}
                    source={photo}
                />
            </View>
            <Pressable onPress={gallery} style={({ pressed }) => [
                styles.pressable2,
                {
                    backgroundColor: pressed ? '#FFAF60' : 'orange',
                    borderColor: pressed ? 'orange' : '#FFAF60',
                }
            ]}><Text style={styles.pressableText2}>選擇圖片</Text>
            </Pressable>
            <View style={styles.buttonrow}>
                <Pressable onPress={cancel} style={({ pressed }) => [
                    styles.pressable,
                    {
                        backgroundColor: pressed ? '#E0E0E0' : '#8E8E8E',
                        borderColor: pressed ? '#8E8E8E' : '#E0E0E0',
                    }
                ]}><Text style={styles.pressableText}>取消</Text>
                </Pressable>
                <Pressable onPress={confirm} style={({ pressed }) => [
                    styles.pressable,
                    {
                        backgroundColor: pressed ? '#FFAF60' : 'orange',
                        borderColor: pressed ? 'orange' : '#FFAF60',
                    }
                ]}><Text style={styles.pressableText}>確認</Text>
                </Pressable>
            </View>
            {error ? <Text style={styles.error}>名稱已被使用或格式錯誤</Text> : <></>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    UserInfo: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '4%',
        marginTop: '10%',
    },
    headImg: {
        width: 200,
        height: 200,
        borderRadius: 100,
        margin: '3%',
    },
    buttonrow: {
        flexDirection: 'row', // 水平排列
        justifyContent: 'space-around', // 按鈕之間均勻分布
        alignItems: 'center', // 垂直居中對齊
        marginVertical: 10,
    },
    pressable: {
        width: '35%',
        height: 45,
        borderRadius: 10,
        borderWidth: 1,
        marginTop: '7%',
        paddingTop: 3,
        marginVertical: 30,
        paddingVertical: 10,
        marginHorizontal: 18,
    },
    pressable2: {
        width: '80%',
        height: 45,
        borderRadius: 10,
        borderWidth: 1,
        marginTop: '7%',
        paddingTop: 3,
        marginStart: 30,
        paddingVertical: 10,
        marginHorizontal: 20,
    },
    pressableText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
    },
    pressableText2: {
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
    },
    error: {
        marginTop: 10,
        textAlign: 'center',
        color: 'red',
        fontSize: 20,
    }
})