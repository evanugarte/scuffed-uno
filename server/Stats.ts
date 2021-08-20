import { Octokit } from "octokit";

type STAT =
  | "lobbiesOnline"
  | "playersOnline"
  | "totalVisits"
  | "lobbiesCreated"
  | "gamesPlayed"
  | "botsUsed"
  | "unosCalled"
  | "cardsPlayed"
  | "plus4sDealt"
  | "pickedColors";

const STATS: { [index: string]: any } = {
  lobbiesOnline: 0,
  playersOnline: 0,
  totalVisits: 0,
  lobbiesCreated: 0,
  gamesPlayed: 0,
  botsUsed: 0,
  unosCalled: 0,
  cardsPlayed: 0,
  plus4sDealt: 0,
  pickedColors: {
    red: 0,
    blue: 0,
    green: 0,
    yellow: 0,
  },
};

const incrementStat = (stat: STAT, inc: number): boolean => {
  if (!STATS[stat] || STATS[stat] + inc < 0 || STATS[stat] + inc >= Number.POSITIVE_INFINITY) return false;

  STATS[stat] += inc;
  return true;
};

const decrementStat = (stat: STAT, dec: number): boolean => {
  if (!STATS[stat] || STATS[stat] - dec < 0 || STATS[stat] - dec >= Number.POSITIVE_INFINITY) return false;

  STATS[stat] -= dec;
  return true;
};

const incrementPickedColors = (color: "red" | "blue" | "green" | "yellow", inc: number): boolean => {
  if (
    !STATS.pickedColors[color] ||
    STATS.pickedColors[color] + inc < 0 ||
    STATS.pickedColors[color] + inc >= Number.POSITIVE_INFINITY
  )
    return false;

  STATS.pickedColors[color] += inc;
  return true;
};

const decrementPickedColors = (color: "red" | "blue" | "green" | "yellow", dec: number): boolean => {
  if (
    !STATS.pickedColors[color] ||
    STATS.pickedColors[color] - dec < 0 ||
    STATS.pickedColors[color] - dec >= Number.POSITIVE_INFINITY
  )
    return false;

  STATS.pickedColors[color] -= dec;
  return true;
};

// update stats github gist
const octokit = new Octokit({ auth: "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" });

setInterval(async () => {
  const json = JSON.stringify(STATS);

  try {
    await octokit.request("PATCH /gists/{gist_id}", {
      gist_id: "3fbffb9c94575acd9aac4d1c58b8b8d0",
      files: {
        "scuffed-uno-stats.json": {
          content: json,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
}, 300000);

export { incrementStat, decrementStat, incrementPickedColors, decrementPickedColors };
