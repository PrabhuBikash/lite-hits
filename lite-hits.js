(function () {
  const SCRIPT = document.currentScript;
  const SHOULD_LOG = SCRIPT.getAttribute("litehits-shouldLog") !== "false";
  const logToConsole = (...args) => {
    if (SHOULD_LOG) console.log("[lite-hits]", ...args);
  };

  const BASE_PATH = SCRIPT.getAttribute("litehits-basePath");
  if (!BASE_PATH) {
    logToConsole("base path is not mentioned")
    return;
  };

  let TO_COUNT = {};
  try {
    TO_COUNT = JSON.parse(SCRIPT.getAttribute("litehits-count") || "{}");
  } catch (e) {
    console.warn("Invalid JSON in litehits-count:", e);
  }

  let IMG_PROPERTIES = {};
  try {
    IMG_PROPERTIES = JSON.parse(SCRIPT.getAttribute("litehits-imgProperties") || "{}");
  } catch (e) {
    console.warn("Invalid JSON in litehits-imgProperties:", e);
  }
  const VALUE_DICT = SCRIPT.getAttribute("litehits-globalAs");

  const hit = (key) => {
    const url = `https://hits.sh/${BASE_PATH}/${key}`
    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    const { style, ...rest } = IMG_PROPERTIES;
    Object.assign(img, rest);
    if (style && typeof style === 'object') Object.assign(img.style, style);
    img.src = `${url}.svg`;
    img.alt = `svg for ${key}`
    return {img, url, key}
  };
  
  let pageloadCount, sessionCount, localCount, engagementCount;
  if (TO_COUNT.pageloadCount === "true") pageloadCount = hit("litehits-page");

  if (TO_COUNT.sessionKey){
    try {
      sessionCount = JSON.parse(sessionStorage.getItem(TO_COUNT.sessionKey));
      if (!sessionCount) {
        sessionCount = hit(TO_COUNT.sessionKey);
        sessionStorage.setItem(TO_COUNT.sessionKey, JSON.stringify(sessionCount));
      }
    } catch (e) {
    logToConsole(
`seems like user denied session storage permission,
may be they don't want their session to be counted! so it's not counted!
or may be the issue is something else, here is the error message:
`, e
    )
    }
  }

  if (TO_COUNT.localKey){
    try {
      localCount = JSON.parse(localStorage.getItem(TO_COUNT.localKey));
      if (!localCount) {
        localCount = hit(TO_COUNT.localKey);
        localStorage.setItem(TO_COUNT.localKey, JSON.stringify(localCount));
      }
    } catch (e) {
      logToConsole(
`seems like user denied local storage permission,
may be they don't want them to be counted! so it's not counted!
or may be the issue is something else, here is the error message:
`, e)
    }
  }

  const engagement_duration = Number(TO_COUNT.engagementDuration)
  if (engagement_duration){
    setTimeout(() => {
      engagementCount = hit("litehits-engagement");
      if (VALUE_DICT) (window[VALUE_DICT]??={}).engagementCount = engagementCount;
    }, engagement_duration);
  }

  if (VALUE_DICT) window[VALUE_DICT] = {
      ...(pageloadCount && { pageloadCount }),
      ...(sessionCount && { sessionCount }),
      ...(localCount && { localCount }),
    };
})();
