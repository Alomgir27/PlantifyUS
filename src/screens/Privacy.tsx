import React from 'react';

import {Block, Text} from '../components/';
import {useTheme} from '../hooks/';

import * as ICONS from '@expo/vector-icons';

const Privacy = ({ navigation }) => {
  const {sizes, colors} = useTheme();

  return (
    <Block padding={sizes.padding} marginBottom={sizes.sm}>
      <Block
        card
        scroll
        paddingHorizontal={sizes.sm}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: sizes.padding}}>
          <Block row align="center" justify="space-between" marginBottom={sizes.m}>
           <ICONS.Ionicons name="ios-arrow-back" size={24} color={colors.primary} onPress={() => navigation.navigate('Settings')} />
            <Text>Plant Trees, Save Earth 🌱</Text>
         </Block>
        <Text p marginBottom={sizes.sm} semibold align="justify">
         "I'm not for impeachment. This is news. I'm going to give you some news right now because I haven't said this to any press person before. But since you asked, and I've been thinking about this: Impeachment is so divisive to the country that unless there's something so compelling and overwhelming and bipartisan, I don't think we should go down that path, because it divides the country. And he's just not worth it."
         Our mission is to make the world a better place by planting trees.
        </Text>
        <Text p marginBottom={sizes.sm} align="justify">
          "You know, it's not about that. It's about what we can do for the people to lower health-care costs, bigger paychecks, cleaner government. It's about cleaner government. And by the way, our bill, H.R. 1, For the People Act, is very important to us. It's about reducing the role of big, dark special-interest money in politics, it's about empowering small donors, it's about ending voter suppression, it's about making redistricting fair. It's really a source of joy to me that the public is so embracing of it. We're very proud of it. And it's one of the reasons we won the election, because people saw the contrast between the two parties on that subject alone."
        </Text>
        <Text p marginBottom={sizes.sm} align="justify">
          "So, Our mission is to make the world a better place by planting trees. We're not going to be able to do that if we're going to be spending time on things that aren't going to happen in the Senate."

        </Text>
        <Text p marginBottom={sizes.sm} align="justify">
          "What's are mission? Our mission is to make the world a better place by planting trees. We're not going to be able to do that if we're going to be spending time on things that aren't going to happen in the Senate."
        </Text>
      </Block>
    </Block>
  );
};

export default Privacy;
