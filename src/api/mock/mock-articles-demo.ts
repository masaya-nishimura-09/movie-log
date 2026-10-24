import {
  article,
  blockquote,
  bulletList,
  doc,
  heading,
  type MockArticle,
  orderedList,
  paragraph,
  t,
  text,
} from "@/api/mock/mock-article-factory";

export const demoArticles: MockArticle[] = [
  article(
    1,
    1,
    "2026-09-27T14:00:00.000Z",
    "2026-09-29T11:30:00.000Z",
    t(
      "終電の八分間 ― 何も起こらない場面を三回観た",
      "The eight minutes before the last train: watching a scene where nothing happens, three times",
    ),
    doc(
      heading(t("観た日のこと", "The day I watched it")),
      paragraph(
        t(
          "日曜の夜、夕食のあとに、MUBI で観た。九十八分。ミステリーという紹介文を読んで選んだので、ノートを開かずに観始めた。結果として、これは失敗だった。観終わってすぐ、一行しかメモが書けなかったからだ。",
          "I watched it on MUBI on a Sunday night after dinner. Ninety-eight minutes. I had chosen it because the blurb called it a mystery, so I started without opening my notebook. That turned out to be a mistake: when it ended I could only write a single line.",
        ),
      ),
      paragraph(
        t(
          "その一行は、「終電の場面が、言葉なしで全部を語っている。」だった。間違ってはいないが、あの場面について、私が観ているあいだに考えたことの一割も入っていない。だから、二日かけて、同じ場面を三回観直して、ここに書き足している。",
          "That line was: “The last-train scene says everything without words.” It is not wrong, but it holds perhaps a tenth of what I thought while watching that scene. So I spent two days rewatching the same scene three times, and I am adding to it here.",
        ),
      ),
      heading(t("あらすじ(結末は書かない)", "Synopsis (without the ending)")),
      paragraph(
        t(
          "終電が出る少し前の駅で、男が九番ホームに降り立つ。誰かに会うために来たらしいが、相手の名前は最後まで呼ばれない。彼が待つ一晩のあいだに、駅員、清掃員、酔った会社員、そして八番ホームから来る一人の女が、順に画面を通り過ぎていく。",
          "A little before the last train, a man steps down onto platform nine. He seems to have come to meet someone, but that person's name is never spoken. Over the night he waits, a station attendant, a cleaner, a drunk office worker and a woman who comes from platform eight pass through the frame in turn.",
        ),
      ),
      paragraph(
        t(
          "ミステリーとして期待すると、肩すかしになる。謎は提示されるが、解かれるのは半分だけで、残りは観る側に預けられる。",
          "If you expect a mystery, it will let you down. The puzzle is presented, but only half of it is solved, and the rest is left with the viewer.",
        ),
      ),
      heading(
        t(
          "最初の三十分に置かれたもの",
          "What is placed in the first thirty minutes",
        ),
      ),
      paragraph(
        t(
          "冒頭の三十分は、ほとんど何も起こらない。私は最初に観たとき、正直に言って、少し退屈していた。しかし二度目に、画面の隅だけを見るつもりで観たら、同じ三十分に、いくつもの物が置かれていることに気づいた。",
          "Almost nothing happens in the opening thirty minutes. The first time, I honestly found it a little dull. But when I watched again looking only at the edges of the frame, I noticed that many objects are placed in those same thirty minutes.",
        ),
      ),
      orderedList(
        t(
          "00:04 ホームの時計。二十三時十二分を指している",
          "00:04 The platform clock, pointing to 23:12",
        ),
        t(
          "00:09 ベンチの上の傘。持ち主はいない",
          "00:09 An umbrella on the bench, with no owner",
        ),
        t(
          "00:17 閉まったままの売店のシャッター。下に新聞が挟まっている",
          "00:17 The shutter of a kiosk that stays closed, with a newspaper caught under it",
        ),
        t(
          "00:26 掲示板の「九番」の文字だけが、わずかに欠けている",
          "00:26 On the sign, only the character for “nine” is slightly chipped",
        ),
      ),
      paragraph(
        text(t("どれも説明されない。", "None of them is explained."), "bold"),
        t(
          "ただし、後半に、これらのうち三つがもう一度画面に映る。物語の鍵になるわけではなく、同じ物が、違う時間に、違う意味で見える。それが、この映画の組み立て方だと思う。",
          " But three of them appear again in the second half. They do not become keys to the plot; the same objects are seen at a different time with a different meaning. That, I think, is how this film is built.",
        ),
      ),
      heading(t("終電の場面を分解する", "Taking the last-train scene apart")),
      paragraph(
        t(
          "五十二分から始まる、終電が来るまでの八分間。三回観て、メモを取りながら分解した。",
          "Eight minutes before the last train, starting at the fifty-two-minute mark. I watched it three times and took it apart in my notes.",
        ),
      ),
      heading(t("画面", "The picture"), 3),
      paragraph(
        t(
          "カットの数は、八分間で五つしかない。最初の四分は、同じ位置から、ホームの両端に立つ二人を、一つの画面に収めている。二人の距離は変わらないのに、掲示板の数字だけが減っていく。",
          "There are only five cuts in the eight minutes. For the first four, the camera stays in one position and holds the two people at opposite ends of the platform in a single frame. The distance between them never changes; only the number on the display board falls.",
        ),
      ),
      heading(t("音", "The sound"), 3),
      paragraph(
        t(
          "音楽はない。聞こえるのは、風と、遠くの踏切と、誰かの靴の音だけ。一回目は、音楽が入るのを待っていた。入らなかったので、二回目には、踏切が鳴る間隔を数えてしまった。十二秒に一度だった。",
          "There is no music. What we hear is wind, a railway crossing in the distance and somebody's shoes. The first time I waited for music to come in. Because it did not, the second time I found myself counting the intervals of the crossing bell. It was once every twelve seconds.",
        ),
      ),
      heading(t("演技", "The acting"), 3),
      paragraph(
        t(
          "久世蓮は、ほとんど表情を変えない。その代わりに、鞄の持ち方が三度変わる。肩にかけ、両手で抱え、足元に置く。織部凪は、視線を落とす角度で感情を見せる。二人とも、見せようとしていないのに、見えてしまう。その加減が、観ていて心地よかった。",
          "Ren Kuze hardly changes his expression. Instead, the way he holds his bag changes three times: over the shoulder, held in both arms, set at his feet. Nagi Orube shows her feelings through the angle at which she lowers her eyes. Neither seems to be trying to show anything, and yet it shows. I enjoyed how finely that was balanced.",
        ),
      ),
      blockquote(
        t(
          "静かな場面は、音がない場面ではなく、小さな音が全部聞こえる場面だと思った。",
          "A quiet scene is not one without sound. It is one in which every small sound can be heard.",
        ),
      ),
      heading(t("好きになれなかったところ", "What I did not like")),
      paragraph(
        t(
          "全部を褒めたいわけではない。六十八分ごろからの回想の場面は、説明が多すぎると感じた。言葉にしなくても伝わっていたことを、あとから台詞で確認されているようだった。",
          "I do not want to praise everything. The flashback from around the sixty-eight-minute mark felt over-explained. It was as if something that had already come across without words was being confirmed afterward in dialogue.",
        ),
      ),
      paragraph(
        t(
          "ただし、その回想は三分で終わる。長引かせないところに、水無瀬遥監督の抑えた手つきを感じた。回想の最後の台詞だけは、削ってもよかったと思う。",
          "Still, the flashback ends in three minutes. In the fact that it is not stretched out, I felt the restrained hand of the director, Haruka Minase. I think only its last line could have been cut.",
        ),
      ),
      heading(t("似た映画との比較", "Compared with similar films")),
      paragraph(
        t(
          "待つ時間を中心に置いた映画として、同じ記録帳にある「船のない港」と並べて考えた。",
          "I thought about it next to “Harbour Without Ships”, which is in the same record book, as another film built around time spent waiting.",
        ),
      ),
      bulletList(
        t(
          "船のない港: 待つ人の一日が、季節をまたいで続く。時間は長い",
          "Harbour Without Ships: a waiting person's days continue across seasons. Time is long",
        ),
        t(
          "九番ホームの灯: 待つのは一晩だけ。時間は短いが、一分ごとに重い",
          "The Lamp Under Platform Nine: only one night of waiting. Time is short, but each minute is heavy",
        ),
        t(
          "どちらも、待たれているものは映らない",
          "In both, what is being waited for is never shown",
        ),
      ),
      heading(t("覚えている台詞", "Lines I remember")),
      paragraph(
        t(
          "台詞は少ないので、覚えているものを全部書いておく。",
          "There is so little dialogue that I can write down everything I remember.",
        ),
      ),
      bulletList(
        t("「次の電車は、最後ですか」", "“Is the next train the last one?”"),
        t(
          "「最後です。でも、一本前のも、まだ行っていません」",
          "“It is. But the one before it has not left yet either.”",
        ),
        t(
          "「傘は、誰のですか」「さあ」",
          "“Whose umbrella is this?” “Who knows.”",
        ),
      ),
      heading(t("点数の理由", "Why I scored it this way")),
      paragraph(
        t(
          "点数は四点にした。五点にしなかった理由は、回想の場面が説明しすぎだという印象を、二度目、三度目に観ても消せなかったからだ。逆に、三点にしなかった理由は、終電の八分間が、観終わって三日たっても、頭の中で何度も再生されるからだ。",
          "I gave it four points. The reason it is not five is that I could not shake the impression that the flashback explains too much, even on the second and third viewings. The reason it is not three is that the eight minutes before the last train kept replaying in my head, even three days after I finished.",
        ),
      ),
      heading(t("次に観るときのメモ", "Notes for the next viewing")),
      orderedList(
        t(
          "冒頭の三十分は、時計の針だけを見る",
          "In the first thirty minutes, watch only the hands of the clock",
        ),
        t(
          "八分間の掲示板の数字と、二人の立つ位置を、秒ごとに記録する",
          "Record the numbers on the board and the positions of the two people, second by second, through the eight minutes",
        ),
        t(
          "回想の最後の台詞が、本当に不要かを確かめる",
          "Check whether the last line of the flashback really is unnecessary",
        ),
      ),
    ),
  ),
  article(
    2,
    1,
    "2026-10-04T20:15:00.000Z",
    "2026-10-04T21:40:00.000Z",
    t(
      "鑑賞メモ: 二度目に見つけたもの",
      "Viewing notes: what I found the second time",
    ),
    doc(
      paragraph(
        t(
          "二度目の鑑賞は、日曜の午後、家で一人で観た。一度目に見逃していたものを、止めながらメモした。",
          "I watched it the second time alone at home on a Sunday afternoon. I paused as I went and noted what I had missed the first time.",
        ),
      ),
      heading(t("見つけたもの", "What I found")),
      bulletList(
        t(
          "ホームの灯が消えるのは、電車の音が聞こえる二秒前",
          "The platform light goes out two seconds before the train can be heard",
        ),
        t(
          "ホームの時計は、冒頭から最後まで、同じ時刻を指している",
          "The platform clock shows the same time from the opening to the end",
        ),
        t(
          "ベンチの上の傘は、最初の場面にも映っている",
          "The umbrella on the bench is already in the first scene",
        ),
        t(
          "売店のシャッターの下の新聞は、日付が前日のもの",
          "The newspaper under the kiosk shutter is dated the day before",
        ),
      ),
      heading(t("気づいたことの意味", "What these might mean")),
      paragraph(
        t(
          "二つ目の、時計が止まっているように見えることは、最初は撮影の都合だと思った。しかし、時計が動いて見える場面が一度だけある。電車が到着した直後だ。",
          "I first took the second item, the clock that seems stopped, for a matter of production. But there is one scene in which the clock does seem to move: right after the train arrives.",
        ),
      ),
      paragraph(
        text(
          t(
            "三つ目は、観直さなければ気づけなかった。",
            "I could not have noticed the third without watching again.",
          ),
          "bold",
        ),
        t(
          "傘が最初から置かれているということは、持ち主はこの駅に、この映画が始まる前から来ていた、ということになる。",
          " That the umbrella is there from the start means its owner had come to this station before the film began.",
        ),
      ),
    ),
  ),
  article(
    3,
    5,
    "2026-08-31T21:00:00.000Z",
    "2026-09-04T22:30:00.000Z",
    t(
      "待つ映画を、待ちながら観る ― 「船のない港」の九十六分",
      "Watching a film about waiting, while waiting: the ninety-six minutes of “Harbour Without Ships”",
    ),
    doc(
      heading(t("最初の十分", "The first ten minutes")),
      paragraph(
        t(
          "港の岸壁に、女が立っている。それだけの場面が、十分近く続く。カメラは動かず、女も動かない。最初は何かの前置きだと思っていたが、そうではなかった。この映画は、最初から最後まで、これと同じ種類の時間でできている。",
          "A woman stands on a quay in a harbor. That single scene lasts nearly ten minutes. The camera does not move, and neither does she. At first I took it for a prelude, but it was not. The film is made from this same kind of time from beginning to end.",
        ),
      ),
      heading(t("待つ人たち", "The people who wait")),
      paragraph(
        t(
          "イングリッド・ファルクが演じる女は、毎日同じ時刻に岸壁へ行く。ブロール・ルンドが演じる年老いた漁師は、そのことに気づいていて、声をかけない。二人のあいだで交わされる台詞は、全編を通しても数えるほどしかない。",
          "The woman, played by Ingrid Falk, goes to the quay at the same hour every day. The old fisherman, played by Bror Lund, notices this and never speaks to her. The lines exchanged between the two can be counted on one hand over the whole film.",
        ),
      ),
      paragraph(
        t(
          "二人が待っているものは、最後まで映らない。それでも、待っているものの大きさは、二人の立ち方から伝わってきた。女は、岸壁の端から一歩下がったところに立つ。漁師は、ちょうど端に立つ。この半歩の違いが、二人の待ち方の違いだと思った。",
          "What the two are waiting for is never shown. Even so, the size of it came across through the way they stand. The woman stands one step back from the edge of the quay. The fisherman stands exactly at the edge. I took that half step to be the difference in how they wait.",
        ),
      ),
      heading(t("時間の見せ方", "How time is shown")),
      bulletList(
        t(
          "朝、昼、夕方の光の違いだけで、一日が過ぎたことが分かる",
          "The passing of a day is shown only by the changing light of morning, noon and evening",
        ),
        t(
          "季節は、女の服の厚さで変わっていく",
          "The seasons change through the thickness of the woman's clothes",
        ),
        t(
          "港に船が戻ってこないことは、掲示板の空欄だけで示される",
          "That no ship returns to the harbor is shown only by an empty line on a notice board",
        ),
      ),
      heading(t("老いた漁師の家", "The old fisherman's house")),
      paragraph(
        t(
          "中盤で一度だけ、ブロール・ルンドの家の中が映る。壁には、船の写真が何枚も掛かっている。どれも、港に戻ってきた日に撮られたもののようで、日付が書き込まれていた。いちばん新しい日付は、十年以上前だった。",
          "Once, in the middle, the inside of Bror Lund's house is shown. Many photographs of ships hang on the wall. They all seem to have been taken on the day the ships came back to port, and each has a date written on it. The newest date was more than ten years back.",
        ),
      ),
      paragraph(
        t(
          "港に船が戻らなくなってから、彼は十年以上、岸壁に通っていることになる。その数字を、台詞も説明もなく、壁の写真だけで見せるところに、この映画の考え方が出ていると思う。",
          "That means he has been going to the quay for more than ten years since the ships stopped coming back. I think the film's whole way of thinking shows in how it presents that number through photographs on a wall alone, with no dialogue and no explanation.",
        ),
      ),
      heading(t("音と静けさ", "Sound and stillness")),
      paragraph(
        t(
          "波の音は、一定の大きさでずっと鳴っている。それが、場面ごとに違って聞こえた。同じ音なのに、女が立っているときは遠く、漁師が網を直しているときは近くに感じる。聞く側の気持ちで、音の距離が変わる。",
          "The sound of the waves is constant in volume, yet it sounded different from scene to scene. The same sound seems far away when the woman is standing and close when the fisherman mends his nets. The distance of the sound changes with the mood of the listener.",
        ),
      ),
      blockquote(
        t(
          "待つことは、何もしないことではなく、毎日同じことを選び続けることだった。",
          "Waiting was not doing nothing. It was choosing the same thing again and again, every day.",
        ),
      ),
      heading(t("観ている私も待っていた", "I was waiting too")),
      paragraph(
        t(
          "九十六分のうち、半分を過ぎたあたりから、自分も何かを待っていることに気づいた。船が戻ることなのか、二人が話すことなのか、自分でも分からない。ただ、画面を見ながら待つ、という状態が続いた。",
          "Somewhere after the halfway point of the ninety-six minutes, I realized that I was waiting for something too. Whether it was the ship's return or the two speaking, I could not tell. I simply stayed in that state of waiting while watching the screen.",
        ),
      ),
      paragraph(
        t(
          "終わり方は書かない。ただ、エンドロールが流れ始めてもしばらく動けなかった。点数は五点にした。迷わなかった。",
          "I will not write how it ends. I only say that I could not move for a while after the credits started. I gave it five points, and I did not hesitate.",
        ),
      ),
    ),
  ),
  article(
    4,
    3,
    "2026-09-14T09:20:00.000Z",
    "2026-09-15T07:50:00.000Z",
    t("部屋番号の冗談の設計図", "A blueprint of the room-number joke"),
    doc(
      paragraph(
        t(
          "「朱色のホテル」は、廊下の壁の色から始まる。それが、このホテルでは部屋の番号が信用できないことを、台詞なしで伝えている。この映画の笑いは、ほとんどが、部屋番号の間違いから作られている。繰り返される冗談の組み立てを、書き出しておきたい。",
          "“The Vermilion Hotel” begins with the color of the corridor walls. It tells us, without a line of dialogue, that room numbers cannot be trusted in this hotel. Nearly all of the film's laughs are built from room-number mistakes. I want to write out how the repeated joke is constructed.",
        ),
      ),
      heading(t("数え間違える支配人", "The manager who miscounts")),
      paragraph(
        t(
          "アーサー・ベルウェザーが演じる支配人は、客を案内するたびに、部屋の番号を一つずつ間違える。間違いは毎回少しずつ大きくなる。",
          "The manager, played by Arthur Bellweather, gets a room number wrong by one each time he shows a guest the way. The mistake grows a little every time.",
        ),
      ),
      orderedList(
        t(
          "一度目(十四分): 隣の部屋に案内する。客は気づいて、笑って戻る",
          "First time (14 min): he leads the guest to the next room. The guest notices and goes back, laughing",
        ),
        t(
          "二度目(四十一分): 同じ階の端の部屋に案内する。客は苛立つ",
          "Second time (41 min): to a room at the far end of the same floor. The guest is irritated",
        ),
        t(
          "三度目(七十九分): 客が気づかないまま、別の階にいる",
          "Third time (79 min): the guest is on another floor without noticing",
        ),
      ),
      heading(t("冗談の作り方", "How the joke is built")),
      paragraph(
        t(
          "笑いは、台詞ではなく、構図で作られている。ドロレス・フィンチが演じる宿泊客は、いつも画面の中央に立ち、背景の廊下だけが少しずつずれていく。観客だけが、ずれに気づける位置に置かれている。",
          "The laughs come from composition, not dialogue. The guest, played by Dolores Finch, always stands at the center of the frame, while only the corridor behind her shifts little by little. The audience alone is placed where the shift can be noticed.",
        ),
      ),
      paragraph(
        text(
          t(
            "同じ冗談を三回繰り返して、三回とも違う笑いにしている",
            "The same joke is repeated three times, and each time it gets a different laugh",
          ),
          "bold",
        ),
        t(
          "ところに、この監督の自信を感じた。一度目は気づいた笑い、二度目は苛立ちの笑い、三度目は気づかないことの笑い。",
          ". I could feel the director's confidence in that. The first is the laugh of noticing, the second the laugh of irritation, the third the laugh of not noticing.",
        ),
      ),
      heading(t("ホテルの外", "Outside the hotel")),
      paragraph(
        t(
          "ホテルの外に出る場面は、全編で二回しかない。どちらも、道の向こうに同じ赤い建物が見えていて、外の世界もこのホテルの延長なのではないか、と思わせる。ドロレス・フィンチが、二度目に外へ出たときの表情が忘れられない。安心しているようにも、がっかりしているようにも見えた。",
          "There are only two scenes outside the hotel in the whole film. In both, the same red building can be seen across the street, which makes one wonder whether the outside world is just an extension of the hotel. I cannot forget Dolores Finch's expression the second time she steps outside. It looked like relief, and it looked like disappointment.",
        ),
      ),
    ),
  ),
  article(
    5,
    7,
    "2026-08-17T19:40:00.000Z",
    "2026-08-22T08:10:00.000Z",
    t(
      "左手で描く地図 ― 師匠が渡した白い紙のこと",
      "A map drawn with the left hand: the blank sheet the master hands over",
    ),
    doc(
      heading(t("題名の意味", "What the title means")),
      paragraph(
        t(
          "題名にある左手の意味は、中盤まで明かされない。地図職人は、右手を怪我していて、左手で線を引いている。そのため、地図の線は、少しだけ震えている。",
          "The meaning of the left hand in the title is not revealed until the middle of the film. The mapmaker has injured his right hand and draws lines with his left. For that reason, the lines of his maps tremble slightly.",
        ),
      ),
      paragraph(
        t(
          "その震えた線を、旅人たちが頼りにして歩いていく。正確ではない地図が、正確な地図よりも、人を遠くまで連れて行く。この矛盾が、物語の中心にあると思った。",
          "Travelers rely on those trembling lines as they walk. A map that is not accurate takes people farther than an accurate one. I thought this contradiction was at the center of the story.",
        ),
      ),
      heading(t("地図に描かれたもの", "What the maps show")),
      orderedList(
        t("川の曲がり角", "The bends of a river"),
        t("井戸の場所", "The locations of wells"),
        t("親切な人の家", "Houses of kind people"),
        t("引き返したほうがいい道", "Roads on which it is better to turn back"),
      ),
      paragraph(
        t(
          "四つ目が特に好きだった。地図は、行ける場所を示すだけでなく、行かないほうがいい場所も示している。",
          "I especially liked the fourth. The map shows not only where one can go but also where one had better not.",
        ),
      ),
      heading(t("旅人たち", "The travelers")),
      paragraph(
        t(
          "ダリオ・キンテロが演じる若い旅人は、地図職人の弟子になりたいと言って訪ねてくる。師匠は、断るかわりに、一枚の白い紙を渡す。「自分が歩いた道を描いてから来なさい」と言って。",
          "The young traveler, played by Dario Quintero, comes to ask to become the mapmaker's apprentice. Instead of refusing, the master hands him a single blank sheet of paper and tells him to come back after drawing the roads he has walked.",
        ),
      ),
      paragraph(
        t(
          "弟子が最初に持ち帰った地図は、道が途中で途切れていた。師匠は、それを見て初めて笑う。途切れた先を、まだ歩いていないからだ。",
          "The first map the apprentice brings back has roads that stop halfway. Only then does the master laugh, because he has not yet walked beyond where they stop.",
        ),
      ),
      heading(t("旅の映画として", "As a travel film")),
      paragraph(
        t(
          "一九九五年の映画だが、風景の撮り方は、今の映画よりも落ち着いている。長い道を、長いまま見せる。ルシア・マルケスが歩く姿を、カメラが遠くから追い続ける場面は、何度観ても飽きない。",
          "It is a film from 1995, but the way it shoots landscape is calmer than in films today. A long road is shown as a long road. The scenes in which the camera keeps following Lucia Marquez walking from a distance never get old, however many times I watch them.",
        ),
      ),
      blockquote(
        t(
          "地図は、歩いた人の記録でもある。",
          "A map is also a record of those who walked.",
        ),
      ),
    ),
  ),
  article(
    6,
    2,
    "2026-09-21T23:10:00.000Z",
    "2026-09-21T23:10:00.000Z",
    t("観た日の記録", "Log of the day I watched it"),
    doc(
      bulletList(
        t("日付: 9月21日(月)", "Date: Monday, September 21"),
        t("場所: 自宅のリビング", "Place: the living room at home"),
        t("一緒に観た人: なし", "Watched with: nobody"),
        t(
          "観る前の状態: 少し疲れていた。夕方まで寝ていた",
          "State before watching: a little tired. I had slept until the evening",
        ),
        t(
          "途中で止めた回数: 二回(どちらも飲み物を取りに)",
          "Times I paused: twice (both to get a drink)",
        ),
      ),
      paragraph(
        t(
          "冬の景色が多い映画なので、部屋を暗くして、暖房を少し強めにして観た。この選び方は、悪くなかったと思う。",
          "Since the film has many winter landscapes, I watched with the room dark and the heating a little higher. I think that choice was not a bad one.",
        ),
      ),
    ),
  ),
];
