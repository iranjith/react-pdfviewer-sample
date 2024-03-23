import React, { useRef, useEffect } from "react";
import WebViewer from "@pdftron/webviewer";
import "./App.css";

const App = () => {
  const viewer = useRef(null);

  var dummyData = [
    {
      searchText:
        "Additionally, custom features will have to be supported and maintained long-term, creating an additional ongoing opportunity cost: commit-ted resources will be less-available to work on other projects.",
    },
    {
      searchText:
        "Another mistake is where organizations select a basic library to save money with the assumption that they can build anything needed on top.",
    },
  ];

  useEffect(() => {
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
        searchResult: new Annotations.Color(0, 0, 255, 0.5),
        activeSearchResult: "rgba(0, 255, 0, 0.5)",
      });

      documentViewer.addEventListener("documentLoaded", () => {
        console.log("document loaded");
        //const textToSearch = `Another mistake is where organizations select a basic library to save money with the assumption that they can build anything needed on top.`; // replace with the text you want to search for

        dummyData.forEach((data) => {
          const textToSearch = data.searchText;
          console.log("searching for text: ", textToSearch);
          const modeOptions = Search.Mode.PAGE_STOP | Search.Mode.HIGHLIGHT;
          
          const searchOptions = {
            fullSearch: true,
            onResult: async (searchResults) =>
              await annotateSearchResult(searchResults),
            startPage: 1,
            endPage: 9,
          };

          documentViewer
            .textSearchInit(textToSearch, modeOptions, searchOptions)
            .then(async () => {
              await console.log("search initialized");
            });

          const annotateSearchResult = (searchResults) => {
            console.log("annotate search result: ", searchResults)
            if (searchResults.resultCode === Search.ResultCode.FOUND) {
              const quadsArray = searchResults.quads;
              const firstResult = searchResults;
              const pageNumber = firstResult.pageNum;

              for (let i = 0; i < quadsArray.length; i++) {
                const quadElement = quadsArray[i];
                const textQuad = quadElement.getPoints();

                const rectangleAnnot = new Annotations.RectangleAnnotation({
                  PageNumber: pageNumber,
                  X: textQuad.x1,
                  Y: textQuad.y1,
                  Width: textQuad.x3 - textQuad.x1,
                  Height: textQuad.y3 - textQuad.y1,
                  StrokeColor: new Annotations.Color(0, 255, 0, 1), // green
                  StrokeThickness: 2,
                  Dashes: [3, 2],
                });

                annotationManager.addAnnotation(rectangleAnnot);
                annotationManager.redrawAnnotation(rectangleAnnot);
              }
            }
          };
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
