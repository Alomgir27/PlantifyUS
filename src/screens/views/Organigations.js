import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import * as ICONS from "@expo/vector-icons";
import { COLORS } from "../../constants";
import { API_URL } from "../../constants";
import { db, auth } from "../../firebase";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Card } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { set } from "react-native-reanimated";
import { setOrganigations } from "../../modules/data/actions";

const Organigations = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const Organigations = useSelector((state) => state?.data?.Organigations);

    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    const fetchData = () => {
        axios
            .get(`${API_URL}/organigations`)
            .then((res) => {
                dispatch(setOrganigations(res.data));
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        fetchData();
    }
    , [isFocused]);

    const renderList = (item) => {
        return (
            <Card
                style={styles.mycard}
                onPress={() => navigation.navigate("Organigation", { item })}
            >
                <View style={styles.cardView}>
                    <Image
                        style={{ width: 60, height: 60, borderRadius: 30 }}
                        source={{ uri: item.picture }}
                    />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.text}>{item.title}</Text>
                        <Text style={styles.text}>{item.body}</Text>
                    </View>
                </View>
            </Card>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={Organigations}
                renderItem={({ item }) => {
                    return renderList(item);
                }
                }
                keyExtractor={(item) => item._id}
                onRefresh={() => fetchData()}
                refreshing={loading}
            />
            <Button
                title="Create Organigation"
                onPress={() => navigation.navigate("CreateOrganigation")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mycard: {
        margin: 5,
        padding: 5,
    },
    cardView: {
        flexDirection: "row",
        padding: 6,
    },
    text: {
        fontSize: 18,
    },
});

export default Organigations;
