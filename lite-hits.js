(function () {
  const SCRIPT = document.currentScript;
  const SHOULD_LOG = SCRIPT.getAttribute("litehits-shouldLog") !== "false";
  const BASE_PATH = SCRIPT.getAttribute("litehits-basePath");
  const TO_COUNT = getJSONAtrribute("litehits-count");
  const VALUE_DICT = SCRIPT.getAttribute("litehits-globalAs");

  function getJSONAtrribute(attribute){
    try { return JSON.parse(SCRIPT.getAttribute(attribute) || "{}"); }
    catch (e) { warnInConsole(`Invalid JSON in ${attribute}:`, e); return {}; }
  }
  function hit(key){
    const url = `https://hits.sh/${BASE_PATH}/${key}`
    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.src = `${url}.svg`;
    img.alt = `svg for ${key}`;
    return {img, url, key}
  };
  function warnInConsole(...args){
    if (SHOULD_LOG) console.warn("[lite-hits]", ...args);
  };

  if (!BASE_PATH) {
    warnInConsole("base path is not mentioned");
    return;
  };
  
  let pageloadCount, sessionCount, localCount, engagementCount;
  if (TO_COUNT.pageloadKey && !window[TO_COUNT.pageloadKey]) {
    pageloadCount = hit(TO_COUNT.pageloadKey);
    window[TO_COUNT.pageloadKey] = true;
  }

  const engagement_duration = Number(TO_COUNT.engagementDuration)
  if (engagement_duration){
    setTimeout(() => {
      engagementCount = hit("litehits-engagement");
      if (VALUE_DICT) (window[VALUE_DICT]??={}).engagementCount = engagementCount;
    }, engagement_duration);
  }

  function storageHandler(storage, key, message){
    if (!key) return;
    try {
      count = JSON.parse(storage.getItem(key))
      if (!count){
        count = hit(key);
        storage.setItem(key, JSON.stringify(count));
      }
      return count;
    } catch (e) {
      warnInConsole(message,'\nHere is the error message:', e)
    }
  }
  sessionCount = storageHandler(sessionStorage, TO_COUNT.sessionKey, "seems like user denied session storage permission,\nmay be they don't want their session to be counted! so it's not counted")
  localCount = storageHandler(localStorage, TO_COUNT.localKey, "seems like user denied local storage permission, \nmay be they don't want them to be counted! so it's not counted!")

  if (VALUE_DICT) window[VALUE_DICT] = {
      ...(pageloadCount && { pageloadCount }),
      ...(sessionCount && { sessionCount }),
      ...(localCount && { localCount }),
    };
})();
