import React, {useCallback, useEffect, useState} from 'react';
import dayjs from 'dayjs';
import {Calendar as RNCalendar, LocaleConfig} from 'react-native-calendars';

import {useTheme, useTranslation} from '../hooks/';
import {ICalendar} from '../constants/types';

const Calendar = ({onClose, ...props}: ICalendar) => {
  const {colors, fonts} = useTheme();
  const {t, locale} = useTranslation();
  const [dates, setDates] = useState(props.dates || {});
  const [calendar, setCalendar] = useState({start: 0, end: 0});

  // handle marked dates
  const handleDates = useCallback(
    (calendar) => {
      // generate dates based on calendar start & end dates
      const datesRange = dayjs(calendar?.end).diff(
        dayjs(calendar?.start),
        'days',
      );

      const markedDates = Array.from({length: datesRange}, (_, i) => {
        // add 1 day to start date
        const date = dayjs(calendar.start)
          .add(i + 1, 'day')
          .format('YYYY-MM-DD');

        return {
          [date]: {
            startingDay: false,
            endingDay: i + 1 === datesRange,
            color: String(colors.primary),
          },
        };
      }).reduce((list, entry) => ({...list, ...entry}), {
        [dayjs(calendar?.start).format('YYYY-MM-DD')]: {
          startingDay: true,
          color: String(colors.primary),
        },
      });

      setDates(markedDates);
    },
    [colors.primary, setDates],
  );

  // handleCalendar
  const handleCalendar = useCallback(
    (value) => {
      // check if start date does not exist
      // set start=date
      if (calendar.start === 0) {
        calendar.start = value.timestamp;
      } else if (calendar.start && calendar.end) {
        calendar.start = value.timestamp;
        calendar.end = 0;
      } else {
        calendar.end = value.timestamp;
      }

      // update calendar
      setCalendar(calendar);

      // generate marked dates
      handleDates(calendar);

      // hide modal / reset modal state
      if (calendar.start && calendar.end) {
        onClose?.(calendar);
      }
    },
    [calendar, handleDates, setCalendar, onClose],
  );

  // init handle dates on calendar change
  useEffect(() => {
    handleDates(props?.calendar);
  }, [handleDates, props.calendar]);

  // change calendar locale based on app localization language
  LocaleConfig.locales.en = LocaleConfig.locales[''];
  LocaleConfig.locales.fr = {
    today: t('dates.today'),
    dayNames: t('dates.dayNames') as unknown as string[],
    dayNamesShort: t('dates.dayNamesShort') as unknown as string[],
    monthNames: t('dates.monthNames') as unknown as string[],
    monthNamesShort: t('dates.monthNamesShort') as unknown as string[],
  };
  LocaleConfig.defaultLocale = locale;

  return (
    <RNCalendar
      key={locale}
      firstDay={1}
      markingType="period"
      markedDates={dates}
      current={dayjs().format('YYYY-MM-DD')}
      minDate={dayjs().format('YYYY-MM-DD')}
      onDayPress={(day) => handleCalendar(day)}
      theme={{
        backgroundColor: 'transparent',
        calendarBackground: 'transparent',
        textSectionTitleColor: String(colors.white),
        arrowColor: String(colors.white),
        monthTextColor: String(colors.white),
        dayTextColor: String(colors.white),
        todayTextColor: String(colors.white),
        textDisabledColor: String(colors.gray),
        selectedDayTextColor: String(colors.white),
        selectedDayBackgroundColor: String(colors.primary),
        textDayFontFamily: fonts.text,
        textMonthFontFamily: fonts.text,
        textDayHeaderFontFamily: fonts.text,
      }}
      {...props}
    />
  );
};

export default Calendar;
