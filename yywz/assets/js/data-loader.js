(() => {
  "use strict";

  const scriptUrl = document.currentScript?.src || location.href;
  const vocabularyUrl = new URL(
    "../data/vocabulary.json.gz",
    scriptUrl,
  ).toString();
  const articleLibraryUrl = new URL(
    "../data/article-library.json.gz",
    scriptUrl,
  ).toString();
  const speechLibraryUrl = new URL(
    "../data/speech-library.json.gz",
    scriptUrl,
  ).toString();
  const businessLibraryUrl = new URL(
    "../data/business-vocabulary.json.gz",
    scriptUrl,
  ).toString();

  async function loadGzipJson(url) {
    const response = await fetch(url, {
      cache: "force-cache",
    });
    if (!response.ok) {
      throw new Error(`Data request failed: ${response.status}`);
    }
    if (response.headers.get("content-encoding")?.includes("gzip")) {
      return response.json();
    }
    if (typeof DecompressionStream !== "function") {
      throw new Error("This browser cannot decompress the learning data.");
    }
    const decompressed = response.body.pipeThrough(
      new DecompressionStream("gzip"),
    );
    const text = await new Response(decompressed).text();
    return JSON.parse(text);
  }

  function expandSpeechLibrary(payload) {
    if (Array.isArray(payload)) return payload;
    const words = Array.isArray(payload?.words) ? payload.words : [];
    const frames = Array.isArray(payload?.frames) ? payload.frames : [];
    const targetCount = Number(payload?.targetCount) || 56800;
    const entries = [];
    let index = 1;
    for (let frameIndex = 0; frameIndex < frames.length; frameIndex += 1) {
      const frame = frames[frameIndex];
      for (const item of words) {
        entries.push({
          id: `speech-${String(index).padStart(6, "0")}`,
          word: item.word,
          meaning: item.meaning,
          english: frame.english.replaceAll("{word}", item.word),
          chinese: frame.chinese.replaceAll("{word}", item.word),
          category: frame.category,
          deck: item.deck || "高频英语",
          level: frameIndex < 10 ? "A2" : frameIndex < 25 ? "B1" : "B2",
          readingSeconds: 3 + ((index + frameIndex) % 5),
        });
        index += 1;
      }
    }
    return entries.slice(0, targetCount);
  }

  window.ENGLISH_BUDDY_VOCABULARY = [];
  window.ENGLISH_BUDDY_ARTICLE_LIBRARY = [];
  window.ENGLISH_BUDDY_SPEECH_LIBRARY = [];
  window.ENGLISH_BUDDY_BUSINESS_LIBRARY = [];
  window.ENGLISH_BUDDY_VOCABULARY_READY = loadGzipJson(vocabularyUrl)
    .then((entries) => {
      window.ENGLISH_BUDDY_VOCABULARY = entries;
      return entries;
    })
    .catch((error) => {
      window.ENGLISH_BUDDY_VOCABULARY_ERROR = error;
      throw error;
    });
  window.ENGLISH_BUDDY_ARTICLE_LIBRARY_READY = loadGzipJson(
    articleLibraryUrl,
  )
    .then((entries) => {
      window.ENGLISH_BUDDY_ARTICLE_LIBRARY = entries;
      return entries;
    })
    .catch((error) => {
      window.ENGLISH_BUDDY_ARTICLE_LIBRARY_ERROR = error;
      throw error;
    });
  window.ENGLISH_BUDDY_SPEECH_LIBRARY_READY = loadGzipJson(
    speechLibraryUrl,
  )
    .then((entries) => {
      const expanded = expandSpeechLibrary(entries);
      window.ENGLISH_BUDDY_SPEECH_LIBRARY = expanded;
      return expanded;
    })
    .catch((error) => {
      window.ENGLISH_BUDDY_SPEECH_LIBRARY_ERROR = error;
      throw error;
    });
  window.ENGLISH_BUDDY_BUSINESS_LIBRARY_READY = loadGzipJson(
    businessLibraryUrl,
  )
    .then((entries) => {
      window.ENGLISH_BUDDY_BUSINESS_LIBRARY = entries;
      return entries;
    })
    .catch((error) => {
      window.ENGLISH_BUDDY_BUSINESS_LIBRARY_ERROR = error;
      throw error;
    });
})();
