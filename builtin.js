(() => {
  const _package = new Map();
  const makePackage = (name) => {
    const nameSplit = name.split(".");
    const classSet = _package.get(name) ?? new Set();
    _package.set(name, classSet);
    return {
      setClass(classDefine) {
        classSet.add([classDefine.name, classDefine]);
      },
      get parentPackage() {
        return _package.get(nameSplit.slice(0, nameSplit.length - 1).join("."));
      },
    };
  };

  const _context = {
    mainClassName: "Main",
    mainPackage: ".",
  };

  const runMain = async (package) => {
    if (package === _context.mainPackage) {
      const findFrom = [..._package.get(package)];
      const [, classDefine] = findFrom.find(
        ([_name]) => _name === _context.mainClassName
      );
      await classDefine?.main?.();
    }
  };

  globalThis.setMainClass = function (name) {
    _context.mainClassName = name;
  };

  globalThis.setMainPackage = function (name) {
    _context.mainPackage = name;
  };

  globalThis.jpackage = async function (name, imports, classDefine) {
    if (!name || name === "") {
      name = ".";
    }
    await imports();
    makePackage(name).setClass(classDefine);
    await runMain(name);
  };

  globalThis.jimport = async function (_path) {
    const path = _path.replace(/\./g, "/");
    const url = `./${path}.js`;
    await import(url);
    const p = _package.get(_path);
    for (const [n, c] of p) {
      let obj = globalThis;
      let lastP = "";
      let pobj = null;
      for (const p of _path.split(".")) {
        pobj = obj;
        obj = obj[p] = {};
        lastP = p;
        // console.log(pobj, obj, n, p);
      }
      if (pobj && lastP.toLowerCase() === n.toLowerCase()) {
        pobj[n] = c;
      }
      obj[n] = c;
      globalThis[n] = c;
    }
  };
})();
