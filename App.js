import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const App = () => {
  const [isPageOpen, setIsPageOpen] = useState(false);

  const openPage = () => {
    setIsPageOpen(true);
  };

  const closePage = () => {
    setIsPageOpen(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>這是底下畫面</Text>
      </View>

      {isPageOpen && (
        <View style={styles.pageContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closePage}>
            <Text style={styles.closeButtonText}>關閉</Text>
          </TouchableOpacity>
          <Text style={styles.pageText}>123</Text>
        </View>
      )}

      <TouchableOpacity style={styles.openButton} onPress={openPage}>
        <Text style={styles.openButtonText}>打開分頁</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    flex: 1,
    backgroundColor: '#ddd', // 底層頁面灰色
    alignItems: 'center',
    justifyContent: 'center',
  },
  openButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  openButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  pageContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75%', // 新分頁打開到整個螢幕的四分之三位置
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    zIndex: 1, // 設定 zIndex 為 1，確保分頁浮在底層畫面上方
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    color: '#3498db',
    fontSize: 16,
  },
  pageText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default App;