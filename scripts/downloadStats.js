const { Octokit, App } = require("octokit");
const { readFileSync, writeFileSync, closeSync } = require("fs");
const { resolve } = require("path");
const ENV = JSON.parse(readFileSync(resolve(__dirname, "ENV.json"), "utf-8"));

const octokit = new Octokit({ auth: ENV.GITHUB_TOKEN });

function writeProgressBar(curr, max) {
  const length = 50;
  const percentage = Math.floor((curr / max) * length);
  const bar = `${curr} of ${max} [${"=".repeat(Math.max(percentage - 1, 0))}${
    percentage === 0 ? "-" : percentage === length ? "=" : ">"
  }${"-".repeat(length - percentage)}] ${((curr / max) * 100).toFixed(2)}%`;

  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(bar);
}

async function fetchCommitRevisions() {
  const max = Number(process.argv[2]);
  if (!max) {
    console.log("Usage: npm run download-stats [number of commits]");
    process.exit(1);
  }

  const revisions = [];
  let num = max;
  let fetched = 0;
  let page = 1;

  console.log(`Downloading commits from ${ENV.STATS_GIST}\n`);
  const timer = Date.now();

  while (num > 0) {
    const perPage = Math.min(num, 100);
    num -= perPage;

    writeProgressBar(fetched, max);

    const res = await octokit
      .request("GET /gists/{gist_id}/commits", {
        gist_id: ENV.STATS_GIST,
        per_page: perPage,
        page,
      })
      .catch((err) => {
        console.log(err.name + ": " + err.message);
        process.exit(1);
      });
    const commits = res.data.map((c) => c.version);

    revisions.push(...commits);
    fetched += commits.length;
    page++;

    if (commits.length < perPage) {
      break;
    }
  }

  writeProgressBar(fetched, max);

  if (num > 0) {
    console.log(`\nThere were only ${fetched} commits on the gist.`);
  }

  console.log(`\n\nFinshed downloading commits in ${((Date.now() - timer) / 1000).toFixed(2)}s \n`);

  return revisions;
}

async function fetchData(revisions) {
  const data = [];
  const max = 500;
  let curr = 0;
  let rateLimit = false;

  console.log(`Downloading stats from ${ENV.STATS_GIST}\n`);
  const timer = Date.now();

  writeProgressBar(curr, revisions.length);

  while (curr < revisions.length) {
    await Promise.all(
      (() => {
        const requests = [];
        for (let i = curr; i < Math.min(curr + max, revisions.length); i++) {
          requests.push(
            octokit
              .request("GET /gists/{gist_id}/{sha}", {
                gist_id: ENV.STATS_GIST,
                sha: revisions[i],
              })
              .then((res) => {
                data.push(res.data.files["scuffed-uno-stats.json"].content);
                curr++;
                writeProgressBar(curr, revisions.length);
              })
              .catch((err) => {
                if (err.message.includes("rate limit")) {
                  if (!rateLimit) {
                    console.log(
                      "\n\nGithub API rate limit hit. Waiting for 90 seconds before sending more requests.\n"
                    );
                    rateLimit = true;
                  }
                  return;
                }

                console.log(
                  `\n\nError: An error occured while downloading ${ENV.STATS_GIST}/${revisions[i]}`
                );
                console.log(err);
                process.exit(1);
              })
          );
        }

        return requests;
      })()
    );

    // wait for 30 seconds when github api rate limit is hit
    if (rateLimit) {
      const start = Date.now();

      console.log("\n");
      const waitInterval = setInterval(() => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`Waiting for ${Math.floor((Date.now() - start) / 1000)}s`);
      }, 1000);

      await new Promise((resolve) => {
        setTimeout(() => resolve(true), 1000 * 30);

        let finishedCheck = setInterval(() => {
          if (curr === revisions.length) {
            clearInterval(finishedCheck);
            resolve(true);
          }
        }, 1000);
      });

      rateLimit = false;
      clearInterval(waitInterval);
    }
  }

  console.log(`\n\nFinshed downloading stats in ${((Date.now() - timer) / 1000).toFixed(2)}s \n`);

  return data;
}

(async () => {
  const revisions = await fetchCommitRevisions();
  const data = await fetchData(revisions);

  const outputFile = "out/stats.json";
  writeFileSync(resolve(__dirname, outputFile), JSON.stringify(data));
})();
