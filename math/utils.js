await jpackage(
  "math.utils",
  () => {},
  class Utils {
    static max(...nums) {
      return Math.max(...nums);
    }
  }
);
