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


const Organizations = ({ navigation}) => {
    // const data = useData();
    // const [selected, setSelected] = useState<ICategory>();
    const [articles, setArticles] = useState([]);
    // const [categories, setCategories] = useState<ICategory[]>([]);
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
            name: 'Requested',
            value: 'requested'
        }
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

    useEffect(() => {
        if(!mounted) {
            getAll();
            getMy();
            getPending();
            getRequested();
            setMounted(true);
        }
    }, [mounted])

    useEffect(() => {
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
    }, [type])


  

//   // init articles
  useEffect(() => {
    // setArticles(data?.articles);
    // setCategories(data?.categories);
    // setSelected(data?.categories[0]);
    let temp = type === 'all' ? data?.all : type === 'my' ? data?.my : type === 'pending' ? data?.pending : data?.requested;
    setArticles(temp);
  }, [type, data.all, data.my, data.pending, data.requested]);
  // [data.articles, data.categories]);

  // update articles on category change
  // useEffect(() => {
  //   const category = data?.categories?.find(
  //     (category) => category?.id === selected?.id,
  //   );

  //   const newArticles = data?.articles?.filter(
  //     (article) => article?.category?.id === category?.id,
  //   );

  //   setArticles(newArticles);
  // }, [data, selected, setArticles]);

  const navigate = (item: IOrganization) => {
    navigation.navigate('Organization', {item});
    };

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
      {/* categories list */}
      {/* <Block color={colors.card} row flex={0} paddingVertical={sizes.padding}>
        <Block
          scroll
          horizontal
          renderToHardwareTextureAndroid
          showsHorizontalScrollIndicator={false}
          contentOffset={{x: -sizes.padding, y: 0}}>
          {categories?.map((category) => {
            const isSelected = category?.id === selected?.id;
            return (
              <Button
                radius={sizes.m}
                marginHorizontal={sizes.s}
                key={`category-${category?.id}}`}
                onPress={() => setSelected(category)}
                gradient={gradients?.[isSelected ? 'primary' : 'light']}>
                <Text
                  p
                  bold={isSelected}
                  white={isSelected}
                  black={!isSelected}
                  transform="capitalize"
                  marginHorizontal={sizes.m}>
                  {category?.name}
                </Text>
              </Button>
            );
          })}
        </Block>
      </Block> */}

      <FlatList
        data={articles}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => `${item?._id}`}
        style={{paddingHorizontal: sizes.padding}}
        contentContainerStyle={{paddingBottom: sizes.l}}
        renderItem={({item}) => <OrganizationCard item={item} type={type} onPress={() => navigate(item)} />}
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
