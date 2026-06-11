type DiagramBlockProps = {
  id: string;
};

const diagramTitles: Record<string, string> = {
  "pa-basic-flow": "PAの基本構造",
  "basic-signal-chain": "基本の信号経路",
  "multi-output-routing": "複数出力の考え方",
  "inverse-square-law": "距離と音量の目安",
  "mic-polar-patterns": "マイク指向性の違い",
  "mixer-channel-strip": "ミキサー1chの流れ",
  "aux-routing-map": "MAINとAUXの送り先",
  "feedback-loop": "ハウリングのループ",
  "amp-power-calculation": "必要音量を考える要素",
  "cable-types": "ケーブル種類の整理",
  "rehearsal-flow": "サウンドチェックの順番",
  "live-operation-screen": "本番中に見るポイント",
  "troubleshooting-flow": "音が出ない時の切り分け",
  "outdoor-distance-loss": "屋外の音量差",
  "interpretation-routing": "通訳・録音・別室送り",
  "dante-basic": "Danteの基本構成"
};

const flowDiagrams: Record<string, string[]> = {
  "pa-basic-flow": ["入力\nマイク / PC", "調整\nミキサー", "出力\nアンプ / スピーカー"],
  "basic-signal-chain": ["マイク", "ミキサー", "アンプ", "スピーカー"],
  "mixer-channel-strip": ["入力端子", "ゲイン", "EQ", "AUX", "フェーダー", "MAIN"],
  "rehearsal-flow": ["電源確認", "スピーカー確認", "マイク確認", "PC音源", "録音", "別室 / 通訳", "本番状態"],
  "troubleshooting-flow": ["入力", "メーター", "ミュート", "送り先", "スピーカー / アンプ"],
  "dante-basic": ["Dante対応ミキサー", "スイッチングハブ", "Dante I/O / 録音PC / 別室"]
};

const routingDiagrams: Record<string, { source: string; targets: string[]; note?: string }> = {
  "multi-output-routing": {
    source: "ミキサー",
    targets: ["メインスピーカー", "録音PC", "通訳機", "通訳室モニター", "控室・別室"]
  },
  "aux-routing-map": {
    source: "ミキサー",
    targets: ["MAIN L/R: 講堂メイン", "AUX1: 録音PC", "AUX2: 通訳機", "AUX3: 通訳室", "AUX4: 控室"]
  },
  "interpretation-routing": {
    source: "ミキサー",
    targets: ["MAIN: 会場", "AUX1: 録音PC", "AUX2: 通訳機", "AUX3: 通訳室", "AUX4: 控室"],
    note: "通訳者音声が通訳者ヘッドホンへ戻らないように注意"
  }
};

export function DiagramBlock({ id }: DiagramBlockProps) {
  const title = diagramTitles[id] ?? id;

  return (
    <figure className="diagram-card">
      <figcaption>{title}</figcaption>
      {renderDiagram(id)}
    </figure>
  );
}

function renderDiagram(id: string) {
  if (flowDiagrams[id]) {
    return <FlowDiagram steps={flowDiagrams[id]} isFeedback={id === "feedback-loop"} />;
  }

  if (routingDiagrams[id]) {
    return <RoutingDiagram {...routingDiagrams[id]} />;
  }

  if (id === "inverse-square-law") {
    return (
      <div className="distance-diagram">
        {["1m: 100dB", "2m: 94dB", "4m: 88dB", "8m: 82dB", "16m: 76dB"].map((item) => (
          <span key={item}>{item}</span>
        ))}
        <p>自由音場では距離が2倍になると約6dB下がる目安です。</p>
      </div>
    );
  }

  if (id === "mic-polar-patterns") {
    return (
      <div className="polar-grid">
        {[
          ["無指向性", "全方向"],
          ["単一指向性", "前方中心"],
          ["スーパー\nカーディオイド", "前方が狭い"]
        ].map(([label, note], index) => (
          <div className={`polar-card polar-${index + 1}`} key={label}>
            <span>{label}</span>
            <small>{note}</small>
          </div>
        ))}
      </div>
    );
  }

  if (id === "feedback-loop") {
    return (
      <div className="feedback-diagram">
        <FlowDiagram steps={["マイク", "ミキサー", "アンプ", "スピーカー"]} />
        <p>スピーカー音をマイクが再び拾うと、音がループしてハウリングが起きます。</p>
      </div>
    );
  }

  if (id === "amp-power-calculation") {
    return <FormulaDiagram items={["目標SPL", "距離", "スピーカー感度", "ヘッドルーム"]} result="必要音量の余裕" />;
  }

  if (id === "cable-types") {
    return <ChipGrid items={["XLR", "フォン", "RCA", "スピコン", "LAN", "HDMI / SDI"]} />;
  }

  if (id === "live-operation-screen") {
    return <ChipGrid items={["ONにするマイク", "ミュートするマイク", "録音状態", "次のBGM", "残り時間"]} />;
  }

  if (id === "outdoor-distance-loss") {
    return (
      <div className="outdoor-diagram">
        <span>ステージ前方: 大きい</span>
        <span>客席後方: 小さい</span>
        <span>補助スピーカーで聞こえ方を補う</span>
      </div>
    );
  }

  return <p className="diagram-fallback">図解ID: {id}</p>;
}

function FlowDiagram({ steps, isFeedback = false }: { steps: string[]; isFeedback?: boolean }) {
  return (
    <div className={`flow-diagram ${isFeedback ? "has-loop" : ""}`}>
      {steps.map((step, index) => (
        <div className="flow-item" key={`${step}-${index}`}>
          <span>{step}</span>
          {index < steps.length - 1 ? <b aria-hidden="true">→</b> : null}
        </div>
      ))}
    </div>
  );
}

function RoutingDiagram({ source, targets, note }: { source: string; targets: string[]; note?: string }) {
  return (
    <div className="routing-diagram">
      <div className="routing-source">{source}</div>
      <ul>
        {targets.map((target) => (
          <li key={target}>{target}</li>
        ))}
      </ul>
      {note ? <p>{note}</p> : null}
    </div>
  );
}

function FormulaDiagram({ items, result }: { items: string[]; result: string }) {
  return (
    <div className="formula-diagram">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
      <strong>{result}</strong>
    </div>
  );
}

function ChipGrid({ items }: { items: string[] }) {
  return (
    <div className="chip-grid">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}
