/**
 * @name Unghost
 * @author Mark123
 * @description Describe the basic functions. Maybe a support server link.
 * @version 0.0.1
 */

module.exports = class Unghost {
  start() {
    // Called when the plugin is activated (including after reloads)
    BdApi.alert("Hello World!", "This is my first plugin!")
    console.log("dufhudhfudhfudhfud peni penis")
   
    const myButton = document.createElement("button");
    myButton.textContent = "Click me!";
    myButton.addEventListener("click", () => {console.dir(ZLibrary)});
    //const root = document.getElementById("app-mount");
    //root.append(myButton);
    
    const chatBox = document.querySelector("div.chat-2ZfjoI")
    chatBox.append(myButton)
    
    // This part re-adds it when removed
    BdApi.onRemoved(myButton, () => {
        serverList.append(myButton);
    });
    
  } 

  stop() {
    // Called when the plugin is deactivated
  }
}