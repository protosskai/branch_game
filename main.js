class Branch {
  constructor(name, text, next) {
    // 该分支的名字，用于编写关卡
    this.name = name;
    // 该分支提示的文字，一般用于按钮显示
    this.text = text;
    // 分支后续分支的链表
    this.next = next;
  }
}

class Game {
  constructor() {
    // 分支链表头
    this.branch = null;
    // 分支链表当前层级
    this.currentBranch = null;
    // 分支选择的历史
    this.branchHistory = Array();
    // 所有分支构成的map
    this.allBranch = null;
  }

  init() {
    this.load("test.json", () => {
      this.branch = this.allBranch.get("start#0");
      this.currentBranch = this.allBranch.get("start#0");
      this.branchHistory.push(this.currentBranch);
      console.log(this);
    });
  }

  /**
   * 加载json文件并且构建分支对象列表
   * @param {*} filename
   */
  load(filename, then) {
    $.getJSON(filename, (data) => {
      this.buildBranch(data);
      then();
    });
  }

  /**
   * 构建分支对象列表
   * @param {*} data
   * @returns
   */
  buildBranch(data) {
    this.allBranch = new Map();
    for (let element of data) {
      let name = element.name;
      if (this.allBranch.get(name)) {
        console.error(`parse json to object error! ${name} is exists!`);
        return;
      }
      let text = element.text;
      let next = element.next;
      this.allBranch.set(name, new Branch(name, text, next));
    }
    let result = this.checkBranch();
    console.log(`check result is ${result}`);
    // console.log(this.allBranch);
  }
  /**
   * 检查构建出来的分支map是否合法
   */
  checkBranch() {
    if (!this.allBranch) return false;
    for (let [_, map_value] of this.allBranch) {
      if (!map_value.next) {
        return false;
      }
      for (let name of map_value.next) {
        if (!this.allBranch.get(name)) {
          return false;
        }
      }
    }
    return true;
  }
}

function onReady() {
  let game = new Game();
  game.init();
}

$(document).ready(onReady);
