const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("path");
const { keyboard, Key } = require("@nut-tree/nut-js");
const db = require("electron-db");
const savePath = path.join("./database", "");
const execSync = require("child_process").execSync;
const parseGitDiff = require("parse-git-diff").default;
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    title: "マイアプリ",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });
  mainWindow.webContents.openDevTools({ mode: "detach" });

  mainWindow.loadFile("index.html");
  ipcMain.on("set-A", (event, text) => {
    let where = {
      type: "a",
    };

    let set = {
      text: text,
    };
    db.updateRow("DB", savePath, where, set, (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    });
  });
  ipcMain.on("set-B", (event, text) => {
    let where = {
      type: "b",
    };

    let set = {
      text: text,
    };

    db.updateRow("DB", savePath, where, set, (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    });
  });
  ipcMain.on("set-L", (event, text) => {
    let where = {
      type: "c",
    };

    let set = {
      text: text,
    };
    db.updateRow("DB", savePath, where, set, (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    });
  });
};
let perA = true;
let perB = true;
let perC = true;

app.whenReady().then(async () => {
  globalShortcut.register("CommandOrControl+A", () => {
    if (perA) {
      (async () => {
        perA = false;
        /**
         *  data->/database/DB.jsonのdata
         */
        db.getAll("DB", savePath, async (success, data) => {
          if (success) {
            const dbDataA = data[0].text;
            const reDataA = dbDataA
              .replace(/\n/g, "\r\n")
              .replace(/\s+\s+/g, "んんんんんんんんんんんん")
              .replace(/んんんんんんんんんんんん/g, "\r\n");
            keyboard.config.autoDelayMs = 150;
            await keyboard.type(reDataA);
            await keyboard.type(Key.LeftAlt, Key.LeftShift, Key.F); // フォーマット
          } else {
            console.log("getAll failed");
          }
        });
        setTimeout(function () {
          perA = true;
        }, 5000);
      })();
    }
  });
  globalShortcut.register("CommandOrControl+B", () => {
    if (perB) {
      (async () => {
        perB = false;
        /**
         *  data->/database/DB.jsonのdata
         */
        db.getAll("DB", savePath, async (success, data) => {
          if (success) {
            const dbDataB = data[1].text;
            const reDataB = dbDataB
              .replace(/\n/g, "\r\n")
              .replace(/\s+\s+/g, "んんんんんんんんんんんん")
              .replace(/んんんんんんんんんんんん/g, "\r\n");
            keyboard.config.autoDelayMs = 150;
            await keyboard.type(reDataB);
            await keyboard.type(Key.LeftAlt, Key.LeftShift, Key.F); // フォーマット
          } else {
            console.log("getAll failed");
          }
        });
        setTimeout(function () {
          perB = true;
        }, 5000);
      })();
    }
  });

  globalShortcut.register("CommandOrControl+T", async () => {
    (async () => {
      if (!commitID) return;
      keyboard.config.autoDelayMs = 150;
      await keyboard.type(Key.LeftCmd, Key.Up);
      await deletedFun();
      await addedFun();
    })();
  });
  globalShortcut.register("CommandOrControl+L", () => {
    if (perC) {
      (async () => {
        perC = false;
        db.getAll("DB", savePath, async (success, data) => {
          if (success) {
            let dbDataL = data[2].text;
            const reDataL = dbDataL
              .replace(/\n/g, "\r\n")
              .replace(/\s+\s+/g, "んんんんんんんんんんんん")
              .replace(/んんんんんんんんんんんん/g, "\r\n");
            keyboard.config.autoDelayMs = 150;
            await keyboard.type(reDataL);
            await keyboard.type(Key.LeftAlt, Key.LeftShift, Key.F); // フォーマット
          } else {
            console.log("getAll failed");
          }
        });
        setTimeout(function () {
          perC = true;
        }, 5000);
      })();
    }
  });
  globalShortcut.register("Escape", () => {
    // ESCを押すとアプリ終了
    (async () => {
      app.quit();
    })();
  });
  const cmd = "git diff HEAD^"; //　git commit
  const gitdiff = execSync(cmd).toString();
  const commitID = gitdiff;
  if (!commitID) {
    return;
  }
  const result = parseGitDiff(commitID);
  const add = []; //追加記述の配列
  const del = []; //削除記述の配列
  const chunksArray = result.files[0].chunks;
  chunksArray.map((item) => {
    /**
     * par
     *{ @param type {"AddedLine",'UnchangedLine','DeletedLine'} {"追加行","変化なし行,"削除行"}
     * @param lineBefore Number
     * @param lineAfter Number
     * @param content String 追加するコード}
     */
    item.changes.map(async (par) => {
      const type = par.type;
      switch (type) {
        case "UnchangedLine":
          break;
        case "AddedLine":
          add.push(par);
          break;
        case "DeletedLine":
          del.push(par);
        default:
      }
    });
  });
  /**
   * 行を削除する関数
   */
  const deletedFun = async () => {
    let deleteLine = []; // 削除する行
    let y = 0;
    del.map((item, i) => {
      if (i == 0) {
        y = item.lineBefore;
        deleteLine.push(y);
      } else {
        const t = item.lineBefore - y;
        deleteLine.push(t);
        y = item.lineBefore;
      }
    });
    for (let item of deleteLine) {
      for (let i = 0; i < item; i++) {
        if (i == item - 1) {
          await keyboard.type(Key.LeftCmd, Key.LeftShift, Key.K); // 行削除ショートカットキー
          break;
        } else {
          await keyboard.pressKey(Key.Down);
        }
      }
    }
    await keyboard.type(Key.LeftCmd, Key.Up); // (1,1)の位置へ
  };

  /**
   * 追加タイピングの関数
   */
  const addedFun = async () => {
    add.map((item) => {
      item.lineAfter = item.lineAfter - 1; // 1行目からスタートなので、lineAfter(表示行)よりも-1
    });
    for (let item of add) {
      for (let i = 0; i < item.lineAfter; i++) {
        if (i == item.lineAfter - 1) {
          // 追加行
          keyboard.config.autoDelayMs = 100;
          await keyboard.pressKey(Key.Down);
          await keyboard.type(item.content);
          await keyboard.type(Key.Enter);
          await keyboard.type(Key.LeftCmd, Key.Up); // (1,1)の位置へ
        } else {
          keyboard.config.autoDelayMs = 1;
          await keyboard.pressKey(Key.Down);
        }
      }
    }
    await keyboard.type(Key.LeftAlt, Key.LeftShift, Key.F); // フォーマット
  };
});
app.once("ready", () => {
  createWindow();
});

app.once("window-all-closed", () => app.quit());
