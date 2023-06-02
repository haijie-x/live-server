export const jsReg = /\.[tj]sx?$/;

export const postfixRE = /[?#].*$/s;

export const INJECT_HTML = `
    <!-- INJECT BY LIVE SERVER -->
    <script>
      if ("WebSocket" in window) {
        (function () {
          function warnFailedFetch(err, path) {
            if (!err.message.match("fetch")) {
              console.error(err);
            }
            console.error(
                "[hmr] Failed to reload" + path + "." +  
                "This could be due to syntax errors or importing non-existent" + 
                "modules. (see errors above)"
            );
          }

          const ws = new WebSocket("ws://127.0.0.1:24678");
          const fetchModule = async (path) => {
            try {
              const fetchedModule = await import(path);
            } catch (e) {
              warnFailedFetch(e, path);
            }
          };
          const handleMessage = function (e) {
            let path;
            try {
              let data = JSON.parse(e.data);
              path = data.path;
            } catch {
              console.error(e.data + "解析失败");
            }
            if (path.endsWith(".html")) window.location.reload();
            else fetchModule(path);
          };

          ws.onopen = () => {
            ws.onmessage = handleMessage;
          };
        })();
      } else {
        console.warn("浏览器版本过低，热更新功能失效");
      }
    </script>
`;
