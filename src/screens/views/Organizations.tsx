import React, {useEffect, useState} from 'react';
import {useData, useTheme} from './../../hooks/';
import {IOrganization, ICategory} from './../../constants/types';
import {Block, Button, Text, OrganizationCard} from './../../components/';

import { View, StyleSheet, Image, FlatList} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";
import * as ICONS from "@expo/vector-icons";
import { COLORS } from "../../constants/index";
import { Button as Button2 } from 'react-native-elements';
import { API_URL } from "../../constants/index";
import axios from "axios";
import { Platform, ToastAndroid } from 'react-native';


const Organizations = ({ navigation}) => {
    const [articles, setArticles] = useState<IOrganization[]>([]);
    const {colors, gradients, sizes} = useTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [type, setType] = useState('all');
    const user  = useSelector(state => state.data.currentUser);
    const dispatch = useDispatch();
    const [data, setData] = useState<any>({
        all: [],
        my: [],
        pending: [],
        requested: []
    });

    const [mounted, setMounted] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

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
            name: 'My Requests',
            value: 'requested'
        },
        {
            name: 'Waiting for Approval',
            value: 'pending'
        },
    ];

   
    const getAll = async () => {
        setLoading(true);
        setError(null);
        console.log(data?.all?.map((item : IOrganization) => item?._id), 'ids');
        let ids = data?.all?.map((item : IOrganization) => item?._id);
        await axios.post(`${API_URL}/organizations/getAll`, {
            ids: ids
        })
        .then((res) => {
            let temp = [...data?.all, ...res?.data?.organizations];
            //remove duplicates if _id is same on complexity of O(logn)
            let map = new Map();
            for (const item of temp) {
                if(!map.has(item._id)){
                    map.set(item._id, true);
                }
            }
            temp = [...map.keys()].map((item) => temp.find((t) => t._id === item));
            setData({
                ...data,
                all: temp
            })
            setLoading(false);
            // console.log(res);
        }) 
        .catch((err) => {
            setLoading(false);
            setError(err);
            console.log(err);
        })
    }

    const getMy = async () => {
        setLoading(true);
        setError(null);
        await axios.get(`${API_URL}/organizations/getMy/${user?._id}`)
        .then((res) => {
            let temp = [...data?.my, ...res?.data?.organizations];
            let map = new Map();
            for (const item of temp) {
                if(!map.has(item._id)){
                    map.set(item._id, true);
                }
            }
            temp = [...map.keys()].map((item) => temp.find((t) => t._id === item));
            setData({
                ...data,
                my: temp
            })
            setLoading(false);
            // console.log(res);
        }
        )
        .catch((err) => {
            setLoading(false);
            setError(err);
            console.log(err);
        }
        )
    }

    const getPending = async () => {
        setLoading(true);
        setError(null);
        let ids = data?.pending?.map((item : IOrganization) => item?._id);
        await axios.post(`${API_URL}/organizations/getPending`, {
            ids: ids
        })
        .then((res) => {
           let temp = [...data?.pending, ...res?.data?.organizations];
           let map = new Map();
            for (const item of temp) {
                if(!map.has(item._id)){
                    map.set(item._id, true);
                }
            }
            temp = [...map.keys()].map((item) => temp.find((t) => t._id === item));
            setData({
                ...data,
                pending: temp
            })
            setLoading(false);
            // console.log(res.data.organizations);
        }
        )
        .catch((err) => {
            setLoading(false);
            setError(err);
            console.log(err);
        }
        )
    }

    const getRequested = async () => {
        setLoading(true);
        setError(null);
        await axios.get(`${API_URL}/organizations/getRequested/${user?._id}`)
        .then((res) => {
            let temp = [...data?.requested, ...res?.data?.organizations];
            //remove duplicates objects if _id is same
            let map = new Map();
            for (const item of temp) {
                if(!map.has(item._id)){
                    map.set(item._id, true);
                }
            }
            temp = [...map.keys()].map((item) => temp.find((t) => t._id === item));
            setData({
                ...data,
                requested: temp
            })
            setLoading(false);
        }
        )
        .catch((err) => {
            setLoading(false);
            setError(err);
            console.log(err);
        }
        )
    }

    useEffect(() => {
        if(!mounted) {
            getAll();
            getMy();
            getPending();
            getRequested();
            setMounted(true);
        }
    }, [mounted])

    function fetchMore() {
        if(type === 'all') {
            getAll();
        }
        else if(type === 'my') {
            getMy();
        }
        else if(type === 'pending') {
            getPending();
        }
        else if(type === 'requested') {
            getRequested();
        }
    }


    function wait(timeout) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
            }
        );
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setData({
            all: [],
            my: [],
            pending: [],
            requested: []
        });
        setMounted(false);
        wait(2000).then(() => setRefreshing(false));
    }, []);



  

  useEffect(() => {
    let temp = type === 'all' ? data?.all : type === 'my' ? data?.my : type === 'pending' ? data?.pending : data?.requested;
    setArticles(temp);
    console.log(temp, 'to be set articles');
  }, [type, data])
  
  const onPress = async (type: String, _id: any) => {
    if(type === 'Join') {
        await axios.post(`${API_URL}/organizations/joinRequest`, {
            userId: user?._id,
            organizationId: _id
        })
        .then((res) => {
            const temp = {
                all: data?.all?.map((item : IOrganization) => item?._id === _id ? res?.data?.organization : item),
                my: data?.my?.map((item : IOrganization) => item?._id === _id ? res?.data?.organization : item),
                pending: data?.pending?.map((item : IOrganization) => item?._id === _id ? res?.data?.organization : item),
                requested: data?.requested?.map((item : IOrganization) => item?._id === _id ? res?.data?.organization : item)
            }
            setData(temp);
            if(Platform.OS === 'android'){
                ToastAndroid.showWithGravityAndOffset(
                    "Request sent successfully",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                    );
            }


        })
        .catch((err) => {
            console.log(err);
        })
   } else if(type === 'Approve') {
         await axios.post(`${API_URL}/organizations/approveRequest`, {
              userId: user?._id,
              organizationId: _id
         })
         .then((res) => {
              const temp = {
                all: data?.all?.map((item : IOrganization) => item?._id === user?._id ? res?.data?.organization : item),
                my: data?.my?.map((item : IOrganization) => item?._id === user?._id ? res?.data?.organization : item),
                pending: data?.pending?.map((item : IOrganization) => item?._id === user?._id ? res?.data?.organization : item),
                requested: data?.requested?.map((item : IOrganization) => item?._id === user?._id ? res?.data?.organization : item)
          }
          setData(temp);
          if(Platform.OS === 'android'){
                ToastAndroid.showWithGravityAndOffset(
                 "Request approved successfully",
                 ToastAndroid.LONG,
                 ToastAndroid.BOTTOM,
                 25,
                 50
                 );
          }
         })
         .catch((err) => {
              console.log(err);
         })
    }
}
  return (
    <Block>
        <View style={styles.header}>
            <ICONS.Ionicons name="ios-arrow-back" size={24} color={COLORS.primary} onPress={() => navigation.goBack()} />
            <Text style={{ fontSize: 15, color: COLORS.gray }}>Plant Trees, Save Earth 🌱</Text>
        </View>
        <View style={styles.header}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {options.map((option, index) => (
                    <Button
                        key={index}
                        onPress={() => setType(option.value)}
                        gradient={gradients?.[type === option.value ? 'primary' : 'light']}
                        style={{ borderRadius: 10, padding: 10, margin: 5 }}
                    >
                        <Text
                            bold={type === option.value}
                            white={type === option.value}
                            black={type !== option.value}
                            transform="capitalize">
                            {option.name}
                        </Text>
                    </Button>
                ))}
            </ScrollView>
        </View>

      <FlatList
        data={articles}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => `${item?._id}`}
        style={{paddingHorizontal: sizes.padding}}
        contentContainerStyle={{paddingBottom: sizes.l}}
        renderItem={({item}) => <OrganizationCard item={item} type={type} onPress={onPress} navigation={navigation} />}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </Block>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
});

export default Organizations;
