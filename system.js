await jpackage(
  "system",
  () => {},
  class System {
    static out = {
      println(...args) {
        return console.log(...args);
      },
    };
  }
);
