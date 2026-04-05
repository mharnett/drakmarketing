export interface FunProject {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  /** Optional path to a live app for this project (under /public) */
  appUrl?: string;
  /** Optional GitHub repo URL */
  repoUrl?: string;
  /** Full markdown-like content (parsed by the [slug] page) */
  content: string;
}

export const funProjects: FunProject[] = [
  {
    slug: "spark-grill",
    title: "Bletchley Park Would Have Been Proud",
    date: "2026-04-04",
    excerpt:
      "My Spark Grill's app vanished when the company went bankrupt. 2 hours with Claude Code later, I had reverse-engineered the entire BLE protocol and built an open-source replacement that runs from any phone browser.",
    appUrl: "/fun-projects/spark-grill/app.html",
    repoUrl: "https://github.com/mharnett/spark-grill",
    content: `My Spark Grill's app vanished from the Play Store when the company went bankrupt. $1,500 smart grill. Still works. Bluetooth still broadcasting. App? Gone forever.

So I asked Claude Code to reverse-engineer it.

## 10 minutes

Found the grill broadcasting over BLE, dumped its entire protocol. Every characteristic labeled by the firmware engineers — "Kettle Temperature," "Stoke Fan Speed," "Setpoint." The values were IEEE-754 32-bit floats streaming over GATT notifications.

## 30 minutes

Live dashboard streaming real-time temperatures from the grill to my browser over WebSocket. Python backend with bleak for BLE, FastAPI for the server, vanilla JavaScript for the UI.

## 60 minutes

Cracked the serial protocol. Sniffed the physical dial, caught the grill's proprietary framing — DA...DB delimiters, one's complement checksums, SLIP-style byte escaping. Classic codebreaking: known plaintext, frequency analysis, hypothesis testing against the checksum algorithm.

## 2 hours

Full replacement app. Open-source. Runs from any phone browser via Web Bluetooth. No app store. No server. No company required.

## The punchline

Every "smart" device you own is one bankruptcy away from becoming a brick. But the protocol it speaks is right there in the air, waiting to be read.

The Enigma machine took years. This took a Friday afternoon.

**Try it yourself:** if you own a Spark Grill, open the app above on your Android phone in Chrome, tap "Connect via Bluetooth," and select your grill from the list. The full BLE protocol documentation and source code are in the [GitHub repo](https://github.com/mharnett/spark-grill).`,
  },
];

export function formatFunProjectDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
