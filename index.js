setMainPackage("com.mowtwo");

await jpackage(
  "com.mowtwo",
  async () => {
    await jimport("system");
    await jimport("math.utils");
  },
  class Main {
    static async main() {
      System.out.println(Utils.max(1, 2, 3));
    }
  }
);
