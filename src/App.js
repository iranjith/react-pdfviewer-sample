import React, { useRef, useEffect } from "react";
import WebViewer from "@pdftron/webviewer";
import "./App.css";

const App = () => {
  const viewer = useRef(null);

  const handleAddAnnotation = () => {
    const { annotationManager, Annotations } = viewer.current.getInstance();
    const docViewer = viewer.current.getInstance().docViewer;

    docViewer.on("documentLoaded", () => {
      const textToSearch = "example text"; // replace with the text you want to search for

      const searchOptions = new Annotations.TextSearchOptions();
      searchOptions.setCaseSensitive(false); // set to true if you want case-sensitive search
      searchOptions.setWholeWord(false); // set to true if you want to match whole words only

      const searchResults = docViewer.searchText(textToSearch, searchOptions);

      if (searchResults.length > 0) {
        const firstResult = searchResults[0];
        const pageNumber = firstResult.pageNum;

        const rectangleAnnot = new Annotations.RectangleAnnotation({
          PageNumber: pageNumber,
          X: firstResult.quads[0].x1,
          Y: firstResult.quads[0].y1,
          Width: firstResult.quads[0].x3 - firstResult.quads[0].x1,
          Height: firstResult.quads[0].y3 - firstResult.quads[0].y1,
          Author: annotationManager.getCurrentUser(),
        });

        annotationManager.addAnnotation(rectangleAnnot);
        annotationManager.redrawAnnotation(rectangleAnnot);
      }
    });
  };

  useEffect(() => {
    if (viewer.current) {
      WebViewer(
        {
          path: "/webviewer/lib",
          initialDoc: "/files/PDFTRON_about.pdf",
          licenseKey: "your_license_key",
        },
        viewer.current
      ).then((instance) => {
        viewer.current = instance;

        const { annotationManager } = instance.Core;

        // Add your code here to handle the annotation event
        annotationManager.addEventListener("annotationChanged", (annotations, action) => {
          console.log("Annotation changed:", annotations, action);
        });
      });
    }
  }, []);

  return (
    <div className="App">
      <div className="header">React sample</div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
