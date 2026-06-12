import SwiftUI

struct GachaCard {
    let name: String
    let rarity: String
    let rate: Double
    let color: Color
}

struct GachaResult: Identifiable {
    let id = UUID()
    let card: GachaCard
}

private let gachaPool: [GachaCard] = [
    GachaCard(name: "小火龍", rarity: "SSR", rate: 0.03, color: .orange),
    GachaCard(name: "電氣鼠", rarity: "SR", rate: 0.12, color: .purple),
    GachaCard(name: "水精靈", rarity: "SR", rate: 0.12, color: .blue),
    GachaCard(name: "樹精", rarity: "R", rate: 0.23, color: .green),
    GachaCard(name: "小史萊姆", rarity: "R", rate: 0.25, color: .mint),
    GachaCard(name: "訓練木偶", rarity: "N", rate: 0.25, color: .gray)
]

private let drawCost = 100
private let rechargeAmount = 300
private let historyLimit = 20

private let rarityOrder = ["SSR", "SR", "R", "N"]

// 由卡池資料計算各稀有度的合計機率，避免顯示文字與實際卡池不同步
private let poolSummary: String = rarityOrder
    .map { rarity in
        let total = gachaPool
            .filter { $0.rarity == rarity }
            .reduce(0) { $0 + $1.rate }
        return "\(rarity) \(Int((total * 100).rounded()))%"
    }
    .joined(separator: " / ")

struct GachaView: View {
    @State private var coins = 1000
    @State private var currentResult: GachaResult?
    @State private var history: [GachaResult] = []

    private var canDraw: Bool {
        coins >= drawCost
    }

    private var stats: [String: Int] {
        history.reduce(into: [:]) { partialResult, item in
            partialResult[item.card.rarity, default: 0] += 1
        }
    }

    var body: some View {
        NavigationView {
            VStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 6) {
                    Text("✨ 抽卡遊戲雛形")
                        .font(.title2)
                        .fontWeight(.bold)
                    Text("金幣：\(coins)（單抽 \(drawCost)）")
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                VStack(alignment: .leading, spacing: 8) {
                    Text("目前活動卡池")
                        .font(.headline)
                    Text(poolSummary)
                        .font(.caption)
                        .foregroundColor(.secondary)

                    HStack {
                        Button(action: drawOne) {
                            Text(canDraw ? "單抽一次" : "金幣不足")
                                .frame(maxWidth: .infinity)
                        }
                        .buttonStyle(.borderedProminent)
                        .disabled(!canDraw)

                        Button(action: { coins += rechargeAmount }) {
                            Text("+\(rechargeAmount) 金幣")
                        }
                        .buttonStyle(.bordered)
                    }
                }
                .padding()
                .background(Color(.systemBackground))
                .cornerRadius(12)

                VStack(alignment: .leading, spacing: 4) {
                    Text("抽卡統計")
                        .font(.headline)
                    ForEach(rarityOrder, id: \.self) { rarity in
                        Text("\(rarity)：\(stats[rarity, default: 0])")
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                .background(Color(.systemBackground))
                .cornerRadius(12)

                if let currentResult {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("恭喜抽到！")
                            .font(.headline)
                        VStack(alignment: .leading) {
                            Text(currentResult.card.rarity)
                                .font(.title)
                                .fontWeight(.heavy)
                            Text(currentResult.card.name)
                                .font(.title3)
                                .fontWeight(.semibold)
                        }
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(currentResult.card.color)
                        .foregroundColor(.white)
                        .cornerRadius(12)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }

                List(history) { item in
                    HStack {
                        Text(item.card.rarity)
                            .fontWeight(.bold)
                            .foregroundColor(item.card.color)
                        Spacer()
                        Text(item.card.name)
                    }
                }
                .listStyle(.plain)
            }
            .padding()
            .background(Color(.secondarySystemBackground).ignoresSafeArea())
            .navigationTitle("Gacha")
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }

    private func drawOne() {
        guard canDraw else { return }
        let card = pickCard()
        let result = GachaResult(card: card)
        coins -= drawCost
        currentResult = result
        history.insert(result, at: 0)
        history = Array(history.prefix(historyLimit))
    }

    private func pickCard() -> GachaCard {
        let roll = Double.random(in: 0...1)
        var cumulative = 0.0

        for card in gachaPool {
            cumulative += card.rate
            if roll <= cumulative {
                return card
            }
        }

        return gachaPool.last ?? GachaCard(name: "訓練木偶", rarity: "N", rate: 1.0, color: .gray)
    }
}

struct GachaView_Previews: PreviewProvider {
    static var previews: some View {
        GachaView()
    }
}
