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

export const defaultArticles: MockArticle[] = [
  article(
    1,
    1,
    "2026-10-02T09:00:00.000Z",
    "2026-10-03T21:30:00.000Z",
    t("ジャンプカットが生んだ速度", "The speed the jump cuts created"),
    doc(
      heading(t("観たきっかけ", "Why I watched it")),
      paragraph(
        t(
          "映画史の本で名前を何度も見ていたのに、観ないままにしていた。九十分しかないと知って、気軽な気持ちで観始めた。観終わってから、気軽に観たことを少し後悔した。もっと姿勢を正して観るべき映画だった。",
          "I had seen its name in film-history books many times without ever watching it. When I learned it was only ninety minutes, I started it casually. Afterward I slightly regretted that. It was a film to watch sitting up straight.",
        ),
      ),
      heading(t("あらすじ(結末は書かない)", "Synopsis (without the ending)")),
      paragraph(
        t(
          "車を盗んだ若い男、ミシェルは、途中で警官を撃ってしまう。逃げるあいだに、パリにいるアメリカ人の女性、パトリシアに会いに行く。彼女は街頭で新聞を売りながら、学生をしている。物語は、この二人の数日間を追うだけで、複雑な筋はない。",
          "Michel, a young man who has stolen a car, shoots a police officer along the way. While on the run he goes to see Patricia, an American woman in Paris who sells newspapers on the street while studying. The story simply follows these two for a few days; there is no complicated plot.",
        ),
      ),
      heading(t("編集の話", "On the editing")),
      paragraph(
        t(
          "場面を飛ばす編集が、物語よりも先に映画のテンポを決めていた。",
          "The cuts that skip across scenes set the film's tempo before the story did.",
        ),
      ),
      paragraph(
        t(
          "車の中の場面が分かりやすい。同じ人物が同じ場所で話しているのに、台詞の途中で、画面が少し先に飛ぶ。普通の映画なら、不自然に見えるはずなのに、ここでは、話している人の落ち着きのなさとして見える。",
          "The scenes in the car make it clear. The same person is talking in the same place, and in the middle of a line the picture jumps a little ahead. In an ordinary film this would look unnatural, but here it reads as the restlessness of the person talking.",
        ),
      ),
      bulletList(
        t("カットのつなぎ目", "Where the shots join"),
        t("台詞の間", "The pauses in dialogue"),
        t("街の音", "The street"),
      ),
      blockquote(
        t(
          "映画は、撮り方よりも、切り方で決まる。",
          "A film is decided less by how it is shot than by how it is cut.",
        ),
      ),
      heading(t("街の中の撮影", "Shooting in the streets")),
      paragraph(
        t(
          "カメラは手持ちで、街の光をそのまま使っているように見える。撮影を担当したラウール・クタールの名前は、この映画で覚えた。カメラが人物のすぐ近くを歩きながら撮っているので、観ているこちらも、二人と同じ速さで街を歩いている気分になる。",
          "The camera is handheld and appears to use the light of the streets as it is. I learned the name of the cinematographer, Raoul Coutard, from this film. Because the camera walks right next to the characters, I felt I was walking the streets at the same pace as the two of them.",
        ),
      ),
      heading(t("ミシェルの仕草", "Michel's gestures")),
      paragraph(
        t(
          "ミシェルは、親指で唇をなぞる癖を何度も見せる。ハンフリー・ボガートの真似だということを、あとで知った。知ってから思い出すと、あの仕草は、彼が自分を映画の登場人物だと思いたがっていることの表れに見える。",
          "Michel repeatedly runs his thumb across his lip. I learned afterward that it imitates Humphrey Bogart. Remembering it with that in mind, the gesture looks like a sign that he wants to think of himself as a character in a film.",
        ),
      ),
      heading(t("部屋の中の長い場面", "The long scene in the room")),
      paragraph(
        t(
          "中盤に、パトリシアの部屋で二人が話し続ける長い場面がある。逃亡の物語なのに、ここだけ時間が止まったように長い。話している内容は、ほとんど噛み合っていない。それなのに、見ていて飽きない。二人の距離が近づいたり遠ざかったりする様子が、会話の内容よりも、はっきり見えるからだと思う。",
          "In the middle there is a long scene in which the two keep talking in Patricia's room. For a story about a fugitive, time seems to stop here. What they say hardly connects. Still, it never gets dull to watch. I think it is because the way their distance closes and opens is clearer than the content of the conversation.",
        ),
      ),
      heading(t("ジャズの音楽", "The jazz score")),
      paragraph(
        t(
          "音楽は、ピアノを中心にしたジャズで、場面の気分を説明しすぎない。スコアを担当したマルシャル・ソラールは、観終わってから調べて知った。聞き返したくなって、サウンドトラックを探した。",
          "The music is jazz centered on piano and does not over-explain the mood of a scene. I looked up the composer, Martial Solal, after watching. I wanted to listen again, so I searched for the soundtrack.",
        ),
      ),
      heading(t("書き留めておきたいこと", "What I want to note down")),
      orderedList(
        t(
          "ジャンプカットは、技法として知っていたが、実際に観ると、リズムの作り方だと分かった",
          "I knew the jump cut as a technique, but seeing it, I understood it as a way of making rhythm",
        ),
        t(
          "筋の単純さと、画面の自由さが、釣り合っている",
          "The simplicity of the plot is balanced by the freedom of the picture",
        ),
        t(
          "最後の場面は、もう一度観てから、考えたい",
          "I want to think about the last scene after watching it again",
        ),
      ),
    ),
  ),
  article(
    2,
    1,
    "2026-10-05T09:00:00.000Z",
    "2026-10-05T22:10:00.000Z",
    t("二度目に観て気づいたこと", "What I noticed the second time"),
    doc(
      paragraph(
        t(
          "二度目は、筋を知っているので、画面の細部だけを見ることができた。気づいたことを順番に書く。",
          "The second time, since I knew the plot, I could look only at the details of the picture. I write down what I noticed, in order.",
        ),
      ),
      heading(t("台詞を聞く", "Listening to the dialogue")),
      paragraph(
        t(
          "一度目は字幕を追うので精一杯だったが、二度目は、台詞の言い方を聞くことができた。ミシェルは、ほとんどの台詞を、相手の目を見ずに話している。",
          "The first time, keeping up with the subtitles was all I could manage, but the second time I could listen to how the lines are delivered. Michel says most of his lines without looking at the other person.",
        ),
      ),
      heading(t("気づいたこと", "What I noticed")),
      bulletList(
        t(
          "車の中の場面では、二人の顔が同じ画面に入ることが少ない",
          "In the car scenes, the two faces rarely share the same frame",
        ),
        t(
          "部屋の場面では、窓の外の光が、会話のあいだに少しずつ変わっている",
          "In the room scenes, the light outside the window changes little by little during the conversation",
        ),
        t(
          "二度目のほうが、ミシェルを笑える場面が多い",
          "There are more scenes in which I can laugh at Michel the second time",
        ),
      ),
      paragraph(
        text(
          t(
            "三つ目は、一度目には気づけなかった。",
            "I could not have noticed the third the first time.",
          ),
          "bold",
        ),
        t(
          "逃亡中の男の映画だと思って観ていたが、二度目には、自分を格好よく見せたい男の映画に見えた。",
          " I had watched it as a film about a man on the run, but the second time it looked like a film about a man who wants to look cool.",
        ),
      ),
    ),
  ),
  article(
    3,
    3,
    "2026-10-06T10:30:00.000Z",
    "2026-10-09T21:10:00.000Z",
    t(
      "赤と青と黄色の映画 ― 色を追って観た",
      "A film in red, blue and yellow: watching by following the colors",
    ),
    doc(
      heading(t("観終わって最初に残ったもの", "What stayed first")),
      paragraph(
        t(
          "観終わって最初に残ったのは、物語よりも色だった。この映画は、赤、青、黄の三色が、画面のあちこちに置かれている。服、車、壁、海。その配置が、台詞よりも多くを語っているように感じた。",
          "What stayed with me first after the film was not the story but the colors. Red, blue and yellow are placed all over the screen: clothes, cars, walls, the sea. Their arrangement seemed to say more than the dialogue did.",
        ),
      ),
      heading(t("印象に残った色", "The colors that stayed")),
      orderedList(
        t("マリアンヌの赤いドレス", "Marianne's red dress"),
        t("地中海の青", "The blue of the Mediterranean"),
        t(
          "ラストの、青く塗った顔に巻かれた赤と黄のダイナマイト",
          "At the end, red and yellow dynamite wound around a blue-painted face",
        ),
      ),
      heading(t("赤について", "About the red"), 3),
      paragraph(
        t("赤は、", "Red is the color of "),
        text(
          t(
            "人物の感情が動く場面",
            "the scenes where a character's feeling moves",
          ),
          "bold",
        ),
        t(
          "に多く出てきた気がする。服、車、壁と、画面のどこかに必ずある。マリアンヌの赤は、魅力としても危険としても見えた。",
          ", I felt. In clothes, cars and walls, it is always somewhere in the frame. Marianne's red looked like both an attraction and a danger.",
        ),
      ),
      heading(t("青について", "About the blue"), 3),
      paragraph(
        t(
          "青は海や空のように、背景として広がっていた。広い画面なのに、どこにも行けない感じがした。逃げているはずの二人が、青に囲まれているほど、動けなくなっていく。",
          "Blue spread out as a background, like sea and sky. The frame was wide, yet it felt as if there was nowhere to go. The more the two, who are supposed to be on the run, are surrounded by blue, the less they can move.",
        ),
      ),
      heading(t("ラストの顔", "The face at the end")),
      paragraph(
        t(
          "最後に、フェルディナンは顔を青く塗る。そこへ、赤と黄のダイナマイトを巻きつける。三つの色が、一人の人物の上に重なる場面で、映画の色の使い方が一つにまとまる。",
          "At the end, Ferdinand paints his face blue and winds red and yellow dynamite around it. In this scene, with the three colors laid over a single person, the film's use of color comes together.",
        ),
      ),
      blockquote(
        t(
          "色を追っていくと、物語の順番が見えてくる。",
          "Follow the colors and the order of the story shows itself.",
        ),
      ),
      heading(t("次に観るときのメモ", "Notes for the next viewing")),
      bulletList(
        t(
          "赤が画面に入る瞬間だけをメモする",
          "Note only the moments when red enters the frame",
        ),
        t(
          "青が背景から人物に移る場面を探す",
          "Look for scenes in which blue moves from the background onto a person",
        ),
        t(
          "色が切り替わる瞬間だけを見る",
          "Watch only the moments when the colors switch",
        ),
      ),
    ),
  ),
  article(
    4,
    3,
    "2026-10-09T12:00:00.000Z",
    "2026-10-09T12:00:00.000Z",
    t("観た日の記録", "Log of the day I watched it"),
    doc(
      bulletList(
        t("日付: 10月9日(金)", "Date: Friday, October 9"),
        t("場所: 自宅", "Place: at home"),
        t(
          "観る前の状態: 勝手にしやがれを観た一週間後だった",
          "State before watching: a week after watching Breathless",
        ),
        t("途中で止めた回数: なし", "Times I paused: none"),
      ),
      paragraph(
        t(
          "同じ監督の映画を、続けて観る流れになった。前に観たものよりも、色が強い。観終わってしばらく、頭の中に音楽が残っていた。",
          "I ended up watching films by the same director in succession. The colors are stronger than in the earlier one. For a while after it ended, the music stayed in my head.",
        ),
      ),
      paragraph(
        t("ひとことで書くなら、", "In one line: "),
        text(
          t(
            "明るいのに、ずっと悲しい。",
            "bright, and sad the whole way through.",
          ),
          "bold",
        ),
      ),
    ),
  ),
  article(
    5,
    7,
    "2026-10-10T13:00:00.000Z",
    "2026-10-12T22:45:00.000Z",
    t(
      "観終わってから何日か考えたこと",
      "What I thought about for days after watching",
    ),
    doc(
      paragraph(
        t(
          "観た直後は、うまく言葉にできなかった。何日かたって、場面を順番に思い出しながら書いている。",
          "Right after watching I could not put it into words. A few days later I am writing this while recalling the scenes in order.",
        ),
      ),
      heading(t("観終わった直後", "Right after the film")),
      paragraph(
        t(
          "悲しい映画だと思っていた。確かに、息子を亡くした母親が、バルセロナへ旅に出る場面から物語が動き出す。ところが、時間がたつほど、思い出すのはあたたかい場面ばかりになった。どうしてそう残ったのかが、ずっと気になっている。",
          "I had taken it for a sad film. It is true that the story starts moving with a mother who has lost her son setting out for Barcelona. Yet the more time passed, the more the scenes I recalled were warm ones. I keep wondering why it stayed with me that way.",
        ),
      ),
      heading(t("印象に残った人たち", "The people who stayed with me")),
      bulletList(
        t(
          "マヌエラ: 悲しみのなかでも、人の世話をやめない",
          "Manuela: even in grief, she does not stop looking after others",
        ),
        t(
          "ウマ: 舞台の上と、舞台を降りたあとで、別人のように見える",
          "Huma: she seems a different person on the stage and after leaving it",
        ),
        t(
          "アグラード: 自分の過去を、笑いに変えて話す",
          "Agrado: she turns her own past into a joke as she tells it",
        ),
      ),
      paragraph(
        t(
          "アグラードが舞台で自分の体のことを話す場面は、笑いながら観ていたのに、終わったときには、泣いていた。笑いと涙が、同じ場面のなかで入れ替わっていた。",
          "I was laughing while watching the scene in which Agrado talks about her own body on stage, and yet by the time it ended I was crying. Laughter and tears traded places within the same scene.",
        ),
      ),
      heading(t("色と部屋", "Colors and rooms")),
      paragraph(
        t(
          "登場人物が増えていくのに、不思議と混乱しなかった。誰もが自分の事情を、短い台詞のなかに持っているように感じたからだと思う。画面の色づかいも、人物の気持ちと結びついて見えた。部屋ごとに温度が違う。",
          "The cast keeps growing, yet it was strangely easy to follow. I think it was because everyone seemed to carry their own circumstances inside a few short lines. The color scheme also seemed tied to the characters' feelings. Each room had its own temperature.",
        ),
      ),
      heading(t("書き残しておきたいこと", "What I want to note down")),
      blockquote(
        t(
          "人は、誰かのために演じることで、自分に戻ってくるのかもしれない。",
          "Perhaps people come back to themselves by performing for someone else.",
        ),
      ),
      paragraph(
        t(
          "これは観た日には思いつかなかった。時間をおいて書いたから出てきた言葉だと思う。映画の最後に、女性たちへの献辞が出る。それを読んで、この映画が、母親だけでなく、演じる人たち全員の映画だったのだと分かった。",
          "I did not think of this on the day I watched it. I believe it came out because I waited before writing. At the end of the film a dedication to women appears. Reading it, I understood that the film was about everyone who performs, not only about mothers.",
        ),
      ),
      orderedList(
        t(
          "もう一度観るときは、最初の場面を長く見る",
          "When I watch it again, I will stay longer on the first scene",
        ),
        t("色の変わり目をメモする", "I will note where the colors change"),
        t(
          "誰が誰を待っているのかを数える",
          "I will count who is waiting for whom",
        ),
      ),
    ),
  ),
  article(
    6,
    10,
    "2026-10-11T16:20:00.000Z",
    "2026-10-13T20:00:00.000Z",
    t(
      "口笛だけで怖い ― 音の使い方の覚え書き",
      "Frightening by whistling alone: notes on the use of sound",
    ),
    doc(
      heading(t("音楽のない映画", "A film without a score")),
      paragraph(
        t(
          "劇中に流れる音楽は、街角のオルガンと、男の口笛だけだと知って、驚いた。観ているあいだは、音楽が流れていると思っていたからだ。それだけ、口笛の旋律が、場面の気分を作っていた。",
          "I was surprised to learn that the only music heard in the film is a street organ and the man's whistling. While watching, I had thought there was music playing. That shows how much the whistled tune shaped the mood of the scenes.",
        ),
      ),
      heading(t("口笛の曲", "The whistled tune")),
      paragraph(
        t(
          "男が口笛で吹く曲は、グリーグの曲だと、観終わってから調べて知った。曲名を知ってから観直すと、旋律が聞こえた時点で身構えるようになった。",
          "Only after watching did I look up and learn that the tune the man whistles is by Grieg. Watching again after knowing the title, I found myself bracing the moment the melody was heard.",
        ),
      ),
      paragraph(
        text(
          t(
            "姿が見えなくても、音で誰がそこにいるのか分かる。",
            "Even with nobody in sight, the sound tells us who is there.",
          ),
          "italic",
        ),
        t(
          "その使い方が、この映画でいちばん怖かった。",
          " That use of it was the most frightening thing in the film.",
        ),
      ),
      heading(t("盲目の物売り", "The blind balloon seller")),
      paragraph(
        t(
          "男を見つけるきっかけになるのも、音だ。風船を売っている盲目の男が、口笛を聞いて、前にも同じ旋律を聞いたことを思い出す。目が見えない人だけが、音で気づく。この設定は、観ていて、うまいと思った。",
          "Sound is also what leads to the man being found. A blind man selling balloons hears the whistling and remembers having heard the same tune before. Only a person who cannot see notices by sound. I thought this setup was well made.",
        ),
      ),
      heading(
        t(
          "警察と、街の裏側の人たち",
          "The police, and the people of the underworld",
        ),
      ),
      paragraph(
        t(
          "警察だけでなく、街の裏側の人たちも、男を探し始める。両方が同じ相手を追うので、物語が二つの方向から締まっていく。観ている側は、男に同情すべきなのか、そうでないのか、最後まで決められなかった。",
          "Not only the police but also the people of the city's underworld begin searching for the man. Because both pursue the same person, the story tightens from two directions. As a viewer I could not decide until the end whether or not I should feel sympathy for him.",
        ),
      ),
      heading(t("最後の場面", "The last scene")),
      paragraph(
        t(
          "男が集められた人々の前で話す場面は、長く、苦しい。自分でも止められないと話す声が、観ている私に、その人を許したくなる気持ちと、許してはいけないという気持ちを、同時に起こさせた。この場面については、まだ整理できていない。",
          "The scene in which the man speaks before the gathered people is long and painful. His voice, saying that he cannot stop himself, made me want both to forgive him and not to forgive him at once. I have not yet sorted out my feelings about this scene.",
        ),
      ),
      blockquote(
        t(
          "音は、見えない人物を、画面の中に連れてくる。",
          "Sound brings a person who cannot be seen into the frame.",
        ),
      ),
    ),
  ),
];
