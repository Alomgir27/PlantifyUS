import React, {useEffect, useState} from 'react';
// import {useNavigation} from '@react-navigation/core';

import {IArticleOptions} from '../constants/types';
import {useData, useTheme, useTranslation} from '../hooks/';
import {Block, Button, Image, Product, Text} from '../components/';

const Rental = () => {
  const {article} = useData();
  const {t} = useTranslation();
  // const navigation = useNavigation();
  const {gradients, sizes} = useTheme();
  const [optionId, setOptionId] = useState<IArticleOptions['id']>(0);

  // init with optionId = 0
  useEffect(() => {
    setOptionId(article?.options?.[0]?.id);
  }, [article]);

  const CARD_WIDTH = sizes.width - sizes.s;
  const hasSmallScreen = sizes.width < 414; // iPhone 11
  const SNAP_OFFSET = CARD_WIDTH - (hasSmallScreen ? 28 : 19) + sizes.s;

  return (
    <Block
      scroll
      nestedScrollEnabled
      paddingVertical={sizes.padding}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: sizes.padding * 1.5}}>
      {/* carousel items */}
      <Block
        scroll
        horizontal
        pagingEnabled
        decelerationRate="fast"
        snapToAlignment="center"
        scrollEventThrottle={16}
        snapToInterval={SNAP_OFFSET}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onScroll={({nativeEvent}) => {
          const optionIndex = Math.round(
            Number(nativeEvent?.contentOffset?.x) / sizes.width,
          );
          const option = article?.options?.find(
            (_, index) => index === optionIndex,
          );
          setOptionId(option?.id);
        }}>
        {article?.options?.map((option, index) => {
          return (
            <Block
              width={CARD_WIDTH - sizes.sm}
              marginLeft={index === 0 ? sizes.sm : 0}
              key={`article-${article?.id}-option-${option?.id}`}>
              <Image
                shadow
                height={261}
                width={CARD_WIDTH - sizes.md}
                source={{uri: option?.image}}
              />
              <Block marginTop={sizes.sm} paddingHorizontal={sizes.s}>
                <Block row flex={0} marginBottom={sizes.s}>
                  <Text p transform="capitalize">
                    {option?.type}
                    {' • '}
                    {t('common.guests', {count: option?.guests})}
                    {' • '}
                    {option?.sleeping?.total} {option?.sleeping?.type}
                  </Text>
                </Block>
                <Text h4 marginBottom={sizes.s}>
                  {option?.title}
                </Text>
                <Text p lineHeight={26}>
                  {option?.description}
                </Text>
              </Block>
            </Block>
          );
        })}
      </Block>
      {/* rentals recomendations */}
      <Block paddingHorizontal={sizes.sm} marginTop={sizes.sm}>
        <Button
          gradient={gradients.primary}
          onPress={() => navigation.navigate('Booking', {optionId: optionId})}>
          <Text white bold transform="uppercase">
            {t('rentals.availability')}
          </Text>
        </Button>
        <Block>
          <Text h5 marginTop={sizes.m} semibold paddingHorizontal={sizes.s}>
            {t('rentals.interested')}:
          </Text>
          {/* interested offers */}
          <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
            {article?.offers?.map((offer) => (
              <Product
                {...offer}
                key={`offer-${offer?.id}`}
                linkLabel={t('rentals.viewoffer')}
              />
            ))}
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Rental;
