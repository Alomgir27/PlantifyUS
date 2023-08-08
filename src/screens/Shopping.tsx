import React, {useCallback, useEffect, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';

import {useData, useTheme, useTranslation} from '../hooks/';
import {IBasketItem} from '../constants/types';
import {Block, Button, Image, Modal, Text} from '../components/';

interface IShoppingItemCTA extends IBasketItem {
  onQTY?: () => void;
  onSize?: () => void;
  onRemove?: () => void;
}

interface IModalParams {
  type?: 'qty' | 'size' | undefined;
  product?: IBasketItem;
}

const ShoppingItem = ({
  image,
  title,
  description,
  stock,
  price,
  qty,
  size,
  onQTY = () => {},
  onSize = () => {},
  onRemove = () => {},
}: IShoppingItemCTA) => {
  const {colors, assets, gradients, sizes} = useTheme();
  const {t} = useTranslation();

  return (
    <Block card padding={sizes.sm} paddingTop={sizes.m} marginBottom={sizes.sm}>
      <Button position="absolute" right={0} onPress={() => onRemove?.()}>
        <Image source={assets.close} color={colors.gray} />
      </Button>
      <Block row>
        <Image width={97} radius={sizes.s} source={{uri: image}} />
        <Block marginLeft={sizes.sm}>
          <Text p semibold>
            {title}
          </Text>
          <Text marginRight={sizes.sm}>{description}</Text>
          <Text
            size={12}
            semibold
            success={stock}
            danger={!stock}
            transform="uppercase">
            {t(`common.${stock ? 'inStock' : 'outStock'}`)}
          </Text>
        </Block>
      </Block>
      <Block row justify="space-between" marginTop={sizes.m}>
        <Block row flex={0.5}>
          <Button
            row
            flex={1}
            gradient={gradients.secondary}
            marginRight={sizes.s}
            onPress={() => onQTY?.()}>
            <Block
              row
              align="center"
              justify="space-between"
              paddingHorizontal={sizes.sm}>
              <Text bold white transform="uppercase" marginRight={sizes.sm}>
                {qty}
              </Text>
              <Image
                source={assets.arrow}
                color={colors.white}
                transform={[{rotate: '90deg'}]}
              />
            </Block>
          </Button>
          <Button
            row
            flex={1}
            gradient={gradients.secondary}
            onPress={() => onSize?.()}>
            <Block
              row
              align="center"
              justify="space-between"
              paddingHorizontal={sizes.sm}>
              <Text bold white transform="uppercase" marginRight={sizes.sm}>
                {size}
              </Text>
              <Image
                source={assets.arrow}
                color={colors.white}
                transform={[{rotate: '90deg'}]}
              />
            </Block>
          </Button>
        </Block>
        <Block flex={0.5} justify="center">
          <Text
            h4
            bold
            align="right"
            end={[1, 0]}
            start={[0.8, 0]}
            gradient={gradients.primary}>
            ${price}
          </Text>
        </Block>
      </Block>
    </Block>
  );
};

const Shopping = () => {
  const {t} = useTranslation();
  const {gradients, sizes} = useTheme();
  const {basket, handleBasket} = useData();
  const [modal, setModal] = useState<IModalParams['type']>();
  const [product, setProduct] = useState<IBasketItem>();
  const [products, setProducts] = useState<IBasketItem[]>();

  useEffect(() => {
    setProducts(basket?.items);
  }, [basket.items]);

  const handleQTY = useCallback(
    (qty?: IBasketItem['qty']) => {
      // update qty by product id
      const products = basket?.items?.map((item) =>
        item?.id === product?.id ? {...item, qty} : item,
      );

      // update basket products with newly qty
      handleBasket({items: products});

      // hide modal / reset modal state
      setModal(undefined);
    },
    [product, basket?.items, setModal, handleBasket],
  );

  const handleSize = useCallback(
    (size?: IBasketItem['size']) => {
      // update size by product id
      const products = basket?.items?.map((item) =>
        item?.id === product?.id ? {...item, size} : item,
      );

      // update basket products with newly size
      handleBasket({items: products});

      // hide modal / reset modal state
      setModal(undefined);
    },
    [product, basket?.items, setModal, handleBasket],
  );

  const handleRemove = useCallback(
    (id?: number) => {
      const products = basket?.items?.filter((item) => item?.id !== id);
      handleBasket({items: products});
    },
    [basket, handleBasket],
  );

  const handleModal = useCallback(
    ({type, product}: IModalParams) => {
      setProduct(product);
      setModal(type);
    },
    [setProduct],
  );

  return (
    <Block safe>
      <Block
        scroll
        paddingTop={sizes.md}
        paddingHorizontal={sizes.sm}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding * 2}}>
        {products?.map((item) => (
          <ShoppingItem
            {...item}
            key={`shopping-${item?.id}`}
            onQTY={() => handleModal({type: 'qty', product: item})}
            onSize={() => handleModal({type: 'size', product: item})}
            onRemove={() => handleRemove(item?.id)}
          />
        ))}
        <Block
          row
          align="center"
          justify="space-between"
          paddingHorizontal={sizes.sm}>
          <Text p semibold>
            {t('shop.subtotal', {count: products?.length || 0})}:
          </Text>
          <Block justify="center">
            <Text
              h4
              bold
              align="right"
              end={[1, 0]}
              start={[0.8, 0]}
              gradient={gradients.primary}>
              ${basket?.subtotal}
            </Text>
          </Block>
        </Block>
        <Text p semibold gray paddingHorizontal={sizes.sm} marginTop={sizes.sm}>
          {t('shop.alsoShopped')}:
        </Text>
        <Block row wrap="wrap" marginTop={sizes.sm} justify="space-between">
          {basket?.recommendations?.map((item) => (
            <Block
              flex={0}
              key={`recommendation-${item?.id}`}
              width={(sizes.width - sizes.m * 2) / 2}>
              <Block card radius={sizes.s}>
                <Image
                  height={110}
                  radius={sizes.s}
                  source={{uri: item?.image}}
                />
                <Text p center marginVertical={sizes.s}>
                  {item?.title}
                </Text>
                <Text
                  h4
                  bold
                  center
                  end={[1, 0]}
                  start={[0.25, 0]}
                  gradient={gradients.primary}>
                  ${item?.price}
                </Text>
              </Block>
              <Button gradient={gradients.secondary} marginTop={sizes.s}>
                <Text p white bold transform="uppercase">
                  {t('common.addToCart')}
                </Text>
              </Button>
            </Block>
          ))}
        </Block>
        <Button gradient={gradients.primary} marginTop={sizes.sm}>
          <Text p white bold transform="uppercase">
            {t('common.checkout')}
          </Text>
        </Button>
      </Block>
      <Modal
        visible={Boolean(modal)}
        onRequestClose={() => setModal(undefined)}>
        <FlatList
          keyExtractor={(index) => `${index}`}
          data={modal === 'qty' ? product?.qtys : product?.sizes}
          renderItem={({item}) => (
            <Button
              marginBottom={sizes.sm}
              onPress={() =>
                modal === 'qty' ? handleQTY(item) : handleSize(item)
              }>
              <Text p white semibold transform="uppercase">
                {item}
              </Text>
            </Button>
          )}
        />
      </Modal>
    </Block>
  );
};

export default Shopping;
