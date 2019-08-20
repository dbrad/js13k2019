/// <reference path="./button.ts" />
/// <reference path="./consts.ts" />
/// <reference path="./scene.ts" />

let buttonTester: string = "";

const button: Button = new Button(
  "start game",
  SCREEN_WIDTH / 2 - 100,
  SCREEN_HEIGHT / 2 - 20,
  200,
  40,
  () => {
    if (buttonTester === "" || buttonTester === "Nothing to see here.") {
      buttonTester = "Stop it.";
    }
    else if (buttonTester === "Stop it.") {
      buttonTester = "The button works, okay?";
    }
    else {
      buttonTester = "Nothing to see here.";
    }
  },
  0xFF444444,
  0xff666666,
  0xff222222);
button.size = { x: 200, y: 40 };

const mainMenu: Scene =
  new Scene(
    "MainMenu",
    () => { },
    () => { },
    (delta: number) => { },
    (delta: number) => { 
      drawText("js13k 2019", 5, 5, Align.LEFT, 3);
      drawText("theme: back", 5, 25, Align.LEFT, 2);
      drawText(`(c) 2019 david brad ${buttonTester !== "" ? " - " : ""} ${buttonTester}`, 5, 440, Align.LEFT, 1);
    }
  );

mainMenu.rootNode.addChild(button);
