import {
  DrawingManager,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { Libraries } from "@react-google-maps/api/dist/utils/make-load-script-url";
import {
  DataExtractionConfigForm,
  DataExtractionInput,
} from "./components/config-form";
import Drawer from "@mui/material/Drawer";
import { api } from "../../api";
import { serializeRequestToForm } from "../../utils/request";
import { mapConfigToRequest } from "./utils";
const center = {
  lat: -3.745,
  lng: -38.523,
};
const styles = { width: "100%", height: 700 };
const libraries: Libraries = ["drawing", "geometry"];
const polygons: any[] = [];
export const DataExtractionPage = () => {
  const [message, setMessage] = useState("");
  useEffect(() => {}, []);

  return (
    <div>
      <Drawer sx={{ width: 200 }} variant="permanent" anchor="left">
        <DataExtractionConfigForm
          onSend={(config) => {
            const form = new FormData();
            serializeRequestToForm(
              mapConfigToRequest(config as DataExtractionInput),
              form
            );
            api.eeData
              .postApiEeDataExtract(form, { responseType: "stream" })
              .then((res) => {
                const source = new EventSource(
                  `http://localhost:1337/api/ee-data/loading?timestamp=${res.data}`
                );
                source.onmessage = (ev) => {
                  console.log(ev);
                  setMessage(ev.data);
                };

                source.addEventListener(
                  "error",
                  function (e) {
                    console.log(e);
                    source.close();
                  },
                  false
                );

                console.log(res.data, "RESULTS");

                // res.data.on("data", (data: string) => setMessage(data));
              });
          }}
        />
      </Drawer>

      <LoadScript
        libraries={libraries}
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_KEY || ""}
      >
        <GoogleMap center={center} zoom={10} mapContainerStyle={styles}>
          <DrawingManager //@ts-ignore
            onPolygonComplete={(polly) => console.log(polly)}
            onRectangleComplete={(rect) => {
              rect.setEditable(true);
              polygons.push(rect);
            }}
          />

          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
      <Drawer variant="permanent" anchor="right">
        <div style={{ width: 200 }}>{message}</div>
      </Drawer>
    </div>
  );
};
