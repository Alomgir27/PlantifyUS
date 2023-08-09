import React, {useEffect, useState} from 'react';
import {useData, useTheme} from './../../hooks/';
import {IArticle, ICategory} from './../../constants/types';
import {Block, Button, Article, Text} from './../../components/';

import { View, StyleSheet, Image, FlatList} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";
import * as ICONS from "@expo/vector-icons";
import { COLORS } from "../../constants/index";
import { Button as Button2 } from 'react-native-elements';
import { API_URL } from "../../constants/index";
import axios from "axios";


const Organizations = ({ navigation }) => {
    const data = useData();
    const [selected, setSelected] = useState<ICategory>();
    const [articles, setArticles] = useState<IArticle[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const {colors, gradients, sizes} = useTheme();
    const organizations = useSelector(state => state?.data?.organizations);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [type, setType] = useState('all');

    const user = useSelector(state => state.data.currentUser);
    const dispatch = useDispatch();

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

  // init articles
  useEffect(() => {
    setArticles(data?.articles);
    setCategories(data?.categories);
    setSelected(data?.categories[0]);
  }, [data.articles, data.categories]);

  // update articles on category change
  useEffect(() => {
    const category = data?.categories?.find(
      (category) => category?.id === selected?.id,
    );

    const newArticles = data?.articles?.filter(
      (article) => article?.category?.id === category?.id,
    );

    setArticles(newArticles);
  }, [data, selected, setArticles]);

  return (
    <Block>
        <View style={styles.header}>
            <ICONS.Ionicons name="ios-arrow-back" size={24} color={COLORS.black} onPress={() => navigation.goBack()} />
            <Text style={{ fontSize: 15, color: COLORS.gray }}>Plant Trees, Save Earth 🌱</Text>
        </View>
        <View style={styles.header}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {options.map((option, index) => (
                    <Button2
                        key={index}
                        title={option.name}
                        onPress={() => setType(option.value)}
                        buttonStyle={{ backgroundColor: type === option.value ? COLORS.primary : COLORS.gray, borderRadius: 10, padding: 10, margin: 5 }}
                        titleStyle={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}
                    />
                ))}
            </ScrollView>
        </View>
      {/* categories list */}
      <Block color={colors.card} row flex={0} paddingVertical={sizes.padding}>
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
      </Block>

      <FlatList
        data={articles}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => `${item?.id}`}
        style={{paddingHorizontal: sizes.padding}}
        contentContainerStyle={{paddingBottom: sizes.l}}
        renderItem={({item}) => <Article {...item} />}
      />
    </Block>
  );
};

export default Organizations;








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
