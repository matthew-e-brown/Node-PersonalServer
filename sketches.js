function reverseSketchList() {
  // I Tried doing this asynchronously. Gave up.
  // Gist: https://goo.gl/sWFM6K
  const delay = 250;//ms
  const sketchList = $("#sketchList");
  const sort1 = $("#sort1");
  const sort2 = $("#sort2");

  [sort1, sort2, sketchList].forEach(e => e.animate({'opacity': 0}, delay));
  setTimeout(() => {
    // Reverse the sketchlist
    const sketches = sketchList.children("div");
    sketchList.append(sketches.get().reverse());

    // Swap the text
    let temp = sort1.html();
    sort1.html(sort2.html());
    sort2.html(temp);

    // Make things visible again
    [sort1, sort2, sketchList].forEach(e => e.animate({'opacity': 1}, delay));
  }, delay);
}

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
    const sketches = document.getElementById("sketches");
    if (!/bottom-spacer/.test(sketches.className)) sketches.className += " bottom-spacer";

    setTimeout(() => holder.scrollIntoView({
      block: 'end',
      behavior: 'smooth'
    }), 100);
  });

  frame.setAttribute("src", path);
}

function setPreview(pathToFolder) {
  $.ajax({
    url: "/getSourceCode",
    method: "GET",
    data: {
      containingFolder: pathToFolder
    },
    success: response => {
      const data = JSON.parse(response);

      //Create tabs & Codeblocks
      $("#tabs").empty(); //Remove the old ones
      $("#codeblocks").empty();
      for (const [i, file] of data.entries()) {
        const tabbutton = `<button id="${i}-src-tab" onclick="tab(event)" class="${file.mainFile ? "tab" : "tab inactive"}">${file.name}</button>`;
        const codeblock = `<pre id="${i}-src-pre" class="code-block line-numbers language-${file.extn == "js" ? "javascript" : file.extn}" style="display: ${file.mainFile ? "block" : "none"}"><code id="${i}-src-code">${file.body}</code></pre>`

        if (!file.mainFile) {
          $("#tabs").append(tabbutton);
          $("#codeblocks").append(codeblock);
        } else if (file.mainFile) {
          $("#tabs").prepend(tabbutton);
          $("#codeblocks").prepend(codeblock);
        }
      }
    } // End of success
  }) // End of Ajax call
  .then(() => Prism.highlightAll())
  .then(() => {
    const element = /*$(`#source`)[0]*/document.getElementById("source");
    element.className = element.className.replace(/hidden/, `shown`);
    const sketches = document.getElementById("sketches");
    if (!/bottom-spacer/.test(sketches.className)) sketches.className += " bottom-spacer";
    const preview = document.getElementById("preview");
    if (!/bottom-spacer/.test(preview.className)) preview.className += " bottom-spacer";

    setTimeout(element.scrollIntoView({block: "end", behavior: "smooth"}), 100);
  });
}

function tab(event) {
  // Use the first character in the id of the clicked tab-button to set the right codeblock
  const t = event.srcElement.id.charAt(0);

  // Hide all the codeblocks
  document.querySelectorAll("#codeblocks > pre").forEach((element) => {
    element.style.display = "none";
  });

  $(`#${t}-src-pre`).css("display", "block");

  document.querySelectorAll("#tabs > button").forEach((element) => {
    const i = element.id.charAt(0);
    element.className = (i == t) ? "tab" : "tab inactive";
  });
}
