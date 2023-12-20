import { useEffect, useMemo, useState } from "react";
import { Workbox } from "workbox-window";
//! Start component
const PWAInitailizer = () => {
  //! Variables
  const isInstalled = localStorage.getItem("isInstalled") ===  "true";
  const isIOS = () => navigator.userAgent.match(/iPhone|iPad|iPod/i); // Check if the device is running iOS

  //! States
  const [modalVisibility, setModalVisibility] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [loadData, setLoadData] = useState("hidden");

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.active) {
          setLoadData("");
        }
      });
      const wb = new Workbox("/service-worker.js");
      wb.addEventListener("activated", (event) => {
        setLoadData("");
      });
      wb.register();
    }
  }, []);

  //! Check if the PWA is installed or using descktop
  useMemo(() => {
    // if (
    //   navigator.userAgent.match(
    //     /iPhone|iPad|iPod|Android|Windows Phone|BlackBerry|Symbian|WebOS|Ubuntu Touch|Tizen|Firefox OS/i
    //   ) ||
    //   window.matchMedia("(display-mode: standalone)").matches ||
    //   window.navigator.standalone ||
    //   isInstalled
    // ) {
    //     alert(1);
    //   setModalVisibility("hidden");
    // }
  }, []); 

  //! install the app
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  //! Handle the install button click
  const installPWA = async () => {
    try {
      if (!installPrompt) return;
      //! IOS installer
      if (isIOS()) {
        installPrompt.userChoice.then(
          (choiceResult) =>
            choiceResult.outcome === "accepted" &&
            localStorage.setItem("isInstalled", "true")
        );
      } else {
        //! Android installer
        const result = await installPrompt.prompt();
        if (result.outcome === "accepted") {
          localStorage.setItem("isInstalled", "true");
        }
      }
      alert(2)
      setInstallPrompt(null);
      setModalVisibility("hidden");
    } catch (error) {
      console.error("An error occurred while install PWA that is:", error);
    }
  };

  //! ←--- UI section ---→
  //! Title of install button
  const titleInstaller = () => {
    return (
      <div className="flex justify-start items-start space-x-3 w-[100%] my-3 border-b-[1px]  h-fit p-2">
        {/* <img
          src={downloadImage}
          className="w-8 text-left shadow-[0px_3px_3px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] border-[#8787875e] p-[8px] rounded-[6px]"
        /> */}
        <p className="text-[16px]">Install Abbott</p>
      </div>
    );
  };

  //! Android installer
  const androidInstaller = () => {
    return (
      <span className="text-blue-500 flex justify-end gap-10 w-[100%]">
        <button
          className="focus:outline-none p-0 m-0 w-fit"
          onClick={() => {alert(3); setModalVisibility("hidden");}}
        >
          Cancel
        </button>
        <button
          className="focus:outline-none w-fit p-0 m-0"
          onClick={() => installPWA()}
        >
          install
        </button>
      </span>
    );
  };

  //! IOS installer
  const iosInstaller = () => {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 text-[16px]">
          <p>1. Tap on</p>
          {/* <img className="h-7  p-1 bg-white" src={downloadImage2} /> */}
        </div>
        <div className="text-[16px]">
          2. Select{" "}
          <span className=" text-[16px] font-bold bg-white">
            Add to home Screen
          </span>
        </div>
      </div>
    );
  };

  //! install button
  const installButton = () => {
    return (
      <div className="flex flex-col justify-start">
        <p className="text-[15px]">
          Install the app on your device to easily access it anytime. No app
          store. No download. No hassle.
        </p>
        <div
          className="flex justify-start text-black space-x-2 mt-3 w-full"
          id="install"
        >
          {isIOS() ? iosInstaller() : androidInstaller()}
        </div>
      </div>
    );
  };

  //! Close button for IOS devices
  const closeButton = () => {
    return (
      <button
        className="p-0 w-16 h-16 text-[30px] font-extralight text-[#878787]  border-[0px] border-solid border-[#878787] rounded-[50%] shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] absolute bottom-2 right-2"
        onClick={() => {alert(4);setModalVisibility("hidden");}}
        id="install"
      >
        ×
      </button>
    );
  };

  //! Main ui
  if (!modalVisibility) {
    return (
      <div
        className={`w-full flex justify-center items-center absolute bottom-[50px] h-fit ${
          modalVisibility ? "hidden" : ""
        } ${loadData} `}
      >
        <div
          className={`rounded-[25px] fixed flex-col bottom-0 z-50 flex justify-between m-2 items-start px-4 max-w-[460px] text-lg bg-[#f5f5f5] text-#878787 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] border-[#878787]`}
        >
          {titleInstaller()}
          <div className="flex items-center justify-center w-full px-2 gap-10 mb-10 mt-5">
            {installButton()}
            {isIOS() ? closeButton() : ""}
          </div>
        </div>
      </div>
    );
  }
};

export default PWAInitailizer;
