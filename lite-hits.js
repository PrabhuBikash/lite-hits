(function () {
  const SCRIPT = document.currentScript;
  const SHOULD_LOG = SCRIPT.getAttribute("litehits-shouldLog") !== "false";
  const VALUE_DICT = SCRIPT.getAttribute("litehits-globalAs");
  let TO_COUNT = {};
  try {
    TO_COUNT = JSON.parse(SCRIPT.getAttribute("litehits-count") || "{}");
  } catch (e) {
    console.warn("Invalid JSON in litehits-count:", e);
  }

  const BASE_PATH = window.location.hostname + window.location.pathname;

  const hit = (key) => {
    const url = `https://hits.sh/${BASE_PATH}/${key}`
    const img = new Image();
    img.src = `${url}.svg`;
    return {img, url, key}
  };
  const logToConsole = (...args) => {
    if (SHOULD_LOG) console.log("[lite-hits]", ...args);
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
