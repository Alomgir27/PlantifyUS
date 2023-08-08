import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Icon } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import * as ICONS from "@expo/vector-icons";
import { COLORS } from "../../constants/index";
import { API_URL } from "../../constants/index";
import axios from "axios";


const Organizations = ({ navigation }) => {
    const organizations = useSelector(state => state?.data?.organizations);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [type, setType] = useState('all');

    const user = useSelector(state => state.data.currentUser);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     axios.get(`${API_URL}/organizations`)
    //         .then(res => {
    //             setOrganizations(res.data.organizations);
    //             setLoading(false);
    //         })
    //         .catch(err => {
    //             setError(err);
    //             setLoading(false);
    //         });
    // }
    // , []);

    const renderOrganization = ({ item }) => {
        return (
            <View style={styles.organizationContainer}>
                <View style={styles.organizationInfo}>
                    <Image source={{ uri: item.images[0] }} style={styles.organizationImage} />
                    <View style={styles.organizationText}>
                        <Text style={styles.organizationName}>{item.name}</Text>
                        <Text style={styles.organizationBio}>{item.bio}</Text>
                    </View>
                </View>
                <View style={styles.organizationButtons}>
                    <Button
                        title="View"
                        onPress={() => navigation.navigate('Organization', { organization: item })}
                        buttonStyle={styles.organizationButton}
                        titleStyle={styles.organizationButtonText}
                    />
                    <Button
                        title="Join"
                        onPress={() => joinOrganization(item._id)}
                        buttonStyle={styles.organizationButton}
                        titleStyle={styles.organizationButtonText}
                    />
                </View>
            </View>
        );
    }

    const joinOrganization = (organizationId) => {
        axios.post(`${API_URL}/organizations/${organizationId}/join`, { userId: user._id })
            .then(res => {
                dispatch({ type: 'SET_CURRENT_USER', payload: res.data.user });
            })
            .catch(err => {
                console.log(err);
            });
    }

    const options = [
        {
            name: 'All',
            value: 'all'
        },
        {
            name: 'My Organizations',
            value: 'my'
        },
        {
            name: 'Pending',
            value: 'pending'
        },
        {
            name: 'Joined',
            value: 'joined'
        },
        {
            name: 'Requested',
            value: 'requested'
        },
        {
            name: 'Invited',
            value: 'invited'
        }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ICONS.Ionicons name="ios-arrow-back" size={24} color={COLORS.black} onPress={() => navigation.goBack()} />
                <Text style={{ fontSize: 15, color: COLORS.gray }}>Plant Trees, Save Earth 🌱</Text>
            </View>
            <View style={styles.header}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {options.map((option, index) => (
                        <Button
                            key={index}
                            title={option.name}
                            onPress={() => setType(option.value)}
                            buttonStyle={{ backgroundColor: type === option.value ? COLORS.primary : COLORS.gray, borderRadius: 10, padding: 10, margin: 5 }}
                            titleStyle={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}
                        />
                    ))}
                </ScrollView>
            </View>
            <View style={styles.organizationsContainer}>
                {loading ? (
                    <Text>Loading...</Text>
                ) : error ? (
                    <Text>{error}</Text>
                ) : (
                    <FlatList
                        data={organizations}
                        renderItem={renderOrganization}
                        keyExtractor={item => item._id}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    createButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        padding: 10
    },
    createButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white
    },
    organizationsContainer: {
        flex: 1,
        padding: 20
    },
    organizationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: COLORS.white,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: COLORS.black,
        shadowOffset: { 
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    organizationInfo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    organizationImage: {
        width: 100,
        height: 100,
        borderRadius: 10
    },
    organizationText: {
        marginLeft: 10
    },
    organizationName: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    organizationBio: {
        fontSize: 15
    },
    organizationButtons: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    organizationButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        padding: 10,
        marginLeft: 10
    },
    organizationButtonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.white
    }
});

export default Organizations;
