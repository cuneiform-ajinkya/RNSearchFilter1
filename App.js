import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";

import filter from "lodash.filter";

const API_ENDPOINT = "https://randomuser.me/api/?results=30";
export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetchData(API_ENDPOINT);
  }, []);

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      setData(json.results);

      console.log(json.results);
      setFullData(json.results);

      setIsLoading(false);
    } catch (error) {
      setError(error);
      console.log(error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const filteredData = filter(fullData, (user) => {
      return contains(user, formattedQuery);
    });
    setData(filteredData);
  };

  const contains = ({ name, email }, query) => {
    const { first, last } = name;

    return (
      first.includes(query) || last.includes(query) || email.includes(query)
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color="purple" />
      </View>
    );
  }

  // if (setError) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <Text>Error is fetching data ... Please check your internet</Text>
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 20, marginVertical: 10 }}>
      <TextInput
        placeholder="Search"
        autoCorrect={false}
        autoCapitalize="none"
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderColor: "black",
          borderWidth: 1,
          borderRadius: 8,
        }}
        value={searchQuery}
        onChangeText={(query) => handleSearch(query)}
      ></TextInput>

      <FlatList
        data={data}
        keyExtractor={(item) => item.login.username}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            <Image
              source={{ uri: item.picture.thumbnail }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <View>
              <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: "600" }}>
                {item.name.first} {item.name.last}
              </Text>
              <Text style={{ fontSize: 14, marginLeft: 10, color: "grey" }}>
                {item.email}
              </Text>
            </View>
          </View>
        )}
      ></FlatList>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
