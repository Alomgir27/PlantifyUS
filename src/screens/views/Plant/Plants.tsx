import React, {useEffect, useLayoutEffect, useState} from 'react';
import {FlatList, TouchableOpacity, Alert} from 'react-native';

// import {useNavigation} from '@react-navigation/core';

import {useTheme} from '../../../hooks/';
import {Block, Button, Input, Image, Switch, Modal, Text} from '../../../components/';


import { API_URL } from '../../../constants';
import axios from 'axios';
import moment from 'moment';

// Photo gallery example
const PlantItem = ({item, index, navigation} : any) => {
  const {assets, sizes} = useTheme();




  return (
    <Block marginTop={sizes.m} paddingHorizontal={sizes.padding} >
      <Text p semibold marginBottom={sizes.s}>
        {item?.scientificName}
      </Text>
        <Block marginBottom={sizes.xxl}>
         <Button onPress={() => navigation.navigate('PlantDetail', {_id: item?._id})}>
            <Image
              resizeMode="cover"
              source={{uri: item?.images[0]}}
              style={{width: '100%'}}
              height={sizes.height / 3}
          />
        </Button>
        <Text p secondary marginTop={sizes.sm}>
          soli: {item?.requirements?.soil} • sun: {item?.requirements?.sun} • water: {item?.requirements?.water} • temperature: {item?.requirements?.temperature} • fertilizer: {item?.requirements?.fertilizer}
        </Text>
        <Text h4 marginVertical={sizes.s}>
          {item?.name}
        </Text>
        <Text p lineHeight={26}>
         {item?.description}
        </Text>
      </Block>
      <Text h5 semibold marginBottom={sizes.s}>
        uploaded by
      </Text>
      <Block row align="center" marginBottom={sizes.padding}>
        <Image
          source={{uri: item?.uploadBy?.image}}
          style={{width: 40, height: 40, borderRadius: 20}}
        />
        <Block marginLeft={sizes.s}>
          <Text p semibold primary>
            {item?.uploadBy?.name}
          </Text>
          <Text p secondary>
            {moment(item?.createdAt).fromNow()}
          </Text>
       </Block>
      </Block>

    </Block>
  );
};

const Plants = ({navigation, route}: any) => {

  const [trees, setTrees] = useState([]);
  const {assets, sizes} = useTheme();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(route.params?._id) {
      (async () => {
        await axios.get(`${API_URL}/plants/${route.params._id}`)
          .then(res => {
            setTrees([res?.data?.tree]);
          })
          .catch(err => console.log(err));
      }
      )();
    }
  }, [route.params?._id]);

  const handleFetch = async () => {
    await axios.post(`${API_URL}/plants`, {
      ids: trees.map(tree => tree._id)
    })
      .then(res => {
        //@ts-ignore
        setTrees((prevTrees) => [...prevTrees, ...res?.data?.trees]);
      }
      )
      .catch(err => console.log(err));
  }

  const fetchMore = async () => {
    setLoading(true);
    handleFetch();
    setLoading(false);
  }



  useEffect(() => {
    if(!route.params?._id) {
      handleFetch();
    }
  }, []);


  return (
    <Block safe contentContainerStyle={{paddingVertical: sizes.padding}}>
      <FlatList
        data={trees}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({item, index}) => (
          <PlantItem item={item} index={index} navigation={navigation} />
        )}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.5}
        refreshing={loading}
        onRefresh={() => {
          setTrees([]);
          handleFetch();
        }
        }
      />
    </Block>
  );
};

export default Plants;
