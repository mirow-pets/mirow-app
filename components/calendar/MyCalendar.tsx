import React, { useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { Calendar } from "react-native-big-calendar";
import { FlatList, ScrollView } from "react-native-gesture-handler";

import { DropdownInput } from "@/components/form/DropdownInput";
import { ThemedText } from "@/components/themed-text";
import { monthOptions } from "@/constants/common";
import { greenColor, primaryColor, secondaryColor } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useThemeColor } from "@/hooks/use-theme-color";
import { addQueryParams, Get } from "@/services/http-service";
import { TCalendarEvent, TOption, UserRole } from "@/types";

const EventItem = ({ event }: { event: TCalendarEvent }) => {
  const { userRole } = useAuth();

  const colorMapper: Record<string, string> = {
    completed: greenColor,
    inprogress: secondaryColor,
    accepted: primaryColor,
  };

  const status = event.metadata?.status;

  const handleClick = () => {
    if (event?.metadata?.bookingId) {
      router.push(
        `/${userRole as UserRole}/bookings/${event.metadata.bookingId}`
      );
    }
    if (event?.metadata?.petId) {
      router.push(`/pet-owner/pets/${event.metadata.petId}`);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleClick}
      activeOpacity={0.7}
      style={{ padding: 12, borderBottomWidth: 1, borderColor: "#eee" }}
    >
      <ThemedText style={{ fontWeight: "bold", fontSize: 16 }}>
        {event.title}
      </ThemedText>
      <ThemedText style={{ fontSize: 14, color: "#333", marginTop: 2 }}>
        {event.description1}
      </ThemedText>
      {event.description2 && (
        <ThemedText style={{ fontSize: 13, color: "#666", marginTop: 2 }}>
          {event.description2}
        </ThemedText>
      )}
      <ThemedText style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
        {event.start instanceof Date
          ? event.start.toLocaleString()
          : new Date(event.start).toLocaleString()}
      </ThemedText>
      {status && (
        <View style={{ marginTop: 4, gap: 8, flexDirection: "row" }}>
          <ThemedText style={{ fontSize: 12 }}>Status:</ThemedText>
          <ThemedText
            style={{
              fontSize: 12,
              color: colorMapper[status?.toLowerCase()],
            }}
          >
            {status}
          </ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const MyCalendar = () => {
  const { currUser } = useAuth();
  const primaryColor = useThemeColor({}, "primary");
  const [activeDate, setActiveDate] = useState(new Date());

  const form = useForm({
    defaultValues: {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    },
  });

  const values = form.watch();

  const { data: events = [] } = useQuery<TCalendarEvent[]>({
    queryKey: [
      "calendar-events",
      currUser?.sessionId,
      values.month,
      values.year,
    ],
    queryFn: async () => {
      const result: TCalendarEvent[] = await Get(
        addQueryParams("/v2/calendars/events", {
          month: values.month,
          year: values.year,
        })
      );

      return result.map((item) => ({
        ...item,
        start: new Date(item.start),
        end: item.end && new Date(item.end),
      }));
    },
  });

  const yearOptions: TOption[] = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 1;
    const maxYear = currentYear + 5;
    return Array.from({ length: maxYear - minYear + 1 }, (_, i) => ({
      value: minYear + i,
      label: (minYear + i).toString(),
    }));
  }, []);

  const handleCellStyle = (d?: Date) => {
    if (!d) return styles.calendarCellStyle;
    const date = new Date(d);
    if (
      date.getDate() === new Date(activeDate).getDate() &&
      date.getMonth() === new Date(activeDate).getMonth()
    ) {
      return { ...styles.selectedCell, backgroundColor: `${primaryColor}22` };
    }
    return styles.calendarCellStyle;
  };

  const activeMonth = useMemo(
    () => monthOptions.find((m) => m.value === values.month),
    [values.month]
  );

  const date = useMemo(() => {
    const d = new Date();
    d.setMonth(values.month);
    d.setFullYear(values.year);
    return d;
  }, [values]);

  const uniqueEvents = useMemo(() => {
    const seenDates = new Set<number>();
    return events.filter((event) => {
      const date = new Date(event.start).getDate();
      if (seenDates.has(date)) return false;
      seenDates.add(date);
      return true;
    });
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === activeDate.getDate();
    });
  }, [events, activeDate]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <FormProvider {...form}>
        <View
          style={{
            padding: 8,
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: 180 }}>
            <DropdownInput name="month" options={monthOptions} />
          </View>
          <View style={{ width: 180 }}>
            <DropdownInput name="year" options={yearOptions} />
          </View>
        </View>
      </FormProvider>
      <Calendar
        mode="month"
        events={uniqueEvents.map((event) => ({ ...event, end: event.start }))}
        calendarCellStyle={(e) => handleCellStyle(e)}
        showAdjacentMonths={false}
        swipeEnabled={false}
        onPressCell={(e) => setActiveDate(new Date(e))}
        onPressEvent={(val) => setActiveDate(new Date(val.start))}
        activeDate={activeDate}
        date={date}
        height={350}
        renderEvent={(event) => (
          <View style={styles.alignItemsCenter}>
            {event.type === "booking" ? (
              <MaterialIcons name="pets" size={25} color={primaryColor} />
            ) : (
              <Fontisto
                name="injection-syringe"
                size={24}
                color={primaryColor}
              />
            )}
          </View>
        )}
        dayHeaderHighlightColor={primaryColor}
        eventCellTextColor={primaryColor}
        weekDayHeaderHighlightColor={primaryColor}
      />
      <ThemedText style={{ ...styles.activeEventMonth }}>
        {activeMonth?.label} {activeDate.getDate()}
      </ThemedText>
      {filteredEvents.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 40, marginBottom: 20 }}>
          <ThemedText style={{ color: "#aaa", fontSize: 16 }}>
            No events for this day.
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          scrollEnabled={false}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => <EventItem event={item} />}
        />
      )}
      <View style={{ height: 100 }}></View>
    </ScrollView>
  );
};

export default MyCalendar;

const styles = StyleSheet.create({
  calendarCellStyle: {
    borderColor: "#52525250",
    alignItems: "flex-start",
    margin: 1,
    borderWidth: 1,
  },
  activeEventMonth: {
    paddingVertical: 20,
    textAlign: "center",
    color: "#949494",
    fontSize: 16,
    textTransform: "capitalize",
  },
  alignItemsCenter: {
    alignItems: "center",
  },
  selectedCell: {
    borderColor: "#a7cbb9",
    alignItems: "flex-start",
    margin: 1,
    borderWidth: 1.5,
    backgroundColor: "#a7cbb966",
  },
});
