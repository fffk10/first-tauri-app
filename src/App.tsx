import { useState, useEffect } from "react";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import { Window } from "@tauri-apps/api/window";
import { Webview } from "@tauri-apps/api/webview";
import { open } from "@tauri-apps/plugin-dialog";
import { platform } from "@tauri-apps/plugin-os";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [currentOS, setCurrentOS] = useState<string>("");
  const [windowCount, setWindowCount] = useState<number>(1);

  const appWindow = new Window(`{tauri-${currentOS}}`);

  useEffect(() => {
    // OSの種類を取得
    const currentPlatform = platform();
    setCurrentOS(currentPlatform);
    // ウィンドウクローズ時の処理
    const unlisten = appWindow.onCloseRequested(async (event) => {
      // macOSの場合は確認ダイアログを表示
      if ((await platform()) === "macos") {
        const confirmed = window.confirm("アプリケーションを終了しますか？");
        if (!confirmed) {
          event.preventDefault();
        }
      }
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  // const createNewWindow = async () => {
  //   const newWindow = new Webview(`window-${windowCount}`, {
  //     url: "/",
  //     title: `Window ${windowCount}`,
  //     width: 800,
  //     height: 600,
  //   });
  //   setWindowCount((prev) => prev + 1);

  // Windowsの場合、最後のウィンドウが閉じられたら自動的にアプリを終了
  // if (currentOS === "win32") {
  //   newWindow.onCloseRequested(() => {
  //     const windows = WebviewWindow.getAll();
  //     if (windows.length <= 1) {
  //       invoke("quit_app");
  //     }
  //   });
  // }
  // };

  // const showNativeDialog = async () => {
  //   try {
  //     const permissionGranted = await isPermissionGranted();
  //     if (!permissionGranted) {
  //       const permission = await requestPermission();
  //       if (permission !== "granted") {
  //         return;
  //       }
  //     }

  //     await sendNotification({
  //       title: "OS固有の通知",
  //       body: `この通知は ${currentOS} 向けにネイティブ表示されています`,
  //     });
  //   } catch (error) {
  //     console.error("通知エラー:", error);
  //   }
  // };

  // const showFileDialog = async () => {
  //   try {
  //     const selected = await open({
  //       multiple: false,
  //       filters: [
  //         {
  //           name: "テキスト",
  //           extensions: ["txt"],
  //         },
  //       ],
  //     });
  //     if (selected) {
  //       // OS固有のファイルダイアログの結果を表示
  //       alert(`選択されたファイル: ${selected}`);
  //     }
  //   } catch (error) {
  //     console.error("ファイル選択エラー:", error);
  //   }
  // };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Tauri クロスプラットフォームデモ</h1>
      <p className="mb-4">現在のOS: {currentOS}</p>

      <div className="space-y-4">
        <button
          // onClick={createNewWindow}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          新しいウィンドウを作成
        </button>

        <button
          // onClick={showNativeDialog}
          className="bg-green-500 text-white px-4 py-2 rounded block"
        >
          ネイティブ通知を表示
        </button>

        <button
          // onClick={showFileDialog}
          className="bg-purple-500 text-white px-4 py-2 rounded block"
        >
          ファイル選択ダイアログを表示
        </button>
      </div>
    </div>
  );
}

export default App;
