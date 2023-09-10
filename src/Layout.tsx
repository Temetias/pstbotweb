import React, { PropsWithChildren } from "react";
import { useStore, useStoreDispatch } from "./Store";
import logo from "./logos/PST_Wicked.png";
import { ToggleButton } from "./Toggles";
import "./Layout.css";
import { Link } from "react-router-dom";
import { PROVIDERS } from "./constants";

export const Layout = ({ children }: PropsWithChildren) => {
  const dispatch = useStoreDispatch();
  const store = useStore();
  return (
    <div className="Layout">
      <header className="Layout-header">
        <img src={logo} className="Layout-logo" alt="logo" />
        <Link to="/">
          <h1>PST Bot Web</h1>
        </Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/bop">BoP</Link>
        <Link to="/cars">Cars</Link>
      </header>
      <div className="Layout-controls">
        <div></div>
        <div className="Layout-providers">
          {(["LFM", "combined", "AOR"] as const).map((d) => (
            <ToggleButton
              key={d}
              onClick={() => dispatch((s) => ({ ...s, dataset: d }))}
              selected={store.dataset === d}
            >
              {PROVIDERS[d as keyof typeof PROVIDERS]?.logo ? (
                <img
                  className="Layout-provider-logo"
                  src={PROVIDERS[d as keyof typeof PROVIDERS]?.logo}
                  alt={d.toUpperCase()}
                />
              ) : (
                d.toUpperCase()
              )}
            </ToggleButton>
          ))}
        </div>
        <div className="Layout-filter">
          <label>
            <input
              type="checkbox"
              defaultChecked={store.usablePatchOnly}
              onClick={(e) => {
                dispatch((s) => ({
                  ...s,
                  usablePatchOnly: (
                    e as any as React.ChangeEvent<HTMLInputElement>
                  ).target.checked,
                }));
              }}
            />
            <span>Only current bop versions</span>
          </label>
        </div>
      </div>
      <div className="Layout-children">{children}</div>
    </div>
  );
};
