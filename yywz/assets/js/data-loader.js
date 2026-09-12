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

  window.ENGLISH_BUDDY_VOCABULARY = [];
  window.ENGLISH_BUDDY_ARTICLE_LIBRARY = [];
  window.ENGLISH_BUDDY_SPEECH_LIBRARY = [];
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
      window.ENGLISH_BUDDY_SPEECH_LIBRARY = entries;
      return entries;
    })
    .catch((error) => {
      window.ENGLISH_BUDDY_SPEECH_LIBRARY_ERROR = error;
      throw error;
    });
})();
