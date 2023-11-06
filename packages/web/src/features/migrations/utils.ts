export const parseMigrationsKml = async (
  worker: Worker,
  files: FileList | null
) => {
  return new Promise((resolve) => {
    const id = Math.random();
    worker.postMessage({
      type: "parse",
      id,
      files,
    });
    worker.onmessage = (message) => {
      if (message.data.id === id) {
        resolve(message.data.result);
      }
    };
  });
};
