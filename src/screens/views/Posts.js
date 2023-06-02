import React, { useState, useEffect} from "react";
import { View, Text, StyleSheet, Image, FlatList, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import { Card, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../constants";
import { API_URL } from "../../constants";
import axios from "axios";



const Posts = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const { posts } = useSelector((state) => state.posts);
    const { user } = useSelector((state) => state.auth);
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const [expanded, setExpanded] = useState(true);

    const handlePress = () => setExpanded(!expanded);

    const fetchData = () => {
        axios
            .get(`${API_URL}/posts`)
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        fetchData();
    }
    , []);

    const renderList = (item) => {
        return (
            <Card
                style={styles.mycard}
                onPress={() => navigation.navigate("Post", { item })}
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
                data={data}
                renderItem={({ item }) => {
                    return renderList(item);
                }
                }
                keyExtractor={(item) => `${item._id}`}
                onRefresh={() => fetchData()}
                refreshing={loading}
            />
            <FAB
                onPress={() => navigation.navigate("CreatePost")}
                style={styles.fab}
                small={false}
                icon="plus"
                theme={{ colors: { accent: COLORS.primary } }}
            />
        </View>
    );
};

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
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default Posts;
