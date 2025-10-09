"use client";
import styles from "../(exercise)/static/styles.module.css";
import React, { useState, useEffect } from "react";

export const DebugToggle = () => {
  const [debugOn, setDebugOn] = useState<boolean>(false);

  useEffect(() => {
    const updateDebug = () => {
      setDebugOn(window.location.hash === "#debug");
      document.body.setAttribute(
        "data-debug",
        window.location.hash === "#debug" ? "true" : "false",
      );
    };
    updateDebug();
    window.addEventListener("hashchange", updateDebug);
    return () => window.removeEventListener("hashchange", updateDebug);
  }, []);

  return (
    <label className="cursor-pointer absolute bottom-6 right-1/2 flex justify-self-end items-center text-xs font-medium">
      <input
        type="checkbox"
        checked={debugOn}
        onChange={() => {
          window.location.hash = debugOn ? "" : "debug";
        }}
        aria-checked={debugOn}
        aria-label="Toggle debug mode"
        className={`w-4 h-4 mr-2 rounded focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 focus:outline-none cursor-pointer ${styles["debug-checkbox"]}`}
      />
      Debug mode:{" "}
      <span className="inline-flex ml-1 w-2 text-left">
        {debugOn ? "On" : "Off"}
      </span>
    </label>
  );
};
