/**
 * @name ReplyReminder
 * @description Allows you to see the members of each role on a server.
 * @version 0.0.1
 * @author Mark123
 * @authorId 249746236008169473
 * @website https://github.com/Mark123M/unghost
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/
const config = {
    info: {
        name: "ReplyReminder",
        authors: [
            {
                name: "Mark123",
                github_username: "Mark123",
            }
        ],
        version: "0.0.1",
        description: "Notifies you if you have ghosted someone.",
        github: "https://github.com/Mark123M/ReplyReminder",
    },
    defaultConfig: [
      {
          type: "switch",
          id: "showAutoReminders",
          name: "Show auto reminders",
          note: "Turning this on would show auto reminders",
          value: true
      },
      {
          type: "textbox",
          id: "reminderInterval",
          name: "Auto reminder interval",
          note: "Enter a positive integer to set the time interval (in minutes) between each auto reminder. Any other input will reset the interval to 20 min",
          value: 20
      } 
    ],
    changelog: [
      {
          title: "Deployment",
          type: "fixed",
          items: [
          "It works?",      
          ]
        }
    ],
    main: "index.js"
  };


  
  module.exports = !global.ZeresPluginLibrary ?
  class {
    constructor() {
        this._config = config;
        
    }
  
    load() {
        BdApi.showConfirmationModal('Library plugin is needed',
            `The library plugin needed for AQWERT'sPluginBuilder is missing. Please click Download Now to install it.`, {
            confirmText: 'Download',
            cancelText: 'Cancel',
            onConfirm: () => {
                request.get('https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js', (error, response, body) => {
                    if (error)
                        return electron.shell.openExternal('https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js');
  
                    fs.writeFileSync(path.join(BdApi.Plugins.folder, '0PluginLibrary.plugin.js'), body);
                });
            }
        });
    }
  
    start() { }
  
    stop() { }
  }
   : (([Plugin, Api]) => {
     const plugin = (Plugin, Api) => {
    const {DOM, Patcher, Webpack, UI, Utils, ContextMenu} = window.BdApi;
    const {DiscordModules, DiscordSelectors, Utilities, Popouts, Modals, DCM, WebpackModules} = Api;
  
    const from = arr => arr && arr.length > 0 && Object.assign(...arr.map(([k, v]) => ({[k]: v})));
    const filter = (obj, predicate) => from(Object.entries(obj).filter((o) => {return predicate(o[1]);}));
  
    const UserStore = DiscordModules.UserStore;
    const ImageResolver = DiscordModules.ImageResolver;
  
    const RelationshipStore = DiscordModules.RelationshipStore;
    const MessageStore = DiscordModules.MessageStore;
    const MessageActions = DiscordModules.MessageActions;
    const ChannelStore = DiscordModules.ChannelStore;
    const SelectedChannelStore = DiscordModules.SelectedChannelStore;
  
    const allDMChannels = RelationshipStore.getFriendIDs().map(id => ChannelStore.getDMFromUserId(id))
  
    let allGhosted = [];
    let allReminders = [];
    let autoReminderModal = null
    let manualReminderModal = null
   

   // const messageBox = document.querySelector("div.chat-2ZfjoI")
    let messageBox = null;
    let messageSelector = null
    let messageObserver = null
    //BRUH IT DOES WORK IT JUST DOESNT HAVE A E.TARGET.VALUE FIELD

    return class RoleMembers extends Plugin {
  
        onStart() {
            this.patchMessageContextMenu();

            messageBox = document.querySelector('[aria-label^="Messages in"]')
            console.log(messageBox, 'starting message box')
            messageBox?.addEventListener('contextmenu', this.updateMessageSelector);

            console.log(parseInt(this.settings.reminderInterval))

            allGhosted = BdApi.loadData('ReplyReminder', 'ghosted') === undefined ? [] : BdApi.loadData('ReplyReminder', 'ghosted');  //load all ghosted messages
            allReminders = BdApi.loadData('ReplyReminder', 'reminders') === undefined? [] : BdApi.loadData('ReplyReminder', 'reminders'); //load all reminders

            this.showAutoReminderModal(allGhosted) //display auto reminder on startup

            autoReminderModal = setInterval(()=>{
              console.log(allGhosted)
             // console.log(parseInt(this.settings.reminderInterval))

              this.showAutoReminderModal(allGhosted)
  
            }, Number.isInteger(parseInt(this.settings.reminderInterval)) && parseInt(this.settings.reminderInterval) > 0
            ? parseInt(this.settings.reminderInterval)*60000 : 60000)
        }

        updateMessageSelector(event){ 
            messageSelector = event.target
        }
        
        createAutoReminderModal(list){
            const autoReminderModalHTML = BdApi.DOM.parseHTML
            ( `<div class = "reminderList" style = "color: #b9bbbe; font-family: Whitney,Helvetica Neue,Helvetica,Arial,sans-serif;">
            ${list.map(g =>
                `<div class = "reminderListItem" style = "display: flex; align-items: center; margin-top: 10px; margin-left: 5px;"> 
                    <img src = ${g[3]} style = "border-radius: 50%; height: 60px; width: 60px "> 
                    <span style= "margin-left: 12px;" > 
                        <div class = "listItemInfo">
                            <div class = "listItemUser" style = "font-weight: 700; color: #f8f8f9;"> 
                              ${g[1] + " #" + g[2]} 
                            </div>
                            <div class = "listItemMsg" style = "margin-top: 5px;"> ${g[4]}</div>
                        </div>
                    </span>
                </div>`
            ).join("")}
            </div>`)

            const autoReminderModalElement = BdApi.React.createElement(BdApi.ReactUtils.wrapElement(autoReminderModalHTML))
            BdApi.UI.alert("Auto-Reminders", autoReminderModalElement)
        }

        showAutoReminderModal(list){
            const autoReminderModalHTML = BdApi.DOM.parseHTML
            (`<div class = "reminderList">
                ${list.map(g=>
                    `<div class = "reminderListItem" style = "margin-top: 15px; display: flex;">
                        ${g[1].includes('<img')? `${g[1]}` : 
                        `<div class=\"message-2CShn3 cozyMessage-1DWF9U groupStart-3Mlgv1 wrapper-30-Nkg cozy-VmLDNB zalgo-26OfGz\" role=\"article\" data-list-item-id=\"chat-messages___chat-messages-1057098653963141170\" tabindex=\"-1\" aria-setsize=\"-1\" aria-roledescription=\"Message\" aria-labelledby=\"message-username-1057098653963141170 uid_1 message-content-1057098653963141170 uid_2 message-timestamp-1057098653963141170\"><div class=\"contents-2MsGLg\"><img src=\"${g[2]}\" aria-hidden=\"true\" class=\"avatar-2e8lTP clickable-31pE3P\" alt=\" \"><h3 class=\"header-2jRmjb\" aria-labelledby=\"message-username-1057098653963141170 message-timestamp-1057098653963141170\"><span id=\"message-username-1057098653963141170\" class=\"headerText-2z4IhQ\"><span class=\"username-h_Y3Us desaturateUserColors-1O-G89 clickable-31pE3P\" aria-expanded=\"false\" role=\"button\" tabindex=\"0\">${g[3].author.username}</span></span><span class=\"timestamp-p1Df1m timestampInline-_lS3aK\"><time aria-label=\"Today at 7:52 PM\" id=\"message-timestamp-1057098653963141170\" datetime=\"2022-12-27T00:52:39.048Z\"><i class=\"separator-AebOhG\" aria-hidden=\"true\"> — </i> —— </time></span></h3><div id=\"message-content-1057098653963141170\" class=\"markup-eYLPri messageContent-2t3eCI\">${g[3].content}</div></div><div id=\"message-accessories-1057098653963141170\" class=\"container-2sjPya\"></div></div>
                        ` 
                        /* if the message does not contain a pfp, add it */} 
                        
                    </div>`)
                .join("")}
              </div>`)
           
            const autoReminderModalElement = BdApi.React.createElement(BdApi.ReactUtils.wrapElement(autoReminderModalHTML))
            BdApi.UI.alert("Auto-Reminders", autoReminderModalElement)
        } 


        patchMessageContextMenu() {
            this.contextMenuPatch = ContextMenu.patch("message", (retVal, props) => {
                retVal.props.children.push(
                    ContextMenu.buildItem({type: "separator"}),
                    ContextMenu.buildItem({label: "Remind me!", action: () => {
                        //retrieve the entire message data by getting the closest ancestor of type li
                        const newMessage = messageSelector.closest('li')
                    //    const newMessage = messageSelector.id.startsWith('message-content') ? messageSelector.parentNode.parentNode : messageSelector.parentNode.parentNode.parentNode.parentNode
                        console.log(newMessage)

                        BdApi.showToast("Reminder Created", {type: "success"});
                        BdApi.UI.alert("Create a Reminder", BdApi.React.createElement(BdApi.ReactUtils.wrapElement(newMessage.children[0].cloneNode(true))))
                    }})
                ); 
               // console.log(retVal)
            });
        }

        updateAutoReminders(lastMsg){
           // console.log(lastMsg.innerText.split(/\r?\n/)[0], 'username, preprocessed')
           //if the last message text does not include [, then just take the name of the previous post, otherwise, take the current name
            const curChannelId = BdApi.Webpack.getModule(m => m.getLastSelectedChannelId && m.getChannelId).getChannelId()
            const currentUserId = UserStore.getCurrentUser()
            const messages = MessageStore.getMessages(curChannelId)._array
            console.log(messages)
            const lastUserId = messages[messages.length-1].author.id
            console.log(currentUserId, lastUserId);
          //  console.log(currentUser)

            if(currentUserId !== lastUserId) { //if the current user did not sent the last message
                console.log(messages[messages.length-1], 'last message from api')
                allGhosted = allGhosted.filter(g => g[0] !== lastUserId)
                allGhosted.push([lastUserId, lastMsg.cloneNode(true).innerHTML, ImageResolver.getUserAvatarURL(messages[messages.length-1].author) , messages[messages.length-1],  `${lastMsg.baseURI}/${lastMsg.id.replace('chat-messages-','')}` ] )
                BdApi.saveData('ReplyReminder', 'ghosted', allGhosted)
                console.log(ImageResolver.getUserAvatarURL(messages[messages.length-1].author))
            }
            else {
                allGhosted = allGhosted.filter(g => g[0] !== ChannelStore.getChannel(curChannelId).recipients[0]) 
                BdApi.saveData('ReplyReminder', 'ghosted', allGhosted)  
            }
        }

        onSwitch(){
            console.log(allGhosted, 'ALL GHOSTED')
           // console.log('FIRST MESSAGES API RETURN', MessageStore.getMessages(BdApi.Webpack.getModule(m => m.getLastSelectedChannelId && m.getChannelId).getChannelId()))
            //reset event listeners and mutation observers 
            messageBox?.removeEventListener('contextmenu', this.updateMessageSelector)
            messageObserver?.disconnect()

            messageBox = document.querySelector('[aria-label^="Messages in"]')
            console.log(messageBox, 'new message box')
            messageBox?.addEventListener('contextmenu', this.updateMessageSelector);

             // const lastChannelId = SelectedChannelStore.getLastSelectedChannelId()
            const curChannelId = BdApi.Webpack.getModule(m => m.getLastSelectedChannelId && m.getChannelId).getChannelId()
            console.log(messageBox.children, 'current channel')
            console.log(ChannelStore.getChannel(curChannelId), 'current channel api ')
            //console.log(messageBox.children.length, 'current channel array length')
 
            //if the current channel is a dm and if the last message is a message, update auto reminders
            if(ChannelStore.getChannel(curChannelId).name === ""){
                const lastMsg = messageBox.children[messageBox.children.length - 2]
                //const currentUser = UserStore.getCurrentUser()
                if(lastMsg.id.startsWith('chat-messages')){
                    this.updateAutoReminders(lastMsg)
                }
            }

            //when the messageBox dom changes, and a new message is added, update auto reminders
            messageObserver = new MutationObserver((mutations)=>{
                mutations.forEach((mutation)=>{ 
                    if(mutation.addedNodes.length>0){
                        if(mutation.addedNodes[0].id.startsWith('chat-messages')){
                            this.updateAutoReminders(mutation.addedNodes[0])
                        }
                    }
                })
            })
            messageObserver.observe(messageBox, {
                attributes: false, 
                childList: true, 
                subtree: true
            })
            
        }


        onStop() {
            BdApi.saveData('ReplyReminder', 'ghosted', allGhosted)
            clearInterval(autoReminderModal)
            this.contextMenuPatch?.();
            messageObserver.disconnect()
        }
        

        getSettingsPanel(){
          return this.buildSettingsPanel().getElement();
        }
  
    };
  };
     return plugin(Plugin, Api);
  })(global.ZeresPluginLibrary.buildPlugin(config));
  /*@end@*/