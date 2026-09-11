(() => {
  "use strict";

  const scriptUrl = document.currentScript?.src || location.href;
  const vocabularyUrl = new URL(
    "../data/vocabulary.json.gz",
    scriptUrl,
  ).toString();

  window.ENGLISH_BUDDY_VOCABULARY = [];
  window.ENGLISH_BUDDY_VOCABULARY_READY = (async () => {
    const response = await fetch(vocabularyUrl, {
      cache: "force-cache",
    });
    if (!response.ok) {
      throw new Error(`Vocabulary request failed: ${response.status}`);
    }

    if (response.headers.get("content-encoding")?.includes("gzip")) {
      return response.json();
    }
    if (typeof DecompressionStream !== "function") {
      throw new Error("This browser cannot decompress the vocabulary data.");
    }
    const decompressed = response.body.pipeThrough(
      new DecompressionStream("gzip"),
    );
    const text = await new Response(decompressed).text();
    return JSON.parse(text);
  })()
    .then((entries) => {
      window.ENGLISH_BUDDY_VOCABULARY = entries;
      return entries;
    })
    .catch((error) => {
      window.ENGLISH_BUDDY_VOCABULARY_ERROR = error;
      throw error;
    });
})();
