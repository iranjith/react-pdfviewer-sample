import React, { useRef, useEffect } from "react";
import WebViewer from "@pdftron/webviewer";
import "./App.css";

const App = () => {
  const viewer = useRef(null);

  useEffect(() => {
    // If you prefer to use the Iframe implementation, you can replace this line with: WebViewer.Iframe(...)
    WebViewer.WebComponent(
      {
        path: "/webviewer/lib",
        initialDoc: "/files/PDFTRON_about.pdf",
        licenseKey: "your_license_key",
      },
      viewer.current
    ).then((instance) => {
      const { documentViewer, Annotations, annotationManager, Search } =
        instance.Core;

      documentViewer.setSearchHighlightColors({
        // setSearchHighlightColors accepts both Annotations.Color objects or 'rgba' strings
        searchResult: new Annotations.Color(0, 0, 255, 0.5),
        activeSearchResult: "rgba(0, 255, 0, 0.5)",
      });

      documentViewer.addEventListener("documentLoaded", () => {
        console.log("document loaded");
        const textToSearch = `Another mistake is where organizations select a basic library to save money with the assumption that they can build anything needed on top.`; // replace with the text you want to search for
        const modeOptions = Search.Mode.PAGE_STOP | Search.Mode.HIGHLIGHT;

        console.log("searching for text", textToSearch);

        const searchOptions = {
          fullSearch: true,
          onResult: (searchResults) => {
            console.log("on result", searchResults);

            if (searchResults.resultCode === Search.ResultCode.FOUND) {
              const textQuad = searchResults.quads[0].getPoints(); // getPoints will return Quad objects
              // now that we have the result Quads, it's possible to highlight text or create annotations on top of the text
              const firstResult = searchResults;
              const pageNumber = firstResult.pageNum;

              const rectangleAnnot = new Annotations.RectangleAnnotation({
                PageNumber: pageNumber,
                X: textQuad.x1,
                Y: textQuad.y1,
                Width: textQuad.x3 - textQuad.x1,
                Height: textQuad.y3 - textQuad.y1,
              });

              annotationManager.addAnnotation(rectangleAnnot);
              annotationManager.redrawAnnotation(rectangleAnnot);
            }
          },
          startPage: 1,
          endPage: 9,
        };

        documentViewer
          .textSearchInit(textToSearch, modeOptions, searchOptions)
          .then(() => {
            console.log("search initialized");
          });
      });
    });
  }, []);

  return (
    <div className="App">
      <div className="header">React sample</div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
