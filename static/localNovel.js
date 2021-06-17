(function () {
  // webview收插件消息
  window.addEventListener('message', (event) => {
    console.log('message', event);
    const message = event.data; // The JSON data our extension sent
    switch (message.command) {
      case 'goProgress':
        console.log('message', message.progress);
        window.scrollTo(0, document.body.scrollHeight * message.progress);
        break;
    }
  });

  // webview滚动条报告给插件
  const vscode = acquireVsCodeApi();
  setInterval(() => {
    console.log(window.scrollY, document.body.scrollHeight);
    vscode.postMessage({
      command: 'updateProgress',
      progress: window.scrollY / document.body.scrollHeight,
    });
  }, 1000);
})();
