# Instant-Fill

## Instant Fill Ver 3.0

チャットやアイテムを用いてfillを簡単に行います。

## Usage

### 1.適当なアイテムを手に持った上でチャットに以下を送信します。

```
@ins subscribe
```
アイテムの説明文に「@Instant-Fill」という表記が追加されていれば成功です。

### 2.ブロックを左クリックで位置を設定できます。

2箇所を左クリックしてください。
beforeEventのためNBTが失われる危険性はありません。

### 3.ブロックを右クリックでブロックをスポイトできます。

スポイトを使わずとも、空中への右クリックで表示されるフォームからブロックidを直接入力することも出来ます。
しかし、スポイトを使用するとブロックステートまで保存できます。

### 4.空中への右クリックでフォームを開けます。

1番上の項目は、スポイトをしている場合は変更する必要はありません。
2番目の項目は、空気のみをfillする場合に変更してください。
3番目の項目は、置換するブロックをidで指定できます。
ただし、これを設定すると、2番目の項目は無視されます。

### 5.undoコマンドを使用できます。

チャットに以下を送信します。
```
@ins undo
```
ひとつ前のfillをなかったことにできます。
fill後にその範囲を編集しても、fillする直前の状態に戻ります。
ただしredoはデータの大きさを考慮して未実装のため、undoをキャンセルすることはできません。

## Compatible Versions

- 1.20.40
- 1.20.41

## Note

- 一度subscribeしたアイテムをゲームからunsubscribeすることはできません。ScriptAPIのItemStack.prototype.setLore()を使用して戻してください。

## License

Instant-Fill Version 3.0 is under [Mit license](https://en.wikipedia.org/wiki/MIT_License).

## Author

- [Takenoko-II](https://github.com/Takenoko-II)
- Twitter: https://twitter.com/Takenoko_4096
- Discord: takenoko_4096 | たけのこII#1119
