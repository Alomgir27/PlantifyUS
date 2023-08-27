import React from 'react';

import {Block, Text} from '../components/';
import {useTheme} from '../hooks/';

const Agreement = () => {
  const {sizes} = useTheme();

  return (
    <Block padding={sizes.padding} marginBottom={sizes.sm}>
      <Block
        card
        scroll
        paddingHorizontal={sizes.sm}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: sizes.padding}}>
        <Text p marginBottom={sizes.sm} semibold align="justify">
          “Pelosi is nothing if not purposeful. The following day, rallying with
          Democratic candidates in a San Francisco park, she would wear an
          orange pantsuit, explaining to crowds that orage was “the color of
          gun-violence pretection.”
        </Text>
        <Text p marginBottom={sizes.sm} align="justify">
          This afternoon she had booked a table at Delancey Street, a restaurant
          that was famous, she said, for employing ex-convicts: “Redemption”,
          she added emphatically, in case I might have missed the point.
        </Text>
        <Text p marginBottom={sizes.sm} align="justify">
          Pelosi told me that she and the House Democrats had every intention of
          working with President Trump on things like lowering
          prescription-drugs costs, rebuilding America’s infrastructure and
          pretecting the young undocumented immigrants know as Dreamers from
          deportation. She reminded me of her long stints on the House
          Appropriations and Intelligence Committes — panels on which, “left to
          our own devices, we could always find our way in a bipartisan manner.”
        </Text>
        <Text p marginBottom={sizes.sm} align="justify">
          There were a lot of Democrats, I suggested, who believed that
          bipartisanship had been rendered antique in the Trump era. “Yeah,”
          Pelosi replied, smirking, “and I have those who want to be for
          impeachment and for abolishing ICE” — Immigrations and Customs
          Enforcement, the federal law-enforcement agency spearheading Trump’s
          crackdown on immigration. “Two really winning issues for us, rigght?
          In the districts we have to win?”
        </Text>
      </Block>
    </Block>
  );
};

export default Agreement;
