function setFrame(path) {
  const frame = document.getElementById("sketchDisplay");
  const holder = document.getElementById("preview");
  frame.addEventListener("load", () => {
    const innerDocument = frame.contentDocument || frame.contentWindow.document;

    const dimensions = {
      "width": innerDocument.getElementById("defaultCanvas0").style.width.replace(/px/, ''),
      "height": innerDocument.getElementById("defaultCanvas0").style.height.replace(/px/, '')
    };

    for (const [key, value] of Object.entries(dimensions)) {
      frame.setAttribute(key, (value * 1.085) + "px");
    }

    holder.className = holder.className.replace(/\bpreview-hidden\b/, "preview-shown");

    setTimeout(() => holder.scrollIntoView({
      block: 'end',
      behavior: 'smooth'
    }), 100);
  });

  frame.setAttribute("src", path);
}

function selectFile(dir, tabIndex) {
  let extension = "";
  $.ajax({
    url: "getsources.php",
    method: "GET",
    data: {
      directory: dir,
      fileNumber: tabIndex
    },
    success: response => {
      console.log("RESPONSE OK");
      /* Data is in the form:
      response = {
        body: 'contents of the file',
        extension: 'html',
        fileNames: ['sketch.js', 'asteroid.js', 'object.js']
      }
      */
      let data = JSON.parse(response);
      extension = data.extension;

      //Create all the tabs:
      $("#tabs").empty();
      for (const [i, fileName] of data.fileNames.entries()) {
        $("#tabs").append(
          `<button onclick="selectFile('${dir}', ${i})" class="${(i == tabIndex) ? "tab" : "tab inactive"}">${fileName}</button>`
        );
      }

      //Set the contents of the code block:
      if (data.extension == "html") {
        data.body = data.body.replace(/\</g, "&lt").replace(/\>/g, "&gt");
      }
      $("#src-code").html(data.body);
    }
  })
  .then(() => {
    //Then add the correct class for the language:
    let cls = (extension == "js") ? "javascript" : extension;
    $("#src-code").attr("class", "language-" + cls);
  })
  .then(() => Prism.highlightElement($("#src-code")[0]))
  .then(() => {
    let elt = $("#source")[0];
    elt.className = elt.className.replace(/sourcecode-hidden/, "sourcecode-shown");

    setTimeout(() => elt.scrollIntoView({
      block: 'end',
      behavior: 'smooth'
    }), 100);
  });
}
