import type { MockArticle } from "@/api/mock/mock-article-factory";
import {
  article,
  bulletList,
  doc,
  heading,
  paragraph,
  t,
} from "@/api/mock/mock-article-factory";

type Topic = {
  title: [string, string];
  body: [string, string];
  list?: [string[], string[]];
};

const topics: Topic[] = [
  {
    title: ["音の使い方についてのメモ", "Notes on the use of sound"],
    body: [
      "音楽が入る場面と、入らない場面を数えてみた。入らない場面のほうが、あとまで記憶に残っている。",
      "I counted the scenes with music and the scenes without. The ones without stay in my memory longer.",
    ],
  },
  {
    title: ["エンドロールのあとで", "After the end credits"],
    body: [
      "エンドロールが終わっても、しばらく画面を消せなかった。何を考えていたのかを、思い出せるかぎり書いておく。",
      "I could not turn off the screen for a while after the credits ended. I write down what I was thinking, as far as I can recall.",
    ],
  },
  {
    title: ["冒頭の三分間", "The first three minutes"],
    body: [
      "最初の三分間に、この映画のやり方がすべて出ている。観直すたびに、その三分間だけを先に見る。",
      "The film's whole method is in its first three minutes. Each time I rewatch it, I look at those three minutes first.",
    ],
  },
  {
    title: ["好きな横顔", "A profile I like"],
    body: [
      "正面よりも、横から撮った顔のほうが、表情が分かる人がいる。この映画の主演がそうだった。",
      "Some people show more in profile than head-on. The lead in this film is one of them.",
    ],
  },
  {
    title: ["季節の描き方", "How the seasons are shown"],
    body: [
      "季節の変わり目を、台詞では説明していない。服の厚さと、窓の外の木で分かる。",
      "The change of seasons is not explained in the dialogue. It shows in the thickness of the clothes and the trees outside the window.",
    ],
  },
  {
    title: ["帰り道に考えたこと", "What I thought on the way home"],
    body: [
      "映画館を出て、駅まで歩くあいだに、観た映画の場面を順番に思い出していた。いちばん先に浮かんだのは、結末ではなかった。",
      "Walking from the theater to the station, I recalled the scenes in order. The first one that came to mind was not the ending.",
    ],
  },
  {
    title: [
      "二度目に気づいたこと その2",
      "What I noticed the second time, part 2",
    ],
    body: [
      "前に書いたメモの続き。今回は、人物の持ち物だけを見ていた。",
      "A continuation of my earlier notes. This time I looked only at the characters' belongings.",
    ],
    list: [
      [
        "鞄の色が、場面ごとに違う",
        "傘は、一度も開かれない",
        "時計は、いつも左手にある",
      ],
      [
        "The color of the bag changes from scene to scene",
        "The umbrella is never opened",
        "The watch is always on the left wrist",
      ],
    ],
  },
  {
    title: ["台詞のない場面", "A scene without words"],
    body: [
      "二人が向かい合って座るだけの場面が、三分ほど続く。台詞がなくても、二人の関係が分かる。",
      "A scene of two people simply sitting face to face runs for about three minutes. Without any lines, their relationship is clear.",
    ],
  },
  {
    title: ["衣装の色", "The color of the costumes"],
    body: [
      "人物ごとに、決まった色の服を着ている。服の色が変わった場面を探すと、物語の転換点と重なっていた。",
      "Each character wears a set color. The scenes where the color changes turned out to coincide with the turning points of the story.",
    ],
  },
  {
    title: ["部屋の中の光", "Light inside the room"],
    body: [
      "窓から入る光の向きで、時間が分かる。朝の場面と夕方の場面は、同じ部屋でも別の部屋に見える。",
      "The direction of the light from the window tells the time. The morning scene and the evening scene look like different rooms, though it is the same one.",
    ],
  },
  {
    title: ["長回しを数える", "Counting the long takes"],
    body: [
      "カットを切らずに撮った場面は、全部で四つあった。どれも、人物が歩きながら話している。",
      "There were four scenes shot without a cut. In every one, a character is walking and talking.",
    ],
  },
  {
    title: ["脇役の一言", "A line from a minor character"],
    body: [
      "主役ではない人物の、たった一言が、この映画でいちばん好きな台詞になった。",
      "A single line from a character who is not the lead became my favorite line in the film.",
    ],
  },
  {
    title: ["観る前と観たあと", "Before and after watching"],
    body: [
      "観る前は、地味な映画だと思っていた。観たあとは、地味という言葉が合わないと思った。",
      "Before watching, I thought it would be a plain film. Afterward I felt that the word did not fit.",
    ],
  },
  {
    title: ["好きな場面ベスト3", "Three favorite scenes"],
    body: [
      "好きな場面を三つ選んだ。選ぶのに、観た時間と同じくらいかかった。",
      "I picked three favorite scenes. Choosing took about as long as watching.",
    ],
    list: [
      [
        "駅のホームで二人が別れる場面",
        "雨の中で走る場面",
        "最後に窓を開ける場面",
      ],
      [
        "The two parting on the station platform",
        "The scene of running in the rain",
        "Opening the window at the end",
      ],
    ],
  },
  {
    title: ["気になった小道具", "A prop that caught my eye"],
    body: [
      "机の上に置かれた古い万年筆が、何度も画面に映る。使われる場面は、一度もなかった。",
      "An old fountain pen on the desk appears again and again. It is never used.",
    ],
  },
  {
    title: ["画面の端", "The edge of the frame"],
    body: [
      "主役ではなく、画面の端に映る人を見ていた。誰も、カメラを見ていない。",
      "I watched the people at the edge of the frame rather than the lead. None of them looks at the camera.",
    ],
  },
  {
    title: ["観た場所のこと", "About where I watched it"],
    body: [
      "平日の昼間の映画館で観た。客は、自分を入れて四人だけだった。そのおかげで、静かな場面がよく聞こえた。",
      "I watched it in a theater on a weekday afternoon. Including me, there were only four people, so the quiet scenes came through well.",
    ],
  },
  {
    title: ["点数をつけるときに迷ったこと", "Hesitating over the score"],
    body: [
      "四点にするか五点にするか、三日迷った。迷ったこと自体が、答えなのかもしれない。",
      "I hesitated for three days between four and five points. The hesitation itself may be the answer.",
    ],
  },
  {
    title: ["好きになれなかった場面", "A scene I did not like"],
    body: [
      "全体は好きだが、中盤の一場面だけ、どうしても馴染めなかった。理由を、順に書いてみる。",
      "I like the film as a whole, but one scene in the middle never sat right with me. I try to write out why, step by step.",
    ],
  },
  {
    title: ["ラストの解釈", "My reading of the ending"],
    body: [
      "結末の解釈は、観た人の数だけある気がする。自分の解釈を、あとで読み返せるように残しておく。",
      "There seem to be as many readings of the ending as there are viewers. I leave mine here so I can reread it later.",
    ],
  },
  {
    title: ["時間の流れ方", "How time passes"],
    body: [
      "九十分の映画なのに、三日間の出来事に見える。場面の長さと、画面の暗さで、時間の長さを作っている。",
      "Though it runs ninety minutes, it feels like three days of events. The length of scenes and the darkness of the picture build the sense of time.",
    ],
  },
  {
    title: ["繰り返される動作", "A repeated gesture"],
    body: [
      "主人公は、何かを決めるたびに、同じ動作をする。それに気づいてから、動作だけを待つようになった。",
      "Every time the protagonist makes a decision, they make the same gesture. After noticing, I began to wait only for that gesture.",
    ],
  },
  {
    title: ["背景に映るもの", "What appears in the background"],
    body: [
      "人物の後ろに、毎回違うポスターが貼られている。どれも、実在しない映画のものだった。",
      "A different poster hangs behind the characters each time. All of them are for films that do not exist.",
    ],
  },
  {
    title: ["風景のカット", "The landscape shots"],
    body: [
      "場面と場面のあいだに、風景だけのカットが挟まる。意味を探さずに、ただ見ていた。",
      "Shots of landscape alone are placed between scenes. I did not look for meaning; I just watched.",
    ],
  },
  {
    title: ["人物の距離", "The distance between characters"],
    body: [
      "二人が立つ位置が、物語が進むほど、少しずつ遠くなる。画面の中の距離を測っておいた。",
      "As the story goes on, the positions where the two stand grow slightly farther apart. I measured the distance within the frame.",
    ],
    list: [
      [
        "最初: 隣に座っている",
        "中盤: 机をはさんで向かい合う",
        "最後: 部屋の端と端に立つ",
      ],
      [
        "At first: sitting side by side",
        "In the middle: facing each other across a desk",
        "At the end: standing at opposite ends of the room",
      ],
    ],
  },
  {
    title: ["夜の場面", "The night scenes"],
    body: [
      "夜の場面は、街灯の色だけで撮られている。暗いのに、人物の顔はよく見える。",
      "The night scenes are lit only by the color of the street lamps. It is dark, yet the faces can be seen well.",
    ],
  },
  {
    title: ["水の描写", "Water on screen"],
    body: [
      "雨、川、海。水が出てくる場面を、全部書き出した。水が出る場面では、台詞が少なくなる。",
      "Rain, a river, the sea. I wrote out every scene with water. In those scenes the dialogue thins out.",
    ],
  },
  {
    title: ["食事の場面", "The meal scenes"],
    body: [
      "人物が食事をする場面が、四回ある。何を食べているかより、誰と食べているかが、毎回違う。",
      "There are four scenes in which the characters eat. What they eat matters less than whom they eat with, which changes every time.",
    ],
  },
  {
    title: ["電話と手紙", "Phones and letters"],
    body: [
      "離れた人とのやり取りが、電話と手紙で描かれる。返事が来るまでの時間が、そのまま映画の時間になる。",
      "Exchanges with people far away are shown through phone calls and letters. The time before a reply arrives becomes the film's own time.",
    ],
  },
  {
    title: ["窓の外", "Outside the window"],
    body: [
      "窓の外に何が見えるかで、人物の気持ちが分かる。晴れの日にも、窓が閉まっている場面があった。",
      "What can be seen outside the window shows how a character feels. There was a scene in which the window stays shut even on a clear day.",
    ],
  },
  {
    title: ["笑ってしまった場面", "A scene that made me laugh"],
    body: [
      "真面目な場面のはずなのに、笑ってしまった。笑ったのは、おそらく、自分だけだった。",
      "It was meant to be a serious scene, and I laughed. I was probably the only one who did.",
    ],
  },
  {
    title: ["静かな怖さ", "A quiet fear"],
    body: [
      "何も起こらないのに、怖い。扉が開いたままになっている、というだけの場面が、いちばん怖かった。",
      "Nothing happens, and it is frightening. The scene in which a door is merely left open was the most frightening.",
    ],
  },
  {
    title: ["観直したい場面", "Scenes I want to watch again"],
    body: [
      "次に観るときのために、見直したい場面を書いておく。時間は、再生位置のメモ。",
      "For the next viewing, I note the scenes I want to look at again, with timestamps.",
    ],
    list: [
      ["00:12 最初の会話", "00:41 雨の場面", "01:20 最後の二分間"],
      [
        "00:12 The first conversation",
        "00:41 The rain scene",
        "01:20 The last two minutes",
      ],
    ],
  },
  {
    title: ["友人に勧めるなら", "If I recommended it to a friend"],
    body: [
      "友人に勧めるとしたら、何と言うかを考えた。あらすじではなく、一つの場面を伝えるのがよさそうだ。",
      "I thought about what I would say if recommending it to a friend. Describing one scene seems better than the plot.",
    ],
  },
  {
    title: ["字幕と原語", "Subtitles and the original language"],
    body: [
      "字幕を追わずに、原語の響きだけを聞く時間を作った。意味は分からないのに、感情は伝わった。",
      "I set aside time to listen only to the sound of the original language, without following the subtitles. I could not understand the words, but the feelings came through.",
    ],
  },
  {
    title: ["鑑賞メモ: 気づきの一覧", "Viewing notes: a list of findings"],
    body: [
      "観ながら取ったメモを、そのまま並べておく。整理は、あとでする。",
      "I line up the notes I took while watching, as they are. I will tidy them later.",
    ],
    list: [
      [
        "冒頭の音が、最後にもう一度鳴る",
        "同じ道を、三度通る",
        "人物の名前が、最後まで呼ばれない",
      ],
      [
        "The opening sound is heard once more at the end",
        "The same road is walked three times",
        "A character's name is never spoken",
      ],
    ],
  },
];

export const extraArticleCount = topics.length;

const english = process.env.MOCK_LANGUAGE === "en";

const firstCreated = Date.UTC(2026, 7, 1, 10, 0, 0);
const day = 24 * 60 * 60 * 1000;

export function extraArticles(
  recordIds: number[],
  firstId: number,
): MockArticle[] {
  return topics.map((topic, index) => {
    const created = new Date(firstCreated + index * 1.7 * day);
    const updated = new Date(created.getTime() + ((index * 7) % 6) * day);
    return article(
      firstId + index,
      recordIds[index % recordIds.length] ?? 2,
      created.toISOString(),
      updated.toISOString(),
      t(...topic.title),
      doc(
        heading(t("気づいたこと", "What I noticed")),
        paragraph(t(...topic.body)),
        ...(topic.list ? [bulletList(...topic.list[english ? 1 : 0])] : []),
      ),
    );
  });
}
