import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const CARD_POOL = [
  { name: '小火龍', rarity: 'SSR', rate: 0.03, color: '#f59e0b' },
  { name: '電氣鼠', rarity: 'SR', rate: 0.12, color: '#a855f7' },
  { name: '水精靈', rarity: 'SR', rate: 0.12, color: '#6366f1' },
  { name: '樹精', rarity: 'R', rate: 0.23, color: '#22c55e' },
  { name: '小史萊姆', rarity: 'R', rate: 0.25, color: '#10b981' },
  { name: '訓練木偶', rarity: 'N', rate: 0.25, color: '#6b7280' },
];

const DRAW_COST = 100;
const RECHARGE_AMOUNT = 300;
const HISTORY_LIMIT = 20;

const RARITY_ORDER = ['SSR', 'SR', 'R', 'N'];

const rarityCountTemplate = Object.fromEntries(RARITY_ORDER.map((rarity) => [rarity, 0]));

// 由卡池資料計算各稀有度的合計機率，避免顯示文字與實際卡池不同步
const POOL_SUMMARY = RARITY_ORDER.map((rarity) => {
  const total = CARD_POOL.filter((card) => card.rarity === rarity).reduce(
    (sum, card) => sum + card.rate,
    0,
  );
  return `${rarity} ${Math.round(total * 100)}%`;
}).join(' / ');

let nextDrawId = 0;

const drawOneCard = () => {
  const roll = Math.random();
  let cumulative = 0;

  for (const card of CARD_POOL) {
    cumulative += card.rate;
    if (roll <= cumulative) {
      return card;
    }
  }

  return CARD_POOL[CARD_POOL.length - 1];
};

const App = () => {
  const [coins, setCoins] = useState(1000);
  const [currentCard, setCurrentCard] = useState(null);
  const [history, setHistory] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const canDraw = coins >= DRAW_COST;

  const rarityStats = useMemo(
    () =>
      history.reduce((acc, item) => {
        acc[item.rarity] += 1;
        return acc;
      }, { ...rarityCountTemplate }),
    [history],
  );

  const handleDraw = () => {
    if (!canDraw) {
      return;
    }

    const record = { ...drawOneCard(), id: nextDrawId++ };
    setCoins((prev) => prev - DRAW_COST);
    setCurrentCard(record);
    setHistory((prev) => [record, ...prev].slice(0, HISTORY_LIMIT));
    setIsPanelOpen(true);
  };

  const handleRecharge = () => {
    setCoins((prev) => prev + RECHARGE_AMOUNT);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✨ 抽卡遊戲雛形</Text>
        <Text style={styles.subtitle}>金幣：{coins}（單抽 {DRAW_COST}）</Text>
      </View>

      <View style={styles.mainCard}>
        <Text style={styles.mainText}>目前活動卡池</Text>
        <Text style={styles.mainSubText}>{POOL_SUMMARY}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, !canDraw && styles.actionButtonDisabled]}
            onPress={handleDraw}
            disabled={!canDraw}
          >
            <Text style={styles.actionButtonText}>{canDraw ? '單抽一次' : '金幣不足'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ghostButton} onPress={handleRecharge}>
            <Text style={styles.ghostButtonText}>+300 金幣</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>抽卡統計</Text>
        {RARITY_ORDER.map((rarity) => (
          <Text key={rarity} style={styles.statsText}>
            {rarity}：{rarityStats[rarity]} 張
          </Text>
        ))}
      </View>

      {isPanelOpen && currentCard && (
        <View style={styles.panel}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsPanelOpen(false)}>
            <Text style={styles.closeButtonText}>關閉</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>恭喜抽到！</Text>
          <View style={[styles.resultBadge, { backgroundColor: currentCard.color }]}>
            <Text style={styles.resultRarity}>{currentCard.rarity}</Text>
            <Text style={styles.resultName}>{currentCard.name}</Text>
          </View>

          <Text style={styles.sectionTitle}>最近紀錄（最多 {HISTORY_LIMIT} 筆）</Text>
          <ScrollView style={styles.historyList}>
            {history.map((item) => (
              <View key={item.id} style={styles.historyRow}>
                <Text style={[styles.historyRarity, { color: item.color }]}>{item.rarity}</Text>
                <Text style={styles.historyName}>{item.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: '#4b5563',
  },
  mainCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  mainText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  mainSubText: {
    marginTop: 6,
    color: '#6b7280',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  actionButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  ghostButton: {
    borderColor: '#2563eb',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  ghostButtonText: {
    color: '#2563eb',
    fontWeight: '700',
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 3,
  },
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '72%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
  },
  closeButtonText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  resultBadge: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  resultRarity: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 22,
  },
  resultName: {
    color: '#fff',
    marginTop: 4,
    fontSize: 18,
    fontWeight: '700',
  },
  historyList: {
    marginTop: 4,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 8,
  },
  historyRarity: {
    fontWeight: '800',
  },
  historyName: {
    color: '#374151',
  },
});

export default App;
