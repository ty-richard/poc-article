import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet, Platform } from 'react-native';
import WebView from 'react-native-webview';
import axios from 'axios';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState(null);

  useEffect(() => {
    console.log('selectedUrl updated:', selectedUrl);
  }, [selectedUrl]);

  const handleItemClick = (path) => {
    setSelectedUrl(`https://www.motortrend.com${path}`);
    console.log('selectedUrl', selectedUrl);
  };

  const closeWebView = () => {
    setSelectedUrl(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://mt-lite-api.vercel.app/api/articles');
        //test on localhost with cors-anywhere
        // const response = await axios.get('https://cors-anywhere.herokuapp.com/https://mt-lite-api.vercel.app/api/articles');
        const { data } = response.data;
        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (!Array.isArray(data)) {
    return <Text>Data is not an array.</Text>;
  }

  const Item = ({path, image, title}) => (
    <Pressable onPress={() => handleItemClick(path)}>
      <View style={styles.itemContainer}>
        <Image source={{ uri: image }} style={styles.thumbnail} />
        <Text style={styles.title}>{title}</Text>
      </View>
    </Pressable>
  );

  if (selectedUrl) {
    return (
      <View style={styles.webviewContainer}>
        <WebView
          style={styles.webview}
          source={{ uri: selectedUrl }}
          startInLoadingState={true}
          scalesPageToFit={Platform.OS === 'android' ? true : false}
        />
        <Pressable style={styles.closeButton} onPress={closeWebView}>
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={({item}) => <Item path={item.articlePath} image={item.articleFeaturedImage} title={item.articleTitle} />}
          keyExtractor={(index) => index.toString()}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
  }
});
