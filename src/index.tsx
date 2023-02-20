import { ActionPanel, Detail, List, Action } from "@raycast/api";
import axios from "axios";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import axiosRetry from "axios-retry";
import { getPreferenceValues } from "@raycast/api";
axiosRetry(axios, { retries: 3 });
// axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay });

const PING_URL = "https://api1.tabdeal.org/r/api/v1/ping";
const ASSETS_URL = "https://api1.tabdeal.org/r/api/v1/asset/get-funding-asset";
const GET_TRADES_URL = "https://api1.tabdeal.org/r/api/v1/trades";
const GET_ORDERS_URL = "https://api1.tabdeal.org/r/api/v1/depth";
console.log("Start...");

interface Asset {
  asset: string;
  free: string;
  freeze: string;
}

interface Preferences {
  api_key: string;
  api_secret: string;
}

export default function Command() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [preferences, setPreferences] = useState<Preferences>(getPreferenceValues);
  useEffect(() => {
    console.log(preferences);
  }, [preferences]);

  useEffect(() => {
    const data = `timestamp=${Date.now()}`;
    const signature = CryptoJS.HmacSHA256(data, preferences.api_secret);
    axios
      .get(ASSETS_URL, {
        headers: { "X-MBX-APIKEY": preferences.api_key },
        params: { timestamp: Date.now(), signature },
      })
      .then((res) => {
        setAssets(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);

  return (
    <List>
      {assets
        .filter((a) => Number(a.free) > 0)
        .map((asset) => (
          <List.Item title={asset.asset} subtitle={asset.free} key={asset.asset} />
        ))}
      {/* <List.Item title={"wallet"} detail={<p>Hello</p>} /> */}
    </List>
  );
}
