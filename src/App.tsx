import { useState, useEffect } from "react";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import { Window } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { open } from "@tauri-apps/plugin-dialog";
import { platform } from "@tauri-apps/plugin-os";
import "./App.css";
import { Link } from "react-router-dom";

function App() {
  const [currentOS, setCurrentOS] = useState<string>("");
  const [windowCount, setWindowCount] = useState<number>(1);

  const appWindow = new Window(`{tauri-${currentOS}}`);

  useEffect(() => {
    // OSの種類を取得
    const currentPlatform = platform();
    setCurrentOS(currentPlatform);
    // ウィンドウクローズ時の処理
    const unListen = appWindow.onCloseRequested(async (event) => {
      // macOSの場合は確認ダイアログを表示
      if (currentOS === "macos") {
        const confirmed = window.confirm("アプリケーションを終了しますか？");
        if (!confirmed) {
          event.preventDefault();
        }
      }
    });
    return () => {
      unListen.then((fn) => fn());
    };
  }, []);

  const createNewWindow = async () => {
    const webview = new WebviewWindow(`window-${windowCount}`, {
      url: "https://github.com/tauri-apps/tauri",
    });
    webview.once("tauri://created", function () {
      // webview successfully created
      console.log("webview successfully created");
    });
    webview.once("tauri://error", function (e) {
      // an error happened creating the webview
      console.log("an error happened creating the webview", e);
    });
    setWindowCount((prev) => prev + 1);
  };

  const showNativeDialog = async () => {
    try {
      const permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        const permission = await requestPermission();
        if (permission !== "granted") {
          return;
        }
      }

      await sendNotification({
        title: "Tauri アプリケーション",
        body: `この通知は ${currentOS} 向けにネイティブ表示されています`,
      });
    } catch (error) {
      console.error("通知エラー:", error);
    }
  };

  const showFileDialog = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: "テキスト",
            extensions: ["txt"],
          },
        ],
      });
      if (selected) {
        // OS固有のファイルダイアログの結果を表示
        alert(`選択されたファイル: ${selected}`);
      }
    } catch (error) {
      console.error("ファイル選択エラー:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Tauri クロスプラットフォームデモ</h1>
      <p className="mb-4">現在のOS: {currentOS}</p>

      <div className="flex gap-4">
        <button
          onClick={createNewWindow}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          新しいウィンドウを作成
        </button>

        <button
          onClick={showNativeDialog}
          className="bg-green-500 text-white px-4 py-2 rounded block"
        >
          ネイティブ通知を表示
        </button>

        <button
          onClick={showFileDialog}
          className="bg-purple-500 text-white px-4 py-2 rounded block"
        >
          ファイル選択ダイアログを表示
        </button>
      </div>
      <Link to="/about">About</Link>
    </div>
  );
}

export default App;
